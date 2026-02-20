import { FC, PropsWithChildren } from 'react';

import { message } from 'antd';
import { NoticeType } from 'antd/lib/message/interface';

import { StatusMessageContext } from '@app/StatusMessageContext/statusMessageContext';

const StatusMessageProvider: FC<PropsWithChildren> = ({ children }) => {
  const [messageApi, contextHolder] = message.useMessage();

  const openMessage = (type: NoticeType, message?: string) => {
    messageApi.open({
      type: type,
      content:
        type === 'error' && !message
          ? 'Something went wrong! Please try again.'
          : message,
    });
  };

  return (
    <StatusMessageContext.Provider value={{ open: openMessage }}>
      {contextHolder}
      {children}
    </StatusMessageContext.Provider>
  );
};

export default StatusMessageProvider;
