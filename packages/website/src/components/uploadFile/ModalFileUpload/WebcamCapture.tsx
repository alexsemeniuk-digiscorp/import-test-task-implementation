import { Row, UploadFile } from 'antd';
import React, { FC, useCallback, useRef, useState } from 'react';
import Webcam from 'react-webcam';

import WebCamButtons from '@/components/ui/modal/filesModal/WebCamButtons';
import { generateUUID } from '@/utils/randomBytes';
import { WebcamSelect } from '@components/uploadFile/ModalFileUpload/WebcamSelect';
import { base64ToBlob } from '@helpers/fileActions';
import { RcFile } from 'antd/es/upload/interface';

const videoConstraints = {
  width: 860,
  height: 700,
  facingMode: 'user',
};

interface Props {
  onCancel: () => void;
  setFileList: React.Dispatch<React.SetStateAction<UploadFile[]>>;
}

export const WebcamCapture: FC<Props> = ({ onCancel, setFileList }) => {
  const webcamRef = useRef<Webcam>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setUrl(imageSrc);
    }
  }, [webcamRef]);

  const savePhoto = () => {
    if (url) {
      const blob = base64ToBlob(url, 'image/jpeg');
      const file = new File([blob], `web-cam-${generateUUID()}`, {
        type: 'image/jpeg',
      });

      const uploadFile: UploadFile = {
        uid: generateUUID(),
        name: `Screenshot:${new Date().toLocaleString()}`,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        lastModifiedDate: new Date(file.lastModified),
        thumbUrl: url,
        originFileObj: file as RcFile,
      };
      setFileList((prev: UploadFile[]) => [...prev, uploadFile]);
      setUrl('');
      onCancel();
    }
  };

  const nullUrl = () => {
    setUrl('');
  };

  return (
    <>
      <div>
        {url ? (
          <div>
            <img src={url} alt={'Screenshot'} />
          </div>
        ) : (
          <div>
            <Webcam
              audio={false}
              width={860}
              height={700}
              ref={webcamRef}
              screenshotFormat={'image/jpeg'}
              videoConstraints={{
                ...videoConstraints,
                deviceId: selectedDeviceId
                  ? { exact: selectedDeviceId }
                  : undefined,
              }}
            />
          </div>
        )}
      </div>
      <div style={{ marginTop: 10 }}>
        {url ? (
          <Row justify={'end'}>
            <WebCamButtons
              primaryLabel={'Save'}
              primaryAction={savePhoto}
              secondaryLabel={'Try again'}
              secondaryAction={nullUrl}
            />
          </Row>
        ) : (
          <Row justify={'space-between'} align={'middle'}>
            <WebcamSelect
              selectedDeviceId={selectedDeviceId}
              setSelectedDeviceId={setSelectedDeviceId}
            />
            <WebCamButtons
              primaryLabel={'Capture'}
              primaryAction={capture}
              secondaryLabel={'Cancel'}
              secondaryAction={onCancel}
            />
          </Row>
        )}
      </div>
    </>
  );
};
