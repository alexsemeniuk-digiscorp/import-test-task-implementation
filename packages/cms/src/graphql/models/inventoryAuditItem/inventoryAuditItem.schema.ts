import {
  list,
  nonNull,
  objectType,
  queryField,
  stringArg,
} from '@nexus/schema';

const CustomMeta = objectType({
  name: 'CustomMeta',
  definition(t) {
    t.int('total');
    t.int('page');
    t.int('pageSize');
    t.int('pageCount');
  },
});

const querySchema = [
  queryField('inventoryAuditItemRangeData', {
    type: objectType({
      name: 'inventoryAuditItemRangeData',
      definition: (t) => {
        t.float('minScannedQty');
        t.float('maxScannedQty');
        t.float('minActualQty');
        t.float('maxActualQty');
        t.float('minInventoryQty');
        t.float('maxInventoryQty');
        t.float('minPrice');
        t.float('maxPrice');
      },
    }),
    args: {
      uuid: nonNull(stringArg()),
    },
  }),
  queryField('fetchAuditItemsStats', {
    type: objectType({
      name: 'fetchAuditItemsStats',
      definition: (t) => {
        t.int('all');
        t.int('scanned');
        t.int('notScanned');
        t.int('partial');
        t.int('over');
        t.string('progress');
      },
    }),
    args: {
      auditUuid: nonNull(stringArg()),
      filters: 'InventoryAuditItemFiltersInput',
    },
  }),
  queryField('fetchListByFieldFromInventoryAuditItems', {
    type: objectType({
      name: 'FetchListByFieldFromInventoryAuditItemsType',
      definition(t) {
        t.list.string('names');
        t.list.string('barcodes');
      },
    }),
    args: {
      uuid: nonNull(stringArg()),
    },
  }),
  queryField('fetchInventoryAuditItemsByUuid', {
    args: {
      uuid: nonNull(stringArg()),
      filters: 'InventoryAuditItemFiltersInput',
      pagination: 'PaginationArg',
      sort: list(stringArg()),
    },
    type: objectType({
      name: 'inventoryAuditsString',
      definition(t) {
        t.string('response');
        t.field('meta', { type: CustomMeta });
      },
    }),
  }),
];

export const inventoryAuditItemSchema = [...querySchema];
