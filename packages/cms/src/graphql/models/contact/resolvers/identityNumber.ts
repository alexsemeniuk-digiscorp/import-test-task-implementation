import { GraphQLFieldResolver } from 'graphql';
import encryptionService from 'strapi-plugin-encryptable-field/server/services/service';
import { NexusGenRootTypes } from '../../../../types/generated/graphql';

export const identityNumber: GraphQLFieldResolver<
  NexusGenRootTypes['Contact'] & { identityNumber: string },
  Graphql.ResolverContext,
  null
> = async (root): Promise<string> => {
  if (encryptionService({ strapi }).isEncrypted(root.identityNumber)) {
    return encryptionService({ strapi }).decrypt(root.identityNumber);
  }
  return root.identityNumber;
};
