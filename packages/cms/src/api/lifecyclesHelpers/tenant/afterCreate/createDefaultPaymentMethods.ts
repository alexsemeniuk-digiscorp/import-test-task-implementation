import { defaultPaymentMethods } from '../static/defaultPaymentMethods';
export const createDefaultPaymentMethods = async (tenantId) => {
  for (let index = 0; index < defaultPaymentMethods.length; index++) {
    const element = defaultPaymentMethods[index];
    await strapi.entityService.create('api::payment-method.payment-method', {
      data: {
        tenant: tenantId,
        name: element,
        paymentType: 'sell',
      },
    });
  }
};
