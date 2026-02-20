import { useCallback } from 'react';
import { useNavigate } from 'react-router';

import { usePlatformRoutes } from '@router/routes';

import { client } from '@/apollo';
const WEBSITE_BACKEND_URL = import.meta.env.WEBSITE_BACKEND_URL;

export const useSignOut = () => {
  const navigate = useNavigate();

  const routes = usePlatformRoutes();

  return useCallback(async () => {
    fetch(`${WEBSITE_BACKEND_URL}/api/logout`, {
      method: 'POST',
      credentials: 'include',
    }).then(() => {
      navigate(routes.auth.signIn);
    });
    await client.resetStore();
  }, [navigate, routes.auth.signIn]);
};
