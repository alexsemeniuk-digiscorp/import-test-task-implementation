import { handleError } from '../../../../graphql/helpers/errors';

export const createOnboarding = async (tenantId) => {
  try {
    await strapi.entityService.create('api::onboarding.onboarding', {
      data: {
        isCompleted: false,
        tenant: tenantId,
      },
    });
  } catch (e) {
    handleError('createOnboarding', undefined, e);
  }
};
