import { useCreateLocationMutation, useUpdateTenantMutation } from '@/graphql';
import { useStatusMessage } from '@app/StatusMessageContext/statusMessageContext';

import { useUpdateOnboarding } from '@components/onboarding/hooks/useUpdateOnboarding';
import { useRouteTenant } from '@hooks/useRouteTenant';
import { useCallback } from 'react';

type ReturnType = {
  loading: boolean;
  handleCreateMainLocation: (values: LocationInput) => Promise<void>;
};

export const useCreateMainLocation = (tenantId: string): ReturnType => {
  const message = useStatusMessage();
  const tenantSlug = useRouteTenant();
  const { handleUpdateOnboarding, loading: onboardingLoading } =
    useUpdateOnboarding(tenantSlug as string);

  const [createLocation, { loading: locationLoading }] =
    useCreateLocationMutation({
      onError: () => {
        message?.open('error');
      },
    });

  const [update, { loading: updateTenantLoading }] = useUpdateTenantMutation({
    onError: () => {
      message?.open('error');
    },
  });

  const handleCreateMainLocation = useCallback(
    async (values: LocationInput) => {
      const { zipcode, address } = values;
      await createLocation({
        variables: {
          input: {
            address,
            zipcode,
          },
        },
        onCompleted: async (data) => {
          if (data.createLocation?.data?.id) {
            await update({
              variables: {
                id: tenantId,
                input: {
                  mainLocation: data.createLocation?.data?.id,
                },
              },
            });
            await handleUpdateOnboarding({ isMainLocation: true });
            message?.open('success', 'Location create successfully');
          }
        },
      });
    },
    [createLocation, handleUpdateOnboarding, message, tenantId, update],
  );

  return {
    loading: locationLoading || updateTenantLoading || onboardingLoading,
    handleCreateMainLocation,
  };
};
