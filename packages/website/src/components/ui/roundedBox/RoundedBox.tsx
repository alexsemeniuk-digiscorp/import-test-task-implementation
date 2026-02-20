import { FC, PropsWithChildren } from 'react';

import { Col, Row } from 'antd';

import styles from '@ui/roundedBox/RoundedBox.module.scss';

interface Props extends PropsWithChildren {
  padding?: number;
  marginTop?: number;
  marginBottom?: number;
}
export const RoundedBox: FC<Props> = ({
  marginBottom = 0,
  marginTop = 20,
  padding,
  children,
  ...props
}) => (
  <Row
    style={{
      ...(padding !== undefined && { padding }),
      marginBottom: marginBottom,
      marginTop: marginTop,
    }}
    className={styles.roundedBox}
  >
    <Col style={{ width: '100%' }}>{children}</Col>
  </Row>
);

export default RoundedBox;
