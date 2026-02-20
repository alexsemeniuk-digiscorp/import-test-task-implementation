import { createContext } from 'react';

interface StoreContextType {
  selectedStoreId: BusinessLocationFragment['id'];
  handleChange: (storeId: string) => void;
  handleSearch: (searchTerm: string) => void;
  allStores: BusinessLocationDropdownFragment[];
  loading: boolean;
  hasAllStoresOption: boolean;
  toggleAllStoresOption: (value: boolean) => void;
}
export const StoreContext = createContext<StoreContextType>({
  selectedStoreId: null,
  handleChange: () => {
    /* empty */
  },
  handleSearch: () => {
    /* empty */
  },
  allStores: [],
  loading: false,
  hasAllStoresOption: true,
  toggleAllStoresOption: () => {
    /* empty */
  },
});
