import { TenantValues } from '@components/onboarding/types';
import { transformGqlFileToAntd } from '@components/uploadFile/helpers';

export const transformTenantData = (tenant: TenantFragment): TenantValues => {
  return {
    logo:
      tenant?.attributes?.logo?.data &&
      transformGqlFileToAntd(tenant?.attributes?.logo?.data),
    mainLocation: tenant?.attributes?.mainLocation?.data?.id as string,
    address: tenant?.attributes?.mainLocation?.data?.attributes?.address,
    zipcode: tenant?.attributes?.mainLocation?.data?.attributes?.zipcode,
    email: tenant?.attributes?.email ?? '',
    phoneNumber: tenant?.attributes?.phoneNumber ?? '',
    websiteUrl: tenant?.attributes?.websiteUrl ?? '',
    emailSender: tenant?.attributes?.emailSender ?? '',
    isOnboardingCompleted:
      tenant?.attributes?.onboarding?.data?.attributes?.isCompleted ?? false,
  };
};
