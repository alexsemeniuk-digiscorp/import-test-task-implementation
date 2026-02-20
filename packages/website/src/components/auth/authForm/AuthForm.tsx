import { FC } from 'react';

import { SignInForm } from '@auth/authForm/forms/SignInForm';

export enum AuthType {
  SignIn = 'signin',
}

interface AuthFormProps {
  authType: AuthType;
}

const AuthTypeFormMap: Record<AuthType, FC> = {
  [AuthType.SignIn]: SignInForm,
};

export const AuthForm: FC<AuthFormProps> = ({ authType }) => {
  const Form = AuthTypeFormMap[authType];

  return <Form />;
};
