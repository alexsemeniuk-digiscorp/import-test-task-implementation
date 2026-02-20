import React, { useCallback, useMemo } from 'react';

import { Popconfirm, Row, TablePaginationConfig, TableProps } from 'antd';
import { ColumnType } from 'antd/es/table';
import { FilterValue, SorterResult } from 'antd/es/table/interface';

import { AnyObject } from '@helpers/types';

import { Icon } from '@assets/icon';

import { CustomButton } from '@ui/button/Button';
import { CustomSpace } from '@ui/space';
import { CustomTable } from '@ui/table/CustomTable';
import { baseColumnFactory } from '@ui/table/column';

import classNames from 'classnames';
import styles from './TableInput.module.scss';

type AnyObjectWithId = AnyObject & {
  id?: string | null;
};

interface Props<T extends AnyObjectWithId>
  extends Omit<TableProps<T>, 'onChange'> {
  defaultEntity?: T;
  filterFunction?: (entity: T) => boolean;
  formData: T[] | undefined | null;
  onChange: (value: T[]) => void;
  onTableChange?: (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<T> | SorterResult<T>[],
  ) => void;
  addNewText?: string;
  columnFactories?: ColumnType<T>[];
  rowKey: TableProps<T>['rowKey'];
  disabled?: boolean;
  children?: React.ReactNode;
  withCompositeProducts?: boolean;
  showHeader?: boolean;
  withOutEmptyText?: boolean;
  pagination?: TablePaginationConfig | false;
}

const defaultFilterFunction = <T extends AnyObjectWithId>(entity: T) => {
  return Object.values(entity).some((value) => value !== undefined);
};

export const TableInput = <T extends AnyObjectWithId>({
  children,
  defaultEntity = {} as T,
  onChange,
  onTableChange,
  addNewText = 'Add New',
  columnFactories = [],
  filterFunction,
  formData,
  rowKey,
  disabled,
  withCompositeProducts,
  showHeader,
  withOutEmptyText,
  pagination = false,
  ...props
}: Props<T>) => {
  const data = formData?.filter(filterFunction ?? defaultFilterFunction);

  const handleDelete = useCallback(
    (index: number) => () => {
      const newData = [...(data || [])];
      onChange(newData.filter((_, i) => i !== index));
    },
    [data, onChange],
  );

  const addNewRecord = useCallback(() => {
    const newData = [...(data || []), defaultEntity];
    onChange(newData);
  }, [data, defaultEntity, onChange]);

  const isAddNewDisabled = data?.some((item, index, array) => {
    if (typeof rowKey === 'string') {
      return item[rowKey] === null || item[rowKey] === undefined;
    }

    if (typeof rowKey === 'function') {
      return !rowKey(item);
    }

    return false;
  });

  const columns: ColumnType<T>[] = useMemo(
    () => [
      ...columnFactories,
      baseColumnFactory({
        title: '',
        render: (_, __, index) => (
          <div className={styles.deleteContainer}>
            <Popconfirm
              title={'Sure to delete?'}
              onConfirm={handleDelete(index)}
            >
              <CustomButton
                disabled={disabled}
                type={'text'}
                icon={<Icon type={'delete'} />}
              />
            </Popconfirm>
          </div>
        ),
        width: 36,
      }),
    ],
    [columnFactories, disabled, handleDelete],
  );

  if (withCompositeProducts && !data?.length) return null;

  return (
    <CustomSpace
      className={classNames(undefined, {
        [styles.tableInputContainer]: withOutEmptyText,
      })}
      block
      direction={'vertical'}
      size={16}
    >
      <CustomTable<T>
        {...props}
        columns={columns}
        dataSource={data}
        pagination={pagination}
        rowKey={rowKey}
        showHeader={showHeader}
        onChange={onTableChange}
      />
      {!withCompositeProducts && (
        <Row justify={'space-between'}>
          <CustomButton
            type={'link'}
            icon={<Icon type={'plus-circle'} />}
            onClick={addNewRecord}
            disabled={isAddNewDisabled || disabled}
          >
            {addNewText}
          </CustomButton>
          {children}
        </Row>
      )}
    </CustomSpace>
  );
};
