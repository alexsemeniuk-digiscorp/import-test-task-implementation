import { ConfigProvider, Table, TableProps } from 'antd';

import classNames from 'classnames';

import paginationStyles from '@ui/pagination/CustomPagination.module.scss';

import styles from './CustomTable.module.scss';

export const CustomTable = <T extends object>(
  props: TableProps<T> & { withoutShadow?: boolean },
) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorSplit: '#FFF',
          colorBorderSecondary: '#F7F8FA',
          lineWidth: 2,
          fontSize: 12,
        },
      }}
    >
      <Table<T>
        {...props}
        className={classNames(
          styles.customTable,
          paginationStyles.pagination,
          props.className,
          {
            [styles.shadow]: !props.withoutShadow,
          },
        )}
        rowClassName={styles.row}
      />
    </ConfigProvider>
  );
};
