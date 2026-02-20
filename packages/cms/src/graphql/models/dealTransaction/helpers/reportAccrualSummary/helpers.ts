import { discountPopulation } from '../../../discount/helpers/variables';
import { DealTransactionCard } from '../helpers';

// Helper function to normalize date (remove time component)
export const normalizeDate = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

// Helper to check if transaction is a points transaction
export const isPointsTransaction = (transaction: any): boolean => {
  const paymentMethodName = transaction?.paymentMethod?.name?.toLowerCase();
  const currency = transaction?.transactionCurrency?.toUpperCase();
  return paymentMethodName === 'points' || currency === 'POINTS';
};

// Helper function to calculate adjusted price for an item (price - discount - points portion)
export const calculateAdjustedPrice = (
  price: number,
  discounts: any[],
  order: any,
  discountService: any,
): number => {
  // Calculate discount amount
  const discountAmount = discountService.getDiscountAmountSumForOrderItem(
    price,
    1,
    discounts,
    order,
  );

  // Calculate item value after discount
  const itemValue = price - discountAmount;

  // Calculate points portion
  const appliedPoints = order?.points ?? 0;
  if (!appliedPoints) return itemValue;

  const total = order?.total ?? 0;
  const tip = order?.tip ?? 0;
  const tax = order?.tax ?? 0;

  const preTaxSales = total - tip - tax + appliedPoints;
  const calculatedSubTotal =
    parseFloat(preTaxSales.toFixed(2)) || order?.subTotal || 0;

  if (!calculatedSubTotal) return itemValue;

  const pointsPortion = (itemValue * appliedPoints) / calculatedSubTotal;
  return itemValue - pointsPortion;
};

interface ItemCategoryRevenue {
  itemCategoryRevenueMap: Map<
    string,
    { id: number; name: string; total: number }
  >;
  compositeProductsRevenue: number;
  nonCategorizedRevenue: number;
}

// Calculate revenue by item category from orders
export const calculateRevenueByItemCategory = (
  orders: any[],
  discountService: any,
): ItemCategoryRevenue => {
  const itemCategoryRevenueMap = new Map<
    string,
    { id: number; name: string; total: number }
  >();
  let compositeProductsRevenue = 0;
  let nonCategorizedRevenue = 0;
  let itemCategoryNextId = 3000;

  // Helper to add revenue to item category map
  const addToCategory = (categoryName: string, revenue: number) => {
    if (!itemCategoryRevenueMap.has(categoryName)) {
      itemCategoryRevenueMap.set(categoryName, {
        id: itemCategoryNextId++,
        name: categoryName,
        total: 0,
      });
    }
    const entry = itemCategoryRevenueMap.get(categoryName);
    if (entry) {
      entry.total += revenue;
    }
  };

  // Process each order
  for (const order of orders) {
    // Process products (excluding composite product items)
    for (const product of order.products || []) {
      if (product.isCompositeProductItem) continue;

      const price = product.price ?? 0;
      const quantity = product.quantity ?? 1;
      const adjustedPrice = calculateAdjustedPrice(
        price,
        product.discounts || [],
        order,
        discountService,
      );
      const totalRevenue = adjustedPrice * quantity;

      // Get item category from product -> product-inventory-item -> product -> productType -> itemCategory
      const itemCategory =
        product?.product?.product?.productType?.itemCategory?.name;

      if (itemCategory) {
        addToCategory(itemCategory, totalRevenue);
      } else {
        nonCategorizedRevenue += totalRevenue;
      }
    }

    // Process services
    for (const service of order.services || []) {
      const price = service.price ?? 0;
      const quantity = service.quantity ?? 1;
      const adjustedPrice = calculateAdjustedPrice(
        price,
        service.discounts || [],
        order,
        discountService,
      );
      const totalRevenue = adjustedPrice * quantity;

      // Get item category from service -> service-performer -> serviceLocationInfo -> service -> itemCategory
      const itemCategory =
        service?.service?.serviceLocationInfo?.service?.itemCategory?.name;

      if (itemCategory) {
        addToCategory(itemCategory, totalRevenue);
      } else {
        nonCategorizedRevenue += totalRevenue;
      }
    }

    // Process composite products
    for (const compositeProduct of order.compositeProducts || []) {
      const price = compositeProduct.price ?? 0;
      const quantity = compositeProduct.quantity ?? 1;
      const adjustedPrice = calculateAdjustedPrice(
        price,
        compositeProduct.discounts || [],
        order,
        discountService,
      );
      compositeProductsRevenue += adjustedPrice * quantity;
    }

    // Process memberships (no item category, goes to non-categorized)
    for (const membership of order.memberships || []) {
      const price = membership.price ?? 0;
      const quantity = membership.quantity ?? 1;
      const adjustedPrice = calculateAdjustedPrice(
        price,
        membership.discounts || [],
        order,
        discountService,
      );
      nonCategorizedRevenue += adjustedPrice * quantity;
    }

    // Process classes (no item category, goes to non-categorized)
    for (const classItem of order.classes || []) {
      const price = classItem.price ?? 0;
      const quantity = classItem.quantity ?? 1;
      const adjustedPrice = calculateAdjustedPrice(
        price,
        classItem.discounts || [],
        order,
        discountService,
      );
      nonCategorizedRevenue += adjustedPrice * quantity;
    }
  }

  return {
    itemCategoryRevenueMap,
    compositeProductsRevenue,
    nonCategorizedRevenue,
  };
};

// Create revenue breakdown cards from item category data
export const createRevenueBreakdownCards = (
  revenueData: ItemCategoryRevenue,
): DealTransactionCard[] => {
  const {
    itemCategoryRevenueMap,
    compositeProductsRevenue,
    nonCategorizedRevenue,
  } = revenueData;

  // Create cards for item categories with positive revenue
  const itemCategoryCards: DealTransactionCard[] = Array.from(
    itemCategoryRevenueMap.values(),
  )
    .filter((entry) => entry.total > 0)
    .map((entry, index) => ({
      ...entry,
      total: parseFloat(entry.total.toFixed(2)),
      name: `In Period Revenue: ${entry.name}`,
      cardImg: [1, 2, 3, 2][index % 4],
      type: 'transactions',
    }));

  // Create composite products card (only if positive)
  const compositeProductsCard: DealTransactionCard | null =
    compositeProductsRevenue > 0
      ? {
          id: 3998,
          name: 'In Period Revenue: Composite Products',
          total: parseFloat(compositeProductsRevenue.toFixed(2)),
          cardImg: 1,
          type: 'transactions',
        }
      : null;

  // Create non-categorized card (only if positive)
  const nonCategorizedCard: DealTransactionCard | null =
    nonCategorizedRevenue > 0
      ? {
          id: 3999,
          name: 'In Period Revenue: Non-Categorized',
          total: parseFloat(nonCategorizedRevenue.toFixed(2)),
          cardImg: 2,
          type: 'transactions',
        }
      : null;

  return [
    ...itemCategoryCards,
    ...(compositeProductsCard ? [compositeProductsCard] : []),
    ...(nonCategorizedCard ? [nonCategorizedCard] : []),
  ];
};

// Populate options for order items with item category data
export const orderItemsPopulateOptions = {
  products: {
    fields: ['price', 'quantity', 'isCompositeProductItem'],
    populate: {
      discounts: discountPopulation as any,
      product: {
        fields: ['id'],
        populate: {
          product: {
            fields: ['id'],
            populate: {
              productType: {
                fields: ['id'],
                populate: {
                  itemCategory: {
                    fields: ['id', 'name'],
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  services: {
    fields: ['price', 'quantity'],
    populate: {
      discounts: discountPopulation as any,
      service: {
        fields: ['id'],
        populate: {
          serviceLocationInfo: {
            fields: ['id'],
            populate: {
              service: {
                fields: ['id'],
                populate: {
                  itemCategory: {
                    fields: ['id', 'name'],
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  compositeProducts: {
    fields: ['price', 'quantity'],
    populate: {
      discounts: discountPopulation as any,
    },
  },
  memberships: {
    fields: ['price', 'quantity'],
    populate: {
      discounts: discountPopulation as any,
    },
  },
  classes: {
    fields: ['price', 'quantity'],
    populate: {
      discounts: discountPopulation as any,
    },
  },
};
