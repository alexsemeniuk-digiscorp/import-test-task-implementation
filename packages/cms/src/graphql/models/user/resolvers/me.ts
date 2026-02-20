import { GraphQLFieldResolver } from 'graphql';

export const me: GraphQLFieldResolver<
  null,
  Graphql.ResolverContext,
  null
> = async (root, args, ctx) => {
  const userService: UsersPermissions.UserService = strapi
    .plugin('users-permissions')
    .service('user');
  const user = await userService.fetch(ctx.state.user.id);

  if (!user) return null;

  return {
    ...user,
    id: ctx.state.user.id,
  };
};
