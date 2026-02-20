import { handleLogger } from '../../../../graphql/helpers/errors';
import { appendUuid } from '../../appendUuid';
import { deleteSalesItemReportItems } from '../../reports/deleteSalesItemReportItems';
import { LifecycleHook } from '../../types';

export const beforeCreateReturnLifecycleHook: LifecycleHook = async (event) => {
  handleLogger(
    'info',
    'RETURN beforeCreateReturnLifecycleHook',
    `Params :: ${JSON.stringify(event?.params)}`,
  );

  await appendUuid({ ...event });
  await deleteSalesItemReportItems({ ...event });
};
