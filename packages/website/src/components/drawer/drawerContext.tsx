import {
  PropsWithChildren,
  ReactElement,
  ReactNode,
  createContext,
  useContext,
} from 'react';

import { AnyObject } from '@helpers/types';

import { IconType } from '@assets/icon';

export type HeaderAction = {
  title: string;
  iconType: IconType;
  action: () => void;
};

export interface OpenDrawerAdditionalOptions {
  headerAction?: HeaderAction;
  drawerWidth?: string | number | undefined;
  extraComponent?: ReactElement;
  isFullScreenAllowed?: boolean;
}

interface DrawerContextType {
  openDrawer: <T extends PropsWithChildren>(
    formComponent: ReactElement<T>,
    drawerTitle: ReactNode,
    additionalOptions?: OpenDrawerAdditionalOptions,
  ) => void;
  closeDrawer: () => void;
  updateFormProps: (props: AnyObject) => void;
  isFullScreen?: boolean;
}

export const DrawerContext = createContext<DrawerContextType | null>(null);

export const useDrawer = (): DrawerContextType => {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error('useDrawer must be used within a DrawerProvider');
  }
  return context;
};
