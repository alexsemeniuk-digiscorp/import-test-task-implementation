import {
  booleanArg,
  enumType,
  idArg,
  inputObjectType,
  list,
  mutationField,
  nonNull,
  nullable,
  objectType,
  queryField,
  stringArg,
} from '@nexus/schema';

const EnumChartType = enumType({
  name: 'EnumChartType',
  members: ['Account', 'Category', 'Subcategory'],
});

const TimeTotals = objectType({
  name: 'TimeTotals',
  definition: (t) => {
    t.id('id');
    t.float('total');
    t.string('totalAsString');
    t.string('chartName');
    t.field('chartType', {
      type: EnumChartType,
    });
    t.boolean('isParent');
    t.list.field('yearTotals', {
      type: objectType({
        name: 'YearTotals',
        definition: (t) => {
          t.int('year');
          t.float('amount');
        },
      }),
    });
    t.list.field('monthTotals', {
      type: objectType({
        name: 'MonthTotals',
        definition: (t) => {
          t.string('month');
          t.float('amount');
        },
      }),
    });
  },
});

const BillingDetails = objectType({
  name: 'BillingDetails',
  definition: (t) => {
    t.string('email');
    t.string('name');
    t.string('phone'); // Assuming phone can be nullable
  },
});

const CardDetails = objectType({
  name: 'CardDetails',
  definition: (t) => {
    t.nonNull.string('brand');
    t.nonNull.string('country');
    t.nonNull.string('display_brand');
    t.nonNull.int('exp_month');
    t.nonNull.int('exp_year');
    t.nonNull.string('fingerprint');
    t.nonNull.string('funding');
    t.string('generated_from'); // Assuming generated_from can be nullable
    t.nonNull.string('last4');
    t.string('wallet'); // Assuming wallet can be nullable
  },
});

const CardDetailsArray = objectType({
  name: 'CardDetailsArray',
  definition: (t) => {
    t.nonNull.string('id');
    t.nonNull.field('card', { type: nonNull(CardDetails) });
    t.nonNull.field('billing_details', { type: nonNull(BillingDetails) });
  },
});

const querySchema = [
  queryField('cardTotals', {
    type: list(
      objectType<'CardTotals'>({
        name: 'CardTotals',
        definition: (t) => {
          t.id('id');
          t.string('name');
          t.float('total');
          t.string('totalAsString');
          t.float('percentage');
          t.string('description');
          t.string('type');
          t.int('cardImg');
          t.string('onCardClick');
        },
      }),
    ),
    args: {
      data: nonNull(
        inputObjectType({
          name: 'CardTotalsArg',
          definition: (t) => {
            t.string('pageName');
            t.id('businessLocation');
            t.list.string('entityIds');
            t.nullable.string('startPeriodDate');
            t.nullable.string('endPeriodDate');
            t.nullable.field('additionalFilters', { type: 'JSON' });
          },
        }),
      ),
    },
  }),
  queryField('chartsTimeTotalsWithLength', {
    args: {
      input: nonNull(
        inputObjectType({
          name: 'TimeTotalsArgs',
          definition: (t) => {
            t.string('queryType');
            t.string('chartType');
            t.nullable.string('targetYear');
            t.nullable.id('parentId');
            t.nullable.int('startElem');
            t.string('storeId');
            t.nullable.string('businessLocation');
          },
        }),
      ),
    },
    type: objectType({
      name: 'ChartsTimeTotalsWithLength',
      definition: (t) => {
        t.int('length');
        t.list.field('chartsTimeTotals', {
          type: TimeTotals,
        });
      },
    }),
  }),
  queryField('linkedPaymentTxInfo', {
    args: {
      input: nonNull(
        inputObjectType({
          name: 'LinkedPaymentTxInfoArgsInput',
          definition: (t) => {
            t.id('dealTransactionId');
          },
        }),
      ),
    },
    type: objectType({
      name: 'LinkedPaymentTxInfoResponse',
      definition: (t) => {
        t.id('id');
        t.string('orderId');
        t.float('summary');
        t.string('logo');
        t.string('accountId');
        t.string('paymentGatewayType');
        t.string('merchantId');
        t.string('terminalId');
        t.string('currency');
        t.string('locale');
      },
    }),
  }),
  queryField('getSavedCards', {
    args: {
      input: nonNull(
        inputObjectType({
          name: 'CardListArgsInput',
          definition: (t) => {
            t.string('email');
            t.string('accountId');
          },
        }),
      ),
    },
    type: nonNull(
      objectType({
        name: 'CardListResponse',
        definition: (t) => {
          t.nonNull.list.field('data', {
            type: nonNull(CardDetailsArray),
          });
          t.nonNull.string('customerId');
        },
      }),
    ),
  }),
];

const mutationSchema = [
  mutationField('removeCard', {
    args: {
      input: nonNull(
        inputObjectType({
          name: 'RemoveCardArgInput',
          definition: (t) => {
            t.nonNull.string('paymentMethodId');
            t.string('accountId');
          },
        }),
      ),
    },
    type: objectType({
      name: 'RemoveCardResponse',
      definition: (t) => {
        t.boolean('status');
      },
    }),
  }),
  mutationField('handlePaymentLinkRequest', {
    type: objectType({
      name: 'handlePaymentLinkRequestResponse',
      definition(t) {
        t.boolean('success');
        t.nullable.list.string('errors');
      },
    }),
    args: {
      paymentLink: stringArg(),
      email: stringArg(),
      contactId: nullable(idArg()),
      phone: stringArg(),
      sendBySms: nullable(booleanArg()),
      sendByEmail: nullable(booleanArg()),
      customSmsContactContent: nullable(stringArg()),
      customSmsSubjectContent: nullable(stringArg()),
      useCustomSmsContactContent: nullable(booleanArg()),
      useCustomSmsSubjectContent: nullable(booleanArg()),
      invoiceLink: nullable(stringArg()),
    },
  }),
  mutationField('createDealTransactionCustomer', {
    args: {
      input: nonNull(
        inputObjectType({
          name: 'CreateDealTransactionCustomerInput',
          definition: (t) => {
            t.string('dealTransactionId');
            t.string('chartAccount');
            t.string('dueDate');
            t.float('paid');
            t.string('repetitive');
            t.string('sellingOrder');
            t.nonNull.string('status');
            t.float('summary');
            t.string('tenantId');
            t.field('clearentInfo', { type: 'JSON' });
            t.field('stripeInfo', { type: 'JSON' });
            t.string('paymentGatewayType');
            t.string('paymentMethod');
            t.field('clearentError', { type: 'JSON' });
          },
        }),
      ),
    },
    type: objectType({
      name: 'CreateDealTransactionCustomerResponse',
      definition: (t) => {
        t.boolean('status');
      },
    }),
  }),
  mutationField('createDealTransactionInventoryShrinkage', {
    args: {
      input: nonNull(
        inputObjectType({
          name: 'CreateDealTransactionInventoryShrinkageInput',
          definition: (t) => {
            t.nonNull.string('adjustmentID');
          },
        }),
      ),
    },
    type: objectType({
      name: 'CreateDealTransactionInventoryShrinkageResponse',
      definition: (t) => {
        t.string('status');
      },
    }),
  }),
  mutationField('updateDealTransactionClearent', {
    args: {
      input: nonNull(
        inputObjectType({
          name: 'UpdateDealTransactionClearentArgsInput',
          definition: (t) => {
            t.id('dealTransactionId');
            t.field('clearentInfo', { type: 'JSON' });
            t.field('clearentError', { type: 'JSON' });
          },
        }),
      ),
    },
    type: objectType({
      name: 'UpdateDealTransactionClearentResponse',
      definition: (t) => {
        t.boolean('status');
      },
    }),
  }),
];

export const dealTransactionSchema = [...querySchema, ...mutationSchema];
