import {
  ReactNode,
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
} from 'react';

import {
  Col,
  ConfigProvider,
  Form,
  FormInstance,
  Grid,
  Row,
  Typography,
} from 'antd';

import pluralize from 'pluralize';

import { AnyObject } from '@helpers/types';

import { CustomButton } from '@ui/button/Button';

import { CustomForm, CustomFormProps } from '@form';

import { InventoryFormLayout } from '@inventory/inventoryManagement/forms/InventoryFormLayout';
import { useEntityView } from '@inventory/inventoryManagement/hooks/useEntityView';

interface Props<T extends AnyObject> extends CustomFormProps<T> {
  form: FormInstance<T>;
  entityName: string;
  onCancel?: () => void;
  loading?: boolean;
  description?: string;
  backPath?: string;
  extraActions?: ReactNode[];
  showFormActions?: boolean;
}

export const CreateEntityForm = <T extends AnyObject = AnyObject>({
  children,
  loading,
  entityName,
  onCancel,
  description,
  form,
  backPath,
  initialValues,
  extraActions = [],
  showFormActions = true,
  ...props
}: Props<T>) => {
  const screens = Grid.useBreakpoint();
  const isTablet = !screens.lg;

  useEntityView({
    entityPlural: pluralize(entityName),
    backPath: backPath,
  });

  const handleClearForm = useCallback(() => {
    form?.resetFields();
    onCancel?.();
  }, [form, onCancel]);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [form, initialValues]);

  return (
    <InventoryFormLayout>
      <Row gutter={24} justify={isTablet ? 'center' : 'space-between'}>
        <Typography.Title
          level={1}
          style={{
            fontSize: isTablet ? 24 : undefined,
            padding: isTablet ? '0 12px' : undefined,
          }}
        >
          {`New ${entityName}`}
        </Typography.Title>
      </Row>
      {description && (
        <Row>
          <Col xs={24} lg={16}>
            <ConfigProvider
              theme={{
                token: {
                  fontSize: 16,
                  colorTextDescription: '#959595',
                },
              }}
            >
              <Typography.Text type={'secondary'} style={{ fontWeight: 500 }}>
                {description}
              </Typography.Text>
            </ConfigProvider>
          </Col>
        </Row>
      )}

      <CustomForm<T> form={form} initialValues={initialValues} {...props}>
        {children}
        {showFormActions && (
          <Form.Item
            style={{
              marginBottom: 0,
              marginTop: 8,
            }}
          >
            <Row>
              <Col xs={24} lg={extraActions.length > 1 ? 16 : 12}>
                <Row gutter={[24, isTablet ? 12 : 24]}>
                  <Col
                    xs={24}
                    md={
                      extraActions.length > 0
                        ? 24 / (extraActions.length + 2)
                        : 8
                    }
                  >
                    <CustomButton
                      type={'primary'}
                      block
                      htmlType={'submit'}
                      size={'large'}
                      loading={loading}
                      style={{
                        width: isTablet ? '100%' : undefined,
                        minWidth: isTablet ? 145 : undefined,
                      }}
                    >
                      Save
                    </CustomButton>
                  </Col>

                  {extraActions.length > 0 &&
                    extraActions.map((action, index) => (
                      <Col
                        xs={24}
                        md={24 / (extraActions.length + 2)}
                        key={index}
                      >
                        {isValidElement(action)
                          ? cloneElement(action, {
                              ...action.props,
                              block: isTablet ? true : action.props?.block,
                              style: {
                                ...(action.props?.style || {}),
                                minWidth: isTablet
                                  ? 145
                                  : action.props?.style?.minWidth,
                                width: isTablet
                                  ? '100%'
                                  : action.props?.style?.width,
                              },
                            })
                          : action}
                      </Col>
                    ))}

                  <Col
                    xs={24}
                    md={
                      extraActions.length > 0
                        ? 24 / (extraActions.length + 2)
                        : 8
                    }
                  >
                    <CustomButton
                      onClick={handleClearForm}
                      block
                      size={'large'}
                      style={{
                        width: isTablet ? '100%' : undefined,
                        minWidth: isTablet ? 145 : undefined,
                      }}
                    >
                      Cancel
                    </CustomButton>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form.Item>
        )}
      </CustomForm>
    </InventoryFormLayout>
  );
};
