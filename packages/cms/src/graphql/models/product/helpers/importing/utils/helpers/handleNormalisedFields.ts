import pLimit from 'p-limit';
import { isProcessingJob } from './../../../../../../../api/redis/helpers/variables/importingVariables';
import redis from './../../../../../../../api/redis/redis';
import { handleLogger } from './../../../../../../helpers/errors';
import { processAndUpdateImports } from './../../../../../../helpers/importingHelpers/fileHelper';
import {
  checkAllImages,
  findCashPaymentMethodId,
  findCostOfGoodsAccountId,
  findExistingRelationEntities,
  findOrCreateEntities,
  getExistingEntitiesByFieldBatch,
} from './../../../../../../helpers/importingHelpers/utils';
import { processProductsImport } from './../../../createProductsFromCSV/generateImportReport';
import {
  getUpdatingProductType,
  handleCompletedCreations,
  handleNeedChangeProductsCreations,
  handleSpoiledCreations,
} from './../../../importing/productImport';
import { validateProductQuantities } from './../../../importing/utils/utils';
import {
  batchGetUnavailableSerialNumbers,
  checkSerialNumbersAvailability,
} from './../helpers/actions/handleNormalisedFields/checkSerialNumbersAvailability';
import {
  batchProcessCustomAttributes,
  getProductAttributeOptionIds,
} from './customAttributesBatchProcessing';

export const handleNormalisedProductsFields = async (
  normalizedFields,
  { spoiledCreations, needChangeCreations, completedCreations },
  { tenantFilter, userId, isRedis, generatedRegex },
  { maxImagesCount, maxProductsCount, customFieldsArr, maxSerialNumbersCount },
  config,
  currentSessionId,
) => {
  const start = Date.now();

  const allNames = normalizedFields
    .map((product) => product.name)
    .filter(Boolean);
  const allBarcodes = normalizedFields
    .map((product) => product.barcodeId)
    .filter(Boolean);

  const [
    existingNameMap,
    existingBarcodeMap,
    brandEntities,
    productTypeEntities,
    businessLocationEntities,
    contactEntities,
    companyEntities,
    costOfGoodsAccountId,
    cashPaymentMethodId,
    customAttributeOptionsMap,
    unavailableSerialNumbers,
  ] = await Promise.all([
    getExistingEntitiesByFieldBatch(
      'name',
      'api::product.product',
      tenantFilter,
      allNames,
    ),
    getExistingEntitiesByFieldBatch(
      'barcode',
      'api::product.product',
      tenantFilter,
      allBarcodes,
    ),
    findOrCreateEntities(
      normalizedFields,
      'api::product-brand.product-brand',
      'brand',
      'name',
      tenantFilter?.tenant,
    ),
    findOrCreateEntities(
      normalizedFields,
      'api::product-type.product-type',
      'productType',
      'name',
      tenantFilter?.tenant,
    ),
    findExistingRelationEntities(
      normalizedFields,
      'api::business-location.business-location',
      'productItems',
      'businessLocationId',
      'businessLocationId',
      tenantFilter?.tenant,
    ),
    findExistingRelationEntities(
      normalizedFields,
      'api::contact.contact',
      'productItems',
      'vendor',
      'email',
      tenantFilter?.tenant,
    ),
    findExistingRelationEntities(
      normalizedFields,
      'api::company.company',
      'productItems',
      'vendor',
      'email',
      tenantFilter?.tenant,
    ),
    findCostOfGoodsAccountId(),
    findCashPaymentMethodId(tenantFilter?.tenant),
    batchProcessCustomAttributes(normalizedFields, tenantFilter?.tenant),
    batchGetUnavailableSerialNumbers(normalizedFields, tenantFilter?.tenant),
  ]);

  const getEntityIdByName = (
    entityArray: any[],
    name: string,
    fieldToCheck: string,
  ) => {
    if (!name) return null;
    const found = entityArray.find((e) => e[fieldToCheck] === name.trim());
    return found ? found.id : null;
  };

  const isRelationEntitiesValid = (
    entityArray: any[],
    parsedProduct: any,
    relationToCheck: string,
    fieldToCheck: string,
  ) => {
    if (!parsedProduct?.productItems?.length) return true;

    const existingIdsSet = new Set(
      entityArray.map((entity) => entity[fieldToCheck]),
    );

    return parsedProduct.productItems.every((item: any) =>
      existingIdsSet.has(item[relationToCheck]),
    );
  };

  const isRelationEntitiesValidAndPushed = (
    entityArray: any[],
    parsedProduct: any,
    relationToCheck: string,
    fieldToCheck: string,
    type?: 'contact' | 'company',
  ): boolean => {
    const items = parsedProduct?.productItems;
    if (!items?.length) return true;

    const idByField = new Map<string, number>(
      entityArray.map((entity) => [entity[fieldToCheck], entity.id]),
    );

    let allFound = true;

    for (const item of items) {
      const vendorEmail = item?.[relationToCheck];
      if (!vendorEmail) {
        allFound = false;
        continue;
      }

      const hitId = idByField.get(vendorEmail);
      if (hitId) {
        item.vendorInfo = {
          email: vendorEmail,
          type,
          id: hitId,
        };
      } else {
        allFound = false;
        if (item.vendorInfo) delete item.vendorInfo;
      }
    }

    return allFound;
  };

  // Track products created during this import to detect CSV duplicates
  const createdProductsByName = new Map<string, any>();
  const createdProductsByBarcode = new Map<string, any>();

  // Monitoring metrics
  const metrics = {
    totalProducts: normalizedFields.length,
    processed: 0,
    active: 0,
    maxActive: 0,
    completed: 0,
    spoiled: 0,
    updated: 0,
    productTimes: [] as number[],
  };

  const logProgress = () => {
    console.log(
      `[IMPORT PROGRESS] Processed: ${metrics.processed}/${metrics.totalProducts} | ` +
        `Active: ${metrics.active} | MaxActive: ${metrics.maxActive} | ` +
        `Completed: ${metrics.completed} | Spoiled: ${metrics.spoiled} | Updated: ${metrics.updated}`,
    );
  };

  try {
    if (normalizedFields.length > 0) {
      const CONCURRENCY_LIMIT = 20;
      const limit = pLimit(CONCURRENCY_LIMIT);

      console.log(
        `[IMPORT START] Processing ${normalizedFields.length} products with concurrency limit: ${CONCURRENCY_LIMIT}`,
      );

      const processProduct = async (parsedProduct: any, index: number) => {
        const productStart = Date.now();
        metrics.active++;
        metrics.maxActive = Math.max(metrics.maxActive, metrics.active);

        try {
          // Check both DB (batch query) and newly created products during this import
          const existingFromDB = existingNameMap.get(parsedProduct?.name);
          const createdInThisImport = createdProductsByName.get(
            parsedProduct?.name,
          );
          const existedProductNames =
            existingFromDB || createdInThisImport
              ? [existingFromDB || createdInThisImport]
              : [];

          const existingBarcodeFromDB = existingBarcodeMap.get(
            parsedProduct?.barcodeId,
          );
          const createdBarcodeInThisImport = createdProductsByBarcode.get(
            parsedProduct?.barcodeId,
          );
          const existedProductBarcodes =
            existingBarcodeFromDB || createdBarcodeInThisImport
              ? [existingBarcodeFromDB || createdBarcodeInThisImport]
              : [];

          const brandId = getEntityIdByName(
            brandEntities,
            parsedProduct?.brand,
            'name',
          );
          const productTypeId = getEntityIdByName(
            productTypeEntities,
            parsedProduct?.productType,
            'name',
          );

          let isImagesIds = true;
          let imagesIds = [];

          if (parsedProduct?.images?.length) {
            const { isImagesIdsValid, imagesIdsArray } = await checkAllImages(
              parsedProduct?.images,
              tenantFilter.tenant,
              true,
            );
            isImagesIds = isImagesIdsValid;
            imagesIds = imagesIdsArray;
          }

          const isAllBusinessLocationsExists = isRelationEntitiesValid(
            businessLocationEntities,
            parsedProduct,
            'businessLocationId',
            'businessLocationId',
          );

          const isExistedProductNamesLength = Boolean(
            existedProductNames?.length && existedProductNames?.length > 0,
          );

          const isExistedProductBarcodes = Boolean(
            existedProductBarcodes?.length &&
              existedProductBarcodes?.length > 0,
          );

          const isAllVendorsExist =
            isRelationEntitiesValidAndPushed(
              contactEntities,
              parsedProduct,
              'vendor',
              'email',
              'contact',
            ) ||
            isRelationEntitiesValidAndPushed(
              companyEntities,
              parsedProduct,
              'vendor',
              'email',
              'company',
            );

          const isAllSerialNumbersAvailable = parsedProduct?.productItems
            ?.length
            ? checkSerialNumbersAvailability(
                parsedProduct?.productItems,
                unavailableSerialNumbers,
              )
            : true;

          if (
            !isImagesIds ||
            !isAllBusinessLocationsExists ||
            !isAllVendorsExist ||
            !isAllSerialNumbersAvailable
          ) {
            await handleSpoiledCreations(
              parsedProduct,
              spoiledCreations,
              isAllBusinessLocationsExists,
              isImagesIds,
              isAllVendorsExist,
              isAllSerialNumbersAvailable,
              isRedis,
              generatedRegex,
              tenantFilter,
            );
            metrics.spoiled++;
          }

          if (
            !isExistedProductNamesLength &&
            !isExistedProductBarcodes &&
            isAllVendorsExist &&
            isAllSerialNumbersAvailable &&
            isImagesIds &&
            isAllBusinessLocationsExists
          ) {
            const productAttributeOptionIds = getProductAttributeOptionIds(
              parsedProduct?.customFields,
              customAttributeOptionsMap,
            );

            await handleCompletedCreations(
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
              productAttributeOptionIds,
            );
            metrics.completed++;

            // Track newly created product to detect CSV duplicates
            const lastCreated =
              completedCreations[completedCreations.length - 1];
            if (lastCreated?.regexedId) {
              const createdProductRecord = {
                id: lastCreated.id,
                name: parsedProduct?.name,
                barcode: parsedProduct?.barcodeId,
                uuid: lastCreated.uuid,
                productId: lastCreated.regexedId,
              };

              if (parsedProduct?.name) {
                createdProductsByName.set(
                  parsedProduct.name,
                  createdProductRecord,
                );
              }
              if (parsedProduct?.barcodeId) {
                createdProductsByBarcode.set(
                  parsedProduct.barcodeId,
                  createdProductRecord,
                );
              }
            }
          } else if (
            (!!isExistedProductNamesLength || !!isExistedProductBarcodes) &&
            isImagesIds &&
            isAllBusinessLocationsExists &&
            isAllVendorsExist &&
            isAllSerialNumbersAvailable
          ) {
            const updatingType = getUpdatingProductType(
              existedProductBarcodes,
              existedProductNames,
            );
            const regexedId =
              updatingType !== 'bothDifferent'
                ? existedProductBarcodes?.[0]?.['productId'] ||
                  existedProductNames?.[0]?.['productId']
                : null;
            const updatingInfo = {
              barcodesUuid: existedProductBarcodes?.[0]?.uuid,
              barcodesId: existedProductBarcodes?.[0]?.id,
              namesUuid: existedProductNames?.[0]?.uuid,
              namesId: existedProductNames?.[0]?.id,
            };

            if (
              (!!isExistedProductNamesLength || !!isExistedProductBarcodes) &&
              updatingType !== 'bothDifferent'
            ) {
              await validateProductQuantities({
                parsedProduct,
                updatingInfo,
              });
            }

            await handleNeedChangeProductsCreations(
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
            );
            metrics.updated++;
          }

          const result = isProcessingJob(generatedRegex, tenantFilter?.tenant);
          const value = await redis.get(result);
          if (value === 'false') return;
        } catch (e) {
          handleLogger(
            'error',
            'handleNormalisedProductsFields',
            `Error in product ${index + 1}: ${JSON.stringify(
              parsedProduct?.name || 'unknown',
            )}`,
          );
        } finally {
          metrics.active--;
          metrics.processed++;
          const productTime = Date.now() - productStart;
          metrics.productTimes.push(productTime);

          // Log progress every 10 products
          if (
            metrics.processed % 10 === 0 ||
            metrics.processed === metrics.totalProducts
          ) {
            logProgress();
          }
        }
      };

      // Process all products with p-limit
      await Promise.allSettled(
        normalizedFields.map((parsedProduct, index) =>
          limit(() => processProduct(parsedProduct, index)),
        ),
      );

      console.log(`[IMPORT COMPLETE] Final metrics:`);
      logProgress();

      if (metrics.productTimes.length > 0) {
        const avgTime = (
          metrics.productTimes.reduce((a, b) => a + b, 0) /
          metrics.productTimes.length /
          1000
        ).toFixed(2);
        const minTime = (Math.min(...metrics.productTimes) / 1000).toFixed(2);
        const maxTime = (Math.max(...metrics.productTimes) / 1000).toFixed(2);
        console.log(
          `[IMPORT TIMING] Avg: ${avgTime}s | Min: ${minTime}s | Max: ${maxTime}s per product`,
        );
      }
    }

    const options = {
      maxImagesCount,
      maxProductsCount,
      customFieldsArr,
      maxSerialNumbersCount,
      userId,
    };

    await processAndUpdateImports(
      processProductsImport,
      currentSessionId,
      spoiledCreations,
      completedCreations,
      needChangeCreations,
      options,
      config,
      tenantFilter,
    );
  } catch (e) {
    handleLogger('error', 'handleNormalisedProductsFields', undefined, e);
  } finally {
    const seconds = ((Date.now() - start) / 1000).toFixed(2);
    const productsAmount =
      normalizedFields.length > 0 ? normalizedFields.length : 1;

    console.log(`handleNormalisedProductsFields took ${seconds}s`);
    console.log(`${Number(seconds) / productsAmount}s per product`);
  }
};
