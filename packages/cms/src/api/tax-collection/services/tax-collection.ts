/**
 * tax-collection service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService(
  'api::tax-collection.tax-collection',
  ({ strapi }) => ({
    getOrderItemTaxCollectionCalc({
      taxes,
      price,
      quantity,
      taxesReport,
      adjustedPrice,
    }): number {
      const taxService = strapi.service('api::tax.tax');
      let taxCollectionsSum = 0;

      if (taxes && Array.isArray(taxes) && taxes.length > 0) {
        for (const tax of taxes) {
          const itemTax = taxService.getOrderItemTax({
            tax,
            price,
            quantity,
            adjustedPrice,
          });

          taxCollectionsSum += itemTax;

          if (tax) {
            const taxNameId = `${tax.id}:${tax.name}`;
            if (!taxesReport[taxNameId]) {
              taxesReport[taxNameId] = 0;
            }
            taxesReport[taxNameId] += itemTax;
          }
        }
      }

      return taxCollectionsSum;
    },
  }),
);
