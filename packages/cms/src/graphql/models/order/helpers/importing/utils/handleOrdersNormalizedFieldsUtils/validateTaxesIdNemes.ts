export const validateTaxesIdNames = async (products, tenantFilter) => {
  const taxNamesSet = new Set(products?.map((product) => product.taxName));
  const existingTaxesNames = await strapi.entityService.findMany(
    'api::tax.tax',
    {
      filters: {
        name: {
          $in: products
            ?.map((product) => product.taxName)
            ?.filter((taxName) => taxName !== ''),
        },
        tenant: tenantFilter.tenant,
      },
      fields: ['id'],
    },
  );
  const isAllTaxNamesExists =
    Array.from(taxNamesSet).filter((item) => item !== '')?.length ===
    existingTaxesNames.length;
  return { isAllTaxNamesExists };
};
