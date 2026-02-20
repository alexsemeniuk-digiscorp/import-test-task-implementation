import { CustomButton } from '@ui/button/Button';
import { Flex } from 'antd';
import React from 'react';

interface ActionButtonsProps {
  primaryLabel: string;
  primaryAction: () => void;
  secondaryLabel: string;
  secondaryAction: () => void;
}

const WebCamButtons: React.FC<ActionButtonsProps> = ({
  primaryLabel,
  primaryAction,
  secondaryLabel,
  secondaryAction,
}) => {
  return (
    <Flex align={'center'} gap={60} justify={'center'}>
      <CustomButton size={'large'} type={'primary'} onClick={primaryAction}>
        {primaryLabel}
      </CustomButton>
      <CustomButton size={'large'} type={'default'} onClick={secondaryAction}>
        {secondaryLabel}
      </CustomButton>
    </Flex>
  );
};

export default WebCamButtons;
