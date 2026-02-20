import {
  BaseOptions,
  useCustomStoresQuery,
} from '@components/stores/hooks/useStoresQuery';

export const useActiveStoresQuery = (baseOptions?: BaseOptions) =>
  useCustomStoresQuery({
    baseOptions,
    archived: false,
  });
