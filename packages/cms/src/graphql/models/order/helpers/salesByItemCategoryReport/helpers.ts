import { NexusGenRootTypes } from '../../../../../types/generated/graphql';
import {
  monthNames,
  orderRevenueTypeFilter,
} from '../../../dealTransaction/helpers/helpers';
import {
  salesByItemCategoryReportFields,
  salesByItemCategoryReportPopulation,
} from './variables';

export const createOrdersMonthlyArr = (monthlyTotals) => {
  return monthNames.map((month) => ({
    month,
    amount: monthlyTotals[monthNames.indexOf(month)] || 0,
  }));
};

export const getRelatedItemDetails = (categoryRelation: string, item) => {
  const mapping: Record<string, { relatedItem; relationCategory: string }> = {
    products: {
      relatedItem: item.product?.product,
      relationCategory: 'products',
    },
    compositeProducts: {
      relatedItem: item.compositeProduct?.compositeProduct,
      relationCategory: 'composite_products',
    },
    services: {
      relatedItem: item.service?.serviceLocationInfo?.service,
      relationCategory: 'services',
    },
    memberships: {
      relatedItem: item.membership,
      relationCategory: 'memberships',
    },
    classes: {
      relatedItem: item.class?.classLocationInfo?.class,
      relationCategory: 'classes',
    },
  };

  const details = mapping[categoryRelation] || {
    relatedItem: null,
    relationCategory: '',
  };

  return {
    relatedItem: details.relatedItem,
    relationUuid: details.relatedItem ? details.relatedItem.uuid : '',
    relationCategory: details.relationCategory,
  };
};

// Revenue chart
export const getOrdersYearTotals = (orders) => {
  if (orders && orders.length > 0) {
    return Object.values(
      orders?.reduce(
        (acc, order: NexusGenRootTypes['Order']) => {
          const year = new Date(
            order?.customCreationDate ?? order?.createdAt,
          )?.getFullYear();
          acc[year] = {
            year,
            amount: (acc[year]?.amount || 0) + order?.subTotal,
          };
          return acc;
        },
        {} as Record<number, { year: number; amount: number }>,
      ),
    );
  } else {
    return [];
  }
};

export const calculateOrdersMonthlyTotals = (orders, targetYear: string) => {
  if (orders && orders.length > 0) {
    return orders
      ?.filter((order: NexusGenRootTypes['Order']) => {
        const creationDate = new Date(
          order?.customCreationDate ?? order?.createdAt,
        );
        const startDate = new Date(`${targetYear}-01-01`);
        const endDate = new Date(`${parseInt(targetYear) + 1}-01-01`);
        return creationDate >= startDate && creationDate < endDate;
      })
      ?.reduce((totals, order: NexusGenRootTypes['Order']) => {
        const month = new Date(
          order?.customCreationDate ?? order?.createdAt,
        ).getMonth();
        totals[month] = (totals[month] || 0) + order?.subTotal;
        return totals;
      }, {});
  } else {
    return [];
  }
};

export const calculateAndCreateOrdersMonthlyArr = (
  orders,
  targetYear: string,
) => {
  const monthlyTotals = calculateOrdersMonthlyTotals(orders, targetYear);
  return createOrdersMonthlyArr(monthlyTotals);
};

// Categories chart
export const chartCategories = [
  {
    id: '10c',
    name: 'Products',
    relation: 'products',
  },
  {
    id: '11b',
    name: 'Composite Products',
    relation: 'compositeProducts',
  },
  {
    id: '12b',
    name: 'Services',
    relation: 'services',
  },
  {
    id: '13b',
    name: 'Memberships',
    relation: 'memberships',
  },
  {
    id: '14b',
    name: 'Classes',
    relation: 'classes',
  },
];

export const getOrdersCategoryYearTotals = (orders, category) => {
  if (!orders || orders.length === 0) return [];

  const categoryItem = chartCategories.find(
    (chartCategory) => chartCategory.name === category.name,
  );
  if (!categoryItem) return [];

  return Object.values(
    orders.reduce(
      (acc, order) => {
        if (
          order?.[categoryItem.relation] &&
          order[categoryItem.relation].length > 0
        ) {
          const year = new Date(
            order?.customCreationDate ?? order?.createdAt,
          ).getFullYear();

          const itemTotal = order[categoryItem.relation].reduce(
            (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
            0,
          );

          acc[year] = {
            year,
            amount: (acc[year]?.amount || 0) + itemTotal,
          };
        }
        return acc;
      },
      {} as Record<number, { year: number; amount: number }>,
    ),
  );
};

export const calculateOrdersCategoryMonthlyTotals = (
  orders,
  category,
  targetYear: string,
) => {
  if (!orders || orders.length === 0) return [];

  const categoryItem = chartCategories.find(
    (chartCategory) => chartCategory.name === category.name,
  );
  if (!categoryItem) return [];

  return orders
    ?.filter((order: NexusGenRootTypes['Order']) => {
      const creationDate = new Date(
        order?.customCreationDate ?? order?.createdAt,
      );
      return creationDate.getFullYear() === parseInt(targetYear);
    })
    ?.reduce((totals, order: NexusGenRootTypes['Order']) => {
      if (
        order?.[categoryItem.relation] &&
        order[categoryItem.relation].length > 0
      ) {
        const month = new Date(
          order?.customCreationDate ?? order?.createdAt,
        ).getMonth();
        const itemTotal = order[categoryItem.relation].reduce(
          (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
          0,
        );

        totals[month] = (totals[month] || 0) + itemTotal;
      }
      return totals;
    }, {});
};

export const calculateAndCreateOrdersCategoryMonthlyArr = (
  orders,
  category,
  targetYear: string,
) => {
  const monthlyTotals = calculateOrdersCategoryMonthlyTotals(
    orders,
    category,
    targetYear,
  );
  return createOrdersMonthlyArr(monthlyTotals);
};

// Item with type chart
export const unnamedTypeId = '100d';

export const calculateAndCreateOrdersItemWithTypeYearTotals = (
  orders,
  parentId,
) => {
  const categoryItem = chartCategories.find(
    (category) => category.id === parentId,
  );
  if (!categoryItem) return [];

  const itemTotals = orders.reduce((acc, order) => {
    const relatedItems = order?.[categoryItem.relation];
    if (relatedItems && relatedItems.length > 0) {
      relatedItems.forEach((item) => {
        const { relatedItem } = getRelatedItemDetails(
          categoryItem.relation,
          item,
        );

        if (!relatedItem) return;

        const year = new Date(
          order?.customCreationDate ?? order?.createdAt,
        ).getFullYear();
        const itemTotal = (item.price || 0) * (item.quantity || 0);

        if (!acc[relatedItem?.productType?.id]) {
          acc[relatedItem?.productType?.id] = {
            id: relatedItem?.productType?.id ?? unnamedTypeId,
            chartName: relatedItem?.productType?.name ?? 'Unnamed Type',
            yearTotals: [],
            isParent: true,
            monthTotals: null,
            chartType: 'Item',
          };
        }
        const yearTotalIndex = acc[
          relatedItem?.productType?.id
        ].yearTotals.findIndex((y) => y.year === year);
        if (yearTotalIndex !== -1) {
          acc[relatedItem?.productType?.id].yearTotals[yearTotalIndex].amount +=
            itemTotal;
        } else {
          acc[relatedItem?.productType?.id].yearTotals.push({
            year,
            amount: itemTotal,
          });
        }
      });
    }
    return acc;
  }, {});

  return Object.values(itemTotals);
};

export const calculateOrdersItemWithTypeMonthlyTotals = (
  orders,
  parentId,
  specificItem,
  targetYear: string,
) => {
  if (!orders || orders.length === 0) return [];

  const categoryItem = chartCategories.find(
    (category) => category.id === parentId,
  );

  if (!categoryItem) return [];

  return orders
    ?.filter((order: NexusGenRootTypes['Order']) => {
      const creationDate = new Date(
        order?.customCreationDate ?? order?.createdAt,
      );
      return creationDate.getFullYear() === parseInt(targetYear);
    })
    ?.reduce((totals, order: NexusGenRootTypes['Order']) => {
      if (
        order?.[categoryItem.relation] &&
        order[categoryItem.relation].length > 0
      ) {
        const relatedItems = order?.[categoryItem.relation];

        if (relatedItems && relatedItems.length > 0) {
          relatedItems.forEach((item) => {
            const { relatedItem } = getRelatedItemDetails(
              categoryItem.relation,
              item,
            );

            if (
              (!relatedItem?.productType?.id && specificItem.id === '100d') ||
              relatedItem?.productType?.id === specificItem.id
            ) {
              const month = new Date(
                order?.customCreationDate ?? order?.createdAt,
              ).getMonth();
              const itemTotal = (item.price || 0) * (item.quantity || 0);

              totals[month] = (totals[month] || 0) + itemTotal;
            } else return;
          });
        }
      }
      return totals;
    }, {});
};

export const calculateAndCreateOrdersItemWithTypeMonthlyArr = (
  orders,
  parentId,
  specificItem,
  targetYear: string,
) => {
  const monthlyTotals = calculateOrdersItemWithTypeMonthlyTotals(
    orders,
    parentId,
    specificItem,
    targetYear,
  );
  return createOrdersMonthlyArr(monthlyTotals);
};

// Item chart
export const calculateAndCreateOrdersItemYearTotals = (orders, parentId) => {
  const categoryItem = chartCategories.find(
    (category) => category.id === parentId,
  );
  if (!categoryItem) return [];

  const itemTotals = orders.reduce((acc, order) => {
    const relatedItems = order?.[categoryItem.relation];
    if (relatedItems && relatedItems.length > 0) {
      relatedItems.forEach((item) => {
        const { relatedItem, relationUuid, relationCategory } =
          getRelatedItemDetails(categoryItem.relation, item);

        if (!relatedItem) return;

        const year = new Date(
          order?.customCreationDate ?? order?.createdAt,
        ).getFullYear();
        const itemTotal = (item.price || 0) * (item.quantity || 0);

        const relationImage =
          relatedItem?.files && relatedItem?.files?.length > 0
            ? relatedItem?.files[0]?.url
            : '';

        if (!acc[relationUuid]) {
          acc[relationUuid] = {
            id: relationUuid,
            chartName: relatedItem.name,
            chartItemCategory: relationCategory,
            chartItemUuid: relatedItem.uuid,
            chartItemImageUrl: relationImage,
            yearTotals: [],
            isParent: false,
            monthTotals: null,
            chartType: 'Item',
          };
        }
        const yearTotalIndex = acc[relationUuid].yearTotals.findIndex(
          (y) => y.year === year,
        );
        if (yearTotalIndex !== -1) {
          acc[relationUuid].yearTotals[yearTotalIndex].amount += itemTotal;
        } else {
          acc[relationUuid].yearTotals.push({ year, amount: itemTotal });
        }
      });
    }
    return acc;
  }, {});

  return Object.values(itemTotals);
};

export const calculateOrdersItemMonthlyTotals = (
  orders,
  parentId,
  specificItem,
  targetYear: string,
) => {
  if (!orders || orders.length === 0) return [];

  const categoryItem = chartCategories.find(
    (category) => category.id === parentId,
  );

  if (!categoryItem) return [];

  return orders
    ?.filter((order: NexusGenRootTypes['Order']) => {
      const creationDate = new Date(
        order?.customCreationDate ?? order?.createdAt,
      );
      return creationDate.getFullYear() === parseInt(targetYear);
    })
    ?.reduce((totals, order: NexusGenRootTypes['Order']) => {
      if (
        order?.[categoryItem.relation] &&
        order[categoryItem.relation].length > 0
      ) {
        const relatedItems = order?.[categoryItem.relation];

        if (relatedItems && relatedItems.length > 0) {
          relatedItems.forEach((item) => {
            const { relatedItem, relationUuid } = getRelatedItemDetails(
              categoryItem.relation,
              item,
            );

            if (!relatedItem || relationUuid !== specificItem.id) return;

            const month = new Date(
              order?.customCreationDate ?? order?.createdAt,
            ).getMonth();
            const itemTotal = (item.price || 0) * (item.quantity || 0);

            totals[month] = (totals[month] || 0) + itemTotal;
          });
        }
      }
      return totals;
    }, {});
};

export const calculateAndCreateOrdersItemMonthlyArr = (
  orders,
  parentId,
  specificItem,
  targetYear: string,
) => {
  const monthlyTotals = calculateOrdersItemMonthlyTotals(
    orders,
    parentId,
    specificItem,
    targetYear,
  );
  return createOrdersMonthlyArr(monthlyTotals);
};

// SubItem chart
export const calculateAndCreateOrdersSubItemYearTotals = (
  orders,
  categoryId,
  parentId,
) => {
  const categoryItem = chartCategories.find(
    (category) => category.id === categoryId,
  );

  if (!categoryItem) return [];

  const itemTotals = orders.reduce((acc, order) => {
    const relatedItems = order?.[categoryItem.relation];

    if (relatedItems && relatedItems.length > 0) {
      relatedItems.forEach((item) => {
        const { relatedItem, relationUuid, relationCategory } =
          getRelatedItemDetails(categoryItem.relation, item);

        if (
          (!relatedItem?.productType?.id && parentId === '100d') ||
          relatedItem?.productType?.id === Number(parentId)
        ) {
          const year = new Date(
            order?.customCreationDate ?? order?.createdAt,
          ).getFullYear();
          const itemTotal = (item.price || 0) * (item.quantity || 0);

          const relationImage =
            relatedItem?.files && relatedItem?.files?.length > 0
              ? relatedItem?.files[0]?.url
              : '';

          if (!acc[relationUuid]) {
            acc[relationUuid] = {
              id: relationUuid,
              chartName: relatedItem.name,
              chartItemCategory: relationCategory,
              chartItemUuid: relatedItem.uuid,
              chartItemImageUrl: relationImage,
              yearTotals: [],
              isParent: false,
              monthTotals: null,
              chartType: 'Subitem',
            };
          }
          const yearTotalIndex = acc[relationUuid].yearTotals.findIndex(
            (y) => y.year === year,
          );
          if (yearTotalIndex !== -1) {
            acc[relationUuid].yearTotals[yearTotalIndex].amount += itemTotal;
          } else {
            acc[relationUuid].yearTotals.push({ year, amount: itemTotal });
          }
        } else return;
      });
    }
    return acc;
  }, {});
  return Object.values(itemTotals);
};

export const calculateOrdersSubItemMonthlyTotals = (
  orders,
  categoryId,
  specificItem,
  targetYear: string,
) => {
  if (!orders || orders.length === 0) return [];

  const categoryItem = chartCategories.find(
    (category) => category.id === categoryId,
  );

  if (!categoryItem) return [];

  return orders
    ?.filter((order: NexusGenRootTypes['Order']) => {
      const creationDate = new Date(
        order?.customCreationDate ?? order?.createdAt,
      );
      return creationDate.getFullYear() === parseInt(targetYear);
    })
    ?.reduce((totals, order: NexusGenRootTypes['Order']) => {
      if (
        order?.[categoryItem.relation] &&
        order[categoryItem.relation].length > 0
      ) {
        const relatedItems = order?.[categoryItem.relation];

        if (relatedItems && relatedItems.length > 0) {
          relatedItems.forEach((item) => {
            const { relatedItem, relationUuid } = getRelatedItemDetails(
              categoryItem.relation,
              item,
            );

            if (
              (!relatedItem?.productType?.id && specificItem.id === '100d') ||
              relationUuid === specificItem.id
            ) {
              const month = new Date(
                order?.customCreationDate ?? order?.createdAt,
              ).getMonth();
              const itemTotal = (item.price || 0) * (item.quantity || 0);

              totals[month] = (totals[month] || 0) + itemTotal;
            } else return;
          });
        }
      }
      return totals;
    }, {});
};

export const calculateAndCreateOrdersSubItemMonthlyArr = (
  orders,
  categoryId,
  specificItem,
  targetYear: string,
) => {
  const monthlyTotals = calculateOrdersSubItemMonthlyTotals(
    orders,
    categoryId,
    specificItem,
    targetYear,
  );
  return createOrdersMonthlyArr(monthlyTotals);
};

export const generateSalesByItemCategoryReportData = async (job) => {
  const totalsArgs = job?.data;

  const salesByItemCategoryReportFilters = totalsArgs.reportFilter;

  const orders = await strapi.entityService.findMany('api::order.order', {
    filters: {
      status: {
        $ne: 'draft',
      },
      ...totalsArgs.tenantFilter,
      ...orderRevenueTypeFilter,
      ...salesByItemCategoryReportFilters,
    },
    fields: salesByItemCategoryReportFields as any,
    populate: salesByItemCategoryReportPopulation as any,
  });

  if (totalsArgs.chartType === 'revenue') {
    const ordersRevenue = getOrdersYearTotals(orders);

    const resultArray = [
      {
        id: '1a',
        chartName: 'Revenue',
        yearTotals: ordersRevenue,
        isParent: !!ordersRevenue.length,
        monthTotals: null,
        chartType: 'Revenue',
      },
    ];

    if (totalsArgs.queryType === 'months' && totalsArgs.targetYear) {
      resultArray[0]!.monthTotals = calculateAndCreateOrdersMonthlyArr(
        orders,
        totalsArgs.targetYear,
      );
    }

    return {
      length: null,
      chartsTimeTotals: resultArray,
    };
  } else if (
    totalsArgs.chartType === 'category' &&
    totalsArgs.parentId &&
    !isNaN(totalsArgs.startElem)
  ) {
    const categoriesArr = [];

    for (let i = 0; i < chartCategories.length; i++) {
      const ordersCategories =
        getOrdersCategoryYearTotals(orders, chartCategories[i]) || [];

      categoriesArr.push({
        id: chartCategories[i].id,
        chartName: chartCategories[i].name,
        yearTotals: ordersCategories,
        isParent: !!ordersCategories.length,
        monthTotals: null,
        chartType: 'Category',
      });
    }

    if (totalsArgs.queryType === 'months' && totalsArgs.targetYear) {
      for (let i = 0; i < chartCategories.length; i++) {
        categoriesArr[i]!.monthTotals =
          calculateAndCreateOrdersCategoryMonthlyArr(
            orders,
            chartCategories[i],
            totalsArgs.targetYear,
          );
      }
    }

    return {
      length: chartCategories?.length || 0,
      chartsTimeTotals: categoriesArr,
    };
  } else if (
    totalsArgs.chartType === 'item' &&
    totalsArgs.parentId &&
    !isNaN(totalsArgs.startElem)
  ) {
    let itemsArr = [];
    const isProductsChart = (totalsArgs.parentId as string).includes('c');

    if (isProductsChart) {
      itemsArr = calculateAndCreateOrdersItemWithTypeYearTotals(
        orders,
        totalsArgs.parentId,
      );

      if (totalsArgs.queryType === 'months' && totalsArgs.targetYear) {
        for (let i = 0; i < itemsArr.length; i++) {
          itemsArr[i]!.monthTotals =
            calculateAndCreateOrdersItemWithTypeMonthlyArr(
              orders,
              totalsArgs.parentId,
              itemsArr[i],
              totalsArgs.targetYear,
            );
        }
      }
    } else {
      itemsArr = calculateAndCreateOrdersItemYearTotals(
        orders,
        totalsArgs.parentId,
      );

      if (totalsArgs.queryType === 'months' && totalsArgs.targetYear) {
        for (let i = 0; i < itemsArr.length; i++) {
          itemsArr[i]!.monthTotals = calculateAndCreateOrdersItemMonthlyArr(
            orders,
            totalsArgs.parentId,
            itemsArr[i],
            totalsArgs.targetYear,
          );
        }
      }
    }

    return {
      length: itemsArr?.length || 0,
      chartsTimeTotals: itemsArr,
    };
  } else if (
    totalsArgs.chartType === 'subitem' &&
    totalsArgs.parentId &&
    !isNaN(totalsArgs.startElem)
  ) {
    let itemsArr = [];

    itemsArr = calculateAndCreateOrdersSubItemYearTotals(
      orders,
      '10c',
      totalsArgs.parentId,
    );

    if (totalsArgs.queryType === 'months' && totalsArgs.targetYear) {
      for (let i = 0; i < itemsArr.length; i++) {
        itemsArr[i]!.monthTotals = calculateAndCreateOrdersSubItemMonthlyArr(
          orders,
          '10c',
          itemsArr[i],
          totalsArgs.targetYear,
        );
      }
    }

    return {
      length: itemsArr?.length || 0,
      chartsTimeTotals: itemsArr,
    };
  }

  return {};
};
