import { jwtDecode } from 'jwt-decode';
import { IJwtToken } from '../extensions/users-permissions/types';

export default () => {
  return async (ctx, next) => {
    // Avoid processing for admin-related routes
    const ignorePatterns = [
      '/content-manager',
      '/admin',
      '/content-type-builder',
      '/upload',
      '/email-designer',
      '/react-icons',
      '/email/settings',
      '/users-permissions',
    ];

    // Check if the current request URL matches any of the ignore patterns
    if (ignorePatterns.some((pattern) => ctx.request.url.startsWith(pattern))) {
      await next(); // Skip middleware processing for these routes
      return;
    }

    const cookies = ctx.request.header.cookie || '';

    if (cookies) {
      const tokenCookie = cookies
        .split(';')
        .find((c) => c.trim().startsWith('token='));

      if (tokenCookie) {
        const token = tokenCookie.split('=')[1];

        const decodedToken: IJwtToken = jwtDecode(token);

        const isSessionValid = await strapi.entityService.findMany(
          'api::sessions.sessions',
          {
            filters: {
              session_id: { $eq: decodedToken.session_id },
            },
          },
        );

        if (token && isSessionValid.length) {
          ctx.request.header.authorization = `Bearer ${token}`;
        }
      }
    }

    await next();
  };
};
