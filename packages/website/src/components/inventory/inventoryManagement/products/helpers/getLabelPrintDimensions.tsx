import { PrintSizeType } from '@/helpers/enumTypes';

export const getLabelPrintDimensions = (
  selectedLabelSize: PrintSizeType,
): { width: number; height: number } => {
  switch (selectedLabelSize) {
    case '1x1':
      return { width: 192, height: 192 };
    case '2-1-4x1-1-4':
      return { width: 432, height: 242 };
    case '3-8x3-4':
      return { width: 384, height: 144 };
    case '7-16x3-1-2':
      return { width: 672, height: 84 };
    case '7-16x3-1-2L':
      return { width: 672, height: 84 };
    case '7-8x15-16':
      return { width: 168, height: 360 };
    case '1-2x1-15-16':
      return { width: 372, height: 96 };
    case '9-16x4-3-8':
      return { width: 840, height: 108 };
    case '7-16x2-1-2':
      return { width: 480, height: 84 };
    case '3-8x2-3-4':
      return { width: 528, height: 72 };
    case '7-16x3-4-4':
      return { width: 720, height: 84 };
    case '9-16x4-1-8':
      return { width: 792, height: 108 };
    default:
      return { width: 384, height: 144 };
  }
};
