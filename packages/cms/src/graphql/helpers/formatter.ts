export const stringNormalizer = (str: string) => {
  return str?.trim()?.toLowerCase();
};

export const formatToPercentage = (value?: number | null): string => {
  if (value == null) return '';

  return `${value.toFixed(2)}%`;
};

export const formatToDays = (value?: number | null): string => {
  if (value == null) return '';

  return `${value} ${value === 1 ? 'day' : 'days'}`;
};

export const capitalizeEnum = (inputString: string) => {
  const words: string[] = inputString.split('_');

  return words
    .map((word, index) => {
      if (index === 0 && word.toLowerCase().startsWith('pos')) {
        return 'POS' + word.slice(3).charAt(0).toUpperCase() + word.slice(4);
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
};
