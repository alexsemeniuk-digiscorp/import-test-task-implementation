import { FC, memo } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { useMeQuery } from '@/graphql';

import { usePlatformRoutes } from '@router/routes';

const PlatformRoutes: FC = memo(() => {
  const {
    data: { me } = {},
    loading,
    error,
  } = useMeQuery({
    fetchPolicy: 'network-only',
  });

  const routes = usePlatformRoutes();

  const shouldRedirectToSignIn = !loading && (!me || error);

  if (loading) {
    return null;
  }

  return shouldRedirectToSignIn ? (
    <Navigate to={routes.auth.signIn} />
  ) : (
    <Outlet />
  );
});

export default PlatformRoutes;
