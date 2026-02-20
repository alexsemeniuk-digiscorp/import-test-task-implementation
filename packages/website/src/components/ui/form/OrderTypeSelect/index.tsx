import { FC } from 'react';

import { Select, SelectProps } from 'antd';

import { OrderType } from '@helpers/enumTypes';
import capitalize from 'lodash/capitalize';
import { OrderTypeSelectOption } from './OrderTypeSelectOption';

interface OrderTypeSelectProps extends SelectProps {
  customOrderTypes?: OrderType[];
}

export const OrderTypeSelect: FC<OrderTypeSelectProps> = ({
  customOrderTypes,
  ...props
}) => {
  const availableTypes = customOrderTypes ?? Object.values(OrderType);

  const typesItems = availableTypes.map((type) => ({
    value: type,
    label: <OrderTypeSelectOption label={capitalize(type) as OrderType} />,
  }));

  return (
    <Select
      defaultValue={props.defaultValue ?? undefined}
      placeholder={'Pick order type'}
      optionLabelProp={'label'}
      options={typesItems}
      style={{ width: '100%' }}
      {...props}
    />
  );
};
