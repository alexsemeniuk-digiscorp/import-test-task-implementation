import { useLocalizationSettingsLazyQuery } from '@/graphql';
import { useEffect } from 'react';

type GetSettingsReturnType = {
  settingsLoading: boolean;
  userLocalizationInfo: LocalizationSettingsQuery | undefined;
};

export const useLocalizationSettings = (
  meData: MeQuery | undefined,
): GetSettingsReturnType => {
  const [fetchLocalizationSettings, { data: userLocalizationInfo, loading }] =
    useLocalizationSettingsLazyQuery();

  useEffect(() => {
    if (meData?.me?.id) {
      fetchLocalizationSettings({
        variables: {
          filters: {
            user: {
              id: {
                eq: meData?.me?.id,
              },
            },
          },
        },
      }).catch((error) => {
        console.error('Error fetching localization settings:', error?.message);
      });
    }
  }, [meData?.me?.id, fetchLocalizationSettings]);

  return {
    userLocalizationInfo,
    settingsLoading: loading,
  };
};
