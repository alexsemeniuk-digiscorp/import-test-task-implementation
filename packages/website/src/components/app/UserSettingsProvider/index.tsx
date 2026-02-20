import { useMeLazyQuery, useOrdersPeriodSettingLazyQuery } from '@/graphql';
import React, {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  defaultPlatformCurrency,
  defaultPlatformCurrencyLocale,
  defaultPlatformLocale,
} from '@helpers/currency';
import { useLocalizationSettings } from '@hooks/settings/useLocalizationSettings';
import { get, replace } from 'lodash';
import dayjs from 'src/dayjsConfig';

interface UserSettingsContextProps {
  timeFormat: EnumLocalizationsettingTimeformat | undefined;
  setTimeFormat: React.Dispatch<
    React.SetStateAction<EnumLocalizationsettingTimeformat | undefined>
  >;
  dateFormat: EnumLocalizationsettingDateformat | undefined;
  setDateFormat: React.Dispatch<
    React.SetStateAction<EnumLocalizationsettingDateformat | undefined>
  >;
  timeZone: string;
  setTimeZone: React.Dispatch<React.SetStateAction<string>>;
  meData: MeQuery | undefined;
  formatDateAndTime: (
    inputDate?: string | Maybe<Date> | number,
    withTime?: boolean,
    customDateFormat?: string | undefined,
  ) => string;
  meLoading: boolean;
  preferredCurrency: Maybe<string>;
  setPreferredCurrency: React.Dispatch<React.SetStateAction<Maybe<string>>>;
  preferredLocale: Maybe<string>;
  setPreferredLocale: React.Dispatch<React.SetStateAction<Maybe<string>>>;
  defaultRoute: string;
  isGoogleAddressInputEnabled: boolean;
  setIsGoogleAddressInputEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  isShippedDatePeriodEnabled: boolean;
  setIsShippedDatePeriodEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  isReceiveDatePeriodEnabled: boolean;
  setIsReceiveDatePeriodEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserSettingsContext = createContext<UserSettingsContextProps | undefined>(
  undefined,
);

export const UserSettingsProvider: FC<PropsWithChildren> = ({ children }) => {
  const [meData, setMeData] = useState<MeQuery | undefined>(undefined);
  const initialTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const [fetchMe, { data: fetchedMeData, loading: meLoading }] =
    useMeLazyQuery();

  useEffect(() => {
    fetchMe().catch((error) => {
      console.error('Error fetching user', error?.message);
    });
  }, [fetchMe, fetchedMeData]);

  const { userLocalizationInfo } = useLocalizationSettings(meData);

  const initialDateFormat = get(
    userLocalizationInfo,
    'localizationSettings.data[0].attributes.dateFormat',
  );

  const initialEntityTimeZone = get(
    userLocalizationInfo,
    'localizationSettings.data[0].attributes.timeZone',
  );

  const initialEntityTimeFormat = get(
    userLocalizationInfo,
    'localizationSettings.data[0].attributes.timeFormat',
  );

  const [timeFormat, setTimeFormat] = useState<
    EnumLocalizationsettingTimeformat | undefined
  >(initialEntityTimeFormat);
  const [timeZone, setTimeZone] = useState(
    initialEntityTimeZone ?? initialTimeZone,
  );
  const [dateFormat, setDateFormat] = useState<
    EnumLocalizationsettingDateformat | undefined
  >(initialDateFormat);

  const [preferredCurrency, setPreferredCurrency] = useState<Maybe<string>>(
    defaultPlatformCurrency,
  );
  const [preferredLocale, setPreferredLocale] = useState<Maybe<string>>(
    defaultPlatformLocale,
  );
  const [isGoogleAddressInputEnabled, setIsGoogleAddressInputEnabled] =
    useState<boolean>(true);
  const [isShippedDatePeriodEnabled, setIsShippedDatePeriodEnabled] =
    useState<boolean>(false);
  const [isReceiveDatePeriodEnabled, setIsReceiveDatePeriodEnabled] =
    useState<boolean>(false);

  const [fetchOrdersPeriodSetting] = useOrdersPeriodSettingLazyQuery({
    onCompleted: (data) => {
      const periodSettings = data?.ordersSetting?.data?.[0]?.attributes;
      if (periodSettings) {
        setIsShippedDatePeriodEnabled(
          periodSettings.isShippedDatePeriodEnabled ?? false,
        );
        setIsReceiveDatePeriodEnabled(
          periodSettings.isReceiveDatePeriodEnabled ?? false,
        );
      }
    },
  });

  useEffect(() => {
    fetchOrdersPeriodSetting();
  }, [fetchOrdersPeriodSetting]);

  useEffect(() => {
    setTimeFormat(initialEntityTimeFormat);
    setTimeZone(initialEntityTimeZone ?? initialTimeZone);
    setDateFormat(initialDateFormat);
    setMeData(fetchedMeData);

    const currencyLocale =
      fetchedMeData?.me?.attributes?.preferredCurrency ??
      defaultPlatformCurrencyLocale;
    const [currency, locale] = currencyLocale.split('|');
    setPreferredCurrency(currency);
    setPreferredLocale(locale);

    const initialEntityIsGoogleAddressInputEnabled =
      fetchedMeData?.me?.attributes?.isGoogleAddressInputEnabled ?? true;
    setIsGoogleAddressInputEnabled(initialEntityIsGoogleAddressInputEnabled);
  }, [
    initialEntityTimeFormat,
    initialEntityTimeZone,
    initialDateFormat,
    initialTimeZone,
    fetchedMeData,
  ]);

  useEffect(() => {
    dayjs.tz.setDefault(timeZone);
  }, [timeZone]);

  const formatDateAndTime = (
    inputDate?: string | Maybe<Date> | number,
    withTime?: boolean,
    customDateFormat?: string | undefined,
  ): string => {
    const formattedDateFormat = replace(dateFormat ?? 'MM_DD_YYYY', /_/g, '/');
    const formattedTimeFormat = timeFormat === 'HH_mm' ? 'HH:mm' : 'hh:mm A';

    if (!inputDate) {
      return '-';
    }

    const dateTimeFormat = withTime
      ? `${customDateFormat ?? formattedDateFormat} ${formattedTimeFormat}`
      : customDateFormat ?? formattedDateFormat;

    return inputDate === 'nowDate'
      ? dayjs().tz().format(dateTimeFormat)
      : dayjs(inputDate).tz().format(dateTimeFormat);
  };

  const defaultRoute = meData?.me?.attributes?.defaultRoute as string;

  return (
    <UserSettingsContext.Provider
      value={{
        dateFormat,
        setDateFormat,
        timeZone,
        setTimeZone,
        timeFormat,
        setTimeFormat,
        meData,
        formatDateAndTime,
        meLoading,
        preferredCurrency,
        setPreferredCurrency,
        preferredLocale,
        setPreferredLocale,
        defaultRoute,
        isGoogleAddressInputEnabled,
        setIsGoogleAddressInputEnabled,
        isShippedDatePeriodEnabled,
        setIsShippedDatePeriodEnabled,
        isReceiveDatePeriodEnabled,
        setIsReceiveDatePeriodEnabled,
      }}
    >
      {children}
    </UserSettingsContext.Provider>
  );
};

export const useUserSettingsContext = (): UserSettingsContextProps => {
  const context = useContext(UserSettingsContext);

  if (!context) {
    throw new Error(
      'useUserSettingsContext must be used within a UserSettingsProvider',
    );
  }

  return context;
};
