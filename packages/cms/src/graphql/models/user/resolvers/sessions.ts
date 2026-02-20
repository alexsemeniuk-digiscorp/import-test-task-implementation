import { GraphQLFieldResolver } from 'graphql';
import { jwtDecode } from 'jwt-decode';
import { IJwtToken } from '../../../../extensions/users-permissions/types';

export const sessions: GraphQLFieldResolver<
  null,
  Graphql.ResolverContext,
  null
> = async (root, args, ctx) => {
  const token = ctx.koaContext.request.header.authorization.split(' ')[1];
  const decodedToken: IJwtToken = jwtDecode(token);

  try {
    const currentSession = await strapi.entityService.findMany(
      'api::sessions.sessions',
      {
        filters: {
          session_id: { $eq: decodedToken.session_id },
        },
      },
    );

    const otherSessions = await strapi.entityService.findMany(
      'api::sessions.sessions',
      {
        filters: {
          session_id: { $ne: decodedToken.session_id },
          user_id: { $eq: `${decodedToken.id}` },
        },
      },
    );
    return {
      currentSession,
      otherSessions,
    };
  } catch (error) {
    return {
      currentSession: null,
      otherSessions: null,
    };
  }
};
