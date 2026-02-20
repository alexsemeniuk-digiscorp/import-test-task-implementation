import { mutationField } from '@nexus/schema';

const mutationSchema = [
  mutationField('deleteDownloadUserRecords', {
    type: 'DownloadRecordEntityResponse',
  }),
];

export const downloadRecordSchema = [...mutationSchema];
