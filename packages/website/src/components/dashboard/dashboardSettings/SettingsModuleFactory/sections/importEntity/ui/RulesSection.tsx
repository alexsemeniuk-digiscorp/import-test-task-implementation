import { Col, ConfigProvider, Grid, Row, Space, Typography } from 'antd';

import { ImportRule } from '@components/dashboard/dashboardSettings/SettingsModuleFactory/sections/importEntity/types/types';
import { useToken } from '@hooks/useToken';
import ModuleTitle from '@ui/module-title';
import RoundedBox from '@ui/roundedBox/RoundedBox';
import { FC } from 'react';

interface Props {
  importRules: ImportRule[];
}

const RulesSection: FC<Props> = ({ importRules }) => {
  const { token } = useToken();
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;

  return (
    <ConfigProvider
      theme={{
        components: {
          Typography: {
            fontSizeHeading3: 16,
            fontWeightStrong: 600,
            colorText: token.colorTextDescription,
          },
        },
      }}
    >
      <RoundedBox marginTop={12}>
        <ModuleTitle title={'Rules'} titleLevel={2} />
        <Row gutter={isMobile ? [0, 24] : [40, 24]} style={{ marginTop: 24 }}>
          {importRules.map(({ title, description }) => (
            <Col xs={24} md={12} key={title}>
              <Space direction={'vertical'} size={6}>
                <Typography.Title level={3}>{title}:</Typography.Title>
                <Typography.Text>{description}</Typography.Text>
              </Space>
            </Col>
          ))}
        </Row>
      </RoundedBox>
    </ConfigProvider>
  );
};

export default RulesSection;
