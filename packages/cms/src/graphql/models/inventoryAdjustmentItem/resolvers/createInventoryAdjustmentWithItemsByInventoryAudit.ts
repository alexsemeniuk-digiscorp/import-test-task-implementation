import { GraphQLFieldResolver } from 'graphql';
import { compact } from 'lodash';
import { handleError, handleLogger } from '../../../../graphql/helpers/errors';
import { CreateInventoryAdjustmentWithItemsByInventoryAuditInput } from '../inventoryAdjustmentItem.types';

export const createInventoryAdjustmentWithItemsByInventoryAudit: GraphQLFieldResolver<
  null,
  null,
  { input: CreateInventoryAdjustmentWithItemsByInventoryAuditInput }
> = async (root, { input }, ctx, info) => {
  handleLogger(
    'info',
    'Resolver :: createInventoryAdjustmentWithItemsByInventoryAudit',
    `Input: ${JSON.stringify(input)}`,
  );
  //inventoryAuditId
  const { id, adjustmentId, auditId, name, employee } = input;

  const inventoryAudit = await strapi.entityService.findMany(
    'api::inventory-audit.inventory-audit',
    {
      filters: {
        id: id,
      },
      populate: {
        businessLocation: true,
        sublocation: true,
        tenant: true,
        employee: true,
        vendor: true,
      },
    },
  );
  if (!inventoryAudit)
    handleError(
      'Resolver :: createInventoryAdjustmentWithItemsByInventoryAudit',
      '',
      new Error('Inventory Audit not found'),
    );

  const adjustment = await strapi.entityService.create(
    'api::inventory-adjustment.inventory-adjustment',
    {
      data: {
        adjustmentId,
        adjustmentDate: new Date().toISOString(),
        reason: `Inventory Audit ${auditId}`,
        location: inventoryAudit[0]?.businessLocation.id,
        sublocation: inventoryAudit[0]?.sublocation?.id ?? null,
        tenant: inventoryAudit[0]?.tenant.id,
        description: name ? name : '',
        employee,
      },
    },
  );

  if (!adjustment)
    handleError(
      'Resolver :: createInventoryAdjustmentWithItemsByInventoryAudit',
      '',
      new Error('Inventory Adjustment has not been created'),
    );

  const inventoryAuditItems = await strapi.entityService.findMany(
    'api::inventory-audit-item.inventory-audit-item',
    {
      filters: {
        inventoryAudit: { id },
      },
      populate: {
        productInventoryItem: {
          populate: {
            product: true,
          },
        },
        tenant: true,
        sublocationItems: true,
      },
    },
  );

  //get all sublocatonItems from inventory audit
  const allSublocationItems = inventoryAuditItems.flatMap((inventoryItem) =>
    inventoryItem.sublocationItems.filter((subItem) => subItem),
  );

  //find difference between inventory qty and actual qty at sublocation item. Make the array for changes at sublocationItems
  const filteredSublocationItems = inventoryAuditItems.flatMap(
    (inventoryItem) =>
      inventoryItem.sublocationItems.filter(
        (subItem) => subItem.quantity !== subItem.actualQty,
      ),
  );

  //the scanned amount is different than inventory amount and actual qty then it adds it to adjustment report
  const filteredAdjustedInventoryAuditItems = inventoryAuditItems.filter(
    (item) => item.scannedQty !== item.inventoryQty,
  );

  // create events receive if adjustment qty < 0 and increment qty at sublocation if have to
  const filteredItemsForFoundEvents = inventoryAuditItems.filter(
    (item) => item.scannedQty > item.inventoryQty,
  );

  const inventoryAdjustmentItemsPromises = compact(
    filteredAdjustedInventoryAuditItems.map((item) => {
      if (item?.productInventoryItem?.product?.id) {
        //adjsuted qty the difference between real qty at location
        //available is the inventory qty

        const availableQty = Number(item?.inventoryQty);
        const adjustmentQty =
          Number(item?.inventoryQty) - Number(item?.actualQty);

        return strapi.entityService.create(
          'api::inventory-adjustment-item.inventory-adjustment-item',
          {
            data: {
              inventoryAdjustment: adjustment?.id,
              product: item?.productInventoryItem?.product?.id,
              adjustedQuantity: adjustmentQty,
              quantityAvailable: availableQty,
              quantityLeft: item?.actualQty,
              tenant: item?.tenant?.id,
            },
          },
        );
      }
    }),
  );

  const foundEventsPromises = compact(
    filteredItemsForFoundEvents.map((item) => {
      if (item?.productInventoryItem?.product?.id) {
        const adjustedQuantity =
          Number(item?.scannedQty) - Number(item.inventoryQty);

        return strapi.entityService.create(
          'api::product-inventory-item-event.product-inventory-item-event',
          {
            data: {
              eventType: 'receive',
              change: adjustedQuantity.toString(),
              remainingQuantity: adjustedQuantity,
              productInventoryItem: item?.productInventoryItem?.id,
              relationUuid: adjustment?.uuid,
              addedBy: inventoryAudit[0]?.employee.id,
              businessLocation: inventoryAudit[0]?.businessLocation.id,
              tenant: item?.tenant?.id,
              itemCost: 0,
              itemVendor: item?.productInventoryItem?.vendor?.id ?? undefined,
              memo: false,
              receiveDate: new Date().toISOString(),
            },
          },
        );
      }
    }),
  );

  const createdAdjustmentItems = await Promise.all(
    inventoryAdjustmentItemsPromises,
  );

  //if adjustmentQty < 0 create receive products
  await Promise.all(foundEventsPromises);

  //upd quantity at sublocationItems
  const allSublocationItemPromises = allSublocationItems.map(
    (sublocationItem) => {
      return strapi.entityService.update(
        'api::sublocation-item.sublocation-item',
        sublocationItem.id,
        {
          data: {
            actualQty: 0,
            scannedQty: 0,
          },
        },
      );
    },
  );
  const sublocationItemsPromises = filteredSublocationItems.map(
    (sublocationItem) => {
      return strapi.entityService.update(
        'api::sublocation-item.sublocation-item',
        sublocationItem.id,
        {
          data: {
            quantity: Number(sublocationItem.actualQty),
          },
        },
      );
    },
  );
  await Promise.all(allSublocationItemPromises);
  await Promise.all(sublocationItemsPromises);

  const updInvntrAdjustment = await strapi.entityService.update(
    'api::inventory-adjustment.inventory-adjustment',
    adjustment.id,
    {
      data: {
        ...adjustment,
        inventoryAdjustmentItems: createdAdjustmentItems.map((item) => item.id),
      },
    },
  );

  return { id: updInvntrAdjustment.id };
};
