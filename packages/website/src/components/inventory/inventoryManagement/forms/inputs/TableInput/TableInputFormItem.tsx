import { CustomFormItem, CustomFormItemProps } from '@form/item/FormItem';
import { FC, memo } from 'react';

export const TableInputFormItem: FC<CustomFormItemProps> = memo(
  ({ required, ...otherProps }) => {
    return (
      <CustomFormItem
        {...otherProps}
        noStyle
        required={required}
        shouldAppendDefaultRules={false}
        rules={[
          {
            required: required,
            message: '',
          },
        ]}
      />
    );
  },
);
