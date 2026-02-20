import { NumberRangeInput } from '@form/inputs/numberRangeInput/NumberRangeInput';
import { FC, useEffect, useState } from 'react';
import * as helpers from '../PriceRangeInput/helpers';
import { useProductsDefaultPriceRangeData } from './hooks/useProductsDefaultPriceRangeData';

export const DefaultPriceRangeInput: FC<{
  onChange?: (value: string | number | undefined) => void;
}> = ({ onChange }) => {
  const [defaultPriceRange, setDefaultPriceRange] = useState<number[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([]);
  const [minPriceValue, setMinPriceValue] = useState<
    number | null | undefined
  >();
  const [maxPriceValue, setMaxPriceValue] = useState<Maybe<number>>();
  const { minPrice: min, maxPrice: max } = useProductsDefaultPriceRangeData();

  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange(value);
    setMinPriceValue(value?.[0]);
    setMaxPriceValue(value?.[1]);
  };

  const handleMinValueChange = (value: number | null) => {
    if (value !== null) {
      setMinPriceValue(value);
      setPriceRange([value, priceRange[1]]);
    }
  };

  const handleMaxValueChange = (value: number | null) => {
    if (value !== null) {
      setMaxPriceValue(value);
      setPriceRange([priceRange[0], value]);
    }
  };

  useEffect(() => {
    setDefaultPriceRange([min ?? 0, max ?? 0]);
    setPriceRange([min ?? 0, max ?? 0]);
  }, [min, max]);

  useEffect(() => {
    if (onChange) {
      onChange(`${priceRange[0]}-${priceRange[1]}`);
    }
  }, [onChange, priceRange]);

  return (
    <NumberRangeInput
      rangeValue={priceRange}
      defaultRange={defaultPriceRange}
      minRangeValue={minPriceValue}
      maxRangeValue={maxPriceValue}
      handleRangeChange={handlePriceRangeChange}
      handleMinRangeChange={handleMinValueChange}
      handleMaxRangeChange={handleMaxValueChange}
      formatter={helpers.priceInputFormatter}
      parser={helpers.priceInputParser}
    />
  );
};
