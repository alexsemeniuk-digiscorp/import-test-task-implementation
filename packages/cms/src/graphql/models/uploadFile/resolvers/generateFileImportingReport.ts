import { GraphQLFieldResolver } from 'graphql';
import Papa from 'papaparse';
import redis from '../../../../api/redis/redis';
import { handleError } from '../../../helpers/errors';
import {
  createEntityFromBuffer,
  uploadEntity,
} from './../../../../../src/graphql/helpers/fileHelpers';
import { importingFilesSession } from './../../../../api/redis/helpers/variables/importingVariables';
import { getTenantFilter } from './../../../models/dealTransaction/helpers/helpers';

export const generateFileImportingReport: GraphQLFieldResolver<
  any,
  Graphql.ResolverContext,
  any
> = async (root, { input }, ctx) => {
  console.log('input', input);
  try {
    const { importingSessionId, sessionId } = input;
    const userId = ctx.state.user.id;
    const tenant = await getTenantFilter(userId);
    const tenantId = tenant.tenant;
    const config = strapi.config.get('plugin.upload');
    const redisKey = importingFilesSession(importingSessionId, tenantId);
    const storedItems = await redis.lrange(redisKey, 0, -1);
    console.log(storedItems, 'storedItems');
    const fieldsData = storedItems.map((item) => {
      const parsed = JSON.parse(item);
      return [parsed.fileName, parsed.fileId]; // match field order
    });

    const generatedString = Papa.unparse({
      fields: ['FILE NAME', 'AVATAR ID'],
      data: fieldsData,
    });

    console.log('generatedString', generatedString);
    const buffer = Buffer.from(generatedString, 'utf-8');

    const entity = createEntityFromBuffer(
      { filename: importingSessionId, mimetype: 'text/csv' },
      buffer,
      config,
      {
        userId,
        tenantId,
      },
    );

    const res = await uploadEntity(entity);
    console.log('res', res);

    const updateData = {
      cmpltdImports: res?.id ?? null,
      state: 'completed' as 'completed' | 'progressing' | 'error',
    };

    await strapi.entityService.update(
      'api::importing-session.importing-session',
      sessionId as any,
      { data: updateData },
    );
    return 'done';
  } catch (error) {
    console.log(error);
    handleError('generatePresignedUrl', 'Failed to create signed URL');
  }
};
