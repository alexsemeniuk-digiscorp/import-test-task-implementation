import { handleError } from './../../../../helpers/errors';
import { classifyItems } from './handleAdditionalData/classifyItems';

export const handleAdditionalData = async (
  field,
  entityType,
  parsedContact,
  updatedContactId,
) => {
  try {
    if (field === 'additionalPhoneNumbers') {
      parsedContact[field] = parsedContact[field].map((value) =>
        value.replace(/[^+\d]/g, ''),
      );
    }

    const fetchedItems = await strapi.entityService.findMany(entityType, {
      filters: {
        contact: { id: { $eq: updatedContactId } },
      },
    });

    const { new: newItems, old: oldItems } = await classifyItems(
      fetchedItems,
      parsedContact[field],
    );

    await Promise.all([
      ...newItems.map((item) =>
        strapi.entityService.create(entityType, {
          data: { value: item, contact: updatedContactId },
        }),
      ),
      ...oldItems.map((item) =>
        strapi.entityService.delete(entityType, item.id),
      ),
    ]);
  } catch (e) {
    handleError('handleAdditionalData', undefined, e);
  }
};
