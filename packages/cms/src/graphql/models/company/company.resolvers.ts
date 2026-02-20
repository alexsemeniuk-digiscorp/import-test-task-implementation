import { address } from './resolvers/address';
import { createCompaniesFromCSV } from './resolvers/createCompaniesFromCSV';
import { deleteImportingCompany } from './resolvers/deleteImportingCompany';
import { email } from './resolvers/email';
import { fastUpdateAllCompaniesFromCSV } from './resolvers/fastUpdateAllCompaniesFromCSV';
import { fastUpdateSingleCompany } from './resolvers/fastUpdateSingleCompany';
import { phoneNumber } from './resolvers/phoneNumber';

export const CompanyResolvers = {
  email,
  phoneNumber,
  address,
};

export const CompanyMutations = {
  fastUpdateAllCompaniesFromCSV,
  fastUpdateSingleCompany,
  deleteImportingCompany,
  createCompaniesFromCSV,
};
