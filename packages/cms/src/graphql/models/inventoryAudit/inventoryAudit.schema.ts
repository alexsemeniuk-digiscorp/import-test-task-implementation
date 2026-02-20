import {
  extendType,
  inputObjectType,
  list,
  mutationField,
  nonNull,
  objectType,
  queryField,
  stringArg,
} from '@nexus/schema';

const CreateInventoryAuditWithItemsInput = inputObjectType({
  name: 'CreateInventoryAuditWithItemsInput',
  definition(t) {
    t.string('auditDate');
    t.string('auditId');
    t.nonNull.id('businessLocation');
    t.nonNull.id('employee');
    t.string('name');
    t.id('sublocation');
    t.nonNull.id('tenant');
    t.id('productType');
    t.id('company');
    t.id('contact');
    t.nonNull.boolean('inventoryQty');
  },
});

const mutationSchema = [
  mutationField('createInventoryAuditWithItemsByRedis', {
    type: objectType({
      name: 'InventoryAuditWithItemsTypeRedis',
      definition: (t) => {
        t.string('id');
      },
    }),
    args: {
      input: nonNull(CreateInventoryAuditWithItemsInput),
    },
  }),
  mutationField('updateFinalizeInventoryAudit', {
    args: {
      input: nonNull(
        inputObjectType({
          name: 'UpdateFinalizeInventoryAuditInput',
          definition: (t) => {
            t.string('uuid');
          },
        }),
      ),
    },
    type: 'Boolean',
  }),
];

const querySchema = [
  queryField('getInventoryAuditMin', {
    type: list('InventoryAuditEntity'),
    args: {
      uuid: nonNull(stringArg()),
    },
  }),
];

const typeSchema = [
  extendType<'InventoryAudit'>({
    type: 'InventoryAudit',
    definition: (t) => {
      t.nullable.boolean('isInventoryNotEqualScanned');
    },
  }),
];

export const inventoryAuditSchema = [
  ...querySchema,
  ...mutationSchema,
  ...typeSchema,
];
