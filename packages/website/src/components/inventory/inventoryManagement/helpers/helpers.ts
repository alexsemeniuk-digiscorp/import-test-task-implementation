import { isEqual } from 'lodash';

import { AnyObject, isNotEmpty, ObjectKeys, WithId } from '@helpers/types';
import omit from 'lodash/omit';

type ValuesPair<T extends WithId = WithId> = {
  initialValues?: T[];
  newValues?: T[];
};
export const getItemsForUpdate = <T extends WithId = WithId>({
  initialValues,
  newValues,
}: ValuesPair<T>): T[] | undefined => {
  return initialValues
    ?.map((item) => {
      const newItem = newValues?.find((newItem) => newItem?.id === item?.id);

      if (!newItem) {
        return null;
      }

      return !isEqual(item, newItem) ? newItem : null;
    })
    .filter(isNotEmpty);
};

export const getItemsForCreate = <T extends WithId = WithId>(
  newValues?: T[],
): T[] | undefined => {
  return newValues?.filter((item) => !item?.id);
};

export const getItemsForDelete = <T extends WithId = WithId>({
  initialValues,
  newValues,
}: ValuesPair<T>): T[] | undefined => {
  return initialValues?.filter(
    (item) => !newValues?.some(({ id }) => id === item?.id),
  );
};

interface HasObjectChangedParams<T extends AnyObject = AnyObject> {
  initialValues?: T;
  newValues?: T;
  additionalOmittedKeys?: ObjectKeys<T>[];
}

export const hasObjectChanged = <T extends Record<string, any>>({
  initialValues,
  newValues,
  additionalOmittedKeys = [],
}: HasObjectChangedParams<T>): boolean => {
  const keysToOmit = ['uuid', '__typename', ...(additionalOmittedKeys || [])];

  if ((!initialValues && newValues) || (!newValues && initialValues)) {
    return true;
  }

  const mergedValues = Object.keys({ ...initialValues, ...newValues }).reduce(
    (acc, key) => {
      const typedKey = key as keyof T;

      acc[typedKey] =
        newValues?.[typedKey] !== undefined
          ? newValues[typedKey]
          : initialValues?.[typedKey];

      return acc;
    },
    {} as Partial<T>,
  ) as T;

  return (
    Boolean(initialValues && mergedValues) &&
    !isEqual(omit(initialValues, keysToOmit), omit(mergedValues, keysToOmit))
  );
};
