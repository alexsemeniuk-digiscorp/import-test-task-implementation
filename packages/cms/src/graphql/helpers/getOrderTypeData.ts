export const getOrderTypeData = (orderType) => {
  const isSellingOrder =
    orderType === 'sell' ||
    orderType === 'rent' ||
    orderType === 'layaway' ||
    orderType === 'estimate';
  const isTradeInOrder = orderType === 'tradeIn';
  const isPurchaseOrder = orderType === 'purchase';

  return {
    isSellingOrder,
    isTradeInOrder,
    isPurchaseOrder,
  };
};
