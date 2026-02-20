import { Readable } from 'stream';

export interface UploadEntity {
  name: string;
  hash: string;
  ext: string;
  alternativeText?: string;
  mime: string;
  width?: number;
  height?: number;
  folderPath?: string;
  size: number;
  provider: string;
  related?: Array<{
    id: string;
    __type: string;
    __pivot: {
      field: string;
    };
  }>;
  getStream?: () => Readable;
}
