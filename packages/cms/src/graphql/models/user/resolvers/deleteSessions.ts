import { GraphQLFieldResolver } from 'graphql';
import { jwtDecode } from 'jwt-decode';
import { IJwtToken } from '../../../../extensions/users-permissions/types';

export const deleteSessions: GraphQLFieldResolver<
  null,
  Graphql.ResolverContext,
  null
> = async (root, args, ctx) => {
  const token = ctx.koaContext.request.header.authorization.split(' ')[1];
  const decodedToken: IJwtToken = jwtDecode(token);

  try {
    await strapi.entityService.deleteMany('api::sessions.sessions', {
      filters: {
        user_id: { $eq: `${decodedToken.id}` },
        session_id: { $ne: decodedToken.session_id },
      },
    });

    return {
      ok: true,
    };
  } catch (error) {
    return { ok: false };
  }
};
