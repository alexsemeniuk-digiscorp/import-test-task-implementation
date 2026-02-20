import { FC, memo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Outlet } from 'react-router-dom';

import { useMeQuery } from '@/graphql';

import { Loader } from '@components/layout/MainLayout';
import { StoreProvider } from '@components/stores/context/StoreProvider';

import { usePlatformRoutes } from '@router/routes';

import { useRouteTenant } from '@hooks/useRouteTenant';

const TenantWrapper: FC = memo(() => {
  const tenantSlug = useRouteTenant();

  const navigate = useNavigate();

  const changeTenant = useCallback(
    (tenant: string) => {
      if (tenant !== tenantSlug) {
        navigate(`/${tenant}`, { replace: true });
      }
    },
    [navigate, tenantSlug],
  );

  const routes = usePlatformRoutes();

  const { data: { me } = {} } = useMeQuery();

  useEffect(() => {
    if (me) {
      const userTenantSlug = me?.attributes?.tenant?.data?.attributes?.slug;

      if (!userTenantSlug) {
        navigate(routes.fillProfile);
      } else if (tenantSlug !== userTenantSlug) {
        changeTenant(userTenantSlug);
      }
    }
  }, [changeTenant, me, navigate, routes.fillProfile, tenantSlug]);

  if (!me || !me?.attributes?.tenant?.data?.attributes?.slug) {
    return <Loader spinning />;
  }

  return (
    <StoreProvider>
      <Outlet />
    </StoreProvider>
  );
});

export default TenantWrapper;
