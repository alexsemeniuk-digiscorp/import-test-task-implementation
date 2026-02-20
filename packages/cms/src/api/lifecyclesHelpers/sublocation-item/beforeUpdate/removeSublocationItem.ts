import BeforeLifecycleEvent = Database.BeforeLifecycleEvent;
import { handleError, handleLogger } from '../../../../graphql/helpers/errors';

export const removeSublocationItem = async (
  event: BeforeLifecycleEvent,
  sublocationItem,
) => {
  handleLogger(
    'info',
    'SublocationItem BeforeUpdate :: removeSublocationItem',
    `Params: ${JSON.stringify(event.params)}, sublocationItem:${JSON.stringify(
      sublocationItem,
    )}`,
  );

  const actualQty = Number(event?.params?.data?.actualQty);
  const scannedQty = Number(event?.params?.data?.scannedQty);
  const quantity = sublocationItem.quantity;

  const sublocationItemService = strapi.service(
    'api::sublocation-item.sublocation-item',
  );

  if (actualQty == 0 || scannedQty == 0 || quantity == 0) {
    const deletedSublocationItem = await sublocationItemService.delete(
      sublocationItem.id,
    );

    if (!deletedSublocationItem)
      return handleError(
        'SublocationItem BeforeUpdate :: removeSublocationItem',
        `SublocationItem:${JSON.stringify(sublocationItem)} was not removed`,
      );
  }
};
