import { useCancelImportingSessionMutation } from '@/graphql';
import { Icon } from '@assets/icon';
import { SwitcherOptions } from '@components/dashboard/dashboardSettings/SettingsModuleFactory/sections/importEntity/types/types';
import UploadImagesToCSV from '@components/dashboard/dashboardSettings/SettingsModuleFactory/sections/importEntity/ui/UploadImagesToCSV';
import { UploadFileButton } from '@components/uploadFile/UploadFileButton/UploadFileButton'; // Adjust import paths accordingly
import { ImportingKeyIdentifierEnum } from '@helpers/enumTypes';
import { CustomButton } from '@ui/button/Button';
import ModuleTitle from '@ui/module-title';
import { Col, Grid, Row } from 'antd';
import React from 'react';

interface ModuleTitleWithButtonsProps {
  title: string;
  description: string;
  loading: boolean;
  handleDownloadExample?: () => void;
  handleFileChange: any;
  importingIdentifier: ImportingKeyIdentifierEnum;
  showUploadImages?: boolean;
  switcherOptions?: SwitcherOptions;
}

const ModuleTitleWithButtons: React.FC<ModuleTitleWithButtonsProps> = ({
  title,
  description,
  loading,
  handleDownloadExample,
  handleFileChange,
  switcherOptions,
  showUploadImages,
  importingIdentifier,
}) => {
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;
  const [cancelSession] = useCancelImportingSessionMutation({
    refetchQueries: [
      'importingSessions',
      'getSessionImportingContactsProcessInfo',
      'getSessionImportingContacts',
    ],
    variables: {
      input: {
        importingIdentifier: importingIdentifier,
        importingSessionIdentifier: importingIdentifier,
      },
    },
  });
  return (
    <ModuleTitle
      title={title}
      titleLevel={2}
      switcherOptions={switcherOptions}
      description={description}
      buttons={[
        <Row key={'1'} align={'middle'} gutter={isMobile ? [0, 12] : 16}>
          {showUploadImages && (
            <Col {...(isMobile ? { xs: 24 } : {})}>
              <UploadImagesToCSV
                type={'default'}
                style={{
                  minWidth: isMobile ? undefined : 140,
                  width: isMobile ? '100%' : undefined,
                }}
                label={'Upload Images'}
                size={'large'}
                loading={loading}
                block={isMobile}
              />
            </Col>
          )}
          <Col {...(isMobile ? { xs: 24 } : {})}>
            {loading ? (
              <CustomButton
                type={'primary'}
                style={{
                  minWidth: isMobile ? undefined : 140,
                  width: isMobile ? '100%' : undefined,
                }}
                size={'large'}
                onClick={() => cancelSession()}
                block={isMobile}
              >
                Cancel
              </CustomButton>
            ) : (
              <UploadFileButton
                type={'primary'}
                style={{
                  minWidth: isMobile ? undefined : 140,
                  width: isMobile ? '100%' : undefined,
                }}
                size={'large'}
                loading={loading}
                onFileChange={handleFileChange}
                block={isMobile}
              />
            )}
          </Col>
        </Row>,
      ]}
      descriptionButtonProps={
        handleDownloadExample
          ? {
              content: 'Download Example File',
              type: 'link',
              icon: <Icon type={'download'} />,
              onClick: handleDownloadExample,
            }
          : undefined
      }
    />
  );
};

export default ModuleTitleWithButtons;
