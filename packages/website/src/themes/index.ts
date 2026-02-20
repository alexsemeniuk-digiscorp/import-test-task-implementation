import { ThemeConfig } from 'antd/es/config-provider';

import { colors } from '@/themes/_colors';
import { typography } from '@/themes/_typography';

const theme: ThemeConfig = {
  inherit: false,
  components: {
    Menu: {
      padding: 0,
      colorBorderBg: 'unset',
      colorPrimaryBg: 'unset',
      itemActiveBg: colors.colorBgTextHover,
      itemColor: colors.colorText,
      fontSize: 14,
    },
    Layout: {
      colorBgLayout: 'unset',
      bodyBg: 'unset',
      headerBg: 'unset',
      siderBg: 'unset',
    },
    Button: {
      colorText: colors.colorPrimary,
      colorBorder: colors.colorBorderSecondary,
      borderRadiusLG: 8,
      borderRadiusSM: 6,
      fontSize: 10,
      fontSizeLG: 12,
      lineHeight: 1.3,
      controlHeight: 24,
      controlHeightLG: 40,
      marginLG: 6,
      borderColorDisabled: '#E7E7E7',
    },
    Card: {
      colorBorderSecondary: colors.colorSplit,
      padding: 20,
      boxShadowTertiary: 'none',
    },
    Typography: {
      titleMarginTop: 0,
      titleMarginBottom: 0,
    },
    Segmented: {
      itemSelectedBg: '#E7ECF8',
      itemSelectedColor: colors.colorPrimary,
      colorBgLayout: '#fff',
      fontSize: 12,
      itemColor: colors.colorTextDescription,
      itemHoverColor: colors.colorPrimary,
    },
    Select: {
      optionSelectedBg: 'transparent',
      optionSelectedFontWeight: 'initial',
      optionPadding: '8px 16px',
      optionHeight: 24,
    },
  },
  token: {
    ...colors,
    ...typography,
  },
};

export default theme;
