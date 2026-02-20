import pLimit from 'p-limit';
import { isProcessingJob } from './../../../../../../api/redis/helpers/variables/importingVariables';
import redis from './../../../../../../api/redis/redis';
import {
  checkAllImages,
  findCashPaymentMethodId,
  findRevenueAccountId,
} from './../../../../../../graphql/helpers/importingHelpers/utils';
import { handleLogger } from './../../../../../helpers/errors';
import { stringNormalizer } from './../../../../../helpers/formatter';
import { processAndUpdateImports } from './../../../../../helpers/importingHelpers/fileHelper';
import { processOrdersImport } from './../../createOrdersFromCSV/processOrdersImport';
import {
  handleCompletedCreations,
  handleSpoiledCreations,
} from './../../importing/orderImport';
import {
  batchFindBusinessLocations,
  batchFindCustomers,
  batchFindEmployees,
  batchFindInventoryItems,
  batchFindProductInventoryItems,
  batchFindSerialNumbers,
  batchFindTaxes,
  findDefaultTax,
} from './batchHelpers';

export const handleNormalisedOrdersFields = async (
  normalizedFields,
  { spoiledCreations, completedCreations },
  { createModeOn, tenantFilter, userId, isRedis, generatedRegex },
  { maxProductsCount, maxImagesCount, maxSerialNumbersCount },
  config,
  currentSessionId,
) => {
  const start = Date.now();

  // Monitoring metrics
  const metrics = {
    totalOrders: normalizedFields.length,
    processed: 0,
    active: 0,
    maxActive: 0,
    completed: 0,
    spoiled: 0,
    orderTimes: [] as number[],
  };

  const logProgress = () => {
    console.log(
      `[ORDER IMPORT PROGRESS] Processed: ${metrics.processed}/${metrics.totalOrders} | ` +
        `Active: ${metrics.active} | MaxActive: ${metrics.maxActive} | ` +
        `Completed: ${metrics.completed} | Spoiled: ${metrics.spoiled}`,
    );
  };

  try {
    if (normalizedFields.length > 0) {
      const [
        { contactsMap, companiesMap },
        employeesMap,
        businessLocationsMap,
        { productsMap, servicesMap, classesMap, membershipsMap },
        taxesMap,
        serialNumbersMap,
        revenueAccountId,
        cashPaymentMethodId,
        defaultTaxId,
      ] = await Promise.all([
        batchFindCustomers(normalizedFields, tenantFilter?.tenant),
        batchFindEmployees(normalizedFields, tenantFilter?.tenant),
        batchFindBusinessLocations(normalizedFields, tenantFilter?.tenant),
        batchFindInventoryItems(normalizedFields, tenantFilter),
        batchFindTaxes(normalizedFields, tenantFilter),
        batchFindSerialNumbers(normalizedFields),
        findRevenueAccountId(),
        findCashPaymentMethodId(tenantFilter?.tenant),
        findDefaultTax(),
      ]);

      // Batch fetch product inventory items
      const productInventoryItemsMap = await batchFindProductInventoryItems(
        normalizedFields,
        businessLocationsMap,
        productsMap,
        tenantFilter,
      );

      // Helper function to get customer info from pre-fetched data
      const getCustomerInfo = (
        customerField: string,
      ): {
        customerType: 'contact' | 'company' | 'none';
        customerId?: string;
      } => {
        if (!customerField) {
          return { customerType: 'none', customerId: undefined };
        }

        const normalizedEmail = stringNormalizer(customerField);
        const contact = contactsMap.get(normalizedEmail);
        if (contact) {
          return { customerType: 'contact', customerId: contact.id };
        }

        const company = companiesMap.get(normalizedEmail);
        if (company) {
          return { customerType: 'company', customerId: company.id };
        }

        return { customerType: 'none', customerId: undefined };
      };

      // Helper function to classify products using pre-fetched data
      const classifyProducts = (parsedOrder: any) => {
        if (!parsedOrder?.products) {
          return { isAllProductsExists: true };
        }

        const productIdsCount = parsedOrder.products
          .map((p: any) => p.productId)
          .filter(Boolean).length;

        let foundCount = 0;
        parsedOrder.products.forEach((product: any) => {
          const productId = product.productId;
          if (!productId) return;

          if (productsMap.has(productId)) {
            product.inventoryType = 'product';
            foundCount++;
          } else if (servicesMap.has(productId)) {
            product.inventoryType = 'service';
            foundCount++;
          } else if (classesMap.has(productId)) {
            product.inventoryType = 'class';
            foundCount++;
          } else if (membershipsMap.has(productId)) {
            product.inventoryType = 'membership';
            foundCount++;
          }
        });

        const isAllProductsExists = productIdsCount === foundCount;

        return { isAllProductsExists };
      };

      // Helper function to validate taxes using pre-fetched data
      const validateTaxes = (products: any[]) => {
        if (!products || products.length === 0) {
          return { isAllTaxNamesExists: true };
        }

        const uniqueTaxNames = new Set(
          products.map((p: any) => p.taxName).filter(Boolean),
        );

        const foundTaxes = Array.from(uniqueTaxNames).filter((taxName) =>
          taxesMap.has(taxName),
        );

        const isAllTaxNamesExists =
          Array.from(uniqueTaxNames).filter((name) => name !== '').length ===
          foundTaxes.length;

        return { isAllTaxNamesExists };
      };

      // Helper function to validate serial numbers using pre-fetched data
      const validateSerialNumbers = async (
        products: any[],
        businessLocationId: number,
      ) => {
        const ableToCreateProductItemsIds = [];
        const unableToCreateProductItemsIds = [];
        let isSerialNumbersAvailable = true;
        let isSuitableSerialNumbers = true;
        let isEnoughItemQuantity = true;

        // Check if there are non-product items with serial numbers
        for (const product of products) {
          if (
            product.inventoryType !== 'product' &&
            product.serialNumbers?.length > 0
          ) {
            isSuitableSerialNumbers = false;
            break;
          }
        }

        if (!isSuitableSerialNumbers) {
          return {
            resultItems: {
              ableToCreateProductItemsIds,
              unableToCreateProductItemsIds,
            },
            validation: {
              isSerialNumbersAvailable,
              isSuitableSerialNumbers,
              isEnoughItemQuantity,
            },
          };
        }

        for (const parsedProduct of products) {
          if (parsedProduct.inventoryType === 'product') {
            const productData = productsMap.get(parsedProduct.productId);
            if (!productData) {
              unableToCreateProductItemsIds.push(parsedProduct);
              continue;
            }

            const productId = productData.id;
            const inventoryItemKey = `${productId}_${businessLocationId}`;
            let productItem = productInventoryItemsMap.get(inventoryItemKey);

            // If inventory item doesn't exist, we need to create it
            if (!productItem) {
              try {
                productItem = await strapi.entityService.create(
                  'api::product-inventory-item.product-inventory-item',
                  {
                    data: {
                      quantity: 0,
                      lowQuantity: 0,
                      minOrderQuantity: 0,
                      maxQuantity: 0,
                      businessLocation: businessLocationId,
                      product: productId,
                      isSerializedInventory:
                        parsedProduct?.serialNumbers &&
                        parsedProduct?.serialNumbers?.length > 0,
                      _skipActiveStatusSet: true,
                      _skipMeilisearchSync: true,
                    },
                  },
                );

                // Cache it for future orders
                productInventoryItemsMap.set(inventoryItemKey, productItem);
              } catch (e) {
                handleLogger(
                  'error',
                  'createProductInventoryItem',
                  undefined,
                  e,
                );
                unableToCreateProductItemsIds.push(parsedProduct);
                continue;
              }
            }

            const serialNumbers = parsedProduct?.serialNumbers || [];
            const existedSerialNumbers = serialNumbers
              .map((sn: string) => serialNumbersMap.get(sn))
              .filter(Boolean);

            // Check if serial numbers are available
            const allAvailable = existedSerialNumbers.every(
              (existedSerialNumber: any) => {
                if (
                  existedSerialNumber?.sellingProductOrderItem?.id ||
                  existedSerialNumber?.returnItem?.id ||
                  existedSerialNumber?.inventoryAdjustmentItem?.id ||
                  existedSerialNumber?.transferOrderItem?.id
                ) {
                  return false;
                }
                if (existedSerialNumber?.productInventoryItem?.id) {
                  return (
                    existedSerialNumber.productInventoryItem.id ===
                    productItem.id
                  );
                }
                return true;
              },
            );

            if (!allAvailable) {
              isSerialNumbersAvailable = false;
            }

            (productItem as any).existedSerialNumbers =
              existedSerialNumbers.map((existed: any) => existed.id);

            // Check quantity and serialization in create mode
            if (createModeOn) {
              if (+productItem.quantity < +parsedProduct.quantity) {
                isEnoughItemQuantity = false;
              }

              if (
                !productItem?.isSerializedInventory &&
                serialNumbers?.length > 0
              ) {
                isSerialNumbersAvailable = false;
              }
            }

            // Decide if we can create this product item
            const canCreate = createModeOn
              ? isEnoughItemQuantity &&
                allAvailable &&
                (serialNumbers.length === 0 ||
                  productItem?.isSerializedInventory)
              : allAvailable &&
                (serialNumbers.length === 0 ||
                  productItem?.isSerializedInventory);

            if (canCreate) {
              ableToCreateProductItemsIds.push({
                ...productItem,
                productQuantity: parsedProduct?.quantity,
                productTax: parsedProduct?.taxName,
                productPrice: parsedProduct?.price,
                productNote: parsedProduct?.note,
                productSerialNumbers: parsedProduct?.serialNumbers,
              });
            } else {
              unableToCreateProductItemsIds.push(productItem);
            }
          }
        }

        return {
          resultItems: {
            ableToCreateProductItemsIds,
            unableToCreateProductItemsIds,
          },
          validation: {
            isSerialNumbersAvailable,
            isSuitableSerialNumbers,
            isEnoughItemQuantity,
          },
        };
      };

      // PROCESS ALL ORDERS CONCURRENTLY
      const CONCURRENCY_LIMIT = 20;
      const limit = pLimit(CONCURRENCY_LIMIT);

      console.log(
        `[ORDER IMPORT] Processing ${normalizedFields.length} orders with concurrency limit: ${CONCURRENCY_LIMIT}`,
      );

      const processOrder = async (parsedOrder: any, index: number) => {
        const orderStart = Date.now();
        metrics.active++;
        metrics.maxActive = Math.max(metrics.maxActive, metrics.active);

        try {
          // Get customer info from pre-fetched data
          const customerField = parsedOrder?.customer;
          const customerObj = getCustomerInfo(customerField);

          // Get employee ID from pre-fetched data
          const employeeEmail = parsedOrder?.employee?.trim();
          const employeeId = employeeEmail
            ? employeesMap.get(employeeEmail)?.id
            : undefined;
          const isEmployeeValid = !!(
            !parsedOrder?.employee ||
            (parsedOrder?.employee && employeeId)
          );

          // Get business location ID from pre-fetched data
          const businessLocationKey = parsedOrder?.businessLocation?.trim();
          const businessLocationId = businessLocationKey
            ? businessLocationsMap.get(businessLocationKey)?.id
            : undefined;

          // Check images
          let isImagesIds = true;
          let imagesIds = [];

          if (parsedOrder?.images?.length) {
            const { isImagesIdsValid, imagesIdsArray } = await checkAllImages(
              parsedOrder?.images,
              tenantFilter.tenant,
              true,
            );
            isImagesIds = isImagesIdsValid;
            imagesIds = imagesIdsArray;
          }

          // Classify products using pre-fetched data
          const { isAllProductsExists } = classifyProducts(parsedOrder);

          // Validate taxes using pre-fetched data
          const { isAllTaxNamesExists } = validateTaxes(parsedOrder?.products);

          const isCustomerFieldValid =
            !customerField || customerObj?.customerId;
          const isSerialNumbersValidationNeeded =
            isEmployeeValid &&
            businessLocationId &&
            isCustomerFieldValid &&
            isImagesIds &&
            isAllProductsExists &&
            isAllTaxNamesExists;

          // Validate serial numbers
          const {
            resultItems: {
              ableToCreateProductItemsIds,
              unableToCreateProductItemsIds,
            },
            validation: {
              isSerialNumbersAvailable,
              isSuitableSerialNumbers,
              isEnoughItemQuantity,
            },
          } =
            isSerialNumbersValidationNeeded && businessLocationId
              ? await validateSerialNumbers(
                  parsedOrder?.products || [],
                  businessLocationId,
                )
              : {
                  resultItems: {
                    ableToCreateProductItemsIds: [],
                    unableToCreateProductItemsIds: [],
                  },
                  validation: {
                    isSerialNumbersAvailable: true,
                    isSuitableSerialNumbers: true,
                    isEnoughItemQuantity: true,
                  },
                };

          // Handle spoiled creations
          if (
            (customerField && customerObj.customerType === 'none') ||
            !isEmployeeValid ||
            !businessLocationId ||
            !isImagesIds ||
            !isAllProductsExists ||
            !isAllTaxNamesExists ||
            !isEnoughItemQuantity ||
            !isSuitableSerialNumbers ||
            !isSerialNumbersAvailable
          ) {
            await handleSpoiledCreations(
              parsedOrder,
              isEmployeeValid,
              businessLocationId,
              customerField,
              spoiledCreations,
              customerObj,
              isImagesIds,
              isAllProductsExists,
              isAllTaxNamesExists,
              isEnoughItemQuantity,
              isSuitableSerialNumbers,
              isSerialNumbersAvailable,
              isRedis,
              generatedRegex,
              tenantFilter,
            );
            metrics.spoiled++;
          }

          const inventoryArrays = {
            products: ableToCreateProductItemsIds,
            services: (parsedOrder.products || []).filter(
              (product: any) => product.inventoryType === 'service',
            ),
            classes: (parsedOrder.products || []).filter(
              (product: any) => product.inventoryType === 'class',
            ),
            memberships: (parsedOrder.products || []).filter(
              (product: any) => product.inventoryType === 'membership',
            ),
          };

          // Handle completed creations
          if (
            isSerialNumbersValidationNeeded &&
            !unableToCreateProductItemsIds.length &&
            isSuitableSerialNumbers &&
            isSerialNumbersAvailable &&
            isEnoughItemQuantity
          ) {
            await handleCompletedCreations(
              parsedOrder,
              tenantFilter,
              completedCreations,
              employeeId,
              businessLocationId,
              revenueAccountId,
              cashPaymentMethodId,
              customerObj,
              inventoryArrays,
              createModeOn,
              imagesIds,
              isRedis,
              generatedRegex,
              spoiledCreations,
              userId,
              taxesMap,
              servicesMap,
              classesMap,
              membershipsMap,
              defaultTaxId,
            );
            metrics.completed++;
          }

          // Check if processing should stop
          const result = isProcessingJob(generatedRegex, tenantFilter?.tenant);
          const value = await redis.get(result);
          if (value === 'false') return;
        } catch (innerError) {
          handleLogger(
            'error',
            'handleNormalisedOrdersFields',
            `Error in order ${index + 1}: ${JSON.stringify(
              parsedOrder?.localId || 'unknown',
            )}`,
          );
        } finally {
          metrics.active--;
          metrics.processed++;
          const orderTime = Date.now() - orderStart;
          metrics.orderTimes.push(orderTime);

          // Log progress every 10 orders
          if (
            metrics.processed % 10 === 0 ||
            metrics.processed === metrics.totalOrders
          ) {
            logProgress();
          }
        }
      };

      // Process all orders with p-limit
      await Promise.allSettled(
        normalizedFields.map((parsedOrder, index) =>
          limit(() => processOrder(parsedOrder, index)),
        ),
      );

      console.log(`[ORDER IMPORT COMPLETE] Final metrics:`);
      logProgress();

      if (metrics.orderTimes.length > 0) {
        const avgTime = (
          metrics.orderTimes.reduce((a, b) => a + b, 0) /
          metrics.orderTimes.length /
          1000
        ).toFixed(2);
        const minTime = (Math.min(...metrics.orderTimes) / 1000).toFixed(2);
        const maxTime = (Math.max(...metrics.orderTimes) / 1000).toFixed(2);
        console.log(
          `[ORDER IMPORT TIMING] Avg: ${avgTime}s | Min: ${minTime}s | Max: ${maxTime}s per order`,
        );
      }
    }

    const options = {
      maxImagesCount,
      maxProductsCount,
      maxSerialNumbersCount,
      createModeOn,
      userId,
    };

    await processAndUpdateImports(
      processOrdersImport,
      currentSessionId,
      spoiledCreations,
      completedCreations,
      null,
      options,
      config,
      tenantFilter,
    );
  } catch (e) {
    handleLogger('error', 'handleNormalisedOrdersFields', undefined, e);
  } finally {
    const seconds = ((Date.now() - start) / 1000).toFixed(2);
    const ordersAmount =
      normalizedFields.length > 0 ? normalizedFields.length : 1;

    console.log(`handleNormalisedOrdersFields took ${seconds}s`);
    console.log(`${Number(seconds) / ordersAmount}s per order`);
  }
};
