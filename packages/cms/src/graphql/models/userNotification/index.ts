import {
  withUserCollectionQuery,
  withUserSingleQuery,
  withUserUpdateMutation,
} from '../../middlewares/withUser';

export const userNotificationResolversConfig: Graphql.ResolverConfig = {
  'Query.userNotifications': {
    auth: true,
    middlewares: [withUserCollectionQuery],
  },
  'Query.userNotification': {
    auth: true,
    middlewares: [withUserSingleQuery],
  },
  'Query.updateUserNotification': {
    auth: true,
    middlewares: [withUserUpdateMutation],
  },
};
