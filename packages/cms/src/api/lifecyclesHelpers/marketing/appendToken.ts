import { generateUUID } from '../../../utils/randomBytes';
import AfterLifecycleEvent = Database.AfterLifecycleEvent;

export const appendToken: AfterLifecycleEvent = async ({ result, model }) => {
  const id = result.id;

  if (id) {
    await strapi.entityService.update(model.uid, id, {
      data: {
        token: generateUUID(),
      },
    });
  }
};
