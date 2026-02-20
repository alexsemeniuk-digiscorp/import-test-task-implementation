import { PRODUCT_TYPE_OPTIONS } from '../tenant/static/jewelry/options';
import { BRAND_OPTIONS } from '../tenant/static/jewelry/watchOptions';
import { handleError } from './../../../graphql/helpers/errors';

export const createInputsOptions = async (tenantId) => {
  try {
    await Promise.all(
      PRODUCT_TYPE_OPTIONS.map((item) => {
        strapi.entityService.create('api::product-type.product-type', {
          data: {
            tenant: tenantId,
            name: item,
          },
        });
      }),
    );
    await Promise.all(
      BRAND_OPTIONS.map((item) => {
        strapi.entityService.create('api::product-brand.product-brand', {
          data: {
            tenant: tenantId,
            name: item,
          },
        });
      }),
    );
  } catch (e) {
    handleError('createInputsOptions', undefined, e);
  }
};
