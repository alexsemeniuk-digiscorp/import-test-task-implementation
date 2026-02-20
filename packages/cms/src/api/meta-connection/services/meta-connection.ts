import { factories } from '@strapi/strapi';
import { MetaService } from '../../meta/MetaService';

import { errors } from '@strapi/utils';
import fetch from 'node-fetch';

const FB_API_BASE = 'https://graph.facebook.com/v23.0';
const DEFAULT_BATCH_SIZE = 10;
const DEFAULT_PAGE_DELAY_MS = 200;
const DEFAULT_BATCH_DELAY_MS = Number(
  process.env.META_BATCH_DELAY_MS ?? '3000',
);

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const processInBatches = async <T, R>(
  items: T[],
  batchSize: number,
  processFn: (batch: T[]) => Promise<R[]>,
): Promise<R[]> => {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await processFn(batch);
    results.push(...batchResults);
    if (i + batchSize < items.length) {
      await delay(DEFAULT_BATCH_DELAY_MS);
    }
  }
  return results;
};

type BootstrapDetail = {
  id: string;
  status: 'created' | 'skipped' | 'error';
  conversationId?: string | number;
  reason?: string;
  error?: string;
};
type BootstrapResult = {
  success: boolean;
  total: number;
  created: number;
  skipped: number;
  details: BootstrapDetail[];
};

export default factories.createCoreService(
  'api::meta-connection.meta-connection',
  ({ strapi }) => {
    return {
      metaService: new MetaService(),
      async findByTenant(tenantId: number): Promise<any | null> {
        const connections = await strapi.entityService.findMany(
          'api::meta-connection.meta-connection',
          {
            filters: { tenant: tenantId },
            limit: 1,
            populate: ['pages'],
          },
        );
        return connections[0] || null;
      },

      async getConversationMessages(
        conversationId: string,
        tenantId: string,
        pageId: string,
        limit = 25,
        after?: string,
        before?: string,
        pageUrl?: string,
      ): Promise<{ messages: any[]; paging: any }> {
        const metaConnection = await this.findByTenant(tenantId);
        if (!metaConnection) {
          throw new errors.ApplicationError(
            'No Meta connection found for this tenant',
          );
        }
        const pageToken = metaConnection.pages?.find(
          (p: any) => p.pageId === pageId,
        )?.token;
        if (!pageToken) {
          throw new errors.ApplicationError(
            'No page token found for the given page',
          );
        }

        const { messages, paging } =
          await this.metaService.getConversationMessagesCursor({
            conversationId,
            accessToken: pageToken,
            limit,
            after,
            before,
            pageUrl,
          });

        const formatted = (messages || []).map((msg: any) => {
          const mediaUrls = (msg.attachments?.data || [])
            .map((a: any) => a.image_data?.preview_url || a.image_data?.url)
            .filter(Boolean);
          return {
            sid: msg.id,
            body: msg.message || '',
            date: new Date(msg.created_time).getTime(),
            from: msg.from?.id || 'unknown',
            to: msg.to?.data?.[0]?.id || 'unknown',
            fromName: msg.from?.name || 'Unknown',
            toName: msg.to?.data?.[0]?.name || 'Unknown',
            mediaUrls,
            isIncome: msg.from?.id !== pageId,
            type: 'fb', // or 'insta' as appropriate upstream
          };
        });

        return { messages: formatted, paging };
      },

      async bootstrapConversations(
        pageId: string,
        pageToken: string,
        tenantId: string,
        userId: string,
      ): Promise<BootstrapResult> {
        const BATCH_SIZE = DEFAULT_BATCH_SIZE;

        try {
          let nextPage = `${FB_API_BASE}/${pageId}/conversations?fields=participants,updated_time,messages.limit(1){message,from,created_time}&access_token=${pageToken}`;
          const allConversations: any[] = [];

          while (nextPage) {
            const response = await fetch(nextPage);
            if (!response.ok) {
              throw new Error(`Facebook API error: ${response.statusText}`);
            }
            const data = await response.json();
            allConversations.push(...(data.data || []));
            nextPage = data.paging?.next as string | undefined;
            if (data.paging?.next) {
              await delay(DEFAULT_PAGE_DELAY_MS);
            }
          }

          if (allConversations.length === 0) {
            return {
              success: true,
              total: 0,
              created: 0,
              skipped: 0,
              details: [],
            };
          }

          const processBatch = async (batch: any[]) => {
            const results: any[] = [];
            for (const conversation of batch) {
              try {
                const existing = await strapi.entityService.findMany(
                  'api::conversation.conversation',
                  {
                    filters: {
                      conversationSid: conversation.id,
                      type: 'fb',
                      tenant: { id: tenantId },
                    },
                    limit: 1,
                  },
                );

                if (existing.length === 0) {
                  const participants = conversation.participants?.data || [];
                  const pageAccount = participants[1] || {};
                  const userAccount = participants[0] || {};

                  const newConversation = await strapi.entityService.create(
                    'api::conversation.conversation',
                    {
                      data: {
                        replyTo: pageAccount.name || 'FB',
                        conversationSid: conversation.id,
                        type: 'fb',
                        tenant: tenantId,
                        isAutocreated: true,
                        name: `FB Conversation with ${
                          userAccount.name || 'Unknown'
                        }`,
                        threadId: userAccount.id,
                        user: userId,
                        metaPageId: pageAccount.id,
                      },
                    },
                  );
                  results.push({
                    id: conversation.id,
                    status: 'created',
                    conversationId: newConversation.id,
                  });
                } else {
                  results.push({
                    id: conversation.id,
                    status: 'skipped',
                    reason: 'already_exists',
                  });
                }
              } catch (error) {
                console.error(
                  `Error processing conversation ${conversation.id}:`,
                  error,
                );
                results.push({
                  id: conversation.id,
                  status: 'error',
                  error: error && error.message ? error.message : String(error),
                });
              }
            }
            return results;
          };

          const batchResults = await processInBatches(
            allConversations,
            BATCH_SIZE,
            processBatch,
          );
          const createdCount = batchResults.filter(
            (r) => r.status === 'created',
          ).length;

          return {
            success: true,
            total: allConversations.length,
            created: createdCount,
            skipped: allConversations.length - createdCount,
            details: batchResults,
          };
        } catch (error) {
          console.error('Error in bootstrapConversations:', error);
          throw new errors.ApplicationError(
            'Failed to bootstrap conversations',
            { details: error && error.message ? error.message : String(error) },
          );
        }
      },

      async bootstrapInstagramConversations(
        pageId: string,
        pageToken: string,
        tenantId: string,
        userId: string,
        instaPageId: string,
      ): Promise<BootstrapResult> {
        const BATCH_SIZE = DEFAULT_BATCH_SIZE;

        try {
          let nextPage:
            | string
            | null = `${FB_API_BASE}/${pageId}/conversations?fields=id,updated_time,participants,messages.limit(1){id,from,to,message,created_time}&platform=instagram&access_token=${pageToken}`;
          const allConversations: any[] = [];

          while (nextPage) {
            const response = await fetch(nextPage);
            if (!response.ok) {
              throw new Error(`Facebook API error: ${response.statusText}`);
            }

            const data = await response.json();
            allConversations.push(...(data.data || []));
            nextPage = (data.paging?.next as string) || null;

            if (nextPage) {
              await delay(DEFAULT_PAGE_DELAY_MS);
            }
          }

          if (allConversations.length === 0) {
            strapi.log.info(
              `[Instagram Bootstrap] No conversations found for IG page ${pageId}`,
            );
            return {
              success: true,
              total: 0,
              created: 0,
              skipped: 0,
              details: [],
            };
          }

          const processBatch = async (batch: any[]) => {
            const results: any[] = [];

            for (const conversation of batch) {
              try {
                const existing = await strapi.entityService.findMany(
                  'api::conversation.conversation',
                  {
                    filters: {
                      conversationSid: conversation.id,
                      type: 'insta',
                      tenant: { id: tenantId },
                    },
                    limit: 1,
                  },
                );

                if (existing.length === 0) {
                  const participants = conversation.participants?.data || [];

                  const userAccount = participants[1];

                  const newConversation = await strapi.entityService.create(
                    'api::conversation.conversation',
                    {
                      data: {
                        replyTo:
                          conversation.participants?.data[0].username || 'IG',
                        conversationSid: conversation.id,
                        type: 'insta',
                        tenant: tenantId,
                        isAutocreated: true,
                        name: `Instagram DM with ${
                          userAccount?.username || 'Unknown'
                        }`,
                        threadId: userAccount?.id,
                        user: userId,
                        metaPageId: instaPageId,
                      },
                    },
                  );

                  results.push({
                    id: conversation.id,
                    status: 'created',
                    conversationId: newConversation.id,
                  });
                } else {
                  results.push({
                    id: conversation.id,
                    status: 'skipped',
                    reason: 'already_exists',
                  });
                }
              } catch (error) {
                console.error(
                  `[Instagram Bootstrap] Error processing conversation ${conversation.id}:`,
                  error,
                );
                results.push({
                  id: conversation.id,
                  status: 'error',
                  error: error.message,
                });
              }
            }

            return results;
          };

          const batchResults = await processInBatches(
            allConversations,
            BATCH_SIZE,
            processBatch,
          );

          const createdCount = batchResults.filter(
            (r) => r.status === 'created',
          ).length;

          return {
            success: true,
            total: allConversations.length,
            created: createdCount,
            skipped: allConversations.length - createdCount,
            details: batchResults,
          };
        } catch (error) {
          console.error('[Instagram Bootstrap] Fatal error:', error);
          throw new errors.ApplicationError(
            'Failed to bootstrap Instagram conversations',
            { details: error.message },
          );
        }
      },
      async sendMessage(
        recipientId: string,
        message: string,
        tenantId: number,
        pageId: string,
        mediaUrls?: string[],
      ): Promise<any> {
        const connection = await this.findByTenant(tenantId);
        if (!connection) {
          throw new Error('No Meta connection found for this tenant');
        }
        const pageToken = connection.pages?.find(
          (page: any) => page.pageId === pageId,
        )?.token;
        if (!pageToken) {
          throw new Error('No page token found for this page');
        }

        try {
          if (mediaUrls && mediaUrls.length > 0) {
            const mediaPromises = mediaUrls.map((mediaUrl) =>
              this.metaService.sendMessage(
                recipientId,
                '',
                pageToken,
                mediaUrl,
              ),
            );
            await Promise.all(mediaPromises);
          }

          if (message.trim()) {
            return await this.metaService.sendMessage(
              recipientId,
              message,
              pageToken,
            );
          }

          return { success: true };
        } catch (error) {
          strapi.log.error('Error sending Facebook message:', error);
          const msg =
            error && (error as any).message ? (error as any).message : '';
          if (msg.includes('[FB_OUTSIDE_24H_WINDOW]')) {
            throw error;
          }
          throw new Error(`Failed to send message: ${msg}`);
        }
      },
    };
  },
);
