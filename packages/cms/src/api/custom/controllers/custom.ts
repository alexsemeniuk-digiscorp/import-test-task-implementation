//TODO: this code should be use one time and then removed from the project

export default {
  async applyCustomDate(ctx) {
    const contacts = await strapi.entityService.findMany(
      'api::contact.contact',
      {},
    );

    console.log('works');
    for (let i = 0; i < contacts.length; i++) {
      if (contacts?.[i]?.customCreationDate) continue;
      const createdAt = contacts?.[i]?.createdAt;
      await strapi.entityService.update(
        'api::contact.contact',
        contacts?.[i]?.id,
        {
          data: {
            customCreationDate: createdAt,
          },
        },
      );
      console.log('contact::', i);
    }

    const companies = await strapi.entityService.findMany(
      'api::company.company',
      {},
    );
    for (let i = 0; i < companies.length; i++) {
      if (companies[i]?.customCreationDate) continue;
      const createdAt = companies[i]?.createdAt;
      await strapi.entityService.update(
        'api::company.company',
        companies?.[i]?.id,
        {
          data: {
            customCreationDate: createdAt,
          },
        },
      );
      console.log('company::', i);
    }

    const notes = await strapi.entityService.findMany('api::note.note', {});
    for (let i = 0; i < notes.length; i++) {
      if (notes[i]?.customCreationDate) continue;
      const createdAt = notes[i]?.createdAt;
      await strapi.entityService.update('api::note.note', notes?.[i]?.id, {
        data: {
          customCreationDate: createdAt,
        },
      });
      console.log('note::', i);
    }

    const dealTransactions = await strapi.entityService.findMany(
      'api::deal-transaction.deal-transaction',
      {},
    );
    for (let i = 0; i < dealTransactions.length; i++) {
      if (dealTransactions[i]?.customCreationDate) continue;
      const createdAt = dealTransactions[i]?.createdAt;
      await strapi.entityService.update(
        'api::deal-transaction.deal-transaction',
        dealTransactions?.[i]?.id,
        {
          data: {
            customCreationDate: createdAt,
          },
        },
      );
      console.log('dealTransaction::', i);
    }

    const orders = await strapi.entityService.findMany('api::order.order', {});
    for (let i = 0; i < orders.length; i++) {
      if (orders[i]?.customCreationDate) continue;
      const createdAt = orders[i]?.createdAt;
      await strapi.entityService.update('api::order.order', orders?.[i]?.id, {
        data: {
          customCreationDate: createdAt,
        },
      });
      console.log('order::', i);
    }

    const activities = await strapi.entityService.findMany(
      'api::activity.activity',
      {},
    );
    for (let i = 0; i < activities.length; i++) {
      if (activities[i]?.customCreationDate) continue;
      const createdAt = activities[i]?.createdAt;
      await strapi.entityService.update(
        'api::activity.activity',
        activities?.[i]?.id,
        {
          data: {
            customCreationDate: createdAt,
          },
        },
      );
      console.log('activity::', i);
    }

    const productInventoryItems = await strapi.entityService.findMany(
      'api::product-inventory-item.product-inventory-item',
      {},
    );
    for (let i = 0; i < productInventoryItems.length; i++) {
      if (productInventoryItems[i]?.customCreationDate) continue;
      const createdAt = productInventoryItems?.[i]?.createdAt;
      await strapi.entityService.update(
        'api::product-inventory-item.product-inventory-item',
        productInventoryItems?.[i]?.id,
        {
          data: {
            customCreationDate: createdAt,
          },
        },
      );
      console.log('productInventoryItem::', i);
    }

    const servicePerformers = await strapi.entityService.findMany(
      'api::service-performer.service-performer',
      {},
    );
    for (let i = 0; i < servicePerformers.length; i++) {
      if (servicePerformers[i]?.isImported) continue;
      await strapi.entityService.update(
        'api::service-performer.service-performer',
        servicePerformers?.[i]?.id,
        {
          data: {
            isImported: false,
          },
        },
      );
      console.log('productInventoryItem::', i);
    }

    const classPerformers = await strapi.entityService.findMany(
      'api::class-performer.class-performer',
      {},
    );
    for (let i = 0; i < classPerformers.length; i++) {
      if (classPerformers[i]?.isImported) continue;
      await strapi.entityService.update(
        'api::class-performer.class-performer',
        classPerformers?.[i]?.id,
        {
          data: {
            isImported: false,
          },
        },
      );
      console.log('productInventoryItem::', i);
    }

    console.log('here');

    return ctx.send({ message: 'Contacts updated successfully' });
  },
};
