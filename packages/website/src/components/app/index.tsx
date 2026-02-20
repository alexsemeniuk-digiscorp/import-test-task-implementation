import { FC, PropsWithChildren, createContext, memo, useContext } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { ConfigProvider } from 'antd';

import { ApolloProvider } from '@apollo/client';

import { client } from '@/apollo';
import theme from '@/themes';

import routes from '@pages';

import StatusMessageProvider from '@app/StatusMessageContext';

import { ImportingProvider } from '@app/ImportingContext';
import { UserSettingsProvider } from '@app/UserSettingsProvider';
import { DrawerContextProvider } from '@drawer';
import { version } from '../../../package.json';
import '../../styles/form-elements.scss';
import '../../styles/main.scss';

type ContextProps = {
  app: { version: string };
};

const app: ContextProps['app'] = { version };

const Context = createContext({ app });

const ContextProvider: FC<PropsWithChildren<ContextProps>> = ({
  children,
  ...props
}) => {
  return <Context.Provider value={{ ...props }}>{children}</Context.Provider>;
};

const useApp: () => ContextProps = () => useContext(Context);

const router = createBrowserRouter(routes);

const App: FC = memo(() => (
  <ApolloProvider client={client}>
    <ContextProvider app={app}>
      <ConfigProvider theme={theme}>
        <DrawerContextProvider>
          <StatusMessageProvider>
            <ImportingProvider>
              <UserSettingsProvider>
                <RouterProvider router={router} />
              </UserSettingsProvider>
            </ImportingProvider>
          </StatusMessageProvider>
        </DrawerContextProvider>
      </ConfigProvider>
    </ContextProvider>
  </ApolloProvider>
));

export { useApp };

export default App;
