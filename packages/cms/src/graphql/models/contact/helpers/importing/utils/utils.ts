import { paginatedCreationsData } from './../../../../../../api/redis/helpers/variables/importingVariables';
import redis from './../../../../../../api/redis/redis';
import { handleError } from './../../../../../helpers/errors';
import { defaultContactsKeys } from './../utils/variables';

export const handleCustomFields = async (
  customFields,
  cameCustomFields,
  foundCustomFieldNames,
  tenantId,
  createdContactId,
) => {
  const newFieldPromises = cameCustomFields.map(async (fieldName) => {
    // First check if field name was created by another parallel contact
    const existingField = await strapi.entityService.findMany(
      'api::crm-custom-field-name.crm-custom-field-name',
      {
        filters: {
          tenant: { id: { $eq: tenantId } },
          name: { $eq: fieldName },
          crmType: 'contact',
        },
        fields: ['id', 'name'],
        limit: 1,
      },
    );

    let customFieldNameId: number | undefined;

    if (existingField?.[0]?.id) {
      // Use existing field name (created by another parallel contact)
      customFieldNameId = Number(existingField[0].id);
    } else {
      // Create new field name
      const newCustomFieldName = await strapi.entityService.create(
        'api::crm-custom-field-name.crm-custom-field-name',
        {
          data: {
            name: fieldName,
            tenant: tenantId,
            crmType: 'contact',
          },
        },
      );
      if (!newCustomFieldName?.id) return;
      customFieldNameId = Number(newCustomFieldName.id);
    }

    if (!customFields[fieldName]) return;
    return strapi.entityService.create(
      'api::crm-custom-field-value.crm-custom-field-value',
      {
        data: {
          value: customFields[fieldName],
          customFieldName: customFieldNameId,
          contact: createdContactId,
        },
      },
    );
  });

  const existingFieldPromises = foundCustomFieldNames.map(
    async (customField) => {
      return strapi.entityService.create(
        'api::crm-custom-field-value.crm-custom-field-value',
        {
          data: {
            value: customFields[customField.name],
            customFieldName: customField.id,
            contact: createdContactId,
          },
        },
      );
    },
  );

  await Promise.all([...newFieldPromises, ...existingFieldPromises]);
};

export const filterContactKeys = (contact) => {
  const filteredContact = {};

  for (const key of defaultContactsKeys) {
    if (key in contact) {
      filteredContact[key] = contact[key];
    }
  }

  return filteredContact;
};

export const createNotesForContact = async (
  parsedContact,
  createdContactId,
  crmKey = 'contact_id',
) => {
  if (parsedContact?.notes && parsedContact?.notes.length > 0) {
    await Promise.all(
      parsedContact.notes.map(async (note) => {
        if (note.note !== '') {
          await strapi.entityService.create('api::note.note', {
            data: {
              [crmKey]: createdContactId,
              description: note.note,
              customCreationDate: note?.noteCreationDate
                ? new Date(note.noteCreationDate)
                : new Date(),
              _skipCreateActivityAfterCreateNote: true,
            },
          });
        }
      }),
    );
  }
};

export const processCustomFields = async (
  customFields,
  { tenantId, crmType, contactId, customFieldNamesMap },
) => {
  try {
    if (!customFields || Object.keys(customFields).length === 0) return;

    // If pre-fetched map is provided, use it directly (no query needed)
    if (customFieldNamesMap && customFieldNamesMap.size > 0) {
      const valuePromises = Object.entries(customFields).map(
        async ([fieldName, fieldValue]) => {
          const fieldNameId = customFieldNamesMap.get(fieldName);
          if (fieldNameId && fieldValue) {
            return strapi.entityService.create(
              'api::crm-custom-field-value.crm-custom-field-value',
              {
                data: {
                  value: String(fieldValue),
                  customFieldName: fieldNameId,
                  contact: contactId,
                },
              },
            );
          }
        },
      );
      await Promise.all(valuePromises);
      return;
    }

    // Fallback for cases without pre-fetched map (e.g., single contact updates)
    const foundCustomFieldNames = await strapi.entityService.findMany(
      'api::crm-custom-field-name.crm-custom-field-name',
      {
        filters: {
          tenant: {
            id: {
              $eq: tenantId,
            },
          },
          name: {
            $in: Object.keys(customFields),
          },
          crmType: crmType,
        },
        fields: ['id', 'name'],
      },
    );

    // Deduplicate by name to handle duplicate custom field names in DB
    const uniqueFieldNamesMap = new Map<
      string,
      (typeof foundCustomFieldNames)[0]
    >();
    for (const field of foundCustomFieldNames) {
      if (!uniqueFieldNamesMap.has(field.name)) {
        uniqueFieldNamesMap.set(field.name, field);
      }
    }
    const deduplicatedFieldNames = Array.from(uniqueFieldNamesMap.values());

    const cameCustomFields = Object.keys(customFields).filter(
      (field) =>
        !deduplicatedFieldNames.map((item) => item.name).includes(field),
    );
    if (Object.keys(customFields).length > 0) {
      await handleCustomFields(
        customFields,
        cameCustomFields,
        deduplicatedFieldNames,
        tenantId,
        contactId,
      );
    }
  } catch (e) {
    handleError('processCustomFields', undefined, e);
  }
};

export const createAdditionalEntities = async (
  additionalData,
  entityType,
  contactId,
) => {
  if (!additionalData?.length) return;

  try {
    await Promise.all(
      additionalData.map((data) =>
        strapi.entityService.create(entityType, {
          data: {
            value: data,
            contact: contactId,
          },
        }),
      ),
    );
  } catch (e) {
    handleError('createAdditionalEntities', undefined, e);
  }
};

export const handleAdditionalEntities = async (contactId, entities) => {
  // Run all additional entity creations in parallel instead of sequentially
  await Promise.all(
    entities.map(({ additionalData, entityType }) => {
      if (additionalData?.length) {
        return createAdditionalEntities(additionalData, entityType, contactId);
      }
      return Promise.resolve();
    }),
  );
};

export const getPaginatedCreations = async ({
  type,
  page,
  pageSize,
  generatedRegex,
  tenantId,
  importIdentifier,
}) => {
  const start = (page - 1) * pageSize;
  const end = page * pageSize - 1;

  try {
    const paginatedData = await redis.lrange(
      paginatedCreationsData(type, generatedRegex, tenantId, importIdentifier),
      start,
      end,
    );

    const total = await redis.llen(
      paginatedCreationsData(type, generatedRegex, tenantId, importIdentifier),
    );

    return { data: paginatedData.map((item) => JSON.parse(item)), total };
  } catch (error) {
    return { data: [], total: 0 };
  }
};
