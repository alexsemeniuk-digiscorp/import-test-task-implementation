import { errors } from '@strapi/utils';
import { Worker } from 'bullmq';
import { GraphQLFieldResolver } from 'graphql';
import fastUpdateProductQueue from './../../../../../src/api/redis/bullmq/fastUpdateProduct';
import redis, { redisConfig } from './../../../../../src/api/redis/redis';
import {
  FAST_UPDATE_PRODUCT_IDENTIFIER,
  PRODUCTS_IMPORT_IDENTIFIER,
  updatingImportingData,
} from './../../../../api/redis/helpers/variables/importingVariables';
import { handleLogger } from './../../../../graphql/helpers/errors';
import { NexusGenInputs } from './../../../../types/generated/graphql';
import { NOT_DEVELOPEMENT } from './../../../constants/enviroment';
import { getTenantFilter } from './../../../models/dealTransaction/helpers/helpers';
import { singleProductUpdating } from './../helpers/fastUpdate/singleProductUpdating';
const { ApplicationError } = errors;

const worker = new Worker(
  FAST_UPDATE_PRODUCT_IDENTIFIER,
  async (job) => {
    console.log('worksbhb');
    const {
      updatableProducts,
      meta: { tenantFilter, userId, lastSessionId },
    } = job.data;

    if (updatableProducts && updatableProducts?.length) {
      for (let i = 0; i < updatableProducts?.length; i++) {
        const updatableProduct = updatableProducts?.[i];
        let productId;
        if (
          updatableProduct?.updatingType === 'bothEqual' ||
          updatableProduct?.updatingType === 'name'
        ) {
          productId = updatableProduct?.updatingInfo?.namesId;
        } else if (updatableProduct?.updatingType === 'barcode') {
          productId = updatableProduct?.updatingInfo?.barcodesId;
        } else {
          throw new ApplicationError(
            'The product has barcode and name of different products',
          );
        }
        if (updatableProduct) {
          console.log('works');
          await singleProductUpdating(updatableProduct, {
            tenantFilter,
            userId,
            productId,
            regexedSessionId: lastSessionId,
          });
        }
      }
    }
  },
  {
    connection: redisConfig,
  },
);

worker.on('error', (err) => {
  handleLogger('info', 'Redis', 'Product worker error');
});

export const fastUpdateAllProductsFromCSV: GraphQLFieldResolver<
  null,
  Graphql.ResolverContext,
  { input: NexusGenInputs['FastUpdateAllProductsFromCSVInput'] }
> = async (root, { input }, ctx) => {
  console.log('started');
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

  const deleteKey = updatingImportingData(
    lastSession?.[0]?.regexedId,
    tenantFilter?.tenant,
    PRODUCTS_IMPORT_IDENTIFIER,
  );
  const parsedRange = await redis.lrange(deleteKey, 0, -1);

  const parsedProducts = await Promise.all(
    parsedRange.map(async (item) => {
      try {
        return JSON.parse(item);
      } catch (e) {
        console.error('JSON parsing error:', e, 'for item:', item);
        return null;
      }
    }),
  ).then((results) => results.filter(Boolean));

  const bothDifferentArr = parsedProducts?.filter(
    (product) =>
      product?.updatingType === 'bothDifferent' ||
      (product?.errors && product?.errors?.length > 0),
  );
  const updatableProducts = parsedProducts?.filter(
    (product) => product?.updatingType !== 'bothDifferent',
  );
  console.log('started2');
  try {
    await fastUpdateProductQueue.add(FAST_UPDATE_PRODUCT_IDENTIFIER, {
      updatableProducts,
      meta: {
        tenantFilter,
        userId,
        lastSessionId: lastSession?.[0]?.regexedId,
      },
    });
  } catch (e) {
    handleLogger(
      'error',
      'fastUpdateAllProductsFromCSV',
      e.message,
      NOT_DEVELOPEMENT,
    );
  }
  return JSON.stringify({ bothDifferentArr });
};
