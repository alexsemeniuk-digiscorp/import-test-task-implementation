import { checkIfEntityCanBeChangedByUser } from './helpers/checkIfEntityCanBeChanged';
export const withUserSingleQuery: Graphql.MiddlewareFn = async (
  next,
  root,
  args,
  ctx,
  info,
) => {
  args.populate = ['user'];

  const response = await next(root, args, ctx, info);

  const value = await response.value;

  response.value =
    !value?.user?.id || value?.user.id === ctx.state.user?.id ? value : null;

  return response;
};

export const withUserCollectionQuery: Graphql.MiddlewareFn = async (
  next,
  root,
  args,
  ctx,
  info,
) => {
  if (!ctx.state.user?.id) {
    return null;
  }

  args.filters = {
    ...(args.filters || {}),
    user: {
      id: {
        eq: ctx.state.user.id,
      },
    },
  };

  return next(root, args, ctx, info);
};

export const withUserUpdateMutation: Graphql.MiddlewareFn = async (
  next,
  root,
  args,
  ctx,
  info,
) => {
  await checkIfEntityCanBeChangedByUser('update', args, info, ctx);

  return next(root, args, ctx, info);
};

export const withUserDeleteMutation: Graphql.MiddlewareFn = async (
  next,
  root,
  args,
  ctx,
  info,
) => {
  await checkIfEntityCanBeChangedByUser('delete', args, info, ctx);

  return next(root, args, ctx, info);
};
