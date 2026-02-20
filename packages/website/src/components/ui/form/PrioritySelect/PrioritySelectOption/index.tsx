import { FC } from 'react';

import { PriorityType } from '@helpers/enumTypes';
import { Row } from 'antd';
import capitalize from 'lodash/capitalize';

interface Props {
  label: PriorityType;
}

const getOptionColor = (type: PriorityType) => {
  switch (type) {
    case PriorityType.HIGH:
      return '#C62421';
    case PriorityType.MEDIUM:
      return '#D37D21';
    case PriorityType.LOW:
      return '#077C38';
    case PriorityType.INACTIVE:
      return '#A6B7ED';
    default:
      return undefined;
  }
};
export const PrioritySelectOption: FC<Props> = ({ label }) => {
  const lowerCaseLabel = label?.toLowerCase() as PriorityType;
  return (
    <Row align={'middle'} style={{ gap: 6 }}>
      <div
        style={{
          width: '16px',
          height: '16px',
          borderRadius: '4px',
          backgroundColor: getOptionColor(lowerCaseLabel),
        }}
      />
      {capitalize(label)}
    </Row>
  );
};
