import { GraphQLFieldResolver } from 'graphql';
import encryptionService from 'strapi-plugin-encryptable-field/server/services/service';
import { NexusGenRootTypes } from '../../../../types/generated/graphql';

export const browser: GraphQLFieldResolver<
  NexusGenRootTypes['Sessions'] & { browser: string },
  Graphql.ResolverContext,
  null
> = async (root): Promise<string> => {
  if (encryptionService({ strapi }).isEncrypted(root.browser)) {
    return encryptionService({ strapi }).decrypt(root.browser);
  }
  return root.browser;
};
