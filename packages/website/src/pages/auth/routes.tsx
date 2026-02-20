import { FC, lazy } from 'react';
import { RouteObject } from 'react-router-dom';

import AuthLayout from '@components/layout/AuthLayout';
import { Loader } from '@components/layout/MainLayout';

import { ROUTES } from '@router/routes';

import AuthRoutes from '@auth/AuthRoutes';

const SignIn = lazy<FC>(() => import('@/pages/auth/sign-in'));

const { index, signIn } = ROUTES.global.auth;

const authRoutes: RouteObject = {
  Component: AuthRoutes,
  path: index,
  children: [
    {
      Component: AuthLayout,
      loader: () => <Loader spinning />,
      children: [
        {
          Component: SignIn,
          index: true,
        },
        {
          Component: SignIn,
          path: signIn,
        },
      ],
    },
  ],
};

export default authRoutes;
