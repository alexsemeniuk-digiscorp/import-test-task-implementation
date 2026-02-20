import { GraphQLFieldResolver } from 'graphql';
import encryptionService from 'strapi-plugin-encryptable-field/server/services/service';
import { User } from '../user.types';

export const phoneNumber: GraphQLFieldResolver<
  User,
  Graphql.ResolverContext,
  null
> = async ({ phoneNumber }) => {
  if (encryptionService({ strapi }).isEncrypted(phoneNumber)) {
    return encryptionService({ strapi }).decrypt(phoneNumber);
  }
  return phoneNumber;
};
