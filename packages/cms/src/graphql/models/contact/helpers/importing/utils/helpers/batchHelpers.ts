import { handleError } from '../../../../../../../graphql/helpers/errors';
import { stringNormalizer } from '../../../../../../../graphql/helpers/formatter';
import { DEFAULT_EMAIL } from '../../../../../../constants/defaultValues';

export const batchFindContacts = async (
  normalizedFields: any[],
  tenantId: number,
): Promise<Map<string, any>> => {
  // Collect all unique contact emails, excluding DEFAULT_EMAIL
  const contactEmails = Array.from(
    new Set(
      normalizedFields
        .map((contact) => contact?.email)
        .filter(Boolean)
        .filter(
          (email) =>
            stringNormalizer(email) !== stringNormalizer(DEFAULT_EMAIL),
        )
        .map((email) => stringNormalizer(email)),
    ),
  );

  if (contactEmails.length === 0) {
    return new Map();
  }

  try {
    // Single batch query for all contacts
    const contacts = await strapi.entityService.findMany(
      'api::contact.contact',
      {
        filters: {
          email: { $in: contactEmails },
          tenant: { id: { $eq: tenantId } },
        },
        fields: ['id', 'email', 'uuid'],
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
    handleError('batchFindContacts', undefined, error);
    return new Map();
  }
};

export const batchFindLeadOwners = async (
  normalizedFields: any[],
  tenantId,
): Promise<Map<string, any>> => {
  // Collect all unique lead owner emails
  const leadOwnerEmails = Array.from(
    new Set(
      normalizedFields
        .map((contact) => contact?.leadOwner)
        .filter(Boolean)
        .map((email) => email.trim()),
    ),
  );

  if (leadOwnerEmails.length === 0) {
    return new Map();
  }

  try {
    // Single batch query for all lead owners (users)
    const leadOwners = await strapi.entityService.findMany(
      'plugin::users-permissions.user',
      {
        filters: {
          email: { $in: leadOwnerEmails },
          tenant: tenantId,
        },
        fields: ['id', 'email'],
      },
    );

    const leadOwnersMap = new Map<string, any>();

    if (Array.isArray(leadOwners)) {
      leadOwners.forEach((user) => {
        if (user.email) {
          leadOwnersMap.set(user.email.trim(), user);
        }
      });
    }

    return leadOwnersMap;
  } catch (error) {
    handleError('batchFindLeadOwners', undefined, error);
    return new Map();
  }
};

export const batchFindAvatarFiles = async (
  normalizedFields: any[],
): Promise<Map<string, any>> => {
  // Collect all unique avatar file IDs
  const avatarIds = Array.from(
    new Set(
      normalizedFields
        .map((contact) => contact?.avatar)
        .filter(Boolean)
        .filter((id) => !isNaN(Number(id))) // Only valid numeric IDs
        .map((id) => Number(id)),
    ),
  );

  if (avatarIds.length === 0) {
    return new Map();
  }

  try {
    // Single batch query for all avatar files
    const avatarFiles = await strapi.entityService.findMany(
      'plugin::upload.file',
      {
        filters: {
          id: { $in: avatarIds },
        },
        fields: ['id', 'name', 'url'],
      },
    );

    const avatarFilesMap = new Map<string, any>();

    if (Array.isArray(avatarFiles)) {
      avatarFiles.forEach((file) => {
        if (file.id) {
          avatarFilesMap.set(String(file.id), file);
        }
      });
    }

    return avatarFilesMap;
  } catch (error) {
    handleError('batchFindAvatarFiles', undefined, error);
    return new Map();
  }
};

export const batchFindOrCreateCustomFieldNames = async (
  normalizedFields: any[],
  tenantId: number,
  crmType: 'contact' | 'company' | 'lead' = 'contact',
): Promise<Map<string, number>> => {
  // Collect all unique custom field names from all contacts
  const allCustomFieldNames = new Set<string>();
  for (const contact of normalizedFields) {
    if (contact?.customFields && typeof contact.customFields === 'object') {
      for (const fieldName of Object.keys(contact.customFields)) {
        if (fieldName && fieldName.trim()) {
          allCustomFieldNames.add(fieldName.trim());
        }
      }
    }
  }

  if (allCustomFieldNames.size === 0) {
    return new Map();
  }

  const customFieldNamesArray = Array.from(allCustomFieldNames);

  try {
    // Single batch query for all existing custom field names
    const existingFields = await strapi.entityService.findMany(
      'api::crm-custom-field-name.crm-custom-field-name',
      {
        filters: {
          tenant: { id: { $eq: tenantId } },
          name: { $in: customFieldNamesArray },
          crmType: crmType,
        },
        fields: ['id', 'name'],
      },
    );

    // Build map from existing fields (deduplicated by name - take first one)
    const customFieldNamesMap = new Map<string, number>();
    if (Array.isArray(existingFields)) {
      for (const field of existingFields) {
        if (field.name && !customFieldNamesMap.has(field.name)) {
          customFieldNamesMap.set(field.name, Number(field.id));
        }
      }
    }

    // Find which field names need to be created
    const missingFieldNames = customFieldNamesArray.filter(
      (name) => !customFieldNamesMap.has(name),
    );

    // Create missing field names SEQUENTIALLY to avoid race conditions
    for (const fieldName of missingFieldNames) {
      const newField = await strapi.entityService.create(
        'api::crm-custom-field-name.crm-custom-field-name',
        {
          data: {
            name: fieldName,
            tenant: tenantId,
            crmType: crmType,
          },
        },
      );
      if (newField?.id) {
        customFieldNamesMap.set(fieldName, Number(newField.id));
      }
    }

    return customFieldNamesMap;
  } catch (error) {
    handleError('batchFindOrCreateCustomFieldNames', undefined, error);
    return new Map();
  }
};
