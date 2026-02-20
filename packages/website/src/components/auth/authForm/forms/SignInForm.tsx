import { FC, useCallback } from 'react';

import { Form, Input } from 'antd';

import { useLogin } from '@hooks/auth/useLogin';

import { CustomButton } from '@ui/button/Button';

import { CustomForm } from '@form';
import { CustomFormItem } from '@form/item/FormItem';

type FieldsType = Omit<UsersPermissionsLoginInput, 'provider'>;

export const SignInForm: FC = () => {
  const [login] = useLogin();

  const handleLogin = useCallback(
    async (values: FieldsType) => {
      await login({
        variables: {
          input: values,
        },
      });
    },
    [login],
  );

  return (
    <CustomForm<FieldsType>
      requiredMark={false}
      onFinish={handleLogin}
      autoComplete={'off'}
    >
      <CustomFormItem
        label={'Email Address'}
        name={'identifier'}
        rules={[
          {
            required: true,
            message: 'Please input your email!',
          },
        ]}
      >
        <Input placeholder={'email@example.com'} autoComplete={'off'} />
      </CustomFormItem>
      <CustomFormItem
        label={'Password'}
        name={'password'}
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
      >
        <Input.Password placeholder={'••••••••'} autoComplete={'off'} />
      </CustomFormItem>
      <Form.Item>
        <CustomButton type={'primary'} block htmlType={'submit'} size={'large'}>
          Sign In
        </CustomButton>
      </Form.Item>
    </CustomForm>
  );
};
