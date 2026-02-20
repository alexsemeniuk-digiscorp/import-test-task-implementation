import _ from 'lodash';

import { LifecycleHook } from '../types';

export const createContactOnQualifiedLead: LifecycleHook = async ({
  params,
  result,
}) => {
  const newLeadStageId = params?.data?.leadStage;

  if (newLeadStageId) {
    if (result?.leadStage?.type === 'success') {
      const { email, ...otherParams } = _.omit(result, [
        'leadStage',
        'uuid',
        'id',
        'createdAt',
      ]);

      await strapi.entityService.create('api::contact.contact', {
        data: {
          email,
          tenant: result?.tenant?.id,
          ...otherParams,
          lead: params.data.id,
          address: params.data.address,
        },
      });
    }
  }
};
