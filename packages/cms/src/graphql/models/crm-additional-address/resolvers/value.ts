import { GraphQLFieldResolver } from 'graphql';
import encryptionService from 'strapi-plugin-encryptable-field/server/services/service';
import { NexusGenRootTypes } from '../../../../types/generated/graphql';

export const value: GraphQLFieldResolver<
  NexusGenRootTypes['CrmAdditionalAddress'] & { value: string },
  Graphql.ResolverContext,
  null
> = async (root): Promise<string> => {
  if (encryptionService({ strapi }).isEncrypted(root.value)) {
    return encryptionService({ strapi }).decrypt(root.value);
  }
  return root.value;
};
