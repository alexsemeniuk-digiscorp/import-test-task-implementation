import { RuleObject } from 'antd/es/form';
import { FC } from 'react';

import { CountryPhoneInput } from '@form/inputs/countryPhone/CountryPhoneInput';
import { CustomFormItem } from '@form/item/FormItem';
import { isPhoneValid } from '@form/validation/isPhoneValid';

interface IPhoneInput {
  onChange?: (value: string) => void;
  inputValue?: string;
  name?: string | (string | number)[];
  required?: boolean;
  label?: string;
}

const PhoneInputFormItem: FC<IPhoneInput> = ({
  onChange,
  inputValue,
  name = 'phoneNumber',
  label = 'Phone Number',
  required = true,
}) => {
  const rules = [
    {
      message: 'Please input a valid phone number (with a country code)',
      validator: (rule: RuleObject, value: string) => {
        if (!value) {
          return Promise.resolve();
        }

        if (!isPhoneValid(value)) {
          return Promise.reject(rule.message);
        }

        return Promise.resolve();
      },
      validateTrigger: 'onBlur',
    },
  ];
  return (
    <CustomFormItem
      label={label}
      name={name}
      rules={required ? [...rules] : []}
      valuePropName={'value'}
      htmlFor={'phoneNumber'}
      required={required}
    >
      <CountryPhoneInput
        value={!required ? inputValue : ''}
        onChange={onChange}
      />
    </CustomFormItem>
  );
};

export default PhoneInputFormItem;
