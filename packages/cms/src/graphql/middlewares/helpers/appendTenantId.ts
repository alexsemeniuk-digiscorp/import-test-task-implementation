export const appendTenantId = async (ctx: Graphql.ResolverContext) => {
  if (ctx.state.user?.id) {
    const userService: UsersPermissions.UserService = strapi
      .plugin('users-permissions')
      .service('user');

    const user = await userService.fetch(ctx.state.user.id, {
      populate: ['tenant'],
    });

    ctx.state.user.tenantId = user.tenant?.id;
  }

  const { origin } = ctx.koaContext.request.header;

  const { tenantId, user } = ctx.state;

  if (tenantId && user?.tenantId && tenantId !== user?.tenantId) {
    throw new Error('User does not have access to this tenant');
  }

  if (!tenantId && user?.tenantId) {
    ctx.state.tenantId = user.tenantId;
  }
};
