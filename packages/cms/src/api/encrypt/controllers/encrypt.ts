//TODO: this code should be use one time and then removed from the project
import { decryptEntities } from '../../../utils/encryptEntities';

export default {
  async decrypt(ctx) {
    // please disable cleanPhoneNumber lyfecycle hook before running this code
    await decryptEntities('api::contact.contact', [
      'email',
      'phoneNumber',
      'address',
      'identityNumber',
    ]);

    await decryptEntities(
      'api::crm-additional-address.crm-additional-address',
      ['value'],
    );

    await decryptEntities('api::crm-additional-email.crm-additional-email', [
      'value',
    ]);

    // please disable cleanPhoneNumber lyfecycle hook before running this code
    await decryptEntities(
      'api::crm-additional-phone-number.crm-additional-phone-number',
      ['value'],
    );

    await decryptEntities('api::business-location.business-location', [
      'email',
      'phoneNumber',
    ]);

    // please disable cleanPhoneNumber lyfecycle hook before running this code
    await decryptEntities('api::company.company', [
      'address',
      'phoneNumber',
      'email',
    ]);

    await decryptEntities('api::form.form', ['sendTo']);

    await decryptEntities(
      'api::invoice-shipping-contact.invoice-shipping-contact',
      ['email', 'phoneNumber', 'address'],
    );

    // please disable cleanPhoneNumber lyfecycle hook before running this code
    await decryptEntities('api::lead.lead', [
      'email',
      'phoneNumber',
      'address',
    ]);

    // await encryptEntities(
    //   'api::campaign-enrolled-contact.campaign-enrolled-contact',
    //   ['token'],
    // );

    // await encryptEntities(
    //   'api::campaign-enrolled-lead.campaign-enrolled-lead',
    //   ['token'],
    // );

    // await encryptEntities('api::nylas-connection.nylas-connection', [
    //   'attachedEmail',
    // ]);

    await decryptEntities(
      'api::purchase-request-shipping-info.purchase-request-shipping-info',
      ['email', 'phoneNumber', 'address'],
    );

    await decryptEntities('api::shipment-card.shipment-card', [
      'email',
      'phoneNumber',
      'streetName',
      'apartment',
      'postcode',
    ]);

    await decryptEntities('api::tenant.tenant', ['email', 'phoneNumber']);

    // await encryptEntities('api::twilio-connection.twilio-connection', [
    //   'token',
    //   'phoneNumber',
    //   'keySecret',
    // ]);

    await decryptEntities('plugin::users-permissions.user', ['phoneNumber']);

    await decryptEntities('api::sessions.sessions', [
      'ip',
      'browser',
      'device',
    ]);

    return ctx.send({ message: 'Contacts updated successfully' });
  },
  async encrypt(ctx) {
    // please disable cleanPhoneNumber lyfecycle hook before running this code
    /*await encryptEntities('api::contact.contact', [
      'email',
      'phoneNumber',
      'address',
      'identityNumber',
    ]);

    await encryptEntities(
      'api::crm-additional-address.crm-additional-address',
      ['value'],
    );

    await encryptEntities('api::crm-additional-email.crm-additional-email', [
      'value',
    ]);

    // please disable cleanPhoneNumber lyfecycle hook before running this code
    await encryptEntities(
      'api::crm-additional-phone-number.crm-additional-phone-number',
      ['value'],
    );

    await encryptEntities('api::business-location.business-location', [
      'email',
      'phoneNumber',
    ]);

    // please disable cleanPhoneNumber lyfecycle hook before running this code
    await encryptEntities('api::company.company', [
      'address',
      'phoneNumber',
      'email',
    ]);

    await encryptEntities('api::form.form', ['sendTo']);

    await encryptEntities(
      'api::invoice-shipping-contact.invoice-shipping-contact',
      ['email', 'phoneNumber', 'address'],
    );

    // please disable cleanPhoneNumber lyfecycle hook before running this code
    await encryptEntities('api::lead.lead', [
      'email',
      'phoneNumber',
      'address',
    ]);

    // await encryptEntities(
    //   'api::campaign-enrolled-contact.campaign-enrolled-contact',
    //   ['token'],
    // );

    // await encryptEntities(
    //   'api::campaign-enrolled-lead.campaign-enrolled-lead',
    //   ['token'],
    // );

    // await encryptEntities('api::nylas-connection.nylas-connection', [
    //   'attachedEmail',
    // ]);

    await encryptEntities(
      'api::purchase-request-shipping-info.purchase-request-shipping-info',
      ['email', 'phoneNumber', 'address'],
    );

    await encryptEntities('api::shipment-card.shipment-card', [
      'email',
      'phoneNumber',
      'streetName',
      'apartment',
      'postcode',
    ]);

    await encryptEntities('api::tenant.tenant', ['email', 'phoneNumber']);

    // await encryptEntities('api::twilio-connection.twilio-connection', [
    //   'token',
    //   'phoneNumber',
    //   'keySecret',
    // ]);

    await encryptEntities('plugin::users-permissions.user', ['phoneNumber']);

    await encryptEntities('api::sessions.sessions', [
      'ip',
      'browser',
      'device',
    ]);*/

    return ctx.send({ message: 'Contacts updated successfully' });
  },
};
