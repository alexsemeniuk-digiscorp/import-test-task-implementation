import { discountPopulation } from '../../graphql/models/discount/helpers/variables';

export const orderCalculationsItemsPopulate = {
  products: {
    fields: ['id', 'quantity', 'price'],
    populate: {
      tax: {
        fields: [
          'id',
          'name',
          'fixedFee',
          'perUnitFee',
          'rate',
          'maxTaxAmount',
          'exemptionThreshold',
          'startAfterPrice',
          'endAfterPrice',
        ],
      },
      taxCollection: {
        fields: ['id', 'name'],
        populate: {
          taxes: {
            fields: [
              'id',
              'name',
              'fixedFee',
              'perUnitFee',
              'rate',
              'maxTaxAmount',
              'exemptionThreshold',
              'startAfterPrice',
              'endAfterPrice',
            ],
          },
        },
      },
      discounts: {
        fields: ['type', 'amount'],
        populate: {
          applicableProducts: {
            fields: ['id'],
          },
          excludedProducts: {
            fields: ['id'],
          },
        },
      },
    },
  },
  compositeProducts: {
    fields: ['id', 'quantity', 'price'],
    populate: {
      tax: {
        fields: [
          'id',
          'name',
          'fixedFee',
          'perUnitFee',
          'rate',
          'maxTaxAmount',
          'exemptionThreshold',
          'startAfterPrice',
          'endAfterPrice',
        ],
      },
      taxCollection: {
        fields: ['id', 'name'],
        populate: {
          taxes: {
            fields: [
              'id',
              'name',
              'fixedFee',
              'perUnitFee',
              'rate',
              'maxTaxAmount',
              'exemptionThreshold',
              'startAfterPrice',
              'endAfterPrice',
            ],
          },
        },
      },
      discounts: {
        fields: ['type', 'amount'],
        populate: {
          applicableCompositeProducts: {
            fields: ['id'],
          },
          excludedCompositeProducts: {
            fields: ['id'],
          },
        },
      },
    },
  },
  services: {
    fields: ['id', 'quantity', 'price'],
    populate: {
      tax: {
        fields: [
          'id',
          'name',
          'fixedFee',
          'perUnitFee',
          'rate',
          'maxTaxAmount',
          'exemptionThreshold',
          'startAfterPrice',
          'endAfterPrice',
        ],
      },
      taxCollection: {
        fields: ['id', 'name'],
        populate: {
          taxes: {
            fields: [
              'id',
              'name',
              'fixedFee',
              'perUnitFee',
              'rate',
              'maxTaxAmount',
              'exemptionThreshold',
              'startAfterPrice',
              'endAfterPrice',
            ],
          },
        },
      },
      discounts: {
        fields: ['type', 'amount'],
        populate: {
          applicableServices: {
            fields: ['id'],
          },
          excludedServices: {
            fields: ['id'],
          },
        },
      },
    },
  },
  memberships: {
    fields: ['id', 'quantity', 'price'],
    populate: {
      tax: {
        fields: [
          'id',
          'name',
          'fixedFee',
          'perUnitFee',
          'rate',
          'maxTaxAmount',
          'exemptionThreshold',
          'startAfterPrice',
          'endAfterPrice',
        ],
      },
      taxCollection: {
        fields: ['id', 'name'],
        populate: {
          taxes: {
            fields: [
              'id',
              'name',
              'fixedFee',
              'perUnitFee',
              'rate',
              'maxTaxAmount',
              'exemptionThreshold',
              'startAfterPrice',
              'endAfterPrice',
            ],
          },
        },
      },
      discounts: {
        fields: ['type', 'amount'],
        populate: {
          applicableMemberships: {
            fields: ['id'],
          },
          excludedMemberships: {
            fields: ['id'],
          },
        },
      },
    },
  },
  classes: {
    fields: ['id', 'quantity', 'price'],
    populate: {
      tax: {
        fields: [
          'id',
          'name',
          'fixedFee',
          'perUnitFee',
          'rate',
          'maxTaxAmount',
          'exemptionThreshold',
          'startAfterPrice',
          'endAfterPrice',
        ],
      },
      taxCollection: {
        fields: ['id', 'name'],
        populate: {
          taxes: {
            fields: [
              'id',
              'name',
              'fixedFee',
              'perUnitFee',
              'rate',
              'maxTaxAmount',
              'exemptionThreshold',
              'startAfterPrice',
              'endAfterPrice',
            ],
          },
        },
      },
      discounts: {
        fields: ['type', 'amount'],
        populate: {
          applicableClasses: {
            fields: ['id'],
          },
          excludedClasses: {
            fields: ['id'],
          },
        },
      },
    },
  },
};

export const afterCreateOrderItemOrderFields = [
  'id',
  'orderVersion',
  'type',
  'status',
  'subTotal',
  'total',
  'customCreationDate',
  'createdAt',
  'dueDate',
  'memo',
  'orderId',
];

export const afterCreateOrderItemOrderPopulation = {
  discounts: discountPopulation as any,
  businessLocation: {
    fields: ['id'],
  },
  contact: {
    fields: ['id'],
  },
  company: {
    fields: ['id'],
  },
  sales: {
    fields: ['id'],
  },
  tenant: {
    fields: ['id'],
  },
  products: {
    fields: ['id'],
    populate: {
      product: {
        fields: ['id'],
      },
    },
  },
  compositeProducts: {
    fields: ['id', 'price', 'quantity'],
    populate: {
      productOrderItems: {
        fields: ['id', 'quantity'],
        populate: {
          product: {
            fields: ['id'],
          },
        },
      },
      discounts: discountPopulation as any,
    },
  },
};

export const afterCreateOrderItemPopulation = {
  order: {
    fields: [
      'id',
      'type',
      'status',
      'subTotal',
      'total',
      'points',
      'isWarranty',
    ],
    populate: {
      ...orderCalculationsItemsPopulate,
    },
  },
};

export const afterUpdateOrderItemPopulation = {
  order: {
    fields: [
      'id',
      'type',
      'status',
      'subTotal',
      'total',
      'points',
      'isWarranty',
    ],
    populate: {
      ...orderCalculationsItemsPopulate,
    },
  },
};

export const beforeUpdateOrderItemPopulation = {
  order: {
    fields: [
      'id',
      'orderVersion',
      'type',
      'status',
      'subTotal',
      'total',
      'customCreationDate',
      'createdAt',
      'dueDate',
      'memo',
      'orderId',
    ],
    populate: {
      businessLocation: {
        fields: ['id'],
      },
      contact: {
        fields: ['id'],
      },
      company: {
        fields: ['id'],
      },
      sales: {
        fields: ['id'],
      },
      tenant: {
        fields: ['id'],
      },
      return: {
        fields: ['id'],
        populate: {
          businessLocation: {
            fields: ['id'],
          },
        },
      },
    },
  },
  tax: {
    fields: ['id'],
  },
  taxCollection: {
    fields: ['id'],
  },
  discounts: discountPopulation as any,
};

export const beforeUpdateProductOrderItemPopulation = {
  order: {
    fields: [
      'id',
      'orderVersion',
      'type',
      'status',
      'subTotal',
      'total',
      'customCreationDate',
      'createdAt',
      'dueDate',
      'memo',
    ],
    populate: {
      businessLocation: {
        fields: ['id'],
      },
      contact: {
        fields: ['id'],
      },
      company: {
        fields: ['id'],
      },
      sales: {
        fields: ['id'],
      },
      tenant: {
        fields: ['id'],
      },
      return: {
        fields: ['id'],
        populate: {
          businessLocation: {
            fields: ['id'],
          },
        },
      },
    },
  },
  tax: {
    fields: ['id'],
  },
  taxCollection: {
    fields: ['id'],
  },
  discounts: discountPopulation as any,
  product: {
    fields: ['id'],
    populate: {
      serializes: {
        fields: ['id'],
      },
      product: {
        fields: ['id', 'uuid'],
      },
    },
  },
  sublocation: {
    fields: ['id'],
  },
  serializes: {
    fields: ['id'],
  },
};

export const beforeUpdateCompositeProductOrderItemPopulation = {
  order: {
    fields: [
      'id',
      'orderVersion',
      'type',
      'status',
      'subTotal',
      'total',
      'customCreationDate',
      'createdAt',
      'dueDate',
      'memo',
    ],
    populate: {
      businessLocation: {
        fields: ['id'],
      },
      contact: {
        fields: ['id'],
      },
      company: {
        fields: ['id'],
      },
      sales: {
        fields: ['id'],
      },
      tenant: {
        fields: ['id'],
      },
      return: {
        fields: ['id'],
        populate: {
          businessLocation: {
            fields: ['id'],
          },
        },
      },
    },
  },
  tax: {
    fields: ['id'],
  },
  taxCollection: {
    fields: ['id'],
  },
  discounts: discountPopulation as any,
  productOrderItems: {
    fields: ['id', 'quantity'],
    populate: {
      product: {
        fields: ['id'],
      },
    },
  },
  compositeProduct: {
    fields: ['id'],
    populate: {
      businessLocation: {
        fields: ['id'],
      },
      compositeProduct: {
        fields: ['id'],
        populate: {
          compositeProductItems: {
            fields: ['id', 'quantity'],
            populate: {
              product: {
                fields: ['id'],
              },
            },
          },
        },
      },
    },
  },
};

export const beforeDeleteOrderItemPopulation = {
  order: {
    fields: [
      'id',
      'orderVersion',
      'type',
      'status',
      'subTotal',
      'total',
      'customCreationDate',
      'createdAt',
      'dueDate',
      'memo',
      'points',
      'isWarranty',
    ],
    populate: {
      businessLocation: {
        fields: ['id'],
      },
      contact: {
        fields: ['id'],
      },
      company: {
        fields: ['id'],
      },
      sales: {
        fields: ['id'],
      },
      tenant: {
        fields: ['id'],
      },
      return: {
        fields: ['id'],
        populate: {
          businessLocation: {
            fields: ['id'],
          },
        },
      },
      ...orderCalculationsItemsPopulate,
    },
  },
  tax: {
    fields: ['id'],
  },
  taxCollection: {
    fields: ['id'],
  },
};

export const beforeDeleteProductOrderItemPopulation = {
  order: {
    fields: [
      'id',
      'orderVersion',
      'type',
      'status',
      'subTotal',
      'total',
      'customCreationDate',
      'createdAt',
      'dueDate',
      'memo',
      'points',
      'isWarranty',
    ],
    populate: {
      businessLocation: {
        fields: ['id'],
      },
      contact: {
        fields: ['id'],
      },
      company: {
        fields: ['id'],
      },
      sales: {
        fields: ['id'],
      },
      tenant: {
        fields: ['id'],
      },
      return: {
        fields: ['id'],
        populate: {
          businessLocation: {
            fields: ['id'],
          },
        },
      },
      ...orderCalculationsItemsPopulate,
    },
  },
  tax: {
    fields: ['id'],
  },
  taxCollection: {
    fields: ['id'],
  },
  product: {
    fields: ['id'],
    populate: {
      serializes: {
        fields: ['id'],
      },
      product: {
        fields: ['id', 'uuid'],
      },
    },
  },
  sublocation: {
    fields: ['id'],
  },
  serializes: {
    fields: ['id'],
  },
};

export const beforeDeleteCompositeProductOrderItemPopulation = {
  order: {
    fields: [
      'id',
      'orderVersion',
      'type',
      'status',
      'subTotal',
      'total',
      'customCreationDate',
      'createdAt',
      'dueDate',
      'memo',
      'points',
      'isWarranty',
    ],
    populate: {
      businessLocation: {
        fields: ['id'],
      },
      contact: {
        fields: ['id'],
      },
      company: {
        fields: ['id'],
      },
      sales: {
        fields: ['id'],
      },
      tenant: {
        fields: ['id'],
      },
      return: {
        fields: ['id'],
        populate: {
          businessLocation: {
            fields: ['id'],
          },
        },
      },
      ...orderCalculationsItemsPopulate,
    },
  },
  tax: {
    fields: ['id'],
  },
  taxCollection: {
    fields: ['id'],
  },
  productOrderItems: {
    fields: ['id'],
  },
  compositeProduct: {
    fields: ['id'],
    populate: {
      businessLocation: {
        fields: ['id'],
      },
      compositeProduct: {
        fields: ['id'],
        populate: {
          compositeProductItems: {
            fields: ['id', 'quantity'],
            populate: {
              product: {
                fields: ['id'],
              },
            },
          },
        },
      },
    },
  },
};

export const beforeUpdateOrderFields = [
  'id',
  'type',
  'status',
  'points',
  'subTotal',
  'total',
  'shipment',
  'orderId',
  'customCreationDate',
  'createdAt',
  'dueDate',
  'memo',
];

export const beforeUpdateOrderPopulation = {
  contact: {
    fields: ['id', 'points'],
  },
  company: {
    fields: ['id', 'points'],
  },
  sales: {
    fields: ['id'],
  },
  products: {
    fields: [
      'id',
      'itemId',
      'rentEnd',
      'isCompositeProductItem',
      'quantity',
      'price',
    ],
    populate: {
      product: {
        fields: ['id', 'quantity', 'isNegativeCount'],
        populate: {
          product: {
            fields: ['id', 'name'],
          },
          sublocationItems: {
            fields: ['id'],
          },
        },
      },
      serializes: {
        fields: ['id'],
      },
      sublocation: {
        fields: ['id'],
      },
      discounts: discountPopulation as any,
    },
  },
  compositeProducts: {
    fields: ['id', 'itemId', 'price', 'quantity'],
    populate: {
      productOrderItems: {
        fields: ['id', 'quantity'],
        populate: {
          product: {
            fields: ['id'],
          },
        },
      },
      discounts: discountPopulation as any,
    },
  },
  services: {
    fields: ['id', 'itemId', 'price', 'quantity', 'dueDate', 'note'],
  },
  memberships: {
    fields: ['id', 'itemId', 'price', 'quantity'],
  },
  classes: {
    fields: ['id', 'itemId', 'price', 'quantity'],
  },
  dealTransactions: {
    fields: ['id', 'paid'],
  },
  businessLocation: {
    fields: ['id'],
  },
  tenant: {
    fields: ['id'],
  },
};

export const beforeDeleteOrderPopulation = {
  contact: {
    fields: ['id', 'points'],
  },
  company: {
    fields: ['id', 'points'],
  },
  products: {
    fields: ['id'],
  },
  compositeProducts: {
    fields: ['id'],
  },
  services: {
    fields: ['id'],
  },
  memberships: {
    fields: ['id'],
  },
  classes: {
    fields: ['id'],
  },
};

export const beforeCreateProductInventoryItemEventSalesItemReportPopulation = {
  productOrderItem: {
    fields: ['price', 'quantity'],
    populate: {
      order: {
        fields: ['subTotal'],
      },
      discounts: discountPopulation as any,
    },
  },
  compositeProductOrderItem: {
    fields: ['price', 'quantity'],
    populate: {
      order: {
        fields: ['subTotal'],
      },
      discounts: discountPopulation as any,
    },
  },
  serviceOrderItem: {
    fields: ['price', 'quantity'],
    populate: {
      order: {
        fields: ['subTotal'],
      },
      discounts: discountPopulation as any,
    },
  },
  membershipOrderItem: {
    fields: ['price', 'quantity'],
    populate: {
      order: {
        fields: ['subTotal'],
      },
      discounts: discountPopulation as any,
    },
  },
  classOrderItem: {
    fields: ['price', 'quantity'],
    populate: {
      order: {
        fields: ['subTotal'],
      },
      discounts: discountPopulation as any,
    },
  },
};
