import { GraphQLFieldResolver } from 'graphql';
import encryptionService from 'strapi-plugin-encryptable-field/server/services/service';
import { NexusGenRootTypes } from '../../../../types/generated/graphql';

export const postcode: GraphQLFieldResolver<
  NexusGenRootTypes['ShipmentCard'] & { postcode: string },
  Graphql.ResolverContext,
  null
> = async (root): Promise<string> => {
  if (encryptionService({ strapi }).isEncrypted(root.postcode)) {
    return encryptionService({ strapi }).decrypt(root.postcode);
  }
  return root.postcode;
};
