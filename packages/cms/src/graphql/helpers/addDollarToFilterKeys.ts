export const addDollarToFilterKeys = (filtersObject) => {
  if (typeof filtersObject !== 'object' || filtersObject === null)
    return filtersObject;

  const newFiltersObject = Array.isArray(filtersObject) ? [] : {};
  for (const key in filtersObject) {
    if (
      key === 'eq' ||
      key === 'ne' ||
      key === 'between' ||
      key === 'in' ||
      key === 'nin' ||
      key === 'gt' ||
      key === 'gte' ||
      key === 'lt' ||
      key === 'lte' ||
      key === 'or' ||
      key === 'and' ||
      key === 'containsi' ||
      key === 'contains'
    ) {
      newFiltersObject[`$${key}`] = addDollarToFilterKeys(filtersObject[key]);
    } else if (typeof filtersObject[key] === 'object') {
      newFiltersObject[key] = addDollarToFilterKeys(filtersObject[key]);
    } else {
      newFiltersObject[key] = filtersObject[key];
    }
  }
  return newFiltersObject;
};
