import { NexusGenInputs } from '../../types/generated/graphql';

export const fetchServiceAccountId = async (
  product: NexusGenInputs['ProductInput'] | null,
  serviceProduct: NexusGenInputs['ServiceInput'] | null,
  service: NexusGenInputs['AccServiceConnInput'],
  type: 'revenue' | 'cost',
) => {
  const itemToCheck = product || serviceProduct; // Choose the relevant object
  if (!itemToCheck) return undefined; // Early return if neither is provided

  const mappings = service.accProductMappings;

  return mappings.find((item) => {
    if (
      item['accountType'] === 'subCategory' &&
      itemToCheck?.[`${type}ChartSubcategory`]?.['id'] ===
        item?.['chartSubcategory']?.['id']
    ) {
      return true;
    }
    if (
      item['accountType'] === 'category' &&
      itemToCheck?.[`${type}ChartCategory`]?.['id'] ===
        item?.['chartCategory']?.['id']
    ) {
      return true;
    }
    if (
      item['accountType'] === 'account' &&
      itemToCheck?.[`${type}ChartAccount`]?.['id'] ===
        item?.['chartAccount']?.['id']
    ) {
      return true;
    }
    return false;
  })?.['serviceAccountId'];
};
