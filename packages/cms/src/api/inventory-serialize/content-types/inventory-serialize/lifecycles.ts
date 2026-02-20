import { lifecyclesHookDecorator } from './../../../lifecyclesHelpers/decorator';
import { checkIsSerialNumberUnique } from './../../../lifecyclesHelpers/serialNumber/checkIsSerialNumberUnique';

export default {
  beforeCreate: lifecyclesHookDecorator([checkIsSerialNumberUnique]),
  beforeUpdate: lifecyclesHookDecorator([checkIsSerialNumberUnique]),
};
