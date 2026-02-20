import { Input } from 'antd';
import { FC } from 'react';

import { CustomFormItem } from '@form/item/FormItem';

interface IZipCode {
  onChange?: (value: string) => void;
  name?: string | (string | number)[];
}

export const ZipCodeInput: FC<IZipCode> = ({
  onChange,
  name = 'zipcode',
  ...props
}) => {
  return (
    <CustomFormItem label={'ZIP Code'} name={name}>
      <Input
        placeholder={'90210'}
        maxLength={20}
        autoComplete={'off'}
        allowClear
        style={{ width: '100%' }}
      />
    </CustomFormItem>
  );
};
