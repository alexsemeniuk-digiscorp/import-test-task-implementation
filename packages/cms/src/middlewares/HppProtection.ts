export default () => {
  return async (ctx, next) => {
    const checkForHPP = (params) => {
      for (const key in params) {
        if (Array.isArray(params[key])) {
          ctx.throw(
            400,
            `HPP detected: Multiple values for parameter "${key}"`,
          );
        }
      }
    };

    await next();

    // Call here to ensure that the request has been fully processed
    // NOTE: after "await next()" will execute before request returns to the end user
    checkForHPP(ctx.request.query);
  };
};
