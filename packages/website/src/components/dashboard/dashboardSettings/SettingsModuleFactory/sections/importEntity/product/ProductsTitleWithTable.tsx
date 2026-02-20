import { useFastUpdateAllProductsFromCsvMutation } from '@/graphql';
import { useImportContext } from '@app/ImportingContext';
import { ImportResultKeys } from '@app/ImportingContext/types/types';
import { useStatusMessage } from '@app/StatusMessageContext/statusMessageContext';
import ImportProductsTable from '@components/dashboard/dashboardSettings/SettingsModuleFactory/sections/importEntity/product/ImportProductsTable';
import { ProductDataWithErrors } from '@components/dashboard/dashboardSettings/SettingsModuleFactory/sections/importEntity/product/types/types';
import { ImportingKeyIdentifierEnum } from '@helpers/enumTypes';
import ModuleTitle from '@ui/module-title';
import { CustomSpace } from '@ui/space';
import { FC } from 'react';

interface Props {
  title: string;
  primaryAction: string;
  onPrimaryClick: () => void;
  description: string;
  type: ImportResultKeys;
  data: ProductDataWithErrors[];
  loading: boolean;
  overrideColums?: {
    completedImports?: string[];
    unvalidatedImports?: string[];
    needChangeCreations?: string[];
  };
  customFieldsColumns: string[];
  maxArrayCounts: {
    maxProductsCount: number;
    maxImagesCount: number;
  };
  propsScroll?: number;
  total?: number;
  onChange: (page: number, pageSize: number) => void;
}

const ProductsTitleWithTable: FC<Props> = ({
  title,
  primaryAction,
  onPrimaryClick,
  description,
  data,
  type,
  overrideColums,
  propsScroll,
  customFieldsColumns,
  loading,
  maxArrayCounts,
  total,
  onChange,
}) => {
  const { helpersFunctions } = useImportContext();
  const [fastUpdateAllProducts, { loading: fastUpdateAllProductsLoading }] =
    useFastUpdateAllProductsFromCsvMutation({
      refetchQueries: ['getSessionImportingContacts'],
    });
  const message = useStatusMessage();

  const handleFastUpdate = async () => {
    if (data?.length) {
      await fastUpdateAllProducts({
        variables: {
          input: {
            csvProductJson: JSON.stringify(data),
          },
        },
        onCompleted: async (res) => {
          if (
            res?.fastUpdateAllProductsFromCSV &&
            typeof res?.fastUpdateAllProductsFromCSV === 'string'
          ) {
            const parsedRes = JSON.parse(res?.fastUpdateAllProductsFromCSV);

            if (parsedRes?.bothDifferentArr.length) {
              message.open(
                'info',
                "Some of contacts can't be automatically updated!",
              );
              helpersFunctions.forceSetResultTable(parsedRes?.bothDifferentArr);
              return;
            }
            message.open('success', 'Updating of products is in progress!');
            helpersFunctions.forceSetResultTable({
              forceUpdatingArr: [],
              tableType: type,
              importType: ImportingKeyIdentifierEnum.PRODUCTS,
            });
          }
        },
        onError: (err) => {
          message.open('error');
        },
      });
      return;
    }

    message.open('error', 'Nothing to update');
  };

  return (
    <CustomSpace direction={'vertical'} block size={15}>
      <ModuleTitle
        title={title}
        secondaryAction={
          type === 'needChangeCreations' ? 'Fast Update' : undefined
        }
        secondaryButtonProps={{ loading: fastUpdateAllProductsLoading }}
        onSecondaryClick={
          type === 'needChangeCreations' ? handleFastUpdate : undefined
        }
        primaryAction={primaryAction}
        onPrimaryClick={onPrimaryClick}
        titleLevel={3}
        description={description}
      />
      <ImportProductsTable
        loading={loading}
        data={data}
        overrideColums={overrideColums}
        customFieldsColumns={customFieldsColumns}
        propsScroll={propsScroll}
        type={type}
        maxArrayCounts={maxArrayCounts}
        onChange={onChange}
        total={total}
      />
    </CustomSpace>
  );
};

export default ProductsTitleWithTable;
