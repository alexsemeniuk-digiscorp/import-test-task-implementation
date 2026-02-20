/**
 * tax service
 */
import { factories } from '@strapi/strapi';

export type OrderItemEntity = {
  [key: string]: any;
  price?: number | null;
  quantity?: number | null;
  tax?: {
    fixedFee?: number | null;
    perUnitFee?: number | null;
    rate?: number | null;
    maxTaxAmount?: number | null;
    exemptionThreshold?: number | null;
    startAfterPrice?: number | null;
    endAfterPrice?: number | null;
  };
  taxCollection?: {
    taxes?: {
      fixedFee?: number | null;
      perUnitFee?: number | null;
      rate?: number | null;
      maxTaxAmount?: number | null;
      exemptionThreshold?: number | null;
      startAfterPrice?: number | null;
      endAfterPrice?: number | null;
    };
  };
  order?: {
    total?: number | null;
    tip?: number | null;
    tax?: number | null;
    subTotal?: number | null;
    points?: number | null;
  };
  discounts?: {
    type?: string | null;
    amount?: number | null;
    applicableProducts?: any[] | null;
    excludedProducts?: any[] | null;
    applicableCompositeProducts?: any[] | null;
    excludedCompositeProducts?: any[] | null;
    applicableServices?: any[] | null;
    excludedServices?: any[] | null;
    applicableMemberships?: any[] | null;
    excludedMemberships?: any[] | null;
    applicableClasses?: any[] | null;
    excludedClasses?: any[] | null;
  };
};

export default factories.createCoreService('api::tax.tax', () => ({
  getOrderItemTax({
    price,
    tax,
    quantity,
    adjustedPrice,
  }: OrderItemEntity): number {
    if (quantity <= 0) {
      return 0;
    }

    if (!tax) {
      return 0;
    }

    const {
      fixedFee = 0,
      perUnitFee = 0,
      rate = 0,
      maxTaxAmount = Infinity,
      exemptionThreshold = 0,
      startAfterPrice = 0,
      endAfterPrice = Infinity,
    } = tax;

    let taxSum = 0;
    let selectedPrice = adjustedPrice / quantity;

    // This line will make it so if points = subTotal, then tax still will be calculated from the subTotal
    // let selectedPrice = adjustedPrice ? adjustedPrice / quantity : price;

    if (exemptionThreshold && selectedPrice <= exemptionThreshold) {
      return 0;
    }

    if (endAfterPrice) {
      selectedPrice = Math.min(selectedPrice, endAfterPrice);
    }
    if (startAfterPrice) {
      selectedPrice = Math.max(selectedPrice - startAfterPrice, 0);
    }

    if (rate) {
      taxSum += (selectedPrice * quantity * rate) / 100;
    }

    if (perUnitFee) {
      taxSum += perUnitFee * quantity;
    }
    if (fixedFee) {
      taxSum += fixedFee;
    }
    if (maxTaxAmount) {
      taxSum = Math.min(taxSum, maxTaxAmount);
    }
    return Math.round(taxSum * 100) / 100;
  },
  getOrderItemEntityTax(entity: OrderItemEntity): number {
    if (!entity.tax) {
      return 0;
    }

    const { fixedFee, perUnitFee, rate } = entity.tax;
    let taxSum = 0;

    if (rate) {
      taxSum += (Number(entity.price) * Number(entity.quantity) * rate) / 100;
    }

    if (perUnitFee) {
      taxSum += perUnitFee * Number(entity.quantity);
    }

    if (fixedFee) {
      taxSum += fixedFee;
    }

    return taxSum;
  },
  getTaxAmountPerItem(entity: OrderItemEntity): number {
    const discountServices = strapi.service('api::discount.discount');
    const taxService = strapi.service('api::tax.tax');
    const taxCollectionService = strapi.service(
      'api::tax-collection.tax-collection',
    );

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
    const discountedSubTotal = parseFloat(preTaxSales.toFixed(2)) || 1;

    const calculatedSubTotal = discountedSubTotal || entity?.order?.subTotal;

    const itemValue = entity.price - discountAmountPerItem;
    const pointsProportion = (itemValue * appliedPoints) / calculatedSubTotal;
    const adjustedPrice = itemValue - pointsProportion;

    const taxConnection = entity?.tax ? 'singleTax' : 'taxCollection';

    const itemTax =
      taxService.getOrderItemTax({
        tax: entity?.tax,
        price: entity?.price,
        quantity: entity?.quantity,
        adjustedPrice,
      }) ?? 0;

    const taxCollectionSum =
      taxCollectionService.getOrderItemTaxCollectionCalc({
        taxes: entity?.taxCollection?.taxes,
        price: entity?.price,
        quantity: entity?.quantity,
        taxesReport: {},
        adjustedPrice,
      }) ?? 0;

    return taxConnection === 'singleTax' ? itemTax : taxCollectionSum;
  },
}));
