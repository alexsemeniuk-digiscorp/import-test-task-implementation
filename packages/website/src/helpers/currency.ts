export const currencyLocaleOptions = [
  { currency: 'USD|en-US', label: 'USD (USA)' },
  { currency: 'EUR|fr-FR', label: 'EUR (France)' },
  { currency: 'EUR|de-DE', label: 'EUR (Germany)' },
  { currency: 'JPY|ja-JP', label: 'JPY (Japan)' },
  { currency: 'SGD|en-SG', label: 'SGD (Singapore)' },
  { currency: 'KWD|en-KW', label: 'KWD (Kuwait)' },
  { currency: 'MXN|es-MX', label: 'MXN (Mexico)' },
  { currency: 'GBP|en-GB', label: 'GBP (Great Britain)' },
  { currency: 'CAD|en-CA', label: 'CAD (Canada)' },
  { currency: 'AUD|en-AU', label: 'AUD (Australia)' },
  { currency: 'XCD|en-KN', label: 'XCD (East Caribbean Dollar)' },
];

export const defaultPlatformCurrency = 'USD';
export const defaultPlatformCurrencySymbol = '$';
export const defaultPlatformLocale = 'en-US';
export const defaultPlatformCurrencyLocale = 'USD|en-US';

export const zeroCommaDigitsCurrencies = ['JPY'];
export const twoCommaDigitsCurrencies = [
  'USD',
  'EUR',
  'SGD',
  'MXN',
  'GBP',
  'CAD',
  'AUD',
  'XCD',
];
export const threeCommaDigitsCurrencies = ['KWD'];

export const zeroDigitsAfterComma = {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
};
export const oneDigitAfterComma = {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
};
export const twoDigitsAfterComma = {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};
export const threeDigitsAfterComma = {
  minimumFractionDigits: 3,
  maximumFractionDigits: 3,
};
