import { GraphQLFieldResolver } from 'graphql';
import encryptionService from 'strapi-plugin-encryptable-field/server/services/service';
import { NexusGenRootTypes } from '../../../../types/generated/graphql';

export const email: GraphQLFieldResolver<
  NexusGenRootTypes['ShipmentCard'] & { email: string },
  Graphql.ResolverContext,
  null
> = async (root): Promise<string> => {
  if (encryptionService({ strapi }).isEncrypted(root.email)) {
    return encryptionService({ strapi }).decrypt(root.email);
  }
  return root.email;
};
