import {
  BaseOptions,
  useCustomStoresQuery,
} from '@components/stores/hooks/useStoresQuery';

export const useArchivedStoresQuery = (baseOptions?: BaseOptions) =>
  useCustomStoresQuery({
    baseOptions,
    archived: true,
  });
