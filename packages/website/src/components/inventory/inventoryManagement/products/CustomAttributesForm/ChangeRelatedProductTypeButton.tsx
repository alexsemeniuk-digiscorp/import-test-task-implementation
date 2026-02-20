import React, { FC, useCallback } from 'react';

import { CustomButton } from '@ui/button/Button';

interface Props {
  hasCurrentType: boolean;
  id: Maybe<string>;
  handleUpdateProductType: (type: 'add' | 'remove', id: Maybe<string>) => void;
}
export const ChangeRelatedProductTypeButton: FC<Props> = ({
  hasCurrentType,
  id,
  handleUpdateProductType,
}) => {
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
      event.stopPropagation();

      handleUpdateProductType(hasCurrentType ? 'remove' : 'add', id);
    },
    [hasCurrentType, id, handleUpdateProductType],
  );

  return (
    <CustomButton
      type={hasCurrentType ? 'default' : 'primary'}
      size={'small'}
      onClick={handleClick}
    >
      {hasCurrentType ? 'Remove from' : 'Add to'} product type
    </CustomButton>
  );
};
