import { FC, useMemo, useState } from 'react';

import { InputNumber, InputNumberProps } from 'antd';

import { defaultPlatformCurrencySymbol } from '@helpers/currency';
import { formatNumber } from '@helpers/formatter';
import { getCurrency } from '@helpers/getCurrency';
import classNames from 'classnames';
import styles from './CurrencyInput.module.scss';

interface Props extends InputNumberProps<number> {
  skipFormatting?: boolean;
  unchangeable?: boolean;
  maxLength?: number;
}
export const CurrencyInput: FC<Props> = (props) => {
  const {
    placeholder,
    prefix,
    skipFormatting,
    unchangeable = false,
    maxLength,
    ...restProps
  } = props;

  const { preferredCurrencySymbol } = getCurrency();

  const currencySymbol = useMemo(() => {
    return prefix ?? preferredCurrencySymbol ?? defaultPlatformCurrencySymbol;
  }, [prefix, preferredCurrencySymbol]);

  const [isTyping, setIsTyping] = useState(false);

  const toggleIsTyping = () => {
    setIsTyping((prev) => !prev);
  };

  const formatValue: InputNumberProps<number>['formatter'] = (value, info) => {
    if (isTyping) {
      const numberForParsing = info.input.split(',').join('');

      return formatNumber(Number(numberForParsing), {
        minimumFractionDigits: 0,
      });
    }

    return formatNumber(value);
  };

  return (
    <div
      className={classNames(undefined, {
        [styles.CurrencyInputWrapper]: unchangeable,
      })}
    >
      <InputNumber<number>
        {...restProps}
        controls={false}
        placeholder={placeholder ?? '0.00'}
        min={0}
        prefix={currencySymbol}
        formatter={!skipFormatting ? formatValue : undefined}
        onFocus={toggleIsTyping}
        onBlur={toggleIsTyping}
        style={{ width: '100%' }}
        maxLength={maxLength}
      />
    </div>
  );
};
