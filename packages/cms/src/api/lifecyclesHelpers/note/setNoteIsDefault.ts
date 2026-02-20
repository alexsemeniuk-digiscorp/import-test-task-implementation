import { handleLogger } from '../../../graphql/helpers/errors';
import { LifecycleHook } from '../types';

import BeforeLifecycleEvent = Database.BeforeLifecycleEvent;

export const setNoteIsDefault: LifecycleHook = async ({
  params,
}: BeforeLifecycleEvent) => {
  handleLogger(
    'info',
    'Note beforeUpdateNoteLifeCycleHook setNoteIsDefault',
    `Params :: ${JSON.stringify(params)}`,
  );

  const current = await strapi.entityService.findOne(
    'api::note.note',
    params.where.id,
    {
      populate: {
        contact_id: { fields: ['id'] },
        company_id: { fields: ['id'] },
        lead_id: { fields: ['id'] },
      },
    },
  );

  if (!current) return;

  if (params?.data?.isDefault === true) {
    const relation = current?.contact_id
      ? { key: 'contact_id', id: current?.contact_id?.id }
      : current?.company_id
      ? { key: 'company_id', id: current?.company_id?.id }
      : current?.lead_id
      ? { key: 'lead_id', id: current?.lead_id?.id }
      : null;

    if (!relation) {
      handleLogger(
        'warn',
        'Note lifecycle',
        `No relation (contact, company, or lead) found for note ${current.id}`,
      );
      return;
    }

    const filters: Record<string, any> = {
      isDefault: true,
      id: { $ne: params.where.id },
      [relation?.key]: { id: relation?.id },
    };

    const otherDefaultNotes = await strapi.entityService.findMany(
      'api::note.note',
      {
        filters,
        fields: ['id'],
      },
    );

    await Promise.all(
      otherDefaultNotes.map((note) =>
        strapi.entityService.update('api::note.note', note.id, {
          data: { isDefault: false },
        }),
      ),
    );

    handleLogger(
      'info',
      'Note beforeUpdateNoteLifeCycleHook setNoteIsDefault',
      `Unset other defaults for ${relation.key} ${relation.id}`,
    );
  }
};
