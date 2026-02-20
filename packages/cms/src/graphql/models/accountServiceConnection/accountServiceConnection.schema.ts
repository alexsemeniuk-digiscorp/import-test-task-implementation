import {
  enumType,
  inputObjectType,
  mutationField,
  nonNull,
  objectType,
  queryField,
} from '@nexus/schema';
import { list } from '@nexus/schema/dist/core';

const EnumAccountServiceType = enumType({
  name: 'EnumAccountServiceType',
  members: ['quickBooks', 'xero', 'sage'],
});

const IdNameObject = objectType({
  name: 'IdNameObject',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('name');
    t.nullable.string('accountType');
  },
});

const XeroAccountObject = objectType({
  name: 'account',
  definition(t) {
    t.nullable.string('Name');
    t.nullable.string('Code');
    t.nullable.string('AccountID');
    t.nullable.string('Type');
    t.nullable.string('Class');
  },
});

const XeroServiceObject = objectType({
  name: 'service',
  definition(t) {
    t.nullable.string('Name');
    t.nullable.string('Code');
    t.boolean('IsTrackedAsInventory');
  },
});

const XeroTrackingOptionObject = objectType({
  name: 'XeroTrackingOptionObject',
  definition(t) {
    t.nonNull.string('Name');
    t.nonNull.string('Status');
    t.nonNull.string('TrackingCategoryID');
    t.nonNull.list.field('Options', {
      type: objectType({
        name: 'TrackingOption',
        definition(t) {
          t.nonNull.string('TrackingOptionID');
          t.nonNull.string('Name');
          t.nonNull.string('Status');
        },
      }),
    });
  },
});

export const ServiceJson = inputObjectType({
  name: 'ServiceJson',
  definition: (t) => {
    t.string('realmId');
    t.string('clientId');
    t.string('clientSecret');
    t.string('token');
    t.string('refreshToken');
    t.string('refreshToken');
    t.string('depositAccountId');
    t.string('class');
    t.string('liabilityAccountId');
  },
});

const querySchema = [
  queryField('getQuickBooksAuthUrl', {
    args: {
      input: nonNull(
        inputObjectType({
          name: 'QuickBooksAuthUrlInputArg',
          definition: (t) => {
            t.nonNull.id('tenantId');
            t.nonNull.id('businessLocationId');
          },
        }),
      ),
    },
    type: objectType({
      name: 'QuickBooksAuthUrlResponse',
      definition: (t) => {
        t.nonNull.string('url');
      },
    }),
  }),
  queryField('getQuickBooksAccountDetails', {
    args: {
      input: nonNull(
        inputObjectType({
          name: 'QuickbooksAccountDetailsInputArg',
          definition: (t) => {
            t.nonNull.id('businessLocationId');
            t.nullable.string('queryType');
          },
        }),
      ),
    },
    type: objectType({
      name: 'QuickbooksAccountDetailsResponse',
      definition(t) {
        t.field('taxAgency', { type: list(IdNameObject) });
        t.field('assets', { type: list(IdNameObject) });
        t.field('depositAccount', { type: list(IdNameObject) });
        t.nullable.field('class', { type: list(IdNameObject) });
        t.field('account', { type: list(IdNameObject) });
        t.field('billAccount', { type: list(IdNameObject) });
        t.field('paymentMethod', { type: list(IdNameObject) });
        t.field('item', { type: list(IdNameObject) });
        t.field('refundAccount', { type: list(IdNameObject) });
        t.field('department', { type: list(IdNameObject) });
      },
    }),
  }),
  queryField('getXeroAccountDetails', {
    args: {
      input: nonNull(
        inputObjectType({
          name: 'XeroAccountDetailsInputArg',
          definition: (t) => {
            t.nonNull.id('businessLocationId');
          },
        }),
      ),
    },
    type: objectType({
      name: 'XeroAccountDetailsResponse',
      definition(t) {
        t.field('accounts', { type: list(XeroAccountObject) });
        t.field('services', { type: list(XeroServiceObject) });
      },
    }),
  }),
  queryField('getXeroTrackingOptions', {
    args: {
      input: nonNull(
        inputObjectType({
          name: 'XeroTrackingOptionsInputArg',
          definition: (t) => {
            t.nonNull.id('businessLocationId');
          },
        }),
      ),
    },
    type: objectType({
      name: 'XeroTrackingOptionsResponse',
      definition(t) {
        t.field('trackingOptions', { type: list(XeroTrackingOptionObject) });
      },
    }),
  }),
];

const mutationSchema = [
  mutationField('authenticateQuickBooksUser', {
    args: {
      input: nonNull(
        inputObjectType({
          name: 'AuthenticateQuickBooksUserInputArg',
          definition: (t) => {
            t.int('storeId');
            t.string('url');
          },
        }),
      ),
    },
    type: objectType({
      name: 'AuthenticateQuickBooksUserResponse',
      definition(t) {
        t.nonNull.string('accessToken');
        t.nonNull.string('realmId');
        t.nonNull.string('refreshToken');
        t.nonNull.int('storeid');
      },
    }),
  }),
  mutationField('authenticateXero', {
    args: {
      input: nonNull(
        inputObjectType({
          name: 'AuthenticateXeroInputArg',
          definition: (t) => {
            t.nonNull.int('tenantId');
            t.nonNull.string('callbackUrl');
            t.nonNull.boolean('isAuthCallback');
            t.nonNull.int('bussinessLocationId');
          },
        }),
      ),
    },
    type: objectType({
      name: 'AuthenticateXeroResponse',
      definition(t) {
        t.nonNull.boolean('status');
        t.nonNull.string('consentUrl');
      },
    }),
  }),
  mutationField('disconnectXero', {
    args: {
      input: nonNull(
        inputObjectType({
          name: 'DisconnectXeroInputArg',
          definition: (t) => {
            t.nonNull.int('tenantId');
            t.nonNull.string('accountingServiceType');
            t.nonNull.int('bussinessLocationId');
          },
        }),
      ),
    },
    type: objectType({
      name: 'DisconnectXeroResponse',
      definition(t) {
        t.nonNull.boolean('status');
      },
    }),
  }),
  mutationField('disconnectQuickBooks', {
    args: {
      input: nonNull(
        inputObjectType({
          name: 'DisconnectQuickBooksInputArg',
          definition: (t) => {
            t.nonNull.int('tenantId');
            t.nonNull.int('bussinessLocationId');
          },
        }),
      ),
    },
    type: objectType({
      name: 'DisconnectQuickBooksResponse',
      definition(t) {
        t.nonNull.boolean('status');
      },
    }),
  }),
  mutationField('createAccountingService', {
    args: {
      input: nonNull(
        inputObjectType({
          name: 'CreateAccountingServiceInputArg',
          definition: (t) => {
            t.nonNull.id('tenant');
            t.nullable.field('serviceType', {
              type: EnumAccountServiceType,
            });
            t.field('serviceJson', {
              type: ServiceJson,
            });
          },
        }),
      ),
    },
    type: objectType({
      name: 'CreateAccountingServiceResponse',
      definition(t) {
        t.nonNull.string('status');
      },
    }),
  }),
  mutationField('updateAccountingService', {
    args: {
      input: nonNull(
        inputObjectType({
          name: 'UpdateAccountingServiceInputArg',
          definition: (t) => {
            t.nonNull.id('businessLocation');
            t.nullable.field('serviceType', {
              type: EnumAccountServiceType,
            });
            t.field('serviceJson', {
              type: ServiceJson,
            });
          },
        }),
      ),
    },
    type: objectType({
      name: 'UpdateAccountingServiceResponse',
      definition(t) {
        t.nonNull.string('status');
      },
    }),
  }),
  mutationField('disconnectQuickBooksAccount', {
    args: {
      input: nonNull(
        inputObjectType({
          name: 'disconnectQuickBooksAccountInputArg',
          definition: (t) => {
            t.nonNull.string('tenantId');
          },
        }),
      ),
    },
    type: objectType({
      name: 'disconnectQuickBooksAccountResponse',
      definition(t) {
        t.nonNull.boolean('status');
      },
    }),
  }),
];
export const accountServiceConnectionSchema = [
  ...mutationSchema,
  ...querySchema,
];
