import { FC } from 'react';

import { Spin, SpinProps } from 'antd';

import { CustomSpace } from '@ui/space';

const Loader: FC<SpinProps> = (props) => (
  <CustomSpace
    align={'center'}
    block
    style={{
      justifyContent: 'center',
      height: '50%',
    }}
  >
    <Spin size={'small'} {...props} />
  </CustomSpace>
);

export { Loader };
