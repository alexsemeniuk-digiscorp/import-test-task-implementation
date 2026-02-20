import { StatusMessageContextType } from '@/components/app/StatusMessageContext/statusMessageContext';

import { LazyQueryExecFunction } from '@apollo/client';
import { downloadFile } from '@helpers/fileActions';

export const handleDownloadFile = async (
  type: EnumDefaultimportingfileType,
  getDefaultFiles: LazyQueryExecFunction<
    DefaultImportingFilesQuery,
    Exact<{
      filters?: InputMaybe<DefaultImportingFileFiltersInput>;
      pagination?: InputMaybe<PaginationArg>;
      sort?: InputMaybe<
        Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>
      >;
    }>
  >,
  message: StatusMessageContextType,
) => {
  try {
    const defaultFileUrl = await getDefaultFiles({
      variables: {
        filters: {
          type: {
            eq: type,
          },
        },
      },
    });

    const defaultFileData = defaultFileUrl?.data?.defaultImportingFiles?.data;

    if (defaultFileData?.length) {
      const defaultFileAttrs =
        defaultFileData[0]?.attributes?.defaultFile?.data?.attributes;
      const url = defaultFileAttrs?.url;
      const fileName = defaultFileAttrs?.name;

      if (url) {
        await downloadFile(url, fileName ?? 'Default File');
      } else {
        message.open('error', 'File is not provided');
      }
    }
  } catch (error) {
    message.open('error', 'Failed to download file');
  }
};
