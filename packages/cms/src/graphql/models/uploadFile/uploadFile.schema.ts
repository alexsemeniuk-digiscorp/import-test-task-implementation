import {
  inputObjectType,
  mutationField,
  nonNull,
  objectType,
} from '@nexus/schema';

const mutationSchema = [
  mutationField('processingFileUploading', {
    args: {
      input: nonNull(
        inputObjectType({
          name: 'ProcessingFileUploadingArgInput',
          definition: (t) => {
            t.nonNull.list.field('uploadFiles', { type: 'Upload' });
          },
        }),
      ),
    },
    type: objectType({
      name: 'ProcessingFileUploadingResponse',
      definition: (t) => {
        t.string('resultObj');
      },
    }),
  }),
  mutationField('generatePresignedUrl', {
    args: {
      input: nonNull(
        inputObjectType({
          name: 'GeneratePresignedUrlArgsInput',
          definition: (t) => {
            t.string('fileName');
            t.string('fileType');
            t.float('size');
            t.string('importingSessionId');
          },
        }),
      ),
    },
    type: objectType({
      name: 'GeneratePresignedUrlResponse',
      definition: (t) => {
        t.string('presignedUrl');
      },
    }),
  }),
  mutationField('generatePresignedUrls', {
    args: {
      input: nonNull(
        inputObjectType({
          name: 'GeneratePresignedUrlsArgsInput',
          definition: (t) => {
            t.nonNull.list.field('files', {
              type: inputObjectType({
                name: 'ImageFileUploadInput',
                definition: (ft) => {
                  ft.string('fileName');
                  ft.string('fileType');
                  ft.float('size');
                },
              }),
            });
            t.string('importingSessionId');
          },
        }),
      ),
    },
    type: objectType({
      name: 'GeneratePresignedUrlsResponse',
      definition: (t) => {
        t.nonNull.list.string('presignedUrls');
      },
    }),
  }),
  mutationField('generateFileImportingReport', {
    args: {
      input: nonNull(
        inputObjectType({
          name: 'GenerateFileImportingReportArgsInput',
          definition: (t) => {
            t.string('sessionId');
            t.string('importingSessionId');
          },
        }),
      ),
    },
    type: 'String',
  }),
];

export const uploadFileSchema = [...mutationSchema];
