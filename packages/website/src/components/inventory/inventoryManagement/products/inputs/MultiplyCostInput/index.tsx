import { CustomFormItem } from '@form/item/FormItem';
import { InputNumber } from 'antd';
import { CSSProperties, FC } from 'react';

interface Props {
  multiplierFieldName:
    | 'multiplier'
    | 'wholeSaleMultiplier'
    | 'documentImageSizeMultiplier'
    | 'startRepairTicketNumber';
  label?: string;
  style?: CSSProperties;
  min?: number | undefined;
  max?: number | undefined;
  addonAfter?: string;
  step?: number | undefined;
}

export const MultiplyCostInput: FC<Props> = ({
  multiplierFieldName,
  label,
  style,
  min = 1,
  max = undefined,
  addonAfter = 'x',
  step = 0.1,
}) => {
  return (
    <CustomFormItem
      style={{ margin: 0 }}
      label={label}
      name={multiplierFieldName}
    >
      <InputNumber<number>
        style={style}
        step={step}
        min={min}
        max={max}
        addonAfter={addonAfter}
      />
    </CustomFormItem>
  );
};
