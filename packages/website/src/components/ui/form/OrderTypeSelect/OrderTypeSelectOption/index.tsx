import { FC } from 'react';

import { OrderType } from '@helpers/enumTypes';
import { Space } from 'antd';

interface Props {
  label: OrderType;
}

export const OrderTypeSelectOption: FC<Props> = ({ label }) => (
  <Space>{label}</Space>
);
