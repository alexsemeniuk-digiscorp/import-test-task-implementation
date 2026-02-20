import { appendUuid } from '../../../lifecyclesHelpers/appendUuid';
import { lifecyclesHookDecorator } from '../../../lifecyclesHelpers/decorator';
import { deleteMaintenanceEventsOnMaintenanceDeletion } from '../../../lifecyclesHelpers/inventory/deleteMaintenanceEventsOnMaintenanceDeletion';

export default {
  beforeCreate: lifecyclesHookDecorator([appendUuid]),
  beforeDelete: lifecyclesHookDecorator([
    deleteMaintenanceEventsOnMaintenanceDeletion,
  ]),
};
