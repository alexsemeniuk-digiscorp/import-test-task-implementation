import { generateUUID } from '../../../../../utils/randomBytes';
import { CrmEntityName } from './../../../../../api/lifecyclesHelpers/types';

export const transformParsedContacts = (parsedContact, keys) => {
  const transformedArray = [];

  keys.forEach((key) => {
    if (parsedContact[key]) {
      const newObject = {
        id: generateUUID(),
        value: parsedContact[key],
        name: key,
      };
      transformedArray.push(newObject);
    }
  });

  return transformedArray;
};

export const mapValues = (object, array, keys) => {
  const keyValues = keys.reduce((acc, key) => {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      acc[key] = object[key];
    }
    return acc;
  }, {});

  return array.map((item) => {
    if (Object.prototype.hasOwnProperty.call(keyValues, item.name)) {
      return { ...item, value: keyValues[item.name] };
    }
    return item;
  });
};

export const filterObjectByKeys = (obj, keys) => {
  return Object.keys(obj)
    .filter((key) => keys.includes(key))
    .reduce((acc, key) => {
      acc[key] = obj[key];
      return acc;
    }, {});
};

export const updateCustomFields = async (tenantContacts, filteredKeys) => {
  for (const contact of tenantContacts) {
    const customFields = Array.isArray(contact.customFields)
      ? contact.customFields
      : [];
    for (const name of filteredKeys) {
      if (!customFields.some((field) => field.name === name)) {
        customFields.push({ name, value: '', id: generateUUID() });
      }
    }
  }
};

export const handleCustomFieldsUpdating = async (
  customFields,
  { updatedContactId, tenantId },
) => {
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
        crmType: 'contact',
      },
      fields: ['id', 'name'],
    },
  );

  const cameCustomFields = Object.keys(customFields).filter(
    (field) =>
      !foundCustomFieldNames.map((field) => field.name).includes(field),
  );

  if (updatedContactId && Object.keys(customFields).length > 0) {
    let newFieldPromises = [];
    let existingFieldPromises = [];

    if (cameCustomFields && cameCustomFields.length > 0) {
      newFieldPromises = cameCustomFields.map(async (fieldName) => {
        const newCustomFieldName = await strapi.entityService.create(
          'api::crm-custom-field-name.crm-custom-field-name',
          {
            data: {
              name: fieldName,
              tenant: tenantId,
              crmType: 'contact' as CrmEntityName,
            },
          },
        );

        if (newCustomFieldName && newCustomFieldName.id) {
          return strapi.entityService.create(
            'api::crm-custom-field-value.crm-custom-field-value',
            {
              data: {
                value: customFields[newCustomFieldName.name],
                customFieldName: newCustomFieldName.id,
                contact: updatedContactId,
              },
            },
          );
        }
      });
    }

    if (foundCustomFieldNames && foundCustomFieldNames.length > 0) {
      existingFieldPromises = foundCustomFieldNames.map(async (customField) => {
        const findExistingValue = await strapi.entityService.findMany(
          'api::crm-custom-field-value.crm-custom-field-value',
          {
            filters: {
              customFieldName: customField.id,
              contact: updatedContactId,
            } as any,
            fields: ['id'],
          },
        );

        if (findExistingValue?.[0]?.id) {
          await strapi.entityService.update(
            'api::crm-custom-field-value.crm-custom-field-value',
            findExistingValue?.[0]?.id,
            {
              data: {
                value: customFields[customField.name],
              },
            },
          );
        } else {
          return strapi.entityService.create(
            'api::crm-custom-field-value.crm-custom-field-value',
            {
              data: {
                value: customFields[customField.name],
                customFieldName: customField.id,
                contact: updatedContactId,
              },
            },
          );
        }
      });
    }

    await Promise.all([...newFieldPromises, ...existingFieldPromises]);
  }
};
