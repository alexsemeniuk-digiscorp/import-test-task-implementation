import { FC } from 'react';

import { Typography } from 'antd';

interface Props {
  color?: string;
  fontSize?: string;
  isExpanded: boolean;
}
const TextOptions: FC<Props> = ({ color, fontSize, isExpanded }) => {
  return (
    <Typography.Text style={{ color: color, fontSize: fontSize ?? '12px' }}>
      {isExpanded ? 'Close' : 'View'}
    </Typography.Text>
  );
};

export default TextOptions;
