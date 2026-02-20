export const convertWoomercerMetaFieldsAsString = (metaData) => {
  const excludeKeys = ['Metal Color', 'Ring Size Range'];
  if (!Array.isArray(metaData)) return '';

  return metaData
    .filter(
      (item) =>
        item.display_key &&
        item.display_value &&
        !item.key.startsWith('_') && // ignore internal keys
        !excludeKeys.includes(item.display_key), // skip excluded display names
    )
    .map((item) => `${item.display_key}: ${item.display_value}`)
    .join('\n');
};
