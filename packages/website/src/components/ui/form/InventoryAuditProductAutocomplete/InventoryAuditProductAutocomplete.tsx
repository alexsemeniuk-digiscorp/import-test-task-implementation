import { AutocompleteInput } from '@form/inputs/autocompleteInput/AutocompleteInput';

import { useFetchListByFieldFromInventoryAuditItemsQuery } from '@/graphql';

import { FC, useMemo } from 'react';
import { useParams } from 'react-router';

interface InventoryAuditProductAutocompleteProps {
  type: 'names' | 'barcodes' | 'vendor';
  placeholder?: string;
}

export const InventoryAuditProductAutocomplete: FC<
  InventoryAuditProductAutocompleteProps
> = ({ type, placeholder, ...rest }) => {
  const { uuid } = useParams();

  const { data } = useFetchListByFieldFromInventoryAuditItemsQuery({
    variables: {
      uuid: uuid ?? '',
    },
    skip: !uuid,
  });

  const options = useMemo(() => {
    const list =
      type === 'names'
        ? data?.fetchListByFieldFromInventoryAuditItems?.names
        : data?.fetchListByFieldFromInventoryAuditItems?.barcodes;

    return (
      list
        ?.filter(Boolean)
        .map((value) => ({ label: value as string, value: value as string })) ||
      []
    );
  }, [data, type]);

  return (
    <AutocompleteInput options={options} placeholder={placeholder} {...rest} />
  );
};
