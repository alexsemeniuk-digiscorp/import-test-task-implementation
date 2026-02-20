import { FC } from 'react';
import { PhoneInput, defaultCountries } from 'react-international-phone';
import 'react-international-phone/style.css';

import { Form } from 'antd';

import classNames from 'classnames';

import styles from './CountryPhoneInput.module.scss';

interface CountryPhoneInputProps {
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

const countries = defaultCountries.filter(([_, iso2]) => iso2 !== 'ru');

export const CountryPhoneInput: FC<CountryPhoneInputProps> = (props) => {
  const { value, onChange } = props;
  const { status } = Form.Item.useStatus();
  return (
    <PhoneInput
      disabled={props.disabled}
      defaultCountry={'us'}
      value={value}
      onChange={onChange}
      className={styles.phoneWrap}
      inputClassName={classNames(styles.phoneInput, {
        [styles.error]: status === 'error',
      })}
      countrySelectorStyleProps={{
        className: classNames(styles.countrySelector, {
          [styles.error]: status === 'error',
        }),
      }}
      inputProps={{
        id: 'phoneNumber',
        name: 'phoneNumber',
        required: true,
        type: 'tel',
        placeholder: '+1 123 456 7890',
      }}
      countries={countries}
    />
  );
};
