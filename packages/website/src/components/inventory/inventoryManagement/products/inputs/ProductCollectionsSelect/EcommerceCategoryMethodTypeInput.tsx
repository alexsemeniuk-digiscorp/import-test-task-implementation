import { useUserSettingsContext } from '@/components/app/UserSettingsProvider';
import { useShopifyCollectionsMutation } from '@/graphql';
import { Select } from 'antd';
import { FC, useEffect, useMemo } from 'react';

export interface EcommerceCategorySelectProps {
  value?: string | null;
  onChange?: (value: string | null) => void;
  placeholder?: string;
  ecommerceType: 'shopify' | 'woocommerce';
}

export const EcommerceCategorySelect: FC<EcommerceCategorySelectProps> = ({
  value,
  onChange,
  placeholder = 'Select a category',
  ecommerceType,
}) => {
  const { meData } = useUserSettingsContext();

  const [fetchCollections, { data, loading }] = useShopifyCollectionsMutation();

  useEffect(() => {
    if (!data) {
      fetchCollections({
        variables: {
          input: {
            tenantId: Number(meData?.me?.attributes?.tenant?.data?.id),
            ecommerceType,
          },
        },
      });
    }
  }, [data, fetchCollections, meData, ecommerceType]);

  const options = useMemo(() => {
    return (
      data?.shopifyCollections?.data?.map((collection) => ({
        value: collection?.id,
        label: collection?.title,
      })) || []
    );
  }, [data]);

  return (
    <Select
      showSearch
      allowClear
      placeholder={placeholder}
      options={options}
      value={value}
      onChange={onChange}
      loading={loading}
      style={{ width: '100%' }}
    />
  );
};
