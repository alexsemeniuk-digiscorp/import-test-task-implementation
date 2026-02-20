import { ID } from '@strapi/strapi/lib/services/entity-service/types/params/attributes';

import { NexusGenRootTypes } from '../../../types/generated/graphql';
import { CrmEntityName, LifecycleHook } from '../types';

export const deleteEntityActivities =
  (entityName: CrmEntityName): LifecycleHook =>
  async ({ params }) => {
    const {
      where: { id },
    } = params;

    const entityActivities = (await strapi.entityService.findMany(
      'api::activity.activity',
      {
        filters: {
          [`${entityName}_id`]: {
            id: {
              $eq: id,
            },
          },
        },
        fields: ['id'],
      },
    )) as unknown as NexusGenRootTypes['Activity'][];

    if (entityActivities?.length > 0) {
      await Promise.all(
        entityActivities?.map(
          async (activity: NexusGenRootTypes['Activity'] & { id: ID }) => {
            await strapi.entityService.delete(
              'api::activity.activity',
              activity?.id,
            );
          },
        ),
      );
    }
  };
