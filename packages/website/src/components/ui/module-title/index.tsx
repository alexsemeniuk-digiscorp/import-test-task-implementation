import React, { FC, ReactNode } from 'react';

import { ButtonProps, Col, Flex, Row, Space, Switch, Typography } from 'antd';

import { useBreakpoint } from '@/hooks/useBreakpoint';
import { Icon, IconSize } from '@assets/icon';
import { CustomButton } from '@ui/button/Button';
import { CustomDivider } from '@ui/divider/Divider';
import { BaseButtonProps } from 'antd/es/button/button';
import './index.scss';

interface Props {
  title: string | ReactNode;
  description?: string;
  primaryAction?: string;
  secondaryAction?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  buttons?: React.ReactNode[];
  titleLevel?: 1 | 2 | 3 | 4 | 5 | undefined;
  primaryButtonProps?: BaseButtonProps;
  secondaryButtonProps?: ButtonProps;
  isEditable?: boolean;
  onEdit?: () => void;
  switcherOptions?: {
    onCheckedText: string;
    onUncheckedText: string;
    state: boolean;
    setState: (state: boolean) => void;
  };
  descriptionButtonProps?: ButtonProps;
  descriptionGap?: number;
  isCapitalize?: boolean;
}

const ModuleTitle: FC<Props> = ({
  title,
  primaryAction,
  secondaryAction,
  onPrimaryClick,
  onSecondaryClick,
  buttons,
  description,
  titleLevel = 1,
  primaryButtonProps,
  secondaryButtonProps,
  isEditable,
  onEdit,
  switcherOptions,
  descriptionButtonProps,
  descriptionGap = 15,
  isCapitalize = true,
}) => {
  const { md } = useBreakpoint();
  const handleSwitchClick = (checked: boolean) => {
    if (switcherOptions) {
      switcherOptions.setState(checked);
    }
  };

  return (
    <>
      <Row className={'module-title-wrap'} gutter={md ? [16, 0] : [0, 12]}>
        <Col {...(md ? {} : { xs: 24 })}>
          <Flex
            gap={md ? 10 : 4}
            align={'center'}
            justify={md ? undefined : 'center'}
          >
            <Typography.Title
              style={{
                textTransform: isCapitalize ? 'capitalize' : 'none',
                fontSize: md ? undefined : 24,
              }}
              level={titleLevel}
            >
              {title}
            </Typography.Title>
            {isEditable && (
              <CustomButton
                type={'text'}
                icon={
                  <Icon
                    type={'edit'}
                    size={md ? IconSize.Large : IconSize.Medium}
                  />
                }
                onClick={onEdit}
                size={'large'}
              />
            )}
          </Flex>
        </Col>
        <Col {...(md ? {} : { xs: 24 })}>
          <Row align={'stretch'} gutter={md ? 16 : 2}>
            {buttons && (
              <Col {...(md ? {} : { xs: 24 })}>
                {md ? (
                  <Space size={5} align={'center'} style={{ height: '100%' }}>
                    {buttons.map((button, index) => (
                      <React.Fragment key={index}>{button}</React.Fragment>
                    ))}
                  </Space>
                ) : (
                  <Space
                    direction='vertical'
                    size={12}
                    style={{ width: '100%' }}
                  >
                    {buttons.map((button, index) => (
                      <div key={index} style={{ width: '100%' }}>
                        {button}
                      </div>
                    ))}
                  </Space>
                )}
              </Col>
            )}
            {(secondaryAction || primaryAction) && (
              <>
                {buttons && md && (
                  <Col>
                    <CustomDivider
                      type={'vertical'}
                      style={{ height: '100%' }}
                    />
                  </Col>
                )}
                {buttons && !md && <Col xs={24} />}
                <Col {...(md ? {} : { xs: 24 })}>
                  {md ? (
                    <Space
                      size={16}
                      align={'center'}
                      style={{ height: '100%' }}
                    >
                      {secondaryAction && (
                        <CustomButton
                          size={'large'}
                          onClick={onSecondaryClick}
                          style={{ minWidth: '140px' }}
                          {...secondaryButtonProps}
                        >
                          {secondaryAction}
                        </CustomButton>
                      )}
                      {primaryAction && (
                        <CustomButton
                          size={'large'}
                          type={'primary'}
                          onClick={onPrimaryClick}
                          style={{ minWidth: 140 }}
                          {...primaryButtonProps}
                        >
                          {primaryAction}
                        </CustomButton>
                      )}
                    </Space>
                  ) : (
                    <Space
                      direction='vertical'
                      size={12}
                      style={{ width: '100%' }}
                    >
                      {secondaryAction && (
                        <CustomButton
                          size={'large'}
                          onClick={onSecondaryClick}
                          block
                          style={{ width: '100%' }}
                          {...secondaryButtonProps}
                        >
                          {secondaryAction}
                        </CustomButton>
                      )}
                      {primaryAction && (
                        <CustomButton
                          size={'large'}
                          type={'primary'}
                          onClick={onPrimaryClick}
                          block
                          style={{ width: '100%' }}
                          {...primaryButtonProps}
                        >
                          {primaryAction}
                        </CustomButton>
                      )}
                    </Space>
                  )}
                </Col>
              </>
            )}
          </Row>
        </Col>
      </Row>
      {description && (
        <Flex
          justify={'space-between'}
          style={{ marginTop: descriptionGap }}
          vertical={!md && descriptionButtonProps ? true : false}
        >
          <Flex
            vertical={!md && descriptionButtonProps ? true : false}
            gap={!md && descriptionButtonProps ? 12 : 0}
            style={{
              width: !md && descriptionButtonProps ? '100%' : undefined,
            }}
          >
            <Typography.Text style={{ display: 'flex', color: '#747679' }}>
              {description}
            </Typography.Text>
            {descriptionButtonProps && (
              <CustomButton
                {...descriptionButtonProps}
                style={{
                  ...descriptionButtonProps.style,
                  width: !md ? '100%' : descriptionButtonProps.style?.width,
                }}
                block={!md}
              >
                {descriptionButtonProps.content}
              </CustomButton>
            )}
          </Flex>
          {switcherOptions && (
            <Switch
              checkedChildren={switcherOptions.onCheckedText}
              unCheckedChildren={switcherOptions.onUncheckedText}
              checked={switcherOptions.state}
              onClick={handleSwitchClick}
            />
          )}
        </Flex>
      )}
    </>
  );
};

export default ModuleTitle;
