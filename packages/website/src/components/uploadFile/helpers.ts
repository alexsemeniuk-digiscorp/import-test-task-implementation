import { generateUUID } from '@/utils/randomBytes';
import { UNLIMITED_ATTACHMENTS } from '@components/uploadFile/static';
import { UploadFile, UploadProps } from 'antd';
import { RcFile } from 'antd/es/upload';

export const dummyFileRequest: UploadProps['customRequest'] = async (props) => {
  setTimeout(() => {
    props?.onSuccess?.('ok');
  }, 0);
};

export const getFileSrc = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export const transformGqlFileToAntd = (file: FileFragment): UploadFile => {
  return {
    uid: file?.id || generateUUID(),
    name: file?.attributes?.name || 'Unnamed',
    thumbUrl: file?.attributes?.url,
    type: file?.attributes?.mime,
    ...file?.attributes,
  };
};

export const transformAntdFileToFileObj = (
  file: UploadFile,
): RcFile | undefined => {
  return file?.originFileObj;
};

export const getMaxAttachmentsCount = (
  maxCount: number,
): number | undefined => {
  return maxCount === UNLIMITED_ATTACHMENTS ? undefined : maxCount;
};

export const isFileAllowed = (
  acceptFormat: string,
  fileType?: string,
): boolean => {
  const acceptedFiles = acceptFormat
    .split(',')
    .map((item) => item.split('/')[0]);
  const type = fileType?.split('/')[0];

  return acceptedFiles.includes(String(type));
};
