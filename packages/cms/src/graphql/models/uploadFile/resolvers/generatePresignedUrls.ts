import { env } from '@strapi/utils';
import { GraphQLFieldResolver } from 'graphql';
import { v4 as uuid } from 'uuid';
import { s3 } from '../../../../api/aws-sdk/aws-sdk';
import redis from '../../../../api/redis/redis';
import { handleError } from '../../../helpers/errors';
import { importingFilesSession } from './../../../../api/redis/helpers/variables/importingVariables';
import { generateId } from './../../../../utils/randomBytes';
import { getTenantFilter } from './../../../models/dealTransaction/helpers/helpers';

type FileInput = {
  fileName: string;
  fileType: string;
  size: number;
};

export const generatePresignedUrls: GraphQLFieldResolver<
  any,
  Graphql.ResolverContext,
  {
    input: {
      files: FileInput[];
      importingSessionId: string;
    };
  }
> = async (root, { input }, ctx) => {
  try {
    const { files, importingSessionId } = input;
    if (!files || files.length === 0) {
      handleError('generatePresignedUrls', 'No files provided');
    }

    const userId = ctx.state.user.id;
    const tenantFilter = await getTenantFilter(userId);
    const bucketName = env('S3_BUCKET');
    if (!bucketName)
      handleError('generatePresignedUrls', 'S3_BUCKET not applied');

    const urls: string[] = [];

    for (const file of files) {
      const { fileName, fileType, size } = file;

      if (!fileName || !fileType) {
        handleError(
          'generatePresignedUrls',
          'fileName and fileType are required',
        );
      }

      const alternativeText = generateId();
      const uniqueName = uuid() + '-' + fileName;

      await redis.lpush(
        importingFilesSession(importingSessionId, tenantFilter?.tenant),
        JSON.stringify({ fileId: alternativeText, fileName }),
      );

      const bucketUrl = `https://${bucketName}.s3.us-east-2.amazonaws.com/vertical-saas/uploads/${uniqueName}`;

      await strapi.db.connection.raw(
        `
          INSERT INTO files (
               name, alternative_text, mime, size, url, provider, hash, folder_path
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          fileName,
          alternativeText,
          fileType,
          size,
          bucketUrl,
          'aws-s3',
          uuid(),
          '/1',
        ],
      );

      const presignedUrl = await s3.getSignedUrlPromise('putObject', {
        Bucket: bucketName,
        Key: `vertical-saas/uploads/${uniqueName}`,
        Expires: 3600,
        ContentType: fileType,
      });

      urls.push(presignedUrl);
    }

    return { presignedUrls: urls };
  } catch (error) {
    console.log(error);
    handleError('generatePresignedUrls', 'Failed to create signed URLs');
  }
};
