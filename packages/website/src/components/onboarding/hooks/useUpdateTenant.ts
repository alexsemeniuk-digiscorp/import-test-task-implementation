import { useTenantBySlugQuery, useUpdateTenantMutation } from '@/graphql';
import { useStatusMessage } from '@app/StatusMessageContext/statusMessageContext';
import { transformTenantData } from '@components/onboarding/helpers/transformTenantData';

import {
  EmailFormTypes,
  LogoFormType,
  TenantValues,
} from '@components/onboarding/types';

import { useCreateMainLocation } from '@components/onboarding/hooks/useCreateMainLocation';
import { useUpdateOnboarding } from '@components/onboarding/hooks/useUpdateOnboarding';
import { useUploadFile } from '@components/uploadFile/hooks/useUploadFile';
import { useCallback, useMemo } from 'react';

type ReturnType = {
  handleUpdateTenantEmailAndPhone: (values: EmailFormTypes) => Promise<void>;
  handleUploadLogo: (values: LogoFormType) => Promise<void>;
  handleUpdateLocation: (values: LocationInput) => Promise<void>;
  handleUpdateTenant: (values: TenantInput) => Promise<void>;
  loading: boolean;
  initialValues: TenantValues;
};

export const useUpdateTenant = (tenantSlug: string): ReturnType => {
  const message = useStatusMessage();
  const { data } = useTenantBySlugQuery({
    variables: { tenantSlug },
  });

  const { handleUpdateOnboarding, loading: onboardingLoading } =
    useUpdateOnboarding(tenantSlug as string);

  const tenantId = data?.tenants?.data[0]?.id as string;
  const tenant = data?.tenants?.data[0] as TenantFragment;

  const initialValues = useMemo(() => {
    return transformTenantData(tenant);
  }, [tenant]);

  const [updateTenant, { loading }] = useUpdateTenantMutation({
    onError: () => {
      message?.open('error');
    },
  });

  const { handleUpload, loading: createFileLoading } = useUploadFile([
    'tenantBySlug',
  ]);

  const { handleCreateMainLocation, loading: createLocationLoading } =
    useCreateMainLocation(tenantId);

  const handleUploadLogo = useCallback(
    async (values: LogoFormType) => {
      const { logo } = values;

      await handleUpload(logo as File, {
        field: 'logo',
        ref: 'api::tenant.tenant',
        refId: tenantId,
      });
      await handleUpdateOnboarding({ isLogoUpload: true });
    },
    [handleUpdateOnboarding, handleUpload, tenantId],
  );

  const handleUpdateLocation = useCallback(
    async (values: LocationInput) => {
      await handleCreateMainLocation(values);
    },
    [handleCreateMainLocation],
  );

  const handleUpdateTenantEmailAndPhone = useCallback(
    async (values: EmailFormTypes) => {
      await updateTenant({
        variables: {
          id: tenantId,
          input: {
            ...values,
          },
        },
        onCompleted: async () => {
          await handleUpdateOnboarding({ isEmailAndPhone: true });
          message?.open(
            'success',
            'Email and phone number updated successfully',
          );
        },
      });
    },
    [handleUpdateOnboarding, message, tenantId, updateTenant],
  );

  const handleUpdateTenant = useCallback(
    async (values: TenantInput) => {
      const { logo, mainLocation, locations, ...rest } = values;
      await updateTenant({
        variables: {
          id: tenantId,
          input: { ...rest },
        },
        onCompleted: () => {
          message.open('success', 'Information updated successfully');
        },
      });
    },
    [message, tenantId, updateTenant],
  );

  return {
    handleUpdateTenantEmailAndPhone,
    handleUploadLogo,
    handleUpdateLocation,
    handleUpdateTenant,
    loading:
      loading ||
      createFileLoading ||
      onboardingLoading ||
      createLocationLoading,
    initialValues,
  };
};
