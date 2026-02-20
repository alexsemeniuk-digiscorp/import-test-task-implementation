import { ObjectKeys } from '@helpers/types';

export const getTableFieldPath = <T>(
  filedName: string,
  index: number,
  field: ObjectKeys<T>,
): [string, string, keyof T] => [filedName, String(index), field];
