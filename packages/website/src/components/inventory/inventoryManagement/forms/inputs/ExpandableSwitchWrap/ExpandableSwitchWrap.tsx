import { FC, PropsWithChildren, useCallback, useEffect, useState } from 'react';

import { Col, Row } from 'antd';

import classNames from 'classnames';

import { CustomDivider } from '@ui/divider/Divider';

import { InventorySwitchInput } from '@inventory/inventoryManagement/forms/inputs/InventorySwitchInput/InventorySwitchInput';

import styles from './ExpandableSwitchWrap.module.scss';

interface Props extends PropsWithChildren {
  title: string;
  description?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (value: boolean) => void;
  disabled?: boolean;
}
export const ExpandableSwitchWrap: FC<Props> = ({
  title,
  description,
  children,
  checked,
  onChange,
  defaultChecked,
  disabled,
}) => {
  const [checkedValue, setCheckedValue] = useState(
    Boolean(defaultChecked ?? checked ?? disabled),
  );

  const handleChange = useCallback(
    (value: boolean) => {
      setCheckedValue(value);
      onChange?.(value);
    },
    [onChange],
  );

  useEffect(() => {
    if (checked !== undefined) {
      setCheckedValue(checked);
    }
  }, [checked]);

  useEffect(() => {
    if (defaultChecked !== undefined) {
      setCheckedValue(defaultChecked);
    }
  }, [defaultChecked]);

  return (
    <Row
      className={classNames({
        [styles.disabled]: !checked,
      })}
    >
      <Col xs={24} lg={24} xl={16}>
        <InventorySwitchInput
          onChange={handleChange}
          value={checkedValue}
          title={title}
          description={description}
          disabled={disabled}
        />
      </Col>
      {checkedValue && (
        <>
          <Col span={24}>
            <CustomDivider />
          </Col>
          <Col span={24}>{children}</Col>
        </>
      )}
    </Row>
  );
};
