interface StockItem {
  qty: number;
  is_in_stock: boolean;
  backorders: number;
}

interface CustomAttribute {
  attribute_code: string;
  value: string;
}

interface MediaGalleryEntryContent {
  base64EncodedData: string;
  type: string;
  name: string;
}

interface MediaGalleryEntry {
  media_type: 'image';
  label: string;
  position: number;
  disabled: boolean;
  types: string[];
  file: string;
  content: MediaGalleryEntryContent;
}

interface ProductExtensionAttributes {
  stock_item: StockItem;
}

interface Product {
  sku: string;
  name: string;
  attribute_set_id: number;
  price: number;
  status: number;
  visibility: number;
  type_id: 'simple';
  extension_attributes: ProductExtensionAttributes;
  custom_attributes?: CustomAttribute[];
  media_gallery_entries?: MediaGalleryEntry[];
}

export interface ProductData {
  product: Product;
}
