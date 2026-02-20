export type InventoryAuditItemFilters = {
  productInventoryItem?: {
    product?: {
      name?: {
        containsi: string;
      };
      barcode?: {
        containsi: string;
      };
      defaultPrice?: {
        gte: number;
        lte: number;
      };
    };
  };
  inventoryQty?: {
    gte: number;
    lte: number;
  };
  scannedQty?: {
    eq?: number;
    gt?: number;
    gte?: number;
    lte?: number;
  };
  adjusted?: boolean;
  scanned?: number;
  over?: number;
  partial?: number;
};

type GeneratedInventoryAuditItemFilters = {
  productInventoryItem?: {
    product?: {
      name?: {
        $containsi: string;
      };
      barcode?: {
        $containsi: string;
      };
    };
    price?: {
      $gte: number;
      $lte: number;
    };
  };
  inventoryQty?: {
    $gte: number;
    $lte: number;
  };
  scannedQty?: {
    $gte: number;
    $lte: number;
  };
  adjusted?: boolean;
  scanned?: number;
  over?: number;
  partial?: number;
};

export const generateFilters = (
  inputFilters: InventoryAuditItemFilters,
): GeneratedInventoryAuditItemFilters => {
  const filters: any = {};

  if (inputFilters.productInventoryItem) {
    filters.productInventoryItem = {};

    if (inputFilters.productInventoryItem.product) {
      filters.productInventoryItem.product = {};

      if (inputFilters.productInventoryItem.product.barcode?.containsi) {
        filters.productInventoryItem.product.barcode = {
          $containsi:
            inputFilters.productInventoryItem.product.barcode.containsi,
        };
      }
    }
    if (inputFilters.productInventoryItem.product.defaultPrice) {
      filters.productInventoryItem.product.defaultPrice = {};
      if (
        inputFilters.productInventoryItem.product.defaultPrice.gte !== undefined
      ) {
        filters.productInventoryItem.product.defaultPrice.$gte =
          inputFilters.productInventoryItem.product.defaultPrice.gte;
      }
      if (
        inputFilters.productInventoryItem.product.defaultPrice.lte !== undefined
      ) {
        filters.productInventoryItem.product.defaultPrice.$lte =
          inputFilters.productInventoryItem.product.defaultPrice.lte;
      }
    }
  }

  if (inputFilters.inventoryQty) {
    filters.inventoryQty = {};
    if (inputFilters.inventoryQty.gte !== undefined) {
      filters.inventoryQty.$gte = inputFilters.inventoryQty.gte;
    }
    if (inputFilters.inventoryQty.lte !== undefined) {
      filters.inventoryQty.$lte = inputFilters.inventoryQty.lte;
    }
  }

  if (inputFilters.scannedQty) {
    filters.scannedQty = {};
    if (inputFilters.scannedQty.eq === 0) {
      filters.$and = [{ scannedQty: { $eq: 0 } }, { actualQty: { $eq: 0 } }];
    }
    if (inputFilters.scannedQty.eq === 1) {
      filters.scanned = 1;
    }
    if (inputFilters.scannedQty.gt === 1) {
      filters.over = 1;
    }
    if (inputFilters.scannedQty.gt === 0) {
      filters.partial = 1;
    }
    if (inputFilters.scannedQty.gte !== undefined) {
      filters.scannedQty.$gte = inputFilters.scannedQty.gte;
    }
    if (inputFilters.scannedQty.lte !== undefined) {
      filters.scannedQty.$lte = inputFilters.scannedQty.lte;
    }
  }

  return filters;
};
