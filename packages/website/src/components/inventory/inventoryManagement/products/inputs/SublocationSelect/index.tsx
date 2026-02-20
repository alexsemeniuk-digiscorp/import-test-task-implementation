import { SelectProps } from 'antd/lib';
import { FC, useMemo } from 'react';

import { useDataSelect } from '@inventory/inventoryManagement/products/inputs/useDataSelect';

import { SearchSelect } from '@form/inputs/searchSelect/SearchSelect';
import { useSubLocationData } from '@inventory/inventoryManagement/hooks/useSubLocationData';
import { useCustomSelectLoader } from '@inventory/inventoryManagement/products/hooks/useCustomSelectLoader';
import { AddNewSelectButton } from '@ui/form/AddNewSelectButton';
import { Skeleton } from 'antd';

interface Props extends SelectProps {
  onChange?: (value: string | null) => void;
  initialValue?: string;
  businessLocationId: string;
  editable?: boolean;
  disabledOptions?: { value: string; label: string }[];
}

export const SubLocationSelectInput: FC<Props> = ({
  onChange,
  initialValue,
  businessLocationId,
  editable = true,
  disabledOptions,
  ...props
}) => {
  const { handleChange, handleSearch, selectedValue } = useDataSelect({
    onChange,
    initialSelectedValue: initialValue,
    initialFilters: {
      businessLocation: {
        id: { eq: businessLocationId },
      },
    },
  });

  const { loading, handleCreate, sublocations } =
    useSubLocationData(businessLocationId);

  const loader = useCustomSelectLoader(loading);

  const options = useMemo(() => {
    const types = sublocations || [];

    return types?.map((type) => ({
      value: type?.id,
      label: type?.attributes?.name,
      disabled: disabledOptions?.some(({ value }) =>
        value === '#1' ? '1' === type?.id : value === type?.id,
      ),
    }));
  }, [sublocations, disabledOptions]);

  if (loader) {
    return <Skeleton.Input active={true} size={'default'} block={true} />;
  }

  return (
    <SearchSelect
      allowClear
      defaultValue={initialValue}
      placeholder={`Select sublocation ${
        editable ? 'or create a new one' : ''
      }`}
      onChange={handleChange}
      value={selectedValue}
      options={options}
      loading={loading}
      onSearch={handleSearch}
      {...props}
      dropdownRender={(menu) => (
        <>
          {menu}
          {editable && <AddNewSelectButton handleAddNew={handleCreate} />}
        </>
      )}
    />
  );
};
