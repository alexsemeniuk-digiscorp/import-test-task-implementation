import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import { GraphQLResolveInfo } from 'graphql';
import fetch from 'node-fetch';
import path from 'path';
import sanitize from 'sanitize-filename';
import { handleError, handleLogger } from '../../../graphql/helpers/errors';
import { updateUsageCounts } from '../../../graphql/models/usage/resolvers/updateUsageCounts';
import { TwilioService } from '../../twilio/TwilioService';

const backendUrl = process.env.ABSOLUTE_URL;

/**
 * Find Twilio connection by Account SID
 */
export async function findTwilioConnectionByAccountSid(accSid) {
  const twilioConnections = await strapi.entityService.findMany(
    'api::twilio-connection.twilio-connection',
    {
      filters: {
        accountSid: {
          $eq: accSid,
        },
      },
      populate: ['tenant'],
    },
  );

  if (!twilioConnections || twilioConnections.length === 0) {
    throw new Error('Twilio connection not found');
  }

  return twilioConnections[0];
}

/**
 * Get tenant with populated users
 */
export async function getTenantWithUsers(tenantId) {
  return await strapi.entityService.findOne('api::tenant.tenant', tenantId, {
    populate: { users: true },
  });
}

/**
 * Get an existing conversation or create a new one
 */
export async function getOrCreateConversation(
  client,
  tenantId,
  senderNumber,
  twilioNumber,
) {
  const conversations = await strapi.entityService.findMany(
    'api::conversation.conversation',
    {
      filters: { tenant: tenantId },
      populate: { contact: true, company: true, lead: true },
    },
  );

  const conversation = conversations.find((conv) => {
    const contactPhone = conv.contact?.phoneNumber;
    const companyPhone = conv.company?.phoneNumber;
    const leadPhone = conv.lead?.phoneNumber;
    return (
      contactPhone === senderNumber ||
      companyPhone === senderNumber ||
      leadPhone === senderNumber
    );
  });

  if (conversation) return conversation;

  const newConversation = await client.createConversation(
    `Conversation with ${senderNumber}`,
  );
  await client.addParticipant(newConversation.sid, senderNumber, twilioNumber);
  return newConversation;
}

/**
 * Find existing contact or lead by phone number, or create a new lead
 */
export async function findContactOrLead(senderNumber, tenantId) {
  const existingContact = await strapi.entityService.findMany(
    'api::contact.contact',
    {
      filters: {
        phoneNumber: senderNumber,
        tenant: { id: { $eq: tenantId } },
      },
    },
  );

  if (existingContact.length > 0) {
    return { entity: existingContact[0], isContact: true };
  }

  const existingLead = await strapi.entityService.findMany('api::lead.lead', {
    filters: {
      phoneNumber: senderNumber,
      tenant: { id: { $eq: tenantId } },
    },
  });

  if (existingLead.length > 0) {
    return { entity: existingLead[0], isContact: false };
  }

  // Create new lead
  const newLead = await strapi.entityService.create('api::lead.lead', {
    data: {
      fullName: senderNumber,
      email: `noemail@noemail.com`,
      phoneNumber: senderNumber,
      tenant: tenantId,
    },
  });

  return { entity: newLead, isContact: false };
}

/**
 * Create a new conversation record
 */
export async function createConversationRecord(conversationData) {
  return await strapi.entityService.create('api::conversation.conversation', {
    data: conversationData,
  });
}

/**
 * Download and upload media from Twilio MMS
 */
export async function downloadAndUploadMedia(
  mediaUrl,
  contentType,
  senderNumber,
  twilioConnection,
) {
  try {
    // Create a TwilioService instance to get auth token
    const twilioClient = new TwilioService('', twilioConnection.accountSid);
    const authToken = await twilioClient.fetchSubaccountAuthToken();

    // Download media with proper authentication
    const response = await axios.get(mediaUrl, {
      responseType: 'arraybuffer',
      auth: {
        username: twilioConnection.accountSid,
        password: authToken,
      },
    });

    // Calculate file size
    const buffer = Buffer.from(response.data);
    const fileSize = buffer.length / 1024; // Size in KB

    // Generate filename
    const extension = contentType.split('/')[1] || 'bin';
    const filename = sanitize(
      `${senderNumber.replace(/[^a-zA-Z0-9]/g, '')}_${Date.now()}.${extension}`,
    );
    const tempFilePath = path.join('/tmp', filename);

    // Save to temp file
    fs.writeFileSync(tempFilePath, buffer);

    // Create Strapi context for upload to associate with proper authenticated user
    const form = new FormData();
    form.append('files', fs.createReadStream(tempFilePath), {
      filename,
      contentType,
    });

    try {
      // Set the upload headers correctly
      const headers = form.getHeaders ? form.getHeaders() : {};

      const uploadResponse = await fetch(`${backendUrl}/api/upload`, {
        method: 'POST',
        body: form,
        headers,
      });

      if (!uploadResponse.ok) {
        throw new Error(`Failed to upload media: ${uploadResponse.statusText}`);
      }

      const uploadedFile = await uploadResponse.json();
      const url = uploadedFile[0]?.url;

      // Clean up temp file
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }

      return { fileSize, url };
    } catch (uploadError) {
      // Clean up temp file on error
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
      throw uploadError;
    }
  } catch (error) {
    handleError('downloadAndUploadMedia', error);
    return { fileSize: 0, url: null };
  }
}

/**
 * Update tenant storage usage
 */
export async function updateTenantStorageUsage(tenantId, sizeInKB) {
  try {
    // Get current tenant data
    const tenant = await strapi.entityService.findOne(
      'api::tenant.tenant',
      tenantId,
    );

    // Calculate new storage usage
    const currentUsage = tenant.storageUsage
      ? parseFloat(tenant.storageUsage)
      : 0;
    const newUsage = (currentUsage + sizeInKB).toFixed(2);

    // Update tenant storage usage
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
          newStorageUsage: sizeInKB,
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
      `Tenant ${tenantId} storage updated: ${currentUsage}KB -> ${newUsage}KB (+${sizeInKB.toFixed(
        2,
      )}KB)`,
    );

    return true;
  } catch (error) {
    handleError('updateTenantStorageUsage', error);
    return false;
  }
}

/**
 * Process multiple media attachments from an MMS message
 */
export async function processIncomingMedia(
  requestBody,
  numMedia,
  twilioConnection,
  tenantId,
) {
  let totalMediaSize = 0;
  const mediaUrls = [];

  try {
    for (let i = 0; i < parseInt(numMedia); i++) {
      const mediaUrl = requestBody[`MediaUrl${i}`];
      const contentType = requestBody[`MediaContentType${i}`];

      if (mediaUrl) {
        const { fileSize, url } = await downloadAndUploadMedia(
          mediaUrl,
          contentType,
          requestBody.From,
          twilioConnection,
        );

        totalMediaSize += fileSize;
        if (url) mediaUrls.push(url);
      }
    }

    // Update tenant storage usage if any media was uploaded
    if (totalMediaSize > 0) {
      await updateTenantStorageUsage(tenantId, totalMediaSize);
    }

    return { mediaUrls, totalMediaSize };
  } catch (error) {
    handleError('processIncomingMedia', error);
    return { mediaUrls: [], totalMediaSize: 0 };
  }
}
