export interface ProductObj {
  productId: string;
  quantity: string;
  price: string;
  taxName: string;
  inventoryType?: 'product' | 'service' | 'class' | 'membership';
  serialNumbers: string[];
}

export interface OrderData {
  employee: string; //email
  status: string; //enum
  businessLocation: string; //location v4
  dueDate: string; // date
  localId: string;
  paidOff: string; // number
  customer: string; //email
  id: string;
  products?: ProductObj[];
  customCreationDate?: string; // date
  images?: string[];
  layaway: string;
  productItems: ProductObj[];
}
export interface OrderDataWithErrors extends OrderData {
  errors?: string[];
}

export type HeaderArrays = {
  defaultHeaders: string[];
  imagesHeaders: string[];
  productsHeaders: string[];
};
