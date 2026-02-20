import { handleError } from './../../../graphql/helpers/errors';

export const updateOrderShipment = async (event, currentOrder) => {
  try {
    const updatedShipment = event?.params?.data?.shipment;

    if (updatedShipment !== undefined) {
      event.params.data.total =
        currentOrder.total - currentOrder.shipment + updatedShipment;
    }
  } catch (e) {
    handleError('updateOrderShipment', undefined, e);
  }
};
