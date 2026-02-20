import { FC } from 'react';

import { AuthForm, AuthType } from '@auth/authForm/AuthForm';
import {
  AuthMainWrapper,
  TopMargin,
} from '@auth/authForm/wrapper/AuthMainWrapper';

const SignInPage: FC = () => {
  return (
    <AuthMainWrapper topMargin={TopMargin.Large}>
      <AuthForm authType={AuthType.SignIn} />
    </AuthMainWrapper>
  );
};

export default SignInPage;
