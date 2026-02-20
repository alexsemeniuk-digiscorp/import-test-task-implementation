import { handleError } from './../../../../helpers/errors';

import { generateId, generateUUID } from '../../../../../utils/randomBytes';
import {
  PRODUCTS_IMPORT_IDENTIFIER,
  completedImportingData,
  spoiledImportingData,
  updatingImportingData,
} from './../../../../../api/redis/helpers/variables/importingVariables';
import { handleCompletedCreationError } from './../../../../helpers/importingHelpers/errorHandler';
import { updateRedisImportData } from './../../../../helpers/importingHelpers/redisHelpers';
import {
  createDimensionEntry,
  createWeightEntry,
} from './utils/helpers/actions/completeCreationsUtils';
import { handleProductItemWithNoFetches } from './utils/utils';

export const filterEmpty = (arr) => {
  return arr.filter((item) => item !== '' && item !== undefined);
};

export const handleCompletedCreations = async (
  parsedProduct,
  tenantFilter,
  businessLocationEntities,
  costOfGoodsAccountId,
  cashPaymentMethodId,
  completedCreations,
  brandId,
  productTypeId,
  userId,
  imagesIds,
  isRedis,
  generatedRegex,
  spoiledCreations,
  productAttributeOptionIds: number[] = [],
) => {
  const {
    errors,
    defaultPrice,
    dimensionLength,
    dimensionWidth,
    dimensionHeight,
    dimensionUnit,
    weight,
    weightUnit,
    productItems,
    partsWarranty,
    laborWarranty,
    images,
    brand,
    barcodeId,
    productType,
    upc,
    mpn,
    ean,
    isbn,
    sku,
    name,
    model,
    description,
    ecommerceDescription,
    shopifyTags,
    isNegativeCount,
    active,
  } = parsedProduct || {};

  const isNegative =
    String(isNegativeCount ?? '')
      .trim()
      .toLowerCase() === 'yes';
  const isActive =
    String(active ?? '')
      .trim()
      .toLowerCase() === 'yes';
  const partsW = partsWarranty ? new Date(partsWarranty) : undefined;
  const laborW = laborWarranty ? new Date(laborWarranty) : undefined;

  try {
    const newProduct = await strapi.entityService.create(
      'api::product.product',
      {
        data: {
          returnable: false,
          name: name ?? undefined,
          model: model ?? undefined,
          description: description ?? undefined,
          ecommerceDescription: ecommerceDescription ?? undefined,
          shopifyTags: shopifyTags ?? undefined,
          barcode: barcodeId,
          productId: generateId(),
          defaultPrice: +defaultPrice || 0,
          brand: brandId ?? undefined,
          productType: productTypeId ?? undefined,
          UPC: upc ?? undefined,
          SKU: sku ?? undefined,
          MPN: mpn ?? undefined,
          EAN: ean ?? undefined,
          ISBN: isbn ?? undefined,
          partsWarranty: partsW,
          laborWarranty: laborW,
          tenant: tenantFilter?.tenant,
          files: filterEmpty(imagesIds),
          isNegativeCount: isNegative,
          active: isActive,
          productAttributeOptions:
            productAttributeOptionIds.length > 0
              ? productAttributeOptionIds
              : undefined,
          _skipUniqueNameBarcodeCheck: true,
          _skipProductIdCheck: true,
          _skipAccountingSync: true,
          _skipEcommerceSync: true,
          _skipMeilisearchSync: true,
        },
      },
    );

    const productId = newProduct?.id;

    if (productId) {
      const followUps: Promise<any>[] = [];

      followUps.push(
        createWeightEntry({ weight, weightUnit, productId, parsedProduct }),
      );
      followUps.push(
        createDimensionEntry({
          dimensionLength,
          dimensionWidth,
          dimensionHeight,
          dimensionUnit,
          productId,
          parsedProduct,
        }),
      );

      const itemsToCreate = productItems.filter(
        (item) => item?.quantity && item?.businessLocationId,
      );

      followUps.push(
        Promise.allSettled(
          itemsToCreate.map((productItem) =>
            handleProductItemWithNoFetches({
              productItem,
              productId,
              tenantId: tenantFilter?.tenant,
              userId,
              defaultPrice,
              isNegative,
              isActive,
              businessLocationEntities,
              costOfGoodsAccountId,
              cashPaymentMethodId,
            }),
          ),
        ),
      );

      await Promise.allSettled(followUps);
    }
    const extendedParsedProduct = {
      ...parsedProduct,
      imagesIds,
      regexedId: newProduct?.productId,
    };

    const completedCreationJson = JSON.stringify(extendedParsedProduct);
    if (isRedis) {
      await updateRedisImportData(
        generatedRegex,
        tenantFilter,
        completedCreationJson,
        PRODUCTS_IMPORT_IDENTIFIER,
        completedImportingData,
      );
    }
    completedCreations.push(extendedParsedProduct);
  } catch (err) {
    await handleCompletedCreationError({
      parsedEntity: parsedProduct,
      err,
      isRedis,
      generatedRegex,
      tenantFilter,
      functionName: 'handleCompletedProductCreations',
      importIdentifier: PRODUCTS_IMPORT_IDENTIFIER,
      spoiledCreations,
    });
  }
};

export const handleSpoiledCreations = async (
  parsedProduct,
  spoiledCreations,
  isAllBusinessLocationsExists,
  isImagesIds,
  isAllVendorsExist,
  isAllSerialNumbersAvailable,
  isRedis,
  generatedRegex,
  tenantFilter,
) => {
  const errors = [];

  if (!isImagesIds) {
    errors.push('Some of images ids not correct');
  }
  if (!isAllBusinessLocationsExists) {
    errors.push('Some of business location ids not correct');
  }
  if (!isAllVendorsExist) {
    errors.push('Not all vendor emails are correct');
  }
  if (!isAllSerialNumbersAvailable) {
    errors.push('Some of serial numbers already in use');
  }

  const spoiledCreation = {
    ...parsedProduct,
    errors,
    localId: generateUUID(),
  };

  const spoiledCreationJson = JSON.stringify(spoiledCreation);

  if (isRedis) {
    await updateRedisImportData(
      generatedRegex,
      tenantFilter,
      spoiledCreationJson,
      PRODUCTS_IMPORT_IDENTIFIER,
      spoiledImportingData,
    );
  }
  spoiledCreations.push(spoiledCreation);
};

export const getUniqueSet = (array, key) =>
  new Set(array?.map((item) => item[key]));

export const checkExistence = async (entity, key, valuesSet) => {
  const existingItems = await strapi.entityService.findMany(entity, {
    filters: {
      [key]: {
        $in: Array.from(valuesSet),
      },
    },
    fields: ['id'] as any,
  });
  return valuesSet.size > existingItems.length;
};

export const findOrCreateProductInventoryItem = async (
  parsedProduct,
  tenantFilter,
) => {
  const productItems = await strapi.entityService.findMany(
    'api::product-inventory-item.product-inventory-item',
    {
      filters: {
        product: { productId: { $eq: parsedProduct.productId } },
        businessLocation: {
          businessLocationId: { $eq: parsedProduct.businessLocationId },
        },
        tenant: tenantFilter.tenant,
      },
      fields: [
        'id',
        'quantity',
        'lowQuantity',
        'minOrderQuantity',
        'maxQuantity',
      ],
      populate: {
        product: {
          fields: ['id'],
        },
        businessLocation: {
          fields: ['id'],
        },
      },
      limit: 1,
    },
  );

  if (productItems.length) {
    return productItems[0];
  }

  const product = await strapi.entityService.findMany('api::product.product', {
    filters: { productId: { $eq: parsedProduct.productId } },
    fields: ['id'],
  });

  const businessLocation = await strapi.entityService.findMany(
    'api::business-location.business-location',
    {
      filters: {
        businessLocationId: { $eq: parsedProduct.businessLocationId },
      },
      fields: ['id'],
    },
  );

  return await strapi.entityService.create(
    'api::product-inventory-item.product-inventory-item',
    {
      data: {
        quantity: 0,
        lowQuantity: 0,
        minOrderQuantity: 0,
        maxQuantity: 0,
        businessLocation: businessLocation?.[0]?.id,
        product: product?.[0]?.id,
        _skipMeilisearchSync: true,
      },
    },
  );
};

export const createProductItemEntry = (productItem, parsedProduct) => {
  return {
    ...productItem,
    productQuantity: parsedProduct.quantity,
    productTax: parsedProduct.taxName,
    productPrice: parsedProduct.price,
  };
};

export const getUpdatingProductType = (
  existedProductBarcodes,
  existedProductNames,
): 'name' | 'barcode' | 'bothEqual' | 'bothDifferent' | 'none' => {
  const hasBarcodes = !!existedProductBarcodes.length;
  const hasNames = !!existedProductNames.length;
  const hasEqualIds =
    !!existedProductBarcodes?.[0]?.id && !!existedProductNames?.[0]?.id;

  switch (true) {
    case hasBarcodes && hasNames && hasEqualIds:
      return 'bothEqual';
    case hasBarcodes && hasNames:
      return 'bothDifferent';
    case hasBarcodes:
      return 'barcode';
    case hasNames:
      return 'name';
    default:
      return 'none';
  }
};

export const handleNeedChangeProductsCreations = async (
  parsedProduct,
  needChangeCreations,
  updatingType,
  updatingInfo,
  tenantFilter,
  brandId,
  productTypeId,
  regexedId,
  imagesIds,
  isRedis,
  generatedRegex,
) => {
  try {
    const {
      defaultPrice,
      partsWarranty,
      laborWarranty,
      images,
      barcodeId,
      upc,
      mpn,
      ean,
      isbn,
      sku,
      isNegativeCount,
      active,
    } = parsedProduct || {};

    const updatedObject = {
      barcode: barcodeId,
      tenantId: tenantFilter?.tenant,
      filesIds: filterEmpty(images),
      ...parsedProduct,
      defaultPrice: +defaultPrice || 0,
      brandId: brandId ?? undefined,
      productTypeId: productTypeId ?? undefined,
      UPC: upc ?? undefined,
      SKU: sku ?? undefined,
      MPN: mpn ?? undefined,
      EAN: ean ?? undefined,
      ISBN: isbn ?? undefined,
      partsWarranty: partsWarranty ? new Date(partsWarranty) : undefined,
      laborWarranty: laborWarranty ? new Date(laborWarranty) : undefined,
      imagesIds,
      updatingType,
      updatingInfo,
      regexedId,
      isNegativeCount: isNegativeCount?.trim().toLowerCase() === 'yes',
      active: active?.trim().toLowerCase() === 'yes',
    };
    const updatedJson = JSON.stringify(updatedObject);
    if (isRedis) {
      await updateRedisImportData(
        generatedRegex,
        tenantFilter,
        updatedJson,
        PRODUCTS_IMPORT_IDENTIFIER,
        updatingImportingData,
      );
    }

    needChangeCreations.push(updatedObject);
  } catch (e) {
    handleError('handleNeedChangeProductsCreations', undefined, e);
  }
};

export const checkAllEmailsAreReal = async (productItems) => {
  if (!productItems?.length) return;

  for (let i = 0; i < productItems.length; i++) {
    const vendorEmail = productItems[i]?.vendor;
    if (productItems[i]?.vendor) {
      const [contactVendor, companyVendor] = await Promise.all([
        strapi.entityService.findMany('api::contact.contact', {
          filters: { email: vendorEmail },
          fields: ['id'],
          limit: 1,
        }),
        strapi.entityService.findMany('api::company.company', {
          filters: { email: vendorEmail },
          fields: ['id'],
          limit: 1,
        }),
      ]);
      if (!contactVendor?.length && !companyVendor?.length) {
        return false;
      }

      productItems[i].vendorInfo = contactVendor?.[0]?.id
        ? { email: vendorEmail, type: 'contact', id: contactVendor[0].id }
        : { email: vendorEmail, type: 'company', id: companyVendor[0].id };
    }
  }
  return true;
};

export const checkAllBusinessLocationsExist = async (productItems) => {
  try {
    const businessLocationsSet = new Set(
      productItems?.map((productItem) => productItem.businessLocationId),
    );

    const existingBusinessLocationIds = await strapi.entityService.findMany(
      'api::business-location.business-location',
      {
        filters: {
          businessLocationId: {
            $in: Array.from(businessLocationsSet) as string[],
          },
        },
        fields: ['id'],
      },
    );

    return (
      filterEmpty(Array.from(businessLocationsSet)).length ===
      existingBusinessLocationIds?.length
    );
  } catch (e) {
    handleError('checkAllBusinessLocationsExist', undefined, e);
  }
};
