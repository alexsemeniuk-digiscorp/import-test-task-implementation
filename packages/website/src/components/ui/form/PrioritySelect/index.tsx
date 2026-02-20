import { FC } from 'react';

import { Select, SelectProps } from 'antd';

import { PriorityType } from '@helpers/enumTypes';
import capitalize from 'lodash/capitalize';
import { PrioritySelectOption } from './PrioritySelectOption';

export const PrioritySelect: FC<SelectProps> = (props) => {
  const typesItems = Object.values(PriorityType)?.map((type) => ({
    value: type,
    label: <PrioritySelectOption label={capitalize(type) as PriorityType} />,
  }));

  return (
    <Select
      defaultValue={props.defaultValue ?? undefined}
      placeholder={'Pick the priority'}
      optionLabelProp={'label'}
      options={typesItems}
      style={{ width: '100%' }}
      {...props}
    />
  );
};
