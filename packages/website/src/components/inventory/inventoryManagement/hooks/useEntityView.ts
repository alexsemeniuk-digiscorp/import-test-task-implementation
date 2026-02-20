import { useContext, useEffect } from 'react';

import { MainLayoutContext } from '@components/layout/MainLayout/MainLayout';

interface Props {
  backPath?: string;
  entityPlural?: string;
}

export const useEntityView = ({ backPath, entityPlural }: Props) => {
  const { setHeaderOptions } = useContext(MainLayoutContext);

  useEffect(() => {
    if (backPath && entityPlural) {
      setHeaderOptions({
        type: 'with-back-button',
        link: backPath || '',
        entityPlural,
        backTitle: `Back To ${entityPlural}`,
      });
    }

    return () => {
      setHeaderOptions({
        type: 'default',
      });
    };
  }, [backPath, setHeaderOptions, entityPlural]);
};
