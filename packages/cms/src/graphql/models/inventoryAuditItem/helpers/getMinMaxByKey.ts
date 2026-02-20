export const getMinMaxByKey = (key, mapper) => {
  let values;
  key === 'price'
    ? (values = mapper.map((item) => item.productInventoryItem[key]))
    : (values = mapper.map((item) => item[key]));

  const min = Math.min(...values) || 0;
  const max = Math.max(...values) || 0;

  return { min, max };
};
