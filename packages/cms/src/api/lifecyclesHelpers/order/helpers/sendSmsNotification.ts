import { handleError } from '../../../../graphql/helpers/errors';

export const sendSmsNotification = async (params: {
  twilioService: any;
  twilioConnectionId: string;
  phoneNumber: string;
  message: string;
  errors?: string[];
  logPrefix?: string;
}) => {
  const {
    twilioService,
    twilioConnectionId,
    phoneNumber,
    message,
    errors,
    logPrefix = 'sendSmsNotification',
  } = params;

  try {
    await twilioService.sendSMS(twilioConnectionId, phoneNumber, message);
  } catch (error) {
    handleError(`${logPrefix}:sendSMS`, error);
    errors?.push('Error sending SMS');
  }
};
