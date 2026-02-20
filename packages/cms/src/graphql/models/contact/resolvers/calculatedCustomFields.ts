import { GraphQLFieldResolver } from 'graphql';

import { NexusGenRootTypes } from '../../../../types/generated/graphql';

export const calculatedCustomFields: GraphQLFieldResolver<
  NexusGenRootTypes['Contact'] & { id: number },
  Graphql.ResolverContext,
  any
> = async (root, input, ctx): Promise<string> => {
  const contactService = strapi.service('api::contact.contact');
  const tenantId = ctx.state.user.tenantId;
  return await contactService.calculateCustomField(root.id, tenantId);
};
