import { CustomForm } from '@/components/form';
import { CustomFormItem } from '@/components/form/item/FormItem';
import { Icon } from '@assets/icon';
import { CustomButton } from '@ui/button/Button';
import { Col, InputNumber, Row } from 'antd';
import capitalize from 'lodash/capitalize';
import { FC, useCallback, useState } from 'react';

interface Props {
  handleAddNew: (
    from: number | null,
    to: number | null,
    value: number | null,
  ) => Promise<void>;
  loading?: boolean;
  shouldRenderIcon?: boolean;
}

export const AddNewRangeSelectButton: FC<Props> = ({
  handleAddNew,
  loading,
  shouldRenderIcon = true,
}) => {
  const [range, setRange] = useState({ from: 0, to: 0, value: 0 });

  const handleChange = (key: keyof typeof range, newValue: number | null) => {
    setRange((prev) => ({ ...prev, [key]: newValue }));
  };

  const handleClick = useCallback(async () => {
    const { from, to, value } = range;
    await handleAddNew(from, to, value);
    setRange({ from: 0, to: 0, value: 0 });
  }, [handleAddNew, range]);

  const isAddDisabled = loading || range.from >= range.to || range.value === 0;

  return (
    <CustomForm
      requiredMark={false}
      autoComplete={'off'}
      onFinish={handleClick}
    >
      <Row align={'middle'} gutter={8} style={{ padding: '4px 8px' }}>
        {(['from', 'to', 'value'] as const).map((key) => (
          <Col span={6} key={key}>
            <CustomFormItem label={capitalize(key)}>
              <InputNumber
                prefix={'%'}
                min={0}
                style={{ width: '100%' }}
                placeholder={capitalize(key)}
                autoComplete={'off'}
                value={range[key]}
                disabled={loading}
                onChange={(input) => handleChange(key, input)}
              />
            </CustomFormItem>
          </Col>
        ))}
        <Col span={6}>
          <CustomButton
            icon={shouldRenderIcon && <Icon type={'plus-circle'} />}
            htmlType={'submit'}
            block
            loading={loading}
            disabled={isAddDisabled}
            size={'large'}
          >
            Add new
          </CustomButton>
        </Col>
      </Row>
    </CustomForm>
  );
};
