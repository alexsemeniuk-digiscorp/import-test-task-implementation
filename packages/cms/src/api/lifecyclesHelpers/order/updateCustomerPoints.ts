import { roundPoints } from '../../../utils/points';
import { handleLogger } from './../../../graphql/helpers/errors';

export const updateCustomerPoints = async (event, currentOrder) => {
  handleLogger(
    'info',
    'Order BeforeUpdate updateCustomerPoints',
    `Params:${JSON.stringify(event.params)}`,
  );

  const contactId = Number(event?.params?.data?.contact);
  const companyId = Number(event?.params?.data?.company);

  const contactInOrder = currentOrder?.contact?.id;
  const companyInOrder = currentOrder?.company?.id;

  const hasContactOrCompany = contactId || companyId;
  const hasContactOrCompanyInOrder = contactInOrder || companyInOrder;

  if (
    hasContactOrCompany === 0 &&
    hasContactOrCompanyInOrder &&
    currentOrder?.points
  ) {
    if (contactInOrder) {
      await strapi.entityService.update(
        'api::contact.contact',
        contactInOrder,
        {
          data: {
            points: roundPoints(
              Number(currentOrder.contact.points + currentOrder.points),
            ),
          },
        },
      );
    }
    if (companyInOrder) {
      await strapi.entityService.update(
        'api::company.company',
        companyInOrder,
        {
          data: {
            points: roundPoints(
              Number(currentOrder.company.points + currentOrder.points),
            ),
          },
        },
      );
    }
  }
};
