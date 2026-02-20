export const calculateTaxPortion = (item, taxPortionPercent) => {
  if (!item || !item.tax) return 0;
  return (
    (((item.tax.rate && (item.price / 100) * item.tax.rate) +
      (item.tax.fixedFee ?? 0) +
      (item.tax.perUnitFee ?? 0)) /
      100) *
    taxPortionPercent
  );
};
