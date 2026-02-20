/**
 * jewelry-product service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService(
  'api::jewelry-product.jewelry-product',
  ({ strapi }) => ({
    async getProductInventoryItems(id: number, businessLocationId?: number) {
      return strapi.entityService.findMany(
        'api::product-inventory-item.product-inventory-item',
        {
          filters: {
            product: {
              id: {
                $eq: id,
              },
            },
            ...(businessLocationId && {
              businessLocation: {
                id: {
                  $eq: businessLocationId,
                },
              },
            }),
          },
          populate: ['businessLocation'],
        },
      );
    },
    async getQuantity(id: number, businessLocationId?: number) {
      const productInventoryItems = await this.getProductInventoryItems(
        id,
        businessLocationId,
      );

      if (!productInventoryItems.length) return 0;

      const quantities: number[] = await Promise.all(
        productInventoryItems.map(
          (productInventoryItem) => productInventoryItem?.quantity,
        ),
      );

      return quantities.reduce((acc, quantity) => acc + quantity, 0);
    },
    async getQuantitySold(
      id: number,
      startDate: Date,
      endDate: Date,
      businessLocationId?: number,
    ) {
      const productInventoryItemService = strapi.service(
        'api::product-inventory-item.product-inventory-item',
      );

      const productInventoryItems = await this.getProductInventoryItems(
        id,
        businessLocationId,
      );

      if (!productInventoryItems.length) return 0;

      const quantitiesSold: number[] = await Promise.all(
        productInventoryItems.map((productInventoryItem) =>
          productInventoryItemService.getQuantitySold(
            productInventoryItem?.id,
            startDate,
            endDate,
          ),
        ),
      );

      return quantitiesSold.reduce(
        (acc, quantitySold) => acc + quantitySold,
        0,
      );
    },
    async getSoldRevenue(
      id: number,
      startDate: Date,
      endDate: Date,
      businessLocationId?: number,
    ) {
      const productInventoryItemService = strapi.service(
        'api::product-inventory-item.product-inventory-item',
      );

      const productInventoryItems = await this.getProductInventoryItems(
        id,
        businessLocationId,
      );

      if (!productInventoryItems.length) return 0;

      const soldRevenues: number[] = await Promise.all(
        productInventoryItems.map((productInventoryItem) =>
          productInventoryItemService.getSoldRevenue(
            productInventoryItem?.id,
            startDate,
            endDate,
          ),
        ),
      );

      return soldRevenues.reduce((acc, soldRevenue) => acc + soldRevenue, 0);
    },
    async getNumberLocationsPresented(id: number) {
      const productInventoryItems = await this.getProductInventoryItems(id);

      const locationIds = new Set();

      productInventoryItems.forEach((entry) => {
        locationIds.add(entry.businessLocation.id);
      });

      return Array.from(locationIds)?.length ?? 0;
    },
  }),
);
