import { MeiliSearch } from 'meilisearch';

const MEILISEARCH_HOST =
  process.env.MEILISEARCH_HOST || 'http://localhost:7700';
const MEILISEARCH_API_KEY = process.env.MEILISEARCH_API_KEY || 'masterKey';

export const meilisearchClient = new MeiliSearch({
  host: MEILISEARCH_HOST,
  apiKey: MEILISEARCH_API_KEY,
});

export const MEILISEARCH_INDEXES = {
  CONTACT: 'contacts',
  COMPANY: 'companies',
  DEAL: 'deals',
  PRODUCT: 'products',
  TASK: 'tasks',
  SERVICE: 'services',
  COMPOSITE_PRODUCT: 'composite_products',
  TRANSACTION: 'transactions',
  ORDER: 'orders',
};

export function getTaskUid(task: any): number | null {
  if (!task) return null;

  return (
    task.taskUid ||
    task.uid ||
    (task.enqueuedTask && task.enqueuedTask.taskUid) ||
    null
  );
}

function getIndexSettings(entityType: string) {
  const common = {
    filterableAttributes: ['tenantId', 'businessLocationIds'],
    sortableAttributes: ['customCreationDate'],
    rankingRules: [
      'sort',
      'words',
      'typo',
      'proximity',
      'attribute',
      'exactness',
    ],
  };

  const map = {
    CONTACT: {
      ...common,
      filterableAttributes: ['tenantId', 'businessLocationIds', 'phoneNumber'],
      searchableAttributes: ['fullName', 'email', 'phoneNumber'],
      displayedAttributes: [
        'id',
        'uuid',
        'fullName',
        'email',
        'phoneNumber',
        'tenantId',
      ],
    },
    COMPANY: {
      ...common,
      filterableAttributes: ['tenantId', 'businessLocationIds', 'phoneNumber'],
      searchableAttributes: ['name', 'email', 'phoneNumber'],
      displayedAttributes: [
        'id',
        'uuid',
        'name',
        'email',
        'phoneNumber',
        'tenantId',
      ],
    },
    DEAL: {
      ...common,
      searchableAttributes: ['name', 'contactFullName'],
      displayedAttributes: [
        'id',
        'uuid',
        'name',
        'contactFullName',
        'tenantId',
      ],
    },
    PRODUCT: {
      ...common,
      searchableAttributes: [
        'name',
        'SKU',
        'barcode',
        'model',
        'UPC',
        'MPN',
        'productId',
      ],
      displayedAttributes: [
        'id',
        'uuid',
        'name',
        'SKU',
        'barcode',
        'model',
        'UPC',
        'MPN',
        'productId',
        'defaultPrice',
        'tenantId',
        'businessLocationIds',
      ],
    },
    ORDER: {
      ...common,
      filterableAttributes: [
        'tenantId',
        'businessLocationIds',
        'contactPhoneNumber',
      ],
      searchableAttributes: [
        'orderId',
        'contactFullName',
        'contactPhoneNumber',
        'companyName',
        'productNames',
        'productIds',
        'memoNumber',
        'inputInvoiceNum',
        'repairTicketNumber',
      ],
      displayedAttributes: [
        'id',
        'uuid',
        'orderId',
        'contactFullName',
        'contactPhoneNumber',
        'companyName',
        'productNames',
        'productIds',
        'customCreationDate',
        'memoNumber',
        'inputInvoiceNum',
        'repairTicketNumber',
        'type',
        'tenantId',
        'businessLocationIds',
      ],
    },
    TASK: {
      ...common,
      filterableAttributes: [
        'tenantId',
        'businessLocationIds',
        'contactPhoneNumber',
      ],
      searchableAttributes: [
        'contactFullName',
        'contactEmail',
        'contactPhoneNumber',
        'repairTicketNumber',
        'orderId',
        'notes',
      ],
      displayedAttributes: [
        'id',
        'uuid',
        'name',
        'contactFullName',
        'contactEmail',
        'contactPhoneNumber',
        'repairTicketNumber',
        'orderId',
        'notes',
        'tenantId',
        'businessLocationIds',
      ],
    },
    TRANSACTION: {
      ...common,
      searchableAttributes: ['dealTransactionId', 'orderId'],
      displayedAttributes: [
        'id',
        'uuid',
        'dealTransactionId',
        'orderId',
        'tenantId',
        'businessLocationIds',
      ],
    },
    SERVICE: {
      ...common,
      searchableAttributes: ['name', 'serviceId'],
      displayedAttributes: [
        'id',
        'uuid',
        'name',
        'serviceId',
        'defaultPrice',
        'tenantId',
        'businessLocationIds',
      ],
    },
    COMPOSITE_PRODUCT: {
      ...common,
      searchableAttributes: ['name', 'code'],
      displayedAttributes: [
        'id',
        'uuid',
        'name',
        'code',
        'active',
        'defaultPrice',
        'tenantId',
        'businessLocationIds',
      ],
    },
  };

  return map[entityType] || common;
}

export async function configureSingleIndex(entityType: string) {
  const indexName =
    MEILISEARCH_INDEXES[entityType as keyof typeof MEILISEARCH_INDEXES];
  if (!indexName) {
    throw new Error(`Unknown entity type: ${entityType}`);
  }

  const index = meilisearchClient.index(indexName);

  try {
    const delTask = await meilisearchClient.deleteIndexIfExists(indexName);
    const delUid = getTaskUid(delTask);
    if (delUid) await meilisearchClient.tasks.waitForTask(delUid);
  } catch {
    /* empty */
  }

  const createTask = await meilisearchClient.createIndex(indexName, {
    primaryKey: 'id',
  });
  const createUid = getTaskUid(createTask);
  if (createUid) await meilisearchClient.tasks.waitForTask(createUid);

  const settings = getIndexSettings(entityType);
  const settingsTask = await index.updateSettings(settings);
  const settingsUid = getTaskUid(settingsTask);
  if (settingsUid) await meilisearchClient.tasks.waitForTask(settingsUid);
}

export async function configureMeiliSearchIndexes() {
  for (const [entityType] of Object.entries(MEILISEARCH_INDEXES)) {
    await configureSingleIndex(entityType);
  }
}

export async function updateIndexSettings(entityType: string) {
  const indexName =
    MEILISEARCH_INDEXES[entityType as keyof typeof MEILISEARCH_INDEXES];
  if (!indexName) {
    throw new Error(`Unknown entity type: ${entityType}`);
  }

  const index = meilisearchClient.index(indexName);
  const settings = getIndexSettings(entityType);
  const settingsTask = await index.updateSettings(settings);
  const settingsUid = getTaskUid(settingsTask);
  if (settingsUid) await meilisearchClient.tasks.waitForTask(settingsUid);
}
