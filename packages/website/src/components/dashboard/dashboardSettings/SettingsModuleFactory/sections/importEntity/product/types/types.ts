export interface ProductInventoryItemObj {
  quantity: string; // number
  businessLocationId: string; //relation
  itemCost: string; // relation with item event
}

export interface ProductData {
  productId: string; // Unique identifier for the product
  defaultPrice: string; // number;
  localId: string; // Unique local identifier, probably a UUID
  barcodeId: string; // Barcode identifier
  name: string; // Product name
  brand: string; // relation
  serialNumber: string;
  model: string;
  dimensionLength: string; // number;
  dimensionWidth: string; // number;
  dimensionHeight: string; // number;
  dimensionUnit: string; // enum;
  weight: string; // number;
  weightUnit: string; // enum
  sku: string;
  upc: string;
  mpn: string;
  ean: string;
  isbn: string;
  partsWarranty: string; // Date;
  laborWarranty: string; // Date;
  description: string;
  productType: string; // relation
  productItems?: ProductInventoryItemObj[];
  images?: string[];
  [key: string]: any;
}

export interface ProductDataWithErrors extends ProductData {
  errors?: string[];
}
