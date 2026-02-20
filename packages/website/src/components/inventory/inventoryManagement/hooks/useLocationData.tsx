import { useCallback, useState } from 'react';

import { useBusinessLocationsCardsQuery } from '@/graphql';

import { useActiveStoresQuery } from '@components/stores/hooks/useActiveStoresQuery';

import { AnyObject, ObjectKeys, ObjectValues } from '@helpers/types';

import { BusinessLocationsSelect } from '@ui/form/BusinessLocationsSelect';

import { CustomFormItem } from '@form/item/FormItem';
import { Form } from 'antd';
import { NamePath } from 'antd/es/form/interface';

type LocationData = AnyObject & {
  businessLocation?: Maybe<string>;
};

const buildInitialLocationData = <T extends LocationData>(
  locations: BusinessLocationCardFragment[],
  initialValues?: T[],
): T[] => {
  const neededLocations = locations.filter(
    (location) =>
      !initialValues?.find(
        (initial) => initial.businessLocation === location?.id,
      ),
  );

  return [
    ...(initialValues ? initialValues : []),
    ...neededLocations.map(
      (location) =>
        ({
          businessLocation: location.id,
        }) as T,
    ),
  ];
};

interface Props<T extends LocationData, F extends AnyObject = AnyObject> {
  storesOnly?: boolean;
  initialValues?: T[];
  fieldName: ObjectKeys<F>;
}

const locationQueriesMap = {
  ['stores']: useActiveStoresQuery,
  ['all']: useBusinessLocationsCardsQuery,
};

export const useLocationData = <
  T extends LocationData,
  F extends AnyObject = AnyObject,
>({
  storesOnly = true,
  initialValues,
  fieldName,
}: Props<T, F>) => {
  const form = Form.useFormInstance<F>();

  const locationData = Form.useWatch(fieldName, form) as LocationData[];

  const handleChange = useCallback(
    (locationData: T[]) => {
      form.setFieldValue(fieldName as NamePath, locationData);
    },
    [fieldName, form],
  );

  const [activeLocation, setActiveLocation] = useState<string | null>(null);

  const { data: businessLocationsData } = locationQueriesMap[
    storesOnly ? 'stores' : 'all'
  ]({
    variables: {
      sort: ['id:asc'],
    },
    onCompleted: (data) => {
      if (data.businessLocations?.data) {
        handleChange(
          buildInitialLocationData(
            data?.businessLocations?.data,
            initialValues,
          ),
        );

        setActiveLocation(data?.businessLocations?.data[0]?.id || null);
      }
    },
  });

  const handleChangeLocationData = useCallback(
    (key: ObjectKeys<T>, locationId?: Maybe<string>) =>
      (value: ObjectValues<T>) => {
        const newLocationData = locationData?.map((location) => {
          if (location.businessLocation === locationId) {
            return {
              ...location,
              [key]: value,
            };
          }

          return location;
        }) as T[];

        handleChange(newLocationData);
      },
    [handleChange, locationData],
  );

  const renderSelect = useCallback(
    () => (
      <CustomFormItem label={'Location'}>
        <BusinessLocationsSelect
          value={activeLocation}
          onChange={setActiveLocation}
          storesOnly={storesOnly}
        />
      </CustomFormItem>
    ),
    [activeLocation, setActiveLocation, storesOnly],
  );

  return {
    activeLocation,
    setActiveLocation,
    handleChangeLocationData,
    locationData,
    renderSelect,
  };
};
