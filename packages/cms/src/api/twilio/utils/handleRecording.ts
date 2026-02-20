import { ID } from '@strapi/strapi/lib/services/entity-service/types/params/attributes';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import { GraphQLResolveInfo } from 'graphql';
import fetch from 'node-fetch';
import path from 'path';
import sanitize from 'sanitize-filename';
import toArray from 'stream-to-array';
import { handleError, handleLogger } from '../../../graphql/helpers/errors';
import { updateUsageCounts } from '../../../graphql/models/usage/resolvers/updateUsageCounts';

const backendUrl = process.env.ABSOLUTE_URL;

export const handleRecordSource = async (
  callId: ID,
  callSid: string,
  callRecord: string,
  accSid: string,
  authToken: string,
): Promise<void> => {
  handleLogger('info', 'Downloading recording from:', callRecord);
  let tempFilePath;
  let fileSize = 0;

  try {
    const response = await axios.get(callRecord, {
      responseType: 'stream',
      auth: {
        username: accSid,
        password: authToken,
      },
    });

    const parts = await toArray(response.data);
    const buffer = Buffer.concat(
      parts.map((part) => (Buffer.isBuffer(part) ? part : Buffer.from(part))),
    );

    fileSize = buffer.length / 1024;

    let filename = `${callSid}.mp3`;
    filename = sanitize(filename);
    tempFilePath = path.join('/tmp', filename);

    fs.writeFileSync(tempFilePath, buffer);

    const form = new FormData();
    form.append('files', fs.createReadStream(tempFilePath), {
      filename,
      contentType: 'audio/mpeg',
    });

    const uploadResponse = await fetch(`${backendUrl}/api/upload`, {
      method: 'POST',
      body: form,
      headers: form.getHeaders(),
    });

    if (!uploadResponse.ok) {
      handleError('Error uploading file:', uploadResponse.statusText);
    }

    const uploadedFile = await uploadResponse.json();
    const savedFilePath = uploadedFile[0]?.url;

    await strapi.entityService.update('api::call.call', callId, {
      data: { recordSource: savedFilePath },
    });

    const twilioConnections = await strapi.entityService.findMany(
      'api::twilio-connection.twilio-connection',
      {
        filters: {
          accountSid: accSid,
        },
        populate: ['tenant'],
      },
    );

    if (twilioConnections && twilioConnections.length > 0) {
      const twilioConnection = twilioConnections[0];

      if (twilioConnection.tenant && twilioConnection.tenant.id) {
        const tenantId = twilioConnection.tenant.id;

        const tenant = await strapi.entityService.findOne(
          'api::tenant.tenant',
          tenantId,
        );

        const currentUsage = tenant.storageUsage
          ? parseFloat(tenant.storageUsage)
          : 0;
        const newUsage = (currentUsage + fileSize).toFixed(2);

        await strapi.entityService.update('api::tenant.tenant', tenantId, {
          data: {
            storageUsage: newUsage,
          },
        });

        const ctx = strapi.requestContext.get();
        const info: GraphQLResolveInfo = ctx.state
          .graphqlInfo as GraphQLResolveInfo;

        // Attempt to update usage counts
        const updateUsage = await updateUsageCounts(
          null,
          {
            input: {
              serviceType: 'storage',
              serviceCharge: 'storageCharge',
              newStorageUsage: fileSize,
            },
          },
          ctx,
          info,
        );

        if (!updateUsage) {
          throw new Error('Usage update failed');
        }

        handleLogger(
          'info',
          'Storage usage updated',
          `Tenant ${tenantId} storage updated: ${currentUsage}KB -> ${newUsage}KB (+${fileSize.toFixed(
            2,
          )}KB)`,
        );
      } else {
        handleLogger(
          'error',
          'Tenant not found',
          `No tenant found for TwilioConnection with accountSid: ${accSid}`,
        );
      }
    } else {
      handleLogger(
        'error',
        'TwilioConnection not found',
        `No TwilioConnection found with accountSid: ${accSid}`,
      );
    }
  } catch (error) {
    handleError('Error in handleRecordSource:', error);
  } finally {
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
  }
};
