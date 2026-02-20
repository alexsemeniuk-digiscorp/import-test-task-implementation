import { FC, ReactNode } from 'react';

import {
  ActiveButtonType,
  HeaderType,
} from '@components/layout/MainLayout/MainLayout';

import { ProfileDropdown } from '@/components/auth/profileDropdown/ProfileDropdown';
import { Loader } from '@components/layout/MainLayout/Loader';

import { useUserSettingsContext } from '@app/UserSettingsProvider';
import styles from './Header.module.scss';

interface Props {
  type: HeaderType;
  backTitle?: string;
  link?: string;
  entityPlural?: string;
  emailOptions?: ReactNode;
  activeButton?: ActiveButtonType;
}

const Header: FC<Props> = ({
  type = 'default',
  backTitle,
  link,
  emailOptions,
  activeButton,
  entityPlural,
}) => {
  const { meLoading } = useUserSettingsContext();

  return meLoading ? (
    <Loader />
  ) : (
    <header className={styles.header}>
      <ProfileDropdown />
    </header>
  );
};

export { Header };
