import { FC, useEffect, useState } from 'react';

import { SelectProps } from 'antd/lib';

import { useRolesQuery } from '@/graphql';

import { SearchSelect } from '@form/inputs/searchSelect/SearchSelect';

import { useTenantInfo } from '@hooks/useTenantInfo';

interface Props extends SelectProps {
  onChange?: (value: string) => void;
}

export const UserRolesSelect: FC<Props> = ({ onChange, ...props }) => {
  const [filters, setFilters] = useState<UsersPermissionsRoleFiltersInput>({});
  const { tenantId } = useTenantInfo();

  const { data, loading, refetch } = useRolesQuery({
    variables: {
      filters: {
        ...filters,
        or: [
          {
            name: {
              eq: 'Employee',
            },
          },
          {
            description: {
              containsi: tenantId,
            },
          },
        ],
      },
    },
  });

  useEffect(() => {
    refetch();
  }, [filters, refetch]);

  const roles = data?.usersPermissionsRoles?.data || [];

  const rolesItems = roles
    ?.map((role) => {
      return {
        value: role?.id,
        label: role?.attributes?.name,
      };
    })
    .filter((item) => item !== null);

  const handleSearch = (value: string) => {
    setFilters({
      name: {
        containsi: value,
      },
    });
  };

  return (
    <SearchSelect
      placeholder={'Select the team'}
      onChange={onChange}
      options={rolesItems as SelectProps['options']}
      loading={loading}
      onSearch={handleSearch}
      {...props}
    />
  );
};
