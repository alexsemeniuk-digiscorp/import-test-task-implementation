export const getMinMaxValues = (
  inventoryData: InventoryAuditItemRangeData,
  fieldKey: string,
) => {
  let min, max;

  switch (fieldKey) {
    case 'scannedQty':
      // scannedQty: min = minScannedQty < minActualQty ? minScannedQty : minActualQty
      // max = maxScannedQty > maxActualQty ? maxScannedQty : maxActualQty
      min = Math.min(
        inventoryData.minScannedQty ?? Infinity,
        inventoryData.minActualQty ?? Infinity,
      );
      max = Math.max(
        inventoryData.maxScannedQty ?? -Infinity,
        inventoryData.maxActualQty ?? -Infinity,
      );
      break;

    case 'inventoryQty':
      //  inventoryQty: min = minInventoryQty, max = maxInventoryQty
      min = inventoryData.minInventoryQty ?? 0;
      max = inventoryData.maxInventoryQty ?? 0;
      break;

    default:
      min = 0;
      max = 0;
      break;
  }

  min = min === Infinity ? 0 : min;
  max = max === -Infinity ? 0 : max;

  return { min, max };
};
