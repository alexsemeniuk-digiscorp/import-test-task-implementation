/**
 * contact controller
 */
import { factories } from '@strapi/strapi';
import { DEFAULT_PHONE_NUMBER } from '../../../graphql/constants/defaultValues';
import { handleError } from '../../../graphql/helpers/errors';
import { NexusGenEnums } from '../../../types/generated/graphql';

export default factories.createCoreController(
  'api::contact.contact',
  ({ strapi }) => ({
    async shopifyContactWebhookController(ctx) {
      if (!ctx?.request?.body) {
        return ctx.badRequest('Request body is missing');
      }

      const ecommerceStore = await strapi.db
        .query('api::ecommerce-detail.ecommerce-detail')
        .findOne({
          where: {
            ecommerceType: 'shopify',
            storeUrl: ctx?.request?.header['x-shopify-shop-domain'],
          },
          populate: ['tenant'],
        });

      if (!ecommerceStore) {
        return ctx.notFound('Ecommerce store not found');
      }

      const contact = await strapi.db
        .query('api::ecommerce-contact-service.ecommerce-contact-service')
        .findOne({
          where: {
            ecommerceContactId: ctx?.request?.body?.id
              ? ctx?.request?.body?.id?.toString()
              : '',
          },
        });

      if (contact) {
        return;
      }

      try {
        const contactId = ctx?.request?.body?.id
          ? ctx?.request?.body?.id?.toString()
          : null;
        const firstName = `${ctx?.request?.body?.first_name ?? ''} ${
          ctx?.request?.body?.last_name ?? ''
        }`.trim();
        const email = ctx?.request?.body?.email ?? '';
        const address =
          `${ctx?.request?.body?.default_address?.address1}, ${ctx?.request?.body?.default_address?.city}, ${ctx?.request?.body?.default_address?.province}, ${ctx?.request?.body?.default_address?.country}` ??
          '';
        const phone = ctx?.request?.body?.phone ?? '';
        const tenantId = ecommerceStore?.tenant?.id ?? null;

        if (contactId && firstName && email && address && tenantId) {
          const ecommerceContact = await strapi.entityService.create(
            'api::ecommerce-contact-service.ecommerce-contact-service',
            {
              data: {
                ecommerceContactId: contactId,
                ecommerceType: 'shopify',
                isSynced: true,
                syncDate: new Date(),
                tenant: tenantId,
              },
            },
          );

          await strapi.entityService.create('api::contact.contact', {
            data: {
              fullName: firstName,
              email: email,
              address: address,
              phoneNumber: phone,
              tenant: tenantId,
              ecommerceContactServices: ecommerceContact,
            },
          });
        }

        ctx.body = {
          status: 200,
          message: 'Customer created successfully!',
        };
      } catch (error) {
        return new Error(error);
      }
    },
    async woocommerceContactWebhookController(ctx) {
      if (!ctx?.request?.body) {
        return ctx.badRequest('Request body is missing');
      }

      if (ctx?.request?.body?.role !== 'customer') {
        return;
      }

      const storeUrl = ctx?.request?.header['x-wc-webhook-source']
        ? ctx.request.header['x-wc-webhook-source'].replace(/\/$/, '')
        : '';

      const ecommerceStore = await strapi.db
        .query('api::ecommerce-detail.ecommerce-detail')
        .findOne({
          where: { ecommerceType: 'woocommerce', storeUrl: storeUrl },
          populate: ['tenant'],
        });

      if (!ecommerceStore) {
        return ctx.notFound('Ecommerce store not found');
      }

      try {
        const contactId = ctx?.request?.body?.id
          ? ctx?.request?.body?.id?.toString()
          : null;
        const firstName = ctx?.request?.body?.first_name ?? '';
        const lastName = ctx?.request?.body?.last_name ?? '';
        const email = ctx?.request?.body?.email ?? '';
        const address = ctx?.request?.body?.billing?.address1 ?? '';
        const phone = ctx?.request?.body?.billing?.phone ?? '';
        const tenantId = ecommerceStore?.tenant?.id ?? null;

        if (contactId && firstName && email && tenantId) {
          const contact = await strapi.entityService.create(
            'api::contact.contact',
            {
              data: {
                fullName: `${firstName} ${lastName}`,
                email: email,
                address: address ?? '',
                phoneNumber: phone ?? DEFAULT_PHONE_NUMBER,
                tenant: tenantId,
              },
            },
          );

          await strapi.entityService.create(
            'api::ecommerce-contact-service.ecommerce-contact-service',
            {
              data: {
                ecommerceContactId: contactId,
                ecommerceType: 'woocommerce',
                isSynced: true,
                syncDate: new Date(),
                contact: contact,
                tenant: tenantId,
              },
            },
          );
        }

        ctx.body = {
          status: 200,
          message: 'Customer created successfully!',
        };
      } catch (error) {
        throw new Error(error);
      }
    },
    async magentoContactWebhookController(ctx) {
      if (!ctx?.request?.body?.email) {
        return ctx.badRequest('Request body is missing');
      }

      const storeUrl = ctx?.request?.body?.shop_url
        ? ctx.request.body.shop_url.replace(/\/$/, '')
        : '';

      const ecommerceStore = await strapi.db
        .query('api::ecommerce-detail.ecommerce-detail')
        .findOne({
          where: { ecommerceType: 'magento', storeUrl: storeUrl },
          populate: ['tenant'],
        });

      if (!ecommerceStore) {
        return ctx.notFound('Ecommerce store not found');
      }

      try {
        const contactId = ctx?.request?.body?.id
          ? ctx?.request?.body?.id?.toString()
          : '';
        const firstName = ctx?.request?.body?.firstname ?? '';
        const lastName = ctx?.request?.body?.lastname ?? '';
        const tenantId = ecommerceStore?.tenant?.id ?? '';
        const email = ctx?.request?.body?.email ?? '';

        if (contactId && firstName && lastName && email && tenantId) {
          const contact = await strapi.entityService.create(
            'api::contact.contact',
            {
              data: {
                fullName: `${firstName} ${lastName}`,
                email: email,
                address: '',
                tenant: tenantId ?? null,
              },
            },
          );

          await strapi.entityService.create(
            'api::ecommerce-contact-service.ecommerce-contact-service',
            {
              data: {
                ecommerceContactId: contactId,
                ecommerceType: 'magento',
                isSynced: true,
                syncDate: new Date(),
                contact: contact,
                tenant: tenantId,
              },
            },
          );
        }

        ctx.body = {
          status: 200,
          message: 'Customer created successfully!',
        };
      } catch (error) {
        handleError('Magento :: Contact Webhook', error);
      }
    },
    async createContactOpenApiController(ctx) {
      const user = await strapi.plugins[
        'users-permissions'
      ].services.jwt.getToken(ctx);

      const owner = await strapi
        .query('plugin::users-permissions.user')
        .findOne({
          where: { id: user?.id },
          populate: ['tenant'],
        });
      const contactRequest = ctx?.request?.body;
      const files = ctx?.request?.files ?? {};
      const { image } = files;

      try {
        const existingContact = await strapi.entityService.findMany(
          'api::contact.contact',
          {
            filters: {
              email: {
                $eq: contactRequest?.email,
              },
              tenant: {
                id: {
                  $eq: owner?.tenant?.id ?? null,
                },
              },
            },
            limit: 1,
          },
        );

        if (existingContact.length > 0) {
          ctx.body = {
            status: 200,
            message: 'Contact already exists',
            data: existingContact[0],
          };
          return;
        }
        let uploadedImage;
        if (image) {
          uploadedImage = await strapi.plugins['upload'].services.upload.upload(
            {
              files: image,
              data: {},
            },
          );
        }

        const phoneNumbers = contactRequest?.phoneNumber;
        const customFields = contactRequest?.customFields;
        const notes = contactRequest?.notes;

        const response = await strapi.entityService.create(
          'api::contact.contact',
          {
            data: {
              fullName: contactRequest?.fullName ?? '',
              email: contactRequest?.email ?? '',
              address: contactRequest?.address ?? '',
              phoneNumber:
                typeof phoneNumbers == 'string'
                  ? phoneNumbers
                  : phoneNumbers?.length > 0
                  ? phoneNumbers[0]
                  : '',
              isCreatedByOpenApi: true,
              tenant: owner?.tenant?.id ?? null,
              avatar: uploadedImage ? uploadedImage[0]?.id : null,
              birthdayDate: contactRequest?.birthdayDate ?? null,
              anniversaryDate:
                contactRequest?.anniversaryDate ?? new Date().toISOString(),
              gender: contactRequest?.gender ?? null,
              leadSource: contactRequest?.contactSource ?? null,
              jobTitle: contactRequest?.jobTitle ?? null,
            },
          },
        );

        if (Array.isArray(notes) && notes.length > 0) {
          notes.map(async (note) => {
            await strapi.entityService.create('api::note.note', {
              data: {
                description: note,
                contact_id: response?.id,
              },
            });
          });
        } else if (typeof notes == 'string') {
          await strapi.entityService.create('api::note.note', {
            data: {
              description: notes,
              contact_id: response?.id,
            },
          });
        }

        if (Array.isArray(phoneNumbers)) {
          phoneNumbers.map(async (phoneNumber, index) => {
            if (index === 0) return;

            await strapi.entityService.create(
              'api::crm-additional-phone-number.crm-additional-phone-number',
              {
                data: {
                  contact: response?.id,
                  value: phoneNumber,
                },
              },
            );
          });
        }

        if (Array.isArray(customFields) && customFields.length > 0) {
          customFields.map(async (item) => {
            const fieldName = item.split(':')[0];
            const fieldValue = item.split(':')[1];
            const existingField = await strapi.entityService.findMany(
              'api::crm-custom-field-name.crm-custom-field-name',
              {
                filters: {
                  name: fieldName,
                  tenant: owner?.tenant?.id ?? null,
                  crmType: 'contact',
                },
                limit: 1,
              },
            );

            let fieldNameId;
            if (existingField.length > 0) {
              fieldNameId = existingField[0].id;
            } else {
              const fieldNameEntry = await strapi.entityService.create(
                'api::crm-custom-field-name.crm-custom-field-name',
                {
                  data: {
                    name: fieldName,
                    tenant: owner?.tenant?.id ?? null,
                    crmType: 'contact',
                  },
                },
              );

              fieldNameId = fieldNameEntry.id;
            }

            await strapi.entityService.create(
              'api::crm-custom-field-value.crm-custom-field-value',
              {
                data: {
                  value: fieldValue,
                  customFieldName: fieldNameId,
                  contact: response?.id,
                },
              },
            );
          });
        } else if (typeof customFields == 'string') {
          const fieldName = customFields.split(':')[0];
          const fieldValue = customFields.split(':')[1];
          const existingField = await strapi.entityService.findMany(
            'api::crm-custom-field-name.crm-custom-field-name',
            {
              filters: {
                name: fieldName,
                tenant: owner?.tenant?.id ?? null,
                crmType: 'contact',
              },
              limit: 1,
            },
          );

          let fieldNameId;
          if (existingField.length > 0) {
            fieldNameId = existingField[0].id;
          } else {
            const fieldNameEntry = await strapi.entityService.create(
              'api::crm-custom-field-name.crm-custom-field-name',
              {
                data: {
                  name: fieldName,
                  tenant: owner?.tenant?.id ?? null,
                  crmType: 'contact',
                },
              },
            );

            fieldNameId = fieldNameEntry.id;
          }

          await strapi.entityService.create(
            'api::crm-custom-field-value.crm-custom-field-value',
            {
              data: {
                value: fieldValue,
                customFieldName: fieldNameId,
                contact: response?.id,
              },
            },
          );
        }

        ctx.body = {
          status: 200,
          message: 'Contact created successfully!',
          data: response,
        };
      } catch (error) {
        console.log('contact create error', error);
        ctx.body = {
          status: 500,
          error: error,
          message: 'Internal server error',
        };
      }
    },
    async updateContacts() {
      const contacts = await strapi.entityService.findMany(
        'api::contact.contact',
      );

      await Promise.all(
        contacts.map((contact) => {
          strapi.entityService.update('api::contact.contact', contact.id, {
            data: {
              marketingOptIn:
                'N_A' as NexusGenEnums['ENUM_CONTACT_MARKETINGOPTIN'],
            },
          });
        }),
      );
    },
    async getContactsOpenApiController(ctx) {
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
        const { pageSize = 100, page } = ctx.query;
        const contacts = await strapi.entityService.findMany(
          'api::contact.contact',
          {
            filters: {
              tenant: {
                id: {
                  $eq: owner?.tenant?.id,
                },
              },
            },
            sort: [{ id: 'desc' }],
            limit: parseInt(pageSize),
            start: (parseInt(page || 1) - 1) * parseInt(pageSize),
          },
        );
        ctx.body = {
          status: 200,
          message: 'Contacts fetched successfully!',
          data: contacts,
        };
      } catch (error) {
        ctx.body = {
          status: 500,
          error: error,
          message: 'Internal server error',
        };
      }
    },
    async getContactByIdOpenApiController(ctx) {
      try {
        const { id, email } = ctx.query;

        // Validate that at least one parameter is provided
        if (!id && !email) {
          return ctx.badRequest('Either id or email is required');
        }

        let contact;

        if (id) {
          // Find contact by ID
          contact = await strapi.entityService.findOne(
            'api::contact.contact',
            id,
          );
        } else if (email) {
          // Find contact by email
          contact = await strapi.entityService.findMany(
            'api::contact.contact',
            {
              filters: { email: email },
            },
          );

          // Return the first match if found, since email should be unique
          contact = contact && contact.length > 0 ? contact[0] : null;
        }

        if (!contact) {
          ctx.body = {
            status: 200,
            message: 'Contact not found',
            data: null,
            found: false,
          };
          return;
        }

        ctx.body = {
          status: 200,
          message: 'Contact fetched successfully!',
          data: contact,
          found: true,
        };
      } catch (error) {
        ctx.body = {
          status: 500,
          error: error,
          message: 'Internal server error',
        };
      }
    },
  }),
);
