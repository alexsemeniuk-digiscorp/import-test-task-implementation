import { FC, useEffect, useState } from 'react';

import { Col, InputNumber, InputNumberProps, Row, Select } from 'antd';

import { isEqual } from 'lodash';

import { exhaustiveArray } from '@helpers/types';
import { DimensionValues } from '@inventory/inventoryManagement/products/types';

const defaultDimensionInput: DimensionValues = {
  length: null,
  width: null,
  height: null,
  unit: 'in',
};

const UNITS = exhaustiveArray<EnumDimensionUnit>()(
  'mm',
  'cm',
  'm',
  'in',
  'ft',
  'yd',
);

const options = UNITS.map((unit) => ({
  value: unit,
}));

const commonInputProps: InputNumberProps<number> = {
  min: 0,
  style: { width: '100%' },
};

interface Props {
  initialValue?: DimensionValues;
  onChange: (value: DimensionValues) => void;
}
export const ProductDimensionsInput: FC<Props> = ({
  onChange,
  initialValue,
}) => {
  const [dimensionInput, setDimensionInput] = useState<DimensionValues>(
    initialValue || defaultDimensionInput,
  );

  useEffect(() => {
    if (!initialValue) return;

    setDimensionInput(initialValue);
  }, [initialValue]);

  const handleChange =
    (key: keyof DimensionValues) => (value: number | null) => {
      setDimensionInput((prev) => ({ ...prev, [key]: value }));
    };

  const handleUnitChange = (value: DimensionValues['unit']) => {
    setDimensionInput((prev) => ({ ...prev, unit: value }));
  };

  useEffect(() => {
    if (isEqual(dimensionInput, initialValue)) return;

    onChange(dimensionInput);
  }, [dimensionInput, initialValue, onChange]);

  return (
    <Row gutter={[16, 16]} wrap align={'middle'}>
      <Col span={6}>
        <InputNumber<number>
          placeholder={'Length'}
          value={dimensionInput.length}
          onChange={handleChange('length')}
          {...commonInputProps}
        />
      </Col>
      <Col span={6}>
        <InputNumber<number>
          placeholder={'Width'}
          value={dimensionInput.width}
          onChange={handleChange('width')}
          {...commonInputProps}
        />
      </Col>
      <Col span={6}>
        <InputNumber<number>
          placeholder={'Height'}
          value={dimensionInput.height}
          onChange={handleChange('height')}
          {...commonInputProps}
        />
      </Col>
      <Col flex={'1'}>
        <Select
          value={dimensionInput.unit}
          onChange={handleUnitChange}
          options={options}
          style={{ width: '100%' }}
          placeholder={'Unit'}
        />
      </Col>
    </Row>
  );
};
