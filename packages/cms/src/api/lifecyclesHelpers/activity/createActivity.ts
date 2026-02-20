import { handleError } from '../../../graphql/helpers/errors';
import { getUserWithTenant } from '../../../graphql/models/dealTransaction/helpers/helpers';
import AfterLifecycleEvent = Database.AfterLifecycleEvent;

export const createActivity = async (
  event: AfterLifecycleEvent,
  type: 'appraisal' | 'deal' | 'note',
) => {
  const { result, params } = event;
  const ctx = strapi.requestContext.get();

  const userId = ctx?.state?.user?.id;
  if (!userId) return;

  const user = await getUserWithTenant(userId);
  const tenantId = user?.tenant?.id;

  if (!tenantId) return;

  try {
    await strapi.entityService.create('api::activity.activity', {
      data: {
        contact_id: params?.data?.contact || params?.data?.contact_id,
        company_id: params?.data?.company || params?.data?.company_id,
        tenant: tenantId,
        title: result?.name || '',
        description: result?.description || '',
        type,
        completed: true,
        due_date: new Date(),
        appraisal: type === 'appraisal' ? result?.id : null,
        deal: type === 'deal' ? result?.id : null,
      },
    });
  } catch (error) {
    handleError(`LifecycleHook :: ${type}`, '', `${error}`);
  }
};
