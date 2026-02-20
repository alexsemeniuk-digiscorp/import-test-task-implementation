import type { Attribute, Schema } from '@strapi/strapi';

export interface DataAiPrompt extends Schema.Component {
  collectionName: 'components_data_ai_prompts';
  info: {
    displayName: 'AI Prompt';
    description: '';
  };
  attributes: {
    productName: Attribute.Text &
      Attribute.DefaultTo<'Internal, factual name (e.g., "18K Yellow Gold Solitaire Ring").'>;
    tagProductName: Attribute.Text &
      Attribute.DefaultTo<'Simplified version for tagging/search (e.g., "gold ring solitaire").'>;
    ecommerceName: Attribute.Text &
      Attribute.DefaultTo<'Consumer-facing title, short and SEO-friendly (e.g., "18K Gold Solitaire Engagement Ring").'>;
    shopifyTags: Attribute.Text &
      Attribute.DefaultTo<'String of keyword tags (e.g., "18K", "gold", "ring", "solitaire").'>;
    SKU: Attribute.Text &
      Attribute.DefaultTo<'Short unique product identifier; generate only if none provided (format: 2\u20134 letters + random 4 digits, e.g., "RNG-4832")'>;
    appraisalDescription: Attribute.Text &
      Attribute.DefaultTo<'Write a detailed, professional jewelry appraisal description for the provided product. Include key details such as the type of jewelry (ring, necklace, etc.), materials (gold, silver, platinum), gemstones (diamond, emerald, sapphire), weight, color, and craftsmanship quality.  Maintain a neutral, expert tone suitable for appraisal reports. Avoid marketing or sales language.'>;
    ecommerceDescription: Attribute.Text &
      Attribute.DefaultTo<'Marketing copy for ecommerce; persuasive but accurate. Can include bullet points, care tips, or SEO keywords if requested.'>;
    note: Attribute.Text &
      Attribute.DefaultTo<'Internal free-text notes (conservative, optional observations).'>;
  };
}

export interface DataBoughtCondition extends Schema.Component {
  collectionName: 'components_data_bought_conditions';
  info: {
    displayName: 'Bought Condition';
    description: '';
  };
  attributes: {
    itemType: Attribute.Enumeration<['product', 'compositeProduct', 'service']>;
    product: Attribute.Relation<
      'data.bought-condition',
      'oneToOne',
      'api::product.product'
    >;
    productType: Attribute.Relation<
      'data.bought-condition',
      'oneToOne',
      'api::product-type.product-type'
    >;
    compositeProduct: Attribute.Relation<
      'data.bought-condition',
      'oneToOne',
      'api::composite-product.composite-product'
    >;
    service: Attribute.Relation<
      'data.bought-condition',
      'oneToOne',
      'api::service.service'
    >;
  };
}

export interface DataBulkProductsAiPrompt extends Schema.Component {
  collectionName: 'components_data_bulk_products_ai_prompts';
  info: {
    displayName: 'Bulk Products AI Prompt';
  };
  attributes: {
    productName: Attribute.Text;
    MPN: Attribute.Text;
    quantity: Attribute.Text;
    unit: Attribute.Text;
    weight: Attribute.Text;
    SKU: Attribute.Text;
    brand: Attribute.Text;
    productType: Attribute.Text;
    metalType: Attribute.Text;
    metalGrade: Attribute.Text;
    defaultPrice: Attribute.Text;
    description: Attribute.Text;
    discount: Attribute.Text;
  };
}

export interface DataCellValue extends Schema.Component {
  collectionName: 'components_data_cell_values';
  info: {
    displayName: 'CellValue';
    description: '';
  };
  attributes: {
    cellID: Attribute.String;
    label: Attribute.String;
    storeID: Attribute.String;
    shapeType: Attribute.String;
  };
}

export interface DataConnection extends Schema.Component {
  collectionName: 'components_data_connections';
  info: {
    displayName: 'Connection';
    description: '';
  };
  attributes: {
    accountName: Attribute.String;
    phone: Attribute.String;
    ownerName: Attribute.String;
    email: Attribute.String;
    uid: Attribute.String;
  };
}

export interface DataEntry extends Schema.Component {
  collectionName: 'components_data_entries';
  info: {
    displayName: 'Entry';
    icon: 'clipboard-list';
    description: '';
  };
  attributes: {
    key: Attribute.String;
    value: Attribute.Text & Attribute.Required;
  };
}

export interface DataGeometry extends Schema.Component {
  collectionName: 'components_data_geometries';
  info: {
    displayName: 'Geometry';
  };
  attributes: {
    height: Attribute.Integer;
    width: Attribute.Integer;
    x: Attribute.Integer;
    y: Attribute.Integer;
  };
}

export interface DataGraphItem extends Schema.Component {
  collectionName: 'components_data_graph_items';
  info: {
    displayName: 'GraphItem';
    description: '';
  };
  attributes: {
    geometry: Attribute.Component<'data.geometry'>;
    style: Attribute.Component<'data.style'>;
    cellValue: Attribute.Component<'data.cell-value'>;
  };
}

export interface DataMessage extends Schema.Component {
  collectionName: 'components_data_messages';
  info: {
    displayName: 'Message';
    icon: 'envelop';
  };
  attributes: {
    url: Attribute.String;
    date: Attribute.String;
  };
}

export interface DataPage extends Schema.Component {
  collectionName: 'components_data_pages';
  info: {
    displayName: 'Page';
    description: '';
  };
  attributes: {
    name: Attribute.String;
    token: Attribute.String;
    pageId: Attribute.String;
    parentPageId: Attribute.String;
    type: Attribute.String;
  };
}

export interface DataScheduledMessage extends Schema.Component {
  collectionName: 'components_data_scheduled_messages';
  info: {
    displayName: 'ScheduledMessage';
    icon: 'envelop';
    description: '';
  };
  attributes: {
    body: Attribute.String;
    attachments: Attribute.String;
    scheduleId: Attribute.String;
    closeTime: Attribute.String;
  };
}

export interface DataSet extends Schema.Component {
  collectionName: 'components_data_sets';
  info: {
    displayName: 'Set';
    icon: 'align-justify';
  };
  attributes: {
    value: Attribute.String & Attribute.Required;
  };
}

export interface DataStyle extends Schema.Component {
  collectionName: 'components_data_styles';
  info: {
    displayName: 'Style';
    description: '';
  };
  attributes: {
    fillColor: Attribute.String;
    fontFamily: Attribute.String;
    ignoreDefaultStyle: Attribute.Boolean;
    image: Attribute.Text;
    labelPadding: Attribute.Integer;
    overflow: Attribute.String;
    rotation: Attribute.Integer;
    shape: Attribute.String;
    spacing: Attribute.Integer;
    strokeColor: Attribute.String;
    strokeWidth: Attribute.Integer;
    whiteSpace: Attribute.String;
    fontSize: Attribute.Integer;
  };
}

export interface UiAuthContent extends Schema.Component {
  collectionName: 'components_ui_auth_contents';
  info: {
    displayName: 'authContent';
    description: '';
  };
  attributes: {
    background: Attribute.Media & Attribute.Required;
    headline: Attribute.Component<'ui.headline'> & Attribute.Required;
    advantages: Attribute.Component<'ui.headline', true>;
  };
}

export interface UiCard extends Schema.Component {
  collectionName: 'components_ui_cards';
  info: {
    displayName: 'Card';
    icon: 'address-card';
    description: '';
  };
  attributes: {
    title: Attribute.String;
    subtitle: Attribute.String;
    description: Attribute.Text;
    media: Attribute.Media;
  };
}

export interface UiCustomerReviewSection extends Schema.Component {
  collectionName: 'components_ui_customer_review_sections';
  info: {
    displayName: 'CustomerReviewSection';
    description: '';
  };
  attributes: {
    visible: Attribute.Boolean & Attribute.DefaultTo<true>;
    title: Attribute.String;
    description: Attribute.String;
    reviews: Attribute.Component<'ui.review-card', true>;
  };
}

export interface UiExtendedSection extends Schema.Component {
  collectionName: 'components_ui_extended_sections';
  info: {
    displayName: 'ExtendedSection';
    icon: 'apps';
    description: '';
  };
  attributes: {
    heading: Attribute.Component<'ui.headline'>;
    button: Attribute.Component<'ui.link', true>;
    media: Attribute.Media;
    visible: Attribute.Boolean & Attribute.DefaultTo<false>;
    image: Attribute.Component<'ui.card', true>;
  };
}

export interface UiGrid extends Schema.Component {
  collectionName: 'components_ui_grids';
  info: {
    displayName: 'Grid';
    icon: 'table';
    description: '';
  };
  attributes: {
    visible: Attribute.Boolean & Attribute.Required & Attribute.DefaultTo<true>;
    children: Attribute.Component<'data.entry', true> &
      Attribute.Required &
      Attribute.SetMinMax<{
        min: 1;
      }>;
  };
}

export interface UiHeadline extends Schema.Component {
  collectionName: 'components_ui_headlines';
  info: {
    displayName: 'Headline';
    icon: 'heading';
    description: '';
  };
  attributes: {
    title: Attribute.Text;
    subtitle: Attribute.Text;
  };
}

export interface UiLink extends Schema.Component {
  collectionName: 'components_ui_links';
  info: {
    displayName: 'Link';
    icon: 'link';
    description: '';
  };
  attributes: {
    url: Attribute.String;
    title: Attribute.String;
    target: Attribute.Enumeration<['blank', 'self', 'parent', 'top']> &
      Attribute.Required &
      Attribute.DefaultTo<'self'>;
    icon: Attribute.String & Attribute.CustomField<'plugin::react-icons.icon'>;
  };
}

export interface UiParagraph extends Schema.Component {
  collectionName: 'components_ui_paragraphs';
  info: {
    displayName: 'Paragraph';
    icon: 'envelope-open-text';
    description: '';
  };
  attributes: {
    value: Attribute.RichText & Attribute.Required;
    title: Attribute.String;
  };
}

export interface UiProductTypesVisibility extends Schema.Component {
  collectionName: 'components_ui_product_types_visibilities';
  info: {
    displayName: 'ProductTypesVisibility';
    description: '';
  };
  attributes: {
    Product: Attribute.Boolean;
    CompositeProduct: Attribute.Boolean;
    Membership: Attribute.Boolean;
    Class: Attribute.Boolean;
    Service: Attribute.Boolean;
  };
}

export interface UiReviewCard extends Schema.Component {
  collectionName: 'components_ui_review_cards';
  info: {
    displayName: 'ReviewCard';
  };
  attributes: {
    name: Attribute.String;
    rating: Attribute.Integer &
      Attribute.SetMinMax<{
        max: 5;
      }>;
    text: Attribute.Text;
  };
}

export interface UiSection extends Schema.Component {
  collectionName: 'components_ui_sections';
  info: {
    displayName: 'Section';
    icon: 'pager';
    description: '';
  };
  attributes: {
    visible: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<false>;
    heading: Attribute.Component<'ui.card'>;
    button: Attribute.Component<'ui.link'>;
  };
}

export interface UiSectionsVisibility extends Schema.Component {
  collectionName: 'components_ui_sections_visibilities';
  info: {
    displayName: 'SectionsVisibility';
    icon: 'apps';
    description: '';
  };
  attributes: {
    pageTitle: Attribute.String;
    isFooterVisible: Attribute.Boolean & Attribute.DefaultTo<true>;
    isFollowUsVisible: Attribute.Boolean & Attribute.DefaultTo<false>;
    isSubscribeNewsLetterVisible: Attribute.Boolean &
      Attribute.DefaultTo<false>;
    isCustomerReviewVisible: Attribute.Boolean & Attribute.DefaultTo<false>;
    isBlogVisible: Attribute.Boolean & Attribute.DefaultTo<false>;
  };
}

export interface UiShipmentCost extends Schema.Component {
  collectionName: 'components_ui_shipment_costs';
  info: {
    displayName: 'shipmentCost';
    description: '';
  };
  attributes: {
    isFree: Attribute.Boolean & Attribute.DefaultTo<false>;
    shipmentPrice: Attribute.Decimal & Attribute.DefaultTo<40>;
    isFreeAfterAmount: Attribute.Boolean & Attribute.DefaultTo<true>;
    freeShipmentAfter: Attribute.Decimal & Attribute.DefaultTo<1000>;
  };
}

export interface UiTab extends Schema.Component {
  collectionName: 'components_ui_tabs';
  info: {
    displayName: 'Tab';
    icon: 'clone';
    description: '';
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    pane: Attribute.Component<'ui.card'> & Attribute.Required;
  };
}

export interface UiText extends Schema.Component {
  collectionName: 'components_ui_texts';
  info: {
    displayName: 'Text';
    icon: 'indent';
    description: '';
  };
  attributes: {
    visible: Attribute.Boolean & Attribute.Required & Attribute.DefaultTo<true>;
    children: Attribute.Component<'ui.paragraph', true> &
      Attribute.Required &
      Attribute.SetMinMax<{
        min: 1;
      }>;
  };
}

export interface UiWebsiteContacts extends Schema.Component {
  collectionName: 'components_ui_website_contacts';
  info: {
    displayName: 'websiteContacts';
  };
  attributes: {
    email: Attribute.String & Attribute.Required;
    phoneNumber: Attribute.String & Attribute.Required;
    address: Attribute.Text & Attribute.Required;
  };
}

export interface UiWorkingHours extends Schema.Component {
  collectionName: 'components_ui_working_hours';
  info: {
    displayName: 'workingHours';
    description: '';
  };
  attributes: {
    monday: Attribute.String;
    tuesday: Attribute.String;
    wednesday: Attribute.String;
    thursday: Attribute.String;
    friday: Attribute.String;
    saturday: Attribute.String;
    sunday: Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Shared {
    export interface Components {
      'data.ai-prompt': DataAiPrompt;
      'data.bought-condition': DataBoughtCondition;
      'data.bulk-products-ai-prompt': DataBulkProductsAiPrompt;
      'data.cell-value': DataCellValue;
      'data.connection': DataConnection;
      'data.entry': DataEntry;
      'data.geometry': DataGeometry;
      'data.graph-item': DataGraphItem;
      'data.message': DataMessage;
      'data.page': DataPage;
      'data.scheduled-message': DataScheduledMessage;
      'data.set': DataSet;
      'data.style': DataStyle;
      'ui.auth-content': UiAuthContent;
      'ui.card': UiCard;
      'ui.customer-review-section': UiCustomerReviewSection;
      'ui.extended-section': UiExtendedSection;
      'ui.grid': UiGrid;
      'ui.headline': UiHeadline;
      'ui.link': UiLink;
      'ui.paragraph': UiParagraph;
      'ui.product-types-visibility': UiProductTypesVisibility;
      'ui.review-card': UiReviewCard;
      'ui.section': UiSection;
      'ui.sections-visibility': UiSectionsVisibility;
      'ui.shipment-cost': UiShipmentCost;
      'ui.tab': UiTab;
      'ui.text': UiText;
      'ui.website-contacts': UiWebsiteContacts;
      'ui.working-hours': UiWorkingHours;
    }
  }
}
