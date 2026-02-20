/**
 * deal controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::deal.deal',
  ({ strapi }) => ({
    async getDealOpenApiController(ctx) {
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

        const deals = await strapi.entityService.findMany('api::deal.deal', {
          filters: {
            tenant: {
              id: {
                $eq: owner?.tenant?.id,
              },
            },
          },
          populate: ['products', 'company', 'contact'],
          sort: [{ id: 'desc' }],
          limit: parseInt(pageSize),
          start: (parseInt(page) - 1) * parseInt(pageSize),
        });

        ctx.body = {
          status: 200,
          message: 'Deal fetched successfully!',
          data: deals,
        };
      } catch (error) {
        ctx.body = {
          status: 500,
          error,
          message: 'Internal server error',
        };
      }
    },
    async createDealOpenApiController(ctx) {
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

        const dealRequest = ctx?.request?.body;
        const productsInput = dealRequest?.products; // can be single or array of ids
        const company = dealRequest?.company; // legacy support (id)
        const contact = dealRequest?.contact; // legacy support (id)
        const company_email = dealRequest?.company_email;
        const contact_email = dealRequest?.contact_email;
        const budget = dealRequest?.budget;
        const stage = dealRequest?.stage;
        const name = dealRequest?.name;
        const startDate = new Date(dealRequest?.startDate);
        const tenant = owner?.tenant?.id;
        const notes = dealRequest?.notes;

        // Normalize to always be an array
        const productIds = Array.isArray(productsInput)
          ? productsInput
          : [productsInput].filter(Boolean);

        // Fetch product entities from DB only if productIds provided
        let products = [] as any[];
        if (productIds && productIds.length > 0) {
          products = await strapi.db.query('api::product.product').findMany({
            where: { productId: { $in: productIds } },
          });

          if (!products || products.length === 0) {
            return (ctx.body = {
              status: 404,
              message: 'No valid products found for given productIds',
            });
          }
        }

        // Resolve contact/company by email within tenant if provided
        let resolvedCompanyId = company ?? null;
        let resolvedContactId = contact ?? null;

        if (company_email) {
          const companyEntity = await strapi.db
            .query('api::company.company')
            .findOne({
              where: {
                email: { $eq: company_email },
                tenant: { id: { $eq: tenant } },
              },
              select: ['id', 'email'],
            });
          if (!companyEntity) {
            return (ctx.body = {
              status: 404,
              message: `Company not found for email: ${company_email}`,
            });
          }
          resolvedCompanyId = companyEntity.id;
        }

        if (contact_email) {
          const contactEntity = await strapi.db
            .query('api::contact.contact')
            .findOne({
              where: {
                email: { $eq: contact_email },
                tenant: { id: { $eq: tenant } },
              },
              select: ['id', 'email'],
            });
          if (!contactEntity) {
            return (ctx.body = {
              status: 404,
              message: `Contact not found for email: ${contact_email}`,
            });
          }
          resolvedContactId = contactEntity.id;
        }

        const response = await strapi.entityService.create('api::deal.deal', {
          data: {
            products: products.map((p) => p.id), // save only ids; empty if none
            company: resolvedCompanyId,
            contact: resolvedContactId,
            budget,
            stage,
            tenant,
            name,
            startDate,
            notes,
          },
        });

        ctx.body = {
          status: 200,
          message: 'Deal created successfully!',
          data: response,
        };
      } catch (error) {
        ctx.body = {
          status: 500,
          error,
          message: 'Internal server error',
        };
      }
    },
    async getDealByIdOpenApiController(ctx) {
      try {
        const { id } = ctx.query;
        if (!id) {
          return ctx.badRequest('Id is required');
        }
        const deal = await strapi.entityService.findOne('api::deal.deal', id, {
          populate: ['products', 'company', 'contact'],
        });
        if (!deal) {
          ctx.body = {
            status: 200,
            message: 'Deal not found',
            data: null,
            found: false,
          };
          return;
        }
        ctx.body = {
          status: 200,
          message: 'Deal fetched successfully!',
          data: deal,
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
