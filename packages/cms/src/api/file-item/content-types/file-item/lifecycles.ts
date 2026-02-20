import { lifecyclesHookDecorator } from '../../../lifecyclesHelpers/decorator';
import { deleteRelatedDownloadRecords } from '../../../lifecyclesHelpers/fileItem/deleteRelatedDownloadRecords';

export default {
  beforeDelete: lifecyclesHookDecorator([deleteRelatedDownloadRecords]),
};
