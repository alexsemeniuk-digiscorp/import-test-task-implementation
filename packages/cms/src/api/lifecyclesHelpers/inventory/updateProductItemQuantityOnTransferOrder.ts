import { handleError, handleLogger } from '../../../graphql/helpers/errors';
import { LifecycleHook } from '../types';

export const updateProductItemQuantityOnTransferOrder: LifecycleHook = async (
  event,
) => {
  handleLogger(
    'info',
    'updateProductItemQuantityOnTransferOrder',
    `Params: ${JSON.stringify(event.params)}`,
  );

  const { product, transferQuantity, serializes } = event.params.data;

  /* general entities */
  const transferOrderItem = await strapi.entityService.findOne(
    'api::transfer-order-item.transfer-order-item',
    event.result.id,
    {
      fields: ['id', 'quantityFrom', 'quantityTo', 'transferQuantity'],
      populate: {
        transferOrder: {
          fields: ['id', 'uuid'],
          populate: {
            locationFrom: {
              fields: ['id'],
            },
            locationTo: {
              fields: ['id'],
            },
            sublocationFrom: {
              fields: ['id'],
            },
            sublocationTo: {
              fields: ['id'],
            },
            tenant: {
              fields: ['id'],
            },
          },
        },
      },
    },
  );

  const currentOrder = transferOrderItem?.transferOrder;

  const businessLocationFrom = currentOrder?.locationFrom?.id;
  const businessLocationTo = currentOrder?.locationTo?.id;
  const sublocationFrom = currentOrder?.sublocationFrom?.id || null;
  const sublocationTo = currentOrder?.sublocationTo?.id || null;

  const ctx = strapi.requestContext.get();

  // 1. Case From location to location
  // 1.1 From business location to business location
  // 1.2 From business location to subLocation
  // 1.3 From subLocation to subLocation
  // 1.3.1 when subLocationFrom empty
  // 1.3.2. when subLocationTo empty

  //2. Case Inside one location
  //2.1 From business location to subLocation
  //2.2 Between to subLocations
  // 2.2.1 when subLocationFrom empty
  // 2.2.2. when subLocationTo empty
  // 2.3 From subLocation to business location

  //3. TransferOrder come form Selling Module
  //3.1. Without QntyTo and QntyFrom - additional checking

  const productInventoryItemFrom = await strapi.entityService.findMany(
    'api::product-inventory-item.product-inventory-item',
    {
      filters: {
        product: {
          id: {
            $eq: product,
          },
        },
        businessLocation: {
          id: {
            $eq: businessLocationFrom,
          },
        },
      },
      fields: ['id', 'quantity'],
      populate: {
        businessLocation: {
          fields: ['id'],
        },
        product: {
          fields: ['id'],
        },
        serializes: {
          fields: ['id'],
        },
        tenant: {
          fields: ['id'],
        },
      },
    },
  );

  const productInventoryItemTo = await strapi.entityService.findMany(
    'api::product-inventory-item.product-inventory-item',
    {
      filters: {
        product: {
          id: {
            $eq: product,
          },
        },
        businessLocation: {
          id: {
            $eq: businessLocationTo,
          },
        },
      },
      fields: ['id', 'quantity'],
      populate: {
        businessLocation: {
          fields: ['id'],
        },
        product: {
          fields: ['id'],
        },
        serializes: {
          fields: ['id'],
        },
        tenant: {
          fields: ['id'],
        },
      },
    },
  );

  if (businessLocationFrom !== businessLocationTo) {
    //1.1

    const transferOrderItemService = strapi.service(
      'api::transfer-order-item.transfer-order-item',
    );

    await transferOrderItemService.updatingProductInventoryItems({
      transferOrderItem,
      productInventoryItemFrom: productInventoryItemFrom[0],
      productInventoryItemTo: productInventoryItemTo[0],
      currentOrder,
      ctx,
      serializes,
    });

    if (sublocationFrom) {
      //1.3, 1.3.2
      const sublocationItemFrom = await strapi.entityService.findMany(
        'api::sublocation-item.sublocation-item',
        {
          filters: {
            productInventoryItem: {
              id: {
                $eq: productInventoryItemFrom[0].id,
              },
            },
            sublocation: {
              id: {
                $eq: sublocationFrom,
              },
            },
          },
          fields: ['id', 'quantity'],
        },
      );

      if (!sublocationItemFrom.length)
        handleError(
          'Lifecycle :: updateProductItemQuantityOnTransferOrder',
          '',
          new Error(`Now found sublocationItemFrom from product ${product}`),
        );

      if (
        Number(sublocationItemFrom[0]?.quantity) - Number(transferQuantity) >
        0
      ) {
        await strapi.entityService.update(
          'api::sublocation-item.sublocation-item',
          sublocationItemFrom[0].id,
          {
            data: {
              quantity:
                Number(sublocationItemFrom[0].quantity) -
                Number(transferQuantity),
            },
          },
        );
      } else {
        await strapi.entityService.delete(
          'api::sublocation-item.sublocation-item',
          sublocationItemFrom[0].id,
        );
      }
    }

    if (sublocationTo) {
      //1.2, 1.3, 1.3.1
      const sublocationItemTo = await strapi.entityService.findMany(
        'api::sublocation-item.sublocation-item',
        {
          filters: {
            productInventoryItem: {
              id: {
                $eq: productInventoryItemTo[0].id,
              },
            },
            sublocation: {
              id: {
                $eq: sublocationTo,
              },
            },
          },
          fields: ['id', 'quantity'],
        },
      );

      if (sublocationItemTo.length) {
        await strapi.entityService.update(
          'api::sublocation-item.sublocation-item',
          sublocationItemTo[0].id,
          {
            data: {
              quantity:
                Number(sublocationItemTo[0]?.quantity) +
                Number(transferQuantity),
            },
          },
        );
      } else {
        await strapi.entityService.create(
          'api::sublocation-item.sublocation-item',
          {
            data: {
              quantity: Number(transferQuantity),
              actualQty: 0,
              scannedQty: 0,
              productInventoryItem: productInventoryItemTo[0].id,
              sublocation: sublocationTo,
              tenant: productInventoryItemTo[0]?.tenant?.id,
            },
          },
        );
      }
    }
  }

  if (businessLocationFrom === businessLocationTo) {
    //2

    let checkTransferQnt: null | number = null;

    if (sublocationFrom) {
      //2.2 , 2.2.3, 2.3
      const sublocationItemFrom = await strapi.entityService.findMany(
        'api::sublocation-item.sublocation-item',
        {
          filters: {
            productInventoryItem: {
              id: {
                $eq: productInventoryItemFrom[0].id,
              },
            },
            sublocation: {
              id: {
                $eq: sublocationFrom,
              },
            },
          },
          fields: ['id', 'quantity'],
        },
      );

      if (!sublocationItemFrom.length)
        handleError(
          'Lifecycle :: updateProductItemQuantityOnTransferOrder',
          '',
          new Error(`Now found sublocationItemFrom from product ${product}`),
        );

      if (
        transferQuantity < sublocationItemFrom[0].quantity &&
        Number(sublocationItemFrom[0].quantity) - Number(transferQuantity) > 0
      ) {
        await strapi.entityService.update(
          'api::sublocation-item.sublocation-item',
          sublocationItemFrom[0].id,
          {
            data: {
              quantity:
                Number(sublocationItemFrom[0].quantity) -
                Number(transferQuantity),
            },
          },
        );
      } else {
        checkTransferQnt = sublocationItemFrom[0].quantity;

        await strapi.entityService.delete(
          'api::sublocation-item.sublocation-item',
          sublocationItemFrom[0].id,
        );
      }

      //3.1
      if (!transferOrderItem.quantityFrom) {
        const updatedTrasferOrderItem = await strapi.entityService.update(
          'api::transfer-order-item.transfer-order-item',
          transferOrderItem.id,
          {
            data: {
              quantityFrom: Number(sublocationItemFrom[0].quantity),
            },
          },
        );
        if (!updatedTrasferOrderItem)
          handleLogger(
            'error',
            'updateProductItemQuantityOnTransferOrder',
            `Transfer Order Item QntyFrom ${transferOrderItem.id} not updated`,
          );
      }
    } else {
      //3.1
      if (!transferOrderItem.quantityFrom) {
        const updatedTrasferOrderItem = await strapi.entityService.update(
          'api::transfer-order-item.transfer-order-item',
          transferOrderItem.id,
          {
            data: {
              quantityFrom: Number(productInventoryItemFrom[0].quantity),
            },
          },
        );
        if (!updatedTrasferOrderItem)
          handleLogger(
            'error',
            'updateProductItemQuantityOnTransferOrder',
            `Transfer Order Item QntyFrom ${transferOrderItem.id} not updated`,
          );
      }
    }

    if (sublocationTo) {
      // 2.1, 2.2., 2.2.1
      let sublocationItemTo = await strapi.entityService.findMany(
        'api::sublocation-item.sublocation-item',
        {
          filters: {
            productInventoryItem: {
              id: {
                $eq: productInventoryItemFrom[0].id,
              },
            },
            sublocation: {
              id: {
                $eq: sublocationTo,
              },
            },
          },
          fields: ['id', 'quantity'],
        },
      );

      if (sublocationItemTo.length) {
        await strapi.entityService.update(
          'api::sublocation-item.sublocation-item',
          sublocationItemTo[0].id,
          {
            data: {
              quantity:
                Number(sublocationItemTo[0].quantity) + checkTransferQnt
                  ? Number(checkTransferQnt)
                  : Number(transferQuantity),
            },
          },
        );
      } else {
        await strapi.entityService.create(
          'api::sublocation-item.sublocation-item',
          {
            data: {
              quantity: checkTransferQnt
                ? Number(checkTransferQnt)
                : Number(transferQuantity),
              actualQty: 0,
              scannedQty: 0,
              productInventoryItem: productInventoryItemFrom[0].id,
              sublocation: sublocationTo,
              tenant: productInventoryItemFrom[0].tenant.id,
            },
          },
        );
        sublocationItemTo = await strapi.entityService.findMany(
          'api::sublocation-item.sublocation-item',
          {
            filters: {
              productInventoryItem: {
                id: {
                  $eq: productInventoryItemFrom[0].id,
                },
              },
              sublocation: {
                id: {
                  $eq: sublocationTo,
                },
              },
            },
            fields: ['id', 'quantity'],
          },
        );
      }

      //3.1
      if (!transferOrderItem.quantityTo) {
        const updatedTrasferOrderItem = await strapi.entityService.update(
          'api::transfer-order-item.transfer-order-item',
          transferOrderItem.id,
          {
            data: { quantityTo: Number(sublocationItemTo[0]?.quantity) },
          },
        );
        if (!updatedTrasferOrderItem)
          handleLogger(
            'error',
            'Lifecycle :: updateProductItemQuantityOnTransferOrder',
            `Transfer Order Item QntyTo ${transferOrderItem.id} not updated`,
          );
      }
    } else {
      //3.1
      if (!transferOrderItem.quantityTo) {
        const updatedTrasferOrderItem = await strapi.entityService.update(
          'api::transfer-order-item.transfer-order-item',
          transferOrderItem.id,
          {
            data: { quantityTo: Number(productInventoryItemFrom[0].quantity) },
          },
        );
        if (!updatedTrasferOrderItem)
          handleLogger(
            'error',
            'Lifecycle :: updateProductItemQuantityOnTransferOrder',
            `Transfer Order Item QntyTo ${transferOrderItem.id} not updated`,
          );
      }
    }
  }
};
