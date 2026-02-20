import { GraphQLFieldResolver } from 'graphql';

export const deleteDownloadUserRecords: GraphQLFieldResolver<
  null,
  Graphql.ResolverContext,
  null
> = async (root, args, ctx) => {
  const downloadedUserRecordItems = await strapi.entityService.findMany(
    'api::download-record.download-record',
    {
      fields: ['id'],
      populate: {
        downloadedBy: {
          filters: {
            id: {
              $eq: ctx.state.user.id,
            },
          },
        },
      },
    },
  );

  const downloadedUserRecordItemsIds =
    downloadedUserRecordItems?.map((record) => record.id) ?? [];

  const deletePromises = downloadedUserRecordItemsIds.map(async (id) => {
    await strapi.entityService.delete(
      'api::download-record.download-record',
      id,
    );
  });

  await Promise.all(deletePromises);
};
