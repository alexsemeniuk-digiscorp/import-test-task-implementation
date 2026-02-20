import React from 'react';

import { ConfigProvider, Form, FormProps } from 'antd';

import { AnyObject } from '@helpers/types';

import { verticalLabelColProps } from '@form/constants';

export interface CustomFormProps<T extends AnyObject> extends FormProps<T> {
  children?: React.ReactNode;
}
export const CustomForm = <T extends AnyObject>(props: CustomFormProps<T>) => {
  const {
    layout = 'vertical',
    children,
    labelCol,
    form,
    ...otherProps
  } = props;

  const customLabelColProps =
    layout === 'vertical' ? verticalLabelColProps : undefined;

  return (
    <ConfigProvider
      theme={{
        token: {
          paddingXS: 6,
          controlHeight: 40,
          fontSize: 12,
          paddingSM: 16,
          lineHeight: 1.3,
        },
      }}
    >
      <Form<T>
        layout={layout}
        labelCol={labelCol || customLabelColProps}
        form={form}
        scrollToFirstError={{ behavior: 'smooth' }}
        {...otherProps}
      >
        {children}
      </Form>
    </ConfigProvider>
  );
};
