import { GraphQLFieldResolver } from 'graphql';
import encryptionService from 'strapi-plugin-encryptable-field/server/services/service';
import { NexusGenRootTypes } from '../../../../types/generated/graphql';

export const streetName: GraphQLFieldResolver<
  NexusGenRootTypes['ShipmentCard'] & { streetName: string },
  Graphql.ResolverContext,
  null
> = async (root): Promise<string> => {
  if (encryptionService({ strapi }).isEncrypted(root.streetName)) {
    return encryptionService({ strapi }).decrypt(root.streetName);
  }
  return root.streetName;
};
