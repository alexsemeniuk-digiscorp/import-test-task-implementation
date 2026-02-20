import { StatusMessageContextType } from '@app/StatusMessageContext/statusMessageContext';

export const handleApplicationError = (
  error: unknown,
  message: StatusMessageContextType,
  errorMessage?: string,
) => {
  if (
    error &&
    typeof error === 'object' &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    const errMsg = error.message;
    const customErrorPrefix = 'Custom: ';
    const appErrorPrefix = 'ApplicationError: Custom: ';

    if (errMsg.startsWith(appErrorPrefix)) {
      return message.open('error', errMsg.slice(appErrorPrefix.length));
    }
    if (errMsg.startsWith(customErrorPrefix)) {
      return message.open('error', errMsg.slice(customErrorPrefix.length));
    }
    return message.open('error', errorMessage);
  }

  message.open('error', errorMessage);
};
