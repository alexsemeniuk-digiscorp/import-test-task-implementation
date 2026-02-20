import { GraphQLFieldResolver } from 'graphql';
import { UpdateCustomerOrderInput } from '../order.types';

type Ctx = {
  state: {
    user: { id: string };
  };
};

export const updateCustomerOrder: GraphQLFieldResolver<
  null,
  Ctx,
  { input: UpdateCustomerOrderInput }
> = async (root, { input }, ctx) => {
  const customerShippingInfo = JSON.parse(input.info);
  const userId = ctx.state.user.id;
  const user = await strapi.query('plugin::users-permissions.user').findOne({
    where: { id: userId },
    populate: ['lead', 'contact', 'tenant'],
  });
  const userLead = user?.lead;

  if (!user.contact) {
    const contacts = await strapi.entityService.findMany(
      'api::contact.contact',
      {
        filters: {
          email: userLead?.email,
        },
        fields: ['id'],
      },
    );

    if (!contacts.length) {
      const userContact = await strapi.entityService.create(
        'api::contact.contact',
        {
          data: {
            fullName: userLead?.fullName,
            email: userLead?.email ?? '',
            address:
              userLead?.address ?? customerShippingInfo?.streetName ?? '',
            phoneNumber:
              userLead?.phoneNumber ?? customerShippingInfo?.phoneNumber ?? '',
            tenant: user.tenant.id,
            leadSource: userLead?.leadSource,
            leadOwner: userLead?.leadOwner,
            activities: userLead?.activities,
            todos: userLead?.todos,
            notes: userLead?.notes,
            deals: userLead?.deals,
            fileItems: userLead?.fileItems,
          },
        },
      );

      await strapi.query('plugin::users-permissions.user').update({
        where: { id: userId },
        data: { contact: userContact.id },
      });

      user.contact = { ...userContact, id: userContact.id };
    } else {
      await strapi.query('plugin::users-permissions.user').update({
        where: { id: userId },
        data: { contact: contacts?.[0]?.id },
      });

      user.contact = { id: contacts?.[0]?.id };
    }
  }

  const order = await strapi.entityService.findOne(
    'api::order.order',
    input.orderId,
    {
      populate: [
        'products',
        'products.product',
        'compositeProducts',
        'compositeProducts.compositeProduct',
        'compositeProducts.compositeProduct.compositeProduct',
        'services',
        'memberships',
        'classes',
        'businessLocation',
        'contact',
        'company',
      ],
    },
  );

  const productInventoryEventService = strapi.service(
    'api::product-inventory-item-event.product-inventory-item-event',
  );

  if (order.products.length > 0) {
    await Promise.all(
      order.products.map(async (productOrderItem) => {
        await strapi.entityService.update(
          'api::product-order-item.product-order-item',
          productOrderItem.id,
          {
            data: {
              status: 'published',
            },
          },
        );

        const productInventoryItem = await strapi.entityService.findMany(
          'api::product-inventory-item.product-inventory-item',
          {
            filters: {
              uuid: {
                $eq: productOrderItem.product.uuid,
              },
              businessLocation: {
                id: {
                  $eq: order.businessLocation.id,
                },
              },
            },
            fields: ['id', 'quantity', 'isNegativeCount'],
            populate: {
              businessLocation: {
                fields: ['id'],
              },
            },
          },
        );

        if (productInventoryItem[0].quantity - productOrderItem.quantity < 0) {
          if (productInventoryItem[0]?.isNegativeCount) {
            await strapi.entityService.update(
              'api::product-inventory-item.product-inventory-item',
              productInventoryItem[0].id,
              {
                data: {
                  quantity:
                    productInventoryItem[0].quantity -
                    productOrderItem.quantity,
                },
              },
            );
          } else {
            throw new Error('This amount of product is currently unavailable');
          }
        }

        if (productInventoryItem[0].quantity - productOrderItem.quantity >= 0) {
          await strapi.entityService.update(
            'api::product-inventory-item.product-inventory-item',
            productInventoryItem[0].id,
            {
              data: {
                quantity:
                  productInventoryItem[0].quantity - productOrderItem.quantity,
              },
            },
          );

          const { updatedReceiveEvents } =
            await productInventoryEventService.removeRemainingInReceiveEvents({
              productItemId: productInventoryItem[0].id,
              transferQuantity: productOrderItem.quantity,
            });

          await strapi.entityService.create(
            'api::product-inventory-item-event.product-inventory-item-event',
            {
              data: {
                eventType: 'sold',
                change: productOrderItem.quantity.toString(),
                productInventoryItem: productInventoryItem[0].id,
                relationId: order.id.toString(),
                relationUuid: order.orderId,
                addedBy: user.id,
                businessLocation: productInventoryItem[0].businessLocation.id,
                tenant: user.tenant.id,
                itemContactVendor: order?.contact?.id ?? undefined,
                itemVendor: order?.company?.id ?? undefined,
              },
            },
          );

          await Promise.all(
            updatedReceiveEvents.map(
              async (receiveEvent) =>
                await strapi.entityService.update(
                  'api::product-inventory-item-event.product-inventory-item-event',
                  receiveEvent.id,
                  {
                    data: {
                      remainingQuantity: receiveEvent.remainingQuantity,
                    },
                  },
                ),
            ),
          );
        }
      }),
    );
  }

  if (order.compositeProducts.length > 0) {
    await Promise.all(
      order.compositeProducts.map(async (compositeProductOrderItem) => {
        await strapi.entityService.update(
          'api::composite-product-order-item.composite-product-order-item',
          compositeProductOrderItem.id,
          {
            data: {
              status: 'published',
            },
          },
        );

        const compositeProductInventoryItem =
          await strapi.entityService.findMany(
            'api::composite-product-location-info.composite-product-location-info',
            {
              filters: {
                compositeProduct: {
                  uuid: {
                    $eq: compositeProductOrderItem.compositeProduct
                      .compositeProduct.uuid,
                  },
                },
                businessLocation: {
                  id: {
                    $eq: order.businessLocation.id,
                  },
                },
              },
              populate: [
                'businessLocation',
                'compositeProduct',
                'compositeProduct.products',
                'compositeProduct.products.productInventoryItems',
              ],
            },
          );

        const productService = strapi.service('api::product.product');

        const productsQuantityList = await Promise.all(
          compositeProductInventoryItem?.[0]?.compositeProduct?.products?.map(
            async (product) => {
              return await productService.getQuantity(
                product.id,
                order.businessLocation.id,
              );
            },
          ) || [],
        );

        if (
          productsQuantityList.some(
            (el) => el - compositeProductOrderItem.quantity < 0,
          )
        ) {
          throw new Error('This composite product currently unavailable');
        }

        if (
          productsQuantityList.every(
            (el) => el - compositeProductOrderItem.quantity >= 0,
          )
        ) {
          const inventoryItems =
            (await Promise.all(
              compositeProductInventoryItem?.[0]?.compositeProduct?.products.map(
                async (product) =>
                  await productService.getProductInventoryItems(
                    product.id,
                    order.businessLocation.id,
                  ),
              ),
            )) || [];

          await Promise.all(
            inventoryItems.flat().map(async (item) => {
              await strapi.entityService.update(
                'api::product-inventory-item.product-inventory-item',
                item.id,
                {
                  data: {
                    quantity:
                      item.quantity - compositeProductOrderItem.quantity,
                  },
                },
              );

              const { updatedReceiveEvents } =
                await productInventoryEventService.removeRemainingInReceiveEvents(
                  {
                    productItemId: item.id,
                    transferQuantity: compositeProductOrderItem.quantity,
                  },
                );

              await strapi.entityService.create(
                'api::product-inventory-item-event.product-inventory-item-event',
                {
                  data: {
                    eventType: 'sold',
                    change: compositeProductOrderItem.quantity.toString(),
                    productInventoryItem: item.id,
                    relationId: order.id.toString(),
                    relationUuid: order.orderId,
                    addedBy: user.id,
                    businessLocation: item.businessLocation.id,
                    tenant: user.tenant.id,
                    itemContactVendor: order?.contact?.id ?? undefined,
                    itemVendor: order?.company?.id ?? undefined,
                  },
                },
              );

              await Promise.all(
                updatedReceiveEvents.map(
                  async (receiveEvent) =>
                    await strapi.entityService.update(
                      'api::product-inventory-item-event.product-inventory-item-event',
                      receiveEvent.id,
                      {
                        data: {
                          remainingQuantity: receiveEvent.remainingQuantity,
                        },
                      },
                    ),
                ),
              );
            }),
          );
        }
      }),
    );
  }

  if (order.services.length > 0) {
    await Promise.all(
      order.services.map(async (service) => {
        await strapi.entityService.update(
          'api::service-order-item.service-order-item',
          service.id,
          {
            data: {
              status: 'published',
            },
          },
        );
      }),
    );
  }

  if (order.memberships.length > 0) {
    await Promise.all(
      order.memberships.map(async (membership) => {
        await strapi.entityService.update(
          'api::membership-order-item.membership-order-item',
          membership.id,
          {
            data: {
              status: 'published',
            },
          },
        );
      }),
    );
  }

  if (order.classes.length > 0) {
    await Promise.all(
      order.classes.map(async (classItem) => {
        await strapi.entityService.update(
          'api::class-order-item.class-order-item',
          classItem.id,
          {
            data: {
              status: 'published',
            },
          },
        );
      }),
    );
  }

  await strapi.entityService.update('api::order.order', input.orderId, {
    data: {
      contact: user?.contact?.id,
      status: 'incoming',
      customerShippingInfo,
    },
  });
};
