import {
  addEmployee,
  createNewRole,
  deleteSessions,
  fullName,
  me,
  passwordTokenValid,
  register,
  registerCustomer,
  resendConfirmation,
  sessions,
  unblockEmployee,
} from './resolvers';
import { phoneNumber } from './resolvers/phoneNumber';

export const UserQueries = {
  me,
  passwordTokenValid,
};

export const UserMutations = {
  register,
  registerCustomer,
  addEmployee,
  resendConfirmation,
  createNewRole,
  deleteSessions,
  sessions,
  unblockEmployee,
};

export const UserResolvers = {
  fullName,
  phoneNumber,
};
