import React from 'react';

import { ConfigProvider, Typography } from 'antd';

import dayjs from '@/dayjsConfig';
import { useUserSettingsContext } from '@app/UserSettingsProvider';
import { replace } from 'lodash';

interface DateDisplayProps {
  copyable?: boolean;
  value?: string | Maybe<Date> | number;
  withTime?: boolean;
  customDateFormat?: string | undefined;
  width?: number | string;
}

const RenderDate: React.FC<DateDisplayProps> = ({
  value,
  copyable,
  withTime,
  customDateFormat,
  width,
}) => {
  const { dateFormat, timeFormat } = useUserSettingsContext();

  const formattedDateFormat = replace(dateFormat ?? 'MM_DD_YYYY', /_/g, '/');
  const formattedTimeFormat = timeFormat === 'HH_mm' ? 'HH:mm' : 'hh:mm A';

  if (!value) {
    return '-';
  }

  const dateTimeFormat = withTime
    ? `${customDateFormat ?? formattedDateFormat} ${formattedTimeFormat}`
    : customDateFormat ?? formattedDateFormat;

  return value ? (
    <ConfigProvider
      theme={{
        components: {
          Typography: {
            fontWeightStrong: 500,
            fontSizeHeading5: 12,
          },
        },
      }}
    >
      <Typography.Title copyable={copyable} level={5} style={{ width }}>
        {value === 'nowDate'
          ? dayjs().tz().format(dateTimeFormat)
          : dayjs(value).tz().format(dateTimeFormat)}
      </Typography.Title>
    </ConfigProvider>
  ) : null;
};

export default RenderDate;
