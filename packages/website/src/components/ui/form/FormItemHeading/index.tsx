import {
  settingsDescriptionStyles,
  settingsTitleStyles,
} from '@pages/dashboard/settingsRoutes/static/static';
import { Col, Row, Typography } from 'antd';
import { FC } from 'react';

interface Props {
  title?: string;
  description?: string;
}

export const FormItemHeading: FC<Props> = ({ title, description }) => {
  return (
    <Col span={16}>
      <Row gutter={[0, 4]}>
        <Col span={24}>
          <Typography.Title style={settingsTitleStyles}>
            {title}
          </Typography.Title>
        </Col>
        {description && (
          <Col span={24}>
            <Typography.Text style={settingsDescriptionStyles}>
              {description}
            </Typography.Text>
          </Col>
        )}
      </Row>
    </Col>
  );
};
