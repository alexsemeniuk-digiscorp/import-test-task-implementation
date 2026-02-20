import { GraphQLFieldResolver } from 'graphql';
import { getTenantFilter } from './../../../../../src/graphql/models/dealTransaction/helpers/helpers';
import { transformUploadFilesToBuffers } from './../../../../graphql/helpers/fileHelpers';

export const processingFileUploading: GraphQLFieldResolver<
  any,
  Graphql.ResolverContext,
  any
> = async (root, { input }, ctx) => {
  const userId = ctx.state.user.id;
  const tenant = await getTenantFilter(userId);
  const tenantId = tenant.tenant;

  const responses = await transformUploadFilesToBuffers(input?.uploadFiles, {
    userId,
    tenantId,
  });

  return {
    resultObj: JSON.stringify(
      responses.map((res) => ({
        fileName: res.name,
        fileId: res.alternativeText,
      })),
    ),
  };
};
