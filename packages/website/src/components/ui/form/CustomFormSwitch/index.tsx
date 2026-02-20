import { CustomFormItem } from '@form/item/FormItem';
import {
  settingsDescriptionStyles,
  settingsTitleStyles,
} from '@pages/dashboard/settingsRoutes/static/static';
import { CustomDivider } from '@ui/divider/Divider';
import {
  Col,
  ConfigProvider,
  Form,
  FormInstance,
  Row,
  Switch,
  SwitchProps,
  Tooltip,
  Typography,
} from 'antd';
import { FC, ReactNode } from 'react';

interface Props extends SwitchProps {
  form?: FormInstance;
  name: string;
  title?: string;
  description?: string;
  initialValue?: boolean;
  tooltipText?: string;
  switchSize?: 'default' | 'small';
  withDivider?: boolean;
  showSwitch?: boolean;
  customComponent?: ReactNode;
}

export const CustomFormSwitch: FC<Props> = ({
  form,
  name,
  title,
  description,
  initialValue,
  tooltipText,
  switchSize,
  withDivider,
  showSwitch = true,
  customComponent,
  ...props
}) => {
  const watchedValue = Form.useWatch(name, form);
  const checked = watchedValue ?? initialValue;

  const handleChangeSwitchValue = (checkedValue: boolean) => {
    form?.setFieldsValue({ [name]: checkedValue });
  };

  const switchComponent = (
    <ConfigProvider
      theme={{
        token: {
          fontSize: 14,
          lineHeight: 1.5714285714285714,
          controlHeight: 32,
          paddingXS: 8,
          paddingSM: 12,
        },
      }}
    >
      <Switch
        style={{ marginLeft: 20 }}
        size={switchSize}
        checked={checked}
        onChange={handleChangeSwitchValue}
        {...props}
      />
    </ConfigProvider>
  );

  return (
    <>
      {withDivider && (
        <CustomDivider type={'horizontal'} style={{ margin: '0 0 16px 0' }} />
      )}
      <CustomFormItem
        labelStyles={{ width: 'unset' }}
        style={{ margin: 0 }}
        name={name}
        initialValue={initialValue}
      >
        <Row align={'middle'} justify={'space-between'}>
          <Col span={16}>
            <Row gutter={[0, 4]}>
              <Col span={24}>
                <Typography style={settingsTitleStyles}>{title}</Typography>
              </Col>
              {description && (
                <Col span={24}>
                  <Typography style={settingsDescriptionStyles}>
                    {description}
                  </Typography>
                </Col>
              )}
            </Row>
          </Col>

          {showSwitch && !customComponent && (
            <Col>
              {tooltipText ? (
                <Tooltip placement={'top'} title={tooltipText}>
                  {switchComponent}
                </Tooltip>
              ) : (
                switchComponent
              )}
            </Col>
          )}

          {customComponent && <Col>{customComponent}</Col>}
        </Row>
      </CustomFormItem>
    </>
  );
};
