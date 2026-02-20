import {
  extendType,
  inputObjectType,
  mutationField,
  nonNull,
  objectType,
} from '@nexus/schema';
import { EnumImportStatus, EnumImportingType } from './../contact';

const typeSchema = [
  extendType<'Company'>({
    type: 'Company',
    definition: (t) => {
      t.nullable.string('email');
      t.nullable.string('phoneNumber');
      t.nullable.string('address');
    },
  }),
];

const mutationSchema = [
  mutationField('createCompaniesFromCSV', {
    type: 'String',
    args: {
      input: nonNull(
        inputObjectType({
          name: 'CreateCompaniesFromCSVInput',
          definition: (t) => {
            t.field('uploadCsv', { type: 'Upload' });
          },
        }),
      ),
    },
  }),
  mutationField('fastUpdateAllCompaniesFromCSV', {
    type: 'String',
    args: {
      input: nonNull(
        inputObjectType({
          name: 'FastUpdateAllCompaniesFromCSVInput',
          definition: (t) => {
            t.string('csvContentJson');
          },
        }),
      ),
    },
  }),
  mutationField('fastUpdateSingleCompany', {
    type: 'String',
    args: {
      input: nonNull(
        inputObjectType({
          name: 'FastUpdateSingleCompanyInput',
          definition: (t) => {
            t.string('csvSingleContactJson');
          },
        }),
      ),
    },
  }),
  mutationField('deleteImportingCompany', {
    type: objectType({
      name: 'DeleteImportingCompanyResponse',
      definition: (t) => {
        t.boolean('success');
      },
    }),
    args: {
      input: nonNull(
        inputObjectType({
          name: 'DeleteImportingCompanyInput',
          definition: (t) => {
            t.nullable.string('importingField');
            t.nonNull.field('keyType', { type: EnumImportStatus });
            t.nullable.boolean('isAll');
            t.nonNull.field('importingIdentifier', { type: EnumImportingType });
          },
        }),
      ),
    },
  }),
];

export const companySchema = [...mutationSchema, ...typeSchema];
