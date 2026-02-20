import { ContactMutations, ContactQueries, ContactResolvers } from './contact';
import {
  DealTransactionMutation,
  DealTransactionQueries,
} from './dealTransaction';
import { DownloadRecordMutations } from './downloadRecord';
import { FileItemResolvers } from './fileItem';
import { InvoiceMutations } from './invoice';
import { MembershipOrderItemResolvers } from './membershipOrderItem';
import { OrderMutations, OrderQueries, OrdersResolvers } from './order';
import { ProductMutations, ProductQueries, ProductResolvers } from './product';
import {
  ProductInventoryItemQueries,
  ProductInventoryItemResolvers,
} from './productInventoryItem';
import { ProductOrderItemResolvers } from './productOrderItem';
import { PurchaseRequestMutations } from './purchaseRequest';
import { SendDocumentMutations } from './sendDocument';
import { ServiceOrderItemResolvers } from './serviceOrderItem';
import { ServicePerformerQueries } from './servicePerformer';
import { UploadFilesMutation, UploadResolvers } from './uploadFile';
import { UserMutations, UserQueries, UserResolvers } from './user';

import { CompanyMutations, CompanyResolvers } from './company';
import { CrmAdditionalAddressResolvers } from './crm-additional-address';
import { CrmAdditionalEmailResolvers } from './crm-additional-email';
import { CrmAdditionalPhoneNumberResolvers } from './crm-additional-phone-number';
import { formResolvers } from './form';
import { InventoryAdjustmentItemMutations } from './inventoryAdjustmentItem';
import {
  InventoryAuditMutations,
  InventoryAuditQueries,
  InventoryAuditResolvers,
} from './inventoryAudit';
import { InventoryAuditItemQueries } from './inventoryAuditItem';
import { invoiceShippingContactResolvers } from './invoice-shipping-contact';
import { LeadResolvers } from './lead';
import {
  ProductInventoryItemRecordQueries,
  ProductInventoryItemRecordResolvers,
} from './productInventoryItemRecord';
import { purchaseRequestShippingInfoResolvers } from './purchase-request-shipping-info';
import { sessionsResolvers } from './sessions';
import { shipmentCardResolvers } from './shipment-card';
import { tenantResolvers } from './tenant';

const Query = {
  ...UserQueries,
  ...DealTransactionQueries,
  ...FileItemResolvers,
  ...ProductQueries,
  ...ProductInventoryItemQueries,
  ...ServicePerformerQueries,
  ...OrderQueries,
  ...InventoryAuditItemQueries,
  ...ContactQueries,
  ...ProductInventoryItemRecordQueries,
  ...InventoryAuditQueries,
};

const Mutation = {
  ...SendDocumentMutations,
  ...UserMutations,
  ...OrderMutations,
  ...InvoiceMutations,
  ...DownloadRecordMutations,
  ...ContactMutations,
  ...DealTransactionMutation,
  ...ProductMutations,
  ...PurchaseRequestMutations,
  ...UploadFilesMutation,
  ...InventoryAdjustmentItemMutations,
  ...InventoryAuditMutations,
  ...CompanyMutations,
};

const UploadFile = {
  ...UploadResolvers,
};

const UsersPermissionsUser = {
  ...UserResolvers,
};

const Product = {
  ...ProductResolvers,
};

const ProductInventoryItem = {
  ...ProductInventoryItemResolvers,
};

const InvtItmRecord = {
  ...ProductInventoryItemRecordResolvers,
};

const Contact = {
  ...ContactResolvers,
};

const ProductOrderItem = {
  ...ProductOrderItemResolvers,
};

const Order = {
  ...OrdersResolvers,
};

const ServiceOrderItem = {
  ...ServiceOrderItemResolvers,
};

const MembershipOrderItem = {
  ...MembershipOrderItemResolvers,
};

const CrmAdditionalAddress = {
  ...CrmAdditionalAddressResolvers,
};

const CrmAdditionalEmail = {
  ...CrmAdditionalEmailResolvers,
};

const CrmAdditionalPhoneNumber = {
  ...CrmAdditionalPhoneNumberResolvers,
};

const Company = {
  ...CompanyResolvers,
};

const Lead = {
  ...LeadResolvers,
};

const PurchaseRequestShippingInfo = {
  ...purchaseRequestShippingInfoResolvers,
};

const InvoiceShippingContact = {
  ...invoiceShippingContactResolvers,
};

const ShipmentCard = {
  ...shipmentCardResolvers,
};

const Form = {
  ...formResolvers,
};

const Tenant = {
  ...tenantResolvers,
};

const Sessions = {
  ...sessionsResolvers,
};

const InventoryAudit = {
  ...InventoryAuditResolvers,
};

export const resolvers = {
  Query,
  Mutation,
  UploadFile,
  UsersPermissionsUser,
  Product,
  Order,
  Contact,
  ProductOrderItem,
  ServiceOrderItem,
  MembershipOrderItem,
  ProductInventoryItem,
  InvtItmRecord,
  CrmAdditionalAddress,
  CrmAdditionalEmail,
  CrmAdditionalPhoneNumber,
  Lead,
  Company,
  PurchaseRequestShippingInfo,
  InvoiceShippingContact,
  ShipmentCard,
  Form,
  Tenant,
  Sessions,
  InventoryAudit,
};
