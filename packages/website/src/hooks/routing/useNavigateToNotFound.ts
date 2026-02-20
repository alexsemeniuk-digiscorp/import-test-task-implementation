import { useCallback } from 'react';
import { useNavigate } from 'react-router';

import { useTenantRoutes } from '@router/routes';

export const useNavigateToNotFound = () => {
  const navigate = useNavigate();

  const { notFound } = useTenantRoutes();

  return useCallback(() => {
    navigate(notFound, { replace: true });
  }, [navigate, notFound]);
};
