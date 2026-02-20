import { GraphQLFieldResolver } from 'graphql';

import { User } from '../user.types';

export const fullName: GraphQLFieldResolver<
  User,
  Graphql.ResolverContext,
  null
> = async ({ firstName, lastName, email }) => {
  return firstName && lastName ? `${firstName} ${lastName}` : email;
};
