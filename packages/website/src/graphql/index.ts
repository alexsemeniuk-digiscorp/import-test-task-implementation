import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;

      export type PossibleTypesResultData = {
  "possibleTypes": {
    "FindSlugResponse": [
      "TenantEntityResponse"
    ],
    "GenericMorph": [
      "AccProductMapping",
      "AccServiceBill",
      "AccServiceConn",
      "AccServiceContact",
      "AccServiceEntity",
      "AccServiceFile",
      "AccServiceOrder",
      "AccServiceTax",
      "AccServiceTaxagn",
      "AccServiceTrack",
      "AccServiceTxn",
      "AccServiceVendor",
      "Activity",
      "Appraisal",
      "ApprovalMethod",
      "Article",
      "AuthLayout",
      "Backing",
      "BoxPaper",
      "BulkImagesNotify",
      "BusinessLocation",
      "Call",
      "Campaign",
      "CampaignEnrolledContact",
      "CampaignEnrolledLead",
      "Carrier",
      "ChartAccount",
      "ChartCategory",
      "ChartSubcategory",
      "ChatNotification",
      "Class",
      "ClassLocationInfo",
      "ClassOrderItem",
      "ClassPerformer",
      "ClearentOnboarding",
      "ClearentTerminal",
      "Company",
      "CompanySetting",
      "ComponentDataAiPrompt",
      "ComponentDataBoughtCondition",
      "ComponentDataBulkProductsAiPrompt",
      "ComponentDataCellValue",
      "ComponentDataConnection",
      "ComponentDataEntry",
      "ComponentDataGeometry",
      "ComponentDataGraphItem",
      "ComponentDataMessage",
      "ComponentDataPage",
      "ComponentDataScheduledMessage",
      "ComponentDataSet",
      "ComponentDataStyle",
      "ComponentUiAuthContent",
      "ComponentUiCard",
      "ComponentUiCustomerReviewSection",
      "ComponentUiExtendedSection",
      "ComponentUiGrid",
      "ComponentUiHeadline",
      "ComponentUiLink",
      "ComponentUiParagraph",
      "ComponentUiProductTypesVisibility",
      "ComponentUiReviewCard",
      "ComponentUiSection",
      "ComponentUiSectionsVisibility",
      "ComponentUiShipmentCost",
      "ComponentUiTab",
      "ComponentUiText",
      "ComponentUiWebsiteContacts",
      "ComponentUiWorkingHours",
      "CompositeProduct",
      "CompositeProductItemInfo",
      "CompositeProductLocationInfo",
      "CompositeProductOrderItem",
      "ConditionType",
      "Contact",
      "ContactSetting",
      "ContactTitle",
      "Contract",
      "ContractTemplate",
      "Conversation",
      "Country",
      "CrmAdditionalAddress",
      "CrmAdditionalEmail",
      "CrmAdditionalPhoneNumber",
      "CrmCustomFieldName",
      "CrmCustomFieldValue",
      "CrmRelation",
      "CrmRelationType",
      "CustomPermission",
      "Deal",
      "DealSetting",
      "DealTransaction",
      "DealTransactionReminder",
      "DefaultImportingFile",
      "DefaultPdfTemplate",
      "DesignStyle",
      "Dimension",
      "Discount",
      "DiscountUsageEvent",
      "DocumentPermission",
      "DownloadRecord",
      "EcommerceAuthenticationService",
      "EcommerceContactService",
      "EcommerceCustomAppService",
      "EcommerceDetail",
      "EcommerceProductService",
      "EmailDesignerEmailTemplate",
      "EngravingType",
      "EnrolledContactCondition",
      "EnrolledLeadCondition",
      "Estimate",
      "EstimateShippingContact",
      "ExceededService",
      "FileItem",
      "Form",
      "FormTemplate",
      "GenderType",
      "GmCommission",
      "Home",
      "ImportingSession",
      "InventoryAdjustment",
      "InventoryAdjustmentItem",
      "InventoryAudit",
      "InventoryAuditItem",
      "InventoryQuantityNotification",
      "InventorySerialize",
      "Invoice",
      "InvoiceShippingContact",
      "InvtCmpAttr",
      "InvtCmpAttrOpt",
      "InvtCmpColor",
      "InvtCmpSize",
      "InvtCmpTrck",
      "InvtCmpTrckItm",
      "InvtItmRecord",
      "ItemCategory",
      "JewelryProduct",
      "JewelryProductType",
      "KnotStyle",
      "Layout",
      "Lead",
      "LinkStyle",
      "LinkType",
      "LocalizationSetting",
      "Location",
      "MailTemplate",
      "Maintenance",
      "MaintenanceEvent",
      "MaintenanceQuantityNotification",
      "ManufacturingProcess",
      "MarketingCustomersReport",
      "MarketingEmailTemplate",
      "MaterialGrade",
      "Membership",
      "MembershipItem",
      "MembershipOrderItem",
      "MetaConnection",
      "MetalFinishType",
      "MetalType",
      "Note",
      "NotificationMethod",
      "NotificationsNylasGrantExpire",
      "NylasConnection",
      "Onboarding",
      "OnboardingUser",
      "Order",
      "OrderSetting",
      "OrderStatusNotification",
      "PayRate",
      "PaymentMethod",
      "PdfCatalogFile",
      "PdfTemplate",
      "Piece",
      "Platform",
      "PlattingType",
      "Product",
      "ProductAttribute",
      "ProductAttributeOption",
      "ProductBrand",
      "ProductGroup",
      "ProductGroupAttribute",
      "ProductGroupAttributeOption",
      "ProductGroupItem",
      "ProductInventoryItem",
      "ProductInventoryItemEvent",
      "ProductOrderItem",
      "ProductSetting",
      "ProductType",
      "PublicContract",
      "PublicForm",
      "PurchaseRequest",
      "PurchaseRequestShippingInfo",
      "QuantityDifferenceType",
      "Question",
      "QuickPaySetting",
      "Rate",
      "ReactIconsIconlibrary",
      "RentableData",
      "ReportsSchedule",
      "Resource",
      "ResourceCount",
      "ResourceInventoryItem",
      "Return",
      "ReturnItem",
      "ReturnMethod",
      "ReturnStatus",
      "Review",
      "SalesCommission",
      "SalesItemReport",
      "SchedulingAppointment",
      "SchedulingRecurrence",
      "SequenceStep",
      "SequenceStepInfo",
      "Service",
      "ServiceLocationInfo",
      "ServiceOrderItem",
      "ServicePerformer",
      "ServiceSetting",
      "Sessions",
      "SettingNotification",
      "SettingsChat",
      "SettingsTask",
      "ShankStyle",
      "Shipment",
      "ShipmentCard",
      "ShipmentCarrier",
      "ShipmentPackage",
      "ShippingMethod",
      "Size",
      "SlugifySlug",
      "SpecificType",
      "StagingLog",
      "Strand",
      "StrandsLength",
      "StripeOnboarding",
      "StripePlanCategory",
      "StripeSubscriptionPlan",
      "Sublocation",
      "SublocationItem",
      "Task",
      "TaskLocation",
      "TaskStage",
      "TaskType",
      "Tax",
      "TaxAuthority",
      "TaxCollection",
      "TaxReport",
      "Tenant",
      "TenantCreditHistory",
      "TenantStripeSubscription",
      "TimePeriod",
      "TimeTracker",
      "TimelineConnection",
      "Todo",
      "Transaction",
      "TransferOrder",
      "TransferOrderItem",
      "TwilioConnection",
      "UploadFile",
      "UploadFolder",
      "Usage",
      "UserNotification",
      "UsersPermissionsPermission",
      "UsersPermissionsRole",
      "UsersPermissionsUser",
      "Website",
      "Weight",
      "ZapierWebhook"
    ]
  }
};
      const result: PossibleTypesResultData = {
  "possibleTypes": {
    "FindSlugResponse": [
      "TenantEntityResponse"
    ],
    "GenericMorph": [
      "AccProductMapping",
      "AccServiceBill",
      "AccServiceConn",
      "AccServiceContact",
      "AccServiceEntity",
      "AccServiceFile",
      "AccServiceOrder",
      "AccServiceTax",
      "AccServiceTaxagn",
      "AccServiceTrack",
      "AccServiceTxn",
      "AccServiceVendor",
      "Activity",
      "Appraisal",
      "ApprovalMethod",
      "Article",
      "AuthLayout",
      "Backing",
      "BoxPaper",
      "BulkImagesNotify",
      "BusinessLocation",
      "Call",
      "Campaign",
      "CampaignEnrolledContact",
      "CampaignEnrolledLead",
      "Carrier",
      "ChartAccount",
      "ChartCategory",
      "ChartSubcategory",
      "ChatNotification",
      "Class",
      "ClassLocationInfo",
      "ClassOrderItem",
      "ClassPerformer",
      "ClearentOnboarding",
      "ClearentTerminal",
      "Company",
      "CompanySetting",
      "ComponentDataAiPrompt",
      "ComponentDataBoughtCondition",
      "ComponentDataBulkProductsAiPrompt",
      "ComponentDataCellValue",
      "ComponentDataConnection",
      "ComponentDataEntry",
      "ComponentDataGeometry",
      "ComponentDataGraphItem",
      "ComponentDataMessage",
      "ComponentDataPage",
      "ComponentDataScheduledMessage",
      "ComponentDataSet",
      "ComponentDataStyle",
      "ComponentUiAuthContent",
      "ComponentUiCard",
      "ComponentUiCustomerReviewSection",
      "ComponentUiExtendedSection",
      "ComponentUiGrid",
      "ComponentUiHeadline",
      "ComponentUiLink",
      "ComponentUiParagraph",
      "ComponentUiProductTypesVisibility",
      "ComponentUiReviewCard",
      "ComponentUiSection",
      "ComponentUiSectionsVisibility",
      "ComponentUiShipmentCost",
      "ComponentUiTab",
      "ComponentUiText",
      "ComponentUiWebsiteContacts",
      "ComponentUiWorkingHours",
      "CompositeProduct",
      "CompositeProductItemInfo",
      "CompositeProductLocationInfo",
      "CompositeProductOrderItem",
      "ConditionType",
      "Contact",
      "ContactSetting",
      "ContactTitle",
      "Contract",
      "ContractTemplate",
      "Conversation",
      "Country",
      "CrmAdditionalAddress",
      "CrmAdditionalEmail",
      "CrmAdditionalPhoneNumber",
      "CrmCustomFieldName",
      "CrmCustomFieldValue",
      "CrmRelation",
      "CrmRelationType",
      "CustomPermission",
      "Deal",
      "DealSetting",
      "DealTransaction",
      "DealTransactionReminder",
      "DefaultImportingFile",
      "DefaultPdfTemplate",
      "DesignStyle",
      "Dimension",
      "Discount",
      "DiscountUsageEvent",
      "DocumentPermission",
      "DownloadRecord",
      "EcommerceAuthenticationService",
      "EcommerceContactService",
      "EcommerceCustomAppService",
      "EcommerceDetail",
      "EcommerceProductService",
      "EmailDesignerEmailTemplate",
      "EngravingType",
      "EnrolledContactCondition",
      "EnrolledLeadCondition",
      "Estimate",
      "EstimateShippingContact",
      "ExceededService",
      "FileItem",
      "Form",
      "FormTemplate",
      "GenderType",
      "GmCommission",
      "Home",
      "ImportingSession",
      "InventoryAdjustment",
      "InventoryAdjustmentItem",
      "InventoryAudit",
      "InventoryAuditItem",
      "InventoryQuantityNotification",
      "InventorySerialize",
      "Invoice",
      "InvoiceShippingContact",
      "InvtCmpAttr",
      "InvtCmpAttrOpt",
      "InvtCmpColor",
      "InvtCmpSize",
      "InvtCmpTrck",
      "InvtCmpTrckItm",
      "InvtItmRecord",
      "ItemCategory",
      "JewelryProduct",
      "JewelryProductType",
      "KnotStyle",
      "Layout",
      "Lead",
      "LinkStyle",
      "LinkType",
      "LocalizationSetting",
      "Location",
      "MailTemplate",
      "Maintenance",
      "MaintenanceEvent",
      "MaintenanceQuantityNotification",
      "ManufacturingProcess",
      "MarketingCustomersReport",
      "MarketingEmailTemplate",
      "MaterialGrade",
      "Membership",
      "MembershipItem",
      "MembershipOrderItem",
      "MetaConnection",
      "MetalFinishType",
      "MetalType",
      "Note",
      "NotificationMethod",
      "NotificationsNylasGrantExpire",
      "NylasConnection",
      "Onboarding",
      "OnboardingUser",
      "Order",
      "OrderSetting",
      "OrderStatusNotification",
      "PayRate",
      "PaymentMethod",
      "PdfCatalogFile",
      "PdfTemplate",
      "Piece",
      "Platform",
      "PlattingType",
      "Product",
      "ProductAttribute",
      "ProductAttributeOption",
      "ProductBrand",
      "ProductGroup",
      "ProductGroupAttribute",
      "ProductGroupAttributeOption",
      "ProductGroupItem",
      "ProductInventoryItem",
      "ProductInventoryItemEvent",
      "ProductOrderItem",
      "ProductSetting",
      "ProductType",
      "PublicContract",
      "PublicForm",
      "PurchaseRequest",
      "PurchaseRequestShippingInfo",
      "QuantityDifferenceType",
      "Question",
      "QuickPaySetting",
      "Rate",
      "ReactIconsIconlibrary",
      "RentableData",
      "ReportsSchedule",
      "Resource",
      "ResourceCount",
      "ResourceInventoryItem",
      "Return",
      "ReturnItem",
      "ReturnMethod",
      "ReturnStatus",
      "Review",
      "SalesCommission",
      "SalesItemReport",
      "SchedulingAppointment",
      "SchedulingRecurrence",
      "SequenceStep",
      "SequenceStepInfo",
      "Service",
      "ServiceLocationInfo",
      "ServiceOrderItem",
      "ServicePerformer",
      "ServiceSetting",
      "Sessions",
      "SettingNotification",
      "SettingsChat",
      "SettingsTask",
      "ShankStyle",
      "Shipment",
      "ShipmentCard",
      "ShipmentCarrier",
      "ShipmentPackage",
      "ShippingMethod",
      "Size",
      "SlugifySlug",
      "SpecificType",
      "StagingLog",
      "Strand",
      "StrandsLength",
      "StripeOnboarding",
      "StripePlanCategory",
      "StripeSubscriptionPlan",
      "Sublocation",
      "SublocationItem",
      "Task",
      "TaskLocation",
      "TaskStage",
      "TaskType",
      "Tax",
      "TaxAuthority",
      "TaxCollection",
      "TaxReport",
      "Tenant",
      "TenantCreditHistory",
      "TenantStripeSubscription",
      "TimePeriod",
      "TimeTracker",
      "TimelineConnection",
      "Todo",
      "Transaction",
      "TransferOrder",
      "TransferOrderItem",
      "TwilioConnection",
      "UploadFile",
      "UploadFolder",
      "Usage",
      "UserNotification",
      "UsersPermissionsPermission",
      "UsersPermissionsRole",
      "UsersPermissionsUser",
      "Website",
      "Weight",
      "ZapierWebhook"
    ]
  }
};
      export default result;
    
export const FileFragmentDoc = gql`
    fragment File on UploadFileEntity {
  id
  attributes {
    previewUrl
    alternativeText
    url
    size
    name
    mime
  }
}
    `;
export const HeadlineFragmentDoc = gql`
    fragment Headline on ComponentUiHeadline {
  id
  title
  subtitle
}
    `;
export const AuthContentFragmentDoc = gql`
    fragment AuthContent on ComponentUiAuthContent {
  id
  background {
    data {
      ...File
    }
  }
  headline {
    ...Headline
  }
  advantages {
    ...Headline
  }
}
    `;
export const LocationFragmentDoc = gql`
    fragment Location on LocationEntity {
  id
  attributes {
    address
    zipcode
    docAddressLine1
    docAddressLine2
    docAddressLine3
    docAddressLine4
  }
}
    `;
export const BusinessLocationCardFragmentDoc = gql`
    fragment BusinessLocationCard on BusinessLocationEntity {
  id
  attributes {
    uuid
    createdAt
    name
    businessLocationId
    archived
    email
    phoneNumber
    reviewLink
    location {
      data {
        ...Location
      }
    }
    tax {
      data {
        id
        attributes {
          name
        }
      }
    }
    taxCollection {
      data {
        id
        attributes {
          name
        }
      }
    }
  }
}
    `;
export const BusinessLocationDropdownFragmentDoc = gql`
    fragment BusinessLocationDropdown on BusinessLocationEntity {
  id
  attributes {
    uuid
    createdAt
    name
    email
    tenant {
      data {
        id
      }
    }
    phoneNumber
    businessLocationId
    archived
    reviewLink
    location {
      data {
        ...Location
      }
    }
  }
}
    `;
export const BusinessLocationMinFragmentDoc = gql`
    fragment BusinessLocationMin on BusinessLocationEntity {
  id
  attributes {
    uuid
    name
    email
    phoneNumber
    location {
      data {
        ...Location
      }
    }
  }
}
    `;
export const BusinessLocationSelectFragmentDoc = gql`
    fragment BusinessLocationSelect on BusinessLocationEntity {
  id
  attributes {
    name
  }
}
    `;
export const BusinessLocationTaxFragmentDoc = gql`
    fragment BusinessLocationTax on BusinessLocationEntity {
  id
  attributes {
    tax {
      data {
        id
      }
    }
    taxCollection {
      data {
        id
      }
    }
  }
}
    `;
export const SubLocationMinFragmentDoc = gql`
    fragment SubLocationMin on SublocationEntity {
  id
  attributes {
    name
    regexedId
  }
}
    `;
export const FileMinFragmentDoc = gql`
    fragment FileMin on UploadFileEntity {
  id
  attributes {
    url
  }
}
    `;
export const SubLocationFragmentDoc = gql`
    fragment SubLocation on SublocationEntity {
  id
  ...SubLocationMin
  attributes {
    businessLocation {
      data {
        id
        attributes {
          name
        }
      }
    }
    sublocationItems {
      data {
        id
        attributes {
          quantity
          actualQty
          scannedQty
          productInventoryItem {
            data {
              id
              attributes {
                product {
                  data {
                    id
                    attributes {
                      name
                      barcode
                      files(pagination: {limit: -1}) {
                        data {
                          ...FileMin
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
    `;
export const SubLocationItemMinFragmentDoc = gql`
    fragment SubLocationItemMin on SublocationItemEntity {
  id
  attributes {
    quantity
    actualQty
    scannedQty
  }
}
    `;
export const SubLocationItemFragmentDoc = gql`
    fragment SubLocationItem on SublocationItemEntity {
  id
  ...SubLocationItemMin
  attributes {
    sublocation {
      data {
        ...SubLocationMin
      }
    }
    productInventoryItem {
      data {
        id
      }
    }
  }
}
    `;
export const SubLocationItemInventoryTableFragmentDoc = gql`
    fragment SubLocationItemInventoryTable on SublocationItemEntity {
  id
  attributes {
    quantity
    sublocation {
      data {
        id
        attributes {
          name
        }
      }
    }
  }
}
    `;
export const SubLocationItemQuantityFragmentDoc = gql`
    fragment SubLocationItemQuantity on SublocationItemEntity {
  id
  attributes {
    quantity
  }
}
    `;
export const SubLocationSelectFragmentDoc = gql`
    fragment SubLocationSelect on SublocationEntity {
  id
  ...SubLocationMin
}
    `;
export const CardFragmentDoc = gql`
    fragment Card on ComponentUiCard {
  id
  title
  subtitle
  description
  media {
    data {
      ...File
    }
  }
}
    `;
export const ExtendedSectionFragmentDoc = gql`
    fragment ExtendedSection on ComponentUiExtendedSection {
  id
  visible
  heading {
    id
    title
    subtitle
  }
  media {
    data {
      ...File
    }
  }
  button {
    id
    title
    url
    icon
  }
  image {
    id
    title
    subtitle
    media {
      data {
        ...File
      }
    }
  }
}
    `;
export const ParagraphFragmentDoc = gql`
    fragment Paragraph on ComponentUiParagraph {
  id
  title
  value
}
    `;
export const ReviewSectionFragmentDoc = gql`
    fragment ReviewSection on ComponentUiCustomerReviewSection {
  id
  title
  description
  reviews(pagination: {limit: 100}) {
    id
    name
    text
    rating
  }
  visible
}
    `;
export const SectionFragmentDoc = gql`
    fragment Section on ComponentUiSection {
  id
  visible
  heading {
    id
    title
    subtitle
    description
    media {
      data {
        ...File
      }
    }
  }
  button {
    id
    title
    url
    target
  }
}
    `;
export const SectionsVisibilityFragmentDoc = gql`
    fragment SectionsVisibility on ComponentUiSectionsVisibility {
  id
  pageTitle
  isFooterVisible
  isCustomerReviewVisible
  isFollowUsVisible
  isSubscribeNewsLetterVisible
  isBlogVisible
}
    `;
export const CustomPermissionFragmentDoc = gql`
    fragment CustomPermission on CustomPermissionEntity {
  id
  attributes {
    permissions
    tenant {
      data {
        id
      }
    }
  }
}
    `;
export const DealMinFragmentDoc = gql`
    fragment DealMin on DealEntity {
  id
  attributes {
    name
    budget
    stage
    notes
    startDate
  }
}
    `;
export const DealFragmentDoc = gql`
    fragment Deal on DealEntity {
  ...DealMin
  id
  attributes {
    products {
      data {
        id
      }
    }
    lead {
      data {
        id
      }
    }
    contact {
      data {
        id
      }
    }
    company {
      data {
        id
      }
    }
    files {
      data {
        ...File
      }
    }
    employee {
      data {
        id
      }
    }
  }
}
    `;
export const DealCardFragmentDoc = gql`
    fragment DealCard on DealEntity {
  ...DealMin
  id
  attributes {
    lead {
      data {
        id
        attributes {
          fullName
          avatar {
            data {
              ...FileMin
            }
          }
        }
      }
    }
    contact {
      data {
        id
        attributes {
          fullName
          avatar {
            data {
              ...FileMin
            }
          }
        }
      }
    }
    company {
      data {
        id
        attributes {
          name
          avatar {
            data {
              ...FileMin
            }
          }
        }
      }
    }
    employee {
      data {
        id
        attributes {
          fullName
          avatar {
            data {
              ...FileMin
            }
          }
        }
      }
    }
  }
}
    `;
export const DealSettingFragmentDoc = gql`
    fragment DealSetting on DealSettingEntity {
  id
  attributes {
    templateNote
    isTemplateNoteEnabled
  }
}
    `;
export const DealTransactionReminderFragmentDoc = gql`
    fragment DealTransactionReminder on DealTransactionReminderEntity {
  id
  attributes {
    createdAt
    timing
    isActive
    daysAmount
  }
}
    `;
export const DefaultImportingFileFragmentDoc = gql`
    fragment DefaultImportingFile on DefaultImportingFileEntity {
  id
  attributes {
    createdAt
    type
    defaultFile {
      data {
        attributes {
          url
          name
        }
      }
    }
  }
}
    `;
export const DefaultPdfTemplateFragmentDoc = gql`
    fragment DefaultPdfTemplate on DefaultPdfTemplateEntity {
  id
  attributes {
    name
    templateId
    type
  }
}
    `;
export const DocumentPermissionFragmentDoc = gql`
    fragment DocumentPermission on DocumentPermissionEntity {
  id
  attributes {
    invoiceSignature
    taskNotificationContent
    purchaseTerms
    invoiceTerms
    appraisalTerms
    invoiceClientMessage
    isAppraisalTermsEnabled
    isInvoiceClientMessageEnabled
    isInvoiceTermsEnabled
    isShowOrderItemsImages
    isPurchaseTermsEnabled
    isInvoiceCreationDateEnabled
    isInvoiceDiscountEnabled
    isInvoiceTaxEnabled
    isInvoiceTipEnabled
    isPurchaseCreationDateEnabled
    isPurchaseDiscountEnabled
    isPurchaseTaxEnabled
    isPurchaseTipEnabled
    isInternalRepairTicketPriceEnabled
    isShowOrderNoteAtInternalRepairTicker
    isShowOrderNoteAtExternalRepairTicker
    isExternalRepairTicketPriceEnabled
    isOnboardingMessage
    estimateTerms
    estimateClientMessage
    isEstimateTermsEnabled
    isEstimateClientMessageEnabled
    isEstimateCreationDateEnabled
    isEstimateDiscountEnabled
    isEstimateTaxEnabled
    isEstimateTipEnabled
    estimateSignature
    isPriceOnLabelEnabled
    isSkuOnLabelEnabled
    isBarcodeOnLabelEnabled
    defaultLabelTemplate
    isInvoiceShippedDateEnabled
    isPurchaseShippedDateEnabled
    isEstimateShippedDateEnabled
    isInvoiceDueDateEnabled
    isPurchaseDueDateEnabled
    isEstimateDueDateEnabled
    isInvoiceMemoTermsEnabled
    invoiceMemoTerms
    isPurchaseMemoTermsEnabled
    purchaseMemoTerms
    isInvoiceLocationEnabled
    isPurchaseLocationEnabled
    isEstimateLocationEnabled
    isInvoiceSkuEnabled
    isPurchaseSkuEnabled
    isEstimateSkuEnabled
    appraisalDescriptionPrompt
    documentImageSizeMultiplier
    signature
    isShowCustomerNameForAppraisal
    isShowStoreAddressForAppraisal
    isUsePdfGeneratorForAppraisal
    isUsePdfGeneratorForEstimate
    isUsePdfGeneratorForInvoice
    isUsePdfGeneratorForPurchase
    isInternalRepairTicketNumberEnabled
    isExternalRepairTicketNumberEnabled
    startRepairTicketNumber
    isInvoiceRepairTicketNumberEnabled
    isUsePdfGeneratorForExternalJobTicket
    isUsePdfGeneratorForInternalJobTicket
  }
}
    `;
export const FileItemMinFragmentDoc = gql`
    fragment FileItemMin on FileItemEntity {
  id
  attributes {
    createdAt
    name
    type
    isFavourite
    attachedFile {
      data {
        ...File
      }
    }
  }
}
    `;
export const DownloadRecordFragmentDoc = gql`
    fragment DownloadRecord on DownloadRecordEntity {
  id
  attributes {
    createdAt
    fileItem {
      data {
        ...FileItemMin
      }
    }
  }
}
    `;
export const EcommerceCustomAppServiceFragmentDoc = gql`
    fragment EcommerceCustomAppService on EcommerceCustomAppServiceEntity {
  id
  attributes {
    appName
    apiKey
    apiSecret
    isInstalled
    accessToken
  }
}
    `;
export const UserMinFragmentDoc = gql`
    fragment UserMin on UsersPermissionsUserEntity {
  id
  attributes {
    fullName
    email
    jobTitle
    defaultRoute
    defaultPaymentTerminalId
    isGoogleAddressInputEnabled
    avatar {
      data {
        ...File
      }
    }
    preferredCurrency
  }
}
    `;
export const ExceededServiceFragmentDoc = gql`
    fragment ExceededService on ExceededServiceEntity {
  id
  attributes {
    nextBillingCycle
    employee {
      data {
        ...UserMin
      }
    }
    tenant {
      data {
        id
        attributes {
          companyName
        }
      }
    }
  }
}
    `;
export const FileItemFragmentDoc = gql`
    fragment FileItem on FileItemEntity {
  ...FileItemMin
  id
  attributes {
    uploadedBy {
      data {
        ...UserMin
      }
    }
  }
}
    `;
export const ImportingSessionFragmentDoc = gql`
    fragment ImportingSession on ImportingSessionEntity {
  id
  attributes {
    regexedId
    type
    state
    createdAt
    cmpltdImports {
      data {
        ...File
      }
    }
    uploadedBy {
      data {
        id
        attributes {
          fullName
        }
      }
    }
    updImports {
      data {
        ...File
      }
    }
    splImports {
      data {
        ...File
      }
    }
    srcFile {
      data {
        ...File
      }
    }
  }
}
    `;
export const InventoryAdjustmentMinFragmentDoc = gql`
    fragment InventoryAdjustmentMin on InventoryAdjustmentEntity {
  id
  attributes {
    reason
    uuid
    adjustmentDate
    description
    adjustmentId
    createdAt
  }
}
    `;
export const InventoryAdjustmentFragmentDoc = gql`
    fragment InventoryAdjustment on InventoryAdjustmentEntity {
  ...InventoryAdjustmentMin
  id
  attributes {
    location {
      data {
        id
      }
    }
    sublocation {
      data {
        id
      }
    }
    files {
      data {
        ...File
      }
    }
  }
}
    `;
export const InventoryAdjustmentItemFragmentDoc = gql`
    fragment InventoryAdjustmentItem on InventoryAdjustmentItemEntity {
  id
  attributes {
    quantityAvailable
    adjustedQuantity
    quantityLeft
    product {
      data {
        id
      }
    }
    serializes {
      data {
        id
      }
    }
  }
}
    `;
export const InventoryAdjustmentsTableFragmentDoc = gql`
    fragment InventoryAdjustmentsTable on InventoryAdjustmentEntity {
  id
  ...InventoryAdjustmentMin
  attributes {
    location {
      data {
        attributes {
          name
        }
      }
    }
    sublocation {
      data {
        attributes {
          name
        }
      }
    }
    employee {
      data {
        attributes {
          fullName
        }
      }
    }
  }
}
    `;
export const InventoryAuditMinFragmentDoc = gql`
    fragment InventoryAuditMin on InventoryAuditEntity {
  id
  attributes {
    uuid
    auditDate
    auditId
    name
    finalize
    adjusted
    isAdjustmentRequired
  }
}
    `;
export const InventoryAuditItemMinFragmentDoc = gql`
    fragment InventoryAuditItemMin on InventoryAuditItemEntity {
  id
  attributes {
    inventoryQty
    actualQty
    scannedQty
    adjusted
    auditItemId
  }
}
    `;
export const InventoryAuditFragmentDoc = gql`
    fragment InventoryAudit on InventoryAuditEntity {
  id
  ...InventoryAuditMin
  attributes {
    inventoryAuditItems(pagination: {limit: -1}) {
      data {
        id
        ...InventoryAuditItemMin
        attributes {
          productInventoryItem {
            data {
              id
            }
          }
          businessLocation {
            data {
              id
              attributes {
                name
              }
            }
          }
          sublocationItems {
            data {
              id
              ...SubLocationItemMin
              attributes {
                sublocation {
                  data {
                    ...SubLocationMin
                  }
                }
              }
            }
          }
        }
      }
    }
    businessLocation {
      data {
        id
        attributes {
          name
        }
      }
    }
    sublocation {
      data {
        id
        attributes {
          name
        }
      }
    }
    employee {
      data {
        id
        attributes {
          fullName
        }
      }
    }
  }
}
    `;
export const InventoryAuditAdjustmentActionFragmentDoc = gql`
    fragment InventoryAuditAdjustmentAction on InventoryAuditEntity {
  id
  attributes {
    auditId
  }
}
    `;
export const InventoryAuditFinalizeActionFragmentDoc = gql`
    fragment InventoryAuditFinalizeAction on InventoryAuditEntity {
  id
  attributes {
    isInventoryNotEqualScanned
  }
}
    `;
export const InventoryAuditItemScannerFragmentDoc = gql`
    fragment InventoryAuditItemScanner on InventoryAuditItemEntity {
  id
  ...InventoryAuditItemMin
  attributes {
    productInventoryItem {
      data {
        id
        attributes {
          product {
            data {
              id
              attributes {
                barcode
              }
            }
          }
          sublocationItems {
            data {
              id
              ...SubLocationItemMin
            }
          }
        }
      }
    }
  }
}
    `;
export const InventoryAuditItemWithProductDataFragmentDoc = gql`
    fragment InventoryAuditItemWithProductData on InventoryAuditItemEntity {
  id
  ...InventoryAuditItemMin
  attributes {
    productInventoryItem {
      data {
        id
        attributes {
          price
          product {
            data {
              id
              attributes {
                name
                barcode
                defaultPrice
                productType {
                  data {
                    id
                    attributes {
                      name
                    }
                  }
                }
                files {
                  data {
                    ...FileMin
                  }
                }
              }
            }
          }
        }
      }
    }
    sublocation {
      data {
        id
        attributes {
          name
        }
      }
    }
    businessLocation {
      data {
        id
        attributes {
          name
        }
      }
    }
    sublocationItems {
      data {
        ...SubLocationItemMin
      }
    }
  }
}
    `;
export const InventoryAuditTableFragmentDoc = gql`
    fragment InventoryAuditTable on InventoryAuditEntity {
  id
  attributes {
    auditId
    auditDate
    name
    uuid
    finalize
    adjusted
    isAdjustmentRequired
    businessLocation {
      data {
        id
        attributes {
          name
        }
      }
    }
    sublocation {
      data {
        id
        attributes {
          name
        }
      }
    }
    employee {
      data {
        id
        attributes {
          fullName
        }
      }
    }
  }
}
    `;
export const InvtCmpAttrMinFragmentDoc = gql`
    fragment InvtCmpAttrMin on InvtCmpAttrEntity {
  id
  attributes {
    name
  }
}
    `;
export const InvtCmpAttrOptMinFragmentDoc = gql`
    fragment InvtCmpAttrOptMin on InvtCmpAttrOptEntity {
  id
  attributes {
    name
  }
}
    `;
export const InvtCmpAttrFragmentDoc = gql`
    fragment InvtCmpAttr on InvtCmpAttrEntity {
  ...InvtCmpAttrMin
  id
  attributes {
    comPrAttrOps {
      data {
        ...InvtCmpAttrOptMin
      }
    }
  }
}
    `;
export const InvtCmpTrckMinFragmentDoc = gql`
    fragment InvtCmpTrckMin on InvtCmpTrckEntity {
  id
  attributes {
    multiplier
    margin
    createdAt
  }
}
    `;
export const InvtCmpSizeFragmentDoc = gql`
    fragment InvtCmpSize on InvtCmpSizeEntity {
  id
  attributes {
    name
  }
}
    `;
export const InvtCmpColorFragmentDoc = gql`
    fragment InvtCmpColor on InvtCmpColorEntity {
  id
  attributes {
    name
  }
}
    `;
export const InvtCmpAttrOptFragmentDoc = gql`
    fragment InvtCmpAttrOpt on InvtCmpAttrOptEntity {
  ...InvtCmpAttrOptMin
  id
  attributes {
    comPrAttr {
      data {
        ...InvtCmpAttrMin
      }
    }
  }
}
    `;
export const InvtCmpTrckItmFragmentDoc = gql`
    fragment InvtCmpTrckItm on InvtCmpTrckItmEntity {
  id
  attributes {
    name
    quantity
    price
    vendor
    invoice
    note
    itemId
    costTrackerInfo {
      data {
        ...InvtCmpTrckMin
      }
    }
  }
}
    `;
export const InvtCmpTrckFragmentDoc = gql`
    fragment InvtCmpTrck on InvtCmpTrckEntity {
  ...InvtCmpTrckMin
  id
  attributes {
    size {
      data {
        ...InvtCmpSize
      }
    }
    color {
      data {
        ...InvtCmpColor
      }
    }
    cmpAttrOpts {
      data {
        ...InvtCmpAttrOpt
      }
    }
    costTrackerItems {
      data {
        ...InvtCmpTrckItm
      }
    }
  }
}
    `;
export const ItemCategoryFragmentDoc = gql`
    fragment ItemCategory on ItemCategoryEntity {
  id
  attributes {
    name
    editable
  }
}
    `;
export const BackingFragmentDoc = gql`
    fragment Backing on BackingEntity {
  id
  attributes {
    name
  }
}
    `;
export const BoxPaperFragmentDoc = gql`
    fragment BoxPaper on BoxPaperEntity {
  id
  attributes {
    name
  }
}
    `;
export const CountryFragmentDoc = gql`
    fragment Country on CountryEntity {
  id
  attributes {
    name
  }
}
    `;
export const DesignStyleFragmentDoc = gql`
    fragment DesignStyle on DesignStyleEntity {
  id
  attributes {
    name
  }
}
    `;
export const ShankStyleFragmentDoc = gql`
    fragment ShankStyle on ShankStyleEntity {
  id
  attributes {
    name
  }
}
    `;
export const SizeFragmentDoc = gql`
    fragment Size on SizeEntity {
  id
  attributes {
    name
  }
}
    `;
export const JewelryProductTypeFragmentDoc = gql`
    fragment JewelryProductType on JewelryProductTypeEntity {
  id
  attributes {
    name
  }
}
    `;
export const SpecificTypeFragmentDoc = gql`
    fragment SpecificType on SpecificTypeEntity {
  id
  attributes {
    name
  }
}
    `;
export const EngravingTypeFragmentDoc = gql`
    fragment EngravingType on EngravingTypeEntity {
  id
  attributes {
    name
  }
}
    `;
export const TimePeriodFragmentDoc = gql`
    fragment TimePeriod on TimePeriodEntity {
  id
  attributes {
    name
  }
}
    `;
export const MetalFinishTypeFragmentDoc = gql`
    fragment MetalFinishType on MetalFinishTypeEntity {
  id
  attributes {
    name
  }
}
    `;
export const MaterialGradeFragmentDoc = gql`
    fragment MaterialGrade on MaterialGradeEntity {
  id
  attributes {
    name
  }
}
    `;
export const MetalTypeFragmentDoc = gql`
    fragment MetalType on MetalTypeEntity {
  id
  attributes {
    name
    materialGrades {
      data {
        ...MaterialGrade
      }
    }
  }
}
    `;
export const JewelryGenderTypeFragmentDoc = gql`
    fragment JewelryGenderType on GenderTypeEntity {
  id
  attributes {
    name
  }
}
    `;
export const JewelryConditionTypeFragmentDoc = gql`
    fragment JewelryConditionType on ConditionTypeEntity {
  id
  attributes {
    name
  }
}
    `;
export const PlattingTypeFragmentDoc = gql`
    fragment PlattingType on PlattingTypeEntity {
  id
  attributes {
    name
  }
}
    `;
export const ManufacturingProcessFragmentDoc = gql`
    fragment ManufacturingProcess on ManufacturingProcessEntity {
  id
  attributes {
    name
  }
}
    `;
export const PieceFragmentDoc = gql`
    fragment Piece on PieceEntity {
  id
  attributes {
    name
  }
}
    `;
export const ProductBrandFragmentDoc = gql`
    fragment ProductBrand on ProductBrandEntity {
  id
  attributes {
    name
    editable
  }
}
    `;
export const RentableDataFragmentDoc = gql`
    fragment RentableData on RentableDataEntity {
  id
  attributes {
    pricePerPeriod
    lostFee
    minimumRentalPeriod
    period
    enabled
  }
}
    `;
export const DimensionFragmentDoc = gql`
    fragment Dimension on DimensionEntity {
  id
  attributes {
    height
    length
    width
    unit
  }
}
    `;
export const WeightFragmentDoc = gql`
    fragment Weight on WeightEntity {
  id
  attributes {
    value
    unit
  }
}
    `;
export const JewelryProductMinFragmentDoc = gql`
    fragment JewelryProductMin on JewelryProductEntity {
  id
  attributes {
    uuid
    name
    marginCost
    files {
      data {
        ...File
      }
    }
    description
    createdAt
    barcode
    defaultPrice
    designStyle {
      data {
        ...DesignStyle
      }
    }
    shankStyle {
      data {
        ...ShankStyle
      }
    }
    size {
      data {
        ...Size
      }
    }
    model
    jewelryProductType {
      data {
        ...JewelryProductType
      }
    }
    specificType {
      data {
        ...SpecificType
      }
    }
    engravingType {
      data {
        ...EngravingType
      }
    }
    timePeriod {
      data {
        ...TimePeriod
      }
    }
    metalFinishType {
      data {
        ...MetalFinishType
      }
    }
    metalType {
      data {
        ...MetalType
      }
    }
    materialGradeType {
      data {
        ...MaterialGrade
      }
    }
    genderType {
      data {
        ...JewelryGenderType
      }
    }
    conditionType {
      data {
        ...JewelryConditionType
      }
    }
    platting {
      data {
        ...PlattingType
      }
    }
    process {
      data {
        ...ManufacturingProcess
      }
    }
    pieces {
      data {
        ...Piece
      }
    }
    serialNumber
    brand {
      data {
        ...ProductBrand
      }
    }
    rentableData {
      data {
        ...RentableData
      }
    }
    partsWarranty
    returnable
    bundleUseOnly
    businessUseOnly
    laborWarranty
    packagingProduct
    tagProductName
    expiryDate
    dimension {
      data {
        ...Dimension
      }
    }
    weight {
      data {
        ...Weight
      }
    }
    SKU
    ISBN
    MPN
    UPC
    EAN
  }
}
    `;
export const ProductTypeFragmentDoc = gql`
    fragment ProductType on ProductTypeEntity {
  id
  attributes {
    name
    editable
    defaultPriceMultiplier
  }
}
    `;
export const ProductMinFragmentDoc = gql`
    fragment ProductMin on ProductEntity {
  id
  attributes {
    shopifyCollections
    woocommerceCategory
    ecommerceDescription
    shopifyTags
    tagProductName
    defaultPrice
    productId
    name
    barcode
    uuid
    favorite
    model
    serialNumber
    SKU
    UPC
    MPN
    EAN
    ISBN
    partsWarranty
    laborWarranty
    ecommerceName
    note
    appraisalDescription
    businessUseOnly
    bundleUseOnly
    expiryDate
    returnable
    packagingProduct
    active
    isNegativeCount
    multiplier
    wholeSaleMultiplier
    revenue
    cost
    files(pagination: {limit: -1}) {
      data {
        ...File
      }
    }
    dimension {
      data {
        ...Dimension
      }
    }
    weight {
      data {
        ...Weight
      }
    }
    brand {
      data {
        ...ProductBrand
      }
    }
    productType {
      data {
        ...ProductType
      }
    }
    rentableData {
      data {
        ...RentableData
      }
    }
  }
}
    `;
export const SerializeFragmentDoc = gql`
    fragment Serialize on InventorySerializeEntity {
  id
  attributes {
    editable
    name
  }
}
    `;
export const TaxMinFragmentDoc = gql`
    fragment TaxMin on TaxEntity {
  id
  attributes {
    name
    rate
    createdAt
    fixedFee
    perUnitFee
    maxTaxAmount
    startAfterPrice
    endAfterPrice
    exemptionThreshold
  }
}
    `;
export const TaxCollectionMinFragmentDoc = gql`
    fragment TaxCollectionMin on TaxCollectionEntity {
  id
  attributes {
    name
    createdAt
  }
}
    `;
export const BusinessLocationFragmentDoc = gql`
    fragment BusinessLocation on BusinessLocationEntity {
  id
  attributes {
    uuid
    reviewLink
    type
    name
    email
    phoneNumber
    graphItem
    location {
      data {
        ...Location
      }
    }
    tax {
      data {
        ...TaxMin
      }
    }
    taxCollection {
      data {
        ...TaxCollectionMin
      }
    }
    businessLocationId
    sublocations {
      data {
        ...SubLocationMin
      }
    }
    createdAt
    uuid
    archived
  }
}
    `;
export const TaxAuthorityFragmentDoc = gql`
    fragment TaxAuthority on TaxAuthorityEntity {
  id
  attributes {
    name
  }
}
    `;
export const TaxFragmentDoc = gql`
    fragment Tax on TaxEntity {
  ...TaxMin
  id
  attributes {
    taxAuthority {
      data {
        ...TaxAuthority
      }
    }
  }
}
    `;
export const ProductInventoryItemFragmentDoc = gql`
    fragment ProductInventoryItem on ProductInventoryItemEntity {
  id
  attributes {
    price
    quantity
    lowQuantity
    maxQuantity
    minOrderQuantity
    pointsGiven
    customCreationDate
    pointsRedeemed
    storageNotes
    favorite
    isNegativeCount
    isSerializedInventory
    uuid
    active
    rentalPrice
    wholesalePrice
    product {
      data {
        ...ProductMin
      }
    }
    serializes {
      data {
        ...Serialize
      }
    }
    businessLocation {
      data {
        ...BusinessLocation
      }
    }
    tax {
      data {
        ...Tax
      }
    }
    taxCollection {
      data {
        id
        attributes {
          name
        }
      }
    }
  }
}
    `;
export const ProductAttributeOptionMinFragmentDoc = gql`
    fragment ProductAttributeOptionMin on ProductAttributeOptionEntity {
  id
  attributes {
    name
  }
}
    `;
export const ProductAttributeMinFragmentDoc = gql`
    fragment ProductAttributeMin on ProductAttributeEntity {
  id
  attributes {
    name
  }
}
    `;
export const ProductAttributeOptionFragmentDoc = gql`
    fragment ProductAttributeOption on ProductAttributeOptionEntity {
  ...ProductAttributeOptionMin
  id
  attributes {
    productAttribute {
      data {
        ...ProductAttributeMin
      }
    }
  }
}
    `;
export const JewelryProductFragmentDoc = gql`
    fragment JewelryProduct on JewelryProductEntity {
  ...JewelryProductMin
  id
  attributes {
    productInventoryItems {
      data {
        ...ProductInventoryItem
      }
    }
    productAttributeOptions {
      data {
        ...ProductAttributeOption
      }
    }
  }
}
    `;
export const KnotStyleFragmentDoc = gql`
    fragment KnotStyle on KnotStyleEntity {
  id
  attributes {
    name
  }
}
    `;
export const LinkStyleFragmentDoc = gql`
    fragment LinkStyle on LinkStyleEntity {
  id
  attributes {
    name
  }
}
    `;
export const LinkTypeFragmentDoc = gql`
    fragment LinkType on LinkTypeEntity {
  id
  attributes {
    name
  }
}
    `;
export const StrandFragmentDoc = gql`
    fragment Strand on StrandEntity {
  id
  attributes {
    name
  }
}
    `;
export const StrandsLengthFragmentDoc = gql`
    fragment StrandsLength on StrandsLengthEntity {
  id
  attributes {
    name
  }
}
    `;
export const LeadMinFragmentDoc = gql`
    fragment LeadMin on LeadEntity {
  id
  attributes {
    uuid
    email
    fullName
    phoneNumber
    address
    leadSource
    leadStage
    avatar {
      data {
        ...File
      }
    }
    createdAt
  }
}
    `;
export const LeadFragmentDoc = gql`
    fragment Lead on LeadEntity {
  ...LeadMin
  id
  attributes {
    user {
      data {
        id
        attributes {
          fullName
          email
          phoneNumber
          avatar {
            data {
              ...FileMin
            }
          }
        }
      }
    }
    leadOwner {
      data {
        id
        attributes {
          fullName
          email
          phoneNumber
          avatar {
            data {
              ...FileMin
            }
          }
        }
      }
    }
    fileItems {
      data {
        id
      }
    }
    customFields
  }
}
    `;
export const LeadSelectFragmentDoc = gql`
    fragment LeadSelect on LeadEntity {
  id
  attributes {
    fullName
  }
}
    `;
export const LeadSelectMaxFragmentDoc = gql`
    fragment LeadSelectMax on LeadEntity {
  id
  attributes {
    fullName
    email
    phoneNumber
    avatar {
      data {
        ...FileMin
      }
    }
  }
}
    `;
export const LeadTableFragmentDoc = gql`
    fragment LeadTable on LeadEntity {
  id
  attributes {
    fullName
    uuid
    email
    phoneNumber
    createdAt
    leadSource
    leadStage
    avatar {
      data {
        ...FileMin
      }
    }
    leadOwner {
      data {
        id
        attributes {
          firstName
          fullName
          uuid
          avatar {
            data {
              ...FileMin
            }
          }
        }
      }
    }
  }
}
    `;
export const LeadWithoutIdAttributesFragmentDoc = gql`
    fragment LeadWithoutIdAttributes on Lead {
  uuid
  email
  fullName
  phoneNumber
  address
  leadSource
  leadStage
  avatar {
    data {
      ...File
    }
  }
  createdAt
}
    `;
export const LocalizationSettingFragmentDoc = gql`
    fragment LocalizationSetting on LocalizationSettingEntity {
  id
  attributes {
    createdAt
    dateFormat
    timeZone
    timeFormat
  }
}
    `;
export const MailTemplateFragmentDoc = gql`
    fragment MailTemplate on MailTemplateEntity {
  id
  attributes {
    name
    text
    owner {
      data {
        ...UserMin
      }
    }
  }
}
    `;
export const MarketingCustomersReportFragmentDoc = gql`
    fragment MarketingCustomersReport on MarketingCustomersReportEntity {
  id
  attributes {
    createdAt
    EMAILsent
    SMSsent
    enrolledContact {
      data {
        id
        attributes {
          campaign {
            data {
              id
              attributes {
                name
              }
            }
          }
          contact {
            data {
              id
              attributes {
                fullName
              }
            }
          }
        }
      }
    }
    enrolledLead {
      data {
        id
        attributes {
          campaign {
            data {
              id
              attributes {
                name
              }
            }
          }
          lead {
            data {
              id
              attributes {
                fullName
              }
            }
          }
        }
      }
    }
  }
}
    `;
export const MarketingEmailTemplateFragmentDoc = gql`
    fragment MarketingEmailTemplate on MarketingEmailTemplateEntity {
  id
  attributes {
    createdAt
    name
    subject
    uuid
    templateJSON
    templateHtml
  }
}
    `;
export const NoteFragmentDoc = gql`
    fragment Note on NoteEntity {
  id
  attributes {
    description
    isDefault
    createdAt
    contact_id {
      data {
        id
      }
    }
    contact_id {
      data {
        id
      }
    }
    lead_id {
      data {
        id
      }
    }
  }
}
    `;
export const InventoryQuantityNotificationFragmentDoc = gql`
    fragment InventoryQuantityNotification on InventoryQuantityNotificationEntity {
  id
  attributes {
    type
    productInventoryItem {
      data {
        id
        attributes {
          lowQuantity
          quantity
          businessLocation {
            data {
              id
              attributes {
                name
              }
            }
          }
          product {
            data {
              id
              attributes {
                uuid
                name
                files(pagination: {limit: 1}) {
                  data {
                    ...FileMin
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
    `;
export const MaintenanceQuantityNotificationFragmentDoc = gql`
    fragment MaintenanceQuantityNotification on MaintenanceQuantityNotificationEntity {
  id
  attributes {
    type
    createdAt
    maintenance {
      data {
        id
        attributes {
          uuid
          resourceInventoryItem {
            data {
              id
              attributes {
                resource {
                  data {
                    id
                    attributes {
                      name
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
    `;
export const NylasGrantExpireNotificationFragmentDoc = gql`
    fragment NylasGrantExpireNotification on NotificationsNylasGrantExpireEntity {
  id
  attributes {
    createdAt
  }
}
    `;
export const UserNotificationFragmentDoc = gql`
    fragment UserNotification on UserNotificationEntity {
  id
  attributes {
    hasBeenSeen
    createdAt
    type
    inventoryQuantityNotification {
      data {
        ...InventoryQuantityNotification
      }
    }
    maintenanceQuantityNotification {
      data {
        ...MaintenanceQuantityNotification
      }
    }
    nylasGrantExpire {
      data {
        ...NylasGrantExpireNotification
      }
    }
  }
}
    `;
export const NotificationSettingFragmentDoc = gql`
    fragment NotificationSetting on SettingNotificationEntity {
  id
  attributes {
    config
    smsNotifyOnComplete
    emailNotifyOnComplete
    content
    type
    tenant {
      data {
        id
      }
    }
  }
}
    `;
export const OnboardingUserFragmentDoc = gql`
    fragment OnboardingUser on OnboardingUserEntity {
  id
  attributes {
    isCompleted
    isNylasConnected
    isPasswordChanged
  }
}
    `;
export const OnboardingFragmentDoc = gql`
    fragment Onboarding on OnboardingEntity {
  id
  attributes {
    isCompleted
    isLogoUpload
    isMainLocation
    isEmailAndPhone
    isStoreAdded
    isEmployeeAdded
    isCustomerImported
    isProductsImported
    isTwilioConnected
    isStripeConnected
    isQuickBooksConnected
  }
}
    `;
export const OrderPaymentSettingFragmentDoc = gql`
    fragment OrderPaymentSetting on OrderSettingEntity {
  id
  attributes {
    sellingPayingAmountPercentage
    sellingOrderManagementPayingAmountPercentage
    purchasePayingAmountPercentage
    purchaseOrderManagementPayingAmountPercentage
    dueDateDays
    isVisiblePayWithPointsPaymentButton
    isAutoMovedToShipped
  }
}
    `;
export const OrderPeriodSettingFragmentDoc = gql`
    fragment OrderPeriodSetting on OrderSettingEntity {
  id
  attributes {
    isShippedDatePeriodEnabled
    isReceiveDatePeriodEnabled
  }
}
    `;
export const OrderSettingFragmentDoc = gql`
    fragment OrderSetting on OrderSettingEntity {
  id
  attributes {
    orderNote
    reviewLink
    sellingPayingAmountPercentage
    sellingOrderManagementPayingAmountPercentage
    purchasePayingAmountPercentage
    purchaseOrderManagementPayingAmountPercentage
    dueDateDays
    isQuickPayEnabled
    isVisibleClassItems
    isVisibleCompositeProductItems
    isVisibleDiscountItems
    isVisibleMembershipItems
    isVisibleProductItems
    isVisibleServiceItems
    isVisibleSearchBarInPos
    isVisibleRentOrders
    isVisibleSellOrders
    isVisibleTradeInOrders
    isVisibleEstimateOrders
    isVisibleLayawayOrders
    isVisiblePurchaseOrders
    isVisiblePayWithPointsPaymentButton
    isShippedDatePeriodEnabled
    isReceiveDatePeriodEnabled
    isAutomaticallyMoveOrderToReadyStage
    isAutoSendNotification
    isAutoSendReview
    isAutoMovedToShipped
  }
}
    `;
export const PaginationFragmentDoc = gql`
    fragment Pagination on Pagination {
  page
  pageCount
  pageSize
  total
}
    `;
export const MetaFragmentDoc = gql`
    fragment Meta on ResponseCollectionMeta {
  pagination {
    ...Pagination
  }
}
    `;
export const PayRateFragmentDoc = gql`
    fragment PayRate on PayRateEntity {
  id
  attributes {
    rate
    period
  }
}
    `;
export const PdfCatalogFileFragmentDoc = gql`
    fragment PdfCatalogFile on PdfCatalogFileEntity {
  id
  attributes {
    name
    tenant {
      data {
        id
      }
    }
    createdAt
    file {
      data {
        id
        attributes {
          url
        }
      }
    }
  }
}
    `;
export const PdfTemplateFragmentDoc = gql`
    fragment PdfTemplate on PdfTemplateEntity {
  id
  attributes {
    templateId
    name
    isDefault
    isAllowItemWithoutImage
    type
    tenant {
      data {
        id
      }
    }
  }
}
    `;
export const BoardProductMinFragmentDoc = gql`
    fragment BoardProductMin on ProductEntity {
  id
  attributes {
    name
    files(pagination: {limit: 1}) {
      data {
        ...FileMin
      }
    }
  }
}
    `;
export const BoardProductInventoryItemFragmentDoc = gql`
    fragment BoardProductInventoryItem on ProductInventoryItemEntity {
  id
  attributes {
    product {
      data {
        ...BoardProductMin
      }
    }
  }
}
    `;
export const ProductAppraisalFragmentDoc = gql`
    fragment ProductAppraisal on ProductEntity {
  id
  attributes {
    defaultPrice
    appraisalDescription
    files(pagination: {limit: 3}) {
      data {
        ...File
      }
    }
  }
}
    `;
export const ProductCostTrackerFragmentDoc = gql`
    fragment ProductCostTracker on ProductEntity {
  id
  attributes {
    name
    defaultPrice
    brand {
      data {
        ...ProductBrand
      }
    }
  }
}
    `;
export const ProductInventoryItemCompactFragmentDoc = gql`
    fragment ProductInventoryItemCompact on ProductInventoryItemEntity {
  id
  attributes {
    price
    quantity
    serializes {
      data {
        id
        attributes {
          name
        }
      }
    }
    tax {
      data {
        id
        attributes {
          name
        }
      }
    }
    taxCollection {
      data {
        id
        attributes {
          name
        }
      }
    }
  }
}
    `;
export const ProductInventoryItemEventMemoNumberFragmentDoc = gql`
    fragment ProductInventoryItemEventMemoNumber on ProductInventoryItemEventEntity {
  id
  attributes {
    memoNumber
    order {
      data {
        id
        attributes {
          memoNumber
        }
      }
    }
  }
}
    `;
export const ProductInventoryItemEventMinFragmentDoc = gql`
    fragment ProductInventoryItemEventMin on ProductInventoryItemEventEntity {
  id
  attributes {
    eventType
    remainingQuantity
    change
    receiveDate
    itemCost
  }
}
    `;
export const ProductInventoryItemEventReportFragmentDoc = gql`
    fragment ProductInventoryItemEventReport on ProductInventoryItemEventEntity {
  ...ProductInventoryItemEventMin
  id
  attributes {
    isPartiallyReturned
    isFullyReturned
    returnedDate
    expiryDate
    isNotified
    memoNumber
    note
    order {
      data {
        id
        attributes {
          orderId
          memoNumber
        }
      }
    }
    productInventoryItem {
      data {
        id
        attributes {
          businessLocation {
            data {
              id
              attributes {
                uuid
                name
              }
            }
          }
          product {
            data {
              id
              attributes {
                name
                uuid
                SKU
                files(pagination: {limit: 1}) {
                  data {
                    ...FileMin
                  }
                }
              }
            }
          }
        }
      }
    }
    itemVendor {
      data {
        id
        attributes {
          name
          uuid
        }
      }
    }
    itemContactVendor {
      data {
        id
        attributes {
          fullName
          uuid
        }
      }
    }
  }
}
    `;
export const ProductInventoryItemEventTableFragmentDoc = gql`
    fragment ProductInventoryItemEventTable on ProductInventoryItemEventEntity {
  ...ProductInventoryItemEventMin
  id
  attributes {
    relationId
    relationUuid
    memo
    createdAt
    itemVendor {
      data {
        id
        attributes {
          name
        }
      }
    }
    itemContactVendor {
      data {
        id
        attributes {
          fullName
        }
      }
    }
    order {
      data {
        id
        attributes {
          orderId
          inputInvoiceNum
          memoNumber
        }
      }
    }
    addedBy {
      data {
        id
        attributes {
          fullName
          contact {
            data {
              id
            }
          }
        }
      }
    }
  }
}
    `;
export const ProductInventoryItemPosFragmentDoc = gql`
    fragment ProductInventoryItemPos on ProductInventoryItemEntity {
  id
  attributes {
    uuid
    favorite
    quantity
    isNegativeCount
    price
    wholesalePrice
    rentalPrice
    tax {
      data {
        id
        attributes {
          name
        }
      }
    }
    taxCollection {
      data {
        id
        attributes {
          name
        }
      }
    }
    sublocation {
      data {
        id
      }
    }
    product {
      data {
        id
        attributes {
          uuid
          name
          defaultPrice
          multiplier
          wholeSaleMultiplier
          files(pagination: {limit: 1}) {
            data {
              ...FileMin
            }
          }
          rentableData {
            data {
              ...RentableData
            }
          }
        }
      }
    }
  }
}
    `;
export const ProductInventoryItemRecordMinFragmentDoc = gql`
    fragment ProductInventoryItemRecordMin on InvtItmRecordEntity {
  id
  attributes {
    createdAt
    age
    soldDate
    grossMargin
    price
    memoTaken
    memoSold
  }
}
    `;
export const ProductInventoryItemRecordFragmentDoc = gql`
    fragment ProductInventoryItemRecord on InvtItmRecordEntity {
  id
  ...ProductInventoryItemRecordMin
  attributes {
    quantityOnOrder(businessLocationId: $businessLocationId)
    sellingOrder {
      data {
        id
        attributes {
          orderId
          customCreationDate
          contact {
            data {
              id
              attributes {
                fullName
                uuid
              }
            }
          }
          company {
            data {
              id
              attributes {
                name
                uuid
              }
            }
          }
        }
      }
    }
    productInventoryItemEvent {
      data {
        id
        attributes {
          change
          remainingQuantity
          itemCost
          receiveDate
          memoNumber
          order {
            data {
              id
              attributes {
                orderId
                memoNumber
              }
            }
          }
          itemVendor {
            data {
              id
              attributes {
                name
                uuid
              }
            }
          }
          itemContactVendor {
            data {
              id
              attributes {
                fullName
                uuid
              }
            }
          }
        }
      }
    }
    productInventoryItem {
      data {
        id
        attributes {
          uuid
          quantity
          price
          product {
            data {
              id
              attributes {
                uuid
                name
                SKU
                barcode
                model
                defaultPrice
                multiplier
                files(pagination: {limit: 1}) {
                  data {
                    ...FileMin
                  }
                }
                productType {
                  data {
                    id
                    attributes {
                      name
                    }
                  }
                }
              }
            }
          }
          businessLocation {
            data {
              id
              attributes {
                name
              }
            }
          }
        }
      }
    }
  }
}
    `;
export const ProductInventoryItemSelectFragmentDoc = gql`
    fragment ProductInventoryItemSelect on ProductInventoryItemEntity {
  id
  attributes {
    product {
      data {
        id
        attributes {
          name
          files(pagination: {limit: 1}) {
            data {
              ...FileMin
            }
          }
        }
      }
    }
  }
}
    `;
export const ProductInventoryItemPageFragmentDoc = gql`
    fragment ProductInventoryItemPage on ProductInventoryItemEntity {
  id
  attributes {
    price
    quantity
    lowQuantity
    maxQuantity
    minOrderQuantity
    pointsGiven
    customCreationDate
    pointsRedeemed
    storageNotes
    favorite
    isNegativeCount
    isSerializedInventory
    uuid
    active
    rentalPrice
    wholesalePrice
    vendor {
      data {
        id
        attributes {
          name
        }
      }
    }
    sublocation {
      data {
        ...SubLocationMin
      }
    }
    sublocationItems {
      data {
        ...SubLocationItemMin
      }
    }
    product {
      data {
        id
        attributes {
          uuid
        }
      }
    }
    serializes {
      data {
        ...Serialize
      }
    }
    businessLocation {
      data {
        id
        attributes {
          name
        }
      }
    }
    tax {
      data {
        id
        attributes {
          name
        }
      }
    }
    taxCollection {
      data {
        id
        attributes {
          name
        }
      }
    }
  }
}
    `;
export const ProductPageFragmentDoc = gql`
    fragment ProductPage on ProductEntity {
  ...ProductMin
  id
  attributes {
    productInventoryItems {
      data {
        ...ProductInventoryItemPage
      }
    }
    productAttributeOptions {
      data {
        ...ProductAttributeOption
      }
    }
  }
}
    `;
export const ProductPrintFragmentDoc = gql`
    fragment ProductPrint on ProductEntity {
  id
  attributes {
    name
    tagProductName
    SKU
    UPC
    MPN
    defaultPrice
    barcode
  }
}
    `;
export const ProductReportFragmentDoc = gql`
    fragment ProductReport on ProductEntity {
  id
  attributes {
    createdAt
    uuid
    barcode
    name
    SKU
    defaultPrice
    productId
    rentableData {
      data {
        id
        attributes {
          enabled
        }
      }
    }
    quantity(businessLocationId: $businessLocationId, sublocationId: $sublocationId)
    totalQuantitySold(businessLocationId: $businessLocationId)
    numberLocationsPresented
    grossMargin
    quantityOnOrder(businessLocationId: $businessLocationId)
    productInventoryItems(pagination: {limit: -1}) {
      data {
        attributes {
          businessLocation {
            data {
              attributes {
                uuid
                name
              }
            }
          }
          sublocationItems(pagination: {limit: -1}) {
            data {
              id
              attributes {
                sublocation {
                  data {
                    attributes {
                      name
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    weight {
      data {
        id
        attributes {
          value
          unit
        }
      }
    }
    productType {
      data {
        attributes {
          name
        }
      }
    }
    files(pagination: {limit: 1}) {
      data {
        ...FileMin
      }
    }
  }
}
    `;
export const ProductSelectFragmentDoc = gql`
    fragment ProductSelect on ProductEntity {
  id
  attributes {
    name
    defaultPrice
    files(pagination: {limit: 1}) {
      data {
        ...FileMin
      }
    }
    productInventoryItems {
      data {
        attributes {
          businessLocation {
            data {
              attributes {
                name
              }
            }
          }
        }
      }
    }
  }
}
    `;
export const ProductTypeWithItemCategoryFragmentDoc = gql`
    fragment ProductTypeWithItemCategory on ProductTypeEntity {
  id
  attributes {
    name
    itemCategory {
      data {
        id
        attributes {
          name
        }
      }
    }
  }
}
    `;
export const ProductWithLocationAndPriceDataFragmentDoc = gql`
    fragment ProductWithLocationAndPriceData on ProductEntity {
  id
  attributes {
    name
    SKU
    uuid
    defaultPrice
    files(pagination: {limit: 1}) {
      data {
        ...FileMin
      }
    }
    quantity(businessLocationId: $businessLocationId)
    quantitySoldLastWeek(businessLocationId: $businessLocationId)
    tax(businessLocationId: $businessLocationId)
    productInventoryItemId(businessLocationId: $businessLocationId)
  }
}
    `;
export const ProductWithLocationDataFragmentDoc = gql`
    fragment ProductWithLocationData on ProductEntity {
  id
  attributes {
    name
    SKU
    uuid
    files(pagination: {limit: 1}) {
      data {
        ...FileMin
      }
    }
    quantity(businessLocationId: $businessLocationId)
    quantitySoldLastWeek(businessLocationId: $businessLocationId)
  }
}
    `;
export const ProductWithSoldRevenueFragmentDoc = gql`
    fragment ProductWithSoldRevenue on ProductEntity {
  __typename
  id
  attributes {
    name
    SKU
    uuid
    files(pagination: {limit: 1}) {
      data {
        ...FileMin
      }
    }
    quantity(businessLocationId: $businessLocationId)
    soldRevenue(
      input: {startDate: $startDate, endDate: $endDate, businessLocationId: $businessLocationId}
    )
  }
}
    `;
export const WebsiteProductTableFragmentDoc = gql`
    fragment WebsiteProductTable on ProductEntity {
  id
  attributes {
    name
    defaultPrice
    productId
    barcode
    uuid
    createdAt
    serialNumber
    active
    brand {
      data {
        attributes {
          name
        }
      }
    }
    productType {
      data {
        attributes {
          name
        }
      }
    }
    files(pagination: {limit: 1}) {
      data {
        ...FileMin
      }
    }
  }
}
    `;
export const ProductAttributeFragmentDoc = gql`
    fragment ProductAttribute on ProductAttributeEntity {
  ...ProductAttributeMin
  id
  attributes {
    productAttributeOptions {
      data {
        ...ProductAttributeOptionMin
      }
    }
    productTypes {
      data {
        ...ProductType
      }
    }
  }
}
    `;
export const ProductGroupAttributeMinFragmentDoc = gql`
    fragment ProductGroupAttributeMin on ProductGroupAttributeEntity {
  id
  attributes {
    name
  }
}
    `;
export const ProductGroupAttributeOptionMinFragmentDoc = gql`
    fragment ProductGroupAttributeOptionMin on ProductGroupAttributeOptionEntity {
  id
  attributes {
    name
    createdAt
  }
}
    `;
export const ProductGroupAttributeFragmentDoc = gql`
    fragment ProductGroupAttribute on ProductGroupAttributeEntity {
  ...ProductGroupAttributeMin
  id
  attributes {
    productGroupAttributeOptions {
      data {
        ...ProductGroupAttributeOptionMin
      }
    }
  }
}
    `;
export const InventoryProductTableFragmentDoc = gql`
    fragment InventoryProductTable on ProductEntity {
  id
  attributes {
    name
    defaultPrice
    productId
    barcode
    uuid
    SKU
    UPC
    MPN
    tagProductName
    quantity(businessLocationId: $businessLocationId)
    createdAt
    productType {
      data {
        attributes {
          name
        }
      }
    }
    files(pagination: {limit: 1}) {
      data {
        ...FileMin
      }
    }
  }
}
    `;
export const InventoryProductGroupTableFragmentDoc = gql`
    fragment InventoryProductGroupTable on ProductGroupEntity {
  id
  attributes {
    name
    description
    createdAt
    uuid
    productGroupAttributes {
      data {
        ...ProductGroupAttribute
      }
    }
    productGroupItems {
      data {
        attributes {
          product {
            data {
              ...InventoryProductTable
            }
          }
        }
      }
    }
  }
}
    `;
export const ProductGroupMinFragmentDoc = gql`
    fragment ProductGroupMin on ProductGroupEntity {
  id
  attributes {
    name
    description
    createdAt
    uuid
  }
}
    `;
export const ProductGroupAttributeOptionFragmentDoc = gql`
    fragment ProductGroupAttributeOption on ProductGroupAttributeOptionEntity {
  ...ProductGroupAttributeOptionMin
  id
  attributes {
    productGroupAttribute {
      data {
        ...ProductGroupAttributeMin
      }
    }
  }
}
    `;
export const ProductGroupItemFragmentDoc = gql`
    fragment ProductGroupItem on ProductGroupItemEntity {
  id
  attributes {
    product {
      data {
        id
      }
    }
    productGroupAttributeOptions {
      data {
        ...ProductGroupAttributeOption
      }
    }
    productGroup {
      data {
        ...ProductGroupMin
      }
    }
  }
}
    `;
export const ProductGroupFragmentDoc = gql`
    fragment ProductGroup on ProductGroupEntity {
  ...ProductGroupMin
  id
  attributes {
    productGroupAttributes {
      data {
        ...ProductGroupAttribute
      }
    }
    productGroupItems {
      data {
        ...ProductGroupItem
      }
    }
  }
}
    `;
export const ProductSettingFragmentDoc = gql`
    fragment ProductSetting on ProductSettingEntity {
  id
  attributes {
    returnableItem
    trackProductInventory
    allowNegativeQuantity
    visibleItem
    bulkProductsAiPrompt {
      productName
      MPN
      quantity
      unit
      weight
      SKU
      brand
      productType
      metalType
      metalGrade
      defaultPrice
      description
      discount
    }
    aiPrompt {
      productName
      tagProductName
      ecommerceName
      shopifyTags
      appraisalDescription
      ecommerceDescription
      SKU
      note
    }
    defaultPurchaseTax {
      data {
        id
      }
    }
    defaultPaymentMethod {
      data {
        id
      }
    }
    isAppraisalDescriptionEnabled
    isBrandEnabled
    isCostEnabled
    isDimensionEnabled
    isEanEnabled
    isEcommerceDescriptionEnabled
    isEcommerceNameEnabled
    isExpiresEnabled
    isForBundleUseOnlyEnabled
    isForBusinessOnlyEnabled
    isIsbnEnabled
    isLaborWarrantyEnabled
    isLowQuantityEnabled
    isMaxQuantityEnabled
    isMinimumOrderQuantityEnabled
    isModelEnabled
    isMpnEnabled
    isNoteEnabled
    isPackagingProductEnabled
    isPartsWarrantyEnabled
    isPointsGivenEnabled
    isPointsRedeemEnabled
    isPriceEnabled
    isRentableEnabled
    isRetailPriceMultiplierEnabled
    isReturnableItemEnabled
    isRevenueEnabled
    isShopifyCollectionEnabled
    isShopifyTagsEnabled
    isSkuEnabled
    isStorageNotesEnabled
    isTaxEnabled
    isUpcEnabled
    isVendorEnabled
    isWeightEnabled
    isWholesalePriceMultiplierEnabled
    isWoocommerceCategoryEnabled
  }
}
    `;
export const QuestionFragmentDoc = gql`
    fragment Question on QuestionEntity {
  id
  attributes {
    title
    answer
    active
    createdAt
    owner {
      data {
        id
      }
    }
  }
}
    `;
export const QuickPaySettingsFragmentDoc = gql`
    fragment QuickPaySettings on QuickPaySettingEntity {
  id
  attributes {
    title
    sellingPayingAmountPercentage
    sellingOrderManagementPayingAmountPercentage
    quickPayOption
    quickPayCardOption
    quickPayLinkOption
    isEnabled
    quickPayCustomMethod {
      data {
        id
      }
    }
    tenant {
      data {
        id
      }
    }
  }
}
    `;
export const RateFragmentDoc = gql`
    fragment Rate on RateEntity {
  id
  attributes {
    createdAt
    suggestions
    isRecommended
    isLoved
    evaluation
  }
}
    `;
export const ReportsScheduleFragmentDoc = gql`
    fragment ReportsSchedule on ReportsScheduleEntity {
  id
  attributes {
    scheduleCustomersReport
    scheduleInventoryReport
    scheduleMarketingReport
    scheduleSalesReport
    scheduleSalesItemReport
    scheduleTaxesReport
    scheduleDailySummaryReport
  }
}
    `;
export const InventoryResourceTableFragmentDoc = gql`
    fragment InventoryResourceTable on ResourceEntity {
  id
  attributes {
    name
    createdAt
    uuid
    creator {
      data {
        id
        attributes {
          fullName
          avatar {
            data {
              ...FileMin
            }
          }
        }
      }
    }
  }
}
    `;
export const ResourceMinFragmentDoc = gql`
    fragment ResourceMin on ResourceEntity {
  id
  attributes {
    name
    maintenanceNeeded
    createdAt
    uuid
  }
}
    `;
export const ResourceInventoryItemFragmentDoc = gql`
    fragment ResourceInventoryItem on ResourceInventoryItemEntity {
  id
  attributes {
    quantity
    store {
      data {
        id
        attributes {
          name
        }
      }
    }
    resource {
      data {
        ...ResourceMin
      }
    }
  }
}
    `;
export const ResourceFragmentDoc = gql`
    fragment Resource on ResourceEntity {
  ...ResourceMin
  id
  attributes {
    resourceInventoryItems {
      data {
        ...ResourceInventoryItem
      }
    }
  }
}
    `;
export const ResourceCountFragmentDoc = gql`
    fragment ResourceCount on ResourceCountEntity {
  id
  attributes {
    count
    resourceInventoryItem {
      data {
        ...ResourceInventoryItem
      }
    }
  }
}
    `;
export const RoleFragmentDoc = gql`
    fragment Role on UsersPermissionsRoleEntityResponse {
  data {
    id
    attributes {
      name
      description
      type
    }
  }
}
    `;
export const ServiceSettingFragmentDoc = gql`
    fragment ServiceSetting on ServiceSettingEntity {
  id
  attributes {
    defaultPerformer {
      data {
        id
      }
    }
  }
}
    `;
export const ShipmentCarrierFragmentDoc = gql`
    fragment ShipmentCarrier on ShipmentCarrierEntity {
  id
  attributes {
    name
  }
}
    `;
export const ShipmentFragmentDoc = gql`
    fragment Shipment on ShipmentEntity {
  id
  attributes {
    uuid
    status
    createdAt
    shipmentDate
    charge
    trackingNumber
    trackingUrl
    notes
    order {
      data {
        id
        attributes {
          orderId
        }
      }
    }
    carrier {
      data {
        ...ShipmentCarrier
      }
    }
    contact {
      data {
        id
        attributes {
          uuid
          fullName
          avatar {
            data {
              ...FileMin
            }
          }
        }
      }
    }
    company {
      data {
        id
        attributes {
          uuid
          name
          avatar {
            data {
              ...FileMin
            }
          }
        }
      }
    }
  }
}
    `;
export const TaxSelectFragmentDoc = gql`
    fragment TaxSelect on TaxEntity {
  id
  attributes {
    name
  }
}
    `;
export const TaxCollectionFragmentDoc = gql`
    fragment TaxCollection on TaxCollectionEntity {
  ...TaxCollectionMin
  attributes {
    taxes {
      data {
        ...TaxMin
      }
    }
  }
}
    `;
export const TransferOrderMinFragmentDoc = gql`
    fragment TransferOrderMin on TransferOrderEntity {
  attributes {
    uuid
    transferId
    reason
    status
  }
}
    `;
export const InventoryTransferOrderFragmentDoc = gql`
    fragment InventoryTransferOrder on TransferOrderEntity {
  ...TransferOrderMin
  id
  attributes {
    orderDate
    employeeReceivedDate
    employeeConfirmed {
      data {
        attributes {
          fullName
        }
      }
    }
    locationFrom {
      data {
        attributes {
          name
        }
      }
    }
    sublocationFrom {
      data {
        attributes {
          name
        }
      }
    }
    locationTo {
      data {
        attributes {
          name
        }
      }
    }
    sublocationTo {
      data {
        attributes {
          name
        }
      }
    }
    employee {
      data {
        attributes {
          fullName
        }
      }
    }
  }
}
    `;
export const TransferOrderFragmentDoc = gql`
    fragment TransferOrder on TransferOrderEntity {
  ...TransferOrderMin
  id
  attributes {
    notes
    createdAt
    locationTo {
      data {
        id
      }
    }
    sublocationTo {
      data {
        id
      }
    }
    locationFrom {
      data {
        id
      }
    }
    sublocationFrom {
      data {
        id
      }
    }
    employeeConfirmed {
      data {
        id
      }
    }
    files {
      data {
        ...File
      }
    }
  }
}
    `;
export const TransferOrderItemMinFragmentDoc = gql`
    fragment TransferOrderItemMin on TransferOrderItemEntity {
  attributes {
    quantityFrom
    quantityTo
    transferQuantity
  }
}
    `;
export const TransferOrderItemFragmentDoc = gql`
    fragment TransferOrderItem on TransferOrderItemEntity {
  ...TransferOrderItemMin
  id
  attributes {
    product {
      data {
        id
      }
    }
    sublocationItem {
      data {
        id
      }
    }
    serializes {
      data {
        id
      }
    }
  }
}
    `;
export const TenantFragmentDoc = gql`
    fragment Tenant on TenantEntity {
  id
  attributes {
    companyName
    slug
    credits
    autoRechargeCredit
    thresholdBalance
    rechargeToBalance
    email
    emailSender
    phoneNumber
    websiteUrl
    paymentGatewayType
    onboarding {
      data {
        id
        attributes {
          isCompleted
        }
      }
    }
    logo {
      data {
        ...File
      }
    }
    mainLocation {
      data {
        ...Location
      }
    }
  }
}
    `;
export const UsageFragmentDoc = gql`
    fragment Usage on UsageEntity {
  id
  attributes {
    currentMonth
    tenant {
      data {
        ...Tenant
      }
    }
    updatedAt
    usageCounts
  }
}
    `;
export const UserFragmentDoc = gql`
    fragment User on UsersPermissionsUserEntity {
  ...UserMin
  id
  attributes {
    confirmed
    firstName
    lastName
    phoneNumber
    createdAt
    blocked
    fullName
    jobTitle
    tenant {
      data {
        ...Tenant
      }
    }
  }
}
    `;
export const UserDataFragmentDoc = gql`
    fragment UserData on UsersPermissionsUserEntity {
  id
  attributes {
    firstName
    lastName
    fullName
    jobTitle
    email
    phoneNumber
    avatar {
      data {
        ...FileMin
      }
    }
    role {
      data {
        id
        attributes {
          name
        }
      }
    }
  }
}
    `;
export const UserTableFragmentDoc = gql`
    fragment UserTable on UsersPermissionsUserEntity {
  id
  attributes {
    firstName
    lastName
    fullName
    jobTitle
    email
    phoneNumber
    createdAt
    confirmed
    blocked
    avatar {
      data {
        ...FileMin
      }
    }
    role {
      data {
        id
        attributes {
          name
        }
      }
    }
    businessLocation {
      data {
        id
        attributes {
          name
        }
      }
    }
    payRate {
      data {
        id
        attributes {
          period
          rate
        }
      }
    }
  }
}
    `;
export const ChangePasswordDocument = gql`
    mutation changePassword($currentPassword: String!, $password: String!, $passwordConfirmation: String!) {
  changePassword(
    currentPassword: $currentPassword
    password: $password
    passwordConfirmation: $passwordConfirmation
  ) {
    jwt
  }
}
    `;
export type ChangePasswordMutationFn = Apollo.MutationFunction<ChangePasswordMutation, ChangePasswordMutationVariables>;
export function useChangePasswordMutation(baseOptions?: Apollo.MutationHookOptions<ChangePasswordMutation, ChangePasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument, options);
      }
export type ChangePasswordMutationHookResult = ReturnType<typeof useChangePasswordMutation>;
export type ChangePasswordMutationResult = Apollo.MutationResult<ChangePasswordMutation>;
export const ConfirmEmailDocument = gql`
    mutation confirmEmail($confirmation: String!) {
  emailConfirmation(confirmation: $confirmation) {
    user {
      id
    }
  }
}
    `;
export type ConfirmEmailMutationFn = Apollo.MutationFunction<ConfirmEmailMutation, ConfirmEmailMutationVariables>;
export function useConfirmEmailMutation(baseOptions?: Apollo.MutationHookOptions<ConfirmEmailMutation, ConfirmEmailMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ConfirmEmailMutation, ConfirmEmailMutationVariables>(ConfirmEmailDocument, options);
      }
export type ConfirmEmailMutationHookResult = ReturnType<typeof useConfirmEmailMutation>;
export type ConfirmEmailMutationResult = Apollo.MutationResult<ConfirmEmailMutation>;
export const ForgotPasswordDocument = gql`
    mutation forgotPassword($email: String!) {
  forgotPassword(email: $email) {
    ok
  }
}
    `;
export type ForgotPasswordMutationFn = Apollo.MutationFunction<ForgotPasswordMutation, ForgotPasswordMutationVariables>;
export function useForgotPasswordMutation(baseOptions?: Apollo.MutationHookOptions<ForgotPasswordMutation, ForgotPasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument, options);
      }
export type ForgotPasswordMutationHookResult = ReturnType<typeof useForgotPasswordMutation>;
export type ForgotPasswordMutationResult = Apollo.MutationResult<ForgotPasswordMutation>;
export const LoginDocument = gql`
    mutation login($input: UsersPermissionsLoginInput!) {
  login(input: $input) {
    user {
      id
    }
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export const RegisterDocument = gql`
    mutation register($input: UsersPermissionsRegisterInput!) {
  register(input: $input) {
    user {
      id
      username
      email
      confirmed
      blocked
      role {
        id
        name
        description
        type
      }
    }
  }
}
    `;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, options);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export const RegisterCustomerDocument = gql`
    mutation registerCustomer($input: CustomerUserRegisterInput!) {
  registerCustomer(input: $input) {
    jwt
    user {
      id
      username
      email
      confirmed
      blocked
      role {
        id
        name
        description
        type
      }
    }
  }
}
    `;
export type RegisterCustomerMutationFn = Apollo.MutationFunction<RegisterCustomerMutation, RegisterCustomerMutationVariables>;
export function useRegisterCustomerMutation(baseOptions?: Apollo.MutationHookOptions<RegisterCustomerMutation, RegisterCustomerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterCustomerMutation, RegisterCustomerMutationVariables>(RegisterCustomerDocument, options);
      }
export type RegisterCustomerMutationHookResult = ReturnType<typeof useRegisterCustomerMutation>;
export type RegisterCustomerMutationResult = Apollo.MutationResult<RegisterCustomerMutation>;
export const ResetPasswordDocument = gql`
    mutation resetPassword($code: String!, $password: String!, $passwordConfirmation: String!) {
  resetPassword(
    code: $code
    password: $password
    passwordConfirmation: $passwordConfirmation
  ) {
    user {
      id
    }
  }
}
    `;
export type ResetPasswordMutationFn = Apollo.MutationFunction<ResetPasswordMutation, ResetPasswordMutationVariables>;
export function useResetPasswordMutation(baseOptions?: Apollo.MutationHookOptions<ResetPasswordMutation, ResetPasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ResetPasswordMutation, ResetPasswordMutationVariables>(ResetPasswordDocument, options);
      }
export type ResetPasswordMutationHookResult = ReturnType<typeof useResetPasswordMutation>;
export type ResetPasswordMutationResult = Apollo.MutationResult<ResetPasswordMutation>;
export const SendEmailDocument = gql`
    mutation sendEmail($data: SendEmailInput!) {
  sendEmail(data: $data)
}
    `;
export type SendEmailMutationFn = Apollo.MutationFunction<SendEmailMutation, SendEmailMutationVariables>;
export function useSendEmailMutation(baseOptions?: Apollo.MutationHookOptions<SendEmailMutation, SendEmailMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SendEmailMutation, SendEmailMutationVariables>(SendEmailDocument, options);
      }
export type SendEmailMutationHookResult = ReturnType<typeof useSendEmailMutation>;
export type SendEmailMutationResult = Apollo.MutationResult<SendEmailMutation>;
export const AuthLayoutContentDocument = gql`
    query authLayoutContent {
  authLayout {
    data {
      attributes {
        authContent {
          ...AuthContent
        }
      }
    }
  }
}
    ${AuthContentFragmentDoc}
${FileFragmentDoc}
${HeadlineFragmentDoc}`;
export function useAuthLayoutContentQuery(baseOptions?: Apollo.QueryHookOptions<AuthLayoutContentQuery, AuthLayoutContentQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AuthLayoutContentQuery, AuthLayoutContentQueryVariables>(AuthLayoutContentDocument, options);
      }
export function useAuthLayoutContentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AuthLayoutContentQuery, AuthLayoutContentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AuthLayoutContentQuery, AuthLayoutContentQueryVariables>(AuthLayoutContentDocument, options);
        }
export type AuthLayoutContentQueryHookResult = ReturnType<typeof useAuthLayoutContentQuery>;
export type AuthLayoutContentLazyQueryHookResult = ReturnType<typeof useAuthLayoutContentLazyQuery>;
export type AuthLayoutContentQueryResult = Apollo.QueryResult<AuthLayoutContentQuery, AuthLayoutContentQueryVariables>;
export const AuthLayoutHeadlineDocument = gql`
    query authLayoutHeadline {
  authLayout {
    data {
      attributes {
        headline {
          ...Headline
        }
      }
    }
  }
}
    ${HeadlineFragmentDoc}`;
export function useAuthLayoutHeadlineQuery(baseOptions?: Apollo.QueryHookOptions<AuthLayoutHeadlineQuery, AuthLayoutHeadlineQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AuthLayoutHeadlineQuery, AuthLayoutHeadlineQueryVariables>(AuthLayoutHeadlineDocument, options);
      }
export function useAuthLayoutHeadlineLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AuthLayoutHeadlineQuery, AuthLayoutHeadlineQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AuthLayoutHeadlineQuery, AuthLayoutHeadlineQueryVariables>(AuthLayoutHeadlineDocument, options);
        }
export type AuthLayoutHeadlineQueryHookResult = ReturnType<typeof useAuthLayoutHeadlineQuery>;
export type AuthLayoutHeadlineLazyQueryHookResult = ReturnType<typeof useAuthLayoutHeadlineLazyQuery>;
export type AuthLayoutHeadlineQueryResult = Apollo.QueryResult<AuthLayoutHeadlineQuery, AuthLayoutHeadlineQueryVariables>;
export const MeDocument = gql`
    query me {
  me {
    ...User
  }
}
    ${UserFragmentDoc}
${UserMinFragmentDoc}
${FileFragmentDoc}
${TenantFragmentDoc}
${LocationFragmentDoc}`;
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const PasswordTokenValidDocument = gql`
    query passwordTokenValid($code: String!, $email: String!) {
  passwordTokenValid(code: $code, email: $email) {
    isValid
  }
}
    `;
export function usePasswordTokenValidQuery(baseOptions: Apollo.QueryHookOptions<PasswordTokenValidQuery, PasswordTokenValidQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PasswordTokenValidQuery, PasswordTokenValidQueryVariables>(PasswordTokenValidDocument, options);
      }
export function usePasswordTokenValidLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PasswordTokenValidQuery, PasswordTokenValidQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PasswordTokenValidQuery, PasswordTokenValidQueryVariables>(PasswordTokenValidDocument, options);
        }
export type PasswordTokenValidQueryHookResult = ReturnType<typeof usePasswordTokenValidQuery>;
export type PasswordTokenValidLazyQueryHookResult = ReturnType<typeof usePasswordTokenValidLazyQuery>;
export type PasswordTokenValidQueryResult = Apollo.QueryResult<PasswordTokenValidQuery, PasswordTokenValidQueryVariables>;
export const CreateBusinessLocationDocument = gql`
    mutation createBusinessLocation($input: BusinessLocationInput!) {
  createBusinessLocation(data: $input) {
    data {
      id
    }
  }
}
    `;
export type CreateBusinessLocationMutationFn = Apollo.MutationFunction<CreateBusinessLocationMutation, CreateBusinessLocationMutationVariables>;
export function useCreateBusinessLocationMutation(baseOptions?: Apollo.MutationHookOptions<CreateBusinessLocationMutation, CreateBusinessLocationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateBusinessLocationMutation, CreateBusinessLocationMutationVariables>(CreateBusinessLocationDocument, options);
      }
export type CreateBusinessLocationMutationHookResult = ReturnType<typeof useCreateBusinessLocationMutation>;
export type CreateBusinessLocationMutationResult = Apollo.MutationResult<CreateBusinessLocationMutation>;
export const CreateSubLocationDocument = gql`
    mutation createSubLocation($input: SublocationInput!) {
  createSublocation(data: $input) {
    data {
      id
    }
  }
}
    `;
export type CreateSubLocationMutationFn = Apollo.MutationFunction<CreateSubLocationMutation, CreateSubLocationMutationVariables>;
export function useCreateSubLocationMutation(baseOptions?: Apollo.MutationHookOptions<CreateSubLocationMutation, CreateSubLocationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSubLocationMutation, CreateSubLocationMutationVariables>(CreateSubLocationDocument, options);
      }
export type CreateSubLocationMutationHookResult = ReturnType<typeof useCreateSubLocationMutation>;
export type CreateSubLocationMutationResult = Apollo.MutationResult<CreateSubLocationMutation>;
export const CreateSubLocationItemDocument = gql`
    mutation createSubLocationItem($input: SublocationItemInput!) {
  createSublocationItem(data: $input) {
    data {
      id
    }
  }
}
    `;
export type CreateSubLocationItemMutationFn = Apollo.MutationFunction<CreateSubLocationItemMutation, CreateSubLocationItemMutationVariables>;
export function useCreateSubLocationItemMutation(baseOptions?: Apollo.MutationHookOptions<CreateSubLocationItemMutation, CreateSubLocationItemMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSubLocationItemMutation, CreateSubLocationItemMutationVariables>(CreateSubLocationItemDocument, options);
      }
export type CreateSubLocationItemMutationHookResult = ReturnType<typeof useCreateSubLocationItemMutation>;
export type CreateSubLocationItemMutationResult = Apollo.MutationResult<CreateSubLocationItemMutation>;
export const UpdateBusinessLocationDocument = gql`
    mutation updateBusinessLocation($id: ID!, $input: BusinessLocationInput!) {
  updateBusinessLocation(id: $id, data: $input) {
    data {
      id
      attributes {
        archived
      }
    }
  }
}
    `;
export type UpdateBusinessLocationMutationFn = Apollo.MutationFunction<UpdateBusinessLocationMutation, UpdateBusinessLocationMutationVariables>;
export function useUpdateBusinessLocationMutation(baseOptions?: Apollo.MutationHookOptions<UpdateBusinessLocationMutation, UpdateBusinessLocationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateBusinessLocationMutation, UpdateBusinessLocationMutationVariables>(UpdateBusinessLocationDocument, options);
      }
export type UpdateBusinessLocationMutationHookResult = ReturnType<typeof useUpdateBusinessLocationMutation>;
export type UpdateBusinessLocationMutationResult = Apollo.MutationResult<UpdateBusinessLocationMutation>;
export const UpdateSublocationDocument = gql`
    mutation updateSublocation($id: ID!, $input: SublocationInput!) {
  updateSublocation(id: $id, data: $input) {
    data {
      id
    }
  }
}
    `;
export type UpdateSublocationMutationFn = Apollo.MutationFunction<UpdateSublocationMutation, UpdateSublocationMutationVariables>;
export function useUpdateSublocationMutation(baseOptions?: Apollo.MutationHookOptions<UpdateSublocationMutation, UpdateSublocationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateSublocationMutation, UpdateSublocationMutationVariables>(UpdateSublocationDocument, options);
      }
export type UpdateSublocationMutationHookResult = ReturnType<typeof useUpdateSublocationMutation>;
export type UpdateSublocationMutationResult = Apollo.MutationResult<UpdateSublocationMutation>;
export const UpdateSublocationItemDocument = gql`
    mutation updateSublocationItem($id: ID!, $input: SublocationItemInput!) {
  updateSublocationItem(id: $id, data: $input) {
    data {
      id
    }
  }
}
    `;
export type UpdateSublocationItemMutationFn = Apollo.MutationFunction<UpdateSublocationItemMutation, UpdateSublocationItemMutationVariables>;
export function useUpdateSublocationItemMutation(baseOptions?: Apollo.MutationHookOptions<UpdateSublocationItemMutation, UpdateSublocationItemMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateSublocationItemMutation, UpdateSublocationItemMutationVariables>(UpdateSublocationItemDocument, options);
      }
export type UpdateSublocationItemMutationHookResult = ReturnType<typeof useUpdateSublocationItemMutation>;
export type UpdateSublocationItemMutationResult = Apollo.MutationResult<UpdateSublocationItemMutation>;
export const BusinessLocationDocument = gql`
    query businessLocation($id: ID!) {
  businessLocation(id: $id) {
    data {
      ...BusinessLocation
    }
  }
}
    ${BusinessLocationFragmentDoc}
${LocationFragmentDoc}
${TaxMinFragmentDoc}
${TaxCollectionMinFragmentDoc}
${SubLocationMinFragmentDoc}`;
export function useBusinessLocationQuery(baseOptions: Apollo.QueryHookOptions<BusinessLocationQuery, BusinessLocationQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BusinessLocationQuery, BusinessLocationQueryVariables>(BusinessLocationDocument, options);
      }
export function useBusinessLocationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BusinessLocationQuery, BusinessLocationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BusinessLocationQuery, BusinessLocationQueryVariables>(BusinessLocationDocument, options);
        }
export type BusinessLocationQueryHookResult = ReturnType<typeof useBusinessLocationQuery>;
export type BusinessLocationLazyQueryHookResult = ReturnType<typeof useBusinessLocationLazyQuery>;
export type BusinessLocationQueryResult = Apollo.QueryResult<BusinessLocationQuery, BusinessLocationQueryVariables>;
export const BusinessLocationTaxDocument = gql`
    query businessLocationTax($id: ID!) {
  businessLocation(id: $id) {
    data {
      ...BusinessLocationTax
    }
  }
}
    ${BusinessLocationTaxFragmentDoc}`;
export function useBusinessLocationTaxQuery(baseOptions: Apollo.QueryHookOptions<BusinessLocationTaxQuery, BusinessLocationTaxQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BusinessLocationTaxQuery, BusinessLocationTaxQueryVariables>(BusinessLocationTaxDocument, options);
      }
export function useBusinessLocationTaxLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BusinessLocationTaxQuery, BusinessLocationTaxQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BusinessLocationTaxQuery, BusinessLocationTaxQueryVariables>(BusinessLocationTaxDocument, options);
        }
export type BusinessLocationTaxQueryHookResult = ReturnType<typeof useBusinessLocationTaxQuery>;
export type BusinessLocationTaxLazyQueryHookResult = ReturnType<typeof useBusinessLocationTaxLazyQuery>;
export type BusinessLocationTaxQueryResult = Apollo.QueryResult<BusinessLocationTaxQuery, BusinessLocationTaxQueryVariables>;
export const BusinessLocationsDocument = gql`
    query businessLocations($filters: BusinessLocationFiltersInput, $pagination: PaginationArg, $sort: [String]) {
  businessLocations(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...BusinessLocation
    }
    meta {
      ...Meta
    }
  }
}
    ${BusinessLocationFragmentDoc}
${LocationFragmentDoc}
${TaxMinFragmentDoc}
${TaxCollectionMinFragmentDoc}
${SubLocationMinFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useBusinessLocationsQuery(baseOptions?: Apollo.QueryHookOptions<BusinessLocationsQuery, BusinessLocationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BusinessLocationsQuery, BusinessLocationsQueryVariables>(BusinessLocationsDocument, options);
      }
export function useBusinessLocationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BusinessLocationsQuery, BusinessLocationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BusinessLocationsQuery, BusinessLocationsQueryVariables>(BusinessLocationsDocument, options);
        }
export type BusinessLocationsQueryHookResult = ReturnType<typeof useBusinessLocationsQuery>;
export type BusinessLocationsLazyQueryHookResult = ReturnType<typeof useBusinessLocationsLazyQuery>;
export type BusinessLocationsQueryResult = Apollo.QueryResult<BusinessLocationsQuery, BusinessLocationsQueryVariables>;
export const BusinessLocationsCardsDocument = gql`
    query businessLocationsCards($filters: BusinessLocationFiltersInput, $sort: [String]) {
  businessLocations(filters: $filters, pagination: {limit: -1}, sort: $sort) {
    data {
      ...BusinessLocationCard
    }
    meta {
      ...Meta
    }
  }
}
    ${BusinessLocationCardFragmentDoc}
${LocationFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useBusinessLocationsCardsQuery(baseOptions?: Apollo.QueryHookOptions<BusinessLocationsCardsQuery, BusinessLocationsCardsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BusinessLocationsCardsQuery, BusinessLocationsCardsQueryVariables>(BusinessLocationsCardsDocument, options);
      }
export function useBusinessLocationsCardsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BusinessLocationsCardsQuery, BusinessLocationsCardsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BusinessLocationsCardsQuery, BusinessLocationsCardsQueryVariables>(BusinessLocationsCardsDocument, options);
        }
export type BusinessLocationsCardsQueryHookResult = ReturnType<typeof useBusinessLocationsCardsQuery>;
export type BusinessLocationsCardsLazyQueryHookResult = ReturnType<typeof useBusinessLocationsCardsLazyQuery>;
export type BusinessLocationsCardsQueryResult = Apollo.QueryResult<BusinessLocationsCardsQuery, BusinessLocationsCardsQueryVariables>;
export const BusinessLocationsDropdownDocument = gql`
    query businessLocationsDropdown($filters: BusinessLocationFiltersInput, $sort: [String]) {
  businessLocations(filters: $filters, pagination: {limit: -1}, sort: $sort) {
    data {
      ...BusinessLocationDropdown
    }
    meta {
      ...Meta
    }
  }
}
    ${BusinessLocationDropdownFragmentDoc}
${LocationFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useBusinessLocationsDropdownQuery(baseOptions?: Apollo.QueryHookOptions<BusinessLocationsDropdownQuery, BusinessLocationsDropdownQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BusinessLocationsDropdownQuery, BusinessLocationsDropdownQueryVariables>(BusinessLocationsDropdownDocument, options);
      }
export function useBusinessLocationsDropdownLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BusinessLocationsDropdownQuery, BusinessLocationsDropdownQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BusinessLocationsDropdownQuery, BusinessLocationsDropdownQueryVariables>(BusinessLocationsDropdownDocument, options);
        }
export type BusinessLocationsDropdownQueryHookResult = ReturnType<typeof useBusinessLocationsDropdownQuery>;
export type BusinessLocationsDropdownLazyQueryHookResult = ReturnType<typeof useBusinessLocationsDropdownLazyQuery>;
export type BusinessLocationsDropdownQueryResult = Apollo.QueryResult<BusinessLocationsDropdownQuery, BusinessLocationsDropdownQueryVariables>;
export const BusinessLocationsSelectDocument = gql`
    query businessLocationsSelect($filters: BusinessLocationFiltersInput, $pagination: PaginationArg, $sort: [String]) {
  businessLocations(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...BusinessLocationSelect
    }
  }
}
    ${BusinessLocationSelectFragmentDoc}`;
export function useBusinessLocationsSelectQuery(baseOptions?: Apollo.QueryHookOptions<BusinessLocationsSelectQuery, BusinessLocationsSelectQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BusinessLocationsSelectQuery, BusinessLocationsSelectQueryVariables>(BusinessLocationsSelectDocument, options);
      }
export function useBusinessLocationsSelectLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BusinessLocationsSelectQuery, BusinessLocationsSelectQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BusinessLocationsSelectQuery, BusinessLocationsSelectQueryVariables>(BusinessLocationsSelectDocument, options);
        }
export type BusinessLocationsSelectQueryHookResult = ReturnType<typeof useBusinessLocationsSelectQuery>;
export type BusinessLocationsSelectLazyQueryHookResult = ReturnType<typeof useBusinessLocationsSelectLazyQuery>;
export type BusinessLocationsSelectQueryResult = Apollo.QueryResult<BusinessLocationsSelectQuery, BusinessLocationsSelectQueryVariables>;
export const SublocationItemsDocument = gql`
    query sublocationItems($filters: SublocationItemFiltersInput, $pagination: PaginationArg, $sort: [String]) {
  sublocationItems(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...SubLocationItem
    }
    meta {
      ...Meta
    }
  }
}
    ${SubLocationItemFragmentDoc}
${SubLocationItemMinFragmentDoc}
${SubLocationMinFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useSublocationItemsQuery(baseOptions?: Apollo.QueryHookOptions<SublocationItemsQuery, SublocationItemsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SublocationItemsQuery, SublocationItemsQueryVariables>(SublocationItemsDocument, options);
      }
export function useSublocationItemsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SublocationItemsQuery, SublocationItemsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SublocationItemsQuery, SublocationItemsQueryVariables>(SublocationItemsDocument, options);
        }
export type SublocationItemsQueryHookResult = ReturnType<typeof useSublocationItemsQuery>;
export type SublocationItemsLazyQueryHookResult = ReturnType<typeof useSublocationItemsLazyQuery>;
export type SublocationItemsQueryResult = Apollo.QueryResult<SublocationItemsQuery, SublocationItemsQueryVariables>;
export const SublocationItemsInventoryTableDocument = gql`
    query sublocationItemsInventoryTable($filters: SublocationItemFiltersInput) {
  sublocationItems(filters: $filters, pagination: {limit: -1}) {
    data {
      ...SubLocationItemInventoryTable
    }
  }
}
    ${SubLocationItemInventoryTableFragmentDoc}`;
export function useSublocationItemsInventoryTableQuery(baseOptions?: Apollo.QueryHookOptions<SublocationItemsInventoryTableQuery, SublocationItemsInventoryTableQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SublocationItemsInventoryTableQuery, SublocationItemsInventoryTableQueryVariables>(SublocationItemsInventoryTableDocument, options);
      }
export function useSublocationItemsInventoryTableLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SublocationItemsInventoryTableQuery, SublocationItemsInventoryTableQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SublocationItemsInventoryTableQuery, SublocationItemsInventoryTableQueryVariables>(SublocationItemsInventoryTableDocument, options);
        }
export type SublocationItemsInventoryTableQueryHookResult = ReturnType<typeof useSublocationItemsInventoryTableQuery>;
export type SublocationItemsInventoryTableLazyQueryHookResult = ReturnType<typeof useSublocationItemsInventoryTableLazyQuery>;
export type SublocationItemsInventoryTableQueryResult = Apollo.QueryResult<SublocationItemsInventoryTableQuery, SublocationItemsInventoryTableQueryVariables>;
export const SublocationItemsQuantityDocument = gql`
    query sublocationItemsQuantity($filters: SublocationItemFiltersInput, $pagination: PaginationArg, $sort: [String]) {
  sublocationItems(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...SubLocationItemQuantity
    }
  }
}
    ${SubLocationItemQuantityFragmentDoc}`;
export function useSublocationItemsQuantityQuery(baseOptions?: Apollo.QueryHookOptions<SublocationItemsQuantityQuery, SublocationItemsQuantityQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SublocationItemsQuantityQuery, SublocationItemsQuantityQueryVariables>(SublocationItemsQuantityDocument, options);
      }
export function useSublocationItemsQuantityLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SublocationItemsQuantityQuery, SublocationItemsQuantityQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SublocationItemsQuantityQuery, SublocationItemsQuantityQueryVariables>(SublocationItemsQuantityDocument, options);
        }
export type SublocationItemsQuantityQueryHookResult = ReturnType<typeof useSublocationItemsQuantityQuery>;
export type SublocationItemsQuantityLazyQueryHookResult = ReturnType<typeof useSublocationItemsQuantityLazyQuery>;
export type SublocationItemsQuantityQueryResult = Apollo.QueryResult<SublocationItemsQuantityQuery, SublocationItemsQuantityQueryVariables>;
export const SubLocationsDocument = gql`
    query subLocations($filters: SublocationFiltersInput, $pagination: PaginationArg, $sort: [String]) {
  sublocations(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...SubLocation
    }
  }
}
    ${SubLocationFragmentDoc}
${SubLocationMinFragmentDoc}
${FileMinFragmentDoc}`;
export function useSubLocationsQuery(baseOptions?: Apollo.QueryHookOptions<SubLocationsQuery, SubLocationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SubLocationsQuery, SubLocationsQueryVariables>(SubLocationsDocument, options);
      }
export function useSubLocationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SubLocationsQuery, SubLocationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SubLocationsQuery, SubLocationsQueryVariables>(SubLocationsDocument, options);
        }
export type SubLocationsQueryHookResult = ReturnType<typeof useSubLocationsQuery>;
export type SubLocationsLazyQueryHookResult = ReturnType<typeof useSubLocationsLazyQuery>;
export type SubLocationsQueryResult = Apollo.QueryResult<SubLocationsQuery, SubLocationsQueryVariables>;
export const SubLocationsListDocument = gql`
    query subLocationsList($filters: SublocationFiltersInput, $sort: [String]) {
  sublocations(filters: $filters, pagination: {limit: -1}, sort: $sort) {
    data {
      ...SubLocationMin
    }
  }
}
    ${SubLocationMinFragmentDoc}`;
export function useSubLocationsListQuery(baseOptions?: Apollo.QueryHookOptions<SubLocationsListQuery, SubLocationsListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SubLocationsListQuery, SubLocationsListQueryVariables>(SubLocationsListDocument, options);
      }
export function useSubLocationsListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SubLocationsListQuery, SubLocationsListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SubLocationsListQuery, SubLocationsListQueryVariables>(SubLocationsListDocument, options);
        }
export type SubLocationsListQueryHookResult = ReturnType<typeof useSubLocationsListQuery>;
export type SubLocationsListLazyQueryHookResult = ReturnType<typeof useSubLocationsListLazyQuery>;
export type SubLocationsListQueryResult = Apollo.QueryResult<SubLocationsListQuery, SubLocationsListQueryVariables>;
export const SubLocationsSelectDocument = gql`
    query subLocationsSelect($filters: SublocationFiltersInput, $pagination: PaginationArg, $sort: [String]) {
  sublocations(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...SubLocationSelect
    }
  }
}
    ${SubLocationSelectFragmentDoc}
${SubLocationMinFragmentDoc}`;
export function useSubLocationsSelectQuery(baseOptions?: Apollo.QueryHookOptions<SubLocationsSelectQuery, SubLocationsSelectQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SubLocationsSelectQuery, SubLocationsSelectQueryVariables>(SubLocationsSelectDocument, options);
      }
export function useSubLocationsSelectLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SubLocationsSelectQuery, SubLocationsSelectQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SubLocationsSelectQuery, SubLocationsSelectQueryVariables>(SubLocationsSelectDocument, options);
        }
export type SubLocationsSelectQueryHookResult = ReturnType<typeof useSubLocationsSelectQuery>;
export type SubLocationsSelectLazyQueryHookResult = ReturnType<typeof useSubLocationsSelectLazyQuery>;
export type SubLocationsSelectQueryResult = Apollo.QueryResult<SubLocationsSelectQuery, SubLocationsSelectQueryVariables>;
export const CancelImportingSessionDocument = gql`
    mutation cancelImportingSession($input: CancelImportingSessionInput!) {
  cancelImportingSession(input: $input) {
    success
  }
}
    `;
export type CancelImportingSessionMutationFn = Apollo.MutationFunction<CancelImportingSessionMutation, CancelImportingSessionMutationVariables>;
export function useCancelImportingSessionMutation(baseOptions?: Apollo.MutationHookOptions<CancelImportingSessionMutation, CancelImportingSessionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CancelImportingSessionMutation, CancelImportingSessionMutationVariables>(CancelImportingSessionDocument, options);
      }
export type CancelImportingSessionMutationHookResult = ReturnType<typeof useCancelImportingSessionMutation>;
export type CancelImportingSessionMutationResult = Apollo.MutationResult<CancelImportingSessionMutation>;
export const DeleteImportingContactDocument = gql`
    mutation deleteImportingContact($input: DeleteImportingContactInput!) {
  deleteImportingContact(input: $input) {
    success
  }
}
    `;
export type DeleteImportingContactMutationFn = Apollo.MutationFunction<DeleteImportingContactMutation, DeleteImportingContactMutationVariables>;
export function useDeleteImportingContactMutation(baseOptions?: Apollo.MutationHookOptions<DeleteImportingContactMutation, DeleteImportingContactMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteImportingContactMutation, DeleteImportingContactMutationVariables>(DeleteImportingContactDocument, options);
      }
export type DeleteImportingContactMutationHookResult = ReturnType<typeof useDeleteImportingContactMutation>;
export type DeleteImportingContactMutationResult = Apollo.MutationResult<DeleteImportingContactMutation>;
export const GetSessionImportingContactsDocument = gql`
    query getSessionImportingContacts($input: SessionImportingInput!) {
  getSessionImportingContacts(input: $input)
}
    `;
export function useGetSessionImportingContactsQuery(baseOptions: Apollo.QueryHookOptions<GetSessionImportingContactsQuery, GetSessionImportingContactsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSessionImportingContactsQuery, GetSessionImportingContactsQueryVariables>(GetSessionImportingContactsDocument, options);
      }
export function useGetSessionImportingContactsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSessionImportingContactsQuery, GetSessionImportingContactsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSessionImportingContactsQuery, GetSessionImportingContactsQueryVariables>(GetSessionImportingContactsDocument, options);
        }
export type GetSessionImportingContactsQueryHookResult = ReturnType<typeof useGetSessionImportingContactsQuery>;
export type GetSessionImportingContactsLazyQueryHookResult = ReturnType<typeof useGetSessionImportingContactsLazyQuery>;
export type GetSessionImportingContactsQueryResult = Apollo.QueryResult<GetSessionImportingContactsQuery, GetSessionImportingContactsQueryVariables>;
export const GetSessionImportingContactsProcessInfoDocument = gql`
    query getSessionImportingContactsProcessInfo($input: SessionImportingProcessInfoInput!) {
  getSessionImportingContactsProcessInfo(input: $input) {
    totalFields
    processedFields
  }
}
    `;
export function useGetSessionImportingContactsProcessInfoQuery(baseOptions: Apollo.QueryHookOptions<GetSessionImportingContactsProcessInfoQuery, GetSessionImportingContactsProcessInfoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSessionImportingContactsProcessInfoQuery, GetSessionImportingContactsProcessInfoQueryVariables>(GetSessionImportingContactsProcessInfoDocument, options);
      }
export function useGetSessionImportingContactsProcessInfoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSessionImportingContactsProcessInfoQuery, GetSessionImportingContactsProcessInfoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSessionImportingContactsProcessInfoQuery, GetSessionImportingContactsProcessInfoQueryVariables>(GetSessionImportingContactsProcessInfoDocument, options);
        }
export type GetSessionImportingContactsProcessInfoQueryHookResult = ReturnType<typeof useGetSessionImportingContactsProcessInfoQuery>;
export type GetSessionImportingContactsProcessInfoLazyQueryHookResult = ReturnType<typeof useGetSessionImportingContactsProcessInfoLazyQuery>;
export type GetSessionImportingContactsProcessInfoQueryResult = Apollo.QueryResult<GetSessionImportingContactsProcessInfoQuery, GetSessionImportingContactsProcessInfoQueryVariables>;
export const UpdateCustomPermissionDocument = gql`
    mutation updateCustomPermission($id: ID!, $input: CustomPermissionInput!) {
  updateCustomPermission(id: $id, data: $input) {
    data {
      id
    }
  }
}
    `;
export type UpdateCustomPermissionMutationFn = Apollo.MutationFunction<UpdateCustomPermissionMutation, UpdateCustomPermissionMutationVariables>;
export function useUpdateCustomPermissionMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCustomPermissionMutation, UpdateCustomPermissionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCustomPermissionMutation, UpdateCustomPermissionMutationVariables>(UpdateCustomPermissionDocument, options);
      }
export type UpdateCustomPermissionMutationHookResult = ReturnType<typeof useUpdateCustomPermissionMutation>;
export type UpdateCustomPermissionMutationResult = Apollo.MutationResult<UpdateCustomPermissionMutation>;
export const CustomPermissionDocument = gql`
    query customPermission($id: ID!) {
  customPermission(id: $id) {
    data {
      ...CustomPermission
    }
  }
}
    ${CustomPermissionFragmentDoc}`;
export function useCustomPermissionQuery(baseOptions: Apollo.QueryHookOptions<CustomPermissionQuery, CustomPermissionQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CustomPermissionQuery, CustomPermissionQueryVariables>(CustomPermissionDocument, options);
      }
export function useCustomPermissionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CustomPermissionQuery, CustomPermissionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CustomPermissionQuery, CustomPermissionQueryVariables>(CustomPermissionDocument, options);
        }
export type CustomPermissionQueryHookResult = ReturnType<typeof useCustomPermissionQuery>;
export type CustomPermissionLazyQueryHookResult = ReturnType<typeof useCustomPermissionLazyQuery>;
export type CustomPermissionQueryResult = Apollo.QueryResult<CustomPermissionQuery, CustomPermissionQueryVariables>;
export const CustomPermissionsDocument = gql`
    query customPermissions($filters: CustomPermissionFiltersInput, $pagination: PaginationArg, $sort: [String]) {
  customPermissions(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...CustomPermission
    }
    meta {
      ...Meta
    }
  }
}
    ${CustomPermissionFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useCustomPermissionsQuery(baseOptions?: Apollo.QueryHookOptions<CustomPermissionsQuery, CustomPermissionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CustomPermissionsQuery, CustomPermissionsQueryVariables>(CustomPermissionsDocument, options);
      }
export function useCustomPermissionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CustomPermissionsQuery, CustomPermissionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CustomPermissionsQuery, CustomPermissionsQueryVariables>(CustomPermissionsDocument, options);
        }
export type CustomPermissionsQueryHookResult = ReturnType<typeof useCustomPermissionsQuery>;
export type CustomPermissionsLazyQueryHookResult = ReturnType<typeof useCustomPermissionsLazyQuery>;
export type CustomPermissionsQueryResult = Apollo.QueryResult<CustomPermissionsQuery, CustomPermissionsQueryVariables>;
export const CreateDealDocument = gql`
    mutation createDeal($input: DealInput!) {
  createDeal(data: $input) {
    data {
      id
    }
  }
}
    `;
export type CreateDealMutationFn = Apollo.MutationFunction<CreateDealMutation, CreateDealMutationVariables>;
export function useCreateDealMutation(baseOptions?: Apollo.MutationHookOptions<CreateDealMutation, CreateDealMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateDealMutation, CreateDealMutationVariables>(CreateDealDocument, options);
      }
export type CreateDealMutationHookResult = ReturnType<typeof useCreateDealMutation>;
export type CreateDealMutationResult = Apollo.MutationResult<CreateDealMutation>;
export const DeleteDealDocument = gql`
    mutation deleteDeal($id: ID!) {
  deleteDeal(id: $id) {
    data {
      id
    }
  }
}
    `;
export type DeleteDealMutationFn = Apollo.MutationFunction<DeleteDealMutation, DeleteDealMutationVariables>;
export function useDeleteDealMutation(baseOptions?: Apollo.MutationHookOptions<DeleteDealMutation, DeleteDealMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteDealMutation, DeleteDealMutationVariables>(DeleteDealDocument, options);
      }
export type DeleteDealMutationHookResult = ReturnType<typeof useDeleteDealMutation>;
export type DeleteDealMutationResult = Apollo.MutationResult<DeleteDealMutation>;
export const UpdateDealDocument = gql`
    mutation updateDeal($id: ID!, $input: DealInput!) {
  updateDeal(id: $id, data: $input) {
    data {
      id
    }
  }
}
    `;
export type UpdateDealMutationFn = Apollo.MutationFunction<UpdateDealMutation, UpdateDealMutationVariables>;
export function useUpdateDealMutation(baseOptions?: Apollo.MutationHookOptions<UpdateDealMutation, UpdateDealMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateDealMutation, UpdateDealMutationVariables>(UpdateDealDocument, options);
      }
export type UpdateDealMutationHookResult = ReturnType<typeof useUpdateDealMutation>;
export type UpdateDealMutationResult = Apollo.MutationResult<UpdateDealMutation>;
export const DealDocument = gql`
    query deal($id: ID!) {
  deal(id: $id) {
    data {
      ...Deal
    }
  }
}
    ${DealFragmentDoc}
${DealMinFragmentDoc}
${FileFragmentDoc}`;
export function useDealQuery(baseOptions: Apollo.QueryHookOptions<DealQuery, DealQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DealQuery, DealQueryVariables>(DealDocument, options);
      }
export function useDealLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DealQuery, DealQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DealQuery, DealQueryVariables>(DealDocument, options);
        }
export type DealQueryHookResult = ReturnType<typeof useDealQuery>;
export type DealLazyQueryHookResult = ReturnType<typeof useDealLazyQuery>;
export type DealQueryResult = Apollo.QueryResult<DealQuery, DealQueryVariables>;
export const DealsCardsDocument = gql`
    query dealsCards($filters: DealFiltersInput, $pagination: PaginationArg, $sort: [String]) {
  deals(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...DealCard
    }
    meta {
      ...Meta
    }
  }
}
    ${DealCardFragmentDoc}
${DealMinFragmentDoc}
${FileMinFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useDealsCardsQuery(baseOptions?: Apollo.QueryHookOptions<DealsCardsQuery, DealsCardsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DealsCardsQuery, DealsCardsQueryVariables>(DealsCardsDocument, options);
      }
export function useDealsCardsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DealsCardsQuery, DealsCardsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DealsCardsQuery, DealsCardsQueryVariables>(DealsCardsDocument, options);
        }
export type DealsCardsQueryHookResult = ReturnType<typeof useDealsCardsQuery>;
export type DealsCardsLazyQueryHookResult = ReturnType<typeof useDealsCardsLazyQuery>;
export type DealsCardsQueryResult = Apollo.QueryResult<DealsCardsQuery, DealsCardsQueryVariables>;
export const CreateDealSettingDocument = gql`
    mutation createDealSetting($input: DealSettingInput!) {
  createDealSetting(data: $input) {
    data {
      ...DealSetting
    }
  }
}
    ${DealSettingFragmentDoc}`;
export type CreateDealSettingMutationFn = Apollo.MutationFunction<CreateDealSettingMutation, CreateDealSettingMutationVariables>;
export function useCreateDealSettingMutation(baseOptions?: Apollo.MutationHookOptions<CreateDealSettingMutation, CreateDealSettingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateDealSettingMutation, CreateDealSettingMutationVariables>(CreateDealSettingDocument, options);
      }
export type CreateDealSettingMutationHookResult = ReturnType<typeof useCreateDealSettingMutation>;
export type CreateDealSettingMutationResult = Apollo.MutationResult<CreateDealSettingMutation>;
export const UpdateDealSettingDocument = gql`
    mutation updateDealSetting($id: ID!, $input: DealSettingInput!) {
  updateDealSetting(id: $id, data: $input) {
    data {
      ...DealSetting
    }
  }
}
    ${DealSettingFragmentDoc}`;
export type UpdateDealSettingMutationFn = Apollo.MutationFunction<UpdateDealSettingMutation, UpdateDealSettingMutationVariables>;
export function useUpdateDealSettingMutation(baseOptions?: Apollo.MutationHookOptions<UpdateDealSettingMutation, UpdateDealSettingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateDealSettingMutation, UpdateDealSettingMutationVariables>(UpdateDealSettingDocument, options);
      }
export type UpdateDealSettingMutationHookResult = ReturnType<typeof useUpdateDealSettingMutation>;
export type UpdateDealSettingMutationResult = Apollo.MutationResult<UpdateDealSettingMutation>;
export const DealsSettingDocument = gql`
    query dealsSetting($filters: DealSettingFiltersInput, $pagination: PaginationArg, $sort: [String]) {
  dealsSetting(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...DealSetting
    }
  }
}
    ${DealSettingFragmentDoc}`;
export function useDealsSettingQuery(baseOptions?: Apollo.QueryHookOptions<DealsSettingQuery, DealsSettingQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DealsSettingQuery, DealsSettingQueryVariables>(DealsSettingDocument, options);
      }
export function useDealsSettingLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DealsSettingQuery, DealsSettingQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DealsSettingQuery, DealsSettingQueryVariables>(DealsSettingDocument, options);
        }
export type DealsSettingQueryHookResult = ReturnType<typeof useDealsSettingQuery>;
export type DealsSettingLazyQueryHookResult = ReturnType<typeof useDealsSettingLazyQuery>;
export type DealsSettingQueryResult = Apollo.QueryResult<DealsSettingQuery, DealsSettingQueryVariables>;
export const CreateDealTransactionReminderDocument = gql`
    mutation createDealTransactionReminder($input: DealTransactionReminderInput!) {
  createDealTransactionReminder(data: $input) {
    data {
      ...DealTransactionReminder
    }
  }
}
    ${DealTransactionReminderFragmentDoc}`;
export type CreateDealTransactionReminderMutationFn = Apollo.MutationFunction<CreateDealTransactionReminderMutation, CreateDealTransactionReminderMutationVariables>;
export function useCreateDealTransactionReminderMutation(baseOptions?: Apollo.MutationHookOptions<CreateDealTransactionReminderMutation, CreateDealTransactionReminderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateDealTransactionReminderMutation, CreateDealTransactionReminderMutationVariables>(CreateDealTransactionReminderDocument, options);
      }
export type CreateDealTransactionReminderMutationHookResult = ReturnType<typeof useCreateDealTransactionReminderMutation>;
export type CreateDealTransactionReminderMutationResult = Apollo.MutationResult<CreateDealTransactionReminderMutation>;
export const DeleteDealTransactionReminderDocument = gql`
    mutation deleteDealTransactionReminder($id: ID!) {
  deleteDealTransactionReminder(id: $id) {
    data {
      ...DealTransactionReminder
    }
  }
}
    ${DealTransactionReminderFragmentDoc}`;
export type DeleteDealTransactionReminderMutationFn = Apollo.MutationFunction<DeleteDealTransactionReminderMutation, DeleteDealTransactionReminderMutationVariables>;
export function useDeleteDealTransactionReminderMutation(baseOptions?: Apollo.MutationHookOptions<DeleteDealTransactionReminderMutation, DeleteDealTransactionReminderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteDealTransactionReminderMutation, DeleteDealTransactionReminderMutationVariables>(DeleteDealTransactionReminderDocument, options);
      }
export type DeleteDealTransactionReminderMutationHookResult = ReturnType<typeof useDeleteDealTransactionReminderMutation>;
export type DeleteDealTransactionReminderMutationResult = Apollo.MutationResult<DeleteDealTransactionReminderMutation>;
export const UpdateDealTransactionReminderDocument = gql`
    mutation updateDealTransactionReminder($id: ID!, $input: DealTransactionReminderInput!) {
  updateDealTransactionReminder(id: $id, data: $input) {
    data {
      ...DealTransactionReminder
    }
  }
}
    ${DealTransactionReminderFragmentDoc}`;
export type UpdateDealTransactionReminderMutationFn = Apollo.MutationFunction<UpdateDealTransactionReminderMutation, UpdateDealTransactionReminderMutationVariables>;
export function useUpdateDealTransactionReminderMutation(baseOptions?: Apollo.MutationHookOptions<UpdateDealTransactionReminderMutation, UpdateDealTransactionReminderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateDealTransactionReminderMutation, UpdateDealTransactionReminderMutationVariables>(UpdateDealTransactionReminderDocument, options);
      }
export type UpdateDealTransactionReminderMutationHookResult = ReturnType<typeof useUpdateDealTransactionReminderMutation>;
export type UpdateDealTransactionReminderMutationResult = Apollo.MutationResult<UpdateDealTransactionReminderMutation>;
export const DealTransactionRemindersDocument = gql`
    query dealTransactionReminders($filters: DealTransactionReminderFiltersInput, $pagination: PaginationArg, $sort: [String]) {
  dealTransactionReminders(
    filters: $filters
    pagination: $pagination
    sort: $sort
  ) {
    data {
      ...DealTransactionReminder
    }
    meta {
      ...Meta
    }
  }
}
    ${DealTransactionReminderFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useDealTransactionRemindersQuery(baseOptions?: Apollo.QueryHookOptions<DealTransactionRemindersQuery, DealTransactionRemindersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DealTransactionRemindersQuery, DealTransactionRemindersQueryVariables>(DealTransactionRemindersDocument, options);
      }
export function useDealTransactionRemindersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DealTransactionRemindersQuery, DealTransactionRemindersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DealTransactionRemindersQuery, DealTransactionRemindersQueryVariables>(DealTransactionRemindersDocument, options);
        }
export type DealTransactionRemindersQueryHookResult = ReturnType<typeof useDealTransactionRemindersQuery>;
export type DealTransactionRemindersLazyQueryHookResult = ReturnType<typeof useDealTransactionRemindersLazyQuery>;
export type DealTransactionRemindersQueryResult = Apollo.QueryResult<DealTransactionRemindersQuery, DealTransactionRemindersQueryVariables>;
export const DefaultImportingFilesDocument = gql`
    query defaultImportingFiles($filters: DefaultImportingFileFiltersInput, $pagination: PaginationArg, $sort: [String]) {
  defaultImportingFiles(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...DefaultImportingFile
    }
    meta {
      ...Meta
    }
  }
}
    ${DefaultImportingFileFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useDefaultImportingFilesQuery(baseOptions?: Apollo.QueryHookOptions<DefaultImportingFilesQuery, DefaultImportingFilesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DefaultImportingFilesQuery, DefaultImportingFilesQueryVariables>(DefaultImportingFilesDocument, options);
      }
export function useDefaultImportingFilesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DefaultImportingFilesQuery, DefaultImportingFilesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DefaultImportingFilesQuery, DefaultImportingFilesQueryVariables>(DefaultImportingFilesDocument, options);
        }
export type DefaultImportingFilesQueryHookResult = ReturnType<typeof useDefaultImportingFilesQuery>;
export type DefaultImportingFilesLazyQueryHookResult = ReturnType<typeof useDefaultImportingFilesLazyQuery>;
export type DefaultImportingFilesQueryResult = Apollo.QueryResult<DefaultImportingFilesQuery, DefaultImportingFilesQueryVariables>;
export const DefaultPdfTemplatesDocument = gql`
    query defaultPdfTemplates($filters: DefaultPdfTemplateFiltersInput, $pagination: PaginationArg) {
  defaultPdfTemplates(filters: $filters, pagination: $pagination) {
    data {
      ...DefaultPdfTemplate
    }
    meta {
      ...Meta
    }
  }
}
    ${DefaultPdfTemplateFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useDefaultPdfTemplatesQuery(baseOptions?: Apollo.QueryHookOptions<DefaultPdfTemplatesQuery, DefaultPdfTemplatesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DefaultPdfTemplatesQuery, DefaultPdfTemplatesQueryVariables>(DefaultPdfTemplatesDocument, options);
      }
export function useDefaultPdfTemplatesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DefaultPdfTemplatesQuery, DefaultPdfTemplatesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DefaultPdfTemplatesQuery, DefaultPdfTemplatesQueryVariables>(DefaultPdfTemplatesDocument, options);
        }
export type DefaultPdfTemplatesQueryHookResult = ReturnType<typeof useDefaultPdfTemplatesQuery>;
export type DefaultPdfTemplatesLazyQueryHookResult = ReturnType<typeof useDefaultPdfTemplatesLazyQuery>;
export type DefaultPdfTemplatesQueryResult = Apollo.QueryResult<DefaultPdfTemplatesQuery, DefaultPdfTemplatesQueryVariables>;
export const CreateDimensionDocument = gql`
    mutation createDimension($input: DimensionInput!) {
  createDimension(data: $input) {
    data {
      id
    }
  }
}
    `;
export type CreateDimensionMutationFn = Apollo.MutationFunction<CreateDimensionMutation, CreateDimensionMutationVariables>;
export function useCreateDimensionMutation(baseOptions?: Apollo.MutationHookOptions<CreateDimensionMutation, CreateDimensionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateDimensionMutation, CreateDimensionMutationVariables>(CreateDimensionDocument, options);
      }
export type CreateDimensionMutationHookResult = ReturnType<typeof useCreateDimensionMutation>;
export type CreateDimensionMutationResult = Apollo.MutationResult<CreateDimensionMutation>;
export const UpdateDimensionDocument = gql`
    mutation updateDimension($id: ID!, $input: DimensionInput!) {
  updateDimension(id: $id, data: $input) {
    data {
      id
    }
  }
}
    `;
export type UpdateDimensionMutationFn = Apollo.MutationFunction<UpdateDimensionMutation, UpdateDimensionMutationVariables>;
export function useUpdateDimensionMutation(baseOptions?: Apollo.MutationHookOptions<UpdateDimensionMutation, UpdateDimensionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateDimensionMutation, UpdateDimensionMutationVariables>(UpdateDimensionDocument, options);
      }
export type UpdateDimensionMutationHookResult = ReturnType<typeof useUpdateDimensionMutation>;
export type UpdateDimensionMutationResult = Apollo.MutationResult<UpdateDimensionMutation>;
export const UpdateDocumentPermissionDocument = gql`
    mutation updateDocumentPermission($id: ID!, $input: DocumentPermissionInput!) {
  updateDocumentPermission(id: $id, data: $input) {
    data {
      id
    }
  }
}
    `;
export type UpdateDocumentPermissionMutationFn = Apollo.MutationFunction<UpdateDocumentPermissionMutation, UpdateDocumentPermissionMutationVariables>;
export function useUpdateDocumentPermissionMutation(baseOptions?: Apollo.MutationHookOptions<UpdateDocumentPermissionMutation, UpdateDocumentPermissionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateDocumentPermissionMutation, UpdateDocumentPermissionMutationVariables>(UpdateDocumentPermissionDocument, options);
      }
export type UpdateDocumentPermissionMutationHookResult = ReturnType<typeof useUpdateDocumentPermissionMutation>;
export type UpdateDocumentPermissionMutationResult = Apollo.MutationResult<UpdateDocumentPermissionMutation>;
export const DocumentPermissionsDocument = gql`
    query documentPermissions($filters: DocumentPermissionFiltersInput, $pagination: PaginationArg, $sort: [String]) {
  documentPermissions(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...DocumentPermission
    }
  }
}
    ${DocumentPermissionFragmentDoc}`;
export function useDocumentPermissionsQuery(baseOptions?: Apollo.QueryHookOptions<DocumentPermissionsQuery, DocumentPermissionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DocumentPermissionsQuery, DocumentPermissionsQueryVariables>(DocumentPermissionsDocument, options);
      }
export function useDocumentPermissionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DocumentPermissionsQuery, DocumentPermissionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DocumentPermissionsQuery, DocumentPermissionsQueryVariables>(DocumentPermissionsDocument, options);
        }
export type DocumentPermissionsQueryHookResult = ReturnType<typeof useDocumentPermissionsQuery>;
export type DocumentPermissionsLazyQueryHookResult = ReturnType<typeof useDocumentPermissionsLazyQuery>;
export type DocumentPermissionsQueryResult = Apollo.QueryResult<DocumentPermissionsQuery, DocumentPermissionsQueryVariables>;
export const CreateDownloadRecordDocument = gql`
    mutation createDownloadRecord($input: DownloadRecordInput!) {
  createDownloadRecord(data: $input) {
    data {
      id
    }
  }
}
    `;
export type CreateDownloadRecordMutationFn = Apollo.MutationFunction<CreateDownloadRecordMutation, CreateDownloadRecordMutationVariables>;
export function useCreateDownloadRecordMutation(baseOptions?: Apollo.MutationHookOptions<CreateDownloadRecordMutation, CreateDownloadRecordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateDownloadRecordMutation, CreateDownloadRecordMutationVariables>(CreateDownloadRecordDocument, options);
      }
export type CreateDownloadRecordMutationHookResult = ReturnType<typeof useCreateDownloadRecordMutation>;
export type CreateDownloadRecordMutationResult = Apollo.MutationResult<CreateDownloadRecordMutation>;
export const DeleteDownloadRecordDocument = gql`
    mutation deleteDownloadRecord($id: ID!) {
  deleteDownloadRecord(id: $id) {
    data {
      id
    }
  }
}
    `;
export type DeleteDownloadRecordMutationFn = Apollo.MutationFunction<DeleteDownloadRecordMutation, DeleteDownloadRecordMutationVariables>;
export function useDeleteDownloadRecordMutation(baseOptions?: Apollo.MutationHookOptions<DeleteDownloadRecordMutation, DeleteDownloadRecordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteDownloadRecordMutation, DeleteDownloadRecordMutationVariables>(DeleteDownloadRecordDocument, options);
      }
export type DeleteDownloadRecordMutationHookResult = ReturnType<typeof useDeleteDownloadRecordMutation>;
export type DeleteDownloadRecordMutationResult = Apollo.MutationResult<DeleteDownloadRecordMutation>;
export const DeleteDownloadUserRecordsDocument = gql`
    mutation deleteDownloadUserRecords {
  deleteDownloadUserRecords {
    data {
      id
    }
  }
}
    `;
export type DeleteDownloadUserRecordsMutationFn = Apollo.MutationFunction<DeleteDownloadUserRecordsMutation, DeleteDownloadUserRecordsMutationVariables>;
export function useDeleteDownloadUserRecordsMutation(baseOptions?: Apollo.MutationHookOptions<DeleteDownloadUserRecordsMutation, DeleteDownloadUserRecordsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteDownloadUserRecordsMutation, DeleteDownloadUserRecordsMutationVariables>(DeleteDownloadUserRecordsDocument, options);
      }
export type DeleteDownloadUserRecordsMutationHookResult = ReturnType<typeof useDeleteDownloadUserRecordsMutation>;
export type DeleteDownloadUserRecordsMutationResult = Apollo.MutationResult<DeleteDownloadUserRecordsMutation>;
export const DownloadRecordsDocument = gql`
    query downloadRecords($filters: DownloadRecordFiltersInput, $pagination: PaginationArg, $sort: [String]) {
  downloadRecords(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...DownloadRecord
    }
    meta {
      ...Meta
    }
  }
}
    ${DownloadRecordFragmentDoc}
${FileItemMinFragmentDoc}
${FileFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useDownloadRecordsQuery(baseOptions?: Apollo.QueryHookOptions<DownloadRecordsQuery, DownloadRecordsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DownloadRecordsQuery, DownloadRecordsQueryVariables>(DownloadRecordsDocument, options);
      }
export function useDownloadRecordsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DownloadRecordsQuery, DownloadRecordsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DownloadRecordsQuery, DownloadRecordsQueryVariables>(DownloadRecordsDocument, options);
        }
export type DownloadRecordsQueryHookResult = ReturnType<typeof useDownloadRecordsQuery>;
export type DownloadRecordsLazyQueryHookResult = ReturnType<typeof useDownloadRecordsLazyQuery>;
export type DownloadRecordsQueryResult = Apollo.QueryResult<DownloadRecordsQuery, DownloadRecordsQueryVariables>;
export const CreateEcommerceCustomAppServiceDocument = gql`
    mutation createEcommerceCustomAppService($data: EcommerceCustomAppServiceInput!) {
  createEcommerceCustomAppService(data: $data) {
    data {
      ...EcommerceCustomAppService
    }
  }
}
    ${EcommerceCustomAppServiceFragmentDoc}`;
export type CreateEcommerceCustomAppServiceMutationFn = Apollo.MutationFunction<CreateEcommerceCustomAppServiceMutation, CreateEcommerceCustomAppServiceMutationVariables>;
export function useCreateEcommerceCustomAppServiceMutation(baseOptions?: Apollo.MutationHookOptions<CreateEcommerceCustomAppServiceMutation, CreateEcommerceCustomAppServiceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateEcommerceCustomAppServiceMutation, CreateEcommerceCustomAppServiceMutationVariables>(CreateEcommerceCustomAppServiceDocument, options);
      }
export type CreateEcommerceCustomAppServiceMutationHookResult = ReturnType<typeof useCreateEcommerceCustomAppServiceMutation>;
export type CreateEcommerceCustomAppServiceMutationResult = Apollo.MutationResult<CreateEcommerceCustomAppServiceMutation>;
export const DeleteEcommerceCustomAppServiceDocument = gql`
    mutation deleteEcommerceCustomAppService($id: ID!) {
  deleteEcommerceCustomAppService(id: $id) {
    data {
      ...EcommerceCustomAppService
    }
  }
}
    ${EcommerceCustomAppServiceFragmentDoc}`;
export type DeleteEcommerceCustomAppServiceMutationFn = Apollo.MutationFunction<DeleteEcommerceCustomAppServiceMutation, DeleteEcommerceCustomAppServiceMutationVariables>;
export function useDeleteEcommerceCustomAppServiceMutation(baseOptions?: Apollo.MutationHookOptions<DeleteEcommerceCustomAppServiceMutation, DeleteEcommerceCustomAppServiceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteEcommerceCustomAppServiceMutation, DeleteEcommerceCustomAppServiceMutationVariables>(DeleteEcommerceCustomAppServiceDocument, options);
      }
export type DeleteEcommerceCustomAppServiceMutationHookResult = ReturnType<typeof useDeleteEcommerceCustomAppServiceMutation>;
export type DeleteEcommerceCustomAppServiceMutationResult = Apollo.MutationResult<DeleteEcommerceCustomAppServiceMutation>;
export const EcommerceCustomAppServicesDocument = gql`
    query ecommerceCustomAppServices($filters: EcommerceCustomAppServiceFiltersInput!, $pagination: PaginationArg! = {}, $sort: [String] = []) {
  ecommerceCustomAppServices(
    sort: $sort
    filters: $filters
    pagination: $pagination
  ) {
    data {
      ...EcommerceCustomAppService
    }
  }
}
    ${EcommerceCustomAppServiceFragmentDoc}`;
export function useEcommerceCustomAppServicesQuery(baseOptions: Apollo.QueryHookOptions<EcommerceCustomAppServicesQuery, EcommerceCustomAppServicesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<EcommerceCustomAppServicesQuery, EcommerceCustomAppServicesQueryVariables>(EcommerceCustomAppServicesDocument, options);
      }
export function useEcommerceCustomAppServicesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EcommerceCustomAppServicesQuery, EcommerceCustomAppServicesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<EcommerceCustomAppServicesQuery, EcommerceCustomAppServicesQueryVariables>(EcommerceCustomAppServicesDocument, options);
        }
export type EcommerceCustomAppServicesQueryHookResult = ReturnType<typeof useEcommerceCustomAppServicesQuery>;
export type EcommerceCustomAppServicesLazyQueryHookResult = ReturnType<typeof useEcommerceCustomAppServicesLazyQuery>;
export type EcommerceCustomAppServicesQueryResult = Apollo.QueryResult<EcommerceCustomAppServicesQuery, EcommerceCustomAppServicesQueryVariables>;
export const AddEmployeeDocument = gql`
    mutation addEmployee($input: EmployeeUserRegisterInput!) {
  addEmployee(input: $input) {
    jwt
    user {
      id
      username
      email
      blocked
      confirmed
      role {
        id
        name
      }
    }
  }
}
    `;
export type AddEmployeeMutationFn = Apollo.MutationFunction<AddEmployeeMutation, AddEmployeeMutationVariables>;
export function useAddEmployeeMutation(baseOptions?: Apollo.MutationHookOptions<AddEmployeeMutation, AddEmployeeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddEmployeeMutation, AddEmployeeMutationVariables>(AddEmployeeDocument, options);
      }
export type AddEmployeeMutationHookResult = ReturnType<typeof useAddEmployeeMutation>;
export type AddEmployeeMutationResult = Apollo.MutationResult<AddEmployeeMutation>;
export const DeleteEmployeeDocument = gql`
    mutation deleteEmployee($id: ID!) {
  deleteUsersPermissionsUser(id: $id) {
    data {
      id
    }
  }
}
    `;
export type DeleteEmployeeMutationFn = Apollo.MutationFunction<DeleteEmployeeMutation, DeleteEmployeeMutationVariables>;
export function useDeleteEmployeeMutation(baseOptions?: Apollo.MutationHookOptions<DeleteEmployeeMutation, DeleteEmployeeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteEmployeeMutation, DeleteEmployeeMutationVariables>(DeleteEmployeeDocument, options);
      }
export type DeleteEmployeeMutationHookResult = ReturnType<typeof useDeleteEmployeeMutation>;
export type DeleteEmployeeMutationResult = Apollo.MutationResult<DeleteEmployeeMutation>;
export const DeleteUploadFileDocument = gql`
    mutation deleteUploadFile($id: ID!) {
  deleteUploadFile(id: $id) {
    data {
      ...File
    }
  }
}
    ${FileFragmentDoc}`;
export type DeleteUploadFileMutationFn = Apollo.MutationFunction<DeleteUploadFileMutation, DeleteUploadFileMutationVariables>;
export function useDeleteUploadFileMutation(baseOptions?: Apollo.MutationHookOptions<DeleteUploadFileMutation, DeleteUploadFileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteUploadFileMutation, DeleteUploadFileMutationVariables>(DeleteUploadFileDocument, options);
      }
export type DeleteUploadFileMutationHookResult = ReturnType<typeof useDeleteUploadFileMutation>;
export type DeleteUploadFileMutationResult = Apollo.MutationResult<DeleteUploadFileMutation>;
export const GenerateFileImportingReportDocument = gql`
    mutation generateFileImportingReport($input: GenerateFileImportingReportArgsInput!) {
  generateFileImportingReport(input: $input)
}
    `;
export type GenerateFileImportingReportMutationFn = Apollo.MutationFunction<GenerateFileImportingReportMutation, GenerateFileImportingReportMutationVariables>;
export function useGenerateFileImportingReportMutation(baseOptions?: Apollo.MutationHookOptions<GenerateFileImportingReportMutation, GenerateFileImportingReportMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<GenerateFileImportingReportMutation, GenerateFileImportingReportMutationVariables>(GenerateFileImportingReportDocument, options);
      }
export type GenerateFileImportingReportMutationHookResult = ReturnType<typeof useGenerateFileImportingReportMutation>;
export type GenerateFileImportingReportMutationResult = Apollo.MutationResult<GenerateFileImportingReportMutation>;
export const GeneratePresignedUrlDocument = gql`
    mutation generatePresignedUrl($input: GeneratePresignedUrlArgsInput!) {
  generatePresignedUrl(input: $input) {
    presignedUrl
  }
}
    `;
export type GeneratePresignedUrlMutationFn = Apollo.MutationFunction<GeneratePresignedUrlMutation, GeneratePresignedUrlMutationVariables>;
export function useGeneratePresignedUrlMutation(baseOptions?: Apollo.MutationHookOptions<GeneratePresignedUrlMutation, GeneratePresignedUrlMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<GeneratePresignedUrlMutation, GeneratePresignedUrlMutationVariables>(GeneratePresignedUrlDocument, options);
      }
export type GeneratePresignedUrlMutationHookResult = ReturnType<typeof useGeneratePresignedUrlMutation>;
export type GeneratePresignedUrlMutationResult = Apollo.MutationResult<GeneratePresignedUrlMutation>;
export const GeneratePresignedUrlsDocument = gql`
    mutation generatePresignedUrls($input: GeneratePresignedUrlsArgsInput!) {
  generatePresignedUrls(input: $input) {
    presignedUrls
  }
}
    `;
export type GeneratePresignedUrlsMutationFn = Apollo.MutationFunction<GeneratePresignedUrlsMutation, GeneratePresignedUrlsMutationVariables>;
export function useGeneratePresignedUrlsMutation(baseOptions?: Apollo.MutationHookOptions<GeneratePresignedUrlsMutation, GeneratePresignedUrlsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<GeneratePresignedUrlsMutation, GeneratePresignedUrlsMutationVariables>(GeneratePresignedUrlsDocument, options);
      }
export type GeneratePresignedUrlsMutationHookResult = ReturnType<typeof useGeneratePresignedUrlsMutation>;
export type GeneratePresignedUrlsMutationResult = Apollo.MutationResult<GeneratePresignedUrlsMutation>;
export const MultipleUploadDocument = gql`
    mutation multipleUpload($files: [Upload]!, $ref: String, $refId: ID, $field: String) {
  multipleUpload(files: $files, ref: $ref, refId: $refId, field: $field) {
    data {
      ...File
    }
  }
}
    ${FileFragmentDoc}`;
export type MultipleUploadMutationFn = Apollo.MutationFunction<MultipleUploadMutation, MultipleUploadMutationVariables>;
export function useMultipleUploadMutation(baseOptions?: Apollo.MutationHookOptions<MultipleUploadMutation, MultipleUploadMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MultipleUploadMutation, MultipleUploadMutationVariables>(MultipleUploadDocument, options);
      }
export type MultipleUploadMutationHookResult = ReturnType<typeof useMultipleUploadMutation>;
export type MultipleUploadMutationResult = Apollo.MutationResult<MultipleUploadMutation>;
export const ProcessingFileUploadingDocument = gql`
    mutation processingFileUploading($input: ProcessingFileUploadingArgInput!) {
  processingFileUploading(input: $input) {
    resultObj
  }
}
    `;
export type ProcessingFileUploadingMutationFn = Apollo.MutationFunction<ProcessingFileUploadingMutation, ProcessingFileUploadingMutationVariables>;
export function useProcessingFileUploadingMutation(baseOptions?: Apollo.MutationHookOptions<ProcessingFileUploadingMutation, ProcessingFileUploadingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ProcessingFileUploadingMutation, ProcessingFileUploadingMutationVariables>(ProcessingFileUploadingDocument, options);
      }
export type ProcessingFileUploadingMutationHookResult = ReturnType<typeof useProcessingFileUploadingMutation>;
export type ProcessingFileUploadingMutationResult = Apollo.MutationResult<ProcessingFileUploadingMutation>;
export const UpdateUploadFileDocument = gql`
    mutation updateUploadFile($id: ID!, $data: UploadFileInput!) {
  updateUploadFile(id: $id, data: $data) {
    data {
      ...File
    }
  }
}
    ${FileFragmentDoc}`;
export type UpdateUploadFileMutationFn = Apollo.MutationFunction<UpdateUploadFileMutation, UpdateUploadFileMutationVariables>;
export function useUpdateUploadFileMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUploadFileMutation, UpdateUploadFileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateUploadFileMutation, UpdateUploadFileMutationVariables>(UpdateUploadFileDocument, options);
      }
export type UpdateUploadFileMutationHookResult = ReturnType<typeof useUpdateUploadFileMutation>;
export type UpdateUploadFileMutationResult = Apollo.MutationResult<UpdateUploadFileMutation>;
export const UploadFileDocument = gql`
    mutation uploadFile($file: Upload!, $ref: String, $refId: ID, $field: String) {
  upload(file: $file, ref: $ref, refId: $refId, field: $field) {
    data {
      ...File
    }
  }
}
    ${FileFragmentDoc}`;
export type UploadFileMutationFn = Apollo.MutationFunction<UploadFileMutation, UploadFileMutationVariables>;
export function useUploadFileMutation(baseOptions?: Apollo.MutationHookOptions<UploadFileMutation, UploadFileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UploadFileMutation, UploadFileMutationVariables>(UploadFileDocument, options);
      }
export type UploadFileMutationHookResult = ReturnType<typeof useUploadFileMutation>;
export type UploadFileMutationResult = Apollo.MutationResult<UploadFileMutation>;
export const CreateFileItemDocument = gql`
    mutation createFileItem($input: FileItemInput!) {
  createFileItem(data: $input) {
    data {
      ...FileItem
    }
  }
}
    ${FileItemFragmentDoc}
${FileItemMinFragmentDoc}
${FileFragmentDoc}
${UserMinFragmentDoc}`;
export type CreateFileItemMutationFn = Apollo.MutationFunction<CreateFileItemMutation, CreateFileItemMutationVariables>;
export function useCreateFileItemMutation(baseOptions?: Apollo.MutationHookOptions<CreateFileItemMutation, CreateFileItemMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateFileItemMutation, CreateFileItemMutationVariables>(CreateFileItemDocument, options);
      }
export type CreateFileItemMutationHookResult = ReturnType<typeof useCreateFileItemMutation>;
export type CreateFileItemMutationResult = Apollo.MutationResult<CreateFileItemMutation>;
export const DeleteFileItemDocument = gql`
    mutation deleteFileItem($id: ID!) {
  deleteFileItem(id: $id) {
    data {
      ...FileItem
    }
  }
}
    ${FileItemFragmentDoc}
${FileItemMinFragmentDoc}
${FileFragmentDoc}
${UserMinFragmentDoc}`;
export type DeleteFileItemMutationFn = Apollo.MutationFunction<DeleteFileItemMutation, DeleteFileItemMutationVariables>;
export function useDeleteFileItemMutation(baseOptions?: Apollo.MutationHookOptions<DeleteFileItemMutation, DeleteFileItemMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteFileItemMutation, DeleteFileItemMutationVariables>(DeleteFileItemDocument, options);
      }
export type DeleteFileItemMutationHookResult = ReturnType<typeof useDeleteFileItemMutation>;
export type DeleteFileItemMutationResult = Apollo.MutationResult<DeleteFileItemMutation>;
export const UpdateFileItemDocument = gql`
    mutation updateFileItem($id: ID!, $input: FileItemInput!) {
  updateFileItem(id: $id, data: $input) {
    data {
      ...FileItem
    }
  }
}
    ${FileItemFragmentDoc}
${FileItemMinFragmentDoc}
${FileFragmentDoc}
${UserMinFragmentDoc}`;
export type UpdateFileItemMutationFn = Apollo.MutationFunction<UpdateFileItemMutation, UpdateFileItemMutationVariables>;
export function useUpdateFileItemMutation(baseOptions?: Apollo.MutationHookOptions<UpdateFileItemMutation, UpdateFileItemMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateFileItemMutation, UpdateFileItemMutationVariables>(UpdateFileItemDocument, options);
      }
export type UpdateFileItemMutationHookResult = ReturnType<typeof useUpdateFileItemMutation>;
export type UpdateFileItemMutationResult = Apollo.MutationResult<UpdateFileItemMutation>;
export const FileItemsDocument = gql`
    query fileItems($filters: FileItemFiltersInput, $pagination: PaginationArg, $sort: [String]) {
  fileItems(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...FileItem
    }
    meta {
      ...Meta
    }
  }
}
    ${FileItemFragmentDoc}
${FileItemMinFragmentDoc}
${FileFragmentDoc}
${UserMinFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useFileItemsQuery(baseOptions?: Apollo.QueryHookOptions<FileItemsQuery, FileItemsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FileItemsQuery, FileItemsQueryVariables>(FileItemsDocument, options);
      }
export function useFileItemsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FileItemsQuery, FileItemsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FileItemsQuery, FileItemsQueryVariables>(FileItemsDocument, options);
        }
export type FileItemsQueryHookResult = ReturnType<typeof useFileItemsQuery>;
export type FileItemsLazyQueryHookResult = ReturnType<typeof useFileItemsLazyQuery>;
export type FileItemsQueryResult = Apollo.QueryResult<FileItemsQuery, FileItemsQueryVariables>;
export const TotalFileItemsSizeDocument = gql`
    query totalFileItemsSize {
  totalFileItemsSize {
    totalSize
  }
}
    `;
export function useTotalFileItemsSizeQuery(baseOptions?: Apollo.QueryHookOptions<TotalFileItemsSizeQuery, TotalFileItemsSizeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TotalFileItemsSizeQuery, TotalFileItemsSizeQueryVariables>(TotalFileItemsSizeDocument, options);
      }
export function useTotalFileItemsSizeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TotalFileItemsSizeQuery, TotalFileItemsSizeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TotalFileItemsSizeQuery, TotalFileItemsSizeQueryVariables>(TotalFileItemsSizeDocument, options);
        }
export type TotalFileItemsSizeQueryHookResult = ReturnType<typeof useTotalFileItemsSizeQuery>;
export type TotalFileItemsSizeLazyQueryHookResult = ReturnType<typeof useTotalFileItemsSizeLazyQuery>;
export type TotalFileItemsSizeQueryResult = Apollo.QueryResult<TotalFileItemsSizeQuery, TotalFileItemsSizeQueryVariables>;
export const CreateImportingSessionDocument = gql`
    mutation createImportingSession($input: ImportingSessionInput!) {
  createImportingSession(data: $input) {
    data {
      id
    }
  }
}
    `;
export type CreateImportingSessionMutationFn = Apollo.MutationFunction<CreateImportingSessionMutation, CreateImportingSessionMutationVariables>;
export function useCreateImportingSessionMutation(baseOptions?: Apollo.MutationHookOptions<CreateImportingSessionMutation, CreateImportingSessionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateImportingSessionMutation, CreateImportingSessionMutationVariables>(CreateImportingSessionDocument, options);
      }
export type CreateImportingSessionMutationHookResult = ReturnType<typeof useCreateImportingSessionMutation>;
export type CreateImportingSessionMutationResult = Apollo.MutationResult<CreateImportingSessionMutation>;
export const DeleteImportingSessionDocument = gql`
    mutation deleteImportingSession($id: ID!) {
  deleteImportingSession(id: $id) {
    data {
      id
    }
  }
}
    `;
export type DeleteImportingSessionMutationFn = Apollo.MutationFunction<DeleteImportingSessionMutation, DeleteImportingSessionMutationVariables>;
export function useDeleteImportingSessionMutation(baseOptions?: Apollo.MutationHookOptions<DeleteImportingSessionMutation, DeleteImportingSessionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteImportingSessionMutation, DeleteImportingSessionMutationVariables>(DeleteImportingSessionDocument, options);
      }
export type DeleteImportingSessionMutationHookResult = ReturnType<typeof useDeleteImportingSessionMutation>;
export type DeleteImportingSessionMutationResult = Apollo.MutationResult<DeleteImportingSessionMutation>;
export const UpdateImportingSessionDocument = gql`
    mutation updateImportingSession($id: ID!, $input: ImportingSessionInput!) {
  updateImportingSession(id: $id, data: $input) {
    data {
      id
    }
  }
}
    `;
export type UpdateImportingSessionMutationFn = Apollo.MutationFunction<UpdateImportingSessionMutation, UpdateImportingSessionMutationVariables>;
export function useUpdateImportingSessionMutation(baseOptions?: Apollo.MutationHookOptions<UpdateImportingSessionMutation, UpdateImportingSessionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateImportingSessionMutation, UpdateImportingSessionMutationVariables>(UpdateImportingSessionDocument, options);
      }
export type UpdateImportingSessionMutationHookResult = ReturnType<typeof useUpdateImportingSessionMutation>;
export type UpdateImportingSessionMutationResult = Apollo.MutationResult<UpdateImportingSessionMutation>;
export const ImportingSessionsDocument = gql`
    query importingSessions($filters: ImportingSessionFiltersInput, $pagination: PaginationArg, $sort: [String]) {
  importingSessions(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...ImportingSession
    }
    meta {
      ...Meta
    }
  }
}
    ${ImportingSessionFragmentDoc}
${FileFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useImportingSessionsQuery(baseOptions?: Apollo.QueryHookOptions<ImportingSessionsQuery, ImportingSessionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ImportingSessionsQuery, ImportingSessionsQueryVariables>(ImportingSessionsDocument, options);
      }
export function useImportingSessionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ImportingSessionsQuery, ImportingSessionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ImportingSessionsQuery, ImportingSessionsQueryVariables>(ImportingSessionsDocument, options);
        }
export type ImportingSessionsQueryHookResult = ReturnType<typeof useImportingSessionsQuery>;
export type ImportingSessionsLazyQueryHookResult = ReturnType<typeof useImportingSessionsLazyQuery>;
export type ImportingSessionsQueryResult = Apollo.QueryResult<ImportingSessionsQuery, ImportingSessionsQueryVariables>;
export const CreateInventoryAdjustmentDocument = gql`
    mutation createInventoryAdjustment($input: InventoryAdjustmentInput!) {
  createInventoryAdjustment(data: $input) {
    data {
      id
    }
  }
}
    `;
export type CreateInventoryAdjustmentMutationFn = Apollo.MutationFunction<CreateInventoryAdjustmentMutation, CreateInventoryAdjustmentMutationVariables>;
export function useCreateInventoryAdjustmentMutation(baseOptions?: Apollo.MutationHookOptions<CreateInventoryAdjustmentMutation, CreateInventoryAdjustmentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateInventoryAdjustmentMutation, CreateInventoryAdjustmentMutationVariables>(CreateInventoryAdjustmentDocument, options);
      }
export type CreateInventoryAdjustmentMutationHookResult = ReturnType<typeof useCreateInventoryAdjustmentMutation>;
export type CreateInventoryAdjustmentMutationResult = Apollo.MutationResult<CreateInventoryAdjustmentMutation>;
export const CreateInventoryAdjustmentItemDocument = gql`
    mutation createInventoryAdjustmentItem($input: InventoryAdjustmentItemInput!) {
  createInventoryAdjustmentItem(data: $input) {
    data {
      id
    }
  }
}
    `;
export type CreateInventoryAdjustmentItemMutationFn = Apollo.MutationFunction<CreateInventoryAdjustmentItemMutation, CreateInventoryAdjustmentItemMutationVariables>;
export function useCreateInventoryAdjustmentItemMutation(baseOptions?: Apollo.MutationHookOptions<CreateInventoryAdjustmentItemMutation, CreateInventoryAdjustmentItemMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateInventoryAdjustmentItemMutation, CreateInventoryAdjustmentItemMutationVariables>(CreateInventoryAdjustmentItemDocument, options);
      }
export type CreateInventoryAdjustmentItemMutationHookResult = ReturnType<typeof useCreateInventoryAdjustmentItemMutation>;
export type CreateInventoryAdjustmentItemMutationResult = Apollo.MutationResult<CreateInventoryAdjustmentItemMutation>;
export const CreateInventoryAdjustmentWithItemsByInventoryAuditDocument = gql`
    mutation createInventoryAdjustmentWithItemsByInventoryAudit($input: CreateInventoryAdjustmentWithItemsByInventoryAuditInput!) {
  createInventoryAdjustmentWithItemsByInventoryAudit(input: $input) {
    id
  }
}
    `;
export type CreateInventoryAdjustmentWithItemsByInventoryAuditMutationFn = Apollo.MutationFunction<CreateInventoryAdjustmentWithItemsByInventoryAuditMutation, CreateInventoryAdjustmentWithItemsByInventoryAuditMutationVariables>;
export function useCreateInventoryAdjustmentWithItemsByInventoryAuditMutation(baseOptions?: Apollo.MutationHookOptions<CreateInventoryAdjustmentWithItemsByInventoryAuditMutation, CreateInventoryAdjustmentWithItemsByInventoryAuditMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateInventoryAdjustmentWithItemsByInventoryAuditMutation, CreateInventoryAdjustmentWithItemsByInventoryAuditMutationVariables>(CreateInventoryAdjustmentWithItemsByInventoryAuditDocument, options);
      }
export type CreateInventoryAdjustmentWithItemsByInventoryAuditMutationHookResult = ReturnType<typeof useCreateInventoryAdjustmentWithItemsByInventoryAuditMutation>;
export type CreateInventoryAdjustmentWithItemsByInventoryAuditMutationResult = Apollo.MutationResult<CreateInventoryAdjustmentWithItemsByInventoryAuditMutation>;
export const UpdateInventoryAdjustmentDocument = gql`
    mutation updateInventoryAdjustment($id: ID!, $input: InventoryAdjustmentInput!) {
  updateInventoryAdjustment(id: $id, data: $input) {
    data {
      id
    }
  }
}
    `;
export type UpdateInventoryAdjustmentMutationFn = Apollo.MutationFunction<UpdateInventoryAdjustmentMutation, UpdateInventoryAdjustmentMutationVariables>;
export function useUpdateInventoryAdjustmentMutation(baseOptions?: Apollo.MutationHookOptions<UpdateInventoryAdjustmentMutation, UpdateInventoryAdjustmentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateInventoryAdjustmentMutation, UpdateInventoryAdjustmentMutationVariables>(UpdateInventoryAdjustmentDocument, options);
      }
export type UpdateInventoryAdjustmentMutationHookResult = ReturnType<typeof useUpdateInventoryAdjustmentMutation>;
export type UpdateInventoryAdjustmentMutationResult = Apollo.MutationResult<UpdateInventoryAdjustmentMutation>;
export const InventoryAdjustmentByUuidDocument = gql`
    query inventoryAdjustmentByUuid($uuid: String!) {
  inventoryAdjustments(filters: {uuid: {eq: $uuid}}) {
    data {
      ...InventoryAdjustment
    }
  }
}
    ${InventoryAdjustmentFragmentDoc}
${InventoryAdjustmentMinFragmentDoc}
${FileFragmentDoc}`;
export function useInventoryAdjustmentByUuidQuery(baseOptions: Apollo.QueryHookOptions<InventoryAdjustmentByUuidQuery, InventoryAdjustmentByUuidQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<InventoryAdjustmentByUuidQuery, InventoryAdjustmentByUuidQueryVariables>(InventoryAdjustmentByUuidDocument, options);
      }
export function useInventoryAdjustmentByUuidLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<InventoryAdjustmentByUuidQuery, InventoryAdjustmentByUuidQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<InventoryAdjustmentByUuidQuery, InventoryAdjustmentByUuidQueryVariables>(InventoryAdjustmentByUuidDocument, options);
        }
export type InventoryAdjustmentByUuidQueryHookResult = ReturnType<typeof useInventoryAdjustmentByUuidQuery>;
export type InventoryAdjustmentByUuidLazyQueryHookResult = ReturnType<typeof useInventoryAdjustmentByUuidLazyQuery>;
export type InventoryAdjustmentByUuidQueryResult = Apollo.QueryResult<InventoryAdjustmentByUuidQuery, InventoryAdjustmentByUuidQueryVariables>;
export const InventoryAdjustmentItemsByAdjustmentUuidDocument = gql`
    query inventoryAdjustmentItemsByAdjustmentUuid($uuid: String!, $pagination: PaginationArg = {}) {
  inventoryAdjustmentItems(
    filters: {inventoryAdjustment: {uuid: {eq: $uuid}}}
    pagination: $pagination
  ) {
    data {
      ...InventoryAdjustmentItem
    }
    meta {
      ...Meta
    }
  }
}
    ${InventoryAdjustmentItemFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useInventoryAdjustmentItemsByAdjustmentUuidQuery(baseOptions: Apollo.QueryHookOptions<InventoryAdjustmentItemsByAdjustmentUuidQuery, InventoryAdjustmentItemsByAdjustmentUuidQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<InventoryAdjustmentItemsByAdjustmentUuidQuery, InventoryAdjustmentItemsByAdjustmentUuidQueryVariables>(InventoryAdjustmentItemsByAdjustmentUuidDocument, options);
      }
export function useInventoryAdjustmentItemsByAdjustmentUuidLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<InventoryAdjustmentItemsByAdjustmentUuidQuery, InventoryAdjustmentItemsByAdjustmentUuidQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<InventoryAdjustmentItemsByAdjustmentUuidQuery, InventoryAdjustmentItemsByAdjustmentUuidQueryVariables>(InventoryAdjustmentItemsByAdjustmentUuidDocument, options);
        }
export type InventoryAdjustmentItemsByAdjustmentUuidQueryHookResult = ReturnType<typeof useInventoryAdjustmentItemsByAdjustmentUuidQuery>;
export type InventoryAdjustmentItemsByAdjustmentUuidLazyQueryHookResult = ReturnType<typeof useInventoryAdjustmentItemsByAdjustmentUuidLazyQuery>;
export type InventoryAdjustmentItemsByAdjustmentUuidQueryResult = Apollo.QueryResult<InventoryAdjustmentItemsByAdjustmentUuidQuery, InventoryAdjustmentItemsByAdjustmentUuidQueryVariables>;
export const InventoryAdjustmentsTableDocument = gql`
    query inventoryAdjustmentsTable($filters: InventoryAdjustmentFiltersInput, $pagination: PaginationArg = {}, $sort: [String] = []) {
  inventoryAdjustments(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...InventoryAdjustmentsTable
    }
    meta {
      ...Meta
    }
  }
}
    ${InventoryAdjustmentsTableFragmentDoc}
${InventoryAdjustmentMinFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useInventoryAdjustmentsTableQuery(baseOptions?: Apollo.QueryHookOptions<InventoryAdjustmentsTableQuery, InventoryAdjustmentsTableQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<InventoryAdjustmentsTableQuery, InventoryAdjustmentsTableQueryVariables>(InventoryAdjustmentsTableDocument, options);
      }
export function useInventoryAdjustmentsTableLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<InventoryAdjustmentsTableQuery, InventoryAdjustmentsTableQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<InventoryAdjustmentsTableQuery, InventoryAdjustmentsTableQueryVariables>(InventoryAdjustmentsTableDocument, options);
        }
export type InventoryAdjustmentsTableQueryHookResult = ReturnType<typeof useInventoryAdjustmentsTableQuery>;
export type InventoryAdjustmentsTableLazyQueryHookResult = ReturnType<typeof useInventoryAdjustmentsTableLazyQuery>;
export type InventoryAdjustmentsTableQueryResult = Apollo.QueryResult<InventoryAdjustmentsTableQuery, InventoryAdjustmentsTableQueryVariables>;
export const CreateInventoryAuditDocument = gql`
    mutation createInventoryAudit($input: InventoryAuditInput!) {
  createInventoryAudit(data: $input) {
    data {
      id
    }
  }
}
    `;
export type CreateInventoryAuditMutationFn = Apollo.MutationFunction<CreateInventoryAuditMutation, CreateInventoryAuditMutationVariables>;
export function useCreateInventoryAuditMutation(baseOptions?: Apollo.MutationHookOptions<CreateInventoryAuditMutation, CreateInventoryAuditMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateInventoryAuditMutation, CreateInventoryAuditMutationVariables>(CreateInventoryAuditDocument, options);
      }
export type CreateInventoryAuditMutationHookResult = ReturnType<typeof useCreateInventoryAuditMutation>;
export type CreateInventoryAuditMutationResult = Apollo.MutationResult<CreateInventoryAuditMutation>;
export const CreateInventoryAuditItemDocument = gql`
    mutation createInventoryAuditItem($input: InventoryAuditItemInput!) {
  createInventoryAuditItem(data: $input) {
    data {
      id
    }
  }
}
    `;
export type CreateInventoryAuditItemMutationFn = Apollo.MutationFunction<CreateInventoryAuditItemMutation, CreateInventoryAuditItemMutationVariables>;
export function useCreateInventoryAuditItemMutation(baseOptions?: Apollo.MutationHookOptions<CreateInventoryAuditItemMutation, CreateInventoryAuditItemMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateInventoryAuditItemMutation, CreateInventoryAuditItemMutationVariables>(CreateInventoryAuditItemDocument, options);
      }
export type CreateInventoryAuditItemMutationHookResult = ReturnType<typeof useCreateInventoryAuditItemMutation>;
export type CreateInventoryAuditItemMutationResult = Apollo.MutationResult<CreateInventoryAuditItemMutation>;
export const CreateInventoryAuditWithItemsByRedisDocument = gql`
    mutation createInventoryAuditWithItemsByRedis($input: CreateInventoryAuditWithItemsInput!) {
  createInventoryAuditWithItemsByRedis(input: $input) {
    id
  }
}
    `;
export type CreateInventoryAuditWithItemsByRedisMutationFn = Apollo.MutationFunction<CreateInventoryAuditWithItemsByRedisMutation, CreateInventoryAuditWithItemsByRedisMutationVariables>;
export function useCreateInventoryAuditWithItemsByRedisMutation(baseOptions?: Apollo.MutationHookOptions<CreateInventoryAuditWithItemsByRedisMutation, CreateInventoryAuditWithItemsByRedisMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateInventoryAuditWithItemsByRedisMutation, CreateInventoryAuditWithItemsByRedisMutationVariables>(CreateInventoryAuditWithItemsByRedisDocument, options);
      }
export type CreateInventoryAuditWithItemsByRedisMutationHookResult = ReturnType<typeof useCreateInventoryAuditWithItemsByRedisMutation>;
export type CreateInventoryAuditWithItemsByRedisMutationResult = Apollo.MutationResult<CreateInventoryAuditWithItemsByRedisMutation>;
export const UpdateFinalizeInventoryAuditDocument = gql`
    mutation updateFinalizeInventoryAudit($input: UpdateFinalizeInventoryAuditInput!) {
  updateFinalizeInventoryAudit(input: $input)
}
    `;
export type UpdateFinalizeInventoryAuditMutationFn = Apollo.MutationFunction<UpdateFinalizeInventoryAuditMutation, UpdateFinalizeInventoryAuditMutationVariables>;
export function useUpdateFinalizeInventoryAuditMutation(baseOptions?: Apollo.MutationHookOptions<UpdateFinalizeInventoryAuditMutation, UpdateFinalizeInventoryAuditMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateFinalizeInventoryAuditMutation, UpdateFinalizeInventoryAuditMutationVariables>(UpdateFinalizeInventoryAuditDocument, options);
      }
export type UpdateFinalizeInventoryAuditMutationHookResult = ReturnType<typeof useUpdateFinalizeInventoryAuditMutation>;
export type UpdateFinalizeInventoryAuditMutationResult = Apollo.MutationResult<UpdateFinalizeInventoryAuditMutation>;
export const UpdateInventoryAuditDocument = gql`
    mutation updateInventoryAudit($id: ID!, $input: InventoryAuditInput!) {
  updateInventoryAudit(id: $id, data: $input) {
    data {
      id
    }
  }
}
    `;
export type UpdateInventoryAuditMutationFn = Apollo.MutationFunction<UpdateInventoryAuditMutation, UpdateInventoryAuditMutationVariables>;
export function useUpdateInventoryAuditMutation(baseOptions?: Apollo.MutationHookOptions<UpdateInventoryAuditMutation, UpdateInventoryAuditMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateInventoryAuditMutation, UpdateInventoryAuditMutationVariables>(UpdateInventoryAuditDocument, options);
      }
export type UpdateInventoryAuditMutationHookResult = ReturnType<typeof useUpdateInventoryAuditMutation>;
export type UpdateInventoryAuditMutationResult = Apollo.MutationResult<UpdateInventoryAuditMutation>;
export const UpdateInventoryAuditItemDocument = gql`
    mutation updateInventoryAuditItem($id: ID!, $input: InventoryAuditItemInput!) {
  updateInventoryAuditItem(id: $id, data: $input) {
    data {
      id
      ...InventoryAuditItemMin
      attributes {
        productInventoryItem {
          data {
            id
            attributes {
              product {
                data {
                  id
                  attributes {
                    name
                    barcode
                    files {
                      data {
                        ...FileMin
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
    ${InventoryAuditItemMinFragmentDoc}
${FileMinFragmentDoc}`;
export type UpdateInventoryAuditItemMutationFn = Apollo.MutationFunction<UpdateInventoryAuditItemMutation, UpdateInventoryAuditItemMutationVariables>;
export function useUpdateInventoryAuditItemMutation(baseOptions?: Apollo.MutationHookOptions<UpdateInventoryAuditItemMutation, UpdateInventoryAuditItemMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateInventoryAuditItemMutation, UpdateInventoryAuditItemMutationVariables>(UpdateInventoryAuditItemDocument, options);
      }
export type UpdateInventoryAuditItemMutationHookResult = ReturnType<typeof useUpdateInventoryAuditItemMutation>;
export type UpdateInventoryAuditItemMutationResult = Apollo.MutationResult<UpdateInventoryAuditItemMutation>;
export const FetchAuditItemsStatsDocument = gql`
    query fetchAuditItemsStats($filters: InventoryAuditItemFiltersInput, $auditUuid: String!) {
  fetchAuditItemsStats(filters: $filters, auditUuid: $auditUuid) {
    all
    scanned
    notScanned
    partial
    over
    progress
  }
}
    `;
export function useFetchAuditItemsStatsQuery(baseOptions: Apollo.QueryHookOptions<FetchAuditItemsStatsQuery, FetchAuditItemsStatsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FetchAuditItemsStatsQuery, FetchAuditItemsStatsQueryVariables>(FetchAuditItemsStatsDocument, options);
      }
export function useFetchAuditItemsStatsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FetchAuditItemsStatsQuery, FetchAuditItemsStatsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FetchAuditItemsStatsQuery, FetchAuditItemsStatsQueryVariables>(FetchAuditItemsStatsDocument, options);
        }
export type FetchAuditItemsStatsQueryHookResult = ReturnType<typeof useFetchAuditItemsStatsQuery>;
export type FetchAuditItemsStatsLazyQueryHookResult = ReturnType<typeof useFetchAuditItemsStatsLazyQuery>;
export type FetchAuditItemsStatsQueryResult = Apollo.QueryResult<FetchAuditItemsStatsQuery, FetchAuditItemsStatsQueryVariables>;
export const FetchInventoryAuditItemsByUuidDocument = gql`
    query fetchInventoryAuditItemsByUuid($uuid: String!, $filters: InventoryAuditItemFiltersInput, $pagination: PaginationArg = {}, $sort: [String] = []) {
  fetchInventoryAuditItemsByUuid(
    uuid: $uuid
    filters: $filters
    pagination: $pagination
    sort: $sort
  ) {
    response
    meta {
      page
      pageCount
      pageSize
      total
    }
  }
}
    `;
export function useFetchInventoryAuditItemsByUuidQuery(baseOptions: Apollo.QueryHookOptions<FetchInventoryAuditItemsByUuidQuery, FetchInventoryAuditItemsByUuidQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FetchInventoryAuditItemsByUuidQuery, FetchInventoryAuditItemsByUuidQueryVariables>(FetchInventoryAuditItemsByUuidDocument, options);
      }
export function useFetchInventoryAuditItemsByUuidLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FetchInventoryAuditItemsByUuidQuery, FetchInventoryAuditItemsByUuidQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FetchInventoryAuditItemsByUuidQuery, FetchInventoryAuditItemsByUuidQueryVariables>(FetchInventoryAuditItemsByUuidDocument, options);
        }
export type FetchInventoryAuditItemsByUuidQueryHookResult = ReturnType<typeof useFetchInventoryAuditItemsByUuidQuery>;
export type FetchInventoryAuditItemsByUuidLazyQueryHookResult = ReturnType<typeof useFetchInventoryAuditItemsByUuidLazyQuery>;
export type FetchInventoryAuditItemsByUuidQueryResult = Apollo.QueryResult<FetchInventoryAuditItemsByUuidQuery, FetchInventoryAuditItemsByUuidQueryVariables>;
export const FetchListByFieldFromInventoryAuditItemsDocument = gql`
    query fetchListByFieldFromInventoryAuditItems($uuid: String!) {
  fetchListByFieldFromInventoryAuditItems(uuid: $uuid) {
    names
    barcodes
  }
}
    `;
export function useFetchListByFieldFromInventoryAuditItemsQuery(baseOptions: Apollo.QueryHookOptions<FetchListByFieldFromInventoryAuditItemsQuery, FetchListByFieldFromInventoryAuditItemsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FetchListByFieldFromInventoryAuditItemsQuery, FetchListByFieldFromInventoryAuditItemsQueryVariables>(FetchListByFieldFromInventoryAuditItemsDocument, options);
      }
export function useFetchListByFieldFromInventoryAuditItemsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FetchListByFieldFromInventoryAuditItemsQuery, FetchListByFieldFromInventoryAuditItemsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FetchListByFieldFromInventoryAuditItemsQuery, FetchListByFieldFromInventoryAuditItemsQueryVariables>(FetchListByFieldFromInventoryAuditItemsDocument, options);
        }
export type FetchListByFieldFromInventoryAuditItemsQueryHookResult = ReturnType<typeof useFetchListByFieldFromInventoryAuditItemsQuery>;
export type FetchListByFieldFromInventoryAuditItemsLazyQueryHookResult = ReturnType<typeof useFetchListByFieldFromInventoryAuditItemsLazyQuery>;
export type FetchListByFieldFromInventoryAuditItemsQueryResult = Apollo.QueryResult<FetchListByFieldFromInventoryAuditItemsQuery, FetchListByFieldFromInventoryAuditItemsQueryVariables>;
export const InventoryAuditDocument = gql`
    query inventoryAudit($filters: InventoryAuditFiltersInput, $pagination: PaginationArg = {}, $sort: [String] = []) {
  inventoryAudits(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...InventoryAudit
    }
    meta {
      ...Meta
    }
  }
}
    ${InventoryAuditFragmentDoc}
${InventoryAuditMinFragmentDoc}
${InventoryAuditItemMinFragmentDoc}
${SubLocationItemMinFragmentDoc}
${SubLocationMinFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useInventoryAuditQuery(baseOptions?: Apollo.QueryHookOptions<InventoryAuditQuery, InventoryAuditQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<InventoryAuditQuery, InventoryAuditQueryVariables>(InventoryAuditDocument, options);
      }
export function useInventoryAuditLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<InventoryAuditQuery, InventoryAuditQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<InventoryAuditQuery, InventoryAuditQueryVariables>(InventoryAuditDocument, options);
        }
export type InventoryAuditQueryHookResult = ReturnType<typeof useInventoryAuditQuery>;
export type InventoryAuditLazyQueryHookResult = ReturnType<typeof useInventoryAuditLazyQuery>;
export type InventoryAuditQueryResult = Apollo.QueryResult<InventoryAuditQuery, InventoryAuditQueryVariables>;
export const InventoryAuditAdjustmentActionByUuidDocument = gql`
    query inventoryAuditAdjustmentActionByUuid($filters: InventoryAuditFiltersInput, $pagination: PaginationArg = {}, $sort: [String] = []) {
  inventoryAudits(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...InventoryAuditAdjustmentAction
    }
  }
}
    ${InventoryAuditAdjustmentActionFragmentDoc}`;
export function useInventoryAuditAdjustmentActionByUuidQuery(baseOptions?: Apollo.QueryHookOptions<InventoryAuditAdjustmentActionByUuidQuery, InventoryAuditAdjustmentActionByUuidQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<InventoryAuditAdjustmentActionByUuidQuery, InventoryAuditAdjustmentActionByUuidQueryVariables>(InventoryAuditAdjustmentActionByUuidDocument, options);
      }
export function useInventoryAuditAdjustmentActionByUuidLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<InventoryAuditAdjustmentActionByUuidQuery, InventoryAuditAdjustmentActionByUuidQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<InventoryAuditAdjustmentActionByUuidQuery, InventoryAuditAdjustmentActionByUuidQueryVariables>(InventoryAuditAdjustmentActionByUuidDocument, options);
        }
export type InventoryAuditAdjustmentActionByUuidQueryHookResult = ReturnType<typeof useInventoryAuditAdjustmentActionByUuidQuery>;
export type InventoryAuditAdjustmentActionByUuidLazyQueryHookResult = ReturnType<typeof useInventoryAuditAdjustmentActionByUuidLazyQuery>;
export type InventoryAuditAdjustmentActionByUuidQueryResult = Apollo.QueryResult<InventoryAuditAdjustmentActionByUuidQuery, InventoryAuditAdjustmentActionByUuidQueryVariables>;
export const InventoryAuditFinalizeActionByUuidDocument = gql`
    query inventoryAuditFinalizeActionByUuid($filters: InventoryAuditFiltersInput, $pagination: PaginationArg = {}, $sort: [String] = []) {
  inventoryAudits(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...InventoryAuditFinalizeAction
    }
  }
}
    ${InventoryAuditFinalizeActionFragmentDoc}`;
export function useInventoryAuditFinalizeActionByUuidQuery(baseOptions?: Apollo.QueryHookOptions<InventoryAuditFinalizeActionByUuidQuery, InventoryAuditFinalizeActionByUuidQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<InventoryAuditFinalizeActionByUuidQuery, InventoryAuditFinalizeActionByUuidQueryVariables>(InventoryAuditFinalizeActionByUuidDocument, options);
      }
export function useInventoryAuditFinalizeActionByUuidLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<InventoryAuditFinalizeActionByUuidQuery, InventoryAuditFinalizeActionByUuidQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<InventoryAuditFinalizeActionByUuidQuery, InventoryAuditFinalizeActionByUuidQueryVariables>(InventoryAuditFinalizeActionByUuidDocument, options);
        }
export type InventoryAuditFinalizeActionByUuidQueryHookResult = ReturnType<typeof useInventoryAuditFinalizeActionByUuidQuery>;
export type InventoryAuditFinalizeActionByUuidLazyQueryHookResult = ReturnType<typeof useInventoryAuditFinalizeActionByUuidLazyQuery>;
export type InventoryAuditFinalizeActionByUuidQueryResult = Apollo.QueryResult<InventoryAuditFinalizeActionByUuidQuery, InventoryAuditFinalizeActionByUuidQueryVariables>;
export const InventoryAuditItemRangeDataDocument = gql`
    query inventoryAuditItemRangeData($uuid: String!) {
  inventoryAuditItemRangeData(uuid: $uuid) {
    minScannedQty
    maxScannedQty
    minActualQty
    maxActualQty
    minInventoryQty
    maxInventoryQty
    minPrice
    maxPrice
  }
}
    `;
export function useInventoryAuditItemRangeDataQuery(baseOptions: Apollo.QueryHookOptions<InventoryAuditItemRangeDataQuery, InventoryAuditItemRangeDataQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<InventoryAuditItemRangeDataQuery, InventoryAuditItemRangeDataQueryVariables>(InventoryAuditItemRangeDataDocument, options);
      }
export function useInventoryAuditItemRangeDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<InventoryAuditItemRangeDataQuery, InventoryAuditItemRangeDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<InventoryAuditItemRangeDataQuery, InventoryAuditItemRangeDataQueryVariables>(InventoryAuditItemRangeDataDocument, options);
        }
export type InventoryAuditItemRangeDataQueryHookResult = ReturnType<typeof useInventoryAuditItemRangeDataQuery>;
export type InventoryAuditItemRangeDataLazyQueryHookResult = ReturnType<typeof useInventoryAuditItemRangeDataLazyQuery>;
export type InventoryAuditItemRangeDataQueryResult = Apollo.QueryResult<InventoryAuditItemRangeDataQuery, InventoryAuditItemRangeDataQueryVariables>;
export const InventoryAuditItemsDocument = gql`
    query inventoryAuditItems($filters: InventoryAuditItemFiltersInput, $pagination: PaginationArg = {}, $sort: [String] = []) {
  inventoryAuditItems(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...InventoryAuditItemScanner
    }
  }
}
    ${InventoryAuditItemScannerFragmentDoc}
${InventoryAuditItemMinFragmentDoc}
${SubLocationItemMinFragmentDoc}`;
export function useInventoryAuditItemsQuery(baseOptions?: Apollo.QueryHookOptions<InventoryAuditItemsQuery, InventoryAuditItemsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<InventoryAuditItemsQuery, InventoryAuditItemsQueryVariables>(InventoryAuditItemsDocument, options);
      }
export function useInventoryAuditItemsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<InventoryAuditItemsQuery, InventoryAuditItemsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<InventoryAuditItemsQuery, InventoryAuditItemsQueryVariables>(InventoryAuditItemsDocument, options);
        }
export type InventoryAuditItemsQueryHookResult = ReturnType<typeof useInventoryAuditItemsQuery>;
export type InventoryAuditItemsLazyQueryHookResult = ReturnType<typeof useInventoryAuditItemsLazyQuery>;
export type InventoryAuditItemsQueryResult = Apollo.QueryResult<InventoryAuditItemsQuery, InventoryAuditItemsQueryVariables>;
export const InventoryAuditMinDocument = gql`
    query inventoryAuditMin($filters: InventoryAuditFiltersInput, $pagination: PaginationArg = {}, $sort: [String] = []) {
  inventoryAudits(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...InventoryAuditMin
    }
  }
}
    ${InventoryAuditMinFragmentDoc}`;
export function useInventoryAuditMinQuery(baseOptions?: Apollo.QueryHookOptions<InventoryAuditMinQuery, InventoryAuditMinQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<InventoryAuditMinQuery, InventoryAuditMinQueryVariables>(InventoryAuditMinDocument, options);
      }
export function useInventoryAuditMinLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<InventoryAuditMinQuery, InventoryAuditMinQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<InventoryAuditMinQuery, InventoryAuditMinQueryVariables>(InventoryAuditMinDocument, options);
        }
export type InventoryAuditMinQueryHookResult = ReturnType<typeof useInventoryAuditMinQuery>;
export type InventoryAuditMinLazyQueryHookResult = ReturnType<typeof useInventoryAuditMinLazyQuery>;
export type InventoryAuditMinQueryResult = Apollo.QueryResult<InventoryAuditMinQuery, InventoryAuditMinQueryVariables>;
export const InventoryAuditTableDocument = gql`
    query inventoryAuditTable($filters: InventoryAuditFiltersInput, $pagination: PaginationArg = {}, $sort: [String] = []) {
  inventoryAudits(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...InventoryAuditTable
    }
    meta {
      ...Meta
    }
  }
}
    ${InventoryAuditTableFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useInventoryAuditTableQuery(baseOptions?: Apollo.QueryHookOptions<InventoryAuditTableQuery, InventoryAuditTableQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<InventoryAuditTableQuery, InventoryAuditTableQueryVariables>(InventoryAuditTableDocument, options);
      }
export function useInventoryAuditTableLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<InventoryAuditTableQuery, InventoryAuditTableQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<InventoryAuditTableQuery, InventoryAuditTableQueryVariables>(InventoryAuditTableDocument, options);
        }
export type InventoryAuditTableQueryHookResult = ReturnType<typeof useInventoryAuditTableQuery>;
export type InventoryAuditTableLazyQueryHookResult = ReturnType<typeof useInventoryAuditTableLazyQuery>;
export type InventoryAuditTableQueryResult = Apollo.QueryResult<InventoryAuditTableQuery, InventoryAuditTableQueryVariables>;
export const CreateInvtCmpAttrDocument = gql`
    mutation createInvtCmpAttr($input: InvtCmpAttrInput!) {
  createInvtCmpAttr(data: $input) {
    data {
      ...InvtCmpAttr
    }
  }
}
    ${InvtCmpAttrFragmentDoc}
${InvtCmpAttrMinFragmentDoc}
${InvtCmpAttrOptMinFragmentDoc}`;
export type CreateInvtCmpAttrMutationFn = Apollo.MutationFunction<CreateInvtCmpAttrMutation, CreateInvtCmpAttrMutationVariables>;
export function useCreateInvtCmpAttrMutation(baseOptions?: Apollo.MutationHookOptions<CreateInvtCmpAttrMutation, CreateInvtCmpAttrMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateInvtCmpAttrMutation, CreateInvtCmpAttrMutationVariables>(CreateInvtCmpAttrDocument, options);
      }
export type CreateInvtCmpAttrMutationHookResult = ReturnType<typeof useCreateInvtCmpAttrMutation>;
export type CreateInvtCmpAttrMutationResult = Apollo.MutationResult<CreateInvtCmpAttrMutation>;
export const InvtCmpAttrsDocument = gql`
    query invtCmpAttrs($filters: InvtCmpAttrFiltersInput, $pagination: PaginationArg, $sort: [String]) {
  invtCmpAttrs(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...InvtCmpAttr
    }
    meta {
      ...Meta
    }
  }
}
    ${InvtCmpAttrFragmentDoc}
${InvtCmpAttrMinFragmentDoc}
${InvtCmpAttrOptMinFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useInvtCmpAttrsQuery(baseOptions?: Apollo.QueryHookOptions<InvtCmpAttrsQuery, InvtCmpAttrsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<InvtCmpAttrsQuery, InvtCmpAttrsQueryVariables>(InvtCmpAttrsDocument, options);
      }
export function useInvtCmpAttrsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<InvtCmpAttrsQuery, InvtCmpAttrsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<InvtCmpAttrsQuery, InvtCmpAttrsQueryVariables>(InvtCmpAttrsDocument, options);
        }
export type InvtCmpAttrsQueryHookResult = ReturnType<typeof useInvtCmpAttrsQuery>;
export type InvtCmpAttrsLazyQueryHookResult = ReturnType<typeof useInvtCmpAttrsLazyQuery>;
export type InvtCmpAttrsQueryResult = Apollo.QueryResult<InvtCmpAttrsQuery, InvtCmpAttrsQueryVariables>;
export const CreateInvtCmpAttrOptDocument = gql`
    mutation createInvtCmpAttrOpt($input: InvtCmpAttrOptInput!) {
  createInvtCmpAttrOpt(data: $input) {
    data {
      ...InvtCmpAttrOpt
    }
  }
}
    ${InvtCmpAttrOptFragmentDoc}
${InvtCmpAttrOptMinFragmentDoc}
${InvtCmpAttrMinFragmentDoc}`;
export type CreateInvtCmpAttrOptMutationFn = Apollo.MutationFunction<CreateInvtCmpAttrOptMutation, CreateInvtCmpAttrOptMutationVariables>;
export function useCreateInvtCmpAttrOptMutation(baseOptions?: Apollo.MutationHookOptions<CreateInvtCmpAttrOptMutation, CreateInvtCmpAttrOptMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateInvtCmpAttrOptMutation, CreateInvtCmpAttrOptMutationVariables>(CreateInvtCmpAttrOptDocument, options);
      }
export type CreateInvtCmpAttrOptMutationHookResult = ReturnType<typeof useCreateInvtCmpAttrOptMutation>;
export type CreateInvtCmpAttrOptMutationResult = Apollo.MutationResult<CreateInvtCmpAttrOptMutation>;
export const InvtCmpAttrOptsDocument = gql`
    query invtCmpAttrOpts($filters: InvtCmpAttrOptFiltersInput, $pagination: PaginationArg, $sort: [String]) {
  invtCmpAttrOpts(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...InvtCmpAttrOpt
    }
    meta {
      ...Meta
    }
  }
}
    ${InvtCmpAttrOptFragmentDoc}
${InvtCmpAttrOptMinFragmentDoc}
${InvtCmpAttrMinFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useInvtCmpAttrOptsQuery(baseOptions?: Apollo.QueryHookOptions<InvtCmpAttrOptsQuery, InvtCmpAttrOptsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<InvtCmpAttrOptsQuery, InvtCmpAttrOptsQueryVariables>(InvtCmpAttrOptsDocument, options);
      }
export function useInvtCmpAttrOptsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<InvtCmpAttrOptsQuery, InvtCmpAttrOptsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<InvtCmpAttrOptsQuery, InvtCmpAttrOptsQueryVariables>(InvtCmpAttrOptsDocument, options);
        }
export type InvtCmpAttrOptsQueryHookResult = ReturnType<typeof useInvtCmpAttrOptsQuery>;
export type InvtCmpAttrOptsLazyQueryHookResult = ReturnType<typeof useInvtCmpAttrOptsLazyQuery>;
export type InvtCmpAttrOptsQueryResult = Apollo.QueryResult<InvtCmpAttrOptsQuery, InvtCmpAttrOptsQueryVariables>;
export const CreateInvtCmpColorDocument = gql`
    mutation createInvtCmpColor($input: InvtCmpColorInput!) {
  createInvtCmpColor(data: $input) {
    data {
      ...InvtCmpColor
    }
  }
}
    ${InvtCmpColorFragmentDoc}`;
export type CreateInvtCmpColorMutationFn = Apollo.MutationFunction<CreateInvtCmpColorMutation, CreateInvtCmpColorMutationVariables>;
export function useCreateInvtCmpColorMutation(baseOptions?: Apollo.MutationHookOptions<CreateInvtCmpColorMutation, CreateInvtCmpColorMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateInvtCmpColorMutation, CreateInvtCmpColorMutationVariables>(CreateInvtCmpColorDocument, options);
      }
export type CreateInvtCmpColorMutationHookResult = ReturnType<typeof useCreateInvtCmpColorMutation>;
export type CreateInvtCmpColorMutationResult = Apollo.MutationResult<CreateInvtCmpColorMutation>;
export const DeleteInvtCmpColorDocument = gql`
    mutation deleteInvtCmpColor($id: ID!) {
  deleteInvtCmpColor(id: $id) {
    data {
      ...InvtCmpColor
    }
  }
}
    ${InvtCmpColorFragmentDoc}`;
export type DeleteInvtCmpColorMutationFn = Apollo.MutationFunction<DeleteInvtCmpColorMutation, DeleteInvtCmpColorMutationVariables>;
export function useDeleteInvtCmpColorMutation(baseOptions?: Apollo.MutationHookOptions<DeleteInvtCmpColorMutation, DeleteInvtCmpColorMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteInvtCmpColorMutation, DeleteInvtCmpColorMutationVariables>(DeleteInvtCmpColorDocument, options);
      }
export type DeleteInvtCmpColorMutationHookResult = ReturnType<typeof useDeleteInvtCmpColorMutation>;
export type DeleteInvtCmpColorMutationResult = Apollo.MutationResult<DeleteInvtCmpColorMutation>;
export const InvtCmpColorsDocument = gql`
    query invtCmpColors($filters: InvtCmpColorFiltersInput, $pagination: PaginationArg, $sort: [String]) {
  invtCmpColors(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...InvtCmpColor
    }
    meta {
      ...Meta
    }
  }
}
    ${InvtCmpColorFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useInvtCmpColorsQuery(baseOptions?: Apollo.QueryHookOptions<InvtCmpColorsQuery, InvtCmpColorsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<InvtCmpColorsQuery, InvtCmpColorsQueryVariables>(InvtCmpColorsDocument, options);
      }
export function useInvtCmpColorsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<InvtCmpColorsQuery, InvtCmpColorsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<InvtCmpColorsQuery, InvtCmpColorsQueryVariables>(InvtCmpColorsDocument, options);
        }
export type InvtCmpColorsQueryHookResult = ReturnType<typeof useInvtCmpColorsQuery>;
export type InvtCmpColorsLazyQueryHookResult = ReturnType<typeof useInvtCmpColorsLazyQuery>;
export type InvtCmpColorsQueryResult = Apollo.QueryResult<InvtCmpColorsQuery, InvtCmpColorsQueryVariables>;
export const CreateInvtCmpSizeDocument = gql`
    mutation createInvtCmpSize($input: InvtCmpSizeInput!) {
  createInvtCmpSize(data: $input) {
    data {
      ...InvtCmpSize
    }
  }
}
    ${InvtCmpSizeFragmentDoc}`;
export type CreateInvtCmpSizeMutationFn = Apollo.MutationFunction<CreateInvtCmpSizeMutation, CreateInvtCmpSizeMutationVariables>;
export function useCreateInvtCmpSizeMutation(baseOptions?: Apollo.MutationHookOptions<CreateInvtCmpSizeMutation, CreateInvtCmpSizeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateInvtCmpSizeMutation, CreateInvtCmpSizeMutationVariables>(CreateInvtCmpSizeDocument, options);
      }
export type CreateInvtCmpSizeMutationHookResult = ReturnType<typeof useCreateInvtCmpSizeMutation>;
export type CreateInvtCmpSizeMutationResult = Apollo.MutationResult<CreateInvtCmpSizeMutation>;
export const DeleteInvtCmpSizeDocument = gql`
    mutation deleteInvtCmpSize($id: ID!) {
  deleteInvtCmpSize(id: $id) {
    data {
      ...InvtCmpSize
    }
  }
}
    ${InvtCmpSizeFragmentDoc}`;
export type DeleteInvtCmpSizeMutationFn = Apollo.MutationFunction<DeleteInvtCmpSizeMutation, DeleteInvtCmpSizeMutationVariables>;
export function useDeleteInvtCmpSizeMutation(baseOptions?: Apollo.MutationHookOptions<DeleteInvtCmpSizeMutation, DeleteInvtCmpSizeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteInvtCmpSizeMutation, DeleteInvtCmpSizeMutationVariables>(DeleteInvtCmpSizeDocument, options);
      }
export type DeleteInvtCmpSizeMutationHookResult = ReturnType<typeof useDeleteInvtCmpSizeMutation>;
export type DeleteInvtCmpSizeMutationResult = Apollo.MutationResult<DeleteInvtCmpSizeMutation>;
export const InvtCmpSizesDocument = gql`
    query invtCmpSizes($filters: InvtCmpSizeFiltersInput, $pagination: PaginationArg, $sort: [String]) {
  invtCmpSizes(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...InvtCmpSize
    }
    meta {
      ...Meta
    }
  }
}
    ${InvtCmpSizeFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useInvtCmpSizesQuery(baseOptions?: Apollo.QueryHookOptions<InvtCmpSizesQuery, InvtCmpSizesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<InvtCmpSizesQuery, InvtCmpSizesQueryVariables>(InvtCmpSizesDocument, options);
      }
export function useInvtCmpSizesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<InvtCmpSizesQuery, InvtCmpSizesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<InvtCmpSizesQuery, InvtCmpSizesQueryVariables>(InvtCmpSizesDocument, options);
        }
export type InvtCmpSizesQueryHookResult = ReturnType<typeof useInvtCmpSizesQuery>;
export type InvtCmpSizesLazyQueryHookResult = ReturnType<typeof useInvtCmpSizesLazyQuery>;
export type InvtCmpSizesQueryResult = Apollo.QueryResult<InvtCmpSizesQuery, InvtCmpSizesQueryVariables>;
export const CreateInvtCmpTrckDocument = gql`
    mutation createInvtCmpTrck($input: InvtCmpTrckInput!) {
  createInvtCmpTrck(data: $input) {
    data {
      ...InvtCmpTrck
    }
  }
}
    ${InvtCmpTrckFragmentDoc}
${InvtCmpTrckMinFragmentDoc}
${InvtCmpSizeFragmentDoc}
${InvtCmpColorFragmentDoc}
${InvtCmpAttrOptFragmentDoc}
${InvtCmpAttrOptMinFragmentDoc}
${InvtCmpAttrMinFragmentDoc}
${InvtCmpTrckItmFragmentDoc}`;
export type CreateInvtCmpTrckMutationFn = Apollo.MutationFunction<CreateInvtCmpTrckMutation, CreateInvtCmpTrckMutationVariables>;
export function useCreateInvtCmpTrckMutation(baseOptions?: Apollo.MutationHookOptions<CreateInvtCmpTrckMutation, CreateInvtCmpTrckMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateInvtCmpTrckMutation, CreateInvtCmpTrckMutationVariables>(CreateInvtCmpTrckDocument, options);
      }
export type CreateInvtCmpTrckMutationHookResult = ReturnType<typeof useCreateInvtCmpTrckMutation>;
export type CreateInvtCmpTrckMutationResult = Apollo.MutationResult<CreateInvtCmpTrckMutation>;
export const UpdateInvtCmpTrckDocument = gql`
    mutation updateInvtCmpTrck($id: ID!, $input: InvtCmpTrckInput!) {
  updateInvtCmpTrck(id: $id, data: $input) {
    data {
      ...InvtCmpTrckMin
    }
  }
}
    ${InvtCmpTrckMinFragmentDoc}`;
export type UpdateInvtCmpTrckMutationFn = Apollo.MutationFunction<UpdateInvtCmpTrckMutation, UpdateInvtCmpTrckMutationVariables>;
export function useUpdateInvtCmpTrckMutation(baseOptions?: Apollo.MutationHookOptions<UpdateInvtCmpTrckMutation, UpdateInvtCmpTrckMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateInvtCmpTrckMutation, UpdateInvtCmpTrckMutationVariables>(UpdateInvtCmpTrckDocument, options);
      }
export type UpdateInvtCmpTrckMutationHookResult = ReturnType<typeof useUpdateInvtCmpTrckMutation>;
export type UpdateInvtCmpTrckMutationResult = Apollo.MutationResult<UpdateInvtCmpTrckMutation>;
export const InvtCmpTrckDocument = gql`
    query invtCmpTrck($id: ID!) {
  invtCmpTrck(id: $id) {
    data {
      ...InvtCmpTrck
    }
  }
}
    ${InvtCmpTrckFragmentDoc}
${InvtCmpTrckMinFragmentDoc}
${InvtCmpSizeFragmentDoc}
${InvtCmpColorFragmentDoc}
${InvtCmpAttrOptFragmentDoc}
${InvtCmpAttrOptMinFragmentDoc}
${InvtCmpAttrMinFragmentDoc}
${InvtCmpTrckItmFragmentDoc}`;
export function useInvtCmpTrckQuery(baseOptions: Apollo.QueryHookOptions<InvtCmpTrckQuery, InvtCmpTrckQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<InvtCmpTrckQuery, InvtCmpTrckQueryVariables>(InvtCmpTrckDocument, options);
      }
export function useInvtCmpTrckLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<InvtCmpTrckQuery, InvtCmpTrckQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<InvtCmpTrckQuery, InvtCmpTrckQueryVariables>(InvtCmpTrckDocument, options);
        }
export type InvtCmpTrckQueryHookResult = ReturnType<typeof useInvtCmpTrckQuery>;
export type InvtCmpTrckLazyQueryHookResult = ReturnType<typeof useInvtCmpTrckLazyQuery>;
export type InvtCmpTrckQueryResult = Apollo.QueryResult<InvtCmpTrckQuery, InvtCmpTrckQueryVariables>;
export const CreateInvtCmpTrckItmDocument = gql`
    mutation createInvtCmpTrckItm($input: InvtCmpTrckItmInput!) {
  createInvtCmpTrckItm(data: $input) {
    data {
      ...InvtCmpTrckItm
    }
  }
}
    ${InvtCmpTrckItmFragmentDoc}
${InvtCmpTrckMinFragmentDoc}`;
export type CreateInvtCmpTrckItmMutationFn = Apollo.MutationFunction<CreateInvtCmpTrckItmMutation, CreateInvtCmpTrckItmMutationVariables>;
export function useCreateInvtCmpTrckItmMutation(baseOptions?: Apollo.MutationHookOptions<CreateInvtCmpTrckItmMutation, CreateInvtCmpTrckItmMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateInvtCmpTrckItmMutation, CreateInvtCmpTrckItmMutationVariables>(CreateInvtCmpTrckItmDocument, options);
      }
export type CreateInvtCmpTrckItmMutationHookResult = ReturnType<typeof useCreateInvtCmpTrckItmMutation>;
export type CreateInvtCmpTrckItmMutationResult = Apollo.MutationResult<CreateInvtCmpTrckItmMutation>;
export const DeleteInvtCmpTrckItmDocument = gql`
    mutation deleteInvtCmpTrckItm($id: ID!) {
  deleteInvtCmpTrckItm(id: $id) {
    data {
      ...InvtCmpTrckItm
    }
  }
}
    ${InvtCmpTrckItmFragmentDoc}
${InvtCmpTrckMinFragmentDoc}`;
export type DeleteInvtCmpTrckItmMutationFn = Apollo.MutationFunction<DeleteInvtCmpTrckItmMutation, DeleteInvtCmpTrckItmMutationVariables>;
export function useDeleteInvtCmpTrckItmMutation(baseOptions?: Apollo.MutationHookOptions<DeleteInvtCmpTrckItmMutation, DeleteInvtCmpTrckItmMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteInvtCmpTrckItmMutation, DeleteInvtCmpTrckItmMutationVariables>(DeleteInvtCmpTrckItmDocument, options);
      }
export type DeleteInvtCmpTrckItmMutationHookResult = ReturnType<typeof useDeleteInvtCmpTrckItmMutation>;
export type DeleteInvtCmpTrckItmMutationResult = Apollo.MutationResult<DeleteInvtCmpTrckItmMutation>;
export const UpdateInvtCmpTrckItmDocument = gql`
    mutation updateInvtCmpTrckItm($id: ID!, $input: InvtCmpTrckItmInput!) {
  updateInvtCmpTrckItm(id: $id, data: $input) {
    data {
      ...InvtCmpTrckItm
    }
  }
}
    ${InvtCmpTrckItmFragmentDoc}
${InvtCmpTrckMinFragmentDoc}`;
export type UpdateInvtCmpTrckItmMutationFn = Apollo.MutationFunction<UpdateInvtCmpTrckItmMutation, UpdateInvtCmpTrckItmMutationVariables>;
export function useUpdateInvtCmpTrckItmMutation(baseOptions?: Apollo.MutationHookOptions<UpdateInvtCmpTrckItmMutation, UpdateInvtCmpTrckItmMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateInvtCmpTrckItmMutation, UpdateInvtCmpTrckItmMutationVariables>(UpdateInvtCmpTrckItmDocument, options);
      }
export type UpdateInvtCmpTrckItmMutationHookResult = ReturnType<typeof useUpdateInvtCmpTrckItmMutation>;
export type UpdateInvtCmpTrckItmMutationResult = Apollo.MutationResult<UpdateInvtCmpTrckItmMutation>;
export const InvtCmpTrckItmsDocument = gql`
    query invtCmpTrckItms($filters: InvtCmpTrckItmFiltersInput, $pagination: PaginationArg, $sort: [String]) {
  invtCmpTrckItms(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...InvtCmpTrckItm
    }
    meta {
      ...Meta
    }
  }
}
    ${InvtCmpTrckItmFragmentDoc}
${InvtCmpTrckMinFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useInvtCmpTrckItmsQuery(baseOptions?: Apollo.QueryHookOptions<InvtCmpTrckItmsQuery, InvtCmpTrckItmsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<InvtCmpTrckItmsQuery, InvtCmpTrckItmsQueryVariables>(InvtCmpTrckItmsDocument, options);
      }
export function useInvtCmpTrckItmsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<InvtCmpTrckItmsQuery, InvtCmpTrckItmsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<InvtCmpTrckItmsQuery, InvtCmpTrckItmsQueryVariables>(InvtCmpTrckItmsDocument, options);
        }
export type InvtCmpTrckItmsQueryHookResult = ReturnType<typeof useInvtCmpTrckItmsQuery>;
export type InvtCmpTrckItmsLazyQueryHookResult = ReturnType<typeof useInvtCmpTrckItmsLazyQuery>;
export type InvtCmpTrckItmsQueryResult = Apollo.QueryResult<InvtCmpTrckItmsQuery, InvtCmpTrckItmsQueryVariables>;
export const CreateItemCategoryDocument = gql`
    mutation createItemCategory($input: ItemCategoryInput!) {
  createItemCategory(data: $input) {
    data {
      id
    }
  }
}
    `;
export type CreateItemCategoryMutationFn = Apollo.MutationFunction<CreateItemCategoryMutation, CreateItemCategoryMutationVariables>;
export function useCreateItemCategoryMutation(baseOptions?: Apollo.MutationHookOptions<CreateItemCategoryMutation, CreateItemCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateItemCategoryMutation, CreateItemCategoryMutationVariables>(CreateItemCategoryDocument, options);
      }
export type CreateItemCategoryMutationHookResult = ReturnType<typeof useCreateItemCategoryMutation>;
export type CreateItemCategoryMutationResult = Apollo.MutationResult<CreateItemCategoryMutation>;
export const DeleteItemCategoryDocument = gql`
    mutation deleteItemCategory($id: ID!) {
  deleteItemCategory(id: $id) {
    data {
      id
    }
  }
}
    `;
export type DeleteItemCategoryMutationFn = Apollo.MutationFunction<DeleteItemCategoryMutation, DeleteItemCategoryMutationVariables>;
export function useDeleteItemCategoryMutation(baseOptions?: Apollo.MutationHookOptions<DeleteItemCategoryMutation, DeleteItemCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteItemCategoryMutation, DeleteItemCategoryMutationVariables>(DeleteItemCategoryDocument, options);
      }
export type DeleteItemCategoryMutationHookResult = ReturnType<typeof useDeleteItemCategoryMutation>;
export type DeleteItemCategoryMutationResult = Apollo.MutationResult<DeleteItemCategoryMutation>;
export const UpdateItemCategoryDocument = gql`
    mutation updateItemCategory($id: ID!, $input: ItemCategoryInput!) {
  updateItemCategory(id: $id, data: $input) {
    data {
      id
    }
  }
}
    `;
export type UpdateItemCategoryMutationFn = Apollo.MutationFunction<UpdateItemCategoryMutation, UpdateItemCategoryMutationVariables>;
export function useUpdateItemCategoryMutation(baseOptions?: Apollo.MutationHookOptions<UpdateItemCategoryMutation, UpdateItemCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateItemCategoryMutation, UpdateItemCategoryMutationVariables>(UpdateItemCategoryDocument, options);
      }
export type UpdateItemCategoryMutationHookResult = ReturnType<typeof useUpdateItemCategoryMutation>;
export type UpdateItemCategoryMutationResult = Apollo.MutationResult<UpdateItemCategoryMutation>;
export const ItemCategoriesDocument = gql`
    query itemCategories($filters: ItemCategoryFiltersInput, $pagination: PaginationArg = {}, $sort: [String] = []) {
  itemCategories(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...ItemCategory
    }
  }
}
    ${ItemCategoryFragmentDoc}`;
export function useItemCategoriesQuery(baseOptions?: Apollo.QueryHookOptions<ItemCategoriesQuery, ItemCategoriesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ItemCategoriesQuery, ItemCategoriesQueryVariables>(ItemCategoriesDocument, options);
      }
export function useItemCategoriesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ItemCategoriesQuery, ItemCategoriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ItemCategoriesQuery, ItemCategoriesQueryVariables>(ItemCategoriesDocument, options);
        }
export type ItemCategoriesQueryHookResult = ReturnType<typeof useItemCategoriesQuery>;
export type ItemCategoriesLazyQueryHookResult = ReturnType<typeof useItemCategoriesLazyQuery>;
export type ItemCategoriesQueryResult = Apollo.QueryResult<ItemCategoriesQuery, ItemCategoriesQueryVariables>;
export const CreateBoxPaperDocument = gql`
    mutation createBoxPaper($input: BoxPaperInput!) {
  createBoxPaper(data: $input) {
    data {
      ...BoxPaper
    }
  }
}
    ${BoxPaperFragmentDoc}`;
export type CreateBoxPaperMutationFn = Apollo.MutationFunction<CreateBoxPaperMutation, CreateBoxPaperMutationVariables>;
export function useCreateBoxPaperMutation(baseOptions?: Apollo.MutationHookOptions<CreateBoxPaperMutation, CreateBoxPaperMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateBoxPaperMutation, CreateBoxPaperMutationVariables>(CreateBoxPaperDocument, options);
      }
export type CreateBoxPaperMutationHookResult = ReturnType<typeof useCreateBoxPaperMutation>;
export type CreateBoxPaperMutationResult = Apollo.MutationResult<CreateBoxPaperMutation>;
export const CreateBackingDocument = gql`
    mutation createBacking($input: BackingInput!) {
  createBacking(data: $input) {
    data {
      ...Backing
    }
  }
}
    ${BackingFragmentDoc}`;
export type CreateBackingMutationFn = Apollo.MutationFunction<CreateBackingMutation, CreateBackingMutationVariables>;
export function useCreateBackingMutation(baseOptions?: Apollo.MutationHookOptions<CreateBackingMutation, CreateBackingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateBackingMutation, CreateBackingMutationVariables>(CreateBackingDocument, options);
      }
export type CreateBackingMutationHookResult = ReturnType<typeof useCreateBackingMutation>;
export type CreateBackingMutationResult = Apollo.MutationResult<CreateBackingMutation>;
export const CreateCountryDocument = gql`
    mutation createCountry($input: CountryInput!) {
  createCountry(data: $input) {
    data {
      ...Country
    }
  }
}
    ${CountryFragmentDoc}`;
export type CreateCountryMutationFn = Apollo.MutationFunction<CreateCountryMutation, CreateCountryMutationVariables>;
export function useCreateCountryMutation(baseOptions?: Apollo.MutationHookOptions<CreateCountryMutation, CreateCountryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCountryMutation, CreateCountryMutationVariables>(CreateCountryDocument, options);
      }
export type CreateCountryMutationHookResult = ReturnType<typeof useCreateCountryMutation>;
export type CreateCountryMutationResult = Apollo.MutationResult<CreateCountryMutation>;
export const CreateDesignStyleDocument = gql`
    mutation createDesignStyle($input: DesignStyleInput!) {
  createDesignStyle(data: $input) {
    data {
      ...DesignStyle
    }
  }
}
    ${DesignStyleFragmentDoc}`;
export type CreateDesignStyleMutationFn = Apollo.MutationFunction<CreateDesignStyleMutation, CreateDesignStyleMutationVariables>;
export function useCreateDesignStyleMutation(baseOptions?: Apollo.MutationHookOptions<CreateDesignStyleMutation, CreateDesignStyleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateDesignStyleMutation, CreateDesignStyleMutationVariables>(CreateDesignStyleDocument, options);
      }
export type CreateDesignStyleMutationHookResult = ReturnType<typeof useCreateDesignStyleMutation>;
export type CreateDesignStyleMutationResult = Apollo.MutationResult<CreateDesignStyleMutation>;
export const CreateEngravingTypeDocument = gql`
    mutation createEngravingType($input: EngravingTypeInput!) {
  createEngravingType(data: $input) {
    data {
      ...EngravingType
    }
  }
}
    ${EngravingTypeFragmentDoc}`;
export type CreateEngravingTypeMutationFn = Apollo.MutationFunction<CreateEngravingTypeMutation, CreateEngravingTypeMutationVariables>;
export function useCreateEngravingTypeMutation(baseOptions?: Apollo.MutationHookOptions<CreateEngravingTypeMutation, CreateEngravingTypeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateEngravingTypeMutation, CreateEngravingTypeMutationVariables>(CreateEngravingTypeDocument, options);
      }
export type CreateEngravingTypeMutationHookResult = ReturnType<typeof useCreateEngravingTypeMutation>;
export type CreateEngravingTypeMutationResult = Apollo.MutationResult<CreateEngravingTypeMutation>;
export const CreateJewelryConditionTypeDocument = gql`
    mutation createJewelryConditionType($input: ConditionTypeInput!) {
  createConditionType(data: $input) {
    data {
      ...JewelryConditionType
    }
  }
}
    ${JewelryConditionTypeFragmentDoc}`;
export type CreateJewelryConditionTypeMutationFn = Apollo.MutationFunction<CreateJewelryConditionTypeMutation, CreateJewelryConditionTypeMutationVariables>;
export function useCreateJewelryConditionTypeMutation(baseOptions?: Apollo.MutationHookOptions<CreateJewelryConditionTypeMutation, CreateJewelryConditionTypeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateJewelryConditionTypeMutation, CreateJewelryConditionTypeMutationVariables>(CreateJewelryConditionTypeDocument, options);
      }
export type CreateJewelryConditionTypeMutationHookResult = ReturnType<typeof useCreateJewelryConditionTypeMutation>;
export type CreateJewelryConditionTypeMutationResult = Apollo.MutationResult<CreateJewelryConditionTypeMutation>;
export const CreateJewelryGenderTypeDocument = gql`
    mutation createJewelryGenderType($input: GenderTypeInput!) {
  createGenderType(data: $input) {
    data {
      ...JewelryGenderType
    }
  }
}
    ${JewelryGenderTypeFragmentDoc}`;
export type CreateJewelryGenderTypeMutationFn = Apollo.MutationFunction<CreateJewelryGenderTypeMutation, CreateJewelryGenderTypeMutationVariables>;
export function useCreateJewelryGenderTypeMutation(baseOptions?: Apollo.MutationHookOptions<CreateJewelryGenderTypeMutation, CreateJewelryGenderTypeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateJewelryGenderTypeMutation, CreateJewelryGenderTypeMutationVariables>(CreateJewelryGenderTypeDocument, options);
      }
export type CreateJewelryGenderTypeMutationHookResult = ReturnType<typeof useCreateJewelryGenderTypeMutation>;
export type CreateJewelryGenderTypeMutationResult = Apollo.MutationResult<CreateJewelryGenderTypeMutation>;
export const CreateJewelryProductDocument = gql`
    mutation createJewelryProduct($input: JewelryProductInput!) {
  createJewelryProduct(data: $input) {
    data {
      ...JewelryProduct
    }
  }
}
    ${JewelryProductFragmentDoc}
${JewelryProductMinFragmentDoc}
${FileFragmentDoc}
${DesignStyleFragmentDoc}
${ShankStyleFragmentDoc}
${SizeFragmentDoc}
${JewelryProductTypeFragmentDoc}
${SpecificTypeFragmentDoc}
${EngravingTypeFragmentDoc}
${TimePeriodFragmentDoc}
${MetalFinishTypeFragmentDoc}
${MetalTypeFragmentDoc}
${MaterialGradeFragmentDoc}
${JewelryGenderTypeFragmentDoc}
${JewelryConditionTypeFragmentDoc}
${PlattingTypeFragmentDoc}
${ManufacturingProcessFragmentDoc}
${PieceFragmentDoc}
${ProductBrandFragmentDoc}
${RentableDataFragmentDoc}
${DimensionFragmentDoc}
${WeightFragmentDoc}
${ProductInventoryItemFragmentDoc}
${ProductMinFragmentDoc}
${ProductTypeFragmentDoc}
${SerializeFragmentDoc}
${BusinessLocationFragmentDoc}
${LocationFragmentDoc}
${TaxMinFragmentDoc}
${TaxCollectionMinFragmentDoc}
${SubLocationMinFragmentDoc}
${TaxFragmentDoc}
${TaxAuthorityFragmentDoc}
${ProductAttributeOptionFragmentDoc}
${ProductAttributeOptionMinFragmentDoc}
${ProductAttributeMinFragmentDoc}`;
export type CreateJewelryProductMutationFn = Apollo.MutationFunction<CreateJewelryProductMutation, CreateJewelryProductMutationVariables>;
export function useCreateJewelryProductMutation(baseOptions?: Apollo.MutationHookOptions<CreateJewelryProductMutation, CreateJewelryProductMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateJewelryProductMutation, CreateJewelryProductMutationVariables>(CreateJewelryProductDocument, options);
      }
export type CreateJewelryProductMutationHookResult = ReturnType<typeof useCreateJewelryProductMutation>;
export type CreateJewelryProductMutationResult = Apollo.MutationResult<CreateJewelryProductMutation>;
export const CreateJewelryProductTypeDocument = gql`
    mutation createJewelryProductType($input: JewelryProductTypeInput!) {
  createJewelryProductType(data: $input) {
    data {
      ...JewelryProductType
    }
  }
}
    ${JewelryProductTypeFragmentDoc}`;
export type CreateJewelryProductTypeMutationFn = Apollo.MutationFunction<CreateJewelryProductTypeMutation, CreateJewelryProductTypeMutationVariables>;
export function useCreateJewelryProductTypeMutation(baseOptions?: Apollo.MutationHookOptions<CreateJewelryProductTypeMutation, CreateJewelryProductTypeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateJewelryProductTypeMutation, CreateJewelryProductTypeMutationVariables>(CreateJewelryProductTypeDocument, options);
      }
export type CreateJewelryProductTypeMutationHookResult = ReturnType<typeof useCreateJewelryProductTypeMutation>;
export type CreateJewelryProductTypeMutationResult = Apollo.MutationResult<CreateJewelryProductTypeMutation>;
export const CreateKnotStyleDocument = gql`
    mutation createKnotStyle($input: KnotStyleInput!) {
  createKnotStyle(data: $input) {
    data {
      ...KnotStyle
    }
  }
}
    ${KnotStyleFragmentDoc}`;
export type CreateKnotStyleMutationFn = Apollo.MutationFunction<CreateKnotStyleMutation, CreateKnotStyleMutationVariables>;
export function useCreateKnotStyleMutation(baseOptions?: Apollo.MutationHookOptions<CreateKnotStyleMutation, CreateKnotStyleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateKnotStyleMutation, CreateKnotStyleMutationVariables>(CreateKnotStyleDocument, options);
      }
export type CreateKnotStyleMutationHookResult = ReturnType<typeof useCreateKnotStyleMutation>;
export type CreateKnotStyleMutationResult = Apollo.MutationResult<CreateKnotStyleMutation>;
export const CreateLinkStyleDocument = gql`
    mutation createLinkStyle($input: LinkStyleInput!) {
  createLinkStyle(data: $input) {
    data {
      ...LinkStyle
    }
  }
}
    ${LinkStyleFragmentDoc}`;
export type CreateLinkStyleMutationFn = Apollo.MutationFunction<CreateLinkStyleMutation, CreateLinkStyleMutationVariables>;
export function useCreateLinkStyleMutation(baseOptions?: Apollo.MutationHookOptions<CreateLinkStyleMutation, CreateLinkStyleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateLinkStyleMutation, CreateLinkStyleMutationVariables>(CreateLinkStyleDocument, options);
      }
export type CreateLinkStyleMutationHookResult = ReturnType<typeof useCreateLinkStyleMutation>;
export type CreateLinkStyleMutationResult = Apollo.MutationResult<CreateLinkStyleMutation>;
export const CreateLinkTypeDocument = gql`
    mutation createLinkType($input: LinkTypeInput!) {
  createLinkType(data: $input) {
    data {
      ...LinkType
    }
  }
}
    ${LinkTypeFragmentDoc}`;
export type CreateLinkTypeMutationFn = Apollo.MutationFunction<CreateLinkTypeMutation, CreateLinkTypeMutationVariables>;
export function useCreateLinkTypeMutation(baseOptions?: Apollo.MutationHookOptions<CreateLinkTypeMutation, CreateLinkTypeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateLinkTypeMutation, CreateLinkTypeMutationVariables>(CreateLinkTypeDocument, options);
      }
export type CreateLinkTypeMutationHookResult = ReturnType<typeof useCreateLinkTypeMutation>;
export type CreateLinkTypeMutationResult = Apollo.MutationResult<CreateLinkTypeMutation>;
export const CreateMaterialGradeDocument = gql`
    mutation createMaterialGrade($input: MaterialGradeInput!) {
  createMaterialGrade(data: $input) {
    data {
      ...MaterialGrade
    }
  }
}
    ${MaterialGradeFragmentDoc}`;
export type CreateMaterialGradeMutationFn = Apollo.MutationFunction<CreateMaterialGradeMutation, CreateMaterialGradeMutationVariables>;
export function useCreateMaterialGradeMutation(baseOptions?: Apollo.MutationHookOptions<CreateMaterialGradeMutation, CreateMaterialGradeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateMaterialGradeMutation, CreateMaterialGradeMutationVariables>(CreateMaterialGradeDocument, options);
      }
export type CreateMaterialGradeMutationHookResult = ReturnType<typeof useCreateMaterialGradeMutation>;
export type CreateMaterialGradeMutationResult = Apollo.MutationResult<CreateMaterialGradeMutation>;
export const CreateMetalFinishTypeDocument = gql`
    mutation createMetalFinishType($input: MetalFinishTypeInput!) {
  createMetalFinishType(data: $input) {
    data {
      ...MetalFinishType
    }
  }
}
    ${MetalFinishTypeFragmentDoc}`;
export type CreateMetalFinishTypeMutationFn = Apollo.MutationFunction<CreateMetalFinishTypeMutation, CreateMetalFinishTypeMutationVariables>;
export function useCreateMetalFinishTypeMutation(baseOptions?: Apollo.MutationHookOptions<CreateMetalFinishTypeMutation, CreateMetalFinishTypeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateMetalFinishTypeMutation, CreateMetalFinishTypeMutationVariables>(CreateMetalFinishTypeDocument, options);
      }
export type CreateMetalFinishTypeMutationHookResult = ReturnType<typeof useCreateMetalFinishTypeMutation>;
export type CreateMetalFinishTypeMutationResult = Apollo.MutationResult<CreateMetalFinishTypeMutation>;
export const CreateMetalTypeDocument = gql`
    mutation createMetalType($input: MetalTypeInput!) {
  createMetalType(data: $input) {
    data {
      ...MetalType
    }
  }
}
    ${MetalTypeFragmentDoc}
${MaterialGradeFragmentDoc}`;
export type CreateMetalTypeMutationFn = Apollo.MutationFunction<CreateMetalTypeMutation, CreateMetalTypeMutationVariables>;
export function useCreateMetalTypeMutation(baseOptions?: Apollo.MutationHookOptions<CreateMetalTypeMutation, CreateMetalTypeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateMetalTypeMutation, CreateMetalTypeMutationVariables>(CreateMetalTypeDocument, options);
      }
export type CreateMetalTypeMutationHookResult = ReturnType<typeof useCreateMetalTypeMutation>;
export type CreateMetalTypeMutationResult = Apollo.MutationResult<CreateMetalTypeMutation>;
export const CreatePieceDocument = gql`
    mutation createPiece($input: PieceInput!) {
  createPiece(data: $input) {
    data {
      ...Piece
    }
  }
}
    ${PieceFragmentDoc}`;
export type CreatePieceMutationFn = Apollo.MutationFunction<CreatePieceMutation, CreatePieceMutationVariables>;
export function useCreatePieceMutation(baseOptions?: Apollo.MutationHookOptions<CreatePieceMutation, CreatePieceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatePieceMutation, CreatePieceMutationVariables>(CreatePieceDocument, options);
      }
export type CreatePieceMutationHookResult = ReturnType<typeof useCreatePieceMutation>;
export type CreatePieceMutationResult = Apollo.MutationResult<CreatePieceMutation>;
export const CreatePlattingTypeDocument = gql`
    mutation createPlattingType($input: PlattingTypeInput!) {
  createPlattingType(data: $input) {
    data {
      ...PlattingType
    }
  }
}
    ${PlattingTypeFragmentDoc}`;
export type CreatePlattingTypeMutationFn = Apollo.MutationFunction<CreatePlattingTypeMutation, CreatePlattingTypeMutationVariables>;
export function useCreatePlattingTypeMutation(baseOptions?: Apollo.MutationHookOptions<CreatePlattingTypeMutation, CreatePlattingTypeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatePlattingTypeMutation, CreatePlattingTypeMutationVariables>(CreatePlattingTypeDocument, options);
      }
export type CreatePlattingTypeMutationHookResult = ReturnType<typeof useCreatePlattingTypeMutation>;
export type CreatePlattingTypeMutationResult = Apollo.MutationResult<CreatePlattingTypeMutation>;
export const CreateShankStyleDocument = gql`
    mutation createShankStyle($input: ShankStyleInput!) {
  createShankStyle(data: $input) {
    data {
      ...ShankStyle
    }
  }
}
    ${ShankStyleFragmentDoc}`;
export type CreateShankStyleMutationFn = Apollo.MutationFunction<CreateShankStyleMutation, CreateShankStyleMutationVariables>;
export function useCreateShankStyleMutation(baseOptions?: Apollo.MutationHookOptions<CreateShankStyleMutation, CreateShankStyleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateShankStyleMutation, CreateShankStyleMutationVariables>(CreateShankStyleDocument, options);
      }
export type CreateShankStyleMutationHookResult = ReturnType<typeof useCreateShankStyleMutation>;
export type CreateShankStyleMutationResult = Apollo.MutationResult<CreateShankStyleMutation>;
export const CreateSizeDocument = gql`
    mutation createSize($input: SizeInput!) {
  createSize(data: $input) {
    data {
      ...Size
    }
  }
}
    ${SizeFragmentDoc}`;
export type CreateSizeMutationFn = Apollo.MutationFunction<CreateSizeMutation, CreateSizeMutationVariables>;
export function useCreateSizeMutation(baseOptions?: Apollo.MutationHookOptions<CreateSizeMutation, CreateSizeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSizeMutation, CreateSizeMutationVariables>(CreateSizeDocument, options);
      }
export type CreateSizeMutationHookResult = ReturnType<typeof useCreateSizeMutation>;
export type CreateSizeMutationResult = Apollo.MutationResult<CreateSizeMutation>;
export const CreateSpecificTypeDocument = gql`
    mutation createSpecificType($input: SpecificTypeInput!) {
  createSpecificType(data: $input) {
    data {
      ...SpecificType
    }
  }
}
    ${SpecificTypeFragmentDoc}`;
export type CreateSpecificTypeMutationFn = Apollo.MutationFunction<CreateSpecificTypeMutation, CreateSpecificTypeMutationVariables>;
export function useCreateSpecificTypeMutation(baseOptions?: Apollo.MutationHookOptions<CreateSpecificTypeMutation, CreateSpecificTypeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSpecificTypeMutation, CreateSpecificTypeMutationVariables>(CreateSpecificTypeDocument, options);
      }
export type CreateSpecificTypeMutationHookResult = ReturnType<typeof useCreateSpecificTypeMutation>;
export type CreateSpecificTypeMutationResult = Apollo.MutationResult<CreateSpecificTypeMutation>;
export const CreateStrandDocument = gql`
    mutation createStrand($input: StrandInput!) {
  createStrand(data: $input) {
    data {
      ...Strand
    }
  }
}
    ${StrandFragmentDoc}`;
export type CreateStrandMutationFn = Apollo.MutationFunction<CreateStrandMutation, CreateStrandMutationVariables>;
export function useCreateStrandMutation(baseOptions?: Apollo.MutationHookOptions<CreateStrandMutation, CreateStrandMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateStrandMutation, CreateStrandMutationVariables>(CreateStrandDocument, options);
      }
export type CreateStrandMutationHookResult = ReturnType<typeof useCreateStrandMutation>;
export type CreateStrandMutationResult = Apollo.MutationResult<CreateStrandMutation>;
export const CreateStrandsLengthDocument = gql`
    mutation createStrandsLength($input: StrandsLengthInput!) {
  createStrandsLength(data: $input) {
    data {
      ...StrandsLength
    }
  }
}
    ${StrandsLengthFragmentDoc}`;
export type CreateStrandsLengthMutationFn = Apollo.MutationFunction<CreateStrandsLengthMutation, CreateStrandsLengthMutationVariables>;
export function useCreateStrandsLengthMutation(baseOptions?: Apollo.MutationHookOptions<CreateStrandsLengthMutation, CreateStrandsLengthMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateStrandsLengthMutation, CreateStrandsLengthMutationVariables>(CreateStrandsLengthDocument, options);
      }
export type CreateStrandsLengthMutationHookResult = ReturnType<typeof useCreateStrandsLengthMutation>;
export type CreateStrandsLengthMutationResult = Apollo.MutationResult<CreateStrandsLengthMutation>;
export const CreateTimePeriodDocument = gql`
    mutation createTimePeriod($input: TimePeriodInput!) {
  createTimePeriod(data: $input) {
    data {
      ...TimePeriod
    }
  }
}
    ${TimePeriodFragmentDoc}`;
export type CreateTimePeriodMutationFn = Apollo.MutationFunction<CreateTimePeriodMutation, CreateTimePeriodMutationVariables>;
export function useCreateTimePeriodMutation(baseOptions?: Apollo.MutationHookOptions<CreateTimePeriodMutation, CreateTimePeriodMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTimePeriodMutation, CreateTimePeriodMutationVariables>(CreateTimePeriodDocument, options);
      }
export type CreateTimePeriodMutationHookResult = ReturnType<typeof useCreateTimePeriodMutation>;
export type CreateTimePeriodMutationResult = Apollo.MutationResult<CreateTimePeriodMutation>;
export const CreateManufacturingProcessDocument = gql`
    mutation createManufacturingProcess($input: ManufacturingProcessInput!) {
  createManufacturingProcess(data: $input) {
    data {
      ...ManufacturingProcess
    }
  }
}
    ${ManufacturingProcessFragmentDoc}`;
export type CreateManufacturingProcessMutationFn = Apollo.MutationFunction<CreateManufacturingProcessMutation, CreateManufacturingProcessMutationVariables>;
export function useCreateManufacturingProcessMutation(baseOptions?: Apollo.MutationHookOptions<CreateManufacturingProcessMutation, CreateManufacturingProcessMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateManufacturingProcessMutation, CreateManufacturingProcessMutationVariables>(CreateManufacturingProcessDocument, options);
      }
export type CreateManufacturingProcessMutationHookResult = ReturnType<typeof useCreateManufacturingProcessMutation>;
export type CreateManufacturingProcessMutationResult = Apollo.MutationResult<CreateManufacturingProcessMutation>;
export const UpdateJewelryProductDocument = gql`
    mutation updateJewelryProduct($id: ID!, $input: JewelryProductInput!) {
  updateJewelryProduct(id: $id, data: $input) {
    data {
      ...JewelryProduct
    }
  }
}
    ${JewelryProductFragmentDoc}
${JewelryProductMinFragmentDoc}
${FileFragmentDoc}
${DesignStyleFragmentDoc}
${ShankStyleFragmentDoc}
${SizeFragmentDoc}
${JewelryProductTypeFragmentDoc}
${SpecificTypeFragmentDoc}
${EngravingTypeFragmentDoc}
${TimePeriodFragmentDoc}
${MetalFinishTypeFragmentDoc}
${MetalTypeFragmentDoc}
${MaterialGradeFragmentDoc}
${JewelryGenderTypeFragmentDoc}
${JewelryConditionTypeFragmentDoc}
${PlattingTypeFragmentDoc}
${ManufacturingProcessFragmentDoc}
${PieceFragmentDoc}
${ProductBrandFragmentDoc}
${RentableDataFragmentDoc}
${DimensionFragmentDoc}
${WeightFragmentDoc}
${ProductInventoryItemFragmentDoc}
${ProductMinFragmentDoc}
${ProductTypeFragmentDoc}
${SerializeFragmentDoc}
${BusinessLocationFragmentDoc}
${LocationFragmentDoc}
${TaxMinFragmentDoc}
${TaxCollectionMinFragmentDoc}
${SubLocationMinFragmentDoc}
${TaxFragmentDoc}
${TaxAuthorityFragmentDoc}
${ProductAttributeOptionFragmentDoc}
${ProductAttributeOptionMinFragmentDoc}
${ProductAttributeMinFragmentDoc}`;
export type UpdateJewelryProductMutationFn = Apollo.MutationFunction<UpdateJewelryProductMutation, UpdateJewelryProductMutationVariables>;
export function useUpdateJewelryProductMutation(baseOptions?: Apollo.MutationHookOptions<UpdateJewelryProductMutation, UpdateJewelryProductMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateJewelryProductMutation, UpdateJewelryProductMutationVariables>(UpdateJewelryProductDocument, options);
      }
export type UpdateJewelryProductMutationHookResult = ReturnType<typeof useUpdateJewelryProductMutation>;
export type UpdateJewelryProductMutationResult = Apollo.MutationResult<UpdateJewelryProductMutation>;
export const UpdateMetalTypeDocument = gql`
    mutation updateMetalType($id: ID!, $input: MetalTypeInput!) {
  updateMetalType(id: $id, data: $input) {
    data {
      ...MetalType
    }
  }
}
    ${MetalTypeFragmentDoc}
${MaterialGradeFragmentDoc}`;
export type UpdateMetalTypeMutationFn = Apollo.MutationFunction<UpdateMetalTypeMutation, UpdateMetalTypeMutationVariables>;
export function useUpdateMetalTypeMutation(baseOptions?: Apollo.MutationHookOptions<UpdateMetalTypeMutation, UpdateMetalTypeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateMetalTypeMutation, UpdateMetalTypeMutationVariables>(UpdateMetalTypeDocument, options);
      }
export type UpdateMetalTypeMutationHookResult = ReturnType<typeof useUpdateMetalTypeMutation>;
export type UpdateMetalTypeMutationResult = Apollo.MutationResult<UpdateMetalTypeMutation>;
export const AllJewelryProductsDocument = gql`
    query allJewelryProducts($filters: JewelryProductFiltersInput, $pagination: PaginationArg = {}, $sort: [String] = []) {
  jewelryProducts(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...JewelryProduct
    }
    meta {
      ...Meta
    }
  }
}
    ${JewelryProductFragmentDoc}
${JewelryProductMinFragmentDoc}
${FileFragmentDoc}
${DesignStyleFragmentDoc}
${ShankStyleFragmentDoc}
${SizeFragmentDoc}
${JewelryProductTypeFragmentDoc}
${SpecificTypeFragmentDoc}
${EngravingTypeFragmentDoc}
${TimePeriodFragmentDoc}
${MetalFinishTypeFragmentDoc}
${MetalTypeFragmentDoc}
${MaterialGradeFragmentDoc}
${JewelryGenderTypeFragmentDoc}
${JewelryConditionTypeFragmentDoc}
${PlattingTypeFragmentDoc}
${ManufacturingProcessFragmentDoc}
${PieceFragmentDoc}
${ProductBrandFragmentDoc}
${RentableDataFragmentDoc}
${DimensionFragmentDoc}
${WeightFragmentDoc}
${ProductInventoryItemFragmentDoc}
${ProductMinFragmentDoc}
${ProductTypeFragmentDoc}
${SerializeFragmentDoc}
${BusinessLocationFragmentDoc}
${LocationFragmentDoc}
${TaxMinFragmentDoc}
${TaxCollectionMinFragmentDoc}
${SubLocationMinFragmentDoc}
${TaxFragmentDoc}
${TaxAuthorityFragmentDoc}
${ProductAttributeOptionFragmentDoc}
${ProductAttributeOptionMinFragmentDoc}
${ProductAttributeMinFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useAllJewelryProductsQuery(baseOptions?: Apollo.QueryHookOptions<AllJewelryProductsQuery, AllJewelryProductsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AllJewelryProductsQuery, AllJewelryProductsQueryVariables>(AllJewelryProductsDocument, options);
      }
export function useAllJewelryProductsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AllJewelryProductsQuery, AllJewelryProductsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AllJewelryProductsQuery, AllJewelryProductsQueryVariables>(AllJewelryProductsDocument, options);
        }
export type AllJewelryProductsQueryHookResult = ReturnType<typeof useAllJewelryProductsQuery>;
export type AllJewelryProductsLazyQueryHookResult = ReturnType<typeof useAllJewelryProductsLazyQuery>;
export type AllJewelryProductsQueryResult = Apollo.QueryResult<AllJewelryProductsQuery, AllJewelryProductsQueryVariables>;
export const BackingsDocument = gql`
    query backings($filters: BackingFiltersInput, $pagination: PaginationArg = {}, $sort: [String] = []) {
  backings(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...Backing
    }
    meta {
      ...Meta
    }
  }
}
    ${BackingFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useBackingsQuery(baseOptions?: Apollo.QueryHookOptions<BackingsQuery, BackingsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BackingsQuery, BackingsQueryVariables>(BackingsDocument, options);
      }
export function useBackingsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BackingsQuery, BackingsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BackingsQuery, BackingsQueryVariables>(BackingsDocument, options);
        }
export type BackingsQueryHookResult = ReturnType<typeof useBackingsQuery>;
export type BackingsLazyQueryHookResult = ReturnType<typeof useBackingsLazyQuery>;
export type BackingsQueryResult = Apollo.QueryResult<BackingsQuery, BackingsQueryVariables>;
export const BoxPapersDocument = gql`
    query boxPapers($filters: BoxPaperFiltersInput, $pagination: PaginationArg = {}, $sort: [String] = []) {
  boxPapers(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...BoxPaper
    }
    meta {
      ...Meta
    }
  }
}
    ${BoxPaperFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useBoxPapersQuery(baseOptions?: Apollo.QueryHookOptions<BoxPapersQuery, BoxPapersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BoxPapersQuery, BoxPapersQueryVariables>(BoxPapersDocument, options);
      }
export function useBoxPapersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BoxPapersQuery, BoxPapersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BoxPapersQuery, BoxPapersQueryVariables>(BoxPapersDocument, options);
        }
export type BoxPapersQueryHookResult = ReturnType<typeof useBoxPapersQuery>;
export type BoxPapersLazyQueryHookResult = ReturnType<typeof useBoxPapersLazyQuery>;
export type BoxPapersQueryResult = Apollo.QueryResult<BoxPapersQuery, BoxPapersQueryVariables>;
export const CountriesDocument = gql`
    query countries($filters: CountryFiltersInput, $pagination: PaginationArg = {}, $sort: [String] = []) {
  countries(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...Country
    }
    meta {
      ...Meta
    }
  }
}
    ${CountryFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useCountriesQuery(baseOptions?: Apollo.QueryHookOptions<CountriesQuery, CountriesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CountriesQuery, CountriesQueryVariables>(CountriesDocument, options);
      }
export function useCountriesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CountriesQuery, CountriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CountriesQuery, CountriesQueryVariables>(CountriesDocument, options);
        }
export type CountriesQueryHookResult = ReturnType<typeof useCountriesQuery>;
export type CountriesLazyQueryHookResult = ReturnType<typeof useCountriesLazyQuery>;
export type CountriesQueryResult = Apollo.QueryResult<CountriesQuery, CountriesQueryVariables>;
export const DesignStylesDocument = gql`
    query designStyles($filters: DesignStyleFiltersInput, $pagination: PaginationArg = {}, $sort: [String] = []) {
  designStyles(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...DesignStyle
    }
    meta {
      ...Meta
    }
  }
}
    ${DesignStyleFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useDesignStylesQuery(baseOptions?: Apollo.QueryHookOptions<DesignStylesQuery, DesignStylesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DesignStylesQuery, DesignStylesQueryVariables>(DesignStylesDocument, options);
      }
export function useDesignStylesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DesignStylesQuery, DesignStylesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DesignStylesQuery, DesignStylesQueryVariables>(DesignStylesDocument, options);
        }
export type DesignStylesQueryHookResult = ReturnType<typeof useDesignStylesQuery>;
export type DesignStylesLazyQueryHookResult = ReturnType<typeof useDesignStylesLazyQuery>;
export type DesignStylesQueryResult = Apollo.QueryResult<DesignStylesQuery, DesignStylesQueryVariables>;
export const EngravingTypesDocument = gql`
    query engravingTypes($filters: EngravingTypeFiltersInput, $pagination: PaginationArg = {}, $sort: [String] = []) {
  engravingTypes(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...EngravingType
    }
    meta {
      ...Meta
    }
  }
}
    ${EngravingTypeFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useEngravingTypesQuery(baseOptions?: Apollo.QueryHookOptions<EngravingTypesQuery, EngravingTypesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<EngravingTypesQuery, EngravingTypesQueryVariables>(EngravingTypesDocument, options);
      }
export function useEngravingTypesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EngravingTypesQuery, EngravingTypesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<EngravingTypesQuery, EngravingTypesQueryVariables>(EngravingTypesDocument, options);
        }
export type EngravingTypesQueryHookResult = ReturnType<typeof useEngravingTypesQuery>;
export type EngravingTypesLazyQueryHookResult = ReturnType<typeof useEngravingTypesLazyQuery>;
export type EngravingTypesQueryResult = Apollo.QueryResult<EngravingTypesQuery, EngravingTypesQueryVariables>;
export const JewelryConditionTypesDocument = gql`
    query jewelryConditionTypes($filters: ConditionTypeFiltersInput, $pagination: PaginationArg = {}, $sort: [String] = []) {
  conditionTypes(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...JewelryConditionType
    }
    meta {
      ...Meta
    }
  }
}
    ${JewelryConditionTypeFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useJewelryConditionTypesQuery(baseOptions?: Apollo.QueryHookOptions<JewelryConditionTypesQuery, JewelryConditionTypesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<JewelryConditionTypesQuery, JewelryConditionTypesQueryVariables>(JewelryConditionTypesDocument, options);
      }
export function useJewelryConditionTypesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<JewelryConditionTypesQuery, JewelryConditionTypesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<JewelryConditionTypesQuery, JewelryConditionTypesQueryVariables>(JewelryConditionTypesDocument, options);
        }
export type JewelryConditionTypesQueryHookResult = ReturnType<typeof useJewelryConditionTypesQuery>;
export type JewelryConditionTypesLazyQueryHookResult = ReturnType<typeof useJewelryConditionTypesLazyQuery>;
export type JewelryConditionTypesQueryResult = Apollo.QueryResult<JewelryConditionTypesQuery, JewelryConditionTypesQueryVariables>;
export const JewelryGenderTypesDocument = gql`
    query jewelryGenderTypes($filters: GenderTypeFiltersInput, $pagination: PaginationArg = {}, $sort: [String] = []) {
  genderTypes(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...JewelryGenderType
    }
    meta {
      ...Meta
    }
  }
}
    ${JewelryGenderTypeFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useJewelryGenderTypesQuery(baseOptions?: Apollo.QueryHookOptions<JewelryGenderTypesQuery, JewelryGenderTypesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<JewelryGenderTypesQuery, JewelryGenderTypesQueryVariables>(JewelryGenderTypesDocument, options);
      }
export function useJewelryGenderTypesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<JewelryGenderTypesQuery, JewelryGenderTypesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<JewelryGenderTypesQuery, JewelryGenderTypesQueryVariables>(JewelryGenderTypesDocument, options);
        }
export type JewelryGenderTypesQueryHookResult = ReturnType<typeof useJewelryGenderTypesQuery>;
export type JewelryGenderTypesLazyQueryHookResult = ReturnType<typeof useJewelryGenderTypesLazyQuery>;
export type JewelryGenderTypesQueryResult = Apollo.QueryResult<JewelryGenderTypesQuery, JewelryGenderTypesQueryVariables>;
export const JewelryProductByUuidDocument = gql`
    query jewelryProductByUuid($uuid: String!) {
  jewelryProducts(filters: {uuid: {eq: $uuid}}) {
    data {
      ...JewelryProduct
    }
  }
}
    ${JewelryProductFragmentDoc}
${JewelryProductMinFragmentDoc}
${FileFragmentDoc}
${DesignStyleFragmentDoc}
${ShankStyleFragmentDoc}
${SizeFragmentDoc}
${JewelryProductTypeFragmentDoc}
${SpecificTypeFragmentDoc}
${EngravingTypeFragmentDoc}
${TimePeriodFragmentDoc}
${MetalFinishTypeFragmentDoc}
${MetalTypeFragmentDoc}
${MaterialGradeFragmentDoc}
${JewelryGenderTypeFragmentDoc}
${JewelryConditionTypeFragmentDoc}
${PlattingTypeFragmentDoc}
${ManufacturingProcessFragmentDoc}
${PieceFragmentDoc}
${ProductBrandFragmentDoc}
${RentableDataFragmentDoc}
${DimensionFragmentDoc}
${WeightFragmentDoc}
${ProductInventoryItemFragmentDoc}
${ProductMinFragmentDoc}
${ProductTypeFragmentDoc}
${SerializeFragmentDoc}
${BusinessLocationFragmentDoc}
${LocationFragmentDoc}
${TaxMinFragmentDoc}
${TaxCollectionMinFragmentDoc}
${SubLocationMinFragmentDoc}
${TaxFragmentDoc}
${TaxAuthorityFragmentDoc}
${ProductAttributeOptionFragmentDoc}
${ProductAttributeOptionMinFragmentDoc}
${ProductAttributeMinFragmentDoc}`;
export function useJewelryProductByUuidQuery(baseOptions: Apollo.QueryHookOptions<JewelryProductByUuidQuery, JewelryProductByUuidQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<JewelryProductByUuidQuery, JewelryProductByUuidQueryVariables>(JewelryProductByUuidDocument, options);
      }
export function useJewelryProductByUuidLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<JewelryProductByUuidQuery, JewelryProductByUuidQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<JewelryProductByUuidQuery, JewelryProductByUuidQueryVariables>(JewelryProductByUuidDocument, options);
        }
export type JewelryProductByUuidQueryHookResult = ReturnType<typeof useJewelryProductByUuidQuery>;
export type JewelryProductByUuidLazyQueryHookResult = ReturnType<typeof useJewelryProductByUuidLazyQuery>;
export type JewelryProductByUuidQueryResult = Apollo.QueryResult<JewelryProductByUuidQuery, JewelryProductByUuidQueryVariables>;
export const JewelryProductTypesDocument = gql`
    query jewelryProductTypes($filters: JewelryProductTypeFiltersInput, $pagination: PaginationArg = {}, $sort: [String] = []) {
  jewelryProductTypes(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...JewelryProductType
    }
    meta {
      ...Meta
    }
  }
}
    ${JewelryProductTypeFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useJewelryProductTypesQuery(baseOptions?: Apollo.QueryHookOptions<JewelryProductTypesQuery, JewelryProductTypesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<JewelryProductTypesQuery, JewelryProductTypesQueryVariables>(JewelryProductTypesDocument, options);
      }
export function useJewelryProductTypesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<JewelryProductTypesQuery, JewelryProductTypesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<JewelryProductTypesQuery, JewelryProductTypesQueryVariables>(JewelryProductTypesDocument, options);
        }
export type JewelryProductTypesQueryHookResult = ReturnType<typeof useJewelryProductTypesQuery>;
export type JewelryProductTypesLazyQueryHookResult = ReturnType<typeof useJewelryProductTypesLazyQuery>;
export type JewelryProductTypesQueryResult = Apollo.QueryResult<JewelryProductTypesQuery, JewelryProductTypesQueryVariables>;
export const KnotStylesDocument = gql`
    query knotStyles($filters: KnotStyleFiltersInput, $pagination: PaginationArg = {}, $sort: [String] = []) {
  knotStyles(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...KnotStyle
    }
    meta {
      ...Meta
    }
  }
}
    ${KnotStyleFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useKnotStylesQuery(baseOptions?: Apollo.QueryHookOptions<KnotStylesQuery, KnotStylesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<KnotStylesQuery, KnotStylesQueryVariables>(KnotStylesDocument, options);
      }
export function useKnotStylesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<KnotStylesQuery, KnotStylesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<KnotStylesQuery, KnotStylesQueryVariables>(KnotStylesDocument, options);
        }
export type KnotStylesQueryHookResult = ReturnType<typeof useKnotStylesQuery>;
export type KnotStylesLazyQueryHookResult = ReturnType<typeof useKnotStylesLazyQuery>;
export type KnotStylesQueryResult = Apollo.QueryResult<KnotStylesQuery, KnotStylesQueryVariables>;
export const LinkStylesDocument = gql`
    query linkStyles($filters: LinkStyleFiltersInput, $pagination: PaginationArg = {}, $sort: [String] = []) {
  linkStyles(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...LinkStyle
    }
    meta {
      ...Meta
    }
  }
}
    ${LinkStyleFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useLinkStylesQuery(baseOptions?: Apollo.QueryHookOptions<LinkStylesQuery, LinkStylesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<LinkStylesQuery, LinkStylesQueryVariables>(LinkStylesDocument, options);
      }
export function useLinkStylesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LinkStylesQuery, LinkStylesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<LinkStylesQuery, LinkStylesQueryVariables>(LinkStylesDocument, options);
        }
export type LinkStylesQueryHookResult = ReturnType<typeof useLinkStylesQuery>;
export type LinkStylesLazyQueryHookResult = ReturnType<typeof useLinkStylesLazyQuery>;
export type LinkStylesQueryResult = Apollo.QueryResult<LinkStylesQuery, LinkStylesQueryVariables>;
export const LinkTypesDocument = gql`
    query linkTypes($filters: LinkTypeFiltersInput, $pagination: PaginationArg = {}, $sort: [String] = []) {
  linkTypes(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...LinkType
    }
    meta {
      ...Meta
    }
  }
}
    ${LinkTypeFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useLinkTypesQuery(baseOptions?: Apollo.QueryHookOptions<LinkTypesQuery, LinkTypesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<LinkTypesQuery, LinkTypesQueryVariables>(LinkTypesDocument, options);
      }
export function useLinkTypesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LinkTypesQuery, LinkTypesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<LinkTypesQuery, LinkTypesQueryVariables>(LinkTypesDocument, options);
        }
export type LinkTypesQueryHookResult = ReturnType<typeof useLinkTypesQuery>;
export type LinkTypesLazyQueryHookResult = ReturnType<typeof useLinkTypesLazyQuery>;
export type LinkTypesQueryResult = Apollo.QueryResult<LinkTypesQuery, LinkTypesQueryVariables>;
export const ManufacturingProcessDocument = gql`
    query manufacturingProcess($filters: ManufacturingProcessFiltersInput, $pagination: PaginationArg = {}, $sort: [String] = []) {
  manufacturingProcesses(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...ManufacturingProcess
    }
    meta {
      ...Meta
    }
  }
}
    ${ManufacturingProcessFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useManufacturingProcessQuery(baseOptions?: Apollo.QueryHookOptions<ManufacturingProcessQuery, ManufacturingProcessQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ManufacturingProcessQuery, ManufacturingProcessQueryVariables>(ManufacturingProcessDocument, options);
      }
export function useManufacturingProcessLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ManufacturingProcessQuery, ManufacturingProcessQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ManufacturingProcessQuery, ManufacturingProcessQueryVariables>(ManufacturingProcessDocument, options);
        }
export type ManufacturingProcessQueryHookResult = ReturnType<typeof useManufacturingProcessQuery>;
export type ManufacturingProcessLazyQueryHookResult = ReturnType<typeof useManufacturingProcessLazyQuery>;
export type ManufacturingProcessQueryResult = Apollo.QueryResult<ManufacturingProcessQuery, ManufacturingProcessQueryVariables>;
export const MaterialGradesDocument = gql`
    query materialGrades($filters: MaterialGradeFiltersInput, $pagination: PaginationArg = {}, $sort: [String] = []) {
  materialGrades(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...MaterialGrade
    }
    meta {
      ...Meta
    }
  }
}
    ${MaterialGradeFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useMaterialGradesQuery(baseOptions?: Apollo.QueryHookOptions<MaterialGradesQuery, MaterialGradesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MaterialGradesQuery, MaterialGradesQueryVariables>(MaterialGradesDocument, options);
      }
export function useMaterialGradesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MaterialGradesQuery, MaterialGradesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MaterialGradesQuery, MaterialGradesQueryVariables>(MaterialGradesDocument, options);
        }
export type MaterialGradesQueryHookResult = ReturnType<typeof useMaterialGradesQuery>;
export type MaterialGradesLazyQueryHookResult = ReturnType<typeof useMaterialGradesLazyQuery>;
export type MaterialGradesQueryResult = Apollo.QueryResult<MaterialGradesQuery, MaterialGradesQueryVariables>;
export const MetalFinishTypesDocument = gql`
    query metalFinishTypes($filters: MetalFinishTypeFiltersInput, $pagination: PaginationArg = {}, $sort: [String] = []) {
  metalFinishTypes(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...MetalFinishType
    }
    meta {
      ...Meta
    }
  }
}
    ${MetalFinishTypeFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useMetalFinishTypesQuery(baseOptions?: Apollo.QueryHookOptions<MetalFinishTypesQuery, MetalFinishTypesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MetalFinishTypesQuery, MetalFinishTypesQueryVariables>(MetalFinishTypesDocument, options);
      }
export function useMetalFinishTypesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MetalFinishTypesQuery, MetalFinishTypesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MetalFinishTypesQuery, MetalFinishTypesQueryVariables>(MetalFinishTypesDocument, options);
        }
export type MetalFinishTypesQueryHookResult = ReturnType<typeof useMetalFinishTypesQuery>;
export type MetalFinishTypesLazyQueryHookResult = ReturnType<typeof useMetalFinishTypesLazyQuery>;
export type MetalFinishTypesQueryResult = Apollo.QueryResult<MetalFinishTypesQuery, MetalFinishTypesQueryVariables>;
export const MetalTypesDocument = gql`
    query metalTypes($filters: MetalTypeFiltersInput, $pagination: PaginationArg = {}, $sort: [String] = []) {
  metalTypes(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...MetalType
    }
    meta {
      ...Meta
    }
  }
}
    ${MetalTypeFragmentDoc}
${MaterialGradeFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useMetalTypesQuery(baseOptions?: Apollo.QueryHookOptions<MetalTypesQuery, MetalTypesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MetalTypesQuery, MetalTypesQueryVariables>(MetalTypesDocument, options);
      }
export function useMetalTypesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MetalTypesQuery, MetalTypesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MetalTypesQuery, MetalTypesQueryVariables>(MetalTypesDocument, options);
        }
export type MetalTypesQueryHookResult = ReturnType<typeof useMetalTypesQuery>;
export type MetalTypesLazyQueryHookResult = ReturnType<typeof useMetalTypesLazyQuery>;
export type MetalTypesQueryResult = Apollo.QueryResult<MetalTypesQuery, MetalTypesQueryVariables>;
export const PiecesDocument = gql`
    query pieces($filters: PieceFiltersInput, $pagination: PaginationArg = {}, $sort: [String] = []) {
  pieces(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...Piece
    }
    meta {
      ...Meta
    }
  }
}
    ${PieceFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function usePiecesQuery(baseOptions?: Apollo.QueryHookOptions<PiecesQuery, PiecesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PiecesQuery, PiecesQueryVariables>(PiecesDocument, options);
      }
export function usePiecesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PiecesQuery, PiecesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PiecesQuery, PiecesQueryVariables>(PiecesDocument, options);
        }
export type PiecesQueryHookResult = ReturnType<typeof usePiecesQuery>;
export type PiecesLazyQueryHookResult = ReturnType<typeof usePiecesLazyQuery>;
export type PiecesQueryResult = Apollo.QueryResult<PiecesQuery, PiecesQueryVariables>;
export const PlattingTypesDocument = gql`
    query plattingTypes($filters: PlattingTypeFiltersInput, $pagination: PaginationArg = {}, $sort: [String] = []) {
  plattingTypes(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...PlattingType
    }
    meta {
      ...Meta
    }
  }
}
    ${PlattingTypeFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function usePlattingTypesQuery(baseOptions?: Apollo.QueryHookOptions<PlattingTypesQuery, PlattingTypesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PlattingTypesQuery, PlattingTypesQueryVariables>(PlattingTypesDocument, options);
      }
export function usePlattingTypesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PlattingTypesQuery, PlattingTypesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PlattingTypesQuery, PlattingTypesQueryVariables>(PlattingTypesDocument, options);
        }
export type PlattingTypesQueryHookResult = ReturnType<typeof usePlattingTypesQuery>;
export type PlattingTypesLazyQueryHookResult = ReturnType<typeof usePlattingTypesLazyQuery>;
export type PlattingTypesQueryResult = Apollo.QueryResult<PlattingTypesQuery, PlattingTypesQueryVariables>;
export const ShankStylesDocument = gql`
    query shankStyles($filters: ShankStyleFiltersInput, $pagination: PaginationArg = {}, $sort: [String] = []) {
  shankStyles(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...ShankStyle
    }
    meta {
      ...Meta
    }
  }
}
    ${ShankStyleFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useShankStylesQuery(baseOptions?: Apollo.QueryHookOptions<ShankStylesQuery, ShankStylesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ShankStylesQuery, ShankStylesQueryVariables>(ShankStylesDocument, options);
      }
export function useShankStylesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ShankStylesQuery, ShankStylesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ShankStylesQuery, ShankStylesQueryVariables>(ShankStylesDocument, options);
        }
export type ShankStylesQueryHookResult = ReturnType<typeof useShankStylesQuery>;
export type ShankStylesLazyQueryHookResult = ReturnType<typeof useShankStylesLazyQuery>;
export type ShankStylesQueryResult = Apollo.QueryResult<ShankStylesQuery, ShankStylesQueryVariables>;
export const SizesDocument = gql`
    query sizes($filters: SizeFiltersInput, $pagination: PaginationArg = {}, $sort: [String] = []) {
  sizes(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...Size
    }
    meta {
      ...Meta
    }
  }
}
    ${SizeFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useSizesQuery(baseOptions?: Apollo.QueryHookOptions<SizesQuery, SizesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SizesQuery, SizesQueryVariables>(SizesDocument, options);
      }
export function useSizesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SizesQuery, SizesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SizesQuery, SizesQueryVariables>(SizesDocument, options);
        }
export type SizesQueryHookResult = ReturnType<typeof useSizesQuery>;
export type SizesLazyQueryHookResult = ReturnType<typeof useSizesLazyQuery>;
export type SizesQueryResult = Apollo.QueryResult<SizesQuery, SizesQueryVariables>;
export const SpecificTypesDocument = gql`
    query specificTypes($filters: SpecificTypeFiltersInput, $pagination: PaginationArg = {}, $sort: [String] = []) {
  specificTypes(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...SpecificType
    }
    meta {
      ...Meta
    }
  }
}
    ${SpecificTypeFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useSpecificTypesQuery(baseOptions?: Apollo.QueryHookOptions<SpecificTypesQuery, SpecificTypesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SpecificTypesQuery, SpecificTypesQueryVariables>(SpecificTypesDocument, options);
      }
export function useSpecificTypesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SpecificTypesQuery, SpecificTypesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SpecificTypesQuery, SpecificTypesQueryVariables>(SpecificTypesDocument, options);
        }
export type SpecificTypesQueryHookResult = ReturnType<typeof useSpecificTypesQuery>;
export type SpecificTypesLazyQueryHookResult = ReturnType<typeof useSpecificTypesLazyQuery>;
export type SpecificTypesQueryResult = Apollo.QueryResult<SpecificTypesQuery, SpecificTypesQueryVariables>;
export const StrandsDocument = gql`
    query strands($filters: StrandFiltersInput, $pagination: PaginationArg = {}, $sort: [String] = []) {
  strands(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...Strand
    }
    meta {
      ...Meta
    }
  }
}
    ${StrandFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useStrandsQuery(baseOptions?: Apollo.QueryHookOptions<StrandsQuery, StrandsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<StrandsQuery, StrandsQueryVariables>(StrandsDocument, options);
      }
export function useStrandsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StrandsQuery, StrandsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<StrandsQuery, StrandsQueryVariables>(StrandsDocument, options);
        }
export type StrandsQueryHookResult = ReturnType<typeof useStrandsQuery>;
export type StrandsLazyQueryHookResult = ReturnType<typeof useStrandsLazyQuery>;
export type StrandsQueryResult = Apollo.QueryResult<StrandsQuery, StrandsQueryVariables>;
export const StrandsLengthsDocument = gql`
    query strandsLengths($filters: StrandsLengthFiltersInput, $pagination: PaginationArg = {}, $sort: [String] = []) {
  strandsLengths(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...StrandsLength
    }
    meta {
      ...Meta
    }
  }
}
    ${StrandsLengthFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useStrandsLengthsQuery(baseOptions?: Apollo.QueryHookOptions<StrandsLengthsQuery, StrandsLengthsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<StrandsLengthsQuery, StrandsLengthsQueryVariables>(StrandsLengthsDocument, options);
      }
export function useStrandsLengthsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StrandsLengthsQuery, StrandsLengthsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<StrandsLengthsQuery, StrandsLengthsQueryVariables>(StrandsLengthsDocument, options);
        }
export type StrandsLengthsQueryHookResult = ReturnType<typeof useStrandsLengthsQuery>;
export type StrandsLengthsLazyQueryHookResult = ReturnType<typeof useStrandsLengthsLazyQuery>;
export type StrandsLengthsQueryResult = Apollo.QueryResult<StrandsLengthsQuery, StrandsLengthsQueryVariables>;
export const TimePeriodsDocument = gql`
    query timePeriods($filters: TimePeriodFiltersInput, $pagination: PaginationArg = {}, $sort: [String] = []) {
  timePeriods(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...TimePeriod
    }
    meta {
      ...Meta
    }
  }
}
    ${TimePeriodFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useTimePeriodsQuery(baseOptions?: Apollo.QueryHookOptions<TimePeriodsQuery, TimePeriodsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TimePeriodsQuery, TimePeriodsQueryVariables>(TimePeriodsDocument, options);
      }
export function useTimePeriodsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TimePeriodsQuery, TimePeriodsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TimePeriodsQuery, TimePeriodsQueryVariables>(TimePeriodsDocument, options);
        }
export type TimePeriodsQueryHookResult = ReturnType<typeof useTimePeriodsQuery>;
export type TimePeriodsLazyQueryHookResult = ReturnType<typeof useTimePeriodsLazyQuery>;
export type TimePeriodsQueryResult = Apollo.QueryResult<TimePeriodsQuery, TimePeriodsQueryVariables>;
export const CreateLeadDocument = gql`
    mutation createLead($input: LeadInput!) {
  createLead(data: $input) {
    data {
      id
    }
  }
}
    `;
export type CreateLeadMutationFn = Apollo.MutationFunction<CreateLeadMutation, CreateLeadMutationVariables>;
export function useCreateLeadMutation(baseOptions?: Apollo.MutationHookOptions<CreateLeadMutation, CreateLeadMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateLeadMutation, CreateLeadMutationVariables>(CreateLeadDocument, options);
      }
export type CreateLeadMutationHookResult = ReturnType<typeof useCreateLeadMutation>;
export type CreateLeadMutationResult = Apollo.MutationResult<CreateLeadMutation>;
export const DeleteLeadDocument = gql`
    mutation deleteLead($id: ID!) {
  deleteLead(id: $id) {
    data {
      id
    }
  }
}
    `;
export type DeleteLeadMutationFn = Apollo.MutationFunction<DeleteLeadMutation, DeleteLeadMutationVariables>;
export function useDeleteLeadMutation(baseOptions?: Apollo.MutationHookOptions<DeleteLeadMutation, DeleteLeadMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteLeadMutation, DeleteLeadMutationVariables>(DeleteLeadDocument, options);
      }
export type DeleteLeadMutationHookResult = ReturnType<typeof useDeleteLeadMutation>;
export type DeleteLeadMutationResult = Apollo.MutationResult<DeleteLeadMutation>;
export const UpdateLeadDocument = gql`
    mutation updateLead($id: ID!, $input: LeadInput!) {
  updateLead(id: $id, data: $input) {
    data {
      id
    }
  }
}
    `;
export type UpdateLeadMutationFn = Apollo.MutationFunction<UpdateLeadMutation, UpdateLeadMutationVariables>;
export function useUpdateLeadMutation(baseOptions?: Apollo.MutationHookOptions<UpdateLeadMutation, UpdateLeadMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateLeadMutation, UpdateLeadMutationVariables>(UpdateLeadDocument, options);
      }
export type UpdateLeadMutationHookResult = ReturnType<typeof useUpdateLeadMutation>;
export type UpdateLeadMutationResult = Apollo.MutationResult<UpdateLeadMutation>;
export const LeadByUuidDocument = gql`
    query leadByUuid($uuid: String!) {
  leads(filters: {uuid: {eq: $uuid}}) {
    data {
      ...Lead
    }
  }
}
    ${LeadFragmentDoc}
${LeadMinFragmentDoc}
${FileFragmentDoc}
${FileMinFragmentDoc}`;
export function useLeadByUuidQuery(baseOptions: Apollo.QueryHookOptions<LeadByUuidQuery, LeadByUuidQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<LeadByUuidQuery, LeadByUuidQueryVariables>(LeadByUuidDocument, options);
      }
export function useLeadByUuidLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LeadByUuidQuery, LeadByUuidQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<LeadByUuidQuery, LeadByUuidQueryVariables>(LeadByUuidDocument, options);
        }
export type LeadByUuidQueryHookResult = ReturnType<typeof useLeadByUuidQuery>;
export type LeadByUuidLazyQueryHookResult = ReturnType<typeof useLeadByUuidLazyQuery>;
export type LeadByUuidQueryResult = Apollo.QueryResult<LeadByUuidQuery, LeadByUuidQueryVariables>;
export const LeadsSelectDocument = gql`
    query leadsSelect($filters: LeadFiltersInput, $pagination: PaginationArg = {}, $sort: [String] = []) {
  leads(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...LeadSelect
    }
  }
}
    ${LeadSelectFragmentDoc}`;
export function useLeadsSelectQuery(baseOptions?: Apollo.QueryHookOptions<LeadsSelectQuery, LeadsSelectQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<LeadsSelectQuery, LeadsSelectQueryVariables>(LeadsSelectDocument, options);
      }
export function useLeadsSelectLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LeadsSelectQuery, LeadsSelectQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<LeadsSelectQuery, LeadsSelectQueryVariables>(LeadsSelectDocument, options);
        }
export type LeadsSelectQueryHookResult = ReturnType<typeof useLeadsSelectQuery>;
export type LeadsSelectLazyQueryHookResult = ReturnType<typeof useLeadsSelectLazyQuery>;
export type LeadsSelectQueryResult = Apollo.QueryResult<LeadsSelectQuery, LeadsSelectQueryVariables>;
export const LeadsTableDocument = gql`
    query leadsTable($filters: LeadFiltersInput, $pagination: PaginationArg = {}, $sort: [String] = []) {
  leads(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...LeadTable
    }
    meta {
      ...Meta
    }
  }
}
    ${LeadTableFragmentDoc}
${FileMinFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useLeadsTableQuery(baseOptions?: Apollo.QueryHookOptions<LeadsTableQuery, LeadsTableQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<LeadsTableQuery, LeadsTableQueryVariables>(LeadsTableDocument, options);
      }
export function useLeadsTableLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LeadsTableQuery, LeadsTableQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<LeadsTableQuery, LeadsTableQueryVariables>(LeadsTableDocument, options);
        }
export type LeadsTableQueryHookResult = ReturnType<typeof useLeadsTableQuery>;
export type LeadsTableLazyQueryHookResult = ReturnType<typeof useLeadsTableLazyQuery>;
export type LeadsTableQueryResult = Apollo.QueryResult<LeadsTableQuery, LeadsTableQueryVariables>;
export const CreateLocalizationSettingDocument = gql`
    mutation createLocalizationSetting($input: LocalizationSettingInput!) {
  createLocalizationSetting(data: $input) {
    data {
      ...LocalizationSetting
    }
  }
}
    ${LocalizationSettingFragmentDoc}`;
export type CreateLocalizationSettingMutationFn = Apollo.MutationFunction<CreateLocalizationSettingMutation, CreateLocalizationSettingMutationVariables>;
export function useCreateLocalizationSettingMutation(baseOptions?: Apollo.MutationHookOptions<CreateLocalizationSettingMutation, CreateLocalizationSettingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateLocalizationSettingMutation, CreateLocalizationSettingMutationVariables>(CreateLocalizationSettingDocument, options);
      }
export type CreateLocalizationSettingMutationHookResult = ReturnType<typeof useCreateLocalizationSettingMutation>;
export type CreateLocalizationSettingMutationResult = Apollo.MutationResult<CreateLocalizationSettingMutation>;
export const DeleteLocalizationSettingDocument = gql`
    mutation deleteLocalizationSetting($id: ID!) {
  deleteLocalizationSetting(id: $id) {
    data {
      ...LocalizationSetting
    }
  }
}
    ${LocalizationSettingFragmentDoc}`;
export type DeleteLocalizationSettingMutationFn = Apollo.MutationFunction<DeleteLocalizationSettingMutation, DeleteLocalizationSettingMutationVariables>;
export function useDeleteLocalizationSettingMutation(baseOptions?: Apollo.MutationHookOptions<DeleteLocalizationSettingMutation, DeleteLocalizationSettingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteLocalizationSettingMutation, DeleteLocalizationSettingMutationVariables>(DeleteLocalizationSettingDocument, options);
      }
export type DeleteLocalizationSettingMutationHookResult = ReturnType<typeof useDeleteLocalizationSettingMutation>;
export type DeleteLocalizationSettingMutationResult = Apollo.MutationResult<DeleteLocalizationSettingMutation>;
export const UpdateLocalizationSettingDocument = gql`
    mutation updateLocalizationSetting($id: ID!, $input: LocalizationSettingInput!) {
  updateLocalizationSetting(id: $id, data: $input) {
    data {
      ...LocalizationSetting
    }
  }
}
    ${LocalizationSettingFragmentDoc}`;
export type UpdateLocalizationSettingMutationFn = Apollo.MutationFunction<UpdateLocalizationSettingMutation, UpdateLocalizationSettingMutationVariables>;
export function useUpdateLocalizationSettingMutation(baseOptions?: Apollo.MutationHookOptions<UpdateLocalizationSettingMutation, UpdateLocalizationSettingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateLocalizationSettingMutation, UpdateLocalizationSettingMutationVariables>(UpdateLocalizationSettingDocument, options);
      }
export type UpdateLocalizationSettingMutationHookResult = ReturnType<typeof useUpdateLocalizationSettingMutation>;
export type UpdateLocalizationSettingMutationResult = Apollo.MutationResult<UpdateLocalizationSettingMutation>;
export const LocalizationSettingsDocument = gql`
    query localizationSettings($filters: LocalizationSettingFiltersInput, $pagination: PaginationArg, $sort: [String]) {
  localizationSettings(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...LocalizationSetting
    }
  }
}
    ${LocalizationSettingFragmentDoc}`;
export function useLocalizationSettingsQuery(baseOptions?: Apollo.QueryHookOptions<LocalizationSettingsQuery, LocalizationSettingsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<LocalizationSettingsQuery, LocalizationSettingsQueryVariables>(LocalizationSettingsDocument, options);
      }
export function useLocalizationSettingsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LocalizationSettingsQuery, LocalizationSettingsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<LocalizationSettingsQuery, LocalizationSettingsQueryVariables>(LocalizationSettingsDocument, options);
        }
export type LocalizationSettingsQueryHookResult = ReturnType<typeof useLocalizationSettingsQuery>;
export type LocalizationSettingsLazyQueryHookResult = ReturnType<typeof useLocalizationSettingsLazyQuery>;
export type LocalizationSettingsQueryResult = Apollo.QueryResult<LocalizationSettingsQuery, LocalizationSettingsQueryVariables>;
export const CreateLocationDocument = gql`
    mutation createLocation($input: LocationInput!) {
  createLocation(data: $input) {
    data {
      id
    }
  }
}
    `;
export type CreateLocationMutationFn = Apollo.MutationFunction<CreateLocationMutation, CreateLocationMutationVariables>;
export function useCreateLocationMutation(baseOptions?: Apollo.MutationHookOptions<CreateLocationMutation, CreateLocationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateLocationMutation, CreateLocationMutationVariables>(CreateLocationDocument, options);
      }
export type CreateLocationMutationHookResult = ReturnType<typeof useCreateLocationMutation>;
export type CreateLocationMutationResult = Apollo.MutationResult<CreateLocationMutation>;
export const UpdateLocationDocument = gql`
    mutation updateLocation($id: ID!, $input: LocationInput!) {
  updateLocation(id: $id, data: $input) {
    data {
      id
    }
  }
}
    `;
export type UpdateLocationMutationFn = Apollo.MutationFunction<UpdateLocationMutation, UpdateLocationMutationVariables>;
export function useUpdateLocationMutation(baseOptions?: Apollo.MutationHookOptions<UpdateLocationMutation, UpdateLocationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateLocationMutation, UpdateLocationMutationVariables>(UpdateLocationDocument, options);
      }
export type UpdateLocationMutationHookResult = ReturnType<typeof useUpdateLocationMutation>;
export type UpdateLocationMutationResult = Apollo.MutationResult<UpdateLocationMutation>;
export const CreateMailTemplateDocument = gql`
    mutation createMailTemplate($data: MailTemplateInput!) {
  createMailTemplate(data: $data) {
    data {
      ...MailTemplate
    }
  }
}
    ${MailTemplateFragmentDoc}
${UserMinFragmentDoc}
${FileFragmentDoc}`;
export type CreateMailTemplateMutationFn = Apollo.MutationFunction<CreateMailTemplateMutation, CreateMailTemplateMutationVariables>;
export function useCreateMailTemplateMutation(baseOptions?: Apollo.MutationHookOptions<CreateMailTemplateMutation, CreateMailTemplateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateMailTemplateMutation, CreateMailTemplateMutationVariables>(CreateMailTemplateDocument, options);
      }
export type CreateMailTemplateMutationHookResult = ReturnType<typeof useCreateMailTemplateMutation>;
export type CreateMailTemplateMutationResult = Apollo.MutationResult<CreateMailTemplateMutation>;
export const DeleteMailTemplateDocument = gql`
    mutation deleteMailTemplate($id: ID!) {
  deleteMailTemplate(id: $id) {
    data {
      ...MailTemplate
    }
  }
}
    ${MailTemplateFragmentDoc}
${UserMinFragmentDoc}
${FileFragmentDoc}`;
export type DeleteMailTemplateMutationFn = Apollo.MutationFunction<DeleteMailTemplateMutation, DeleteMailTemplateMutationVariables>;
export function useDeleteMailTemplateMutation(baseOptions?: Apollo.MutationHookOptions<DeleteMailTemplateMutation, DeleteMailTemplateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteMailTemplateMutation, DeleteMailTemplateMutationVariables>(DeleteMailTemplateDocument, options);
      }
export type DeleteMailTemplateMutationHookResult = ReturnType<typeof useDeleteMailTemplateMutation>;
export type DeleteMailTemplateMutationResult = Apollo.MutationResult<DeleteMailTemplateMutation>;
export const UpdateMailTemplateDocument = gql`
    mutation updateMailTemplate($id: ID!, $input: MailTemplateInput!) {
  updateMailTemplate(id: $id, data: $input) {
    data {
      ...MailTemplate
    }
  }
}
    ${MailTemplateFragmentDoc}
${UserMinFragmentDoc}
${FileFragmentDoc}`;
export type UpdateMailTemplateMutationFn = Apollo.MutationFunction<UpdateMailTemplateMutation, UpdateMailTemplateMutationVariables>;
export function useUpdateMailTemplateMutation(baseOptions?: Apollo.MutationHookOptions<UpdateMailTemplateMutation, UpdateMailTemplateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateMailTemplateMutation, UpdateMailTemplateMutationVariables>(UpdateMailTemplateDocument, options);
      }
export type UpdateMailTemplateMutationHookResult = ReturnType<typeof useUpdateMailTemplateMutation>;
export type UpdateMailTemplateMutationResult = Apollo.MutationResult<UpdateMailTemplateMutation>;
export const MailTemplatesDocument = gql`
    query mailTemplates($filters: MailTemplateFiltersInput, $pagination: PaginationArg, $sort: [String]) {
  mailTemplates(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...MailTemplate
    }
    meta {
      ...Meta
    }
  }
}
    ${MailTemplateFragmentDoc}
${UserMinFragmentDoc}
${FileFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useMailTemplatesQuery(baseOptions?: Apollo.QueryHookOptions<MailTemplatesQuery, MailTemplatesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MailTemplatesQuery, MailTemplatesQueryVariables>(MailTemplatesDocument, options);
      }
export function useMailTemplatesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MailTemplatesQuery, MailTemplatesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MailTemplatesQuery, MailTemplatesQueryVariables>(MailTemplatesDocument, options);
        }
export type MailTemplatesQueryHookResult = ReturnType<typeof useMailTemplatesQuery>;
export type MailTemplatesLazyQueryHookResult = ReturnType<typeof useMailTemplatesLazyQuery>;
export type MailTemplatesQueryResult = Apollo.QueryResult<MailTemplatesQuery, MailTemplatesQueryVariables>;
export const MarketingCustomersReportsDocument = gql`
    query marketingCustomersReports($filters: MarketingCustomersReportFiltersInput, $pagination: PaginationArg, $sort: [String]) {
  marketingCustomersReports(
    filters: $filters
    pagination: $pagination
    sort: $sort
  ) {
    data {
      ...MarketingCustomersReport
    }
    meta {
      ...Meta
    }
  }
}
    ${MarketingCustomersReportFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useMarketingCustomersReportsQuery(baseOptions?: Apollo.QueryHookOptions<MarketingCustomersReportsQuery, MarketingCustomersReportsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MarketingCustomersReportsQuery, MarketingCustomersReportsQueryVariables>(MarketingCustomersReportsDocument, options);
      }
export function useMarketingCustomersReportsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MarketingCustomersReportsQuery, MarketingCustomersReportsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MarketingCustomersReportsQuery, MarketingCustomersReportsQueryVariables>(MarketingCustomersReportsDocument, options);
        }
export type MarketingCustomersReportsQueryHookResult = ReturnType<typeof useMarketingCustomersReportsQuery>;
export type MarketingCustomersReportsLazyQueryHookResult = ReturnType<typeof useMarketingCustomersReportsLazyQuery>;
export type MarketingCustomersReportsQueryResult = Apollo.QueryResult<MarketingCustomersReportsQuery, MarketingCustomersReportsQueryVariables>;
export const CreateMarketingEmailTemplateDocument = gql`
    mutation createMarketingEmailTemplate($input: MarketingEmailTemplateInput!) {
  createMarketingEmailTemplate(data: $input) {
    data {
      id
      attributes {
        uuid
      }
    }
  }
}
    `;
export type CreateMarketingEmailTemplateMutationFn = Apollo.MutationFunction<CreateMarketingEmailTemplateMutation, CreateMarketingEmailTemplateMutationVariables>;
export function useCreateMarketingEmailTemplateMutation(baseOptions?: Apollo.MutationHookOptions<CreateMarketingEmailTemplateMutation, CreateMarketingEmailTemplateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateMarketingEmailTemplateMutation, CreateMarketingEmailTemplateMutationVariables>(CreateMarketingEmailTemplateDocument, options);
      }
export type CreateMarketingEmailTemplateMutationHookResult = ReturnType<typeof useCreateMarketingEmailTemplateMutation>;
export type CreateMarketingEmailTemplateMutationResult = Apollo.MutationResult<CreateMarketingEmailTemplateMutation>;
export const DeleteMarketingEmailTemplateDocument = gql`
    mutation deleteMarketingEmailTemplate($id: ID!) {
  deleteMarketingEmailTemplate(id: $id) {
    data {
      id
    }
  }
}
    `;
export type DeleteMarketingEmailTemplateMutationFn = Apollo.MutationFunction<DeleteMarketingEmailTemplateMutation, DeleteMarketingEmailTemplateMutationVariables>;
export function useDeleteMarketingEmailTemplateMutation(baseOptions?: Apollo.MutationHookOptions<DeleteMarketingEmailTemplateMutation, DeleteMarketingEmailTemplateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteMarketingEmailTemplateMutation, DeleteMarketingEmailTemplateMutationVariables>(DeleteMarketingEmailTemplateDocument, options);
      }
export type DeleteMarketingEmailTemplateMutationHookResult = ReturnType<typeof useDeleteMarketingEmailTemplateMutation>;
export type DeleteMarketingEmailTemplateMutationResult = Apollo.MutationResult<DeleteMarketingEmailTemplateMutation>;
export const UpdateMarketingEmailTemplateDocument = gql`
    mutation updateMarketingEmailTemplate($id: ID!, $input: MarketingEmailTemplateInput!) {
  updateMarketingEmailTemplate(id: $id, data: $input) {
    data {
      id
    }
  }
}
    `;
export type UpdateMarketingEmailTemplateMutationFn = Apollo.MutationFunction<UpdateMarketingEmailTemplateMutation, UpdateMarketingEmailTemplateMutationVariables>;
export function useUpdateMarketingEmailTemplateMutation(baseOptions?: Apollo.MutationHookOptions<UpdateMarketingEmailTemplateMutation, UpdateMarketingEmailTemplateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateMarketingEmailTemplateMutation, UpdateMarketingEmailTemplateMutationVariables>(UpdateMarketingEmailTemplateDocument, options);
      }
export type UpdateMarketingEmailTemplateMutationHookResult = ReturnType<typeof useUpdateMarketingEmailTemplateMutation>;
export type UpdateMarketingEmailTemplateMutationResult = Apollo.MutationResult<UpdateMarketingEmailTemplateMutation>;
export const MarketingEmailTemplateByUuidDocument = gql`
    query marketingEmailTemplateByUuid($uuid: String!) {
  marketingEmailTemplates(filters: {uuid: {eq: $uuid}}) {
    data {
      ...MarketingEmailTemplate
    }
  }
}
    ${MarketingEmailTemplateFragmentDoc}`;
export function useMarketingEmailTemplateByUuidQuery(baseOptions: Apollo.QueryHookOptions<MarketingEmailTemplateByUuidQuery, MarketingEmailTemplateByUuidQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MarketingEmailTemplateByUuidQuery, MarketingEmailTemplateByUuidQueryVariables>(MarketingEmailTemplateByUuidDocument, options);
      }
export function useMarketingEmailTemplateByUuidLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MarketingEmailTemplateByUuidQuery, MarketingEmailTemplateByUuidQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MarketingEmailTemplateByUuidQuery, MarketingEmailTemplateByUuidQueryVariables>(MarketingEmailTemplateByUuidDocument, options);
        }
export type MarketingEmailTemplateByUuidQueryHookResult = ReturnType<typeof useMarketingEmailTemplateByUuidQuery>;
export type MarketingEmailTemplateByUuidLazyQueryHookResult = ReturnType<typeof useMarketingEmailTemplateByUuidLazyQuery>;
export type MarketingEmailTemplateByUuidQueryResult = Apollo.QueryResult<MarketingEmailTemplateByUuidQuery, MarketingEmailTemplateByUuidQueryVariables>;
export const MarketingEmailTemplatesDocument = gql`
    query marketingEmailTemplates($filters: MarketingEmailTemplateFiltersInput, $pagination: PaginationArg, $sort: [String]) {
  marketingEmailTemplates(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...MarketingEmailTemplate
    }
    meta {
      ...Meta
    }
  }
}
    ${MarketingEmailTemplateFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useMarketingEmailTemplatesQuery(baseOptions?: Apollo.QueryHookOptions<MarketingEmailTemplatesQuery, MarketingEmailTemplatesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MarketingEmailTemplatesQuery, MarketingEmailTemplatesQueryVariables>(MarketingEmailTemplatesDocument, options);
      }
export function useMarketingEmailTemplatesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MarketingEmailTemplatesQuery, MarketingEmailTemplatesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MarketingEmailTemplatesQuery, MarketingEmailTemplatesQueryVariables>(MarketingEmailTemplatesDocument, options);
        }
export type MarketingEmailTemplatesQueryHookResult = ReturnType<typeof useMarketingEmailTemplatesQuery>;
export type MarketingEmailTemplatesLazyQueryHookResult = ReturnType<typeof useMarketingEmailTemplatesLazyQuery>;
export type MarketingEmailTemplatesQueryResult = Apollo.QueryResult<MarketingEmailTemplatesQuery, MarketingEmailTemplatesQueryVariables>;
export const CreateNoteDocument = gql`
    mutation createNote($input: NoteInput!) {
  createNote(data: $input) {
    data {
      ...Note
    }
  }
}
    ${NoteFragmentDoc}`;
export type CreateNoteMutationFn = Apollo.MutationFunction<CreateNoteMutation, CreateNoteMutationVariables>;
export function useCreateNoteMutation(baseOptions?: Apollo.MutationHookOptions<CreateNoteMutation, CreateNoteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateNoteMutation, CreateNoteMutationVariables>(CreateNoteDocument, options);
      }
export type CreateNoteMutationHookResult = ReturnType<typeof useCreateNoteMutation>;
export type CreateNoteMutationResult = Apollo.MutationResult<CreateNoteMutation>;
export const DeleteNoteDocument = gql`
    mutation deleteNote($id: ID!) {
  deleteNote(id: $id) {
    data {
      ...Note
    }
  }
}
    ${NoteFragmentDoc}`;
export type DeleteNoteMutationFn = Apollo.MutationFunction<DeleteNoteMutation, DeleteNoteMutationVariables>;
export function useDeleteNoteMutation(baseOptions?: Apollo.MutationHookOptions<DeleteNoteMutation, DeleteNoteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteNoteMutation, DeleteNoteMutationVariables>(DeleteNoteDocument, options);
      }
export type DeleteNoteMutationHookResult = ReturnType<typeof useDeleteNoteMutation>;
export type DeleteNoteMutationResult = Apollo.MutationResult<DeleteNoteMutation>;
export const UpdateNoteDocument = gql`
    mutation updateNote($id: ID!, $input: NoteInput!) {
  updateNote(id: $id, data: $input) {
    data {
      ...Note
    }
  }
}
    ${NoteFragmentDoc}`;
export type UpdateNoteMutationFn = Apollo.MutationFunction<UpdateNoteMutation, UpdateNoteMutationVariables>;
export function useUpdateNoteMutation(baseOptions?: Apollo.MutationHookOptions<UpdateNoteMutation, UpdateNoteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateNoteMutation, UpdateNoteMutationVariables>(UpdateNoteDocument, options);
      }
export type UpdateNoteMutationHookResult = ReturnType<typeof useUpdateNoteMutation>;
export type UpdateNoteMutationResult = Apollo.MutationResult<UpdateNoteMutation>;
export const NotesDocument = gql`
    query notes($filters: NoteFiltersInput, $pagination: PaginationArg, $sort: [String]) {
  notes(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...Note
    }
    meta {
      ...Meta
    }
  }
}
    ${NoteFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useNotesQuery(baseOptions?: Apollo.QueryHookOptions<NotesQuery, NotesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<NotesQuery, NotesQueryVariables>(NotesDocument, options);
      }
export function useNotesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NotesQuery, NotesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<NotesQuery, NotesQueryVariables>(NotesDocument, options);
        }
export type NotesQueryHookResult = ReturnType<typeof useNotesQuery>;
export type NotesLazyQueryHookResult = ReturnType<typeof useNotesLazyQuery>;
export type NotesQueryResult = Apollo.QueryResult<NotesQuery, NotesQueryVariables>;
export const ReadNotificationDocument = gql`
    mutation readNotification($id: ID!) {
  updateUserNotification(id: $id, data: {hasBeenSeen: true}) {
    data {
      ...UserNotification
    }
  }
}
    ${UserNotificationFragmentDoc}
${InventoryQuantityNotificationFragmentDoc}
${FileMinFragmentDoc}
${MaintenanceQuantityNotificationFragmentDoc}
${NylasGrantExpireNotificationFragmentDoc}`;
export type ReadNotificationMutationFn = Apollo.MutationFunction<ReadNotificationMutation, ReadNotificationMutationVariables>;
export function useReadNotificationMutation(baseOptions?: Apollo.MutationHookOptions<ReadNotificationMutation, ReadNotificationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ReadNotificationMutation, ReadNotificationMutationVariables>(ReadNotificationDocument, options);
      }
export type ReadNotificationMutationHookResult = ReturnType<typeof useReadNotificationMutation>;
export type ReadNotificationMutationResult = Apollo.MutationResult<ReadNotificationMutation>;
export const UnreadNotificationCountDocument = gql`
    query unreadNotificationCount {
  userNotifications(filters: {hasBeenSeen: {eq: false}}, pagination: {limit: 100}) {
    data {
      id
    }
    meta {
      pagination {
        total
      }
    }
  }
}
    `;
export function useUnreadNotificationCountQuery(baseOptions?: Apollo.QueryHookOptions<UnreadNotificationCountQuery, UnreadNotificationCountQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UnreadNotificationCountQuery, UnreadNotificationCountQueryVariables>(UnreadNotificationCountDocument, options);
      }
export function useUnreadNotificationCountLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UnreadNotificationCountQuery, UnreadNotificationCountQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UnreadNotificationCountQuery, UnreadNotificationCountQueryVariables>(UnreadNotificationCountDocument, options);
        }
export type UnreadNotificationCountQueryHookResult = ReturnType<typeof useUnreadNotificationCountQuery>;
export type UnreadNotificationCountLazyQueryHookResult = ReturnType<typeof useUnreadNotificationCountLazyQuery>;
export type UnreadNotificationCountQueryResult = Apollo.QueryResult<UnreadNotificationCountQuery, UnreadNotificationCountQueryVariables>;
export const UserNotificationsDocument = gql`
    query userNotifications($filters: UserNotificationFiltersInput, $pagination: PaginationArg, $sort: [String]) {
  userNotifications(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...UserNotification
    }
    meta {
      ...Meta
    }
  }
}
    ${UserNotificationFragmentDoc}
${InventoryQuantityNotificationFragmentDoc}
${FileMinFragmentDoc}
${MaintenanceQuantityNotificationFragmentDoc}
${NylasGrantExpireNotificationFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useUserNotificationsQuery(baseOptions?: Apollo.QueryHookOptions<UserNotificationsQuery, UserNotificationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserNotificationsQuery, UserNotificationsQueryVariables>(UserNotificationsDocument, options);
      }
export function useUserNotificationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserNotificationsQuery, UserNotificationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserNotificationsQuery, UserNotificationsQueryVariables>(UserNotificationsDocument, options);
        }
export type UserNotificationsQueryHookResult = ReturnType<typeof useUserNotificationsQuery>;
export type UserNotificationsLazyQueryHookResult = ReturnType<typeof useUserNotificationsLazyQuery>;
export type UserNotificationsQueryResult = Apollo.QueryResult<UserNotificationsQuery, UserNotificationsQueryVariables>;
export const CreateNotificationSettingDocument = gql`
    mutation createNotificationSetting($input: SettingNotificationInput!) {
  createSettingNotification(data: $input) {
    data {
      ...NotificationSetting
    }
  }
}
    ${NotificationSettingFragmentDoc}`;
export type CreateNotificationSettingMutationFn = Apollo.MutationFunction<CreateNotificationSettingMutation, CreateNotificationSettingMutationVariables>;
export function useCreateNotificationSettingMutation(baseOptions?: Apollo.MutationHookOptions<CreateNotificationSettingMutation, CreateNotificationSettingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateNotificationSettingMutation, CreateNotificationSettingMutationVariables>(CreateNotificationSettingDocument, options);
      }
export type CreateNotificationSettingMutationHookResult = ReturnType<typeof useCreateNotificationSettingMutation>;
export type CreateNotificationSettingMutationResult = Apollo.MutationResult<CreateNotificationSettingMutation>;
export const UpdateNotificationSettingDocument = gql`
    mutation updateNotificationSetting($id: ID!, $input: SettingNotificationInput!) {
  updateSettingNotification(id: $id, data: $input) {
    data {
      ...NotificationSetting
    }
  }
}
    ${NotificationSettingFragmentDoc}`;
export type UpdateNotificationSettingMutationFn = Apollo.MutationFunction<UpdateNotificationSettingMutation, UpdateNotificationSettingMutationVariables>;
export function useUpdateNotificationSettingMutation(baseOptions?: Apollo.MutationHookOptions<UpdateNotificationSettingMutation, UpdateNotificationSettingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateNotificationSettingMutation, UpdateNotificationSettingMutationVariables>(UpdateNotificationSettingDocument, options);
      }
export type UpdateNotificationSettingMutationHookResult = ReturnType<typeof useUpdateNotificationSettingMutation>;
export type UpdateNotificationSettingMutationResult = Apollo.MutationResult<UpdateNotificationSettingMutation>;
export const NotificationSettingsDocument = gql`
    query notificationSettings($filters: SettingNotificationFiltersInput) {
  settingNotifications(filters: $filters) {
    data {
      ...NotificationSetting
    }
  }
}
    ${NotificationSettingFragmentDoc}`;
export function useNotificationSettingsQuery(baseOptions?: Apollo.QueryHookOptions<NotificationSettingsQuery, NotificationSettingsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<NotificationSettingsQuery, NotificationSettingsQueryVariables>(NotificationSettingsDocument, options);
      }
export function useNotificationSettingsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NotificationSettingsQuery, NotificationSettingsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<NotificationSettingsQuery, NotificationSettingsQueryVariables>(NotificationSettingsDocument, options);
        }
export type NotificationSettingsQueryHookResult = ReturnType<typeof useNotificationSettingsQuery>;
export type NotificationSettingsLazyQueryHookResult = ReturnType<typeof useNotificationSettingsLazyQuery>;
export type NotificationSettingsQueryResult = Apollo.QueryResult<NotificationSettingsQuery, NotificationSettingsQueryVariables>;
export const UpdateOnboardingUserDocument = gql`
    mutation updateOnboardingUser($id: ID!, $input: OnboardingUserInput!) {
  updateOnboardingUser(id: $id, data: $input) {
    data {
      ...OnboardingUser
    }
  }
}
    ${OnboardingUserFragmentDoc}`;
export type UpdateOnboardingUserMutationFn = Apollo.MutationFunction<UpdateOnboardingUserMutation, UpdateOnboardingUserMutationVariables>;
export function useUpdateOnboardingUserMutation(baseOptions?: Apollo.MutationHookOptions<UpdateOnboardingUserMutation, UpdateOnboardingUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateOnboardingUserMutation, UpdateOnboardingUserMutationVariables>(UpdateOnboardingUserDocument, options);
      }
export type UpdateOnboardingUserMutationHookResult = ReturnType<typeof useUpdateOnboardingUserMutation>;
export type UpdateOnboardingUserMutationResult = Apollo.MutationResult<UpdateOnboardingUserMutation>;
export const UpdateOnboardingDocument = gql`
    mutation updateOnboarding($id: ID!, $input: OnboardingInput!) {
  updateOnboarding(id: $id, data: $input) {
    data {
      ...Onboarding
    }
  }
}
    ${OnboardingFragmentDoc}`;
export type UpdateOnboardingMutationFn = Apollo.MutationFunction<UpdateOnboardingMutation, UpdateOnboardingMutationVariables>;
export function useUpdateOnboardingMutation(baseOptions?: Apollo.MutationHookOptions<UpdateOnboardingMutation, UpdateOnboardingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateOnboardingMutation, UpdateOnboardingMutationVariables>(UpdateOnboardingDocument, options);
      }
export type UpdateOnboardingMutationHookResult = ReturnType<typeof useUpdateOnboardingMutation>;
export type UpdateOnboardingMutationResult = Apollo.MutationResult<UpdateOnboardingMutation>;
export const OnboardingUsersDocument = gql`
    query onboardingUsers($filters: OnboardingUserFiltersInput!, $pagination: PaginationArg! = {}, $sort: [String] = []) {
  onboardingUsers(sort: $sort, filters: $filters, pagination: $pagination) {
    data {
      ...OnboardingUser
    }
  }
}
    ${OnboardingUserFragmentDoc}`;
export function useOnboardingUsersQuery(baseOptions: Apollo.QueryHookOptions<OnboardingUsersQuery, OnboardingUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<OnboardingUsersQuery, OnboardingUsersQueryVariables>(OnboardingUsersDocument, options);
      }
export function useOnboardingUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OnboardingUsersQuery, OnboardingUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<OnboardingUsersQuery, OnboardingUsersQueryVariables>(OnboardingUsersDocument, options);
        }
export type OnboardingUsersQueryHookResult = ReturnType<typeof useOnboardingUsersQuery>;
export type OnboardingUsersLazyQueryHookResult = ReturnType<typeof useOnboardingUsersLazyQuery>;
export type OnboardingUsersQueryResult = Apollo.QueryResult<OnboardingUsersQuery, OnboardingUsersQueryVariables>;
export const OnboardingsDocument = gql`
    query onboardings($filters: OnboardingFiltersInput!, $pagination: PaginationArg! = {}, $sort: [String] = []) {
  onboardings(sort: $sort, filters: $filters, pagination: $pagination) {
    data {
      ...Onboarding
    }
  }
}
    ${OnboardingFragmentDoc}`;
export function useOnboardingsQuery(baseOptions: Apollo.QueryHookOptions<OnboardingsQuery, OnboardingsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<OnboardingsQuery, OnboardingsQueryVariables>(OnboardingsDocument, options);
      }
export function useOnboardingsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OnboardingsQuery, OnboardingsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<OnboardingsQuery, OnboardingsQueryVariables>(OnboardingsDocument, options);
        }
export type OnboardingsQueryHookResult = ReturnType<typeof useOnboardingsQuery>;
export type OnboardingsLazyQueryHookResult = ReturnType<typeof useOnboardingsLazyQuery>;
export type OnboardingsQueryResult = Apollo.QueryResult<OnboardingsQuery, OnboardingsQueryVariables>;
export const CreateOrderSettingDocument = gql`
    mutation createOrderSetting($input: OrderSettingInput!) {
  createOrderSetting(data: $input) {
    data {
      ...OrderSetting
    }
  }
}
    ${OrderSettingFragmentDoc}`;
export type CreateOrderSettingMutationFn = Apollo.MutationFunction<CreateOrderSettingMutation, CreateOrderSettingMutationVariables>;
export function useCreateOrderSettingMutation(baseOptions?: Apollo.MutationHookOptions<CreateOrderSettingMutation, CreateOrderSettingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateOrderSettingMutation, CreateOrderSettingMutationVariables>(CreateOrderSettingDocument, options);
      }
export type CreateOrderSettingMutationHookResult = ReturnType<typeof useCreateOrderSettingMutation>;
export type CreateOrderSettingMutationResult = Apollo.MutationResult<CreateOrderSettingMutation>;
export const UpdateOrderSettingDocument = gql`
    mutation updateOrderSetting($id: ID!, $input: OrderSettingInput!) {
  updateOrderSetting(id: $id, data: $input) {
    data {
      ...OrderSetting
    }
  }
}
    ${OrderSettingFragmentDoc}`;
export type UpdateOrderSettingMutationFn = Apollo.MutationFunction<UpdateOrderSettingMutation, UpdateOrderSettingMutationVariables>;
export function useUpdateOrderSettingMutation(baseOptions?: Apollo.MutationHookOptions<UpdateOrderSettingMutation, UpdateOrderSettingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateOrderSettingMutation, UpdateOrderSettingMutationVariables>(UpdateOrderSettingDocument, options);
      }
export type UpdateOrderSettingMutationHookResult = ReturnType<typeof useUpdateOrderSettingMutation>;
export type UpdateOrderSettingMutationResult = Apollo.MutationResult<UpdateOrderSettingMutation>;
export const OrdersPaymentSettingDocument = gql`
    query ordersPaymentSetting($filters: OrderSettingFiltersInput, $pagination: PaginationArg, $sort: [String]) {
  ordersSetting(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...OrderPaymentSetting
    }
  }
}
    ${OrderPaymentSettingFragmentDoc}`;
export function useOrdersPaymentSettingQuery(baseOptions?: Apollo.QueryHookOptions<OrdersPaymentSettingQuery, OrdersPaymentSettingQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<OrdersPaymentSettingQuery, OrdersPaymentSettingQueryVariables>(OrdersPaymentSettingDocument, options);
      }
export function useOrdersPaymentSettingLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OrdersPaymentSettingQuery, OrdersPaymentSettingQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<OrdersPaymentSettingQuery, OrdersPaymentSettingQueryVariables>(OrdersPaymentSettingDocument, options);
        }
export type OrdersPaymentSettingQueryHookResult = ReturnType<typeof useOrdersPaymentSettingQuery>;
export type OrdersPaymentSettingLazyQueryHookResult = ReturnType<typeof useOrdersPaymentSettingLazyQuery>;
export type OrdersPaymentSettingQueryResult = Apollo.QueryResult<OrdersPaymentSettingQuery, OrdersPaymentSettingQueryVariables>;
export const OrdersPeriodSettingDocument = gql`
    query ordersPeriodSetting($filters: OrderSettingFiltersInput, $pagination: PaginationArg, $sort: [String]) {
  ordersSetting(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...OrderPeriodSetting
    }
  }
}
    ${OrderPeriodSettingFragmentDoc}`;
export function useOrdersPeriodSettingQuery(baseOptions?: Apollo.QueryHookOptions<OrdersPeriodSettingQuery, OrdersPeriodSettingQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<OrdersPeriodSettingQuery, OrdersPeriodSettingQueryVariables>(OrdersPeriodSettingDocument, options);
      }
export function useOrdersPeriodSettingLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OrdersPeriodSettingQuery, OrdersPeriodSettingQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<OrdersPeriodSettingQuery, OrdersPeriodSettingQueryVariables>(OrdersPeriodSettingDocument, options);
        }
export type OrdersPeriodSettingQueryHookResult = ReturnType<typeof useOrdersPeriodSettingQuery>;
export type OrdersPeriodSettingLazyQueryHookResult = ReturnType<typeof useOrdersPeriodSettingLazyQuery>;
export type OrdersPeriodSettingQueryResult = Apollo.QueryResult<OrdersPeriodSettingQuery, OrdersPeriodSettingQueryVariables>;
export const OrdersSettingDocument = gql`
    query ordersSetting($filters: OrderSettingFiltersInput, $pagination: PaginationArg, $sort: [String]) {
  ordersSetting(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...OrderSetting
    }
  }
}
    ${OrderSettingFragmentDoc}`;
export function useOrdersSettingQuery(baseOptions?: Apollo.QueryHookOptions<OrdersSettingQuery, OrdersSettingQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<OrdersSettingQuery, OrdersSettingQueryVariables>(OrdersSettingDocument, options);
      }
export function useOrdersSettingLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OrdersSettingQuery, OrdersSettingQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<OrdersSettingQuery, OrdersSettingQueryVariables>(OrdersSettingDocument, options);
        }
export type OrdersSettingQueryHookResult = ReturnType<typeof useOrdersSettingQuery>;
export type OrdersSettingLazyQueryHookResult = ReturnType<typeof useOrdersSettingLazyQuery>;
export type OrdersSettingQueryResult = Apollo.QueryResult<OrdersSettingQuery, OrdersSettingQueryVariables>;
export const UpdatePayRateDocument = gql`
    mutation updatePayRate($id: ID!, $input: PayRateInput!) {
  updatePayRate(id: $id, data: $input) {
    data {
      id
    }
  }
}
    `;
export type UpdatePayRateMutationFn = Apollo.MutationFunction<UpdatePayRateMutation, UpdatePayRateMutationVariables>;
export function useUpdatePayRateMutation(baseOptions?: Apollo.MutationHookOptions<UpdatePayRateMutation, UpdatePayRateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdatePayRateMutation, UpdatePayRateMutationVariables>(UpdatePayRateDocument, options);
      }
export type UpdatePayRateMutationHookResult = ReturnType<typeof useUpdatePayRateMutation>;
export type UpdatePayRateMutationResult = Apollo.MutationResult<UpdatePayRateMutation>;
export const CreatePayRateDocument = gql`
    mutation createPayRate($input: PayRateInput!) {
  createPayRate(data: $input) {
    data {
      ...PayRate
    }
  }
}
    ${PayRateFragmentDoc}`;
export type CreatePayRateMutationFn = Apollo.MutationFunction<CreatePayRateMutation, CreatePayRateMutationVariables>;
export function useCreatePayRateMutation(baseOptions?: Apollo.MutationHookOptions<CreatePayRateMutation, CreatePayRateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatePayRateMutation, CreatePayRateMutationVariables>(CreatePayRateDocument, options);
      }
export type CreatePayRateMutationHookResult = ReturnType<typeof useCreatePayRateMutation>;
export type CreatePayRateMutationResult = Apollo.MutationResult<CreatePayRateMutation>;
export const DeletePdfCatalogFileDocument = gql`
    mutation deletePdfCatalogFile($id: ID!) {
  deletePdfCatalogFile(id: $id) {
    data {
      id
    }
  }
}
    `;
export type DeletePdfCatalogFileMutationFn = Apollo.MutationFunction<DeletePdfCatalogFileMutation, DeletePdfCatalogFileMutationVariables>;
export function useDeletePdfCatalogFileMutation(baseOptions?: Apollo.MutationHookOptions<DeletePdfCatalogFileMutation, DeletePdfCatalogFileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeletePdfCatalogFileMutation, DeletePdfCatalogFileMutationVariables>(DeletePdfCatalogFileDocument, options);
      }
export type DeletePdfCatalogFileMutationHookResult = ReturnType<typeof useDeletePdfCatalogFileMutation>;
export type DeletePdfCatalogFileMutationResult = Apollo.MutationResult<DeletePdfCatalogFileMutation>;
export const UpdatePdfCatalogFileDocument = gql`
    mutation updatePdfCatalogFile($id: ID!, $input: PdfCatalogFileInput!) {
  updatePdfCatalogFile(id: $id, data: $input) {
    data {
      ...PdfCatalogFile
    }
  }
}
    ${PdfCatalogFileFragmentDoc}`;
export type UpdatePdfCatalogFileMutationFn = Apollo.MutationFunction<UpdatePdfCatalogFileMutation, UpdatePdfCatalogFileMutationVariables>;
export function useUpdatePdfCatalogFileMutation(baseOptions?: Apollo.MutationHookOptions<UpdatePdfCatalogFileMutation, UpdatePdfCatalogFileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdatePdfCatalogFileMutation, UpdatePdfCatalogFileMutationVariables>(UpdatePdfCatalogFileDocument, options);
      }
export type UpdatePdfCatalogFileMutationHookResult = ReturnType<typeof useUpdatePdfCatalogFileMutation>;
export type UpdatePdfCatalogFileMutationResult = Apollo.MutationResult<UpdatePdfCatalogFileMutation>;
export const PdfCatalogFilesDocument = gql`
    query pdfCatalogFiles($filters: PdfCatalogFileFiltersInput, $pagination: PaginationArg = {}, $sort: [String] = []) {
  pdfCatalogFiles(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...PdfCatalogFile
    }
    meta {
      ...Meta
    }
  }
}
    ${PdfCatalogFileFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function usePdfCatalogFilesQuery(baseOptions?: Apollo.QueryHookOptions<PdfCatalogFilesQuery, PdfCatalogFilesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PdfCatalogFilesQuery, PdfCatalogFilesQueryVariables>(PdfCatalogFilesDocument, options);
      }
export function usePdfCatalogFilesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PdfCatalogFilesQuery, PdfCatalogFilesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PdfCatalogFilesQuery, PdfCatalogFilesQueryVariables>(PdfCatalogFilesDocument, options);
        }
export type PdfCatalogFilesQueryHookResult = ReturnType<typeof usePdfCatalogFilesQuery>;
export type PdfCatalogFilesLazyQueryHookResult = ReturnType<typeof usePdfCatalogFilesLazyQuery>;
export type PdfCatalogFilesQueryResult = Apollo.QueryResult<PdfCatalogFilesQuery, PdfCatalogFilesQueryVariables>;
export const CreatePdfTemplateDocument = gql`
    mutation createPdfTemplate($data: PdfTemplateInput!) {
  createPdfTemplate(data: $data) {
    data {
      id
    }
  }
}
    `;
export type CreatePdfTemplateMutationFn = Apollo.MutationFunction<CreatePdfTemplateMutation, CreatePdfTemplateMutationVariables>;
export function useCreatePdfTemplateMutation(baseOptions?: Apollo.MutationHookOptions<CreatePdfTemplateMutation, CreatePdfTemplateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatePdfTemplateMutation, CreatePdfTemplateMutationVariables>(CreatePdfTemplateDocument, options);
      }
export type CreatePdfTemplateMutationHookResult = ReturnType<typeof useCreatePdfTemplateMutation>;
export type CreatePdfTemplateMutationResult = Apollo.MutationResult<CreatePdfTemplateMutation>;
export const DeletePdfTemplateDocument = gql`
    mutation deletePdfTemplate($id: ID!) {
  deletePdfTemplate(id: $id) {
    data {
      id
    }
  }
}
    `;
export type DeletePdfTemplateMutationFn = Apollo.MutationFunction<DeletePdfTemplateMutation, DeletePdfTemplateMutationVariables>;
export function useDeletePdfTemplateMutation(baseOptions?: Apollo.MutationHookOptions<DeletePdfTemplateMutation, DeletePdfTemplateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeletePdfTemplateMutation, DeletePdfTemplateMutationVariables>(DeletePdfTemplateDocument, options);
      }
export type DeletePdfTemplateMutationHookResult = ReturnType<typeof useDeletePdfTemplateMutation>;
export type DeletePdfTemplateMutationResult = Apollo.MutationResult<DeletePdfTemplateMutation>;
export const UpdatePdfTemplateDocument = gql`
    mutation updatePdfTemplate($id: ID!, $data: PdfTemplateInput!) {
  updatePdfTemplate(id: $id, data: $data) {
    data {
      id
    }
  }
}
    `;
export type UpdatePdfTemplateMutationFn = Apollo.MutationFunction<UpdatePdfTemplateMutation, UpdatePdfTemplateMutationVariables>;
export function useUpdatePdfTemplateMutation(baseOptions?: Apollo.MutationHookOptions<UpdatePdfTemplateMutation, UpdatePdfTemplateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdatePdfTemplateMutation, UpdatePdfTemplateMutationVariables>(UpdatePdfTemplateDocument, options);
      }
export type UpdatePdfTemplateMutationHookResult = ReturnType<typeof useUpdatePdfTemplateMutation>;
export type UpdatePdfTemplateMutationResult = Apollo.MutationResult<UpdatePdfTemplateMutation>;
export const PdfTemplatesDocument = gql`
    query pdfTemplates($filters: PdfTemplateFiltersInput, $pagination: PaginationArg, $sort: [String]) {
  pdfTemplates(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...PdfTemplate
    }
    meta {
      ...Meta
    }
  }
}
    ${PdfTemplateFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function usePdfTemplatesQuery(baseOptions?: Apollo.QueryHookOptions<PdfTemplatesQuery, PdfTemplatesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PdfTemplatesQuery, PdfTemplatesQueryVariables>(PdfTemplatesDocument, options);
      }
export function usePdfTemplatesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PdfTemplatesQuery, PdfTemplatesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PdfTemplatesQuery, PdfTemplatesQueryVariables>(PdfTemplatesDocument, options);
        }
export type PdfTemplatesQueryHookResult = ReturnType<typeof usePdfTemplatesQuery>;
export type PdfTemplatesLazyQueryHookResult = ReturnType<typeof usePdfTemplatesLazyQuery>;
export type PdfTemplatesQueryResult = Apollo.QueryResult<PdfTemplatesQuery, PdfTemplatesQueryVariables>;
export const PlatformDocument = gql`
    query platform {
  platform {
    data {
      attributes {
        name
        logo {
          data {
            ...File
          }
        }
        minifiedLogo {
          data {
            ...File
          }
        }
        address
      }
    }
  }
}
    ${FileFragmentDoc}`;
export function usePlatformQuery(baseOptions?: Apollo.QueryHookOptions<PlatformQuery, PlatformQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PlatformQuery, PlatformQueryVariables>(PlatformDocument, options);
      }
export function usePlatformLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PlatformQuery, PlatformQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PlatformQuery, PlatformQueryVariables>(PlatformDocument, options);
        }
export type PlatformQueryHookResult = ReturnType<typeof usePlatformQuery>;
export type PlatformLazyQueryHookResult = ReturnType<typeof usePlatformLazyQuery>;
export type PlatformQueryResult = Apollo.QueryResult<PlatformQuery, PlatformQueryVariables>;
export const CreateProductDocument = gql`
    mutation createProduct($input: ProductInput!) {
  createProduct(data: $input) {
    data {
      id
    }
  }
}
    `;
export type CreateProductMutationFn = Apollo.MutationFunction<CreateProductMutation, CreateProductMutationVariables>;
export function useCreateProductMutation(baseOptions?: Apollo.MutationHookOptions<CreateProductMutation, CreateProductMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateProductMutation, CreateProductMutationVariables>(CreateProductDocument, options);
      }
export type CreateProductMutationHookResult = ReturnType<typeof useCreateProductMutation>;
export type CreateProductMutationResult = Apollo.MutationResult<CreateProductMutation>;
export const CreateProductBrandDocument = gql`
    mutation createProductBrand($input: ProductBrandInput!) {
  createProductBrand(data: $input) {
    data {
      id
    }
  }
}
    `;
export type CreateProductBrandMutationFn = Apollo.MutationFunction<CreateProductBrandMutation, CreateProductBrandMutationVariables>;
export function useCreateProductBrandMutation(baseOptions?: Apollo.MutationHookOptions<CreateProductBrandMutation, CreateProductBrandMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateProductBrandMutation, CreateProductBrandMutationVariables>(CreateProductBrandDocument, options);
      }
export type CreateProductBrandMutationHookResult = ReturnType<typeof useCreateProductBrandMutation>;
export type CreateProductBrandMutationResult = Apollo.MutationResult<CreateProductBrandMutation>;
export const CreateProductInventoryItemDocument = gql`
    mutation createProductInventoryItem($input: ProductInventoryItemInput!) {
  createProductInventoryItem(data: $input) {
    data {
      id
      attributes {
        businessLocation {
          data {
            id
          }
        }
      }
    }
  }
}
    `;
export type CreateProductInventoryItemMutationFn = Apollo.MutationFunction<CreateProductInventoryItemMutation, CreateProductInventoryItemMutationVariables>;
export function useCreateProductInventoryItemMutation(baseOptions?: Apollo.MutationHookOptions<CreateProductInventoryItemMutation, CreateProductInventoryItemMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateProductInventoryItemMutation, CreateProductInventoryItemMutationVariables>(CreateProductInventoryItemDocument, options);
      }
export type CreateProductInventoryItemMutationHookResult = ReturnType<typeof useCreateProductInventoryItemMutation>;
export type CreateProductInventoryItemMutationResult = Apollo.MutationResult<CreateProductInventoryItemMutation>;
export const CreateProductInventoryItemEventDocument = gql`
    mutation createProductInventoryItemEvent($input: ProductInventoryItemEventInput!) {
  createProductInventoryItemEvent(data: $input) {
    data {
      id
      attributes {
        change
        productInventoryItem {
          data {
            id
            attributes {
              uuid
              quantity
              tax {
                data {
                  id
                }
              }
              taxCollection {
                data {
                  id
                  attributes {
                    name
                  }
                }
              }
              businessLocation {
                data {
                  id
                }
              }
            }
          }
        }
      }
    }
  }
}
    `;
export type CreateProductInventoryItemEventMutationFn = Apollo.MutationFunction<CreateProductInventoryItemEventMutation, CreateProductInventoryItemEventMutationVariables>;
export function useCreateProductInventoryItemEventMutation(baseOptions?: Apollo.MutationHookOptions<CreateProductInventoryItemEventMutation, CreateProductInventoryItemEventMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateProductInventoryItemEventMutation, CreateProductInventoryItemEventMutationVariables>(CreateProductInventoryItemEventDocument, options);
      }
export type CreateProductInventoryItemEventMutationHookResult = ReturnType<typeof useCreateProductInventoryItemEventMutation>;
export type CreateProductInventoryItemEventMutationResult = Apollo.MutationResult<CreateProductInventoryItemEventMutation>;
export const CreateProductInventoryItemRecordDocument = gql`
    mutation createProductInventoryItemRecord($input: InvtItmRecordInput!) {
  createInvtItmRecord(data: $input) {
    data {
      id
    }
  }
}
    `;
export type CreateProductInventoryItemRecordMutationFn = Apollo.MutationFunction<CreateProductInventoryItemRecordMutation, CreateProductInventoryItemRecordMutationVariables>;
export function useCreateProductInventoryItemRecordMutation(baseOptions?: Apollo.MutationHookOptions<CreateProductInventoryItemRecordMutation, CreateProductInventoryItemRecordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateProductInventoryItemRecordMutation, CreateProductInventoryItemRecordMutationVariables>(CreateProductInventoryItemRecordDocument, options);
      }
export type CreateProductInventoryItemRecordMutationHookResult = ReturnType<typeof useCreateProductInventoryItemRecordMutation>;
export type CreateProductInventoryItemRecordMutationResult = Apollo.MutationResult<CreateProductInventoryItemRecordMutation>;
export const CreateProductTypeDocument = gql`
    mutation createProductType($input: ProductTypeInput!) {
  createProductType(data: $input) {
    data {
      id
    }
  }
}
    `;
export type CreateProductTypeMutationFn = Apollo.MutationFunction<CreateProductTypeMutation, CreateProductTypeMutationVariables>;
export function useCreateProductTypeMutation(baseOptions?: Apollo.MutationHookOptions<CreateProductTypeMutation, CreateProductTypeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateProductTypeMutation, CreateProductTypeMutationVariables>(CreateProductTypeDocument, options);
      }
export type CreateProductTypeMutationHookResult = ReturnType<typeof useCreateProductTypeMutation>;
export type CreateProductTypeMutationResult = Apollo.MutationResult<CreateProductTypeMutation>;
export const CreateProductsBasedOnAiGenerationDocument = gql`
    mutation createProductsBasedOnAIGeneration($input: CreateProductsBasedOnAIGenerationInput!) {
  createProductsBasedOnAIGeneration(input: $input)
}
    `;
export type CreateProductsBasedOnAiGenerationMutationFn = Apollo.MutationFunction<CreateProductsBasedOnAiGenerationMutation, CreateProductsBasedOnAiGenerationMutationVariables>;
export function useCreateProductsBasedOnAiGenerationMutation(baseOptions?: Apollo.MutationHookOptions<CreateProductsBasedOnAiGenerationMutation, CreateProductsBasedOnAiGenerationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateProductsBasedOnAiGenerationMutation, CreateProductsBasedOnAiGenerationMutationVariables>(CreateProductsBasedOnAiGenerationDocument, options);
      }
export type CreateProductsBasedOnAiGenerationMutationHookResult = ReturnType<typeof useCreateProductsBasedOnAiGenerationMutation>;
export type CreateProductsBasedOnAiGenerationMutationResult = Apollo.MutationResult<CreateProductsBasedOnAiGenerationMutation>;
export const CreateProductsFromCsvDocument = gql`
    mutation createProductsFromCsv($input: CreateProductsFromCSVInput!) {
  createProductsFromCSV(input: $input)
}
    `;
export type CreateProductsFromCsvMutationFn = Apollo.MutationFunction<CreateProductsFromCsvMutation, CreateProductsFromCsvMutationVariables>;
export function useCreateProductsFromCsvMutation(baseOptions?: Apollo.MutationHookOptions<CreateProductsFromCsvMutation, CreateProductsFromCsvMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateProductsFromCsvMutation, CreateProductsFromCsvMutationVariables>(CreateProductsFromCsvDocument, options);
      }
export type CreateProductsFromCsvMutationHookResult = ReturnType<typeof useCreateProductsFromCsvMutation>;
export type CreateProductsFromCsvMutationResult = Apollo.MutationResult<CreateProductsFromCsvMutation>;
export const CreateRentableDataDocument = gql`
    mutation createRentableData($input: RentableDataInput!) {
  createRentableData(data: $input) {
    data {
      id
    }
  }
}
    `;
export type CreateRentableDataMutationFn = Apollo.MutationFunction<CreateRentableDataMutation, CreateRentableDataMutationVariables>;
export function useCreateRentableDataMutation(baseOptions?: Apollo.MutationHookOptions<CreateRentableDataMutation, CreateRentableDataMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateRentableDataMutation, CreateRentableDataMutationVariables>(CreateRentableDataDocument, options);
      }
export type CreateRentableDataMutationHookResult = ReturnType<typeof useCreateRentableDataMutation>;
export type CreateRentableDataMutationResult = Apollo.MutationResult<CreateRentableDataMutation>;
export const CreateSerializeDocument = gql`
    mutation createSerialize($input: InventorySerializeInput!) {
  createInventorySerialize(data: $input) {
    data {
      id
    }
  }
}
    `;
export type CreateSerializeMutationFn = Apollo.MutationFunction<CreateSerializeMutation, CreateSerializeMutationVariables>;
export function useCreateSerializeMutation(baseOptions?: Apollo.MutationHookOptions<CreateSerializeMutation, CreateSerializeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSerializeMutation, CreateSerializeMutationVariables>(CreateSerializeDocument, options);
      }
export type CreateSerializeMutationHookResult = ReturnType<typeof useCreateSerializeMutation>;
export type CreateSerializeMutationResult = Apollo.MutationResult<CreateSerializeMutation>;
export const CreateWeightDocument = gql`
    mutation createWeight($input: WeightInput!) {
  createWeight(data: $input) {
    data {
      id
    }
  }
}
    `;
export type CreateWeightMutationFn = Apollo.MutationFunction<CreateWeightMutation, CreateWeightMutationVariables>;
export function useCreateWeightMutation(baseOptions?: Apollo.MutationHookOptions<CreateWeightMutation, CreateWeightMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateWeightMutation, CreateWeightMutationVariables>(CreateWeightDocument, options);
      }
export type CreateWeightMutationHookResult = ReturnType<typeof useCreateWeightMutation>;
export type CreateWeightMutationResult = Apollo.MutationResult<CreateWeightMutation>;
export const DeleteProductBrandDocument = gql`
    mutation deleteProductBrand($id: ID!) {
  deleteProductBrand(id: $id) {
    data {
      id
    }
  }
}
    `;
export type DeleteProductBrandMutationFn = Apollo.MutationFunction<DeleteProductBrandMutation, DeleteProductBrandMutationVariables>;
export function useDeleteProductBrandMutation(baseOptions?: Apollo.MutationHookOptions<DeleteProductBrandMutation, DeleteProductBrandMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteProductBrandMutation, DeleteProductBrandMutationVariables>(DeleteProductBrandDocument, options);
      }
export type DeleteProductBrandMutationHookResult = ReturnType<typeof useDeleteProductBrandMutation>;
export type DeleteProductBrandMutationResult = Apollo.MutationResult<DeleteProductBrandMutation>;
export const DeleteProductInventoryItemEventDocument = gql`
    mutation deleteProductInventoryItemEvent($id: ID!) {
  deleteProductInventoryItemEvent(id: $id) {
    data {
      id
    }
  }
}
    `;
export type DeleteProductInventoryItemEventMutationFn = Apollo.MutationFunction<DeleteProductInventoryItemEventMutation, DeleteProductInventoryItemEventMutationVariables>;
export function useDeleteProductInventoryItemEventMutation(baseOptions?: Apollo.MutationHookOptions<DeleteProductInventoryItemEventMutation, DeleteProductInventoryItemEventMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteProductInventoryItemEventMutation, DeleteProductInventoryItemEventMutationVariables>(DeleteProductInventoryItemEventDocument, options);
      }
export type DeleteProductInventoryItemEventMutationHookResult = ReturnType<typeof useDeleteProductInventoryItemEventMutation>;
export type DeleteProductInventoryItemEventMutationResult = Apollo.MutationResult<DeleteProductInventoryItemEventMutation>;
export const DeleteProductInventoryItemRecordDocument = gql`
    mutation deleteProductInventoryItemRecord($id: ID!) {
  deleteInvtItmRecord(id: $id) {
    data {
      id
    }
  }
}
    `;
export type DeleteProductInventoryItemRecordMutationFn = Apollo.MutationFunction<DeleteProductInventoryItemRecordMutation, DeleteProductInventoryItemRecordMutationVariables>;
export function useDeleteProductInventoryItemRecordMutation(baseOptions?: Apollo.MutationHookOptions<DeleteProductInventoryItemRecordMutation, DeleteProductInventoryItemRecordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteProductInventoryItemRecordMutation, DeleteProductInventoryItemRecordMutationVariables>(DeleteProductInventoryItemRecordDocument, options);
      }
export type DeleteProductInventoryItemRecordMutationHookResult = ReturnType<typeof useDeleteProductInventoryItemRecordMutation>;
export type DeleteProductInventoryItemRecordMutationResult = Apollo.MutationResult<DeleteProductInventoryItemRecordMutation>;
export const DeleteProductTypeDocument = gql`
    mutation deleteProductType($id: ID!) {
  deleteProductType(id: $id) {
    data {
      id
    }
  }
}
    `;
export type DeleteProductTypeMutationFn = Apollo.MutationFunction<DeleteProductTypeMutation, DeleteProductTypeMutationVariables>;
export function useDeleteProductTypeMutation(baseOptions?: Apollo.MutationHookOptions<DeleteProductTypeMutation, DeleteProductTypeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteProductTypeMutation, DeleteProductTypeMutationVariables>(DeleteProductTypeDocument, options);
      }
export type DeleteProductTypeMutationHookResult = ReturnType<typeof useDeleteProductTypeMutation>;
export type DeleteProductTypeMutationResult = Apollo.MutationResult<DeleteProductTypeMutation>;
export const DeleteRentableDataDocument = gql`
    mutation deleteRentableData($id: ID!) {
  deleteRentableData(id: $id) {
    data {
      id
    }
  }
}
    `;
export type DeleteRentableDataMutationFn = Apollo.MutationFunction<DeleteRentableDataMutation, DeleteRentableDataMutationVariables>;
export function useDeleteRentableDataMutation(baseOptions?: Apollo.MutationHookOptions<DeleteRentableDataMutation, DeleteRentableDataMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteRentableDataMutation, DeleteRentableDataMutationVariables>(DeleteRentableDataDocument, options);
      }
export type DeleteRentableDataMutationHookResult = ReturnType<typeof useDeleteRentableDataMutation>;
export type DeleteRentableDataMutationResult = Apollo.MutationResult<DeleteRentableDataMutation>;
export const DeleteSerializeDocument = gql`
    mutation deleteSerialize($id: ID!) {
  deleteInventorySerialize(id: $id) {
    data {
      id
    }
  }
}
    `;
export type DeleteSerializeMutationFn = Apollo.MutationFunction<DeleteSerializeMutation, DeleteSerializeMutationVariables>;
export function useDeleteSerializeMutation(baseOptions?: Apollo.MutationHookOptions<DeleteSerializeMutation, DeleteSerializeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteSerializeMutation, DeleteSerializeMutationVariables>(DeleteSerializeDocument, options);
      }
export type DeleteSerializeMutationHookResult = ReturnType<typeof useDeleteSerializeMutation>;
export type DeleteSerializeMutationResult = Apollo.MutationResult<DeleteSerializeMutation>;
export const DeleteWeightDocument = gql`
    mutation deleteWeight($id: ID!) {
  deleteWeight(id: $id) {
    data {
      id
    }
  }
}
    `;
export type DeleteWeightMutationFn = Apollo.MutationFunction<DeleteWeightMutation, DeleteWeightMutationVariables>;
export function useDeleteWeightMutation(baseOptions?: Apollo.MutationHookOptions<DeleteWeightMutation, DeleteWeightMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteWeightMutation, DeleteWeightMutationVariables>(DeleteWeightDocument, options);
      }
export type DeleteWeightMutationHookResult = ReturnType<typeof useDeleteWeightMutation>;
export type DeleteWeightMutationResult = Apollo.MutationResult<DeleteWeightMutation>;
export const FastUpdateAllProductsFromCsvDocument = gql`
    mutation fastUpdateAllProductsFromCSV($input: FastUpdateAllProductsFromCSVInput!) {
  fastUpdateAllProductsFromCSV(input: $input)
}
    `;
export type FastUpdateAllProductsFromCsvMutationFn = Apollo.MutationFunction<FastUpdateAllProductsFromCsvMutation, FastUpdateAllProductsFromCsvMutationVariables>;
export function useFastUpdateAllProductsFromCsvMutation(baseOptions?: Apollo.MutationHookOptions<FastUpdateAllProductsFromCsvMutation, FastUpdateAllProductsFromCsvMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<FastUpdateAllProductsFromCsvMutation, FastUpdateAllProductsFromCsvMutationVariables>(FastUpdateAllProductsFromCsvDocument, options);
      }
export type FastUpdateAllProductsFromCsvMutationHookResult = ReturnType<typeof useFastUpdateAllProductsFromCsvMutation>;
export type FastUpdateAllProductsFromCsvMutationResult = Apollo.MutationResult<FastUpdateAllProductsFromCsvMutation>;
export const FastUpdateSingleProductDocument = gql`
    mutation fastUpdateSingleProduct($input: FastUpdateSingleProductInput!) {
  fastUpdateSingleProduct(input: $input)
}
    `;
export type FastUpdateSingleProductMutationFn = Apollo.MutationFunction<FastUpdateSingleProductMutation, FastUpdateSingleProductMutationVariables>;
export function useFastUpdateSingleProductMutation(baseOptions?: Apollo.MutationHookOptions<FastUpdateSingleProductMutation, FastUpdateSingleProductMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<FastUpdateSingleProductMutation, FastUpdateSingleProductMutationVariables>(FastUpdateSingleProductDocument, options);
      }
export type FastUpdateSingleProductMutationHookResult = ReturnType<typeof useFastUpdateSingleProductMutation>;
export type FastUpdateSingleProductMutationResult = Apollo.MutationResult<FastUpdateSingleProductMutation>;
export const PrevProductSyncWithAccountingServiceDocument = gql`
    mutation prevProductSyncWithAccountingService($input: PrevProductSyncWithAccountingServiceInput!) {
  prevProductSyncWithAccountingService(input: $input)
}
    `;
export type PrevProductSyncWithAccountingServiceMutationFn = Apollo.MutationFunction<PrevProductSyncWithAccountingServiceMutation, PrevProductSyncWithAccountingServiceMutationVariables>;
export function usePrevProductSyncWithAccountingServiceMutation(baseOptions?: Apollo.MutationHookOptions<PrevProductSyncWithAccountingServiceMutation, PrevProductSyncWithAccountingServiceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PrevProductSyncWithAccountingServiceMutation, PrevProductSyncWithAccountingServiceMutationVariables>(PrevProductSyncWithAccountingServiceDocument, options);
      }
export type PrevProductSyncWithAccountingServiceMutationHookResult = ReturnType<typeof usePrevProductSyncWithAccountingServiceMutation>;
export type PrevProductSyncWithAccountingServiceMutationResult = Apollo.MutationResult<PrevProductSyncWithAccountingServiceMutation>;
export const ShopifyCollectionsDocument = gql`
    mutation shopifyCollections($input: ShopifyCollectionsArgInput!) {
  shopifyCollections(input: $input) {
    status
    data {
      id
      title
    }
  }
}
    `;
export type ShopifyCollectionsMutationFn = Apollo.MutationFunction<ShopifyCollectionsMutation, ShopifyCollectionsMutationVariables>;
export function useShopifyCollectionsMutation(baseOptions?: Apollo.MutationHookOptions<ShopifyCollectionsMutation, ShopifyCollectionsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ShopifyCollectionsMutation, ShopifyCollectionsMutationVariables>(ShopifyCollectionsDocument, options);
      }
export type ShopifyCollectionsMutationHookResult = ReturnType<typeof useShopifyCollectionsMutation>;
export type ShopifyCollectionsMutationResult = Apollo.MutationResult<ShopifyCollectionsMutation>;
export const UpdateDefaultPriceFromCsvDocument = gql`
    mutation updateDefaultPriceFromCSV($input: UpdateDefaultPriceFromCSVInput!) {
  updateDefaultPriceFromCSV(input: $input)
}
    `;
export type UpdateDefaultPriceFromCsvMutationFn = Apollo.MutationFunction<UpdateDefaultPriceFromCsvMutation, UpdateDefaultPriceFromCsvMutationVariables>;
export function useUpdateDefaultPriceFromCsvMutation(baseOptions?: Apollo.MutationHookOptions<UpdateDefaultPriceFromCsvMutation, UpdateDefaultPriceFromCsvMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateDefaultPriceFromCsvMutation, UpdateDefaultPriceFromCsvMutationVariables>(UpdateDefaultPriceFromCsvDocument, options);
      }
export type UpdateDefaultPriceFromCsvMutationHookResult = ReturnType<typeof useUpdateDefaultPriceFromCsvMutation>;
export type UpdateDefaultPriceFromCsvMutationResult = Apollo.MutationResult<UpdateDefaultPriceFromCsvMutation>;
export const UpdateProductDocument = gql`
    mutation updateProduct($id: ID!, $input: ProductInput!) {
  updateProduct(id: $id, data: $input) {
    data {
      id
    }
  }
}
    `;
export type UpdateProductMutationFn = Apollo.MutationFunction<UpdateProductMutation, UpdateProductMutationVariables>;
export function useUpdateProductMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProductMutation, UpdateProductMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProductMutation, UpdateProductMutationVariables>(UpdateProductDocument, options);
      }
export type UpdateProductMutationHookResult = ReturnType<typeof useUpdateProductMutation>;
export type UpdateProductMutationResult = Apollo.MutationResult<UpdateProductMutation>;
export const UpdateProductInventoryItemDocument = gql`
    mutation updateProductInventoryItem($id: ID!, $input: ProductInventoryItemInput!) {
  updateProductInventoryItem(id: $id, data: $input) {
    data {
      id
    }
  }
}
    `;
export type UpdateProductInventoryItemMutationFn = Apollo.MutationFunction<UpdateProductInventoryItemMutation, UpdateProductInventoryItemMutationVariables>;
export function useUpdateProductInventoryItemMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProductInventoryItemMutation, UpdateProductInventoryItemMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProductInventoryItemMutation, UpdateProductInventoryItemMutationVariables>(UpdateProductInventoryItemDocument, options);
      }
export type UpdateProductInventoryItemMutationHookResult = ReturnType<typeof useUpdateProductInventoryItemMutation>;
export type UpdateProductInventoryItemMutationResult = Apollo.MutationResult<UpdateProductInventoryItemMutation>;
export const UpdateProductInventoryItemEventDocument = gql`
    mutation updateProductInventoryItemEvent($id: ID!, $input: ProductInventoryItemEventInput!) {
  updateProductInventoryItemEvent(id: $id, data: $input) {
    data {
      id
    }
  }
}
    `;
export type UpdateProductInventoryItemEventMutationFn = Apollo.MutationFunction<UpdateProductInventoryItemEventMutation, UpdateProductInventoryItemEventMutationVariables>;
export function useUpdateProductInventoryItemEventMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProductInventoryItemEventMutation, UpdateProductInventoryItemEventMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProductInventoryItemEventMutation, UpdateProductInventoryItemEventMutationVariables>(UpdateProductInventoryItemEventDocument, options);
      }
export type UpdateProductInventoryItemEventMutationHookResult = ReturnType<typeof useUpdateProductInventoryItemEventMutation>;
export type UpdateProductInventoryItemEventMutationResult = Apollo.MutationResult<UpdateProductInventoryItemEventMutation>;
export const UpdateProductInventoryItemRecordDocument = gql`
    mutation updateProductInventoryItemRecord($id: ID!, $input: InvtItmRecordInput!) {
  updateInvtItmRecord(id: $id, data: $input) {
    data {
      id
    }
  }
}
    `;
export type UpdateProductInventoryItemRecordMutationFn = Apollo.MutationFunction<UpdateProductInventoryItemRecordMutation, UpdateProductInventoryItemRecordMutationVariables>;
export function useUpdateProductInventoryItemRecordMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProductInventoryItemRecordMutation, UpdateProductInventoryItemRecordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProductInventoryItemRecordMutation, UpdateProductInventoryItemRecordMutationVariables>(UpdateProductInventoryItemRecordDocument, options);
      }
export type UpdateProductInventoryItemRecordMutationHookResult = ReturnType<typeof useUpdateProductInventoryItemRecordMutation>;
export type UpdateProductInventoryItemRecordMutationResult = Apollo.MutationResult<UpdateProductInventoryItemRecordMutation>;
export const UpdateProductTypeDocument = gql`
    mutation updateProductType($id: ID!, $input: ProductTypeInput!) {
  updateProductType(id: $id, data: $input) {
    data {
      id
    }
  }
}
    `;
export type UpdateProductTypeMutationFn = Apollo.MutationFunction<UpdateProductTypeMutation, UpdateProductTypeMutationVariables>;
export function useUpdateProductTypeMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProductTypeMutation, UpdateProductTypeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProductTypeMutation, UpdateProductTypeMutationVariables>(UpdateProductTypeDocument, options);
      }
export type UpdateProductTypeMutationHookResult = ReturnType<typeof useUpdateProductTypeMutation>;
export type UpdateProductTypeMutationResult = Apollo.MutationResult<UpdateProductTypeMutation>;
export const UpdateProductTypesItemCategoriesDocument = gql`
    mutation updateProductTypesItemCategories($input: UpdateProductTypesItemCategoriesInput!) {
  updateProductTypesItemCategories(input: $input) {
    success
    updatedCount
  }
}
    `;
export type UpdateProductTypesItemCategoriesMutationFn = Apollo.MutationFunction<UpdateProductTypesItemCategoriesMutation, UpdateProductTypesItemCategoriesMutationVariables>;
export function useUpdateProductTypesItemCategoriesMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProductTypesItemCategoriesMutation, UpdateProductTypesItemCategoriesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProductTypesItemCategoriesMutation, UpdateProductTypesItemCategoriesMutationVariables>(UpdateProductTypesItemCategoriesDocument, options);
      }
export type UpdateProductTypesItemCategoriesMutationHookResult = ReturnType<typeof useUpdateProductTypesItemCategoriesMutation>;
export type UpdateProductTypesItemCategoriesMutationResult = Apollo.MutationResult<UpdateProductTypesItemCategoriesMutation>;
export const UpdateRentableDataDocument = gql`
    mutation updateRentableData($id: ID!, $input: RentableDataInput!) {
  updateRentableData(id: $id, data: $input) {
    data {
      id
    }
  }
}
    `;
export type UpdateRentableDataMutationFn = Apollo.MutationFunction<UpdateRentableDataMutation, UpdateRentableDataMutationVariables>;
export function useUpdateRentableDataMutation(baseOptions?: Apollo.MutationHookOptions<UpdateRentableDataMutation, UpdateRentableDataMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateRentableDataMutation, UpdateRentableDataMutationVariables>(UpdateRentableDataDocument, options);
      }
export type UpdateRentableDataMutationHookResult = ReturnType<typeof useUpdateRentableDataMutation>;
export type UpdateRentableDataMutationResult = Apollo.MutationResult<UpdateRentableDataMutation>;
export const UpdateSerializeDocument = gql`
    mutation updateSerialize($id: ID!, $input: InventorySerializeInput!) {
  updateInventorySerialize(id: $id, data: $input) {
    data {
      id
    }
  }
}
    `;
export type UpdateSerializeMutationFn = Apollo.MutationFunction<UpdateSerializeMutation, UpdateSerializeMutationVariables>;
export function useUpdateSerializeMutation(baseOptions?: Apollo.MutationHookOptions<UpdateSerializeMutation, UpdateSerializeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateSerializeMutation, UpdateSerializeMutationVariables>(UpdateSerializeDocument, options);
      }
export type UpdateSerializeMutationHookResult = ReturnType<typeof useUpdateSerializeMutation>;
export type UpdateSerializeMutationResult = Apollo.MutationResult<UpdateSerializeMutation>;
export const UpdateWeightDocument = gql`
    mutation updateWeight($id: ID!, $input: WeightInput!) {
  updateWeight(id: $id, data: $input) {
    data {
      id
    }
  }
}
    `;
export type UpdateWeightMutationFn = Apollo.MutationFunction<UpdateWeightMutation, UpdateWeightMutationVariables>;
export function useUpdateWeightMutation(baseOptions?: Apollo.MutationHookOptions<UpdateWeightMutation, UpdateWeightMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateWeightMutation, UpdateWeightMutationVariables>(UpdateWeightDocument, options);
      }
export type UpdateWeightMutationHookResult = ReturnType<typeof useUpdateWeightMutation>;
export type UpdateWeightMutationResult = Apollo.MutationResult<UpdateWeightMutation>;
export const AllProductsForPurchaseDocument = gql`
    query allProductsForPurchase($filters: ProductFiltersInput, $sort: [String] = []) {
  products(filters: $filters, pagination: {limit: -1}, sort: $sort) {
    data {
      id
      attributes {
        uuid
        name
        SKU
        barcode
        defaultPrice
        productInventoryItems {
          data {
            id
            attributes {
              uuid
              quantity
              price
              product {
                data {
                  id
                }
              }
              businessLocation {
                data {
                  id
                }
              }
            }
          }
        }
      }
    }
  }
}
    `;
export function useAllProductsForPurchaseQuery(baseOptions?: Apollo.QueryHookOptions<AllProductsForPurchaseQuery, AllProductsForPurchaseQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AllProductsForPurchaseQuery, AllProductsForPurchaseQueryVariables>(AllProductsForPurchaseDocument, options);
      }
export function useAllProductsForPurchaseLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AllProductsForPurchaseQuery, AllProductsForPurchaseQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AllProductsForPurchaseQuery, AllProductsForPurchaseQueryVariables>(AllProductsForPurchaseDocument, options);
        }
export type AllProductsForPurchaseQueryHookResult = ReturnType<typeof useAllProductsForPurchaseQuery>;
export type AllProductsForPurchaseLazyQueryHookResult = ReturnType<typeof useAllProductsForPurchaseLazyQuery>;
export type AllProductsForPurchaseQueryResult = Apollo.QueryResult<AllProductsForPurchaseQuery, AllProductsForPurchaseQueryVariables>;
export const InventoryAllProductsDocument = gql`
    query inventoryAllProducts($filters: ProductFiltersInput, $sort: [String] = []) {
  products(filters: $filters, pagination: {limit: -1}, sort: $sort) {
    data {
      id
      attributes {
        uuid
      }
    }
    meta {
      ...Meta
    }
  }
}
    ${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useInventoryAllProductsQuery(baseOptions?: Apollo.QueryHookOptions<InventoryAllProductsQuery, InventoryAllProductsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<InventoryAllProductsQuery, InventoryAllProductsQueryVariables>(InventoryAllProductsDocument, options);
      }
export function useInventoryAllProductsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<InventoryAllProductsQuery, InventoryAllProductsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<InventoryAllProductsQuery, InventoryAllProductsQueryVariables>(InventoryAllProductsDocument, options);
        }
export type InventoryAllProductsQueryHookResult = ReturnType<typeof useInventoryAllProductsQuery>;
export type InventoryAllProductsLazyQueryHookResult = ReturnType<typeof useInventoryAllProductsLazyQuery>;
export type InventoryAllProductsQueryResult = Apollo.QueryResult<InventoryAllProductsQuery, InventoryAllProductsQueryVariables>;
export const ProductInventoryItemAgeRangeDocument = gql`
    query productInventoryItemAgeRange {
  productInventoryItemAgeRange {
    minAge
    maxAge
  }
}
    `;
export function useProductInventoryItemAgeRangeQuery(baseOptions?: Apollo.QueryHookOptions<ProductInventoryItemAgeRangeQuery, ProductInventoryItemAgeRangeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProductInventoryItemAgeRangeQuery, ProductInventoryItemAgeRangeQueryVariables>(ProductInventoryItemAgeRangeDocument, options);
      }
export function useProductInventoryItemAgeRangeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProductInventoryItemAgeRangeQuery, ProductInventoryItemAgeRangeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProductInventoryItemAgeRangeQuery, ProductInventoryItemAgeRangeQueryVariables>(ProductInventoryItemAgeRangeDocument, options);
        }
export type ProductInventoryItemAgeRangeQueryHookResult = ReturnType<typeof useProductInventoryItemAgeRangeQuery>;
export type ProductInventoryItemAgeRangeLazyQueryHookResult = ReturnType<typeof useProductInventoryItemAgeRangeLazyQuery>;
export type ProductInventoryItemAgeRangeQueryResult = Apollo.QueryResult<ProductInventoryItemAgeRangeQuery, ProductInventoryItemAgeRangeQueryVariables>;
export const InventoryProductsTableDocument = gql`
    query inventoryProductsTable($filters: ProductFiltersInput, $pagination: PaginationArg = {}, $sort: [String] = [], $businessLocationId: Int) {
  products(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...InventoryProductTable
    }
    meta {
      ...Meta
    }
  }
}
    ${InventoryProductTableFragmentDoc}
${FileMinFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useInventoryProductsTableQuery(baseOptions?: Apollo.QueryHookOptions<InventoryProductsTableQuery, InventoryProductsTableQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<InventoryProductsTableQuery, InventoryProductsTableQueryVariables>(InventoryProductsTableDocument, options);
      }
export function useInventoryProductsTableLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<InventoryProductsTableQuery, InventoryProductsTableQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<InventoryProductsTableQuery, InventoryProductsTableQueryVariables>(InventoryProductsTableDocument, options);
        }
export type InventoryProductsTableQueryHookResult = ReturnType<typeof useInventoryProductsTableQuery>;
export type InventoryProductsTableLazyQueryHookResult = ReturnType<typeof useInventoryProductsTableLazyQuery>;
export type InventoryProductsTableQueryResult = Apollo.QueryResult<InventoryProductsTableQuery, InventoryProductsTableQueryVariables>;
export const ProductBrandsDocument = gql`
    query productBrands($filters: ProductBrandFiltersInput, $pagination: PaginationArg = {}, $sort: [String] = []) {
  productBrands(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...ProductBrand
    }
    meta {
      ...Meta
    }
  }
}
    ${ProductBrandFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useProductBrandsQuery(baseOptions?: Apollo.QueryHookOptions<ProductBrandsQuery, ProductBrandsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProductBrandsQuery, ProductBrandsQueryVariables>(ProductBrandsDocument, options);
      }
export function useProductBrandsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProductBrandsQuery, ProductBrandsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProductBrandsQuery, ProductBrandsQueryVariables>(ProductBrandsDocument, options);
        }
export type ProductBrandsQueryHookResult = ReturnType<typeof useProductBrandsQuery>;
export type ProductBrandsLazyQueryHookResult = ReturnType<typeof useProductBrandsLazyQuery>;
export type ProductBrandsQueryResult = Apollo.QueryResult<ProductBrandsQuery, ProductBrandsQueryVariables>;
export const ProductByUuidDocument = gql`
    query productByUuid($uuid: String!) {
  products(filters: {uuid: {eq: $uuid}}) {
    data {
      ...ProductPage
    }
  }
}
    ${ProductPageFragmentDoc}
${ProductMinFragmentDoc}
${FileFragmentDoc}
${DimensionFragmentDoc}
${WeightFragmentDoc}
${ProductBrandFragmentDoc}
${ProductTypeFragmentDoc}
${RentableDataFragmentDoc}
${ProductInventoryItemPageFragmentDoc}
${SubLocationMinFragmentDoc}
${SubLocationItemMinFragmentDoc}
${SerializeFragmentDoc}
${ProductAttributeOptionFragmentDoc}
${ProductAttributeOptionMinFragmentDoc}
${ProductAttributeMinFragmentDoc}`;
export function useProductByUuidQuery(baseOptions: Apollo.QueryHookOptions<ProductByUuidQuery, ProductByUuidQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProductByUuidQuery, ProductByUuidQueryVariables>(ProductByUuidDocument, options);
      }
export function useProductByUuidLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProductByUuidQuery, ProductByUuidQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProductByUuidQuery, ProductByUuidQueryVariables>(ProductByUuidDocument, options);
        }
export type ProductByUuidQueryHookResult = ReturnType<typeof useProductByUuidQuery>;
export type ProductByUuidLazyQueryHookResult = ReturnType<typeof useProductByUuidLazyQuery>;
export type ProductByUuidQueryResult = Apollo.QueryResult<ProductByUuidQuery, ProductByUuidQueryVariables>;
export const ProductInventoryItemEventsByIdTableDocument = gql`
    query productInventoryItemEventsByIdTable($id: ID!, $pagination: PaginationArg, $sort: [String] = [], $eventType: String) {
  productInventoryItemEvents(
    filters: {productInventoryItem: {id: {eq: $id}}, eventType: {eq: $eventType}}
    pagination: $pagination
    sort: $sort
  ) {
    data {
      ...ProductInventoryItemEventTable
    }
    meta {
      ...Meta
    }
  }
}
    ${ProductInventoryItemEventTableFragmentDoc}
${ProductInventoryItemEventMinFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useProductInventoryItemEventsByIdTableQuery(baseOptions: Apollo.QueryHookOptions<ProductInventoryItemEventsByIdTableQuery, ProductInventoryItemEventsByIdTableQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProductInventoryItemEventsByIdTableQuery, ProductInventoryItemEventsByIdTableQueryVariables>(ProductInventoryItemEventsByIdTableDocument, options);
      }
export function useProductInventoryItemEventsByIdTableLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProductInventoryItemEventsByIdTableQuery, ProductInventoryItemEventsByIdTableQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProductInventoryItemEventsByIdTableQuery, ProductInventoryItemEventsByIdTableQueryVariables>(ProductInventoryItemEventsByIdTableDocument, options);
        }
export type ProductInventoryItemEventsByIdTableQueryHookResult = ReturnType<typeof useProductInventoryItemEventsByIdTableQuery>;
export type ProductInventoryItemEventsByIdTableLazyQueryHookResult = ReturnType<typeof useProductInventoryItemEventsByIdTableLazyQuery>;
export type ProductInventoryItemEventsByIdTableQueryResult = Apollo.QueryResult<ProductInventoryItemEventsByIdTableQuery, ProductInventoryItemEventsByIdTableQueryVariables>;
export const ProductInventoryItemEventsMemoNumberDocument = gql`
    query productInventoryItemEventsMemoNumber($filters: ProductInventoryItemEventFiltersInput, $pagination: PaginationArg, $sort: [String] = []) {
  productInventoryItemEvents(
    filters: {eventType: {eq: "receive"}, memo: {eq: true}, and: [$filters]}
    pagination: $pagination
    sort: $sort
  ) {
    data {
      ...ProductInventoryItemEventMemoNumber
    }
  }
}
    ${ProductInventoryItemEventMemoNumberFragmentDoc}`;
export function useProductInventoryItemEventsMemoNumberQuery(baseOptions?: Apollo.QueryHookOptions<ProductInventoryItemEventsMemoNumberQuery, ProductInventoryItemEventsMemoNumberQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProductInventoryItemEventsMemoNumberQuery, ProductInventoryItemEventsMemoNumberQueryVariables>(ProductInventoryItemEventsMemoNumberDocument, options);
      }
export function useProductInventoryItemEventsMemoNumberLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProductInventoryItemEventsMemoNumberQuery, ProductInventoryItemEventsMemoNumberQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProductInventoryItemEventsMemoNumberQuery, ProductInventoryItemEventsMemoNumberQueryVariables>(ProductInventoryItemEventsMemoNumberDocument, options);
        }
export type ProductInventoryItemEventsMemoNumberQueryHookResult = ReturnType<typeof useProductInventoryItemEventsMemoNumberQuery>;
export type ProductInventoryItemEventsMemoNumberLazyQueryHookResult = ReturnType<typeof useProductInventoryItemEventsMemoNumberLazyQuery>;
export type ProductInventoryItemEventsMemoNumberQueryResult = Apollo.QueryResult<ProductInventoryItemEventsMemoNumberQuery, ProductInventoryItemEventsMemoNumberQueryVariables>;
export const ProductInventoryItemMemoEventsDocument = gql`
    query productInventoryItemMemoEvents($filters: ProductInventoryItemEventFiltersInput, $pagination: PaginationArg, $sort: [String] = []) {
  productInventoryItemEvents(
    filters: {eventType: {eq: "receive"}, memo: {eq: true}, and: [$filters]}
    pagination: $pagination
    sort: $sort
  ) {
    data {
      ...ProductInventoryItemEventReport
    }
    meta {
      ...Meta
    }
  }
}
    ${ProductInventoryItemEventReportFragmentDoc}
${ProductInventoryItemEventMinFragmentDoc}
${FileMinFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useProductInventoryItemMemoEventsQuery(baseOptions?: Apollo.QueryHookOptions<ProductInventoryItemMemoEventsQuery, ProductInventoryItemMemoEventsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProductInventoryItemMemoEventsQuery, ProductInventoryItemMemoEventsQueryVariables>(ProductInventoryItemMemoEventsDocument, options);
      }
export function useProductInventoryItemMemoEventsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProductInventoryItemMemoEventsQuery, ProductInventoryItemMemoEventsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProductInventoryItemMemoEventsQuery, ProductInventoryItemMemoEventsQueryVariables>(ProductInventoryItemMemoEventsDocument, options);
        }
export type ProductInventoryItemMemoEventsQueryHookResult = ReturnType<typeof useProductInventoryItemMemoEventsQuery>;
export type ProductInventoryItemMemoEventsLazyQueryHookResult = ReturnType<typeof useProductInventoryItemMemoEventsLazyQuery>;
export type ProductInventoryItemMemoEventsQueryResult = Apollo.QueryResult<ProductInventoryItemMemoEventsQuery, ProductInventoryItemMemoEventsQueryVariables>;
export const ProductInventoryItemRecordsDocument = gql`
    query productInventoryItemRecords($filters: InvtItmRecordFiltersInput, $pagination: PaginationArg = {}, $sort: [String] = [], $businessLocationId: Int) {
  invtItmRecords(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...ProductInventoryItemRecord
    }
    meta {
      ...Meta
    }
  }
}
    ${ProductInventoryItemRecordFragmentDoc}
${ProductInventoryItemRecordMinFragmentDoc}
${FileMinFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useProductInventoryItemRecordsQuery(baseOptions?: Apollo.QueryHookOptions<ProductInventoryItemRecordsQuery, ProductInventoryItemRecordsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProductInventoryItemRecordsQuery, ProductInventoryItemRecordsQueryVariables>(ProductInventoryItemRecordsDocument, options);
      }
export function useProductInventoryItemRecordsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProductInventoryItemRecordsQuery, ProductInventoryItemRecordsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProductInventoryItemRecordsQuery, ProductInventoryItemRecordsQueryVariables>(ProductInventoryItemRecordsDocument, options);
        }
export type ProductInventoryItemRecordsQueryHookResult = ReturnType<typeof useProductInventoryItemRecordsQuery>;
export type ProductInventoryItemRecordsLazyQueryHookResult = ReturnType<typeof useProductInventoryItemRecordsLazyQuery>;
export type ProductInventoryItemRecordsQueryResult = Apollo.QueryResult<ProductInventoryItemRecordsQuery, ProductInventoryItemRecordsQueryVariables>;
export const ProductInventoryItemRecordsByEventIdDocument = gql`
    query productInventoryItemRecordsByEventId($id: ID!, $pagination: PaginationArg, $sort: [String] = [], $businessLocationId: Int) {
  invtItmRecords(
    filters: {productInventoryItemEvent: {id: {eq: $id}}}
    pagination: $pagination
    sort: $sort
  ) {
    data {
      ...ProductInventoryItemRecord
    }
    meta {
      ...Meta
    }
  }
}
    ${ProductInventoryItemRecordFragmentDoc}
${ProductInventoryItemRecordMinFragmentDoc}
${FileMinFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useProductInventoryItemRecordsByEventIdQuery(baseOptions: Apollo.QueryHookOptions<ProductInventoryItemRecordsByEventIdQuery, ProductInventoryItemRecordsByEventIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProductInventoryItemRecordsByEventIdQuery, ProductInventoryItemRecordsByEventIdQueryVariables>(ProductInventoryItemRecordsByEventIdDocument, options);
      }
export function useProductInventoryItemRecordsByEventIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProductInventoryItemRecordsByEventIdQuery, ProductInventoryItemRecordsByEventIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProductInventoryItemRecordsByEventIdQuery, ProductInventoryItemRecordsByEventIdQueryVariables>(ProductInventoryItemRecordsByEventIdDocument, options);
        }
export type ProductInventoryItemRecordsByEventIdQueryHookResult = ReturnType<typeof useProductInventoryItemRecordsByEventIdQuery>;
export type ProductInventoryItemRecordsByEventIdLazyQueryHookResult = ReturnType<typeof useProductInventoryItemRecordsByEventIdLazyQuery>;
export type ProductInventoryItemRecordsByEventIdQueryResult = Apollo.QueryResult<ProductInventoryItemRecordsByEventIdQuery, ProductInventoryItemRecordsByEventIdQueryVariables>;
export const ProductInventoryItemRecordsByItemIdDocument = gql`
    query productInventoryItemRecordsByItemId($id: ID!, $pagination: PaginationArg, $sort: [String] = [], $businessLocationId: Int) {
  invtItmRecords(
    filters: {productInventoryItem: {id: {eq: $id}}}
    pagination: $pagination
    sort: $sort
  ) {
    data {
      ...ProductInventoryItemRecord
    }
    meta {
      ...Meta
    }
  }
}
    ${ProductInventoryItemRecordFragmentDoc}
${ProductInventoryItemRecordMinFragmentDoc}
${FileMinFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useProductInventoryItemRecordsByItemIdQuery(baseOptions: Apollo.QueryHookOptions<ProductInventoryItemRecordsByItemIdQuery, ProductInventoryItemRecordsByItemIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProductInventoryItemRecordsByItemIdQuery, ProductInventoryItemRecordsByItemIdQueryVariables>(ProductInventoryItemRecordsByItemIdDocument, options);
      }
export function useProductInventoryItemRecordsByItemIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProductInventoryItemRecordsByItemIdQuery, ProductInventoryItemRecordsByItemIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProductInventoryItemRecordsByItemIdQuery, ProductInventoryItemRecordsByItemIdQueryVariables>(ProductInventoryItemRecordsByItemIdDocument, options);
        }
export type ProductInventoryItemRecordsByItemIdQueryHookResult = ReturnType<typeof useProductInventoryItemRecordsByItemIdQuery>;
export type ProductInventoryItemRecordsByItemIdLazyQueryHookResult = ReturnType<typeof useProductInventoryItemRecordsByItemIdLazyQuery>;
export type ProductInventoryItemRecordsByItemIdQueryResult = Apollo.QueryResult<ProductInventoryItemRecordsByItemIdQuery, ProductInventoryItemRecordsByItemIdQueryVariables>;
export const ProductInventoryItemsCompactDocument = gql`
    query productInventoryItemsCompact($filters: ProductInventoryItemFiltersInput, $pagination: PaginationArg = {}, $sort: [String] = []) {
  productInventoryItems(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...ProductInventoryItemCompact
    }
  }
}
    ${ProductInventoryItemCompactFragmentDoc}`;
export function useProductInventoryItemsCompactQuery(baseOptions?: Apollo.QueryHookOptions<ProductInventoryItemsCompactQuery, ProductInventoryItemsCompactQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProductInventoryItemsCompactQuery, ProductInventoryItemsCompactQueryVariables>(ProductInventoryItemsCompactDocument, options);
      }
export function useProductInventoryItemsCompactLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProductInventoryItemsCompactQuery, ProductInventoryItemsCompactQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProductInventoryItemsCompactQuery, ProductInventoryItemsCompactQueryVariables>(ProductInventoryItemsCompactDocument, options);
        }
export type ProductInventoryItemsCompactQueryHookResult = ReturnType<typeof useProductInventoryItemsCompactQuery>;
export type ProductInventoryItemsCompactLazyQueryHookResult = ReturnType<typeof useProductInventoryItemsCompactLazyQuery>;
export type ProductInventoryItemsCompactQueryResult = Apollo.QueryResult<ProductInventoryItemsCompactQuery, ProductInventoryItemsCompactQueryVariables>;
export const ProductInventoryItemsPosDocument = gql`
    query productInventoryItemsPos($filters: ProductInventoryItemFiltersInput, $pagination: PaginationArg = {}, $sort: [String] = []) {
  productInventoryItems(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...ProductInventoryItemPos
    }
    meta {
      ...Meta
    }
  }
}
    ${ProductInventoryItemPosFragmentDoc}
${FileMinFragmentDoc}
${RentableDataFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useProductInventoryItemsPosQuery(baseOptions?: Apollo.QueryHookOptions<ProductInventoryItemsPosQuery, ProductInventoryItemsPosQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProductInventoryItemsPosQuery, ProductInventoryItemsPosQueryVariables>(ProductInventoryItemsPosDocument, options);
      }
export function useProductInventoryItemsPosLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProductInventoryItemsPosQuery, ProductInventoryItemsPosQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProductInventoryItemsPosQuery, ProductInventoryItemsPosQueryVariables>(ProductInventoryItemsPosDocument, options);
        }
export type ProductInventoryItemsPosQueryHookResult = ReturnType<typeof useProductInventoryItemsPosQuery>;
export type ProductInventoryItemsPosLazyQueryHookResult = ReturnType<typeof useProductInventoryItemsPosLazyQuery>;
export type ProductInventoryItemsPosQueryResult = Apollo.QueryResult<ProductInventoryItemsPosQuery, ProductInventoryItemsPosQueryVariables>;
export const ProductInventoryItemsSelectDocument = gql`
    query productInventoryItemsSelect($filters: ProductInventoryItemFiltersInput, $pagination: PaginationArg = {}, $sort: [String] = []) {
  productInventoryItems(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...ProductInventoryItemSelect
    }
  }
}
    ${ProductInventoryItemSelectFragmentDoc}
${FileMinFragmentDoc}`;
export function useProductInventoryItemsSelectQuery(baseOptions?: Apollo.QueryHookOptions<ProductInventoryItemsSelectQuery, ProductInventoryItemsSelectQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProductInventoryItemsSelectQuery, ProductInventoryItemsSelectQueryVariables>(ProductInventoryItemsSelectDocument, options);
      }
export function useProductInventoryItemsSelectLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProductInventoryItemsSelectQuery, ProductInventoryItemsSelectQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProductInventoryItemsSelectQuery, ProductInventoryItemsSelectQueryVariables>(ProductInventoryItemsSelectDocument, options);
        }
export type ProductInventoryItemsSelectQueryHookResult = ReturnType<typeof useProductInventoryItemsSelectQuery>;
export type ProductInventoryItemsSelectLazyQueryHookResult = ReturnType<typeof useProductInventoryItemsSelectLazyQuery>;
export type ProductInventoryItemsSelectQueryResult = Apollo.QueryResult<ProductInventoryItemsSelectQuery, ProductInventoryItemsSelectQueryVariables>;
export const ProductTypesDocument = gql`
    query productTypes($filters: ProductTypeFiltersInput, $pagination: PaginationArg = {}, $sort: [String] = []) {
  productTypes(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...ProductType
    }
    meta {
      ...Meta
    }
  }
}
    ${ProductTypeFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useProductTypesQuery(baseOptions?: Apollo.QueryHookOptions<ProductTypesQuery, ProductTypesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProductTypesQuery, ProductTypesQueryVariables>(ProductTypesDocument, options);
      }
export function useProductTypesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProductTypesQuery, ProductTypesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProductTypesQuery, ProductTypesQueryVariables>(ProductTypesDocument, options);
        }
export type ProductTypesQueryHookResult = ReturnType<typeof useProductTypesQuery>;
export type ProductTypesLazyQueryHookResult = ReturnType<typeof useProductTypesLazyQuery>;
export type ProductTypesQueryResult = Apollo.QueryResult<ProductTypesQuery, ProductTypesQueryVariables>;
export const ProductTypesWithItemCategoriesDocument = gql`
    query productTypesWithItemCategories($filters: ProductTypeFiltersInput, $pagination: PaginationArg = {}, $sort: [String] = []) {
  productTypes(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...ProductTypeWithItemCategory
    }
  }
}
    ${ProductTypeWithItemCategoryFragmentDoc}`;
export function useProductTypesWithItemCategoriesQuery(baseOptions?: Apollo.QueryHookOptions<ProductTypesWithItemCategoriesQuery, ProductTypesWithItemCategoriesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProductTypesWithItemCategoriesQuery, ProductTypesWithItemCategoriesQueryVariables>(ProductTypesWithItemCategoriesDocument, options);
      }
export function useProductTypesWithItemCategoriesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProductTypesWithItemCategoriesQuery, ProductTypesWithItemCategoriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProductTypesWithItemCategoriesQuery, ProductTypesWithItemCategoriesQueryVariables>(ProductTypesWithItemCategoriesDocument, options);
        }
export type ProductTypesWithItemCategoriesQueryHookResult = ReturnType<typeof useProductTypesWithItemCategoriesQuery>;
export type ProductTypesWithItemCategoriesLazyQueryHookResult = ReturnType<typeof useProductTypesWithItemCategoriesLazyQuery>;
export type ProductTypesWithItemCategoriesQueryResult = Apollo.QueryResult<ProductTypesWithItemCategoriesQuery, ProductTypesWithItemCategoriesQueryVariables>;
export const ProductsAppraisalDocument = gql`
    query productsAppraisal($filters: ProductFiltersInput, $pagination: PaginationArg = {}, $sort: [String] = []) {
  products(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...ProductAppraisal
    }
  }
}
    ${ProductAppraisalFragmentDoc}
${FileFragmentDoc}`;
export function useProductsAppraisalQuery(baseOptions?: Apollo.QueryHookOptions<ProductsAppraisalQuery, ProductsAppraisalQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProductsAppraisalQuery, ProductsAppraisalQueryVariables>(ProductsAppraisalDocument, options);
      }
export function useProductsAppraisalLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProductsAppraisalQuery, ProductsAppraisalQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProductsAppraisalQuery, ProductsAppraisalQueryVariables>(ProductsAppraisalDocument, options);
        }
export type ProductsAppraisalQueryHookResult = ReturnType<typeof useProductsAppraisalQuery>;
export type ProductsAppraisalLazyQueryHookResult = ReturnType<typeof useProductsAppraisalLazyQuery>;
export type ProductsAppraisalQueryResult = Apollo.QueryResult<ProductsAppraisalQuery, ProductsAppraisalQueryVariables>;
export const ProductsCsvReportDocument = gql`
    query productsCsvReport($filters: ProductFiltersInput, $sort: [String] = [], $businessLocationId: Int, $sublocationId: Int) {
  products(filters: $filters, pagination: {limit: -1}, sort: $sort) {
    data {
      ...ProductReport
    }
    meta {
      ...Meta
    }
  }
}
    ${ProductReportFragmentDoc}
${FileMinFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useProductsCsvReportQuery(baseOptions?: Apollo.QueryHookOptions<ProductsCsvReportQuery, ProductsCsvReportQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProductsCsvReportQuery, ProductsCsvReportQueryVariables>(ProductsCsvReportDocument, options);
      }
export function useProductsCsvReportLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProductsCsvReportQuery, ProductsCsvReportQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProductsCsvReportQuery, ProductsCsvReportQueryVariables>(ProductsCsvReportDocument, options);
        }
export type ProductsCsvReportQueryHookResult = ReturnType<typeof useProductsCsvReportQuery>;
export type ProductsCsvReportLazyQueryHookResult = ReturnType<typeof useProductsCsvReportLazyQuery>;
export type ProductsCsvReportQueryResult = Apollo.QueryResult<ProductsCsvReportQuery, ProductsCsvReportQueryVariables>;
export const ProductsCostTrackerDocument = gql`
    query productsCostTracker($filters: ProductFiltersInput, $pagination: PaginationArg = {}, $sort: [String] = []) {
  products(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...ProductCostTracker
    }
  }
}
    ${ProductCostTrackerFragmentDoc}
${ProductBrandFragmentDoc}`;
export function useProductsCostTrackerQuery(baseOptions?: Apollo.QueryHookOptions<ProductsCostTrackerQuery, ProductsCostTrackerQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProductsCostTrackerQuery, ProductsCostTrackerQueryVariables>(ProductsCostTrackerDocument, options);
      }
export function useProductsCostTrackerLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProductsCostTrackerQuery, ProductsCostTrackerQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProductsCostTrackerQuery, ProductsCostTrackerQueryVariables>(ProductsCostTrackerDocument, options);
        }
export type ProductsCostTrackerQueryHookResult = ReturnType<typeof useProductsCostTrackerQuery>;
export type ProductsCostTrackerLazyQueryHookResult = ReturnType<typeof useProductsCostTrackerLazyQuery>;
export type ProductsCostTrackerQueryResult = Apollo.QueryResult<ProductsCostTrackerQuery, ProductsCostTrackerQueryVariables>;
export const ProductsInventoryItemHistoryNumbersDocument = gql`
    query productsInventoryItemHistoryNumbers($id: ID!) {
  productsInventoryItemHistoryNumbers(id: $id) {
    averageCost
    owned
    memo
    laidAway
    purchase
  }
}
    `;
export function useProductsInventoryItemHistoryNumbersQuery(baseOptions: Apollo.QueryHookOptions<ProductsInventoryItemHistoryNumbersQuery, ProductsInventoryItemHistoryNumbersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProductsInventoryItemHistoryNumbersQuery, ProductsInventoryItemHistoryNumbersQueryVariables>(ProductsInventoryItemHistoryNumbersDocument, options);
      }
export function useProductsInventoryItemHistoryNumbersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProductsInventoryItemHistoryNumbersQuery, ProductsInventoryItemHistoryNumbersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProductsInventoryItemHistoryNumbersQuery, ProductsInventoryItemHistoryNumbersQueryVariables>(ProductsInventoryItemHistoryNumbersDocument, options);
        }
export type ProductsInventoryItemHistoryNumbersQueryHookResult = ReturnType<typeof useProductsInventoryItemHistoryNumbersQuery>;
export type ProductsInventoryItemHistoryNumbersLazyQueryHookResult = ReturnType<typeof useProductsInventoryItemHistoryNumbersLazyQuery>;
export type ProductsInventoryItemHistoryNumbersQueryResult = Apollo.QueryResult<ProductsInventoryItemHistoryNumbersQuery, ProductsInventoryItemHistoryNumbersQueryVariables>;
export const ProductsInventoryItemQuantityRangeDocument = gql`
    query productsInventoryItemQuantityRange($businessLocationId: ID!) {
  productsInventoryItemQuantityRange(businessLocationId: $businessLocationId) {
    minQuantity
    maxQuantity
  }
}
    `;
export function useProductsInventoryItemQuantityRangeQuery(baseOptions: Apollo.QueryHookOptions<ProductsInventoryItemQuantityRangeQuery, ProductsInventoryItemQuantityRangeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProductsInventoryItemQuantityRangeQuery, ProductsInventoryItemQuantityRangeQueryVariables>(ProductsInventoryItemQuantityRangeDocument, options);
      }
export function useProductsInventoryItemQuantityRangeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProductsInventoryItemQuantityRangeQuery, ProductsInventoryItemQuantityRangeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProductsInventoryItemQuantityRangeQuery, ProductsInventoryItemQuantityRangeQueryVariables>(ProductsInventoryItemQuantityRangeDocument, options);
        }
export type ProductsInventoryItemQuantityRangeQueryHookResult = ReturnType<typeof useProductsInventoryItemQuantityRangeQuery>;
export type ProductsInventoryItemQuantityRangeLazyQueryHookResult = ReturnType<typeof useProductsInventoryItemQuantityRangeLazyQuery>;
export type ProductsInventoryItemQuantityRangeQueryResult = Apollo.QueryResult<ProductsInventoryItemQuantityRangeQuery, ProductsInventoryItemQuantityRangeQueryVariables>;
export const ProductsPriceRangeDocument = gql`
    query productsPriceRange {
  productsPriceRange {
    minPrice
    maxPrice
  }
}
    `;
export function useProductsPriceRangeQuery(baseOptions?: Apollo.QueryHookOptions<ProductsPriceRangeQuery, ProductsPriceRangeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProductsPriceRangeQuery, ProductsPriceRangeQueryVariables>(ProductsPriceRangeDocument, options);
      }
export function useProductsPriceRangeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProductsPriceRangeQuery, ProductsPriceRangeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProductsPriceRangeQuery, ProductsPriceRangeQueryVariables>(ProductsPriceRangeDocument, options);
        }
export type ProductsPriceRangeQueryHookResult = ReturnType<typeof useProductsPriceRangeQuery>;
export type ProductsPriceRangeLazyQueryHookResult = ReturnType<typeof useProductsPriceRangeLazyQuery>;
export type ProductsPriceRangeQueryResult = Apollo.QueryResult<ProductsPriceRangeQuery, ProductsPriceRangeQueryVariables>;
export const ProductsPrintDocument = gql`
    query productsPrint($filters: ProductFiltersInput, $pagination: PaginationArg = {}, $sort: [String] = []) {
  products(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...ProductPrint
    }
  }
}
    ${ProductPrintFragmentDoc}`;
export function useProductsPrintQuery(baseOptions?: Apollo.QueryHookOptions<ProductsPrintQuery, ProductsPrintQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProductsPrintQuery, ProductsPrintQueryVariables>(ProductsPrintDocument, options);
      }
export function useProductsPrintLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProductsPrintQuery, ProductsPrintQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProductsPrintQuery, ProductsPrintQueryVariables>(ProductsPrintDocument, options);
        }
export type ProductsPrintQueryHookResult = ReturnType<typeof useProductsPrintQuery>;
export type ProductsPrintLazyQueryHookResult = ReturnType<typeof useProductsPrintLazyQuery>;
export type ProductsPrintQueryResult = Apollo.QueryResult<ProductsPrintQuery, ProductsPrintQueryVariables>;
export const ProductsReportDocument = gql`
    query productsReport($filters: ProductFiltersInput, $pagination: PaginationArg = {}, $sort: [String] = [], $businessLocationId: Int, $sublocationId: Int) {
  products(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...ProductReport
    }
    meta {
      ...Meta
    }
  }
}
    ${ProductReportFragmentDoc}
${FileMinFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useProductsReportQuery(baseOptions?: Apollo.QueryHookOptions<ProductsReportQuery, ProductsReportQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProductsReportQuery, ProductsReportQueryVariables>(ProductsReportDocument, options);
      }
export function useProductsReportLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProductsReportQuery, ProductsReportQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProductsReportQuery, ProductsReportQueryVariables>(ProductsReportDocument, options);
        }
export type ProductsReportQueryHookResult = ReturnType<typeof useProductsReportQuery>;
export type ProductsReportLazyQueryHookResult = ReturnType<typeof useProductsReportLazyQuery>;
export type ProductsReportQueryResult = Apollo.QueryResult<ProductsReportQuery, ProductsReportQueryVariables>;
export const ProductsSelectDocument = gql`
    query productsSelect($filters: ProductFiltersInput, $pagination: PaginationArg = {}, $sort: [String] = []) {
  products(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...ProductSelect
    }
    meta {
      ...Meta
    }
  }
}
    ${ProductSelectFragmentDoc}
${FileMinFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useProductsSelectQuery(baseOptions?: Apollo.QueryHookOptions<ProductsSelectQuery, ProductsSelectQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProductsSelectQuery, ProductsSelectQueryVariables>(ProductsSelectDocument, options);
      }
export function useProductsSelectLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProductsSelectQuery, ProductsSelectQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProductsSelectQuery, ProductsSelectQueryVariables>(ProductsSelectDocument, options);
        }
export type ProductsSelectQueryHookResult = ReturnType<typeof useProductsSelectQuery>;
export type ProductsSelectLazyQueryHookResult = ReturnType<typeof useProductsSelectLazyQuery>;
export type ProductsSelectQueryResult = Apollo.QueryResult<ProductsSelectQuery, ProductsSelectQueryVariables>;
export const ProductsWithLocationAndPriceDataDocument = gql`
    query productsWithLocationAndPriceData($filters: ProductFiltersInput, $pagination: PaginationArg = {}, $sort: [String] = [], $businessLocationId: Int) {
  products(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...ProductWithLocationAndPriceData
    }
    meta {
      ...Meta
    }
  }
}
    ${ProductWithLocationAndPriceDataFragmentDoc}
${FileMinFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useProductsWithLocationAndPriceDataQuery(baseOptions?: Apollo.QueryHookOptions<ProductsWithLocationAndPriceDataQuery, ProductsWithLocationAndPriceDataQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProductsWithLocationAndPriceDataQuery, ProductsWithLocationAndPriceDataQueryVariables>(ProductsWithLocationAndPriceDataDocument, options);
      }
export function useProductsWithLocationAndPriceDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProductsWithLocationAndPriceDataQuery, ProductsWithLocationAndPriceDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProductsWithLocationAndPriceDataQuery, ProductsWithLocationAndPriceDataQueryVariables>(ProductsWithLocationAndPriceDataDocument, options);
        }
export type ProductsWithLocationAndPriceDataQueryHookResult = ReturnType<typeof useProductsWithLocationAndPriceDataQuery>;
export type ProductsWithLocationAndPriceDataLazyQueryHookResult = ReturnType<typeof useProductsWithLocationAndPriceDataLazyQuery>;
export type ProductsWithLocationAndPriceDataQueryResult = Apollo.QueryResult<ProductsWithLocationAndPriceDataQuery, ProductsWithLocationAndPriceDataQueryVariables>;
export const ProductsWithLocationDataDocument = gql`
    query productsWithLocationData($filters: ProductFiltersInput, $pagination: PaginationArg = {}, $sort: [String] = [], $businessLocationId: Int) {
  products(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...ProductWithLocationData
    }
    meta {
      ...Meta
    }
  }
}
    ${ProductWithLocationDataFragmentDoc}
${FileMinFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useProductsWithLocationDataQuery(baseOptions?: Apollo.QueryHookOptions<ProductsWithLocationDataQuery, ProductsWithLocationDataQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProductsWithLocationDataQuery, ProductsWithLocationDataQueryVariables>(ProductsWithLocationDataDocument, options);
      }
export function useProductsWithLocationDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProductsWithLocationDataQuery, ProductsWithLocationDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProductsWithLocationDataQuery, ProductsWithLocationDataQueryVariables>(ProductsWithLocationDataDocument, options);
        }
export type ProductsWithLocationDataQueryHookResult = ReturnType<typeof useProductsWithLocationDataQuery>;
export type ProductsWithLocationDataLazyQueryHookResult = ReturnType<typeof useProductsWithLocationDataLazyQuery>;
export type ProductsWithLocationDataQueryResult = Apollo.QueryResult<ProductsWithLocationDataQuery, ProductsWithLocationDataQueryVariables>;
export const ProductsWithSoldRevenueDocument = gql`
    query productsWithSoldRevenue($filters: ProductFiltersInput, $pagination: PaginationArg = {}, $sort: [String] = [], $startDate: DateTime!, $endDate: DateTime!, $businessLocationId: Int) {
  products(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...ProductWithSoldRevenue
    }
    meta {
      ...Meta
    }
  }
}
    ${ProductWithSoldRevenueFragmentDoc}
${FileMinFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useProductsWithSoldRevenueQuery(baseOptions: Apollo.QueryHookOptions<ProductsWithSoldRevenueQuery, ProductsWithSoldRevenueQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProductsWithSoldRevenueQuery, ProductsWithSoldRevenueQueryVariables>(ProductsWithSoldRevenueDocument, options);
      }
export function useProductsWithSoldRevenueLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProductsWithSoldRevenueQuery, ProductsWithSoldRevenueQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProductsWithSoldRevenueQuery, ProductsWithSoldRevenueQueryVariables>(ProductsWithSoldRevenueDocument, options);
        }
export type ProductsWithSoldRevenueQueryHookResult = ReturnType<typeof useProductsWithSoldRevenueQuery>;
export type ProductsWithSoldRevenueLazyQueryHookResult = ReturnType<typeof useProductsWithSoldRevenueLazyQuery>;
export type ProductsWithSoldRevenueQueryResult = Apollo.QueryResult<ProductsWithSoldRevenueQuery, ProductsWithSoldRevenueQueryVariables>;
export const SerializesDocument = gql`
    query serializes($filters: InventorySerializeFiltersInput, $pagination: PaginationArg = {}, $sort: [String] = []) {
  inventorySerializes(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...Serialize
    }
    meta {
      ...Meta
    }
  }
}
    ${SerializeFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useSerializesQuery(baseOptions?: Apollo.QueryHookOptions<SerializesQuery, SerializesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SerializesQuery, SerializesQueryVariables>(SerializesDocument, options);
      }
export function useSerializesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SerializesQuery, SerializesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SerializesQuery, SerializesQueryVariables>(SerializesDocument, options);
        }
export type SerializesQueryHookResult = ReturnType<typeof useSerializesQuery>;
export type SerializesLazyQueryHookResult = ReturnType<typeof useSerializesLazyQuery>;
export type SerializesQueryResult = Apollo.QueryResult<SerializesQuery, SerializesQueryVariables>;
export const SerializesWithoutProductDocument = gql`
    query serializesWithoutProduct($filters: InventorySerializeFiltersInput, $pagination: PaginationArg = {}, $sort: [String] = []) {
  inventorySerializes(
    filters: {productInventoryItem: {id: {null: true}}, sellingProductOrderItem: {id: {null: true}}, and: [$filters]}
    pagination: $pagination
    sort: $sort
  ) {
    data {
      ...Serialize
    }
    meta {
      ...Meta
    }
  }
}
    ${SerializeFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useSerializesWithoutProductQuery(baseOptions?: Apollo.QueryHookOptions<SerializesWithoutProductQuery, SerializesWithoutProductQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SerializesWithoutProductQuery, SerializesWithoutProductQueryVariables>(SerializesWithoutProductDocument, options);
      }
export function useSerializesWithoutProductLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SerializesWithoutProductQuery, SerializesWithoutProductQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SerializesWithoutProductQuery, SerializesWithoutProductQueryVariables>(SerializesWithoutProductDocument, options);
        }
export type SerializesWithoutProductQueryHookResult = ReturnType<typeof useSerializesWithoutProductQuery>;
export type SerializesWithoutProductLazyQueryHookResult = ReturnType<typeof useSerializesWithoutProductLazyQuery>;
export type SerializesWithoutProductQueryResult = Apollo.QueryResult<SerializesWithoutProductQuery, SerializesWithoutProductQueryVariables>;
export const WebsiteProductsTableDocument = gql`
    query websiteProductsTable($filters: ProductFiltersInput, $pagination: PaginationArg = {}, $sort: [String] = []) {
  products(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...WebsiteProductTable
    }
    meta {
      ...Meta
    }
  }
}
    ${WebsiteProductTableFragmentDoc}
${FileMinFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useWebsiteProductsTableQuery(baseOptions?: Apollo.QueryHookOptions<WebsiteProductsTableQuery, WebsiteProductsTableQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<WebsiteProductsTableQuery, WebsiteProductsTableQueryVariables>(WebsiteProductsTableDocument, options);
      }
export function useWebsiteProductsTableLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WebsiteProductsTableQuery, WebsiteProductsTableQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<WebsiteProductsTableQuery, WebsiteProductsTableQueryVariables>(WebsiteProductsTableDocument, options);
        }
export type WebsiteProductsTableQueryHookResult = ReturnType<typeof useWebsiteProductsTableQuery>;
export type WebsiteProductsTableLazyQueryHookResult = ReturnType<typeof useWebsiteProductsTableLazyQuery>;
export type WebsiteProductsTableQueryResult = Apollo.QueryResult<WebsiteProductsTableQuery, WebsiteProductsTableQueryVariables>;
export const CreateProductAttributeDocument = gql`
    mutation createProductAttribute($input: ProductAttributeInput!) {
  createProductAttribute(data: $input) {
    data {
      ...ProductAttributeMin
    }
  }
}
    ${ProductAttributeMinFragmentDoc}`;
export type CreateProductAttributeMutationFn = Apollo.MutationFunction<CreateProductAttributeMutation, CreateProductAttributeMutationVariables>;
export function useCreateProductAttributeMutation(baseOptions?: Apollo.MutationHookOptions<CreateProductAttributeMutation, CreateProductAttributeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateProductAttributeMutation, CreateProductAttributeMutationVariables>(CreateProductAttributeDocument, options);
      }
export type CreateProductAttributeMutationHookResult = ReturnType<typeof useCreateProductAttributeMutation>;
export type CreateProductAttributeMutationResult = Apollo.MutationResult<CreateProductAttributeMutation>;
export const CreateProductAttributeOptionDocument = gql`
    mutation createProductAttributeOption($input: ProductAttributeOptionInput!) {
  createProductAttributeOption(data: $input) {
    data {
      ...ProductAttributeOption
    }
  }
}
    ${ProductAttributeOptionFragmentDoc}
${ProductAttributeOptionMinFragmentDoc}
${ProductAttributeMinFragmentDoc}`;
export type CreateProductAttributeOptionMutationFn = Apollo.MutationFunction<CreateProductAttributeOptionMutation, CreateProductAttributeOptionMutationVariables>;
export function useCreateProductAttributeOptionMutation(baseOptions?: Apollo.MutationHookOptions<CreateProductAttributeOptionMutation, CreateProductAttributeOptionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateProductAttributeOptionMutation, CreateProductAttributeOptionMutationVariables>(CreateProductAttributeOptionDocument, options);
      }
export type CreateProductAttributeOptionMutationHookResult = ReturnType<typeof useCreateProductAttributeOptionMutation>;
export type CreateProductAttributeOptionMutationResult = Apollo.MutationResult<CreateProductAttributeOptionMutation>;
export const UpdateProductAttributeDocument = gql`
    mutation updateProductAttribute($id: ID!, $input: ProductAttributeInput!) {
  updateProductAttribute(id: $id, data: $input) {
    data {
      ...ProductAttributeMin
    }
  }
}
    ${ProductAttributeMinFragmentDoc}`;
export type UpdateProductAttributeMutationFn = Apollo.MutationFunction<UpdateProductAttributeMutation, UpdateProductAttributeMutationVariables>;
export function useUpdateProductAttributeMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProductAttributeMutation, UpdateProductAttributeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProductAttributeMutation, UpdateProductAttributeMutationVariables>(UpdateProductAttributeDocument, options);
      }
export type UpdateProductAttributeMutationHookResult = ReturnType<typeof useUpdateProductAttributeMutation>;
export type UpdateProductAttributeMutationResult = Apollo.MutationResult<UpdateProductAttributeMutation>;
export const UpdateProductAttributeOptionDocument = gql`
    mutation updateProductAttributeOption($id: ID!, $input: ProductAttributeOptionInput!) {
  updateProductAttributeOption(id: $id, data: $input) {
    data {
      ...ProductAttributeOption
    }
  }
}
    ${ProductAttributeOptionFragmentDoc}
${ProductAttributeOptionMinFragmentDoc}
${ProductAttributeMinFragmentDoc}`;
export type UpdateProductAttributeOptionMutationFn = Apollo.MutationFunction<UpdateProductAttributeOptionMutation, UpdateProductAttributeOptionMutationVariables>;
export function useUpdateProductAttributeOptionMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProductAttributeOptionMutation, UpdateProductAttributeOptionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProductAttributeOptionMutation, UpdateProductAttributeOptionMutationVariables>(UpdateProductAttributeOptionDocument, options);
      }
export type UpdateProductAttributeOptionMutationHookResult = ReturnType<typeof useUpdateProductAttributeOptionMutation>;
export type UpdateProductAttributeOptionMutationResult = Apollo.MutationResult<UpdateProductAttributeOptionMutation>;
export const ProductAttributeOptionsDocument = gql`
    query productAttributeOptions($filters: ProductAttributeOptionFiltersInput, $sort: [String]) {
  productAttributeOptions(filters: $filters, pagination: {limit: -1}, sort: $sort) {
    data {
      ...ProductAttributeOption
    }
  }
}
    ${ProductAttributeOptionFragmentDoc}
${ProductAttributeOptionMinFragmentDoc}
${ProductAttributeMinFragmentDoc}`;
export function useProductAttributeOptionsQuery(baseOptions?: Apollo.QueryHookOptions<ProductAttributeOptionsQuery, ProductAttributeOptionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProductAttributeOptionsQuery, ProductAttributeOptionsQueryVariables>(ProductAttributeOptionsDocument, options);
      }
export function useProductAttributeOptionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProductAttributeOptionsQuery, ProductAttributeOptionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProductAttributeOptionsQuery, ProductAttributeOptionsQueryVariables>(ProductAttributeOptionsDocument, options);
        }
export type ProductAttributeOptionsQueryHookResult = ReturnType<typeof useProductAttributeOptionsQuery>;
export type ProductAttributeOptionsLazyQueryHookResult = ReturnType<typeof useProductAttributeOptionsLazyQuery>;
export type ProductAttributeOptionsQueryResult = Apollo.QueryResult<ProductAttributeOptionsQuery, ProductAttributeOptionsQueryVariables>;
export const ProductAttributesDocument = gql`
    query productAttributes($filters: ProductAttributeFiltersInput, $sort: [String]) {
  productAttributes(filters: $filters, pagination: {limit: -1}, sort: $sort) {
    data {
      ...ProductAttribute
    }
  }
}
    ${ProductAttributeFragmentDoc}
${ProductAttributeMinFragmentDoc}
${ProductAttributeOptionMinFragmentDoc}
${ProductTypeFragmentDoc}`;
export function useProductAttributesQuery(baseOptions?: Apollo.QueryHookOptions<ProductAttributesQuery, ProductAttributesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProductAttributesQuery, ProductAttributesQueryVariables>(ProductAttributesDocument, options);
      }
export function useProductAttributesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProductAttributesQuery, ProductAttributesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProductAttributesQuery, ProductAttributesQueryVariables>(ProductAttributesDocument, options);
        }
export type ProductAttributesQueryHookResult = ReturnType<typeof useProductAttributesQuery>;
export type ProductAttributesLazyQueryHookResult = ReturnType<typeof useProductAttributesLazyQuery>;
export type ProductAttributesQueryResult = Apollo.QueryResult<ProductAttributesQuery, ProductAttributesQueryVariables>;
export const CreateProductGroupDocument = gql`
    mutation createProductGroup($input: ProductGroupInput!) {
  createProductGroup(data: $input) {
    data {
      id
    }
  }
}
    `;
export type CreateProductGroupMutationFn = Apollo.MutationFunction<CreateProductGroupMutation, CreateProductGroupMutationVariables>;
export function useCreateProductGroupMutation(baseOptions?: Apollo.MutationHookOptions<CreateProductGroupMutation, CreateProductGroupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateProductGroupMutation, CreateProductGroupMutationVariables>(CreateProductGroupDocument, options);
      }
export type CreateProductGroupMutationHookResult = ReturnType<typeof useCreateProductGroupMutation>;
export type CreateProductGroupMutationResult = Apollo.MutationResult<CreateProductGroupMutation>;
export const CreateProductGroupItemDocument = gql`
    mutation createProductGroupItem($input: ProductGroupItemInput!) {
  createProductGroupItem(data: $input) {
    data {
      id
    }
  }
}
    `;
export type CreateProductGroupItemMutationFn = Apollo.MutationFunction<CreateProductGroupItemMutation, CreateProductGroupItemMutationVariables>;
export function useCreateProductGroupItemMutation(baseOptions?: Apollo.MutationHookOptions<CreateProductGroupItemMutation, CreateProductGroupItemMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateProductGroupItemMutation, CreateProductGroupItemMutationVariables>(CreateProductGroupItemDocument, options);
      }
export type CreateProductGroupItemMutationHookResult = ReturnType<typeof useCreateProductGroupItemMutation>;
export type CreateProductGroupItemMutationResult = Apollo.MutationResult<CreateProductGroupItemMutation>;
export const DeleteProductGroupItemDocument = gql`
    mutation deleteProductGroupItem($id: ID!) {
  deleteProductGroupItem(id: $id) {
    data {
      id
    }
  }
}
    `;
export type DeleteProductGroupItemMutationFn = Apollo.MutationFunction<DeleteProductGroupItemMutation, DeleteProductGroupItemMutationVariables>;
export function useDeleteProductGroupItemMutation(baseOptions?: Apollo.MutationHookOptions<DeleteProductGroupItemMutation, DeleteProductGroupItemMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteProductGroupItemMutation, DeleteProductGroupItemMutationVariables>(DeleteProductGroupItemDocument, options);
      }
export type DeleteProductGroupItemMutationHookResult = ReturnType<typeof useDeleteProductGroupItemMutation>;
export type DeleteProductGroupItemMutationResult = Apollo.MutationResult<DeleteProductGroupItemMutation>;
export const UpdateProductGroupDocument = gql`
    mutation updateProductGroup($id: ID!, $input: ProductGroupInput!) {
  updateProductGroup(id: $id, data: $input) {
    data {
      id
    }
  }
}
    `;
export type UpdateProductGroupMutationFn = Apollo.MutationFunction<UpdateProductGroupMutation, UpdateProductGroupMutationVariables>;
export function useUpdateProductGroupMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProductGroupMutation, UpdateProductGroupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProductGroupMutation, UpdateProductGroupMutationVariables>(UpdateProductGroupDocument, options);
      }
export type UpdateProductGroupMutationHookResult = ReturnType<typeof useUpdateProductGroupMutation>;
export type UpdateProductGroupMutationResult = Apollo.MutationResult<UpdateProductGroupMutation>;
export const UpdateProductGroupItemDocument = gql`
    mutation updateProductGroupItem($id: ID!, $input: ProductGroupItemInput!) {
  updateProductGroupItem(id: $id, data: $input) {
    data {
      id
    }
  }
}
    `;
export type UpdateProductGroupItemMutationFn = Apollo.MutationFunction<UpdateProductGroupItemMutation, UpdateProductGroupItemMutationVariables>;
export function useUpdateProductGroupItemMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProductGroupItemMutation, UpdateProductGroupItemMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProductGroupItemMutation, UpdateProductGroupItemMutationVariables>(UpdateProductGroupItemDocument, options);
      }
export type UpdateProductGroupItemMutationHookResult = ReturnType<typeof useUpdateProductGroupItemMutation>;
export type UpdateProductGroupItemMutationResult = Apollo.MutationResult<UpdateProductGroupItemMutation>;
export const InventoryProductGroupsTableDocument = gql`
    query inventoryProductGroupsTable($filters: ProductGroupFiltersInput, $pagination: PaginationArg, $sort: [String], $businessLocationId: Int) {
  productGroups(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...InventoryProductGroupTable
    }
    meta {
      ...Meta
    }
  }
}
    ${InventoryProductGroupTableFragmentDoc}
${ProductGroupAttributeFragmentDoc}
${ProductGroupAttributeMinFragmentDoc}
${ProductGroupAttributeOptionMinFragmentDoc}
${InventoryProductTableFragmentDoc}
${FileMinFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useInventoryProductGroupsTableQuery(baseOptions?: Apollo.QueryHookOptions<InventoryProductGroupsTableQuery, InventoryProductGroupsTableQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<InventoryProductGroupsTableQuery, InventoryProductGroupsTableQueryVariables>(InventoryProductGroupsTableDocument, options);
      }
export function useInventoryProductGroupsTableLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<InventoryProductGroupsTableQuery, InventoryProductGroupsTableQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<InventoryProductGroupsTableQuery, InventoryProductGroupsTableQueryVariables>(InventoryProductGroupsTableDocument, options);
        }
export type InventoryProductGroupsTableQueryHookResult = ReturnType<typeof useInventoryProductGroupsTableQuery>;
export type InventoryProductGroupsTableLazyQueryHookResult = ReturnType<typeof useInventoryProductGroupsTableLazyQuery>;
export type InventoryProductGroupsTableQueryResult = Apollo.QueryResult<InventoryProductGroupsTableQuery, InventoryProductGroupsTableQueryVariables>;
export const ProductGroupByUuidDocument = gql`
    query productGroupByUuid($uuid: String!) {
  productGroups(filters: {uuid: {eq: $uuid}}) {
    data {
      ...ProductGroup
    }
  }
}
    ${ProductGroupFragmentDoc}
${ProductGroupMinFragmentDoc}
${ProductGroupAttributeFragmentDoc}
${ProductGroupAttributeMinFragmentDoc}
${ProductGroupAttributeOptionMinFragmentDoc}
${ProductGroupItemFragmentDoc}
${ProductGroupAttributeOptionFragmentDoc}`;
export function useProductGroupByUuidQuery(baseOptions: Apollo.QueryHookOptions<ProductGroupByUuidQuery, ProductGroupByUuidQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProductGroupByUuidQuery, ProductGroupByUuidQueryVariables>(ProductGroupByUuidDocument, options);
      }
export function useProductGroupByUuidLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProductGroupByUuidQuery, ProductGroupByUuidQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProductGroupByUuidQuery, ProductGroupByUuidQueryVariables>(ProductGroupByUuidDocument, options);
        }
export type ProductGroupByUuidQueryHookResult = ReturnType<typeof useProductGroupByUuidQuery>;
export type ProductGroupByUuidLazyQueryHookResult = ReturnType<typeof useProductGroupByUuidLazyQuery>;
export type ProductGroupByUuidQueryResult = Apollo.QueryResult<ProductGroupByUuidQuery, ProductGroupByUuidQueryVariables>;
export const CreateProductGroupAttributeDocument = gql`
    mutation createProductGroupAttribute($input: ProductGroupAttributeInput!) {
  createProductGroupAttribute(data: $input) {
    data {
      id
    }
  }
}
    `;
export type CreateProductGroupAttributeMutationFn = Apollo.MutationFunction<CreateProductGroupAttributeMutation, CreateProductGroupAttributeMutationVariables>;
export function useCreateProductGroupAttributeMutation(baseOptions?: Apollo.MutationHookOptions<CreateProductGroupAttributeMutation, CreateProductGroupAttributeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateProductGroupAttributeMutation, CreateProductGroupAttributeMutationVariables>(CreateProductGroupAttributeDocument, options);
      }
export type CreateProductGroupAttributeMutationHookResult = ReturnType<typeof useCreateProductGroupAttributeMutation>;
export type CreateProductGroupAttributeMutationResult = Apollo.MutationResult<CreateProductGroupAttributeMutation>;
export const CreateProductGroupAttributeOptionDocument = gql`
    mutation createProductGroupAttributeOption($input: ProductGroupAttributeOptionInput!) {
  createProductGroupAttributeOption(data: $input) {
    data {
      id
    }
  }
}
    `;
export type CreateProductGroupAttributeOptionMutationFn = Apollo.MutationFunction<CreateProductGroupAttributeOptionMutation, CreateProductGroupAttributeOptionMutationVariables>;
export function useCreateProductGroupAttributeOptionMutation(baseOptions?: Apollo.MutationHookOptions<CreateProductGroupAttributeOptionMutation, CreateProductGroupAttributeOptionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateProductGroupAttributeOptionMutation, CreateProductGroupAttributeOptionMutationVariables>(CreateProductGroupAttributeOptionDocument, options);
      }
export type CreateProductGroupAttributeOptionMutationHookResult = ReturnType<typeof useCreateProductGroupAttributeOptionMutation>;
export type CreateProductGroupAttributeOptionMutationResult = Apollo.MutationResult<CreateProductGroupAttributeOptionMutation>;
export const DeleteProductGroupAttributeDocument = gql`
    mutation deleteProductGroupAttribute($id: ID!) {
  deleteProductGroupAttribute(id: $id) {
    data {
      id
    }
  }
}
    `;
export type DeleteProductGroupAttributeMutationFn = Apollo.MutationFunction<DeleteProductGroupAttributeMutation, DeleteProductGroupAttributeMutationVariables>;
export function useDeleteProductGroupAttributeMutation(baseOptions?: Apollo.MutationHookOptions<DeleteProductGroupAttributeMutation, DeleteProductGroupAttributeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteProductGroupAttributeMutation, DeleteProductGroupAttributeMutationVariables>(DeleteProductGroupAttributeDocument, options);
      }
export type DeleteProductGroupAttributeMutationHookResult = ReturnType<typeof useDeleteProductGroupAttributeMutation>;
export type DeleteProductGroupAttributeMutationResult = Apollo.MutationResult<DeleteProductGroupAttributeMutation>;
export const UpdateProductGroupAttributeDocument = gql`
    mutation updateProductGroupAttribute($id: ID!, $input: ProductGroupAttributeInput!) {
  updateProductGroupAttribute(id: $id, data: $input) {
    data {
      id
    }
  }
}
    `;
export type UpdateProductGroupAttributeMutationFn = Apollo.MutationFunction<UpdateProductGroupAttributeMutation, UpdateProductGroupAttributeMutationVariables>;
export function useUpdateProductGroupAttributeMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProductGroupAttributeMutation, UpdateProductGroupAttributeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProductGroupAttributeMutation, UpdateProductGroupAttributeMutationVariables>(UpdateProductGroupAttributeDocument, options);
      }
export type UpdateProductGroupAttributeMutationHookResult = ReturnType<typeof useUpdateProductGroupAttributeMutation>;
export type UpdateProductGroupAttributeMutationResult = Apollo.MutationResult<UpdateProductGroupAttributeMutation>;
export const UpdateProductGroupAttributeOptionDocument = gql`
    mutation updateProductGroupAttributeOption($id: ID!, $input: ProductGroupAttributeOptionInput!) {
  updateProductGroupAttributeOption(id: $id, data: $input) {
    data {
      id
    }
  }
}
    `;
export type UpdateProductGroupAttributeOptionMutationFn = Apollo.MutationFunction<UpdateProductGroupAttributeOptionMutation, UpdateProductGroupAttributeOptionMutationVariables>;
export function useUpdateProductGroupAttributeOptionMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProductGroupAttributeOptionMutation, UpdateProductGroupAttributeOptionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProductGroupAttributeOptionMutation, UpdateProductGroupAttributeOptionMutationVariables>(UpdateProductGroupAttributeOptionDocument, options);
      }
export type UpdateProductGroupAttributeOptionMutationHookResult = ReturnType<typeof useUpdateProductGroupAttributeOptionMutation>;
export type UpdateProductGroupAttributeOptionMutationResult = Apollo.MutationResult<UpdateProductGroupAttributeOptionMutation>;
export const ProductGroupAttributeDocument = gql`
    query productGroupAttribute($id: ID!) {
  productGroupAttribute(id: $id) {
    data {
      ...ProductGroupAttribute
    }
  }
}
    ${ProductGroupAttributeFragmentDoc}
${ProductGroupAttributeMinFragmentDoc}
${ProductGroupAttributeOptionMinFragmentDoc}`;
export function useProductGroupAttributeQuery(baseOptions: Apollo.QueryHookOptions<ProductGroupAttributeQuery, ProductGroupAttributeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProductGroupAttributeQuery, ProductGroupAttributeQueryVariables>(ProductGroupAttributeDocument, options);
      }
export function useProductGroupAttributeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProductGroupAttributeQuery, ProductGroupAttributeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProductGroupAttributeQuery, ProductGroupAttributeQueryVariables>(ProductGroupAttributeDocument, options);
        }
export type ProductGroupAttributeQueryHookResult = ReturnType<typeof useProductGroupAttributeQuery>;
export type ProductGroupAttributeLazyQueryHookResult = ReturnType<typeof useProductGroupAttributeLazyQuery>;
export type ProductGroupAttributeQueryResult = Apollo.QueryResult<ProductGroupAttributeQuery, ProductGroupAttributeQueryVariables>;
export const ProductGroupsAttributeOptionsDocument = gql`
    query productGroupsAttributeOptions($filters: ProductGroupAttributeOptionFiltersInput, $pagination: PaginationArg, $sort: [String]) {
  productGroupAttributeOptions(
    filters: $filters
    pagination: $pagination
    sort: $sort
  ) {
    data {
      ...ProductGroupAttributeOption
    }
    meta {
      ...Meta
    }
  }
}
    ${ProductGroupAttributeOptionFragmentDoc}
${ProductGroupAttributeOptionMinFragmentDoc}
${ProductGroupAttributeMinFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useProductGroupsAttributeOptionsQuery(baseOptions?: Apollo.QueryHookOptions<ProductGroupsAttributeOptionsQuery, ProductGroupsAttributeOptionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProductGroupsAttributeOptionsQuery, ProductGroupsAttributeOptionsQueryVariables>(ProductGroupsAttributeOptionsDocument, options);
      }
export function useProductGroupsAttributeOptionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProductGroupsAttributeOptionsQuery, ProductGroupsAttributeOptionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProductGroupsAttributeOptionsQuery, ProductGroupsAttributeOptionsQueryVariables>(ProductGroupsAttributeOptionsDocument, options);
        }
export type ProductGroupsAttributeOptionsQueryHookResult = ReturnType<typeof useProductGroupsAttributeOptionsQuery>;
export type ProductGroupsAttributeOptionsLazyQueryHookResult = ReturnType<typeof useProductGroupsAttributeOptionsLazyQuery>;
export type ProductGroupsAttributeOptionsQueryResult = Apollo.QueryResult<ProductGroupsAttributeOptionsQuery, ProductGroupsAttributeOptionsQueryVariables>;
export const ProductGroupsAttributesDocument = gql`
    query productGroupsAttributes($filters: ProductGroupAttributeFiltersInput, $pagination: PaginationArg, $sort: [String]) {
  productGroupAttributes(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...ProductGroupAttribute
    }
    meta {
      ...Meta
    }
  }
}
    ${ProductGroupAttributeFragmentDoc}
${ProductGroupAttributeMinFragmentDoc}
${ProductGroupAttributeOptionMinFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useProductGroupsAttributesQuery(baseOptions?: Apollo.QueryHookOptions<ProductGroupsAttributesQuery, ProductGroupsAttributesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProductGroupsAttributesQuery, ProductGroupsAttributesQueryVariables>(ProductGroupsAttributesDocument, options);
      }
export function useProductGroupsAttributesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProductGroupsAttributesQuery, ProductGroupsAttributesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProductGroupsAttributesQuery, ProductGroupsAttributesQueryVariables>(ProductGroupsAttributesDocument, options);
        }
export type ProductGroupsAttributesQueryHookResult = ReturnType<typeof useProductGroupsAttributesQuery>;
export type ProductGroupsAttributesLazyQueryHookResult = ReturnType<typeof useProductGroupsAttributesLazyQuery>;
export type ProductGroupsAttributesQueryResult = Apollo.QueryResult<ProductGroupsAttributesQuery, ProductGroupsAttributesQueryVariables>;
export const CreateProductSettingDocument = gql`
    mutation createProductSetting($input: ProductSettingInput!) {
  createProductSetting(data: $input) {
    data {
      id
    }
  }
}
    `;
export type CreateProductSettingMutationFn = Apollo.MutationFunction<CreateProductSettingMutation, CreateProductSettingMutationVariables>;
export function useCreateProductSettingMutation(baseOptions?: Apollo.MutationHookOptions<CreateProductSettingMutation, CreateProductSettingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateProductSettingMutation, CreateProductSettingMutationVariables>(CreateProductSettingDocument, options);
      }
export type CreateProductSettingMutationHookResult = ReturnType<typeof useCreateProductSettingMutation>;
export type CreateProductSettingMutationResult = Apollo.MutationResult<CreateProductSettingMutation>;
export const UpdateProductSettingDocument = gql`
    mutation updateProductSetting($id: ID!, $input: ProductSettingInput!) {
  updateProductSetting(id: $id, data: $input) {
    data {
      id
    }
  }
}
    `;
export type UpdateProductSettingMutationFn = Apollo.MutationFunction<UpdateProductSettingMutation, UpdateProductSettingMutationVariables>;
export function useUpdateProductSettingMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProductSettingMutation, UpdateProductSettingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProductSettingMutation, UpdateProductSettingMutationVariables>(UpdateProductSettingDocument, options);
      }
export type UpdateProductSettingMutationHookResult = ReturnType<typeof useUpdateProductSettingMutation>;
export type UpdateProductSettingMutationResult = Apollo.MutationResult<UpdateProductSettingMutation>;
export const ProductsSettingDocument = gql`
    query productsSetting($filters: ProductSettingFiltersInput, $pagination: PaginationArg, $sort: [String]) {
  productsSetting(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...ProductSetting
    }
    meta {
      ...Meta
    }
  }
}
    ${ProductSettingFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useProductsSettingQuery(baseOptions?: Apollo.QueryHookOptions<ProductsSettingQuery, ProductsSettingQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProductsSettingQuery, ProductsSettingQueryVariables>(ProductsSettingDocument, options);
      }
export function useProductsSettingLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProductsSettingQuery, ProductsSettingQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProductsSettingQuery, ProductsSettingQueryVariables>(ProductsSettingDocument, options);
        }
export type ProductsSettingQueryHookResult = ReturnType<typeof useProductsSettingQuery>;
export type ProductsSettingLazyQueryHookResult = ReturnType<typeof useProductsSettingLazyQuery>;
export type ProductsSettingQueryResult = Apollo.QueryResult<ProductsSettingQuery, ProductsSettingQueryVariables>;
export const CreateQuestionDocument = gql`
    mutation createQuestion($input: QuestionInput!) {
  createQuestion(data: $input) {
    data {
      id
    }
  }
}
    `;
export type CreateQuestionMutationFn = Apollo.MutationFunction<CreateQuestionMutation, CreateQuestionMutationVariables>;
export function useCreateQuestionMutation(baseOptions?: Apollo.MutationHookOptions<CreateQuestionMutation, CreateQuestionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateQuestionMutation, CreateQuestionMutationVariables>(CreateQuestionDocument, options);
      }
export type CreateQuestionMutationHookResult = ReturnType<typeof useCreateQuestionMutation>;
export type CreateQuestionMutationResult = Apollo.MutationResult<CreateQuestionMutation>;
export const DeleteQuestionDocument = gql`
    mutation deleteQuestion($id: ID!) {
  deleteQuestion(id: $id) {
    data {
      id
    }
  }
}
    `;
export type DeleteQuestionMutationFn = Apollo.MutationFunction<DeleteQuestionMutation, DeleteQuestionMutationVariables>;
export function useDeleteQuestionMutation(baseOptions?: Apollo.MutationHookOptions<DeleteQuestionMutation, DeleteQuestionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteQuestionMutation, DeleteQuestionMutationVariables>(DeleteQuestionDocument, options);
      }
export type DeleteQuestionMutationHookResult = ReturnType<typeof useDeleteQuestionMutation>;
export type DeleteQuestionMutationResult = Apollo.MutationResult<DeleteQuestionMutation>;
export const UpdateQuestionDocument = gql`
    mutation updateQuestion($id: ID!, $input: QuestionInput!) {
  updateQuestion(id: $id, data: $input) {
    data {
      id
    }
  }
}
    `;
export type UpdateQuestionMutationFn = Apollo.MutationFunction<UpdateQuestionMutation, UpdateQuestionMutationVariables>;
export function useUpdateQuestionMutation(baseOptions?: Apollo.MutationHookOptions<UpdateQuestionMutation, UpdateQuestionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateQuestionMutation, UpdateQuestionMutationVariables>(UpdateQuestionDocument, options);
      }
export type UpdateQuestionMutationHookResult = ReturnType<typeof useUpdateQuestionMutation>;
export type UpdateQuestionMutationResult = Apollo.MutationResult<UpdateQuestionMutation>;
export const QuestionDocument = gql`
    query question($id: ID!) {
  question(id: $id) {
    data {
      ...Question
    }
  }
}
    ${QuestionFragmentDoc}`;
export function useQuestionQuery(baseOptions: Apollo.QueryHookOptions<QuestionQuery, QuestionQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<QuestionQuery, QuestionQueryVariables>(QuestionDocument, options);
      }
export function useQuestionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<QuestionQuery, QuestionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<QuestionQuery, QuestionQueryVariables>(QuestionDocument, options);
        }
export type QuestionQueryHookResult = ReturnType<typeof useQuestionQuery>;
export type QuestionLazyQueryHookResult = ReturnType<typeof useQuestionLazyQuery>;
export type QuestionQueryResult = Apollo.QueryResult<QuestionQuery, QuestionQueryVariables>;
export const QuestionsDocument = gql`
    query questions($filters: QuestionFiltersInput, $pagination: PaginationArg, $sort: [String]) {
  questions(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...Question
    }
    meta {
      ...Meta
    }
  }
}
    ${QuestionFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useQuestionsQuery(baseOptions?: Apollo.QueryHookOptions<QuestionsQuery, QuestionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<QuestionsQuery, QuestionsQueryVariables>(QuestionsDocument, options);
      }
export function useQuestionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<QuestionsQuery, QuestionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<QuestionsQuery, QuestionsQueryVariables>(QuestionsDocument, options);
        }
export type QuestionsQueryHookResult = ReturnType<typeof useQuestionsQuery>;
export type QuestionsLazyQueryHookResult = ReturnType<typeof useQuestionsLazyQuery>;
export type QuestionsQueryResult = Apollo.QueryResult<QuestionsQuery, QuestionsQueryVariables>;
export const CreateQuickPaySettingDocument = gql`
    mutation createQuickPaySetting($input: QuickPaySettingInput!) {
  createQuickPaySetting(data: $input) {
    data {
      id
    }
  }
}
    `;
export type CreateQuickPaySettingMutationFn = Apollo.MutationFunction<CreateQuickPaySettingMutation, CreateQuickPaySettingMutationVariables>;
export function useCreateQuickPaySettingMutation(baseOptions?: Apollo.MutationHookOptions<CreateQuickPaySettingMutation, CreateQuickPaySettingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateQuickPaySettingMutation, CreateQuickPaySettingMutationVariables>(CreateQuickPaySettingDocument, options);
      }
export type CreateQuickPaySettingMutationHookResult = ReturnType<typeof useCreateQuickPaySettingMutation>;
export type CreateQuickPaySettingMutationResult = Apollo.MutationResult<CreateQuickPaySettingMutation>;
export const DeleteQuickPaySettingDocument = gql`
    mutation deleteQuickPaySetting($id: ID!) {
  deleteQuickPaySetting(id: $id) {
    data {
      id
    }
  }
}
    `;
export type DeleteQuickPaySettingMutationFn = Apollo.MutationFunction<DeleteQuickPaySettingMutation, DeleteQuickPaySettingMutationVariables>;
export function useDeleteQuickPaySettingMutation(baseOptions?: Apollo.MutationHookOptions<DeleteQuickPaySettingMutation, DeleteQuickPaySettingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteQuickPaySettingMutation, DeleteQuickPaySettingMutationVariables>(DeleteQuickPaySettingDocument, options);
      }
export type DeleteQuickPaySettingMutationHookResult = ReturnType<typeof useDeleteQuickPaySettingMutation>;
export type DeleteQuickPaySettingMutationResult = Apollo.MutationResult<DeleteQuickPaySettingMutation>;
export const UpdateQuickPaySettingDocument = gql`
    mutation updateQuickPaySetting($id: ID!, $input: QuickPaySettingInput!) {
  updateQuickPaySetting(id: $id, data: $input) {
    data {
      id
    }
  }
}
    `;
export type UpdateQuickPaySettingMutationFn = Apollo.MutationFunction<UpdateQuickPaySettingMutation, UpdateQuickPaySettingMutationVariables>;
export function useUpdateQuickPaySettingMutation(baseOptions?: Apollo.MutationHookOptions<UpdateQuickPaySettingMutation, UpdateQuickPaySettingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateQuickPaySettingMutation, UpdateQuickPaySettingMutationVariables>(UpdateQuickPaySettingDocument, options);
      }
export type UpdateQuickPaySettingMutationHookResult = ReturnType<typeof useUpdateQuickPaySettingMutation>;
export type UpdateQuickPaySettingMutationResult = Apollo.MutationResult<UpdateQuickPaySettingMutation>;
export const QuickPaysSettingDocument = gql`
    query quickPaysSetting($filters: QuickPaySettingFiltersInput) {
  quickPaysSetting(
    filters: $filters
    pagination: {limit: -1}
    sort: "createdAt:desc"
  ) {
    data {
      ...QuickPaySettings
    }
    meta {
      ...Meta
    }
  }
}
    ${QuickPaySettingsFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useQuickPaysSettingQuery(baseOptions?: Apollo.QueryHookOptions<QuickPaysSettingQuery, QuickPaysSettingQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<QuickPaysSettingQuery, QuickPaysSettingQueryVariables>(QuickPaysSettingDocument, options);
      }
export function useQuickPaysSettingLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<QuickPaysSettingQuery, QuickPaysSettingQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<QuickPaysSettingQuery, QuickPaysSettingQueryVariables>(QuickPaysSettingDocument, options);
        }
export type QuickPaysSettingQueryHookResult = ReturnType<typeof useQuickPaysSettingQuery>;
export type QuickPaysSettingLazyQueryHookResult = ReturnType<typeof useQuickPaysSettingLazyQuery>;
export type QuickPaysSettingQueryResult = Apollo.QueryResult<QuickPaysSettingQuery, QuickPaysSettingQueryVariables>;
export const CreateRateDocument = gql`
    mutation createRate($input: RateInput!) {
  createRate(data: $input) {
    data {
      id
    }
  }
}
    `;
export type CreateRateMutationFn = Apollo.MutationFunction<CreateRateMutation, CreateRateMutationVariables>;
export function useCreateRateMutation(baseOptions?: Apollo.MutationHookOptions<CreateRateMutation, CreateRateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateRateMutation, CreateRateMutationVariables>(CreateRateDocument, options);
      }
export type CreateRateMutationHookResult = ReturnType<typeof useCreateRateMutation>;
export type CreateRateMutationResult = Apollo.MutationResult<CreateRateMutation>;
export const UpdateReportsScheduleDocument = gql`
    mutation updateReportsSchedule($id: ID!, $input: ReportsScheduleInput!) {
  updateReportsSchedule(id: $id, data: $input) {
    data {
      id
    }
  }
}
    `;
export type UpdateReportsScheduleMutationFn = Apollo.MutationFunction<UpdateReportsScheduleMutation, UpdateReportsScheduleMutationVariables>;
export function useUpdateReportsScheduleMutation(baseOptions?: Apollo.MutationHookOptions<UpdateReportsScheduleMutation, UpdateReportsScheduleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateReportsScheduleMutation, UpdateReportsScheduleMutationVariables>(UpdateReportsScheduleDocument, options);
      }
export type UpdateReportsScheduleMutationHookResult = ReturnType<typeof useUpdateReportsScheduleMutation>;
export type UpdateReportsScheduleMutationResult = Apollo.MutationResult<UpdateReportsScheduleMutation>;
export const CreateResourceDocument = gql`
    mutation createResource($input: ResourceInput!) {
  createResource(data: $input) {
    data {
      id
    }
  }
}
    `;
export type CreateResourceMutationFn = Apollo.MutationFunction<CreateResourceMutation, CreateResourceMutationVariables>;
export function useCreateResourceMutation(baseOptions?: Apollo.MutationHookOptions<CreateResourceMutation, CreateResourceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateResourceMutation, CreateResourceMutationVariables>(CreateResourceDocument, options);
      }
export type CreateResourceMutationHookResult = ReturnType<typeof useCreateResourceMutation>;
export type CreateResourceMutationResult = Apollo.MutationResult<CreateResourceMutation>;
export const CreateResourceCountDocument = gql`
    mutation createResourceCount($input: ResourceCountInput!) {
  createResourceCount(data: $input) {
    data {
      id
    }
  }
}
    `;
export type CreateResourceCountMutationFn = Apollo.MutationFunction<CreateResourceCountMutation, CreateResourceCountMutationVariables>;
export function useCreateResourceCountMutation(baseOptions?: Apollo.MutationHookOptions<CreateResourceCountMutation, CreateResourceCountMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateResourceCountMutation, CreateResourceCountMutationVariables>(CreateResourceCountDocument, options);
      }
export type CreateResourceCountMutationHookResult = ReturnType<typeof useCreateResourceCountMutation>;
export type CreateResourceCountMutationResult = Apollo.MutationResult<CreateResourceCountMutation>;
export const CreateResourceInventoryItemDocument = gql`
    mutation createResourceInventoryItem($input: ResourceInventoryItemInput!) {
  createResourceInventoryItem(data: $input) {
    data {
      id
    }
  }
}
    `;
export type CreateResourceInventoryItemMutationFn = Apollo.MutationFunction<CreateResourceInventoryItemMutation, CreateResourceInventoryItemMutationVariables>;
export function useCreateResourceInventoryItemMutation(baseOptions?: Apollo.MutationHookOptions<CreateResourceInventoryItemMutation, CreateResourceInventoryItemMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateResourceInventoryItemMutation, CreateResourceInventoryItemMutationVariables>(CreateResourceInventoryItemDocument, options);
      }
export type CreateResourceInventoryItemMutationHookResult = ReturnType<typeof useCreateResourceInventoryItemMutation>;
export type CreateResourceInventoryItemMutationResult = Apollo.MutationResult<CreateResourceInventoryItemMutation>;
export const DeleteResourceCountDocument = gql`
    mutation deleteResourceCount($id: ID!) {
  deleteResourceCount(id: $id) {
    data {
      id
    }
  }
}
    `;
export type DeleteResourceCountMutationFn = Apollo.MutationFunction<DeleteResourceCountMutation, DeleteResourceCountMutationVariables>;
export function useDeleteResourceCountMutation(baseOptions?: Apollo.MutationHookOptions<DeleteResourceCountMutation, DeleteResourceCountMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteResourceCountMutation, DeleteResourceCountMutationVariables>(DeleteResourceCountDocument, options);
      }
export type DeleteResourceCountMutationHookResult = ReturnType<typeof useDeleteResourceCountMutation>;
export type DeleteResourceCountMutationResult = Apollo.MutationResult<DeleteResourceCountMutation>;
export const DeleteResourceInventoryItemDocument = gql`
    mutation deleteResourceInventoryItem($id: ID!) {
  deleteResourceInventoryItem(id: $id) {
    data {
      id
    }
  }
}
    `;
export type DeleteResourceInventoryItemMutationFn = Apollo.MutationFunction<DeleteResourceInventoryItemMutation, DeleteResourceInventoryItemMutationVariables>;
export function useDeleteResourceInventoryItemMutation(baseOptions?: Apollo.MutationHookOptions<DeleteResourceInventoryItemMutation, DeleteResourceInventoryItemMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteResourceInventoryItemMutation, DeleteResourceInventoryItemMutationVariables>(DeleteResourceInventoryItemDocument, options);
      }
export type DeleteResourceInventoryItemMutationHookResult = ReturnType<typeof useDeleteResourceInventoryItemMutation>;
export type DeleteResourceInventoryItemMutationResult = Apollo.MutationResult<DeleteResourceInventoryItemMutation>;
export const UpdateResourceDocument = gql`
    mutation updateResource($id: ID!, $input: ResourceInput!) {
  updateResource(id: $id, data: $input) {
    data {
      id
    }
  }
}
    `;
export type UpdateResourceMutationFn = Apollo.MutationFunction<UpdateResourceMutation, UpdateResourceMutationVariables>;
export function useUpdateResourceMutation(baseOptions?: Apollo.MutationHookOptions<UpdateResourceMutation, UpdateResourceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateResourceMutation, UpdateResourceMutationVariables>(UpdateResourceDocument, options);
      }
export type UpdateResourceMutationHookResult = ReturnType<typeof useUpdateResourceMutation>;
export type UpdateResourceMutationResult = Apollo.MutationResult<UpdateResourceMutation>;
export const UpdateResourceCountDocument = gql`
    mutation updateResourceCount($id: ID!, $input: ResourceCountInput!) {
  updateResourceCount(id: $id, data: $input) {
    data {
      id
    }
  }
}
    `;
export type UpdateResourceCountMutationFn = Apollo.MutationFunction<UpdateResourceCountMutation, UpdateResourceCountMutationVariables>;
export function useUpdateResourceCountMutation(baseOptions?: Apollo.MutationHookOptions<UpdateResourceCountMutation, UpdateResourceCountMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateResourceCountMutation, UpdateResourceCountMutationVariables>(UpdateResourceCountDocument, options);
      }
export type UpdateResourceCountMutationHookResult = ReturnType<typeof useUpdateResourceCountMutation>;
export type UpdateResourceCountMutationResult = Apollo.MutationResult<UpdateResourceCountMutation>;
export const UpdateResourceInventoryItemDocument = gql`
    mutation updateResourceInventoryItem($id: ID!, $input: ResourceInventoryItemInput!) {
  updateResourceInventoryItem(id: $id, data: $input) {
    data {
      id
    }
  }
}
    `;
export type UpdateResourceInventoryItemMutationFn = Apollo.MutationFunction<UpdateResourceInventoryItemMutation, UpdateResourceInventoryItemMutationVariables>;
export function useUpdateResourceInventoryItemMutation(baseOptions?: Apollo.MutationHookOptions<UpdateResourceInventoryItemMutation, UpdateResourceInventoryItemMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateResourceInventoryItemMutation, UpdateResourceInventoryItemMutationVariables>(UpdateResourceInventoryItemDocument, options);
      }
export type UpdateResourceInventoryItemMutationHookResult = ReturnType<typeof useUpdateResourceInventoryItemMutation>;
export type UpdateResourceInventoryItemMutationResult = Apollo.MutationResult<UpdateResourceInventoryItemMutation>;
export const InventoryResourcesTableDocument = gql`
    query inventoryResourcesTable($filters: ResourceFiltersInput, $pagination: PaginationArg = {}, $sort: [String] = []) {
  resources(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...InventoryResourceTable
    }
    meta {
      ...Meta
    }
  }
}
    ${InventoryResourceTableFragmentDoc}
${FileMinFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useInventoryResourcesTableQuery(baseOptions?: Apollo.QueryHookOptions<InventoryResourcesTableQuery, InventoryResourcesTableQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<InventoryResourcesTableQuery, InventoryResourcesTableQueryVariables>(InventoryResourcesTableDocument, options);
      }
export function useInventoryResourcesTableLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<InventoryResourcesTableQuery, InventoryResourcesTableQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<InventoryResourcesTableQuery, InventoryResourcesTableQueryVariables>(InventoryResourcesTableDocument, options);
        }
export type InventoryResourcesTableQueryHookResult = ReturnType<typeof useInventoryResourcesTableQuery>;
export type InventoryResourcesTableLazyQueryHookResult = ReturnType<typeof useInventoryResourcesTableLazyQuery>;
export type InventoryResourcesTableQueryResult = Apollo.QueryResult<InventoryResourcesTableQuery, InventoryResourcesTableQueryVariables>;
export const ResourceByUuidDocument = gql`
    query resourceByUuid($uuid: String!) {
  resources(filters: {uuid: {eq: $uuid}}) {
    data {
      ...Resource
    }
  }
}
    ${ResourceFragmentDoc}
${ResourceMinFragmentDoc}
${ResourceInventoryItemFragmentDoc}`;
export function useResourceByUuidQuery(baseOptions: Apollo.QueryHookOptions<ResourceByUuidQuery, ResourceByUuidQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ResourceByUuidQuery, ResourceByUuidQueryVariables>(ResourceByUuidDocument, options);
      }
export function useResourceByUuidLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ResourceByUuidQuery, ResourceByUuidQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ResourceByUuidQuery, ResourceByUuidQueryVariables>(ResourceByUuidDocument, options);
        }
export type ResourceByUuidQueryHookResult = ReturnType<typeof useResourceByUuidQuery>;
export type ResourceByUuidLazyQueryHookResult = ReturnType<typeof useResourceByUuidLazyQuery>;
export type ResourceByUuidQueryResult = Apollo.QueryResult<ResourceByUuidQuery, ResourceByUuidQueryVariables>;
export const ResourceInventoryItemsDocument = gql`
    query resourceInventoryItems($filters: ResourceInventoryItemFiltersInput, $pagination: PaginationArg = {}, $sort: [String] = []) {
  resourceInventoryItems(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...ResourceInventoryItem
    }
    meta {
      ...Meta
    }
  }
}
    ${ResourceInventoryItemFragmentDoc}
${ResourceMinFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useResourceInventoryItemsQuery(baseOptions?: Apollo.QueryHookOptions<ResourceInventoryItemsQuery, ResourceInventoryItemsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ResourceInventoryItemsQuery, ResourceInventoryItemsQueryVariables>(ResourceInventoryItemsDocument, options);
      }
export function useResourceInventoryItemsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ResourceInventoryItemsQuery, ResourceInventoryItemsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ResourceInventoryItemsQuery, ResourceInventoryItemsQueryVariables>(ResourceInventoryItemsDocument, options);
        }
export type ResourceInventoryItemsQueryHookResult = ReturnType<typeof useResourceInventoryItemsQuery>;
export type ResourceInventoryItemsLazyQueryHookResult = ReturnType<typeof useResourceInventoryItemsLazyQuery>;
export type ResourceInventoryItemsQueryResult = Apollo.QueryResult<ResourceInventoryItemsQuery, ResourceInventoryItemsQueryVariables>;
export const ResourcesDocument = gql`
    query resources($filters: ResourceFiltersInput, $pagination: PaginationArg = {}, $sort: [String] = []) {
  resources(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...Resource
    }
    meta {
      ...Meta
    }
  }
}
    ${ResourceFragmentDoc}
${ResourceMinFragmentDoc}
${ResourceInventoryItemFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useResourcesQuery(baseOptions?: Apollo.QueryHookOptions<ResourcesQuery, ResourcesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ResourcesQuery, ResourcesQueryVariables>(ResourcesDocument, options);
      }
export function useResourcesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ResourcesQuery, ResourcesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ResourcesQuery, ResourcesQueryVariables>(ResourcesDocument, options);
        }
export type ResourcesQueryHookResult = ReturnType<typeof useResourcesQuery>;
export type ResourcesLazyQueryHookResult = ReturnType<typeof useResourcesLazyQuery>;
export type ResourcesQueryResult = Apollo.QueryResult<ResourcesQuery, ResourcesQueryVariables>;
export const RolesDocument = gql`
    query roles($filters: UsersPermissionsRoleFiltersInput!) {
  usersPermissionsRoles(filters: $filters) {
    data {
      id
      attributes {
        name
        type
      }
    }
  }
}
    `;
export function useRolesQuery(baseOptions: Apollo.QueryHookOptions<RolesQuery, RolesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RolesQuery, RolesQueryVariables>(RolesDocument, options);
      }
export function useRolesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RolesQuery, RolesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RolesQuery, RolesQueryVariables>(RolesDocument, options);
        }
export type RolesQueryHookResult = ReturnType<typeof useRolesQuery>;
export type RolesLazyQueryHookResult = ReturnType<typeof useRolesLazyQuery>;
export type RolesQueryResult = Apollo.QueryResult<RolesQuery, RolesQueryVariables>;
export const CreateServiceSettingDocument = gql`
    mutation createServiceSetting($input: ServiceSettingInput!) {
  createServiceSetting(data: $input) {
    data {
      id
    }
  }
}
    `;
export type CreateServiceSettingMutationFn = Apollo.MutationFunction<CreateServiceSettingMutation, CreateServiceSettingMutationVariables>;
export function useCreateServiceSettingMutation(baseOptions?: Apollo.MutationHookOptions<CreateServiceSettingMutation, CreateServiceSettingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateServiceSettingMutation, CreateServiceSettingMutationVariables>(CreateServiceSettingDocument, options);
      }
export type CreateServiceSettingMutationHookResult = ReturnType<typeof useCreateServiceSettingMutation>;
export type CreateServiceSettingMutationResult = Apollo.MutationResult<CreateServiceSettingMutation>;
export const UpdateServiceSettingDocument = gql`
    mutation updateServiceSetting($id: ID!, $input: ServiceSettingInput!) {
  updateServiceSetting(id: $id, data: $input) {
    data {
      id
    }
  }
}
    `;
export type UpdateServiceSettingMutationFn = Apollo.MutationFunction<UpdateServiceSettingMutation, UpdateServiceSettingMutationVariables>;
export function useUpdateServiceSettingMutation(baseOptions?: Apollo.MutationHookOptions<UpdateServiceSettingMutation, UpdateServiceSettingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateServiceSettingMutation, UpdateServiceSettingMutationVariables>(UpdateServiceSettingDocument, options);
      }
export type UpdateServiceSettingMutationHookResult = ReturnType<typeof useUpdateServiceSettingMutation>;
export type UpdateServiceSettingMutationResult = Apollo.MutationResult<UpdateServiceSettingMutation>;
export const ServiceSettingDocument = gql`
    query serviceSetting($filters: ServiceSettingFiltersInput, $pagination: PaginationArg, $sort: [String]) {
  servicesSetting(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...ServiceSetting
    }
  }
}
    ${ServiceSettingFragmentDoc}`;
export function useServiceSettingQuery(baseOptions?: Apollo.QueryHookOptions<ServiceSettingQuery, ServiceSettingQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ServiceSettingQuery, ServiceSettingQueryVariables>(ServiceSettingDocument, options);
      }
export function useServiceSettingLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ServiceSettingQuery, ServiceSettingQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ServiceSettingQuery, ServiceSettingQueryVariables>(ServiceSettingDocument, options);
        }
export type ServiceSettingQueryHookResult = ReturnType<typeof useServiceSettingQuery>;
export type ServiceSettingLazyQueryHookResult = ReturnType<typeof useServiceSettingLazyQuery>;
export type ServiceSettingQueryResult = Apollo.QueryResult<ServiceSettingQuery, ServiceSettingQueryVariables>;
export const DeleteSessionsDocument = gql`
    mutation deleteSessions($input: DeleteSessionsInput!) {
  deleteSessions(input: $input) {
    ok
  }
}
    `;
export type DeleteSessionsMutationFn = Apollo.MutationFunction<DeleteSessionsMutation, DeleteSessionsMutationVariables>;
export function useDeleteSessionsMutation(baseOptions?: Apollo.MutationHookOptions<DeleteSessionsMutation, DeleteSessionsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteSessionsMutation, DeleteSessionsMutationVariables>(DeleteSessionsDocument, options);
      }
export type DeleteSessionsMutationHookResult = ReturnType<typeof useDeleteSessionsMutation>;
export type DeleteSessionsMutationResult = Apollo.MutationResult<DeleteSessionsMutation>;
export const SessionsDocument = gql`
    mutation sessions {
  sessions {
    currentSession {
      device
      browser
      ip
    }
    otherSessions {
      device
      browser
      ip
    }
  }
}
    `;
export type SessionsMutationFn = Apollo.MutationFunction<SessionsMutation, SessionsMutationVariables>;
export function useSessionsMutation(baseOptions?: Apollo.MutationHookOptions<SessionsMutation, SessionsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SessionsMutation, SessionsMutationVariables>(SessionsDocument, options);
      }
export type SessionsMutationHookResult = ReturnType<typeof useSessionsMutation>;
export type SessionsMutationResult = Apollo.MutationResult<SessionsMutation>;
export const CreateShipmentDocument = gql`
    mutation createShipment($input: ShipmentInput!) {
  createShipment(data: $input) {
    data {
      id
    }
  }
}
    `;
export type CreateShipmentMutationFn = Apollo.MutationFunction<CreateShipmentMutation, CreateShipmentMutationVariables>;
export function useCreateShipmentMutation(baseOptions?: Apollo.MutationHookOptions<CreateShipmentMutation, CreateShipmentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateShipmentMutation, CreateShipmentMutationVariables>(CreateShipmentDocument, options);
      }
export type CreateShipmentMutationHookResult = ReturnType<typeof useCreateShipmentMutation>;
export type CreateShipmentMutationResult = Apollo.MutationResult<CreateShipmentMutation>;
export const CreateShipmentCarrierDocument = gql`
    mutation createShipmentCarrier($input: ShipmentCarrierInput!) {
  createShipmentCarrier(data: $input) {
    data {
      id
    }
  }
}
    `;
export type CreateShipmentCarrierMutationFn = Apollo.MutationFunction<CreateShipmentCarrierMutation, CreateShipmentCarrierMutationVariables>;
export function useCreateShipmentCarrierMutation(baseOptions?: Apollo.MutationHookOptions<CreateShipmentCarrierMutation, CreateShipmentCarrierMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateShipmentCarrierMutation, CreateShipmentCarrierMutationVariables>(CreateShipmentCarrierDocument, options);
      }
export type CreateShipmentCarrierMutationHookResult = ReturnType<typeof useCreateShipmentCarrierMutation>;
export type CreateShipmentCarrierMutationResult = Apollo.MutationResult<CreateShipmentCarrierMutation>;
export const UpdateShipmentDocument = gql`
    mutation updateShipment($id: ID!, $input: ShipmentInput!) {
  updateShipment(id: $id, data: $input) {
    data {
      id
    }
  }
}
    `;
export type UpdateShipmentMutationFn = Apollo.MutationFunction<UpdateShipmentMutation, UpdateShipmentMutationVariables>;
export function useUpdateShipmentMutation(baseOptions?: Apollo.MutationHookOptions<UpdateShipmentMutation, UpdateShipmentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateShipmentMutation, UpdateShipmentMutationVariables>(UpdateShipmentDocument, options);
      }
export type UpdateShipmentMutationHookResult = ReturnType<typeof useUpdateShipmentMutation>;
export type UpdateShipmentMutationResult = Apollo.MutationResult<UpdateShipmentMutation>;
export const ShipmentByUuidDocument = gql`
    query shipmentByUuid($uuid: String!) {
  shipments(filters: {uuid: {eq: $uuid}}) {
    data {
      ...Shipment
    }
  }
}
    ${ShipmentFragmentDoc}
${ShipmentCarrierFragmentDoc}
${FileMinFragmentDoc}`;
export function useShipmentByUuidQuery(baseOptions: Apollo.QueryHookOptions<ShipmentByUuidQuery, ShipmentByUuidQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ShipmentByUuidQuery, ShipmentByUuidQueryVariables>(ShipmentByUuidDocument, options);
      }
export function useShipmentByUuidLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ShipmentByUuidQuery, ShipmentByUuidQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ShipmentByUuidQuery, ShipmentByUuidQueryVariables>(ShipmentByUuidDocument, options);
        }
export type ShipmentByUuidQueryHookResult = ReturnType<typeof useShipmentByUuidQuery>;
export type ShipmentByUuidLazyQueryHookResult = ReturnType<typeof useShipmentByUuidLazyQuery>;
export type ShipmentByUuidQueryResult = Apollo.QueryResult<ShipmentByUuidQuery, ShipmentByUuidQueryVariables>;
export const ShipmentCarriersDocument = gql`
    query shipmentCarriers($filters: ShipmentCarrierFiltersInput, $pagination: PaginationArg, $sort: [String]) {
  shipmentCarriers(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...ShipmentCarrier
    }
  }
}
    ${ShipmentCarrierFragmentDoc}`;
export function useShipmentCarriersQuery(baseOptions?: Apollo.QueryHookOptions<ShipmentCarriersQuery, ShipmentCarriersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ShipmentCarriersQuery, ShipmentCarriersQueryVariables>(ShipmentCarriersDocument, options);
      }
export function useShipmentCarriersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ShipmentCarriersQuery, ShipmentCarriersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ShipmentCarriersQuery, ShipmentCarriersQueryVariables>(ShipmentCarriersDocument, options);
        }
export type ShipmentCarriersQueryHookResult = ReturnType<typeof useShipmentCarriersQuery>;
export type ShipmentCarriersLazyQueryHookResult = ReturnType<typeof useShipmentCarriersLazyQuery>;
export type ShipmentCarriersQueryResult = Apollo.QueryResult<ShipmentCarriersQuery, ShipmentCarriersQueryVariables>;
export const ShipmentsDocument = gql`
    query shipments($filters: ShipmentFiltersInput, $pagination: PaginationArg, $sort: [String]) {
  shipments(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...Shipment
    }
    meta {
      ...Meta
    }
  }
}
    ${ShipmentFragmentDoc}
${ShipmentCarrierFragmentDoc}
${FileMinFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useShipmentsQuery(baseOptions?: Apollo.QueryHookOptions<ShipmentsQuery, ShipmentsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ShipmentsQuery, ShipmentsQueryVariables>(ShipmentsDocument, options);
      }
export function useShipmentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ShipmentsQuery, ShipmentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ShipmentsQuery, ShipmentsQueryVariables>(ShipmentsDocument, options);
        }
export type ShipmentsQueryHookResult = ReturnType<typeof useShipmentsQuery>;
export type ShipmentsLazyQueryHookResult = ReturnType<typeof useShipmentsLazyQuery>;
export type ShipmentsQueryResult = Apollo.QueryResult<ShipmentsQuery, ShipmentsQueryVariables>;
export const CreateTaxDocument = gql`
    mutation createTax($data: TaxInput!) {
  createTax(data: $data) {
    data {
      id
    }
  }
}
    `;
export type CreateTaxMutationFn = Apollo.MutationFunction<CreateTaxMutation, CreateTaxMutationVariables>;
export function useCreateTaxMutation(baseOptions?: Apollo.MutationHookOptions<CreateTaxMutation, CreateTaxMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTaxMutation, CreateTaxMutationVariables>(CreateTaxDocument, options);
      }
export type CreateTaxMutationHookResult = ReturnType<typeof useCreateTaxMutation>;
export type CreateTaxMutationResult = Apollo.MutationResult<CreateTaxMutation>;
export const DeleteTaxDocument = gql`
    mutation deleteTax($id: ID!) {
  deleteTax(id: $id) {
    data {
      id
    }
  }
}
    `;
export type DeleteTaxMutationFn = Apollo.MutationFunction<DeleteTaxMutation, DeleteTaxMutationVariables>;
export function useDeleteTaxMutation(baseOptions?: Apollo.MutationHookOptions<DeleteTaxMutation, DeleteTaxMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteTaxMutation, DeleteTaxMutationVariables>(DeleteTaxDocument, options);
      }
export type DeleteTaxMutationHookResult = ReturnType<typeof useDeleteTaxMutation>;
export type DeleteTaxMutationResult = Apollo.MutationResult<DeleteTaxMutation>;
export const UpdateTaxDocument = gql`
    mutation updateTax($updateTaxId: ID!, $data: TaxInput!) {
  updateTax(id: $updateTaxId, data: $data) {
    data {
      id
    }
  }
}
    `;
export type UpdateTaxMutationFn = Apollo.MutationFunction<UpdateTaxMutation, UpdateTaxMutationVariables>;
export function useUpdateTaxMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTaxMutation, UpdateTaxMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTaxMutation, UpdateTaxMutationVariables>(UpdateTaxDocument, options);
      }
export type UpdateTaxMutationHookResult = ReturnType<typeof useUpdateTaxMutation>;
export type UpdateTaxMutationResult = Apollo.MutationResult<UpdateTaxMutation>;
export const TaxDocument = gql`
    query tax($id: ID!) {
  tax(id: $id) {
    data {
      ...Tax
    }
  }
}
    ${TaxFragmentDoc}
${TaxMinFragmentDoc}
${TaxAuthorityFragmentDoc}`;
export function useTaxQuery(baseOptions: Apollo.QueryHookOptions<TaxQuery, TaxQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TaxQuery, TaxQueryVariables>(TaxDocument, options);
      }
export function useTaxLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TaxQuery, TaxQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TaxQuery, TaxQueryVariables>(TaxDocument, options);
        }
export type TaxQueryHookResult = ReturnType<typeof useTaxQuery>;
export type TaxLazyQueryHookResult = ReturnType<typeof useTaxLazyQuery>;
export type TaxQueryResult = Apollo.QueryResult<TaxQuery, TaxQueryVariables>;
export const TaxAndTaxCollectionsDocument = gql`
    query taxAndTaxCollections($filterTaxes: TaxFiltersInput! = {}, $filterTaxCollections: TaxCollectionFiltersInput! = {}, $pagination: PaginationArg) {
  taxes(filters: $filterTaxes, pagination: $pagination) {
    data {
      ...TaxSelect
    }
  }
  taxCollections(filters: $filterTaxCollections, pagination: $pagination) {
    data {
      ...TaxCollectionMin
    }
  }
}
    ${TaxSelectFragmentDoc}
${TaxCollectionMinFragmentDoc}`;
export function useTaxAndTaxCollectionsQuery(baseOptions?: Apollo.QueryHookOptions<TaxAndTaxCollectionsQuery, TaxAndTaxCollectionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TaxAndTaxCollectionsQuery, TaxAndTaxCollectionsQueryVariables>(TaxAndTaxCollectionsDocument, options);
      }
export function useTaxAndTaxCollectionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TaxAndTaxCollectionsQuery, TaxAndTaxCollectionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TaxAndTaxCollectionsQuery, TaxAndTaxCollectionsQueryVariables>(TaxAndTaxCollectionsDocument, options);
        }
export type TaxAndTaxCollectionsQueryHookResult = ReturnType<typeof useTaxAndTaxCollectionsQuery>;
export type TaxAndTaxCollectionsLazyQueryHookResult = ReturnType<typeof useTaxAndTaxCollectionsLazyQuery>;
export type TaxAndTaxCollectionsQueryResult = Apollo.QueryResult<TaxAndTaxCollectionsQuery, TaxAndTaxCollectionsQueryVariables>;
export const TaxesDocument = gql`
    query taxes($filters: TaxFiltersInput, $pagination: PaginationArg = {}, $sort: [String] = []) {
  taxes(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...Tax
    }
    meta {
      ...Meta
    }
  }
}
    ${TaxFragmentDoc}
${TaxMinFragmentDoc}
${TaxAuthorityFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useTaxesQuery(baseOptions?: Apollo.QueryHookOptions<TaxesQuery, TaxesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TaxesQuery, TaxesQueryVariables>(TaxesDocument, options);
      }
export function useTaxesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TaxesQuery, TaxesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TaxesQuery, TaxesQueryVariables>(TaxesDocument, options);
        }
export type TaxesQueryHookResult = ReturnType<typeof useTaxesQuery>;
export type TaxesLazyQueryHookResult = ReturnType<typeof useTaxesLazyQuery>;
export type TaxesQueryResult = Apollo.QueryResult<TaxesQuery, TaxesQueryVariables>;
export const TaxesSelectDocument = gql`
    query taxesSelect($filters: TaxFiltersInput, $pagination: PaginationArg = {}, $sort: [String] = []) {
  taxes(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...TaxSelect
    }
  }
}
    ${TaxSelectFragmentDoc}`;
export function useTaxesSelectQuery(baseOptions?: Apollo.QueryHookOptions<TaxesSelectQuery, TaxesSelectQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TaxesSelectQuery, TaxesSelectQueryVariables>(TaxesSelectDocument, options);
      }
export function useTaxesSelectLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TaxesSelectQuery, TaxesSelectQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TaxesSelectQuery, TaxesSelectQueryVariables>(TaxesSelectDocument, options);
        }
export type TaxesSelectQueryHookResult = ReturnType<typeof useTaxesSelectQuery>;
export type TaxesSelectLazyQueryHookResult = ReturnType<typeof useTaxesSelectLazyQuery>;
export type TaxesSelectQueryResult = Apollo.QueryResult<TaxesSelectQuery, TaxesSelectQueryVariables>;
export const CreateTaxAuthorityDocument = gql`
    mutation createTaxAuthority($data: TaxAuthorityInput!) {
  createTaxAuthority(data: $data) {
    data {
      id
    }
  }
}
    `;
export type CreateTaxAuthorityMutationFn = Apollo.MutationFunction<CreateTaxAuthorityMutation, CreateTaxAuthorityMutationVariables>;
export function useCreateTaxAuthorityMutation(baseOptions?: Apollo.MutationHookOptions<CreateTaxAuthorityMutation, CreateTaxAuthorityMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTaxAuthorityMutation, CreateTaxAuthorityMutationVariables>(CreateTaxAuthorityDocument, options);
      }
export type CreateTaxAuthorityMutationHookResult = ReturnType<typeof useCreateTaxAuthorityMutation>;
export type CreateTaxAuthorityMutationResult = Apollo.MutationResult<CreateTaxAuthorityMutation>;
export const TaxAuthoritiesDocument = gql`
    query taxAuthorities($filters: TaxAuthorityFiltersInput, $sort: [String]) {
  taxAuthorities(filters: $filters, sort: $sort) {
    data {
      ...TaxAuthority
    }
  }
}
    ${TaxAuthorityFragmentDoc}`;
export function useTaxAuthoritiesQuery(baseOptions?: Apollo.QueryHookOptions<TaxAuthoritiesQuery, TaxAuthoritiesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TaxAuthoritiesQuery, TaxAuthoritiesQueryVariables>(TaxAuthoritiesDocument, options);
      }
export function useTaxAuthoritiesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TaxAuthoritiesQuery, TaxAuthoritiesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TaxAuthoritiesQuery, TaxAuthoritiesQueryVariables>(TaxAuthoritiesDocument, options);
        }
export type TaxAuthoritiesQueryHookResult = ReturnType<typeof useTaxAuthoritiesQuery>;
export type TaxAuthoritiesLazyQueryHookResult = ReturnType<typeof useTaxAuthoritiesLazyQuery>;
export type TaxAuthoritiesQueryResult = Apollo.QueryResult<TaxAuthoritiesQuery, TaxAuthoritiesQueryVariables>;
export const CreateTaxCollectionDocument = gql`
    mutation createTaxCollection($input: TaxCollectionInput!) {
  createTaxCollection(data: $input) {
    data {
      id
    }
  }
}
    `;
export type CreateTaxCollectionMutationFn = Apollo.MutationFunction<CreateTaxCollectionMutation, CreateTaxCollectionMutationVariables>;
export function useCreateTaxCollectionMutation(baseOptions?: Apollo.MutationHookOptions<CreateTaxCollectionMutation, CreateTaxCollectionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTaxCollectionMutation, CreateTaxCollectionMutationVariables>(CreateTaxCollectionDocument, options);
      }
export type CreateTaxCollectionMutationHookResult = ReturnType<typeof useCreateTaxCollectionMutation>;
export type CreateTaxCollectionMutationResult = Apollo.MutationResult<CreateTaxCollectionMutation>;
export const DeleteTaxCollectionDocument = gql`
    mutation deleteTaxCollection($id: ID!) {
  deleteTaxCollection(id: $id) {
    data {
      id
    }
  }
}
    `;
export type DeleteTaxCollectionMutationFn = Apollo.MutationFunction<DeleteTaxCollectionMutation, DeleteTaxCollectionMutationVariables>;
export function useDeleteTaxCollectionMutation(baseOptions?: Apollo.MutationHookOptions<DeleteTaxCollectionMutation, DeleteTaxCollectionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteTaxCollectionMutation, DeleteTaxCollectionMutationVariables>(DeleteTaxCollectionDocument, options);
      }
export type DeleteTaxCollectionMutationHookResult = ReturnType<typeof useDeleteTaxCollectionMutation>;
export type DeleteTaxCollectionMutationResult = Apollo.MutationResult<DeleteTaxCollectionMutation>;
export const UpdateTaxCollectionDocument = gql`
    mutation updateTaxCollection($id: ID!, $input: TaxCollectionInput!) {
  updateTaxCollection(id: $id, data: $input) {
    data {
      id
    }
  }
}
    `;
export type UpdateTaxCollectionMutationFn = Apollo.MutationFunction<UpdateTaxCollectionMutation, UpdateTaxCollectionMutationVariables>;
export function useUpdateTaxCollectionMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTaxCollectionMutation, UpdateTaxCollectionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTaxCollectionMutation, UpdateTaxCollectionMutationVariables>(UpdateTaxCollectionDocument, options);
      }
export type UpdateTaxCollectionMutationHookResult = ReturnType<typeof useUpdateTaxCollectionMutation>;
export type UpdateTaxCollectionMutationResult = Apollo.MutationResult<UpdateTaxCollectionMutation>;
export const TaxCollectionDocument = gql`
    query taxCollection($id: ID!) {
  taxCollection(id: $id) {
    data {
      ...TaxCollection
    }
  }
}
    ${TaxCollectionFragmentDoc}
${TaxCollectionMinFragmentDoc}
${TaxMinFragmentDoc}`;
export function useTaxCollectionQuery(baseOptions: Apollo.QueryHookOptions<TaxCollectionQuery, TaxCollectionQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TaxCollectionQuery, TaxCollectionQueryVariables>(TaxCollectionDocument, options);
      }
export function useTaxCollectionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TaxCollectionQuery, TaxCollectionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TaxCollectionQuery, TaxCollectionQueryVariables>(TaxCollectionDocument, options);
        }
export type TaxCollectionQueryHookResult = ReturnType<typeof useTaxCollectionQuery>;
export type TaxCollectionLazyQueryHookResult = ReturnType<typeof useTaxCollectionLazyQuery>;
export type TaxCollectionQueryResult = Apollo.QueryResult<TaxCollectionQuery, TaxCollectionQueryVariables>;
export const TaxCollectionsDocument = gql`
    query taxCollections($filters: TaxCollectionFiltersInput, $pagination: PaginationArg, $sort: [String]) {
  taxCollections(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...TaxCollection
    }
    meta {
      ...Meta
    }
  }
}
    ${TaxCollectionFragmentDoc}
${TaxCollectionMinFragmentDoc}
${TaxMinFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useTaxCollectionsQuery(baseOptions?: Apollo.QueryHookOptions<TaxCollectionsQuery, TaxCollectionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TaxCollectionsQuery, TaxCollectionsQueryVariables>(TaxCollectionsDocument, options);
      }
export function useTaxCollectionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TaxCollectionsQuery, TaxCollectionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TaxCollectionsQuery, TaxCollectionsQueryVariables>(TaxCollectionsDocument, options);
        }
export type TaxCollectionsQueryHookResult = ReturnType<typeof useTaxCollectionsQuery>;
export type TaxCollectionsLazyQueryHookResult = ReturnType<typeof useTaxCollectionsLazyQuery>;
export type TaxCollectionsQueryResult = Apollo.QueryResult<TaxCollectionsQuery, TaxCollectionsQueryVariables>;
export const CreateTenantDocument = gql`
    mutation createTenant($data: TenantInput!) {
  createTenant(data: $data) {
    data {
      id
    }
  }
}
    `;
export type CreateTenantMutationFn = Apollo.MutationFunction<CreateTenantMutation, CreateTenantMutationVariables>;
export function useCreateTenantMutation(baseOptions?: Apollo.MutationHookOptions<CreateTenantMutation, CreateTenantMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTenantMutation, CreateTenantMutationVariables>(CreateTenantDocument, options);
      }
export type CreateTenantMutationHookResult = ReturnType<typeof useCreateTenantMutation>;
export type CreateTenantMutationResult = Apollo.MutationResult<CreateTenantMutation>;
export const UpdateTenantDocument = gql`
    mutation updateTenant($id: ID!, $input: TenantInput!) {
  updateTenant(id: $id, data: $input) {
    data {
      id
    }
  }
}
    `;
export type UpdateTenantMutationFn = Apollo.MutationFunction<UpdateTenantMutation, UpdateTenantMutationVariables>;
export function useUpdateTenantMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTenantMutation, UpdateTenantMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTenantMutation, UpdateTenantMutationVariables>(UpdateTenantDocument, options);
      }
export type UpdateTenantMutationHookResult = ReturnType<typeof useUpdateTenantMutation>;
export type UpdateTenantMutationResult = Apollo.MutationResult<UpdateTenantMutation>;
export const TenantBySlugDocument = gql`
    query tenantBySlug($tenantSlug: String!) {
  tenants(filters: {slug: {eq: $tenantSlug}}) {
    data {
      ...Tenant
    }
  }
}
    ${TenantFragmentDoc}
${FileFragmentDoc}
${LocationFragmentDoc}`;
export function useTenantBySlugQuery(baseOptions: Apollo.QueryHookOptions<TenantBySlugQuery, TenantBySlugQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TenantBySlugQuery, TenantBySlugQueryVariables>(TenantBySlugDocument, options);
      }
export function useTenantBySlugLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TenantBySlugQuery, TenantBySlugQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TenantBySlugQuery, TenantBySlugQueryVariables>(TenantBySlugDocument, options);
        }
export type TenantBySlugQueryHookResult = ReturnType<typeof useTenantBySlugQuery>;
export type TenantBySlugLazyQueryHookResult = ReturnType<typeof useTenantBySlugLazyQuery>;
export type TenantBySlugQueryResult = Apollo.QueryResult<TenantBySlugQuery, TenantBySlugQueryVariables>;
export const TenantsDocument = gql`
    query tenants($filters: TenantFiltersInput, $pagination: PaginationArg = {}, $sort: [String] = []) {
  tenants(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...Tenant
    }
    meta {
      ...Meta
    }
  }
}
    ${TenantFragmentDoc}
${FileFragmentDoc}
${LocationFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useTenantsQuery(baseOptions?: Apollo.QueryHookOptions<TenantsQuery, TenantsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TenantsQuery, TenantsQueryVariables>(TenantsDocument, options);
      }
export function useTenantsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TenantsQuery, TenantsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TenantsQuery, TenantsQueryVariables>(TenantsDocument, options);
        }
export type TenantsQueryHookResult = ReturnType<typeof useTenantsQuery>;
export type TenantsLazyQueryHookResult = ReturnType<typeof useTenantsLazyQuery>;
export type TenantsQueryResult = Apollo.QueryResult<TenantsQuery, TenantsQueryVariables>;
export const CreateTransferOrderDocument = gql`
    mutation createTransferOrder($input: TransferOrderInput!) {
  createTransferOrder(data: $input) {
    data {
      id
    }
  }
}
    `;
export type CreateTransferOrderMutationFn = Apollo.MutationFunction<CreateTransferOrderMutation, CreateTransferOrderMutationVariables>;
export function useCreateTransferOrderMutation(baseOptions?: Apollo.MutationHookOptions<CreateTransferOrderMutation, CreateTransferOrderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTransferOrderMutation, CreateTransferOrderMutationVariables>(CreateTransferOrderDocument, options);
      }
export type CreateTransferOrderMutationHookResult = ReturnType<typeof useCreateTransferOrderMutation>;
export type CreateTransferOrderMutationResult = Apollo.MutationResult<CreateTransferOrderMutation>;
export const CreateTransferOrderItemDocument = gql`
    mutation createTransferOrderItem($input: TransferOrderItemInput!) {
  createTransferOrderItem(data: $input) {
    data {
      id
    }
  }
}
    `;
export type CreateTransferOrderItemMutationFn = Apollo.MutationFunction<CreateTransferOrderItemMutation, CreateTransferOrderItemMutationVariables>;
export function useCreateTransferOrderItemMutation(baseOptions?: Apollo.MutationHookOptions<CreateTransferOrderItemMutation, CreateTransferOrderItemMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTransferOrderItemMutation, CreateTransferOrderItemMutationVariables>(CreateTransferOrderItemDocument, options);
      }
export type CreateTransferOrderItemMutationHookResult = ReturnType<typeof useCreateTransferOrderItemMutation>;
export type CreateTransferOrderItemMutationResult = Apollo.MutationResult<CreateTransferOrderItemMutation>;
export const UpdateTransferOrderDocument = gql`
    mutation updateTransferOrder($id: ID!, $input: TransferOrderInput!) {
  updateTransferOrder(id: $id, data: $input) {
    data {
      id
    }
  }
}
    `;
export type UpdateTransferOrderMutationFn = Apollo.MutationFunction<UpdateTransferOrderMutation, UpdateTransferOrderMutationVariables>;
export function useUpdateTransferOrderMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTransferOrderMutation, UpdateTransferOrderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTransferOrderMutation, UpdateTransferOrderMutationVariables>(UpdateTransferOrderDocument, options);
      }
export type UpdateTransferOrderMutationHookResult = ReturnType<typeof useUpdateTransferOrderMutation>;
export type UpdateTransferOrderMutationResult = Apollo.MutationResult<UpdateTransferOrderMutation>;
export const InventoryTransferOrdersDocument = gql`
    query inventoryTransferOrders($filters: TransferOrderFiltersInput, $pagination: PaginationArg = {}, $sort: [String] = []) {
  transferOrders(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...InventoryTransferOrder
    }
    meta {
      ...Meta
    }
  }
}
    ${InventoryTransferOrderFragmentDoc}
${TransferOrderMinFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useInventoryTransferOrdersQuery(baseOptions?: Apollo.QueryHookOptions<InventoryTransferOrdersQuery, InventoryTransferOrdersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<InventoryTransferOrdersQuery, InventoryTransferOrdersQueryVariables>(InventoryTransferOrdersDocument, options);
      }
export function useInventoryTransferOrdersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<InventoryTransferOrdersQuery, InventoryTransferOrdersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<InventoryTransferOrdersQuery, InventoryTransferOrdersQueryVariables>(InventoryTransferOrdersDocument, options);
        }
export type InventoryTransferOrdersQueryHookResult = ReturnType<typeof useInventoryTransferOrdersQuery>;
export type InventoryTransferOrdersLazyQueryHookResult = ReturnType<typeof useInventoryTransferOrdersLazyQuery>;
export type InventoryTransferOrdersQueryResult = Apollo.QueryResult<InventoryTransferOrdersQuery, InventoryTransferOrdersQueryVariables>;
export const TransferOrderByUuidDocument = gql`
    query transferOrderByUuid($uuid: String!) {
  transferOrders(filters: {uuid: {eq: $uuid}}) {
    data {
      ...TransferOrder
    }
  }
}
    ${TransferOrderFragmentDoc}
${TransferOrderMinFragmentDoc}
${FileFragmentDoc}`;
export function useTransferOrderByUuidQuery(baseOptions: Apollo.QueryHookOptions<TransferOrderByUuidQuery, TransferOrderByUuidQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TransferOrderByUuidQuery, TransferOrderByUuidQueryVariables>(TransferOrderByUuidDocument, options);
      }
export function useTransferOrderByUuidLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TransferOrderByUuidQuery, TransferOrderByUuidQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TransferOrderByUuidQuery, TransferOrderByUuidQueryVariables>(TransferOrderByUuidDocument, options);
        }
export type TransferOrderByUuidQueryHookResult = ReturnType<typeof useTransferOrderByUuidQuery>;
export type TransferOrderByUuidLazyQueryHookResult = ReturnType<typeof useTransferOrderByUuidLazyQuery>;
export type TransferOrderByUuidQueryResult = Apollo.QueryResult<TransferOrderByUuidQuery, TransferOrderByUuidQueryVariables>;
export const TransferOrderItemsByTransferOrderUuidDocument = gql`
    query transferOrderItemsByTransferOrderUuid($uuid: String!, $pagination: PaginationArg = {}) {
  transferOrderItems(
    filters: {transferOrder: {uuid: {eq: $uuid}}}
    pagination: $pagination
  ) {
    data {
      ...TransferOrderItem
    }
    meta {
      ...Meta
    }
  }
}
    ${TransferOrderItemFragmentDoc}
${TransferOrderItemMinFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useTransferOrderItemsByTransferOrderUuidQuery(baseOptions: Apollo.QueryHookOptions<TransferOrderItemsByTransferOrderUuidQuery, TransferOrderItemsByTransferOrderUuidQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TransferOrderItemsByTransferOrderUuidQuery, TransferOrderItemsByTransferOrderUuidQueryVariables>(TransferOrderItemsByTransferOrderUuidDocument, options);
      }
export function useTransferOrderItemsByTransferOrderUuidLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TransferOrderItemsByTransferOrderUuidQuery, TransferOrderItemsByTransferOrderUuidQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TransferOrderItemsByTransferOrderUuidQuery, TransferOrderItemsByTransferOrderUuidQueryVariables>(TransferOrderItemsByTransferOrderUuidDocument, options);
        }
export type TransferOrderItemsByTransferOrderUuidQueryHookResult = ReturnType<typeof useTransferOrderItemsByTransferOrderUuidQuery>;
export type TransferOrderItemsByTransferOrderUuidLazyQueryHookResult = ReturnType<typeof useTransferOrderItemsByTransferOrderUuidLazyQuery>;
export type TransferOrderItemsByTransferOrderUuidQueryResult = Apollo.QueryResult<TransferOrderItemsByTransferOrderUuidQuery, TransferOrderItemsByTransferOrderUuidQueryVariables>;
export const CreateUsageDocument = gql`
    mutation createUsage($data: UsageInput!) {
  createUsage(data: $data) {
    data {
      id
    }
  }
}
    `;
export type CreateUsageMutationFn = Apollo.MutationFunction<CreateUsageMutation, CreateUsageMutationVariables>;
export function useCreateUsageMutation(baseOptions?: Apollo.MutationHookOptions<CreateUsageMutation, CreateUsageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateUsageMutation, CreateUsageMutationVariables>(CreateUsageDocument, options);
      }
export type CreateUsageMutationHookResult = ReturnType<typeof useCreateUsageMutation>;
export type CreateUsageMutationResult = Apollo.MutationResult<CreateUsageMutation>;
export const UpdateUsageDocument = gql`
    mutation updateUsage($id: ID!, $data: UsageInput!) {
  updateUsage(id: $id, data: $data) {
    data {
      id
    }
  }
}
    `;
export type UpdateUsageMutationFn = Apollo.MutationFunction<UpdateUsageMutation, UpdateUsageMutationVariables>;
export function useUpdateUsageMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUsageMutation, UpdateUsageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateUsageMutation, UpdateUsageMutationVariables>(UpdateUsageDocument, options);
      }
export type UpdateUsageMutationHookResult = ReturnType<typeof useUpdateUsageMutation>;
export type UpdateUsageMutationResult = Apollo.MutationResult<UpdateUsageMutation>;
export const UsagesDocument = gql`
    query usages($filters: UsageFiltersInput, $pagination: PaginationArg = {}, $sort: [String] = []) {
  usages(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...Usage
    }
    meta {
      ...Meta
    }
  }
}
    ${UsageFragmentDoc}
${TenantFragmentDoc}
${FileFragmentDoc}
${LocationFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useUsagesQuery(baseOptions?: Apollo.QueryHookOptions<UsagesQuery, UsagesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UsagesQuery, UsagesQueryVariables>(UsagesDocument, options);
      }
export function useUsagesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UsagesQuery, UsagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UsagesQuery, UsagesQueryVariables>(UsagesDocument, options);
        }
export type UsagesQueryHookResult = ReturnType<typeof useUsagesQuery>;
export type UsagesLazyQueryHookResult = ReturnType<typeof useUsagesLazyQuery>;
export type UsagesQueryResult = Apollo.QueryResult<UsagesQuery, UsagesQueryVariables>;
export const CreateNewRoleDocument = gql`
    mutation createNewRole($input: CreateNewRoleInput!) {
  createNewRole(input: $input)
}
    `;
export type CreateNewRoleMutationFn = Apollo.MutationFunction<CreateNewRoleMutation, CreateNewRoleMutationVariables>;
export function useCreateNewRoleMutation(baseOptions?: Apollo.MutationHookOptions<CreateNewRoleMutation, CreateNewRoleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateNewRoleMutation, CreateNewRoleMutationVariables>(CreateNewRoleDocument, options);
      }
export type CreateNewRoleMutationHookResult = ReturnType<typeof useCreateNewRoleMutation>;
export type CreateNewRoleMutationResult = Apollo.MutationResult<CreateNewRoleMutation>;
export const ResendConfirmationDocument = gql`
    mutation resendConfirmation($input: ResendConfirmationInput!) {
  resendConfirmation(input: $input)
}
    `;
export type ResendConfirmationMutationFn = Apollo.MutationFunction<ResendConfirmationMutation, ResendConfirmationMutationVariables>;
export function useResendConfirmationMutation(baseOptions?: Apollo.MutationHookOptions<ResendConfirmationMutation, ResendConfirmationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ResendConfirmationMutation, ResendConfirmationMutationVariables>(ResendConfirmationDocument, options);
      }
export type ResendConfirmationMutationHookResult = ReturnType<typeof useResendConfirmationMutation>;
export type ResendConfirmationMutationResult = Apollo.MutationResult<ResendConfirmationMutation>;
export const UnblockEmployeeDocument = gql`
    mutation unblockEmployee($input: UnblockEmployeeInput!) {
  unblockEmployee(input: $input)
}
    `;
export type UnblockEmployeeMutationFn = Apollo.MutationFunction<UnblockEmployeeMutation, UnblockEmployeeMutationVariables>;
export function useUnblockEmployeeMutation(baseOptions?: Apollo.MutationHookOptions<UnblockEmployeeMutation, UnblockEmployeeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UnblockEmployeeMutation, UnblockEmployeeMutationVariables>(UnblockEmployeeDocument, options);
      }
export type UnblockEmployeeMutationHookResult = ReturnType<typeof useUnblockEmployeeMutation>;
export type UnblockEmployeeMutationResult = Apollo.MutationResult<UnblockEmployeeMutation>;
export const UpdateUserDocument = gql`
    mutation updateUser($id: ID!, $data: UsersPermissionsUserInput!) {
  updateUsersPermissionsUser(id: $id, data: $data) {
    data {
      id
      attributes {
        payRate {
          data {
            id
          }
        }
        salesCommission {
          data {
            id
          }
        }
      }
    }
  }
}
    `;
export type UpdateUserMutationFn = Apollo.MutationFunction<UpdateUserMutation, UpdateUserMutationVariables>;
export function useUpdateUserMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserMutation, UpdateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(UpdateUserDocument, options);
      }
export type UpdateUserMutationHookResult = ReturnType<typeof useUpdateUserMutation>;
export type UpdateUserMutationResult = Apollo.MutationResult<UpdateUserMutation>;
export const UsersDocument = gql`
    query users($filters: UsersPermissionsUserFiltersInput, $pagination: PaginationArg, $sort: [String]) {
  usersPermissionsUsers(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...User
    }
    meta {
      ...Meta
    }
  }
}
    ${UserFragmentDoc}
${UserMinFragmentDoc}
${FileFragmentDoc}
${TenantFragmentDoc}
${LocationFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useUsersQuery(baseOptions?: Apollo.QueryHookOptions<UsersQuery, UsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UsersQuery, UsersQueryVariables>(UsersDocument, options);
      }
export function useUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UsersQuery, UsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UsersQuery, UsersQueryVariables>(UsersDocument, options);
        }
export type UsersQueryHookResult = ReturnType<typeof useUsersQuery>;
export type UsersLazyQueryHookResult = ReturnType<typeof useUsersLazyQuery>;
export type UsersQueryResult = Apollo.QueryResult<UsersQuery, UsersQueryVariables>;
export const UsersCountDocument = gql`
    query usersCount($filters: UsersPermissionsUserFiltersInput) {
  usersPermissionsUsers(filters: $filters, pagination: {limit: -1}) {
    meta {
      pagination {
        total
      }
    }
  }
}
    `;
export function useUsersCountQuery(baseOptions?: Apollo.QueryHookOptions<UsersCountQuery, UsersCountQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UsersCountQuery, UsersCountQueryVariables>(UsersCountDocument, options);
      }
export function useUsersCountLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UsersCountQuery, UsersCountQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UsersCountQuery, UsersCountQueryVariables>(UsersCountDocument, options);
        }
export type UsersCountQueryHookResult = ReturnType<typeof useUsersCountQuery>;
export type UsersCountLazyQueryHookResult = ReturnType<typeof useUsersCountLazyQuery>;
export type UsersCountQueryResult = Apollo.QueryResult<UsersCountQuery, UsersCountQueryVariables>;
export const UsersDataDocument = gql`
    query usersData($filters: UsersPermissionsUserFiltersInput, $pagination: PaginationArg, $sort: [String]) {
  usersPermissionsUsers(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...UserData
    }
    meta {
      ...Meta
    }
  }
}
    ${UserDataFragmentDoc}
${FileMinFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useUsersDataQuery(baseOptions?: Apollo.QueryHookOptions<UsersDataQuery, UsersDataQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UsersDataQuery, UsersDataQueryVariables>(UsersDataDocument, options);
      }
export function useUsersDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UsersDataQuery, UsersDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UsersDataQuery, UsersDataQueryVariables>(UsersDataDocument, options);
        }
export type UsersDataQueryHookResult = ReturnType<typeof useUsersDataQuery>;
export type UsersDataLazyQueryHookResult = ReturnType<typeof useUsersDataLazyQuery>;
export type UsersDataQueryResult = Apollo.QueryResult<UsersDataQuery, UsersDataQueryVariables>;
export const UsersTableDocument = gql`
    query usersTable($filters: UsersPermissionsUserFiltersInput, $pagination: PaginationArg, $sort: [String]) {
  usersPermissionsUsers(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ...UserTable
    }
    meta {
      ...Meta
    }
  }
}
    ${UserTableFragmentDoc}
${FileMinFragmentDoc}
${MetaFragmentDoc}
${PaginationFragmentDoc}`;
export function useUsersTableQuery(baseOptions?: Apollo.QueryHookOptions<UsersTableQuery, UsersTableQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UsersTableQuery, UsersTableQueryVariables>(UsersTableDocument, options);
      }
export function useUsersTableLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UsersTableQuery, UsersTableQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UsersTableQuery, UsersTableQueryVariables>(UsersTableDocument, options);
        }
export type UsersTableQueryHookResult = ReturnType<typeof useUsersTableQuery>;
export type UsersTableLazyQueryHookResult = ReturnType<typeof useUsersTableLazyQuery>;
export type UsersTableQueryResult = Apollo.QueryResult<UsersTableQuery, UsersTableQueryVariables>;