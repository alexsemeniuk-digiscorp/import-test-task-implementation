import { LifecycleHook } from '../types';
import BeforeLifecycleEvent = Database.BeforeLifecycleEvent;

import { handleLogger } from '../../../graphql/helpers/errors';

export const beforeUpdatePdfTemplate: LifecycleHook = async ({
  params,
}: BeforeLifecycleEvent) => {
  handleLogger(
    'info',
    'PDF-TEMPLATE beforeUpdatePdfTemplate',
    `Params :: ${JSON.stringify(params)}`,
  );

  const { data, where } = params;
  const id = where?.id;

  if (!id || data?.isDefault !== true) return;

  const current = await strapi.entityService.findOne(
    'api::pdf-template.pdf-template',
    id,
    {
      fields: ['id', 'type'],
      populate: ['tenant'],
    },
  );

  if (!current?.tenant?.id) return;

  const { type, tenant } = current;

  const templates = await strapi.entityService.findMany(
    'api::pdf-template.pdf-template',
    {
      filters: {
        id: { $ne: id },
        type,
        isDefault: true,
        tenant: {
          id: {
            $eq: tenant.id,
          },
        },
      },
      fields: ['id'],
    },
  );

  if (!templates.length) return;

  const ids = templates.map((t) => t.id);

  await strapi.db.query('api::pdf-template.pdf-template').updateMany({
    where: {
      id: { $in: ids },
    },
    data: {
      isDefault: false,
    },
  });
};
