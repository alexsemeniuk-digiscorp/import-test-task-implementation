export type AnyObject<T = unknown> = Record<string, T>;

export type ObjectKeys<T = AnyObject> = keyof T;
export type ObjectValues<T = AnyObject> = T[ObjectKeys<T>];

export type AccountingServiceType = 'quickBooks' | 'xero' | 'sage';
