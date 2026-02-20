import {
  useCreateSubLocationMutation,
  useSubLocationsSelectLazyQuery,
  useUpdateSublocationMutation,
} from '@/graphql';
import { useStatusMessage } from '@app/StatusMessageContext/statusMessageContext';
import { useCallback, useEffect, useMemo } from 'react';

import { get } from 'lodash';

interface ReturnType {
  sublocations: SubLocationFragment[] | null;
  loading: boolean;
  handleCreate: (name: string) => Promise<void>;
  handleUpdate: (id: string, values: SublocationInput) => Promise<void>;
}

export function useSubLocationData(
  businessLocationId: string,
  queryParams?: { filters?: any; sort?: any },
): ReturnType {
  const message = useStatusMessage();
  const [fetch, { data, loading }] = useSubLocationsSelectLazyQuery();

  const sublocations = useMemo(
    () => get(data, 'sublocations.data', null),
    [data],
  );

  useEffect(() => {
    fetch({
      variables: {
        filters: {
          businessLocation: { id: { eq: businessLocationId } },
          ...queryParams?.filters,
        },
        sort: queryParams?.sort,
        pagination: {
          limit: -1,
        },
      },
    });
  }, [fetch, businessLocationId, queryParams]);

  const [createSubLocation, { loading: createLoading }] =
    useCreateSubLocationMutation({
      onError: () => message.open('error', 'Adding the sublocation failed.'),
      refetchQueries: [
        'subLocations',
        'subLocationsList',
        'subLocationsSelect',
      ],
    });

  const [updateSublocation, { loading: updLoading }] =
    useUpdateSublocationMutation({
      onError: () => message.open('error', 'Updating the sublocation failed.'),
      refetchQueries: [
        'subLocations',
        'subLocationsList',
        'subLocationsSelect',
      ],
    });

  const handleCreate = useCallback(
    async (name: string) => {
      await createSubLocation({
        variables: {
          input: {
            name,
            businessLocation: businessLocationId,
          },
        },
        onCompleted: async (data) => {
          if (data?.createSublocation?.data?.id) {
            message.open(
              'success',
              'The sublocation has been added successfully.',
            );
          }
        },
      });
    },
    [businessLocationId, createSubLocation, message],
  );

  const handleUpdate = useCallback(
    async (id: string, values: SublocationInput) => {
      if (id)
        await updateSublocation({
          variables: {
            id,
            input: {
              ...values,
            },
          },
          onCompleted: async (data) => {
            if (data?.updateSublocation?.data?.id) {
              message.open(
                'success',
                'The sublocation has been updated successfully.',
              );
            }
          },
        });
    },
    [updateSublocation, message],
  );

  return {
    sublocations,
    loading: createLoading || loading || updLoading,
    handleCreate,
    handleUpdate,
  };
}
