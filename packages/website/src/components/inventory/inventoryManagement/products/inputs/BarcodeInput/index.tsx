import { Icon } from '@assets/icon';
import { generateRandomNumber } from '@inventory/inventoryManagement/products/inputs/BarcodeInput/helpers/nubmersGenerator';
import { CustomButton } from '@ui/button/Button';
import { Input, InputProps, Row } from 'antd';
import { ChangeEvent, FC, useEffect, useState } from 'react';

interface Props extends InputProps {
  handleInputChange?: (value: string | null) => void;
  initialValue?: string;
}

export const BarcodeInput: FC<Props> = ({
  handleInputChange,
  initialValue,
  ...props
}) => {
  const [code, setCode] = useState<string>(initialValue ?? '');

  const handleGenerate = () => {
    const randomNumber = generateRandomNumber();
    setCode(randomNumber);
    handleInputChange?.(randomNumber);
  };
  useEffect(() => {
    if (initialValue) {
      setCode(initialValue);
      handleInputChange?.(initialValue);
    }
  }, [initialValue, handleInputChange]);

  useEffect(() => {
    if (!initialValue) {
      handleGenerate();
    }
    // eslint-disable-next-line
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
    handleInputChange?.(e.target.value);
  };

  return (
    <Row wrap={false} align={'middle'}>
      <Input
        value={code}
        placeholder={'This field can be automatically generated'}
        onChange={handleChange}
        {...props}
      />
      {!initialValue && (
        <CustomButton
          onClick={handleGenerate}
          type={'text'}
          icon={<Icon type={'refresh'} />}
        />
      )}
    </Row>
  );
};
