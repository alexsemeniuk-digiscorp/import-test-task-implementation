import { GraphQLFieldResolver } from 'graphql';
import encryptionService from 'strapi-plugin-encryptable-field/server/services/service';
import { NexusGenRootTypes } from '../../../../types/generated/graphql';

export const address: GraphQLFieldResolver<
  NexusGenRootTypes['InvoiceShippingContact'] & { address: string },
  Graphql.ResolverContext,
  null
> = async (root): Promise<string> => {
  if (encryptionService({ strapi }).isEncrypted(root.address)) {
    return encryptionService({ strapi }).decrypt(root.address);
  }
  return root.address;
};
