import { ID } from '@strapi/strapi/lib/services/entity-service/types/params/attributes';
import axios from 'axios';
import { GraphQLFieldResolver } from 'graphql';
import Papa from 'papaparse';
import { getTenantFilter } from '../../dealTransaction/helpers/helpers';
import { NexusGenInputs } from './../../../../types/generated/graphql';
import { APP_ID } from './../../../models/product/helpers/importing/variables';

export const revertImportingSession: GraphQLFieldResolver<
  null,
  Graphql.ResolverContext,
  { input: NexusGenInputs['RevertImportingSessionInput'] }
> = async (root, { input }, ctx) => {
  const tenantFilter = await getTenantFilter(ctx.state.user.id);

  const pickedSession = await strapi.entityService.findOne(
    'api::importing-session.importing-session',
    input?.sessionId as ID,
    { populate: ['cmpltdImports'] },
  );

  if (!pickedSession?.cmpltdImports?.url) {
    throw new Error('No import file URL found.');
  }

  try {
    const response = await axios.get(pickedSession.cmpltdImports.url, {
      responseType: 'text',
    });

    const csvText = response.data;

    const parsed = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
    });

    if (parsed.errors.length) {
      console.error('CSV parsing errors:', parsed.errors);
      throw new Error('Failed to parse CSV file.');
    }

    const jsonData: any[] = parsed.data;
    let fetchedEntities = [];

    let idsToDelete: any = {};
    switch (pickedSession.type) {
      case 'orders':
        fetchedEntities = await strapi.entityService.findMany(
          'api::order.order',
          {
            filters: {
              orderId: { $in: jsonData.map((el) => el?.[APP_ID]) },
              ...tenantFilter,
            },
            populate: [
              'products',
              'classes',
              'services',
              'compositeProducts',
              'memberships',
              'dealTransactions',
            ],
          },
        );

        idsToDelete = {
          products: [],
          classes: [],
          services: [],
          compositeProducts: [],
          memberships: [],
          dealTransactions: [],
        };

        for (const entity of fetchedEntities) {
          if (entity.products)
            idsToDelete.products.push(...entity.products.map((p: any) => p.id));
          if (entity.classes)
            idsToDelete.classes.push(...entity.classes.map((c: any) => c.id));
          if (entity.services)
            idsToDelete.services.push(...entity.services.map((s: any) => s.id));
          if (entity.compositeProducts)
            idsToDelete.compositeProducts.push(
              ...entity.compositeProducts.map((cp: any) => cp.id),
            );
          if (entity.memberships)
            idsToDelete.memberships.push(
              ...entity.memberships.map((m: any) => m.id),
            );
          if (entity.dealTransactions)
            idsToDelete.dealTransactions.push(
              ...entity.dealTransactions.map((d: any) => d.id),
            );
        }

        await Promise.all([
          ...idsToDelete.products.map((id) =>
            strapi.entityService.delete('api::product.product', id),
          ),
          ...idsToDelete.classes.map((id) =>
            strapi.entityService.delete('api::class.class', id),
          ),
          ...idsToDelete.services.map((id) =>
            strapi.entityService.delete('api::service.service', id),
          ),
          ...idsToDelete.compositeProducts.map((id) =>
            strapi.entityService.delete(
              'api::composite-product.composite-product',
              id,
            ),
          ),
          ...idsToDelete.memberships.map((id) =>
            strapi.entityService.delete('api::membership.membership', id),
          ),
          ...idsToDelete.dealTransactions.map((id) =>
            strapi.entityService.delete(
              'api::deal-transaction.deal-transaction',
              id,
            ),
          ),
        ]);
        break;

      case 'products':
        fetchedEntities = await strapi.entityService.findMany(
          'api::product.product',
          {
            filters: {
              productId: { $in: jsonData.map((el) => el?.[APP_ID]) },
              ...tenantFilter,
            },
          },
        );
        break;

      case 'contacts':
        fetchedEntities = await strapi.entityService.findMany(
          'api::contact.contact',
          {
            filters: {
              email: { $in: jsonData.map((el) => el?.EMAIL) },
              ...tenantFilter,
            },
          },
        );
        break;

      case 'contactRelations':
        fetchedEntities = await strapi.entityService.findMany(
          'api::crm-relation.crm-relation',
          {
            filters: {
              and: [
                {
                  fromContact: {
                    email: { $in: jsonData.map((el) => el?.FROM_CONTACT) },
                  },
                },
                {
                  toContact: {
                    email: { $in: jsonData.map((el) => el?.TO_CONTACT) },
                  },
                },
              ],
              ...tenantFilter,
            } as any,
          },
        );
        break;

      case 'wishlist':
        fetchedEntities = await strapi.entityService.findMany(
          'api::todo.todo',
          {
            filters: {
              contact_id: { email: { $in: jsonData.map((el) => el?.CONTACT) } },
              wishableProduct: {
                id: { $in: jsonData.map((el) => el?.CONTACT) },
              },
              ...tenantFilter,
            },
          },
        );
        break;

      case 'companies':
        fetchedEntities = await strapi.entityService.findMany(
          'api::company.company',
          {
            filters: {
              email: { $in: jsonData.map((el) => el?.EMAIL) },
              ...tenantFilter,
            },
          },
        );
        break;

      default:
        throw new Error('Invalid importing identifier');
    }

    //TODO(Valentin) finish the logic
  } catch (error) {
    console.error('Error processing CSV:', error);
    throw new Error('Failed to download or parse CSV file.');
  }

  return null;
};
