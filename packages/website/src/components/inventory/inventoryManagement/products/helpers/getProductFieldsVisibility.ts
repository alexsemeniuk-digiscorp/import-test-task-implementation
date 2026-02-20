import { get } from 'lodash';

export interface ProductFieldsVisibility {
  isAppraisalDescriptionEnabled: boolean;
  isBrandEnabled: boolean;
  isCostEnabled: boolean;
  isDimensionEnabled: boolean;
  isEanEnabled: boolean;
  isEcommerceDescriptionEnabled: boolean;
  isEcommerceNameEnabled: boolean;
  isExpiresEnabled: boolean;
  isForBundleUseOnlyEnabled: boolean;
  isForBusinessOnlyEnabled: boolean;
  isIsbnEnabled: boolean;
  isLaborWarrantyEnabled: boolean;
  isLowQuantityEnabled: boolean;
  isMaxQuantityEnabled: boolean;
  isMinimumOrderQuantityEnabled: boolean;
  isModelEnabled: boolean;
  isMpnEnabled: boolean;
  isNoteEnabled: boolean;
  isPackagingProductEnabled: boolean;
  isPartsWarrantyEnabled: boolean;
  isPointsGivenEnabled: boolean;
  isPointsRedeemEnabled: boolean;
  isPriceEnabled: boolean;
  isRentableEnabled: boolean;
  isRetailPriceMultiplierEnabled: boolean;
  isReturnableItemEnabled: boolean;
  isRevenueEnabled: boolean;
  isShopifyCollectionEnabled: boolean;
  isShopifyTagsEnabled: boolean;
  isSkuEnabled: boolean;
  isStorageNotesEnabled: boolean;
  isTaxEnabled: boolean;
  isUpcEnabled: boolean;
  isVendorEnabled: boolean;
  isWeightEnabled: boolean;
  isWholesalePriceMultiplierEnabled: boolean;
  isWoocommerceCategoryEnabled: boolean;
}

const VISIBILITY_FIELDS: (keyof ProductFieldsVisibility)[] = [
  'isAppraisalDescriptionEnabled',
  'isBrandEnabled',
  'isCostEnabled',
  'isDimensionEnabled',
  'isEanEnabled',
  'isEcommerceDescriptionEnabled',
  'isEcommerceNameEnabled',
  'isExpiresEnabled',
  'isForBundleUseOnlyEnabled',
  'isForBusinessOnlyEnabled',
  'isIsbnEnabled',
  'isLaborWarrantyEnabled',
  'isLowQuantityEnabled',
  'isMaxQuantityEnabled',
  'isMinimumOrderQuantityEnabled',
  'isModelEnabled',
  'isMpnEnabled',
  'isNoteEnabled',
  'isPackagingProductEnabled',
  'isPartsWarrantyEnabled',
  'isPointsGivenEnabled',
  'isPointsRedeemEnabled',
  'isPriceEnabled',
  'isRentableEnabled',
  'isRetailPriceMultiplierEnabled',
  'isReturnableItemEnabled',
  'isRevenueEnabled',
  'isShopifyCollectionEnabled',
  'isShopifyTagsEnabled',
  'isSkuEnabled',
  'isStorageNotesEnabled',
  'isTaxEnabled',
  'isUpcEnabled',
  'isVendorEnabled',
  'isWeightEnabled',
  'isWholesalePriceMultiplierEnabled',
  'isWoocommerceCategoryEnabled',
];

export const getProductFieldsVisibility = (
  productSettings: ProductSettingEntity | undefined,
): ProductFieldsVisibility => {
  const result = {} as ProductFieldsVisibility;

  VISIBILITY_FIELDS.forEach((field) => {
    result[field] = get(productSettings, `attributes.${field}`, false) ?? false;
  });

  return result;
};
