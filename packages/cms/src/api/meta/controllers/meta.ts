import { MetaService } from '../MetaService';

const metaAppId = process.env.META_APP_ID;
const absoluteUrl = process.env.ABSOLUTE_URL;
const metaAppSecret = process.env.META_APP_SECRET;

export default {
  async webhook(ctx) {
    if (ctx.request.method === 'GET') {
      const mode = ctx.request.query['hub.mode'];
      const token = ctx.request.query['hub.verify_token'];
      const challenge = ctx.request.query['hub.challenge'];

      if (mode === 'subscribe' && token === absoluteUrl) {
        ctx.status = 200;
        ctx.body = challenge;
        return;
      } else {
        console.error('Webhook verification failed');
        ctx.status = 403;
        return;
      }
    }

    if (ctx.request.method === 'POST') {
      if (
        (ctx.request.body.object === 'page' ||
          ctx.request.body.object === 'instagram') &&
        Array.isArray(ctx.request.body.entry)
      ) {
        try {
          const metaService = new MetaService();
          await metaService.handleIncomingMessaging(ctx.request.body);
          ctx.status = 200;
          ctx.body = 'EVENT_RECEIVED';
          return;
        } catch (error) {
          strapi.log.error('Error processing Facebook webhook:', error);
          ctx.status = 500;
          ctx.body = 'Error processing webhook';
          return;
        }
      }

      ctx.status = 200;
      ctx.body = 'IGNORED';
      return;
    }
  },
  async callback(ctx) {
    const { code, state: stateString } = ctx.request.query as any;
    const service = new MetaService();
    await service.handleOAuthCallback(ctx, {
      code: String(code || ''),
      stateString: String(stateString || ''),
      absoluteUrl,
      metaAppId,
      metaAppSecret,
    });
  },
};
