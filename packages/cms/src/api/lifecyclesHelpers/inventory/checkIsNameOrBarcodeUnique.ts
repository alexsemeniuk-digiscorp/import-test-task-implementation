import { errors } from '@strapi/utils';
import { capitalize } from 'lodash';
import { LifecycleHook } from './../../../api/lifecyclesHelpers/types';
import { fetchInventoryEntities } from './utils/utils';

const { ApplicationError } = errors;

export type InventoryEntityUid =
  | 'api::product.product'
  | 'api::membership.membership'
  | 'api::class.class'
  | 'api::service.service';

export const checkIsNameOrBarcodeUnique: LifecycleHook = async ({
  params,
  model,
}) => {
  // Skip unique name barcode check during bulk imports for performance
  if (params?.data?._skipUniqueNameBarcodeCheck) {
    delete params?.data?._skipUniqueNameBarcodeCheck;
    return;
  }

  const entityId = Number(params?.where?.id);

  const entityBarcode = params?.data?.barcode;
  const entityName = params?.data?.name;
  let tenant = params?.data?.tenant;
  const uid = model?.uid;
  const isProduct =
    uid === 'api::product.product' ||
    uid === 'api::composite-product.composite-product';

  if (entityBarcode || entityName) {
    if (!tenant && uid && entityId) {
      const findTenant = await strapi.entityService.findOne(
        uid as InventoryEntityUid,
        entityId,
        {
          fields: ['id'],
          populate: {
            tenant: {
              fields: ['id'],
            },
          },
        },
      );
      tenant = findTenant?.tenant?.id;
    }

    if (tenant) {
      const tenantFilter = { tenant: { id: { $eq: tenant } } };

      const inventoryEntities = await fetchInventoryEntities(
        uid as InventoryEntityUid,
        tenantFilter,
        isProduct,
        entityName,
        isProduct && entityBarcode ? entityBarcode : undefined,
      );

      const filteredInventoryEntitiesByNames =
        inventoryEntities?.existingInventoryWithSameName?.filter(
          (product) => product?.id !== entityId,
        );

      const filteredInventoryEntitiesByBarcode =
        inventoryEntities?.existingInventoryWithSameBarcode?.filter(
          (product) => product?.id !== entityId,
        );

      if (
        filteredInventoryEntitiesByBarcode.length > 0 &&
        filteredInventoryEntitiesByNames.length > 0
      ) {
        const entityType = uid.split('::')[1].split('.')[0];
        throw new ApplicationError(
          `Custom: ${capitalize(
            entityType,
          )} with the same name and barcode already exists`,
        );
      }

      if (filteredInventoryEntitiesByNames.length > 0) {
        const entityType = uid.split('::')[1].split('.')[0];
        throw new ApplicationError(
          `Custom: ${capitalize(entityType)} with the same name already exists`,
        );
      }

      if (filteredInventoryEntitiesByBarcode.length > 0 && isProduct) {
        const entityType = uid.split('::')[1].split('.')[0];
        throw new ApplicationError(
          `Custom: ${capitalize(
            entityType,
          )} with the same barcode already exists`,
        );
      }
    } else {
      throw new Error('No related tenantId found');
    }
  }
};
