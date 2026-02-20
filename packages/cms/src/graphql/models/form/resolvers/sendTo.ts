import { GraphQLFieldResolver } from 'graphql';
import encryptionService from 'strapi-plugin-encryptable-field/server/services/service';
import { NexusGenRootTypes } from '../../../../types/generated/graphql';

export const sendTo: GraphQLFieldResolver<
  NexusGenRootTypes['Form'] & { sendTo: string },
  Graphql.ResolverContext,
  null
> = async (root): Promise<string> => {
  if (encryptionService({ strapi }).isEncrypted(root.sendTo)) {
    return encryptionService({ strapi }).decrypt(root.sendTo);
  }
  return root.sendTo;
};
