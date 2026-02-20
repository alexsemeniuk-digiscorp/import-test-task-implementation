import React from 'react';

import { ColumnType } from 'antd/es/table';

import { AnyObject, ObjectKeys } from '@helpers/types';

import { baseColumnFactory } from '@ui/table/column';

interface RenderProps<T extends AnyObject> {
  index: number;
  item: T;
  value: any;
}

interface TableInputColumnFactoryProps<T extends AnyObject>
  extends Omit<ColumnType<T>, 'render' | 'dataIndex'> {
  title: string;
  render: (props: RenderProps<T>) => React.ReactNode;
  dataIndex: ObjectKeys<T>;
  required?: boolean;
}

export const tableInputColumnFactory = <T extends AnyObject>({
  title,
  render,
  dataIndex,
  required,
  ...columnProps
}: TableInputColumnFactoryProps<T>): ColumnType<T> => {
  return baseColumnFactory<T>({
    ...columnProps,
    dataIndex: dataIndex as string,
    title,
    render: (value, record, index) =>
      render({
        index,
        item: record,
        value,
      }),
  });
};
