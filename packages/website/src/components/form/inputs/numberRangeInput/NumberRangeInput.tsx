import { Flex, InputNumber, Slider } from 'antd';
import { FC } from 'react';

interface NumberRangeInputProps {
  rangeValue: number[];
  defaultRange: number[];
  minRangeValue: number | null | undefined;
  maxRangeValue: number | null | undefined;
  handleRangeChange: (value: number[]) => void;
  handleMinRangeChange: (value: number | null) => void;
  handleMaxRangeChange: (value: number | null) => void;
  handleSetRange?: () => void;
  formatter?: (value: string | number | undefined) => string;
  parser?: (value: string | undefined) => number;
}

export const NumberRangeInput: FC<NumberRangeInputProps> = (props) => {
  const {
    rangeValue = [0, 0],
    defaultRange = [0, 0],
    minRangeValue = 0,
    maxRangeValue = 0,
    handleRangeChange,
    handleMinRangeChange,
    handleMaxRangeChange,
    formatter,
    parser,
    ...rest
  } = props;

  return (
    <>
      <Slider
        range
        value={rangeValue}
        defaultValue={defaultRange}
        onChange={handleRangeChange}
        min={defaultRange[0]}
        max={defaultRange[1]}
        autoFocus={true}
      />
      <Flex
        style={{ width: '100%' }}
        align={'center'}
        justify={'space-between'}
        gap={15}
      >
        <InputNumber<number>
          min={defaultRange[0]}
          max={defaultRange[1]}
          value={minRangeValue || defaultRange[0]}
          defaultValue={defaultRange[0]}
          onChange={handleMinRangeChange}
          formatter={formatter}
          parser={parser}
          style={{ width: '100%' }}
          {...rest}
        />
        <InputNumber<number>
          min={defaultRange[0]}
          max={defaultRange[1]}
          value={maxRangeValue || defaultRange[1]}
          defaultValue={defaultRange[1]}
          onChange={handleMaxRangeChange}
          formatter={formatter}
          parser={parser}
          style={{ width: '100%' }}
          {...rest}
        />
      </Flex>
    </>
  );
};
