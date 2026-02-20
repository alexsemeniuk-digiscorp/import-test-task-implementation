/**
 * activity controller
 */
import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::activity.activity',
  ({ strapi }) => ({
    async getActivityOpenApiController(ctx) {
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

        const activities = await strapi.entityService.findMany(
          'api::activity.activity',
          {
            filters: {
              tenant: {
                id: {
                  $eq: owner?.tenant?.id,
                },
              },
            },
            populate: ['contact_id', 'assignees', 'company_id'],
            sort: [{ id: 'desc' }],
            limit: parseInt(pageSize),
            start: (parseInt(page) - 1) * parseInt(pageSize),
          },
        );

        ctx.body = {
          status: 200,
          message: 'Activity fetched successfully!',
          data: activities,
        };
      } catch (error) {
        ctx.body = {
          status: 500,
          error,
          message: 'Internal server error',
        };
      }
    },
    async createActivityOpenApiController(ctx) {
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
        const activityRequest = ctx?.request?.body;
        const type = activityRequest?.type;
        const title = activityRequest?.title;
        const description = activityRequest?.description;
        const notes = activityRequest?.notes;
        const due_date = activityRequest?.due_date
          ? new Date(activityRequest?.due_date)
          : null;
        const priority = activityRequest?.priority;
        const appointmentDate = activityRequest?.appointmentDate
          ? new Date(activityRequest?.appointmentDate)
          : null;

        // New inputs: assignee emails and either contact/company email
        const assigneesEmailsInput =
          activityRequest?.assigneesEmails ?? activityRequest?.assignees;
        const contact_email = activityRequest?.contact_email;
        const company_email = activityRequest?.company_email;

        // Normalize assignee emails to always be an array of strings
        const assigneeEmails: string[] = Array.isArray(assigneesEmailsInput)
          ? (assigneesEmailsInput || []).filter(Boolean)
          : [assigneesEmailsInput].filter(Boolean);

        // Validate either contact_email or company_email (not both, not neither)
        if (
          (!contact_email && !company_email) ||
          (contact_email && company_email)
        ) {
          return (ctx.body = {
            status: 400,
            message: 'Provide either contact_email or company_email, not both',
          });
        }

        // Validate that assignee emails are provided
        if (!assigneeEmails || assigneeEmails.length === 0) {
          return (ctx.body = {
            status: 400,
            message: 'At least one assignee email is required',
          });
        }

        // Resolve assignees by email within tenant
        const foundAssignees = await strapi.db
          .query('plugin::users-permissions.user')
          .findMany({
            where: {
              email: { $in: assigneeEmails },
              tenant: { id: { $eq: owner?.tenant?.id } },
            },
            select: ['id', 'email'],
          });

        const foundAssigneeEmails = new Set(foundAssignees.map((u) => u.email));
        const missingAssignees = assigneeEmails.filter(
          (e) => !foundAssigneeEmails.has(e),
        );

        if (missingAssignees.length > 0) {
          return (ctx.body = {
            status: 404,
            message: `Assignees not found for emails: ${missingAssignees.join(
              ', ',
            )}`,
          });
        }

        // Resolve contact/company by email within tenant
        let contact_id: number | null = null;
        let company_id: number | null = null;

        if (contact_email) {
          const contact = await strapi.db
            .query('api::contact.contact')
            .findOne({
              where: {
                email: { $eq: contact_email },
                tenant: { id: { $eq: owner?.tenant?.id } },
              },
              select: ['id', 'email'],
            });

          if (!contact) {
            return (ctx.body = {
              status: 404,
              message: `Contact not found for email: ${contact_email}`,
            });
          }
          contact_id = contact.id as unknown as number;
        }

        if (company_email) {
          const company = await strapi.db
            .query('api::company.company')
            .findOne({
              where: {
                email: { $eq: company_email },
                tenant: { id: { $eq: owner?.tenant?.id } },
              },
              select: ['id', 'email'],
            });

          if (!company) {
            return (ctx.body = {
              status: 404,
              message: `Company not found for email: ${company_email}`,
            });
          }
          company_id = company.id as unknown as number;
        }

        // Create activity with resolved IDs
        const response = await strapi.entityService.create(
          'api::activity.activity',
          {
            data: {
              title,
              description,
              notes,
              due_date,
              priority,
              assignees: foundAssignees.map((u) => u.id),
              type,
              tenant: owner?.tenant?.id,
              owner: owner?.id,
              contact_id,
              company_id,
              appointmentDate,
            },
          },
        );

        ctx.body = {
          status: 200,
          message: 'Activity created successfully!',
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
    async getActivityByIdOpenApiController(ctx) {
      try {
        const { id } = ctx.query;
        if (!id) {
          return ctx.badRequest('Id is required');
        }
        const activity = await strapi.entityService.findOne(
          'api::activity.activity',
          id,
          {
            populate: ['contact_id', 'assignees', 'company_id'],
          },
        );
        if (!activity) {
          ctx.body = {
            status: 200,
            message: 'Activity not found',
            data: null,
            found: false,
          };
          return;
        }
        ctx.body = {
          status: 200,
          message: 'Activity fetched successfully!',
          data: activity,
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
    async shopifyEventsController(ctx) {
      try {
        const body = ctx.request.body;
        const { name, timestamp, clientId, data, apiKey } = body;
        const ecommerceStore = await strapi.db
          .query('api::ecommerce-detail.ecommerce-detail')
          .findOne({
            where: {
              storeUrl: { $eq: apiKey },
            },
            populate: ['tenant'],
          });
        const tenantId = ecommerceStore?.tenant?.id;
        if (!tenantId) {
          return (ctx.body = {
            status: 400,
            message: 'Ecommerce store not found or tenant not configured',
          });
        }
        const extractEmail = (data, primary) => {
          return (
            primary ||
            data?.customer?.email ||
            data?.checkout?.email ||
            data?.cart?.buyerIdentity?.email ||
            data?.buyerIdentity?.email ||
            data?.order?.customer?.email ||
            null
          );
        };
        const contactEmail = extractEmail(data, body?.email);
        if (!contactEmail) {
          return (ctx.body = {
            status: 400,
            message: 'Email is required',
          });
        }
        let contactId: number | null = null;
        const contact = await strapi.db.query('api::contact.contact').findOne({
          where: {
            email: { $eq: contactEmail },
            tenant: { id: { $eq: tenantId } },
          },
        });

        if (!contact && contactEmail) {
          const emailMatch = contactEmail?.match(/^([^@]+)@/);
          const fullName = emailMatch
            ? emailMatch[1]
            : contactEmail.split('@')[0];
          const newContact = await strapi.entityService.create(
            'api::contact.contact',
            {
              data: {
                email: contactEmail,
                fullName: fullName,
                tenant: tenantId,
              },
            },
          );
          contactId = newContact?.id || null;
        } else {
          contactId = contact?.id || null;
        }

        // Extract readable time (HH:MM)
        const time = new Date(timestamp).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });

        // Extract product name
        const productName =
          data?.productVariant?.product?.title ||
          data?.product?.title ||
          data?.checkout?.lineItems?.[0]?.title ||
          data?.cartLine?.merchandise?.product?.title ||
          data?.item?.product?.title ||
          data?.items?.[0]?.product?.title ||
          'NA';

        // Line to append
        const line = `${time} — ${name} — ${productName}`;

        // Calculate start and end of day for createdAt filter
        const eventDate = new Date(timestamp);
        const startOfDay = new Date(eventDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(eventDate);
        endOfDay.setHours(23, 59, 59, 999);

        // 🟦 FIND existing Shopify activity for this date
        // If contactId exists, search by createdAt (date range) + activityType + contact_id + tenant
        const whereClause: any = {
          createdAt: {
            $gte: startOfDay.toISOString(),
            $lte: endOfDay.toISOString(),
          },
          type: 'shopify',
          tenant: { id: { $eq: tenantId } },
        };

        if (contactId) {
          whereClause.contact_id = contactId;
        }

        const existing = await strapi.db
          .query('api::activity.activity')
          .findOne({
            where: whereClause,
          });

        if (existing) {
          // 🟨 APPEND new event line
          await strapi.db.query('api::activity.activity').update({
            where: { id: existing.id },
            data: {
              description: existing.description + '\n' + line,
            },
          });

          ctx.body = {
            status: 200,
            message: 'Shopify activity updated',
            activityId: existing.id,
          };
          return;
        }

        // 🟩 CREATE NEW SHOPIFY ACTIVITY (FIRST OF THE DAY)
        const created = await strapi.db.query('api::activity.activity').create({
          data: {
            contact_id: contactId || null,
            type: 'shopify',
            description: line,
            title: 'Shopify Tracking',
            tenant: tenantId,
            due_date: new Date(timestamp).toISOString(),
          },
        });

        ctx.body = {
          status: 200,
          message: 'Shopify activity created',
          activityId: created.id,
        };
      } catch (error) {
        ctx.body = {
          status: 500,
          message: 'Internal server error',
          error,
        };
      }
    },
  }),
);
