import { FC, lazy } from 'react';
import { Navigate, RouteObject } from 'react-router-dom';

import AuthLayout from '@components/layout/AuthLayout';
import DefaultLayout, { Loader } from '@components/layout/MainLayout';
import TenantWrapper from '@components/tenant/TenantWrapper';

import authRoutes from '@pages/auth/routes';
import { dashboardRoutes } from '@pages/dashboard/routes';
import { ROUTES } from '@router/routes';

import PlatformRoutes from '@auth/PlatformRoutes';

const ErrorPage = lazy<FC>(() => import('@/pages/errorPage'));

const tenantRoutes = ROUTES.tenant;
const globalRoutes = ROUTES.global;

const routes: RouteObject[] = [
  {
    Component: PlatformRoutes,
    children: [
      {
        path: ':tenantSlug?',
        Component: TenantWrapper,
        children: [
          {
            Component: DefaultLayout,
            loader: () => <Loader spinning />,
            children: [
              {
                element: <Navigate to={tenantRoutes.dashboard.index} />,
                index: true,
              },
              dashboardRoutes,
              {
                Component: ErrorPage,
                path: '*',
              },
            ],
          },
        ],
      },
      {
        Component: ErrorPage,
        path: ROUTES.tenant.notFound,
      },
      {
        Component: ErrorPage,
        path: '*',
      },
    ],
  },
  authRoutes,
  {
    Component: AuthLayout,
    path: globalRoutes.fillProfile,
    loader: () => <Loader spinning />,
  },
  {
    Component: ErrorPage,
    path: '*',
  },
];

export default routes;
