import { GraphQLFieldResolver, GraphQLResolveInfo } from 'graphql';
import { handleLogger } from '../../../helpers/errors';

export const getInventoryAuditMin: GraphQLFieldResolver<
  undefined,
  unknown,
  {
    uuid: string;
  }
> = async (
  source: undefined,
  input,
  context: unknown,
  info: GraphQLResolveInfo,
) => {
  handleLogger(
    'info',
    'Resolver :: getInventoryAudit',
    `Uuid :: ${JSON.stringify(input)}`,
  );
  const { uuid } = input;

  const inventoryAudits = await strapi.entityService.findMany(
    'api::inventory-audit.inventory-audit',
    {
      filters: {
        uuid: {
          $eq: uuid,
        },
      },
      fields: [
        'adjusted',
        'auditDate',
        'auditId',
        'finalize',
        'name',
        'uuid',
        'id',
        'isAdjustmentRequired',
      ],
      populate: {
        businessLocation: {
          fields: ['id', 'name'],
        },
        employee: true,
      },
    },
  );

  return inventoryAudits;
};
