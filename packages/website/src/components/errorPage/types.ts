import { ReactNode } from 'react';

export interface ErrorProps {
  header?: ReactNode;
  message?: string;
  backText?: string;
  backPath?: string;
}
