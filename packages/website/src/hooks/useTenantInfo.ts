import { useTenantBySlugQuery } from '@/graphql';
import { getCdnImage } from '@helpers/getCdnImage';
import { useRouteTenant } from '@hooks/useRouteTenant';
import { get } from 'lodash';

type ReturnType = {
  tenantId: string;
  mainLogo: string;
  mainAddress: string;
  mainPhone: string;
  mainSiteUrl: string;
  mainCompanyName: string;
  mainEmail: string;
  twilioConnectionId: string;
  nylasConnection: boolean;
  paymentGatewayType: EnumTenantPaymentgatewaytype | null;
};

export const useTenantInfo = (): ReturnType => {
  const tenantSlug = useRouteTenant();

  const { data } = useTenantBySlugQuery({
    variables: { tenantSlug: tenantSlug as string },
  });

  const tenantData = get(data, 'tenants.data', [])[0];

  const tenantId = get(tenantData, 'id', '');
  const mainLogo = getCdnImage(
    get(tenantData, 'attributes.logo.data.attributes.url', ''),
  );
  const mainAddress = get(
    tenantData,
    'attributes.mainLocation.data.attributes.address',
    '',
  );

  const mainEmail = get(tenantData, 'attributes.email', '');
  const mainPhone = get(tenantData, 'attributes.phoneNumber', '');
  const mainSiteUrl = get(tenantData, 'attributes.websiteUrl', '');
  const mainCompanyName = get(tenantData, 'attributes.companyName', '');
  const twilioConnectionId = get(
    tenantData,
    'attributes.twilioConnection.data.id',
    '',
  );
  const paymentGatewayType = get(
    tenantData,
    'attributes.paymentGatewayType',
    null,
  );

  const nylasConnection = get(tenantData, 'attributes.nylas_connection.data[0]')
    ? true
    : false;

  return {
    tenantId,
    mainLogo,
    mainAddress,
    mainPhone,
    mainSiteUrl,
    mainCompanyName,
    mainEmail,
    twilioConnectionId,
    paymentGatewayType,
    nylasConnection,
  };
};
