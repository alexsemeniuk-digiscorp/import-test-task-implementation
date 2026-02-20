import { GraphQLFieldResolver } from 'graphql';
import encryptionService from 'strapi-plugin-encryptable-field/server/services/service';
import { NexusGenRootTypes } from '../../../../types/generated/graphql';

export const device: GraphQLFieldResolver<
  NexusGenRootTypes['Sessions'] & { device: string },
  Graphql.ResolverContext,
  null
> = async (root): Promise<string> => {
  if (encryptionService({ strapi }).isEncrypted(root.device)) {
    return encryptionService({ strapi }).decrypt(root.device);
  }
  return root.device;
};
