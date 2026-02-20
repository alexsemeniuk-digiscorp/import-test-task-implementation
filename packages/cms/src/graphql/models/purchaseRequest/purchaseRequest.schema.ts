import {
  booleanArg,
  idArg,
  mutationField,
  nullable,
  objectType,
  stringArg,
} from '@nexus/schema';

const mutationSchema = [
  mutationField('sendPurchaseRequest', {
    type: objectType({
      name: 'SendPurchaseRequestResponse',
      definition(t) {
        t.boolean('success');
        t.nullable.list.string('errors');
      },
    }),
    args: {
      id: idArg(),
      email: stringArg(),
      contactId: nullable(idArg()),
      subject: stringArg(),
      body: stringArg(),
      fileUrl: stringArg(),
      phone: stringArg(),
      sendBySms: nullable(booleanArg()),
      sendByEmail: nullable(booleanArg()),
      customSmsContactContent: nullable(stringArg()),
      customSmsSubjectContent: nullable(stringArg()),
    },
  }),
];

export const purchaseRequestSchema = [...mutationSchema];
