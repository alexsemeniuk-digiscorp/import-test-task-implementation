import { handleError } from './../../../../../../helpers/errors';

export const handleProductOrderItems = async (
  productItems,
  { businessLocationId, orderId, tenantId },
  taxesMap?: Map<string, any>,
  defaultTaxId?: number,
) => {
  if (productItems?.length === 0) return;

  try {
    // Process all product items in parallel instead of sequentially
    await Promise.all(
      productItems.map(async (productItem) => {
        // Use pre-fetched tax data instead of querying
        let taxId: number | undefined;

        if (productItem?.productTax && taxesMap) {
          const tax = taxesMap.get(productItem.productTax);
          taxId = tax?.id;
        }

        // Fallback to default tax if specific tax not found
        if (!taxId && defaultTaxId) {
          taxId = defaultTaxId;
        }

        if (!taxId) {
          console.error('Tax not found for product item:', productItem?.uuid);
          return;
        }

        const serializes = productItem?.serializes;

        //serial numbers from input
        const serialNumbers = productItem?.productSerialNumbers ?? [];

        //find the ones that are of product item but not included in input
        const unmatchedSerializeIds = (serializes || [])
          .filter((serialize) => !serialNumbers?.includes(serialize.name))
          .map((serialize) => serialize.id);

        // find the ones from serialNumbers that are completely new to the platform
        const serialNumbersNotInSerializesAndNotInExistedSerialNumbers = (
          serialNumbers || []
        ).filter(
          (serialNumber) =>
            !serializes?.some((serialize) => serialize.name === serialNumber) &&
            !productItem?.existedSerialNumbers?.includes(serialNumber),
        );

        //create new and return ids
        const newSerialNumbersIds = await Promise.all(
          serialNumbersNotInSerializesAndNotInExistedSerialNumbers.map(
            async (serialNumber) => {
              const newSerialNumber = await strapi.entityService.create(
                'api::inventory-serialize.inventory-serialize',
                {
                  data: { name: serialNumber, tenant: tenantId },
                },
              );
              return newSerialNumber?.id;
            },
          ),
        );

        // Check if we need to update the product item's serializes
        // Only update if serial numbers have changed
        const currentSerializeIds = (serializes || [])
          .map((s) => s.id)
          .sort()
          .join(',');
        const newSerializeIds = unmatchedSerializeIds.sort().join(',');
        const needsSerializeUpdate =
          currentSerializeIds !== newSerializeIds && serialNumbers.length > 0;

        // Build operations to run in parallel
        const operations: Promise<any>[] = [
          // Create the product order item
          strapi.entityService.create(
            'api::product-order-item.product-order-item',
            {
              data: {
                itemId: productItem?.uuid,
                quantity: productItem?.productQuantity,
                price: productItem?.productPrice,
                product: productItem?.id,
                note: productItem?.productNote,
                order: orderId,
                tax: taxId, // Use the valid tax ID
                businessLocation: businessLocationId,
                purchaseType: 'buy',
                serializes: [
                  //the old ones that are available to be joined
                  ...productItem.existedSerialNumbers,
                  // completely new ids
                  ...newSerialNumbersIds,
                ],
                _skipBeforeCreateOrderItem: true,
                _skipCreateFollowingActivityInExistingOrder: true,
                _skipBeforeUpdateOrder: true,
                _skipAfterUpdateOrder: true,
                _skipMeilisearchSync: true,
                _isImportedItem: true,
              },
            } as any,
          ),
        ];

        // Only update product item if serializes have changed
        if (needsSerializeUpdate) {
          operations.push(
            strapi.entityService.update(
              'api::product-inventory-item.product-inventory-item',
              productItem?.id,
              {
                data: {
                  serializes: unmatchedSerializeIds,
                  _skipBeforeUpdateProductInventoryItem: true,
                  _skipMeilisearchSync: true,
                },
              },
            ),
          );
        }

        // Run all operations in parallel
        await Promise.all(operations);
      }),
    );
  } catch (e) {
    handleError('handleProductOrderItems', undefined, e);
  }
};
