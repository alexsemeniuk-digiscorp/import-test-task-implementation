import { handleLogger } from './../../../graphql/helpers/errors';

export const updateProductOrderItemPriceBasedOnCustomerPriceGroup = async (
  event,
  currentOrder,
) => {
  handleLogger(
    'info',
    'Order BeforeUpdate updateProductOrderItemPriceBasedOnCustomerPriceGroup',
    `Params:${JSON.stringify(event.params)}`,
  );

  const productItemReceiveEventService = strapi.service(
    'api::product-inventory-item-event.product-inventory-item-event',
  );

  const contactId = Number(event?.params?.data?.contact);
  const companyId = Number(event?.params?.data?.company);

  const contactInOrder = currentOrder?.contact?.id;
  const companyInOrder = currentOrder?.company?.id;

  if (contactId || companyId) {
    if (contactId === contactInOrder || companyId === companyInOrder) return;

    for (const productOrderItem of currentOrder.products) {
      const productInventoryItemId = productOrderItem.product.id;

      const productInventoryItemElement = await strapi.entityService.findOne(
        'api::product-inventory-item.product-inventory-item',
        productInventoryItemId,
        {
          fields: ['id', 'price'],
          populate: {
            product: {
              fields: ['id', 'multiplier', 'wholeSaleMultiplier'],
            },
          },
        },
      );

      const productItemReceiveEvents =
        await productItemReceiveEventService.findManyReceived({
          productInventoryId: productInventoryItemElement.id,
        });

      const multiplier = productInventoryItemElement?.product?.multiplier || 0;
      const wholesaleMultiplier =
        productInventoryItemElement?.product?.wholeSaleMultiplier || 0;

      const multiplierCost =
        Number(multiplier) * Number(productItemReceiveEvents[0]?.itemCost);
      const wholesaleMultiplierCost =
        Number(wholesaleMultiplier) *
        Number(productItemReceiveEvents[0]?.itemCost);

      if (
        !productInventoryItemElement.price &&
        (multiplierCost || wholesaleMultiplierCost)
      ) {
        if (contactId) {
          const contactData = await strapi.entityService.findOne(
            'api::contact.contact',
            contactId,
            {
              fields: ['id', 'priceGroup'],
            },
          );

          const priceGroup = contactData?.priceGroup ?? 'rental';

          const price =
            priceGroup === 'rental' ? multiplierCost : wholesaleMultiplierCost;

          await strapi.entityService.update(
            'api::product-order-item.product-order-item',
            productOrderItem.id,
            {
              data: { price },
            },
          );
        }

        if (companyId) {
          const companyData = await strapi.entityService.findOne(
            'api::company.company',
            companyId,
            {
              fields: ['id', 'priceGroup'],
            },
          );

          const priceGroup = companyData?.priceGroup ?? 'rental';

          const price =
            priceGroup === 'rental' ? multiplierCost : wholesaleMultiplierCost;

          await strapi.entityService.update(
            'api::product-order-item.product-order-item',
            productOrderItem.id,
            {
              data: { price },
            },
          );
        }
      }
    }
  }
};
