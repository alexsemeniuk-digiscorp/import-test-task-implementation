import { lifecyclesHookDecorator } from '../../../lifecyclesHelpers/decorator';
import { createConnection } from '../../../lifecyclesHelpers/twilio-connection/createConnection';

export default {
  afterCreate: lifecyclesHookDecorator([createConnection]),
};
