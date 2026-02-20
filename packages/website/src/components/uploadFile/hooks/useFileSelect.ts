import { useCallback, useEffect, useState } from 'react';

import { UploadFile } from 'antd';

import { getFileSrc } from '@components/uploadFile/helpers';

interface FileSelectProps {
  onChange?: (file: File | null) => void;
  defaultUrl?: string;
}

export const useFileSelect = ({ onChange, defaultUrl }: FileSelectProps) => {
  const [file, setFile] = useState<UploadFile | null>(null);
  const [fileSrc, setFileSrc] = useState<string | null>();

  useEffect(() => {
    if (defaultUrl) {
      setFileSrc(defaultUrl);
    }
  }, [defaultUrl]);

  const handleRemoveFile = useCallback(() => {
    setFile(null);
    setFileSrc(null);
    onChange?.(null);
  }, [setFile, setFileSrc, onChange]);

  const handleFileChange = useCallback(
    (file: UploadFile) => {
      setFile(file);

      if (file.originFileObj && onChange) {
        onChange(file.originFileObj);
      }

      if (file.originFileObj) {
        getFileSrc(file.originFileObj).then(setFileSrc);
      }
    },
    [setFile, onChange],
  );

  return {
    handleFileChange,
    handleRemoveFile,
    fileSrc,
    file,
  };
};
