import {
  FC,
  ReactNode,
  Suspense,
  createContext,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useParams } from 'react-router';
import { Outlet, useLocation } from 'react-router-dom';

import { Layout as BaseLayout } from 'antd';

import { CustomSpace } from '@ui/space';

import { DrawerContextProvider } from '@drawer';
import { Header, Loader } from './index';

const { Content } = BaseLayout;

export type HeaderType = 'default' | 'with-back-button' | 'email-editor';
export type ActiveButtonType = 'chat' | 'settings';

interface HeaderOptionsType {
  type: HeaderType;
  backTitle?: string;
  link?: string;
  entityPlural?: string;
  emailOptions?: ReactNode;
  activeButton?: ActiveButtonType;
}

interface MainLayoutContextType {
  headerOptions: HeaderOptionsType;
  setHeaderOptions: (val: HeaderOptionsType) => void;
}

export const MainLayoutContext = createContext<MainLayoutContextType>({
  headerOptions: {
    type: 'default',
  },
  setHeaderOptions: () => {
    /* empty */
  },
});

const getActiveButtonType = (pathName: string) => {
  switch (true) {
    case pathName.includes('/messaging'):
      return 'chat';
    case pathName.includes('dashboard/settings'):
      return 'settings';
    default:
      return undefined;
  }
};

const MainLayout: FC = () => {
  const { pathname } = useLocation();
  const [headerOptions, setHeaderOptions] = useState<HeaderOptionsType>({
    type: 'default',
    activeButton: getActiveButtonType(pathname),
  });
  const { uuid } = useParams();

  useEffect(() => {
    if (!uuid) {
      setHeaderOptions({
        type: 'default',
      });
    }
  }, [uuid]);

  const handleSetHeaderOptions = useCallback(
    (val: HeaderOptionsType) => setHeaderOptions(val),
    [setHeaderOptions],
  );

  return (
    <MainLayoutContext.Provider
      value={{
        headerOptions: headerOptions,
        setHeaderOptions: handleSetHeaderOptions,
      }}
    >
      <DrawerContextProvider>
        <CustomSpace direction={'vertical'} block size={[0, 48]}>
          <BaseLayout>
            <BaseLayout style={{ minHeight: '100vh' }}>
              <Header {...headerOptions} />
              <Content style={{ backgroundColor: '#F7F8FA' }}>
                <Suspense fallback={<Loader size={'small'} />}>
                  <Outlet />
                </Suspense>
              </Content>
            </BaseLayout>
          </BaseLayout>
        </CustomSpace>
      </DrawerContextProvider>
    </MainLayoutContext.Provider>
  );
};

export { MainLayout };
