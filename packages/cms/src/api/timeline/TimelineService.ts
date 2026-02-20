import { ID } from '@strapi/strapi/lib/services/entity-service/types/params/attributes';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import fetch from 'node-fetch';
import path from 'path';
import sanitize from 'sanitize-filename';

const absoluteUrl = process.env.ABSOLUTE_URL;
const backendUrl = process.env.ABSOLUTE_URL;

export type PreparedTimelineChat = {
  externalId: string;
  type: 'wa';
  title?: string;
  phone?: string;
  contactName?: string;
  lastMessageText?: string;
  lastMessageAt?: string;
  raw: any;
};

export type BootstrapDetail = {
  id: string;
  status: 'created' | 'skipped' | 'error';
  conversationId?: string | number;
  reason?: string;
  error?: string;
};
export type BootstrapResult = {
  success: boolean;
  total: number;
  created: number;
  skipped: number;
  details: BootstrapDetail[];
};

export type TimelineChatMessage = {
  uid: string;
  chat_id: number;
  timestamp: string;
  sender_phone?: string | null;
  sender_name?: string | null;
  recipient_phone?: string | null;
  recipient_name?: string | null;
  from_me?: boolean;
  text?: string | null;
  attachment_url?: string | null;
  attachment_filename?: string | null;
  status?: string | null;
  origin?: string | null;
  has_attachment?: boolean;
  message_type?: string | null;
  reactions?: any;
  data?: any;
  created_by?: string | null;
};

export type GetChatMessagesOptions = {
  bearerToken?: string;
  fromMe?: boolean;
  after?: string;
  before?: string;
  afterMessage?: string;
  page?: number;
};

export type ChatMessagesPage = {
  messages: TimelineChatMessage[];
  hasMore: boolean;
  page: number;
};

export class TimelineService {
  private readonly BASE_URL = 'https://app.timelines.ai/integrations/api';
  private readonly TIMEOUT_MS = 15000;
  private readonly token?: string;

  private readonly DEFAULT_BATCH_SIZE = 10;
  private readonly DEFAULT_BATCH_DELAY_MS = Number(
    process.env.TIMELINES_BATCH_DELAY_MS ?? '1500',
  );

  private readonly DEFAULT_WEBHOOK_EVENTS = [
    'chat:new',
    'message:new',
    'whatsapp:account:connected',
    'whatsapp:account:disconnected',
  ];

  constructor(token?: string) {
    this.token = token ?? process.env.TIMELINES_TOKEN;
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async processInBatches<T, R>(
    items: T[],
    batchSize: number,
    processFn: (batch: T[]) => Promise<R[]>,
  ): Promise<R[]> {
    const results: R[] = [];
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      const batchResults = await processFn(batch);
      results.push(...batchResults);
      if (i + batchSize < items.length) {
        await this.delay(this.DEFAULT_BATCH_DELAY_MS);
      }
    }
    return results;
  }

  private mapChatToPrepared(chat: any): PreparedTimelineChat {
    const externalId = String(
      chat?.id || chat?.chat_id || chat?.wa_chat_id || chat?.uuid || '',
    );

    const title =
      chat?.title ||
      chat?.name ||
      chat?.contact_name ||
      chat?.account_name ||
      chat?.phone ||
      undefined;

    const phone =
      chat?.phone || chat?.contact_phone || chat?.wa_phone || undefined;
    const lastMsg =
      chat?.last_message || chat?.lastMessage || chat?.last || undefined;
    const lastMessageText =
      (typeof lastMsg === 'string'
        ? lastMsg
        : lastMsg?.text || lastMsg?.body) || undefined;

    const lastMessageAt =
      lastMsg?.created_at ||
      lastMsg?.timestamp ||
      chat?.updated_at ||
      chat?.last_activity ||
      undefined;

    return {
      externalId,
      type: 'wa',
      title,
      phone,
      contactName: chat?.contact_name || chat?.name || undefined,
      lastMessageText,
      lastMessageAt,
      raw: chat,
    };
  }

  public async sendChatMessage(
    chatId: number | string,
    text: string,
    mediaUrls?: string[],
    opts?: { bearerToken?: string },
  ): Promise<{ success: boolean; id?: string }> {
    const token =
      opts?.bearerToken || this.token || process.env.TIMELINES_TOKEN;
    if (!token) throw new Error('Missing Timelines Bearer token');

    const hasText = typeof text === 'string' && text.trim().length > 0;
    const hasAttachment = Array.isArray(mediaUrls) && mediaUrls.length > 0;
    if (!hasText && !hasAttachment) {
      throw new Error('Text or attachment is required to send a message');
    }

    let fileUid: string | undefined;
    if (hasAttachment) {
      const fileUrl = mediaUrls[0];

      try {
        const { filename, contentType } = await this.prepareFileMetadata(
          fileUrl,
        );

        const uploadRes = await axios.post(
          `${this.BASE_URL}/files`,
          {
            download_url: fileUrl,
            filename,
            content_type: contentType,
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            timeout: this.TIMEOUT_MS,
          },
        );

        fileUid = uploadRes.data?.data?.uid || uploadRes.data?.uid;
        if (!fileUid) {
          throw new Error('Missing uid from Timelines upload response');
        }
      } catch (err: any) {
        const apiMsg = err?.response?.data?.message || err?.message;
        throw new Error(`Failed to upload file to Timelines: ${apiMsg}`);
      }
    }

    const url = `${this.BASE_URL}/chats/${chatId}/messages`;
    const payload: Record<string, any> = {};
    if (hasText) payload.text = text;
    if (fileUid) payload.file_uid = fileUid;

    try {
      const { data } = await axios.post(url, payload, {
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        timeout: this.TIMEOUT_MS,
      });
      const id =
        data?.data?.message_uid ||
        data?.data?.id ||
        data?.data?.uid ||
        data?.message_uid ||
        data?.id ||
        null;

      return { success: true, id: id ? String(id) : undefined };
    } catch (err: any) {
      const apiMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message;
      throw new Error(
        `Timelines send message failed: ${apiMsg || 'Unknown error'}`,
      );
    }
  }

  public async fetchWhatsappAccounts(): Promise<any[]> {
    const token = this.token || process.env.TIMELINES_TOKEN;
    if (!token) {
      throw new Error('Missing Timelines Bearer token');
    }

    const { data } = await axios.get(`${this.BASE_URL}/whatsapp_accounts`, {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const waList = data?.data?.whatsapp_accounts ?? [];
    return Array.isArray(waList) ? waList : [];
  }

  public async initChats(userId: ID): Promise<PreparedTimelineChat[]> {
    const rawChats = await this.fetchChats();

    return rawChats.map((c: any) => this.mapChatToPrepared(c));
  }

  public async fetchChats(bearerToken?: string): Promise<any[]> {
    const token = bearerToken || this.token || process.env.TIMELINES_TOKEN;
    if (!token) {
      throw new Error('Missing Timelines Bearer token');
    }

    const { data } = await axios.get(`${this.BASE_URL}/chats`, {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      timeout: this.TIMEOUT_MS,
    });

    const chats = data?.data?.chats ?? [];
    return Array.isArray(chats) ? chats : [];
  }

  public async fetchChatMessages(
    chatId: number | string,
    opts: GetChatMessagesOptions = {},
  ): Promise<ChatMessagesPage> {
    const token = opts.bearerToken || this.token || process.env.TIMELINES_TOKEN;
    if (!token) throw new Error('Missing Timelines Bearer token');

    const params: Record<string, any> = {};
    if (typeof opts.fromMe === 'boolean') params.from_me = opts.fromMe;
    if (opts.after) params.after = opts.after;
    if (opts.before) params.before = opts.before;
    if (opts.afterMessage) params.after_message = opts.afterMessage;
    if (opts.page && Number.isFinite(opts.page)) params.page = opts.page;

    const url = `${this.BASE_URL}/chats/${chatId}/messages`;
    const { data } = await axios.get(url, {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      params,
      timeout: this.TIMEOUT_MS,
    });

    const messages: TimelineChatMessage[] = data?.data?.messages ?? [];
    const hasMore = Boolean(data?.data?.has_more_pages);
    const page = typeof params.page === 'number' ? params.page : 1;

    return { messages, hasMore, page };
  }

  public async fetchAllChatMessages(
    chatId: number | string,
    opts: GetChatMessagesOptions & { maxPages?: number } = {},
  ): Promise<TimelineChatMessage[]> {
    const aggregated: TimelineChatMessage[] = [];
    let page = Math.max(1, opts.page ?? 1);
    const maxPages = Math.max(1, opts.maxPages ?? Number.MAX_SAFE_INTEGER);

    for (let i = 0; i < maxPages; i++) {
      const pageResult = await this.fetchChatMessages(chatId, {
        ...opts,
        page,
      });
      aggregated.push(...pageResult.messages);
      if (!pageResult.hasMore) break;
      page += 1;
    }

    return aggregated;
  }

  async createWebhookSubscription(
    eventType: string,
    enabled = true,
    tenantId: string,
    endpointUrl?: string,
    opts?: { bearerToken?: string },
  ): Promise<{ success: boolean; status?: number; error?: string }> {
    const token =
      opts?.bearerToken || this.token || process.env.TIMELINES_TOKEN;
    if (!token) throw new Error('Missing Timelines Bearer token');

    const url = `${this.BASE_URL}/webhooks`;
    const base = endpointUrl || `${absoluteUrl}/api/timeline/webhook`;
    const target = `${String(base).replace(/\/$/, '')}/${encodeURIComponent(
      String(tenantId),
    )}`;
    const payload = { event_type: eventType, enabled, url: target } as Record<
      string,
      any
    >;

    try {
      const res = await axios.post(url, payload, {
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        timeout: this.TIMEOUT_MS,
      });
      return { success: true, status: res.status };
    } catch (err: any) {
      const status = err?.response?.status;
      const apiMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message;
      return { success: false, status, error: apiMsg };
    }
  }

  public async ensureDefaultWebhooks(
    enabled = true,
    tenantId: string,
    endpointUrl?: string,
    opts?: { bearerToken?: string },
  ): Promise<{
    created: string[];
    skipped: string[];
    failed: { event: string; error?: string; status?: number }[];
  }> {
    const created: string[] = [];
    const skipped: string[] = [];
    const failed: { event: string; error?: string; status?: number }[] = [];

    const token =
      opts?.bearerToken || this.token || process.env.TIMELINES_TOKEN;
    if (!token) throw new Error('Missing Timelines Bearer token');

    let existing: { event_type: string; url: string }[] = [];
    try {
      const res = await axios.get(`${this.BASE_URL}/webhooks`, {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        timeout: this.TIMEOUT_MS,
      });

      if (res.data?.status === 'ok' && Array.isArray(res.data.data)) {
        existing = res.data.data.map((w: any) => ({
          event_type: w.event_type,
          url: w.url,
        }));
      }
    } catch (err: any) {
      const apiMsg = err?.response?.data?.message || err?.message;
      strapi.log?.warn?.(
        `[Timelines] Failed to fetch existing webhooks: ${apiMsg}`,
      );
    }

    for (const ev of this.DEFAULT_WEBHOOK_EVENTS) {
      const base = endpointUrl || `${absoluteUrl}/api/timeline/webhook`;
      const targetUrl = `${String(base).replace(
        /\/$/,
        '',
      )}/${encodeURIComponent(String(tenantId))}`;

      const alreadyExists = existing.some(
        (hook) => hook.event_type === ev && hook.url === targetUrl,
      );

      if (alreadyExists) {
        skipped.push(ev);
        continue;
      }

      const res = await this.createWebhookSubscription(
        ev,
        enabled,
        tenantId,
        endpointUrl,
        opts,
      );
      if (res.success) {
        created.push(ev);
      } else {
        failed.push({ event: ev, error: res.error, status: res.status });
      }
    }

    return { created, skipped, failed };
  }

  private getFilenameFromUrl(rawUrl: string): string {
    try {
      const base = rawUrl.split('?')[0];
      return sanitize(path.basename(base));
    } catch {
      return `file-${Date.now()}`;
    }
  }

  private contentTypeFromExt(ext: string): string | null {
    const e = ext.toLowerCase();
    const map: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
      '.bmp': 'image/bmp',
      '.heic': 'image/heic',
      '.heif': 'image/heif',
      '.mp4': 'video/mp4',
      '.webm': 'video/webm',
      '.ogg': 'video/ogg',
      '.mov': 'video/quicktime',
      '.pdf': 'application/pdf',
      '.txt': 'text/plain',
      '.csv': 'text/csv',
      '.zip': 'application/zip',
      '.json': 'application/json',
    };
    return map[e] || null;
  }

  private extFromContentType(ct: string): string | null {
    const c = ct.toLowerCase();
    const map: Record<string, string> = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/gif': '.gif',
      'image/webp': '.webp',
      'image/svg+xml': '.svg',
      'image/bmp': '.bmp',
      'image/heic': '.heic',
      'image/heif': '.heif',
      'video/mp4': '.mp4',
      'video/webm': '.webm',
      'video/ogg': '.ogg',
      'video/quicktime': '.mov',
      'application/pdf': '.pdf',
      'text/plain': '.txt',
      'text/csv': '.csv',
      'application/zip': '.zip',
      'application/json': '.json',
    };
    return map[c] || null;
  }

  private async prepareFileMetadata(
    fileUrl: string,
  ): Promise<{ filename: string; contentType: string }> {
    let filename = this.getFilenameFromUrl(fileUrl);
    let contentType: string | null = null;

    try {
      const head = await fetch(fileUrl, { method: 'HEAD' } as any);
      if (head.ok) {
        const ct = head.headers.get('content-type');
        if (ct && typeof ct === 'string') contentType = ct;
        const cd = head.headers.get('content-disposition') || '';
        const match = /filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i.exec(
          cd,
        );
        const rawName = (match && (match[1] || match[2])) || null;
        if (rawName) {
          const decoded = sanitize(decodeURIComponent(rawName));
          if (decoded) filename = decoded;
        }
      }
    } catch (e) {
      console.log(e);
    }

    if (!contentType) {
      const ext =
        path.extname(filename || '') ||
        path.extname(fileUrl.split('?')[0] || '');
      const inferred = this.contentTypeFromExt(ext || '');
      contentType = inferred || 'application/octet-stream';
    }

    if (!path.extname(filename)) {
      const ext2 = this.extFromContentType(contentType);
      if (ext2) filename = `${filename}${ext2}`;
    }

    return { filename, contentType };
  }

  public async fetchWebhooks() {
    const res = await axios.get(`${this.BASE_URL}/webhooks`, {
      headers: { Authorization: `Bearer ${this.token}` },
    });
    return res.data;
  }

  public async deleteWebhook(webhookId: string | number, token: string) {
    return axios.delete(`${this.BASE_URL}/webhooks/${webhookId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  public async getUploadedMediaUrl(
    mediaUrl: string,
    ctx: Graphql.ResolverContext,
  ): Promise<string | null> {
    const filename = this.getFilenameFromUrl(mediaUrl);
    const queryUrl = `${backendUrl}/api/upload/files?filters[name][$eq]=${encodeURIComponent(
      filename,
    )}&sort=updatedAt:desc`;
    const res = await fetch(queryUrl, {
      headers: { Authorization: ctx.koaContext.request.headers.authorization },
    });
    if (!res.ok) return null;
    const files = await res.json();
    if (Array.isArray(files) && files.length > 0) {
      const latest = files[0];
      return latest?.url || null;
    }
    return null;
  }

  public async isTimelineMediaUploaded(
    mediaUrl: string,
    ctx: Graphql.ResolverContext,
  ): Promise<boolean> {
    const filename = this.getFilenameFromUrl(mediaUrl);
    let remoteSizeBytes: number | null = null;
    try {
      const head = await fetch(mediaUrl, { method: 'HEAD' } as any);
      if (head.ok) {
        const len = head.headers.get('content-length');
        if (len) remoteSizeBytes = Number(len);
      }
    } catch (e) {
      console.log(e);
    }

    const queryUrl = `${backendUrl}/api/upload/files?filters[name][$eq]=${encodeURIComponent(
      filename,
    )}&sort=updatedAt:desc`;
    const res = await fetch(queryUrl, {
      headers: { Authorization: ctx.koaContext.request.headers.authorization },
    });
    if (!res.ok) return false;
    const files = await res.json();
    if (!Array.isArray(files) || files.length === 0) return false;

    if (remoteSizeBytes == null) {
      return false;
    }

    const latest = files[0];
    const storedKb = Number(latest?.size); // Strapi stores size in KB
    const storedBytes = Number.isFinite(storedKb) ? storedKb * 1024 : NaN;
    if (!Number.isFinite(storedBytes)) return false;

    const tolerance = 2 * 1024;
    return Math.abs(storedBytes - remoteSizeBytes) <= tolerance;
  }

  public async uploadTimelineMedia(
    mediaUrl: string,
    ctx: Graphql.ResolverContext,
  ): Promise<string | null> {
    const base = this.getFilenameFromUrl(mediaUrl);
    const ext = path.extname(base);
    const nameOnly = ext ? base.slice(0, -ext.length) : base;
    const unique = `${nameOnly}-${Date.now()}${ext || ''}`;

    const tmpPath = `/tmp/${unique}`;
    try {
      const resp = await fetch(mediaUrl);
      if (!resp.ok) return null;
      const buffer = await resp.buffer();
      fs.writeFileSync(tmpPath, buffer);

      const form = new FormData();
      form.append('files', fs.createReadStream(tmpPath), {
        filename: unique,
        contentType: resp.headers.get('content-type') || undefined,
      });

      const uploadRes = await fetch(`${backendUrl}/api/upload`, {
        method: 'POST',
        body: form as any,
        headers: {
          Authorization: ctx.koaContext.request.headers.authorization,
        },
      });
      if (!uploadRes.ok) return null;
      const uploaded = await uploadRes.json();
      return uploaded?.[0]?.url || null;
    } catch (e) {
      return null;
    } finally {
      try {
        if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
      } catch {
        console.log('error');
      }
    }
  }

  public async uploadChatsToStrapi(
    tenantId: string | number,
    userId: string | number,
    opts?: { batchSize?: number },
  ): Promise<BootstrapResult> {
    const prepared = await this.initChats(userId as ID);

    if (!prepared.length) {
      return { success: true, total: 0, created: 0, skipped: 0, details: [] };
    }

    const batchSize = Math.max(1, opts?.batchSize ?? this.DEFAULT_BATCH_SIZE);

    const processBatch = async (batch: PreparedTimelineChat[]) => {
      const results: BootstrapDetail[] = [];

      for (const chat of batch) {
        try {
          const existing = await strapi.entityService.findMany(
            'api::conversation.conversation',
            {
              filters: {
                conversationSid: chat.externalId,
                type: 'wa',
                tenant: { id: tenantId as ID },
              },
              limit: 1,
            },
          );

          if ((existing as any[]).length === 0) {
            const name =
              chat.title ||
              chat.contactName ||
              chat.phone ||
              'WhatsApp Conversation';
            const created = await strapi.entityService.create(
              'api::conversation.conversation',
              {
                data: {
                  replyTo: `${chat.phone || 'WhatsApp'}`,
                  conversationSid: chat.externalId,
                  type: 'wa',
                  tenant: tenantId as ID,
                  isAutocreated: true,
                  name,
                  threadId: chat.raw.whatsapp_account_id,
                  user: userId as ID,
                },
              },
            );

            results.push({
              id: chat.externalId,
              status: 'created',
              conversationId: created.id,
            });
          } else {
            results.push({
              id: chat.externalId,
              status: 'skipped',
              reason: 'already_exists',
            });
          }
        } catch (error) {
          strapi.log?.error?.(
            '[Timelines Upload] Error processing chat',
            chat?.externalId,
            error,
          );
          results.push({
            id: String(chat?.externalId || ''),
            status: 'error',
            error: error?.message || String(error),
          });
        }
      }

      return results;
    };

    const details = await this.processInBatches(
      prepared,
      batchSize,
      processBatch,
    );
    const createdCount = details.filter((d) => d.status === 'created').length;

    return {
      success: true,
      total: prepared.length,
      created: createdCount,
      skipped: prepared.length - createdCount,
      details,
    };
  }
}
