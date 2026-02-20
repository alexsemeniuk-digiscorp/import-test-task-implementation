import { FC, memo, useCallback } from 'react';

import { CustomButton } from '@ui/button/Button';
import { ButtonProps } from 'antd';

interface Props extends ButtonProps {
  onRemove?: () => void;
  label?: string;
  disabled?: boolean;
}

export const RemoveUploadFileButton: FC<Props> = memo(
  ({ disabled, label, onRemove, ...props }) => {
    const handleClick = useCallback(async () => {
      if (onRemove) {
        onRemove();
      }
    }, [onRemove]);

    return (
      <CustomButton onClick={handleClick} disabled={disabled} {...props}>
        {label || 'Remove file'}
      </CustomButton>
    );
  },
);
