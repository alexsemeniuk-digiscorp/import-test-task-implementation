import { NumberRangeInput } from '@form/inputs/numberRangeInput/NumberRangeInput';
import { useProductInventoryItemAgeRangeData } from '@ui/form/ProductInventoryItemAgeRangeInput/hooks/useProductInventoryItemAgeRangeData';
import { FC, useEffect, useState } from 'react';

export const ProductInventoryItemAgeRangeInput: FC<{
  onChange?: (value: string | number | undefined) => void;
}> = ({ onChange }) => {
  const [defaultQuantity, setDefaultQuantity] = useState<number[]>([]);
  const [quantityRange, setQuantityRange] = useState<number[]>([]);
  const [minQuantityValue, setMinQuantityValue] = useState<Maybe<number>>();
  const [maxQuantityValue, setMaxQuantityValue] = useState<Maybe<number>>();

  const { minAge, maxAge } = useProductInventoryItemAgeRangeData();

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
    setDefaultQuantity([minAge ?? 0, maxAge ?? 0]);
    setQuantityRange([minAge ?? 0, maxAge ?? 0]);
  }, [minAge, maxAge]);

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
