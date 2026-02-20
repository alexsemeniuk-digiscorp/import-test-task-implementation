import { ChangeEvent, FC, useCallback, useState } from 'react';

import { Col, Input, Row } from 'antd';

import { Icon } from '@assets/icon';

import { CustomForm } from '@/components/form';
import { CustomFormItem } from '@/components/form/item/FormItem';
import { CustomButton } from '@ui/button/Button';

interface Props {
  handleAddNew: (value: string) => Promise<void>;
  loading?: boolean;
  shouldRenderIcon?: boolean;
  maxNameLength?: number;
}

export const AddNewSelectButton: FC<Props> = ({
  handleAddNew,
  loading,
  shouldRenderIcon = true,
  maxNameLength,
}) => {
  const [name, setName] = useState<string>('');

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleClick = useCallback(async () => {
    await handleAddNew(name);

    setName('');
  }, [handleAddNew, name]);

  return (
    <CustomForm
      requiredMark={false}
      autoComplete={'off'}
      onFinish={handleClick}
    >
      <Row align={'middle'} gutter={8} style={{ padding: '4px 8px' }}>
        <Col span={16}>
          <CustomFormItem
            label={'Enter name'}
            rules={[
              {
                pattern: new RegExp(/^[a-zA-Z\s]*$/),
                message: 'Only letters and spaces are allowed',
              },
            ]}
          >
            <Input
              placeholder={'Enter name'}
              value={name}
              onChange={handleNameChange}
              disabled={loading}
              maxLength={maxNameLength}
            />
          </CustomFormItem>
        </Col>
        <Col span={8}>
          <CustomButton
            icon={shouldRenderIcon && <Icon type={'plus-circle'} />}
            htmlType={'submit'}
            block
            loading={loading}
            disabled={!name || loading}
            size={'large'}
          >
            Add new
          </CustomButton>
        </Col>
      </Row>
    </CustomForm>
  );
};
