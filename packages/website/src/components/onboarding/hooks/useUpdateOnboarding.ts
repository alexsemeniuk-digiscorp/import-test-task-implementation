import { useOnboardingsQuery, useUpdateOnboardingMutation } from '@/graphql';
import { useStatusMessage } from '@app/StatusMessageContext/statusMessageContext';
import { useCallback } from 'react';

type ReturnType = {
  handleUpdateOnboarding: (values: OnboardingInput) => Promise<void>;
  loading: boolean;
};

export const useUpdateOnboarding = (tenantSlug: string): ReturnType => {
  const message = useStatusMessage();

  const { data } = useOnboardingsQuery({
    variables: {
      filters: {
        tenant: {
          slug: {
            eq: tenantSlug,
          },
        },
      },
    },
  });

  const onboardingId = data?.onboardings?.data[0]?.id as string;

  const [update, { loading }] = useUpdateOnboardingMutation({
    onError: () => {
      message?.open('error');
    },
    refetchQueries: ['onboardings'],
  });

  const handleUpdateOnboarding = useCallback(
    async (values: OnboardingInput) => {
      await update({
        variables: {
          id: onboardingId,
          input: {
            ...values,
          },
        },
      });
    },
    [onboardingId, update],
  );

  return {
    handleUpdateOnboarding,
    loading,
  };
};
