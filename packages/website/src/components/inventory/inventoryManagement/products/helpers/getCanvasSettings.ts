type PrintSizeType =
  | '1x1'
  | '2-1-4x1-1-4'
  | '3-8x3-4'
  | '7-16x3-1-2'
  | '7-16x3-1-2L'
  | '7-8x15-16'
  | '1-2x1-15-16'
  | '9-16x4-3-8'
  | '7-16x2-1-2'
  | '3-8x2-3-4'
  | '7-16x3-4-4'
  | '9-16x4-1-8';

interface CanvasSettings {
  canvasWidth: number;
  canvasHeight: number;
  pdfOrientation: 'portrait' | 'landscape';
}

export const getCanvasSettings = (value: PrintSizeType): CanvasSettings => {
  let canvasWidth = 192;
  let canvasHeight = 192;
  let pdfOrientation: 'portrait' | 'landscape' = 'portrait';

  switch (value) {
    case '1x1':
      canvasWidth = 192;
      canvasHeight = 192;
      break;

    case '2-1-4x1-1-4':
      canvasWidth = 432;
      canvasHeight = 242;
      pdfOrientation = 'landscape';
      break;

    case '3-8x3-4':
      canvasWidth = 384;
      canvasHeight = 144;
      pdfOrientation = 'landscape';
      break;

    case '7-16x3-1-2':
      canvasWidth = 672;
      canvasHeight = 84;
      pdfOrientation = 'landscape';
      break;

    case '7-16x3-1-2L':
      canvasWidth = 672;
      canvasHeight = 84;
      pdfOrientation = 'landscape';
      break;

    case '7-8x15-16':
      canvasWidth = 168;
      canvasHeight = 360;
      pdfOrientation = 'portrait';
      break;

    case '1-2x1-15-16':
      canvasWidth = 372;
      canvasHeight = 96;
      pdfOrientation = 'landscape';
      break;

    case '9-16x4-3-8':
      canvasWidth = 840;
      canvasHeight = 108;
      pdfOrientation = 'landscape';
      break;

    case '7-16x2-1-2':
      canvasWidth = 480;
      canvasHeight = 84;
      pdfOrientation = 'landscape';
      break;

    case '3-8x2-3-4':
      canvasWidth = 528;
      canvasHeight = 72;
      pdfOrientation = 'landscape';
      break;

    case '7-16x3-4-4':
      canvasWidth = 720;
      canvasHeight = 84;
      pdfOrientation = 'landscape';
      break;

    case '9-16x4-1-8':
      canvasWidth = 792;
      canvasHeight = 108;
      pdfOrientation = 'landscape';
      break;

    default:
      break;
  }

  return { canvasWidth, canvasHeight, pdfOrientation };
};
