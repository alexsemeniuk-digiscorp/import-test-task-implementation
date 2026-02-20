export interface InventoryItem {
  id?: number;
  quantity: number;
  businessLocationId: string;
  quantityDifference: number;
  itemCost: number;
  serialized: string;
}
