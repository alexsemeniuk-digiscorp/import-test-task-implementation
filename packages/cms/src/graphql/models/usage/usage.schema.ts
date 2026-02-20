import {
  inputObjectType,
  mutationField,
  nonNull,
  objectType,
  queryField,
} from '@nexus/schema';

export const Plan = objectType({
  name: 'plan',
  definition: (t) => {
    t.string('priceId');
    t.float('amount');
    t.string('plan');
    t.string('description');
    t.string('category');
  },
});
export const Usage = objectType({
  name: 'usageLimit',
  definition: (t) => {
    t.nonNull.int('userCount');
    t.nonNull.int('monthlySMS');
    t.nonNull.int('monthlyEmail');
    t.nonNull.float('storage');
    t.nonNull.int('callTime');
    t.nonNull.int('inventoryItem');
    t.nonNull.int('callRecordingTime');
    t.nonNull.int('transcriptionTime');
    t.nonNull.int('smsReceiveCount');
    t.nonNull.int('smsSendCount');
    t.nonNull.int('mmsReceiveCount');
    t.nonNull.int('mmsSendCount');
    t.nonNull.int('giaApiCount');
    t.nonNull.int('igiApiCount');
  },
});

export const SubscribedPlan = objectType({
  name: 'SubscribedPlan',
  definition: (t) => {
    t.boolean('status');
    t.string('startDate');
    t.string('endDate');
    t.string('subscriptionId');
    t.field('plan', {
      type: Plan,
    });
  },
});

export const stripeInvoiceLineData = objectType({
  name: 'StripeInvoiceLineData',
  definition: (t) => {
    t.string('description');
  },
});

export const stripeInvoiceLine = objectType({
  name: 'StripeInvoiceLine',
  definition: (t) => {
    t.nonNull.list.field('data', {
      type: stripeInvoiceLineData,
    });
  },
});

export const stripeInvoices = objectType({
  name: 'StripeInvoices',
  definition: (t) => {
    t.nonNull.string('id');
    t.string('closed_at');
    t.int('created');
    t.string('hosted_invoice_url');
    t.string('invoice_pdf');
    t.string('last_payment_attempt');
    t.string('amount_paid');
    t.nonNull.field('lines', {
      type: stripeInvoiceLine,
    });
  },
});

const querySchema = [
  queryField('getSubscriptionDetails', {
    args: {
      input: nonNull(
        inputObjectType({
          name: 'SubscriptionArgInput',
          definition: (t) => {
            t.string('subscriptionId');
          },
        }),
      ),
    },
    type: objectType({
      name: 'SubscriptionResponse',
      definition: (t) => {
        t.string('plan');
        t.float('amount');
      },
    }),
  }),
  queryField('mySubscribedPlan', {
    args: {
      input: nonNull(
        inputObjectType({
          name: 'TenantStripeSubscribedPlanArgInput',
          definition: (t) => {
            t.string('tenantId');
          },
        }),
      ),
    },
    type: objectType({
      name: 'MySubscribedPlanResponse',
      definition: (t) => {
        t.string('trialPeriod');
        t.field('subscribedPlan', {
          type: SubscribedPlan,
        });
      },
    }),
  }),
  queryField('getPaymentMethods', {
    args: {
      input: nonNull(
        inputObjectType({
          name: 'PaymentMethodArgInput',
          definition: (t) => {
            t.nonNull.string('email');
          },
        }),
      ),
    },
    type: objectType({
      name: 'PaymentMethodResponse',
      definition: (t) => {
        t.nonNull.list.field('data', {
          type: nonNull('CardDetailsArray'),
        });
        t.nonNull.string('defaultPaymentMethod');
      },
    }),
  }),
  queryField('subscriptionBillingHistory', {
    args: {
      input: nonNull(
        inputObjectType({
          name: 'SubscriptionBillingHistoryArgInput',
          definition: (t) => {
            t.nonNull.string('subscriptionId');
          },
        }),
      ),
    },
    type: objectType({
      name: 'SubscriptionBillingHistoryResponse',
      definition: (t) => {
        t.nonNull.list.field('stripeInvoices', {
          type: nonNull(stripeInvoices),
        });
      },
    }),
  }),
  queryField('progressSummary', {
    type: objectType({
      name: 'ProgressSummaryResponse',
      definition: (t) => {
        t.nonNull.string('employees');
        t.nonNull.float('collected');
        t.nonNull.int('customers');
        t.nonNull.int('contracts');
        t.nonNull.int('smsSent');
        t.nonNull.int('forms');
        t.nonNull.int('inventoryItems');
        t.nonNull.int('marketingEmails');
        t.nonNull.int('tasksCompleted');
        t.nonNull.float('fileUploaded');
        t.nonNull.string('website');
        t.nonNull.int('stores');
        t.int('callRecording');
        t.int('transcription');
        t.int('smsReceived');
        t.int('mmsReceived');
        t.int('mmsSent');
        t.int('giaApi');
        t.int('igiApi');
      },
    }),
  }),
  queryField('serviceUsageData', {
    type: objectType({
      name: 'ServiceUsageDataResponse',
      definition: (t) => {
        t.nonNull.field('usageLimit', {
          type: Usage,
        });
        t.nonNull.field('usageCount', {
          type: Usage,
        });
      },
    }),
  }),
];

const mutationSchema = [
  mutationField('subscriptionPaymentIntent', {
    args: {
      input: nonNull(
        inputObjectType({
          name: 'subscriptionPaymentIntentInput',
          definition: (t) => {
            t.string('subscriptionId');
            t.string('paymentMethodId');
            t.string('email');
          },
        }),
      ),
    },
    type: objectType({
      name: 'subscriptionPaymentIntentResponse',
      definition: (t) => {
        t.string('clientSecret');
        t.string('paymentIntentId');
      },
    }),
  }),
  mutationField('subscriptionWithoutCard', {
    args: {
      input: nonNull(
        inputObjectType({
          name: 'SubscriptionWithoutCardInput',
          definition: (t) => {
            t.string('subscriptionId');
            t.string('email');
          },
        }),
      ),
    },
    type: objectType({
      name: 'SubscriptionWithoutCardResponse',
      definition: (t) => {
        t.boolean('status');
        t.string('message');
      },
    }),
  }),
  mutationField('cancelSubscription', {
    args: {
      input: nonNull(
        inputObjectType({
          name: 'CancelSubscriptionInput',
          definition: (t) => {
            t.string('subscriptionId');
          },
        }),
      ),
    },
    type: objectType({
      name: 'CancelSubscriptionResponse',
      definition: (t) => {
        t.boolean('status');
        t.nonNull.string('message');
      },
    }),
  }),
  mutationField('addPaymentMethod', {
    args: {
      input: nonNull(
        inputObjectType({
          name: 'AddPaymentMethodArgInput',
          definition: (t) => {
            t.nonNull.string('email');
            t.nonNull.string('paymentMethodId');
          },
        }),
      ),
    },
    type: objectType({
      name: 'AddPaymentMethodResponse',
      definition: (t) => {
        t.boolean('status');
      },
    }),
  }),
  mutationField('updateDefaultPaymentMethod', {
    args: {
      input: nonNull(
        inputObjectType({
          name: 'UpdateDefaultPaymentMethodArgInput',
          definition: (t) => {
            t.nonNull.string('email');
            t.nonNull.string('paymentMethodId');
          },
        }),
      ),
    },
    type: objectType({
      name: 'UpdateDefaultPaymentMethodResponse',
      definition: (t) => {
        t.boolean('status');
      },
    }),
  }),
  mutationField('subscribePlan', {
    args: {
      input: nonNull(
        inputObjectType({
          name: 'SubscribePlanArgInput',
          definition: (t) => {
            t.nonNull.string('email');
            t.nonNull.int('subscriptionId');
            t.nullable.string('paymentMethodId');
          },
        }),
      ),
    },
    type: objectType({
      name: 'SubscribePlanResponse',
      definition: (t) => {
        t.boolean('status');
      },
    }),
  }),
  mutationField('upgradePlanCharges', {
    args: {
      input: nonNull(
        inputObjectType({
          name: 'UpgradePlanChargesArgInput',
          definition: (t) => {
            t.nonNull.string('accountId');
            t.nonNull.int('subscriptionId');
          },
        }),
      ),
    },
    type: objectType({
      name: 'UpgradePlanChargesResponse',
      definition: (t) => {
        t.nonNull.boolean('status');
      },
    }),
  }),
];

export const usageSchema = [...querySchema, ...mutationSchema];
