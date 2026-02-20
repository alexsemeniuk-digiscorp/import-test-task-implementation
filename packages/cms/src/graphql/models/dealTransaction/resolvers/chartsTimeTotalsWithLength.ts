import { GraphQLFieldResolver } from 'graphql';

import {
  accountsNames,
  addArraysByMonth,
  calculateAndCreateIncomeChartMonthlyArr,
  calculateAndCreateMonthlyArr,
  calculateYearlyAmount,
  combineMonthlyArrays,
  combineYearlyArrays,
  currencyWithoutPointsFilter,
  currentDate,
  currentYear,
  getAccountYearTotals,
  getLocationFilter,
  getTenantFilter,
} from '../helpers/helpers';
import { TimeTotalsArgs } from '../types/types';

export const chartsTimeTotalsWithLength: GraphQLFieldResolver<
  any,
  Graphql.ResolverContext,
  { input: TimeTotalsArgs }
> = async (root, { input: totalsArgs }, ctx) => {
  const tenantFilter = await getTenantFilter(ctx.state.user.id);
  const locationFilter = getLocationFilter(totalsArgs.businessLocation);

  if (totalsArgs.chartType === 'account') {
    const chartAccounts: any = await strapi.entityService.findMany(
      'api::chart-account.chart-account',
      {
        fields: ['id', 'name'],
        populate: {
          dealTransactions: {
            filters: {
              ...tenantFilter,
              ...locationFilter,
              ...currencyWithoutPointsFilter,
              status: {
                $in: ['Paid', 'Open', 'Refunded'],
              },
            },
            fields: ['paid', 'status', 'customCreationDate', 'dueDate'],
            populate: {
              sellingOrder: {
                fields: ['total', 'tax'],
              },
            },
          },
          chartCategories: {
            filters: {
              ...tenantFilter,
            },
            fields: ['id'],
          },
        },
      },
    );

    const revenueAccount = getAccountYearTotals(
      chartAccounts,
      accountsNames[0],
    );
    const costOfGoodsSoldAccount = getAccountYearTotals(
      chartAccounts,
      accountsNames[1],
    );
    const expensesAccount = getAccountYearTotals(
      chartAccounts,
      accountsNames[3],
    );
    const taxesAccount = getAccountYearTotals(chartAccounts, accountsNames[5]);

    const grossProfitAccount = combineYearlyArrays(
      revenueAccount,
      costOfGoodsSoldAccount,
    );
    const preTaxIncAccount = combineYearlyArrays(
      grossProfitAccount,
      expensesAccount,
    );
    const netIncAccount = combineYearlyArrays(preTaxIncAccount, taxesAccount);

    const inventoryShrinkage = getAccountYearTotals(
      chartAccounts,
      accountsNames[7],
    );

    const resultArray = [
      {
        id:
          (chartAccounts?.find((el) => el.name === 'Revenue')?.id ||
            Math.floor(Math.random() * 1000)) + 'a',
        chartName: 'Revenue',
        yearTotals: revenueAccount,
        isParent: !!chartAccounts?.find((el) => el.name === 'Revenue')
          ?.chartCategories?.length,
        monthTotals: null,
        chartType: 'Account',
      },
      {
        id:
          (chartAccounts?.find((el) => el.name === 'Cost of Goods Sold')?.id ||
            Math.floor(Math.random() * 1000)) + 'a',
        chartName: 'Cost of Goods Sold',
        yearTotals: costOfGoodsSoldAccount,
        isParent: !!chartAccounts?.find(
          (el) => el.name === 'Cost of Goods Sold',
        )?.chartCategories?.length,
        monthTotals: null,
        chartType: 'Account',
      },
      {
        id: (() => {
          const revenueId =
            chartAccounts?.find((el) => el.name === 'Revenue')?.id ?? '';
          const costOfGoodsSoldId =
            chartAccounts?.find((el) => el.name === 'Cost of Goods Sold')?.id ??
            '';

          if ([revenueId, costOfGoodsSoldId].includes('')) {
            return Math.floor(Math.random() * 1000) + 'da';
          } else {
            return `${revenueId}+${costOfGoodsSoldId}da`;
          }
        })(),
        chartName: 'Gross Profit',
        yearTotals: grossProfitAccount,
        isParent: false,
        monthTotals: null,
        chartType: 'Account',
      },
      {
        id:
          (chartAccounts?.find((el) => el.name === 'Expenses')?.id ||
            Math.floor(Math.random() * 1000)) + 'a',
        chartName: 'Expenses',
        yearTotals: expensesAccount,
        isParent: !!chartAccounts?.find((el) => el.name === 'Expenses')
          ?.chartCategories?.length,
        monthTotals: null,
        chartType: 'Account',
      },
      {
        id: (() => {
          const revenueId =
            chartAccounts?.find((el) => el.name === 'Revenue')?.id ?? '';
          const costOfGoodsSoldId =
            chartAccounts?.find((el) => el.name === 'Cost of Goods Sold')?.id ??
            '';
          const expensesId =
            chartAccounts?.find((el) => el.name === 'Expenses')?.id ?? '';

          if ([revenueId, costOfGoodsSoldId, expensesId].includes('')) {
            return Math.floor(Math.random() * 1000) + 'da';
          } else {
            return `${revenueId}+${costOfGoodsSoldId}+${expensesId}da`;
          }
        })(),
        chartName: 'Pre Tax Income',
        yearTotals: preTaxIncAccount,
        isParent: false,
        monthTotals: null,
        chartType: 'Account',
      },
      {
        id:
          (chartAccounts?.find((el) => el.name === 'Taxes')?.id ||
            Math.floor(Math.random() * 1000)) + 'a',
        chartName: 'Taxes',
        yearTotals: taxesAccount,
        isParent: !!chartAccounts?.find((el) => el.name === 'Taxes')
          ?.chartCategories?.length,
        monthTotals: null,
        chartType: 'Account',
      },
      {
        id: (() => {
          const revenueId =
            chartAccounts?.find((el) => el.name === 'Revenue')?.id ?? '';
          const costOfGoodsSoldId =
            chartAccounts?.find((el) => el.name === 'Cost of Goods Sold')?.id ??
            '';
          const expensesId =
            chartAccounts?.find((el) => el.name === 'Expenses')?.id ?? '';
          const taxesId =
            chartAccounts?.find((el) => el.name === 'Taxes')?.id ?? '';

          if (
            [revenueId, costOfGoodsSoldId, expensesId, taxesId].includes('')
          ) {
            return Math.floor(Math.random() * 1000) + 'da';
          } else {
            return `${revenueId}+${costOfGoodsSoldId}+${expensesId}+${taxesId}da`;
          }
        })(),
        chartName: 'Net Income',
        yearTotals: netIncAccount,
        isParent: false,
        monthTotals: null,
        chartType: 'Account',
      },
      {
        id:
          (chartAccounts?.find((el) => el.name === 'Inventory Shrinkage')?.id ||
            Math.floor(Math.random() * 1000)) + 'InSh',
        chartName: 'Inventory Shrinkage',
        yearTotals: inventoryShrinkage,
        isParent: !!chartAccounts?.find(
          (el) => el.name === 'Inventory Shrinkage',
        )?.chartCategories?.length,
        monthTotals: null,
        chartType: 'Account',
      },
    ];

    if (totalsArgs.queryType === 'months' && totalsArgs.targetYear) {
      resultArray[0]!.monthTotals = calculateAndCreateMonthlyArr(
        chartAccounts.find((account) => account.name === accountsNames[0]),
        totalsArgs.targetYear,
      );

      resultArray[1]!.monthTotals = calculateAndCreateMonthlyArr(
        chartAccounts.find((account) => account.name === accountsNames[1]),
        totalsArgs.targetYear,
      );

      resultArray[2]!.monthTotals = combineMonthlyArrays(
        resultArray[0]!.monthTotals,
        resultArray[1]!.monthTotals,
      );

      resultArray[3]!.monthTotals = calculateAndCreateMonthlyArr(
        chartAccounts.find((account) => account.name === accountsNames[3]),
        totalsArgs.targetYear,
      );

      resultArray[4]!.monthTotals = combineMonthlyArrays(
        resultArray[2]!.monthTotals,
        resultArray[3]!.monthTotals,
      );

      resultArray[5]!.monthTotals = calculateAndCreateMonthlyArr(
        chartAccounts.find((account) => account.name === accountsNames[5]),
        totalsArgs.targetYear,
      );

      resultArray[6]!.monthTotals = combineMonthlyArrays(
        resultArray[4]!.monthTotals,
        resultArray[5]!.monthTotals,
      );
      resultArray[7]!.monthTotals = calculateAndCreateMonthlyArr(
        chartAccounts.find((account) => account.name === accountsNames[7]),
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

    const chartCategories: any = await strapi.entityService.findMany(
      'api::chart-category.chart-category',
      {
        filters: {
          ...tenantFilter,
          chartAccount: {
            id: {
              $eq: totalsArgs.parentId,
            },
          },
        },
        fields: ['id', 'name'],
        populate: {
          dealTransactions: {
            filters: {
              status: {
                $in: ['Paid', 'Open', 'Refunded'],
              },
              ...locationFilter,
              ...currencyWithoutPointsFilter,
            },
            fields: ['paid', 'status', 'customCreationDate', 'dueDate'],
            populate: {
              sellingOrder: {
                fields: ['total', 'tax'],
              },
            },
          },
          chartSubcategories: {
            filters: {
              ...tenantFilter,
            },
            fields: ['id'],
          },
        },
        limit: 4,
        start: totalsArgs.startElem,
      },
    );

    for (let i = 0; i < chartCategories.length; i++) {
      categoriesArr.push({
        id: chartCategories[i].id,
        chartName: chartCategories[i].name,
        yearTotals: calculateYearlyAmount(chartCategories[i]) || [],
        isParent: !!chartCategories[i].chartSubcategories?.length,
        monthTotals: null,
        chartType: 'Category',
      });
    }

    if (totalsArgs.queryType === 'months' && totalsArgs.targetYear) {
      for (let i = 0; i < chartCategories.length; i++) {
        categoriesArr[i]!.monthTotals = calculateAndCreateMonthlyArr(
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
    totalsArgs.chartType === 'subcategory' &&
    totalsArgs.parentId &&
    !isNaN(totalsArgs.startElem)
  ) {
    const subcategoriesArr = [];

    const chartSubcategories = await strapi.entityService.findMany(
      'api::chart-subcategory.chart-subcategory',
      {
        filters: {
          ...tenantFilter,
          chartCategory: {
            id: {
              $eq: totalsArgs.parentId, // add to args account id(parent id)
            },
          },
        },
        fields: ['id', 'name'],
        populate: {
          dealTransactions: {
            filters: {
              status: {
                $in: ['Paid', 'Open', 'Refunded'],
              },
              ...locationFilter,
              ...currencyWithoutPointsFilter,
            },
            fields: ['paid', 'status', 'customCreationDate', 'dueDate'],
            populate: {
              sellingOrder: {
                fields: ['total', 'tax'],
              },
            },
          },
        },
        limit: 4,
        start: totalsArgs.startElem,
      },
    );

    for (let i = 0; i < chartSubcategories.length; i++) {
      subcategoriesArr.push({
        id: chartSubcategories[i].id + 's',
        chartName: chartSubcategories[i].name,
        yearTotals: calculateYearlyAmount(chartSubcategories[i]),
        isParent: false,
        monthTotals: null,
        chartType: 'Subcategory',
      });
    }

    if (totalsArgs.queryType === 'months' && totalsArgs.targetYear) {
      for (let i = 0; i < chartSubcategories.length; i++) {
        subcategoriesArr[i]!.monthTotals = calculateAndCreateMonthlyArr(
          chartSubcategories[i],
          totalsArgs.targetYear,
        );
      }
    }

    return {
      length: chartSubcategories?.length || 0,
      chartsTimeTotals: subcategoriesArr,
    };
  } else if (totalsArgs.queryType === 'incomeChart') {
    const lastSixMonthsStartDate = new Date();
    const thisMonthEnd = new Date();
    lastSixMonthsStartDate.setMonth(currentDate.getMonth() - 6, 1);
    thisMonthEnd.setMonth(thisMonthEnd.getMonth() + 1, 0);

    const incomeChartAccountsMonth = await strapi.entityService.findMany(
      'api::chart-account.chart-account',
      {
        fields: ['id', 'name'],
        populate: {
          dealTransactions: {
            filters: {
              ...tenantFilter,
              ...locationFilter,
              ...currencyWithoutPointsFilter,
              status: {
                $in: ['Paid', 'Open', 'Refunded'],
              },
              customCreationDate: {
                $between: [lastSixMonthsStartDate, thisMonthEnd],
              },
            },
            fields: ['paid', 'status', 'customCreationDate', 'dueDate'],
            populate: {
              sellingOrder: {
                fields: ['total', 'tax'],
              },
            },
          },
        },
      },
    );

    const revenueMonthArr = calculateAndCreateIncomeChartMonthlyArr(
      incomeChartAccountsMonth.find(
        (account) => account.name === accountsNames[0],
      ),
    );

    const CoGSMonthArr = calculateAndCreateIncomeChartMonthlyArr(
      incomeChartAccountsMonth.find(
        (account) => account.name === accountsNames[1],
      ),
    );

    const GrossProfitArr = combineMonthlyArrays(revenueMonthArr, CoGSMonthArr);

    const expensesMonthArr = calculateAndCreateIncomeChartMonthlyArr(
      incomeChartAccountsMonth.find(
        (account) => account.name === accountsNames[3],
      ),
    );

    //graph container
    const PreTaxIncomeArr = combineMonthlyArrays(
      GrossProfitArr,
      expensesMonthArr,
    );

    return {
      length: null,
      chartsTimeTotals: [
        {
          id: '1ic',
          chartName: 'Revenue',
          monthTotals: revenueMonthArr,
          isParent: false,
        },
        {
          id: '2ic',
          chartName: 'Cost of Goods Sold',
          monthTotals: CoGSMonthArr,
          isParent: false,
        },
        {
          id: '3ic',
          chartName: 'Cost of Goods Sold',
          monthTotals: expensesMonthArr,
          isParent: false,
        },
        {
          id: '4ic',
          chartName: 'Pre Tax Income',
          monthTotals: PreTaxIncomeArr,
          isParent: false,
        },
      ],
    };
  } else if (totalsArgs.queryType === 'dashboardChart') {
    const dashboardChartAccountsMonth = await strapi.entityService.findMany(
      'api::chart-account.chart-account',
      {
        fields: ['id', 'name'],
        populate: {
          dealTransactions: {
            filters: {
              ...tenantFilter,
              ...locationFilter,
              ...currencyWithoutPointsFilter,
              status: {
                $in: ['Paid', 'Open', 'Refunded'],
              },
              customCreationDate: {
                $between: [
                  new Date(`${currentYear}-01-01`),
                  new Date(`${parseInt(currentYear.toString()) + 1}-01-01`),
                ],
              },
            },
            fields: ['paid', 'status', 'customCreationDate', 'dueDate'],
            populate: {
              sellingOrder: {
                fields: ['total', 'tax'],
              },
            },
          },
        },
      },
    );

    const revenueMonthArr = calculateAndCreateMonthlyArr(
      dashboardChartAccountsMonth.find(
        (account) => account.name === accountsNames[0],
      ),
      currentYear,
    );

    const CoGSMonthArr = calculateAndCreateMonthlyArr(
      dashboardChartAccountsMonth.find(
        (account) => account.name === accountsNames[1],
      ),
      currentYear,
    );

    const GrossProfitArr = combineMonthlyArrays(revenueMonthArr, CoGSMonthArr);

    const expensesMonthArr = calculateAndCreateMonthlyArr(
      dashboardChartAccountsMonth.find(
        (account) => account.name === accountsNames[3],
      ),
      currentYear,
    );

    const PreTaxIncomeArr = combineMonthlyArrays(
      GrossProfitArr,
      expensesMonthArr,
    );

    const taxesMonthArr = calculateAndCreateMonthlyArr(
      dashboardChartAccountsMonth.find(
        (account) => account.name === accountsNames[5],
      ),
      currentYear,
    );

    const NetIncomeArr = combineMonthlyArrays(PreTaxIncomeArr, taxesMonthArr);

    const sumCoGSandExpensesArr = addArraysByMonth(
      CoGSMonthArr,
      expensesMonthArr,
    );

    const sumCost = addArraysByMonth(sumCoGSandExpensesArr, taxesMonthArr);

    return {
      length: null,
      chartsTimeTotals: [
        {
          id: '1dc',
          chartName: 'Revenue',
          monthTotals: revenueMonthArr,
          isParent: false,
        },
        {
          id: '2dc',
          chartName: 'Costs',
          monthTotals: sumCost,
          isParent: false,
        },
        {
          id: '3dc',
          chartName: 'Net Income',
          monthTotals: NetIncomeArr,
          isParent: false,
        },
      ],
    };
  }

  return {};
};
