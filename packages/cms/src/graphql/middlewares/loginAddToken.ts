export const loginAddToken: Graphql.MiddlewareFn = async (
  resolve,
  root,
  args,
  ctx,
  info,
) => {
  const { koaContext } = ctx as Graphql.ResolverContext;
  koaContext.query = {
    accessToken: args.input.identifier,
    tenantSlug: args.input.tenantSlug,
  };

  return resolve(root, args, ctx, info);
};
