import { createContext, useContext } from 'react';

export interface LocationContextType {
  productInventoryItemId: string | undefined | null;
  setProductInventoryItemId: (item: string | undefined | null) => void;
}

export const LocationContext = createContext<LocationContextType | null>(null);

export const useLocationContext = (): LocationContextType => {
  const context = useContext(LocationContext);

  if (!context) {
    throw new Error(
      'useLocationContext must be used within a LocationContextProvider',
    );
  }

  return context;
};
