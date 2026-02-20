import { useEffect, useState } from 'react';

export const useCustomSelectLoader = (loading: boolean): boolean => {
  const [loader, setLoader] = useState<boolean>(true);

  useEffect(() => {
    if (!loading) {
      setLoader(false);
    }
  }, [loading]);

  return loader;
};
