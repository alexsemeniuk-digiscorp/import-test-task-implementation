import { env } from '@strapi/utils';
import AWS from 'aws-sdk';

export const s3 = new AWS.S3({
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
  endpoint: env('S3_ENDPOINT'),
  region: env('S3_REGION'),
});
