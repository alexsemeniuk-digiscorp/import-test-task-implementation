import { ID } from '@strapi/strapi/lib/services/entity-service/types/params/attributes';

export const updateLastSessionState = async (
  jobId,
  newState: 'completed' | 'progressing' | 'error' = 'completed',
) => {
  const [lastSession] =
    (await strapi.entityService.findMany(
      'api::importing-session.importing-session',
      {
        filters: { jobId: jobId },
        limit: 1,
      },
    )) || [];

  if (lastSession?.id) {
    await strapi.entityService.update(
      'api::importing-session.importing-session',
      lastSession.id,
      { data: { state: newState } },
    );
  }
};

export const updateImportingSessionJobId = async (
  sessionId: ID,
  jobId: string,
) => {
  return await strapi.entityService.update(
    'api::importing-session.importing-session',
    sessionId,
    {
      data: {
        jobId,
      },
    },
  );
};
