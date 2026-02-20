import AfterLifecycleEvent = Database.AfterLifecycleEvent;

export const updateSequenceNumberOnAddNewStep: AfterLifecycleEvent = async ({
  params,
  result,
}) => {
  const stepId = result?.id;
  const allSteps = await strapi.entityService.findMany(
    'api::sequence-step.sequence-step',
    {
      filters: {
        id: {
          $ne: stepId,
        },
        campaign: {
          id: {
            $eq: params.data.campaign,
          },
        },
      },
      fields: ['id', 'sequentialNumber'],
      publicationState: 'preview',
    },
  );

  const stepsAfterCurrent = allSteps.filter(
    (el) => el.sequentialNumber >= params.data.sequentialNumber,
  );

  if (stepsAfterCurrent.length > 0) {
    await Promise.all(
      stepsAfterCurrent.map((step) => {
        return strapi.entityService.update(
          'api::sequence-step.sequence-step',
          step.id,
          {
            data: {
              sequentialNumber: step.sequentialNumber + 1,
            },
          },
        );
      }),
    );
  }
};
