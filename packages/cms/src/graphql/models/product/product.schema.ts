import {
  extendType,
  inputObjectType,
  intArg,
  list,
  mutationField,
  nonNull,
  objectType,
  queryField,
} from '@nexus/schema';

import { SoldRevenueInput } from '../order';
import { EnumWeightUnit } from './helpers/importing/productsDataValidators';

const ShopifyCollections = objectType({
  name: 'data',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('title');
  },
});

const CreatedByAIProduct = inputObjectType({
  name: 'CreatedByAIProduct',
  definition(t) {
    t.nonNull.string('name');
    t.string('SKU');
    t.float('cost');
    t.float('defaultPrice');
    t.string('note');
    t.string('barcode');
    t.int('quantity');
    t.string('brand');
    t.string('productType');
    t.string('metalType');
    t.string('metalGrade');
    t.string('MPN');
    t.int('discount');
    t.float('weight');
    t.field('unit', { type: EnumWeightUnit });
    t.string('itemCompanyVendor');
    t.string('itemContactVendor');
    t.string('vendorInvoice');
    t.string('receiveDate');
    t.boolean('memo');
    t.string('expiryDate');
    t.boolean('paid');
    t.string('sales');
    t.string('tagProductName');
    t.string('ecommerceName');
    t.string('shopifyTags');
    t.string('appraisalDescription');
    t.string('ecommerceDescription');
  },
});

const typeSchema = [
  extendType<'Product'>({
    type: 'Product',
    definition: (t) => {
      t.nullable.int('quantitySoldLastWeek', {
        args: {
          businessLocationId: intArg(),
        },
      });
      t.nullable.float('soldRevenue', {
        args: {
          input: nonNull(SoldRevenueInput),
        },
      });
      t.nullable.int('quantity', {
        args: {
          businessLocationId: intArg(),
          sublocationId: intArg(),
        },
      });
      t.nullable.float('grossMargin', {
        args: {
          businessLocationId: intArg(),
        },
      });
      t.nullable.int('numberLocationsPresented');
      t.nullable.int('totalQuantitySold', {
        args: {
          businessLocationId: intArg(),
        },
      });
      t.nullable.string('tax', {
        args: {
          businessLocationId: intArg(),
        },
      });
      t.nullable.string('productInventoryItemId', {
        args: {
          businessLocationId: intArg(),
        },
      });
      t.nullable.float('quantityOnOrder', {
        args: {
          businessLocationId: intArg(),
        },
      });
    },
  }),
];

const querySchema = [
  queryField('productsPriceRange', {
    type: objectType({
      name: 'ProductsPriceRange',
      definition: (t) => {
        t.float('minPrice');
        t.float('maxPrice');
      },
    }),
  }),
];

const ProductTypeItemCategoryMapping = inputObjectType({
  name: 'ProductTypeItemCategoryMapping',
  definition(t) {
    t.nonNull.string('productTypeId');
    t.nullable.string('itemCategoryId');
  },
});

const UpdateProductTypesItemCategoriesResponse = objectType({
  name: 'UpdateProductTypesItemCategoriesResponse',
  definition(t) {
    t.nonNull.boolean('success');
    t.nonNull.int('updatedCount');
  },
});

const mutationSchema = [
  mutationField('updateProductTypesItemCategories', {
    type: UpdateProductTypesItemCategoriesResponse,
    args: {
      input: nonNull(
        inputObjectType({
          name: 'UpdateProductTypesItemCategoriesInput',
          definition: (t) => {
            t.field('mappings', {
              type: list(nonNull(ProductTypeItemCategoryMapping)),
            });
          },
        }),
      ),
    },
  }),
  mutationField('createProductsBasedOnAIGeneration', {
    type: nonNull(list(nonNull('Int'))),
    args: {
      input: nonNull(
        inputObjectType({
          name: 'CreateProductsBasedOnAIGenerationInput',
          definition: (t) => {
            t.field('products', { type: list(nonNull(CreatedByAIProduct)) });
            t.string('orderId');
            t.string('businessLocationId');
            t.string('orderType');
            t.boolean('isAiProductExpected');
          },
        }),
      ),
    },
  }),
  mutationField('createProductsFromCSV', {
    type: 'String',
    args: {
      input: nonNull(
        inputObjectType({
          name: 'CreateProductsFromCSVInput',
          definition: (t) => {
            t.field('uploadCsv', { type: 'Upload' });
          },
        }),
      ),
    },
  }),
  mutationField('fastUpdateAllProductsFromCSV', {
    type: 'String',
    args: {
      input: nonNull(
        inputObjectType({
          name: 'FastUpdateAllProductsFromCSVInput',
          definition: (t) => {
            t.string('csvProductJson');
          },
        }),
      ),
    },
  }),
  mutationField('fastUpdateSingleProduct', {
    type: 'String',
    args: {
      input: nonNull(
        inputObjectType({
          name: 'FastUpdateSingleProductInput',
          definition: (t) => {
            t.string('csvSingleProductJson');
          },
        }),
      ),
    },
  }),
  mutationField('shopifyCollections', {
    args: {
      input: nonNull(
        inputObjectType({
          name: 'ShopifyCollectionsArgInput',
          definition: (t) => {
            t.nonNull.int('tenantId');
            t.nonNull.string('ecommerceType');
          },
        }),
      ),
    },
    type: objectType({
      name: 'shopifyCollectionsResponse',
      definition: (t) => {
        t.boolean('status');
        t.field('data', { type: list(ShopifyCollections) });
      },
    }),
  }),
  mutationField('prevProductSyncWithAccountingService', {
    type: 'Boolean',
    args: {
      input: nonNull(
        inputObjectType({
          name: 'PrevProductSyncWithAccountingServiceInput',
          definition: (t) => {
            t.field('serviceType', { type: nonNull('AccountingServiceEnum') });
            t.int('tenantId');
          },
        }),
      ),
    },
  }),
  mutationField('updateDefaultPriceFromCSV', {
    type: 'String',
    args: {
      input: nonNull(
        inputObjectType({
          name: 'UpdateDefaultPriceFromCSVInput',
          definition: (t) => {
            t.field('uploadCsv', { type: 'Upload' });
          },
        }),
      ),
    },
  }),
];

export const productSchema = [...typeSchema, ...querySchema, ...mutationSchema];
