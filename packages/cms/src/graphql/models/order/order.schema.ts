import {
  enumType,
  extendType,
  inputObjectType,
  mutationField,
  nonNull,
  objectType,
  queryField,
} from '@nexus/schema';

const EnumRecurringPeriodType = enumType({
  name: 'EnumRecurringPeriodType',
  members: ['once', 'weekly', 'monthly', 'yearly', 'daily'],
});

const EnumSalesByItemCategory = enumType({
  name: 'EnumSalesByItemCategory',
  members: ['Revenue', 'Category', 'Item', 'Subitem'],
});

const SalesByItemCategory = objectType({
  name: 'SalesByItemCategory',
  definition: (t) => {
    t.id('id');
    t.float('total');
    t.string('chartName');
    t.string('chartItemCategory');
    t.string('chartItemUuid');
    t.string('chartItemImageUrl');
    t.field('chartType', {
      type: EnumSalesByItemCategory,
    });
    t.boolean('isParent');
    t.list.field('yearTotals', {
      type: objectType({
        name: 'YearTotalsReport',
        definition: (t) => {
          t.int('year');
          t.float('amount');
        },
      }),
    });
    t.list.field('monthTotals', {
      type: objectType({
        name: 'MonthTotalsReport',
        definition: (t) => {
          t.string('month');
          t.float('amount');
        },
      }),
    });
  },
});

export const SoldRevenueInput = inputObjectType({
  name: 'SoldRevenueInput',
  definition: (t) => {
    t.nonNull.field('startDate', { type: 'DateTime' });
    t.nonNull.field('endDate', { type: 'DateTime' });
    t.int('businessLocationId');
  },
});

export const CustomerInput = inputObjectType({
  name: 'CustomerInput',
  definition: (t) => {
    t.string('email');
    t.string('name');
  },
});

export const PosTerminalListArray = objectType({
  name: 'PosTerminalListArray',
  definition: (t) => {
    t.nonNull.string('id');
    t.nonNull.string('object');
    t.nullable.string('device_sw_version');
    t.nullable.string('device_type');
    t.nullable.string('ip_address');
    t.nullable.string('label');
    t.nullable.string('last_seen_at');
    t.nullable.boolean('livemode');
    t.nullable.string('location');
    t.nullable.string('serial_number');
    t.nullable.string('status');
  },
});

const InventoryPurchaseFormInput = nonNull(
  inputObjectType({
    name: 'InventoryPurchaseFormInput',
    definition(t) {
      t.nonNull.list.nonNull.field('preparedArrayProductInventory', {
        type: inputObjectType({
          name: 'PreparedArrayProductInventoryInput',
          definition(t) {
            t.nonNull.string('productInventoryItem');
            t.string('sublocationId');
            t.nonNull.int('quantity');
            t.nonNull.string('orderItem');
            t.nonNull.list.string('sublocations');
            t.nonNull.list.string('sublocationItems');
          },
        }),
      });
      t.field('serialsNumbers', {
        type: 'JSON',
      });
    },
  }),
);

const mutationSchema = [
  mutationField('addDiscount', {
    type: 'OrderEntityResponse',
    args: {
      input: nonNull(
        inputObjectType({
          name: 'OrderDiscountInput',
          definition: (t) => {
            t.nonNull.id('id');
            t.nonNull.id('orderId');
          },
        }),
      ),
    },
  }),
  mutationField('removeDiscount', {
    type: 'OrderEntityResponse',
    args: {
      input: nonNull(
        inputObjectType({
          name: 'OrderDiscountRemoveInput',
          definition: (t) => {
            t.nonNull.id('id');
            t.nonNull.id('orderId');
          },
        }),
      ),
    },
  }),
  mutationField('addFollowingTransactions', {
    type: 'OrderEntityResponse',
    args: {
      input: nonNull(
        inputObjectType({
          name: 'OrderFollowingTransactionsInput',
          definition: (t) => {
            t.nonNull.id('orderId');
            t.nullable.float('recurringAmount');
            t.nullable.field('recurringPeriod', {
              type: EnumRecurringPeriodType,
            });
            t.nullable.int('recurringPeriodCount');
            t.nullable.float('singlePayment');
            t.nullable.int('paymentMethod');
            t.nullable.int('divideRemainder');
            t.nullable.field('orderDueDate', { type: 'DateTime' });
          },
        }),
      ),
    },
  }),
  mutationField('addFollowingGatewayTransactions', {
    type: 'OrderEntityResponse',
    args: {
      input: nonNull(
        inputObjectType({
          name: 'OrderFollowingGatewayTransactionsInput',
          definition: (t) => {
            t.nonNull.id('orderId');
            t.nullable.float('recurringAmount');
            t.nullable.field('recurringPeriod', {
              type: EnumRecurringPeriodType,
            });
            t.nullable.int('recurringPeriodCount');
            t.nullable.float('singlePayment');
            t.nullable.int('paymentMethod');
            t.nullable.int('divideRemainder');
            t.nullable.field('orderDueDate', { type: 'DateTime' });
          },
        }),
      ),
    },
  }),
  mutationField('addTip', {
    type: 'OrderEntityResponse',
    args: {
      input: nonNull(
        inputObjectType({
          name: 'OrderTipInput',
          definition: (t) => {
            t.nonNull.float('tip');
            t.nonNull.id('orderId');
            t.nullable.boolean('isResetTip');
          },
        }),
      ),
    },
  }),
  mutationField('generateInvoice', {
    type: 'Invoice',
    args: {
      input: nonNull(
        inputObjectType({
          name: 'OrderInvoiceInput',
          definition: (t) => {
            t.nonNull.id('orderId');
          },
        }),
      ),
    },
  }),
  mutationField('generateEstimate', {
    type: 'Estimate',
    args: {
      input: nonNull(
        inputObjectType({
          name: 'OrderEstimateInput',
          definition: (t) => {
            t.nonNull.id('orderId');
          },
        }),
      ),
    },
  }),
  mutationField('addPoints', {
    type: 'OrderEntityResponse',
    args: {
      input: nonNull(
        inputObjectType({
          name: 'OrderPointsInput',
          definition: (t) => {
            t.nonNull.float('points');
            t.nonNull.id('orderId');
          },
        }),
      ),
    },
  }),
  mutationField('updateCustomerOrder', {
    type: 'OrderEntityResponse',
    args: {
      input: nonNull(
        inputObjectType({
          name: 'UpdateCustomerOrderInput',
          definition: (t) => {
            t.nonNull.string('info');
            t.nonNull.id('orderId');
          },
        }),
      ),
    },
  }),
  mutationField('orderPayment', {
    args: {
      input: nonNull(
        inputObjectType({
          name: 'OrderPaymentArgInput',
          definition: (t) => {
            t.nonNull.string('orderId');
            t.string('paymentMethodId');
            t.boolean('saveMyCard');
            t.field('customer', {
              type: CustomerInput,
            });
            t.string('accountId');
          },
        }),
      ),
    },
    type: objectType({
      name: 'OrderPaymentResponse',
      definition: (t) => {
        t.nullable.string('paymentIntentId');
        t.nullable.string('clientSecret');
        t.nullable.string('dealTransactionsId');
        t.nullable.string('runningTxnId');
        t.boolean('status');
        t.nullable.string('message');
      },
    }),
  }),
  mutationField('createPaymentIntentForPos', {
    args: {
      input: nonNull(
        inputObjectType({
          name: 'CreatePaymentIntentForPosInput',
          definition: (t) => {
            t.nonNull.string('terminalId');
            t.nonNull.string('orderId');
            t.nonNull.string('accountId');
          },
        }),
      ),
    },
    type: objectType({
      name: 'CreatePaymentIntentForPosResponse',
      definition: (t) => {
        t.nonNull.string('paymentIntent');
        t.nonNull.string('clientSecret');
        t.string('dealTransactionId');
      },
    }),
  }),
  mutationField('cancelPaymentIntentForPos', {
    args: {
      input: nonNull(
        inputObjectType({
          name: 'CancelPaymentIntentForPosInput',
          definition: (t) => {
            t.nonNull.string('paymentIntentId');
            t.nonNull.string('accountId');
            t.string('terminalId');
          },
        }),
      ),
    },
    type: objectType({
      name: 'CancelPaymentIntentForPosResponse',
      definition: (t) => {
        t.nonNull.boolean('status');
      },
    }),
  }),
  mutationField('createLocationForPos', {
    args: {
      input: nonNull(
        inputObjectType({
          name: 'CreateLocationForPosInput',
          definition: (t) => {
            t.nonNull.string('display_name');
            t.nonNull.string('registration_code');
            t.nonNull.field('address', {
              type: inputObjectType({
                name: 'Address',
                definition: (t) => {
                  t.nonNull.string('line1');
                  t.nonNull.string('city');
                  t.nonNull.string('state');
                  t.nonNull.string('postal_code');
                  t.nonNull.string('country');
                },
              }),
            });
            t.nonNull.string('accountId');
          },
        }),
      ),
    },
    type: objectType({
      name: 'CreateLocationForPosResponse',
      definition: (t) => {
        t.nonNull.string('locationId');
      },
    }),
  }),
  mutationField('addPaymentMethodCustomer', {
    args: {
      input: nonNull(
        inputObjectType({
          name: 'AddPaymentMethodCustomerArgInput',
          definition: (t) => {
            t.nonNull.string('email');
            t.nonNull.string('paymentMethodId');
            t.string('accountId');
          },
        }),
      ),
    },
    type: objectType({
      name: 'AddPaymentMethodCustomerResponse',
      definition: (t) => {
        t.boolean('status');
      },
    }),
  }),
  mutationField('removePosLocation', {
    args: {
      input: nonNull(
        inputObjectType({
          name: 'RemovePosLocationInput',
          definition: (t) => {
            t.nonNull.string('terminalId');
          },
        }),
      ),
    },
    type: objectType({
      name: 'RemovePosLocationResponse',
      definition: (t) => {
        t.nonNull.boolean('status');
      },
    }),
  }),
  mutationField('updateInventoryAfterPurchase', {
    type: 'Boolean',
    args: {
      input: nonNull(
        inputObjectType({
          name: 'UpdateInventoryAfterPurchaseInput',
          definition: (t) => {
            t.nonNull.id('orderId');
            t.list.nonNull.field('products', {
              type: inputObjectType({
                name: 'PurchaseProductInput',
                definition: (t) => {
                  t.nonNull.id('id');
                  t.int('quantity');
                },
              }),
            });
          },
        }),
      ),
    },
  }),
  mutationField('updateStripePaymentMethodType', {
    args: {
      input: nonNull(
        inputObjectType({
          name: 'StripePaymentMethodTypeInput',
          definition: (t) => {
            t.nonNull.string('accountId');
            t.nonNull.string('paymentIntentId');
            t.nonNull.string('dealTransactionId');
          },
        }),
      ),
    },
    type: objectType({
      name: 'UpdateStripePaymentMethodTypeResponse',
      definition: (t) => {
        t.nonNull.boolean('status');
        t.string('message');
      },
    }),
  }),
  mutationField('createOrdersFromCSV', {
    type: 'String',
    args: {
      input: nonNull(
        inputObjectType({
          name: 'CreateOrdersFromCSVInput',
          definition: (t) => {
            t.field('uploadCsv', { type: 'Upload' });
            t.boolean('createNewMode');
          },
        }),
      ),
    },
  }),
  mutationField('moveWholesaleToSell', {
    type: 'OrderEntityResponse',
    args: {
      input: nonNull(
        inputObjectType({
          name: 'WholesaleToSellInput',
          definition: (t) => {
            t.nonNull.id('id');
          },
        }),
      ),
    },
  }),
  mutationField('inventoryPurchaseFormMutation', {
    args: {
      input: InventoryPurchaseFormInput,
    },
    type: objectType({
      name: 'InventoryPurchaseFormResponse',
      definition: (t) => {
        t.string('success');
      },
    }),
  }),
  // mutationField('syncAttachmentWithAccountingServices', {
  //   args: {
  //     input: nonNull(
  //       inputObjectType({
  //         name: 'SyncAttachmentWithAccountingInput',
  //         definition: (t) => {
  //           t.nullable.field('serviceType', {
  //             type: 'EnumAccountServiceType',
  //           });
  //           t.nullable.int('orderId');
  //         },
  //       }),
  //     ),
  //   },
  //   type: objectType({
  //     name: 'SyncAttachmentWithAccountingResponse',
  //     definition: (t) => {
  //       t.nonNull.boolean('status');
  //     },
  //   }),
  // }),
  mutationField('splitOrder', {
    args: {
      input: nonNull(
        inputObjectType({
          name: 'SplitOrderInput',
          definition: (t) => {
            t.nonNull.string('orderId');
            t.list.field('productItems', {
              type: inputObjectType({
                name: 'SplitOrderItemInput',
                definition: (t) => {
                  t.nonNull.id('id');
                  t.nonNull.int('quantity');
                },
              }),
            });
            t.list.field('serviceItems', {
              type: inputObjectType({
                name: 'SplitOrderServiceItemInput',
                definition: (t) => {
                  t.nonNull.id('id');
                  t.nonNull.int('quantity');
                },
              }),
            });
            t.list.field('compositeProductItems', {
              type: inputObjectType({
                name: 'SplitOrderCompositeProductItemInput',
                definition: (t) => {
                  t.nonNull.id('id');
                  t.nonNull.int('quantity');
                },
              }),
            });
            t.list.field('membershipItems', {
              type: inputObjectType({
                name: 'SplitOrderMembershipItemInput',
                definition: (t) => {
                  t.nonNull.id('id');
                  t.nonNull.int('quantity');
                },
              }),
            });
            t.list.field('classItems', {
              type: inputObjectType({
                name: 'SplitOrderClassItemInput',
                definition: (t) => {
                  t.nonNull.id('id');
                  t.nonNull.int('quantity');
                },
              }),
            });
            t.nullable.int('memo');
          },
        }),
      ),
    },
    type: objectType({
      name: 'SplitOrderResponse',
      definition: (t) => {
        t.nonNull.string('newOrderId');
      },
    }),
  }),
  mutationField('notifyOrderCustomer', {
    args: {
      input: nonNull(
        inputObjectType({
          name: 'NotifyOrderCustomerInput',
          definition: (t) => {
            t.string('email');
            t.string('phoneNumber');
            t.string('content');
            t.string('orderName');
            t.string('subjectEmail');
            t.string('customSmsSubjectContent');
            t.string('subjectPhone');
            t.nonNull.string('orderId');
          },
        }),
      ),
    },
    type: objectType({
      name: 'NotifyOrderCustomerResponse',
      definition(t) {
        t.boolean('success');
        t.nullable.list.string('errors');
      },
    }),
  }),
];

const querySchema = [
  queryField('getPosTerminalList', {
    args: {
      input: nonNull(
        inputObjectType({
          name: 'getPosTerminalListInput',
          definition: (t) => {
            t.int('limitCount');
            t.string('accountId');
          },
        }),
      ),
    },
    type: nonNull(
      objectType({
        name: 'getPosTerminalListResponse',
        definition: (t) => {
          t.nonNull.list.field('data', {
            type: nonNull(PosTerminalListArray),
          });
        },
      }),
    ),
  }),
  queryField('salesByItemCategoryReport', {
    args: {
      input: nonNull(
        inputObjectType({
          name: 'SalesByItemCategoryArgs',
          definition: (t) => {
            t.string('queryType');
            t.string('chartType');
            t.nullable.string('targetYear');
            t.nullable.id('parentId');
            t.nullable.int('startElem');
            t.nullable.field('additionalFilters', { type: 'JSON' });
          },
        }),
      ),
    },
    type: objectType({
      name: 'salesByItemCategoryReport',
      definition: (t) => {
        t.int('length');
        t.list.field('chartsTimeTotals', {
          type: SalesByItemCategory,
        });
      },
    }),
  }),
  queryField('reportExportCSV', {
    args: {
      input: nonNull(
        inputObjectType({
          name: 'ReportExportCSVArg',
          definition: (t) => {
            t.string('reportName');
            t.nullable.field('additionalFilters', { type: 'JSON' });
            t.nullable.list.string('extraColumns');
            t.nullable.field('period', {
              type: inputObjectType({
                name: 'ReportExportCSVPeriodInput',
                definition: (t) => {
                  t.string('lte');
                  t.string('gte');
                },
              }),
            });
          },
        }),
      ),
    },
    type: objectType({
      name: 'ReportExportCSV',
      definition: (t) => {
        t.string('reportExportCSVString');
      },
    }),
  }),
  queryField('reportExportData', {
    args: {
      input: nonNull(
        inputObjectType({
          name: 'ReportExportDataArg',
          definition: (t) => {
            t.string('reportName');
            t.nullable.field('additionalFilters', { type: 'JSON' });
            t.nullable.field('period', {
              type: inputObjectType({
                name: 'ReportExportDataPeriodInput',
                definition: (t) => {
                  t.string('lte');
                  t.string('gte');
                },
              }),
            });
          },
        }),
      ),
    },
    type: objectType({
      name: 'ReportExportData',
      definition: (t) => {
        t.string('reportExportDataJSON');
      },
    }),
  }),
];

const typeSchema = [
  extendType<'Order'>({
    type: 'Order',
    definition: (t) => {
      t.nonNull.field('getCreateDate', {
        type: 'DateTime',
      });
      t.nullable.int('itemsAmount');
      t.nullable.float('productsPortion');
      t.nullable.float('compositeProductsPortion');
      t.nullable.float('servicesPortion');
      t.nullable.float('preTaxSales');
      t.nullable.float('amountPaidPreTax');
      t.nullable.float('paidSummary');
      t.nullable.float('taxPortion');
      t.nullable.string('specifiedTaxPortions');
      t.nullable.string('specifiedTaxPortionsAdjustedPrices');
    },
  }),
];

export const orderSchema = [...mutationSchema, ...typeSchema, ...querySchema];
