import { callback } from './controllers/callback';
import { emailConfirmation } from './controllers/emailConfirmation';
import { forgotPassword } from './controllers/forgotPassword';
import { resetPassword } from './controllers/resetPassword';
import { sendCustomerEmailConfirmation } from './controllers/sendCustomerEmailConfirmation';
import { sendEmailConfirmation } from './controllers/sendEmailConfirmation';
import providers from './services/providers';

export default (plugin) => {
  plugin.controllers.auth.forgotPassword = forgotPassword;
  plugin.controllers.auth.sendEmailConfirmation = sendEmailConfirmation;
  plugin.controllers.auth.sendCustomerEmailConfirmation =
    sendCustomerEmailConfirmation;
  plugin.controllers.auth.callback = callback;
  plugin.controllers.auth.emailConfirmation = emailConfirmation;
  plugin.controllers.auth.resetPassword = resetPassword;
  plugin.services.providers = providers;

  return plugin;
};
