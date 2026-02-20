import {
  booleanArg,
  idArg,
  mutationField,
  nullable,
  objectType,
  stringArg,
} from '@nexus/schema';

const mutationSchema = [
  mutationField('sendDocument', {
    type: objectType({
      name: 'SendDocumentResponse',
      definition(t) {
        t.boolean('success');
        t.nullable.list.string('errors');
      },
    }),
    args: {
      templateId: nullable(idArg()),
      docType: stringArg(),
      contactId: nullable(idArg()),
      sendBySms: nullable(booleanArg()),
      sendByEmail: nullable(booleanArg()),
      subjectEmail: nullable(stringArg()),
      subjectPhone: nullable(stringArg()),
      customSmsContactContent: nullable(stringArg()),
      customSmsSubjectContent: nullable(stringArg()),
    },
  }),
];

export const sendDocumentSchema = [...mutationSchema];
