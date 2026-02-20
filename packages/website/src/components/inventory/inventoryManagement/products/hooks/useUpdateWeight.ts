import { useCallback, useMemo } from 'react';

import { useUpdateWeightMutation } from '@/graphql';

import { useStatusMessage } from '@app/StatusMessageContext/statusMessageContext';

import { FetchResult } from '@apollo/client';
import { hasObjectChanged } from '@inventory/inventoryManagement/helpers/helpers';
import { useCreateWeight } from '@inventory/inventoryManagement/products/hooks/useCreateWeight';
import { WeightValues } from '@inventory/inventoryManagement/products/types';
import omit from 'lodash/omit';

type ReturnType = {
  handleUpdate: (
    values?: WeightValues,
    productId?: string,
  ) => Promise<void | FetchResult<UpdateWeightMutation>>;
  initialValues: WeightValues | undefined;
  isUpdateLoading: boolean;
};

export const useUpdateWeight = (
  type: 'product' | 'stone',
  weight?: Maybe<WeightFragment>,
): ReturnType => {
  const message = useStatusMessage();

  const { handleCreate: createWeight, loading: createLoading } =
    useCreateWeight(type);
  const [updateWeight, { loading: updateLoading }] = useUpdateWeightMutation({
    onError: () => {
      message.open('error');
    },
  });

  const initialValues: WeightValues | undefined = useMemo(() => {
    const { id, attributes } = weight || {};

    return id
      ? {
          id,
          ...omit(attributes || {}, ['__typename']),
        }
      : undefined;
  }, [weight]);

  const handleUpdate = useCallback(
    async (values?: WeightValues, entityId?: string) => {
      if (!entityId || !values) {
        return;
      }
      if (!initialValues?.id) {
        return createWeight(values, entityId);
      }

      if (values.id && hasObjectChanged({ newValues: values, initialValues })) {
        const { id, ...otherValues } = values;
        if (type === 'product') {
          await updateWeight({
            variables: {
              id: id,
              input: {
                ...otherValues,
                product: entityId,
              },
            },
          });
        }
      }
    },
    [createWeight, initialValues, type, updateWeight],
  );

  return {
    handleUpdate,
    initialValues,
    isUpdateLoading: updateLoading || createLoading,
  };
};
