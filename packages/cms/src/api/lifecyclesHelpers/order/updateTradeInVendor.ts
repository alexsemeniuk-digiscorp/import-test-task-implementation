import { NexusGenEnums } from '../../../types/generated/graphql';
import { handleLogger } from './../../../graphql/helpers/errors';

export const updateTradeInVendor = async (event, currentOrder) => {
  handleLogger(
    'info',
    'Order BeforeUpdate updateTradeInVendor',
    `Params:${JSON.stringify(event.params)}`,
  );

  const contactId = Number(event?.params?.data?.contact);
  const companyId = Number(event?.params?.data?.company);

  const hasContactOrCompany = contactId || companyId;

  if (hasContactOrCompany && currentOrder.type === 'tradeIn') {
    for (const productOrderItem of currentOrder.products) {
      const productInventoryItemId = productOrderItem.product.id;

      const currentProductInventoryItemEvent =
        await strapi.entityService.findMany(
          'api::product-inventory-item-event.product-inventory-item-event',
          {
            filters: {
              productInventoryItem: {
                id: { $eq: productInventoryItemId },
              },
              order: {
                id: {
                  $eq: currentOrder?.id,
                },
              },
              eventType:
                'receive' as NexusGenEnums['ENUM_PRODUCTINVENTORYITEMEVENT_EVENTTYPE'],
            },
            fields: ['id'],
          },
        );

      if (currentProductInventoryItemEvent?.length > 0) {
        await strapi.entityService.update(
          'api::product-inventory-item-event.product-inventory-item-event',
          currentProductInventoryItemEvent[0]?.id,
          {
            data: {
              itemVendor: companyId || null,
              itemContactVendor: contactId || null,
            },
          },
        );
      }
    }
  }
};
