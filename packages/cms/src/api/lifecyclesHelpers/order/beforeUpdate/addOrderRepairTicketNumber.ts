import { handleError, handleLogger } from '../../../../graphql/helpers/errors';

import BeforeLifecycleEvent = Database.BeforeLifecycleEvent;

export const addOrderRepairTicketNumber = async (
  event: BeforeLifecycleEvent,
  currentOrder,
) => {
  try {
    handleLogger(
      'info',
      'ORDER beforeUpdateOrderLifecycleHook addOrderRepairTicketNumber',
      `Params: ${JSON.stringify(event.params)}`,
    );

    if (
      currentOrder?.status === 'draft' &&
      event?.params?.data?.status &&
      event?.params?.data?.status !== 'draft' &&
      event?.params?.data?.type !== 'purchase' &&
      event?.params?.data?.type !== 'estimate' &&
      event?.params?.data?.type !== 'tradeIn'
    ) {
      if (currentOrder?.services && currentOrder?.services?.length > 0) {
        const lastOrderWithRepairTicketNumber =
          await strapi.entityService.findMany('api::order.order', {
            filters: {
              repairTicketNumber: {
                $ne: null,
              },
              tenant: {
                id: currentOrder?.tenant?.id,
              },
            },
            fields: ['id', 'repairTicketNumber', 'repairTicketNumberIncrement'],
            sort: ['repairTicketNumberIncrement:desc'],
            limit: 1,
          });

        const permissions = await strapi.entityService.findMany(
          'api::document-permission.document-permission',
          {
            filters: {
              tenant: {
                id: currentOrder?.tenant?.id,
              },
            },
            fields: ['id', 'startRepairTicketNumber'],
            limit: 1,
          },
        );

        if (
          lastOrderWithRepairTicketNumber &&
          lastOrderWithRepairTicketNumber?.length > 0
        ) {
          event.params.data.repairTicketNumberIncrement =
            Number(
              lastOrderWithRepairTicketNumber?.[0]?.repairTicketNumberIncrement,
            ) + 1;

          if (!permissions?.[0]?.startRepairTicketNumber) {
            event.params.data.repairTicketNumber =
              Number(lastOrderWithRepairTicketNumber?.[0]?.repairTicketNumber) +
              1;
          } else {
            event.params.data.repairTicketNumber =
              Number(permissions?.[0]?.startRepairTicketNumber) +
              Number(
                lastOrderWithRepairTicketNumber?.[0]
                  ?.repairTicketNumberIncrement,
              );
          }
        } else {
          event.params.data.repairTicketNumberIncrement = 1;

          if (!permissions?.[0]?.startRepairTicketNumber) {
            event.params.data.repairTicketNumber = 1;
          } else {
            event.params.data.repairTicketNumber = Number(
              permissions?.[0]?.startRepairTicketNumber,
            );
          }
        }
      }
    }
  } catch (e) {
    handleError(e, undefined, 'addOrderRepairTicketNumber');
  }
};
