import { createContext, FC, ReactNode, useContext, useState } from 'react';

import { InventoryGeneralContexType } from './types';

const InventoryGeneralContext = createContext<
  InventoryGeneralContexType | undefined
>(undefined);

export const InventoryGeneralProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [hasChangedProductForm, setHasChangedProductForm] = useState(false);

  const value = {
    hasChangedProductForm,
    setHasChangedProductForm,
  };

  return (
    <InventoryGeneralContext.Provider value={value}>
      {children}
    </InventoryGeneralContext.Provider>
  );
};

export const useInventoryGeneralContext = () => {
  const context = useContext(InventoryGeneralContext);
  if (!context) {
    throw new Error(
      'useInventoryGeneralContext must be used within a InventoryGeneralProvider',
    );
  }
  return context;
};
