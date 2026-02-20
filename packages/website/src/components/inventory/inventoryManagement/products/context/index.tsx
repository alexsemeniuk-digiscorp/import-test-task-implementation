import { FC, PropsWithChildren, useState } from 'react';

import { LocationContext } from './locationContext';

const LocationContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [productInventoryItemId, setProductInventoryItemId] = useState<
    string | undefined | null
  >(null);

  return (
    <LocationContext.Provider
      value={{
        productInventoryItemId,
        setProductInventoryItemId,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export default LocationContextProvider;
