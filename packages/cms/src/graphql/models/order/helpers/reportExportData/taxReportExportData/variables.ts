export const taxReportExportDataOrderFields = [
  'orderId',
  'status',
  'subTotal',
  'total',
  'tax',
  'tip',
  'createdAt',
  'customCreationDate',
  'shippedDate',
  'dueDate',
  'type',
  'discount',
  'points',
  'isWarranty',
  'ecommerceType',
];

export const taxReportExportDataPopulation = {
  businessLocation: {
    fields: ['name'],
  },
  contact: {
    fields: ['fullName'],
  },
  company: {
    fields: ['name'],
  },
  discounts: {
    fields: [
      'name',
      'type',
      'usageLimit',
      'active',
      'amount',
      'uuid',
      'discountId',
    ],
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
  dealTransactions: {
    fields: ['status', 'summary', 'paid'],
    populate: {
      chartAccount: {
        fields: ['name'],
      },
    },
  },
  products: {
    fields: ['quantity', 'price'],
    populate: {
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
      tax: {
        fields: [
          'name',
          'rate',
          'fixedFee',
          'perUnitFee',
          'maxTaxAmount',
          'startAfterPrice',
          'endAfterPrice',
          'exemptionThreshold',
        ],
      },
      taxCollection: {
        fields: ['name'],
        populate: {
          taxes: {
            fields: [
              'name',
              'rate',
              'fixedFee',
              'perUnitFee',
              'maxTaxAmount',
              'startAfterPrice',
              'endAfterPrice',
              'exemptionThreshold',
            ],
          },
        },
      },
    },
  },
  compositeProducts: {
    fields: ['quantity', 'price'],
    populate: {
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
      tax: {
        fields: [
          'name',
          'rate',
          'fixedFee',
          'perUnitFee',
          'maxTaxAmount',
          'startAfterPrice',
          'endAfterPrice',
          'exemptionThreshold',
        ],
      },
      taxCollection: {
        fields: ['name'],
        populate: {
          taxes: {
            fields: [
              'name',
              'rate',
              'fixedFee',
              'perUnitFee',
              'maxTaxAmount',
              'startAfterPrice',
              'endAfterPrice',
              'exemptionThreshold',
            ],
          },
        },
      },
    },
  },
  services: {
    fields: ['quantity', 'price'],
    populate: {
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
      tax: {
        fields: [
          'name',
          'rate',
          'fixedFee',
          'perUnitFee',
          'maxTaxAmount',
          'startAfterPrice',
          'endAfterPrice',
          'exemptionThreshold',
        ],
      },
      taxCollection: {
        fields: ['name'],
        populate: {
          taxes: {
            fields: [
              'name',
              'rate',
              'fixedFee',
              'perUnitFee',
              'maxTaxAmount',
              'startAfterPrice',
              'endAfterPrice',
              'exemptionThreshold',
            ],
          },
        },
      },
    },
  },
  memberships: {
    fields: ['quantity', 'price'],
    populate: {
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
      tax: {
        fields: [
          'name',
          'rate',
          'fixedFee',
          'perUnitFee',
          'maxTaxAmount',
          'startAfterPrice',
          'endAfterPrice',
          'exemptionThreshold',
        ],
      },
      taxCollection: {
        fields: ['name'],
        populate: {
          taxes: {
            fields: [
              'name',
              'rate',
              'fixedFee',
              'perUnitFee',
              'maxTaxAmount',
              'startAfterPrice',
              'endAfterPrice',
              'exemptionThreshold',
            ],
          },
        },
      },
    },
  },
  classes: {
    fields: ['quantity', 'price'],
    populate: {
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
      tax: {
        fields: [
          'name',
          'rate',
          'fixedFee',
          'perUnitFee',
          'maxTaxAmount',
          'startAfterPrice',
          'endAfterPrice',
          'exemptionThreshold',
        ],
      },
      taxCollection: {
        fields: ['name'],
        populate: {
          taxes: {
            fields: [
              'name',
              'rate',
              'fixedFee',
              'perUnitFee',
              'maxTaxAmount',
              'startAfterPrice',
              'endAfterPrice',
              'exemptionThreshold',
            ],
          },
        },
      },
    },
  },
};
