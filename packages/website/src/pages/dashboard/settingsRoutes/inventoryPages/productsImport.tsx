import ModuleTitleWithButtons from '@/components/dashboard/dashboardSettings/SettingsModuleFactory/sections/importEntity/ui/ModuleTitleWithButtons';
import { useDefaultImportingFilesLazyQuery } from '@/graphql';
import { useImportContext } from '@app/ImportingContext';
import { ImportResultKeys } from '@app/ImportingContext/types/types';
import { useStatusMessage } from '@app/StatusMessageContext/statusMessageContext';
import ProductsTitleWithTable from '@components/dashboard/dashboardSettings/SettingsModuleFactory/sections/importEntity/product/ProductsTitleWithTable';
import { ProductDataWithErrors } from '@components/dashboard/dashboardSettings/SettingsModuleFactory/sections/importEntity/product/types/types';
import { PRODUCTS_IMPORT_RULES } from '@components/dashboard/dashboardSettings/SettingsModuleFactory/sections/importEntity/product/utils/rules';
import ImportingProcessingFooterBar from '@components/dashboard/dashboardSettings/SettingsModuleFactory/sections/importEntity/ui/ImportingProcessingFooterBar';
import RulesSection from '@components/dashboard/dashboardSettings/SettingsModuleFactory/sections/importEntity/ui/RulesSection';
import { ImportingKeyIdentifierEnum } from '@helpers/enumTypes';
import { downloadFile } from '@helpers/fileActions';
import { useImportingSessions } from '@pages/dashboard/settingsRoutes/hooks/useImportingSessions';
import { handleDownloadFile } from '@pages/dashboard/settingsRoutes/utils/utils';
import ModuleTitle from '@ui/module-title';
import { CustomSpace } from '@ui/space';
import { Grid, Layout, UploadFile } from 'antd';
import { useCallback } from 'react';

interface ModuleConfig {
  title: string;
  primaryAction: string;
  onPrimaryClick: () => void;
  description: string;
  data: ProductDataWithErrors[];
  type: ImportResultKeys;
  customFieldsColumns: string[];
  maxArrayCounts: {
    maxProductsCount: number;
    maxImagesCount: number;
  };
  total?: number;
  onChange: (page: number, pageSize: number) => void;
}

const ProductsImport = () => {
  const {
    importingStore: { products: importingProducts },
    handleCSVFileChange,
  } = useImportContext();
  const {
    sessionInfo,
    refetchLastSession,
    parsedData,
    lastSessions,
    updatePagination,
    sessionDataLoading,
  } = useImportingSessions({
    importingIdentifier: ImportingKeyIdentifierEnum.PRODUCTS,
  });

  const message = useStatusMessage();
  const screens = Grid.useBreakpoint();
  const isTablet = !screens.lg;
  const [getDefaultFiles] = useDefaultImportingFilesLazyQuery();

  const handleDownloadExample = async () => {
    await handleDownloadFile(
      ImportingKeyIdentifierEnum.PRODUCTS,
      getDefaultFiles,
      message,
    );
  };

  const handleFileChange = async (file: UploadFile) => {
    await handleCSVFileChange(file, {
      type: ImportingKeyIdentifierEnum.PRODUCTS,
      refetch: refetchLastSession,
    });
  };

  const handleExport = useCallback(
    async (importingType: 'cmpltdImports' | 'splImports' | 'updImports') => {
      const url =
        lastSessions?.importingSessions?.data?.[0]?.attributes?.[importingType]
          ?.data?.attributes?.url;
      if (url) {
        await downloadFile(url, 'Generated Report');
      }
    },
    [lastSessions?.importingSessions?.data],
  );

  const commonAdditionalInformation = {
    maxArrayCounts: {
      maxProductsCount:
        importingProducts.maxProductsCount &&
        importingProducts.maxProductsCount > 0
          ? importingProducts.maxProductsCount ?? 0
          : parsedData?.metadata?.maxProductsCount ?? 0,
      maxImagesCount:
        importingProducts.maxImagesCount && importingProducts.maxImagesCount > 0
          ? importingProducts.maxImagesCount ?? 0
          : parsedData?.metadata?.maxImagesCount ?? 0,
    },
    customFieldsColumns:
      importingProducts?.customFieldsColumns ||
      parsedData?.metadata?.customFieldsArr?.split(',') ||
      [],
  };

  const modulesConfig: ModuleConfig[] = [
    {
      title: 'Resolve conflicts',
      primaryAction: 'Download the report',
      onPrimaryClick: () => handleExport('updImports'),
      description: `${
        parsedData?.updatedCreationsTotal ??
        importingProducts.result.needChangeCreations?.length ??
        0
      } have the same barcodes or names that are already presented in the platform. Combine conflicting data from the external source with existing records.`,
      data:
        importingProducts?.result?.needChangeCreations &&
        importingProducts?.result?.needChangeCreations?.length > 0
          ? importingProducts?.result?.needChangeCreations ?? []
          : parsedData?.updatedCreations ?? [],
      type: 'needChangeCreations',
      total:
        importingProducts?.result?.needChangeCreations?.length ||
        parsedData?.updatedCreationsTotal ||
        0,
      onChange: async (page: number, pageSize: number) => {
        await updatePagination(page, pageSize, 'updatedData');
      },
      ...commonAdditionalInformation,
    },
    {
      title: 'Unvalidated Fields',
      primaryAction: 'Download the report',
      onPrimaryClick: () => handleExport('splImports'),
      description: `${
        parsedData?.spoiledCreationsTotal ??
        importingProducts.result.unvalidatedImports?.length ??
        0
      } fields that failed the validation`,
      data:
        importingProducts?.result?.unvalidatedImports &&
        importingProducts?.result?.unvalidatedImports?.length > 0
          ? importingProducts?.result?.unvalidatedImports ?? []
          : parsedData?.spoiledCreations ?? [],
      type: 'unvalidatedImports',
      total:
        importingProducts?.result?.needChangeCreations?.length ||
        parsedData?.spoiledCreationsTotal ||
        0,
      onChange: async (page: number, pageSize: number) => {
        await updatePagination(page, pageSize, 'spoiledData');
      },
      ...commonAdditionalInformation,
    },
    {
      title: 'Successful Records',
      primaryAction: 'Download the report',
      onPrimaryClick: () => handleExport('cmpltdImports'),
      description: `${
        parsedData?.completedCreationsTotal ??
        importingProducts.result.completedImports?.length ??
        0
      } successful additions.`,
      data:
        importingProducts?.result?.completedImports &&
        importingProducts?.result?.completedImports?.length > 0
          ? importingProducts?.result?.completedImports ?? []
          : parsedData?.completedCreations ?? [],
      type: 'completedImports',
      total:
        importingProducts?.result?.completedImports?.length ||
        parsedData?.completedCreationsTotal ||
        0,
      onChange: (page: number, pageSize: number) => {
        updatePagination(page, pageSize, 'completedData');
      },
      ...commonAdditionalInformation,
    },
  ];

  const isImporting =
    lastSessions?.importingSessions?.data?.[0]?.attributes?.state ===
    'progressing';

  return (
    <>
      <Layout style={{ padding: isTablet ? 0 : 32 }}>
        <ImportingProcessingFooterBar
          isImporting={isImporting}
          processedFields={
            sessionInfo?.getSessionImportingContactsProcessInfo?.processedFields
          }
          totalFields={
            sessionInfo?.getSessionImportingContactsProcessInfo?.totalFields
          }
        />
        <CustomSpace block direction={'vertical'} size={25}>
          <ModuleTitleWithButtons
            title={'Import Products from a CSV'}
            description={
              'Allows users to import products stored in a CSV to the platform'
            }
            loading={isImporting}
            handleDownloadExample={handleDownloadExample}
            handleFileChange={
              handleFileChange as (file: UploadFile) => Promise<void>
            }
            importingIdentifier={ImportingKeyIdentifierEnum.PRODUCTS}
          />
          <RulesSection importRules={PRODUCTS_IMPORT_RULES} />
          <ModuleTitle titleLevel={2} title={'Report'} />
          {modulesConfig.map((config) => (
            <ProductsTitleWithTable
              key={config.title}
              {...config}
              loading={isImporting || sessionDataLoading}
            />
          ))}
        </CustomSpace>
      </Layout>
    </>
  );
};

export default ProductsImport;
