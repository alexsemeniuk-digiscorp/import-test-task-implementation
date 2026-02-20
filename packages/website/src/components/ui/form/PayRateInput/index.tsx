import { FC, useEffect, useState } from 'react';

import { Col, Row, Select } from 'antd';

import { CurrencyInput } from '@form/inputs/currencyInput/CurrencyInput';
import { exhaustiveArray } from '@helpers/types';

const defaultPayRateInput: PayRateInput = {
  rate: 0,
  period: 'hour',
};

const PERIODS = exhaustiveArray<EnumPayratePeriod>()('hour', 'month');

const options = PERIODS.map((period) => ({
  value: period,
}));

interface Props {
  initValues?: PayRateInput;
  onChange: (values: PayRateInput) => void;
}

export const PayRateInput: FC<Props> = ({ initValues, onChange }) => {
  const [payRateInput, setPayRateInput] = useState<PayRateInput>(
    initValues ?? defaultPayRateInput,
  );

  useEffect(() => {
    onChange(payRateInput);
  }, [onChange, payRateInput]);

  const handleChange = (value: number | null) => {
    setPayRateInput((prev) => ({ ...prev, rate: value }));
  };

  const handlePeriodChange = (value: PayRateInput['period']) => {
    setPayRateInput((prev) => ({ ...prev, period: value }));
  };

  return (
    <Row gutter={[16, 16]} wrap align={'middle'}>
      <Col span={16}>
        <CurrencyInput
          placeholder={'Enter rate'}
          value={payRateInput.rate}
          onChange={handleChange}
        />
      </Col>
      <Col span={8}>
        <Select
          value={payRateInput.period}
          onChange={handlePeriodChange}
          options={options}
          style={{ width: '100%' }}
          placeholder={'Select period'}
        />
      </Col>
    </Row>
  );
};
