import { GraphQLFieldResolver } from 'graphql';
import encryptionService from 'strapi-plugin-encryptable-field/server/services/service';
import { NexusGenRootTypes } from '../../../../types/generated/graphql';

export const ip: GraphQLFieldResolver<
  NexusGenRootTypes['Sessions'] & { ip: string },
  Graphql.ResolverContext,
  null
> = async (root): Promise<string> => {
  if (encryptionService({ strapi }).isEncrypted(root.ip)) {
    return encryptionService({ strapi }).decrypt(root.ip);
  }
  return root.ip;
};
