import { FC, useEffect, useState } from 'react';

import { Col, InputNumber, Row, Select } from 'antd';

import { isEqual } from 'lodash';

import { exhaustiveArray } from '@helpers/types';
import { WeightValues } from '@inventory/inventoryManagement/products/types';

const UNITS = exhaustiveArray<EnumWeightUnit>()(
  'mg',
  'g',
  'kg',
  'gr',
  'oz',
  'lb',
  'ct',
  'dwt',
);

const options = UNITS.map((unit) => ({
  value: unit,
}));

interface Props {
  defaultWeightInput?: WeightValues;
  initialValue?: WeightValues;
  onChange: (value: WeightValues) => void;
}

export const ProductWeightInput: FC<Props> = ({
  onChange,
  initialValue,
  defaultWeightInput = {
    value: null,
    unit: 'lb',
  },
}) => {
  const [weightInput, setWeightInput] = useState<WeightValues>(
    initialValue || defaultWeightInput,
  );

  const handleChange = (value: number | null) => {
    setWeightInput((prev) => ({ ...prev, value }));
  };

  const handleUnitChange = (value: WeightValues['unit']) => {
    setWeightInput((prev) => ({ ...prev, unit: value }));
  };

  useEffect(() => {
    if (isEqual(weightInput, initialValue)) return;

    onChange(weightInput);
  }, [initialValue, onChange, weightInput]);

  useEffect(() => {
    if (!initialValue) return;

    setWeightInput(initialValue);
  }, [initialValue]);

  return (
    <Row gutter={[16, 16]} wrap align={'middle'}>
      <Col span={12}>
        <InputNumber<number>
          placeholder={'Enter weight'}
          value={weightInput.value}
          onChange={handleChange}
          min={0}
          style={{ width: '100%' }}
        />
      </Col>
      <Col span={12}>
        <Select
          value={weightInput.unit}
          onChange={handleUnitChange}
          options={options}
          style={{ width: '100%' }}
          placeholder={'Unit'}
        />
      </Col>
    </Row>
  );
};
