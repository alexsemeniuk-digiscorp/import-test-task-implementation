import ErrorPage from '@components/errorPage/ErrorPage';
import { ErrorProps } from '@components/errorPage/types';
import { FC } from 'react';

const NotFoundPage: FC<ErrorProps> = () => {
  return <ErrorPage />;
};

export default NotFoundPage;
