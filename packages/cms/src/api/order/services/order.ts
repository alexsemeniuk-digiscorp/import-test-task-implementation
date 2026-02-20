/**
 * order service
 */
import { factories } from '@strapi/strapi';
import { Any } from '@strapi/strapi/lib/services/entity-service/types/params/filters';
import {
  filterPeriodBuilder,
  orderRevenueRentTypeFilter,
} from '../../../graphql/models/dealTransaction/helpers/helpers';
import { generateId } from '../../../utils/randomBytes';
import { convertWoomercerMetaFieldsAsString } from '../../helpers/convertWoomercerMetaFieldsAsString';
import { orderCalculationsItemsPopulate } from '../../lifecyclesHelpers/variables';
import { OrderItemEntity } from '../../tax/services/tax';
import { handleError } from './../../../graphql/helpers/errors';
const calculateSubtotal = (products) => {
  return products
    .reduce((total, product) => total + product.quantity * product.price, 0)
    .toFixed(2);
};

const calculateItemDiscounts = (item, order) => {
  const { price = 0, quantity = 0, discounts = [] } = item;
  const subTotal = order?.subTotal ?? 0;

  let totalDiscountResult = 0;
  let priceWithDiscount = price;

  discounts.forEach((itemDiscount) => {
    const {
      applicableProducts = [],
      applicableServices = [],
      applicableClasses = [],
      applicableMemberships = [],
      applicableCompositeProducts = [],
      excludedProducts = [],
      excludedServices = [],
      excludedClasses = [],
      excludedMemberships = [],
      excludedCompositeProducts = [],
    } = itemDiscount;

    const hasApplicableItems =
      applicableProducts.length ||
      applicableServices.length ||
      applicableClasses.length ||
      applicableMemberships.length ||
      applicableCompositeProducts.length;

    const hasExcludedItems =
      excludedProducts.length ||
      excludedServices.length ||
      excludedClasses.length ||
      excludedMemberships.length ||
      excludedCompositeProducts.length;

    const isUniversal = !hasApplicableItems && !hasExcludedItems;

    let discountAmount = 0;
    switch (itemDiscount.type) {
      case 'percentage':
        discountAmount = (priceWithDiscount * itemDiscount.amount) / 100;
        break;
      case 'fixed':
        if (isUniversal && subTotal > 0) {
          const proportion = price / subTotal;
          discountAmount = itemDiscount.amount * proportion;
        } else {
          discountAmount = itemDiscount.amount;
        }
        break;
      default:
        handleError('calculateItemDiscounts', 'Not appropriate type');
    }

    totalDiscountResult += discountAmount * quantity;
    priceWithDiscount -= discountAmount;
  });

  return { priceWithDiscount, totalDiscountResult };
};

export default factories.createCoreService(
  'api::order.order',
  ({ strapi }) => ({
    getPointsAmountPerItem(entity: OrderItemEntity): number {
      const discountServices = strapi.service('api::discount.discount');

      const discountAmountPerItem =
        discountServices.getDiscountAmountSumForOrderItem(
          entity.price,
          1,
          entity.discounts,
          entity.order,
        );

      const total = entity?.order?.total ?? 0;
      const tip = entity?.order?.tip ?? 0;
      const tax = entity?.order?.tax ?? 0;
      const appliedPoints = entity?.order?.points ?? 0;

      const preTaxSales = total - tip - tax + appliedPoints;
      const discountedSubTotal = parseFloat(preTaxSales.toFixed(2));

      const calculatedSubTotal =
        discountedSubTotal || entity?.order?.subTotal || 0;

      if (!calculatedSubTotal) return 0;

      const itemValue = (entity.price ?? 0) - discountAmountPerItem;
      return (itemValue * appliedPoints) / calculatedSubTotal;
    },
    async getItemsAmount(id: number) {
      const order = await strapi.entityService.findOne('api::order.order', id, {
        fields: ['id'],
        populate: {
          products: {
            fields: ['id', 'quantity'],
          },
          compositeProducts: {
            fields: ['id', 'quantity'],
          },
          services: {
            fields: ['id', 'quantity'],
          },
          memberships: {
            fields: ['id', 'quantity'],
          },
          classes: {
            fields: ['id', 'quantity'],
          },
        },
      });

      let orderItemsAmount = 0;
      const reduceQuantity = (items) =>
        items?.reduce((total, item) => total + item?.quantity, 0);

      if (order?.products && order?.products?.length > 0) {
        orderItemsAmount += reduceQuantity(order.products);
      }

      if (order.classes && order.classes.length > 0) {
        orderItemsAmount += reduceQuantity(order.classes);
      }

      if (order.services && order.services.length > 0) {
        orderItemsAmount += reduceQuantity(order.services);
      }

      if (order.memberships && order.memberships.length > 0) {
        orderItemsAmount += reduceQuantity(order.memberships);
      }

      if (order.compositeProducts && order.compositeProducts.length > 0) {
        orderItemsAmount += reduceQuantity(order.compositeProducts);
      }

      return orderItemsAmount;
    },
    async getPaidSummary(id: number, statusFilter) {
      const orderWithDealTransactions = await strapi.entityService.findOne(
        'api::order.order',
        id,
        {
          fields: ['id', 'type'],
          populate: {
            dealTransactions: {
              fields: ['id', 'paid', 'status'],
              populate: {
                chartAccount: {
                  fields: ['id', 'name'],
                },
              },
              filters: {
                chartAccount: {
                  $or: [
                    {
                      name: {
                        $eq: 'Revenue',
                      },
                    },
                    {
                      name: {
                        $eq: 'Cost of Goods Sold',
                      },
                    },
                  ],
                },
                $and: [
                  {
                    status: {
                      $ne: 'Cancelled',
                    },
                  },
                  {
                    status: {
                      $ne: 'Running',
                    },
                  },
                ],
              },
            },
          },
        },
      );

      if (orderWithDealTransactions?.dealTransactions?.length) {
        const totalValue = orderWithDealTransactions?.dealTransactions.reduce(
          (total, transaction) => {
            const isPurchase = orderWithDealTransactions?.type === 'purchase';

            const validTransaction =
              (isPurchase &&
                transaction?.chartAccount?.name === 'Cost of Goods Sold') ||
              (!isPurchase && transaction?.chartAccount?.name === 'Revenue');

            if (validTransaction && transaction?.paid) {
              if (transaction?.status === 'Refunded') {
                total -= transaction.paid;
              } else {
                total += transaction.paid;
              }
            }
            return total;
          },
          0,
        );

        return totalValue;
      }

      return 0;
    },
    async getPreTaxSales(id: number) {
      const order = await strapi.entityService.findOne('api::order.order', id, {
        fields: ['total', 'tip', 'tax'],
      });

      const total = order?.total ?? 0;
      const tip = order?.tip ?? 0;
      const tax = order?.tax ?? 0;

      const preTaxSales = total - tip - tax;
      return parseFloat(preTaxSales.toFixed(2));
    },
    async getAmountPaidPreTax(id: number) {
      const amountPaid = await this.getPaidSummary(id);

      const order = await strapi.entityService.findOne('api::order.order', id, {
        fields: ['total', 'tip', 'tax'],
      });

      const total = order?.total ?? 0;
      const tip = order?.tip ?? 0;
      const tax = order?.tax ?? 0;

      const preTaxSales = total - tip - tax;
      const totalWithoutTip = total - tip;

      if (totalWithoutTip === 0) return 0;

      const amountPaidPreTax = (amountPaid / totalWithoutTip) * preTaxSales;
      return parseFloat(amountPaidPreTax.toFixed(2));
    },
    async getProductsPortion(id: number) {
      const order = await strapi.entityService.findOne('api::order.order', id, {
        fields: ['id'],
        populate: {
          products: {
            fields: ['id', 'price', 'quantity', 'isCompositeProductItem'],
          },
        },
      });

      if (order?.products && order.products.length > 0) {
        const filteredProducts = order.products.filter(
          (product) => product.isCompositeProductItem !== true,
        );

        if (filteredProducts.length > 0) {
          return calculateSubtotal(filteredProducts);
        }
      }

      return 0;
    },
    async getCompositeProductsPortion(id: number) {
      const order = await strapi.entityService.findOne('api::order.order', id, {
        fields: ['id'],
        populate: {
          compositeProducts: {
            fields: ['id', 'price', 'quantity'],
          },
        },
      });

      if (order?.compositeProducts && order.compositeProducts.length > 0) {
        return calculateSubtotal(order.compositeProducts);
      }

      return 0;
    },
    async getServicesPortion(id: number) {
      const order = await strapi.entityService.findOne('api::order.order', id, {
        fields: ['id'],
        populate: {
          services: {
            fields: ['id', 'price', 'quantity'],
          },
        },
      });

      if (order?.services && order.services.length > 0) {
        return calculateSubtotal(order.services);
      }

      return 0;
    },
    async getTaxPortion(id: number, total: number, tax: number) {
      const onlyPaidTransactionsSummary = await this.getPaidSummary(id, {
        chartAccount: {
          name: {
            $eq: 'Revenue',
          },
        },
        $eq: 'Paid',
      });

      if (total > 0) {
        const taxPortion = ((onlyPaidTransactionsSummary ?? 0) / total) * tax;
        return taxPortion > tax ? tax : taxPortion;
      }

      return 0;
    },
    async getTotalTaxSum(
      tenantFilter = {},
      dates = {},
      additionalFilters = {},
      filterAttribute = 'customCreationDate',
    ) {
      const periodFilter =
        Object.keys(dates).length === 0
          ? {}
          : filterPeriodBuilder(dates[0], dates[1], filterAttribute);

      const orders = await strapi.entityService.findMany('api::order.order', {
        filters: {
          ...additionalFilters,
          ...periodFilter,
          ...tenantFilter,
          type: {
            $in: ['sell', 'layaway', 'rent'],
          },
        },
        fields: ['id', 'tax'],
      });

      const totalTaxSum = orders.reduce((total, order) => {
        if (!order?.tax || order?.tax <= 0) return total;

        return total + order.tax;
      }, 0);

      return Math.round(totalTaxSum * 100) / 100;
    },
    async getTotalTaxPortion(
      tenantFilter = {},
      dates = {},
      additionalFilters = {},
    ) {
      const periodFilter =
        Object.keys(dates).length === 0
          ? {}
          : filterPeriodBuilder(dates[0], dates[1], 'customCreationDate');

      const orders = await strapi.entityService.findMany('api::order.order', {
        filters: {
          ...additionalFilters,
          ...periodFilter,
          type: {
            $in: ['sell', 'layaway', 'rent'],
          },
        },
        fields: ['id', 'tax', 'total'],
        populate: {
          dealTransactions: {
            fields: ['id', 'paid'],
            filters: {
              chartAccount: {
                name: {
                  $eq: 'Revenue',
                },
              },
              status: {
                $eq: 'Paid',
              },
              ...tenantFilter,
            },
          },
        },
      });

      return orders.reduce((total, order) => {
        const paidDealTransactionsSum = order.dealTransactions.reduce(
          (dealTransactionTotal, dealTransaction) => {
            if (dealTransaction && dealTransaction?.paid) {
              dealTransactionTotal += dealTransaction?.paid;
              return dealTransactionTotal;
            }
            return dealTransactionTotal;
          },
          0,
        );
        if (!order?.tax || order?.tax <= 0) return total;
        total +=
          (paidDealTransactionsSum / order?.total ?? 1) * order?.tax ?? 0;

        return total;
      }, 0);
    },
    async getSpecifiedTaxPortions(id: number) {
      const orderService = strapi.service('api::order.order');

      const populatedOrder = await strapi.entityService.findOne(
        'api::order.order',
        id,
        {
          fields: ['id', 'subTotal', 'total', 'points', 'isWarranty'],
          populate: orderCalculationsItemsPopulate as any,
        },
      );

      const { taxesReport } =
        orderService.getOrderFullCalculations(populatedOrder);

      const specifiedTaxesPortions = {};

      for (let i = 0; i < Object.keys(taxesReport)?.length; i++) {
        const taxNameId = Object.keys(taxesReport)[i];
        if (!taxesReport[taxNameId]) {
          specifiedTaxesPortions[taxNameId] = 0;
        }
        specifiedTaxesPortions[taxNameId] = taxesReport[taxNameId];
      }

      return JSON.stringify(specifiedTaxesPortions);
    },
    async getSpecifiedTaxPortionsSum(
      tenantFilter = {},
      dates,
      taxesIds: number[],
      additionalFilters = {},
      filterAttribute = 'customCreationDate',
    ) {
      if (!taxesIds?.length) return 0;
      const periodFilter =
        Object.keys(dates).length === 0
          ? {}
          : filterPeriodBuilder(dates[0], dates[1], filterAttribute);

      // Create a Set of selected tax IDs for efficient lookup
      const selectedTaxIds = new Set(taxesIds.map((id) => String(id)));

      const orderService = strapi.service('api::order.order');

      const orders = await strapi.entityService.findMany('api::order.order', {
        filters: {
          ...tenantFilter,
          ...periodFilter,
          ...additionalFilters,
          type: {
            $in: ['sell', 'layaway', 'rent'],
          },
        },
        fields: ['id', 'subTotal', 'total', 'points', 'isWarranty', 'tax'],
        populate: orderCalculationsItemsPopulate as any,
      });

      let totalSum = 0;
      for (let i = 0; i < orders.length; i++) {
        const order = orders[i];
        const { taxesReport } = orderService.getOrderFullCalculations(order);

        // Log if sum of tax portions doesn't match order.tax
        const orderTax = order?.tax ?? 0;
        if (orderTax > 0) {
          const taxPortionsSum = Object.values(taxesReport).reduce<number>(
            (sum, val) => sum + (val as number),
            0,
          );
          const roundedPortionsSum = Math.round(taxPortionsSum * 100) / 100;
          const diff = Math.abs(roundedPortionsSum - orderTax);

          if (diff > 0) {
            console.log(
              `[Tax Mismatch] Order ${order?.id}: Order.tax=${orderTax}, Sum of portions=${roundedPortionsSum}, Diff=${diff.toFixed(
                4,
              )}, taxesReport=${JSON.stringify(taxesReport)}`,
            );
          }
        }

        const taxKeys = Object.keys(taxesReport ?? {});
        for (let j = 0; j < taxKeys.length; j++) {
          const taxNameId = taxKeys[j];
          // Extract tax ID from taxNameId (format: "123:Tax Name")
          const taxId = taxNameId.split(':')[0];

          // Check if this tax is in the selected taxes
          if (selectedTaxIds.has(taxId) || selectedTaxIds.has(taxNameId)) {
            totalSum += Math.round(taxesReport[taxNameId] * 100) / 100;
          }
        }
      }

      return Math.round(totalSum * 100) / 100;
    },
    async getSpecifiedTaxPortionsAdjustedPrices(id: number) {
      const orderService = strapi.service('api::order.order');

      const populatedOrder = await strapi.entityService.findOne(
        'api::order.order',
        id,
        {
          fields: ['id', 'subTotal', 'total', 'points', 'isWarranty'],
          populate: orderCalculationsItemsPopulate as any,
        },
      );

      const { taxesReportAdjustedPrice } =
        orderService.getOrderFullCalculations(populatedOrder);

      const specifiedTaxesPortionsAdjustedPrices = {};

      for (let i = 0; i < Object.keys(taxesReportAdjustedPrice)?.length; i++) {
        const taxNameId = Object.keys(taxesReportAdjustedPrice)[i];
        if (!taxesReportAdjustedPrice[taxNameId]) {
          specifiedTaxesPortionsAdjustedPrices[taxNameId] = 0;
        }
        specifiedTaxesPortionsAdjustedPrices[taxNameId] =
          taxesReportAdjustedPrice[taxNameId];
      }

      return JSON.stringify(specifiedTaxesPortionsAdjustedPrices);
    },
    async getSpecifiedTaxPortionsAdjustedPricesSum(
      tenantFilter = {},
      dates,
      taxesIds: number[],
      additionalFilters = {},
      filterAttribute = 'customCreationDate',
    ) {
      if (!taxesIds?.length) return 0;

      const periodFilter =
        Object.keys(dates).length === 0
          ? {}
          : filterPeriodBuilder(dates[0], dates[1], filterAttribute);

      // Create a Set of selected tax IDs for efficient lookup
      const selectedTaxIds = new Set(taxesIds.map((id) => String(id)));

      const orderService = strapi.service('api::order.order');

      const orders = await strapi.entityService.findMany('api::order.order', {
        filters: {
          ...tenantFilter,
          ...periodFilter,
          ...additionalFilters,
          type: {
            $in: ['sell', 'layaway', 'rent'],
          },
        },
        fields: ['id', 'subTotal', 'total', 'points', 'isWarranty'],
        populate: orderCalculationsItemsPopulate as any,
      });

      // Calculate expected total from order subTotals for comparison
      const expectedFromSubTotals = orders.reduce(
        (sum, o) => sum + (o.subTotal || 0),
        0,
      );

      let totalSum = 0;

      for (let i = 0; i < orders.length; i++) {
        const order = orders[i];
        const { taxesReportAdjustedPrice, taxToCollectionMap } =
          orderService.getOrderFullCalculations(order);

        const taxKeys = Object.keys(taxesReportAdjustedPrice ?? {});

        // Track max value per collection to avoid double-counting
        // and to handle mixed single-tax + collection usage correctly
        const collectionMaxAmounts = new Map<string, number>();
        let orderContribution = 0;

        for (const taxNameId of Object.keys(taxesReportAdjustedPrice ?? {})) {
          // Extract tax ID from taxNameId (format: "123:Tax Name")
          const taxId = taxNameId.split(':')[0];

          // Check if this tax is in the selected taxes
          // Handle both formats: full "id:name" strings or just numeric ids
          if (!selectedTaxIds.has(taxId) && !selectedTaxIds.has(taxNameId)) {
            continue;
          }

          const collectionId = taxToCollectionMap[taxId];
          const amount = taxesReportAdjustedPrice[taxNameId];

          if (collectionId) {
            // For collection taxes, track the MAX value per collection
            // This handles cases where same tax is used both as single and in collection
            const collectionKey = `col_${collectionId}`;
            const currentMax = collectionMaxAmounts.get(collectionKey) || 0;
            collectionMaxAmounts.set(
              collectionKey,
              Math.max(currentMax, amount),
            );
          } else {
            // For single taxes (not in a collection), add directly
            totalSum += amount;
            orderContribution += amount;
          }
        }

        // Add collection amounts (max value per collection)
        for (const [key, amount] of collectionMaxAmounts.entries()) {
          totalSum += amount;
          orderContribution += amount;
        }
      }

      return totalSum;
    },
    async getOrderAmountsCalculationSum(
      tenantFilter = {},
      dates,
      additionalFilters = {},
      filterAttribute = 'customCreationDate',
    ) {
      const periodFilter =
        Object.keys(dates).length === 0
          ? {}
          : filterPeriodBuilder(dates[0], dates[1], filterAttribute);

      const orders = await strapi.entityService.findMany('api::order.order', {
        filters: {
          ...tenantFilter,
          ...periodFilter,
          ...additionalFilters,
          type: {
            $in: ['sell', 'layaway', 'rent'],
          },
        },
        fields: ['total', 'tip', 'tax'],
      });

      let totalSum = 0;
      let preTaxSalesSum = 0;

      for (const order of orders) {
        const total = order?.total ?? 0;
        const tip = order?.tip ?? 0;
        const tax = order?.tax ?? 0;

        totalSum += total;
        preTaxSalesSum += total - tip - tax;
      }

      return {
        totalSum: parseFloat(totalSum.toFixed(2)),
        preTaxSalesSum: parseFloat(preTaxSalesSum.toFixed(2)),
      };
    },
    getOrderFullCalculations(order, points = null) {
      const taxService = strapi.service('api::tax.tax');
      const taxCollectionService = strapi.service(
        'api::tax-collection.tax-collection',
      );

      const taxesReport = {};
      const taxesReportAdjustedPrice = {};
      const taxToCollectionMap = {}; // Maps tax ID to collection ID for deduplication

      const appliedPoints = points ?? order?.points ?? 0;
      const {
        products = [],
        classes = [],
        services = [],
        compositeProducts = [],
        memberships = [],
      } = order;
      const allItems = [
        ...products,
        ...classes,
        ...services,
        ...compositeProducts,
        ...memberships,
      ];
      const subTotal = calculateSubtotal(allItems);
      let totalDiscount = 0;

      const discountedSubTotal = allItems.reduce((sum, item) => {
        const { priceWithDiscount, totalDiscountResult } =
          calculateItemDiscounts(item, order);
        totalDiscount += totalDiscountResult;
        return sum + priceWithDiscount * (item.quantity || 0);
      }, 0);

      const calculatedSubTotal = discountedSubTotal || subTotal;

      const totalTax = allItems.reduce((sum, item, index) => {
        const { price = 0, quantity = 0, tax, taxCollection } = item;
        const taxConnection = tax ? 'singleTax' : 'taxCollection';

        if (!price || !quantity || (!tax && !taxCollection)) {
          // Calculate adjusted price for items without tax and add to taxesReportAdjustedPrice
          if (price && quantity) {
            const { priceWithDiscount } = calculateItemDiscounts(item, order);
            const itemValue = priceWithDiscount * quantity;
            const pointsProportion = calculatedSubTotal
              ? (itemValue * appliedPoints) / calculatedSubTotal
              : 0;
            const adjustedPrice = order?.isWarranty
              ? 0
              : itemValue - pointsProportion;
            // Add to special "0:No Tax" entry
            const noTaxKey = '0:No Tax';
            if (!taxesReportAdjustedPrice[noTaxKey]) {
              taxesReportAdjustedPrice[noTaxKey] = 0;
            }
            taxesReportAdjustedPrice[noTaxKey] += adjustedPrice;
          }
          return sum;
        }

        // Item has tax or taxCollection - calculate adjusted price
        const { priceWithDiscount, totalDiscountResult } =
          calculateItemDiscounts(item, order);
        const itemValue = priceWithDiscount * quantity;
        const pointsProportion =
          (itemValue * appliedPoints) / calculatedSubTotal;
        const adjustedPrice = itemValue - pointsProportion;

        let itemTax = 0;

        if (tax) {
          itemTax = taxService.getOrderItemTax({
            tax,
            price,
            quantity,
            adjustedPrice,
          });
          const taxNameId = `${tax.id}:${tax.name}`;
          if (!(taxNameId in taxesReport)) {
            taxesReport[taxNameId] = 0;
            taxesReportAdjustedPrice[taxNameId] = 0;
          }
          taxesReport[taxNameId] += order?.isWarranty ? 0 : itemTax;
          const addedValue = order?.isWarranty ? 0 : adjustedPrice;
          taxesReportAdjustedPrice[taxNameId] += addedValue;
        }
        const taxCollectionSum =
          taxCollectionService.getOrderItemTaxCollectionCalc({
            taxes: taxCollection?.taxes,
            price,
            quantity,
            taxesReport,
            adjustedPrice,
          });

        // Populate taxesReportAdjustedPrice for each tax in the collection
        if (taxCollection?.taxes && Array.isArray(taxCollection.taxes)) {
          const collectionId = taxCollection.id;
          for (const collectionTax of taxCollection.taxes) {
            if (collectionTax) {
              const collectionTaxNameId = `${collectionTax.id}:${collectionTax.name}`;
              if (!taxesReportAdjustedPrice[collectionTaxNameId]) {
                taxesReportAdjustedPrice[collectionTaxNameId] = 0;
              }
              taxesReportAdjustedPrice[collectionTaxNameId] += order?.isWarranty
                ? 0
                : adjustedPrice;
              // Map tax ID to collection ID for deduplication
              if (collectionId) {
                taxToCollectionMap[collectionTax.id] = collectionId;
              }
            }
          }
        }

        return (
          sum + (taxConnection === 'singleTax' ? itemTax : taxCollectionSum)
        );
      }, 0);

      return {
        subTotal: +subTotal,
        totalTax: order?.isWarranty ? 0 : Number(totalTax.toFixed(2)),
        totalDiscount: Number(totalDiscount.toFixed(2)),
        taxesReport,
        taxesReportAdjustedPrice,
        taxToCollectionMap,
      };
    },
    getOrderWithoutItemToDelete(order, entityId, apiName) {
      const newOrder = { ...order };

      const relationMapping = {
        'api::product-order-item.product-order-item': 'products',
        'api::service-order-item.service-order-item': 'services',
        'api::membership-order-item.membership-order-item': 'memberships',
        'api::class-order-item.class-order-item': 'classes',
        'api::composite-product-order-item.composite-product-order-item':
          'compositeProducts',
      };

      const relationKey = relationMapping[apiName];

      if (!relationKey) {
        throw new Error(`Invalid apiName: ${apiName}`);
      }

      newOrder[relationKey] = newOrder[relationKey].filter(
        (item) => item.id !== entityId,
      );

      return newOrder;
    },
    async updateRemainingAmount(txnId) {
      const transaction = await strapi.entityService.findOne(
        'api::deal-transaction.deal-transaction',
        txnId,
        {
          populate: [
            'sellingOrder.dealTransactions',
            'sellingOrder.tenant',
            'sellingOrder.contact',
            'sellingOrder.businessLocation',
          ],
        },
      );
      const revenueAccount = await strapi.entityService.findMany(
        'api::chart-account.chart-account',
        {
          filters: {
            name: {
              $eq: 'Revenue',
            },
          },
          fields: ['id'],
        },
      );

      const costOfGoodsSoldAccount = await strapi.entityService.findMany(
        'api::chart-account.chart-account',
        {
          filters: {
            name: {
              $eq: 'Cost of Goods Sold',
            },
          },
          fields: ['id'],
        },
      );
      const cashPaymentMethod = await strapi.entityService.findMany(
        'api::payment-method.payment-method',
        {
          filters: {
            name: {
              $eq: 'cash',
            },
            tenant: {
              id: {
                $eq: transaction?.sellingOrder?.tenant?.id,
              },
            },
          },
          fields: ['id'],
        },
      );

      const currentOrder = await transaction.sellingOrder;
      const sumOfTransactions = transaction?.sellingOrder?.dealTransactions
        ?.filter((transaction) => transaction.status === 'Paid')
        ?.reduce((acc, transaction) => {
          return acc + (transaction.summary || 0);
        }, 0);
      const openTransaction = transaction?.sellingOrder?.dealTransactions?.find(
        (transaction) =>
          transaction?.status === 'Open' && transaction?.repetitive === 'once',
      );

      if (sumOfTransactions == currentOrder.total && openTransaction) {
        await strapi.entityService.delete(
          'api::deal-transaction.deal-transaction',
          openTransaction.id,
        );
      } else if (sumOfTransactions < currentOrder.total) {
        if (openTransaction) {
          await strapi.entityService.update(
            'api::deal-transaction.deal-transaction',
            openTransaction.id,
            {
              data: {
                summary: currentOrder?.total - sumOfTransactions,
              },
            },
          );
        } else {
          await strapi.entityService.create(
            'api::deal-transaction.deal-transaction',
            {
              data: {
                summary: currentOrder?.total - sumOfTransactions,
                paid: 0,
                dueDate: currentOrder.dueDate ?? new Date(),
                company: currentOrder?.company?.id ?? null,
                contact: currentOrder?.contact?.id ?? null,
                sellingOrder: currentOrder.id,
                status: 'Open',
                chartAccount:
                  currentOrder.type === 'purchase'
                    ? costOfGoodsSoldAccount?.[0]?.id
                    : revenueAccount?.[0]?.id,
                repetitive: 'once',
                paymentMethod: cashPaymentMethod[0]?.id,
                dealTransactionId: generateId(),
                tenant: currentOrder?.tenant?.id,
                businessLocation: currentOrder?.businessLocation?.id,
              },
            },
          );
        }
      }
    },
    async handleOrderWebhook(ctx, platform) {
      if (!ctx?.request?.body) return;
      try {
        // Fetch ecommerce store
        const ecommerceStore = await strapi.db
          .query('api::ecommerce-detail.ecommerce-detail')
          .findOne({
            where: {
              ecommerceType: platform.type,
              storeUrl: platform.getStoreUrl(ctx),
            },
            populate: [
              'tenant',
              'businessLocation',
              'defaultShippingService',
              'defaultShippingService.serviceLocationInfos.servicePerformers',
              'defaultShippingProduct',
            ],
          });

        if (!ecommerceStore || ecommerceStore?.productWillNotSync) {
          return;
        }

        // Fetch products
        let products = [];
        const tenantId = ecommerceStore?.tenant?.id;

        try {
          if (platform.type === 'magento') {
            products = await platform.fetchProducts(ctx, tenantId);
          } else {
            const api = platform.getApi(ecommerceStore);
            products = await platform.fetchProducts(ctx, api, tenantId);
          }
        } catch (error) {
          console.error(`Error fetching products: ${error}`);
          throw new Error(`Error fetching products: ${error}`);
        }

        let contact;
        // Create or fetch contact
        if (platform.type === 'shopify') {
          const ecommerceContact = await strapi
            .query('api::ecommerce-contact-service.ecommerce-contact-service')
            .findOne({
              where: { ecommerceContactId: platform.getCustomerId(ctx) },
              populate: ['contact'],
            });

          if (ecommerceContact) {
            contact = await strapi.query('api::contact.contact').findOne({
              where: { id: ecommerceContact?.contact?.id },
            });
          }
        } else {
          contact = await strapi.query('api::contact.contact').findOne({
            where: { email: platform.getCustomerEmail(ctx) },
          });
        }

        if (!contact && platform.getContactData(ctx, ecommerceStore)) {
          contact = await strapi.entityService.create('api::contact.contact', {
            data: platform.getContactData(ctx, ecommerceStore),
          });

          await strapi.entityService.create(
            'api::ecommerce-contact-service.ecommerce-contact-service',
            {
              data: {
                ecommerceContactId: platform.getCustomerId(ctx).toString(),
                ecommerceType: platform.type,
                isSynced: true,
                syncDate: new Date(),
                contact: contact?.id,
                tenant: ecommerceStore?.tenant?.id,
              },
            },
          );
        }

        // Create order
        const newOrderId = generateId();
        const order = await strapi.entityService.create('api::order.order', {
          data: {
            lastPayment: new Date(),
            ...platform.getOrderData(
              ctx,
              newOrderId,
              tenantId,
              contact,
              ecommerceStore?.businessLocation?.id,
            ),
          },
        });

        if (!order) return;

        console.log(contact, 'shopify contact');
        // Fetch inventory items
        const productInventoryItems = [];
        console.log(products, ecommerceStore?.businessLocation?.id, 'products');
        for (const productId of products) {
          const item = await strapi.db
            .query('api::product-inventory-item.product-inventory-item')
            .findOne({
              where: {
                product: {
                  id: {
                    $eq: Number(productId),
                  },
                },
                businessLocation: {
                  id: {
                    $eq: Number(ecommerceStore?.businessLocation?.id),
                  },
                },
              },
              populate: ['product.ecommerceProductServices'],
            });
          console.log(item, 'item');
          if (item) {
            productInventoryItems.push(item);
          }
        }
        console.log(productInventoryItems, products, 'productInventoryItems');
        if (!productInventoryItems.length) return;

        // Fetch ecommerce tax
        let ecommerceTax;
        const orderService = strapi.service('api::order.order');
        if (platform.type === 'shopify') {
          ecommerceTax = await orderService?.calculateEcommerceOrderTax(
            ctx.request.body.tax_lines,
            tenantId,
            'shopify',
          );
        } else if (platform.type === 'woocommerce') {
          // tax calculation for woocommerce
          ecommerceTax = await orderService?.calculateEcommerceOrderTax(
            ctx.request.body.tax_lines,
            tenantId,
            'woocommerce',
          );
        } else if (platform.type === 'magento') {
          // tax calculation for magento
          ecommerceTax = await orderService?.calculateEcommerceOrderTax(
            ctx.request.body.tax_details,
            tenantId,
            'magento',
          );
        }

        console.log(
          productInventoryItems,
          ecommerceTax,
          'productInventoryItems',
          'ecommerceTax',
        );
        // Create product order items
        for (let index = 0; index < productInventoryItems?.length; index++) {
          console.log(
            platform.getOrderItemData(
              ctx,
              index,
              productInventoryItems[index],
              order,
              ecommerceTax,
            ),
            'platform.getOrderItemData',
          );
          await strapi.entityService.create(
            'api::product-order-item.product-order-item',
            {
              data: platform.getOrderItemData(
                ctx,
                productInventoryItems[index],
                order,
                ecommerceTax,
              ),
            },
          );
        }
        console.log(ctx.request.body, 'ctx.request.body after loop');
        if (ctx.request.body?.shipping_lines?.length) {
          let description = '';
          if (platform.type === 'woocommerce') {
            const api = platform.getApi(ecommerceStore);
            description = await platform.fetchShippingDescriptin(ctx, api);
          }

          if (ecommerceStore?.defaultShippingType === 'service') {
            if (
              ecommerceStore?.defaultShippingService?.serviceLocationInfos[0]
                ?.servicePerformers
            ) {
              await strapi.entityService.create(
                'api::service-order-item.service-order-item',
                {
                  data: {
                    ...platform.getServiceOrderItem(
                      ctx,
                      ecommerceStore?.defaultShippingService
                        ?.serviceLocationInfos[0]?.servicePerformers[0],
                      order,
                    ),
                    note: description ?? '',
                  },
                },
              );
            }
          } else {
            if (ecommerceStore?.defaultShippingProduct) {
              const item = await strapi.db
                .query('api::product-inventory-item.product-inventory-item')
                .findOne({
                  where: {
                    product: ecommerceStore?.defaultShippingProduct?.id,
                    businessLocation: ecommerceStore?.businessLocation?.id,
                  },
                });
              await strapi.entityService.create(
                'api::product-order-item.product-order-item',
                {
                  data: {
                    ...platform.getShippingItemData(
                      ctx,
                      item,
                      order,
                      ecommerceTax,
                    ),
                    note: description ?? '',
                  },
                },
              );
            }
          }
        }
        console.log(order, 'order');
        const updatedOrder = await strapi.entityService.update(
          'api::order.order',
          order?.id,
          {
            data: {
              status: 'incoming',
            },
          },
        );
        console.log(updatedOrder, 'updatedOrder');
        // Update deal transactions
        const dealTransactions = await strapi.db
          .query('api::deal-transaction.deal-transaction')
          .findMany({
            where: { sellingOrder: order?.id },
          });

        let paymentMethod = await strapi.db
          .query('api::payment-method.payment-method')
          .findOne({
            where: { name: platform.type, tenant: tenantId },
          });

        // Create payment method if it doesn't exist
        if (!paymentMethod) {
          paymentMethod = await strapi.entityService.create(
            'api::payment-method.payment-method',
            {
              data: {
                name: platform.type,
                tenant: tenantId,
              },
            },
          );
        }
        for (let index = 0; index < dealTransactions?.length; index++) {
          const dealTransaction = dealTransactions[index];
          await strapi.db
            .query('api::deal-transaction.deal-transaction')
            .update({
              where: {
                sellingOrder: order?.id,
              },
              data: {
                paid: dealTransaction?.summary,
                status: 'Paid',
                paymentMethod: paymentMethod?.id,
              },
            });
        }

        if (dealTransactions?.length === 0) {
          const revenueAccount = await strapi.entityService.findMany(
            'api::chart-account.chart-account',
            {
              filters: { name: { $eq: 'Revenue' } },
            },
          );
          await strapi.entityService.create(
            'api::deal-transaction.deal-transaction',
            {
              data: {
                sellingOrder: order?.id,
                status: 'Paid',
                paymentMethod: paymentMethod?.id,
                tenant: tenantId,
                businessLocation: ecommerceStore?.businessLocation?.id,
                repetitive: 'once',
                dealTransactionId: generateId(),
                chartAccount: revenueAccount?.[0]?.id,
                summary: updatedOrder?.total || ctx?.request?.body?.total_price,
                paid: updatedOrder?.total || ctx?.request?.body?.total_price,
                dueDate: order?.dueDate ?? new Date(),
                company: order?.company?.id ?? null,
                contact: order?.contact?.id ?? null,
              },
            },
          );
        }
      } catch (error) {
        console.error('Error in handleOrderWebhook:', error);
        return new Error(error.message);
      }
    },
    async calculateEcommerceOrderTax(taxes, tenantId, platform) {
      const taxCollection = [];
      const platformMappings = {
        shopify: { prefix: 'Shopify', rateField: 'rate', titleField: 'title' },
        woocommerce: {
          prefix: 'Woocommerce',
          rateField: 'rate_percent',
          titleField: 'label',
        },
        magento: {
          prefix: 'Magento',
          rateField: 'tax_percent',
          titleField: 'tax_title',
        },
        ecommerceApi: {
          prefix: 'Ecommerce API',
          rateField: 'percentage',
          titleField: 'name',
        },
      };

      const { prefix, rateField, titleField } = platformMappings[platform];

      for (const tax of taxes) {
        let rate = tax[rateField];

        if (platform === 'shopify') {
          rate *= 100;
        }

        const taxName = `${prefix}: ${tax[titleField] ?? 'Tax'} (${rate}%)`;

        let response = await strapi.db.query('api::tax.tax').findOne({
          where: { name: taxName, tenant: tenantId },
        });

        if (!response) {
          response = await strapi.entityService.create('api::tax.tax', {
            data: { name: taxName, rate: rate, tenant: tenantId },
          });
        }

        taxCollection.push({ id: response.id, name: response.name });
      }

      if (taxCollection.length === 1) {
        return { type: 'tax', id: taxCollection[0].id };
      } else if (taxCollection.length > 1) {
        const taxCollectionName = `${prefix}: ${taxes.map(
          (tax) => `${tax[titleField] ?? 'Tax'} ${tax[rateField]}%`,
        )}`;

        let response = await strapi.db
          .query('api::tax-collection.tax-collection')
          .findOne({
            where: { name: taxCollectionName, tenant: tenantId },
          });

        if (!response) {
          response = await strapi.entityService.create(
            'api::tax-collection.tax-collection',
            {
              data: {
                name: taxCollectionName,
                taxes: taxCollection.map((tax) => tax.id),
                tenant: tenantId,
              },
            },
          );
        }
        return { type: 'collection', id: response.id };
      }
    },
    async handleWoocommerceSKUOrderWebhook(ctx, platform) {
      if (!ctx?.request?.body) return;

      try {
        // Fetch ecommerce store
        const ecommerceStore = await strapi.db
          .query('api::ecommerce-detail.ecommerce-detail')
          .findOne({
            where: {
              ecommerceType: platform.type,
              storeUrl: platform.getStoreUrl(ctx),
            },
            populate: [
              'tenant',
              'businessLocation',
              'defaultShippingService',
              'defaultShippingService.serviceLocationInfos.servicePerformers',
              'defaultShippingProduct',
            ],
          });

        if (!ecommerceStore || !ecommerceStore?.productWillNotSync) {
          return;
        }

        // Fetch products
        let products = [];
        const tenantId = ecommerceStore?.tenant?.id;

        try {
          const api = platform.getApi(ecommerceStore);
          products = await platform.fetchSKUProducts(ctx, api);
        } catch (error) {
          return new Error(`Error fetching products: ${error}`);
        }

        let contact;
        // Create or fetch contact
        contact = await strapi.query('api::contact.contact').findOne({
          where: { email: platform.getCustomerEmail(ctx) },
        });

        if (!contact && platform.getContactData(ctx, ecommerceStore)) {
          contact = await strapi.entityService.create('api::contact.contact', {
            data: platform.getContactData(ctx, ecommerceStore),
          });
        }

        // Create order
        const newOrderId = generateId();
        const order = await strapi.entityService.create('api::order.order', {
          data: {
            lastPayment: new Date(),
            ...platform.getOrderData(
              ctx,
              newOrderId,
              tenantId,
              contact,
              ecommerceStore?.businessLocation?.id,
            ),
          },
        });

        if (!order) return;

        // Fetch inventory items
        const productInventoryItems = [];
        for (const product of products) {
          if (!product?.sku) {
            return;
          }
          const productData = await strapi.db
            .query('api::product.product')
            .findOne({
              where: {
                SKU: product?.sku,
              },
            });
          const item = await strapi.db
            .query('api::product-inventory-item.product-inventory-item')
            .findOne({
              where: {
                product: productData?.id,
                businessLocation: ecommerceStore?.businessLocation?.id,
              },
            });
          productInventoryItems.push(item);
        }
        if (!productInventoryItems.length) return;

        // Fetch ecommerce tax
        let ecommerceTax;
        const orderService = await strapi.service('api::order.order');
        if (platform.type === 'woocommerce') {
          // tax calculation for woocommerce
          ecommerceTax = await orderService?.calculateEcommerceOrderTax(
            ctx.request.body.tax_lines,
            tenantId,
            'woocommerce',
          );
        }

        // Create product order items
        for (let index = 0; index < productInventoryItems?.length; index++) {
          const orderNote = convertWoomercerMetaFieldsAsString(
            ctx.request.body?.line_items[index].meta_data,
          );
          await strapi.entityService.create(
            'api::product-order-item.product-order-item',
            {
              data: platform.getOrderItemDataWithSku(
                ctx,
                index,
                productInventoryItems[index],
                order,
                ecommerceTax,
                orderNote,
              ),
            },
          );
        }
        if (ctx.request.body?.shipping_lines?.length) {
          let description = '';
          if (platform.type === 'woocommerce') {
            const api = platform.getApi(ecommerceStore);
            description = await platform.fetchShippingDescriptin(ctx, api);
          }

          if (ecommerceStore?.defaultShippingType === 'service') {
            if (
              ecommerceStore?.defaultShippingService?.serviceLocationInfos[0]
                ?.servicePerformers
            ) {
              await strapi.entityService.create(
                'api::service-order-item.service-order-item',
                {
                  data: {
                    ...platform.getServiceOrderItem(
                      ctx,
                      ecommerceStore?.defaultShippingService
                        ?.serviceLocationInfos[0]?.servicePerformers[0],
                      order,
                    ),
                    note: description ?? '',
                  },
                },
              );
            }
          } else {
            if (ecommerceStore?.defaultShippingProduct) {
              const item = await strapi.db
                .query('api::product-inventory-item.product-inventory-item')
                .findOne({
                  where: {
                    product: ecommerceStore?.defaultShippingProduct?.id,
                    businessLocation: ecommerceStore?.businessLocation?.id,
                  },
                });
              await strapi.entityService.create(
                'api::product-order-item.product-order-item',
                {
                  data: {
                    ...platform.getShippingItemData(
                      ctx,
                      item,
                      order,
                      ecommerceTax,
                    ),
                    note: description ?? '',
                  },
                },
              );
            }
          }
        }

        // Update deal transactions
        const dealTransactions = await strapi.db
          .query('api::deal-transaction.deal-transaction')
          .findMany({
            where: { sellingOrder: order?.id },
          });

        let paymentMethod = await strapi.db
          .query('api::payment-method.payment-method')
          .findOne({
            where: { name: platform.type, tenant: tenantId },
          });

        // Create payment method if it doesn't exist
        if (!paymentMethod) {
          paymentMethod = await strapi.entityService.create(
            'api::payment-method.payment-method',
            {
              data: {
                name: platform.type,
                tenant: tenantId,
              },
            },
          );
        }

        for (let index = 0; index < dealTransactions?.length; index++) {
          const dealTransaction = dealTransactions[index];
          await strapi.db
            .query('api::deal-transaction.deal-transaction')
            .update({
              where: {
                sellingOrder: order?.id,
              },
              data: {
                paid: dealTransaction?.summary,
                status: 'Paid',
                paymentMethod: paymentMethod?.id,
              },
            });
        }
      } catch (error) {
        return new Error(error);
      }
    },
    async getTaxableAndNonTaxableSales(
      tenantFilter = {},
      dates,
      additionalFilters = {},
      filterAttribute = 'customCreationDate',
      requireShippedDate = false,
    ) {
      const periodFilter =
        Object.keys(dates).length === 0
          ? {}
          : filterPeriodBuilder(dates[0], dates[1], filterAttribute);

      // Query orders shipped in period for taxable/non-taxable sales calculation
      const ordersForTaxableSales = await strapi.entityService.findMany(
        'api::order.order',
        {
          filters: {
            ...additionalFilters,
            ...tenantFilter,
            ...orderRevenueRentTypeFilter,
            ...(requireShippedDate ? { shippedDate: { $ne: null } } : {}),
            ...periodFilter,
          } as Any<'api::order.order'>,
          fields: [
            'id',
            'subTotal',
            'total',
            'points',
            'tip',
            'tax',
            'isWarranty',
          ],
          populate: orderCalculationsItemsPopulate as any,
        },
      );

      // Calculate taxable and non-taxable sales based on whether calculated tax amount > 0 or = 0
      const discountService = strapi.service('api::discount.discount');
      const taxService = strapi.service('api::tax.tax');
      const orderService = strapi.service('api::order.order');

      let taxableSales = 0;
      let nonTaxableSales = 0;

      for (const order of ordersForTaxableSales) {
        const {
          products = [],
          classes = [],
          services = [],
          compositeProducts = [],
          memberships = [],
        } = order as any;

        const allItems = [
          { items: products, type: 'product' },
          { items: classes, type: 'class' },
          { items: services, type: 'service' },
          { items: compositeProducts, type: 'compositeProduct' },
          { items: memberships, type: 'membership' },
        ];

        for (const { items } of allItems) {
          for (const item of items) {
            const { price = 0, quantity = 0 } = item;
            if (!price || !quantity) continue;

            // Build item with order reference for service methods
            const itemWithOrder = { ...item, order };

            // Get discount adjusted price per item
            const discountAmountPerItem =
              discountService.getDiscountAmountSumForOrderItem(
                price,
                1,
                item.discounts,
                order,
              );
            const pointsAmountPerItem =
              orderService.getPointsAmountPerItem(itemWithOrder);
            const adjustedPricePerItem =
              price - discountAmountPerItem - pointsAmountPerItem;

            // Get tax amount per item
            const taxAmountPerItem =
              taxService.getTaxAmountPerItem(itemWithOrder);

            // Classify based on tax amount
            const totalAdjustedPrice = parseFloat(
              (adjustedPricePerItem * quantity).toFixed(2),
            );
            if (taxAmountPerItem > 0) {
              taxableSales += totalAdjustedPrice;
            } else {
              nonTaxableSales += totalAdjustedPrice;
            }
          }
        }
      }

      return {
        taxableSales: parseFloat(taxableSales.toFixed(2)),
        nonTaxableSales: parseFloat(nonTaxableSales.toFixed(2)),
      };
    },
  }),
);
