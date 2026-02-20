import { useContext } from 'react';

import { InvManagementContext } from '@inventory/inventoryManagement/context/InvManagementContext';

export const useInvManagementContext = () => useContext(InvManagementContext);
