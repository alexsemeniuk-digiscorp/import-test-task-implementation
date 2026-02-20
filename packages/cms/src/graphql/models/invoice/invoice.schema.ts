import {
  booleanArg,
  idArg,
  mutationField,
  nonNull,
  nullable,
  objectType,
  stringArg,
} from '@nexus/schema';

const mutationSchema = [
  mutationField('sendInvoice', {
    type: objectType({
      name: 'SendInvoiceResponse',
      definition(t) {
        t.boolean('success');
        t.nullable.list.string('errors');
      },
    }),
    args: {
      id: nonNull(idArg()),
      subjectEmail: stringArg(),
      subjectPhone: stringArg(),
      contactId: nullable(idArg()),
      fileType: nullable(stringArg()),
      customSubjectMessage: nullable(stringArg()),
      customContactMessage: nullable(stringArg()),
      sendBySms: nullable(booleanArg()),
      sendByEmail: nullable(booleanArg()),
    },
  }),
];

export const invoiceSchema = [...mutationSchema];
