import { AnyObject, ObjectKeys } from '@helpers/types';

import { GetChangeHandler } from '@form/hooks/useCustomForm';

export const clearNeededField =
  <T extends AnyObject>(
    filedName: ObjectKeys<T>,
    onChange: GetChangeHandler<T>,
  ) =>
  () =>
    onChange(filedName)?.(undefined as T[keyof T]);
export const clearNeededFieldByChange =
  <T extends AnyObject>(
    fieldName: ObjectKeys<T>,
    clearedFieldName: ObjectKeys<T>,
    onChange: GetChangeHandler<T>,
  ) =>
  () => {
    onChange(fieldName);
    onChange(clearedFieldName)?.(undefined as T[keyof T]);
  };
