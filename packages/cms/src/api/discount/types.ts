export type DiscountProductType =
  | 'products'
  | 'compositeProducts'
  | 'classes'
  | 'services'
  | 'memberships';

export type AnyObject<T = unknown> = Record<string, T>;
