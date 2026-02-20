import { useState } from 'react';
import { ScanningHandlers } from '../index';

export const useScanningParentHandlers = () => {
  const [handlers, setHandlers] = useState<ScanningHandlers | undefined>();

  const handleClear = () => {
    handlers?.clearInput?.();
  };

  return { handleClear, setHandlers };
};
