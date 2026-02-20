import AfterLifecycleEvent = Database.AfterLifecycleEvent;
import { handleLogger } from '../../../../graphql/helpers/errors';
import { afterUpdateOrderItemPopulation } from '../../variables';
import { updateOrderCalculationsAfterItemUpdate } from './updateOrderCalculationsAfterItemUpdate';

export const afterUpdateMembershipOrderItemLifeCycleHook: AfterLifecycleEvent =
  async (event) => {
    handleLogger(
      'info',
      'MembershipOrderItem afterUpdateMembershipOrderItemLifeCycleHook',
      `Params :: ${JSON.stringify(event.params)}`,
    );

    const apiName = event.model.uid;
    const entityId = event.params.where?.id || event.result?.id;

    const currentItemData = await strapi.entityService.findOne(
      apiName,
      entityId,
      {
        fields: ['id'],
        populate: afterUpdateOrderItemPopulation as any,
      },
    );

    await updateOrderCalculationsAfterItemUpdate(event, currentItemData);
  };
