import { useInventoryAuditItemRangeDataQuery } from '@/graphql';
import { useParams } from 'react-router';

export const useInventoryAuditItemsRangeData =
  (): InventoryAuditItemRangeData => {
    const params = useParams();
    const { data } = useInventoryAuditItemRangeDataQuery({
      variables: {
        uuid: params.uuid ?? '',
      },
    });

    return {
      minScannedQty: data?.inventoryAuditItemRangeData?.minScannedQty ?? 0,
      maxScannedQty: data?.inventoryAuditItemRangeData?.maxScannedQty ?? 0,
      minActualQty: data?.inventoryAuditItemRangeData?.minActualQty ?? 0,
      maxActualQty: data?.inventoryAuditItemRangeData?.maxActualQty ?? 0,
      minInventoryQty: data?.inventoryAuditItemRangeData?.minInventoryQty ?? 0,
      maxInventoryQty: data?.inventoryAuditItemRangeData?.maxInventoryQty ?? 0,
      minPrice: data?.inventoryAuditItemRangeData?.minPrice ?? 0,
      maxPrice: data?.inventoryAuditItemRangeData?.maxPrice ?? 0,
    };
  };
