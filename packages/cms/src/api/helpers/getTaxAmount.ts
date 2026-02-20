export const getTaxAmount = (entity, unitTax, points): number => {
  const { tax, taxCollection } = entity;
  if (tax?.rate) {
    return (
      (tax.rate / 100) *
      (entity.price * (unitTax ? 1 : entity.quantity) - points)
    );
  }
  if (taxCollection?.taxes?.length) {
    const totalTax = taxCollection.taxes.reduce(
      (totalTax, tax) =>
        totalTax +
        ((entity.price * (unitTax ? 1 : entity.quantity) - points) * tax.rate) /
          100,
      0,
    );
    return totalTax;
  }
  return 0;
};
