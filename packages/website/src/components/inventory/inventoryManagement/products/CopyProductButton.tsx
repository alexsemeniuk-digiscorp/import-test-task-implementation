import { Icon } from '@assets/icon';
import { useTenantRoutes } from '@router/routes';
import { CustomButton } from '@ui/button/Button';
import { FC, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router';

export const CopyProductButton: FC = () => {
  const navigate = useNavigate();
  const { uuid } = useParams<{ uuid: string }>();
  const {
    inventory: {
      inventoryManagement: { products },
    },
  } = useTenantRoutes();
  const handleCopyClick = useCallback(() => {
    navigate(`${products.copy}/${uuid}` || '');
  }, [products.copy, uuid, navigate]);
  return (
    <CustomButton
      type={'text'}
      onClick={handleCopyClick}
      icon={<Icon type={'copy'} />}
    >
      Copy
    </CustomButton>
  );
};
