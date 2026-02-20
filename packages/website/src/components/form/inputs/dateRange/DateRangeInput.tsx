import { FC, useCallback, useState } from 'react';

import { ConfigProvider, DatePicker } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker';

import dayjs from 'dayjs';

export const DateRangeInput: FC<RangePickerProps> = (props) => {
  const { onChange, placeholder, value, separator = '-', ...rest } = props;

  const [placeholderState, setPlaceholder] = useState<
    [string, string] | undefined
  >(placeholder);

  const handleChange = useCallback(
    async (
      value: [null | dayjs.Dayjs, null | dayjs.Dayjs] | null,
      formatString: [string, string],
    ) => {
      const modifiedValues =
        value?.map((date) => date?.startOf('date') || null) || null;
      onChange && onChange(modifiedValues as typeof value, formatString);

      if (value) {
        setPlaceholder(['Now', 'Now']);
      } else {
        setPlaceholder(undefined);
      }
    },
    [onChange, setPlaceholder],
  );

  return (
    <ConfigProvider
      theme={{
        token: {
          sizePopupArrow: 0,
        },
      }}
    >
      <DatePicker.RangePicker
        onChange={handleChange}
        separator={separator}
        allowEmpty={[true, true]}
        placeholder={placeholderState}
        changeOnBlur
        value={!value || typeof value === 'string' ? [null, null] : value}
        {...rest}
      />
    </ConfigProvider>
  );
};
