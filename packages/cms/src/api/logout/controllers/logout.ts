/**
 * A set of functions called "actions" for `logout`
 */

export default {
  async logout(ctx) {
    ctx.cookies.set('token', null, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'development' ? false : true,
      maxAge: 0,
      domain:
        process.env.NODE_ENV === 'development'
          ? '.localhost'
          : process.env.FRONTEND_DOMAIN,
    });
    ctx.send({ message: 'Logged out successfully' });
  },
};
