import { GraphQLFieldResolver } from 'graphql';
import encryptionService from 'strapi-plugin-encryptable-field/server/services/service';
import { NexusGenRootTypes } from '../../../../types/generated/graphql';

export const apartment: GraphQLFieldResolver<
  NexusGenRootTypes['ShipmentCard'] & { apartment: string },
  Graphql.ResolverContext,
  null
> = async (root): Promise<string> => {
  if (encryptionService({ strapi }).isEncrypted(root.apartment)) {
    return encryptionService({ strapi }).decrypt(root.apartment);
  }
  return root.apartment;
};
