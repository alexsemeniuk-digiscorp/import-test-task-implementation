import { FC } from 'react';

import { Col, Form, InputNumber, Row, Select } from 'antd';

import { TIME_PERIODS } from '@helpers/time';
import { ObjectKeys, ObjectValues } from '@helpers/types';

import { CurrencyInput } from '@form/inputs/currencyInput/CurrencyInput';
import { CustomFormItem } from '@form/item/FormItem';

import {
  ProductValues,
  RentableDataValues,
} from '@inventory/inventoryManagement/products/types';
import capitalize from 'lodash/capitalize';

const timePeriodOptions = TIME_PERIODS.filter(
  (period) => !['month', 'year'].includes(period),
).map((period) => {
  const capitalizedPeriod = capitalize(period);

  return {
    value: period,
    label: capitalizedPeriod,
  };
});

interface RentableDataInputProps {
  onChange: (rentableData: RentableDataValues) => void;
}

export const RentableDataFields: FC<RentableDataInputProps> = ({
  onChange,
}) => {
  const form = Form.useFormInstance<ProductValues>();

  const handleChange =
    (key: ObjectKeys<RentableDataValues>) =>
    (value: ObjectValues<RentableDataValues>) => {
      const rentableData = form.getFieldValue('rentableData');

      onChange({
        ...rentableData,
        [key]: value,
      });
    };

  return (
    <Row gutter={24} align={'middle'}>
      <Col span={4}>
        <CustomFormItem
          name={['rentableData', 'period']}
          label={'Rentable Period'}
          required
        >
          <Select
            options={timePeriodOptions}
            onChange={handleChange('period')}
            placeholder={'Select Period Type'}
          />
        </CustomFormItem>
      </Col>
      <Col span={4}>
        <CustomFormItem
          name={['rentableData', 'pricePerPeriod']}
          label={'Price Per Rentable Period'}
          required
        >
          <CurrencyInput onChange={handleChange('pricePerPeriod')} />
        </CustomFormItem>
      </Col>
      <Col span={4}>
        <CustomFormItem name={['rentableData', 'lostFee']} label={'Lost Fee'}>
          <CurrencyInput onChange={handleChange('lostFee')} />
        </CustomFormItem>
      </Col>
      <Col span={4}>
        <CustomFormItem
          name={['rentableData', 'minimumRentalPeriod']}
          label={'Minimum rental period'}
        >
          <InputNumber
            min={0}
            onChange={handleChange('minimumRentalPeriod')}
            style={{ width: '100%' }}
            placeholder={'0'}
          />
        </CustomFormItem>
      </Col>
    </Row>
  );
};
