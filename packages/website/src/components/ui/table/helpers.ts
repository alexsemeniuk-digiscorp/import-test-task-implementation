import { SorterResult } from 'antd/es/table/interface';

import { AnyObject, isNotEmpty } from '@helpers/types';
export const COLUMN_WIDTH_XXXXL = 800;
export const COLUMN_WIDTH_XXXL = 500;

export const COLUMN_WIDTH_XXL = 400;
export const COLUMN_WIDTH_XL = 300;
export const COLUMN_WIDTH_LG = 250;
export const COLUMN_WIDTH_L = 200;
export const COLUMN_WIDTH_ML = 170;
export const COLUMN_WIDTH_M = 150;
export const COLUMN_WIDTH_S = 100;
export const COLUMN_WIDTH_XS = 36;

export const TABLE_SCROLL_S = 500;
export const TABLE_SCROLL_M = 750;
export const TABLE_SCROLL_L = 1000;

export const calculateTableScrollX = (
  extraColumns: string[] | [],
  allColumns: unknown[],
  columnWidth: number,
  additionalWidth = 50,
): number => {
  return extraColumns.length > 0
    ? allColumns.length * columnWidth + additionalWidth
    : 0;
};

const sorterOrderToGraphql = (order: SorterResult<object>['order']) => {
  switch (order) {
    case 'descend':
      return 'desc';
    case 'ascend':
    default:
      return 'ASC';
  }
};

const transformSorterToGraphql = <T = AnyObject>(sorter?: SorterResult<T>) => {
  if (!sorter?.order || !sorter?.field) {
    return;
  }

  const order = sorterOrderToGraphql(sorter.order);

  // Check for custom sortKey on the column first
  const column = sorter.column as AnyObject | undefined;
  if (column?.sortKey) {
    return column.sortKey + ':' + order;
  }

  let fieldValue = sorter.field;

  if (Array.isArray(sorter.field)) {
    fieldValue = sorter?.field
      ?.filter((field) => field !== 'data' && field !== 'attributes')
      .join('.');
  }

  return fieldValue + ':' + order;
};

export const processSorter = <T = AnyObject>(
  sorter?: SorterResult<T> | SorterResult<T>[],
): string | string[] | undefined => {
  if (!sorter) {
    return;
  }

  if (Array.isArray(sorter)) {
    return sorter.map(transformSorterToGraphql).filter(isNotEmpty);
  }

  return transformSorterToGraphql(sorter);
};
