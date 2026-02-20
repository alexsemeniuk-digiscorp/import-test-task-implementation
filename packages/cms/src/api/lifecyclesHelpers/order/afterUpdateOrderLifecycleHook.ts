import { handleLogger } from '../../../graphql/helpers/errors';
import { generateBillWithAccountingService } from '../accountingServices/generateBillWithAccountingService';
import { generateInvoiceWithAccountingService } from '../accountingServices/generateInvoiceWithAccountingService';
import { addContactOrCompanyToSalesItemReport } from '../reports/addContactOrCompanyToSalesItemReport';
import { updateZapierOrder } from '../reports/updateZapierOrder';
import { completeTasksOnReadyStatus } from '../task/completeTasksOnReadyStatus';
import { notifyCustomerOnReadyOrShipped } from './notifyCustomerOnReadyOrShipped';
import AfterLifecycleEvent = Database.AfterLifecycleEvent;

export const afterUpdateOrderLifecycleHook: AfterLifecycleEvent = async (
  event,
) => {
  // Skip after update order during bulk imports for performance
  if (event?.params?.data?._skipAfterUpdateOrder) {
    delete event?.params?.data?._skipAfterUpdateOrder;
    return;
  }

  handleLogger(
    'info',
    'ORDER afterUpdateLifecycleHook',
    `Params :: ${JSON.stringify(event?.params)}`,
  );

  const orderId = event?.result?.id;

  const currentOrder = await strapi.entityService.findOne(
    'api::order.order',
    orderId,
    {
      fields: ['id', 'status', 'type', 'orderId'],
      populate: {
        contact: {
          fields: ['id', 'fullName', 'email', 'phoneNumber'],
        },
        company: {
          fields: ['id', 'name', 'email', 'phoneNumber'],
        },
        sales: {
          fields: ['id'],
        },
        tasks: {
          fields: ['id', 'completed'],
        },
        tenant: {
          fields: ['id'],
        },
      },
    },
  );

  await completeTasksOnReadyStatus(currentOrder);

  const previousStatus = event?.state?.previousStatus;
  await notifyCustomerOnReadyOrShipped(currentOrder, previousStatus);

  await generateInvoiceWithAccountingService({ ...event });
  await generateBillWithAccountingService({ ...event });

  await addContactOrCompanyToSalesItemReport(event, currentOrder);
  await updateZapierOrder({ ...event, result: currentOrder });
};
