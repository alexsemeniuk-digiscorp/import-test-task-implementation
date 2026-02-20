import { useParams } from 'react-router';

export const useRouteTenant = () => {
  const { tenantSlug } = useParams<{ tenantSlug?: string }>();

  return tenantSlug;
};
