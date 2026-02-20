import { useTenantRoutes } from '@router/routes';
import ActionMenuDropdown from '@ui/dropdown/ActionMenuDropdown';
import ActionMenuButton from '@ui/dropdown/ActionMenuDropdown/ActionMenuButton';
import { MenuProps } from 'antd';
import { FC, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';

interface Props {
  entity: InventoryProductTableFragment;
  title: string;
  width?: number;
}

const ProductActionDropdown: FC<Props> = ({ entity, title, width }) => {
  const navigate = useNavigate();
  const {
    inventory: {
      inventoryManagement: { products },
    },
  } = useTenantRoutes();

  const handleNavigateToEntity = useCallback(() => {
    navigate(entity.attributes?.uuid || '');
  }, [entity.attributes?.uuid, navigate]);

  const handleCopyClick = useCallback(() => {
    navigate(`${products.copy}/${entity.attributes?.uuid}` || '');
  }, [products.copy, entity.attributes?.uuid, navigate]);

  const items: MenuProps['items'] = useMemo(
    () => [
      {
        key: 'Preview',
        label: (
          <ActionMenuButton iconType={'eye'} onClick={handleNavigateToEntity}>
            View and Edit
          </ActionMenuButton>
        ),
      },
      {
        key: 'Copy',
        label: (
          <ActionMenuButton iconType={'copy'} onClick={handleCopyClick}>
            Copy {title}
          </ActionMenuButton>
        ),
      },
    ],
    [handleCopyClick, handleNavigateToEntity, title],
  );

  return <ActionMenuDropdown width={width} items={items} />;
};

export default ProductActionDropdown;
