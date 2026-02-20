import { Select, Typography } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';

type AnyFileTypeListProps = {
  selectedDeviceId: string | null;
  setSelectedDeviceId: React.Dispatch<React.SetStateAction<string | null>>;
};

export const WebcamSelect: React.FC<AnyFileTypeListProps> = ({
  selectedDeviceId,
  setSelectedDeviceId,
}) => {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

  const webcamsOptions = devices?.map((item) => {
    return {
      key: item.deviceId,
      label: item.label,
      value: item.deviceId,
    };
  });

  const getVideoDevices = useCallback(async () => {
    try {
      const mediaDevices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = mediaDevices.filter(
        (device) => device.kind === 'videoinput',
      );
      setDevices(videoDevices);
      if (videoDevices.length > 0) {
        setSelectedDeviceId(videoDevices[0].deviceId);
      }
    } catch (error) {
      console.error('Error getting video devices:', error);
    }
  }, [setSelectedDeviceId]);

  useEffect(() => {
    getVideoDevices();
  }, [getVideoDevices]);

  const handleDeviceChange = (value: string) => {
    setSelectedDeviceId(value);
  };

  return (
    <>
      {!devices.length ? (
        <Typography.Paragraph>
          No cameras found. Please connect a camera and try again.
        </Typography.Paragraph>
      ) : (
        <Select
          placeholder={'Select a camera'}
          onChange={handleDeviceChange}
          value={selectedDeviceId ?? ''}
          options={webcamsOptions}
          defaultValue={devices?.[0]?.deviceId}
          style={{ width: 300 }}
        />
      )}
    </>
  );
};
