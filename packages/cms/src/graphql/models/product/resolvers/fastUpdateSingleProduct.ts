import { GraphQLFieldResolver } from 'graphql';

import { errors } from '@strapi/utils';
import { getTenantFilter } from '../../dealTransaction/helpers/helpers';
import { PRODUCTS_IMPORT_IDENTIFIER } from './../../../../api/redis/helpers/variables/importingVariables';
import { NexusGenInputs } from './../../../../types/generated/graphql';
import { singleProductUpdating } from './../helpers/fastUpdate/singleProductUpdating';
const { ApplicationError } = errors;

interface ProductItem {
  quantity: string;
  businessLocationId: string;
  itemCost: string;
  orderCreationDate: string;
  paymentAmount: string;
}

interface UpdatingInfo {
  namesUuid: string;
  namesId: number;
  barcodesUuid: string;
  barcodesId: number;
}

interface Product {
  barcode: string;
  tenantId: number;
  imagesIds: string[];
  barcodeId: string;
  name: string;
  serialNumber: string;
  defaultPrice: number;
  productType: string;
  brand: string;
  model: string;
  dimensionLength: string;
  dimensionWidth: string;
  dimensionHeight: string;
  dimensionUnit: string;
  weight: string;
  weightUnit: string;
  sku: string;
  upc: string;
  mpn: string;
  ean: string;
  isbn: string;
  partsWarranty: string; // ISO date string
  laborWarranty: string; // ISO date string
  description: string;
  ecommerceDescription: string;
  shopifyTags: string;
  productItems: ProductItem[];
  images: string[];
  errors: string[];
  localId: string;
  brandId: number;
  productTypeId: number;
  UPC: string;
  SKU: string;
  MPN: string;
  EAN: string;
  ISBN: string;
  updatingType: string;
  updatingInfo: UpdatingInfo;
  customFields: Record<string, string>;
  isNegativeCount: string;
  active: string;
}

export const fastUpdateSingleProduct: GraphQLFieldResolver<
  null,
  Graphql.ResolverContext,
  { input: NexusGenInputs['FastUpdateSingleProductInput'] }
> = async (root, { input }, ctx) => {
  const parsedProduct: Product = JSON.parse(input?.csvSingleProductJson);
  const userId = ctx.state.user.id;
  const tenantFilter = await getTenantFilter(userId);
  const lastSession = await strapi.entityService.findMany(
    'api::importing-session.importing-session',
    {
      filters: {
        type: PRODUCTS_IMPORT_IDENTIFIER,
        ...tenantFilter,
      },
      limit: 1,
      sort: ['createdAt:desc'],
      fields: ['regexedId'],
    },
  );

  let productId;

  if (
    parsedProduct?.updatingType === 'bothEqual' ||
    parsedProduct?.updatingType === 'name'
  ) {
    productId = parsedProduct?.updatingInfo?.namesId;
  } else if (parsedProduct?.updatingType === 'barcode') {
    productId = parsedProduct?.updatingInfo?.barcodesId;
  } else {
    throw new ApplicationError(
      'The product has barcode and name of different products',
    );
  }

  await singleProductUpdating(parsedProduct, {
    productId,
    tenantFilter,
    userId,
    regexedSessionId: lastSession?.[0]?.regexedId,
  });
};
