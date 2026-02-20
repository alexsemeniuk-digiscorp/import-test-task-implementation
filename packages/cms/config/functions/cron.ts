import { updateProductInventoryRecordsAge } from './cronTasks/updateProductInventoryRecordsAge';

export default {
  '0 2 * * *': updateProductInventoryRecordsAge,
} as Record<string, ({ strapi }: { strapi: Strapi.Strapi }) => void>;
