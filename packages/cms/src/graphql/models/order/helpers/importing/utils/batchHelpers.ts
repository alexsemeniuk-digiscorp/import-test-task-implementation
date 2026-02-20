import { handleError } from '../../../../../helpers/errors';
import { stringNormalizer } from '../../../../../helpers/formatter';

export const batchFindCustomers = async (
  normalizedFields: any[],
  tenantId: number,
): Promise<{
  contactsMap: Map<string, any>;
  companiesMap: Map<string, any>;
}> => {
  // Collect all unique customer emails
  const customerEmails = Array.from(
    new Set(
      normalizedFields
        .map((order) => order?.customer)
        .filter(Boolean)
        .map((email) => stringNormalizer(email)),
    ),
  );

  if (customerEmails.length === 0) {
    return { contactsMap: new Map(), companiesMap: new Map() };
  }

  try {
    const [contacts, companies] = await Promise.all([
      strapi.entityService.findMany('api::contact.contact', {
        filters: {
          email: { $in: customerEmails },
          tenant: { id: { $eq: tenantId } },
        },
        fields: ['id', 'email'],
      }),
      strapi.entityService.findMany('api::company.company', {
        filters: {
          email: { $in: customerEmails },
          tenant: { id: { $eq: tenantId } },
        },
        fields: ['id', 'email'],
      }),
    ]);

    const contactsMap = new Map<string, any>();
    const companiesMap = new Map<string, any>();

    if (Array.isArray(contacts)) {
      contacts.forEach((contact) => {
        if (contact.email) {
          contactsMap.set(contact.email, contact);
        }
      });
    }

    if (Array.isArray(companies)) {
      companies.forEach((company) => {
        if (company.email) {
          companiesMap.set(company.email, company);
        }
      });
    }

    return { contactsMap, companiesMap };
  } catch (error) {
    handleError('batchFindCustomers', undefined, error);
    return { contactsMap: new Map(), companiesMap: new Map() };
  }
};

export const batchFindEmployees = async (
  normalizedFields: any[],
  tenantId,
): Promise<Map<string, any>> => {
  const employeeEmails = Array.from(
    new Set(
      normalizedFields
        .map((order) => order?.employee)
        .filter(Boolean)
        .map((email) => email.trim()),
    ),
  );

  if (employeeEmails.length === 0) {
    return new Map();
  }

  try {
    const employees = await strapi.entityService.findMany(
      'plugin::users-permissions.user',
      {
        filters: {
          email: { $in: employeeEmails },
          tenant: tenantId,
        },
        fields: ['id', 'email'],
      },
    );

    const employeesMap = new Map<string, any>();
    if (Array.isArray(employees)) {
      employees.forEach((employee) => {
        if (employee.email) {
          employeesMap.set(employee.email.trim(), employee);
        }
      });
    }

    return employeesMap;
  } catch (error) {
    handleError('batchFindEmployees', undefined, error);
    return new Map();
  }
};

export const batchFindBusinessLocations = async (
  normalizedFields: any[],
  tenantId,
): Promise<Map<string, any>> => {
  const businessLocationIds = Array.from(
    new Set(
      normalizedFields
        .map((order) => order?.businessLocation)
        .filter(Boolean)
        .map((id) => id.trim()),
    ),
  );

  if (businessLocationIds.length === 0) {
    return new Map();
  }

  try {
    const businessLocations = await strapi.entityService.findMany(
      'api::business-location.business-location',
      {
        filters: {
          businessLocationId: { $in: businessLocationIds },
          tenant: tenantId,
        },
        fields: ['id', 'businessLocationId'],
      },
    );

    const businessLocationsMap = new Map<string, any>();
    if (Array.isArray(businessLocations)) {
      businessLocations.forEach((location) => {
        if (location.businessLocationId) {
          businessLocationsMap.set(
            location.businessLocationId.trim(),
            location,
          );
        }
      });
    }

    return businessLocationsMap;
  } catch (error) {
    handleError('batchFindBusinessLocations', undefined, error);
    return new Map();
  }
};

export const batchFindInventoryItems = async (
  normalizedFields: any[],
  tenantFilter: any,
): Promise<{
  productsMap: Map<string, any>;
  servicesMap: Map<string, any>;
  classesMap: Map<string, any>;
  membershipsMap: Map<string, any>;
}> => {
  // Collect all unique product IDs from all orders
  const allProductIds = Array.from(
    new Set(
      normalizedFields.flatMap((order) =>
        (order?.products || [])
          .map((product: any) => product?.productId)
          .filter(Boolean),
      ),
    ),
  );

  if (allProductIds.length === 0) {
    return {
      productsMap: new Map(),
      servicesMap: new Map(),
      classesMap: new Map(),
      membershipsMap: new Map(),
    };
  }

  try {
    const [products, services, classes, memberships] = await Promise.all([
      strapi.entityService.findMany('api::product.product', {
        filters: {
          productId: { $in: allProductIds },
          tenant: { id: { $eq: tenantFilter?.tenant } },
        },
        fields: ['id', 'productId'],
      }),
      strapi.entityService.findMany('api::service.service', {
        filters: {
          serviceId: { $in: allProductIds },
          tenant: { id: { $eq: tenantFilter?.tenant } },
        },
        fields: ['id', 'serviceId'],
      }),
      strapi.entityService.findMany('api::class.class', {
        filters: {
          classId: { $in: allProductIds },
          tenant: { id: { $eq: tenantFilter?.tenant } },
        },
        fields: ['id', 'classId'],
      }),
      strapi.entityService.findMany('api::membership.membership', {
        filters: {
          membershipId: { $in: allProductIds },
          tenant: { id: { $eq: tenantFilter?.tenant } },
        },
        fields: ['id', 'membershipId'],
      }),
    ]);

    const productsMap = new Map<string, any>();
    const servicesMap = new Map<string, any>();
    const classesMap = new Map<string, any>();
    const membershipsMap = new Map<string, any>();

    if (Array.isArray(products)) {
      products.forEach((product) => {
        if (product.productId) {
          productsMap.set(product.productId, {
            id: product.id,
            regexedId: product.productId,
          });
        }
      });
    }

    if (Array.isArray(services)) {
      services.forEach((service) => {
        if (service.serviceId) {
          servicesMap.set(service.serviceId, {
            id: service.id,
            regexedId: service.serviceId,
          });
        }
      });
    }

    if (Array.isArray(classes)) {
      classes.forEach((cls) => {
        if (cls.classId) {
          classesMap.set(cls.classId, {
            id: cls.id,
            regexedId: cls.classId,
          });
        }
      });
    }

    if (Array.isArray(memberships)) {
      memberships.forEach((membership) => {
        if (membership.membershipId) {
          membershipsMap.set(membership.membershipId, {
            id: membership.id,
            regexedId: membership.membershipId,
          });
        }
      });
    }

    return { productsMap, servicesMap, classesMap, membershipsMap };
  } catch (error) {
    handleError('batchFindInventoryItems', undefined, error);
    return {
      productsMap: new Map(),
      servicesMap: new Map(),
      classesMap: new Map(),
      membershipsMap: new Map(),
    };
  }
};

export const batchFindTaxes = async (
  normalizedFields: any[],
  tenantFilter: any,
): Promise<Map<string, any>> => {
  // Collect all unique tax names from all orders
  const allTaxNames = Array.from(
    new Set(
      normalizedFields.flatMap((order) =>
        (order?.products || [])
          .map((product: any) => product?.taxName)
          .filter(Boolean),
      ),
    ),
  );

  if (allTaxNames.length === 0) {
    return new Map();
  }

  try {
    const taxes = await strapi.entityService.findMany('api::tax.tax', {
      filters: {
        name: { $in: allTaxNames },
        tenant: tenantFilter.tenant,
      },
      fields: ['id', 'name'],
    });

    const taxesMap = new Map<string, any>();
    if (Array.isArray(taxes)) {
      taxes.forEach((tax) => {
        if (tax.name) {
          taxesMap.set(tax.name, tax);
        }
      });
    }

    return taxesMap;
  } catch (error) {
    handleError('batchFindTaxes', undefined, error);
    return new Map();
  }
};

export const batchFindProductInventoryItems = async (
  normalizedFields: any[],
  businessLocationsMap: Map<string, any>,
  productsMap: Map<string, any>,
  tenantFilter: any,
): Promise<Map<string, any>> => {
  // Collect all unique combinations of productId + businessLocationId
  const productBusinessLocationPairs = new Set<string>();

  normalizedFields.forEach((order) => {
    const businessLocation = order?.businessLocation;
    const businessLocationId =
      businessLocation && businessLocationsMap.has(businessLocation)
        ? businessLocationsMap.get(businessLocation).id
        : null;

    if (businessLocationId && order?.products) {
      order.products.forEach((product: any) => {
        if (product?.productId && productsMap.has(product.productId)) {
          const productId = productsMap.get(product.productId).id;
          productBusinessLocationPairs.add(
            `${productId}_${businessLocationId}`,
          );
        }
      });
    }
  });

  if (productBusinessLocationPairs.size === 0) {
    return new Map();
  }

  try {
    // Extract unique product IDs and business location IDs
    const pairs = Array.from(productBusinessLocationPairs).map((pair) => {
      const [productId, businessLocationId] = pair.split('_');
      return {
        productId: Number(productId),
        businessLocationId: Number(businessLocationId),
      };
    });

    const productIds = Array.from(new Set(pairs.map((p) => p.productId)));
    const businessLocationIds = Array.from(
      new Set(pairs.map((p) => p.businessLocationId)),
    );

    // Fetch all product inventory items for these combinations
    const productInventoryItems = await strapi.entityService.findMany(
      'api::product-inventory-item.product-inventory-item',
      {
        filters: {
          product: { id: { $in: productIds } },
          businessLocation: { id: { $in: businessLocationIds } },
          tenant: tenantFilter.tenant,
        },
        populate: {
          product: { fields: ['id', 'productId'] },
          businessLocation: { fields: ['id'] },
          serializes: { fields: ['id', 'name'] },
        },
      },
    );

    const inventoryItemsMap = new Map<string, any>();
    if (Array.isArray(productInventoryItems)) {
      productInventoryItems.forEach((item) => {
        if (item.product?.id && item.businessLocation?.id) {
          const key = `${item.product.id}_${item.businessLocation.id}`;
          inventoryItemsMap.set(key, item);
        }
      });
    }

    return inventoryItemsMap;
  } catch (error) {
    handleError('batchFindProductInventoryItems', undefined, error);
    return new Map();
  }
};

export const batchFindSerialNumbers = async (
  normalizedFields: any[],
): Promise<Map<string, any>> => {
  // Collect all unique serial numbers from all orders
  const allSerialNumbers = Array.from(
    new Set(
      normalizedFields.flatMap((order) =>
        (order?.products || []).flatMap((product: any) =>
          (product?.serialNumbers || []).filter(Boolean),
        ),
      ),
    ),
  );

  if (allSerialNumbers.length === 0) {
    return new Map();
  }

  try {
    const serialNumbers = await strapi.entityService.findMany(
      'api::inventory-serialize.inventory-serialize',
      {
        filters: {
          name: { $in: allSerialNumbers },
        },
        fields: ['name', 'id'],
        populate: {
          productInventoryItem: { fields: ['id'] },
          sellingProductOrderItem: { fields: ['id'] },
          returnItem: { fields: ['id'] },
          inventoryAdjustmentItem: { fields: ['id'] },
          transferOrderItem: { fields: ['id'] },
        },
      },
    );

    const serialNumbersMap = new Map<string, any>();
    if (Array.isArray(serialNumbers)) {
      serialNumbers.forEach((sn) => {
        if (sn.name) {
          serialNumbersMap.set(sn.name, sn);
        }
      });
    }

    return serialNumbersMap;
  } catch (error) {
    handleError('batchFindSerialNumbers', undefined, error);
    return new Map();
  }
};

export const findDefaultTax = async () => {
  try {
    const taxes = await strapi.entityService.findMany('api::tax.tax', {
      filters: {
        name: { $eq: 'DEFAULT TAX FOR PLATFORM' },
      },
      fields: ['id'],
    });

    return taxes?.[0]?.id;
  } catch (error) {
    handleError('findDefaultTax', undefined, error);
    return undefined;
  }
};
