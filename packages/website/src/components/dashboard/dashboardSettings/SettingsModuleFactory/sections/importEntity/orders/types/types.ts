export interface ProductObj {
  productId: string;
  quantity: string;
  price: string;
  taxName: string;
}

export interface OrderData {
  sales: string; //email
  status: string; //enum
  businessLocation: string; //location v4
  dueDate: string; // date
  localId: string;
  customer: string; //email
  id: string;
  products?: ProductObj[];
  customCreationDate?: string; // date
  images?: string[];
}
export interface OrderDataWithErrors extends OrderData {
  errors?: string[];
}

export type HeaderArrays = {
  defaultHeaders: string[];
  imagesHeaders: string[];
  productsHeaders: string[];
};
