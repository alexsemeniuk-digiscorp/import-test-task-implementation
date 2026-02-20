export const salesByItemCategoryReportFields = [
  'subTotal',
  'customCreationDate',
  'createdAt',
];

export const salesByItemCategoryReportPopulation = {
  products: {
    fields: ['quantity', 'price', 'isCompositeProductItem'],
    populate: {
      product: {
        populate: {
          product: {
            fields: ['name', 'uuid'],
            populate: {
              productType: {
                fields: ['name'],
              },
              files: {
                fields: ['url'],
              },
            },
          },
        },
      },
    },
  },
  compositeProducts: {
    fields: ['quantity', 'price'],
    populate: {
      compositeProduct: {
        populate: {
          compositeProduct: {
            fields: ['name', 'uuid'],
            populate: {
              files: {
                fields: ['url'],
              },
            },
          },
        },
      },
    },
  },
  services: {
    fields: ['quantity', 'price'],
    populate: {
      service: {
        populate: {
          serviceLocationInfo: {
            populate: {
              service: {
                fields: ['name', 'uuid'],
                populate: {
                  files: {
                    fields: ['url'],
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  memberships: {
    fields: ['quantity', 'price'],
    populate: {
      membership: {
        fields: ['name', 'uuid'],
      },
    },
  },
  classes: {
    fields: ['quantity', 'price'],
    populate: {
      class: {
        populate: {
          classLocationInfo: {
            populate: {
              class: {
                fields: ['name', 'uuid'],
                populate: {
                  files: {
                    fields: ['url'],
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
