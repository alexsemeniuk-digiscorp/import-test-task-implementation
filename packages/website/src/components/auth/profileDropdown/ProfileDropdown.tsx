import { FC, useCallback, useMemo } from 'react';

import { ConfigProvider, Space } from 'antd';

import { Icon } from '@/assets/icon';
import { UserAvatar } from '@/components/auth/userAvatar/UserAvatar';
import { CustomButton } from '@/components/ui/button/Button';
import CustomDropdown from '@/components/ui/dropdown';
import { useSignOut } from '@/hooks/auth/useSignOut';

import { ItemType } from 'antd/es/menu/interface';
import styles from './ProfileDropdown.module.scss';

export const ProfileDropdown: FC = () => {
  const signOut = useSignOut();

  const handleSignOut = useCallback(() => {
    signOut();
  }, [signOut]);

  const items: ItemType[] = useMemo(
    () => [
      {
        key: 'logout',
        label: (
          <CustomButton
            type={'text'}
            onClick={handleSignOut}
            icon={<Icon type={'sign-out'} />}
            size={'large'}
            paddingless
            block
            className={styles.menuButton}
          >
            Sign Out
          </CustomButton>
        ),
      },
    ],
    [handleSignOut],
  );

  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            fontSizeLG: 14,
            controlHeightLG: 24,
          },
        },
      }}
    >
      <CustomDropdown
        menu={{
          items,
        }}
        contentClassName={styles.content}
        width={300}
        withButton={false}
      >
        <Space>
          <UserAvatar />
        </Space>
      </CustomDropdown>
    </ConfigProvider>
  );
};
