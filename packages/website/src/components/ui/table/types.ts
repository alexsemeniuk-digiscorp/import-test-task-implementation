import { TablePaginationConfig } from 'antd';

export interface TableParams {
  pagination?: TablePaginationConfig;
  sort?: string | string[];
}
