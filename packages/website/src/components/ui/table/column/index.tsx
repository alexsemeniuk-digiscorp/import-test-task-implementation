import { ColumnType } from 'antd/es/table';

import { AnyObject } from '@helpers/types';

export const baseColumnFactory = <T extends AnyObject>(
  props: ColumnType<T>,
): ColumnType<T> => {
  const { align = 'left', ...otherProps } = props;
  return {
    ...otherProps,
    align,
  };
};
