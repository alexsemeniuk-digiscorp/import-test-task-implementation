import { TwilioService } from '../../twilio/TwilioService';
import { LifecycleHook } from '../types';

export const createConnection: LifecycleHook = async ({ result, params }) => {
  const connectionId = result?.id;
  const friendlyName = params?.data?.friendlyName;

  const twilioService = await strapi.service(
    'api::twilio-connection.twilio-connection',
  );

  const { subaccountSid, messagingServiceSid, phoneNumber } =
    await twilioService.createSubaccount(friendlyName);

  const twilioInstance = new TwilioService('', subaccountSid);

  const keyData = await twilioInstance.createApiKeyAndSecret();

  await strapi.entityService.update(
    'api::twilio-connection.twilio-connection',
    connectionId,
    {
      data: {
        accountSid: subaccountSid,
        messagingServiceSid,
        phoneNumber,
        keySid: keyData.sid,
        keySecret: keyData.secret,
      },
    },
  );
};
