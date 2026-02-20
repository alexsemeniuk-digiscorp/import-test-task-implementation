import { handleError, handleLogger } from '../../../graphql/helpers/errors';
import { roundPoints } from '../../../utils/points';
import { LifecycleHook } from '../types';

export const updateCrmEntityOnPointsActivityAction: LifecycleHook = async ({
  params,
}) => {
  handleLogger(
    'info',
    'ACTIVITY updateCrmEntityOnPointsActivityAction',
    `Params :: ${JSON.stringify(params)}`,
  );

  if (
    params?.data?.type &&
    params?.data?.type === 'points' &&
    params?.data?.amount != null
  ) {
    const activityId = params?.where?.id;

    let contactId = params?.data?.contact_id;
    let companyId = params?.data?.company_id;

    try {
      let entityId = contactId || companyId;
      if (!entityId) {
        const currentActivity = await strapi.entityService.findOne(
          'api::activity.activity',
          activityId,
          {
            fields: ['id'],
            populate: {
              contact_id: {
                fields: ['id'],
              },
              company_id: {
                fields: ['id'],
              },
            },
          },
        );

        contactId = currentActivity?.contact_id?.id;
        companyId = currentActivity?.company_id?.id;
        entityId = contactId || companyId;

        if (!entityId) {
          handleError(
            'updateCrmEntityOnPointsActivityAction',
            'No CRM id provided',
          );
        }
      }
      const entityType = contactId
        ? 'api::contact.contact'
        : 'api::company.company';
      const currentEntityData = await strapi.entityService.findOne(
        entityType,
        entityId,
        {
          fields: ['id', 'points'],
        },
      );

      const points = roundPoints(Number(params?.data?.amount));

      const updatedPoints =
        currentEntityData.points && !params?.data?.due_date
          ? roundPoints(Number(currentEntityData.points + points))
          : points;

      if (points != null && !params?.data?.description?.includes('Trade In')) {
        await strapi.entityService.update(entityType, entityId, {
          data: { points: updatedPoints },
        });
      }
    } catch (e) {
      handleError('updateCrmEntityOnPointsActivityAction', undefined, e);
    }
  }
};
