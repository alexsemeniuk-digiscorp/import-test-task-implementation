import { jwtDecode } from 'jwt-decode';
import { UAParser } from 'ua-parser-js';
import { uuidv7 } from 'uuidv7';

export const createSessionWithToken = async (userId, ip, userAgent) => {
  const session_id = uuidv7();
  const token = strapi.plugins['users-permissions'].services.jwt.issue({
    id: userId,
    session_id,
  });

  const decodedToken = jwtDecode(token);

  const parser = new UAParser();
  const deviceInfo = parser.setUA(userAgent).getResult();

  await strapi.entityService.create('api::sessions.sessions', {
    data: {
      session_id,
      user_id: `${userId}`,
      ip: ip,
      browser: deviceInfo.browser.name,
      device: `${deviceInfo.os.name} ${deviceInfo.os.version}`,
      expired_at: decodedToken.exp * 1000, // convert to milliseconds
    },
  });

  return token;
};
