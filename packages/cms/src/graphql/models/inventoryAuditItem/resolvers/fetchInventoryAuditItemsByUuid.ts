import { GraphQLFieldResolver, GraphQLResolveInfo } from 'graphql';
import { cloneDeep } from 'lodash';

import { NexusGenInputs } from '../../../../types/generated/graphql';
import { handleLogger } from '../../../helpers/errors';
import {
  InventoryAuditItemFilters,
  generateFilters,
} from '../helpers/generateFilters';

export const fetchInventoryAuditItemsByUuid: GraphQLFieldResolver<
  undefined,
  unknown,
  {
    uuid: string;
    filters: InventoryAuditItemFilters;
    pagination: NexusGenInputs['PaginationArg'];
    sort: string[];
  }
> = async (
  source: undefined,
  input,
  context: unknown,
  info: GraphQLResolveInfo,
) => {
  handleLogger(
    'info',
    'Resolver :: fetchInventoryAuditItemsByUuid',
    `Uuid :: ${JSON.stringify(input)}`,
  );

  const { uuid, filters: filtersInput, pagination = {}, sort = [] } = input;
  const filters = generateFilters(filtersInput);
  const { scanned, over, partial, ...strapiFilters } = filters;

  const { page = 1, pageSize = 5 } = pagination;
  const start = (page - 1) * pageSize;
  const limit = pageSize;

  if (scanned || over || partial) {
    const result = await strapi.entityService.findMany(
      'api::inventory-audit-item.inventory-audit-item',
      {
        filters: {
          ...strapiFilters,
          inventoryAudit: {
            uuid: {
              $eq: uuid,
            },
          },
        },
        populate: {
          businessLocation: {
            fields: ['id', 'name'],
          },
          sublocation: {
            fields: ['id', 'name'],
          },
          sublocationItems: {
            fields: ['id', 'quantity', 'scannedQty', 'actualQty'],
            populate: {
              sublocation: {
                fields: ['id', 'name'],
              },
            },
          },
          productInventoryItem: {
            fields: ['id', 'price'],
            populate: {
              product: {
                fields: [
                  'name',
                  'barcode',
                  'uuid',
                  'productId',
                  'defaultPrice',
                ],
                populate: {
                  productType: {
                    fields: ['name', 'id'],
                  },
                  files: {
                    fields: ['url'],
                  },
                },
              },
              sublocationItems: {
                fields: ['id', 'quantity', 'scannedQty', 'actualQty'],
                populate: {
                  sublocation: {
                    fields: ['id', 'name'],
                  },
                },
              },
            },
          },
        },
      },
    );
    if (scanned) {
      const scannedResult = result.filter((item) => {
        const { scannedQty, actualQty, inventoryQty } = item;
        if (scannedQty <= 0 && actualQty <= 0) return false;
        if (scannedQty > 0 && scannedQty === inventoryQty) return true;
        if (actualQty > 0 && actualQty === inventoryQty) return true;
        return false;
      });
      const filteredScannedResult = cloneDeep(
        scannedResult.filter(
          (item) =>
            item.productInventoryItem !== null &&
            item.productInventoryItem !== undefined,
        ),
      );
      const scannedTotal = filteredScannedResult.length;

      const scannedMeta = {
        total: scannedTotal,
        page: pagination?.page ?? 1,
        pageSize: pagination?.pageSize ?? 5,
        pageCount: Math.ceil(scannedTotal / (pagination?.pageSize ?? 5)),
      };
      const scannedResponse = {
        response: JSON.stringify(filteredScannedResult || []),
        meta: scannedMeta,
      };
      return scannedResponse;
    }
    if (over) {
      const overResult = result.filter(
        (item) =>
          (item.scannedQty > 0 && item.scannedQty > item.inventoryQty) ||
          (item.actualQty > 0 && item.actualQty > item.inventoryQty),
      );
      const filteredOverResult = overResult.filter(
        (item) =>
          item.productInventoryItem !== null &&
          item.productInventoryItem !== undefined,
      );
      const overTotal = filteredOverResult.length;
      const overMeta = {
        total: overTotal,
        page: pagination?.page ?? 1,
        pageSize: pagination?.pageSize ?? 5,
        pageCount: Math.ceil(overTotal / (pagination?.pageSize ?? 5)),
      };
      const overResponse = {
        response: JSON.stringify(filteredOverResult || []),
        meta: overMeta,
      };
      return overResponse;
    }
    if (partial) {
      const partialResult = result.filter((item) => {
        const { scannedQty, actualQty, inventoryQty } = item;
        if (scannedQty <= 0 && actualQty <= 0) return false;
        if (scannedQty > 0 && scannedQty < inventoryQty) return true;
        if (actualQty > 0 && actualQty < inventoryQty) return true;
        return false;
      });
      const filteredPartialResult = partialResult.filter(
        (item) =>
          item.productInventoryItem !== null &&
          item.productInventoryItem !== undefined,
      );
      const partialTotal = filteredPartialResult.length;
      const partialMeta = {
        total: partialTotal,
        page: pagination?.page ?? 1,
        pageSize: pagination?.pageSize ?? 5,
        pageCount: Math.ceil(partialTotal / (pagination?.pageSize ?? 5)),
      };
      const partialResponse = {
        response: JSON.stringify(filteredPartialResult || []),
        meta: partialMeta,
      };
      return partialResponse;
    }
  } else {
    const total = await strapi.entityService.count(
      'api::inventory-audit-item.inventory-audit-item',
      {
        filters: {
          ...filters,
          inventoryAudit: {
            uuid: {
              $eq: uuid,
            },
          },
        },
      },
    );
    const result = await strapi.entityService.findMany(
      'api::inventory-audit-item.inventory-audit-item',
      {
        filters: {
          ...strapiFilters,
          inventoryAudit: {
            uuid: {
              $eq: uuid,
            },
          },
        },
        populate: {
          businessLocation: {
            fields: ['id', 'name'],
          },
          sublocation: {
            fields: ['id', 'name'],
          },
          sublocationItems: {
            fields: ['id', 'quantity', 'scannedQty', 'actualQty'],
            populate: {
              sublocation: {
                fields: ['id', 'name'],
              },
            },
          },
          productInventoryItem: {
            fields: ['id', 'price'],
            populate: {
              product: {
                fields: [
                  'name',
                  'barcode',
                  'uuid',
                  'productId',
                  'defaultPrice',
                ],
                populate: {
                  productType: {
                    fields: ['name', 'id'],
                  },
                  files: {
                    fields: ['url'],
                  },
                },
              },
              sublocationItems: {
                fields: ['id', 'quantity', 'scannedQty', 'actualQty'],
                populate: {
                  sublocation: {
                    fields: ['id', 'name'],
                  },
                },
              },
            },
          },
        },
        start,
        limit,
        sort: sort.length > 0 ? (sort as any) : undefined,
      },
    );

    const filteredResult = result.filter(
      (item) =>
        item.productInventoryItem !== null &&
        item.productInventoryItem !== undefined,
    );

    const meta = {
      total,
      page: pagination?.page ?? 1,
      pageSize: pagination?.pageSize ?? 5,
      pageCount: Math.ceil(total / (pagination?.pageSize ?? 5)),
    };

    const response = { response: JSON.stringify(filteredResult || []), meta };

    return response;
  }
};
