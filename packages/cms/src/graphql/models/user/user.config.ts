import { loginAddToken } from '../../middlewares/loginAddToken';
import { withTenantCollectionQuery } from '../../middlewares/withTenant';

export const userResolversConfig: Graphql.ResolverConfig = {
  'Query.passwordTokenValid': {
    auth: false,
  },
  'Query.usersPermissionsUsers': {
    auth: true,
    middlewares: [withTenantCollectionQuery],
  },
  'Mutation.sessions': {
    auth: true,
  },
  'Mutation.login': {
    middlewares: [loginAddToken],
  },
  'Mutation.registerCustomer': {
    auth: false,
  },
  'Mutation.resendConfirmation': {
    auth: false,
  },
  'Mutation.deleteSessions': {
    auth: true,
  },
};
