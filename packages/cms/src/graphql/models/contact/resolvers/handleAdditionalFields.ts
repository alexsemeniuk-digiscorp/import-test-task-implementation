import { GraphQLFieldResolver } from 'graphql';
import { NexusGenInputs } from './../../../../../src/types/generated/graphql';
import { handleAdditionalFieldsUpdating } from './../helpers/handleAdditionalFieldsUpdating';

export const handleAdditionalFields: GraphQLFieldResolver<
  null,
  Graphql.ResolverContext,
  { input: NexusGenInputs['HandleAdditionalFieldsInput'] }
> = async (root, { input }, ctx) => {
  await handleAdditionalFieldsUpdating(input, input.contactId);
};
