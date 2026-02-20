import { FC, memo } from 'react';

import CustomAvatar from '@ui/avatar';

import { useUserSettingsContext } from '@app/UserSettingsProvider';
import styles from './UserAvatar.module.scss';

interface Props {
  hasOutline?: boolean;
}
export const UserAvatar: FC<Props> = memo(({ hasOutline }) => {
  const { meData } = useUserSettingsContext();

  return (
    <CustomAvatar
      src={meData?.me?.attributes?.avatar?.data?.attributes?.url}
      alt={meData?.me?.attributes?.fullName || ''}
      className={styles.avatar}
    />
  );
});
