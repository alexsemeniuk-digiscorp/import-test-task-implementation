export const filterObjectValues = (
  filtersObject: Record<string, any>,
  type: 'null' | 'array',
) => {
  const filteredObject = { ...filtersObject };
  if (type === 'null') {
    for (const key in filteredObject) {
      if (
        !filteredObject[key] ||
        (Array.isArray(filteredObject[key]) && filteredObject[key].length === 0)
      ) {
        delete filteredObject[key];
      }
    }
  } else if (type === 'array') {
    for (const key in filtersObject) {
      // Remove if the value is an array or an object
      if (typeof filteredObject[key] === 'object') {
        delete filteredObject[key];
      }
    }
  }
  return filteredObject;
};
