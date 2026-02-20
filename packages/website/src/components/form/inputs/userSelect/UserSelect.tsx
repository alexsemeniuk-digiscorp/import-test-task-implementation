import { ReactNode, useCallback, useMemo } from 'react';

import { SelectProps } from 'antd/lib';

import { isNotEmpty } from '@helpers/types';

import AvatarInfo from '@ui/avatar/AvatarInfo';

import { SearchSelect } from '@form/inputs/searchSelect/SearchSelect';

export type ValueType = string | string[];

export interface CustomOption {
  value: string;
  label: ReactNode;
  title: string;
  disabled?: boolean;
  className?: string;
}

export const buildOption = (
  user: Maybe<UserDataFragment>,
  selectedIds?: Maybe<string>[],
): CustomOption | null =>
  user
    ? {
        value: user?.id || '0',
        title: user?.attributes?.fullName || 'Unnamed',
        label: (
          <AvatarInfo
            title={user?.attributes?.fullName || 'Unnamed'}
            description={
              user?.attributes?.email !== user?.attributes?.fullName
                ? user?.attributes?.email
                : undefined
            }
            src={user?.attributes?.avatar?.data?.attributes?.url}
          />
        ),
        disabled: selectedIds?.includes(user?.id),
      }
    : null;

interface Props<V extends ValueType = string>
  extends Omit<
    SelectProps<V, CustomOption>,
    'options' | 'onSearch' | 'onChange'
  > {
  data?: Maybe<UserDataFragment>[];
  changeFilters: (filters: UsersPermissionsUserFiltersInput) => void;
  onChange?: (value: V) => void;
  selectedIds?: Maybe<string>[];
}

export const UserSelect = <V extends ValueType = string>(props: Props<V>) => {
  const {
    data,
    changeFilters,
    onChange,
    defaultValue,
    selectedIds,
    ...restProps
  } = props;

  const handleSearch = useCallback(
    (value: string) => {
      const [firstName, lastName] = value.split(' ');

      changeFilters(
        value
          ? {
              or: [
                {
                  firstName: {
                    containsi: firstName || value,
                  },
                },
                {
                  lastName: {
                    containsi: lastName || value,
                  },
                },
                {
                  email: {
                    containsi: value,
                  },
                },
              ],
            }
          : {},
      );
    },
    [changeFilters],
  );

  const options = useMemo<CustomOption[]>(
    () =>
      data?.map((user) => buildOption(user, selectedIds)).filter(isNotEmpty) ||
      [],
    [data, selectedIds],
  );

  const handleFilterClear = useCallback(
    (value: V) => {
      if (value?.length > 0) {
        changeFilters({});
      }
    },
    [changeFilters],
  );

  const handleChange = useCallback(
    (value: V) => {
      handleFilterClear(value);

      onChange?.(value);
    },
    [onChange, handleFilterClear],
  );

  return (
    <SearchSelect<V, CustomOption>
      options={options}
      optionLabelProp={'title'}
      onChange={handleChange}
      onSearch={handleSearch}
      defaultValue={defaultValue}
      allowClear
      {...restProps}
    />
  );
};
