import { ReactNode, useEffect } from 'react';

import { Col, Form, FormProps, Row } from 'antd';

import { AnyObject } from '@helpers/types';

import { CustomButton } from '@ui/button/Button';

import { CustomForm } from '@form';

import { useBreakpoint } from '@/hooks/useBreakpoint';
import { CustomSpace } from '@ui/space';
import styles from './index.module.scss';

interface Props<T> extends FormProps<T> {
  onCancel: () => void;
  children: ReactNode;
  primaryAction: string;
  onResetFields?: () => void;
  loading?: boolean;
  isActionDisabled?: boolean;
  isFullScreen?: boolean;
}

const DrawerFormWrapper = <T extends AnyObject>({
  onCancel,
  form,
  primaryAction,
  onResetFields,
  children,
  loading,
  isActionDisabled,
  isFullScreen = false,
  ...props
}: Props<T>) => {
  const { md } = useBreakpoint();

  useEffect(() => {
    if (onResetFields) {
      onResetFields();
    }
  }, [onResetFields, props.initialValues]);

  return (
    <>
      <CustomForm<T> className={styles.form} form={form} {...props}>
        <CustomSpace
          direction={'vertical'}
          size={[0, 0]}
          style={{ overflow: 'auto', padding: '0 32px' }}
          block
        >
          {children}
        </CustomSpace>
        <Form.Item
          style={{
            marginBottom: 0,
            paddingTop: '32px',
            maxWidth: isFullScreen && md ? 400 : '100%',
            width: '100%',
          }}
        >
          <Row gutter={10} style={{ padding: '0 32px' }}>
            <Col span={12}>
              <CustomButton
                type={'primary'}
                block
                size={'large'}
                htmlType={'submit'}
                loading={loading}
                disabled={isActionDisabled}
              >
                {primaryAction}
              </CustomButton>
            </Col>
            <Col span={12}>
              <CustomButton onClick={onCancel} block size={'large'}>
                Cancel
              </CustomButton>
            </Col>
          </Row>
        </Form.Item>
      </CustomForm>
    </>
  );
};

export default DrawerFormWrapper;
