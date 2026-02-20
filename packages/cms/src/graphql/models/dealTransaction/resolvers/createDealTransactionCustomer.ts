import { ID } from '@strapi/strapi/lib/services/entity-service/types/params/attributes';
import { GraphQLFieldResolver } from 'graphql';
import {
  CreateDealTransactionCustomerInput,
  CreateDealTransactionCustomerResponse,
} from '../types/types';

export const createDealTransactionCustomer: GraphQLFieldResolver<
  null,
  null,
  { input: CreateDealTransactionCustomerInput }
> = async (root, { input }): Promise<CreateDealTransactionCustomerResponse> => {
  try {
    const dealTransactionData = await strapi.db
      .query('api::deal-transaction.deal-transaction')
      .findOne({
        where: {
          sellingOrder: input.sellingOrder,
          status: 'Running',
        },
        populate: ['tenant'],
      });

    let paymentMethodTypeId;
    if (input.paymentMethod) {
      const existingPaymentMethod = await strapi.db
        .query('api::payment-method.payment-method')
        .findOne({
          where: {
            name: input.paymentMethod.toLowerCase(),
            tenant: input.tenantId,
          },
        });

      if (existingPaymentMethod) {
        paymentMethodTypeId = existingPaymentMethod?.id;
      } else {
        const newPaymentMethod = await strapi.entityService.create(
          'api::payment-method.payment-method',
          {
            data: {
              name: input.paymentMethod.toLowerCase(),
              tenant: input.tenantId as ID,
              paymentType: 'sell',
            },
          },
        );
        paymentMethodTypeId = newPaymentMethod?.id as number;
      }
    }

    //deal transaction exists then update the deal transaction
    if (dealTransactionData) {
      // Get existing clearent errors
      const existingErrors = dealTransactionData?.clearentError
        ? Array.isArray(dealTransactionData.clearentError)
          ? dealTransactionData.clearentError
          : [dealTransactionData.clearentError]
        : [];

      // If new error exists, append it to the array
      const updatedErrors = input.clearentError
        ? [...existingErrors, input.clearentError]
        : existingErrors;

      await strapi.db.query('api::deal-transaction.deal-transaction').update({
        where: {
          id: dealTransactionData.id,
        },
        data: {
          paid: input.paid,
          status: input.status,
          paymentMethod:
            dealTransactionData?.paymentGatewayType === 'clearent'
              ? paymentMethodTypeId
              : dealTransactionData?.paymentMethod,
          clearentInfo: input.clearentInfo || dealTransactionData?.clearentInfo,
          paymentGatewayType: input.paymentGatewayType || 'stripe',
          stripeInfo: input.stripeInfo || dealTransactionData?.stripeInfo,
          clearentError: updatedErrors,
        },
      });
    } else {
      await strapi.db.query('api::deal-transaction.deal-transaction').create({
        data: {
          dealTransactionId: input.dealTransactionId,
          chartAccount: input.chartAccount,
          dueDate: input.dueDate,
          paid: input.paid,
          repetitive: input.repetitive,
          sellingOrder: input.sellingOrder,
          status: input.status,
          summary: input.summary,
          tenant: input.tenantId,
          clearentInfo: input?.clearentInfo,
          paymentGatewayType: input.paymentGatewayType || 'stripe',
          paymentMethod:
            dealTransactionData?.paymentGatewayType === 'clearent'
              ? paymentMethodTypeId
              : dealTransactionData?.paymentMethod,
          stripeInfo: input.stripeInfo || dealTransactionData?.stripeInfo,
          clearentError: input.clearentError ? [input.clearentError] : [],
        },
      });
    }

    return {
      status: true,
    };
  } catch (error) {
    throw new Error(error);
  }
};
