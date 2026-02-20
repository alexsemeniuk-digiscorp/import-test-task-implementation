import React, { CSSProperties, useState } from 'react';

import { ConfigProvider, Typography } from 'antd';
import { EllipsisConfig } from 'antd/lib/typography/Base';

interface ConditionalTitleProps {
  value: string | number | null;
  copyable?: boolean;
  symbolsAmount?: number;
  style?: CSSProperties;
  hasMoreBtn?: boolean;
}

const RenderId: React.FC<ConditionalTitleProps> = React.memo(
  ({ value, copyable, style, symbolsAmount, hasMoreBtn = false }) => {
    const [expanded, setExpanded] = useState(false);

    const ellipsisConfig: boolean | EllipsisConfig = hasMoreBtn
      ? {
          rows: 2,
          expandable: 'collapsible',
          expanded,
          onExpand: (_, info) => setExpanded(info.expanded),
          symbol: (expanded) => (expanded ? 'less' : 'more'),
        }
      : { tooltip: value };

    return value != null ? (
      <ConfigProvider
        theme={{
          components: {
            Typography: {
              fontSizeHeading5: 12,
              fontWeightStrong: 500,
              colorLinkHover: '#0958d9',
              colorPrimaryBorder: '#0958d9',
            },
          },
        }}
      >
        <Typography.Title
          copyable={!!copyable}
          level={5}
          style={style}
          ellipsis={ellipsisConfig}
        >
          {typeof value === 'string' &&
          symbolsAmount &&
          value.length > symbolsAmount
            ? `${value.slice(0, symbolsAmount)}...`
            : value}
        </Typography.Title>
      </ConfigProvider>
    ) : null;
  },
);

export default RenderId;
