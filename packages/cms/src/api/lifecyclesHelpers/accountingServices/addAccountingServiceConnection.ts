import { ID } from '@strapi/strapi/lib/services/entity-service/types/params/attributes';
import { LifecycleHook, ServiceJsonType } from '../types';

import AfterLifecycleEvent = Database.AfterLifecycleEvent;

export const addAccountingServiceConnection: LifecycleHook = async ({
  result,
}: AfterLifecycleEvent) => {
  const storeId = result?.id;
  const storeData = await strapi.entityService.findOne(
    'api::business-location.business-location',
    storeId,
    {
      fields: ['id'],
      populate: {
        tenant: {
          fields: ['id'],
        },
      },
    },
  );

  const accountingService = await strapi.entityService.findMany(
    'api::acc-service-conn.acc-service-conn',
    {
      filters: {
        tenant: {
          id: { $eq: storeData?.tenant?.id },
        },
      },
    },
  );
  if (!accountingService.length) {
    return;
  }

  const serviceJson = (await accountingService.filter(
    (service) => service.serviceType === 'quickBooks',
  )[0].serviceJson) as ServiceJsonType;
  const clientId = serviceJson?.clientId;
  const clientSecret = serviceJson?.clientSecret;

  await strapi.entityService.create('api::acc-service-conn.acc-service-conn', {
    data: {
      serviceType: 'quickBooks',
      businessLocation: storeId,
      tenant: storeData.tenant.id as ID,
      serviceJson: {
        clientId: clientId,
        clientSecret: clientSecret,
      },
    },
  });
};
