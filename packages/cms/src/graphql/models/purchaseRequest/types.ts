import { ID } from '@strapi/strapi/lib/services/entity-service/types/params/attributes';

export type SendPurchaseRequestInput = {
  id: ID;
  email?: string;
  subject?: string;
  body?: string;
  fileUrl?: string;
  contactId?: ID;
  phone?: string;
  sendBySms?: boolean;
  sendByEmail?: boolean;
  customSmsContactContent?: string;
  customSmsSubjectContent?: string;
};
