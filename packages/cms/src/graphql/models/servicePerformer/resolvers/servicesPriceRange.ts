import { ID } from '@strapi/strapi/lib/services/entity-service/types/params/attributes';
import { GraphQLFieldResolver } from 'graphql';

export const servicesPriceRange: GraphQLFieldResolver<
  any,
  Graphql.ResolverContext,
  { id: ID }
> = async (root, { id }) => {
  const services = await strapi.entityService.findMany(
    'api::service-performer.service-performer',
    {
      filters: {
        serviceLocationInfo: { businessLocation: { id, type: 'store' } },
        active: true,
      },
    },
  );

  if (!services || services.length === 0) {
    return { minPrice: 0, maxPrice: 0 };
  }

  const priceList = services
    .map((service) => service.price)
    .filter((price) => price);

  return { minPrice: Math.min(...priceList), maxPrice: Math.max(...priceList) };
};
