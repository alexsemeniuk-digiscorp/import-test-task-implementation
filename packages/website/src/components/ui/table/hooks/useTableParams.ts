import { useCallback, useMemo, useState } from 'react';

import { TablePaginationConfig } from 'antd';
import { FilterValue, SorterResult } from 'antd/es/table/interface';

import { processSorter } from '@ui/table/helpers';
import { TableParams } from '@ui/table/types';

export const DEFAULT_PAGINATION: TableParams['pagination'] = {
  defaultCurrent: 1,
  defaultPageSize: 5,
  pageSizeOptions: ['5', '10', '20', '50', '100'],
  showTotal: (total, [from, to]) => `${from}-${to} of ${total} results`,
  showLessItems: true,
  showSizeChanger: true,
  totalBoundaryShowSizeChanger: 6,
  showPrevNextJumpers: true,
  showQuickJumper: false,
  position: ['bottomLeft'],
};

const DEFAULT_PARAMS = {
  pagination: {
    ...DEFAULT_PAGINATION,
  },
  sort: ['createdAt:desc'],
};

export const useTableParams = <T extends object>(
  initialParams: TableParams = DEFAULT_PARAMS,
) => {
  const defaultPaginationParamsMerged = useMemo<
    TableParams['pagination']
  >(() => {
    return {
      ...DEFAULT_PAGINATION,
      ...initialParams.pagination,
    };
  }, [initialParams.pagination]);

  const [tableParams, setTableParams] = useState<TableParams>({
    ...DEFAULT_PARAMS,
    ...initialParams,
    pagination: defaultPaginationParamsMerged,
  });

  const handleTableChange = useCallback(
    (
      pagination: TablePaginationConfig,
      _: Record<string, FilterValue | null>,
      sorter: SorterResult<T> | SorterResult<T>[],
    ) => {
      setTableParams({
        pagination: {
          ...defaultPaginationParamsMerged,
          ...pagination,
        },
        sort:
          processSorter<T>(sorter) ||
          initialParams?.sort ||
          DEFAULT_PARAMS.sort,
      });
    },
    [defaultPaginationParamsMerged, initialParams?.sort],
  );

  const updateTotalValue = useCallback((total?: number) => {
    setTableParams((prev) => ({
      ...prev,
      pagination: { ...prev.pagination, total },
    }));
  }, []);

  return {
    tableParams,
    handleTableChange,
    updateTotalValue,
  };
};
