import { Icon, IconSize } from '@assets/icon';
import fileBgIcon from '@assets/icon/icons/file-bg.svg';
import { Image, Typography, UploadFile } from 'antd';
import { FC } from 'react';
import styles from './ImageItem.module.scss';

interface Props {
  file: UploadFile;
  filterFunction?: () => void;
  showModal: (url: string) => void;
}

const ImageItem: FC<Props> = ({ file, filterFunction, showModal }) => {
  const isImageFile = file?.type?.includes('image');

  const handleDownload = () => {
    const url =
      file?.url ||
      (file?.originFileObj && URL.createObjectURL(file.originFileObj));
    if (url) {
      const link = document.createElement('a');
      link.href = url;
      link.download = file.name || 'file';
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className={styles.avatarUpload}>
      {isImageFile ? (
        <Image
          preview={true}
          className={styles.avatarPreview}
          src={file?.thumbUrl}
          alt={file?.name}
          style={{
            width: 100,
            height: 100,
            borderRadius: 5,
            cursor: 'pointer',
          }}
          fallback={fileBgIcon}
        />
      ) : (
        <div className={styles.filePreview} style={{ textAlign: 'center' }}>
          <img
            src={fileBgIcon}
            alt={'File'}
            style={{
              width: 100,
              height: 84,
            }}
          />
          <Typography.Paragraph
            ellipsis={{ tooltip: file.name }}
            style={{ maxWidth: 100, marginBottom: 0 }}
          >
            {file.name}
          </Typography.Paragraph>
          {!isImageFile && (
            <span className={styles.download} onClick={handleDownload}>
              <Icon type={'download'} size={IconSize.Medium} />
            </span>
          )}
        </div>
      )}
      {filterFunction && (
        <>
          <span className={styles.delete} onClick={filterFunction}>
            <Icon type={'delete'} size={IconSize.Medium} />
          </span>
        </>
      )}
    </div>
  );
};

export default ImageItem;
