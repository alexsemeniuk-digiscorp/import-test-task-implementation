import { ImportResultKeys } from '@app/ImportingContext/types/types';
import RenderDate from '@components/accounting/transactions/TransactionTable/TransactionColumns/RenderDate';
import RenderId from '@components/accounting/transactions/TransactionTable/TransactionColumns/RenderId';
import { ProductFromCsvDropdown } from '@components/dashboard/dashboardSettings/SettingsModuleFactory/sections/importEntity/product/ProductFromCsvDropdown';
import { ProductDataWithErrors } from '@components/dashboard/dashboardSettings/SettingsModuleFactory/sections/importEntity/product/types/types';
import { PRODUCT_ITEM_VALUES } from '@components/dashboard/dashboardSettings/SettingsModuleFactory/sections/importEntity/product/utils/variables';
import { productId } from '@components/dashboard/dashboardSettings/SettingsModuleFactory/sections/importEntity/ui/defaultColumns/aditionalColumns';
import { errorsColumn } from '@components/dashboard/dashboardSettings/SettingsModuleFactory/sections/importEntity/ui/defaultColumns/errorColumn';
import { APP_ID } from '@components/dashboard/dashboardSettings/SettingsModuleFactory/sections/importEntity/utils/utils';
import { formatToCurrency, toCamelCase } from '@helpers/formatter';
import { CustomTable } from '@ui/table/CustomTable';
import { baseColumnFactory } from '@ui/table/column';
import {
  COLUMN_WIDTH_S,
  COLUMN_WIDTH_XL,
  COLUMN_WIDTH_XXL,
  COLUMN_WIDTH_XXXL,
  COLUMN_WIDTH_XXXXL,
} from '@ui/table/helpers';
import { DEFAULT_PAGINATION } from '@ui/table/hooks/useTableParams';
import { Grid } from 'antd';
import { AnyObject } from 'antd/es/_util/type';
import { ColumnType } from 'antd/es/table';
import { FC, useMemo } from 'react';

export type ImportTableType = 'created' | 'spoiled' | 'resolve';
interface Props {
  data: ProductDataWithErrors[];
  type: ImportResultKeys;
  loading: boolean;
  maxArrayCounts: {
    maxProductsCount: number;
    maxImagesCount: number;
  };
  overrideColums?: {
    completedImports?: string[];
    unvalidatedImports?: string[];
    needChangeCreations?: string[];
  };
  propsScroll?: number;
  customFieldsColumns: string[];
  total?: number;
  onChange: (page: number, pageSize: number) => void;
}

const columns: ColumnType<AnyObject>[] = [
  baseColumnFactory({
    title: APP_ID,
    dataIndex: ['regexedId'],
    render: (value) => <RenderId copyable value={value} />,
    width: COLUMN_WIDTH_XXXL,
  }),
  baseColumnFactory({
    title: 'BARCODE ID',
    dataIndex: ['barcodeId'],
    render: (value) => (
      <RenderId copyable value={value} symbolsAmount={Infinity} />
    ),
    width: COLUMN_WIDTH_XXXL,
  }),
  baseColumnFactory({
    title: 'NAME',
    dataIndex: ['name'],
    render: (value) => (
      <RenderId copyable value={value} symbolsAmount={Infinity} />
    ),
    width: COLUMN_WIDTH_XXXL,
  }),
  baseColumnFactory({
    title: 'DEFAULT PRICE',
    dataIndex: ['defaultPrice'],
    render: (value) => <RenderId copyable value={formatToCurrency(value)} />,
    width: COLUMN_WIDTH_XXL,
  }),
  baseColumnFactory({
    title: 'PRODUCT TYPE',
    dataIndex: ['productType'],
    render: (value) => <RenderId copyable value={value} />,
    width: COLUMN_WIDTH_XXL,
  }),
  baseColumnFactory({
    title: 'BRAND',
    dataIndex: ['brand'],
    render: (value) => <RenderId copyable value={value} />,
    width: COLUMN_WIDTH_XXXL,
  }),
  baseColumnFactory({
    title: 'MODEL',
    dataIndex: ['model'],
    render: (value) => <RenderId copyable value={value} />,
    width: COLUMN_WIDTH_XXXL,
  }),
  baseColumnFactory({
    title: 'DIMENSION LENGTH',
    dataIndex: ['dimensionLength'],
    render: (value) => <RenderId copyable value={value} />,
    width: COLUMN_WIDTH_XXL,
  }),
  baseColumnFactory({
    title: 'DIMENSION WIDTH',
    dataIndex: ['dimensionWidth'],
    render: (value) => <RenderId copyable value={value} />,
    width: COLUMN_WIDTH_XXL,
  }),
  baseColumnFactory({
    title: 'DIMENSION HEIGHT',
    dataIndex: ['dimensionHeight'],
    render: (value) => <RenderId copyable value={value} />,
    width: COLUMN_WIDTH_XXL,
  }),
  baseColumnFactory({
    title: 'DIMENSION UNIT',
    dataIndex: ['dimensionUnit'],
    render: (value) => <RenderId copyable value={value} />,
    width: COLUMN_WIDTH_XL,
  }),
  baseColumnFactory({
    title: 'WEIGHT',
    dataIndex: ['weight'],
    render: (value) => <RenderId copyable value={value} />,
    width: COLUMN_WIDTH_XXL,
  }),
  baseColumnFactory({
    title: 'WEIGHT UNIT',
    dataIndex: ['weightUnit'],
    render: (value) => <RenderId copyable value={value} />,
    width: COLUMN_WIDTH_XL,
  }),
  baseColumnFactory({
    title: 'SKU',
    dataIndex: ['sku'],
    render: (value) => <RenderId copyable value={value} />,
    width: COLUMN_WIDTH_XXXL,
  }),
  baseColumnFactory({
    title: 'UPC',
    dataIndex: ['upc'],
    render: (value) => <RenderId copyable value={value} />,
    width: COLUMN_WIDTH_XXXL,
  }),
  baseColumnFactory({
    title: 'MPN',
    dataIndex: ['mpn'],
    render: (value) => <RenderId copyable value={value} />,
    width: COLUMN_WIDTH_XXXL,
  }),
  baseColumnFactory({
    title: 'EAN',
    dataIndex: ['ean'],
    render: (value) => <RenderId copyable value={value} />,
    width: COLUMN_WIDTH_XXXL,
  }),
  baseColumnFactory({
    title: 'ISBN',
    dataIndex: ['isbn'],
    render: (value) => <RenderId copyable value={value} />,
    width: COLUMN_WIDTH_XXXL,
  }),
  baseColumnFactory({
    title: 'PARTS WARRANTY',
    dataIndex: ['partsWarranty'],
    render: (value) => <RenderDate copyable value={value} />,
    width: COLUMN_WIDTH_XXXL,
  }),
  baseColumnFactory({
    title: 'LABOR WARRANTY',
    dataIndex: ['laborWarranty'],
    render: (value) => <RenderDate copyable value={value} />,
    width: COLUMN_WIDTH_XXXL,
  }),
  baseColumnFactory({
    title: 'DESCRIPTION',
    dataIndex: ['description'],
    render: (value) => <RenderId copyable value={value} />,
    width: COLUMN_WIDTH_XXXL,
  }),
  baseColumnFactory({
    title: 'ECOMMERCE DESCRIPTION',
    dataIndex: ['ecommerceDescription'],
    render: (value) => <RenderId copyable value={value} />,
    width: COLUMN_WIDTH_XXXL,
  }),
  baseColumnFactory({
    title: 'SHOPIFY TAGS',
    dataIndex: ['shopifyTags'],
    render: (value) => <RenderId copyable value={value} />,
    width: COLUMN_WIDTH_XXXL,
  }),
  baseColumnFactory({
    title: 'ALLOW NEGATIVE QUANTITY',
    dataIndex: ['isNegativeCount'],
    render: (value) => <RenderId copyable value={value} />,
    width: COLUMN_WIDTH_XL,
  }),
  baseColumnFactory({
    title: 'VISIBLE ITEM',
    dataIndex: ['active'],
    render: (value) => <RenderId copyable value={value} />,
    width: COLUMN_WIDTH_XL,
  }),
];

const getOverrideColumns = (
  overrideColums: string[],
  type: 'completedImports' | 'unvalidatedImports' | 'needChangeCreations',
) => {
  return columns.filter(
    (column) => overrideColums?.includes(column.title as string),
  );
};

const ImportProductsTable: FC<Props> = ({
  data,
  type,
  loading,
  overrideColums,
  maxArrayCounts,
  propsScroll,
  customFieldsColumns,
  total,
  onChange,
}) => {
  const screens = Grid.useBreakpoint();
  const isTablet = !screens.lg;

  const dropdownColumn: ColumnType<AnyObject>[] = useMemo(
    () => [
      {
        dataIndex: [],
        render: (_, atr) => {
          return (
            <ProductFromCsvDropdown
              atr={atr as ProductDataWithErrors}
              tableType={type}
              maxArrayCounts={maxArrayCounts}
              customFieldsColumns={customFieldsColumns}
              total={total}
              onChange={onChange}
            />
          );
        },
        fixed: isTablet ? undefined : 'right',
        width: COLUMN_WIDTH_S,
      },
    ],
    [type, maxArrayCounts, customFieldsColumns, onChange, total, isTablet],
  );

  const dynamicCustomFieldsColumns = useMemo(() => {
    return customFieldsColumns?.map((field) =>
      baseColumnFactory({
        title: field,
        dataIndex: [field],
        width: COLUMN_WIDTH_XXXL,
        render: (value, atr) => {
          return (
            <RenderId
              copyable
              value={
                (atr.customFields as unknown as Record<string, string>)[field]
              }
            />
          );
        },
      }),
    );
  }, [customFieldsColumns]);

  const imagesColumns: ColumnType<AnyObject>[] = useMemo(() => {
    return Array.from({ length: maxArrayCounts.maxImagesCount || 0 })?.map(
      (_, index) => ({
        title: 'IMAGE',
        render: (_, atr) => {
          return <div>{atr?.images[index]}</div>;
        },
        width: COLUMN_WIDTH_XXXL,
      }),
    );
  }, [maxArrayCounts.maxImagesCount]);
  const repeatedArray = Array.from(
    { length: +maxArrayCounts.maxProductsCount || 0 },
    (_, index) =>
      PRODUCT_ITEM_VALUES.map((value) => {
        const propertyName =
          value === 'PRODUCT COST'
            ? 'itemCost'
            : value === 'MEMO DUE DATE'
            ? 'expiryDate'
            : toCamelCase(value as string);

        return {
          title: value,
          render: (_: any, atr: any) => {
            const product = atr?.productItems?.[index];
            const isSerialNumbers = value === 'SERIAL NUMBERS';
            const renderValue = isSerialNumbers
              ? product?.serialNumbers?.length
                ? (product.serialNumbers as string[]).join(', ')
                : ''
              : product
              ? product[propertyName]
              : '';
            return <RenderId copyable value={renderValue} />;
          },
          width: COLUMN_WIDTH_XXXL,
        };
      }),
  ).flat();

  const columnsArrByType: ColumnType<AnyObject>[] = useMemo(() => {
    switch (type) {
      case 'completedImports':
        return overrideColums?.completedImports
          ? [
              productId,
              ...getOverrideColumns(
                overrideColums.completedImports,
                'completedImports',
              ),
            ]
          : ([
              errorsColumn,
              ...columns,
              ...dynamicCustomFieldsColumns,
              ...imagesColumns,
              ...repeatedArray,
            ] as ColumnType<AnyObject>[]);
      case 'unvalidatedImports':
        return overrideColums?.unvalidatedImports
          ? [
              errorsColumn,
              productId,
              ...getOverrideColumns(
                overrideColums.unvalidatedImports,
                'unvalidatedImports',
              ),
            ]
          : ([
              errorsColumn,
              ...columns,
              ...dynamicCustomFieldsColumns,
              ...imagesColumns,
              ...repeatedArray,
              ...dropdownColumn,
            ] as ColumnType<AnyObject>[]);
      case 'needChangeCreations':
        return overrideColums?.needChangeCreations
          ? [
              errorsColumn,
              productId,
              ...getOverrideColumns(
                overrideColums.needChangeCreations,
                'needChangeCreations',
              ),
            ]
          : ([
              errorsColumn,
              ...columns,
              ...dynamicCustomFieldsColumns,
              ...imagesColumns,
              ...dynamicCustomFieldsColumns,
              ...repeatedArray,
              ...dropdownColumn,
            ] as ColumnType<AnyObject>[]);
      default:
        return [];
    }
  }, [
    type,
    imagesColumns,
    repeatedArray,
    dropdownColumn,
    dynamicCustomFieldsColumns,
    overrideColums?.completedImports,
    overrideColums?.needChangeCreations,
    overrideColums?.unvalidatedImports,
  ]);

  const scrollX = useMemo(() => {
    const baseWidth = 8000;
    const productsWidth = maxArrayCounts?.maxProductsCount
      ? maxArrayCounts.maxProductsCount * COLUMN_WIDTH_XXXXL
      : 0;
    const imagesWidth = maxArrayCounts?.maxImagesCount
      ? maxArrayCounts.maxImagesCount * COLUMN_WIDTH_XXXL
      : 0;
    const customFieldsWidth = customFieldsColumns?.length
      ? customFieldsColumns?.length * COLUMN_WIDTH_XXXL
      : 0;

    return baseWidth + productsWidth + imagesWidth + customFieldsWidth;
  }, [maxArrayCounts, customFieldsColumns?.length]);

  const finalScrollX = useMemo(() => {
    if (isTablet) {
      return propsScroll && propsScroll > 0
        ? propsScroll
        : Math.max(scrollX, 800);
    }
    return propsScroll ?? scrollX;
  }, [isTablet, propsScroll, scrollX]);

  return (
    <CustomTable
      rowKey={'localId'}
      columns={columnsArrByType}
      dataSource={data}
      loading={loading}
      pagination={{
        ...DEFAULT_PAGINATION,
        total,
        onChange,
      }}
      scroll={{
        x: finalScrollX,
      }}
    />
  );
};

export default ImportProductsTable;
