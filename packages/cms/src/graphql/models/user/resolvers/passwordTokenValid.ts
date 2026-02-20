import { GraphQLFieldResolver } from 'graphql';
import { isTimeExpired } from '../../../../graphql/helpers/time';

export const passwordTokenValid: GraphQLFieldResolver<
  null,
  Graphql.ResolverContext,
  { code: string; email: string }
> = async (root, args) => {
  const { code, email } = args;
  try {
    const users = await strapi.entityService.findMany(
      'plugin::users-permissions.user',
      {
        filters: {
          resetPasswordToken: code,
          email,
        },
      },
    );

    if (!users.length) {
      return { isValid: false };
    }

    const isTokenExpired = isTimeExpired(
      +users[0].resetPasswordTokenExpiration,
    );

    return {
      isValid: !isTokenExpired,
    };
  } catch (error) {
    return { isValid: false };
  }
};
