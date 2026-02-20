import { handleError } from '../../../../helpers/errors';
import { stringNormalizer } from '../../../../helpers/formatter';

export const batchFindContactsForRelations = async (
  normalizedFields: any[],
  tenantId: number,
): Promise<Map<string, any>> => {
  // Collect all unique contact emails from both "from" and "to" fields
  const fromEmails = normalizedFields
    .map((relation) => relation?.fromContact)
    .filter(Boolean)
    .map((email) => stringNormalizer(email));

  const toEmails = normalizedFields
    .map((relation) => relation?.toContact)
    .filter(Boolean)
    .map((email) => stringNormalizer(email));

  const allEmails = Array.from(new Set([...fromEmails, ...toEmails]));

  if (allEmails.length === 0) {
    return new Map();
  }

  try {
    // Single batch query for all contacts
    const contacts = await strapi.entityService.findMany(
      'api::contact.contact',
      {
        filters: {
          email: { $in: allEmails },
          tenant: { id: { $eq: tenantId } },
        },
        fields: ['id', 'email'],
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
    handleError('batchFindContactsForRelations', undefined, error);
    return new Map();
  }
};

export const batchFindOrCreateRelationTypes = async (
  normalizedFields: any[],
  tenantId,
): Promise<Map<string, any>> => {
  // Collect all unique relation type names
  const relationTypeNames = Array.from(
    new Set(
      normalizedFields
        .map((relation) => relation?.relationType)
        .filter(Boolean)
        .map((name) => name.trim()),
    ),
  );

  if (relationTypeNames.length === 0) {
    return new Map();
  }

  try {
    // Step 1: Find existing relation types
    const existingRelationTypes = await strapi.entityService.findMany(
      'api::crm-relation-type.crm-relation-type',
      {
        filters: {
          name: { $in: relationTypeNames },
          tenant: tenantId,
        },
        fields: ['id', 'name'],
      },
    );

    const relationTypesMap = new Map<string, any>();

    if (Array.isArray(existingRelationTypes)) {
      existingRelationTypes.forEach((relationType) => {
        if (relationType.name) {
          relationTypesMap.set(relationType.name.trim(), relationType);
        }
      });
    }

    // Step 2: Identify missing relation types
    const missingRelationTypes = relationTypeNames.filter(
      (name) => !relationTypesMap.has(name.trim()),
    );

    // Step 3: Create missing relation types in parallel
    if (missingRelationTypes.length > 0) {
      const createdRelationTypes = await Promise.all(
        missingRelationTypes.map((name) =>
          strapi.entityService.create(
            'api::crm-relation-type.crm-relation-type',
            {
              data: {
                name: name.trim(),
                tenant: tenantId,
              },
            },
          ),
        ),
      );

      // Add newly created relation types to the map
      createdRelationTypes.forEach((relationType) => {
        if (relationType?.name) {
          relationTypesMap.set(relationType.name.trim(), relationType);
        }
      });
    }

    return relationTypesMap;
  } catch (error) {
    handleError('batchFindOrCreateRelationTypes', undefined, error);
    return new Map();
  }
};
