import { useInventoryAuditItemsRangeData } from '@ui/form/QuantityRangeInput/hooks/useInventoryAuditItemsRangeData';
import { getMinMaxValues } from '../helpers/getMinMaxValues';

export const useMinMaxValue = (queryType: string, fieldKey: string) => {
  const inventoryData: InventoryAuditItemRangeData | null =
    queryType === 'inventory' ? useInventoryAuditItemsRangeData() : null;

  switch (queryType) {
    case 'inventory':
      if (inventoryData) {
        return getMinMaxValues(inventoryData, fieldKey);
      }
      return { min: 0, max: 0 };
    default:
      return { min: 0, max: 0 };
  }
};
