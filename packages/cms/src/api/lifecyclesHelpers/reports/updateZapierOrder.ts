import axios from 'axios';
import { handleError } from '../../../graphql/helpers/errors';
import { LifecycleHook } from '../types';
import AfterLifecycleEvent = Database.AfterLifecycleEvent;

export const updateZapierOrder: LifecycleHook = async ({
  result,
}: AfterLifecycleEvent) => {
  const orderId = result?.id;
  const currentOrder = await strapi.entityService.findOne(
    'api::order.order',
    orderId,
    {
      fields: [
        'orderId',
        'createdAt',
        'updatedAt',
        'status',
        'paymentMethod',
        'deliveryMethod',
        'total',
        'subTotal',
        'discount',
        'dueDate',
        'tax',
        'tip',
        'memo',
        'recurringAmount',
        'recurringPeriod',
        'points',
        'pointsGiven',
        'recurringPeriodCount',
        'customerShippingInfo',
        'shipment',
        'rentDueDate',
        'customCreationDate',
        'isWarranty',
        'ecommerceType',
        'inputInvoiceNum',
        'isShowInvoiceNote',
        'lastPayment',
        'ecommerceOrderId',
        'orderVersion',
        'expiryDate',
        'note',
        'type',
      ],
      populate: [
        'services.service.serviceLocationInfo.service',
        'products.product.product.brand',
        'products.product.product.productType',
        'products.product.product.metalType',
        'products.product.product.materialGradeType',
        'products.product.product.engravingType',
        'products.product.product.size',
        'products.product.product.productAttributeOptions.productAttribute',
        'contact',
        'company',
        'classes.class.classLocationInfo.class',
        'memberships.membership',
        'files',
        'compositeProducts',
        'tenant',
      ],
    },
  );
  const zapierLinks = await strapi.entityService.findMany(
    'api::zapier-webhook.zapier-webhook',
    {
      filters: {
        tenant: {
          id: {
            $eq: currentOrder?.tenant?.id,
          },
        },
        type: {
          $eq: 'order',
        },
      },
    },
  );
  if (zapierLinks?.length > 0) {
    if (!zapierLinks[0].webhook) {
      return;
    } else {
      try {
        await axios.post(zapierLinks[0].webhook, currentOrder);
      } catch (error) {
        handleError(
          'ORDER updateZapierOrder',
          'Error sending order to Zapier',
          error,
        );
      }
    }
  } else {
    return;
  }
};
