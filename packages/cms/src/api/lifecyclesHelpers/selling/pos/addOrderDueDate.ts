import { handleError } from './../../../../graphql/helpers/errors';

export const addOrderDueDate = async (event, currentOrder) => {
  try {
    if (
      currentOrder.status === 'draft' &&
      event.params.data.status &&
      event.params.data.status !== 'draft' &&
      currentOrder.type === 'rent'
    ) {
      if (currentOrder.products.length === 0) return;

      const latestRentEnd = currentOrder.products.reduce((latest, product) => {
        const rentEnd = new Date(product.rentEnd);
        return rentEnd > latest ? rentEnd : latest;
      }, new Date());

      event.params.data.rentDueDate = latestRentEnd;
    }
  } catch (e) {
    handleError('addOrderDueDate', undefined, e);
  }
};
