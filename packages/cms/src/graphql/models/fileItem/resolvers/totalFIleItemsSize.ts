import { ID } from '@strapi/strapi/lib/services/entity-service/types/params/attributes';
import { GraphQLFieldResolver } from 'graphql';

interface ClientFilesArgType {
  clientType?: 'Contact' | 'Company' | 'Lead';
  fileType: 'uploaded' | 'generated';
  clientId?: ID;
  isFavourite: boolean;
  page: number;
  pageSize: number;
}

export const totalFileItemsSize: GraphQLFieldResolver<
  any,
  Graphql.ResolverContext,
  { data: ClientFilesArgType }
> = async (root, args, ctx) => {
  const userService: UsersPermissions.UserService = strapi
    .plugin('users-permissions')
    .service('user');
  const user = await userService.fetch(ctx.state.user.id, {
    populate: ['tenant'],
  });
  const tenantFilter = { tenant: user?.tenant?.id };

  const tenantFiles = await strapi.entityService.findMany(
    'api::file-item.file-item',
    {
      populate: {
        attachedFile: true,
      },
      filters: { ...tenantFilter },
    },
  );

  const totalSize = tenantFiles.reduce((acc, fileItem) => {
    const fileSize = fileItem?.attachedFile?.size || 0;
    return acc + fileSize;
  }, 0);

  return {
    totalSize,
  };
};
