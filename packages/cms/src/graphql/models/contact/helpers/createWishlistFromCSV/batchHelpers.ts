import { handleError } from '../../../../helpers/errors';
import { stringNormalizer } from '../../../../helpers/formatter';

export const batchFindContactsForWishlist = async (
  normalizedFields: any[],
  tenantId: number,
): Promise<Map<string, any>> => {
  // Collect all unique contact emails
  const contactEmails = Array.from(
    new Set(
      normalizedFields
        .map((item) => item?.contact)
        .filter(Boolean)
        .map((email) => stringNormalizer(email)),
    ),
  );

  if (contactEmails.length === 0) {
    return new Map();
  }

  try {
    // Single batch query for all contacts with their existing wishlist (todos)
    const contacts = await strapi.entityService.findMany(
      'api::contact.contact',
      {
        filters: {
          email: { $in: contactEmails },
          tenant: { id: { $eq: tenantId } },
        },
        fields: ['id', 'email'],
        populate: {
          todos: {
            fields: ['id'],
            populate: {
              wishableProduct: {
                fields: ['id', 'productId'],
              },
            },
          },
        },
      },
    );

    const contactsMap = new Map<string, any>();

    if (Array.isArray(contacts)) {
      contacts.forEach((contact) => {
        if (contact.email) {
          contactsMap.set(stringNormalizer(contact.email), contact);
        }
      });
    }

    return contactsMap;
  } catch (error) {
    handleError('batchFindContactsForWishlist', undefined, error);
    return new Map();
  }
};

export const batchFindProductsForWishlist = async (
  normalizedFields: any[],
): Promise<Map<string, any>> => {
  // Collect all unique product IDs from all wishlist items
  const allProductIds = normalizedFields
    .flatMap((item) => item?.products || [])
    .filter(Boolean);

  const uniqueProductIds = Array.from(new Set(allProductIds));

  if (uniqueProductIds.length === 0) {
    return new Map();
  }

  try {
    // Single batch query for all products
    const products = await strapi.entityService.findMany(
      'api::product.product',
      {
        filters: {
          productId: { $in: uniqueProductIds },
        },
        fields: ['id', 'productId'],
      },
    );

    const productsMap = new Map<string, any>();

    if (Array.isArray(products)) {
      products.forEach((product) => {
        if (product.productId) {
          productsMap.set(product.productId, product);
        }
      });
    }

    return productsMap;
  } catch (error) {
    handleError('batchFindProductsForWishlist', undefined, error);
    return new Map();
  }
};
