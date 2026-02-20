interface InputItem {
  orderItem: string;
  productInventoryItem: string;
  quantity: number;
  sublocationId: string;
}

interface GroupedItem {
  orderItem: string;
  productInventoryItem: string;
  sublocationIds: string[];
}

export const groupByProductAndOrder = (data: InputItem[]): GroupedItem[] => {
  const grouped: Record<
    string,
    {
      orderItem: string;
      productInventoryItem: string;
      sublocationIds: Set<string>;
    }
  > = {};

  data.forEach((item) => {
    const key = `${item.orderItem}-${item.productInventoryItem}`;
    if (!grouped[key]) {
      grouped[key] = {
        orderItem: item.orderItem,
        productInventoryItem: item.productInventoryItem,
        sublocationIds: new Set(),
      };
    }
    grouped[key].sublocationIds.add(item.sublocationId);
  });

  return Object.values(grouped).map((group) => ({
    orderItem: group.orderItem,
    productInventoryItem: group.productInventoryItem,
    sublocationIds: Array.from(group.sublocationIds),
  }));
};
