import { env } from '@strapi/utils';
import AWS from 'aws-sdk';
import * as https from 'https';
import Papa from 'papaparse';
import sharp from 'sharp';
import stream from 'stream';
import { SocketIo } from './../../api/socket/SocketIo';
import { generateCrypto, generateId } from './../../utils/randomBytes';
import { handleLogger } from './../helpers/errors';
import { UploadEntity } from './../models/contact/types/types';

const s3 = new AWS.S3({
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
  endpoint: env('S3_ENDPOINT'),
  region: env('S3_REGION'),
});

export const getServiceUpload = (name) => {
  return strapi.plugin('upload').service(name);
};

const getMimeTypeAndExtension = (format) => {
  const formatMimeMap = {
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    tiff: 'image/tiff',
    gif: 'image/gif',
    svg: 'image/svg+xml',
    mp4: 'video/mp4',
  };

  return {
    mimeType: formatMimeMap[format] || 'application/octet-stream',
    extension: format, // The extension is the same as the format
  };
};

const getFormatAndExtension = (mimeType) => {
  const mimeFormatMap = {
    'image/jpeg': 'jpeg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/tiff': 'tiff',
    'image/gif': 'gif',
    'image/svg+xml': 'svg',
    'text/csv': 'csv',
    'video/mp4': 'mp4',
  };

  return {
    ext: mimeFormatMap[mimeType] || 'bin',
  };
};

const generateRandomFilename = (extension) => {
  const randomString = generateCrypto(16);
  return `${randomString}.${extension}`;
};

export const getImageMetadata = async (imageData, entityId) => {
  try {
    const metadata = await sharp(imageData).metadata();

    const { width, height, format } = metadata;

    const { mimeType, extension } = getMimeTypeAndExtension(format);
    const filename = generateRandomFilename(extension);

    return {
      filename,
      extension: `{.${extension}}`,
      mimeType: mimeType,
      width,
      height,
      refId: entityId,
      ref: 'api::contact.contact',
      field: 'avatar',
    };
  } catch (error) {
    console.error('Error extracting image metadata:', error);
    throw error;
  }
};

export const uploadAndLinkDocument = async (
  buffer,
  { filename, extension, mimeType, refId, ref, field, width, height },
) => {
  const config = strapi.config.get('plugin.upload');

  const entity: UploadEntity = {
    name: filename,
    hash: filename,
    ext: extension,
    mime: mimeType,
    width,
    height,
    size: buffer.length,
    provider: config.provider,
  };
  if (refId) {
    entity.related = [
      {
        id: refId,
        __type: ref,
        __pivot: { field },
      },
    ];
  }
  entity.getStream = () => stream.Readable.from(buffer);
  await getServiceUpload('provider').upload(entity);
  const fileValues = { ...entity };

  const res = await strapi
    .query('plugin::upload.file')
    .create({ data: fileValues });
  return res;
};

export const processImageFromUrl = async (url, entityResponseId, errors) => {
  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          const errorMsg = `Failed to get '${url}' (${response.statusCode})`;
          console.error(errorMsg);
          errors.push(errorMsg);
          reject(errors);
          return;
        }

        const contentType = response.headers['content-type'];
        if (!contentType || !contentType.includes('image/')) {
          const errorMsg = `Content is not an image: '${url}'`;
          errors.push(errorMsg);
          console.error(errorMsg);
          reject(errors);
          return;
        }

        const data = [];
        let dataSize = 0;

        response.on('data', (chunk) => {
          data.push(chunk);
          dataSize += chunk.length;
        });

        response.on('end', async () => {
          try {
            const imageData = Buffer.concat(data, dataSize);
            const imageMetadata = await getImageMetadata(
              imageData,
              entityResponseId,
            );
            if (!imageMetadata) {
              const errorMsg = 'Failed to get image metadata.';
              console.error(errorMsg);
              errors.push(errorMsg);
              reject(errors);
              return;
            }
            await uploadAndLinkDocument(imageData, imageMetadata);
            resolve('Image data fetched and processed successfully');
          } catch (err) {
            const errorMsg = `Error processing image: ${err.message}`;
            console.error(errorMsg);
            errors.push(errorMsg);
            reject(errors);
          }
        });
      })
      .on('error', (err) => {
        const errorMsg = `Error fetching image: ${err.message}`;
        console.error(errorMsg);
        errors.push(errorMsg);
        reject(errors);
      });
  });
};

export const streamToBuffer = (readStream) => {
  return new Promise((resolve, reject) => {
    const chunks = [];

    readStream.removeAllListeners('data');
    readStream.removeAllListeners('end');
    readStream.removeAllListeners('error');
    readStream.on('data', (chunk) => chunks.push(chunk));
    readStream.on('end', () => resolve(Buffer.concat(chunks)));
    readStream.on('error', (err) => reject(err));
  });
};

export const createEntityFromBuffer = (
  file,
  buffer,
  config,
  { userId, tenantId },
) => {
  const { filename, mimetype } = file;
  const { ext } = getFormatAndExtension(mimetype);

  const regexedId = generateId();
  const entity: UploadEntity = {
    name: filename,
    alternativeText: regexedId,
    hash: regexedId,
    ext: `.${ext}`,
    mime: mimetype,
    size: buffer.length,
    provider: config.provider,
    folderPath: '/1',
  };

  entity.getStream = () => stream.Readable.from(buffer);

  return entity;
};

export const uploadEntity = async (entity) => {
  await getServiceUpload('provider').upload(entity);
  const fileValues = { ...entity };
  return await strapi.query('plugin::upload.file').create({ data: fileValues });
};

export const transformUploadFilesToBuffers = async (
  uploadFiles,
  { userId, tenantId },
) => {
  try {
    const responses = [];
    const config = strapi.config.get('plugin.upload');
    let filesUploaded = 0;

    for (let i = 0; i < uploadFiles.length; i++) {
      try {
        const { buffer, ...file } = uploadFiles[i];
        const bufferFromString = Buffer.from(buffer);
        const entity = createEntityFromBuffer(file, bufferFromString, config, {
          userId,
          tenantId,
        });
        const res = await uploadEntity(entity);
        responses.push(res);
        filesUploaded++;
        if (userId) {
          SocketIo.emitToUser(userId, 'uploadComplete', {
            filesUploaded: filesUploaded,
            filesTotal: uploadFiles.length,
          });
        }
      } catch (e) {
        console.log(e);
      }
    }

    return responses;
  } catch (error) {
    console.error('Error processing upload files:', error);
    throw error;
  }
};

export const processAndUploadCreations = async (
  processImport,
  { creations, options, filename, config, tenantFilter },
) => {
  if (!creations?.length) return null;

  const { csvResultHeaders, fieldsData } = processImport(creations, options);

  const generatedString = Papa.unparse({
    fields: csvResultHeaders,
    data: fieldsData,
  });
  const buffer = Buffer.from(generatedString, 'utf-8');

  const entity = createEntityFromBuffer(
    { filename, mimetype: 'text/csv' },
    buffer,
    config,
    {
      userId: options.userId,
      tenantId: tenantFilter?.tenant,
    },
  );

  const res = await uploadEntity(entity);
  return res?.id;
};

export const escapeCsvField = (value: string) => {
  if (value === null || value === undefined) {
    return '';
  }
  const stringValue = String(value);
  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
};

export const validateAndGetAvatarFileId = async (
  avatarField: number | string,
  tenantId,
  isImageCheck = false,
): Promise<{ isAvatarValid: boolean; fileFoundId: string }> => {
  const config = strapi.config.get('plugin.upload');
  try {
    const fileFetched = await strapi
      .query('plugin::upload.file')
      .findOne({ where: { alternativeText: avatarField } });

    if (!fileFetched?.url) return { isAvatarValid: false, fileFoundId: null };

    const key = new URL(fileFetched.url).pathname.slice(1);
    const file = await s3
      .getObject({ Bucket: process.env.S3_BUCKET, Key: key })
      .promise();

    const buffer = Buffer.isBuffer(file.Body)
      ? file.Body
      : Buffer.from(file.Body as Buffer);

    const entity = createEntityFromBuffer(
      { filename: fileFetched.name, mimetype: fileFetched.mime },
      buffer,
      config,
      { userId: null, tenantId },
    );

    const fileFound = await uploadEntity(entity);

    if (!fileFound) return { isAvatarValid: false, fileFoundId: null };

    if (isImageCheck) {
      const imageMimeTypes = new Set([
        'image/png',
        'image/jpeg',
        'image/gif',
        'image/webp',
        'image/svg+xml',
        'video/mp4',
      ]);

      return {
        isAvatarValid: imageMimeTypes.has(fileFound.mime),
        fileFoundId: fileFound.id,
      };
    }

    return { isAvatarValid: true, fileFoundId: fileFound.id };
  } catch (error) {
    handleLogger('error', 'validateAndGetAvatarFileId', error.message);
    return { isAvatarValid: false, fileFoundId: null };
  }
};
