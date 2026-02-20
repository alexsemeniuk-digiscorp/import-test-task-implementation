import BeforeLifecycleEvent = Database.BeforeLifecycleEvent;

export const cleanUpSequenceInfo: BeforeLifecycleEvent = async ({ params }) => {
  const stepId = params?.where?.id;

  if (!stepId) {
    throw new Error('Step ID is missing or invalid.');
  }

  const stepInfos = await strapi.entityService.findMany(
    'api::sequence-step-info.sequence-step-info',
    {
      filters: {
        sequenceStep: {
          id: {
            $eq: stepId,
          },
        },
      },
      fields: ['id'],
    },
  );

  if (stepInfos.length > 0) {
    await Promise.all(
      stepInfos.map(async (item) => {
        await strapi.entityService.delete(
          'api::sequence-step-info.sequence-step-info',
          item.id,
        );
      }),
    );
  }
};
