import { createContactRelationsFromCSV } from './../contact/resolvers/createContactRelationsFromCSV';
import { address } from './resolvers/address';
import { amountSpentInPeriod } from './resolvers/amountSpentInPeriod';
import { annualRevenue } from './resolvers/annualRevenue';
import { biggestOrderValue } from './resolvers/biggestOrderValue';
import { biggestTransaction } from './resolvers/biggestTransaction';
import { calculatedCustomFields } from './resolvers/calculatedCustomFields';
import { calculatedOwes } from './resolvers/calculatedOwes';
import { calculatedSpent } from './resolvers/calculatedSpent';
import { cancelImportingSession } from './resolvers/cancelImportingSession';
import { createContactsFromCSV } from './resolvers/createContactsFromCSV';
import { createWishlistFromCsv } from './resolvers/createWishlistFromCsv';
import { dashboardCrmCustomersData } from './resolvers/dashboardCrmCustomersData';
import { deleteImportingContact } from './resolvers/deleteImportingContact';
import { email } from './resolvers/email';
import { fastUpdateAllContactsFromCSV } from './resolvers/fastUpdateAllContactsFromCSV';
import { fastUpdateSingleContact } from './resolvers/fastUpdateSingleContact';
import { getCreateDate } from './resolvers/getCreateDate';
import { getSessionImportingContacts } from './resolvers/getSessionImportingContacts';
import { getSessionImportingContactsProcessInfo } from './resolvers/getSessionImportingContactsProcessInfo';
import { getSingleContactStatisticForCrmCards } from './resolvers/getSingleCrmEntityStatisticForCrmCards';
import { handleAdditionalFields } from './resolvers/handleAdditionalFields';
import { handleRelationFields } from './resolvers/handleRelationFields';
import { identityNumber } from './resolvers/identityNumber';
import { itemsPurchasedInPeriod } from './resolvers/itemsPurchasedInPeriod';
import { lastPurchaseDate } from './resolvers/lastPurchaseDate';
import { netAmountOwed } from './resolvers/netAmountOwed';
import { numberOfOrders } from './resolvers/numberOfOrders';
import { numberOfTransactions } from './resolvers/numberOfTransactions';
import { onDeposit } from './resolvers/onDeposit';
import { phoneNumber } from './resolvers/phoneNumber';
import { prevContactSyncWithAccountingService } from './resolvers/prevContactSyncWithAccountingService';
import { revertImportingSession } from './resolvers/revertImportingSession';
import { totalItemsPurchased } from './resolvers/totalItemsPurchased';
import { updateContactsCustomFields } from './resolvers/updateContactsCustomFields';

export const ContactResolvers = {
  email,
  address,
  phoneNumber,
  identityNumber,
  biggestOrderValue,
  lastPurchaseDate,
  numberOfOrders,
  totalItemsPurchased,
  calculatedSpent,
  amountSpentInPeriod,
  itemsPurchasedInPeriod,
  annualRevenue,
  onDeposit,
  numberOfTransactions,
  biggestTransaction,
  calculatedOwes,
  netAmountOwed,
  getCreateDate,
  calculatedCustomFields,
};

export const ContactMutations = {
  updateContactsCustomFields,
  createContactsFromCSV,
  fastUpdateSingleContact,
  fastUpdateAllContactsFromCSV,
  handleAdditionalFields,
  handleRelationFields,
  createContactRelationsFromCSV,
  createWishlistFromCsv,
  deleteImportingContact,
  cancelImportingSession,
  revertImportingSession,
  prevContactSyncWithAccountingService,
};

export const ContactQueries = {
  dashboardCrmCustomersData,
  getSingleContactStatisticForCrmCards,
  getSessionImportingContacts,
  getSessionImportingContactsProcessInfo,
};
