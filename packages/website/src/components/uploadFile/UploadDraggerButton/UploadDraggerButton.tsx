import { UploadOutlined } from '@ant-design/icons';
import { Progress, Space, Typography } from 'antd';
import { FC } from 'react';
import styles from './UploadDraggerButton.module.scss';

interface Props {
  count?: number;
  loading?: boolean;
  total?: number;
}

const UploadDraggerButton: FC<Props> = ({ count, total, loading }) => {
  return (
    <Space direction={'vertical'} size={8} className={styles.centeredSpace}>
      <UploadOutlined style={{ fontSize: '24px' }} />
      {loading ? (
        <>
          <div style={{ width: 200 }}>
            <Progress
              percent={parseFloat(
                (((count ?? 0) / (total ?? 1)) * 100).toFixed(2),
              )}
              size={'small'}
              percentPosition={{ align: 'center', type: 'outer' }}
            />
          </div>
          <Typography.Text>
            Please don&apos;t close the window until the upload preparation is
            finished.
          </Typography.Text>
        </>
      ) : (
        <>
          <Typography.Text type={'secondary'}>Drop Files Here</Typography.Text>
          <Typography.Text type={'secondary'}>or</Typography.Text>
          <Typography.Text type={'secondary'}>Click to Browse</Typography.Text>

          {count && count > 0 && count === total ? (
            <Typography.Text>
              The result of the upload will appear in Importing Sessions. You
              will be notified when the report is completed.
            </Typography.Text>
          ) : null}
        </>
      )}
    </Space>
  );
};

export default UploadDraggerButton;
