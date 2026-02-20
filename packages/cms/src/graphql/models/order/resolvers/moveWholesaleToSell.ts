import { GraphQLFieldResolver } from 'graphql';
import { WholesaleToSellInput } from '../order.types';

// TODO: Valentyn V. - Add inventory events if needed

export const moveWholesaleToSell: GraphQLFieldResolver<
  null,
  null,
  { input: WholesaleToSellInput }
> = async (root, { input }, ctx, info) => {
  const order = await strapi.entityService.findOne(
    'api::order.order',
    input.id,
    {
      populate: [
        'products',
        'products.product',
        'products.product.product',
        'compositeProducts',
        'compositeProducts.compositeProduct',
        'compositeProducts.compositeProduct.compositeProduct',
        'compositeProducts.compositeProduct.compositeProduct.products',
        'businessLocation',
        'tenant',
      ],
    },
  );

  // Update inventory for the products
  if (order?.products?.length) {
    await Promise.all(
      order.products.map(async (product) => {
        const productInventoryItem = await strapi.entityService.findOne(
          'api::product-inventory-item.product-inventory-item',
          product.product.id,
          {
            populate: ['businessLocation'],
          },
        );

        if (productInventoryItem.quantity < product.quantity) {
          throw new Error(
            `The ${product.product.product.name} quantity is less than in the inventory. Please, update the quantity and try again.`,
          );
        } else {
          await strapi.entityService.update(
            'api::product-inventory-item.product-inventory-item',
            productInventoryItem.id,
            {
              data: {
                quantity:
                  Number(productInventoryItem.quantity) -
                  Number(product.quantity),
              },
            },
          );
        }
      }),
    );
  }

  // Update inventory for the composite products
  if (order?.compositeProducts?.length) {
    await Promise.all(
      order.compositeProducts.map(async (compositeProduct) => {
        const productService = strapi.service('api::product.product');

        const productsQuantityList = await Promise.all(
          compositeProduct?.compositeProduct?.compositeProduct?.products.map(
            async (product) => {
              const quantity = await productService.getQuantity(
                product.id,
                order.businessLocation.id,
              );
              return quantity;
            },
          ) || [],
        );

        if (productsQuantityList.some((quantity) => quantity === 0)) {
          throw new Error('This composite product is currently unavailable.');
        }

        if (
          productsQuantityList.every(
            (quantity) => quantity >= compositeProduct.quantity,
          )
        ) {
          const inventoryItems =
            (await Promise.all(
              compositeProduct?.compositeProduct?.compositeProduct?.products.map(
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
                    quantity: item.quantity - compositeProduct.quantity,
                  },
                },
              );
            }),
          );
        } else {
          throw new Error('Insufficient stock for the composite product.');
        }
      }),
    );
  }

  await strapi.entityService.update('api::order.order', input.id, {
    data: {
      type: 'sell',
    },
  });
};
