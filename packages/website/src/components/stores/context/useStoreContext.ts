import { useContext } from 'react';

import { StoreContext } from '@components/stores/context/StoreContext';

export const useStoreContext = () => useContext(StoreContext);
