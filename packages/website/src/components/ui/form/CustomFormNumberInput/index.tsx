import { Icon, IconSize } from '@assets/icon';
import { CustomFormItem } from '@form/item/FormItem';
import { Button, Flex, InputNumber } from 'antd';
import { CSSProperties, FC, useCallback, useState } from 'react';

interface Props {
  multiplierFieldName: string;
  initialValue?: number;
  onSaveClick?: (value: number) => void;
  label?: string;
  style?: CSSProperties;
  min?: number | undefined;
  max?: number | undefined;
  step?: number;
  addonAfter?: string;
  updateLoading?: boolean;
}

export const CustomFormNumberInput: FC<Props> = ({
  multiplierFieldName,
  initialValue,
  updateLoading,
  onSaveClick,
  label,
  style,
  min = 1,
  max = undefined,
  step = 0.1,
  addonAfter = '%',
}) => {
  const [inputValue, setInputValue] = useState<number | null>(
    initialValue ?? 0,
  );

  const handleSetValue = useCallback(
    (value: number | null) => {
      setInputValue(value);
    },
    [setInputValue],
  );

  const handleSave = useCallback(() => {
    if (inputValue != null && !isNaN(inputValue)) {
      onSaveClick?.(inputValue);
    }
  }, [inputValue, onSaveClick]);

  return (
    <CustomFormItem
      style={{ margin: 0 }}
      label={label}
      name={multiplierFieldName}
    >
      <Flex gap={10} align={'center'}>
        {initialValue !== inputValue && (
          <>
            <Button
              style={{ display: 'flex', alignItems: 'center' }}
              onClick={handleSave}
              type={'link'}
              icon={<Icon type={'check'} size={IconSize.Large} />}
              size={'small'}
              loading={updateLoading}
            />
          </>
        )}
        <InputNumber<number>
          value={inputValue}
          style={style}
          step={step}
          min={min}
          max={max}
          addonAfter={addonAfter}
          onChange={handleSetValue}
        />
      </Flex>
    </CustomFormItem>
  );
};
