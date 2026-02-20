import { appendTenantId } from './helpers/appendTenantId';
import { checkIfEntityCanBeChangedByTenant } from './helpers/checkIfEntityCanBeChanged';

export const withTenantId: Graphql.MiddlewareFn = async (
  next,
  root,
  args,
  ctx,
  info,
) => {
  await appendTenantId(ctx);

  return next(root, args, ctx, info);
};

export const withTenantSingleQuery: Graphql.MiddlewareFn = async (
  next,
  root,
  args,
  ctx,
  info,
) => {
  await appendTenantId(ctx);

  args.populate = ['tenant'];

  const response = await next(root, args, ctx, info);

  const value = await response.value;

  response.value =
    !value?.tenant.id || value?.tenant.id === ctx.state.tenantId ? value : null;

  return response;
};

export const withTenantCollectionQuery: Graphql.MiddlewareFn = async (
  next,
  root,
  args,
  ctx,
  info,
) => {
  await appendTenantId(ctx);

  args.filters = {
    ...(args.filters || {}),
    tenant: {
      id: {
        eq: ctx.state.tenantId,
      },
    },
  };

  return next(root, args, ctx, info);
};

export const withTenantCreateMutation: Graphql.MiddlewareFn = async (
  next,
  root,
  args,
  ctx,
  info,
) => {
  await appendTenantId(ctx);

  args.data.tenant = ctx.state.tenantId ?? ctx.state.user.tenantId;

  return next(root, args, ctx, info);
};

export const withTenantUpdateMutation: Graphql.MiddlewareFn = async (
  next,
  root,
  args,
  ctx,
  info,
) => {
  await appendTenantId(ctx);

  await checkIfEntityCanBeChangedByTenant('update', args, info, ctx);
  if (!args.data.tenant) {
    args.data.tenant = ctx.state.tenantId ?? ctx.state.user.tenantId;
  }

  return next(root, args, ctx, info);
};

export const withTenantDeleteMutation: Graphql.MiddlewareFn = async (
  next,
  root,
  args,
  ctx,
  info,
) => {
  await appendTenantId(ctx);

  await checkIfEntityCanBeChangedByTenant('delete', args, info, ctx);

  return next(root, args, ctx, info);
};
