import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import {
  Action,
  InvManagementContext,
} from '@inventory/inventoryManagement/context/InvManagementContext';

const InvManagementProvider = () => {
  const [primaryAction, setPrimaryAction] = useState<Action | undefined>();
  const [secondaryAction, setSecondaryAction] = useState<Action | undefined>();
  const [entityName, setEntityName] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  return (
    <InvManagementContext.Provider
      value={{
        primaryAction,
        changePrimaryAction: setPrimaryAction,
        secondaryAction,
        changeSecondaryAction: setSecondaryAction,
        entityName,
        changeEntityName: setEntityName,
        searchQuery,
        changeSearchQuery: setSearchQuery,
      }}
    >
      <Outlet />
    </InvManagementContext.Provider>
  );
};

export default InvManagementProvider;
