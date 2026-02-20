export const isObjectEmpty = (value) => {
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  if (typeof value === 'object' && value !== null) {
    return Object.keys(value).length === 0;
  }
  return value === '';
};

export const filterNonEmptyItems = (items) => {
  return items.filter((obj) => !Object.values(obj).every(isObjectEmpty));
};
