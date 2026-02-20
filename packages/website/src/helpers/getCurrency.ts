import { useUserSettingsContext } from '@app/UserSettingsProvider';
import {
  defaultPlatformCurrency,
  defaultPlatformLocale,
  zeroDigitsAfterComma,
} from '@helpers/currency';
import { useMemo } from 'react';

type CurrencyInfo = {
  preferredCurrencyCode: string;
  preferredCurrencySymbol: string;
  preferredCurrencyLocale: string;
};

export const extractCurrencySymbol = (
  currency: string,
  locale: string,
): string => {
  const parts = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    currencyDisplay: 'symbol',
    ...zeroDigitsAfterComma,
  }).formatToParts(1);

  const symbolPart = parts.find((part) => part.type === 'currency');

  if (locale === 'en-SG') {
    return symbolPart?.value ? `S${symbolPart?.value}` : currency;
  } else {
    return symbolPart?.value ?? currency;
  }
};

export const getCurrency = (orderType?: Maybe<EnumOrderType>): CurrencyInfo => {
  const { preferredCurrency, preferredLocale } = useUserSettingsContext();

  return useMemo(() => {
    const preferredCurrencyLocale = preferredLocale ?? defaultPlatformLocale;

    if (orderType === 'tradeIn') {
      return {
        preferredCurrencyCode: 'POINTS',
        preferredCurrencySymbol: '',
        preferredCurrencyLocale,
      };
    }

    const preferredCurrencyCode = preferredCurrency ?? defaultPlatformCurrency;
    const preferredCurrencySymbol = extractCurrencySymbol(
      preferredCurrencyCode,
      preferredCurrencyLocale,
    );

    return {
      preferredCurrencyCode,
      preferredCurrencySymbol,
      preferredCurrencyLocale,
    };
  }, [orderType, preferredCurrency, preferredLocale]);
};
