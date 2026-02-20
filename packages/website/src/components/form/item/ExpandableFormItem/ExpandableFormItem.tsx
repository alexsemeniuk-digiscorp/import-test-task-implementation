import { FC, useEffect, useState } from 'react';

import { Col, Row, Typography } from 'antd';

import classNames from 'classnames';

import { Icon, IconSize } from '@assets/icon';

import { CustomButton } from '@ui/button/Button';
import { CustomDivider } from '@ui/divider/Divider';
import { CustomSpace } from '@ui/space';

import { CustomFormItem, CustomFormItemProps } from '@form/item/FormItem';
import styles from '@form/label/FormLabel.module.scss';

interface ExpandableFormItemProps extends Omit<CustomFormItemProps, 'hidden'> {
  defaultOpen?: boolean;
  withDivider?: boolean;
}

export const ExpandableFormItem: FC<ExpandableFormItemProps> = ({
  defaultOpen,
  label,
  withDivider,
  ...otherProps
}) => {
  const [isVisible, setIsVisible] = useState(!!defaultOpen);

  const handleToggle = () => setIsVisible((prev) => !prev);

  useEffect(() => {
    if (defaultOpen) {
      setIsVisible(true);
    }
  }, [defaultOpen]);

  return (
    <>
      {withDivider && (
        <CustomDivider type={'horizontal'} style={{ margin: '0 0 24px 0' }} />
      )}
      <CustomSpace direction={'vertical'} size={24} block>
        <Row
          justify={'space-between'}
          onClick={handleToggle}
          style={{ width: '100%' }}
        >
          <Col>
            <Typography.Title level={3} style={{ fontWeight: '400' }}>
              {label}
            </Typography.Title>
          </Col>
          <Col>
            <CustomButton
              type={'text'}
              icon={<Icon type={'chevron-down'} size={IconSize.Large} />}
              className={classNames(styles.icon, {
                [styles.rotate]: isVisible,
              })}
            />
          </Col>
        </Row>
        <CustomFormItem hidden={!isVisible} {...otherProps} />
      </CustomSpace>
    </>
  );
};
