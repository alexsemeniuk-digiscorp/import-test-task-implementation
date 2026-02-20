import { useCallback, useMemo } from 'react';

import { useUpdateDimensionMutation } from '@/graphql';

import { useStatusMessage } from '@app/StatusMessageContext/statusMessageContext';

import { hasObjectChanged } from '@inventory/inventoryManagement/helpers/helpers';

import { DimensionValues } from '@inventory/inventoryManagement/products/types';

import { useCreateDimension } from '@inventory/inventoryManagement/products/hooks/useCreateDimension';
import omit from 'lodash/omit';

type ReturnType = {
  handleUpdate: (values: DimensionValues, productId?: string) => Promise<void>;
  initialValues: DimensionValues | undefined;
  isUpdateLoading: boolean;
};

export const useUpdateDimension = (
  dimension?: Maybe<DimensionFragment>,
): ReturnType => {
  const message = useStatusMessage();

  const { handleCreate: createDimension, loading: createLoading } =
    useCreateDimension();

  const [updateDimension, { loading: updateLoading }] =
    useUpdateDimensionMutation({
      onError: () => {
        message.open('error');
      },
    });

  const initialValues: DimensionValues | undefined = useMemo(() => {
    const { id, attributes } = dimension || {};

    return id
      ? {
          id,
          ...omit(attributes || {}, ['__typename']),
        }
      : undefined;
  }, [dimension]);

  const handleUpdate = useCallback(
    async (values: DimensionValues, productId?: string) => {
      if (!productId || !values) {
        return;
      }

      if (
        values.id &&
        hasObjectChanged({
          newValues: values,
          initialValues,
        })
      ) {
        const { id, ...otherValues } = values;

        await updateDimension({
          variables: {
            id: id as string,
            input: {
              ...otherValues,
              product: productId,
            },
          },
        });
      }

      if (!initialValues?.id) {
        await createDimension(values, productId);
      }
    },
    [createDimension, initialValues, updateDimension],
  );

  return {
    handleUpdate,
    initialValues,
    isUpdateLoading: updateLoading || createLoading,
  };
};
