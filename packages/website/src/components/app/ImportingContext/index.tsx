import {
  useCreateProductsFromCsvMutation,
  useUpdateDefaultPriceFromCsvMutation,
} from '@/graphql';
import {
  importingReducer,
  initialState,
} from '@app/ImportingContext/importingSlice/slice';
import {
  ActionType,
  ConfigType,
  ImportResult,
  ImportResultKeys,
  ImportingProcesses,
} from '@app/ImportingContext/types/types';
import { useStatusMessage } from '@app/StatusMessageContext/statusMessageContext';
import { CreateEntitiesInput } from '@components/dashboard/dashboardSettings/SettingsModuleFactory/sections/importEntity/types/types';
import { handleApplicationError } from '@helpers/errors';
import { UploadFile } from 'antd';
import debounce from 'lodash/debounce';
import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from 'react';

const ImportContext = createContext<{
  importingStore: ImportingProcesses;
  handleCSVFileChange: (
    file: UploadFile,
    config: { type: ConfigType; isModeOn?: boolean; refetch?: any },
  ) => void;
  helpersFunctions: {
    removeItem: (payload: {
      importType: ConfigType;
      tableType: keyof ImportResult;
      localId: string;
    }) => void;
    forceSetResultTable: (payload: {
      importType: ConfigType;
      tableType: keyof ImportResult;
      forceUpdatingArr: any[];
    }) => void;
  };
} | null>(null);

export const ImportingProvider: FC<PropsWithChildren> = ({ children }) => {
  const [createProducts] = useCreateProductsFromCsvMutation();
  const [updateDefaultPrice] = useUpdateDefaultPriceFromCsvMutation();

  const [importingStore, dispatch] = useReducer(importingReducer, initialState);

  const importsConfig = useMemo(
    () => ({
      products: {
        createFunc: createProducts,
        resultObjName: 'createProductsFromCSV',
      },
      updateDefaultPrice: {
        createFunc: updateDefaultPrice,
        resultObjName: 'updateDefaultPriceFromCSV',
      },
    }),
    [createProducts, updateDefaultPrice],
  );

  const message = useStatusMessage();

  const debouncedHandleFileChange = debounce(
    async (
      file: UploadFile,
      config: {
        [x: string]: any;
        type: ConfigType;
        isModeOn?: boolean;
        refetch?: any;
      },
    ) => {
      if (
        (file.type && file.type.startsWith('text/csv')) ||
        (file.name && file.name.endsWith('.csv'))
      ) {
        dispatch({ type: ActionType.START_IMPORT, importType: config.type });

        const handleFile = async (file: File) => {
          const inputObject: CreateEntitiesInput = { uploadCsv: file };

          if (config.isModeOn) {
            inputObject.createNewMode = config.isModeOn;
          }

          try {
            await importsConfig[config.type].createFunc({
              variables: { input: inputObject },
            });
            if (config?.refetch) await config?.refetch();
          } catch (error: unknown) {
            handleApplicationError(error, message);
          }
        };

        try {
          await handleFile(file.originFileObj as File);
        } catch (error) {
          message.open('error', 'File handling failed.');
          dispatch({
            type: ActionType.SET_LOADING,
            importType: config.type,
            isLoading: false,
          });
        }
      } else {
        message.open('error', 'The file is not a CSV.');
      }
    },
    300,
  );

  const handleCSVFileChange = useCallback(
    (file: UploadFile, config: { type: ConfigType; isModeOn?: boolean }) => {
      debouncedHandleFileChange(file, config);
    },
    [debouncedHandleFileChange],
  );

  const removeItem = (payload: {
    importType: ConfigType;
    tableType: ImportResultKeys;
    localId: string;
  }) => {
    dispatch({
      type: ActionType.REMOVE_ITEM,
      importType: payload.importType,
      tableType: payload.tableType,
      localId: payload.localId,
    });
  };

  const forceSetResultTable = (payload: {
    importType: ConfigType;
    tableType: ImportResultKeys;
    forceUpdatingArr: any[];
  }) => {
    const { importType, tableType, forceUpdatingArr } = payload;
    dispatch({
      type: ActionType.FORCE_SET_RESULT_TABLE,
      tableType,
      importType,
      forceUpdatingArr,
    });
  };

  const helpersFunctions = {
    removeItem,
    forceSetResultTable,
  };

  return (
    <ImportContext.Provider
      value={{ importingStore, handleCSVFileChange, helpersFunctions }}
    >
      {children}
    </ImportContext.Provider>
  );
};

export const useImportContext = () => {
  const context = useContext(ImportContext);
  if (!context) {
    throw new Error(
      'useImportContext must be used within an ImportingProvider',
    );
  }
  return context;
};
