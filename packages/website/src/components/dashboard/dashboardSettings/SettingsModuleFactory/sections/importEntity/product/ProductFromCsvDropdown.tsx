import { FC, useCallback, useMemo } from 'react';

import {
  useDeleteImportingContactMutation,
  useFastUpdateSingleProductMutation,
} from '@/graphql';
import { useImportContext } from '@app/ImportingContext';
import { ImportResultKeys } from '@app/ImportingContext/types/types';
import { useStatusMessage } from '@app/StatusMessageContext/statusMessageContext';
import UpdateImportProductModal from '@components/dashboard/dashboardSettings/SettingsModuleFactory/sections/importEntity/product/UpdateImportProductModal';
import { useModalComponent } from '@components/dashboard/dashboardSettings/SettingsModuleFactory/sections/importEntity/product/hooks/useModalComponent';
import { ProductDataWithErrors } from '@components/dashboard/dashboardSettings/SettingsModuleFactory/sections/importEntity/product/types/types';
import { ImportingKeyIdentifierEnum } from '@helpers/enumTypes';
import { handleApplicationError } from '@helpers/errors';
import ActionMenuDropdown from '@ui/dropdown/ActionMenuDropdown';
import ActionMenuButton from '@ui/dropdown/ActionMenuDropdown/ActionMenuButton';
import { MenuProps } from 'antd';

interface Props {
  atr: ProductDataWithErrors;
  tableType: ImportResultKeys;
  maxArrayCounts: { maxProductsCount: number; maxImagesCount: number };
  customFieldsColumns: string[];
  total?: number;
  onChange: (page: number, pageSize: number) => void;
}

export const ProductFromCsvDropdown: FC<Props> = ({
  atr,
  tableType,
  maxArrayCounts,
  customFieldsColumns,
  total,
  onChange,
}) => {
  const message = useStatusMessage();
  const { helpersFunctions } = useImportContext();
  const [updateProduct, { loading }] = useFastUpdateSingleProductMutation({
    refetchQueries: ['getSessionImportingContacts'],
  });
  const [deleteImporting] = useDeleteImportingContactMutation({
    refetchQueries: ['getSessionImportingContacts'],
  });

  const { isModalOpen, showModal, closeModal } = useModalComponent();

  let entityId: string | undefined;
  let uuid: string | undefined;
  const updatingContactType = atr.updatingType;
  switch (updatingContactType) {
    case 'bothEqual':
      uuid = atr?.updatingInfo?.namesUuid;
      entityId = atr?.updatingInfo?.namesId;
      break;
    case 'barcode':
      uuid = atr?.updatingInfo?.barcodesUuid;
      entityId = atr?.updatingInfo?.barcodesId;
      break;
    case 'name':
      uuid = atr?.updatingInfo?.namesUuid;
      entityId = atr?.updatingInfo?.namesId;
      break;
  }

  const handleFastUpdateProduct = useCallback(() => {
    updateProduct({
      variables: {
        input: {
          csvSingleProductJson: JSON.stringify(atr),
        },
      },
      onCompleted: async () => {
        message?.open('success', 'Product updated successfully!');
        helpersFunctions.removeItem({
          importType: 'products',
          tableType,
          localId: atr.localId ?? '',
        });
      },
      onError: (error) => {
        handleApplicationError(error, message);
      },
    });
  }, [atr, updateProduct, helpersFunctions, tableType, message]);

  const handleStateUpdate = useCallback(async () => {
    helpersFunctions.removeItem({
      importType: 'products',
      tableType,
      localId: atr.localId ?? '',
    });
    await deleteImporting({
      variables: {
        input: {
          importingField: JSON.stringify(atr),
          keyType: tableType,
          importingIdentifier: ImportingKeyIdentifierEnum.PRODUCTS,
        },
      },
    });
  }, [helpersFunctions, tableType, atr, deleteImporting]);

  const items: MenuProps['items'] = useMemo(
    () => [
      entityId
        ? {
            key: 'Edit',
            label: (
              <ActionMenuButton iconType={'edit'} onClick={showModal}>
                Edit Previous
              </ActionMenuButton>
            ),
          }
        : null,
      entityId
        ? {
            key: `divider-2`,
            type: 'divider',
          }
        : null,
      atr?.errors?.length === 0
        ? {
            key: 'Update',
            label: (
              <ActionMenuButton
                onClick={handleFastUpdateProduct}
                iconType={'edit'}
              >
                Fast Update
              </ActionMenuButton>
            ),
          }
        : null,
      atr?.errors?.length === 0
        ? {
            key: `divider-3 `,
            type: 'divider',
          }
        : null,
      {
        key: 'Delete',
        label: (
          <ActionMenuButton
            iconType={'delete'}
            onClick={handleStateUpdate}
            actionType={'delete'}
          >
            Do nothing
          </ActionMenuButton>
        ),
      },
    ],
    [
      entityId,
      atr?.errors?.length,
      showModal,
      handleFastUpdateProduct,
      handleStateUpdate,
    ],
  );

  return (
    <>
      <ActionMenuDropdown items={items} />
      <UpdateImportProductModal
        isModalOpen={isModalOpen}
        customFieldsColumns={customFieldsColumns}
        handleCancel={closeModal}
        data={atr}
        maxArrayCounts={maxArrayCounts}
        uuid={uuid}
        total={total}
        onChange={onChange}
      />
    </>
  );
};
