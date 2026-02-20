import { GraphQLFieldResolver } from 'graphql';
import { UpdateDealTransactionClearentInput } from '../types/types';

export const updateDealTransactionClearent: GraphQLFieldResolver<
  any,
  Graphql.ResolverContext,
  { input: UpdateDealTransactionClearentInput }
> = async (root, { input }, ctx) => {
  try {
    // If neither clearentInfo nor clearentError exists, return early
    if (!input.clearentInfo && !input.clearentError) {
      return true;
    }

    // First get the existing transaction to handle clearentError array
    const existingTransaction = await strapi.db
      .query('api::deal-transaction.deal-transaction')
      .findOne({
        where: {
          dealTransactionId: input.dealTransactionId.includes('#')
            ? input.dealTransactionId
            : `#${input.dealTransactionId}`,
        },
      });

    const updateData: {
      clearentInfo?: Record<string, any>;
      clearentError?: any[];
    } = {};

    // Handle clearentInfo update
    if (input.clearentInfo) {
      updateData.clearentInfo = input.clearentInfo;
    }

    // Handle clearentError as array
    if (input.clearentError) {
      const existingErrors = existingTransaction?.clearentError
        ? Array.isArray(existingTransaction.clearentError)
          ? existingTransaction.clearentError
          : [existingTransaction.clearentError]
        : [];

      updateData.clearentError = [...existingErrors, input.clearentError];
    }

    await strapi.db.query('api::deal-transaction.deal-transaction').update({
      where: {
        dealTransactionId: input.dealTransactionId.includes('#')
          ? input.dealTransactionId
          : `#${input.dealTransactionId}`,
      },
      data: updateData,
    });

    return true;
  } catch (error) {
    throw new Error('Failed to update deal transaction for clearent');
  }
};
