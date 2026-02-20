import { FC } from 'react';

import { EyeOutlined } from '@ant-design/icons';

interface Props {
  size?: number;
  borderRadius?: string;
}
export const CustomPreviewEyeMask: FC<Props> = ({
  size = 16,
  borderRadius = '50%',
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      borderRadius,
    }}
  >
    <EyeOutlined style={{ fontSize: size, color: '#fff' }} />
  </div>
);
