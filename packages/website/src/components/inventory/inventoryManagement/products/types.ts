import { UploadFile } from 'antd';

import { Dayjs } from 'dayjs';

import { WithId } from '@helpers/types';

export type DimensionValues = WithId<
  Omit<DimensionInput, 'product' | 'jewelryProduct'>
>;

export type WeightValues = WithId<
  Omit<WeightInput, 'product' | 'jewelryProduct' | 'stone'>
>;

export type RentableDataValues = WithId<
  Omit<RentableDataInput, 'product' | 'jewelryProduct'>
>;

export type ProductAttributeOptionValues = {
  attributeId?: Maybe<string>;
  optionId?: Maybe<string>;
};

export type ProductInventoryItemValues = WithId<
  Omit<
    ProductInventoryItemInput,
    | 'product'
    | 'jewelryProduct'
    | 'eventQuantity'
    | 'sublocation'
    | 'sublocations'
    | 'sublocationItems'
    | 'serializes'
    | 'prevSerialNumbers'
    | 'productOrderItems'
    | 'tax'
    | 'taxCollection'
  > & {
    prevSerialNumbers?: (string | null | undefined)[] | [];
    serializes?: (string | null | undefined)[] | [];
    sublocation?: string | null;
    eventQuantity?: number;
    paid?: boolean;
    inputInvoiceNum?: string;
    memoNumber?: string;
    taxOrTaxCollection?: any;
  } & ProductInventoryItemEventInput
>;

export type ProductValues = Omit<
  ProductInput,
  | 'files'
  | 'dimension'
  | 'weight'
  | 'partsWarranty'
  | 'laborWarranty'
  | 'expiryDate'
  | 'rentableData'
  | 'productInventoryItems'
  | 'productAttributeOptions'
> & {
  id?: string;
  name?: string;
  files?: UploadFile[];
  dimension?: DimensionValues;
  weight?: WeightValues;
  partsWarranty?: Dayjs | null;
  laborWarranty?: Dayjs | null;
  expiryDate?: Dayjs | null;
  rentableData?: RentableDataValues;
  productInventoryItems?: ProductInventoryItemValues[];
  productAttributeOptions?: ProductAttributeOptionValues[];
  isTrackSwitched?: boolean;
  trackProductInventory?: Maybe<boolean>;
  returnable?: Maybe<boolean>;
  isNegativeCount?: Maybe<boolean>;
  active?: Maybe<boolean>;
};

export type ISelectedProductsListForPrint = {
  printQty: number;
  id: string;
  attributes: {
    product: string;
    tag: string;
    sku: string;
    upc: string;
    mpn: string;
    price: number;
    barcode: string;
  };
};

export type PrintSizeType = 'LARGE' | 'MEDIUM' | 'SMALL';

export enum PrintSizeEnum {
  LARGE = 'LARGE',
  MEDIUM = 'MEDIUM',
  SMALL = 'SMALL',
}
export interface ReturnUseEntityType {
  mutationLoading: boolean;
  handleCreate: (name: string) => Promise<void>;
  handleRemove: (id: string) => Promise<void>;
}

export type CharAccountData = {
  revenueChartAccount?: string;
  costChartAccount?: string;
  revenueChartCategory?: string;
  revenueChartSubcategory?: string;
  costChartCategory?: string;
  costChartSubcategory?: string;
};
