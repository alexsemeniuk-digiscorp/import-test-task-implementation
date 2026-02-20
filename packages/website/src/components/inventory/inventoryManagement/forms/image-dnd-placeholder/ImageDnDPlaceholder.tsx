import { Col, Row, Typography } from 'antd';

import { Icon } from '@assets/icon';

import { CustomButton } from '@ui/button/Button';

const { Text } = Typography;

const ImageDnDPlaceholder = () => {
  return (
    <div>
      <Icon type={'image'} />
      <Row justify={'center'} style={{ margin: 16 }}>
        <Col span={20}>
          <Text
            type={'secondary'}
            style={{
              color: '#959595FF',
              fontSize: 10,
              lineHeight: '100%',
            }}
          >
            Select or drop image straight from you desktop
          </Text>
        </Col>
      </Row>
      <Row justify={'center'}>
        <Col>
          <CustomButton size={'middle'} style={{ width: 100 }}>
            {'Select Image'}
          </CustomButton>
        </Col>
      </Row>
    </div>
  );
};

export default ImageDnDPlaceholder;
