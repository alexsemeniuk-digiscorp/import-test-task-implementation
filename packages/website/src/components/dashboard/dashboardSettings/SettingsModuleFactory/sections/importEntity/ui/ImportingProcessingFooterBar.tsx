import { Flex, Typography } from 'antd';
import { FC } from 'react';

interface Props {
  isImporting: boolean;
  processedFields: Maybe<number>;
  totalFields?: Maybe<number>;
}

const ImportingProcessingFooterBar: FC<Props> = ({
  isImporting,
  processedFields,
  totalFields,
}) => {
  return (
    <Flex
      style={{
        position: 'fixed',
        left: 0,
        bottom: 0,
        backgroundColor: 'white',
        zIndex: 1000000,
        width: '100%',
        padding: '10px 10px',
        boxShadow: '0px -4px 10px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out',
        transform: isImporting ? 'translateY(0)' : 'translateY(100%)',
        opacity: isImporting ? 1 : 0,
      }}
      justify={'end'}
      gap={20}
    >
      <Typography>Processed: {processedFields}</Typography>
      <Typography>Total: {totalFields}</Typography>
    </Flex>
  );
};

export default ImportingProcessingFooterBar;
