/**
 * product controller
 */
import { factories } from '@strapi/strapi';
import { generateRandomNumber } from '../../../graphql/models/product/helpers/helpers';
import { shopifyApi } from '../../helpers/shopifyApi';

export default factories.createCoreController(
  'api::product.product',
  ({ strapi }) => ({
    async createProductOpenApiController(ctx) {
      const user = await strapi.plugins[
        'users-permissions'
      ].services.jwt.getToken(ctx);
      const owner = await strapi
        .query('plugin::users-permissions.user')
        .findOne({
          where: { id: user?.id },
          populate: ['tenant'],
        });
      const productRequest = ctx?.request?.body;
      const customFields = ctx?.request?.body?.customFields;
      const dimensions = ctx?.request?.body?.dimension;

      try {
        const productType = await strapi.db
          .query('api::product-type.product-type')
          .findOne({
            where: {
              name: productRequest?.productType,
              tenant: owner?.tenant?.id,
            },
          });

        if (productType) {
          productRequest.productType = productType?.id;
        } else {
          if (productRequest?.productType) {
            const response = await strapi.entityService.create(
              'api::product-type.product-type',
              {
                data: {
                  name: productRequest?.productType,
                  tenant: owner?.tenant?.id,
                },
              },
            );
            productRequest.productType = response?.id;
          }
        }

        const brand = await strapi.db
          .query('api::product-brand.product-brand')
          .findOne({
            where: {
              name: productRequest?.brand,
              tenant: owner?.tenant?.id,
            },
          });
        if (brand) {
          productRequest.brand = brand?.id;
        } else {
          if (productRequest?.brand) {
            const response = await strapi.entityService.create(
              'api::product-brand.product-brand',
              {
                data: {
                  name: productRequest?.brand,
                  tenant: owner?.tenant?.id,
                },
              },
            );
            productRequest.brand = response?.id;
          }
        }

        const files = ctx?.request?.files ?? {};
        const images = files.images;
        const uploadedImages = [];

        if (Array.isArray(images) && images?.length > 0) {
          for (let i = 0; i < images?.length; i++) {
            const uploadedImage = await strapi.plugins[
              'upload'
            ].services.upload.upload({
              files: images[i],
              data: {},
            });
            uploadedImages.push(uploadedImage[0]?.id);
          }
        }

        const response = await strapi.entityService.create(
          'api::product.product',
          {
            data: {
              name: productRequest?.name,
              SKU: productRequest?.sku,
              description: productRequest?.description,
              defaultPrice: productRequest?.defaultPrice,
              serialNumber: productRequest?.serialNumber,
              barcode: generateRandomNumber(),
              ISBN: productRequest?.ISBN,
              isCreatedByOpenApi: true,
              tenant: owner?.tenant?.id,
              files: uploadedImages.length > 0 ? uploadedImages : null,
              brand: productRequest?.brand,
              productType: productRequest?.productType,
              ecommerceName: productRequest?.ecommerceName,
              note: productRequest?.note,
              appraisalDescription: productRequest?.appraisalDescription || '',
              ecommerceDescription: productRequest?.ecommerceDescription || '',
              multiplier: productRequest?.multiplier || 0,
              wholeSaleMultiplier: productRequest?.wholeSaleMultiplier || 0,
              UPC: productRequest?.upc || '',
              MPN: productRequest?.mpn || '',
              EAN: productRequest?.ean || '',
              partsWarranty:
                new Date(
                  productRequest?.partsWarranty || new Date(),
                ).toISOString() || '',
              laborWarranty:
                new Date(
                  productRequest?.laborWarranty || new Date(),
                ).toISOString() || '',
              expiryDate:
                new Date(
                  productRequest?.expiryDate || new Date(),
                ).toISOString() || '',
              model: productRequest?.model || '',
            },
          },
        );
        const units = ['mm', 'cm', 'm', 'in', 'ft', 'yd'];

        if (dimensions) {
          await strapi.entityService.create('api::dimension.dimension', {
            data: {
              height: Number(dimensions?.height || 0),
              width: Number(dimensions?.width || 0),
              length: Number(dimensions?.length || 0),
              unit: units.includes(dimensions?.unit) ? dimensions?.unit : 'in',
              product: response?.id,
            },
          });
        }

        if (
          typeof customFields !== 'string' &&
          customFields &&
          customFields?.length > 0
        ) {
          customFields.map(async (item) => {
            const fieldName = item.split(':')[0];
            const fieldValue = item.split(':')[1];
            const existingField = await strapi.entityService.findMany(
              'api::product-attribute.product-attribute',
              {
                filters: {
                  name: fieldName,
                  tenant: owner?.tenant?.id ?? null,
                },
                limit: 1,
              },
            );

            let fieldNameId;
            if (existingField.length > 0) {
              fieldNameId = existingField[0].id;
            } else {
              const fieldNameEntry = await strapi.entityService.create(
                'api::product-attribute.product-attribute',
                {
                  data: {
                    name: fieldName,
                    tenant: owner?.tenant?.id ?? null,
                  },
                },
              );

              fieldNameId = fieldNameEntry.id;
            }

            await strapi.entityService.create(
              'api::product-attribute-option.product-attribute-option',
              {
                data: {
                  name: fieldValue,
                  productAttribute: fieldNameId,
                  products: [response?.id],
                },
              },
            );
          });
        } else if (typeof customFields == 'string') {
          const fieldName = customFields.split(':')[0];
          const fieldValue = customFields.split(':')[1];
          const existingField = await strapi.entityService.findMany(
            'api::product-attribute.product-attribute',
            {
              filters: {
                name: fieldName,
                tenant: owner?.tenant?.id ?? null,
              },
              limit: 1,
            },
          );

          let fieldNameId;
          if (existingField?.length > 0) {
            fieldNameId = existingField?.[0]?.id;
          } else {
            const fieldNameEntry = await strapi.entityService.create(
              'api::product-attribute.product-attribute',
              {
                data: {
                  name: fieldName,
                  tenant: owner?.tenant?.id ?? null,
                },
              },
            );

            fieldNameId = fieldNameEntry?.id;
          }

          await strapi.entityService.create(
            'api::product-attribute-option.product-attribute-option',
            {
              data: {
                name: fieldValue,
                productAttribute: fieldNameId,
                products: [response?.id],
              },
            },
          );
        }

        ctx.body = {
          status: 200,
          message: 'Product created successfully!',
          data: response,
        };
      } catch (error) {
        ctx.body = {
          status: 500,
          error: error,
          message: 'Internal server error',
        };
      }
    },
    async shopifyProductWebhookController(ctx) {
      if (!ctx?.request?.body) {
        return;
      }

      try {
        const ecommerceStore = await strapi.db
          .query('api::ecommerce-detail.ecommerce-detail')
          .findOne({
            where: {
              ecommerceType: 'shopify',
              storeUrl: ctx?.request?.header['x-shopify-shop-domain'],
            },
          });

        const shopifyProduct = ctx.request?.body;
        const ecommerceProduct = await strapi.db
          .query('api::ecommerce-product-service.ecommerce-product-service')
          .findOne({
            where: {
              ecommerceProductId: shopifyProduct?.id,
            },
            populate: ['product'],
          });
        if (!ecommerceStore?.accessToken || !ecommerceStore?.storeUrl) {
          return;
        }

        const api = shopifyApi(
          ecommerceStore?.storeUrl,
          ecommerceStore?.accessToken,
        );

        let collections;
        try {
          const collectionResponse = await api.get(
            `/admin/api/${process.env.SHOPIFY_API_VERSION}s/collects.json?product_id=${ctx?.request?.body.id}`,
          );
          if (collectionResponse.status !== 200) {
            return new Error(
              `Error fetching collections for product ${shopifyProduct?.id}`,
            );
          }

          collections =
            collectionResponse?.data?.collects[0]?.collection_id || [];
        } catch (error) {
          return new Error(error);
        }

        const ecommerceDescriptionText = shopifyProduct?.body_html || '';

        if (
          ecommerceProduct?.product?.ecommerceName != shopifyProduct?.title ||
          ecommerceProduct?.product?.ecommerceDescription !=
            ecommerceDescriptionText ||
          ecommerceProduct?.product?.shopifyTags != shopifyProduct?.tags ||
          ecommerceProduct?.product?.shopifyCollections !=
            collections.toString()
        ) {
          await strapi.db.query('api::product.product').update({
            where: {
              id: ecommerceProduct?.product?.id,
            },
            data: {
              ecommerceName: shopifyProduct?.title,
              ecommerceDescription: ecommerceDescriptionText,
              shopifyTags: shopifyProduct?.tags,
              shopifyCollections: collections.toString(),
            },
          });
        }

        ctx.body = {
          status: 200,
          message: 'Success',
        };
      } catch (error) {
        ctx.body = {
          status: 500,
          error: error,
          message: 'Internal server error',
        };
      }
    },
    async woocommerceProductWebhookController(ctx) {
      if (!ctx?.request?.body) {
        return;
      }
      try {
        const woocommerceProduct = ctx.request?.body;
        const ecommerceProduct = await strapi.db
          .query('api::ecommerce-product-service.ecommerce-product-service')
          .findOne({
            where: {
              ecommerceProductId: woocommerceProduct?.id,
            },
            populate: ['product'],
          });

        const woocommerceTags = woocommerceProduct?.tags
          ?.map((tag) => tag.name)
          .join(', ');
        const ecommerceDescriptionText = woocommerceProduct?.description || '';

        if (
          ecommerceProduct?.product?.ecommerceName !=
            woocommerceProduct?.name ||
          ecommerceProduct?.product?.ecommerceDescription !=
            ecommerceDescriptionText ||
          ecommerceProduct?.product?.shopifyTags != woocommerceTags ||
          ecommerceProduct?.product?.woocommerceCategory !=
            woocommerceProduct?.categories[0]?.id
        ) {
          await strapi.db.query('api::product.product').update({
            where: {
              id: ecommerceProduct?.product?.id,
            },
            data: {
              ecommerceName: woocommerceProduct?.name,
              ecommerceDescription: ecommerceDescriptionText,
              shopifyTags: woocommerceTags,
              woocommerceCategory: woocommerceProduct?.categories[0]?.id,
            },
          });
        }

        ctx.body = {
          status: 200,
          message: 'success',
        };
      } catch (error) {
        ctx.body = {
          status: 500,
          error: error.message,
          message: 'Internal server error',
        };
      }
    },
    async getProductsOpenApiController(ctx) {
      try {
        const user = await strapi.plugins[
          'users-permissions'
        ].services.jwt.getToken(ctx);

        const owner = await strapi
          .query('plugin::users-permissions.user')
          .findOne({
            where: { id: user?.id },
            populate: ['tenant'],
          });

        const { pageSize = 100, page = 1 } = ctx.query;

        // Get all product attributes for the tenant
        const customAttributes = await strapi.entityService.findMany(
          'api::product-attribute.product-attribute',
          {
            filters: {
              tenant: {
                id: {
                  $eq: owner?.tenant?.id,
                },
              },
            },
          },
        );

        const allAttributeKeys = customAttributes.map((attr) => ({
          key: attr.name.replace(/\s+/g, ''),
          originalName: attr.name,
        }));

        const products = await strapi.entityService.findMany(
          'api::product.product',
          {
            filters: {
              tenant: {
                id: {
                  $eq: owner?.tenant?.id,
                },
              },
            },
            populate: [
              'brand',
              'productType',
              'metalType',
              'materialGradeType',
              'engravingType',
              'size',
              'productAttributeOptions.productAttribute',
            ],
            sort: [{ id: 'desc' }],
            limit: parseInt(pageSize),
            start: (parseInt(page) - 1) * parseInt(pageSize),
          },
        );

        const transFormProduct = await Promise.all(
          products.map(async (product) => {
            // Build attribute value map
            const productOptionMap = (
              product?.productAttributeOptions ?? []
            ).reduce((acc, option) => {
              const attrName = option?.productAttribute?.name?.replace(
                /\s+/g,
                '',
              );
              const optionName = option?.name ?? '';
              if (attrName) acc[attrName] = optionName;
              return acc;
            }, {});

            // Build the full custom attribute object with all keys
            const customAttributesObject = allAttributeKeys.reduce(
              (acc, attr) => {
                acc[attr.key] = productOptionMap[attr.key] ?? '';
                return acc;
              },
              {},
            );

            const {
              productAttributeOptions, // destructure to remove
              ...rest
            } = product;

            return {
              ...rest,
              brand: product?.brand?.name ?? '',
              productType: product?.productType?.name ?? '',
              metalType: product?.metalType?.name ?? '',
              materialGradeType: product?.materialGradeType?.name ?? '',
              engravingType: product?.engravingType?.name ?? '',
              size: product?.size?.name ?? '',
              ...customAttributesObject,
            };
          }),
        );

        ctx.body = {
          status: 200,
          message: 'Products fetched successfully!',
          data: transFormProduct,
        };
      } catch (error) {
        ctx.body = {
          status: 500,
          error,
          message: 'Internal server error',
        };
      }
    },
    async getProductByIdOpenApiController(ctx) {
      try {
        const { id, productId, SKU } = ctx.query;

        // Validate that at least one parameter is provided
        if (!id && !productId && !SKU) {
          return ctx.badRequest('Either id, productId, or SKU is required');
        }

        let product;

        if (id) {
          // Find product by ID
          product = await strapi.entityService.findOne(
            'api::product.product',
            id,
            {
              populate: [
                'brand',
                'productType',
                'metalType',
                'materialGradeType',
                'engravingType',
                'size',
                'productAttributeOptions.productAttribute',
              ],
            },
          );
        } else if (productId) {
          // Find product by productId
          const products = await strapi.entityService.findMany(
            'api::product.product',
            {
              filters: { productId: productId },
              populate: [
                'brand',
                'productType',
                'metalType',
                'materialGradeType',
                'engravingType',
                'size',
                'productAttributeOptions.productAttribute',
              ],
            },
          );

          // Return the first match if found, since productId should be unique
          product = products && products.length > 0 ? products[0] : null;
        } else if (SKU) {
          // Find product by SKU
          const products = await strapi.entityService.findMany(
            'api::product.product',
            {
              filters: { SKU: SKU },
              populate: [
                'brand',
                'productType',
                'metalType',
                'materialGradeType',
                'engravingType',
                'size',
                'productAttributeOptions.productAttribute',
              ],
            },
          );

          // Return the first match if found, since SKU should be unique
          product = products && products.length > 0 ? products[0] : null;
        }

        if (!product) {
          ctx.body = {
            status: 200,
            message: 'Product not found',
            data: null,
            found: false,
          };
          return;
        }

        ctx.body = {
          status: 200,
          message: 'Product fetched successfully!',
          data: product,
          found: true,
        };
      } catch (error) {
        ctx.body = {
          status: 500,
          error,
          message: 'Internal server error',
        };
      }
    },
  }),
);
