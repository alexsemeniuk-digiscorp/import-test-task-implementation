import { CompressOutlined, ExpandOutlined } from '@ant-design/icons';
import {
  FC,
  PropsWithChildren,
  ReactElement,
  ReactNode,
  cloneElement,
  useEffect,
  useState,
} from 'react';

import { AnyObject } from '@helpers/types';

import { Icon, IconSize } from '@assets/icon';

import { CustomButton } from '@ui/button/Button';
import CustomDrawer from '@ui/drawer';

import { useBreakpoint } from '@hooks/useBreakpoint';

import {
  DrawerContext,
  HeaderAction,
  OpenDrawerAdditionalOptions,
} from '@drawer/drawerContext';
import { Tooltip } from 'antd';
import { useToggle } from 'usehooks-ts';

//TODO: Lesya - Consider refactoring for the headerAction's to accept extraComponent
export const DrawerContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isFullScreen, toggle, setIsFullScreen] = useToggle();
  const [formComponent, setFormComponent] = useState<ReactElement | null>(null);
  const [title, setTitle] = useState<ReactNode>('');
  const [headerAction, setHeaderAction] = useState<HeaderAction | undefined>(
    undefined,
  );
  const [extraComponent, setExtraComponent] = useState<
    ReactElement | undefined
  >(undefined);
  const [formProps, setFormProps] = useState<AnyObject>({});
  const [width, setWidth] = useState<string | number | undefined>(undefined);
  const [isFullScreenAllowed, setIsFullScreenAllowed] =
    useState<boolean>(false);

  const { xs, sm, md } = useBreakpoint();

  const drawerStyles = md
    ? {}
    : {
        flexDirection: 'column' as const,
        rowGap: 12,
      };

  const extra = headerAction ? (
    <CustomButton
      icon={<Icon type={headerAction.iconType} size={IconSize.XXS} />}
      onClick={headerAction.action}
      type={'link'}
      style={{ gap: '6px' }}
    >
      {headerAction.title}
    </CustomButton>
  ) : (
    extraComponent
  );
  const openDrawer = <T extends PropsWithChildren>(
    formComponent: ReactElement<T>,
    drawerTitle: ReactNode,
    additionalOptions?: OpenDrawerAdditionalOptions,
  ) => {
    const {
      headerAction,
      extraComponent,
      drawerWidth,
      isFullScreenAllowed = false,
    } = additionalOptions || {};
    setFormComponent(formComponent);
    setTitle(drawerTitle);
    setHeaderAction(headerAction);
    setWidth(drawerWidth);
    setExtraComponent(extraComponent);
    setIsFullScreenAllowed(isFullScreenAllowed);
  };

  const closeDrawer = () => {
    setFormComponent(null);
    setHeaderAction(undefined);
    setFormProps({});
    setIsFullScreen(false);
  };

  useEffect(() => {
    setFormProps((prev) => ({
      ...prev,
      isFullScreen,
    }));
  }, [isFullScreen]);

  return (
    <>
      <DrawerContext.Provider
        value={{
          openDrawer,
          closeDrawer,
          updateFormProps: setFormProps,
          isFullScreen,
        }}
      >
        {children}
        <CustomDrawer
          open={!!formComponent}
          onClose={closeDrawer}
          title={title}
          width={isFullScreen || xs ? '100%' : width}
          closeIcon={<Icon type={'close'} size={24} />}
          extra={
            <>
              {sm && isFullScreenAllowed && (
                <div style={{ position: 'absolute', top: 16, left: 32 }}>
                  <Tooltip
                    title={isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
                  >
                    {isFullScreen ? (
                      <CompressOutlined
                        style={{ fontSize: 18 }}
                        onClick={toggle}
                      />
                    ) : (
                      <ExpandOutlined
                        style={{ fontSize: 18 }}
                        onClick={toggle}
                      />
                    )}
                  </Tooltip>
                </div>
              )}
              {extra}
            </>
          }
          styles={
            !!extraComponent && !headerAction
              ? { header: { alignItems: 'flex-start', ...drawerStyles } }
              : {}
          }
        >
          {formComponent && cloneElement(formComponent, formProps)}
        </CustomDrawer>
      </DrawerContext.Provider>
    </>
  );
};
