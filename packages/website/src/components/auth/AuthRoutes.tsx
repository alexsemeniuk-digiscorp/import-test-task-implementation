import { Navigate, Outlet } from 'react-router-dom';

import { useMeQuery } from '@/graphql';

import { usePlatformRoutes } from '@router/routes';

const AuthRoutes = () => {
  const { data: { me } = {}, loading } = useMeQuery({
    fetchPolicy: 'network-only',
  });

  const routes = usePlatformRoutes();

  if (loading) {
    return null;
  }

  return !loading && me ? <Navigate to={routes.onboarding} /> : <Outlet />;
};

export default AuthRoutes;
