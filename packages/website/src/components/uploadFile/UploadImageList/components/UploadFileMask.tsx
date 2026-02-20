import { Icon, IconSize } from '@assets/icon';
import { Loader } from '@components/layout/MainLayout';
import { getFileSrc } from '@components/uploadFile/helpers';
import { UploadFile } from 'antd';
import { RcFile } from 'antd/es/upload';
import { FC, useEffect, useState } from 'react';
import videoImg from '../../assets/videoPlaceholder.png';
import styles from './UpladMask.module.scss';

type PropsType = {
  file: UploadFile;
  previewTitle: string;
  onPreview: (file: UploadFile) => Promise<void>;
  onRemove?: (file: UploadFile) => void | boolean | Promise<void | boolean>;
};
export const UploadFileMask: FC<PropsType> = ({
  file,
  previewTitle,
  onPreview,
  onRemove,
}) => {
  const [url, serUrl] = useState<string>('');

  const isImage = file?.type?.includes('image');

  const isVideo = file?.type?.includes('video');

  const handlePreviewClick = async () => {
    await onPreview(file);
  };
  const handleRemove = async () => {
    await onRemove?.(file);
  };

  useEffect(() => {
    if (file.url) {
      serUrl(file.url);
    } else {
      getFileSrc(file.originFileObj as RcFile).then((res) => serUrl(res));
    }
  }, [file.url, file]);

  if (!url) {
    return <Loader spinning />;
  }

  return (
    <div className={styles.main}>
      <div className={styles.active}>
        {isImage && (
          <img alt={previewTitle} className={styles.imgItem} src={url} />
        )}
        {isVideo && (
          <video
            className={styles.videoItem}
            src={url}
            preload={'none'}
            poster={videoImg}
            width={125}
            height={125}
          />
        )}
        {!(isVideo || isImage) && (
          <span className={styles.otherTypes}>
            <Icon type={'file'} size={IconSize.XL} color={'gray'} />
          </span>
        )}
      </div>

      <>
        <span className={styles.eye} onClick={handlePreviewClick}>
          <Icon type={'eye'} size={IconSize.Medium} />
        </span>
        <span className={styles.delete} onClick={handleRemove}>
          <Icon type={'delete'} size={IconSize.Medium} />
        </span>
      </>
    </div>
  );
};
