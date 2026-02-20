export const getLocalizationSetting = async (userId) => {
  const localizationSetting = await strapi.entityService.findMany(
    'api::localization-setting.localization-setting',
    {
      filters: {
        user: userId,
      },
    },
  );
  const dateFormat = localizationSetting?.[0]?.dateFormat || undefined;
  const timeFormat = localizationSetting?.[0]?.timeFormat || undefined;

  return { dateFormat, timeFormat };
};
