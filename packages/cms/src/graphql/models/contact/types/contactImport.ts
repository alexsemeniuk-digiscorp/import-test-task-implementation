interface CustomField {
  name: string;
  value: string;
  id?: string;
}

type LeadSource =
  | 'website'
  | 'advertisement'
  | 'external referral'
  | 'online store'
  | 'unknown';

type Contact = {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  birthdayDate?: string;
  jobTitle?: string;
  dateAnniversary?: string;
  customCreationDate?: string;
  points?: number;
  leadOwner?: string;
  leadSource?: LeadSource;
  avatar?: string;
  customFields?: CustomField[];
  errors?: string[];
  localId?: string;
  [key: string]: any;
};

export interface ContactFiltersInput {
  fullName?: { containsi?: string };
  leadSource?: { in?: string[] };
  leadOwner?: { id?: { in?: string[] } };
  company?: { id?: { in?: string[] } };
  id?: { eq?: string[] };
  birthdayDate?: { in?: string[] } | { between?: string[] };
  dateAnniversary?: { in?: string[] } | { between?: string[] };
  spouseBirthdayDate?: {
    range?: string[];
    operator?: string;
    value?: number;
    valueStart?: number;
    valueEnd?: number;
  };
  totalSpent?: {
    operator: string;
    value?: number;
    valueStart?: number;
    valueEnd?: number;
  };
  totalItemsPurchased?: {
    operator: string;
    value?: number;
    valueStart?: number;
    valueEnd?: number;
  };
  biggestOrderValue?: {
    operator: string;
    value?: number;
    valueStart?: number;
    valueEnd?: number;
  };
  numberOfOrders?: {
    operator: string;
    value?: number;
    valueStart?: number;
    valueEnd?: number;
  };
  lastPurchaseDate?: {
    range?: string[];
    operator?: string;
    value?: number;
    valueStart?: number;
    valueEnd?: number;
  };
  creationDate?: {
    range?: string[];
    operator?: string;
    value?: number;
    valueStart?: number;
    valueEnd?: number;
  };
  orderCreationDate?: {
    range?: string[];
    operator?: string;
    value?: number;
    valueStart?: number;
    valueEnd?: number;
  };
  orderShipmentDate?: {
    range?: string[];
    operator?: string;
    value?: number;
    valueStart?: number;
    valueEnd?: number;
  };
  amountSpentInPeriod?: {
    range?: string[];
    operator?: string;
    value?: number;
    valueStart?: number;
    valueEnd?: number;
    periodOperator?: string;
    periodValue?: number;
    periodValueStart?: number;
    periodValueEnd?: number;
  };
  bought?: {
    itemType?: 'service' | 'product' | 'compositeProduct';
    productId?: string;
    productTypeId?: string;
    compositeProductId?: string;
    serviceId?: string;
  };
  notBought?: {
    itemType?: 'service' | 'product' | 'compositeProduct';
    productId?: string;
    productTypeId?: string;
    compositeProductId?: string;
    serviceId?: string;
  };
  itemsPurchasedInPeriod?: {
    range?: string[];
    operator?: string;
    value?: number;
    valueStart?: number;
    valueEnd?: number;
    periodOperator?: string;
    periodValue?: number;
    periodValueStart?: number;
    periodValueEnd?: number;
  };
  birthdayNumberDay?: {
    operator: string;
    value?: number;
    valueStart?: number;
    valueEnd?: number;
  };
  marketingOptIn?: { in?: string[] };
}
