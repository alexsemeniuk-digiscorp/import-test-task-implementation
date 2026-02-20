export type RequiredField<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type OptionalField<T, K extends keyof T> = Pick<Partial<T>, K> &
  Omit<T, K>;

export type AnyObject<T = unknown> = Record<string, T>;

export type ObjectKeys<T = AnyObject> = keyof T;
export type ObjectValues<T = AnyObject> = T[ObjectKeys<T>];

export type WithId<T extends AnyObject = AnyObject> = T & {
  id?: Maybe<string>;
};

export const isNotEmpty = <T>(value: T | null | undefined): value is T => {
  return value !== null && value !== undefined;
};

export type RefType =
  | `api::${string}.${string}`
  | `ui.${string}`
  | `plugin::${string}.${string}`;

export type NonEmptyArray<T> = [T, ...T[]];

export const exhaustiveArray = <T extends string>() => {
  return <L extends NonEmptyArray<T>>(
    ...x: Exclude<T, L[number]> extends never ? L : Exclude<T, L[number]>[]
  ) => x;
};
