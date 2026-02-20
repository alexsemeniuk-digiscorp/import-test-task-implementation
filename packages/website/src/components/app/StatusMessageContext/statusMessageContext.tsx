import { createContext, useContext } from 'react';

import { NoticeType } from 'antd/lib/message/interface';

export interface StatusMessageContextType {
  open: (type: NoticeType, message?: string) => void;
}

export const StatusMessageContext =
  createContext<StatusMessageContextType | null>(null);

export const useStatusMessage = (): StatusMessageContextType => {
  const context = useContext(StatusMessageContext);
  if (!context) {
    throw new Error(
      'useStatusMessage must be used within a StatusMessageProvider',
    );
  }
  return context;
};
