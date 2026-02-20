import { FC, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';

import { MenuProps } from 'antd';

import ActionMenuDropdown from '@ui/dropdown/ActionMenuDropdown';
import ActionMenuButton from '@ui/dropdown/ActionMenuDropdown/ActionMenuButton';

export type InventoryManagementEntity =
  | ResourceFragment
  | InventoryProductTableFragment
  | ProductGroupFragment
  | BusinessLocationFragment
  | ShipmentFragment
  | TransferOrderFragment
  | InventoryTransferOrderFragment;

interface Props {
  entity: InventoryManagementEntity;
  additionalChildren?: MenuProps['items'];
  isNotifyCustomer?: boolean;
}

export const InventoryActionDropdown: FC<Props> = ({
  entity,
  additionalChildren,
  isNotifyCustomer = true,
}) => {
  const navigate = useNavigate();

  const handleNavigateToEntity = useCallback(() => {
    navigate(entity.attributes?.uuid || '');
  }, [entity.attributes?.uuid, navigate]);

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
      ...(additionalChildren || []),
    ],
    [handleNavigateToEntity, additionalChildren],
  );

  return <ActionMenuDropdown items={items} />;
};
