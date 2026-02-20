import { CustomButton } from '@ui/button/Button';
import ModuleTitle from '@ui/module-title';
import RoundedBox from '@ui/roundedBox/RoundedBox';
import { Grid } from 'antd';
import React from 'react';

interface ImportSectionProps {
  importPath: string;
  title: string;
  description: string;
  isCapitalize?: boolean;
  buttonText?: string;
}

const ImportSection: React.FC<ImportSectionProps> = ({
  importPath,
  title,
  description,
  isCapitalize = true,
  buttonText = 'To the Import Page',
}) => {
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;

  return (
    <RoundedBox marginTop={0}>
      <ModuleTitle
        title={title}
        titleLevel={2}
        description={description}
        isCapitalize={isCapitalize}
        buttons={[
          <CustomButton
            key={'1'}
            size={'large'}
            style={{ minWidth: isMobile ? '100%' : 140 }}
            type={'primary'}
            href={importPath}
          >
            {buttonText}
          </CustomButton>,
        ]}
      />
    </RoundedBox>
  );
};

export default ImportSection;
