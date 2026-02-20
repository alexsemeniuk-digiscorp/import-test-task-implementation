import { companySchema } from './company';
import { contactSchema } from './contact';
import { crmAdditionalAddressSchema } from './crm-additional-address';
import { crmAdditionalEmailSchema } from './crm-additional-email';
import { crmAdditionalPhoneNumberSchema } from './crm-additional-phone-number';
import { dealTransactionSchema } from './dealTransaction';
import { downloadRecordSchema } from './downloadRecord';
import { fileItemSchema } from './fileItem';
import { formSchema } from './form';
import { inventoryAdjustmentItemSchema } from './inventoryAdjustmentItem';
import { inventoryAuditSchema } from './inventoryAudit';
import { inventoryAuditItemSchema } from './inventoryAuditItem';
import { invoiceSchema } from './invoice';
import { invoiceShippingContactSchema } from './invoice-shipping-contact';
import { leadSchema } from './lead';
import { membershipOrderItemSchema } from './membershipOrderItem/';
import { orderSchema } from './order';
import { productSchema } from './product';
import { productInventoryItemSchema } from './productInventoryItem';
import { productInventoryItemRecordSchema } from './productInventoryItemRecord';
import { productOrderItemSchema } from './productOrderItem';
import { purchaseRequestShippingInfoSchema } from './purchase-request-shipping-info';
import { purchaseRequestSchema } from './purchaseRequest';
import { sendDocumentSchema } from './sendDocument';
import { serviceOrderItemSchema } from './serviceOrderItem';
import { servicePerformerSchema } from './servicePerformer';
import { sessionsSchema } from './sessions';
import { shipmentCardSchema } from './shipment-card';
import { tenantSchema } from './tenant';
import { uploadFileSchema } from './uploadFile';
import { userSchema } from './user';

export const schema = [
  ...inventoryAuditSchema,
  ...companySchema,
  ...sendDocumentSchema,
  ...dealTransactionSchema,
  ...contactSchema,
  ...crmAdditionalAddressSchema,
  ...crmAdditionalEmailSchema,
  ...crmAdditionalPhoneNumberSchema,
  ...fileItemSchema,
  ...downloadRecordSchema,
  ...orderSchema,
  ...productInventoryItemSchema,
  ...productSchema,
  ...servicePerformerSchema,
  ...userSchema,
  ...productOrderItemSchema,
  ...serviceOrderItemSchema,
  ...membershipOrderItemSchema,
  ...invoiceSchema,
  ...uploadFileSchema,
  ...inventoryAuditItemSchema,
  ...inventoryAdjustmentItemSchema,
  ...productInventoryItemRecordSchema,
  ...purchaseRequestSchema,
  ...leadSchema,
  ...purchaseRequestShippingInfoSchema,
  ...invoiceShippingContactSchema,
  ...shipmentCardSchema,
  ...formSchema,
  ...tenantSchema,
  ...sessionsSchema,
];
