export const NOT_DEVELOPEMENT =
  process.env.NODE_ENV === 'development'
    ? undefined
    : (process.env.NODE_ENV as NODE_ENVIROMENT);
