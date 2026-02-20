import * as Apollo from '@apollo/client';
import { ObservableQuery } from '@apollo/client';

import { useBusinessLocationsCardsQuery } from '@/graphql';

export type BaseOptions = Apollo.QueryHookOptions<
  BusinessLocationsCardsQuery,
  BusinessLocationsCardsQueryVariables
>;

interface Props {
  baseOptions?: BaseOptions;
  archived?: boolean;
}

const getNormalizedVariables = (
  archived = false,
  variables?: BusinessLocationsQueryVariables,
): BusinessLocationsQueryVariables => ({
  ...(variables ? variables : {}),
  filters: {
    ...(variables?.filters ? variables.filters : {}),
    archived: {
      eq: archived,
    },
    type: {
      eq: 'store',
    },
  },
});

const getCustomRefetch = async (
  refetch: ObservableQuery<
    BusinessLocationsCardsQuery,
    BusinessLocationsCardsQueryVariables
  >['refetch'],
  archived = false,
  variables?: BusinessLocationsQueryVariables,
  baseVariables?: BusinessLocationsQueryVariables,
) =>
  refetch({
    ...(variables
      ? getNormalizedVariables(archived, variables)
      : baseVariables),
  });

export const useCustomStoresQuery = ({
  baseOptions,
  archived = false,
}: Props) => {
  const params = {
    ...(baseOptions ? baseOptions : {}),
    variables: getNormalizedVariables(archived, baseOptions?.variables),
  };

  const query = useBusinessLocationsCardsQuery(params);

  return {
    ...query,
    refetch: async (variables?: BusinessLocationsQueryVariables) =>
      getCustomRefetch(query.refetch, archived, variables, params.variables),
  };
};
