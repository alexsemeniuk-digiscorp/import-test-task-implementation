import { useNavigate } from 'react-router';

import { useLoginMutation } from '@/graphql';

import { usePlatformRoutes } from '@router/routes';

import { useStatusMessage } from '@app/StatusMessageContext/statusMessageContext';

export const useLogin = (): ReturnType<typeof useLoginMutation> => {
  const message = useStatusMessage();
  const navigate = useNavigate();

  const routes = usePlatformRoutes();

  return useLoginMutation({
    onCompleted: (data) => {
      if (data?.login?.user) {
        navigate(routes.index);
      }
    },
    onError: (error, clientOptions) => {
      if (error.message.includes('Your account email is not confirmed')) {
        message.open('error', 'Your account email is not confirmed');

        navigate(routes.auth.notConfirmed, {
          state: {
            email: clientOptions?.variables?.input?.identifier,
          },
        });
      } else {
        if (
          error.message.includes(
            'Your account has been blocked by an administrator',
          )
        ) {
          message.open(
            'error',
            'Your account has been blocked by an administrator',
          );
        } else {
          message.open('error', 'Invalid email or password, please try again');
        }
      }
    },
  });
};
