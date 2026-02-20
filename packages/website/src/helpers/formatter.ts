import { useUserSettingsContext } from '@app/UserSettingsProvider';
import {
  defaultPlatformCurrency,
  defaultPlatformLocale,
  threeCommaDigitsCurrencies,
  threeDigitsAfterComma,
  twoDigitsAfterComma,
  zeroCommaDigitsCurrencies,
  zeroDigitsAfterComma,
} from '@helpers/currency';
import isNaN from 'lodash/isNaN';
import isNil from 'lodash/isNil';
import toNumber from 'lodash/toNumber';
import toString from 'lodash/toString';

type StringObject = { [key: string]: any };

export const formatNumber = (
  value?: number | null,
  additionalOptions?: Intl.NumberFormatOptions,
  locale = defaultPlatformLocale,
): string => {
  if (locale === 'en-SG') {
    const formattedValue = new Intl.NumberFormat(locale, {
      style: 'decimal',
      currencyDisplay: 'symbol',
      ...twoDigitsAfterComma,
      ...additionalOptions,
    }).format(value || 0);

    return `S${formattedValue}`;
  } else {
    return new Intl.NumberFormat(locale, {
      style: 'decimal',
      currencyDisplay: 'symbol',
      ...twoDigitsAfterComma,
      ...additionalOptions,
    }).format(value || 0);
  }
};

export const formatToCurrency = (
  value?: number | null,
  currency?: Maybe<string>,
  zeroDigitsOptions = false,
): string => {
  const { preferredCurrency, preferredLocale } = useUserSettingsContext();

  const selectedCurrency =
    currency ?? preferredCurrency ?? defaultPlatformCurrency;
  const selectedLocale = preferredLocale ?? defaultPlatformLocale;

  if (selectedCurrency === 'POINTS') {
    return `${formatNumber(value, twoDigitsAfterComma, selectedLocale)} Points`;
  } else if (zeroCommaDigitsCurrencies.includes(selectedCurrency)) {
    return formatNumber(
      value,
      {
        currency: selectedCurrency,
        style: 'currency',
        ...zeroDigitsAfterComma,
      },
      selectedLocale,
    );
  } else if (threeCommaDigitsCurrencies.includes(selectedCurrency)) {
    return formatNumber(
      value,
      {
        currency: selectedCurrency,
        style: 'currency',
        ...threeDigitsAfterComma,
      },
      selectedLocale,
    );
  } else {
    return formatNumber(
      value,
      {
        currency: selectedCurrency,
        style: 'currency',
        ...(zeroDigitsOptions && zeroDigitsAfterComma),
      },
      selectedLocale,
    );
  }
};

export const formatToPercentage = (value?: number | null): string => {
  if (value == null) return '';

  return `${value.toFixed(2)}%`;
};

export const formatToDays = (value?: number | null): string => {
  if (value == null) return '';

  return `${value} ${value === 1 ? 'day' : 'days'}`;
};

export const convertToMegabytes = (
  value: number,
  unit: 'bytes' | 'kilobytes' = 'bytes',
): number => {
  if (unit === 'bytes') {
    return value / (1024 * 1024);
  } else if (unit === 'kilobytes') {
    return value / 1024;
  } else {
    throw new Error('Invalid unit');
  }
};

export const formatFileSize = (sizeInBytes?: number): string => {
  if (!sizeInBytes) return 'Unknown size';

  const sizeInKb = sizeInBytes / 1024;
  const sizeInMb = sizeInKb / 1024;

  const size = sizeInMb >= 0.01 ? sizeInMb : sizeInKb;
  const unit = sizeInMb >= 0.01 ? 'MB' : 'KB';

  return `${size.toFixed(2)} ${unit}`;
};

export const removeUnwantedChars = (inputString?: string): string => {
  if (!inputString) return '';
  const unwantedChars = /[\r\n\t\f]/g;
  return inputString ? toString(inputString).replace(unwantedChars, '') : '';
};

export const cleanObjectValues = (obj: StringObject) => {
  return Object.keys(obj).reduce((acc: StringObject, key) => {
    acc[key] =
      typeof obj[key] === 'string' ? removeUnwantedChars(obj[key]) : obj[key];
    return acc;
  }, {});
};

export const toCamelCase = (header: string): string => {
  return header
    .trim()
    .toLowerCase()
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, '');
};

export const padArray = <T>(
  arr: T[],
  minLength: number,
  fillValue?: T,
): T[] => {
  return arr.length >= minLength
    ? arr
    : [...arr, ...new Array(minLength - arr.length).fill(fillValue)];
};

export const replaceUnderscoresWithSpaces = (arr: string[]) => {
  return arr.map((item) => item.replace(/_/g, ' '));
};

export const formatNumberWithCommas = (
  value: Maybe<number | string>,
): string => {
  if (isNil(value)) return '';

  const numberValue = toNumber(value);

  if (isNaN(numberValue)) {
    return value.toString();
  }

  return numberValue.toLocaleString('en-US');
};

export const formattedWebsite = (website: string): string =>
  website && !website.match(/^https?:\/\//) ? `https://${website}` : website;

export const formatCurrencyTwoDecimal = (amount: number): string => {
  return amount.toFixed(2);
};
