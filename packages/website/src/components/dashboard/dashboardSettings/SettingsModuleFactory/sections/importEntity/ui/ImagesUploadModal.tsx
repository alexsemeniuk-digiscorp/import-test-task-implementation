import {
  useCreateImportingSessionMutation,
  useGenerateFileImportingReportMutation,
  useGeneratePresignedUrlsMutation,
} from '@/graphql';
import { useStatusMessage } from '@app/StatusMessageContext/statusMessageContext';
import UploadDraggerButton from '@components/uploadFile/UploadDraggerButton/UploadDraggerButton';
import { useTenantInfo } from '@hooks/useTenantInfo';
import { CustomButton } from '@ui/button/Button';
import { Flex, UploadFile, UploadProps } from 'antd';
import React, { FC, useState } from 'react';

interface Props extends UploadProps {
  initialValues?: UploadFile[];
  onCancel?: () => void;
}
const generateId = (): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const idLength = 11;
  const array = new Uint8Array(idLength);
  crypto.getRandomValues(array);

  const id = Array.from(
    array,
    (byte) => characters[byte % characters.length],
  ).join('');

  return `#${id}`;
};

interface Props {
  onCancel?: () => void;
}

export const ImagesUploadModal: FC<Props> = ({ onCancel }) => {
  const [files, setFiles] = useState<File[]>([]);
  const totalSizeKB = (
    files.reduce((acc, file) => acc + file.size, 0) / 1024
  ).toFixed(2);
  const message = useStatusMessage();
  const [count, setCount] = useState(0);
  const [total, setTotal] = useState(0);

  const [generatePresignedUrls] = useGeneratePresignedUrlsMutation();

  const [createImportingSession] = useCreateImportingSessionMutation();
  const [generateFileImportingReport] =
    useGenerateFileImportingReportMutation();
  const { tenantId } = useTenantInfo();
  const [loading, setLoading] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files));
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files) {
      setFiles(Array.from(event.dataTransfer.files));
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const uploadToS3 = async (
    files: File[],
    presignedUrls: string[],
    setCount: React.Dispatch<React.SetStateAction<number>>,
  ): Promise<void> => {
    const INNER_BATCH_SIZE = 5;

    for (let i = 0; i < files.length; i += INNER_BATCH_SIZE) {
      const batchFiles = files.slice(i, i + INNER_BATCH_SIZE);
      const batchUrls = presignedUrls.slice(i, i + INNER_BATCH_SIZE);

      await Promise.all(
        batchFiles.map(async (file, index) => {
          const url = batchUrls[index];
          if (!url) throw new Error(`Missing presigned URL for ${file.name}`);

          try {
            const response = await fetch(url, {
              method: 'PUT',
              body: file,
              headers: {
                'Content-Type': file.type || 'application/octet-stream',
              },
            });

            if (!response.ok) throw new Error('Upload to S3 failed');

            console.log(`✅ Uploaded: ${file.name}`);
            setCount((prev) => prev + 1);
          } catch (error) {
            console.error(`❌ Upload failed: ${file.name}`, error);
            throw error;
          }
        }),
      );
    }
  };

  const handleUpload = async (): Promise<void> => {
    try {
      if (!files || files.length === 0) {
        alert('No files selected');
        return;
      }

      setLoading(true);
      const importingSessionId = generateId();
      const sessionRes = await createImportingSession({
        variables: {
          input: {
            type: 'files',
            regexedId: importingSessionId,
          },
        },
      });

      setTotal(files.length);

      const OUTER_BATCH_SIZE = 20;

      for (let i = 0; i < files.length; i += OUTER_BATCH_SIZE) {
        const batchFiles = files.slice(i, i + OUTER_BATCH_SIZE);

        const filesInput = batchFiles.map((file) => ({
          fileName: file.name,
          fileType: file.type,
          size: file.size,
        }));

        const presignedRes = await generatePresignedUrls({
          variables: {
            input: {
              importingSessionId,
              files: filesInput,
            },
          },
        });

        const presignedUrls =
          presignedRes?.data?.generatePresignedUrls?.presignedUrls;
        if (!presignedUrls || presignedUrls.length !== batchFiles.length) {
          throw new Error('Failed to get all presigned URLs for batch');
        }

        const validPresignedUrls = presignedUrls?.filter((url): url is string =>
          Boolean(url),
        );

        await uploadToS3(batchFiles, validPresignedUrls, setCount);
      }

      await generateFileImportingReport({
        variables: {
          input: {
            importingSessionId,
            sessionId: sessionRes.data?.createImportingSession?.data?.id,
          },
        },
      });

      setLoading(false);
    } catch (e) {
      console.error(e);
      message.open('error');
      setLoading(false);
    }
  };

  return (
    <>
      {files.length > 0 && (
        <div style={{ margin: '10px 0', fontWeight: 'bold' }}>
          Total size: {totalSizeKB} KB
        </div>
      )}
      <input
        type={'file'}
        multiple
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        id={'fileInput'}
      />
      <label htmlFor={'fileInput'} style={{ color: 'blue', cursor: 'pointer' }}>
        <div
          style={{
            border: '1px dashed #ccc',
            padding: '20px',
            textAlign: 'center',
            cursor: 'pointer',
            marginBottom: '10px',
            borderRadius: '5px',
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <UploadDraggerButton count={count} total={total} loading={loading} />
        </div>
      </label>
      <Flex justify={'space-around'}>
        <>
          <CustomButton onClick={handleUpload} type={'primary'} size={'large'}>
            Upload files
          </CustomButton>
          <CustomButton onClick={onCancel} size={'large'}>
            Close
          </CustomButton>
        </>
      </Flex>
      {files.length > 0 && (
        <ol style={{ margin: 20, padding: 0 }}>
          {files.map((file, index) => (
            <li key={index}>
              {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </li>
          ))}
        </ol>
      )}
    </>
  );
};
