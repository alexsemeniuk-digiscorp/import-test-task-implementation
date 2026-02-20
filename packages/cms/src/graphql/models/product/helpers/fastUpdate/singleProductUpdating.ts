import {
  findCashPaymentMethodId,
  findCostOfGoodsAccountId,
} from '../../../../helpers/importingHelpers/utils';
import {
  PRODUCTS_IMPORT_IDENTIFIER,
  updatingImportingData,
} from './../../../../../api/redis/helpers/variables/importingVariables';
import redis from './../../../../../api/redis/redis';
import {
  batchProcessCustomAttributes,
  getProductAttributeOptionIds,
} from './../../helpers/importing/utils/helpers/customAttributesBatchProcessing';
import {
  createOrUpdateEntity,
  handleUpdatingInventoryItems,
} from './../fastUpdate/helpers';
import { filterEmpty } from './../importing/productImport';

export const singleProductUpdating = async (
  parsedProduct,
  { productId, tenantFilter, userId, regexedSessionId },
) => {
  const fetchedProduct = await strapi.entityService.findOne(
    'api::product.product',
    productId,
    {
      filters: { tenant: { id: { $eq: parsedProduct?.tenantId } } },
      fields: ['id'],
      populate: {
        weight: {
          fields: ['id'],
        },
        dimension: {
          fields: ['id'],
        },
      },
    },
  );

  const [costOfGoodsAccountId, cashPaymentMethodId, customAttributeOptionsMap] =
    await Promise.all([
      findCostOfGoodsAccountId(),
      findCashPaymentMethodId(tenantFilter?.tenant),
      batchProcessCustomAttributes([parsedProduct], tenantFilter?.tenant),
    ]);

  const productAttributeOptionIds = getProductAttributeOptionIds(
    parsedProduct?.customFields,
    customAttributeOptionsMap,
  );

  if (productId && fetchedProduct?.id) {
    const updatedProduct = await strapi.entityService.update(
      'api::product.product',
      productId,
      {
        data: {
          barcode: parsedProduct?.barcodeId || undefined,
          defaultPrice: +parsedProduct?.defaultPrice || undefined,
          brand: parsedProduct?.brandId ?? undefined,
          model: parsedProduct?.model,
          productType: parsedProduct?.productTypeId ?? undefined,
          name: parsedProduct?.name ?? undefined,
          UPC: parsedProduct?.upc ?? undefined,
          SKU: parsedProduct?.sku ?? undefined,
          MPN: parsedProduct?.mpn ?? undefined,
          EAN: parsedProduct?.ean ?? undefined,
          ISBN: parsedProduct?.isbn ?? undefined,
          partsWarranty: parsedProduct?.partsWarranty
            ? new Date(parsedProduct.partsWarranty)
            : undefined,
          laborWarranty: parsedProduct?.laborWarranty
            ? new Date(parsedProduct.laborWarranty)
            : undefined,
          description: parsedProduct?.description ?? undefined,
          ecommerceDescription:
            parsedProduct?.ecommerceDescription ?? undefined,
          shopifyTags: parsedProduct?.shopifyTags ?? undefined,
          files: filterEmpty(parsedProduct?.imagesIds),
          isNegativeCount: Boolean(parsedProduct?.isNegativeCount),
          active: Boolean(parsedProduct?.active),
          productAttributeOptions:
            productAttributeOptionIds.length > 0
              ? productAttributeOptionIds
              : undefined,
        },
      },
    );

    if (
      parsedProduct?.dimensionLength &&
      parsedProduct?.dimensionWidth &&
      parsedProduct?.dimensionHeight &&
      parsedProduct?.dimensionUnit
    ) {
      const dimensionData = {
        length: parsedProduct.dimensionLength,
        width: parsedProduct.dimensionWidth,
        height: parsedProduct.dimensionHeight,
        unit: parsedProduct.dimensionUnit,
        product: fetchedProduct?.dimension?.id ? undefined : productId,
      };

      await createOrUpdateEntity(
        'api::dimension.dimension',
        fetchedProduct?.dimension?.id,
        dimensionData,
      );
    }

    if (parsedProduct?.weight && parsedProduct?.weightUnit) {
      const weightData = {
        value: parsedProduct.weight,
        unit: parsedProduct.weightUnit,
        product: fetchedProduct?.weight?.id ? undefined : productId,
      };

      await createOrUpdateEntity(
        'api::weight.weight',
        fetchedProduct?.weight?.id,
        weightData,
      );
    }

    if (updatedProduct?.uuid) {
      await handleUpdatingInventoryItems({
        productItems: parsedProduct?.productItems,
        productId,
        defaultPrice: parsedProduct?.defaultPrice,
        tenantId: tenantFilter.tenant,
        updatedProductUuid: updatedProduct.uuid,
        userId,
        costOfGoodsAccountId,
        cashPaymentMethodId,
      });
    }

    const deleteKey = updatingImportingData(
      regexedSessionId,
      tenantFilter?.tenant,
      PRODUCTS_IMPORT_IDENTIFIER,
    );
    if (deleteKey) {
      try {
        await redis.lrem(deleteKey, 1, JSON.stringify(parsedProduct));
      } catch (e) {
        console.log(e);
      }
    }
  }
};
