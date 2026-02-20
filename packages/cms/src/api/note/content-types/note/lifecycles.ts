import { lifecyclesHookDecorator } from '../../../lifecyclesHelpers/decorator';
import { createActivityAfterCreateNote } from '../../../lifecyclesHelpers/note/createActivityAfterCreateNote';
import { setNoteIsDefault } from '../../../lifecyclesHelpers/note/setNoteIsDefault';
import { appendCustomCreationDate } from './../../../lifecyclesHelpers/appendCustomCreationDate';

export default {
  beforeCreate: lifecyclesHookDecorator([appendCustomCreationDate]),
  afterCreate: lifecyclesHookDecorator([createActivityAfterCreateNote]),
  beforeUpdate: lifecyclesHookDecorator([setNoteIsDefault]),
};
