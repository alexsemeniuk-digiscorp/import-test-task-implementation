import { Flex, MenuProps } from 'antd';

import { baseColumnFactory } from '@ui/table/column';

import {
  InventoryActionDropdown,
  InventoryManagementEntity,
} from '@inventory/inventoryManagement/actions/ActionDropdown';

export const inventoryActionColumnFactory = <
  T extends InventoryManagementEntity,
>(
  additionalChildrenFactory?: (entity: T) => MenuProps['items'],
  isNotifyCustomer?: boolean,
) => {
  return baseColumnFactory<T>({
    render: (_, entity) => (
      <Flex justify={'flex-end'}>
        <InventoryActionDropdown
          entity={entity}
          additionalChildren={additionalChildrenFactory?.(entity)}
          isNotifyCustomer={isNotifyCustomer}
        />
      </Flex>
    ),
    width: '36px',
  });
};
