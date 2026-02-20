import { env } from '@strapi/utils';
import { GraphQLFieldResolver } from 'graphql';
import { v4 as uuid } from 'uuid';
import { s3 } from '../../../../api/aws-sdk/aws-sdk';
import redis from '../../../../api/redis/redis';
import { handleError } from '../../../helpers/errors';
import { importingFilesSession } from './../../../../api/redis/helpers/variables/importingVariables';
import { generateId } from './../../../../utils/randomBytes';
import { getTenantFilter } from './../../../models/dealTransaction/helpers/helpers';

export const generatePresignedUrl: GraphQLFieldResolver<
  any,
  Graphql.ResolverContext,
  {
    input: {
      fileName: string;
      fileType: string;
      size: number;
      importingSessionId: string;
    };
  }
> = async (root, { input }, ctx) => {
  try {
    const { fileName, fileType, size, importingSessionId } = input;
    const userId = ctx.state.user.id;
    const tenantFilter = await getTenantFilter(userId);
    const alternativeText = generateId();
    const uniqueName = uuid() + '-' + fileName;

    if (!fileName || !fileType) {
      handleError('generatePresignedUrl', 'fileName and fileType are required');
    }

    const bucketName = env('S3_BUCKET');
    if (!bucketName) {
      handleError('generatePresignedUrl', 'S3_BUCKET not applied');
    }
    const params = {
      Bucket: `${bucketName}`,
      Key: `vertical-saas/uploads/${uniqueName}`,
      Expires: 3600,
      ContentType: fileType,
    };

    await redis.lpush(
      importingFilesSession(importingSessionId, tenantFilter?.tenant),
      JSON.stringify({ fileId: alternativeText, fileName }),
    );
    const bucketUrl = `https://${bucketName}.s3.us-east-2.amazonaws.com/vertical-saas/uploads/${uniqueName}`;
    const newRow = await strapi.db.connection.raw(
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

    console.log('newRow', newRow);
    return { presignedUrl: await s3.getSignedUrlPromise('putObject', params) };
  } catch (error) {
    console.log(error);
    handleError('generatePresignedUrl', 'Failed to create signed URL');
  }
};
