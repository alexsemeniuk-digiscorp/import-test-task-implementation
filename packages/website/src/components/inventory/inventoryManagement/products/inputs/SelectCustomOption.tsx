import { Icon, IconSize } from '@assets/icon';
import { CustomButton } from '@ui/button/Button';

import { ExclamationCircleOutlined } from '@ant-design/icons';
import { ModalFuncProps, Row, Typography } from 'antd';
import { BaseOptionType } from 'antd/es/select';
import { FC, useMemo } from 'react';

interface Props extends BaseOptionType {
  onRemove?: (id: string) => void;
}

export const SelectCustomOption: FC<Props> = ({ onRemove, ...props }) => {
  const { label, data, value } = props;

  const confirmDeleteProps = useMemo(
    (): ModalFuncProps => ({
      title: 'Are you sure you want to delete this category?',
      icon: <ExclamationCircleOutlined />,
      maskClosable: true,
      centered: true,
      okText: 'Confirm',
      okType: 'danger',
      onOk: () => {
        onRemove?.(value);
      },
    }),
    [onRemove, value],
  );
  return (
    <Row align={'middle'} justify={'space-between'}>
      <Typography.Paragraph
        style={{ margin: 0, fontSize: 14, textAlign: 'center' }}
      >
        {label}
      </Typography.Paragraph>
      {data.editable && (
        <CustomButton
          type={'text'}
          icon={<Icon type={'delete'} size={IconSize.Medium} />}
          danger
          confirmProps={confirmDeleteProps}
        />
      )}
    </Row>
  );
};
