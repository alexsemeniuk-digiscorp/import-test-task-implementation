import { handleError } from './../../../graphql/helpers/errors';

export const memoToExpiryDate = async (event, currentOrder) => {
  try {
    const updatedMemo = event?.params?.data?.memo;

    if (updatedMemo) {
      const expiryDate = new Date(
        currentOrder?.customCreationDate || currentOrder?.createdAt,
      );
      const memoDays = Number(updatedMemo);
      expiryDate.setDate(expiryDate.getDate() + memoDays);

      event.params.data.expiryDate = expiryDate;
    }
  } catch (e) {
    handleError('memoToExpiryDate', undefined, e);
  }
};
