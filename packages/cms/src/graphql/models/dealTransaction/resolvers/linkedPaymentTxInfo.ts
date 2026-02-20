import { GraphQLFieldResolver } from 'graphql';
import { NexusGenInputs } from './../../../../types/generated/graphql';

export const linkedPaymentTxInfo: GraphQLFieldResolver<
  any,
  Graphql.ResolverContext,
  { input: NexusGenInputs['LinkedPaymentTxInfoArgsInput'] }
> = async (root, args, ctx) => {
  try {
    const dealTransactions = await strapi.entityService.findMany(
      'api::deal-transaction.deal-transaction',
      {
        filters: {
          dealTransactionId: args.input.dealTransactionId,
        },
        fields: ['id', 'summary', 'paymentGatewayType'],
        populate: {
          tenant: {
            fields: ['id', 'paymentGatewayType'],
            populate: {
              logo: true,
              stripe_onboarding: {
                fields: ['id', 'accountId'],
              },
              clearent_onboarding: {
                fields: ['id', 'merchantId', 'terminalId'],
              },
            },
          },
          sellingOrder: {
            fields: ['id', 'orderId'],
          },
        },
      },
    );

    const dealTransaction = dealTransactions?.[0];

    if (!dealTransaction) {
      throw new Error('Deal transaction not found');
    }

    const owner = await strapi.entityService.findMany(
      'plugin::users-permissions.user',
      {
        filters: {
          role: { name: { $eq: 'Owner' } },
          tenant: { id: { $eq: dealTransaction?.tenant?.id } },
        },
        limit: 1,
        fields: ['id', 'preferredCurrency'],
      },
    );

    const defaultPreferredCurrency = 'USD|en-US';
    const defaultLocale = defaultPreferredCurrency?.split('|')[1];
    const defaultCurrency = defaultPreferredCurrency?.split('|')[0];

    const responseData = {
      id: dealTransaction?.id,
      orderId: dealTransaction?.sellingOrder?.orderId,
      summary: dealTransaction?.summary ?? 0,
      logo: dealTransaction?.tenant?.logo?.url,
      accountId: dealTransaction?.tenant?.stripe_onboarding?.accountId,
      paymentGatewayType:
        dealTransaction?.paymentGatewayType ??
        dealTransaction?.tenant?.paymentGatewayType,
      merchantId: dealTransaction?.tenant?.clearent_onboarding?.merchantId,
      terminalId: dealTransaction?.tenant?.clearent_onboarding?.terminalId,
      locale: owner?.[0]?.preferredCurrency?.split('|')[1] || defaultLocale,
      currency: owner?.[0]?.preferredCurrency?.split('|')[0] || defaultCurrency,
    };

    return responseData;
  } catch (error) {
    throw new Error('Failed to fetch linked payment transaction info');
  }
};
