export const processDefaultPriceImport = (arr = []) => {
  try {
    const csvResultHeaders = ['Product ID', 'Default Price', 'Errors'];
    const fieldsData = arr.map((item) => [
      item.productId ?? '',
      item.defaultPrice ?? '',
      item.errors ?? '',
    ]);
    return { csvResultHeaders, fieldsData };
  } catch (e) {
    console.error('processDefaultPriceImport error:', e);
    return { csvResultHeaders: [], fieldsData: [] };
  }
};
