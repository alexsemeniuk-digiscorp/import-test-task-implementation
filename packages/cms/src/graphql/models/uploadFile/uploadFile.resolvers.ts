import { generateFileImportingReport } from './resolvers/generateFileImportingReport';
import { generatePresignedUrl } from './resolvers/generatePresignedUrl';
import { generatePresignedUrls } from './resolvers/generatePresignedUrls';
import { processingFileUploading } from './resolvers/processingFileUploading';
import { url } from './resolvers/url';

export const UploadFilesMutation = {
  processingFileUploading,
  generatePresignedUrl,
  generateFileImportingReport,
  generatePresignedUrls,
};

export const UploadResolvers = {
  url,
};
