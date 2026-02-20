import { lifecyclesHookDecorator } from '../../../lifecyclesHelpers/decorator';
import { beforeUpdatePdfTemplate } from '../../../lifecyclesHelpers/pdfTemplate/beforeUpdatePdfTemplate';

export default {
  beforeUpdate: lifecyclesHookDecorator([beforeUpdatePdfTemplate]),
};
