import { DEFAULT_EMAIL_DOMAIN } from '../../../../graphql/constants/defaultValues';

export const isInvalidEmailDomain = (email: string) =>
  email.endsWith(DEFAULT_EMAIL_DOMAIN);
