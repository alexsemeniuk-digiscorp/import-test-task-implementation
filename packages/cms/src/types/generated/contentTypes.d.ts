import type { Attribute, Schema } from '@strapi/strapi';

export interface AdminPermission extends Schema.CollectionType {
  collectionName: 'admin_permissions';
  info: {
    name: 'Permission';
    description: '';
    singularName: 'permission';
    pluralName: 'permissions';
    displayName: 'Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    subject: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    properties: Attribute.JSON & Attribute.DefaultTo<{}>;
    conditions: Attribute.JSON & Attribute.DefaultTo<[]>;
    role: Attribute.Relation<'admin::permission', 'manyToOne', 'admin::role'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminUser extends Schema.CollectionType {
  collectionName: 'admin_users';
  info: {
    name: 'User';
    description: '';
    singularName: 'user';
    pluralName: 'users';
    displayName: 'User';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    firstname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    username: Attribute.String;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.Private &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: Attribute.String & Attribute.Private;
    registrationToken: Attribute.String & Attribute.Private;
    isActive: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
    roles: Attribute.Relation<'admin::user', 'manyToMany', 'admin::role'> &
      Attribute.Private;
    blocked: Attribute.Boolean & Attribute.Private & Attribute.DefaultTo<false>;
    preferedLanguage: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface AdminRole extends Schema.CollectionType {
  collectionName: 'admin_roles';
  info: {
    name: 'Role';
    description: '';
    singularName: 'role';
    pluralName: 'roles';
    displayName: 'Role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    code: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String;
    users: Attribute.Relation<'admin::role', 'manyToMany', 'admin::user'>;
    permissions: Attribute.Relation<
      'admin::role',
      'oneToMany',
      'admin::permission'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface AdminApiToken extends Schema.CollectionType {
  collectionName: 'strapi_api_tokens';
  info: {
    name: 'Api Token';
    singularName: 'api-token';
    pluralName: 'api-tokens';
    displayName: 'Api Token';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    type: Attribute.Enumeration<['read-only', 'full-access', 'custom']> &
      Attribute.Required &
      Attribute.DefaultTo<'read-only'>;
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastUsedAt: Attribute.DateTime;
    permissions: Attribute.Relation<
      'admin::api-token',
      'oneToMany',
      'admin::api-token-permission'
    >;
    expiresAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminApiTokenPermission extends Schema.CollectionType {
  collectionName: 'strapi_api_token_permissions';
  info: {
    name: 'API Token Permission';
    description: '';
    singularName: 'api-token-permission';
    pluralName: 'api-token-permissions';
    displayName: 'API Token Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    token: Attribute.Relation<
      'admin::api-token-permission',
      'manyToOne',
      'admin::api-token'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminTransferToken extends Schema.CollectionType {
  collectionName: 'strapi_transfer_tokens';
  info: {
    name: 'Transfer Token';
    singularName: 'transfer-token';
    pluralName: 'transfer-tokens';
    displayName: 'Transfer Token';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastUsedAt: Attribute.DateTime;
    permissions: Attribute.Relation<
      'admin::transfer-token',
      'oneToMany',
      'admin::transfer-token-permission'
    >;
    expiresAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::transfer-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::transfer-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminTransferTokenPermission extends Schema.CollectionType {
  collectionName: 'strapi_transfer_token_permissions';
  info: {
    name: 'Transfer Token Permission';
    description: '';
    singularName: 'transfer-token-permission';
    pluralName: 'transfer-token-permissions';
    displayName: 'Transfer Token Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    token: Attribute.Relation<
      'admin::transfer-token-permission',
      'manyToOne',
      'admin::transfer-token'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUploadFile extends Schema.CollectionType {
  collectionName: 'files';
  info: {
    singularName: 'file';
    pluralName: 'files';
    displayName: 'File';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    alternativeText: Attribute.String;
    caption: Attribute.String;
    width: Attribute.Integer;
    height: Attribute.Integer;
    formats: Attribute.JSON;
    hash: Attribute.String & Attribute.Required;
    ext: Attribute.String;
    mime: Attribute.String & Attribute.Required;
    size: Attribute.Decimal & Attribute.Required;
    url: Attribute.String & Attribute.Required;
    previewUrl: Attribute.String;
    provider: Attribute.String & Attribute.Required;
    provider_metadata: Attribute.JSON;
    related: Attribute.Relation<'plugin::upload.file', 'morphToMany'>;
    folder: Attribute.Relation<
      'plugin::upload.file',
      'manyToOne',
      'plugin::upload.folder'
    > &
      Attribute.Private;
    folderPath: Attribute.String &
      Attribute.Required &
      Attribute.Private &
      Attribute.SetMinMax<{
        min: 1;
      }>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    blurhash: Attribute.Text;
  };
}

export interface PluginUploadFolder extends Schema.CollectionType {
  collectionName: 'upload_folders';
  info: {
    singularName: 'folder';
    pluralName: 'folders';
    displayName: 'Folder';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<{
        min: 1;
      }>;
    pathId: Attribute.Integer & Attribute.Required & Attribute.Unique;
    parent: Attribute.Relation<
      'plugin::upload.folder',
      'manyToOne',
      'plugin::upload.folder'
    >;
    children: Attribute.Relation<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.folder'
    >;
    files: Attribute.Relation<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.file'
    >;
    path: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<{
        min: 1;
      }>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginSlugifySlug extends Schema.CollectionType {
  collectionName: 'slugs';
  info: {
    singularName: 'slug';
    pluralName: 'slugs';
    displayName: 'slug';
  };
  options: {
    draftAndPublish: false;
    comment: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    slug: Attribute.Text;
    count: Attribute.Integer;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::slugify.slug',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::slugify.slug',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsPermission
  extends Schema.CollectionType {
  collectionName: 'up_permissions';
  info: {
    name: 'permission';
    description: '';
    singularName: 'permission';
    pluralName: 'permissions';
    displayName: 'Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String & Attribute.Required;
    role: Attribute.Relation<
      'plugin::users-permissions.permission',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsRole extends Schema.CollectionType {
  collectionName: 'up_roles';
  info: {
    name: 'role';
    description: '';
    singularName: 'role';
    pluralName: 'roles';
    displayName: 'Role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    description: Attribute.String;
    type: Attribute.String & Attribute.Unique;
    permissions: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.permission'
    >;
    users: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.user'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsUser extends Schema.CollectionType {
  collectionName: 'up_users';
  info: {
    name: 'user';
    description: '';
    singularName: 'user';
    pluralName: 'users';
    displayName: 'User';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    username: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    provider: Attribute.String;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 8;
      }>;
    resetPasswordToken: Attribute.String & Attribute.Private;
    resetPasswordTokenExpiration: Attribute.String & Attribute.Private;
    confirmationToken: Attribute.String & Attribute.Private;
    confirmed: Attribute.Boolean & Attribute.DefaultTo<false>;
    blocked: Attribute.Boolean & Attribute.DefaultTo<false>;
    role: Attribute.Relation<
      'plugin::users-permissions.user',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    uuid: Attribute.UID & Attribute.CustomField<'plugin::field-uuid.uuid'>;
    firstName: Attribute.String;
    lastName: Attribute.String;
    phoneNumber: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 10;
      }>;
    leads: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToMany',
      'api::lead.lead'
    >;
    avatar: Attribute.Media;
    tenant: Attribute.Relation<
      'plugin::users-permissions.user',
      'manyToOne',
      'api::tenant.tenant'
    >;
    orders: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToMany',
      'api::order.order'
    >;
    mail_templates: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToMany',
      'api::mail-template.mail-template'
    >;
    payRate: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'api::pay-rate.pay-rate'
    >;
    jobTitle: Attribute.String;
    businessLocation: Attribute.Relation<
      'plugin::users-permissions.user',
      'manyToMany',
      'api::business-location.business-location'
    >;
    articles: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToMany',
      'api::article.article'
    >;
    questions: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToMany',
      'api::question.question'
    >;
    rate: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'api::rate.rate'
    >;
    fileItems: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToMany',
      'api::file-item.file-item'
    >;
    birthdayDate: Attribute.Date;
    shipmentCards: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToMany',
      'api::shipment-card.shipment-card'
    >;
    conversations: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToMany',
      'api::conversation.conversation'
    >;
    contact: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'api::contact.contact'
    >;
    lead: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'api::lead.lead'
    >;
    reportsSchedule: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'api::reports-schedule.reports-schedule'
    >;
    nylasConnection: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'api::nylas-connection.nylas-connection'
    >;
    onboardingUser: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'api::onboarding-user.onboarding-user'
    >;
    exceeded_service: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'api::exceeded-service.exceeded-service'
    >;
    service_performer: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'api::service-performer.service-performer'
    >;
    schedulingAppointments: Attribute.Relation<
      'plugin::users-permissions.user',
      'manyToMany',
      'api::scheduling-appointment.scheduling-appointment'
    >;
    clearentCustomerKey: Attribute.String;
    salesCommission: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'api::sales-commission.sales-commission'
    >;
    preferredCurrency: Attribute.String;
    defaultRoute: Attribute.String;
    trackers: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToMany',
      'api::time-tracker.time-tracker'
    >;
    isGoogleAddressInputEnabled: Attribute.Boolean & Attribute.DefaultTo<true>;
    defaultPaymentTerminalId: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginEmailDesignerEmailTemplate
  extends Schema.CollectionType {
  collectionName: 'email_templates';
  info: {
    singularName: 'email-template';
    pluralName: 'email-templates';
    displayName: 'Email-template';
    name: 'email-template';
  };
  options: {
    draftAndPublish: false;
    timestamps: true;
    increments: true;
    comment: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    templateReferenceId: Attribute.Integer & Attribute.Unique;
    design: Attribute.JSON;
    name: Attribute.String;
    subject: Attribute.String;
    bodyHtml: Attribute.Text;
    bodyText: Attribute.Text;
    enabled: Attribute.Boolean & Attribute.DefaultTo<true>;
    tags: Attribute.JSON;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::email-designer.email-template',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::email-designer.email-template',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginReactIconsIconlibrary extends Schema.CollectionType {
  collectionName: 'iconlibrary';
  info: {
    singularName: 'iconlibrary';
    pluralName: 'iconlibraries';
    displayName: 'IconLibrary';
  };
  options: {
    draftAndPublish: false;
    comment: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    abbreviation: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        maxLength: 3;
      }>;
    isEnabled: Attribute.Boolean & Attribute.DefaultTo<true>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::react-icons.iconlibrary',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::react-icons.iconlibrary',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiAccProductMappingAccProductMapping
  extends Schema.CollectionType {
  collectionName: 'acc_product_mappings';
  info: {
    singularName: 'acc-product-mapping';
    pluralName: 'acc-product-mappings';
    displayName: 'Acc product mapping';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    chartAccount: Attribute.Relation<
      'api::acc-product-mapping.acc-product-mapping',
      'manyToOne',
      'api::chart-account.chart-account'
    >;
    serviceAccountId: Attribute.String & Attribute.Required;
    accServiceConn: Attribute.Relation<
      'api::acc-product-mapping.acc-product-mapping',
      'manyToOne',
      'api::acc-service-conn.acc-service-conn'
    >;
    chartCategory: Attribute.Relation<
      'api::acc-product-mapping.acc-product-mapping',
      'manyToOne',
      'api::chart-category.chart-category'
    >;
    chartSubcategory: Attribute.Relation<
      'api::acc-product-mapping.acc-product-mapping',
      'manyToOne',
      'api::chart-subcategory.chart-subcategory'
    >;
    accountType: Attribute.Enumeration<['account', 'category', 'subCategory']>;
    type: Attribute.Enumeration<['accounts', 'paymentMethods', 'paymentType']> &
      Attribute.Required &
      Attribute.DefaultTo<'accounts'>;
    paymentMethod: Attribute.Relation<
      'api::acc-product-mapping.acc-product-mapping',
      'manyToOne',
      'api::payment-method.payment-method'
    >;
    accountingServiceType: Attribute.Enumeration<
      ['quickBooks', 'xero', 'sage']
    >;
    paymentType: Attribute.Enumeration<['Cash', 'Check', 'CreditCard']>;
    depositToAccount: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::acc-product-mapping.acc-product-mapping',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::acc-product-mapping.acc-product-mapping',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiAccServiceBillAccServiceBill extends Schema.CollectionType {
  collectionName: 'acc_service_bills';
  info: {
    singularName: 'acc-service-bill';
    pluralName: 'acc-service-bills';
    displayName: 'Acc service bill';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    syncToken: Attribute.String;
    serviceType: Attribute.Enumeration<['quickBooks', 'xero', 'sage']> &
      Attribute.Required;
    status: Attribute.Enumeration<['open', 'close']> &
      Attribute.DefaultTo<'open'>;
    isSynced: Attribute.Boolean & Attribute.DefaultTo<false>;
    syncDate: Attribute.DateTime;
    accountingServiceId: Attribute.String & Attribute.Required;
    accServiceTxns: Attribute.Relation<
      'api::acc-service-bill.acc-service-bill',
      'oneToMany',
      'api::acc-service-txn.acc-service-txn'
    >;
    accServiceContact: Attribute.Relation<
      'api::acc-service-bill.acc-service-bill',
      'manyToOne',
      'api::acc-service-contact.acc-service-contact'
    >;
    company: Attribute.Relation<
      'api::acc-service-bill.acc-service-bill',
      'manyToOne',
      'api::company.company'
    >;
    contact: Attribute.Relation<
      'api::acc-service-bill.acc-service-bill',
      'manyToOne',
      'api::contact.contact'
    >;
    dealTransaction: Attribute.Relation<
      'api::acc-service-bill.acc-service-bill',
      'oneToOne',
      'api::deal-transaction.deal-transaction'
    >;
    sellingOrder: Attribute.Relation<
      'api::acc-service-bill.acc-service-bill',
      'manyToOne',
      'api::order.order'
    >;
    accServiceFiles: Attribute.Relation<
      'api::acc-service-bill.acc-service-bill',
      'oneToMany',
      'api::acc-service-file.acc-service-file'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::acc-service-bill.acc-service-bill',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::acc-service-bill.acc-service-bill',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiAccServiceConnAccServiceConn extends Schema.CollectionType {
  collectionName: 'acc_service_conns';
  info: {
    singularName: 'acc-service-conn';
    pluralName: 'acc-service-conns';
    displayName: 'Acc service conn';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    tenant: Attribute.Relation<
      'api::acc-service-conn.acc-service-conn',
      'manyToOne',
      'api::tenant.tenant'
    >;
    serviceType: Attribute.Enumeration<['quickBooks', 'xero', 'sage']> &
      Attribute.Required;
    businessLocation: Attribute.Relation<
      'api::acc-service-conn.acc-service-conn',
      'manyToOne',
      'api::business-location.business-location'
    >;
    serviceJson: Attribute.JSON & Attribute.Required;
    accProductMappings: Attribute.Relation<
      'api::acc-service-conn.acc-service-conn',
      'oneToMany',
      'api::acc-product-mapping.acc-product-mapping'
    >;
    accServiceContacts: Attribute.Relation<
      'api::acc-service-conn.acc-service-conn',
      'oneToMany',
      'api::acc-service-contact.acc-service-contact'
    >;
    accServiceEntities: Attribute.Relation<
      'api::acc-service-conn.acc-service-conn',
      'oneToMany',
      'api::acc-service-entity.acc-service-entity'
    >;
    accServiceVendors: Attribute.Relation<
      'api::acc-service-conn.acc-service-conn',
      'oneToMany',
      'api::acc-service-vendor.acc-service-vendor'
    >;
    isProductNotSynced: Attribute.Boolean & Attribute.DefaultTo<false>;
    isServiceNotSynced: Attribute.Boolean & Attribute.DefaultTo<false>;
    isContactNotSynced: Attribute.Boolean & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::acc-service-conn.acc-service-conn',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::acc-service-conn.acc-service-conn',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiAccServiceContactAccServiceContact
  extends Schema.CollectionType {
  collectionName: 'acc_service_contacts';
  info: {
    singularName: 'acc-service-contact';
    pluralName: 'acc-service-contacts';
    displayName: 'Acc service contact';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    contact: Attribute.Relation<
      'api::acc-service-contact.acc-service-contact',
      'manyToOne',
      'api::contact.contact'
    >;
    syncToken: Attribute.String;
    businessLocation: Attribute.Relation<
      'api::acc-service-contact.acc-service-contact',
      'manyToOne',
      'api::business-location.business-location'
    >;
    syncDate: Attribute.DateTime;
    isSynced: Attribute.Boolean & Attribute.DefaultTo<false>;
    accountingServiceId: Attribute.String & Attribute.Required;
    serviceType: Attribute.Enumeration<['quickBooks', 'xero', 'sage']> &
      Attribute.Required;
    accServiceConn: Attribute.Relation<
      'api::acc-service-contact.acc-service-contact',
      'manyToOne',
      'api::acc-service-conn.acc-service-conn'
    >;
    accServiceBills: Attribute.Relation<
      'api::acc-service-contact.acc-service-contact',
      'oneToMany',
      'api::acc-service-bill.acc-service-bill'
    >;
    company: Attribute.Relation<
      'api::acc-service-contact.acc-service-contact',
      'manyToOne',
      'api::company.company'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::acc-service-contact.acc-service-contact',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::acc-service-contact.acc-service-contact',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiAccServiceEntityAccServiceEntity
  extends Schema.CollectionType {
  collectionName: 'acc_service_entities';
  info: {
    singularName: 'acc-service-entity';
    pluralName: 'acc-service-entities';
    displayName: 'Acc service entity';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    syncToken: Attribute.String & Attribute.Required;
    businessLocation: Attribute.Relation<
      'api::acc-service-entity.acc-service-entity',
      'manyToOne',
      'api::business-location.business-location'
    >;
    product: Attribute.Relation<
      'api::acc-service-entity.acc-service-entity',
      'manyToOne',
      'api::product.product'
    >;
    service: Attribute.Relation<
      'api::acc-service-entity.acc-service-entity',
      'manyToOne',
      'api::service.service'
    >;
    type: Attribute.Enumeration<['product', 'service', 'class', 'membership']> &
      Attribute.Required &
      Attribute.DefaultTo<'product'>;
    syncDate: Attribute.DateTime;
    isSynced: Attribute.Boolean & Attribute.DefaultTo<false>;
    accountingServiceId: Attribute.String & Attribute.Required;
    serviceType: Attribute.Enumeration<['quickBooks', 'xero', 'sage']> &
      Attribute.Required;
    accServiceConn: Attribute.Relation<
      'api::acc-service-entity.acc-service-entity',
      'manyToOne',
      'api::acc-service-conn.acc-service-conn'
    >;
    class: Attribute.Relation<
      'api::acc-service-entity.acc-service-entity',
      'manyToOne',
      'api::class.class'
    >;
    membership: Attribute.Relation<
      'api::acc-service-entity.acc-service-entity',
      'manyToOne',
      'api::membership.membership'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::acc-service-entity.acc-service-entity',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::acc-service-entity.acc-service-entity',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiAccServiceFileAccServiceFile extends Schema.CollectionType {
  collectionName: 'acc_service_files';
  info: {
    singularName: 'acc-service-file';
    pluralName: 'acc-service-files';
    displayName: 'Acc service file';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    syncToken: Attribute.String & Attribute.Required;
    accountingServiceId: Attribute.String & Attribute.Required;
    isSynced: Attribute.Boolean & Attribute.DefaultTo<false>;
    syncDate: Attribute.DateTime;
    accServiceOrder: Attribute.Relation<
      'api::acc-service-file.acc-service-file',
      'manyToOne',
      'api::acc-service-order.acc-service-order'
    >;
    serviceType: Attribute.Enumeration<['quickBooks', 'xero', 'sage']> &
      Attribute.Required;
    accServiceBill: Attribute.Relation<
      'api::acc-service-file.acc-service-file',
      'manyToOne',
      'api::acc-service-bill.acc-service-bill'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::acc-service-file.acc-service-file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::acc-service-file.acc-service-file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiAccServiceOrderAccServiceOrder
  extends Schema.CollectionType {
  collectionName: 'acc_service_orders';
  info: {
    singularName: 'acc-service-order';
    pluralName: 'acc-service-orders';
    displayName: 'Acc service order';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    syncToken: Attribute.String;
    syncDate: Attribute.DateTime;
    isSynced: Attribute.Boolean & Attribute.DefaultTo<false>;
    accountingServiceId: Attribute.String & Attribute.Required;
    serviceType: Attribute.Enumeration<['quickBooks', 'xero', 'sage']> &
      Attribute.Required;
    sellingOrder: Attribute.Relation<
      'api::acc-service-order.acc-service-order',
      'manyToOne',
      'api::order.order'
    >;
    businessLocation: Attribute.Relation<
      'api::acc-service-order.acc-service-order',
      'manyToOne',
      'api::business-location.business-location'
    >;
    accServiceFiles: Attribute.Relation<
      'api::acc-service-order.acc-service-order',
      'oneToMany',
      'api::acc-service-file.acc-service-file'
    >;
    invoiceLineItems: Attribute.JSON;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::acc-service-order.acc-service-order',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::acc-service-order.acc-service-order',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiAccServiceTaxAccServiceTax extends Schema.CollectionType {
  collectionName: 'acc_service_taxes';
  info: {
    singularName: 'acc-service-tax';
    pluralName: 'acc-service-taxes';
    displayName: 'Acc service tax';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    tax: Attribute.Relation<
      'api::acc-service-tax.acc-service-tax',
      'manyToOne',
      'api::tax.tax'
    >;
    businessLocation: Attribute.Relation<
      'api::acc-service-tax.acc-service-tax',
      'manyToOne',
      'api::business-location.business-location'
    >;
    accountingServiceId: Attribute.String & Attribute.Required;
    serviceType: Attribute.Enumeration<['quickBooks', 'xero', 'sage']> &
      Attribute.Required;
    syncToken: Attribute.String & Attribute.Required;
    syncDate: Attribute.DateTime;
    isSynced: Attribute.Boolean & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::acc-service-tax.acc-service-tax',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::acc-service-tax.acc-service-tax',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiAccServiceTaxagnAccServiceTaxagn
  extends Schema.CollectionType {
  collectionName: 'acc_service_taxagns';
  info: {
    singularName: 'acc-service-taxagn';
    pluralName: 'acc-service-taxagns';
    displayName: 'Acc service taxagn';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    syncToken: Attribute.String;
    taxAuthority: Attribute.Relation<
      'api::acc-service-taxagn.acc-service-taxagn',
      'manyToOne',
      'api::tax-authority.tax-authority'
    >;
    isSynced: Attribute.Boolean & Attribute.DefaultTo<false>;
    accountingServiceId: Attribute.String & Attribute.Required;
    syncDate: Attribute.DateTime;
    serviceType: Attribute.Enumeration<['quickBooks', 'xero', 'sage']> &
      Attribute.Required;
    businessLocation: Attribute.Relation<
      'api::acc-service-taxagn.acc-service-taxagn',
      'manyToOne',
      'api::business-location.business-location'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::acc-service-taxagn.acc-service-taxagn',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::acc-service-taxagn.acc-service-taxagn',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiAccServiceTrackAccServiceTrack
  extends Schema.CollectionType {
  collectionName: 'acc_service_tracks';
  info: {
    singularName: 'acc-service-track';
    pluralName: 'acc-service-tracks';
    displayName: 'Acc service track';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    accountingServiceId: Attribute.String & Attribute.Required;
    tenant: Attribute.Relation<
      'api::acc-service-track.acc-service-track',
      'manyToOne',
      'api::tenant.tenant'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::acc-service-track.acc-service-track',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::acc-service-track.acc-service-track',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiAccServiceTxnAccServiceTxn extends Schema.CollectionType {
  collectionName: 'acc_service_txns';
  info: {
    singularName: 'acc-service-txn';
    pluralName: 'acc-service-txns';
    displayName: 'Acc service txn';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    syncToken: Attribute.String;
    syncDate: Attribute.DateTime;
    isSynced: Attribute.Boolean & Attribute.DefaultTo<false>;
    accountingServiceId: Attribute.String & Attribute.Required;
    serviceType: Attribute.Enumeration<['quickBooks', 'xero', 'sage']> &
      Attribute.Required;
    businessLocation: Attribute.Relation<
      'api::acc-service-txn.acc-service-txn',
      'manyToOne',
      'api::business-location.business-location'
    >;
    transactionType: Attribute.Enumeration<['sell', 'billPayment']>;
    accServiceBill: Attribute.Relation<
      'api::acc-service-txn.acc-service-txn',
      'manyToOne',
      'api::acc-service-bill.acc-service-bill'
    >;
    dealTransaction: Attribute.Relation<
      'api::acc-service-txn.acc-service-txn',
      'oneToOne',
      'api::deal-transaction.deal-transaction'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::acc-service-txn.acc-service-txn',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::acc-service-txn.acc-service-txn',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiAccServiceVendorAccServiceVendor
  extends Schema.CollectionType {
  collectionName: 'acc_service_vendors';
  info: {
    singularName: 'acc-service-vendor';
    pluralName: 'acc-service-vendors';
    displayName: 'Acc service vendor';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    syncToken: Attribute.String & Attribute.Required;
    syncDate: Attribute.DateTime;
    isSynced: Attribute.Boolean & Attribute.DefaultTo<false>;
    accountingServiceId: Attribute.String & Attribute.Required;
    serviceType: Attribute.Enumeration<['quickBooks', 'xero', 'sage']> &
      Attribute.Required;
    businessLocation: Attribute.Relation<
      'api::acc-service-vendor.acc-service-vendor',
      'manyToOne',
      'api::business-location.business-location'
    >;
    accServiceConn: Attribute.Relation<
      'api::acc-service-vendor.acc-service-vendor',
      'manyToOne',
      'api::acc-service-conn.acc-service-conn'
    >;
    contact: Attribute.Relation<
      'api::acc-service-vendor.acc-service-vendor',
      'manyToOne',
      'api::contact.contact'
    >;
    company: Attribute.Relation<
      'api::acc-service-vendor.acc-service-vendor',
      'manyToOne',
      'api::company.company'
    >;
    type: Attribute.Enumeration<['contact', 'company']>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::acc-service-vendor.acc-service-vendor',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::acc-service-vendor.acc-service-vendor',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiActivityActivity extends Schema.CollectionType {
  collectionName: 'activities';
  info: {
    singularName: 'activity';
    pluralName: 'activities';
    displayName: 'Activity';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
    description: Attribute.Text;
    notes: Attribute.Text &
      Attribute.SetMinMaxLength<{
        maxLength: 10000;
      }>;
    contact_id: Attribute.Relation<
      'api::activity.activity',
      'manyToOne',
      'api::contact.contact'
    >;
    company_id: Attribute.Relation<
      'api::activity.activity',
      'manyToOne',
      'api::company.company'
    >;
    lead_id: Attribute.Relation<
      'api::activity.activity',
      'manyToOne',
      'api::lead.lead'
    >;
    completed: Attribute.Boolean & Attribute.DefaultTo<false>;
    assignees: Attribute.Relation<
      'api::activity.activity',
      'oneToMany',
      'plugin::users-permissions.user'
    >;
    due_date: Attribute.DateTime;
    appointmentDate: Attribute.DateTime;
    owner: Attribute.Relation<
      'api::activity.activity',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    task: Attribute.Relation<
      'api::activity.activity',
      'oneToOne',
      'api::task.task'
    >;
    tenant: Attribute.Relation<
      'api::activity.activity',
      'oneToOne',
      'api::tenant.tenant'
    >;
    amount: Attribute.Float;
    type: Attribute.Enumeration<
      [
        'task',
        'meeting',
        'email',
        'voice mail',
        'points',
        'call',
        'purchase',
        'record',
        'review',
        'conversation',
        'return',
        'appraisal',
        'deal',
        'note',
        'shopify',
        'send',
      ]
    > &
      Attribute.DefaultTo<'meeting'>;
    priority: Attribute.Enumeration<['high', 'medium', 'low', 'inactive']> &
      Attribute.DefaultTo<'low'>;
    order: Attribute.Relation<
      'api::activity.activity',
      'oneToOne',
      'api::order.order'
    >;
    call: Attribute.Relation<
      'api::activity.activity',
      'oneToOne',
      'api::call.call'
    >;
    completedDate: Attribute.DateTime;
    review: Attribute.Relation<
      'api::activity.activity',
      'oneToOne',
      'api::review.review'
    >;
    conversation: Attribute.Relation<
      'api::activity.activity',
      'oneToOne',
      'api::conversation.conversation'
    >;
    customCreationDate: Attribute.DateTime;
    returnInfo: Attribute.Relation<
      'api::activity.activity',
      'oneToOne',
      'api::return.return'
    >;
    deal: Attribute.Relation<
      'api::activity.activity',
      'oneToOne',
      'api::deal.deal'
    >;
    appraisal: Attribute.Relation<
      'api::activity.activity',
      'oneToOne',
      'api::appraisal.appraisal'
    >;
    businessLocation: Attribute.Relation<
      'api::activity.activity',
      'oneToOne',
      'api::business-location.business-location'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::activity.activity',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::activity.activity',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiAppraisalAppraisal extends Schema.CollectionType {
  collectionName: 'appraisals';
  info: {
    singularName: 'appraisal';
    pluralName: 'appraisals';
    displayName: 'CONTRACTS: Appraisal';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    title: Attribute.String;
    uuid: Attribute.UID & Attribute.CustomField<'plugin::field-uuid.uuid'>;
    files: Attribute.Media;
    documentDate: Attribute.DateTime;
    signature: Attribute.RichText;
    employee: Attribute.Relation<
      'api::appraisal.appraisal',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    pdf: Attribute.Media;
    retailValue: Attribute.Integer;
    description: Attribute.RichText;
    name: Attribute.String;
    appraisalId: Attribute.String;
    tenant: Attribute.Relation<
      'api::appraisal.appraisal',
      'oneToOne',
      'api::tenant.tenant'
    >;
    terms: Attribute.Text;
    product: Attribute.Relation<
      'api::appraisal.appraisal',
      'oneToOne',
      'api::product.product'
    >;
    contact: Attribute.Relation<
      'api::appraisal.appraisal',
      'oneToOne',
      'api::contact.contact'
    >;
    ownDocuments: Attribute.Media;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::appraisal.appraisal',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::appraisal.appraisal',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiApprovalMethodApprovalMethod extends Schema.CollectionType {
  collectionName: 'approval_methods';
  info: {
    singularName: 'approval-method';
    pluralName: 'approval-methods';
    displayName: 'TASKS: Approval Method';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    tenant: Attribute.Relation<
      'api::approval-method.approval-method',
      'oneToOne',
      'api::tenant.tenant'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::approval-method.approval-method',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::approval-method.approval-method',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiArticleArticle extends Schema.CollectionType {
  collectionName: 'articles';
  info: {
    singularName: 'article';
    pluralName: 'articles';
    displayName: 'Article';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    title: Attribute.String;
    body: Attribute.Text;
    image: Attribute.Media;
    owner: Attribute.Relation<
      'api::article.article',
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    active: Attribute.Boolean & Attribute.DefaultTo<false>;
    tenant: Attribute.Relation<
      'api::article.article',
      'oneToOne',
      'api::tenant.tenant'
    >;
    sentToSubscribers: Attribute.Boolean & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::article.article',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::article.article',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiAuthLayoutAuthLayout extends Schema.SingleType {
  collectionName: 'auth_layouts';
  info: {
    singularName: 'auth-layout';
    pluralName: 'auth-layouts';
    displayName: 'AuthLayout';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    headline: Attribute.Component<'ui.headline'> & Attribute.Required;
    authContent: Attribute.Component<'ui.auth-content'> & Attribute.Required;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::auth-layout.auth-layout',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::auth-layout.auth-layout',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiBackingBacking extends Schema.CollectionType {
  collectionName: 'backings';
  info: {
    singularName: 'backing';
    pluralName: 'backings';
    displayName: 'INVENTORY: Backing';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    tenant: Attribute.Relation<
      'api::backing.backing',
      'oneToOne',
      'api::tenant.tenant'
    >;
    jewelryProductType: Attribute.Relation<
      'api::backing.backing',
      'manyToOne',
      'api::jewelry-product-type.jewelry-product-type'
    >;
    editable: Attribute.Boolean & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::backing.backing',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::backing.backing',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiBoxPaperBoxPaper extends Schema.CollectionType {
  collectionName: 'box_papers';
  info: {
    singularName: 'box-paper';
    pluralName: 'box-papers';
    displayName: 'INVENTORY: Box Paper';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    tenant: Attribute.Relation<
      'api::box-paper.box-paper',
      'oneToOne',
      'api::tenant.tenant'
    >;
    jewelryProductType: Attribute.Relation<
      'api::box-paper.box-paper',
      'manyToOne',
      'api::jewelry-product-type.jewelry-product-type'
    >;
    editable: Attribute.Boolean & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::box-paper.box-paper',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::box-paper.box-paper',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiBulkImagesNotifyBulkImagesNotify
  extends Schema.CollectionType {
  collectionName: 'bulk_images_notifies';
  info: {
    singularName: 'bulk-images-notify';
    pluralName: 'bulk-images-notifies';
    displayName: 'NOTIFICATIONS: Bulk Images Notify';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    userNotifies: Attribute.Relation<
      'api::bulk-images-notify.bulk-images-notify',
      'oneToMany',
      'api::user-notification.user-notification'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::bulk-images-notify.bulk-images-notify',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::bulk-images-notify.bulk-images-notify',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiBusinessLocationBusinessLocation
  extends Schema.CollectionType {
  collectionName: 'business_locations';
  info: {
    singularName: 'business-location';
    pluralName: 'business-locations';
    displayName: 'Business Location';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    location: Attribute.Relation<
      'api::business-location.business-location',
      'oneToOne',
      'api::location.location'
    >;
    name: Attribute.String;
    email: Attribute.Email;
    tenant: Attribute.Relation<
      'api::business-location.business-location',
      'oneToOne',
      'api::tenant.tenant'
    >;
    archived: Attribute.Boolean & Attribute.DefaultTo<false>;
    phoneNumber: Attribute.String & Attribute.Required;
    type: Attribute.Enumeration<['store', 'warehouse']> &
      Attribute.Required &
      Attribute.DefaultTo<'store'>;
    orders: Attribute.Relation<
      'api::business-location.business-location',
      'oneToMany',
      'api::order.order'
    >;
    users: Attribute.Relation<
      'api::business-location.business-location',
      'manyToMany',
      'plugin::users-permissions.user'
    >;
    tax: Attribute.Relation<
      'api::business-location.business-location',
      'oneToOne',
      'api::tax.tax'
    >;
    uuid: Attribute.UID & Attribute.CustomField<'plugin::field-uuid.uuid'>;
    businessLocationId: Attribute.String & Attribute.Unique;
    isSublocation: Attribute.Boolean;
    sublocations: Attribute.Relation<
      'api::business-location.business-location',
      'oneToMany',
      'api::sublocation.sublocation'
    >;
    graphItem: Attribute.Text;
    reviewLink: Attribute.String;
    ecommerceDetails: Attribute.Relation<
      'api::business-location.business-location',
      'oneToMany',
      'api::ecommerce-detail.ecommerce-detail'
    >;
    taxCollection: Attribute.Relation<
      'api::business-location.business-location',
      'oneToOne',
      'api::tax-collection.tax-collection'
    >;
    accServiceContacts: Attribute.Relation<
      'api::business-location.business-location',
      'oneToMany',
      'api::acc-service-contact.acc-service-contact'
    >;
    accServiceVendors: Attribute.Relation<
      'api::business-location.business-location',
      'oneToMany',
      'api::acc-service-vendor.acc-service-vendor'
    >;
    accServiceConns: Attribute.Relation<
      'api::business-location.business-location',
      'oneToMany',
      'api::acc-service-conn.acc-service-conn'
    >;
    accServiceEntities: Attribute.Relation<
      'api::business-location.business-location',
      'oneToMany',
      'api::acc-service-entity.acc-service-entity'
    >;
    accServiceTaxes: Attribute.Relation<
      'api::business-location.business-location',
      'oneToMany',
      'api::acc-service-tax.acc-service-tax'
    >;
    accServiceTxns: Attribute.Relation<
      'api::business-location.business-location',
      'oneToMany',
      'api::acc-service-txn.acc-service-txn'
    >;
    accServiceOrders: Attribute.Relation<
      'api::business-location.business-location',
      'oneToMany',
      'api::acc-service-order.acc-service-order'
    >;
    accServiceTaxagn: Attribute.Relation<
      'api::business-location.business-location',
      'oneToMany',
      'api::acc-service-taxagn.acc-service-taxagn'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::business-location.business-location',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::business-location.business-location',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiCallCall extends Schema.CollectionType {
  collectionName: 'calls';
  info: {
    singularName: 'call';
    pluralName: 'calls';
    displayName: 'Call';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    tenant: Attribute.Relation<
      'api::call.call',
      'oneToOne',
      'api::tenant.tenant'
    >;
    to: Attribute.String;
    from: Attribute.String;
    callSid: Attribute.String;
    status: Attribute.String;
    identity: Attribute.String;
    record: Attribute.String;
    transcription: Attribute.String;
    recordSid: Attribute.String;
    parentCallSid: Attribute.String;
    duration: Attribute.String;
    recordSource: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::call.call', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'api::call.call', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface ApiCampaignCampaign extends Schema.CollectionType {
  collectionName: 'campaigns';
  info: {
    singularName: 'campaign';
    pluralName: 'campaigns';
    displayName: 'MARKETING: Campaign';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    uuid: Attribute.UID & Attribute.CustomField<'plugin::field-uuid.uuid'>;
    name: Attribute.String;
    description: Attribute.String;
    campaignOwner: Attribute.Relation<
      'api::campaign.campaign',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    unsubscribedContacts: Attribute.Relation<
      'api::campaign.campaign',
      'manyToMany',
      'api::contact.contact'
    >;
    sequenceSteps: Attribute.Relation<
      'api::campaign.campaign',
      'oneToMany',
      'api::sequence-step.sequence-step'
    >;
    tenant: Attribute.Relation<
      'api::campaign.campaign',
      'oneToOne',
      'api::tenant.tenant'
    >;
    enrolledContacts: Attribute.Relation<
      'api::campaign.campaign',
      'oneToMany',
      'api::campaign-enrolled-contact.campaign-enrolled-contact'
    >;
    campaignEnrolledLeads: Attribute.Relation<
      'api::campaign.campaign',
      'oneToMany',
      'api::campaign-enrolled-lead.campaign-enrolled-lead'
    >;
    enrolledContactConditions: Attribute.Relation<
      'api::campaign.campaign',
      'oneToMany',
      'api::enrolled-contact-condition.enrolled-contact-condition'
    >;
    enrolledLeadConditions: Attribute.Relation<
      'api::campaign.campaign',
      'oneToMany',
      'api::enrolled-lead-condition.enrolled-lead-condition'
    >;
    isActive: Attribute.Boolean & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::campaign.campaign',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::campaign.campaign',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiCampaignEnrolledContactCampaignEnrolledContact
  extends Schema.CollectionType {
  collectionName: 'campaign_enrolled_contacts';
  info: {
    singularName: 'campaign-enrolled-contact';
    pluralName: 'campaign-enrolled-contacts';
    displayName: 'MARKETING: Campaign Enrolled Contact';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    type: Attribute.Enumeration<['manually', 'automated']>;
    isUnsubscribed: Attribute.Boolean & Attribute.DefaultTo<false>;
    contact: Attribute.Relation<
      'api::campaign-enrolled-contact.campaign-enrolled-contact',
      'manyToOne',
      'api::contact.contact'
    >;
    campaign: Attribute.Relation<
      'api::campaign-enrolled-contact.campaign-enrolled-contact',
      'manyToOne',
      'api::campaign.campaign'
    >;
    tenant: Attribute.Relation<
      'api::campaign-enrolled-contact.campaign-enrolled-contact',
      'oneToOne',
      'api::tenant.tenant'
    >;
    sequenceStep: Attribute.Integer;
    prevStep: Attribute.Integer;
    token: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::campaign-enrolled-contact.campaign-enrolled-contact',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::campaign-enrolled-contact.campaign-enrolled-contact',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiCampaignEnrolledLeadCampaignEnrolledLead
  extends Schema.CollectionType {
  collectionName: 'campaign_enrolled_leads';
  info: {
    singularName: 'campaign-enrolled-lead';
    pluralName: 'campaign-enrolled-leads';
    displayName: 'MARKETING: Campaign Enrolled Lead';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    type: Attribute.Enumeration<['manually', 'automated']>;
    isUnsubscribed: Attribute.Boolean & Attribute.DefaultTo<false>;
    lead: Attribute.Relation<
      'api::campaign-enrolled-lead.campaign-enrolled-lead',
      'manyToOne',
      'api::lead.lead'
    >;
    campaign: Attribute.Relation<
      'api::campaign-enrolled-lead.campaign-enrolled-lead',
      'manyToOne',
      'api::campaign.campaign'
    >;
    tenant: Attribute.Relation<
      'api::campaign-enrolled-lead.campaign-enrolled-lead',
      'oneToOne',
      'api::tenant.tenant'
    >;
    sequenceStep: Attribute.Integer;
    prevStep: Attribute.Integer;
    token: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::campaign-enrolled-lead.campaign-enrolled-lead',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::campaign-enrolled-lead.campaign-enrolled-lead',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiCarrierCarrier extends Schema.CollectionType {
  collectionName: 'carriers';
  info: {
    singularName: 'carrier';
    pluralName: 'carriers';
    displayName: 'Carrier';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::carrier.carrier',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::carrier.carrier',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiChartAccountChartAccount extends Schema.CollectionType {
  collectionName: 'chart_accounts';
  info: {
    singularName: 'chart-account';
    pluralName: 'chart-accounts';
    displayName: 'Chart Account';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String & Attribute.Required & Attribute.Unique;
    type: Attribute.Enumeration<['income', 'cost']> & Attribute.Required;
    description: Attribute.Text;
    chartCategories: Attribute.Relation<
      'api::chart-account.chart-account',
      'oneToMany',
      'api::chart-category.chart-category'
    >;
    chartSubcategories: Attribute.Relation<
      'api::chart-account.chart-account',
      'oneToMany',
      'api::chart-subcategory.chart-subcategory'
    >;
    dealTransactions: Attribute.Relation<
      'api::chart-account.chart-account',
      'oneToMany',
      'api::deal-transaction.deal-transaction'
    >;
    accProductMappings: Attribute.Relation<
      'api::chart-account.chart-account',
      'oneToMany',
      'api::acc-product-mapping.acc-product-mapping'
    >;
    products: Attribute.Relation<
      'api::chart-account.chart-account',
      'oneToMany',
      'api::product.product'
    >;
    services: Attribute.Relation<
      'api::chart-account.chart-account',
      'oneToMany',
      'api::service.service'
    >;
    classes: Attribute.Relation<
      'api::chart-account.chart-account',
      'oneToMany',
      'api::class.class'
    >;
    memberships: Attribute.Relation<
      'api::chart-account.chart-account',
      'oneToMany',
      'api::class.class'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::chart-account.chart-account',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::chart-account.chart-account',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiChartCategoryChartCategory extends Schema.CollectionType {
  collectionName: 'chart_categories';
  info: {
    singularName: 'chart-category';
    pluralName: 'chart-categories';
    displayName: 'Chart Category';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    description: Attribute.Text;
    chartAccount: Attribute.Relation<
      'api::chart-category.chart-category',
      'manyToOne',
      'api::chart-account.chart-account'
    >;
    chartSubcategories: Attribute.Relation<
      'api::chart-category.chart-category',
      'oneToMany',
      'api::chart-subcategory.chart-subcategory'
    >;
    dealTransactions: Attribute.Relation<
      'api::chart-category.chart-category',
      'oneToMany',
      'api::deal-transaction.deal-transaction'
    >;
    tenant: Attribute.Relation<
      'api::chart-category.chart-category',
      'oneToOne',
      'api::tenant.tenant'
    >;
    accProductMappings: Attribute.Relation<
      'api::chart-category.chart-category',
      'oneToMany',
      'api::acc-product-mapping.acc-product-mapping'
    >;
    products: Attribute.Relation<
      'api::chart-category.chart-category',
      'oneToMany',
      'api::product.product'
    >;
    services: Attribute.Relation<
      'api::chart-category.chart-category',
      'oneToMany',
      'api::service.service'
    >;
    classes: Attribute.Relation<
      'api::chart-category.chart-category',
      'oneToMany',
      'api::class.class'
    >;
    memberships: Attribute.Relation<
      'api::chart-category.chart-category',
      'oneToMany',
      'api::class.class'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::chart-category.chart-category',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::chart-category.chart-category',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiChartSubcategoryChartSubcategory
  extends Schema.CollectionType {
  collectionName: 'chart_subcategories';
  info: {
    singularName: 'chart-subcategory';
    pluralName: 'chart-subcategories';
    displayName: 'Chart Subcategory';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    description: Attribute.Text;
    chartAccount: Attribute.Relation<
      'api::chart-subcategory.chart-subcategory',
      'manyToOne',
      'api::chart-account.chart-account'
    >;
    chartCategory: Attribute.Relation<
      'api::chart-subcategory.chart-subcategory',
      'manyToOne',
      'api::chart-category.chart-category'
    >;
    dealTransactions: Attribute.Relation<
      'api::chart-subcategory.chart-subcategory',
      'oneToMany',
      'api::deal-transaction.deal-transaction'
    >;
    tenant: Attribute.Relation<
      'api::chart-subcategory.chart-subcategory',
      'oneToOne',
      'api::tenant.tenant'
    >;
    accProductMappings: Attribute.Relation<
      'api::chart-subcategory.chart-subcategory',
      'oneToMany',
      'api::acc-product-mapping.acc-product-mapping'
    >;
    products: Attribute.Relation<
      'api::chart-subcategory.chart-subcategory',
      'oneToMany',
      'api::product.product'
    >;
    services: Attribute.Relation<
      'api::chart-subcategory.chart-subcategory',
      'oneToMany',
      'api::service.service'
    >;
    classes: Attribute.Relation<
      'api::chart-subcategory.chart-subcategory',
      'oneToMany',
      'api::class.class'
    >;
    memberships: Attribute.Relation<
      'api::chart-subcategory.chart-subcategory',
      'oneToMany',
      'api::class.class'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::chart-subcategory.chart-subcategory',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::chart-subcategory.chart-subcategory',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiChatNotificationChatNotification
  extends Schema.CollectionType {
  collectionName: 'chat_notifications';
  info: {
    singularName: 'chat-notification';
    pluralName: 'chat-notifications';
    displayName: 'MESSAGING: Chat Notification';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    isActive: Attribute.Boolean & Attribute.DefaultTo<false>;
    tenant: Attribute.Relation<
      'api::chat-notification.chat-notification',
      'oneToOne',
      'api::tenant.tenant'
    >;
    conversation: Attribute.Relation<
      'api::chat-notification.chat-notification',
      'manyToOne',
      'api::conversation.conversation'
    >;
    webChatConversation: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::chat-notification.chat-notification',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::chat-notification.chat-notification',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiClassClass extends Schema.CollectionType {
  collectionName: 'classes';
  info: {
    singularName: 'class';
    pluralName: 'classes';
    displayName: 'Class';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    description: Attribute.Text;
    tax: Attribute.Relation<'api::class.class', 'oneToOne', 'api::tax.tax'>;
    tenant: Attribute.Relation<
      'api::class.class',
      'oneToOne',
      'api::tenant.tenant'
    >;
    files: Attribute.Media;
    showOnline: Attribute.Boolean & Attribute.DefaultTo<false>;
    workshop: Attribute.Boolean & Attribute.DefaultTo<false>;
    resourceCounts: Attribute.Relation<
      'api::class.class',
      'oneToMany',
      'api::resource-count.resource-count'
    >;
    selling_class_order_item: Attribute.Relation<
      'api::class.class',
      'oneToOne',
      'api::class-order-item.class-order-item'
    >;
    uuid: Attribute.UID & Attribute.CustomField<'plugin::field-uuid.uuid'>;
    favorite: Attribute.Boolean & Attribute.DefaultTo<false>;
    classLocationInfos: Attribute.Relation<
      'api::class.class',
      'oneToMany',
      'api::class-location-info.class-location-info'
    >;
    defaultPrice: Attribute.Decimal &
      Attribute.Required &
      Attribute.SetMinMax<{
        min: 0;
      }>;
    active: Attribute.Boolean & Attribute.DefaultTo<true>;
    classId: Attribute.String & Attribute.Unique;
    revenue: Attribute.String;
    cost: Attribute.String;
    accServiceEntities: Attribute.Relation<
      'api::class.class',
      'oneToMany',
      'api::acc-service-entity.acc-service-entity'
    >;
    revenueChartAccount: Attribute.Relation<
      'api::class.class',
      'manyToOne',
      'api::chart-account.chart-account'
    >;
    revenueChartCategory: Attribute.Relation<
      'api::class.class',
      'manyToOne',
      'api::chart-category.chart-category'
    >;
    revenueChartSubcategory: Attribute.Relation<
      'api::class.class',
      'manyToOne',
      'api::chart-subcategory.chart-subcategory'
    >;
    costChartAccount: Attribute.Relation<
      'api::class.class',
      'manyToOne',
      'api::chart-account.chart-account'
    >;
    costChartCategory: Attribute.Relation<
      'api::class.class',
      'manyToOne',
      'api::chart-category.chart-category'
    >;
    costChartSubcategory: Attribute.Relation<
      'api::class.class',
      'manyToOne',
      'api::chart-subcategory.chart-subcategory'
    >;
    taxCollection: Attribute.Relation<
      'api::class.class',
      'oneToOne',
      'api::tax-collection.tax-collection'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::class.class',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::class.class',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiClassLocationInfoClassLocationInfo
  extends Schema.CollectionType {
  collectionName: 'class_location_infos';
  info: {
    singularName: 'class-location-info';
    pluralName: 'class-location-infos';
    displayName: 'Class Location Info';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    businessLocation: Attribute.Relation<
      'api::class-location-info.class-location-info',
      'oneToOne',
      'api::business-location.business-location'
    >;
    class: Attribute.Relation<
      'api::class-location-info.class-location-info',
      'manyToOne',
      'api::class.class'
    >;
    classPerformers: Attribute.Relation<
      'api::class-location-info.class-location-info',
      'oneToMany',
      'api::class-performer.class-performer'
    >;
    resourceCounts: Attribute.Relation<
      'api::class-location-info.class-location-info',
      'oneToMany',
      'api::resource-count.resource-count'
    >;
    favorite: Attribute.Boolean & Attribute.DefaultTo<false>;
    uuid: Attribute.UID & Attribute.CustomField<'plugin::field-uuid.uuid'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::class-location-info.class-location-info',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::class-location-info.class-location-info',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiClassOrderItemClassOrderItem extends Schema.CollectionType {
  collectionName: 'class_order_items';
  info: {
    singularName: 'class-order-item';
    pluralName: 'class-order-items';
    displayName: 'SELLING: Class Order Item';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    quantity: Attribute.Integer;
    note: Attribute.Text;
    order: Attribute.Relation<
      'api::class-order-item.class-order-item',
      'manyToOne',
      'api::order.order'
    >;
    purchaseType: Attribute.Enumeration<['buy', 'rent']>;
    itemId: Attribute.String & Attribute.Required;
    price: Attribute.Decimal;
    discounts: Attribute.Relation<
      'api::class-order-item.class-order-item',
      'oneToMany',
      'api::discount.discount'
    >;
    tax: Attribute.Relation<
      'api::class-order-item.class-order-item',
      'oneToOne',
      'api::tax.tax'
    >;
    class: Attribute.Relation<
      'api::class-order-item.class-order-item',
      'manyToOne',
      'api::class-performer.class-performer'
    >;
    status: Attribute.Enumeration<['draft', 'published']> &
      Attribute.DefaultTo<'published'>;
    isShowInvoiceNote: Attribute.Boolean & Attribute.DefaultTo<true>;
    isVisibleInDocs: Attribute.Boolean & Attribute.DefaultTo<true>;
    taxCollection: Attribute.Relation<
      'api::class-order-item.class-order-item',
      'oneToOne',
      'api::tax-collection.tax-collection'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::class-order-item.class-order-item',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::class-order-item.class-order-item',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiClassPerformerClassPerformer extends Schema.CollectionType {
  collectionName: 'class_performers';
  info: {
    singularName: 'class-performer';
    pluralName: 'class-performers';
    displayName: 'Class Performer';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    performer: Attribute.Relation<
      'api::class-performer.class-performer',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    duration: Attribute.Integer;
    pointsGiven: Attribute.Float;
    price: Attribute.Decimal;
    pointsRedeem: Attribute.Float;
    numberOfSessions: Attribute.Integer;
    tenant: Attribute.Relation<
      'api::class-performer.class-performer',
      'oneToOne',
      'api::tenant.tenant'
    >;
    liveStreamPrice: Attribute.Integer;
    classLocationInfo: Attribute.Relation<
      'api::class-performer.class-performer',
      'manyToOne',
      'api::class-location-info.class-location-info'
    >;
    uuid: Attribute.UID & Attribute.CustomField<'plugin::field-uuid.uuid'>;
    selling_class_order_items: Attribute.Relation<
      'api::class-performer.class-performer',
      'oneToMany',
      'api::class-order-item.class-order-item'
    >;
    active: Attribute.Boolean & Attribute.DefaultTo<true>;
    isImported: Attribute.Boolean & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::class-performer.class-performer',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::class-performer.class-performer',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiClearentOnboardingClearentOnboarding
  extends Schema.CollectionType {
  collectionName: 'clearent_onboardings';
  info: {
    singularName: 'clearent-onboarding';
    pluralName: 'clearent-onboardings';
    displayName: 'Clearent Onboarding';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    merchantId: Attribute.String;
    terminalId: Attribute.String;
    hppKey: Attribute.String;
    tenant: Attribute.Relation<
      'api::clearent-onboarding.clearent-onboarding',
      'oneToOne',
      'api::tenant.tenant'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::clearent-onboarding.clearent-onboarding',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::clearent-onboarding.clearent-onboarding',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiClearentTerminalClearentTerminal
  extends Schema.CollectionType {
  collectionName: 'clearent_terminals';
  info: {
    singularName: 'clearent-terminal';
    pluralName: 'clearent-terminals';
    displayName: 'Clearent Terminal';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    displayName: Attribute.String;
    serialNumber: Attribute.String;
    apiKey: Attribute.String;
    tenant: Attribute.Relation<
      'api::clearent-terminal.clearent-terminal',
      'manyToOne',
      'api::tenant.tenant'
    >;
    isActive: Attribute.Boolean & Attribute.DefaultTo<true>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::clearent-terminal.clearent-terminal',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::clearent-terminal.clearent-terminal',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiCompanyCompany extends Schema.CollectionType {
  collectionName: 'companies';
  info: {
    singularName: 'company';
    pluralName: 'companies';
    displayName: 'Company';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    uuid: Attribute.UID & Attribute.CustomField<'plugin::field-uuid.uuid'>;
    website: Attribute.String;
    address: Attribute.String;
    leadOwner: Attribute.Relation<
      'api::company.company',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    industry: Attribute.String;
    avatar: Attribute.Media;
    contacts: Attribute.Relation<
      'api::company.company',
      'oneToMany',
      'api::contact.contact'
    >;
    tenant: Attribute.Relation<
      'api::company.company',
      'oneToOne',
      'api::tenant.tenant'
    >;
    activities: Attribute.Relation<
      'api::company.company',
      'oneToMany',
      'api::activity.activity'
    >;
    todos: Attribute.Relation<
      'api::company.company',
      'oneToMany',
      'api::todo.todo'
    >;
    notes: Attribute.Relation<
      'api::company.company',
      'oneToMany',
      'api::note.note'
    >;
    phoneNumber: Attribute.String;
    email: Attribute.Email;
    dealTransactions: Attribute.Relation<
      'api::company.company',
      'oneToMany',
      'api::deal-transaction.deal-transaction'
    >;
    deals: Attribute.Relation<
      'api::company.company',
      'oneToMany',
      'api::deal.deal'
    >;
    fileItems: Attribute.Relation<
      'api::company.company',
      'oneToMany',
      'api::file-item.file-item'
    >;
    points: Attribute.Float &
      Attribute.SetMinMax<{
        min: 0;
      }> &
      Attribute.DefaultTo<0>;
    customFields: Attribute.JSON;
    type: Attribute.Enumeration<['prospect', 'vendor']> &
      Attribute.DefaultTo<'prospect'>;
    amountSpent: Attribute.Decimal;
    amountOwes: Attribute.Decimal;
    additionalEmails: Attribute.Relation<
      'api::company.company',
      'oneToMany',
      'api::crm-additional-email.crm-additional-email'
    >;
    additionalAddresses: Attribute.Relation<
      'api::company.company',
      'oneToMany',
      'api::crm-additional-address.crm-additional-address'
    >;
    additionalPhoneNumbers: Attribute.Relation<
      'api::company.company',
      'oneToMany',
      'api::crm-additional-phone-number.crm-additional-phone-number'
    >;
    priceGroup: Attribute.Enumeration<['retail', 'wholesale']>;
    clearentCustomerKey: Attribute.String;
    customCreationDate: Attribute.DateTime;
    secondAddress: Attribute.String;
    accServiceContacts: Attribute.Relation<
      'api::company.company',
      'oneToMany',
      'api::acc-service-contact.acc-service-contact'
    >;
    accServiceVendors: Attribute.Relation<
      'api::company.company',
      'oneToMany',
      'api::acc-service-vendor.acc-service-vendor'
    >;
    accServiceBills: Attribute.Relation<
      'api::company.company',
      'oneToMany',
      'api::acc-service-bill.acc-service-bill'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::company.company',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::company.company',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiCompanySettingCompanySetting extends Schema.CollectionType {
  collectionName: 'companies_setting';
  info: {
    singularName: 'company-setting';
    pluralName: 'companies-setting';
    displayName: 'SETTINGS: Company';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    companyName: Attribute.Boolean & Attribute.DefaultTo<true>;
    website: Attribute.Boolean & Attribute.DefaultTo<false>;
    email: Attribute.Boolean & Attribute.DefaultTo<true>;
    companyOwner: Attribute.Boolean & Attribute.DefaultTo<true>;
    companyAddress: Attribute.Boolean & Attribute.DefaultTo<true>;
    phoneNumber: Attribute.Boolean & Attribute.DefaultTo<true>;
    companyType: Attribute.Boolean & Attribute.DefaultTo<true>;
    companyIndustry: Attribute.Boolean & Attribute.DefaultTo<true>;
    priceGroup: Attribute.Boolean & Attribute.DefaultTo<false>;
    tenant: Attribute.Relation<
      'api::company-setting.company-setting',
      'oneToOne',
      'api::tenant.tenant'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::company-setting.company-setting',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::company-setting.company-setting',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiCompositeProductCompositeProduct
  extends Schema.CollectionType {
  collectionName: 'composite_products';
  info: {
    singularName: 'composite-product';
    pluralName: 'composite-products';
    displayName: 'Composite Product';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    description: Attribute.Text;
    defaultPrice: Attribute.Decimal &
      Attribute.Required &
      Attribute.SetMinMax<{
        min: 0;
      }>;
    active: Attribute.Boolean & Attribute.DefaultTo<true>;
    notes: Attribute.Text;
    products: Attribute.Relation<
      'api::composite-product.composite-product',
      'manyToMany',
      'api::product.product'
    >;
    tenant: Attribute.Relation<
      'api::composite-product.composite-product',
      'oneToOne',
      'api::tenant.tenant'
    >;
    code: Attribute.String;
    uuid: Attribute.UID & Attribute.CustomField<'plugin::field-uuid.uuid'>;
    favorite: Attribute.Boolean;
    compositeProductLocationInfos: Attribute.Relation<
      'api::composite-product.composite-product',
      'oneToMany',
      'api::composite-product-location-info.composite-product-location-info'
    >;
    compositeProductId: Attribute.String & Attribute.Unique;
    compositeProductItems: Attribute.Relation<
      'api::composite-product.composite-product',
      'oneToMany',
      'api::composite-product-item-info.composite-product-item-info'
    >;
    costTrackerInfo: Attribute.Relation<
      'api::composite-product.composite-product',
      'oneToOne',
      'api::invt-cmp-trck.invt-cmp-trck'
    >;
    files: Attribute.Media;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::composite-product.composite-product',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::composite-product.composite-product',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiCompositeProductItemInfoCompositeProductItemInfo
  extends Schema.CollectionType {
  collectionName: 'composite_product_item_infos';
  info: {
    singularName: 'composite-product-item-info';
    pluralName: 'composite-product-item-infos';
    displayName: 'Composite Product Item Info';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    product: Attribute.Relation<
      'api::composite-product-item-info.composite-product-item-info',
      'oneToOne',
      'api::product.product'
    >;
    quantity: Attribute.Integer;
    compositeProduct: Attribute.Relation<
      'api::composite-product-item-info.composite-product-item-info',
      'manyToOne',
      'api::composite-product.composite-product'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::composite-product-item-info.composite-product-item-info',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::composite-product-item-info.composite-product-item-info',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiCompositeProductLocationInfoCompositeProductLocationInfo
  extends Schema.CollectionType {
  collectionName: 'composite_product_location_infos';
  info: {
    singularName: 'composite-product-location-info';
    pluralName: 'composite-product-location-infos';
    displayName: 'Composite Product Location Info';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    compositeProduct: Attribute.Relation<
      'api::composite-product-location-info.composite-product-location-info',
      'manyToOne',
      'api::composite-product.composite-product'
    >;
    businessLocation: Attribute.Relation<
      'api::composite-product-location-info.composite-product-location-info',
      'oneToOne',
      'api::business-location.business-location'
    >;
    price: Attribute.Decimal;
    favorite: Attribute.Boolean;
    compositeProductOrderItems: Attribute.Relation<
      'api::composite-product-location-info.composite-product-location-info',
      'oneToMany',
      'api::composite-product-order-item.composite-product-order-item'
    >;
    tenant: Attribute.Relation<
      'api::composite-product-location-info.composite-product-location-info',
      'oneToOne',
      'api::tenant.tenant'
    >;
    active: Attribute.Boolean & Attribute.DefaultTo<true>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::composite-product-location-info.composite-product-location-info',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::composite-product-location-info.composite-product-location-info',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiCompositeProductOrderItemCompositeProductOrderItem
  extends Schema.CollectionType {
  collectionName: 'composite_product_order_items';
  info: {
    singularName: 'composite-product-order-item';
    pluralName: 'composite-product-order-items';
    displayName: 'SELLING: Composite Product Order Item';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    quantity: Attribute.Integer;
    purchaseType: Attribute.Enumeration<['buy', 'rent']>;
    note: Attribute.Text;
    order: Attribute.Relation<
      'api::composite-product-order-item.composite-product-order-item',
      'manyToOne',
      'api::order.order'
    >;
    itemId: Attribute.String & Attribute.Required;
    price: Attribute.Decimal;
    discounts: Attribute.Relation<
      'api::composite-product-order-item.composite-product-order-item',
      'oneToMany',
      'api::discount.discount'
    >;
    tax: Attribute.Relation<
      'api::composite-product-order-item.composite-product-order-item',
      'oneToOne',
      'api::tax.tax'
    >;
    compositeProduct: Attribute.Relation<
      'api::composite-product-order-item.composite-product-order-item',
      'manyToOne',
      'api::composite-product-location-info.composite-product-location-info'
    >;
    status: Attribute.Enumeration<['draft', 'published']> &
      Attribute.DefaultTo<'published'>;
    isShowInvoiceNote: Attribute.Boolean & Attribute.DefaultTo<true>;
    isVisibleInDocs: Attribute.Boolean & Attribute.DefaultTo<true>;
    productOrderItems: Attribute.Relation<
      'api::composite-product-order-item.composite-product-order-item',
      'oneToMany',
      'api::product-order-item.product-order-item'
    >;
    taxCollection: Attribute.Relation<
      'api::composite-product-order-item.composite-product-order-item',
      'oneToOne',
      'api::tax-collection.tax-collection'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::composite-product-order-item.composite-product-order-item',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::composite-product-order-item.composite-product-order-item',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiConditionTypeConditionType extends Schema.CollectionType {
  collectionName: 'condition_types';
  info: {
    singularName: 'condition-type';
    pluralName: 'condition-types';
    displayName: 'INVENTORY: Condition Type';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    tenant: Attribute.Relation<
      'api::condition-type.condition-type',
      'oneToOne',
      'api::tenant.tenant'
    >;
    editable: Attribute.Boolean & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::condition-type.condition-type',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::condition-type.condition-type',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiContactContact extends Schema.CollectionType {
  collectionName: 'contacts';
  info: {
    singularName: 'contact';
    pluralName: 'contacts';
    displayName: 'Contact';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    fullName: Attribute.String;
    uuid: Attribute.UID & Attribute.CustomField<'plugin::field-uuid.uuid'>;
    lead: Attribute.Relation<
      'api::contact.contact',
      'oneToOne',
      'api::lead.lead'
    >;
    phoneNumber: Attribute.String;
    email: Attribute.Email & Attribute.Required;
    company: Attribute.Relation<
      'api::contact.contact',
      'manyToOne',
      'api::company.company'
    >;
    leadOwner: Attribute.Relation<
      'api::contact.contact',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    avatar: Attribute.Media;
    address: Attribute.String;
    tenant: Attribute.Relation<
      'api::contact.contact',
      'oneToOne',
      'api::tenant.tenant'
    >;
    activities: Attribute.Relation<
      'api::contact.contact',
      'oneToMany',
      'api::activity.activity'
    >;
    todos: Attribute.Relation<
      'api::contact.contact',
      'oneToMany',
      'api::todo.todo'
    >;
    notes: Attribute.Relation<
      'api::contact.contact',
      'oneToMany',
      'api::note.note'
    >;
    orders: Attribute.Relation<
      'api::contact.contact',
      'oneToMany',
      'api::order.order'
    >;
    dealTransactions: Attribute.Relation<
      'api::contact.contact',
      'oneToMany',
      'api::deal-transaction.deal-transaction'
    >;
    deals: Attribute.Relation<
      'api::contact.contact',
      'oneToMany',
      'api::deal.deal'
    >;
    unsubscribedCampaigns: Attribute.Relation<
      'api::contact.contact',
      'manyToMany',
      'api::campaign.campaign'
    >;
    fileItems: Attribute.Relation<
      'api::contact.contact',
      'oneToMany',
      'api::file-item.file-item'
    >;
    points: Attribute.Float &
      Attribute.SetMinMax<{
        min: 0;
      }> &
      Attribute.DefaultTo<0>;
    campaignEnrolledContacts: Attribute.Relation<
      'api::contact.contact',
      'oneToMany',
      'api::campaign-enrolled-contact.campaign-enrolled-contact'
    >;
    birthdayDate: Attribute.Date;
    jobTitle: Attribute.String;
    pastLead: Attribute.Relation<
      'api::contact.contact',
      'oneToOne',
      'api::lead.lead'
    >;
    leadSource: Attribute.Enumeration<
      [
        'walk in',
        'external referral',
        'online store',
        'website',
        'advertisement',
        'google ad',
        'facebook ad',
        'instagram',
        'tik tok',
        'google search',
        'unknown',
      ]
    > &
      Attribute.DefaultTo<'unknown'>;
    customCreationDate: Attribute.DateTime;
    ecommerceContactServices: Attribute.Relation<
      'api::contact.contact',
      'oneToMany',
      'api::ecommerce-contact-service.ecommerce-contact-service'
    >;
    isCreatedByOpenApi: Attribute.Boolean & Attribute.DefaultTo<false>;
    amountSpent: Attribute.Decimal;
    amountOwes: Attribute.Decimal;
    additionalEmails: Attribute.Relation<
      'api::contact.contact',
      'oneToMany',
      'api::crm-additional-email.crm-additional-email'
    >;
    additionalAddresses: Attribute.Relation<
      'api::contact.contact',
      'oneToMany',
      'api::crm-additional-address.crm-additional-address'
    >;
    additionalPhoneNumbers: Attribute.Relation<
      'api::contact.contact',
      'oneToMany',
      'api::crm-additional-phone-number.crm-additional-phone-number'
    >;
    priceGroup: Attribute.Enumeration<['retail', 'wholesale']>;
    relation: Attribute.Relation<
      'api::contact.contact',
      'oneToMany',
      'api::crm-relation.crm-relation'
    >;
    identityNumber: Attribute.String;
    gender: Attribute.String;
    marketingOptIn: Attribute.Enumeration<['Yes', 'No', 'N_A']> &
      Attribute.DefaultTo<'N_A'>;
    customFieldValues: Attribute.Relation<
      'api::contact.contact',
      'oneToMany',
      'api::crm-custom-field-value.crm-custom-field-value'
    >;
    contactTitle: Attribute.Relation<
      'api::contact.contact',
      'oneToOne',
      'api::contact-title.contact-title'
    >;
    dateAnniversary: Attribute.Date;
    clearentCustomerKey: Attribute.String;
    accServiceContacts: Attribute.Relation<
      'api::contact.contact',
      'oneToMany',
      'api::acc-service-contact.acc-service-contact'
    >;
    accServiceVendors: Attribute.Relation<
      'api::contact.contact',
      'oneToMany',
      'api::acc-service-vendor.acc-service-vendor'
    >;
    accServiceBills: Attribute.Relation<
      'api::contact.contact',
      'oneToMany',
      'api::acc-service-bill.acc-service-bill'
    >;
    spouseBirthdayDate: Attribute.Date;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::contact.contact',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::contact.contact',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiContactSettingContactSetting extends Schema.CollectionType {
  collectionName: 'contacts_setting';
  info: {
    singularName: 'contact-setting';
    pluralName: 'contacts-setting';
    displayName: 'SETTINGS: Contact';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    fullName: Attribute.Boolean & Attribute.DefaultTo<true>;
    email: Attribute.Boolean & Attribute.DefaultTo<true>;
    contactOwner: Attribute.Boolean & Attribute.DefaultTo<false>;
    phoneNumber: Attribute.Boolean & Attribute.DefaultTo<true>;
    contactSource: Attribute.Boolean & Attribute.DefaultTo<true>;
    company: Attribute.Boolean & Attribute.DefaultTo<false>;
    address: Attribute.Boolean & Attribute.DefaultTo<true>;
    occupation: Attribute.Boolean & Attribute.DefaultTo<false>;
    birthdate: Attribute.Boolean & Attribute.DefaultTo<false>;
    anniversaryDate: Attribute.Boolean & Attribute.DefaultTo<false>;
    priceGroup: Attribute.Boolean & Attribute.DefaultTo<false>;
    tenant: Attribute.Relation<
      'api::contact-setting.contact-setting',
      'oneToOne',
      'api::tenant.tenant'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::contact-setting.contact-setting',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::contact-setting.contact-setting',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiContactTitleContactTitle extends Schema.CollectionType {
  collectionName: 'contact_titles';
  info: {
    singularName: 'contact-title';
    pluralName: 'contact-titles';
    displayName: 'Contact Title';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    tenant: Attribute.Relation<
      'api::contact-title.contact-title',
      'oneToOne',
      'api::tenant.tenant'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::contact-title.contact-title',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::contact-title.contact-title',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiContractContract extends Schema.CollectionType {
  collectionName: 'contracts';
  info: {
    singularName: 'contract';
    pluralName: 'contracts';
    displayName: 'CONTRACTS: Contract';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    contractId: Attribute.String;
    uuid: Attribute.UID & Attribute.CustomField<'plugin::field-uuid.uuid'>;
    link: Attribute.String;
    tenant: Attribute.Relation<
      'api::contract.contract',
      'oneToOne',
      'api::tenant.tenant'
    >;
    publicContract: Attribute.Relation<
      'api::contract.contract',
      'oneToOne',
      'api::public-contract.public-contract'
    >;
    contact: Attribute.Relation<
      'api::contract.contract',
      'oneToOne',
      'api::contact.contact'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::contract.contract',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::contract.contract',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiContractTemplateContractTemplate
  extends Schema.CollectionType {
  collectionName: 'contract_templates';
  info: {
    singularName: 'contract-template';
    pluralName: 'contract-templates';
    displayName: 'CONTRACTS: ContractTemplate';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    uuid: Attribute.UID & Attribute.CustomField<'plugin::field-uuid.uuid'>;
    tenant: Attribute.Relation<
      'api::contract-template.contract-template',
      'oneToOne',
      'api::tenant.tenant'
    >;
    companySignature: Attribute.RichText;
    companySignName: Attribute.String;
    companySignDate: Attribute.DateTime;
    templateId: Attribute.String;
    body: Attribute.RichText;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::contract-template.contract-template',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::contract-template.contract-template',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiConversationConversation extends Schema.CollectionType {
  collectionName: 'conversations';
  info: {
    singularName: 'conversation';
    pluralName: 'conversations';
    displayName: 'MESSAGING: Conversation';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    conversationSid: Attribute.String;
    tenant: Attribute.Relation<
      'api::conversation.conversation',
      'oneToOne',
      'api::tenant.tenant'
    >;
    name: Attribute.String;
    uuid: Attribute.UID & Attribute.CustomField<'plugin::field-uuid.uuid'>;
    contact: Attribute.Relation<
      'api::conversation.conversation',
      'oneToOne',
      'api::contact.contact'
    >;
    user: Attribute.Relation<
      'api::conversation.conversation',
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    twilioConnection: Attribute.Relation<
      'api::conversation.conversation',
      'oneToOne',
      'api::twilio-connection.twilio-connection'
    >;
    type: Attribute.Enumeration<['sms', 'mail', 'fb', 'insta', 'wa']>;
    threadId: Attribute.String;
    chatNotifications: Attribute.Relation<
      'api::conversation.conversation',
      'oneToMany',
      'api::chat-notification.chat-notification'
    >;
    replyTo: Attribute.String;
    isAutocreated: Attribute.Boolean & Attribute.DefaultTo<false>;
    lead: Attribute.Relation<
      'api::conversation.conversation',
      'oneToOne',
      'api::lead.lead'
    >;
    company: Attribute.Relation<
      'api::conversation.conversation',
      'oneToOne',
      'api::company.company'
    >;
    scheduled: Attribute.Component<'data.scheduled-message', true>;
    mms: Attribute.Component<'data.message', true>;
    metaPageId: Attribute.String;
    notificationsCount: Attribute.Integer;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::conversation.conversation',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::conversation.conversation',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiCountryCountry extends Schema.CollectionType {
  collectionName: 'countries';
  info: {
    singularName: 'country';
    pluralName: 'countries';
    displayName: 'INVENTORY: Country';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    tenant: Attribute.Relation<
      'api::country.country',
      'oneToOne',
      'api::tenant.tenant'
    >;
    jewelryProductType: Attribute.Relation<
      'api::country.country',
      'manyToOne',
      'api::jewelry-product-type.jewelry-product-type'
    >;
    editable: Attribute.Boolean & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::country.country',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::country.country',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiCrmAdditionalAddressCrmAdditionalAddress
  extends Schema.CollectionType {
  collectionName: 'crm_additional_addresses';
  info: {
    singularName: 'crm-additional-address';
    pluralName: 'crm-additional-addresses';
    displayName: 'CRM: Additional Address';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    value: Attribute.String & Attribute.Required;
    contact: Attribute.Relation<
      'api::crm-additional-address.crm-additional-address',
      'manyToOne',
      'api::contact.contact'
    >;
    company: Attribute.Relation<
      'api::crm-additional-address.crm-additional-address',
      'manyToOne',
      'api::company.company'
    >;
    lead: Attribute.Relation<
      'api::crm-additional-address.crm-additional-address',
      'manyToOne',
      'api::lead.lead'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::crm-additional-address.crm-additional-address',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::crm-additional-address.crm-additional-address',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiCrmAdditionalEmailCrmAdditionalEmail
  extends Schema.CollectionType {
  collectionName: 'crm_additional_emails';
  info: {
    singularName: 'crm-additional-email';
    pluralName: 'crm-additional-emails';
    displayName: 'CRM: Additional Email';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    value: Attribute.Email;
    contact: Attribute.Relation<
      'api::crm-additional-email.crm-additional-email',
      'manyToOne',
      'api::contact.contact'
    >;
    company: Attribute.Relation<
      'api::crm-additional-email.crm-additional-email',
      'manyToOne',
      'api::company.company'
    >;
    lead: Attribute.Relation<
      'api::crm-additional-email.crm-additional-email',
      'manyToOne',
      'api::lead.lead'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::crm-additional-email.crm-additional-email',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::crm-additional-email.crm-additional-email',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiCrmAdditionalPhoneNumberCrmAdditionalPhoneNumber
  extends Schema.CollectionType {
  collectionName: 'crm_additional_phone_numbers';
  info: {
    singularName: 'crm-additional-phone-number';
    pluralName: 'crm-additional-phone-numbers';
    displayName: 'CRM: Additional Phone Number';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    value: Attribute.String & Attribute.Required;
    contact: Attribute.Relation<
      'api::crm-additional-phone-number.crm-additional-phone-number',
      'manyToOne',
      'api::contact.contact'
    >;
    company: Attribute.Relation<
      'api::crm-additional-phone-number.crm-additional-phone-number',
      'manyToOne',
      'api::company.company'
    >;
    lead: Attribute.Relation<
      'api::crm-additional-phone-number.crm-additional-phone-number',
      'manyToOne',
      'api::lead.lead'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::crm-additional-phone-number.crm-additional-phone-number',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::crm-additional-phone-number.crm-additional-phone-number',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiCrmCustomFieldNameCrmCustomFieldName
  extends Schema.CollectionType {
  collectionName: 'crm_custom_field_names';
  info: {
    singularName: 'crm-custom-field-name';
    pluralName: 'crm-custom-field-names';
    displayName: 'CRM: Custom Field Name';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    tenant: Attribute.Relation<
      'api::crm-custom-field-name.crm-custom-field-name',
      'oneToOne',
      'api::tenant.tenant'
    >;
    crmType: Attribute.Enumeration<['contact', 'company', 'lead']> &
      Attribute.Required &
      Attribute.DefaultTo<'contact'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::crm-custom-field-name.crm-custom-field-name',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::crm-custom-field-name.crm-custom-field-name',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiCrmCustomFieldValueCrmCustomFieldValue
  extends Schema.CollectionType {
  collectionName: 'crm_custom_field_values';
  info: {
    singularName: 'crm-custom-field-value';
    pluralName: 'crm-custom-field-values';
    displayName: 'CRM: Custom Field Value';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    value: Attribute.String;
    customFieldName: Attribute.Relation<
      'api::crm-custom-field-value.crm-custom-field-value',
      'oneToOne',
      'api::crm-custom-field-name.crm-custom-field-name'
    >;
    contact: Attribute.Relation<
      'api::crm-custom-field-value.crm-custom-field-value',
      'manyToOne',
      'api::contact.contact'
    >;
    company: Attribute.Relation<
      'api::crm-custom-field-value.crm-custom-field-value',
      'oneToOne',
      'api::company.company'
    >;
    lead: Attribute.Relation<
      'api::crm-custom-field-value.crm-custom-field-value',
      'oneToOne',
      'api::lead.lead'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::crm-custom-field-value.crm-custom-field-value',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::crm-custom-field-value.crm-custom-field-value',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiCrmRelationCrmRelation extends Schema.CollectionType {
  collectionName: 'crm_relations';
  info: {
    singularName: 'crm-relation';
    pluralName: 'crm-relations';
    displayName: 'CRM: Relation';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    fromContact: Attribute.Relation<
      'api::crm-relation.crm-relation',
      'manyToOne',
      'api::contact.contact'
    >;
    toContact: Attribute.Relation<
      'api::crm-relation.crm-relation',
      'oneToOne',
      'api::contact.contact'
    >;
    relationType: Attribute.Relation<
      'api::crm-relation.crm-relation',
      'oneToOne',
      'api::crm-relation-type.crm-relation-type'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::crm-relation.crm-relation',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::crm-relation.crm-relation',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiCrmRelationTypeCrmRelationType
  extends Schema.CollectionType {
  collectionName: 'crm_relation_types';
  info: {
    singularName: 'crm-relation-type';
    pluralName: 'crm-relation-types';
    displayName: 'CRM: Relation Type';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    tenant: Attribute.Relation<
      'api::crm-relation-type.crm-relation-type',
      'oneToOne',
      'api::tenant.tenant'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::crm-relation-type.crm-relation-type',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::crm-relation-type.crm-relation-type',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiCustomPermissionCustomPermission
  extends Schema.CollectionType {
  collectionName: 'custom_permissions';
  info: {
    singularName: 'custom-permission';
    pluralName: 'custom-permissions';
    displayName: 'Custom Permission';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    tenant: Attribute.Relation<
      'api::custom-permission.custom-permission',
      'oneToOne',
      'api::tenant.tenant'
    >;
    permissions: Attribute.JSON;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::custom-permission.custom-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::custom-permission.custom-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiDealDeal extends Schema.CollectionType {
  collectionName: 'deals';
  info: {
    singularName: 'deal';
    pluralName: 'deals';
    displayName: 'Deal';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    stage: Attribute.Enumeration<
      ['new', 'sourcing', 'negotiating', 'won', 'lost']
    >;
    company: Attribute.Relation<
      'api::deal.deal',
      'manyToOne',
      'api::company.company'
    >;
    contact: Attribute.Relation<
      'api::deal.deal',
      'manyToOne',
      'api::contact.contact'
    >;
    lead: Attribute.Relation<'api::deal.deal', 'manyToOne', 'api::lead.lead'>;
    budget: Attribute.Decimal;
    startDate: Attribute.DateTime;
    notes: Attribute.Text;
    tenant: Attribute.Relation<
      'api::deal.deal',
      'oneToOne',
      'api::tenant.tenant'
    >;
    products: Attribute.Relation<
      'api::deal.deal',
      'oneToMany',
      'api::product.product'
    >;
    files: Attribute.Media;
    employee: Attribute.Relation<
      'api::deal.deal',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::deal.deal', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'api::deal.deal', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface ApiDealSettingDealSetting extends Schema.CollectionType {
  collectionName: 'deals_setting';
  info: {
    singularName: 'deal-setting';
    pluralName: 'deals-setting';
    displayName: 'SETTINGS: Deal';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    tenant: Attribute.Relation<
      'api::deal-setting.deal-setting',
      'oneToOne',
      'api::tenant.tenant'
    >;
    templateNote: Attribute.Text;
    isTemplateNoteEnabled: Attribute.Boolean & Attribute.DefaultTo<true>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::deal-setting.deal-setting',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::deal-setting.deal-setting',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiDealTransactionDealTransaction
  extends Schema.CollectionType {
  collectionName: 'deal_transactions';
  info: {
    singularName: 'deal-transaction';
    pluralName: 'deal-transactions';
    displayName: 'Deal Transaction';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    dueDate: Attribute.DateTime & Attribute.Required;
    status: Attribute.Enumeration<
      ['Paid', 'Open', 'Running', 'Cancelled', 'Refunded']
    > &
      Attribute.Required &
      Attribute.DefaultTo<'Open'>;
    summary: Attribute.Decimal & Attribute.Required;
    paid: Attribute.Decimal;
    repetitive: Attribute.Enumeration<
      ['once', 'daily', 'weekly', 'monthly', 'yearly']
    > &
      Attribute.Required &
      Attribute.DefaultTo<'once'>;
    contact: Attribute.Relation<
      'api::deal-transaction.deal-transaction',
      'manyToOne',
      'api::contact.contact'
    >;
    chartAccount: Attribute.Relation<
      'api::deal-transaction.deal-transaction',
      'manyToOne',
      'api::chart-account.chart-account'
    >;
    chartCategory: Attribute.Relation<
      'api::deal-transaction.deal-transaction',
      'manyToOne',
      'api::chart-category.chart-category'
    >;
    chartSubcategory: Attribute.Relation<
      'api::deal-transaction.deal-transaction',
      'manyToOne',
      'api::chart-subcategory.chart-subcategory'
    >;
    note: Attribute.Text;
    sellingOrder: Attribute.Relation<
      'api::deal-transaction.deal-transaction',
      'manyToOne',
      'api::order.order'
    >;
    dealTransactionId: Attribute.String & Attribute.Required & Attribute.Unique;
    tenant: Attribute.Relation<
      'api::deal-transaction.deal-transaction',
      'manyToOne',
      'api::tenant.tenant'
    >;
    company: Attribute.Relation<
      'api::deal-transaction.deal-transaction',
      'manyToOne',
      'api::company.company'
    >;
    stripeInfo: Attribute.JSON;
    paymentMethod: Attribute.Relation<
      'api::deal-transaction.deal-transaction',
      'oneToOne',
      'api::payment-method.payment-method'
    >;
    files: Attribute.Media;
    businessLocation: Attribute.Relation<
      'api::deal-transaction.deal-transaction',
      'oneToOne',
      'api::business-location.business-location'
    >;
    clearentInfo: Attribute.JSON;
    paymentGatewayType: Attribute.Enumeration<['stripe', 'clearent']>;
    tipAmount: Attribute.Decimal;
    customCreationDate: Attribute.DateTime;
    clearentError: Attribute.JSON;
    transactionCurrency: Attribute.String;
    accServiceTxn: Attribute.Relation<
      'api::deal-transaction.deal-transaction',
      'oneToOne',
      'api::acc-service-txn.acc-service-txn'
    >;
    accServiceBill: Attribute.Relation<
      'api::deal-transaction.deal-transaction',
      'oneToOne',
      'api::acc-service-bill.acc-service-bill'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::deal-transaction.deal-transaction',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::deal-transaction.deal-transaction',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiDealTransactionReminderDealTransactionReminder
  extends Schema.CollectionType {
  collectionName: 'deal_transaction_reminders';
  info: {
    singularName: 'deal-transaction-reminder';
    pluralName: 'deal-transaction-reminders';
    displayName: 'Deal Transaction Reminder';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    daysAmount: Attribute.Integer & Attribute.Required & Attribute.DefaultTo<3>;
    timing: Attribute.Enumeration<['before', 'after']> &
      Attribute.Required &
      Attribute.DefaultTo<'before'>;
    isActive: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<true>;
    tenant: Attribute.Relation<
      'api::deal-transaction-reminder.deal-transaction-reminder',
      'manyToOne',
      'api::tenant.tenant'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::deal-transaction-reminder.deal-transaction-reminder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::deal-transaction-reminder.deal-transaction-reminder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiDefaultImportingFileDefaultImportingFile
  extends Schema.CollectionType {
  collectionName: 'default_importing_files';
  info: {
    singularName: 'default-importing-file';
    pluralName: 'default-importing-files';
    displayName: 'Default Importing File';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    type: Attribute.Enumeration<
      [
        'contacts',
        'products',
        'orders',
        'contactRelations',
        'wishlist',
        'companies',
      ]
    >;
    defaultFile: Attribute.Media;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::default-importing-file.default-importing-file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::default-importing-file.default-importing-file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiDefaultPdfTemplateDefaultPdfTemplate
  extends Schema.CollectionType {
  collectionName: 'default_pdf_templates';
  info: {
    singularName: 'default-pdf-template';
    pluralName: 'default-pdf-templates';
    displayName: 'Default Pdf Template';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.Text;
    type: Attribute.Enumeration<
      [
        'catalogue',
        'appraisal',
        'wishlist',
        'invoice',
        'estimate',
        'purchase',
        'internalJobTicket',
        'externalJobTicket',
      ]
    >;
    templateId: Attribute.Integer;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::default-pdf-template.default-pdf-template',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::default-pdf-template.default-pdf-template',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiDesignStyleDesignStyle extends Schema.CollectionType {
  collectionName: 'design_styles';
  info: {
    singularName: 'design-style';
    pluralName: 'design-styles';
    displayName: 'INVENTORY: Design Style';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    tenant: Attribute.Relation<
      'api::design-style.design-style',
      'oneToOne',
      'api::tenant.tenant'
    >;
    jewelryProductType: Attribute.Relation<
      'api::design-style.design-style',
      'manyToOne',
      'api::jewelry-product-type.jewelry-product-type'
    >;
    editable: Attribute.Boolean & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::design-style.design-style',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::design-style.design-style',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiDimensionDimension extends Schema.CollectionType {
  collectionName: 'dimensions';
  info: {
    singularName: 'dimension';
    pluralName: 'dimensions';
    displayName: 'Dimension';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    height: Attribute.Float;
    length: Attribute.Float;
    width: Attribute.Float;
    unit: Attribute.Enumeration<['mm', 'cm', 'm', 'in', 'ft', 'yd']>;
    product: Attribute.Relation<
      'api::dimension.dimension',
      'oneToOne',
      'api::product.product'
    >;
    jewelryProduct: Attribute.Relation<
      'api::dimension.dimension',
      'oneToOne',
      'api::jewelry-product.jewelry-product'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::dimension.dimension',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::dimension.dimension',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiDiscountDiscount extends Schema.CollectionType {
  collectionName: 'discounts';
  info: {
    singularName: 'discount';
    pluralName: 'discounts';
    displayName: 'Discount';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    code: Attribute.String;
    description: Attribute.Text;
    usageLimit: Attribute.Integer & Attribute.DefaultTo<0>;
    startDate: Attribute.DateTime;
    endDate: Attribute.DateTime;
    tenant: Attribute.Relation<
      'api::discount.discount',
      'oneToOne',
      'api::tenant.tenant'
    >;
    active: Attribute.Boolean & Attribute.DefaultTo<false>;
    notes: Attribute.Text;
    amount: Attribute.Float &
      Attribute.Required &
      Attribute.SetMinMax<{
        min: 0.01;
      }>;
    discountUsageEvents: Attribute.Relation<
      'api::discount.discount',
      'oneToMany',
      'api::discount-usage-event.discount-usage-event'
    >;
    applicableProducts: Attribute.Relation<
      'api::discount.discount',
      'oneToMany',
      'api::product.product'
    >;
    applicableServices: Attribute.Relation<
      'api::discount.discount',
      'oneToMany',
      'api::service.service'
    >;
    applicableClasses: Attribute.Relation<
      'api::discount.discount',
      'oneToMany',
      'api::class.class'
    >;
    applicableCompositeProducts: Attribute.Relation<
      'api::discount.discount',
      'oneToMany',
      'api::composite-product.composite-product'
    >;
    applicableMemberships: Attribute.Relation<
      'api::discount.discount',
      'oneToMany',
      'api::membership.membership'
    >;
    applicableStores: Attribute.Relation<
      'api::discount.discount',
      'oneToMany',
      'api::business-location.business-location'
    >;
    type: Attribute.Enumeration<['fixed', 'percentage']> &
      Attribute.Required &
      Attribute.DefaultTo<'percentage'>;
    excludedProducts: Attribute.Relation<
      'api::discount.discount',
      'oneToMany',
      'api::product.product'
    >;
    excludedClasses: Attribute.Relation<
      'api::discount.discount',
      'oneToMany',
      'api::class.class'
    >;
    excludedServices: Attribute.Relation<
      'api::discount.discount',
      'oneToMany',
      'api::service.service'
    >;
    excludedCompositeProducts: Attribute.Relation<
      'api::discount.discount',
      'oneToMany',
      'api::composite-product.composite-product'
    >;
    excludedMemberships: Attribute.Relation<
      'api::discount.discount',
      'oneToMany',
      'api::membership.membership'
    >;
    uuid: Attribute.UID & Attribute.CustomField<'plugin::field-uuid.uuid'>;
    sellingOrders: Attribute.Relation<
      'api::discount.discount',
      'manyToMany',
      'api::order.order'
    >;
    discountId: Attribute.String & Attribute.Unique;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::discount.discount',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::discount.discount',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiDiscountUsageEventDiscountUsageEvent
  extends Schema.CollectionType {
  collectionName: 'discount_usage_events';
  info: {
    singularName: 'discount-usage-event';
    pluralName: 'discount-usage-events';
    displayName: 'DiscountUsageEvent';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    discount: Attribute.Relation<
      'api::discount-usage-event.discount-usage-event',
      'manyToOne',
      'api::discount.discount'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::discount-usage-event.discount-usage-event',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::discount-usage-event.discount-usage-event',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiDocumentPermissionDocumentPermission
  extends Schema.CollectionType {
  collectionName: 'document_permissions';
  info: {
    singularName: 'document-permission';
    pluralName: 'document-permissions';
    displayName: 'PERMISSIONS: Document Permission';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    tenant: Attribute.Relation<
      'api::document-permission.document-permission',
      'oneToOne',
      'api::tenant.tenant'
    >;
    invoiceTerms: Attribute.Text;
    purchaseTerms: Attribute.Text;
    appraisalTerms: Attribute.Text;
    invoiceClientMessage: Attribute.Text;
    taskNotificationContent: Attribute.Text;
    isShowOrderItemsImages: Attribute.Boolean & Attribute.DefaultTo<false>;
    isInvoiceTermsEnabled: Attribute.Boolean & Attribute.DefaultTo<false>;
    isInvoiceClientMessageEnabled: Attribute.Boolean &
      Attribute.DefaultTo<false>;
    isAppraisalTermsEnabled: Attribute.Boolean & Attribute.DefaultTo<false>;
    isPurchaseTermsEnabled: Attribute.Boolean & Attribute.DefaultTo<false>;
    isInvoiceCreationDateEnabled: Attribute.Boolean & Attribute.DefaultTo<true>;
    isInvoiceDiscountEnabled: Attribute.Boolean & Attribute.DefaultTo<true>;
    isInvoiceTaxEnabled: Attribute.Boolean & Attribute.DefaultTo<true>;
    isInvoiceTipEnabled: Attribute.Boolean & Attribute.DefaultTo<true>;
    isPurchaseCreationDateEnabled: Attribute.Boolean &
      Attribute.DefaultTo<true>;
    isPurchaseDiscountEnabled: Attribute.Boolean & Attribute.DefaultTo<true>;
    isPurchaseTaxEnabled: Attribute.Boolean & Attribute.DefaultTo<true>;
    isPurchaseTipEnabled: Attribute.Boolean & Attribute.DefaultTo<true>;
    invoiceSignature: Attribute.Boolean & Attribute.DefaultTo<false>;
    isInternalRepairTicketPriceEnabled: Attribute.Boolean &
      Attribute.DefaultTo<true>;
    isShowOrderNoteAtInternalRepairTicker: Attribute.Boolean &
      Attribute.DefaultTo<true>;
    isShowOrderNoteAtExternalRepairTicker: Attribute.Boolean &
      Attribute.DefaultTo<true>;
    isExternalRepairTicketPriceEnabled: Attribute.Boolean &
      Attribute.DefaultTo<true>;
    isOnboardingMessage: Attribute.Boolean & Attribute.DefaultTo<true>;
    estimateTerms: Attribute.Text;
    estimateClientMessage: Attribute.Text;
    isEstimateTermsEnabled: Attribute.Boolean & Attribute.DefaultTo<false>;
    isEstimateClientMessageEnabled: Attribute.Boolean &
      Attribute.DefaultTo<false>;
    isEstimateCreationDateEnabled: Attribute.Boolean &
      Attribute.DefaultTo<true>;
    isEstimateDiscountEnabled: Attribute.Boolean & Attribute.DefaultTo<true>;
    isEstimateTaxEnabled: Attribute.Boolean & Attribute.DefaultTo<true>;
    isEstimateTipEnabled: Attribute.Boolean & Attribute.DefaultTo<true>;
    estimateSignature: Attribute.Boolean & Attribute.DefaultTo<false>;
    isPriceOnLabelEnabled: Attribute.Boolean & Attribute.DefaultTo<true>;
    isSkuOnLabelEnabled: Attribute.Boolean & Attribute.DefaultTo<true>;
    isBarcodeOnLabelEnabled: Attribute.Boolean & Attribute.DefaultTo<true>;
    defaultLabelTemplate: Attribute.String;
    isInvoiceShippedDateEnabled: Attribute.Boolean & Attribute.DefaultTo<true>;
    isPurchaseShippedDateEnabled: Attribute.Boolean & Attribute.DefaultTo<true>;
    isEstimateShippedDateEnabled: Attribute.Boolean & Attribute.DefaultTo<true>;
    isInvoiceDueDateEnabled: Attribute.Boolean & Attribute.DefaultTo<true>;
    isPurchaseDueDateEnabled: Attribute.Boolean & Attribute.DefaultTo<true>;
    isEstimateDueDateEnabled: Attribute.Boolean & Attribute.DefaultTo<true>;
    isInvoiceMemoTermsEnabled: Attribute.Boolean & Attribute.DefaultTo<false>;
    invoiceMemoTerms: Attribute.Text;
    isPurchaseMemoTermsEnabled: Attribute.Boolean & Attribute.DefaultTo<false>;
    purchaseMemoTerms: Attribute.Text;
    isInvoiceLocationEnabled: Attribute.Boolean & Attribute.DefaultTo<true>;
    isPurchaseLocationEnabled: Attribute.Boolean & Attribute.DefaultTo<true>;
    isEstimateLocationEnabled: Attribute.Boolean & Attribute.DefaultTo<true>;
    isInvoiceSkuEnabled: Attribute.Boolean & Attribute.DefaultTo<false>;
    isPurchaseSkuEnabled: Attribute.Boolean & Attribute.DefaultTo<false>;
    isEstimateSkuEnabled: Attribute.Boolean & Attribute.DefaultTo<false>;
    appraisalDescriptionPrompt: Attribute.Text &
      Attribute.DefaultTo<'Write a detailed, professional jewelry appraisal description for the provided product.  Include key details such as the type of jewelry (ring, necklace, etc.), materials (gold, silver, platinum), gemstones (diamond, emerald, sapphire), weight, color, and craftsmanship quality.  Maintain a neutral, expert tone suitable for appraisal reports. Avoid marketing or sales language.'>;
    documentImageSizeMultiplier: Attribute.Float &
      Attribute.SetMinMax<{
        min: 0;
        max: 3;
      }> &
      Attribute.DefaultTo<1>;
    signature: Attribute.RichText;
    isShowStoreAddressForAppraisal: Attribute.Boolean &
      Attribute.DefaultTo<true>;
    isShowCustomerNameForAppraisal: Attribute.Boolean &
      Attribute.DefaultTo<true>;
    isUsePdfGeneratorForInvoice: Attribute.Boolean & Attribute.DefaultTo<false>;
    isUsePdfGeneratorForAppraisal: Attribute.Boolean &
      Attribute.DefaultTo<false>;
    isUsePdfGeneratorForEstimate: Attribute.Boolean &
      Attribute.DefaultTo<false>;
    isUsePdfGeneratorForPurchase: Attribute.Boolean &
      Attribute.DefaultTo<false>;
    isInternalRepairTicketNumberEnabled: Attribute.Boolean &
      Attribute.DefaultTo<false>;
    isExternalRepairTicketNumberEnabled: Attribute.Boolean &
      Attribute.DefaultTo<false>;
    startRepairTicketNumber: Attribute.BigInteger & Attribute.DefaultTo<'1'>;
    isInvoiceRepairTicketNumberEnabled: Attribute.Boolean &
      Attribute.DefaultTo<false>;
    isUsePdfGeneratorForInternalJobTicket: Attribute.Boolean &
      Attribute.DefaultTo<false>;
    isUsePdfGeneratorForExternalJobTicket: Attribute.Boolean &
      Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::document-permission.document-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::document-permission.document-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiDownloadRecordDownloadRecord extends Schema.CollectionType {
  collectionName: 'download_records';
  info: {
    singularName: 'download-record';
    pluralName: 'download-records';
    displayName: 'DownloadRecord';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    fileItem: Attribute.Relation<
      'api::download-record.download-record',
      'oneToOne',
      'api::file-item.file-item'
    >;
    downloadedBy: Attribute.Relation<
      'api::download-record.download-record',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    tenant: Attribute.Relation<
      'api::download-record.download-record',
      'oneToOne',
      'api::tenant.tenant'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::download-record.download-record',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::download-record.download-record',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiEcommerceAuthenticationServiceEcommerceAuthenticationService
  extends Schema.CollectionType {
  collectionName: 'ecommerce_authentication_services';
  info: {
    singularName: 'ecommerce-authentication-service';
    pluralName: 'ecommerce-authentication-services';
    displayName: 'Ecommerce Authentication Service';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    code: Attribute.String;
    expiry: Attribute.DateTime & Attribute.Required;
    token: Attribute.String;
    tenantId: Attribute.Integer & Attribute.Required;
    shopUrl: Attribute.String & Attribute.Required;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::ecommerce-authentication-service.ecommerce-authentication-service',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::ecommerce-authentication-service.ecommerce-authentication-service',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiEcommerceContactServiceEcommerceContactService
  extends Schema.CollectionType {
  collectionName: 'ecommerce_contact_services';
  info: {
    singularName: 'ecommerce-contact-service';
    pluralName: 'ecommerce-contact-services';
    displayName: 'Ecommerce Contact Services';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    ecommerceContactId: Attribute.String & Attribute.Required;
    isSynced: Attribute.Boolean & Attribute.Required;
    syncDate: Attribute.DateTime;
    ecommerceType: Attribute.Enumeration<
      ['shopify', 'woocommerce', 'magento']
    > &
      Attribute.Required;
    contact: Attribute.Relation<
      'api::ecommerce-contact-service.ecommerce-contact-service',
      'manyToOne',
      'api::contact.contact'
    >;
    tenant: Attribute.Relation<
      'api::ecommerce-contact-service.ecommerce-contact-service',
      'oneToOne',
      'api::tenant.tenant'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::ecommerce-contact-service.ecommerce-contact-service',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::ecommerce-contact-service.ecommerce-contact-service',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiEcommerceCustomAppServiceEcommerceCustomAppService
  extends Schema.CollectionType {
  collectionName: 'ecommerce_custom_app_services';
  info: {
    singularName: 'ecommerce-custom-app-service';
    pluralName: 'ecommerce-custom-app-services';
    displayName: 'Ecommerce Custom App Service';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    appName: Attribute.String & Attribute.Required;
    apiKey: Attribute.String;
    apiSecret: Attribute.String;
    isInstalled: Attribute.Boolean & Attribute.Required;
    accessToken: Attribute.String;
    tenant: Attribute.Relation<
      'api::ecommerce-custom-app-service.ecommerce-custom-app-service',
      'manyToOne',
      'api::tenant.tenant'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::ecommerce-custom-app-service.ecommerce-custom-app-service',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::ecommerce-custom-app-service.ecommerce-custom-app-service',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiEcommerceDetailEcommerceDetail
  extends Schema.CollectionType {
  collectionName: 'ecommerce_details';
  info: {
    singularName: 'ecommerce-detail';
    pluralName: 'ecommerce-details';
    displayName: 'Ecommerce Details';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    storeUrl: Attribute.String & Attribute.Required;
    accessToken: Attribute.Text;
    ecommerceType: Attribute.Enumeration<
      ['shopify', 'woocommerce', 'magento']
    > &
      Attribute.Required;
    tenant: Attribute.Relation<
      'api::ecommerce-detail.ecommerce-detail',
      'manyToOne',
      'api::tenant.tenant'
    >;
    status: Attribute.Boolean & Attribute.DefaultTo<true>;
    consumerKey: Attribute.Text;
    consumerSecret: Attribute.Text;
    businessLocation: Attribute.Relation<
      'api::ecommerce-detail.ecommerce-detail',
      'manyToOne',
      'api::business-location.business-location'
    >;
    defaultShippingService: Attribute.Relation<
      'api::ecommerce-detail.ecommerce-detail',
      'manyToOne',
      'api::service.service'
    >;
    defaultShippingProduct: Attribute.Relation<
      'api::ecommerce-detail.ecommerce-detail',
      'manyToOne',
      'api::product.product'
    >;
    defaultShippingType: Attribute.Enumeration<['service', 'product']>;
    productWillNotSync: Attribute.Boolean & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::ecommerce-detail.ecommerce-detail',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::ecommerce-detail.ecommerce-detail',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiEcommerceProductServiceEcommerceProductService
  extends Schema.CollectionType {
  collectionName: 'ecommerce_product_services';
  info: {
    singularName: 'ecommerce-product-service';
    pluralName: 'ecommerce-product-services';
    displayName: 'Ecommerce Product Services';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    ecommerceProductId: Attribute.String & Attribute.Required;
    isSynced: Attribute.Boolean & Attribute.Required;
    syncDate: Attribute.DateTime;
    ecommerceType: Attribute.Enumeration<
      ['shopify', 'woocommerce', 'magento']
    > &
      Attribute.Required;
    product: Attribute.Relation<
      'api::ecommerce-product-service.ecommerce-product-service',
      'manyToOne',
      'api::product.product'
    >;
    tenantId: Attribute.String & Attribute.Required;
    inventoryItemId: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::ecommerce-product-service.ecommerce-product-service',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::ecommerce-product-service.ecommerce-product-service',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiEngravingTypeEngravingType extends Schema.CollectionType {
  collectionName: 'engraving_types';
  info: {
    singularName: 'engraving-type';
    pluralName: 'engraving-types';
    displayName: 'INVENTORY: Engraving Type';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    tenant: Attribute.Relation<
      'api::engraving-type.engraving-type',
      'oneToOne',
      'api::tenant.tenant'
    >;
    editable: Attribute.Boolean & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::engraving-type.engraving-type',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::engraving-type.engraving-type',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiEnrolledContactConditionEnrolledContactCondition
  extends Schema.CollectionType {
  collectionName: 'enrolled_contact_conditions';
  info: {
    singularName: 'enrolled-contact-condition';
    pluralName: 'enrolled-contact-conditions';
    displayName: 'MARKETING: Campaign Enrolled Contact Condition';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    conditionId: Attribute.String;
    value: Attribute.String;
    valueStart: Attribute.String;
    valueEnd: Attribute.String;
    periodStart: Attribute.Date;
    periodEnd: Attribute.Date;
    campaign: Attribute.Relation<
      'api::enrolled-contact-condition.enrolled-contact-condition',
      'manyToOne',
      'api::campaign.campaign'
    >;
    periodValue: Attribute.String;
    periodValueStart: Attribute.String;
    periodValueEnd: Attribute.String;
    periodOperator: Attribute.String;
    operator: Attribute.Component<'data.set', true>;
    bought: Attribute.Component<'data.bought-condition'>;
    notBought: Attribute.Component<'data.bought-condition'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::enrolled-contact-condition.enrolled-contact-condition',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::enrolled-contact-condition.enrolled-contact-condition',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiEnrolledLeadConditionEnrolledLeadCondition
  extends Schema.CollectionType {
  collectionName: 'enrolled_lead_conditions';
  info: {
    singularName: 'enrolled-lead-condition';
    pluralName: 'enrolled-lead-conditions';
    displayName: 'MARKETING: Campaign Enrolled Lead Condition';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    conditionId: Attribute.String;
    value: Attribute.String;
    campaign: Attribute.Relation<
      'api::enrolled-lead-condition.enrolled-lead-condition',
      'manyToOne',
      'api::campaign.campaign'
    >;
    operator: Attribute.Component<'data.set', true>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::enrolled-lead-condition.enrolled-lead-condition',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::enrolled-lead-condition.enrolled-lead-condition',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiEstimateEstimate extends Schema.CollectionType {
  collectionName: 'estimates';
  info: {
    singularName: 'estimate';
    pluralName: 'estimates';
    displayName: 'Estimate';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    tenant: Attribute.Relation<
      'api::estimate.estimate',
      'oneToOne',
      'api::tenant.tenant'
    >;
    comment: Attribute.Text;
    uuid: Attribute.UID & Attribute.CustomField<'plugin::field-uuid.uuid'>;
    estimateId: Attribute.String;
    orderId: Attribute.Relation<
      'api::estimate.estimate',
      'oneToOne',
      'api::order.order'
    >;
    clientMessage: Attribute.String;
    fileItem: Attribute.Relation<
      'api::estimate.estimate',
      'oneToOne',
      'api::file-item.file-item'
    >;
    terms: Attribute.Text;
    isShowOrderItemsImages: Attribute.Boolean;
    shippingContact: Attribute.Relation<
      'api::estimate.estimate',
      'oneToOne',
      'api::estimate-shipping-contact.estimate-shipping-contact'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::estimate.estimate',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::estimate.estimate',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiEstimateShippingContactEstimateShippingContact
  extends Schema.CollectionType {
  collectionName: 'estimate_shipping_contacts';
  info: {
    singularName: 'estimate-shipping-contact';
    pluralName: 'estimate-shipping-contacts';
    displayName: 'EstimateShippingContact';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    address: Attribute.String;
    email: Attribute.Email;
    phoneNumber: Attribute.String;
    estimate: Attribute.Relation<
      'api::estimate-shipping-contact.estimate-shipping-contact',
      'oneToOne',
      'api::estimate.estimate'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::estimate-shipping-contact.estimate-shipping-contact',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::estimate-shipping-contact.estimate-shipping-contact',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiExceededServiceExceededService
  extends Schema.CollectionType {
  collectionName: 'exceeded_services';
  info: {
    singularName: 'exceeded-service';
    pluralName: 'exceeded-services';
    displayName: 'Exceeded Service ';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    employee: Attribute.Relation<
      'api::exceeded-service.exceeded-service',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    nextBillingCycle: Attribute.Date;
    tenant: Attribute.Relation<
      'api::exceeded-service.exceeded-service',
      'manyToOne',
      'api::tenant.tenant'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::exceeded-service.exceeded-service',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::exceeded-service.exceeded-service',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiFileItemFileItem extends Schema.CollectionType {
  collectionName: 'file_items';
  info: {
    singularName: 'file-item';
    pluralName: 'file-items';
    displayName: 'FileItem';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    uploadedBy: Attribute.Relation<
      'api::file-item.file-item',
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    attachedFile: Attribute.Media;
    type: Attribute.Enumeration<['generated', 'uploaded']> &
      Attribute.Required &
      Attribute.DefaultTo<'generated'>;
    isFavourite: Attribute.Boolean;
    company: Attribute.Relation<
      'api::file-item.file-item',
      'manyToOne',
      'api::company.company'
    >;
    contact: Attribute.Relation<
      'api::file-item.file-item',
      'manyToOne',
      'api::contact.contact'
    >;
    lead: Attribute.Relation<
      'api::file-item.file-item',
      'manyToOne',
      'api::lead.lead'
    >;
    tenant: Attribute.Relation<
      'api::file-item.file-item',
      'oneToOne',
      'api::tenant.tenant'
    >;
    purchaseRequest: Attribute.Relation<
      'api::file-item.file-item',
      'oneToOne',
      'api::purchase-request.purchase-request'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::file-item.file-item',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::file-item.file-item',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiFormForm extends Schema.CollectionType {
  collectionName: 'forms';
  info: {
    singularName: 'form';
    pluralName: 'forms';
    displayName: 'CONTRACTS: Form';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    tenant: Attribute.Relation<
      'api::form.form',
      'oneToOne',
      'api::tenant.tenant'
    >;
    name: Attribute.String;
    link: Attribute.String;
    formId: Attribute.String;
    uuid: Attribute.UID & Attribute.CustomField<'plugin::field-uuid.uuid'>;
    publicForm: Attribute.Relation<
      'api::form.form',
      'oneToOne',
      'api::public-form.public-form'
    >;
    sendTo: Attribute.Email;
    contact: Attribute.Relation<
      'api::form.form',
      'oneToOne',
      'api::contact.contact'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::form.form', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'api::form.form', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface ApiFormTemplateFormTemplate extends Schema.CollectionType {
  collectionName: 'form_templates';
  info: {
    singularName: 'form-template';
    pluralName: 'form-templates';
    displayName: 'CONTRACTS: FormTemplate';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    uuid: Attribute.UID & Attribute.CustomField<'plugin::field-uuid.uuid'>;
    body: Attribute.JSON;
    tenant: Attribute.Relation<
      'api::form-template.form-template',
      'oneToOne',
      'api::tenant.tenant'
    >;
    title: Attribute.String;
    description: Attribute.RichText;
    file: Attribute.Media;
    templateId: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::form-template.form-template',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::form-template.form-template',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiGenderTypeGenderType extends Schema.CollectionType {
  collectionName: 'gender_types';
  info: {
    singularName: 'gender-type';
    pluralName: 'gender-types';
    displayName: 'INVENTORY: GenderType';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    tenant: Attribute.Relation<
      'api::gender-type.gender-type',
      'oneToOne',
      'api::tenant.tenant'
    >;
    editable: Attribute.Boolean & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::gender-type.gender-type',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::gender-type.gender-type',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiGmCommissionGmCommission extends Schema.CollectionType {
  collectionName: 'gm_commissions';
  info: {
    singularName: 'gm-commission';
    pluralName: 'gm-commissions';
    displayName: 'Sales Commission: Gross Margin';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    salesCommissions: Attribute.Relation<
      'api::gm-commission.gm-commission',
      'manyToMany',
      'api::sales-commission.sales-commission'
    >;
    tenant: Attribute.Relation<
      'api::gm-commission.gm-commission',
      'oneToOne',
      'api::tenant.tenant'
    >;
    grossMarginFrom: Attribute.Decimal;
    grossMarginTo: Attribute.Decimal;
    commission: Attribute.Decimal;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::gm-commission.gm-commission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::gm-commission.gm-commission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiHomeHome extends Schema.SingleType {
  collectionName: 'homes';
  info: {
    singularName: 'home';
    pluralName: 'homes';
    displayName: 'Home';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    hero: Attribute.Component<'ui.section'>;
    key: Attribute.UID & Attribute.CustomField<'plugin::field-uuid.uuid'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::home.home', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'api::home.home', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface ApiImportingSessionImportingSession
  extends Schema.CollectionType {
  collectionName: 'importing_sessions';
  info: {
    singularName: 'importing-session';
    pluralName: 'importing-sessions';
    displayName: 'Importing Session';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    type: Attribute.Enumeration<
      [
        'orders',
        'products',
        'contacts',
        'contactRelations',
        'wishlist',
        'companies',
        'files',
        'updateDefaultPrice',
      ]
    >;
    cmpltdImports: Attribute.Media;
    updImports: Attribute.Media;
    splImports: Attribute.Media;
    regexedId: Attribute.String;
    srcFile: Attribute.Media;
    tenant: Attribute.Relation<
      'api::importing-session.importing-session',
      'oneToOne',
      'api::tenant.tenant'
    >;
    state: Attribute.Enumeration<['progressing', 'completed', 'error']> &
      Attribute.DefaultTo<'progressing'>;
    jobId: Attribute.Integer;
    uploadedBy: Attribute.Relation<
      'api::importing-session.importing-session',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::importing-session.importing-session',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::importing-session.importing-session',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiInventoryAdjustmentInventoryAdjustment
  extends Schema.CollectionType {
  collectionName: 'inventory_adjustments';
  info: {
    singularName: 'inventory-adjustment';
    pluralName: 'inventory-adjustments';
    displayName: 'Inventory Adjustment';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    adjustmentDate: Attribute.DateTime;
    reason: Attribute.String;
    description: Attribute.Text;
    uuid: Attribute.UID & Attribute.CustomField<'plugin::field-uuid.uuid'>;
    location: Attribute.Relation<
      'api::inventory-adjustment.inventory-adjustment',
      'oneToOne',
      'api::business-location.business-location'
    >;
    adjustmentId: Attribute.String;
    tenant: Attribute.Relation<
      'api::inventory-adjustment.inventory-adjustment',
      'oneToOne',
      'api::tenant.tenant'
    >;
    inventoryAdjustmentItems: Attribute.Relation<
      'api::inventory-adjustment.inventory-adjustment',
      'oneToMany',
      'api::inventory-adjustment-item.inventory-adjustment-item'
    >;
    files: Attribute.Media;
    sublocation: Attribute.Relation<
      'api::inventory-adjustment.inventory-adjustment',
      'oneToOne',
      'api::sublocation.sublocation'
    >;
    employee: Attribute.Relation<
      'api::inventory-adjustment.inventory-adjustment',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::inventory-adjustment.inventory-adjustment',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::inventory-adjustment.inventory-adjustment',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiInventoryAdjustmentItemInventoryAdjustmentItem
  extends Schema.CollectionType {
  collectionName: 'inventory_adjustment_items';
  info: {
    singularName: 'inventory-adjustment-item';
    pluralName: 'inventory-adjustment-items';
    displayName: 'Inventory Adjustment Item';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    inventoryAdjustment: Attribute.Relation<
      'api::inventory-adjustment-item.inventory-adjustment-item',
      'manyToOne',
      'api::inventory-adjustment.inventory-adjustment'
    >;
    product: Attribute.Relation<
      'api::inventory-adjustment-item.inventory-adjustment-item',
      'oneToOne',
      'api::product.product'
    >;
    adjustedQuantity: Attribute.Integer;
    quantityAvailable: Attribute.Integer;
    quantityLeft: Attribute.Integer;
    tenant: Attribute.Relation<
      'api::inventory-adjustment-item.inventory-adjustment-item',
      'oneToOne',
      'api::tenant.tenant'
    >;
    serializes: Attribute.Relation<
      'api::inventory-adjustment-item.inventory-adjustment-item',
      'oneToMany',
      'api::inventory-serialize.inventory-serialize'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::inventory-adjustment-item.inventory-adjustment-item',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::inventory-adjustment-item.inventory-adjustment-item',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiInventoryAuditInventoryAudit extends Schema.CollectionType {
  collectionName: 'inventory_audits';
  info: {
    singularName: 'inventory-audit';
    pluralName: 'inventory-audits';
    displayName: 'INVENTORY Audit';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    tenant: Attribute.Relation<
      'api::inventory-audit.inventory-audit',
      'oneToOne',
      'api::tenant.tenant'
    >;
    uuid: Attribute.UID & Attribute.CustomField<'plugin::field-uuid.uuid'>;
    auditDate: Attribute.DateTime;
    name: Attribute.String;
    businessLocation: Attribute.Relation<
      'api::inventory-audit.inventory-audit',
      'oneToOne',
      'api::business-location.business-location'
    >;
    sublocation: Attribute.Relation<
      'api::inventory-audit.inventory-audit',
      'oneToOne',
      'api::sublocation.sublocation'
    >;
    employee: Attribute.Relation<
      'api::inventory-audit.inventory-audit',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    auditId: Attribute.String;
    inventoryAuditItems: Attribute.Relation<
      'api::inventory-audit.inventory-audit',
      'oneToMany',
      'api::inventory-audit-item.inventory-audit-item'
    >;
    finalize: Attribute.Boolean & Attribute.DefaultTo<false>;
    adjusted: Attribute.Boolean & Attribute.DefaultTo<false>;
    isAdjustmentRequired: Attribute.Boolean & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::inventory-audit.inventory-audit',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::inventory-audit.inventory-audit',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiInventoryAuditItemInventoryAuditItem
  extends Schema.CollectionType {
  collectionName: 'inventory_audit_items';
  info: {
    singularName: 'inventory-audit-item';
    pluralName: 'inventory-audit-items';
    displayName: 'INVENTORY Audit Item';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    tenant: Attribute.Relation<
      'api::inventory-audit-item.inventory-audit-item',
      'oneToOne',
      'api::tenant.tenant'
    >;
    adjusted: Attribute.Boolean & Attribute.DefaultTo<false>;
    productInventoryItem: Attribute.Relation<
      'api::inventory-audit-item.inventory-audit-item',
      'oneToOne',
      'api::product-inventory-item.product-inventory-item'
    >;
    sublocation: Attribute.Relation<
      'api::inventory-audit-item.inventory-audit-item',
      'oneToOne',
      'api::sublocation.sublocation'
    >;
    businessLocation: Attribute.Relation<
      'api::inventory-audit-item.inventory-audit-item',
      'oneToOne',
      'api::business-location.business-location'
    >;
    inventoryAudit: Attribute.Relation<
      'api::inventory-audit-item.inventory-audit-item',
      'manyToOne',
      'api::inventory-audit.inventory-audit'
    >;
    inventoryQty: Attribute.Integer;
    actualQty: Attribute.Integer;
    scannedQty: Attribute.Integer;
    sublocationItems: Attribute.Relation<
      'api::inventory-audit-item.inventory-audit-item',
      'oneToMany',
      'api::sublocation-item.sublocation-item'
    >;
    auditItemId: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::inventory-audit-item.inventory-audit-item',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::inventory-audit-item.inventory-audit-item',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiInventoryQuantityNotificationInventoryQuantityNotification
  extends Schema.CollectionType {
  collectionName: 'inventory_quantity_notifications';
  info: {
    singularName: 'inventory-quantity-notification';
    pluralName: 'inventory-quantity-notifications';
    displayName: 'NOTIFICATIONS: Inventory Quantity Notification';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    userNotifications: Attribute.Relation<
      'api::inventory-quantity-notification.inventory-quantity-notification',
      'oneToMany',
      'api::user-notification.user-notification'
    >;
    type: Attribute.Enumeration<['MinReached', 'NoLeft']>;
    productInventoryItem: Attribute.Relation<
      'api::inventory-quantity-notification.inventory-quantity-notification',
      'oneToOne',
      'api::product-inventory-item.product-inventory-item'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::inventory-quantity-notification.inventory-quantity-notification',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::inventory-quantity-notification.inventory-quantity-notification',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiInventorySerializeInventorySerialize
  extends Schema.CollectionType {
  collectionName: 'inventory_serializes';
  info: {
    singularName: 'inventory-serialize';
    pluralName: 'inventory-serializes';
    displayName: 'INVENTORY: Serialize';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    tenant: Attribute.Relation<
      'api::inventory-serialize.inventory-serialize',
      'oneToOne',
      'api::tenant.tenant'
    >;
    editable: Attribute.Boolean & Attribute.DefaultTo<false>;
    sellingProductOrderItem: Attribute.Relation<
      'api::inventory-serialize.inventory-serialize',
      'manyToOne',
      'api::product-order-item.product-order-item'
    >;
    productInventoryItem: Attribute.Relation<
      'api::inventory-serialize.inventory-serialize',
      'manyToOne',
      'api::product-inventory-item.product-inventory-item'
    >;
    returnItem: Attribute.Relation<
      'api::inventory-serialize.inventory-serialize',
      'manyToOne',
      'api::return-item.return-item'
    >;
    inventoryAdjustmentItem: Attribute.Relation<
      'api::inventory-serialize.inventory-serialize',
      'manyToOne',
      'api::inventory-adjustment-item.inventory-adjustment-item'
    >;
    transferOrderItem: Attribute.Relation<
      'api::inventory-serialize.inventory-serialize',
      'manyToOne',
      'api::transfer-order-item.transfer-order-item'
    >;
    salesItemReport: Attribute.Relation<
      'api::inventory-serialize.inventory-serialize',
      'oneToOne',
      'api::sales-item-report.sales-item-report'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::inventory-serialize.inventory-serialize',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::inventory-serialize.inventory-serialize',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiInvoiceInvoice extends Schema.CollectionType {
  collectionName: 'invoices';
  info: {
    singularName: 'invoice';
    pluralName: 'invoices';
    displayName: 'Invoice';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    tenant: Attribute.Relation<
      'api::invoice.invoice',
      'oneToOne',
      'api::tenant.tenant'
    >;
    comment: Attribute.Text;
    uuid: Attribute.UID & Attribute.CustomField<'plugin::field-uuid.uuid'>;
    invoiceId: Attribute.String;
    orderId: Attribute.Relation<
      'api::invoice.invoice',
      'oneToOne',
      'api::order.order'
    >;
    shippingContact: Attribute.Relation<
      'api::invoice.invoice',
      'oneToOne',
      'api::invoice-shipping-contact.invoice-shipping-contact'
    >;
    clientMessage: Attribute.String;
    fileItem: Attribute.Relation<
      'api::invoice.invoice',
      'oneToOne',
      'api::file-item.file-item'
    >;
    terms: Attribute.Text;
    isShowOrderItemsImages: Attribute.Boolean & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::invoice.invoice',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::invoice.invoice',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiInvoiceShippingContactInvoiceShippingContact
  extends Schema.CollectionType {
  collectionName: 'invoice_shipping_contacts';
  info: {
    singularName: 'invoice-shipping-contact';
    pluralName: 'invoice-shipping-contacts';
    displayName: 'invoiceShippingContact';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    address: Attribute.String;
    email: Attribute.Email;
    phoneNumber: Attribute.String;
    invoice: Attribute.Relation<
      'api::invoice-shipping-contact.invoice-shipping-contact',
      'oneToOne',
      'api::invoice.invoice'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::invoice-shipping-contact.invoice-shipping-contact',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::invoice-shipping-contact.invoice-shipping-contact',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiInvtCmpAttrInvtCmpAttr extends Schema.CollectionType {
  collectionName: 'invt_cmp_attrs';
  info: {
    singularName: 'invt-cmp-attr';
    pluralName: 'invt-cmp-attrs';
    displayName: 'Composite Product Attribute';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    tenant: Attribute.Relation<
      'api::invt-cmp-attr.invt-cmp-attr',
      'oneToOne',
      'api::tenant.tenant'
    >;
    comPrAttrOps: Attribute.Relation<
      'api::invt-cmp-attr.invt-cmp-attr',
      'oneToMany',
      'api::invt-cmp-attr-opt.invt-cmp-attr-opt'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::invt-cmp-attr.invt-cmp-attr',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::invt-cmp-attr.invt-cmp-attr',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiInvtCmpAttrOptInvtCmpAttrOpt extends Schema.CollectionType {
  collectionName: 'invt_cmp_attr_opts';
  info: {
    singularName: 'invt-cmp-attr-opt';
    pluralName: 'invt-cmp-attr-opts';
    displayName: 'Composite Product Attribute Option';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    comPrAttr: Attribute.Relation<
      'api::invt-cmp-attr-opt.invt-cmp-attr-opt',
      'manyToOne',
      'api::invt-cmp-attr.invt-cmp-attr'
    >;
    cmpCostTrcks: Attribute.Relation<
      'api::invt-cmp-attr-opt.invt-cmp-attr-opt',
      'manyToMany',
      'api::invt-cmp-trck.invt-cmp-trck'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::invt-cmp-attr-opt.invt-cmp-attr-opt',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::invt-cmp-attr-opt.invt-cmp-attr-opt',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiInvtCmpColorInvtCmpColor extends Schema.CollectionType {
  collectionName: 'invt_cmp_colors';
  info: {
    singularName: 'invt-cmp-color';
    pluralName: 'invt-cmp-colors';
    displayName: 'Composite Product Color';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    tenant: Attribute.Relation<
      'api::invt-cmp-color.invt-cmp-color',
      'oneToOne',
      'api::tenant.tenant'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::invt-cmp-color.invt-cmp-color',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::invt-cmp-color.invt-cmp-color',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiInvtCmpSizeInvtCmpSize extends Schema.CollectionType {
  collectionName: 'invt_cmp_sizes';
  info: {
    singularName: 'invt-cmp-size';
    pluralName: 'invt-cmp-sizes';
    displayName: 'Composite Product Size';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    tenant: Attribute.Relation<
      'api::invt-cmp-size.invt-cmp-size',
      'oneToOne',
      'api::tenant.tenant'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::invt-cmp-size.invt-cmp-size',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::invt-cmp-size.invt-cmp-size',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiInvtCmpTrckInvtCmpTrck extends Schema.CollectionType {
  collectionName: 'invt_cmp_trcks';
  info: {
    singularName: 'invt-cmp-trck';
    pluralName: 'invt-cmp-trcks';
    displayName: 'Composite Product Cost Tracker';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    color: Attribute.Relation<
      'api::invt-cmp-trck.invt-cmp-trck',
      'oneToOne',
      'api::invt-cmp-color.invt-cmp-color'
    >;
    size: Attribute.Relation<
      'api::invt-cmp-trck.invt-cmp-trck',
      'oneToOne',
      'api::invt-cmp-size.invt-cmp-size'
    >;
    costTrackerItems: Attribute.Relation<
      'api::invt-cmp-trck.invt-cmp-trck',
      'oneToMany',
      'api::invt-cmp-trck-itm.invt-cmp-trck-itm'
    >;
    compositeProduct: Attribute.Relation<
      'api::invt-cmp-trck.invt-cmp-trck',
      'oneToOne',
      'api::composite-product.composite-product'
    >;
    margin: Attribute.Float;
    cmpAttrOpts: Attribute.Relation<
      'api::invt-cmp-trck.invt-cmp-trck',
      'manyToMany',
      'api::invt-cmp-attr-opt.invt-cmp-attr-opt'
    >;
    multiplier: Attribute.Float;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::invt-cmp-trck.invt-cmp-trck',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::invt-cmp-trck.invt-cmp-trck',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiInvtCmpTrckItmInvtCmpTrckItm extends Schema.CollectionType {
  collectionName: 'invt_cmp_trck_itms';
  info: {
    singularName: 'invt-cmp-trck-itm';
    pluralName: 'invt-cmp-trck-itms';
    displayName: 'Composite Product Cost Tracker Item';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    quantity: Attribute.Integer;
    price: Attribute.Decimal;
    vendor: Attribute.String;
    invoice: Attribute.String;
    note: Attribute.Text;
    itemId: Attribute.String;
    costTrackerInfo: Attribute.Relation<
      'api::invt-cmp-trck-itm.invt-cmp-trck-itm',
      'manyToOne',
      'api::invt-cmp-trck.invt-cmp-trck'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::invt-cmp-trck-itm.invt-cmp-trck-itm',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::invt-cmp-trck-itm.invt-cmp-trck-itm',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiInvtItmRecordInvtItmRecord extends Schema.CollectionType {
  collectionName: 'invt_itm_records';
  info: {
    singularName: 'invt-itm-record';
    pluralName: 'invt-itm-records';
    displayName: 'PRODUCT: Inventory-item-record';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    age: Attribute.Integer;
    grossMargin: Attribute.Decimal;
    price: Attribute.Decimal;
    soldDate: Attribute.DateTime;
    tenant: Attribute.Relation<
      'api::invt-itm-record.invt-itm-record',
      'oneToOne',
      'api::tenant.tenant'
    >;
    productInventoryItemEvent: Attribute.Relation<
      'api::invt-itm-record.invt-itm-record',
      'manyToOne',
      'api::product-inventory-item-event.product-inventory-item-event'
    >;
    productInventoryItem: Attribute.Relation<
      'api::invt-itm-record.invt-itm-record',
      'manyToOne',
      'api::product-inventory-item.product-inventory-item'
    >;
    memoTaken: Attribute.Boolean & Attribute.DefaultTo<false>;
    memoSold: Attribute.Boolean & Attribute.DefaultTo<false>;
    sellingOrder: Attribute.Relation<
      'api::invt-itm-record.invt-itm-record',
      'oneToOne',
      'api::order.order'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::invt-itm-record.invt-itm-record',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::invt-itm-record.invt-itm-record',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiItemCategoryItemCategory extends Schema.CollectionType {
  collectionName: 'item_categories';
  info: {
    singularName: 'item-category';
    pluralName: 'item-categories';
    displayName: 'Item Category';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    tenant: Attribute.Relation<
      'api::item-category.item-category',
      'oneToOne',
      'api::tenant.tenant'
    >;
    name: Attribute.String;
    editable: Attribute.Boolean & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::item-category.item-category',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::item-category.item-category',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiJewelryProductJewelryProduct extends Schema.CollectionType {
  collectionName: 'jewelry_products';
  info: {
    singularName: 'jewelry-product';
    pluralName: 'jewelry-products';
    displayName: 'INVENTORY: Jewelry Product';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    files: Attribute.Media;
    tenant: Attribute.Relation<
      'api::jewelry-product.jewelry-product',
      'oneToOne',
      'api::tenant.tenant'
    >;
    barcode: Attribute.String;
    serialNumber: Attribute.String;
    jewelryProductType: Attribute.Relation<
      'api::jewelry-product.jewelry-product',
      'oneToOne',
      'api::jewelry-product-type.jewelry-product-type'
    >;
    conditionType: Attribute.Relation<
      'api::jewelry-product.jewelry-product',
      'oneToOne',
      'api::condition-type.condition-type'
    >;
    genderType: Attribute.Relation<
      'api::jewelry-product.jewelry-product',
      'oneToOne',
      'api::gender-type.gender-type'
    >;
    process: Attribute.Relation<
      'api::jewelry-product.jewelry-product',
      'oneToOne',
      'api::manufacturing-process.manufacturing-process'
    >;
    platting: Attribute.Relation<
      'api::jewelry-product.jewelry-product',
      'oneToOne',
      'api::platting-type.platting-type'
    >;
    metalType: Attribute.Relation<
      'api::jewelry-product.jewelry-product',
      'oneToOne',
      'api::metal-type.metal-type'
    >;
    metalFinishType: Attribute.Relation<
      'api::jewelry-product.jewelry-product',
      'oneToOne',
      'api::metal-finish-type.metal-finish-type'
    >;
    timePeriod: Attribute.Relation<
      'api::jewelry-product.jewelry-product',
      'oneToOne',
      'api::time-period.time-period'
    >;
    engravingType: Attribute.Relation<
      'api::jewelry-product.jewelry-product',
      'oneToOne',
      'api::engraving-type.engraving-type'
    >;
    materialGradeType: Attribute.Relation<
      'api::jewelry-product.jewelry-product',
      'oneToOne',
      'api::material-grade.material-grade'
    >;
    specificType: Attribute.Relation<
      'api::jewelry-product.jewelry-product',
      'oneToOne',
      'api::specific-type.specific-type'
    >;
    size: Attribute.Relation<
      'api::jewelry-product.jewelry-product',
      'oneToOne',
      'api::size.size'
    >;
    shankStyle: Attribute.Relation<
      'api::jewelry-product.jewelry-product',
      'oneToOne',
      'api::shank-style.shank-style'
    >;
    designStyle: Attribute.Relation<
      'api::jewelry-product.jewelry-product',
      'oneToOne',
      'api::design-style.design-style'
    >;
    backing: Attribute.Relation<
      'api::jewelry-product.jewelry-product',
      'oneToOne',
      'api::backing.backing'
    >;
    strandsLength: Attribute.Relation<
      'api::jewelry-product.jewelry-product',
      'oneToOne',
      'api::strands-length.strands-length'
    >;
    strand: Attribute.Relation<
      'api::jewelry-product.jewelry-product',
      'oneToOne',
      'api::strand.strand'
    >;
    linkStyle: Attribute.Relation<
      'api::jewelry-product.jewelry-product',
      'oneToOne',
      'api::link-style.link-style'
    >;
    linkType: Attribute.Relation<
      'api::jewelry-product.jewelry-product',
      'oneToOne',
      'api::link-type.link-type'
    >;
    pieces: Attribute.Relation<
      'api::jewelry-product.jewelry-product',
      'oneToOne',
      'api::piece.piece'
    >;
    brand: Attribute.Relation<
      'api::jewelry-product.jewelry-product',
      'oneToOne',
      'api::product-brand.product-brand'
    >;
    country: Attribute.Relation<
      'api::jewelry-product.jewelry-product',
      'oneToOne',
      'api::country.country'
    >;
    returnable: Attribute.Boolean;
    businessUseOnly: Attribute.Boolean;
    bundleUseOnly: Attribute.Boolean;
    packagingProduct: Attribute.Boolean;
    expiryDate: Attribute.DateTime;
    description: Attribute.String;
    SKU: Attribute.String;
    UPC: Attribute.String;
    MPN: Attribute.String;
    EAN: Attribute.String;
    ISBN: Attribute.String;
    partsWarranty: Attribute.DateTime;
    laborWarranty: Attribute.DateTime;
    uuid: Attribute.UID & Attribute.CustomField<'plugin::field-uuid.uuid'>;
    defaultPrice: Attribute.Decimal;
    favorite: Attribute.Boolean;
    knotStyle: Attribute.Relation<
      'api::jewelry-product.jewelry-product',
      'oneToOne',
      'api::knot-style.knot-style'
    >;
    boxPaper: Attribute.Relation<
      'api::jewelry-product.jewelry-product',
      'oneToOne',
      'api::box-paper.box-paper'
    >;
    productAttributeOptions: Attribute.Relation<
      'api::jewelry-product.jewelry-product',
      'manyToMany',
      'api::product-attribute-option.product-attribute-option'
    >;
    productInventoryItems: Attribute.Relation<
      'api::jewelry-product.jewelry-product',
      'oneToMany',
      'api::product-inventory-item.product-inventory-item'
    >;
    rentableData: Attribute.Relation<
      'api::jewelry-product.jewelry-product',
      'oneToOne',
      'api::rentable-data.rentable-data'
    >;
    model: Attribute.String;
    weight: Attribute.Relation<
      'api::jewelry-product.jewelry-product',
      'oneToOne',
      'api::weight.weight'
    >;
    dimension: Attribute.Relation<
      'api::jewelry-product.jewelry-product',
      'oneToOne',
      'api::dimension.dimension'
    >;
    tagProductName: Attribute.String;
    marginCost: Attribute.Decimal;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::jewelry-product.jewelry-product',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::jewelry-product.jewelry-product',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiJewelryProductTypeJewelryProductType
  extends Schema.CollectionType {
  collectionName: 'jewelry_product_types';
  info: {
    singularName: 'jewelry-product-type';
    pluralName: 'jewelry-product-types';
    displayName: 'INVENTORY: Jewelry Product Type';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    tenant: Attribute.Relation<
      'api::jewelry-product-type.jewelry-product-type',
      'oneToOne',
      'api::tenant.tenant'
    >;
    specificTypes: Attribute.Relation<
      'api::jewelry-product-type.jewelry-product-type',
      'oneToMany',
      'api::specific-type.specific-type'
    >;
    sizes: Attribute.Relation<
      'api::jewelry-product-type.jewelry-product-type',
      'oneToMany',
      'api::size.size'
    >;
    shankStyles: Attribute.Relation<
      'api::jewelry-product-type.jewelry-product-type',
      'oneToMany',
      'api::shank-style.shank-style'
    >;
    designStyles: Attribute.Relation<
      'api::jewelry-product-type.jewelry-product-type',
      'oneToMany',
      'api::design-style.design-style'
    >;
    backings: Attribute.Relation<
      'api::jewelry-product-type.jewelry-product-type',
      'oneToMany',
      'api::backing.backing'
    >;
    strands: Attribute.Relation<
      'api::jewelry-product-type.jewelry-product-type',
      'oneToMany',
      'api::strand.strand'
    >;
    strandsLengths: Attribute.Relation<
      'api::jewelry-product-type.jewelry-product-type',
      'oneToMany',
      'api::strands-length.strands-length'
    >;
    knotStyles: Attribute.Relation<
      'api::jewelry-product-type.jewelry-product-type',
      'oneToMany',
      'api::knot-style.knot-style'
    >;
    linkStyles: Attribute.Relation<
      'api::jewelry-product-type.jewelry-product-type',
      'oneToMany',
      'api::link-style.link-style'
    >;
    linkTypes: Attribute.Relation<
      'api::jewelry-product-type.jewelry-product-type',
      'oneToMany',
      'api::link-type.link-type'
    >;
    pieces: Attribute.Relation<
      'api::jewelry-product-type.jewelry-product-type',
      'oneToMany',
      'api::piece.piece'
    >;
    countries: Attribute.Relation<
      'api::jewelry-product-type.jewelry-product-type',
      'oneToMany',
      'api::country.country'
    >;
    boxPapers: Attribute.Relation<
      'api::jewelry-product-type.jewelry-product-type',
      'oneToMany',
      'api::box-paper.box-paper'
    >;
    productAttributes: Attribute.Relation<
      'api::jewelry-product-type.jewelry-product-type',
      'manyToMany',
      'api::product-attribute.product-attribute'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::jewelry-product-type.jewelry-product-type',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::jewelry-product-type.jewelry-product-type',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiKnotStyleKnotStyle extends Schema.CollectionType {
  collectionName: 'knot_styles';
  info: {
    singularName: 'knot-style';
    pluralName: 'knot-styles';
    displayName: 'INVENTORY: Knot Style';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    tenant: Attribute.Relation<
      'api::knot-style.knot-style',
      'oneToOne',
      'api::tenant.tenant'
    >;
    jewelryProductType: Attribute.Relation<
      'api::knot-style.knot-style',
      'manyToOne',
      'api::jewelry-product-type.jewelry-product-type'
    >;
    editable: Attribute.Boolean & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::knot-style.knot-style',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::knot-style.knot-style',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiLayoutLayout extends Schema.SingleType {
  collectionName: 'layouts';
  info: {
    singularName: 'layout';
    pluralName: 'layouts';
    displayName: 'Layout';
    description: 'Used for common layout components data';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    headerMenu: Attribute.Component<'ui.link', true>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::layout.layout',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::layout.layout',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiLeadLead extends Schema.CollectionType {
  collectionName: 'leads';
  info: {
    singularName: 'lead';
    pluralName: 'leads';
    displayName: 'Lead';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    fullName: Attribute.String;
    email: Attribute.Email & Attribute.Required;
    user: Attribute.Relation<
      'api::lead.lead',
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    phoneNumber: Attribute.String;
    address: Attribute.String;
    leadOwner: Attribute.Relation<
      'api::lead.lead',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    avatar: Attribute.Media;
    uuid: Attribute.UID & Attribute.CustomField<'plugin::field-uuid.uuid'>;
    tenant: Attribute.Relation<
      'api::lead.lead',
      'oneToOne',
      'api::tenant.tenant'
    >;
    activities: Attribute.Relation<
      'api::lead.lead',
      'oneToMany',
      'api::activity.activity'
    >;
    todos: Attribute.Relation<'api::lead.lead', 'oneToMany', 'api::todo.todo'>;
    notes: Attribute.Relation<'api::lead.lead', 'oneToMany', 'api::note.note'>;
    deals: Attribute.Relation<'api::lead.lead', 'oneToMany', 'api::deal.deal'>;
    fileItems: Attribute.Relation<
      'api::lead.lead',
      'oneToMany',
      'api::file-item.file-item'
    >;
    campaignEnrolledLeads: Attribute.Relation<
      'api::lead.lead',
      'oneToMany',
      'api::campaign-enrolled-lead.campaign-enrolled-lead'
    >;
    birthdayDate: Attribute.Date;
    customFields: Attribute.JSON;
    presentContact: Attribute.Relation<
      'api::lead.lead',
      'oneToOne',
      'api::contact.contact'
    >;
    leadSource: Attribute.Enumeration<
      [
        'walk in',
        'external referral',
        'online store',
        'website',
        'advertisement',
        'google ad',
        'facebook ad',
        'instagram',
        'tik tok',
        'google search',
        'unknown',
      ]
    >;
    leadStage: Attribute.Enumeration<
      ['default', 'success', 'warning', 'error']
    >;
    additionalEmails: Attribute.Relation<
      'api::lead.lead',
      'oneToMany',
      'api::crm-additional-email.crm-additional-email'
    >;
    additionalAddresses: Attribute.Relation<
      'api::lead.lead',
      'oneToMany',
      'api::crm-additional-address.crm-additional-address'
    >;
    additionalPhoneNumbers: Attribute.Relation<
      'api::lead.lead',
      'oneToMany',
      'api::crm-additional-phone-number.crm-additional-phone-number'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::lead.lead', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'api::lead.lead', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface ApiLinkStyleLinkStyle extends Schema.CollectionType {
  collectionName: 'link_styles';
  info: {
    singularName: 'link-style';
    pluralName: 'link-styles';
    displayName: 'INVENTORY: Link Style';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    tenant: Attribute.Relation<
      'api::link-style.link-style',
      'oneToOne',
      'api::tenant.tenant'
    >;
    jewelryProductType: Attribute.Relation<
      'api::link-style.link-style',
      'manyToOne',
      'api::jewelry-product-type.jewelry-product-type'
    >;
    editable: Attribute.Boolean;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::link-style.link-style',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::link-style.link-style',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiLinkTypeLinkType extends Schema.CollectionType {
  collectionName: 'link_types';
  info: {
    singularName: 'link-type';
    pluralName: 'link-types';
    displayName: 'INVENTORY: Link Type';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    jewelryProductType: Attribute.Relation<
      'api::link-type.link-type',
      'manyToOne',
      'api::jewelry-product-type.jewelry-product-type'
    >;
    tenant: Attribute.Relation<
      'api::link-type.link-type',
      'oneToOne',
      'api::tenant.tenant'
    >;
    editable: Attribute.Boolean & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::link-type.link-type',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::link-type.link-type',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiLocalizationSettingLocalizationSetting
  extends Schema.CollectionType {
  collectionName: 'localization_settings';
  info: {
    singularName: 'localization-setting';
    pluralName: 'localization-settings';
    displayName: 'SETTINGS: Localization Setting';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    user: Attribute.Relation<
      'api::localization-setting.localization-setting',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    dateFormat: Attribute.Enumeration<
      ['YYYY_MM_DD', 'DD_MM_YYYY', 'MM_DD_YYYY']
    > &
      Attribute.DefaultTo<'MM_DD_YYYY'>;
    timeZone: Attribute.String;
    timeFormat: Attribute.Enumeration<['HH_mm', 'hh_mm_A']> &
      Attribute.DefaultTo<'hh_mm_A'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::localization-setting.localization-setting',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::localization-setting.localization-setting',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiLocationLocation extends Schema.CollectionType {
  collectionName: 'locations';
  info: {
    singularName: 'location';
    pluralName: 'locations';
    displayName: 'Location';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    address: Attribute.String & Attribute.Required;
    type: Attribute.Enumeration<['Store', 'Warehouse']>;
    tenant: Attribute.Relation<
      'api::location.location',
      'manyToOne',
      'api::tenant.tenant'
    >;
    zipcode: Attribute.String;
    docAddressLine1: Attribute.Text;
    docAddressLine2: Attribute.Text;
    docAddressLine3: Attribute.Text;
    docAddressLine4: Attribute.Text;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::location.location',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::location.location',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiMailTemplateMailTemplate extends Schema.CollectionType {
  collectionName: 'mail_templates';
  info: {
    singularName: 'mail-template';
    pluralName: 'mail-templates';
    displayName: 'Mail Template';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    text: Attribute.Text;
    owner: Attribute.Relation<
      'api::mail-template.mail-template',
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    name: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::mail-template.mail-template',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::mail-template.mail-template',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiMaintenanceMaintenance extends Schema.CollectionType {
  collectionName: 'maintenances';
  info: {
    singularName: 'maintenance';
    pluralName: 'maintenances';
    displayName: 'Maintenance';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    notes: Attribute.Text;
    files: Attribute.Media;
    tenant: Attribute.Relation<
      'api::maintenance.maintenance',
      'oneToOne',
      'api::tenant.tenant'
    >;
    resourceInventoryItem: Attribute.Relation<
      'api::maintenance.maintenance',
      'oneToOne',
      'api::resource-inventory-item.resource-inventory-item'
    >;
    active: Attribute.Boolean & Attribute.DefaultTo<false>;
    maintainedBy: Attribute.Relation<
      'api::maintenance.maintenance',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    uuid: Attribute.UID & Attribute.CustomField<'plugin::field-uuid.uuid'>;
    maintenanceEvents: Attribute.Relation<
      'api::maintenance.maintenance',
      'oneToMany',
      'api::maintenance-event.maintenance-event'
    >;
    frequencyDays: Attribute.Integer &
      Attribute.Required &
      Attribute.DefaultTo<1>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::maintenance.maintenance',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::maintenance.maintenance',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiMaintenanceEventMaintenanceEvent
  extends Schema.CollectionType {
  collectionName: 'maintenance_events';
  info: {
    singularName: 'maintenance-event';
    pluralName: 'maintenance-events';
    displayName: 'Maintenance Event';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    tenant: Attribute.Relation<
      'api::maintenance-event.maintenance-event',
      'oneToOne',
      'api::tenant.tenant'
    >;
    dateReported: Attribute.DateTime & Attribute.Required;
    reportedBy: Attribute.Relation<
      'api::maintenance-event.maintenance-event',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    title: Attribute.String & Attribute.Required;
    notes: Attribute.Text;
    type: Attribute.Enumeration<['completed', 'issue']> &
      Attribute.Required &
      Attribute.DefaultTo<'completed'>;
    maintenance: Attribute.Relation<
      'api::maintenance-event.maintenance-event',
      'manyToOne',
      'api::maintenance.maintenance'
    >;
    files: Attribute.Media;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::maintenance-event.maintenance-event',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::maintenance-event.maintenance-event',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiMaintenanceQuantityNotificationMaintenanceQuantityNotification
  extends Schema.CollectionType {
  collectionName: 'maintenance_quantity_notifications';
  info: {
    singularName: 'maintenance-quantity-notification';
    pluralName: 'maintenance-quantity-notifications';
    displayName: 'NOTIFICATIONS: Maintenance Quantity Notification';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    type: Attribute.Enumeration<['NoLeft', 'Day']>;
    userNotifications: Attribute.Relation<
      'api::maintenance-quantity-notification.maintenance-quantity-notification',
      'oneToMany',
      'api::user-notification.user-notification'
    >;
    maintenance: Attribute.Relation<
      'api::maintenance-quantity-notification.maintenance-quantity-notification',
      'oneToOne',
      'api::maintenance.maintenance'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::maintenance-quantity-notification.maintenance-quantity-notification',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::maintenance-quantity-notification.maintenance-quantity-notification',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiManufacturingProcessManufacturingProcess
  extends Schema.CollectionType {
  collectionName: 'manufacturing_processes';
  info: {
    singularName: 'manufacturing-process';
    pluralName: 'manufacturing-processes';
    displayName: 'INVENTORY: Manufacturing Process';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    tenant: Attribute.Relation<
      'api::manufacturing-process.manufacturing-process',
      'oneToOne',
      'api::tenant.tenant'
    >;
    editable: Attribute.Boolean & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::manufacturing-process.manufacturing-process',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::manufacturing-process.manufacturing-process',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiMarketingCustomersReportMarketingCustomersReport
  extends Schema.CollectionType {
  collectionName: 'marketing_customers_reports';
  info: {
    singularName: 'marketing-customers-report';
    pluralName: 'marketing-customers-reports';
    displayName: 'REPORTS: Marketing Customers Report';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    enrolledContact: Attribute.Relation<
      'api::marketing-customers-report.marketing-customers-report',
      'oneToOne',
      'api::campaign-enrolled-contact.campaign-enrolled-contact'
    >;
    enrolledLead: Attribute.Relation<
      'api::marketing-customers-report.marketing-customers-report',
      'oneToOne',
      'api::campaign-enrolled-lead.campaign-enrolled-lead'
    >;
    SMSsent: Attribute.Integer;
    EMAILsent: Attribute.Integer;
    tenant: Attribute.Relation<
      'api::marketing-customers-report.marketing-customers-report',
      'oneToOne',
      'api::tenant.tenant'
    >;
    MMSsent: Attribute.Integer;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::marketing-customers-report.marketing-customers-report',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::marketing-customers-report.marketing-customers-report',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiMarketingEmailTemplateMarketingEmailTemplate
  extends Schema.CollectionType {
  collectionName: 'marketing_email_templates';
  info: {
    singularName: 'marketing-email-template';
    pluralName: 'marketing-email-templates';
    displayName: 'MARKETING: Email Template';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    templateJSON: Attribute.JSON;
    templateHtml: Attribute.Text;
    tenant: Attribute.Relation<
      'api::marketing-email-template.marketing-email-template',
      'oneToOne',
      'api::tenant.tenant'
    >;
    uuid: Attribute.UID & Attribute.CustomField<'plugin::field-uuid.uuid'>;
    name: Attribute.String;
    subject: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::marketing-email-template.marketing-email-template',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::marketing-email-template.marketing-email-template',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiMaterialGradeMaterialGrade extends Schema.CollectionType {
  collectionName: 'material_grades';
  info: {
    singularName: 'material-grade';
    pluralName: 'material-grades';
    displayName: 'INVENTORY: Material Grade';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    tenant: Attribute.Relation<
      'api::material-grade.material-grade',
      'oneToOne',
      'api::tenant.tenant'
    >;
    metalType: Attribute.Relation<
      'api::material-grade.material-grade',
      'manyToOne',
      'api::metal-type.metal-type'
    >;
    editable: Attribute.Boolean & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::material-grade.material-grade',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::material-grade.material-grade',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiMembershipMembership extends Schema.CollectionType {
  collectionName: 'memberships';
  info: {
    singularName: 'membership';
    pluralName: 'memberships';
    displayName: 'Membership';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    description: Attribute.Text;
    price: Attribute.Decimal & Attribute.Required;
    rewardPoints: Attribute.Integer;
    tenant: Attribute.Relation<
      'api::membership.membership',
      'oneToOne',
      'api::tenant.tenant'
    >;
    membershipOrderItems: Attribute.Relation<
      'api::membership.membership',
      'oneToMany',
      'api::membership-order-item.membership-order-item'
    >;
    tax: Attribute.Relation<
      'api::membership.membership',
      'oneToOne',
      'api::tax.tax'
    >;
    membershipItems: Attribute.Relation<
      'api::membership.membership',
      'oneToMany',
      'api::membership-item.membership-item'
    >;
    durationCount: Attribute.Integer &
      Attribute.Required &
      Attribute.SetMinMax<{
        min: 1;
      }> &
      Attribute.DefaultTo<1>;
    durationPeriod: Attribute.Enumeration<['day', 'week', 'month', 'year']>;
    favorite: Attribute.Boolean & Attribute.DefaultTo<false>;
    uuid: Attribute.UID & Attribute.CustomField<'plugin::field-uuid.uuid'>;
    active: Attribute.Boolean & Attribute.DefaultTo<true>;
    membershipId: Attribute.String & Attribute.Unique;
    revenue: Attribute.String;
    cost: Attribute.String;
    accServiceEntities: Attribute.Relation<
      'api::membership.membership',
      'oneToMany',
      'api::acc-service-entity.acc-service-entity'
    >;
    revenueChartAccount: Attribute.Relation<
      'api::membership.membership',
      'manyToOne',
      'api::chart-account.chart-account'
    >;
    revenueChartCategory: Attribute.Relation<
      'api::membership.membership',
      'manyToOne',
      'api::chart-category.chart-category'
    >;
    revenueChartSubcategory: Attribute.Relation<
      'api::membership.membership',
      'manyToOne',
      'api::chart-subcategory.chart-subcategory'
    >;
    costChartAccount: Attribute.Relation<
      'api::membership.membership',
      'manyToOne',
      'api::chart-account.chart-account'
    >;
    costChartCategory: Attribute.Relation<
      'api::membership.membership',
      'manyToOne',
      'api::chart-category.chart-category'
    >;
    costChartSubcategory: Attribute.Relation<
      'api::membership.membership',
      'manyToOne',
      'api::chart-subcategory.chart-subcategory'
    >;
    taxCollection: Attribute.Relation<
      'api::membership.membership',
      'oneToOne',
      'api::tax-collection.tax-collection'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::membership.membership',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::membership.membership',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiMembershipItemMembershipItem extends Schema.CollectionType {
  collectionName: 'membership_items';
  info: {
    singularName: 'membership-item';
    pluralName: 'membership-items';
    displayName: 'MembershipItem';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    product: Attribute.Relation<
      'api::membership-item.membership-item',
      'oneToOne',
      'api::product.product'
    >;
    class: Attribute.Relation<
      'api::membership-item.membership-item',
      'oneToOne',
      'api::class.class'
    >;
    service: Attribute.Relation<
      'api::membership-item.membership-item',
      'oneToOne',
      'api::service.service'
    >;
    compositeProduct: Attribute.Relation<
      'api::membership-item.membership-item',
      'oneToOne',
      'api::composite-product.composite-product'
    >;
    itemsQuantity: Attribute.Integer;
    membership: Attribute.Relation<
      'api::membership-item.membership-item',
      'manyToOne',
      'api::membership.membership'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::membership-item.membership-item',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::membership-item.membership-item',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiMembershipOrderItemMembershipOrderItem
  extends Schema.CollectionType {
  collectionName: 'membership_order_items';
  info: {
    singularName: 'membership-order-item';
    pluralName: 'membership-order-items';
    displayName: 'SELLING: Membership Order Item';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    quantity: Attribute.Integer;
    note: Attribute.Text;
    membership: Attribute.Relation<
      'api::membership-order-item.membership-order-item',
      'manyToOne',
      'api::membership.membership'
    >;
    order: Attribute.Relation<
      'api::membership-order-item.membership-order-item',
      'manyToOne',
      'api::order.order'
    >;
    purchaseType: Attribute.Enumeration<['buy', 'rent']>;
    itemId: Attribute.String & Attribute.Required;
    price: Attribute.Decimal;
    discounts: Attribute.Relation<
      'api::membership-order-item.membership-order-item',
      'oneToMany',
      'api::discount.discount'
    >;
    tax: Attribute.Relation<
      'api::membership-order-item.membership-order-item',
      'oneToOne',
      'api::tax.tax'
    >;
    status: Attribute.Enumeration<['draft', 'published']> &
      Attribute.DefaultTo<'published'>;
    isShowInvoiceNote: Attribute.Boolean & Attribute.DefaultTo<true>;
    isVisibleInDocs: Attribute.Boolean & Attribute.DefaultTo<true>;
    taxCollection: Attribute.Relation<
      'api::membership-order-item.membership-order-item',
      'oneToOne',
      'api::tax-collection.tax-collection'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::membership-order-item.membership-order-item',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::membership-order-item.membership-order-item',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiMetaConnectionMetaConnection extends Schema.CollectionType {
  collectionName: 'meta_connections';
  info: {
    singularName: 'meta-connection';
    pluralName: 'meta-connections';
    displayName: 'Meta Connection';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    tenant: Attribute.Relation<
      'api::meta-connection.meta-connection',
      'oneToOne',
      'api::tenant.tenant'
    >;
    facebookUserToken: Attribute.String;
    pages: Attribute.Component<'data.page', true>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::meta-connection.meta-connection',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::meta-connection.meta-connection',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiMetalFinishTypeMetalFinishType
  extends Schema.CollectionType {
  collectionName: 'metal_finish_types';
  info: {
    singularName: 'metal-finish-type';
    pluralName: 'metal-finish-types';
    displayName: 'INVENTORY: Metal Finish Type';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    tenant: Attribute.Relation<
      'api::metal-finish-type.metal-finish-type',
      'oneToOne',
      'api::tenant.tenant'
    >;
    editable: Attribute.Boolean & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::metal-finish-type.metal-finish-type',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::metal-finish-type.metal-finish-type',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiMetalTypeMetalType extends Schema.CollectionType {
  collectionName: 'metal_types';
  info: {
    singularName: 'metal-type';
    pluralName: 'metal-types';
    displayName: 'INVENTORY: Metal Type';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    tenant: Attribute.Relation<
      'api::metal-type.metal-type',
      'oneToOne',
      'api::tenant.tenant'
    >;
    materialGrades: Attribute.Relation<
      'api::metal-type.metal-type',
      'oneToMany',
      'api::material-grade.material-grade'
    >;
    editable: Attribute.Boolean & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::metal-type.metal-type',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::metal-type.metal-type',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiNoteNote extends Schema.CollectionType {
  collectionName: 'notes';
  info: {
    singularName: 'note';
    pluralName: 'notes';
    displayName: 'Note';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    description: Attribute.Text & Attribute.Required;
    company_id: Attribute.Relation<
      'api::note.note',
      'manyToOne',
      'api::company.company'
    >;
    lead_id: Attribute.Relation<
      'api::note.note',
      'manyToOne',
      'api::lead.lead'
    >;
    contact_id: Attribute.Relation<
      'api::note.note',
      'manyToOne',
      'api::contact.contact'
    >;
    customCreationDate: Attribute.DateTime;
    isDefault: Attribute.Boolean & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::note.note', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'api::note.note', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface ApiNotificationMethodNotificationMethod
  extends Schema.CollectionType {
  collectionName: 'notification_methods';
  info: {
    singularName: 'notification-method';
    pluralName: 'notification-methods';
    displayName: 'Notification Method';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::notification-method.notification-method',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::notification-method.notification-method',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiNotificationsNylasGrantExpireNotificationsNylasGrantExpire
  extends Schema.CollectionType {
  collectionName: 'notifications_nylas_grant_expires';
  info: {
    singularName: 'notifications-nylas-grant-expire';
    pluralName: 'notifications-nylas-grant-expires';
    displayName: 'NOTIFICATIONS: NylasGrantExpire';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    notifications_user_notification: Attribute.Relation<
      'api::notifications-nylas-grant-expire.notifications-nylas-grant-expire',
      'oneToOne',
      'api::user-notification.user-notification'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::notifications-nylas-grant-expire.notifications-nylas-grant-expire',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::notifications-nylas-grant-expire.notifications-nylas-grant-expire',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiNylasConnectionNylasConnection
  extends Schema.CollectionType {
  collectionName: 'nylas_connections';
  info: {
    singularName: 'nylas-connection';
    pluralName: 'nylas-connections';
    displayName: 'Nylas Connection';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    grantId: Attribute.Text &
      Attribute.Required &
      Attribute.Private &
      Attribute.Unique;
    user: Attribute.Relation<
      'api::nylas-connection.nylas-connection',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    tenant: Attribute.Relation<
      'api::nylas-connection.nylas-connection',
      'manyToOne',
      'api::tenant.tenant'
    >;
    status: Attribute.Enumeration<['expired', 'active']> &
      Attribute.DefaultTo<'active'>;
    attachedEmail: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::nylas-connection.nylas-connection',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::nylas-connection.nylas-connection',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiOnboardingOnboarding extends Schema.CollectionType {
  collectionName: 'onboardings';
  info: {
    singularName: 'onboarding';
    pluralName: 'onboardings';
    displayName: 'PLATFORM : Onboarding';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    tenant: Attribute.Relation<
      'api::onboarding.onboarding',
      'oneToOne',
      'api::tenant.tenant'
    >;
    isCompleted: Attribute.Boolean & Attribute.DefaultTo<false>;
    isLogoUpload: Attribute.Boolean & Attribute.DefaultTo<false>;
    isMainLocation: Attribute.Boolean & Attribute.DefaultTo<false>;
    isEmailAndPhone: Attribute.Boolean & Attribute.DefaultTo<false>;
    isStoreAdded: Attribute.Boolean & Attribute.DefaultTo<false>;
    isEmployeeAdded: Attribute.Boolean & Attribute.DefaultTo<false>;
    isStripeConnected: Attribute.Boolean & Attribute.DefaultTo<false>;
    isTwilioConnected: Attribute.Boolean & Attribute.DefaultTo<false>;
    isCustomerImported: Attribute.Boolean & Attribute.DefaultTo<false>;
    isProductsImported: Attribute.Boolean & Attribute.DefaultTo<false>;
    isQuickBooksConnected: Attribute.Boolean & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::onboarding.onboarding',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::onboarding.onboarding',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiOnboardingUserOnboardingUser extends Schema.CollectionType {
  collectionName: 'onboarding_users';
  info: {
    singularName: 'onboarding-user';
    pluralName: 'onboarding-users';
    displayName: 'PLATFORM: Onboarding User';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    isCompleted: Attribute.Boolean & Attribute.DefaultTo<false>;
    user: Attribute.Relation<
      'api::onboarding-user.onboarding-user',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    isNylasConnected: Attribute.Boolean & Attribute.DefaultTo<false>;
    isPasswordChanged: Attribute.Boolean & Attribute.DefaultTo<false>;
    tenant: Attribute.Relation<
      'api::onboarding-user.onboarding-user',
      'oneToOne',
      'api::tenant.tenant'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::onboarding-user.onboarding-user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::onboarding-user.onboarding-user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiOrderOrder extends Schema.CollectionType {
  collectionName: 'orders';
  info: {
    singularName: 'order';
    pluralName: 'orders';
    displayName: 'SELLING: Order';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    contact: Attribute.Relation<
      'api::order.order',
      'manyToOne',
      'api::contact.contact'
    >;
    sales: Attribute.Relation<
      'api::order.order',
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    status: Attribute.Enumeration<
      [
        'draft',
        'incoming',
        'preparing',
        'ready',
        'shipped',
        'started',
        'paying',
        'paid',
        'returned',
        'credited',
        'placed',
        'pending',
        'received',
      ]
    >;
    completed: Attribute.Boolean;
    paymentMethod: Attribute.Enumeration<
      ['card', 'cash', 'paypal', 'payedByPoints']
    >;
    deliveryMethod: Attribute.Enumeration<
      ['USPS', 'UPS', 'FedEx', 'DHL Express', 'OnTrac', 'US Foods', 'Courier']
    >;
    orderId: Attribute.String & Attribute.Required & Attribute.Unique;
    services: Attribute.Relation<
      'api::order.order',
      'oneToMany',
      'api::service-order-item.service-order-item'
    >;
    classes: Attribute.Relation<
      'api::order.order',
      'oneToMany',
      'api::class-order-item.class-order-item'
    >;
    memberships: Attribute.Relation<
      'api::order.order',
      'oneToMany',
      'api::membership-order-item.membership-order-item'
    >;
    compositeProducts: Attribute.Relation<
      'api::order.order',
      'oneToMany',
      'api::composite-product-order-item.composite-product-order-item'
    >;
    total: Attribute.Decimal & Attribute.DefaultTo<0>;
    subTotal: Attribute.Decimal & Attribute.DefaultTo<0>;
    discount: Attribute.Decimal;
    tenant: Attribute.Relation<
      'api::order.order',
      'manyToOne',
      'api::tenant.tenant'
    >;
    company: Attribute.Relation<
      'api::order.order',
      'oneToOne',
      'api::company.company'
    >;
    products: Attribute.Relation<
      'api::order.order',
      'oneToMany',
      'api::product-order-item.product-order-item'
    >;
    dueDate: Attribute.DateTime;
    dealTransactions: Attribute.Relation<
      'api::order.order',
      'oneToMany',
      'api::deal-transaction.deal-transaction'
    >;
    businessLocation: Attribute.Relation<
      'api::order.order',
      'manyToOne',
      'api::business-location.business-location'
    >;
    discounts: Attribute.Relation<
      'api::order.order',
      'manyToMany',
      'api::discount.discount'
    >;
    tax: Attribute.Decimal & Attribute.Required;
    files: Attribute.Media;
    tip: Attribute.Decimal & Attribute.DefaultTo<0>;
    recurringAmount: Attribute.Decimal;
    recurringPeriod: Attribute.Enumeration<
      ['once', 'daily', 'weekly', 'monthly', 'yearly']
    >;
    invoice: Attribute.Relation<
      'api::order.order',
      'oneToOne',
      'api::invoice.invoice'
    >;
    points: Attribute.Float;
    pointsGiven: Attribute.Float;
    transaction: Attribute.Relation<
      'api::order.order',
      'oneToMany',
      'api::transaction.transaction'
    >;
    recurringPeriodCount: Attribute.Integer;
    customerShippingInfo: Attribute.JSON;
    isCustomerWebsite: Attribute.Boolean & Attribute.DefaultTo<false>;
    shipment: Attribute.Decimal;
    type: Attribute.Enumeration<
      ['sell', 'layaway', 'rent', 'tradeIn', 'purchase', 'estimate']
    > &
      Attribute.DefaultTo<'sell'>;
    rentDueDate: Attribute.Date;
    purchaseRequest: Attribute.Relation<
      'api::order.order',
      'oneToOne',
      'api::purchase-request.purchase-request'
    >;
    isWarranty: Attribute.Boolean & Attribute.DefaultTo<false>;
    memo: Attribute.Integer;
    customCreationDate: Attribute.DateTime;
    ecommerceType: Attribute.Enumeration<
      ['shopify', 'woocommerce', 'magento', 'api']
    >;
    orderVersion: Attribute.Enumeration<['historical', 'current']> &
      Attribute.DefaultTo<'current'>;
    tasks: Attribute.Relation<
      'api::order.order',
      'oneToMany',
      'api::task.task'
    >;
    expiryDate: Attribute.DateTime;
    salesItemReports: Attribute.Relation<
      'api::order.order',
      'oneToMany',
      'api::sales-item-report.sales-item-report'
    >;
    inputInvoiceNum: Attribute.String;
    note: Attribute.Text;
    isShowInvoiceNote: Attribute.Boolean & Attribute.DefaultTo<false>;
    estimate: Attribute.Relation<
      'api::order.order',
      'oneToOne',
      'api::estimate.estimate'
    >;
    lastPayment: Attribute.DateTime;
    ecommerceOrderId: Attribute.String;
    accServiceOrders: Attribute.Relation<
      'api::order.order',
      'oneToMany',
      'api::acc-service-order.acc-service-order'
    >;
    accServiceBills: Attribute.Relation<
      'api::order.order',
      'oneToMany',
      'api::acc-service-bill.acc-service-bill'
    >;
    billCreation: Attribute.Boolean & Attribute.DefaultTo<true>;
    billDeletetion: Attribute.Boolean & Attribute.DefaultTo<false>;
    returns: Attribute.Relation<
      'api::order.order',
      'oneToMany',
      'api::return.return'
    >;
    shippedDate: Attribute.DateTime;
    receiveDate: Attribute.DateTime;
    paid: Attribute.Boolean;
    memoNumber: Attribute.Text;
    repairTicketNumber: Attribute.BigInteger;
    repairTicketNumberIncrement: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::order.order',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::order.order',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiOrderSettingOrderSetting extends Schema.CollectionType {
  collectionName: 'orders_setting';
  info: {
    singularName: 'order-setting';
    pluralName: 'orders-setting';
    displayName: 'SETTINGS: Order';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    orderNote: Attribute.Boolean & Attribute.DefaultTo<true>;
    tenant: Attribute.Relation<
      'api::order-setting.order-setting',
      'oneToOne',
      'api::tenant.tenant'
    >;
    reviewLink: Attribute.String;
    sellingPayingAmountPercentage: Attribute.Float &
      Attribute.SetMinMax<{
        min: 0;
        max: 100;
      }> &
      Attribute.DefaultTo<100>;
    purchasePayingAmountPercentage: Attribute.Float &
      Attribute.SetMinMax<{
        min: 0;
        max: 100;
      }> &
      Attribute.DefaultTo<100>;
    dueDateDays: Attribute.Integer;
    isQuickPayEnabled: Attribute.Boolean & Attribute.DefaultTo<false>;
    isVisibleProductItems: Attribute.Boolean & Attribute.DefaultTo<true>;
    isVisibleCompositeProductItems: Attribute.Boolean &
      Attribute.DefaultTo<true>;
    isVisibleServiceItems: Attribute.Boolean & Attribute.DefaultTo<true>;
    isVisibleMembershipItems: Attribute.Boolean & Attribute.DefaultTo<false>;
    isVisibleClassItems: Attribute.Boolean & Attribute.DefaultTo<false>;
    isVisibleDiscountItems: Attribute.Boolean & Attribute.DefaultTo<true>;
    isVisibleSearchBarInPos: Attribute.Boolean & Attribute.DefaultTo<true>;
    isVisibleSellOrders: Attribute.Boolean & Attribute.DefaultTo<true>;
    isVisibleLayawayOrders: Attribute.Boolean & Attribute.DefaultTo<true>;
    isVisibleRentOrders: Attribute.Boolean & Attribute.DefaultTo<false>;
    isVisibleTradeInOrders: Attribute.Boolean & Attribute.DefaultTo<true>;
    isVisiblePurchaseOrders: Attribute.Boolean & Attribute.DefaultTo<true>;
    isVisibleEstimateOrders: Attribute.Boolean & Attribute.DefaultTo<false>;
    isVisiblePayWithPointsPaymentButton: Attribute.Boolean &
      Attribute.DefaultTo<false>;
    isShippedDatePeriodEnabled: Attribute.Boolean & Attribute.DefaultTo<false>;
    isReceiveDatePeriodEnabled: Attribute.Boolean & Attribute.DefaultTo<false>;
    sellingOrderManagementPayingAmountPercentage: Attribute.Float &
      Attribute.SetMinMax<{
        min: 0;
        max: 100;
      }> &
      Attribute.DefaultTo<100>;
    purchaseOrderManagementPayingAmountPercentage: Attribute.Float &
      Attribute.SetMinMax<{
        min: 0;
        max: 100;
      }> &
      Attribute.DefaultTo<100>;
    isAutomaticallyMoveOrderToReadyStage: Attribute.Boolean &
      Attribute.DefaultTo<true>;
    isAutoSendNotification: Attribute.Boolean & Attribute.DefaultTo<true>;
    isAutoSendReview: Attribute.Boolean & Attribute.DefaultTo<true>;
    isAutoMovedToShipped: Attribute.Boolean & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::order-setting.order-setting',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::order-setting.order-setting',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiOrderStatusNotificationOrderStatusNotification
  extends Schema.CollectionType {
  collectionName: 'order_status_notifications';
  info: {
    singularName: 'order-status-notification';
    pluralName: 'order-status-notifications';
    displayName: 'NOTIFICATIONS: OrderStatusNotification';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    userNotifications: Attribute.Relation<
      'api::order-status-notification.order-status-notification',
      'oneToMany',
      'api::user-notification.user-notification'
    >;
    order: Attribute.Relation<
      'api::order-status-notification.order-status-notification',
      'oneToOne',
      'api::order.order'
    >;
    type: Attribute.Enumeration<
      ['draft', 'incoming', 'preparing', 'ready', 'shipped']
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::order-status-notification.order-status-notification',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::order-status-notification.order-status-notification',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiPayRatePayRate extends Schema.CollectionType {
  collectionName: 'pay_rates';
  info: {
    singularName: 'pay-rate';
    pluralName: 'pay-rates';
    displayName: 'Pay Rate';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    rate: Attribute.Decimal;
    period: Attribute.Enumeration<['hour', 'month']>;
    user: Attribute.Relation<
      'api::pay-rate.pay-rate',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::pay-rate.pay-rate',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::pay-rate.pay-rate',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiPaymentMethodPaymentMethod extends Schema.CollectionType {
  collectionName: 'payment_methods';
  info: {
    singularName: 'payment-method';
    pluralName: 'payment-methods';
    displayName: 'Payment Method';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    tenant: Attribute.Relation<
      'api::payment-method.payment-method',
      'manyToOne',
      'api::tenant.tenant'
    >;
    accProductMappings: Attribute.Relation<
      'api::payment-method.payment-method',
      'oneToMany',
      'api::acc-product-mapping.acc-product-mapping'
    >;
    paymentType: Attribute.Enumeration<['billPayment', 'sell']> &
      Attribute.Required &
      Attribute.DefaultTo<'sell'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::payment-method.payment-method',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::payment-method.payment-method',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiPdfCatalogFilePdfCatalogFile extends Schema.CollectionType {
  collectionName: 'pdf_catalog_files';
  info: {
    singularName: 'pdf-catalog-file';
    pluralName: 'pdf-catalog-files';
    displayName: 'PDF Catalog File';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    file: Attribute.Media;
    tenant: Attribute.Relation<
      'api::pdf-catalog-file.pdf-catalog-file',
      'oneToOne',
      'api::tenant.tenant'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::pdf-catalog-file.pdf-catalog-file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::pdf-catalog-file.pdf-catalog-file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiPdfTemplatePdfTemplate extends Schema.CollectionType {
  collectionName: 'pdf_templates';
  info: {
    singularName: 'pdf-template';
    pluralName: 'pdf-templates';
    displayName: 'Pdf Template';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.Text;
    templateId: Attribute.Integer;
    type: Attribute.Enumeration<
      [
        'catalogue',
        'appraisal',
        'wishlist',
        'invoice',
        'estimate',
        'purchase',
        'internalJobTicket',
        'externalJobTicket',
      ]
    >;
    isDefault: Attribute.Boolean & Attribute.DefaultTo<false>;
    tenant: Attribute.Relation<
      'api::pdf-template.pdf-template',
      'manyToOne',
      'api::tenant.tenant'
    >;
    isAllowItemWithoutImage: Attribute.Boolean & Attribute.DefaultTo<true>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::pdf-template.pdf-template',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::pdf-template.pdf-template',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiPiecePiece extends Schema.CollectionType {
  collectionName: 'pieces';
  info: {
    singularName: 'piece';
    pluralName: 'pieces';
    displayName: 'INVENTORY: Piece';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    tenant: Attribute.Relation<
      'api::piece.piece',
      'oneToOne',
      'api::tenant.tenant'
    >;
    jewelryProductType: Attribute.Relation<
      'api::piece.piece',
      'manyToOne',
      'api::jewelry-product-type.jewelry-product-type'
    >;
    editable: Attribute.Boolean & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::piece.piece',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::piece.piece',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiPlatformPlatform extends Schema.SingleType {
  collectionName: 'platforms';
  info: {
    singularName: 'platform';
    pluralName: 'platforms';
    displayName: 'Platform';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    logo: Attribute.Media;
    minifiedLogo: Attribute.Media;
    logoPng: Attribute.Media;
    address: Attribute.Text;
    email: Attribute.Email;
    phoneNumber: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::platform.platform',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::platform.platform',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiPlattingTypePlattingType extends Schema.CollectionType {
  collectionName: 'platting_types';
  info: {
    singularName: 'platting-type';
    pluralName: 'platting-types';
    displayName: 'INVENTORY: Platting Type';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    tenant: Attribute.Relation<
      'api::platting-type.platting-type',
      'oneToOne',
      'api::tenant.tenant'
    >;
    editable: Attribute.Boolean & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::platting-type.platting-type',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::platting-type.platting-type',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiProductProduct extends Schema.CollectionType {
  collectionName: 'products';
  info: {
    singularName: 'product';
    pluralName: 'products';
    displayName: 'Product';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    SKU: Attribute.String;
    serialNumber: Attribute.String;
    UPC: Attribute.String;
    MPN: Attribute.String;
    EAN: Attribute.String;
    ISBN: Attribute.String;
    partsWarranty: Attribute.DateTime;
    laborWarranty: Attribute.DateTime;
    expiryDate: Attribute.DateTime;
    returnable: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<false>;
    files: Attribute.Media;
    tenant: Attribute.Relation<
      'api::product.product',
      'manyToOne',
      'api::tenant.tenant'
    >;
    productInventoryItems: Attribute.Relation<
      'api::product.product',
      'oneToMany',
      'api::product-inventory-item.product-inventory-item'
    >;
    brand: Attribute.Relation<
      'api::product.product',
      'oneToOne',
      'api::product-brand.product-brand'
    >;
    barcode: Attribute.Text;
    uuid: Attribute.UID & Attribute.CustomField<'plugin::field-uuid.uuid'>;
    model: Attribute.Text;
    dimension: Attribute.Relation<
      'api::product.product',
      'oneToOne',
      'api::dimension.dimension'
    >;
    weight: Attribute.Relation<
      'api::product.product',
      'oneToOne',
      'api::weight.weight'
    >;
    businessUseOnly: Attribute.Boolean & Attribute.DefaultTo<false>;
    bundleUseOnly: Attribute.Boolean & Attribute.DefaultTo<false>;
    productType: Attribute.Relation<
      'api::product.product',
      'oneToOne',
      'api::product-type.product-type'
    >;
    packagingProduct: Attribute.Boolean & Attribute.DefaultTo<false>;
    rentableData: Attribute.Relation<
      'api::product.product',
      'oneToOne',
      'api::rentable-data.rentable-data'
    >;
    compositeProducts: Attribute.Relation<
      'api::product.product',
      'manyToMany',
      'api::composite-product.composite-product'
    >;
    favorite: Attribute.Boolean;
    defaultPrice: Attribute.Decimal &
      Attribute.Required &
      Attribute.SetMinMax<{
        min: 0;
      }>;
    productOrderItems: Attribute.Relation<
      'api::product.product',
      'oneToMany',
      'api::product-order-item.product-order-item'
    >;
    productAttributeOptions: Attribute.Relation<
      'api::product.product',
      'manyToMany',
      'api::product-attribute-option.product-attribute-option'
    >;
    active: Attribute.Boolean & Attribute.DefaultTo<true>;
    productId: Attribute.String & Attribute.Unique;
    isNegativeCount: Attribute.Boolean & Attribute.DefaultTo<false>;
    ecommerceProductServices: Attribute.Relation<
      'api::product.product',
      'oneToMany',
      'api::ecommerce-product-service.ecommerce-product-service'
    >;
    isCreatedByOpenApi: Attribute.Boolean & Attribute.DefaultTo<false>;
    deal: Attribute.Relation<
      'api::product.product',
      'manyToOne',
      'api::deal.deal'
    >;
    ecommerceName: Attribute.String;
    note: Attribute.Text;
    appraisalDescription: Attribute.Text;
    shopifyTags: Attribute.String;
    shopifyCollections: Attribute.String;
    ecommerceDescription: Attribute.Text;
    multiplier: Attribute.Decimal;
    wholeSaleMultiplier: Attribute.Decimal;
    tagProductName: Attribute.String;
    woocommerceCategory: Attribute.String;
    revenue: Attribute.String;
    cost: Attribute.String;
    accServiceEntities: Attribute.Relation<
      'api::product.product',
      'oneToMany',
      'api::acc-service-entity.acc-service-entity'
    >;
    revenueChartAccount: Attribute.Relation<
      'api::product.product',
      'manyToOne',
      'api::chart-account.chart-account'
    >;
    revenueChartCategory: Attribute.Relation<
      'api::product.product',
      'manyToOne',
      'api::chart-category.chart-category'
    >;
    revenueChartSubcategory: Attribute.Relation<
      'api::product.product',
      'manyToOne',
      'api::chart-subcategory.chart-subcategory'
    >;
    costChartAccount: Attribute.Relation<
      'api::product.product',
      'manyToOne',
      'api::chart-account.chart-account'
    >;
    costChartCategory: Attribute.Relation<
      'api::product.product',
      'manyToOne',
      'api::chart-category.chart-category'
    >;
    costChartSubcategory: Attribute.Relation<
      'api::product.product',
      'manyToOne',
      'api::chart-subcategory.chart-subcategory'
    >;
    ecommerceDetails: Attribute.Relation<
      'api::product.product',
      'oneToMany',
      'api::ecommerce-detail.ecommerce-detail'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::product.product',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::product.product',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiProductAttributeProductAttribute
  extends Schema.CollectionType {
  collectionName: 'product_attributes';
  info: {
    singularName: 'product-attribute';
    pluralName: 'product-attributes';
    displayName: 'Product Attribute';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    productAttributeOptions: Attribute.Relation<
      'api::product-attribute.product-attribute',
      'oneToMany',
      'api::product-attribute-option.product-attribute-option'
    >;
    productTypes: Attribute.Relation<
      'api::product-attribute.product-attribute',
      'manyToMany',
      'api::product-type.product-type'
    >;
    jewelryProductTypes: Attribute.Relation<
      'api::product-attribute.product-attribute',
      'manyToMany',
      'api::jewelry-product-type.jewelry-product-type'
    >;
    tenant: Attribute.Relation<
      'api::product-attribute.product-attribute',
      'oneToOne',
      'api::tenant.tenant'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::product-attribute.product-attribute',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::product-attribute.product-attribute',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiProductAttributeOptionProductAttributeOption
  extends Schema.CollectionType {
  collectionName: 'product_attribute_options';
  info: {
    singularName: 'product-attribute-option';
    pluralName: 'product-attribute-options';
    displayName: 'Product Attribute Option';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    productAttribute: Attribute.Relation<
      'api::product-attribute-option.product-attribute-option',
      'manyToOne',
      'api::product-attribute.product-attribute'
    >;
    name: Attribute.String & Attribute.Required;
    products: Attribute.Relation<
      'api::product-attribute-option.product-attribute-option',
      'manyToMany',
      'api::product.product'
    >;
    jewelryProducts: Attribute.Relation<
      'api::product-attribute-option.product-attribute-option',
      'manyToMany',
      'api::jewelry-product.jewelry-product'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::product-attribute-option.product-attribute-option',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::product-attribute-option.product-attribute-option',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiProductBrandProductBrand extends Schema.CollectionType {
  collectionName: 'product_brands';
  info: {
    singularName: 'product-brand';
    pluralName: 'product-brands';
    displayName: 'Product Brand';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    tenant: Attribute.Relation<
      'api::product-brand.product-brand',
      'oneToOne',
      'api::tenant.tenant'
    >;
    editable: Attribute.Boolean & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::product-brand.product-brand',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::product-brand.product-brand',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiProductGroupProductGroup extends Schema.CollectionType {
  collectionName: 'product_groups';
  info: {
    singularName: 'product-group';
    pluralName: 'product-groups';
    displayName: 'Product Group';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    description: Attribute.String;
    tenant: Attribute.Relation<
      'api::product-group.product-group',
      'oneToOne',
      'api::tenant.tenant'
    >;
    productGroupItems: Attribute.Relation<
      'api::product-group.product-group',
      'oneToMany',
      'api::product-group-item.product-group-item'
    >;
    uuid: Attribute.UID & Attribute.CustomField<'plugin::field-uuid.uuid'>;
    productGroupAttributes: Attribute.Relation<
      'api::product-group.product-group',
      'manyToMany',
      'api::product-group-attribute.product-group-attribute'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::product-group.product-group',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::product-group.product-group',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiProductGroupAttributeProductGroupAttribute
  extends Schema.CollectionType {
  collectionName: 'product_group_attributes';
  info: {
    singularName: 'product-group-attribute';
    pluralName: 'product-group-attributes';
    displayName: 'Product Group Attribute';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    productGroupAttributeOptions: Attribute.Relation<
      'api::product-group-attribute.product-group-attribute',
      'oneToMany',
      'api::product-group-attribute-option.product-group-attribute-option'
    >;
    tenant: Attribute.Relation<
      'api::product-group-attribute.product-group-attribute',
      'oneToOne',
      'api::tenant.tenant'
    >;
    productGroups: Attribute.Relation<
      'api::product-group-attribute.product-group-attribute',
      'manyToMany',
      'api::product-group.product-group'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::product-group-attribute.product-group-attribute',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::product-group-attribute.product-group-attribute',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiProductGroupAttributeOptionProductGroupAttributeOption
  extends Schema.CollectionType {
  collectionName: 'product_group_attribute_options';
  info: {
    singularName: 'product-group-attribute-option';
    pluralName: 'product-group-attribute-options';
    displayName: 'Product Group Attribute Option';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    productGroupAttribute: Attribute.Relation<
      'api::product-group-attribute-option.product-group-attribute-option',
      'manyToOne',
      'api::product-group-attribute.product-group-attribute'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::product-group-attribute-option.product-group-attribute-option',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::product-group-attribute-option.product-group-attribute-option',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiProductGroupItemProductGroupItem
  extends Schema.CollectionType {
  collectionName: 'product_group_items';
  info: {
    singularName: 'product-group-item';
    pluralName: 'product-group-items';
    displayName: 'Product Group Item';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    product: Attribute.Relation<
      'api::product-group-item.product-group-item',
      'oneToOne',
      'api::product.product'
    >;
    productGroupAttributeOptions: Attribute.Relation<
      'api::product-group-item.product-group-item',
      'oneToMany',
      'api::product-group-attribute-option.product-group-attribute-option'
    >;
    productGroup: Attribute.Relation<
      'api::product-group-item.product-group-item',
      'manyToOne',
      'api::product-group.product-group'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::product-group-item.product-group-item',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::product-group-item.product-group-item',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiProductInventoryItemProductInventoryItem
  extends Schema.CollectionType {
  collectionName: 'product_inventory_items';
  info: {
    singularName: 'product-inventory-item';
    pluralName: 'product-inventory-items';
    displayName: 'Product Inventory Item';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    quantity: Attribute.Integer & Attribute.Required;
    lowQuantity: Attribute.Integer;
    maxQuantity: Attribute.Integer;
    minOrderQuantity: Attribute.Integer & Attribute.DefaultTo<1>;
    pointsRedeemed: Attribute.Float;
    storageNotes: Attribute.Text;
    product: Attribute.Relation<
      'api::product-inventory-item.product-inventory-item',
      'manyToOne',
      'api::product.product'
    >;
    pointsGiven: Attribute.Float;
    businessLocation: Attribute.Relation<
      'api::product-inventory-item.product-inventory-item',
      'oneToOne',
      'api::business-location.business-location'
    >;
    tax: Attribute.Relation<
      'api::product-inventory-item.product-inventory-item',
      'oneToOne',
      'api::tax.tax'
    >;
    vendor: Attribute.Relation<
      'api::product-inventory-item.product-inventory-item',
      'oneToOne',
      'api::company.company'
    >;
    price: Attribute.Decimal;
    favorite: Attribute.Boolean;
    uuid: Attribute.UID & Attribute.CustomField<'plugin::field-uuid.uuid'>;
    productOrderItems: Attribute.Relation<
      'api::product-inventory-item.product-inventory-item',
      'oneToMany',
      'api::product-order-item.product-order-item'
    >;
    tenant: Attribute.Relation<
      'api::product-inventory-item.product-inventory-item',
      'oneToOne',
      'api::tenant.tenant'
    >;
    product_inventory_item_events: Attribute.Relation<
      'api::product-inventory-item.product-inventory-item',
      'oneToMany',
      'api::product-inventory-item-event.product-inventory-item-event'
    >;
    jewelryProduct: Attribute.Relation<
      'api::product-inventory-item.product-inventory-item',
      'manyToOne',
      'api::jewelry-product.jewelry-product'
    >;
    active: Attribute.Boolean & Attribute.DefaultTo<true>;
    sublocation: Attribute.Relation<
      'api::product-inventory-item.product-inventory-item',
      'oneToOne',
      'api::sublocation.sublocation'
    >;
    sublocationItems: Attribute.Relation<
      'api::product-inventory-item.product-inventory-item',
      'oneToMany',
      'api::sublocation-item.sublocation-item'
    >;
    isNegativeCount: Attribute.Boolean & Attribute.DefaultTo<false>;
    isSerializedInventory: Attribute.Boolean & Attribute.DefaultTo<false>;
    serializes: Attribute.Relation<
      'api::product-inventory-item.product-inventory-item',
      'oneToMany',
      'api::inventory-serialize.inventory-serialize'
    >;
    productInventoryItemRecords: Attribute.Relation<
      'api::product-inventory-item.product-inventory-item',
      'oneToMany',
      'api::invt-itm-record.invt-itm-record'
    >;
    customCreationDate: Attribute.DateTime;
    taxCollection: Attribute.Relation<
      'api::product-inventory-item.product-inventory-item',
      'oneToOne',
      'api::tax-collection.tax-collection'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::product-inventory-item.product-inventory-item',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::product-inventory-item.product-inventory-item',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiProductInventoryItemEventProductInventoryItemEvent
  extends Schema.CollectionType {
  collectionName: 'product_inventory_item_events';
  info: {
    singularName: 'product-inventory-item-event';
    pluralName: 'product-inventory-item-events';
    displayName: 'Product Inventory Item Event';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    change: Attribute.String & Attribute.Required & Attribute.DefaultTo<'0'>;
    addedBy: Attribute.Relation<
      'api::product-inventory-item-event.product-inventory-item-event',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    eventType: Attribute.Enumeration<
      [
        'receive',
        'return',
        'transfer in',
        'transfer out',
        'canceled return',
        'sold',
        'adjustment',
        'pos order item add',
        'pos order item remove',
        'purchase return',
      ]
    > &
      Attribute.Required &
      Attribute.DefaultTo<'receive'>;
    productInventoryItem: Attribute.Relation<
      'api::product-inventory-item-event.product-inventory-item-event',
      'manyToOne',
      'api::product-inventory-item.product-inventory-item'
    >;
    tenant: Attribute.Relation<
      'api::product-inventory-item-event.product-inventory-item-event',
      'oneToOne',
      'api::tenant.tenant'
    >;
    relationUuid: Attribute.Text;
    itemCost: Attribute.Decimal &
      Attribute.SetMinMax<{
        min: 0;
      }>;
    itemVendor: Attribute.Relation<
      'api::product-inventory-item-event.product-inventory-item-event',
      'oneToOne',
      'api::company.company'
    >;
    businessLocation: Attribute.Relation<
      'api::product-inventory-item-event.product-inventory-item-event',
      'oneToOne',
      'api::business-location.business-location'
    >;
    receiveDate: Attribute.DateTime;
    memo: Attribute.Boolean & Attribute.DefaultTo<false>;
    laidAway: Attribute.Integer &
      Attribute.SetMinMax<{
        min: 0;
      }>;
    remainingQuantity: Attribute.Integer;
    relationId: Attribute.String;
    expiryDate: Attribute.DateTime;
    order: Attribute.Relation<
      'api::product-inventory-item-event.product-inventory-item-event',
      'oneToOne',
      'api::order.order'
    >;
    itemContactVendor: Attribute.Relation<
      'api::product-inventory-item-event.product-inventory-item-event',
      'oneToOne',
      'api::contact.contact'
    >;
    productInventoryItemRecords: Attribute.Relation<
      'api::product-inventory-item-event.product-inventory-item-event',
      'oneToMany',
      'api::invt-itm-record.invt-itm-record'
    >;
    isPartiallyReturned: Attribute.Boolean & Attribute.DefaultTo<false>;
    isFullyReturned: Attribute.Boolean & Attribute.DefaultTo<false>;
    returnedDate: Attribute.DateTime;
    isImported: Attribute.Boolean & Attribute.DefaultTo<false>;
    isNotified: Attribute.Boolean & Attribute.DefaultTo<false>;
    memoNumber: Attribute.Text;
    note: Attribute.Text;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::product-inventory-item-event.product-inventory-item-event',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::product-inventory-item-event.product-inventory-item-event',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiProductOrderItemProductOrderItem
  extends Schema.CollectionType {
  collectionName: 'product_order_items';
  info: {
    singularName: 'product-order-item';
    pluralName: 'product-order-items';
    displayName: 'SELLING: Product Order Item';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    quantity: Attribute.Integer & Attribute.Required & Attribute.DefaultTo<1>;
    purchaseType: Attribute.Enumeration<['buy', 'rent']>;
    note: Attribute.Text;
    product: Attribute.Relation<
      'api::product-order-item.product-order-item',
      'manyToOne',
      'api::product-inventory-item.product-inventory-item'
    >;
    order: Attribute.Relation<
      'api::product-order-item.product-order-item',
      'manyToOne',
      'api::order.order'
    >;
    itemId: Attribute.String & Attribute.Required;
    rentStart: Attribute.DateTime;
    rentEnd: Attribute.DateTime;
    price: Attribute.Decimal;
    discounts: Attribute.Relation<
      'api::product-order-item.product-order-item',
      'oneToMany',
      'api::discount.discount'
    >;
    tax: Attribute.Relation<
      'api::product-order-item.product-order-item',
      'oneToOne',
      'api::tax.tax'
    >;
    status: Attribute.Enumeration<['draft', 'published']> &
      Attribute.DefaultTo<'published'>;
    isShowInvoiceNote: Attribute.Boolean & Attribute.DefaultTo<true>;
    sublocations: Attribute.Relation<
      'api::product-order-item.product-order-item',
      'oneToMany',
      'api::sublocation.sublocation'
    >;
    isVisibleInDocs: Attribute.Boolean & Attribute.DefaultTo<true>;
    serializes: Attribute.Relation<
      'api::product-order-item.product-order-item',
      'oneToMany',
      'api::inventory-serialize.inventory-serialize'
    >;
    isCompositeProductItem: Attribute.Boolean & Attribute.DefaultTo<false>;
    compositeProductOrderItem: Attribute.Relation<
      'api::product-order-item.product-order-item',
      'manyToOne',
      'api::composite-product-order-item.composite-product-order-item'
    >;
    sublocationItems: Attribute.Relation<
      'api::product-order-item.product-order-item',
      'oneToMany',
      'api::sublocation-item.sublocation-item'
    >;
    taxCollection: Attribute.Relation<
      'api::product-order-item.product-order-item',
      'oneToOne',
      'api::tax-collection.tax-collection'
    >;
    isPartiallyReturned: Attribute.Boolean & Attribute.DefaultTo<false>;
    isFullyReturned: Attribute.Boolean & Attribute.DefaultTo<false>;
    returnedDate: Attribute.DateTime;
    returnItems: Attribute.Relation<
      'api::product-order-item.product-order-item',
      'oneToMany',
      'api::return-item.return-item'
    >;
    reportNote: Attribute.Text;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::product-order-item.product-order-item',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::product-order-item.product-order-item',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiProductSettingProductSetting extends Schema.CollectionType {
  collectionName: 'products_setting';
  info: {
    singularName: 'product-setting';
    pluralName: 'products-setting';
    displayName: 'SETTINGS: Product';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    returnableItem: Attribute.Boolean & Attribute.DefaultTo<false>;
    trackProductInventory: Attribute.Boolean & Attribute.DefaultTo<false>;
    tenant: Attribute.Relation<
      'api::product-setting.product-setting',
      'oneToOne',
      'api::tenant.tenant'
    >;
    allowNegativeQuantity: Attribute.Boolean & Attribute.DefaultTo<false>;
    visibleItem: Attribute.Boolean & Attribute.DefaultTo<true>;
    defaultPurchaseTax: Attribute.Relation<
      'api::product-setting.product-setting',
      'oneToOne',
      'api::tax.tax'
    >;
    defaultPaymentMethod: Attribute.Relation<
      'api::product-setting.product-setting',
      'oneToOne',
      'api::payment-method.payment-method'
    >;
    aiPrompt: Attribute.Component<'data.ai-prompt'>;
    bulkProductsAiPrompt: Attribute.Component<'data.bulk-products-ai-prompt'>;
    isEcommerceNameEnabled: Attribute.Boolean & Attribute.DefaultTo<false>;
    isShopifyTagsEnabled: Attribute.Boolean & Attribute.DefaultTo<false>;
    isShopifyCollectionEnabled: Attribute.Boolean & Attribute.DefaultTo<false>;
    isWoocommerceCategoryEnabled: Attribute.Boolean &
      Attribute.DefaultTo<false>;
    isRetailPriceMultiplierEnabled: Attribute.Boolean &
      Attribute.DefaultTo<false>;
    isWholesalePriceMultiplierEnabled: Attribute.Boolean &
      Attribute.DefaultTo<false>;
    isBrandEnabled: Attribute.Boolean & Attribute.DefaultTo<false>;
    isDimensionEnabled: Attribute.Boolean & Attribute.DefaultTo<false>;
    isWeightEnabled: Attribute.Boolean & Attribute.DefaultTo<false>;
    isModelEnabled: Attribute.Boolean & Attribute.DefaultTo<false>;
    isSkuEnabled: Attribute.Boolean & Attribute.DefaultTo<false>;
    isMpnEnabled: Attribute.Boolean & Attribute.DefaultTo<false>;
    isUpcEnabled: Attribute.Boolean & Attribute.DefaultTo<false>;
    isIsbnEnabled: Attribute.Boolean & Attribute.DefaultTo<false>;
    isEanEnabled: Attribute.Boolean & Attribute.DefaultTo<false>;
    isPartsWarrantyEnabled: Attribute.Boolean & Attribute.DefaultTo<false>;
    isLaborWarrantyEnabled: Attribute.Boolean & Attribute.DefaultTo<false>;
    isAppraisalDescriptionEnabled: Attribute.Boolean &
      Attribute.DefaultTo<false>;
    isEcommerceDescriptionEnabled: Attribute.Boolean &
      Attribute.DefaultTo<false>;
    isNoteEnabled: Attribute.Boolean & Attribute.DefaultTo<false>;
    isRevenueEnabled: Attribute.Boolean & Attribute.DefaultTo<false>;
    isCostEnabled: Attribute.Boolean & Attribute.DefaultTo<false>;
    isLowQuantityEnabled: Attribute.Boolean & Attribute.DefaultTo<false>;
    isMaxQuantityEnabled: Attribute.Boolean & Attribute.DefaultTo<false>;
    isMinimumOrderQuantityEnabled: Attribute.Boolean &
      Attribute.DefaultTo<false>;
    isTaxEnabled: Attribute.Boolean & Attribute.DefaultTo<false>;
    isVendorEnabled: Attribute.Boolean & Attribute.DefaultTo<false>;
    isPriceEnabled: Attribute.Boolean & Attribute.DefaultTo<false>;
    isPointsGivenEnabled: Attribute.Boolean & Attribute.DefaultTo<false>;
    isPointsRedeemEnabled: Attribute.Boolean & Attribute.DefaultTo<false>;
    isStorageNotesEnabled: Attribute.Boolean & Attribute.DefaultTo<false>;
    isReturnableItemEnabled: Attribute.Boolean & Attribute.DefaultTo<false>;
    isForBusinessOnlyEnabled: Attribute.Boolean & Attribute.DefaultTo<false>;
    isForBundleUseOnlyEnabled: Attribute.Boolean & Attribute.DefaultTo<false>;
    isPackagingProductEnabled: Attribute.Boolean & Attribute.DefaultTo<false>;
    isExpiresEnabled: Attribute.Boolean & Attribute.DefaultTo<false>;
    isRentableEnabled: Attribute.Boolean & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::product-setting.product-setting',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::product-setting.product-setting',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiProductTypeProductType extends Schema.CollectionType {
  collectionName: 'product_types';
  info: {
    singularName: 'product-type';
    pluralName: 'product-types';
    displayName: 'Product Type';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    tenant: Attribute.Relation<
      'api::product-type.product-type',
      'oneToOne',
      'api::tenant.tenant'
    >;
    name: Attribute.String & Attribute.Required;
    productAttributes: Attribute.Relation<
      'api::product-type.product-type',
      'manyToMany',
      'api::product-attribute.product-attribute'
    >;
    editable: Attribute.Boolean & Attribute.DefaultTo<false>;
    defaultPriceMultiplier: Attribute.Float &
      Attribute.SetMinMax<{
        min: 0;
        max: 1000000000;
      }> &
      Attribute.DefaultTo<1>;
    itemCategory: Attribute.Relation<
      'api::product-type.product-type',
      'oneToOne',
      'api::item-category.item-category'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::product-type.product-type',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::product-type.product-type',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiPublicContractPublicContract extends Schema.CollectionType {
  collectionName: 'public_contracts';
  info: {
    singularName: 'public-contract';
    pluralName: 'public-contracts';
    displayName: 'CONTRACTS: PublicContract';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    body: Attribute.RichText;
    companySignature: Attribute.RichText;
    clientSignature: Attribute.RichText;
    uuid: Attribute.UID & Attribute.CustomField<'plugin::field-uuid.uuid'>;
    status: Attribute.Enumeration<['pending', 'signed', 'declined']>;
    companySignDate: Attribute.DateTime;
    clientSignDate: Attribute.DateTime;
    companySignName: Attribute.String;
    clientSignName: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::public-contract.public-contract',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::public-contract.public-contract',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiPublicFormPublicForm extends Schema.CollectionType {
  collectionName: 'public_forms';
  info: {
    singularName: 'public-form';
    pluralName: 'public-forms';
    displayName: 'CONTRACTS: PublicForm';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    uuid: Attribute.UID & Attribute.CustomField<'plugin::field-uuid.uuid'>;
    body: Attribute.JSON;
    title: Attribute.String;
    file: Attribute.Media;
    description: Attribute.RichText;
    signature: Attribute.RichText;
    submitted: Attribute.Boolean;
    customerName: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::public-form.public-form',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::public-form.public-form',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiPurchaseRequestPurchaseRequest
  extends Schema.CollectionType {
  collectionName: 'purchase_requests';
  info: {
    singularName: 'purchase-request';
    pluralName: 'purchase-requests';
    displayName: 'Purchase Request';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    tenant: Attribute.Relation<
      'api::purchase-request.purchase-request',
      'oneToOne',
      'api::tenant.tenant'
    >;
    uuid: Attribute.UID & Attribute.CustomField<'plugin::field-uuid.uuid'>;
    orderId: Attribute.Relation<
      'api::purchase-request.purchase-request',
      'oneToOne',
      'api::order.order'
    >;
    requestId: Attribute.String;
    shippingInfo: Attribute.Relation<
      'api::purchase-request.purchase-request',
      'oneToOne',
      'api::purchase-request-shipping-info.purchase-request-shipping-info'
    >;
    fileItem: Attribute.Relation<
      'api::purchase-request.purchase-request',
      'oneToOne',
      'api::file-item.file-item'
    >;
    terms: Attribute.Text;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::purchase-request.purchase-request',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::purchase-request.purchase-request',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiPurchaseRequestShippingInfoPurchaseRequestShippingInfo
  extends Schema.CollectionType {
  collectionName: 'purchase_request_shipping_infos';
  info: {
    singularName: 'purchase-request-shipping-info';
    pluralName: 'purchase-request-shipping-infos';
    displayName: 'Purchase Request Shipping Info';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    address: Attribute.String;
    email: Attribute.Email;
    phoneNumber: Attribute.String;
    purchaseRequest: Attribute.Relation<
      'api::purchase-request-shipping-info.purchase-request-shipping-info',
      'oneToOne',
      'api::purchase-request.purchase-request'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::purchase-request-shipping-info.purchase-request-shipping-info',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::purchase-request-shipping-info.purchase-request-shipping-info',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiQuantityDifferenceTypeQuantityDifferenceType
  extends Schema.CollectionType {
  collectionName: 'quantity_difference_types';
  info: {
    singularName: 'quantity-difference-type';
    pluralName: 'quantity-difference-types';
    displayName: 'Quantity Difference Type';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String;
    type: Attribute.Enumeration<['Subtracted', 'Added']>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::quantity-difference-type.quantity-difference-type',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::quantity-difference-type.quantity-difference-type',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiQuestionQuestion extends Schema.CollectionType {
  collectionName: 'questions';
  info: {
    singularName: 'question';
    pluralName: 'questions';
    displayName: 'Question';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    title: Attribute.String;
    answer: Attribute.Text;
    owner: Attribute.Relation<
      'api::question.question',
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    active: Attribute.Boolean & Attribute.DefaultTo<true>;
    tenant: Attribute.Relation<
      'api::question.question',
      'oneToOne',
      'api::tenant.tenant'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::question.question',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::question.question',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiQuickPaySettingQuickPaySetting
  extends Schema.CollectionType {
  collectionName: 'quick_pays_setting';
  info: {
    singularName: 'quick-pay-setting';
    pluralName: 'quick-pays-setting';
    displayName: 'SETTING: Quick Pay';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    title: Attribute.Text;
    sellingPayingAmountPercentage: Attribute.Float &
      Attribute.SetMinMax<{
        min: 0;
        max: 100;
      }> &
      Attribute.DefaultTo<100>;
    sellingOrderManagementPayingAmountPercentage: Attribute.Float &
      Attribute.SetMinMax<{
        min: 0;
        max: 100;
      }> &
      Attribute.DefaultTo<100>;
    quickPayOption: Attribute.String;
    quickPayCardOption: Attribute.String;
    quickPayLinkOption: Attribute.String;
    isEnabled: Attribute.Boolean & Attribute.DefaultTo<true>;
    quickPayCustomMethod: Attribute.Relation<
      'api::quick-pay-setting.quick-pay-setting',
      'oneToOne',
      'api::payment-method.payment-method'
    >;
    tenant: Attribute.Relation<
      'api::quick-pay-setting.quick-pay-setting',
      'oneToOne',
      'api::tenant.tenant'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::quick-pay-setting.quick-pay-setting',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::quick-pay-setting.quick-pay-setting',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiRateRate extends Schema.CollectionType {
  collectionName: 'rates';
  info: {
    singularName: 'rate';
    pluralName: 'rates';
    displayName: 'Rate';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    evaluation: Attribute.Integer;
    isLoved: Attribute.Boolean & Attribute.DefaultTo<false>;
    isRecommended: Attribute.Boolean;
    suggestions: Attribute.Text;
    user: Attribute.Relation<
      'api::rate.rate',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::rate.rate', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'api::rate.rate', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface ApiRentableDataRentableData extends Schema.CollectionType {
  collectionName: 'rentable_datas';
  info: {
    singularName: 'rentable-data';
    pluralName: 'rentable-datas';
    displayName: 'Rentable Data';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    product: Attribute.Relation<
      'api::rentable-data.rentable-data',
      'oneToOne',
      'api::product.product'
    >;
    pricePerPeriod: Attribute.Float &
      Attribute.Required &
      Attribute.SetMinMax<{
        min: 0;
      }>;
    lostFee: Attribute.Float &
      Attribute.SetMinMax<{
        min: 0;
      }>;
    minimumRentalPeriod: Attribute.Float &
      Attribute.SetMinMax<{
        min: 0;
      }>;
    period: Attribute.Enumeration<['hour', 'day', 'week']>;
    tenant: Attribute.Relation<
      'api::rentable-data.rentable-data',
      'oneToOne',
      'api::tenant.tenant'
    >;
    enabled: Attribute.Boolean & Attribute.DefaultTo<true>;
    jewelryProduct: Attribute.Relation<
      'api::rentable-data.rentable-data',
      'oneToOne',
      'api::jewelry-product.jewelry-product'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::rentable-data.rentable-data',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::rentable-data.rentable-data',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiReportsScheduleReportsSchedule
  extends Schema.CollectionType {
  collectionName: 'reports_schedules';
  info: {
    singularName: 'reports-schedule';
    pluralName: 'reports-schedules';
    displayName: 'REPORTS: Reports Schedule';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    scheduleSalesReport: Attribute.Enumeration<['never', 'daily', 'weekly']> &
      Attribute.DefaultTo<'never'>;
    scheduleTaxesReport: Attribute.Enumeration<['never', 'daily', 'weekly']> &
      Attribute.DefaultTo<'never'>;
    scheduleInventoryReport: Attribute.Enumeration<
      ['never', 'daily', 'weekly']
    > &
      Attribute.DefaultTo<'never'>;
    scheduleMarketingReport: Attribute.Enumeration<
      ['never', 'daily', 'weekly']
    > &
      Attribute.DefaultTo<'never'>;
    scheduleCustomersReport: Attribute.Enumeration<
      ['never', 'daily', 'weekly']
    > &
      Attribute.DefaultTo<'never'>;
    user: Attribute.Relation<
      'api::reports-schedule.reports-schedule',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    scheduleSalesItemReport: Attribute.Enumeration<
      ['never', 'daily', 'weekly']
    > &
      Attribute.DefaultTo<'never'>;
    scheduleDailySummaryReport: Attribute.Enumeration<
      ['never', 'daily', 'weekly']
    > &
      Attribute.DefaultTo<'never'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::reports-schedule.reports-schedule',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::reports-schedule.reports-schedule',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiResourceResource extends Schema.CollectionType {
  collectionName: 'resources';
  info: {
    singularName: 'resource';
    pluralName: 'resources';
    displayName: 'Resource';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    tenant: Attribute.Relation<
      'api::resource.resource',
      'oneToOne',
      'api::tenant.tenant'
    >;
    creator: Attribute.Relation<
      'api::resource.resource',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    resourceInventoryItems: Attribute.Relation<
      'api::resource.resource',
      'oneToMany',
      'api::resource-inventory-item.resource-inventory-item'
    >;
    maintenanceNeeded: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<false>;
    uuid: Attribute.UID & Attribute.CustomField<'plugin::field-uuid.uuid'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::resource.resource',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::resource.resource',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiResourceCountResourceCount extends Schema.CollectionType {
  collectionName: 'resource_counts';
  info: {
    singularName: 'resource-count';
    pluralName: 'resource-counts';
    displayName: 'ResourceCount';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    count: Attribute.Integer;
    resourceInventoryItem: Attribute.Relation<
      'api::resource-count.resource-count',
      'oneToOne',
      'api::resource-inventory-item.resource-inventory-item'
    >;
    serviceLocationInfo: Attribute.Relation<
      'api::resource-count.resource-count',
      'manyToOne',
      'api::service-location-info.service-location-info'
    >;
    classLocationInfo: Attribute.Relation<
      'api::resource-count.resource-count',
      'manyToOne',
      'api::class-location-info.class-location-info'
    >;
    class: Attribute.Relation<
      'api::resource-count.resource-count',
      'manyToOne',
      'api::class.class'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::resource-count.resource-count',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::resource-count.resource-count',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiResourceInventoryItemResourceInventoryItem
  extends Schema.CollectionType {
  collectionName: 'resource_inventory_items';
  info: {
    singularName: 'resource-inventory-item';
    pluralName: 'resource-inventory-items';
    displayName: 'Resource Inventory Item';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    store: Attribute.Relation<
      'api::resource-inventory-item.resource-inventory-item',
      'oneToOne',
      'api::business-location.business-location'
    >;
    quantity: Attribute.Integer & Attribute.Required & Attribute.DefaultTo<1>;
    resource: Attribute.Relation<
      'api::resource-inventory-item.resource-inventory-item',
      'manyToOne',
      'api::resource.resource'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::resource-inventory-item.resource-inventory-item',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::resource-inventory-item.resource-inventory-item',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiReturnReturn extends Schema.CollectionType {
  collectionName: 'returns';
  info: {
    singularName: 'return';
    pluralName: 'returns';
    displayName: 'Return';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    order: Attribute.Relation<
      'api::return.return',
      'manyToOne',
      'api::order.order'
    >;
    reason: Attribute.Text;
    returnDate: Attribute.DateTime;
    notes: Attribute.Text;
    returnMethod: Attribute.Relation<
      'api::return.return',
      'oneToOne',
      'api::return-method.return-method'
    >;
    tenant: Attribute.Relation<
      'api::return.return',
      'oneToOne',
      'api::tenant.tenant'
    >;
    type: Attribute.Enumeration<['full', 'partial']> &
      Attribute.Required &
      Attribute.DefaultTo<'full'>;
    uuid: Attribute.UID & Attribute.CustomField<'plugin::field-uuid.uuid'>;
    returnItems: Attribute.Relation<
      'api::return.return',
      'oneToMany',
      'api::return-item.return-item'
    >;
    businessLocation: Attribute.Relation<
      'api::return.return',
      'oneToOne',
      'api::business-location.business-location'
    >;
    sublocation: Attribute.Relation<
      'api::return.return',
      'oneToOne',
      'api::sublocation.sublocation'
    >;
    employee: Attribute.Relation<
      'api::return.return',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    status: Attribute.Relation<
      'api::return.return',
      'oneToOne',
      'api::return-status.return-status'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::return.return',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::return.return',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiReturnItemReturnItem extends Schema.CollectionType {
  collectionName: 'return_items';
  info: {
    singularName: 'return-item';
    pluralName: 'return-items';
    displayName: 'Return Item';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    productOrderItem: Attribute.Relation<
      'api::return-item.return-item',
      'manyToOne',
      'api::product-order-item.product-order-item'
    >;
    quantityReturned: Attribute.Integer;
    return: Attribute.Relation<
      'api::return-item.return-item',
      'manyToOne',
      'api::return.return'
    >;
    serializes: Attribute.Relation<
      'api::return-item.return-item',
      'oneToMany',
      'api::inventory-serialize.inventory-serialize'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::return-item.return-item',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::return-item.return-item',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiReturnMethodReturnMethod extends Schema.CollectionType {
  collectionName: 'return_methods';
  info: {
    singularName: 'return-method';
    pluralName: 'return-methods';
    displayName: 'Return Method';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    tenant: Attribute.Relation<
      'api::return-method.return-method',
      'oneToOne',
      'api::tenant.tenant'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::return-method.return-method',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::return-method.return-method',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiReturnStatusReturnStatus extends Schema.CollectionType {
  collectionName: 'return_statuses';
  info: {
    singularName: 'return-status';
    pluralName: 'return-statuses';
    displayName: 'Return Status';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    tenant: Attribute.Relation<
      'api::return-status.return-status',
      'oneToOne',
      'api::tenant.tenant'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::return-status.return-status',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::return-status.return-status',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiReviewReview extends Schema.CollectionType {
  collectionName: 'reviews';
  info: {
    singularName: 'review';
    pluralName: 'reviews';
    displayName: 'Review';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    rating: Attribute.String;
    body: Attribute.String;
    tenant: Attribute.Relation<
      'api::review.review',
      'oneToOne',
      'api::tenant.tenant'
    >;
    order: Attribute.Relation<
      'api::review.review',
      'oneToOne',
      'api::order.order'
    >;
    customer: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::review.review',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::review.review',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiSalesCommissionSalesCommission
  extends Schema.CollectionType {
  collectionName: 'sales_commissions';
  info: {
    singularName: 'sales-commission';
    pluralName: 'sales-commissions';
    displayName: 'Sales Commission';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    user: Attribute.Relation<
      'api::sales-commission.sales-commission',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    productCommissionType: Attribute.Enumeration<
      ['percentage', 'gross margin']
    > &
      Attribute.DefaultTo<'percentage'>;
    productPercentageCommission: Attribute.Decimal;
    compositeProductPercentageCommission: Attribute.Decimal;
    servicePercentageCommission: Attribute.Decimal;
    excludedProductTypes: Attribute.Relation<
      'api::sales-commission.sales-commission',
      'oneToMany',
      'api::product-type.product-type'
    >;
    gmCommissions: Attribute.Relation<
      'api::sales-commission.sales-commission',
      'manyToMany',
      'api::gm-commission.gm-commission'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::sales-commission.sales-commission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::sales-commission.sales-commission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiSalesItemReportSalesItemReport
  extends Schema.CollectionType {
  collectionName: 'sales_item_reports';
  info: {
    singularName: 'sales-item-report';
    pluralName: 'sales-item-reports';
    displayName: 'REPORTS: Sales Item Report';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    order: Attribute.Relation<
      'api::sales-item-report.sales-item-report',
      'manyToOne',
      'api::order.order'
    >;
    productOrderItem: Attribute.Relation<
      'api::sales-item-report.sales-item-report',
      'oneToOne',
      'api::product-order-item.product-order-item'
    >;
    compositeProductOrderItem: Attribute.Relation<
      'api::sales-item-report.sales-item-report',
      'oneToOne',
      'api::composite-product-order-item.composite-product-order-item'
    >;
    serviceOrderItem: Attribute.Relation<
      'api::sales-item-report.sales-item-report',
      'oneToOne',
      'api::service-order-item.service-order-item'
    >;
    membershipOrderItem: Attribute.Relation<
      'api::sales-item-report.sales-item-report',
      'oneToOne',
      'api::membership-order-item.membership-order-item'
    >;
    classOrderItem: Attribute.Relation<
      'api::sales-item-report.sales-item-report',
      'oneToOne',
      'api::class-order-item.class-order-item'
    >;
    contact: Attribute.Relation<
      'api::sales-item-report.sales-item-report',
      'oneToOne',
      'api::contact.contact'
    >;
    company: Attribute.Relation<
      'api::sales-item-report.sales-item-report',
      'oneToOne',
      'api::company.company'
    >;
    soldDate: Attribute.DateTime;
    dueDate: Attribute.DateTime;
    price: Attribute.Decimal;
    grossMargin: Attribute.Decimal;
    sales: Attribute.Relation<
      'api::sales-item-report.sales-item-report',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    type: Attribute.Enumeration<
      ['product', 'composite_product', 'service', 'membership', 'class']
    >;
    tenant: Attribute.Relation<
      'api::sales-item-report.sales-item-report',
      'oneToOne',
      'api::tenant.tenant'
    >;
    age: Attribute.Integer;
    businessLocation: Attribute.Relation<
      'api::sales-item-report.sales-item-report',
      'oneToOne',
      'api::business-location.business-location'
    >;
    sublocation: Attribute.Relation<
      'api::sales-item-report.sales-item-report',
      'oneToOne',
      'api::sublocation.sublocation'
    >;
    serialize: Attribute.Relation<
      'api::sales-item-report.sales-item-report',
      'oneToOne',
      'api::inventory-serialize.inventory-serialize'
    >;
    itemCost: Attribute.Decimal &
      Attribute.SetMinMax<{
        min: 0;
      }>;
    companyVendor: Attribute.Relation<
      'api::sales-item-report.sales-item-report',
      'oneToOne',
      'api::company.company'
    >;
    contactVendor: Attribute.Relation<
      'api::sales-item-report.sales-item-report',
      'oneToOne',
      'api::contact.contact'
    >;
    memoTaken: Attribute.Boolean & Attribute.DefaultTo<false>;
    memoSold: Attribute.Boolean & Attribute.DefaultTo<false>;
    productInventoryItemEvent: Attribute.Relation<
      'api::sales-item-report.sales-item-report',
      'oneToOne',
      'api::product-inventory-item-event.product-inventory-item-event'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::sales-item-report.sales-item-report',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::sales-item-report.sales-item-report',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiSchedulingAppointmentSchedulingAppointment
  extends Schema.CollectionType {
  collectionName: 'scheduling_appointments';
  info: {
    singularName: 'scheduling-appointment';
    pluralName: 'scheduling-appointments';
    displayName: 'SCHEDULING: Appointment';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    tenant: Attribute.Relation<
      'api::scheduling-appointment.scheduling-appointment',
      'oneToOne',
      'api::tenant.tenant'
    >;
    company: Attribute.Relation<
      'api::scheduling-appointment.scheduling-appointment',
      'oneToOne',
      'api::company.company'
    >;
    contact: Attribute.Relation<
      'api::scheduling-appointment.scheduling-appointment',
      'oneToOne',
      'api::contact.contact'
    >;
    lead: Attribute.Relation<
      'api::scheduling-appointment.scheduling-appointment',
      'oneToOne',
      'api::lead.lead'
    >;
    service: Attribute.Relation<
      'api::scheduling-appointment.scheduling-appointment',
      'oneToOne',
      'api::service.service'
    >;
    users: Attribute.Relation<
      'api::scheduling-appointment.scheduling-appointment',
      'manyToMany',
      'plugin::users-permissions.user'
    >;
    appointmentId: Attribute.String;
    appointmentDate: Attribute.Date;
    startTime: Attribute.DateTime;
    endTime: Attribute.DateTime;
    isRecurrence: Attribute.Boolean;
    duration: Attribute.Integer;
    recurrenceRule: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::scheduling-appointment.scheduling-appointment',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::scheduling-appointment.scheduling-appointment',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiSchedulingRecurrenceSchedulingRecurrence
  extends Schema.CollectionType {
  collectionName: 'scheduling_recurrences';
  info: {
    singularName: 'scheduling-recurrence';
    pluralName: 'scheduling-recurrences';
    displayName: 'SCHEDULING: Recurrence ';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    recurrenceDate: Attribute.DateTime;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::scheduling-recurrence.scheduling-recurrence',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::scheduling-recurrence.scheduling-recurrence',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiSequenceStepSequenceStep extends Schema.CollectionType {
  collectionName: 'sequence_steps';
  info: {
    singularName: 'sequence-step';
    pluralName: 'sequence-steps';
    displayName: 'MARKETING: Sequence Step';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String;
    type: Attribute.Enumeration<['mail', 'sms', 'mms', 'delay', 'call']>;
    sequentialNumber: Attribute.Integer;
    campaign: Attribute.Relation<
      'api::sequence-step.sequence-step',
      'manyToOne',
      'api::campaign.campaign'
    >;
    info: Attribute.Relation<
      'api::sequence-step.sequence-step',
      'oneToMany',
      'api::sequence-step-info.sequence-step-info'
    >;
    content: Attribute.RichText;
    delay: Attribute.String;
    tenant: Attribute.Relation<
      'api::sequence-step.sequence-step',
      'oneToOne',
      'api::tenant.tenant'
    >;
    emailTemplate: Attribute.Relation<
      'api::sequence-step.sequence-step',
      'oneToOne',
      'api::marketing-email-template.marketing-email-template'
    >;
    file: Attribute.Media;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::sequence-step.sequence-step',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::sequence-step.sequence-step',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiSequenceStepInfoSequenceStepInfo
  extends Schema.CollectionType {
  collectionName: 'sequence_step_infos';
  info: {
    singularName: 'sequence-step-info';
    pluralName: 'sequence-step-infos';
    displayName: 'MARKETING: Sequence Step Info';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    title: Attribute.String;
    description: Attribute.String;
    sequenceStep: Attribute.Relation<
      'api::sequence-step-info.sequence-step-info',
      'manyToOne',
      'api::sequence-step.sequence-step'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::sequence-step-info.sequence-step-info',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::sequence-step-info.sequence-step-info',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiServiceService extends Schema.CollectionType {
  collectionName: 'services';
  info: {
    singularName: 'service';
    pluralName: 'services';
    displayName: 'Service';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    description: Attribute.Text;
    tenant: Attribute.Relation<
      'api::service.service',
      'oneToOne',
      'api::tenant.tenant'
    >;
    files: Attribute.Media;
    tax: Attribute.Relation<'api::service.service', 'oneToOne', 'api::tax.tax'>;
    houseCall: Attribute.Boolean & Attribute.DefaultTo<false>;
    defaultPrice: Attribute.Decimal &
      Attribute.Required &
      Attribute.SetMinMax<{
        min: 0;
      }>;
    uuid: Attribute.UID & Attribute.CustomField<'plugin::field-uuid.uuid'>;
    favorite: Attribute.Boolean & Attribute.DefaultTo<false>;
    serviceLocationInfos: Attribute.Relation<
      'api::service.service',
      'oneToMany',
      'api::service-location-info.service-location-info'
    >;
    selling_service_order_items: Attribute.Relation<
      'api::service.service',
      'oneToMany',
      'api::service-order-item.service-order-item'
    >;
    active: Attribute.Boolean & Attribute.DefaultTo<true>;
    serviceId: Attribute.String & Attribute.Unique;
    revenue: Attribute.String;
    cost: Attribute.String;
    accServiceEntities: Attribute.Relation<
      'api::service.service',
      'oneToMany',
      'api::acc-service-entity.acc-service-entity'
    >;
    revenueChartAccount: Attribute.Relation<
      'api::service.service',
      'manyToOne',
      'api::chart-account.chart-account'
    >;
    revenueChartCategory: Attribute.Relation<
      'api::service.service',
      'manyToOne',
      'api::chart-category.chart-category'
    >;
    revenueChartSubcategory: Attribute.Relation<
      'api::service.service',
      'manyToOne',
      'api::chart-subcategory.chart-subcategory'
    >;
    costChartAccount: Attribute.Relation<
      'api::service.service',
      'manyToOne',
      'api::chart-account.chart-account'
    >;
    costChartCategory: Attribute.Relation<
      'api::service.service',
      'manyToOne',
      'api::chart-category.chart-category'
    >;
    costChartSubcategory: Attribute.Relation<
      'api::service.service',
      'manyToOne',
      'api::chart-subcategory.chart-subcategory'
    >;
    ecommerceDetails: Attribute.Relation<
      'api::service.service',
      'oneToMany',
      'api::ecommerce-detail.ecommerce-detail'
    >;
    isTaskCreationEnabled: Attribute.Boolean & Attribute.DefaultTo<true>;
    templateNote: Attribute.Text;
    taxCollection: Attribute.Relation<
      'api::service.service',
      'oneToOne',
      'api::tax-collection.tax-collection'
    >;
    itemCategory: Attribute.Relation<
      'api::service.service',
      'oneToOne',
      'api::item-category.item-category'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::service.service',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::service.service',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiServiceLocationInfoServiceLocationInfo
  extends Schema.CollectionType {
  collectionName: 'service_location_infos';
  info: {
    singularName: 'service-location-info';
    pluralName: 'service-location-infos';
    displayName: 'Service Location Info';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    service: Attribute.Relation<
      'api::service-location-info.service-location-info',
      'manyToOne',
      'api::service.service'
    >;
    servicePerformers: Attribute.Relation<
      'api::service-location-info.service-location-info',
      'oneToMany',
      'api::service-performer.service-performer'
    >;
    resourceCounts: Attribute.Relation<
      'api::service-location-info.service-location-info',
      'oneToMany',
      'api::resource-count.resource-count'
    >;
    businessLocation: Attribute.Relation<
      'api::service-location-info.service-location-info',
      'oneToOne',
      'api::business-location.business-location'
    >;
    favorite: Attribute.Boolean;
    uuid: Attribute.UID & Attribute.CustomField<'plugin::field-uuid.uuid'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::service-location-info.service-location-info',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::service-location-info.service-location-info',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiServiceOrderItemServiceOrderItem
  extends Schema.CollectionType {
  collectionName: 'service_order_items';
  info: {
    singularName: 'service-order-item';
    pluralName: 'service-order-items';
    displayName: 'SELLING: Service Order Item';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    quantity: Attribute.Integer;
    note: Attribute.Text;
    purchaseType: Attribute.Enumeration<['buy', 'rent']>;
    order: Attribute.Relation<
      'api::service-order-item.service-order-item',
      'manyToOne',
      'api::order.order'
    >;
    service: Attribute.Relation<
      'api::service-order-item.service-order-item',
      'manyToOne',
      'api::service-performer.service-performer'
    >;
    itemId: Attribute.String & Attribute.Required;
    price: Attribute.Decimal;
    discounts: Attribute.Relation<
      'api::service-order-item.service-order-item',
      'oneToMany',
      'api::discount.discount'
    >;
    tax: Attribute.Relation<
      'api::service-order-item.service-order-item',
      'oneToOne',
      'api::tax.tax'
    >;
    status: Attribute.Enumeration<['draft', 'published']> &
      Attribute.DefaultTo<'published'>;
    dueDate: Attribute.Date;
    isShowInvoiceNote: Attribute.Boolean & Attribute.DefaultTo<true>;
    isVisibleInDocs: Attribute.Boolean & Attribute.DefaultTo<true>;
    taxCollection: Attribute.Relation<
      'api::service-order-item.service-order-item',
      'oneToOne',
      'api::tax-collection.tax-collection'
    >;
    files: Attribute.Media;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::service-order-item.service-order-item',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::service-order-item.service-order-item',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiServicePerformerServicePerformer
  extends Schema.CollectionType {
  collectionName: 'service_performers';
  info: {
    singularName: 'service-performer';
    pluralName: 'service-performers';
    displayName: 'Service Performer';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    performer: Attribute.Relation<
      'api::service-performer.service-performer',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    duration: Attribute.Integer;
    pointsGiven: Attribute.Float;
    pointsRedeem: Attribute.Float;
    price: Attribute.Decimal;
    serviceLocationInfo: Attribute.Relation<
      'api::service-performer.service-performer',
      'manyToOne',
      'api::service-location-info.service-location-info'
    >;
    selling_service_order_items: Attribute.Relation<
      'api::service-performer.service-performer',
      'oneToMany',
      'api::service-order-item.service-order-item'
    >;
    uuid: Attribute.UID & Attribute.CustomField<'plugin::field-uuid.uuid'>;
    active: Attribute.Boolean & Attribute.DefaultTo<true>;
    tenant: Attribute.Relation<
      'api::service-performer.service-performer',
      'oneToOne',
      'api::tenant.tenant'
    >;
    isImported: Attribute.Boolean & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::service-performer.service-performer',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::service-performer.service-performer',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiServiceSettingServiceSetting extends Schema.CollectionType {
  collectionName: 'services_setting';
  info: {
    singularName: 'service-setting';
    pluralName: 'services-setting';
    displayName: 'SETTINGS: Service';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    defaultPerformer: Attribute.Relation<
      'api::service-setting.service-setting',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    tenant: Attribute.Relation<
      'api::service-setting.service-setting',
      'oneToOne',
      'api::tenant.tenant'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::service-setting.service-setting',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::service-setting.service-setting',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiSessionsSessions extends Schema.CollectionType {
  collectionName: 'user_sessions';
  info: {
    singularName: 'sessions';
    pluralName: 'user-sessions';
    displayName: 'USER: sessions';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    session_id: Attribute.String & Attribute.Required & Attribute.Unique;
    user_id: Attribute.String & Attribute.Required;
    ip: Attribute.String;
    browser: Attribute.String;
    device: Attribute.String;
    expired_at: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::sessions.sessions',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::sessions.sessions',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiSettingNotificationSettingNotification
  extends Schema.CollectionType {
  collectionName: 'setting_notifications';
  info: {
    singularName: 'setting-notification';
    pluralName: 'setting-notifications';
    displayName: 'SETTING: Notification';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    content: Attribute.Text;
    smsNotifyOnComplete: Attribute.Boolean & Attribute.DefaultTo<false>;
    emailNotifyOnComplete: Attribute.Boolean & Attribute.DefaultTo<false>;
    type: Attribute.Enumeration<['order']>;
    config: Attribute.JSON;
    tenant: Attribute.Relation<
      'api::setting-notification.setting-notification',
      'oneToOne',
      'api::tenant.tenant'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::setting-notification.setting-notification',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::setting-notification.setting-notification',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiSettingsChatSettingsChat extends Schema.CollectionType {
  collectionName: 'settings_chats';
  info: {
    singularName: 'settings-chat';
    pluralName: 'settings-chats';
    displayName: 'SETTINGS: Chat';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    userPrompt: Attribute.String;
    tenant: Attribute.Relation<
      'api::settings-chat.settings-chat',
      'oneToOne',
      'api::tenant.tenant'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::settings-chat.settings-chat',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::settings-chat.settings-chat',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiSettingsTaskSettingsTask extends Schema.CollectionType {
  collectionName: 'settings_tasks';
  info: {
    singularName: 'settings-task';
    pluralName: 'settings-tasks';
    displayName: 'SETTINGS: Task';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    tenant: Attribute.Relation<
      'api::settings-task.settings-task',
      'oneToOne',
      'api::tenant.tenant'
    >;
    config: Attribute.JSON;
    smsNotifyOnComplete: Attribute.Boolean & Attribute.DefaultTo<false>;
    emailNotifyOnComplete: Attribute.Boolean & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::settings-task.settings-task',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::settings-task.settings-task',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiShankStyleShankStyle extends Schema.CollectionType {
  collectionName: 'shank_styles';
  info: {
    singularName: 'shank-style';
    pluralName: 'shank-styles';
    displayName: 'INVENTORY: Shank Style';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    tenant: Attribute.Relation<
      'api::shank-style.shank-style',
      'oneToOne',
      'api::tenant.tenant'
    >;
    jewelryProductType: Attribute.Relation<
      'api::shank-style.shank-style',
      'manyToOne',
      'api::jewelry-product-type.jewelry-product-type'
    >;
    editable: Attribute.Boolean & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::shank-style.shank-style',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::shank-style.shank-style',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiShipmentShipment extends Schema.CollectionType {
  collectionName: 'shipments';
  info: {
    singularName: 'shipment';
    pluralName: 'shipments';
    displayName: 'Shipment';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    shipmentDate: Attribute.DateTime;
    trackingNumber: Attribute.String;
    trackingUrl: Attribute.String;
    notes: Attribute.Text;
    tenant: Attribute.Relation<
      'api::shipment.shipment',
      'oneToOne',
      'api::tenant.tenant'
    >;
    contact: Attribute.Relation<
      'api::shipment.shipment',
      'oneToOne',
      'api::contact.contact'
    >;
    order: Attribute.Relation<
      'api::shipment.shipment',
      'oneToOne',
      'api::order.order'
    >;
    carrier: Attribute.Relation<
      'api::shipment.shipment',
      'oneToOne',
      'api::shipment-carrier.shipment-carrier'
    >;
    company: Attribute.Relation<
      'api::shipment.shipment',
      'oneToOne',
      'api::company.company'
    >;
    charge: Attribute.String;
    uuid: Attribute.UID & Attribute.CustomField<'plugin::field-uuid.uuid'>;
    status: Attribute.Enumeration<['unshipped', 'shipped', 'delivered']> &
      Attribute.DefaultTo<'unshipped'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::shipment.shipment',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::shipment.shipment',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiShipmentCardShipmentCard extends Schema.CollectionType {
  collectionName: 'shipment_cards';
  info: {
    singularName: 'shipment-card';
    pluralName: 'shipment-cards';
    displayName: 'ShipmentCard';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    streetName: Attribute.String;
    apartment: Attribute.String;
    postcode: Attribute.String;
    companyName: Attribute.String;
    isDefault: Attribute.Boolean & Attribute.DefaultTo<false>;
    email: Attribute.Email;
    phoneNumber: Attribute.String;
    owner: Attribute.Relation<
      'api::shipment-card.shipment-card',
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    firstName: Attribute.String;
    lastName: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::shipment-card.shipment-card',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::shipment-card.shipment-card',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiShipmentCarrierShipmentCarrier
  extends Schema.CollectionType {
  collectionName: 'shipment_carriers';
  info: {
    singularName: 'shipment-carrier';
    pluralName: 'shipment-carriers';
    displayName: 'Shipment Carrier';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    tenant: Attribute.Relation<
      'api::shipment-carrier.shipment-carrier',
      'oneToOne',
      'api::tenant.tenant'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::shipment-carrier.shipment-carrier',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::shipment-carrier.shipment-carrier',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiShipmentPackageShipmentPackage
  extends Schema.CollectionType {
  collectionName: 'shipment_packages';
  info: {
    singularName: 'shipment-package';
    pluralName: 'shipment-packages';
    displayName: 'Shipment Package';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::shipment-package.shipment-package',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::shipment-package.shipment-package',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiShippingMethodShippingMethod extends Schema.CollectionType {
  collectionName: 'shipping_methods';
  info: {
    singularName: 'shipping-method';
    pluralName: 'shipping-methods';
    displayName: 'Shipping Method';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::shipping-method.shipping-method',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::shipping-method.shipping-method',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiSizeSize extends Schema.CollectionType {
  collectionName: 'sizes';
  info: {
    singularName: 'size';
    pluralName: 'sizes';
    displayName: 'INVENTORY: Size';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    tenant: Attribute.Relation<
      'api::size.size',
      'oneToOne',
      'api::tenant.tenant'
    >;
    jewelryProductType: Attribute.Relation<
      'api::size.size',
      'manyToOne',
      'api::jewelry-product-type.jewelry-product-type'
    >;
    editable: Attribute.Boolean & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::size.size', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'api::size.size', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface ApiSpecificTypeSpecificType extends Schema.CollectionType {
  collectionName: 'specific_types';
  info: {
    singularName: 'specific-type';
    pluralName: 'specific-types';
    displayName: 'INVENTORY: Specific Type';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    tenant: Attribute.Relation<
      'api::specific-type.specific-type',
      'oneToOne',
      'api::tenant.tenant'
    >;
    jewelryProductType: Attribute.Relation<
      'api::specific-type.specific-type',
      'manyToOne',
      'api::jewelry-product-type.jewelry-product-type'
    >;
    editable: Attribute.Boolean & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::specific-type.specific-type',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::specific-type.specific-type',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiStagingLogStagingLog extends Schema.CollectionType {
  collectionName: 'staging_logs';
  info: {
    singularName: 'staging-log';
    pluralName: 'staging-logs';
    displayName: 'Staging Log';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    type: Attribute.String;
    log: Attribute.Text;
    error: Attribute.Text;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::staging-log.staging-log',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::staging-log.staging-log',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiStrandStrand extends Schema.CollectionType {
  collectionName: 'strands';
  info: {
    singularName: 'strand';
    pluralName: 'strands';
    displayName: 'INVENTORY: Strand';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    tenant: Attribute.Relation<
      'api::strand.strand',
      'oneToOne',
      'api::tenant.tenant'
    >;
    jewelryProductType: Attribute.Relation<
      'api::strand.strand',
      'manyToOne',
      'api::jewelry-product-type.jewelry-product-type'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::strand.strand',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::strand.strand',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiStrandsLengthStrandsLength extends Schema.CollectionType {
  collectionName: 'strands_lengths';
  info: {
    singularName: 'strands-length';
    pluralName: 'strands-lengths';
    displayName: 'INVENTORY: Strands Length';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    tenant: Attribute.Relation<
      'api::strands-length.strands-length',
      'oneToOne',
      'api::tenant.tenant'
    >;
    jewelryProductType: Attribute.Relation<
      'api::strands-length.strands-length',
      'manyToOne',
      'api::jewelry-product-type.jewelry-product-type'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::strands-length.strands-length',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::strands-length.strands-length',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiStripeOnboardingStripeOnboarding
  extends Schema.CollectionType {
  collectionName: 'stripe_onboardings';
  info: {
    singularName: 'stripe-onboarding';
    pluralName: 'stripe-onboardings';
    displayName: 'Stripe Onboarding';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    accountStatus: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<false>;
    accountId: Attribute.String & Attribute.Unique;
    tenant: Attribute.Relation<
      'api::stripe-onboarding.stripe-onboarding',
      'oneToOne',
      'api::tenant.tenant'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::stripe-onboarding.stripe-onboarding',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::stripe-onboarding.stripe-onboarding',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiStripePlanCategoryStripePlanCategory
  extends Schema.CollectionType {
  collectionName: 'stripe_plan_categories';
  info: {
    singularName: 'stripe-plan-category';
    pluralName: 'stripe-plan-categories';
    displayName: 'Stripe Plan Category';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    category: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::stripe-plan-category.stripe-plan-category',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::stripe-plan-category.stripe-plan-category',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiStripeSubscriptionPlanStripeSubscriptionPlan
  extends Schema.CollectionType {
  collectionName: 'stripe_subscription_plans';
  info: {
    singularName: 'stripe-subscription-plan';
    pluralName: 'stripe-subscription-plans';
    displayName: 'Stripe subscription plan';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    priceId: Attribute.String & Attribute.Required & Attribute.Unique;
    amount: Attribute.Decimal;
    description: Attribute.RichText & Attribute.Required;
    subscriptions: Attribute.Relation<
      'api::stripe-subscription-plan.stripe-subscription-plan',
      'oneToMany',
      'api::tenant-stripe-subscription.tenant-stripe-subscription'
    >;
    applicationFee: Attribute.Decimal &
      Attribute.Required &
      Attribute.DefaultTo<1>;
    category: Attribute.Enumeration<['beginner', 'growing', 'business']>;
    plan: Attribute.Enumeration<['year', 'month']> & Attribute.Required;
    userCount: Attribute.Integer & Attribute.Required & Attribute.DefaultTo<3>;
    monthlyEmailCount: Attribute.BigInteger &
      Attribute.Required &
      Attribute.DefaultTo<'1000'>;
    storage: Attribute.BigInteger &
      Attribute.Required &
      Attribute.DefaultTo<'5120'>;
    callTime: Attribute.BigInteger &
      Attribute.Required &
      Attribute.DefaultTo<'1000'>;
    inventoryItemCount: Attribute.BigInteger &
      Attribute.Required &
      Attribute.DefaultTo<'100'>;
    name: Attribute.String;
    productId: Attribute.String;
    active: Attribute.Boolean & Attribute.DefaultTo<true>;
    stripePlanCategory: Attribute.Relation<
      'api::stripe-subscription-plan.stripe-subscription-plan',
      'oneToOne',
      'api::stripe-plan-category.stripe-plan-category'
    >;
    callRecordingTime: Attribute.BigInteger &
      Attribute.Required &
      Attribute.DefaultTo<'0'>;
    transcriptionTime: Attribute.BigInteger &
      Attribute.Required &
      Attribute.DefaultTo<'0'>;
    smsReceiveCount: Attribute.BigInteger &
      Attribute.Required &
      Attribute.DefaultTo<'0'>;
    smsSendCount: Attribute.BigInteger &
      Attribute.Required &
      Attribute.DefaultTo<'0'>;
    mmsReceiveCount: Attribute.BigInteger &
      Attribute.Required &
      Attribute.DefaultTo<'0'>;
    mmsSendCount: Attribute.BigInteger &
      Attribute.Required &
      Attribute.DefaultTo<'0'>;
    giaApiCount: Attribute.BigInteger &
      Attribute.Required &
      Attribute.DefaultTo<'0'>;
    callRecordingCharge: Attribute.Float;
    transcriptionCharge: Attribute.Float;
    smsReceiveCharge: Attribute.Float;
    smsSendCharge: Attribute.Float;
    mmsReceiveCharge: Attribute.Float;
    mmsSendCharge: Attribute.Float;
    giaApiCharge: Attribute.Float;
    userCharge: Attribute.Float;
    emailCharge: Attribute.Float;
    storageCharge: Attribute.Float;
    callCharge: Attribute.Float;
    inventoryItemCharge: Attribute.Float;
    igiApiCount: Attribute.BigInteger &
      Attribute.Required &
      Attribute.DefaultTo<'0'>;
    igiApiCharge: Attribute.Float;
    isSubEnableTrialPeriod: Attribute.Boolean & Attribute.DefaultTo<false>;
    trialPeriodDays: Attribute.Integer;
    isSubscriptionVisible: Attribute.Boolean & Attribute.DefaultTo<true>;
    whichTenantCanSee: Attribute.Relation<
      'api::stripe-subscription-plan.stripe-subscription-plan',
      'manyToMany',
      'api::tenant.tenant'
    >;
    subscriptionVisibleType: Attribute.Enumeration<['all', 'specific']>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::stripe-subscription-plan.stripe-subscription-plan',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::stripe-subscription-plan.stripe-subscription-plan',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiSublocationSublocation extends Schema.CollectionType {
  collectionName: 'sublocations';
  info: {
    singularName: 'sublocation';
    pluralName: 'sublocations';
    displayName: 'LOCATION: Sublocation';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    tenant: Attribute.Relation<
      'api::sublocation.sublocation',
      'oneToOne',
      'api::tenant.tenant'
    >;
    name: Attribute.String;
    businessLocation: Attribute.Relation<
      'api::sublocation.sublocation',
      'manyToOne',
      'api::business-location.business-location'
    >;
    sublocationItems: Attribute.Relation<
      'api::sublocation.sublocation',
      'oneToMany',
      'api::sublocation-item.sublocation-item'
    >;
    regexedId: Attribute.String & Attribute.Unique;
    selling_product_order_item: Attribute.Relation<
      'api::sublocation.sublocation',
      'manyToOne',
      'api::product-order-item.product-order-item'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::sublocation.sublocation',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::sublocation.sublocation',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiSublocationItemSublocationItem
  extends Schema.CollectionType {
  collectionName: 'sublocation_items';
  info: {
    singularName: 'sublocation-item';
    pluralName: 'sublocation-items';
    displayName: 'LOCATION: Sublocation item';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    tenant: Attribute.Relation<
      'api::sublocation-item.sublocation-item',
      'oneToOne',
      'api::tenant.tenant'
    >;
    quantity: Attribute.Integer & Attribute.DefaultTo<0>;
    productInventoryItem: Attribute.Relation<
      'api::sublocation-item.sublocation-item',
      'manyToOne',
      'api::product-inventory-item.product-inventory-item'
    >;
    scannedQty: Attribute.Integer;
    actualQty: Attribute.Integer;
    sublocation: Attribute.Relation<
      'api::sublocation-item.sublocation-item',
      'manyToOne',
      'api::sublocation.sublocation'
    >;
    selling_product_order_item: Attribute.Relation<
      'api::sublocation-item.sublocation-item',
      'manyToOne',
      'api::product-order-item.product-order-item'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::sublocation-item.sublocation-item',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::sublocation-item.sublocation-item',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiTaskTask extends Schema.CollectionType {
  collectionName: 'tasks';
  info: {
    singularName: 'task';
    pluralName: 'tasks';
    displayName: 'Task';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    description: Attribute.Text;
    dueDate: Attribute.DateTime;
    assignees: Attribute.Relation<
      'api::task.task',
      'oneToMany',
      'plugin::users-permissions.user'
    >;
    note: Attribute.Text;
    activity: Attribute.Relation<
      'api::task.task',
      'oneToOne',
      'api::activity.activity'
    >;
    completed: Attribute.Boolean & Attribute.DefaultTo<false>;
    tenant: Attribute.Relation<
      'api::task.task',
      'oneToOne',
      'api::tenant.tenant'
    >;
    company: Attribute.Relation<
      'api::task.task',
      'oneToOne',
      'api::company.company'
    >;
    contact: Attribute.Relation<
      'api::task.task',
      'oneToOne',
      'api::contact.contact'
    >;
    lead: Attribute.Relation<'api::task.task', 'oneToOne', 'api::lead.lead'>;
    taskLocation: Attribute.Relation<
      'api::task.task',
      'oneToOne',
      'api::task-location.task-location'
    >;
    files: Attribute.Media;
    taskType: Attribute.Relation<
      'api::task.task',
      'oneToOne',
      'api::task-type.task-type'
    >;
    forCompanies: Attribute.Relation<
      'api::task.task',
      'oneToMany',
      'api::company.company'
    >;
    approvalMethods: Attribute.Relation<
      'api::task.task',
      'oneToMany',
      'api::approval-method.approval-method'
    >;
    approvalDueDate: Attribute.DateTime;
    approval: Attribute.Boolean & Attribute.DefaultTo<false>;
    currentVendor: Attribute.Relation<
      'api::task.task',
      'oneToOne',
      'api::company.company'
    >;
    order: Attribute.Relation<
      'api::task.task',
      'manyToOne',
      'api::order.order'
    >;
    priority: Attribute.Enumeration<['high', 'medium', 'low', 'inactive']> &
      Attribute.DefaultTo<'low'>;
    taskStage: Attribute.Relation<
      'api::task.task',
      'oneToOne',
      'api::task-stage.task-stage'
    >;
    businessLocation: Attribute.Relation<
      'api::task.task',
      'oneToOne',
      'api::business-location.business-location'
    >;
    transitingTo: Attribute.Relation<
      'api::task.task',
      'oneToOne',
      'api::business-location.business-location'
    >;
    completedDate: Attribute.DateTime;
    serviceOrderItem: Attribute.Relation<
      'api::task.task',
      'oneToOne',
      'api::service-order-item.service-order-item'
    >;
    appointmentDate: Attribute.DateTime;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::task.task', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'api::task.task', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface ApiTaskLocationTaskLocation extends Schema.CollectionType {
  collectionName: 'task_locations';
  info: {
    singularName: 'task-location';
    pluralName: 'task-locations';
    displayName: 'Task Location';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    tenant: Attribute.Relation<
      'api::task-location.task-location',
      'oneToOne',
      'api::tenant.tenant'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::task-location.task-location',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::task-location.task-location',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiTaskStageTaskStage extends Schema.CollectionType {
  collectionName: 'task_stages';
  info: {
    singularName: 'task-stage';
    pluralName: 'task-stages';
    displayName: 'TASKS: Task Stage';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    tenant: Attribute.Relation<
      'api::task-stage.task-stage',
      'oneToOne',
      'api::tenant.tenant'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::task-stage.task-stage',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::task-stage.task-stage',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiTaskTypeTaskType extends Schema.CollectionType {
  collectionName: 'task_types';
  info: {
    singularName: 'task-type';
    pluralName: 'task-types';
    displayName: 'TASKS: Task Type';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    tenant: Attribute.Relation<
      'api::task-type.task-type',
      'oneToOne',
      'api::tenant.tenant'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::task-type.task-type',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::task-type.task-type',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiTaxTax extends Schema.CollectionType {
  collectionName: 'taxes';
  info: {
    singularName: 'tax';
    pluralName: 'taxes';
    displayName: 'Tax';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    rate: Attribute.Float;
    tenant: Attribute.Relation<
      'api::tax.tax',
      'oneToOne',
      'api::tenant.tenant'
    >;
    taxAuthority: Attribute.Relation<
      'api::tax.tax',
      'manyToOne',
      'api::tax-authority.tax-authority'
    >;
    fixedFee: Attribute.Float;
    perUnitFee: Attribute.Float;
    taxCollections: Attribute.Relation<
      'api::tax.tax',
      'manyToMany',
      'api::tax-collection.tax-collection'
    >;
    maxTaxAmount: Attribute.Float;
    startAfterPrice: Attribute.Decimal;
    endAfterPrice: Attribute.Decimal;
    exemptionThreshold: Attribute.Decimal;
    accServiceTaxes: Attribute.Relation<
      'api::tax.tax',
      'oneToMany',
      'api::acc-service-tax.acc-service-tax'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::tax.tax', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'api::tax.tax', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface ApiTaxAuthorityTaxAuthority extends Schema.CollectionType {
  collectionName: 'tax_authorities';
  info: {
    singularName: 'tax-authority';
    pluralName: 'tax-authorities';
    displayName: 'Tax Authority';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    taxes: Attribute.Relation<
      'api::tax-authority.tax-authority',
      'oneToMany',
      'api::tax.tax'
    >;
    tenant: Attribute.Relation<
      'api::tax-authority.tax-authority',
      'oneToOne',
      'api::tenant.tenant'
    >;
    accServiceTaxagns: Attribute.Relation<
      'api::tax-authority.tax-authority',
      'oneToMany',
      'api::acc-service-taxagn.acc-service-taxagn'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::tax-authority.tax-authority',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::tax-authority.tax-authority',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiTaxCollectionTaxCollection extends Schema.CollectionType {
  collectionName: 'tax_collections';
  info: {
    singularName: 'tax-collection';
    pluralName: 'tax-collections';
    displayName: 'Tax Collection';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    taxes: Attribute.Relation<
      'api::tax-collection.tax-collection',
      'manyToMany',
      'api::tax.tax'
    >;
    tenant: Attribute.Relation<
      'api::tax-collection.tax-collection',
      'oneToOne',
      'api::tenant.tenant'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::tax-collection.tax-collection',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::tax-collection.tax-collection',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiTaxReportTaxReport extends Schema.CollectionType {
  collectionName: 'tax_reports';
  info: {
    singularName: 'tax-report';
    pluralName: 'tax-reports';
    displayName: 'Tax Report';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    dealTransaction: Attribute.Relation<
      'api::tax-report.tax-report',
      'oneToOne',
      'api::deal-transaction.deal-transaction'
    >;
    order: Attribute.Relation<
      'api::tax-report.tax-report',
      'oneToOne',
      'api::order.order'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::tax-report.tax-report',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::tax-report.tax-report',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiTenantTenant extends Schema.CollectionType {
  collectionName: 'tenants';
  info: {
    singularName: 'tenant';
    pluralName: 'tenants';
    displayName: 'Tenant';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    companyName: Attribute.String & Attribute.Required;
    slug: Attribute.UID<'api::tenant.tenant', 'companyName'>;
    users: Attribute.Relation<
      'api::tenant.tenant',
      'oneToMany',
      'plugin::users-permissions.user'
    >;
    locations: Attribute.Relation<
      'api::tenant.tenant',
      'oneToMany',
      'api::location.location'
    >;
    products: Attribute.Relation<
      'api::tenant.tenant',
      'oneToMany',
      'api::product.product'
    >;
    nylas_connection: Attribute.Relation<
      'api::tenant.tenant',
      'oneToMany',
      'api::nylas-connection.nylas-connection'
    >;
    selling_orders: Attribute.Relation<
      'api::tenant.tenant',
      'oneToMany',
      'api::order.order'
    >;
    dealTransactionReminders: Attribute.Relation<
      'api::tenant.tenant',
      'oneToMany',
      'api::deal-transaction-reminder.deal-transaction-reminder'
    >;
    dealTransactions: Attribute.Relation<
      'api::tenant.tenant',
      'oneToMany',
      'api::deal-transaction.deal-transaction'
    >;
    websites: Attribute.Relation<
      'api::tenant.tenant',
      'oneToMany',
      'api::website.website'
    >;
    stripe_onboarding: Attribute.Relation<
      'api::tenant.tenant',
      'oneToOne',
      'api::stripe-onboarding.stripe-onboarding'
    >;
    twilioConnection: Attribute.Relation<
      'api::tenant.tenant',
      'oneToOne',
      'api::twilio-connection.twilio-connection'
    >;
    subscriptions: Attribute.Relation<
      'api::tenant.tenant',
      'oneToMany',
      'api::tenant-stripe-subscription.tenant-stripe-subscription'
    >;
    usages: Attribute.Relation<
      'api::tenant.tenant',
      'oneToMany',
      'api::usage.usage'
    >;
    credits: Attribute.Decimal &
      Attribute.SetMinMax<{
        min: 0;
      }>;
    tenant_credit_histories: Attribute.Relation<
      'api::tenant.tenant',
      'oneToMany',
      'api::tenant-credit-history.tenant-credit-history'
    >;
    thresholdBalance: Attribute.Decimal &
      Attribute.SetMinMax<{
        min: 0;
      }>;
    rechargeToBalance: Attribute.Decimal &
      Attribute.SetMinMax<{
        min: 0;
      }>;
    autoRechargeCredit: Attribute.Boolean & Attribute.DefaultTo<false>;
    onboarding: Attribute.Relation<
      'api::tenant.tenant',
      'oneToOne',
      'api::onboarding.onboarding'
    >;
    logo: Attribute.Media;
    mainLocation: Attribute.Relation<
      'api::tenant.tenant',
      'oneToOne',
      'api::location.location'
    >;
    email: Attribute.Email;
    phoneNumber: Attribute.String;
    websiteUrl: Attribute.String;
    paymentGatewayType: Attribute.Enumeration<['stripe', 'clearent']>;
    clearent_onboarding: Attribute.Relation<
      'api::tenant.tenant',
      'oneToOne',
      'api::clearent-onboarding.clearent-onboarding'
    >;
    clearent_terminals: Attribute.Relation<
      'api::tenant.tenant',
      'oneToMany',
      'api::clearent-terminal.clearent-terminal'
    >;
    ecommerceDetails: Attribute.Relation<
      'api::tenant.tenant',
      'oneToMany',
      'api::ecommerce-detail.ecommerce-detail'
    >;
    invoiceTerms: Attribute.Text;
    companySetting: Attribute.Relation<
      'api::tenant.tenant',
      'oneToOne',
      'api::company-setting.company-setting'
    >;
    contactSetting: Attribute.Relation<
      'api::tenant.tenant',
      'oneToOne',
      'api::contact-setting.contact-setting'
    >;
    settingsProduct: Attribute.Relation<
      'api::tenant.tenant',
      'oneToOne',
      'api::product-setting.product-setting'
    >;
    ecommerceCustomAppServices: Attribute.Relation<
      'api::tenant.tenant',
      'oneToMany',
      'api::ecommerce-custom-app-service.ecommerce-custom-app-service'
    >;
    status: Attribute.Boolean & Attribute.DefaultTo<true>;
    paymentMethods: Attribute.Relation<
      'api::tenant.tenant',
      'oneToMany',
      'api::payment-method.payment-method'
    >;
    emailSender: Attribute.String & Attribute.DefaultTo<'no-reply'>;
    storageUsage: Attribute.String;
    stripe_subscription_plans: Attribute.Relation<
      'api::tenant.tenant',
      'manyToMany',
      'api::stripe-subscription-plan.stripe-subscription-plan'
    >;
    exceededServices: Attribute.Relation<
      'api::tenant.tenant',
      'oneToMany',
      'api::exceeded-service.exceeded-service'
    >;
    accServiceConns: Attribute.Relation<
      'api::tenant.tenant',
      'oneToMany',
      'api::acc-service-conn.acc-service-conn'
    >;
    accServiceTrack: Attribute.Relation<
      'api::tenant.tenant',
      'oneToMany',
      'api::acc-service-track.acc-service-track'
    >;
    pdfTemplates: Attribute.Relation<
      'api::tenant.tenant',
      'oneToMany',
      'api::pdf-template.pdf-template'
    >;
    meta_connection: Attribute.Relation<
      'api::tenant.tenant',
      'oneToOne',
      'api::meta-connection.meta-connection'
    >;
    trackers: Attribute.Relation<
      'api::tenant.tenant',
      'oneToMany',
      'api::time-tracker.time-tracker'
    >;
    timeline_connection: Attribute.Relation<
      'api::tenant.tenant',
      'oneToOne',
      'api::timeline-connection.timeline-connection'
    >;
    zapierWebhooks: Attribute.Relation<
      'api::tenant.tenant',
      'oneToMany',
      'api::zapier-webhook.zapier-webhook'
    >;
    settings_chat: Attribute.Relation<
      'api::tenant.tenant',
      'oneToOne',
      'api::settings-chat.settings-chat'
    >;
    settings_task: Attribute.Relation<
      'api::tenant.tenant',
      'oneToOne',
      'api::settings-task.settings-task'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::tenant.tenant',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::tenant.tenant',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiTenantCreditHistoryTenantCreditHistory
  extends Schema.CollectionType {
  collectionName: 'tenant_credit_histories';
  info: {
    singularName: 'tenant-credit-history';
    pluralName: 'tenant-credit-histories';
    displayName: 'Tenant Credit History';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    amount: Attribute.Float &
      Attribute.Required &
      Attribute.SetMinMax<{
        min: 0;
      }>;
    serviceType: Attribute.Enumeration<
      [
        'userCount',
        'inventoryItemCount',
        'callTime',
        'callRecordingTime',
        'transcriptionTime',
        'smsSendCount',
        'smsReceiveCount',
        'mmsSendCount',
        'mmsReceiveCount',
        'monthlyEmailCount',
        'giaApiCount',
        'storage',
        'igiApiCount',
      ]
    >;
    date: Attribute.DateTime & Attribute.Required;
    status: Attribute.Enumeration<['running', 'failed', 'paid', 'completed']> &
      Attribute.Required &
      Attribute.DefaultTo<'running'>;
    tenant: Attribute.Relation<
      'api::tenant-credit-history.tenant-credit-history',
      'manyToOne',
      'api::tenant.tenant'
    >;
    transactionType: Attribute.Enumeration<['credit', 'debit']> &
      Attribute.Required;
    invoice: Attribute.String;
    stripeInfo: Attribute.JSON;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::tenant-credit-history.tenant-credit-history',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::tenant-credit-history.tenant-credit-history',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiTenantStripeSubscriptionTenantStripeSubscription
  extends Schema.CollectionType {
  collectionName: 'tenant_stripe_subscriptions';
  info: {
    singularName: 'tenant-stripe-subscription';
    pluralName: 'tenant-stripe-subscriptions';
    displayName: 'Tenant stripe subscription';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    status: Attribute.Boolean & Attribute.DefaultTo<false>;
    startDate: Attribute.DateTime & Attribute.Required;
    endDate: Attribute.DateTime & Attribute.Required;
    plan: Attribute.Relation<
      'api::tenant-stripe-subscription.tenant-stripe-subscription',
      'manyToOne',
      'api::stripe-subscription-plan.stripe-subscription-plan'
    >;
    subscriptionId: Attribute.String;
    tenant: Attribute.Relation<
      'api::tenant-stripe-subscription.tenant-stripe-subscription',
      'manyToOne',
      'api::tenant.tenant'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::tenant-stripe-subscription.tenant-stripe-subscription',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::tenant-stripe-subscription.tenant-stripe-subscription',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiTimePeriodTimePeriod extends Schema.CollectionType {
  collectionName: 'time_periods';
  info: {
    singularName: 'time-period';
    pluralName: 'time-periods';
    displayName: 'INVENTORY: Time Period';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    tenant: Attribute.Relation<
      'api::time-period.time-period',
      'oneToOne',
      'api::tenant.tenant'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::time-period.time-period',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::time-period.time-period',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiTimeTrackerTimeTracker extends Schema.CollectionType {
  collectionName: 'time_trackers';
  info: {
    singularName: 'time-tracker';
    pluralName: 'time-trackers';
    displayName: 'Time Tracker';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    startTime: Attribute.DateTime;
    endTime: Attribute.DateTime;
    shiftTime: Attribute.Time;
    notes: Attribute.Text;
    user: Attribute.Relation<
      'api::time-tracker.time-tracker',
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    tenant: Attribute.Relation<
      'api::time-tracker.time-tracker',
      'manyToOne',
      'api::tenant.tenant'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::time-tracker.time-tracker',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::time-tracker.time-tracker',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiTimelineConnectionTimelineConnection
  extends Schema.CollectionType {
  collectionName: 'timeline_connections';
  info: {
    singularName: 'timeline-connection';
    pluralName: 'timeline-connections';
    displayName: 'Timeline Connection';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    token: Attribute.String;
    accounts: Attribute.Component<'data.connection', true>;
    tenant: Attribute.Relation<
      'api::timeline-connection.timeline-connection',
      'oneToOne',
      'api::tenant.tenant'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::timeline-connection.timeline-connection',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::timeline-connection.timeline-connection',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiTodoTodo extends Schema.CollectionType {
  collectionName: 'todos';
  info: {
    singularName: 'todo';
    pluralName: 'todos';
    displayName: 'Todo';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    description: Attribute.Text & Attribute.Required;
    completed: Attribute.Boolean & Attribute.DefaultTo<false>;
    company_id: Attribute.Relation<
      'api::todo.todo',
      'manyToOne',
      'api::company.company'
    >;
    lead_id: Attribute.Relation<
      'api::todo.todo',
      'manyToOne',
      'api::lead.lead'
    >;
    contact_id: Attribute.Relation<
      'api::todo.todo',
      'manyToOne',
      'api::contact.contact'
    >;
    wishableProduct: Attribute.Relation<
      'api::todo.todo',
      'oneToOne',
      'api::product.product'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::todo.todo', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'api::todo.todo', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface ApiTransactionTransaction extends Schema.CollectionType {
  collectionName: 'transactions';
  info: {
    singularName: 'transaction';
    pluralName: 'transactions';
    displayName: 'Transaction';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    total_spent: Attribute.Decimal & Attribute.Required;
    total_due: Attribute.Decimal & Attribute.Required;
    company: Attribute.Relation<
      'api::transaction.transaction',
      'oneToOne',
      'api::company.company'
    >;
    contact: Attribute.Relation<
      'api::transaction.transaction',
      'oneToOne',
      'api::contact.contact'
    >;
    spent: Attribute.Decimal & Attribute.Required;
    due: Attribute.Decimal & Attribute.Required;
    stripeData: Attribute.JSON & Attribute.Required;
    status: Attribute.Enumeration<['success', 'failed']>;
    description: Attribute.Text;
    sellingOrder: Attribute.Relation<
      'api::transaction.transaction',
      'manyToOne',
      'api::order.order'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::transaction.transaction',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::transaction.transaction',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiTransferOrderTransferOrder extends Schema.CollectionType {
  collectionName: 'transfer_orders';
  info: {
    singularName: 'transfer-order';
    pluralName: 'transfer-orders';
    displayName: 'TransferOrder';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    tenant: Attribute.Relation<
      'api::transfer-order.transfer-order',
      'oneToOne',
      'api::tenant.tenant'
    >;
    transferId: Attribute.String;
    uuid: Attribute.UID & Attribute.CustomField<'plugin::field-uuid.uuid'>;
    orderDate: Attribute.DateTime;
    locationFrom: Attribute.Relation<
      'api::transfer-order.transfer-order',
      'oneToOne',
      'api::business-location.business-location'
    >;
    locationTo: Attribute.Relation<
      'api::transfer-order.transfer-order',
      'oneToOne',
      'api::business-location.business-location'
    >;
    transferOrderItems: Attribute.Relation<
      'api::transfer-order.transfer-order',
      'oneToMany',
      'api::transfer-order-item.transfer-order-item'
    >;
    files: Attribute.Media;
    reason: Attribute.Text;
    sublocationFrom: Attribute.Relation<
      'api::transfer-order.transfer-order',
      'oneToOne',
      'api::sublocation.sublocation'
    >;
    sublocationTo: Attribute.Relation<
      'api::transfer-order.transfer-order',
      'oneToOne',
      'api::sublocation.sublocation'
    >;
    employee: Attribute.Relation<
      'api::transfer-order.transfer-order',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    employeeConfirmed: Attribute.Relation<
      'api::transfer-order.transfer-order',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    status: Attribute.Enumeration<['pending', 'accepted', 'rejected']>;
    notes: Attribute.Text;
    employeeReceivedDate: Attribute.DateTime;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::transfer-order.transfer-order',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::transfer-order.transfer-order',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiTransferOrderItemTransferOrderItem
  extends Schema.CollectionType {
  collectionName: 'transfer_order_items';
  info: {
    singularName: 'transfer-order-item';
    pluralName: 'transfer-order-items';
    displayName: 'Transfer Order Item';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    quantityFrom: Attribute.Integer;
    quantityTo: Attribute.Integer;
    transferQuantity: Attribute.Integer;
    transferOrder: Attribute.Relation<
      'api::transfer-order-item.transfer-order-item',
      'manyToOne',
      'api::transfer-order.transfer-order'
    >;
    product: Attribute.Relation<
      'api::transfer-order-item.transfer-order-item',
      'oneToOne',
      'api::product.product'
    >;
    tenant: Attribute.Relation<
      'api::transfer-order-item.transfer-order-item',
      'oneToOne',
      'api::tenant.tenant'
    >;
    sublocationItem: Attribute.Relation<
      'api::transfer-order-item.transfer-order-item',
      'oneToOne',
      'api::sublocation-item.sublocation-item'
    >;
    serializes: Attribute.Relation<
      'api::transfer-order-item.transfer-order-item',
      'oneToMany',
      'api::inventory-serialize.inventory-serialize'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::transfer-order-item.transfer-order-item',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::transfer-order-item.transfer-order-item',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiTwilioConnectionTwilioConnection
  extends Schema.CollectionType {
  collectionName: 'twilio_connections';
  info: {
    singularName: 'twilio-connection';
    pluralName: 'twilio-connections';
    displayName: 'Twilio Connection';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    tenant: Attribute.Relation<
      'api::twilio-connection.twilio-connection',
      'oneToOne',
      'api::tenant.tenant'
    >;
    messagingServiceSid: Attribute.Text;
    token: Attribute.Text;
    conversationServiceSid: Attribute.Text;
    keySid: Attribute.Text;
    friendlyName: Attribute.String;
    accountSid: Attribute.Text;
    phoneNumber: Attribute.String;
    transcriptionEnabled: Attribute.Boolean;
    transcriptionServiceSid: Attribute.String;
    keySecret: Attribute.String;
    allowedOrigins: Attribute.Component<'data.set', true>;
    flexDeploymentKeyWebChat: Attribute.String;
    flexAccountSid: Attribute.String;
    flexAccountToken: Attribute.String;
    waNumber: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::twilio-connection.twilio-connection',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::twilio-connection.twilio-connection',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiUsageUsage extends Schema.CollectionType {
  collectionName: 'usages';
  info: {
    singularName: 'usage';
    pluralName: 'usages';
    displayName: 'Service Usage';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    tenant: Attribute.Relation<
      'api::usage.usage',
      'manyToOne',
      'api::tenant.tenant'
    >;
    usageCounts: Attribute.JSON & Attribute.Required;
    currentMonth: Attribute.Date;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::usage.usage',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::usage.usage',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiUserNotificationUserNotification
  extends Schema.CollectionType {
  collectionName: 'user_notifications';
  info: {
    singularName: 'user-notification';
    pluralName: 'user-notifications';
    displayName: 'NOTIFICATIONS: User Notification';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    user: Attribute.Relation<
      'api::user-notification.user-notification',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    hasBeenSeen: Attribute.Boolean & Attribute.DefaultTo<false>;
    inventoryQuantityNotification: Attribute.Relation<
      'api::user-notification.user-notification',
      'manyToOne',
      'api::inventory-quantity-notification.inventory-quantity-notification'
    >;
    type: Attribute.Enumeration<
      [
        'InventoryQuantity',
        'MaintenanceQuantity',
        'NylasGrantExpire',
        'BulkUpload',
      ]
    >;
    maintenanceQuantityNotification: Attribute.Relation<
      'api::user-notification.user-notification',
      'manyToOne',
      'api::maintenance-quantity-notification.maintenance-quantity-notification'
    >;
    orderStatusNotification: Attribute.Relation<
      'api::user-notification.user-notification',
      'manyToOne',
      'api::order-status-notification.order-status-notification'
    >;
    nylasGrantExpire: Attribute.Relation<
      'api::user-notification.user-notification',
      'oneToOne',
      'api::notifications-nylas-grant-expire.notifications-nylas-grant-expire'
    >;
    imagesNotify: Attribute.Relation<
      'api::user-notification.user-notification',
      'manyToOne',
      'api::bulk-images-notify.bulk-images-notify'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::user-notification.user-notification',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::user-notification.user-notification',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiWebsiteWebsite extends Schema.CollectionType {
  collectionName: 'websites';
  info: {
    singularName: 'website';
    pluralName: 'websites';
    displayName: 'Website';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    tenant: Attribute.Relation<
      'api::website.website',
      'manyToOne',
      'api::tenant.tenant'
    >;
    customerReview: Attribute.Component<'ui.customer-review-section'>;
    followUs: Attribute.Component<'ui.extended-section'>;
    hero: Attribute.Component<'ui.extended-section'>;
    services: Attribute.Component<'ui.extended-section'>;
    aboutUs: Attribute.Component<'ui.extended-section'>;
    footer: Attribute.Component<'ui.extended-section'>;
    shopHero: Attribute.Component<'ui.section'>;
    subscribeNewsletter: Attribute.Component<'ui.extended-section'>;
    aboutUsHero: Attribute.Component<'ui.extended-section'>;
    statistics: Attribute.Component<'ui.extended-section'>;
    benefits: Attribute.Component<'ui.extended-section'>;
    blogHero: Attribute.Component<'ui.section'>;
    faqHero: Attribute.Component<'ui.extended-section'>;
    subdomain: Attribute.String & Attribute.Unique;
    privacyPolicy: Attribute.Component<'ui.paragraph'>;
    termsConditions: Attribute.Component<'ui.paragraph'>;
    initialSettings: Attribute.Component<'ui.extended-section'>;
    sectionsVisibility: Attribute.Component<'ui.sections-visibility', true>;
    websiteType: Attribute.Enumeration<['public', 'draft']>;
    ProductTypesVisibility: Attribute.Component<'ui.product-types-visibility'>;
    shipmentCost: Attribute.Component<'ui.shipment-cost'>;
    websiteContacts: Attribute.Component<'ui.website-contacts'>;
    workingHours: Attribute.Component<'ui.working-hours'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::website.website',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::website.website',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiWeightWeight extends Schema.CollectionType {
  collectionName: 'weights';
  info: {
    singularName: 'weight';
    pluralName: 'weights';
    displayName: 'Weight';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    value: Attribute.Float & Attribute.Required;
    unit: Attribute.Enumeration<
      ['mg', 'g', 'kg', 'gr', 'oz', 'lb', 'ct', 'dwt']
    >;
    product: Attribute.Relation<
      'api::weight.weight',
      'oneToOne',
      'api::product.product'
    >;
    jewelryProduct: Attribute.Relation<
      'api::weight.weight',
      'oneToOne',
      'api::jewelry-product.jewelry-product'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::weight.weight',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::weight.weight',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiZapierWebhookZapierWebhook extends Schema.CollectionType {
  collectionName: 'zapier_webhooks';
  info: {
    singularName: 'zapier-webhook';
    pluralName: 'zapier-webhooks';
    displayName: 'Zapier Webhook';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    webhook: Attribute.String;
    tenant: Attribute.Relation<
      'api::zapier-webhook.zapier-webhook',
      'manyToOne',
      'api::tenant.tenant'
    >;
    entityType: Attribute.Enumeration<['task', 'order']> &
      Attribute.DefaultTo<'task'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::zapier-webhook.zapier-webhook',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::zapier-webhook.zapier-webhook',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

declare module '@strapi/strapi' {
  export module Shared {
    export interface ContentTypes {
      'admin::permission': AdminPermission;
      'admin::user': AdminUser;
      'admin::role': AdminRole;
      'admin::api-token': AdminApiToken;
      'admin::api-token-permission': AdminApiTokenPermission;
      'admin::transfer-token': AdminTransferToken;
      'admin::transfer-token-permission': AdminTransferTokenPermission;
      'plugin::upload.file': PluginUploadFile;
      'plugin::upload.folder': PluginUploadFolder;
      'plugin::slugify.slug': PluginSlugifySlug;
      'plugin::users-permissions.permission': PluginUsersPermissionsPermission;
      'plugin::users-permissions.role': PluginUsersPermissionsRole;
      'plugin::users-permissions.user': PluginUsersPermissionsUser;
      'plugin::email-designer.email-template': PluginEmailDesignerEmailTemplate;
      'plugin::react-icons.iconlibrary': PluginReactIconsIconlibrary;
      'api::acc-product-mapping.acc-product-mapping': ApiAccProductMappingAccProductMapping;
      'api::acc-service-bill.acc-service-bill': ApiAccServiceBillAccServiceBill;
      'api::acc-service-conn.acc-service-conn': ApiAccServiceConnAccServiceConn;
      'api::acc-service-contact.acc-service-contact': ApiAccServiceContactAccServiceContact;
      'api::acc-service-entity.acc-service-entity': ApiAccServiceEntityAccServiceEntity;
      'api::acc-service-file.acc-service-file': ApiAccServiceFileAccServiceFile;
      'api::acc-service-order.acc-service-order': ApiAccServiceOrderAccServiceOrder;
      'api::acc-service-tax.acc-service-tax': ApiAccServiceTaxAccServiceTax;
      'api::acc-service-taxagn.acc-service-taxagn': ApiAccServiceTaxagnAccServiceTaxagn;
      'api::acc-service-track.acc-service-track': ApiAccServiceTrackAccServiceTrack;
      'api::acc-service-txn.acc-service-txn': ApiAccServiceTxnAccServiceTxn;
      'api::acc-service-vendor.acc-service-vendor': ApiAccServiceVendorAccServiceVendor;
      'api::activity.activity': ApiActivityActivity;
      'api::appraisal.appraisal': ApiAppraisalAppraisal;
      'api::approval-method.approval-method': ApiApprovalMethodApprovalMethod;
      'api::article.article': ApiArticleArticle;
      'api::auth-layout.auth-layout': ApiAuthLayoutAuthLayout;
      'api::backing.backing': ApiBackingBacking;
      'api::box-paper.box-paper': ApiBoxPaperBoxPaper;
      'api::bulk-images-notify.bulk-images-notify': ApiBulkImagesNotifyBulkImagesNotify;
      'api::business-location.business-location': ApiBusinessLocationBusinessLocation;
      'api::call.call': ApiCallCall;
      'api::campaign.campaign': ApiCampaignCampaign;
      'api::campaign-enrolled-contact.campaign-enrolled-contact': ApiCampaignEnrolledContactCampaignEnrolledContact;
      'api::campaign-enrolled-lead.campaign-enrolled-lead': ApiCampaignEnrolledLeadCampaignEnrolledLead;
      'api::carrier.carrier': ApiCarrierCarrier;
      'api::chart-account.chart-account': ApiChartAccountChartAccount;
      'api::chart-category.chart-category': ApiChartCategoryChartCategory;
      'api::chart-subcategory.chart-subcategory': ApiChartSubcategoryChartSubcategory;
      'api::chat-notification.chat-notification': ApiChatNotificationChatNotification;
      'api::class.class': ApiClassClass;
      'api::class-location-info.class-location-info': ApiClassLocationInfoClassLocationInfo;
      'api::class-order-item.class-order-item': ApiClassOrderItemClassOrderItem;
      'api::class-performer.class-performer': ApiClassPerformerClassPerformer;
      'api::clearent-onboarding.clearent-onboarding': ApiClearentOnboardingClearentOnboarding;
      'api::clearent-terminal.clearent-terminal': ApiClearentTerminalClearentTerminal;
      'api::company.company': ApiCompanyCompany;
      'api::company-setting.company-setting': ApiCompanySettingCompanySetting;
      'api::composite-product.composite-product': ApiCompositeProductCompositeProduct;
      'api::composite-product-item-info.composite-product-item-info': ApiCompositeProductItemInfoCompositeProductItemInfo;
      'api::composite-product-location-info.composite-product-location-info': ApiCompositeProductLocationInfoCompositeProductLocationInfo;
      'api::composite-product-order-item.composite-product-order-item': ApiCompositeProductOrderItemCompositeProductOrderItem;
      'api::condition-type.condition-type': ApiConditionTypeConditionType;
      'api::contact.contact': ApiContactContact;
      'api::contact-setting.contact-setting': ApiContactSettingContactSetting;
      'api::contact-title.contact-title': ApiContactTitleContactTitle;
      'api::contract.contract': ApiContractContract;
      'api::contract-template.contract-template': ApiContractTemplateContractTemplate;
      'api::conversation.conversation': ApiConversationConversation;
      'api::country.country': ApiCountryCountry;
      'api::crm-additional-address.crm-additional-address': ApiCrmAdditionalAddressCrmAdditionalAddress;
      'api::crm-additional-email.crm-additional-email': ApiCrmAdditionalEmailCrmAdditionalEmail;
      'api::crm-additional-phone-number.crm-additional-phone-number': ApiCrmAdditionalPhoneNumberCrmAdditionalPhoneNumber;
      'api::crm-custom-field-name.crm-custom-field-name': ApiCrmCustomFieldNameCrmCustomFieldName;
      'api::crm-custom-field-value.crm-custom-field-value': ApiCrmCustomFieldValueCrmCustomFieldValue;
      'api::crm-relation.crm-relation': ApiCrmRelationCrmRelation;
      'api::crm-relation-type.crm-relation-type': ApiCrmRelationTypeCrmRelationType;
      'api::custom-permission.custom-permission': ApiCustomPermissionCustomPermission;
      'api::deal.deal': ApiDealDeal;
      'api::deal-setting.deal-setting': ApiDealSettingDealSetting;
      'api::deal-transaction.deal-transaction': ApiDealTransactionDealTransaction;
      'api::deal-transaction-reminder.deal-transaction-reminder': ApiDealTransactionReminderDealTransactionReminder;
      'api::default-importing-file.default-importing-file': ApiDefaultImportingFileDefaultImportingFile;
      'api::default-pdf-template.default-pdf-template': ApiDefaultPdfTemplateDefaultPdfTemplate;
      'api::design-style.design-style': ApiDesignStyleDesignStyle;
      'api::dimension.dimension': ApiDimensionDimension;
      'api::discount.discount': ApiDiscountDiscount;
      'api::discount-usage-event.discount-usage-event': ApiDiscountUsageEventDiscountUsageEvent;
      'api::document-permission.document-permission': ApiDocumentPermissionDocumentPermission;
      'api::download-record.download-record': ApiDownloadRecordDownloadRecord;
      'api::ecommerce-authentication-service.ecommerce-authentication-service': ApiEcommerceAuthenticationServiceEcommerceAuthenticationService;
      'api::ecommerce-contact-service.ecommerce-contact-service': ApiEcommerceContactServiceEcommerceContactService;
      'api::ecommerce-custom-app-service.ecommerce-custom-app-service': ApiEcommerceCustomAppServiceEcommerceCustomAppService;
      'api::ecommerce-detail.ecommerce-detail': ApiEcommerceDetailEcommerceDetail;
      'api::ecommerce-product-service.ecommerce-product-service': ApiEcommerceProductServiceEcommerceProductService;
      'api::engraving-type.engraving-type': ApiEngravingTypeEngravingType;
      'api::enrolled-contact-condition.enrolled-contact-condition': ApiEnrolledContactConditionEnrolledContactCondition;
      'api::enrolled-lead-condition.enrolled-lead-condition': ApiEnrolledLeadConditionEnrolledLeadCondition;
      'api::estimate.estimate': ApiEstimateEstimate;
      'api::estimate-shipping-contact.estimate-shipping-contact': ApiEstimateShippingContactEstimateShippingContact;
      'api::exceeded-service.exceeded-service': ApiExceededServiceExceededService;
      'api::file-item.file-item': ApiFileItemFileItem;
      'api::form.form': ApiFormForm;
      'api::form-template.form-template': ApiFormTemplateFormTemplate;
      'api::gender-type.gender-type': ApiGenderTypeGenderType;
      'api::gm-commission.gm-commission': ApiGmCommissionGmCommission;
      'api::home.home': ApiHomeHome;
      'api::importing-session.importing-session': ApiImportingSessionImportingSession;
      'api::inventory-adjustment.inventory-adjustment': ApiInventoryAdjustmentInventoryAdjustment;
      'api::inventory-adjustment-item.inventory-adjustment-item': ApiInventoryAdjustmentItemInventoryAdjustmentItem;
      'api::inventory-audit.inventory-audit': ApiInventoryAuditInventoryAudit;
      'api::inventory-audit-item.inventory-audit-item': ApiInventoryAuditItemInventoryAuditItem;
      'api::inventory-quantity-notification.inventory-quantity-notification': ApiInventoryQuantityNotificationInventoryQuantityNotification;
      'api::inventory-serialize.inventory-serialize': ApiInventorySerializeInventorySerialize;
      'api::invoice.invoice': ApiInvoiceInvoice;
      'api::invoice-shipping-contact.invoice-shipping-contact': ApiInvoiceShippingContactInvoiceShippingContact;
      'api::invt-cmp-attr.invt-cmp-attr': ApiInvtCmpAttrInvtCmpAttr;
      'api::invt-cmp-attr-opt.invt-cmp-attr-opt': ApiInvtCmpAttrOptInvtCmpAttrOpt;
      'api::invt-cmp-color.invt-cmp-color': ApiInvtCmpColorInvtCmpColor;
      'api::invt-cmp-size.invt-cmp-size': ApiInvtCmpSizeInvtCmpSize;
      'api::invt-cmp-trck.invt-cmp-trck': ApiInvtCmpTrckInvtCmpTrck;
      'api::invt-cmp-trck-itm.invt-cmp-trck-itm': ApiInvtCmpTrckItmInvtCmpTrckItm;
      'api::invt-itm-record.invt-itm-record': ApiInvtItmRecordInvtItmRecord;
      'api::item-category.item-category': ApiItemCategoryItemCategory;
      'api::jewelry-product.jewelry-product': ApiJewelryProductJewelryProduct;
      'api::jewelry-product-type.jewelry-product-type': ApiJewelryProductTypeJewelryProductType;
      'api::knot-style.knot-style': ApiKnotStyleKnotStyle;
      'api::layout.layout': ApiLayoutLayout;
      'api::lead.lead': ApiLeadLead;
      'api::link-style.link-style': ApiLinkStyleLinkStyle;
      'api::link-type.link-type': ApiLinkTypeLinkType;
      'api::localization-setting.localization-setting': ApiLocalizationSettingLocalizationSetting;
      'api::location.location': ApiLocationLocation;
      'api::mail-template.mail-template': ApiMailTemplateMailTemplate;
      'api::maintenance.maintenance': ApiMaintenanceMaintenance;
      'api::maintenance-event.maintenance-event': ApiMaintenanceEventMaintenanceEvent;
      'api::maintenance-quantity-notification.maintenance-quantity-notification': ApiMaintenanceQuantityNotificationMaintenanceQuantityNotification;
      'api::manufacturing-process.manufacturing-process': ApiManufacturingProcessManufacturingProcess;
      'api::marketing-customers-report.marketing-customers-report': ApiMarketingCustomersReportMarketingCustomersReport;
      'api::marketing-email-template.marketing-email-template': ApiMarketingEmailTemplateMarketingEmailTemplate;
      'api::material-grade.material-grade': ApiMaterialGradeMaterialGrade;
      'api::membership.membership': ApiMembershipMembership;
      'api::membership-item.membership-item': ApiMembershipItemMembershipItem;
      'api::membership-order-item.membership-order-item': ApiMembershipOrderItemMembershipOrderItem;
      'api::meta-connection.meta-connection': ApiMetaConnectionMetaConnection;
      'api::metal-finish-type.metal-finish-type': ApiMetalFinishTypeMetalFinishType;
      'api::metal-type.metal-type': ApiMetalTypeMetalType;
      'api::note.note': ApiNoteNote;
      'api::notification-method.notification-method': ApiNotificationMethodNotificationMethod;
      'api::notifications-nylas-grant-expire.notifications-nylas-grant-expire': ApiNotificationsNylasGrantExpireNotificationsNylasGrantExpire;
      'api::nylas-connection.nylas-connection': ApiNylasConnectionNylasConnection;
      'api::onboarding.onboarding': ApiOnboardingOnboarding;
      'api::onboarding-user.onboarding-user': ApiOnboardingUserOnboardingUser;
      'api::order.order': ApiOrderOrder;
      'api::order-setting.order-setting': ApiOrderSettingOrderSetting;
      'api::order-status-notification.order-status-notification': ApiOrderStatusNotificationOrderStatusNotification;
      'api::pay-rate.pay-rate': ApiPayRatePayRate;
      'api::payment-method.payment-method': ApiPaymentMethodPaymentMethod;
      'api::pdf-catalog-file.pdf-catalog-file': ApiPdfCatalogFilePdfCatalogFile;
      'api::pdf-template.pdf-template': ApiPdfTemplatePdfTemplate;
      'api::piece.piece': ApiPiecePiece;
      'api::platform.platform': ApiPlatformPlatform;
      'api::platting-type.platting-type': ApiPlattingTypePlattingType;
      'api::product.product': ApiProductProduct;
      'api::product-attribute.product-attribute': ApiProductAttributeProductAttribute;
      'api::product-attribute-option.product-attribute-option': ApiProductAttributeOptionProductAttributeOption;
      'api::product-brand.product-brand': ApiProductBrandProductBrand;
      'api::product-group.product-group': ApiProductGroupProductGroup;
      'api::product-group-attribute.product-group-attribute': ApiProductGroupAttributeProductGroupAttribute;
      'api::product-group-attribute-option.product-group-attribute-option': ApiProductGroupAttributeOptionProductGroupAttributeOption;
      'api::product-group-item.product-group-item': ApiProductGroupItemProductGroupItem;
      'api::product-inventory-item.product-inventory-item': ApiProductInventoryItemProductInventoryItem;
      'api::product-inventory-item-event.product-inventory-item-event': ApiProductInventoryItemEventProductInventoryItemEvent;
      'api::product-order-item.product-order-item': ApiProductOrderItemProductOrderItem;
      'api::product-setting.product-setting': ApiProductSettingProductSetting;
      'api::product-type.product-type': ApiProductTypeProductType;
      'api::public-contract.public-contract': ApiPublicContractPublicContract;
      'api::public-form.public-form': ApiPublicFormPublicForm;
      'api::purchase-request.purchase-request': ApiPurchaseRequestPurchaseRequest;
      'api::purchase-request-shipping-info.purchase-request-shipping-info': ApiPurchaseRequestShippingInfoPurchaseRequestShippingInfo;
      'api::quantity-difference-type.quantity-difference-type': ApiQuantityDifferenceTypeQuantityDifferenceType;
      'api::question.question': ApiQuestionQuestion;
      'api::quick-pay-setting.quick-pay-setting': ApiQuickPaySettingQuickPaySetting;
      'api::rate.rate': ApiRateRate;
      'api::rentable-data.rentable-data': ApiRentableDataRentableData;
      'api::reports-schedule.reports-schedule': ApiReportsScheduleReportsSchedule;
      'api::resource.resource': ApiResourceResource;
      'api::resource-count.resource-count': ApiResourceCountResourceCount;
      'api::resource-inventory-item.resource-inventory-item': ApiResourceInventoryItemResourceInventoryItem;
      'api::return.return': ApiReturnReturn;
      'api::return-item.return-item': ApiReturnItemReturnItem;
      'api::return-method.return-method': ApiReturnMethodReturnMethod;
      'api::return-status.return-status': ApiReturnStatusReturnStatus;
      'api::review.review': ApiReviewReview;
      'api::sales-commission.sales-commission': ApiSalesCommissionSalesCommission;
      'api::sales-item-report.sales-item-report': ApiSalesItemReportSalesItemReport;
      'api::scheduling-appointment.scheduling-appointment': ApiSchedulingAppointmentSchedulingAppointment;
      'api::scheduling-recurrence.scheduling-recurrence': ApiSchedulingRecurrenceSchedulingRecurrence;
      'api::sequence-step.sequence-step': ApiSequenceStepSequenceStep;
      'api::sequence-step-info.sequence-step-info': ApiSequenceStepInfoSequenceStepInfo;
      'api::service.service': ApiServiceService;
      'api::service-location-info.service-location-info': ApiServiceLocationInfoServiceLocationInfo;
      'api::service-order-item.service-order-item': ApiServiceOrderItemServiceOrderItem;
      'api::service-performer.service-performer': ApiServicePerformerServicePerformer;
      'api::service-setting.service-setting': ApiServiceSettingServiceSetting;
      'api::sessions.sessions': ApiSessionsSessions;
      'api::setting-notification.setting-notification': ApiSettingNotificationSettingNotification;
      'api::settings-chat.settings-chat': ApiSettingsChatSettingsChat;
      'api::settings-task.settings-task': ApiSettingsTaskSettingsTask;
      'api::shank-style.shank-style': ApiShankStyleShankStyle;
      'api::shipment.shipment': ApiShipmentShipment;
      'api::shipment-card.shipment-card': ApiShipmentCardShipmentCard;
      'api::shipment-carrier.shipment-carrier': ApiShipmentCarrierShipmentCarrier;
      'api::shipment-package.shipment-package': ApiShipmentPackageShipmentPackage;
      'api::shipping-method.shipping-method': ApiShippingMethodShippingMethod;
      'api::size.size': ApiSizeSize;
      'api::specific-type.specific-type': ApiSpecificTypeSpecificType;
      'api::staging-log.staging-log': ApiStagingLogStagingLog;
      'api::strand.strand': ApiStrandStrand;
      'api::strands-length.strands-length': ApiStrandsLengthStrandsLength;
      'api::stripe-onboarding.stripe-onboarding': ApiStripeOnboardingStripeOnboarding;
      'api::stripe-plan-category.stripe-plan-category': ApiStripePlanCategoryStripePlanCategory;
      'api::stripe-subscription-plan.stripe-subscription-plan': ApiStripeSubscriptionPlanStripeSubscriptionPlan;
      'api::sublocation.sublocation': ApiSublocationSublocation;
      'api::sublocation-item.sublocation-item': ApiSublocationItemSublocationItem;
      'api::task.task': ApiTaskTask;
      'api::task-location.task-location': ApiTaskLocationTaskLocation;
      'api::task-stage.task-stage': ApiTaskStageTaskStage;
      'api::task-type.task-type': ApiTaskTypeTaskType;
      'api::tax.tax': ApiTaxTax;
      'api::tax-authority.tax-authority': ApiTaxAuthorityTaxAuthority;
      'api::tax-collection.tax-collection': ApiTaxCollectionTaxCollection;
      'api::tax-report.tax-report': ApiTaxReportTaxReport;
      'api::tenant.tenant': ApiTenantTenant;
      'api::tenant-credit-history.tenant-credit-history': ApiTenantCreditHistoryTenantCreditHistory;
      'api::tenant-stripe-subscription.tenant-stripe-subscription': ApiTenantStripeSubscriptionTenantStripeSubscription;
      'api::time-period.time-period': ApiTimePeriodTimePeriod;
      'api::time-tracker.time-tracker': ApiTimeTrackerTimeTracker;
      'api::timeline-connection.timeline-connection': ApiTimelineConnectionTimelineConnection;
      'api::todo.todo': ApiTodoTodo;
      'api::transaction.transaction': ApiTransactionTransaction;
      'api::transfer-order.transfer-order': ApiTransferOrderTransferOrder;
      'api::transfer-order-item.transfer-order-item': ApiTransferOrderItemTransferOrderItem;
      'api::twilio-connection.twilio-connection': ApiTwilioConnectionTwilioConnection;
      'api::usage.usage': ApiUsageUsage;
      'api::user-notification.user-notification': ApiUserNotificationUserNotification;
      'api::website.website': ApiWebsiteWebsite;
      'api::weight.weight': ApiWeightWeight;
      'api::zapier-webhook.zapier-webhook': ApiZapierWebhookZapierWebhook;
    }
  }
}
