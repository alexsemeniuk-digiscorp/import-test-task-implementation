import { errors } from '@strapi/utils';
const { ApplicationError } = errors;

export const handleLogger = (
  type: 'error' | 'info' | 'warn' | 'debug',
  functionName: string,
  message: string,
  environment?: NODE_ENVIROMENT,
) => {
  const currentEnv = process.env.NODE_ENV;
  const shouldLog = environment
    ? currentEnv === environment
    : currentEnv === 'development' || type === 'error';
  if (!shouldLog) {
    strapi.log[type](`[${functionName}] :: ${message}`);
  }
};

export const handleError = (
  functionName: string,
  message?: string,
  error?: unknown,
  isApplicationError = false,
): void => {
  if (error instanceof Error || isApplicationError) {
    const errorDetails = JSON.stringify(error);
    handleLogger('error', functionName, errorDetails);

    if (isApplicationError) {
      throw new ApplicationError(`Custom: ${message}`);
    } else {
      throw error;
    }
  } else {
    handleLogger('warn', functionName, message);
  }
};
