import { GraphQLFieldResolver } from 'graphql';
import encryptionService from 'strapi-plugin-encryptable-field/server/services/service';
import { NexusGenRootTypes } from '../../../../types/generated/graphql';

export const phoneNumber: GraphQLFieldResolver<
  NexusGenRootTypes['Lead'] & { phoneNumber: string },
  Graphql.ResolverContext,
  null
> = async (root): Promise<string> => {
  if (encryptionService({ strapi }).isEncrypted(root.phoneNumber)) {
    return encryptionService({ strapi }).decrypt(root.phoneNumber);
  }
  return root.phoneNumber;
};
