import { NumberRangeInput } from '@form/inputs/numberRangeInput/NumberRangeInput';
import { useMinMaxValue } from '@ui/form/QuantityRangeInput/hooks/useMinMaxValue';
import { FC, useEffect, useState } from 'react';

export const QuantityRangeInput: FC<{
  onChange?: (value: string | number | undefined) => void;
  fieldKey: string;
  queryType: string;
}> = ({ onChange, fieldKey, queryType }) => {
  const [defaultQuantity, setDefaultQuantity] = useState<number[]>([]);
  const [quantityRange, setQuantityRange] = useState<number[]>([]);
  const [minQuantityValue, setMinQuantityValue] = useState<Maybe<number>>();
  const [maxQuantityValue, setMaxQuantityValue] = useState<Maybe<number>>();

  const { min, max } = useMinMaxValue(queryType, fieldKey);

  const handleQuantityRangeChange = (value: number[]) => {
    setQuantityRange(value);
    setMinQuantityValue(value?.[0]);
    setMaxQuantityValue(value?.[1]);
  };

  const handleMinValueChange = (value: number | null) => {
    if (value !== null) {
      setMinQuantityValue(value);
      setQuantityRange([value, quantityRange[1]]);
    }
  };

  const handleMaxValueChange = (value: number | null) => {
    if (value !== null) {
      setMaxQuantityValue(value);
      setQuantityRange([quantityRange[0], value]);
    }
  };

  useEffect(() => {
    setDefaultQuantity([min ?? 0, max ?? 0]);
    setQuantityRange([min ?? 0, max ?? 0]);
  }, [min, max]);

  useEffect(() => {
    if (onChange) {
      onChange(`${quantityRange[0]}-${quantityRange[1]}`);
    }
  }, [onChange, quantityRange]);

  return (
    <NumberRangeInput
      rangeValue={quantityRange}
      defaultRange={defaultQuantity}
      minRangeValue={minQuantityValue}
      maxRangeValue={maxQuantityValue}
      handleRangeChange={handleQuantityRangeChange}
      handleMinRangeChange={handleMinValueChange}
      handleMaxRangeChange={handleMaxValueChange}
    />
  );
};
