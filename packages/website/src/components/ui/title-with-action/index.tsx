import { FC } from 'react';
import { Link } from 'react-router-dom';

import { Row, Typography } from 'antd';

interface LinkProps {
  to: string;
  linkText: string;
}
export interface TitleWithActionProps {
  title: string;
  link?: LinkProps;
}
const TitleWithAction: FC<TitleWithActionProps> = ({ title, link }) => (
  <Row justify={'space-between'}>
    <Typography.Title level={3}>{title}</Typography.Title>
    {link && <Link to={link.to}>{link.linkText}</Link>}
  </Row>
);

export default TitleWithAction;
