import {
  inputObjectType,
  mutationField,
  nonNull,
  objectType,
} from '@nexus/schema';

const mutationSchema = [
  mutationField('createInventoryAdjustmentWithItemsByInventoryAudit', {
    type: objectType({
      name: 'CreateInventoryAdjustmentWithItemsByInventoryAuditResponse',
      definition: (t) => {
        t.string('id');
      },
    }),
    args: {
      input: nonNull(
        inputObjectType({
          name: 'CreateInventoryAdjustmentWithItemsByInventoryAuditInput',
          definition: (t) => {
            t.nonNull.id('id');
            t.nonNull.string('adjustmentId');
            t.nonNull.string('auditId');
            t.nonNull.id('employee');
            t.string('name');
          },
        }),
      ),
    },
  }),
];

export const inventoryAdjustmentItemSchema = [...mutationSchema];
