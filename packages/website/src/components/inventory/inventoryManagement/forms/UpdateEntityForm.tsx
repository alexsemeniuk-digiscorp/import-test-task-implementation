import { Fragment, ReactNode, useEffect } from 'react';

import { Col, Form, FormInstance, Grid, Row } from 'antd';

import pluralize from 'pluralize';

import { AnyObject } from '@helpers/types';

import { CustomButton } from '@ui/button/Button';

import { CustomForm, CustomFormProps } from '@form';

import { InventoryFormLayout } from '@inventory/inventoryManagement/forms/InventoryFormLayout';
import { useEntityView } from '@inventory/inventoryManagement/hooks/useEntityView';

interface Props<T extends AnyObject> extends CustomFormProps<T> {
  form: FormInstance<T>;
  loading?: boolean;
  isSaveDisabled?: boolean;
  backPath?: string;
  entityName: string;
  skipLayout?: boolean;
  extraActions?: ReactNode[];
}

export const UpdateEntityForm = <T extends AnyObject = AnyObject>({
  children,
  loading,
  form,
  isSaveDisabled,
  backPath,
  entityName,
  initialValues,
  skipLayout,
  extraActions = [],
  ...props
}: Props<T>) => {
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;

  useEntityView(
    backPath
      ? {
          entityPlural: pluralize(entityName),
          backPath: backPath,
        }
      : {},
  );

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [form, initialValues]);

  const LayoutComponent = skipLayout ? Fragment : InventoryFormLayout;

  return (
    <LayoutComponent>
      <CustomForm<T> form={form} initialValues={initialValues} {...props}>
        {children}
        <Form.Item
          style={{
            marginBottom: 0,
            marginTop: 8,
          }}
        >
          <Row justify={'start'}>
            <Col xs={24} lg={12} xl={12}>
              <Row gutter={[24, isMobile ? 12 : 24]} justify={'start'}>
                <Col
                  xs={24}
                  md={
                    extraActions.length > 0 ? 24 / (extraActions.length + 1) : 8
                  }
                >
                  <CustomButton
                    type={'primary'}
                    block
                    htmlType={'submit'}
                    size={'large'}
                    loading={loading}
                    disabled={isSaveDisabled}
                    style={{ width: '100%' }}
                  >
                    Save
                  </CustomButton>
                </Col>
                {extraActions.length > 0 &&
                  extraActions.map((action, index) => (
                    <Col
                      xs={24}
                      md={24 / (extraActions.length + 1)}
                      key={index}
                    >
                      {action}
                    </Col>
                  ))}
              </Row>
            </Col>
          </Row>
        </Form.Item>
      </CustomForm>
    </LayoutComponent>
  );
};
