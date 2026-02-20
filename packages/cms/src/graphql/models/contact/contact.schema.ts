import {
  enumType,
  extendType,
  inputObjectType,
  mutationField,
  nonNull,
  objectType,
  queryField,
} from '@nexus/schema';

const EnumCrmType = enumType({
  name: 'EnumCrmType',
  members: ['contact', 'company', 'lead'],
});

export const EnumImportingType = enumType({
  name: 'EnumImportingType',
  members: [
    'orders',
    'products',
    'contacts',
    'contactRelations',
    'updateDefaultPrice',
    'wishlist',
    'companies',
  ],
});

export const EnumImportStatus = enumType({
  name: 'EnumImportStatus',
  members: ['completedImports', 'unvalidatedImports', 'needChangeCreations'],
});

const AccountingServiceEnum = enumType({
  name: 'AccountingServiceEnum',
  members: ['quickBooks', 'xero', 'sage'], // Use uppercase for enum values
});

const StatisticCardStagesEnum = enumType({
  name: 'StatisticCardStages',
  members: {
    ACCEPTED: 'accepted',
    PENDING: 'pending',
    PAID: 'paid',
    OUTSTANDING: 'outstanding',
    OVERDUE: 'overdue',
    COMPLETED: 'completed',
    SALES: 'sales',
    LAYAWAY: 'layaway',
    DECLINED: 'declined',
    RENT: 'rent',
    TRADE_IN: 'trade in',
    PURCHASE: 'purchase',
    TOTAL: 'total',
    DUE: 'due',
    STARTED: 'started',
    PLACED: 'placed',
    RECEIVED: 'received',
  },
});

const CustomBadgeStatusEnum = enumType({
  name: 'CustomBadgeStatus',
  members: ['default', 'success', 'processing', 'error', 'warning'],
});

const ValueFormatEnum = enumType({
  name: 'ValueFormat',
  members: ['default', 'money'],
});

const PaginationImportingArg = inputObjectType({
  name: 'PaginationImportingArg',
  definition(t) {
    t.nonNull.int('page');
    t.nonNull.int('pageSize');
  },
});

const CrmSingleStatisticCard = objectType({
  name: 'CrmSingleStatisticCard',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.float('value');
    t.nonNull.field('stage', { type: StatisticCardStagesEnum });
    t.nonNull.field('badgeType', { type: CustomBadgeStatusEnum });
    t.field('valueFormat', { type: ValueFormatEnum });
    t.string('link');
  },
});

const StatisticResults = objectType({
  name: 'StatisticResults',
  definition(t) {
    t.nonNull.list.nonNull.field('invoices', { type: CrmSingleStatisticCard });
    t.nonNull.list.nonNull.field('forms', { type: CrmSingleStatisticCard });
    t.nonNull.list.nonNull.field('contracts', { type: CrmSingleStatisticCard });
    t.nonNull.list.nonNull.field('appraisals', {
      type: CrmSingleStatisticCard,
    });
    t.nonNull.list.nonNull.field('purchaseRequests', {
      type: CrmSingleStatisticCard,
    });
    t.nonNull.list.nonNull.field('tasks', { type: CrmSingleStatisticCard });
    t.nonNull.list.nonNull.field('orders', { type: CrmSingleStatisticCard });
  },
});

const CrmCustomField = inputObjectType({
  name: 'CrmCustomField',
  definition: (t) => {
    t.id('id');
    t.string('name');
  },
});

const CrmRelationField = inputObjectType({
  name: 'CrmRelationField',
  definition: (t) => {
    t.id('id');
    t.id('toContact');
    t.id('relationType');
  },
});

export const DatesList = {
  data: nonNull(
    inputObjectType({
      name: 'DatesList',
      definition: (t) => {
        t.string('lte');
        t.string('gte');
      },
    }),
  ),
};

const typeSchema = [
  extendType<'Contact'>({
    type: 'Contact',
    definition: (t) => {
      t.nonNull.field('getCreateDate', {
        type: 'DateTime',
      });
      t.nullable.float('calculatedSpent');
      t.nullable.int('totalItemsPurchased');
      t.nullable.float('biggestOrderValue');
      t.nullable.string('phoneNumber');
      t.nonNull.string('email');
      t.nullable.string('address');
      t.nullable.string('identityNumber');
      t.nullable.field('lastPurchaseDate', { type: 'DateTime' });
      t.nullable.int('numberOfOrders');
      t.nullable.float('annualRevenue');
      t.nullable.float('onDeposit');
      t.nullable.float('biggestTransaction');
      t.nullable.float('numberOfTransactions');
      t.nullable.float('calculatedOwes');
      t.nullable.float('netAmountOwed');
      t.nullable.field('amountSpentInPeriod', {
        type: 'Float',
        args: DatesList,
      });
      t.nullable.field('itemsPurchasedInPeriod', {
        type: 'Float',
        args: DatesList,
      });
      t.nullable.string('calculatedCustomFields');
    },
  }),
];

const mutationSchema = [
  mutationField('updateContactsCustomFields', {
    type: 'ContactEntityResponse',
    args: {
      input: nonNull(
        inputObjectType({
          name: 'CrmCustomFieldsInput',
          definition: (t) => {
            t.nonNull.list.field('newDataArray', { type: CrmCustomField });
            t.nonNull.list.field('deletedArray', { type: CrmCustomField });
            t.nonNull.list.field('namesChangedArray', { type: CrmCustomField });
            t.nonNull.field('crmType', {
              type: EnumCrmType,
            });
          },
        }),
      ),
    },
  }),
  mutationField('handleRelationFields', {
    type: 'ContactEntityResponse',
    args: {
      input: nonNull(
        inputObjectType({
          name: 'HandleRelationFieldsInput',
          definition: (t) => {
            t.nonNull.list.field('newDataArray', { type: CrmRelationField });
            t.nonNull.list.field('deletedArray', { type: CrmRelationField });
            t.nonNull.list.field('namesChangedArray', {
              type: CrmRelationField,
            });
            t.nonNull.field('crmType', {
              type: EnumCrmType,
            });
            t.nonNull.id('entityId');
          },
        }),
      ),
    },
  }),
  mutationField('createContactsFromCSV', {
    type: 'String',
    args: {
      input: nonNull(
        inputObjectType({
          name: 'CreateContactsFromCSVInput',
          definition: (t) => {
            t.field('uploadCsv', { type: 'Upload' });
          },
        }),
      ),
    },
  }),
  mutationField('createContactRelationsFromCSV', {
    type: 'String',
    args: {
      input: nonNull(
        inputObjectType({
          name: 'CreateContactRelationsFromCSVInput',
          definition: (t) => {
            t.field('uploadCsv', { type: 'Upload' });
          },
        }),
      ),
    },
  }),
  mutationField('createWishlistFromCsv', {
    type: 'String',
    args: {
      input: nonNull(
        inputObjectType({
          name: 'CreateWishlistFromCSVInput',
          definition: (t) => {
            t.field('uploadCsv', { type: 'Upload' });
          },
        }),
      ),
    },
  }),
  mutationField('cancelImportingSession', {
    type: objectType({
      name: 'CancelImportingSessionResponse',
      definition: (t) => {
        t.boolean('success');
      },
    }),
    args: {
      input: nonNull(
        inputObjectType({
          name: 'CancelImportingSessionInput',
          definition: (t) => {
            t.nonNull.field('importingIdentifier', { type: EnumImportingType });
            t.nonNull.field('importingSessionIdentifier', {
              type: EnumImportingType,
            });
          },
        }),
      ),
    },
  }),
  mutationField('fastUpdateAllContactsFromCSV', {
    type: 'String',
    args: {
      input: nonNull(
        inputObjectType({
          name: 'FastUpdateAllContactsFromCSVInput',
          definition: (t) => {
            t.string('csvContentJson');
          },
        }),
      ),
    },
  }),
  mutationField('fastUpdateSingleContact', {
    type: 'String',
    args: {
      input: nonNull(
        inputObjectType({
          name: 'FastUpdateSingleContactInput',
          definition: (t) => {
            t.string('csvSingleContactJson');
          },
        }),
      ),
    },
  }),
  mutationField('handleAdditionalFields', {
    type: 'ContactEntityResponse',
    args: {
      input: nonNull(
        inputObjectType({
          name: 'HandleAdditionalFieldsInput',
          definition: (t) => {
            t.nonNull.id('contactId');
            t.nonNull.list.string('additionalEmails');
            t.nonNull.list.string('additionalPhoneNumbers');
            t.nonNull.list.string('additionalAddresses');
          },
        }),
      ),
    },
  }),
  mutationField('deleteImportingContact', {
    type: objectType({
      name: 'DeleteImportingContactResponse',
      definition: (t) => {
        t.boolean('success');
      },
    }),
    args: {
      input: nonNull(
        inputObjectType({
          name: 'DeleteImportingContactInput',
          definition: (t) => {
            t.nullable.string('importingField');
            t.nonNull.field('keyType', { type: EnumImportStatus });
            t.nullable.boolean('isAll');
            t.nonNull.field('importingIdentifier', { type: EnumImportingType });
          },
        }),
      ),
    },
  }),
  mutationField('revertImportingSession', {
    type: objectType({
      name: 'RevertImportingSessionResponse',
      definition: (t) => {
        t.boolean('success');
      },
    }),
    args: {
      input: nonNull(
        inputObjectType({
          name: 'RevertImportingSessionInput',
          definition: (t) => {
            t.nullable.string('sessionId');
          },
        }),
      ),
    },
  }),
  mutationField('prevContactSyncWithAccountingService', {
    type: 'Boolean',
    args: {
      input: nonNull(
        inputObjectType({
          name: 'prevContactSyncWithAccountingServiceInput',
          definition: (t) => {
            t.field('serviceType', { type: nonNull(AccountingServiceEnum) });
            t.int('tenantId');
          },
        }),
      ),
    },
  }),
];

const querySchema = [
  queryField('dashboardCrmCustomersData', {
    type: 'String',
  }),
  queryField('getSingleContactStatisticForCrmCards', {
    type: StatisticResults,
    args: {
      input: nonNull(
        inputObjectType({
          name: 'CrmSingleCardTotalsInput',
          definition: (t) => {
            t.string('customerId');
          },
        }),
      ),
    },
  }),
  queryField('getSessionImportingContacts', {
    type: 'String',
    args: {
      input: nonNull(
        inputObjectType({
          name: 'SessionImportingInput',
          definition: (t) => {
            t.field('completedData', { type: PaginationImportingArg });
            t.field('updatedData', { type: PaginationImportingArg });
            t.field('spoiledData', { type: PaginationImportingArg });
            t.nullable.string('generatedRegex');
            t.nonNull.field('importingIdentifier', { type: EnumImportingType });
          },
        }),
      ),
    },
  }),
  queryField('getSessionImportingContactsProcessInfo', {
    type: objectType({
      name: 'SessionImportingContactsProcessInfo',
      definition: (t) => {
        t.int('totalFields');
        t.int('processedFields');
      },
    }),
    args: {
      input: nonNull(
        inputObjectType({
          name: 'SessionImportingProcessInfoInput',
          definition: (t) => {
            t.nullable.string('generatedRegex');
            t.nonNull.field('importingIdentifier', { type: EnumImportingType });
            t.field('completedData', { type: PaginationImportingArg });
            t.field('updatedData', { type: PaginationImportingArg });
            t.field('spoiledData', { type: PaginationImportingArg });
          },
        }),
      ),
    },
  }),
];

const OperatorValueInput = inputObjectType({
  name: 'OperatorValueInput',
  definition(t) {
    t.nonNull.string('operator');
    t.int('value');
    t.int('valueStart');
    t.int('valueEnd');
  },
});

const RangeOperatorValueFilterInput = inputObjectType({
  name: 'RangeOperatorValueFilterInput',
  definition(t) {
    t.list.string('range');
    t.string('operator');
    t.int('value');
    t.int('valueStart');
    t.int('valueEnd');
    t.string('periodOperator');
    t.int('periodValue');
    t.int('periodValueStart');
    t.int('periodValueEnd');
  },
});

const StrFilterInput = inputObjectType({
  name: 'StrFilterInput',
  definition(t) {
    t.string('containsi');
  },
});

const InArrayFilterInput = inputObjectType({
  name: 'InArrayFilterInput',
  definition(t) {
    t.list.string('in');
  },
});

const EqArrayFilterInput = inputObjectType({
  name: 'EqArrayFilterInput',
  definition(t) {
    t.list.string('eq');
  },
});

const BetweenOrInFilterInput = inputObjectType({
  name: 'BetweenOrInFilterInput',
  definition(t) {
    t.list.string('in');
    t.list.string('between');
  },
});

const IdInFilterInput = inputObjectType({
  name: 'IdInFilterInput',
  definition(t) {
    t.field('id', { type: InArrayFilterInput });
  },
});

export const BoughtItemType = enumType({
  name: 'BoughtItemType',
  members: ['product', 'service', 'compositeProduct'],
});

const BoughtFilterInput = inputObjectType({
  name: 'BoughtFilterInput',
  definition(t) {
    t.field('itemType', { type: BoughtItemType });
    t.string('productId');
    t.string('productTypeId');
    t.string('compositeProductId');
    t.string('serviceId');
  },
});

const ContactsFiltersInput = inputObjectType({
  name: 'ContactsFiltersInput',
  definition(t) {
    t.field('fullName', { type: StrFilterInput });
    t.field('leadSource', { type: InArrayFilterInput });
    t.field('leadOwner', { type: IdInFilterInput });
    t.field('company', { type: IdInFilterInput });
    t.field('birthdayDate', { type: BetweenOrInFilterInput });
    t.field('dateAnniversary', { type: BetweenOrInFilterInput });
    t.field('spouseBirthdayDate', { type: RangeOperatorValueFilterInput });
    t.field('id', { type: EqArrayFilterInput });
    t.field('totalSpent', { type: OperatorValueInput });
    t.field('totalItemsPurchased', { type: OperatorValueInput });
    t.field('biggestOrderValue', { type: OperatorValueInput });
    t.field('numberOfOrders', { type: OperatorValueInput });
    t.field('lastPurchaseDate', { type: RangeOperatorValueFilterInput });
    t.field('orderCreationDate', { type: RangeOperatorValueFilterInput });
    t.field('orderShipmentDate', { type: RangeOperatorValueFilterInput });
    t.field('creationDate', { type: RangeOperatorValueFilterInput });
    t.field('bought', { type: BoughtFilterInput });
    t.field('notBought', { type: BoughtFilterInput });
    t.field('amountSpentInPeriod', { type: RangeOperatorValueFilterInput });
    t.field('itemsPurchasedInPeriod', { type: RangeOperatorValueFilterInput });
    t.field('birthdayNumberDay', { type: OperatorValueInput });
    t.field('marketingOptIn', { type: InArrayFilterInput });
  },
});

const ContactsPaginationInput = inputObjectType({
  name: 'ContactsPaginationInput',
  definition(t) {
    t.nonNull.int('start', { default: 0 });
    t.nonNull.int('limit', { default: 10 });
  },
});

const DatesListInput = inputObjectType({
  name: 'DatesListInput',
  definition(t) {
    t.nonNull.string('gte');
    t.nonNull.string('lte');
  },
});

const ContactsPaginationResult = objectType({
  name: 'ContactsPaginationResult',
  definition(t) {
    t.nonNull.int('start');
    t.nonNull.int('limit');
    t.nonNull.int('total');
  },
});

const ContactsDataMeta = objectType({
  name: 'ContactsDataMeta',
  definition(t) {
    t.nonNull.field('pagination', { type: ContactsPaginationResult });
  },
});

const ContactsDataByPeriodWithAdditionalFiltersResult = objectType({
  name: 'ContactsDataByPeriodWithAdditionalFiltersResult',
  definition(t) {
    t.nonNull.list.field('data', { type: 'ContactEntity' });
    t.field('meta', { type: ContactsDataMeta });
  },
});

export const contactSchema = [...typeSchema, ...mutationSchema, ...querySchema];
