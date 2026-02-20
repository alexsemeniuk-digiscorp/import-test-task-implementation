import { FC, ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { ConfigProvider, Space, Typography } from 'antd';

import { useDrawer } from '@drawer/drawerContext';
import { useToken } from '@hooks/useToken';
import { useNavigate } from 'react-router';

export interface TextInfoBlockType {
  address?: string;
  title?: string | ReactNode;
  titleColor?: string;
  descriptionColor?: string;
  description?: string | ReactNode;
  fontSize?: number;
  titleFontSize?: number;
  link?: string;
  target?: '_blank' | '_self';
  fontWeight?: number;
  ellipsis?: boolean;
}

const TextInfoBlock: FC<TextInfoBlockType> = ({
  title,
  description,
  fontSize = 12,
  titleFontSize = 14,
  titleColor,
  descriptionColor,
  link,
  target = '_self',
  fontWeight = 500,
  ellipsis = false,
}) => {
  const { token } = useToken();
  const { closeDrawer } = useDrawer();
  const navigate = useNavigate();
  const handleClick = (link?: string) => () => {
    closeDrawer();
    link && navigate(link);
  };
  const titleStyle = { fontWeight, ...(ellipsis && { maxWidth: 200 }) };

  return (
    <Space direction={'vertical'} size={4}>
      <ConfigProvider
        theme={{
          token: {
            fontSize: fontSize,
            fontSizeHeading5: titleFontSize,
            colorText: descriptionColor ?? token.colorTextDescription,
            colorTextHeading: titleColor ?? token.colorText,
          },
        }}
      >
        <Typography.Title
          level={5}
          style={titleStyle}
          ellipsis={ellipsis ? { tooltip: title } : false}
        >
          {title}
        </Typography.Title>
        {description && (
          <Typography.Text
            style={{ textAlign: 'left', display: 'block', marginTop: 2 }}
          >
            {link ? (
              <Link to={link} target={target} onClick={handleClick(link)}>
                {description}
              </Link>
            ) : (
              description
            )}
          </Typography.Text>
        )}
      </ConfigProvider>
    </Space>
  );
};

export default TextInfoBlock;
