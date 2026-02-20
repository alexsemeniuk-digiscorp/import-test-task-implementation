export const salesItemReportExportDataProductFields = [
  'createdAt',
  'type',
  'price',
  'grossMargin',
  'soldDate',
  'dueDate',
  'age',
  'itemCost',
  'memoTaken',
  'memoSold',
];

export const salesItemReportExportDataPopulation = {
  order: {
    fields: [
      'id',
      'orderId',
      'status',
      'total',
      'tip',
      'discount',
      'points',
      'shippedDate',
      'ecommerceType',
    ],
    populate: {
      dealTransactions: {
        fields: ['status', 'summary', 'paid'],
        populate: {
          chartAccount: {
            fields: ['name'],
          },
        },
      },
    },
  },
  productOrderItem: {
    fields: ['note', 'price', 'quantity'],
    populate: {
      taxCollection: {
        populate: {
          taxes: {
            fields: [
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
      tax: {
        fields: [
          'fixedFee',
          'perUnitFee',
          'rate',
          'maxTaxAmount',
          'exemptionThreshold',
          'startAfterPrice',
          'endAfterPrice',
        ],
      },
      order: {
        fields: ['total', 'tip', 'tax', 'subTotal', 'points'],
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
          applicableCompositeProducts: {
            fields: ['id'],
          },
          excludedCompositeProducts: {
            fields: ['id'],
          },
          applicableServices: {
            fields: ['id'],
          },
          excludedServices: {
            fields: ['id'],
          },
          applicableMemberships: {
            fields: ['id'],
          },
          excludedMemberships: {
            fields: ['id'],
          },
          applicableClasses: {
            fields: ['id'],
          },
          excludedClasses: {
            fields: ['id'],
          },
        },
      },
      product: {
        populate: {
          product: {
            fields: ['uuid', 'name', 'model', 'SKU', 'defaultPrice'],
            populate: {
              weight: {
                fields: ['value', 'unit'],
              },
              productType: {
                fields: ['name'],
                populate: {
                  itemCategory: {
                    fields: ['name'],
                  },
                },
              },
              productInventoryItems: {
                fields: ['quantity'],
                populate: {
                  businessLocation: {
                    fields: ['id'],
                  },
                  productOrderItems: {
                    fields: ['quantity'],
                    populate: {
                      order: {
                        fields: ['type', 'status'],
                      },
                    },
                  },
                },
              },
              files: {
                fields: [
                  'previewUrl',
                  'alternativeText',
                  'url',
                  'size',
                  'name',
                  'mime',
                ],
              },
            },
          },
          vendor: {
            fields: ['name', 'uuid'],
            populate: {
              files: {
                avatar: [
                  'previewUrl',
                  'alternativeText',
                  'url',
                  'size',
                  'name',
                  'mime',
                ],
              },
            },
          },
        },
      },
    },
  },
  compositeProductOrderItem: {
    fields: ['note', 'price', 'quantity'],
    populate: {
      taxCollection: {
        populate: {
          taxes: {
            fields: [
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
      tax: {
        fields: [
          'fixedFee',
          'perUnitFee',
          'rate',
          'maxTaxAmount',
          'exemptionThreshold',
          'startAfterPrice',
          'endAfterPrice',
        ],
      },
      order: {
        fields: ['total', 'tip', 'tax', 'subTotal', 'points'],
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
          applicableCompositeProducts: {
            fields: ['id'],
          },
          excludedCompositeProducts: {
            fields: ['id'],
          },
          applicableServices: {
            fields: ['id'],
          },
          excludedServices: {
            fields: ['id'],
          },
          applicableMemberships: {
            fields: ['id'],
          },
          excludedMemberships: {
            fields: ['id'],
          },
          applicableClasses: {
            fields: ['id'],
          },
          excludedClasses: {
            fields: ['id'],
          },
        },
      },
      compositeProduct: {
        populate: {
          compositeProduct: {
            fields: ['uuid', 'name', 'defaultPrice'],
            populate: {
              products: {
                populate: {
                  files: {
                    fields: [
                      'previewUrl',
                      'alternativeText',
                      'url',
                      'size',
                      'name',
                      'mime',
                    ],
                  },
                },
              },
              files: {
                fields: [
                  'previewUrl',
                  'alternativeText',
                  'url',
                  'size',
                  'name',
                  'mime',
                ],
              },
            },
          },
        },
      },
    },
  },
  serviceOrderItem: {
    fields: ['note', 'price', 'quantity'],
    populate: {
      taxCollection: {
        populate: {
          taxes: {
            fields: [
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
      tax: {
        fields: [
          'fixedFee',
          'perUnitFee',
          'rate',
          'maxTaxAmount',
          'exemptionThreshold',
          'startAfterPrice',
          'endAfterPrice',
        ],
      },
      order: {
        fields: ['total', 'tip', 'tax', 'subTotal', 'points'],
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
          applicableCompositeProducts: {
            fields: ['id'],
          },
          excludedCompositeProducts: {
            fields: ['id'],
          },
          applicableServices: {
            fields: ['id'],
          },
          excludedServices: {
            fields: ['id'],
          },
          applicableMemberships: {
            fields: ['id'],
          },
          excludedMemberships: {
            fields: ['id'],
          },
          applicableClasses: {
            fields: ['id'],
          },
          excludedClasses: {
            fields: ['id'],
          },
        },
      },
      service: {
        populate: {
          serviceLocationInfo: {
            populate: {
              service: {
                fields: ['uuid', 'name', 'defaultPrice'],
                populate: {
                  files: {
                    fields: [
                      'previewUrl',
                      'alternativeText',
                      'url',
                      'size',
                      'name',
                      'mime',
                    ],
                  },
                  itemCategory: {
                    fields: ['name'],
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  membershipOrderItem: {
    fields: ['note', 'price', 'quantity'],
    populate: {
      taxCollection: {
        populate: {
          taxes: {
            fields: [
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
      tax: {
        fields: [
          'fixedFee',
          'perUnitFee',
          'rate',
          'maxTaxAmount',
          'exemptionThreshold',
          'startAfterPrice',
          'endAfterPrice',
        ],
      },
      order: {
        fields: ['total', 'tip', 'tax', 'subTotal', 'points'],
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
          applicableCompositeProducts: {
            fields: ['id'],
          },
          excludedCompositeProducts: {
            fields: ['id'],
          },
          applicableServices: {
            fields: ['id'],
          },
          excludedServices: {
            fields: ['id'],
          },
          applicableMemberships: {
            fields: ['id'],
          },
          excludedMemberships: {
            fields: ['id'],
          },
          applicableClasses: {
            fields: ['id'],
          },
          excludedClasses: {
            fields: ['id'],
          },
        },
      },
      membership: {
        fields: ['uuid', 'name', 'price'],
      },
    },
  },
  classOrderItem: {
    fields: ['note', 'price', 'quantity'],
    populate: {
      taxCollection: {
        populate: {
          taxes: {
            fields: [
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
      tax: {
        fields: [
          'fixedFee',
          'perUnitFee',
          'rate',
          'maxTaxAmount',
          'exemptionThreshold',
          'startAfterPrice',
          'endAfterPrice',
        ],
      },
      order: {
        fields: ['total', 'tip', 'tax', 'subTotal', 'points'],
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
          applicableCompositeProducts: {
            fields: ['id'],
          },
          excludedCompositeProducts: {
            fields: ['id'],
          },
          applicableServices: {
            fields: ['id'],
          },
          excludedServices: {
            fields: ['id'],
          },
          applicableMemberships: {
            fields: ['id'],
          },
          excludedMemberships: {
            fields: ['id'],
          },
          applicableClasses: {
            fields: ['id'],
          },
          excludedClasses: {
            fields: ['id'],
          },
        },
      },
      class: {
        populate: {
          classLocationInfo: {
            populate: {
              class: {
                fields: ['uuid', 'name', 'defaultPrice'],
                populate: {
                  files: {
                    fields: [
                      'previewUrl',
                      'alternativeText',
                      'url',
                      'size',
                      'name',
                      'mime',
                    ],
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  contact: {
    fields: ['fullName', 'uuid'],
    populate: {
      files: {
        avatar: [
          'previewUrl',
          'alternativeText',
          'url',
          'size',
          'name',
          'mime',
        ],
      },
    },
  },
  company: {
    fields: ['name', 'uuid'],
    populate: {
      files: {
        avatar: [
          'previewUrl',
          'alternativeText',
          'url',
          'size',
          'name',
          'mime',
        ],
      },
    },
  },
  sales: {
    fields: ['firstName', 'lastName'],
    populate: {
      files: {
        avatar: [
          'previewUrl',
          'alternativeText',
          'url',
          'size',
          'name',
          'mime',
        ],
      },
    },
  },
  businessLocation: {
    fields: ['name'],
  },
  sublocation: {
    fields: ['name'],
  },
  serialize: {
    fields: ['name'],
  },
  contactVendor: {
    fields: ['fullName', 'uuid'],
    populate: {
      files: {
        avatar: [
          'previewUrl',
          'alternativeText',
          'url',
          'size',
          'name',
          'mime',
        ],
      },
    },
  },
  companyVendor: {
    fields: ['name', 'uuid'],
    populate: {
      files: {
        avatar: [
          'previewUrl',
          'alternativeText',
          'url',
          'size',
          'name',
          'mime',
        ],
      },
    },
  },
  productInventoryItemEvent: {
    fields: ['memoNumber'],
    populate: {
      order: {
        fields: ['orderId', 'memoNumber'],
      },
      itemContactVendor: {
        fields: ['fullName', 'uuid'],
        populate: {
          files: {
            avatar: [
              'previewUrl',
              'alternativeText',
              'url',
              'size',
              'name',
              'mime',
            ],
          },
        },
      },
      itemVendor: {
        fields: ['name', 'uuid'],
        populate: {
          files: {
            avatar: [
              'previewUrl',
              'alternativeText',
              'url',
              'size',
              'name',
              'mime',
            ],
          },
        },
      },
    },
  },
};

export type SalesItemReportWithSales = {
  sales?: {
    firstName?: string;
    lastName?: string;
  };
} & Record<string, any>;
