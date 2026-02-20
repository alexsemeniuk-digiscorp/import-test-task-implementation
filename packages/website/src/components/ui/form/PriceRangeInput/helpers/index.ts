export const priceInputFormatter = (
  value: string | number | undefined,
): string => {
  const numericValue =
    typeof value === 'number' ? value : parseFloat(value ?? '0');
  return `$ ${numericValue}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const priceInputParser = (value: string | undefined): number => {
  const parsedValue = value?.replace(/\$\s?|(,*)/g, '');
  return parsedValue ? parseFloat(parsedValue) : 0;
};
