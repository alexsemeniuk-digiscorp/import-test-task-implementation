import encryptionService from 'strapi-plugin-encryptable-field/server/services/service';

export const decryptEntities = async (entity, fieldsToEncrypt: string[]) => {
  const contacts = await strapi.db.query(entity).findMany({});

  // Последовательная обработка всех контактов
  for (const contact of contacts) {
    const updatedData = {};

    // Для каждого поля проверяем, зашифровано ли оно
    for (const field of fieldsToEncrypt) {
      if (
        contact[field] &&
        encryptionService({ strapi }).isEncrypted(contact[field])
      ) {
        // Если поле зашифровано, расшифровываем его
        updatedData[field] = encryptionService({ strapi }).decrypt(
          contact[field],
        );
      }
    }

    // Если есть зашифрованные данные, обновляем запись
    if (Object.keys(updatedData).length > 0) {
      await strapi.db.query(entity).update({
        where: { id: contact.id },
        data: updatedData, // Обновляем только зашифрованные поля
      });
    }
  }
};

/*
    @entity - name of entity for example 'api::contact.contact'
    @fieldsToEncrypt - array of fields which should be encrypted [email, phoneNumber, address]
    !IMPORTANT - Keep in mind that if you have lifecycle hooks that modify the data before it is saved or updated in the database, you should turn off those life cycles.
    !IMPORTANT - Make sure to backup your database before running this code.
    !IMPORTANT - Make sure to test this code on a staging environment before running it on production.
    !IMPORTANT - Make sure to remove this code from your project after you have used it.
    !IMPORTANT - Appropriative schemas should be created before running this code.
    !IMPORTANT - Make sure to turn off the rate limiter middleware before running this code.
*/
export const encryptEntities = async (entity, fieldsToEncrypt: string[]) => {
  const contacts = await strapi.db.query(entity).findMany({});

  // Параллельная обработка всех контактов с использованием Promise.all
  await Promise.all(
    contacts.map(async (contact) => {
      const updatedData = {};

      // Для каждого поля проверяем, зашифровано ли оно
      for (const field of fieldsToEncrypt) {
        if (
          contact[field] &&
          !encryptionService({ strapi }).isEncrypted(contact[field])
        ) {
          // Если поле не зашифровано, шифруем его
          updatedData[field] = encryptionService({ strapi }).encrypt(
            contact[field],
          );
        }
      }

      // Если есть зашифрованные данные, обновляем запись
      if (Object.keys(updatedData).length > 0) {
        await strapi.db.query(entity).update({
          where: { id: contact.id },
          data: updatedData, // Обновляем только зашифрованные поля
        });
      }
    }),
  );
};
