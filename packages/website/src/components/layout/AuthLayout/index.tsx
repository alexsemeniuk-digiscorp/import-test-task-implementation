import { FC, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { Layout as BaseLayout } from 'antd';

import styles from './AuthLayout.module.scss';

const AuthLayout: FC = () => {
  return (
    <BaseLayout>
      <BaseLayout.Content className={styles.layout}>
        <div className={styles.space}>
          <section className={styles.wrapper}>
            <Suspense>
              <Outlet />
            </Suspense>
          </section>
        </div>
      </BaseLayout.Content>
    </BaseLayout>
  );
};

export default AuthLayout;
