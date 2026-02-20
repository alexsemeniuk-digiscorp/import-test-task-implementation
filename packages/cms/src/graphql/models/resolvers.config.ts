import { accountServiceConnectionResolversConfig } from './accountServiceConnection';
import { accountingProductMappingResolversConfig } from './accountingProductMapping';
import { activityResolversConfig } from './activity';
import { businessLocationResolversConfig } from './businessLocation';
import { callResolversConfig } from './call';
import { campaignResolversConfig } from './campaign';
import { campaignEnrolledContactResolversConfig } from './campaignEnrolledContact';
import { campaignEnrolledLeadResolversConfig } from './campaignEnrolledLead';
import { chartCategoryResolversConfig } from './chartCategory';
import { chartSubcategoryResolversConfig } from './chartSubcategory';
import { chatNotificationResolversConfig } from './chatNotification';
import { classResolversConfig } from './class';
import { classPerformerResolversConfig } from './classPerformer';
import { clearentResolversConfig } from './clearent';
import { clearentOnboardingConfig } from './clearentOnboarding';
import { companyResolversConfig } from './company';
import { companySettingResolverConfig } from './companySetting';
import { compositeProductResolversConfig } from './compositeProduct';
import { AllCompositeTrackerCostTrackerResolvers } from './compositeProductCostTrackerInfo';
import { compositeProductLocationInfoResolversConfig } from './compositeProductLocationInfo';
import { contactResolversConfig } from './contact';
import { contactSettingResolverConfig } from './contactSetting';
import { contactTitleResolversConfig } from './contactTitle';
import { contractResolversConfig } from './contract';
import { appraisalContractResolversConfig } from './contractAppraisal';
import { contractFormResolversConfig } from './contractForm';
import { contractFormTemplateResolversConfig } from './contractsFormTemplate';
import { contractTemplateResolversConfig } from './contractsTemplate';
import { conversationResolversConfig } from './conversation';
import { crmCustomFieldNameResolversConfig } from './crmCustomFieldName';
import { crmRelationTypeConfig } from './crmRelationType';
import { customPermissionResolversConfig } from './customPermission';
import { dealResolversConfig } from './deal';
import { dealSettingResolverConfig } from './dealSetting';
import { dealTransactionResolversConfig } from './dealTransaction';
import { discountResolversConfig } from './discount';
import { documentPermissionResolversConfig } from './documentPermission';
import { downloadRecordResolversConfig } from './downloadRecord';
import { estimateResolversConfig } from './estimate';
import { fileItemResolversConfig } from './fileItem';
import { globalSearchResolversConfig } from './globalSearch';
import { importSessionResolversConfig } from './importSession';
import { inventoryAdjustmentResolversConfig } from './inventoryAdjustment';
import { inventoryAdjustmentItemResolversConfig } from './inventoryAdjustmentItem';
import { inventoryAuditResolverConfig } from './inventoryAudit';
import { inventoryAuditItemResolverConfig } from './inventoryAuditItem';
import { invoiceResolversConfig } from './invoice';
import { itemCategoryResolversConfig } from './itemCategory';
import { AllJewelryProductEntitiesResolvers } from './jewelryProduct';
import { leadResolversConfig } from './lead';
import { locationResolversConfig } from './location';
import { maintenanceResolversConfig } from './maintenance';
import { maintenanceEventResolversConfig } from './maintenanceEvent';
import { marketingCustomersReportResolversConfig } from './marketingCustomersReport';
import { marketingEmailTemplateResolversConfig } from './marketingEmailTemplate';
import { membershipResolversConfig } from './membership';
import { metaConnectionResolversConfig } from './metaConnection';
import { settingNotificationResolversConfig } from './notificationSettings';
import { nylasConnectionResolversConfig } from './nylasConnection';
import { orderResolversConfig } from './order';
import { orderSettingResolverConfig } from './orderSetting';
import { paymentMethodResolversConfig } from './paymentMethod';
import { pdfCatalogFileResolversConfig } from './pdfCatalogFile';
import { pdfTemplateResolversConfig } from './pdfTemplate';
import { productResolversConfig } from './product';
import { productAttributeResolversConfig } from './productAttribute';
import { productBrandResolversConfig } from './productBrand';
import { productGroupResolversConfig } from './productGroup';
import { productGroupAttributeResolversConfig } from './productGroupAttribute';
import { productInventoryItemResolversConfig } from './productInventoryItem';
import { productInventoryItemEventResolversConfig } from './productInventoryItemEvent';
import { productInventoryItemRecordResolversConfig } from './productInventoryItemRecord';
import { productSettingResolverConfig } from './productSetting';
import { productTypeResolversConfig } from './productType';
import { purchaseRequestResolversConfig } from './purchaseRequest';
import { questionResolversConfig } from './question';
import { quickPayCustomOptionResolversConfig } from './quickPaySetting';
import { rentableDataResolversConfig } from './rentableData';
import { resourceResolversConfig } from './resource';
import { resourceCountResolversConfig } from './resourceCount';
import { resourceInventoryItemResolversConfig } from './resourceInventoryItem';
import { returnResolversConfig } from './return';
import { returnMethodResolversConfig } from './returnMethod';
import { reviewResolversConfig } from './review';
import { salesCommissionResolversConfig } from './salesCommission';
import { salesItemReportResolversConfig } from './salesItemReport';
import { schedulingAppointmentResolversConfig } from './schedulingAppointment';
import { schedulingRecurrenceResolversConfig } from './schedulingRecurrence';
import { sendDocumentResolversConfig } from './sendDocument';
import { sequenceStepResolversConfig } from './sequenceStep';
import { serializedResolversConfig } from './serialNumber';
import { serviceResolversConfig } from './service';
import { servicePerformerResolversConfig } from './servicePerformer';
import { serviceSettingResolverConfig } from './serviceSetting';
import { shipmentResolversConfig } from './shipment';
import { shipmentCarrierResolversConfig } from './shipmentCarrier';
import { AllStoneEntitiesResolver } from './stone';
import { stripeOnboardingConfig } from './stripeOnboarding';
import { stripeSubscriptionPlanConfig } from './stripeSubscriptionPlan';
import { subLocationItemResolversConfig } from './subLocatiomItem';
import { subLocationResolversConfig } from './subLocation';
import { taskResolversConfig } from './task';
import { taskLocationResolversConfig } from './taskLocation';
import { taskStageResolversConfig } from './taskStage';
import { taskTypeResolversConfig } from './taskType';
import { taxResolversConfig } from './tax';
import { taxAuthorityResolversConfig } from './taxAuthority';
import { taxCollectionResolversConfig } from './taxCollection';
import { timePeriodResolversConfig } from './timePeriod';
import { timeTrackerResolversConfig } from './timeTracker';
import { timelineConnectionResolversConfig } from './timelineConnection';
import { transferOrderResolversConfig } from './transferOrder';
import { transferOrderItemResolversConfig } from './transferOrderItem';
import { twilioConnectionResolversConfig } from './twilioConnection';
import { userResolversConfig } from './user';
import { userNotificationResolversConfig } from './userNotification';
import { websiteResolversConfig } from './website';

export const resolversConfig: Graphql.ResolverConfig = {
  ...timelineConnectionResolversConfig,
  ...sendDocumentResolversConfig,
  ...chatNotificationResolversConfig,
  ...reviewResolversConfig,
  ...AllJewelryProductEntitiesResolvers,
  ...AllCompositeTrackerCostTrackerResolvers,
  ...callResolversConfig,
  ...chartCategoryResolversConfig,
  ...chartSubcategoryResolversConfig,
  ...marketingCustomersReportResolversConfig,
  ...salesItemReportResolversConfig,
  ...userResolversConfig,
  ...productResolversConfig,
  ...leadResolversConfig,
  ...contactResolversConfig,
  ...companyResolversConfig,
  ...activityResolversConfig,
  ...businessLocationResolversConfig,
  ...locationResolversConfig,
  ...serviceResolversConfig,
  ...resourceResolversConfig,
  ...servicePerformerResolversConfig,
  ...crmRelationTypeConfig,
  ...classResolversConfig,
  ...classPerformerResolversConfig,
  ...resourceCountResolversConfig,
  ...itemCategoryResolversConfig,
  ...productTypeResolversConfig,
  ...productBrandResolversConfig,
  ...rentableDataResolversConfig,
  ...importSessionResolversConfig,
  ...productInventoryItemResolversConfig,
  ...compositeProductResolversConfig,
  ...resourceInventoryItemResolversConfig,
  ...compositeProductLocationInfoResolversConfig,
  ...productGroupResolversConfig,
  ...productGroupAttributeResolversConfig,
  ...discountResolversConfig,
  ...pdfTemplateResolversConfig,
  ...quickPayCustomOptionResolversConfig,
  ...pdfCatalogFileResolversConfig,
  ...taxResolversConfig,
  ...downloadRecordResolversConfig,
  ...taxAuthorityResolversConfig,
  ...taxCollectionResolversConfig,
  ...dealResolversConfig,
  ...dealTransactionResolversConfig,
  ...orderResolversConfig,
  ...productAttributeResolversConfig,
  ...shipmentCarrierResolversConfig,
  ...shipmentResolversConfig,
  ...taskResolversConfig,
  ...taskLocationResolversConfig,
  ...taskStageResolversConfig,
  ...taskTypeResolversConfig,
  ...membershipResolversConfig,
  ...transferOrderResolversConfig,
  ...maintenanceResolversConfig,
  ...maintenanceEventResolversConfig,
  ...inventoryAdjustmentResolversConfig,
  ...inventoryAdjustmentItemResolversConfig,
  ...inventoryAuditResolverConfig,
  ...inventoryAuditItemResolverConfig,
  ...invoiceResolversConfig,
  ...fileItemResolversConfig,
  ...returnResolversConfig,
  ...returnMethodResolversConfig,
  ...campaignResolversConfig,
  ...questionResolversConfig,
  ...userNotificationResolversConfig,
  ...contractFormTemplateResolversConfig,
  ...contractTemplateResolversConfig,
  ...contractFormResolversConfig,
  ...contractResolversConfig,
  ...appraisalContractResolversConfig,
  ...websiteResolversConfig,
  ...campaignEnrolledContactResolversConfig,
  ...campaignEnrolledLeadResolversConfig,
  ...sequenceStepResolversConfig,
  ...marketingEmailTemplateResolversConfig,
  ...customPermissionResolversConfig,
  ...conversationResolversConfig,
  ...productInventoryItemEventResolversConfig,
  ...AllStoneEntitiesResolver,
  ...timePeriodResolversConfig,
  ...stripeOnboardingConfig,
  ...twilioConnectionResolversConfig,
  ...nylasConnectionResolversConfig,
  ...purchaseRequestResolversConfig,
  ...estimateResolversConfig,
  ...crmCustomFieldNameResolversConfig,
  ...subLocationResolversConfig,
  ...paymentMethodResolversConfig,
  ...callResolversConfig,
  ...schedulingAppointmentResolversConfig,
  ...clearentResolversConfig,
  ...schedulingRecurrenceResolversConfig,
  ...clearentOnboardingConfig,
  ...serializedResolversConfig,
  ...subLocationItemResolversConfig,
  ...transferOrderItemResolversConfig,
  ...documentPermissionResolversConfig,
  ...contactSettingResolverConfig,
  ...companySettingResolverConfig,
  ...productSettingResolverConfig,
  ...serviceSettingResolverConfig,
  ...orderSettingResolverConfig,
  ...dealSettingResolverConfig,
  ...stripeSubscriptionPlanConfig,
  ...productInventoryItemRecordResolversConfig,
  ...contactTitleResolversConfig,
  ...salesCommissionResolversConfig,
  ...accountServiceConnectionResolversConfig,
  ...accountingProductMappingResolversConfig,
  ...metaConnectionResolversConfig,
  ...timeTrackerResolversConfig,
  ...globalSearchResolversConfig,
  ...settingNotificationResolversConfig,
};
