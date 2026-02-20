import {
  extendInputType,
  extendType,
  inputObjectType,
  mutationField,
  nonNull,
  objectType,
  queryField,
  stringArg,
} from '@nexus/schema';

// Role type definition
const Role = objectType({
  name: 'Role',
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.string('name');
  },
});

const typeSchema = [
  extendType<'UsersPermissionsUser'>({
    type: 'UsersPermissionsUser',
    definition: (t) => {
      t.nullable.string('fullName');
      t.nullable.string('phoneNumber');
    },
  }),
  extendInputType({
    type: 'UsersPermissionsLoginInput',
    definition: (t) => {
      t.nullable.string('tenantSlug');
    },
  }),
  extendInputType({
    type: 'UsersPermissionsRegisterInput',
    definition: (t) => {
      t.nullable.string('tenantSlug');
      t.nullable.string('lastName');
      t.nullable.string('firstName');
      t.nullable.string('companyName');
      t.nullable.string('phoneNumber');
      t.nullable.string('referralCode');
    },
  }),
];

const querySchema = [
  queryField('me', {
    type: 'UsersPermissionsUserEntity',
  }),
  queryField('passwordTokenValid', {
    type: objectType({
      name: 'PasswordTokenValidResponse',
      definition: (t) => {
        t.nonNull.boolean('isValid');
      },
    }),
    args: {
      code: nonNull(stringArg()),
      email: nonNull(stringArg()),
    },
  }),
];

const mutationSchema = [
  mutationField('sessions', {
    type: objectType({
      name: 'UserSeessionsResponse',
      definition: (t) => {
        t.list.field('currentSession', {
          type: objectType({
            name: 'currentSession',
            definition: (t) => {
              t.string('ip'), t.string('browser'), t.string('device');
            },
          }),
        }),
          t.list.field('otherSessions', {
            type: objectType({
              name: 'OtherSessionsType',
              definition: (t) => {
                t.string('ip'), t.string('browser'), t.string('device');
              },
            }),
          });
      },
    }),
  }),
  mutationField('deleteSessions', {
    type: objectType({
      name: 'DeleteSessionsResponse',
      definition: (t) => {
        t.nonNull.boolean('ok');
      },
    }),
    args: {
      input: nonNull(
        inputObjectType({
          name: 'DeleteSessionsInput',
          definition: (t) => {
            t.nonNull.string('session_id');
          },
        }),
      ),
    },
  }),
  mutationField('register', {
    type: 'UsersPermissionsLoginPayload',
    args: {
      input: 'UsersPermissionsRegisterInput',
    },
  }),
  mutationField('registerCustomer', {
    type: 'UsersPermissionsLoginPayload',
    args: {
      input: nonNull(
        inputObjectType({
          name: 'CustomerUserRegisterInput',
          definition: (t) => {
            t.nonNull.string('username');
            t.nonNull.string('email');
            t.nonNull.string('password');
            t.nonNull.string('firstName');
            t.nonNull.string('lastName');
            t.nonNull.string('phoneNumber');
            t.nonNull.string('tenantSlug');
            t.nonNull.string('websiteId');
          },
        }),
      ),
    },
  }),
  mutationField('addEmployee', {
    type: 'UsersPermissionsLoginPayload',
    args: {
      input: nonNull(
        inputObjectType({
          name: 'EmployeeUserRegisterInput',
          definition: (t) => {
            t.nonNull.string('username');
            t.nonNull.string('email');
            t.string('firstName');
            t.string('lastName');
            t.string('phoneNumber');
            t.field('payRate', { type: 'PayRateInput' });
            t.nonNull.id('role');
            t.list.id('businessLocation');
            t.string('jobTitle');
            t.field('salesCommission', { type: 'SalesCommissionInput' });
          },
        }),
      ),
    },
  }),
  mutationField('sendEmail', {
    type: 'Boolean',
    args: {
      data: nonNull(
        inputObjectType({
          name: 'SendEmailInput',
          definition: (t) => {
            t.nonNull.string('toEmail');
            t.nonNull.string('subject');
            t.nonNull.string('messageBody');
            t.nonNull.string('context');
            t.nonNull.id('id');
          },
        }),
      ),
    },
  }),
  mutationField('resendConfirmation', {
    type: 'Boolean',
    args: {
      input: nonNull(
        inputObjectType({
          name: 'ResendConfirmationInput',
          definition: (t) => {
            t.nonNull.string('email');
            t.nonNull.string('type');
          },
        }),
      ),
    },
  }),
  mutationField('createNewRole', {
    type: 'Boolean',
    args: {
      input: nonNull(
        inputObjectType({
          name: 'CreateNewRoleInput',
          definition: (t) => {
            t.nonNull.id('tenantId');
            t.nonNull.string('role');
            t.string('description');
          },
        }),
      ),
    },
  }),
  mutationField('unblockEmployee', {
    type: 'Boolean',
    args: {
      input: nonNull(
        inputObjectType({
          name: 'UnblockEmployeeInput',
          definition: (t) => {
            t.nonNull.id('id');
          },
        }),
      ),
    },
  }),
];

export const userSchema = [...typeSchema, ...querySchema, ...mutationSchema];
