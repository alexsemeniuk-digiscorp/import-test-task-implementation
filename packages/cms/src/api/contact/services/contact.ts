/**
 * contact service
 */
import { factories } from '@strapi/strapi';
import { ID } from '@strapi/strapi/lib/services/entity-service/types/params/attributes';
import { magentoApi } from '../../helpers/magentoApi';
import { shopifyApi } from '../../helpers/shopifyApi';
import { woocommerceApi } from '../../helpers/woocommerceApi';
import { AnyObject } from './../../../../src/api/discount/types';
import { CrmEntityName } from './../../../api/lifecyclesHelpers/types';
import {
  calculateSumOfDifferences,
  calculateTotalPaid,
  calculateTotalPaidNumber,
  getTotalPaid,
  orderRevenueRentTypeArray,
} from './../../../graphql/models/dealTransaction/helpers/helpers';
import {
  entitybatchArrayForWoocommerce,
  extractAddressDetails,
} from './helpers';

export default factories.createCoreService(
  'api::contact.contact',
  ({ strapi }) => ({
    async getSingleCrmEntityStatisticForCrmCards(
      entityType: Omit<CrmEntityName, 'lead'> = 'contact',
      id: string,
      tenantId: string,
      tenantSlug: string,
    ) {
      const currentDate = new Date();
      const invoicesCard = await this.getInvoicesStatistics(
        currentDate,
        tenantSlug,
        entityType,
        id,
        tenantId,
      );
      const formsCard = await this.getFormStatistics(id, tenantSlug);
      const contractsCard = await this.getContractsStatistics(id, tenantSlug);
      const appraisalCard = await this.getAppraisalStatistics(id, tenantSlug);
      const purchaseOrdersCard = await this.getPurchaseOrdersStatistics(
        id,
        tenantSlug,
      );
      const tasksCard = await this.getTasksStatistics(
        id,
        tenantSlug,
        currentDate,
      );
      const ordersCard = await this.getOrdersStatistics(id, tenantSlug);

      return {
        ...invoicesCard,
        ...formsCard,
        ...contractsCard,
        ...appraisalCard,
        ...purchaseOrdersCard,
        ...tasksCard,
        ...ordersCard,
      };
    },
    async getOrdersStatistics(customerId: string, tenantSlug: string) {
      try {
        const salesOrdersAmount = await strapi.entityService.count(
          'api::order.order',
          {
            filters: {
              contact: { id: { $eq: customerId } },
              type: { $eq: 'sell' },
            },
          },
        );
        const layawayOrdersAmount = await strapi.entityService.count(
          'api::order.order',
          {
            filters: {
              contact: { id: { $eq: customerId } },
              type: { $eq: 'layaway' },
            },
          },
        );
        const rentOrdersAmount = await strapi.entityService.count(
          'api::order.order',
          {
            filters: {
              contact: { id: { $eq: customerId } },
              type: { $eq: 'rent' },
            },
          },
        );
        const tradeInOrdersAmount = await strapi.entityService.count(
          'api::order.order',
          {
            filters: {
              contact: { id: { $eq: customerId } },
              type: { $eq: 'tradeIn' },
            },
          },
        );
        const purchaseOrdersAmount = await strapi.entityService.count(
          'api::order.order',
          {
            filters: {
              contact: { id: { $eq: customerId } },
              type: { $eq: 'purchase' },
            },
          },
        );

        return {
          orders: [
            {
              id: '17',
              value: salesOrdersAmount ?? 0,
              stage: 'sales',
              badgeType: 'default',
              valueFormat: 'default',
              link: `/${tenantSlug}/selling/purchase-management`,
            },
            {
              id: '18',
              value: layawayOrdersAmount ?? 0,
              stage: 'layaway',
              badgeType: 'default',
              valueFormat: 'default',
              link: `/${tenantSlug}/selling/layaway`,
            },
            {
              id: '19',
              value: rentOrdersAmount ?? 0,
              stage: 'rent',
              badgeType: 'default',
              valueFormat: 'default',
              link: `/${tenantSlug}/selling/rental`,
            },
            {
              id: '20',
              value: tradeInOrdersAmount ?? 0,
              stage: 'trade in',
              badgeType: 'default',
              valueFormat: 'default',
              link: `/${tenantSlug}/selling/trade-in`,
            },
            {
              id: '21',
              value: purchaseOrdersAmount ?? 0,
              stage: 'purchase',
              badgeType: 'default',
              valueFormat: 'default',
              link: `/${tenantSlug}/selling/purchase-management`,
            },
          ],
        };
      } catch (e) {
        console.log('Error in contacts service getOrdersStatistics func \n', e);
        throw Error('Error in contacts service getOrdersStatistics func');
      }
    },
    async getTasksStatistics(customerId, tenantSlug, currentDate) {
      try {
        const totalTasks = await strapi.entityService.count('api::task.task', {
          filters: { contact: { id: { $eq: customerId } } },
        });
        const dueTasks = await strapi.entityService.count('api::task.task', {
          filters: {
            contact: { id: { $eq: customerId } },
            dueDate: { $lt: currentDate.getTime() },
          },
        });
        const completedTasks = await strapi.entityService.count(
          'api::task.task',
          {
            filters: {
              contact: { id: { $eq: customerId } },
              status: 'completed',
            },
          },
        );
        return {
          tasks: [
            {
              id: '14',
              value: totalTasks ?? 0,
              stage: 'total',
              badgeType: 'processing',
              valueFormat: 'default',
              link: `/${tenantSlug}/tasks?contact_id:eq=${customerId}`,
            },
            {
              id: '15',
              value: completedTasks ?? 0,
              stage: 'completed',
              badgeType: 'success',
              valueFormat: 'default',
              link: `/${tenantSlug}/tasks?contact_id:eq=${customerId}&completed:eq=true`,
            },
            {
              id: '16',
              value: dueTasks ?? 0,
              stage: 'due',
              badgeType: 'error',
              valueFormat: 'default',
              link: `/${tenantSlug}/tasks?contact_id:eq=${customerId}&completed:eq=false&dueDate:lte=d(${+currentDate})`,
            },
          ],
        };
      } catch (e) {
        console.log('Error in contacts service getTasksStatistics func \n', e);
        throw Error('Error in contacts service getTasksStatistics func');
      }
    },
    async getPurchaseOrdersStatistics(customerId, tenantSlug) {
      try {
        const startedOrderPurchasesCount = await strapi.entityService.count(
          'api::order.order',
          {
            filters: {
              contact: { id: { $eq: customerId } },
              type: { $eq: 'purchase' },
              status: { $eq: 'started' },
            },
          },
        );

        const pendingOrderPurchasesCount = await strapi.entityService.count(
          'api::order.order',
          {
            filters: {
              contact: { id: { $eq: customerId } },
              type: { $eq: 'purchase' },
              status: { $eq: 'pending' },
            },
          },
        );

        const placedOrderPurchasesCount = await strapi.entityService.count(
          'api::order.order',
          {
            filters: {
              contact: { id: { $eq: customerId } },
              type: { $eq: 'purchase' },
              status: { $eq: 'placed' },
            },
          },
        );

        const receivedOrderPurchasesCount = await strapi.entityService.count(
          'api::order.order',
          {
            filters: {
              contact: { id: { $eq: customerId } },
              type: { $eq: 'purchase' },
              status: { $eq: 'received' },
            },
          },
        );

        return {
          purchaseRequests: [
            {
              id: '10',
              value: startedOrderPurchasesCount ?? 0,
              stage: 'started',
              badgeType: 'default',
              valueFormat: 'default',
              link: `/${tenantSlug}/selling/purchase-management`,
            },
            {
              id: '11',
              value: pendingOrderPurchasesCount ?? 0,
              stage: 'pending',
              badgeType: 'warning',
              valueFormat: 'default',
              link: `/${tenantSlug}/selling/purchase-management`,
            },
            {
              id: '12',
              value: placedOrderPurchasesCount ?? 0,
              stage: 'placed',
              badgeType: 'processing',
              valueFormat: 'default',
              link: `/${tenantSlug}/selling/purchase-management`,
            },
            {
              id: '13',
              value: receivedOrderPurchasesCount ?? 0,
              stage: 'received',
              badgeType: 'success',
              valueFormat: 'default',
              link: `/${tenantSlug}/selling/purchase-management`,
            },
          ],
        };
      } catch (e) {
        console.log(
          'Error in contacts service getPurchaseOrdersStatistics func \n',
          e,
        );
        throw Error(
          'Error in contacts service getPurchaseOrdersStatistics func',
        );
      }
    },
    async getAppraisalStatistics(customerId, tenantSlug) {
      try {
        const appraisalsAmountCompleted = await strapi.entityService.count(
          'api::appraisal.appraisal',
          { filters: { contact: { id: { $eq: customerId } } } },
        );
        return {
          appraisals: [
            {
              id: '8',
              value: appraisalsAmountCompleted ?? 0,
              stage: 'completed',
              badgeType: 'success',
              valueFormat: 'default',
              link: `/${tenantSlug}/contracts/appraisal?contact_id:eq=${customerId}`,
            },
          ],
        };
      } catch (e) {
        console.log(
          'Error in contacts service getAppraisalStatistics func \n',
          e,
        );
        throw Error('Error in contacts service getAppraisalStatistics func');
      }
    },
    async getContractsStatistics(customerId, tenantSlug) {
      try {
        const contractsAmountPending = await strapi.entityService.count(
          'api::contract.contract',
          {
            filters: {
              contact: {
                id: { $eq: customerId },
              },
              publicContract: { status: { $eq: 'pending' } },
            },
            populate: ['publicContract', 'contact'],
          },
        );

        const contractsAmountCompleted = await strapi.entityService.count(
          'api::contract.contract',
          {
            filters: {
              contact: {
                id: { $eq: customerId },
              },
              publicContract: { status: { $eq: 'signed' } },
            },
            populate: ['publicContract', 'contact'],
          },
        );
        const contractsAmountDeclined = await strapi.entityService.count(
          'api::contract.contract',
          {
            filters: {
              contact: {
                id: { $eq: customerId },
              },
              publicContract: { status: { $eq: 'declined' } },
            },
            populate: ['publicContract', 'contact'],
          },
        );

        return {
          contracts: [
            {
              id: '6',
              value: contractsAmountPending ?? 0,
              stage: 'pending',
              badgeType: 'warning',
              valueFormat: 'default',
              link: `/${tenantSlug}/contracts/contracts?contact_id:eq=${customerId}&publicContract_status:eq=pending`,
            },
            {
              id: '7',
              value: contractsAmountCompleted ?? 0,
              stage: 'accepted',
              badgeType: 'success',
              valueFormat: 'default',
              link: `/${tenantSlug}/contracts/contracts?contact_id:eq=${customerId}&publicContract_status:eq=completed`,
            },
            {
              id: '25',
              value: contractsAmountDeclined ?? 0,
              stage: 'declined',
              badgeType: 'error',
              valueFormat: 'default',
              link: `/${tenantSlug}/contracts/contracts?contact_id:eq=${customerId}&publicContract_status:eq=declined`,
            },
          ],
        };
      } catch (e) {
        console.log(
          'Error in contacts service getContractsStatistics func \n',
          e,
        );
        throw Error('Error in contacts service getContractsStatistics func');
      }
    },
    async getFormStatistics(customerId, tenantSlug) {
      try {
        const formsAmountAccepted = await strapi.entityService.count(
          'api::form.form',
          {
            filters: {
              contact: { id: { $eq: customerId } },
              publicForm: { submitted: { $eq: true } },
            },
            populate: ['publicForm', 'contact'],
          },
        );

        const formsAmountPending = await strapi.entityService.count(
          'api::form.form',
          {
            filters: {
              contact: { id: { $eq: customerId } },
              publicForm: { submitted: { $eq: false } },
            },
            populate: ['publicForm', 'contact'],
          },
        );

        return {
          forms: [
            {
              id: '4',
              value: formsAmountAccepted ?? 0,
              stage: 'accepted',
              badgeType: 'success',
              valueFormat: 'default',
              link: `/${tenantSlug}/contracts/forms?contact_id:eq=${customerId}&publicForm_submitted:eq=true`,
            },
            {
              id: '5',
              value: formsAmountPending ?? 0,
              stage: 'pending',
              badgeType: 'warning',
              valueFormat: 'default',
              link: `/${tenantSlug}/contracts/forms?contact_id:eq=${customerId}&publicForm_submitted:eq=false`,
            },
          ],
        };
      } catch (e) {
        console.log('Error in contacts service getFormStatistics func \n', e);
        throw Error('Error in contacts service getFormStatistics func');
      }
    },
    async getInvoicesStatistics(
      currentDate: Date,
      tenantSlug: string,
      entityType: Omit<CrmEntityName, 'lead'> = 'contact',
      customerId: string,
      tenantId,
    ) {
      try {
        const paidReceivables = await this.fetchTransactionsForCrmStatistic(
          entityType,
          customerId,
          tenantId,
          'income',
          ['Paid', 'Open'],
        );
        const totalReceivables = getTotalPaid(paidReceivables);

        const overdueReceivables = await this.fetchTransactionsForCrmStatistic(
          entityType,
          customerId,
          tenantId,
          'income',
          ['Open'],
          {
            $lt: currentDate?.getTime(),
          },
        );
        const totalOverdueReceivablesSum =
          calculateSumOfDifferences(overdueReceivables);

        const upcomingReceivables = await this.fetchTransactionsForCrmStatistic(
          entityType,
          customerId,
          tenantId,
          'income',
          ['Open'],
          {
            $gt: currentDate?.getTime(),
          },
        );
        const totalUpcomingReceivablesSum =
          calculateSumOfDifferences(upcomingReceivables);

        return {
          invoices: [
            {
              id: '1',
              value: totalReceivables ?? 0,
              stage: 'paid',
              badgeType: 'success',
              valueFormat: 'money',
              link: `/${tenantSlug}/accounting/transactions?contact_id:eq=${customerId}&chartAccount_name:eq=Revenue`,
            },
            {
              id: '2',
              value: totalUpcomingReceivablesSum ?? 0,
              stage: 'outstanding',
              badgeType: 'warning',
              valueFormat: 'money',
              link: `/${tenantSlug}/accounting/transactions?contact_id:eq=${customerId}&chartAccount_name:eq=Revenue&dueDate:gte=d(${+new Date()})&status:eq=Open`,
            },
            {
              id: '3',
              value: totalOverdueReceivablesSum ?? 0,
              stage: 'overdue',
              badgeType: 'error',
              valueFormat: 'money',
              link: `/${tenantSlug}/accounting/transactions?contact_id:eq=${customerId}&chartAccount_name:eq=Revenue&dueDate:lte=d(${+new Date()})&status:eq=Open`,
            },
          ],
        };
      } catch (e) {
        console.log(
          'Error in contacts service getInvoicesStatistics func \n',
          e,
        );
        throw Error('Error in contacts service getInvoicesStatistics func');
      }
    },
    async fetchTransactionsForCrmStatistic(
      entityType: Omit<CrmEntityName, 'lead'> = 'contact',
      customerId: string,
      tenantId: string,
      chartType: string,
      statusArr: string[],
      dueDateFilter?: AnyObject,
      orderFilter?: AnyObject,
    ) {
      try {
        const filters = {
          tenant: { id: { $eq: tenantId } },
          chartAccount: { type: chartType },
          ...(orderFilter || {}),
          dueDate: dueDateFilter ?? {},
          status: {
            $in: statusArr,
            $ne: 'Cancelled',
          },
        };

        filters[entityType as string] = { id: { $eq: customerId } };

        return strapi.entityService.findMany(
          'api::deal-transaction.deal-transaction',
          { filters, populate: ['order'] },
        );
      } catch (e) {
        console.log(
          'Error in contacts service fetchTransactionsForCrmStatistic func \n',
          e,
        );
        throw Error(
          'Error in contacts service fetchTransactionsForCrmStatistic func',
        );
      }
    },
    async dashboardCrmCustomersData(tenantId?: string) {
      const fetchTopEntities = async (
        entityType: string,
        sortField: string,
        calculatedField: string,
      ) => {
        const entities = await strapi.entityService.findMany(entityType, {
          filters: {
            tenant: {
              id: {
                $eq: tenantId,
              },
            },
            [calculatedField]: {
              $ne: null,
            },
          },
          sort: [sortField],
          populate: ['avatar'],
          limit: 4,
        });

        return entities?.map((entity) => ({
          ...entity,
          entityType: entityType?.split('.')[1],
        }));
      };

      const tenantTopSpentContacts = await fetchTopEntities(
        'api::contact.contact',
        'amountSpent:desc',
        'amountSpent',
      );
      const tenantTopSpentCompanies = await fetchTopEntities(
        'api::company.company',
        'amountSpent:desc',
        'amountSpent',
      );

      const tenantTopOweContacts = await fetchTopEntities(
        'api::contact.contact',
        'amountOwes:desc',
        'amountOwes',
      );
      const tenantTopOweCompanies = await fetchTopEntities(
        'api::company.company',
        'amountOwes:desc',
        'amountOwes',
      );

      const topFourOwes = [...tenantTopOweContacts, ...tenantTopOweCompanies]
        .sort((a, b) => b?.amountOwes - a?.amountOwes)
        .slice(0, 4);
      const topFourSpent = [
        ...tenantTopSpentContacts,
        ...tenantTopSpentCompanies,
      ]
        .sort((a, b) => b?.amountSpent - a?.amountSpent)
        .slice(0, 4);

      return JSON.stringify({
        topFourOwes,
        topFourSpent,
      });
    },
    async getAmountOwes(
      customerId: ID,
      crmType: Omit<CrmEntityName, 'lead'> = 'contact',
      tenantId?: string,
    ) {
      const dealTransactions = await strapi.entityService.findMany(
        'api::deal-transaction.deal-transaction',
        {
          filters: {
            status: { $eq: 'Open' },
            chartAccount: { type: { $eq: 'income' } },
            [crmType as string]: { id: { $eq: customerId } },
            ...(tenantId
              ? {
                  tenant: {
                    id: { $eq: tenantId },
                  },
                }
              : {}),
          },
          populate: [crmType],
        },
      );
      return calculateSumOfDifferences(dealTransactions);
    },
    async onDeposit(
      customerId: ID,
      crmType: Omit<CrmEntityName, 'lead'> = 'contact',
      tenantId?: string,
    ) {
      const dealTransactions = await strapi.entityService.findMany(
        'api::deal-transaction.deal-transaction',
        {
          filters: {
            status: { $in: ['Paid', 'Refunded'] },
            chartAccount: { type: { $eq: 'income' } },
            [crmType as string]: { id: { $eq: customerId } },
            sellingOrder: {
              type: { $in: orderRevenueRentTypeArray },
              status: { $ne: 'shipped' },
            },
            ...(tenantId
              ? {
                  tenant: {
                    id: { $eq: tenantId },
                  },
                }
              : {}),
          },
          fields: ['id', 'status', 'paid'],
        },
      );

      return calculateTotalPaidNumber(dealTransactions);
    },
    async getNetAmountOwed(
      customerId: ID,
      crmType: Omit<CrmEntityName, 'lead'> = 'contact',
      tenantId?: string,
    ) {
      const amountOwed =
        (await this.getAmountOwes(customerId, crmType, tenantId)) || 0;

      const contact = await strapi.entityService.findOne(
        'api::contact.contact',
        customerId,
        {
          fields: ['id', 'points'],
        },
      );

      const points = contact?.points || 0;

      return Math.max(amountOwed - points, 0);
    },
    async getContactTotalSpent(
      contactId: ID,
      dates?: Date[],
      crmType: Omit<CrmEntityName, 'lead'> = 'contact',
      tenantId?: string,
    ) {
      const filters =
        dates && dates?.length > 0
          ? { customCreationDate: { $between: dates } }
          : {};
      const dealTransactions = await strapi.entityService.findMany(
        'api::deal-transaction.deal-transaction',
        {
          filters: {
            ...filters,
            status: { $not: 'Cancelled' },
            chartAccount: { type: { $eq: 'income' } },
            [crmType as string]: { id: { $eq: contactId } },
            ...(tenantId
              ? {
                  tenant: {
                    id: { $eq: tenantId },
                  },
                }
              : {}),
          },
          populate: { [crmType as string]: true },
        },
      );

      return calculateTotalPaid(dealTransactions);
    },
    async getTotalItemsPurchased(contactId: ID, dates?: Date[]) {
      const creationDateFilter =
        dates && dates?.length > 0
          ? { customCreationDate: { $between: dates } }
          : {};
      const contact = await strapi.entityService.findOne(
        'api::contact.contact',
        contactId,
        {
          populate: {
            orders: {
              filters: {
                status: {
                  $ne: 'draft',
                },
                type: { $in: orderRevenueRentTypeArray },
                ...creationDateFilter,
              },
              fields: ['id'],
              populate: {
                products: {
                  fields: ['quantity'],
                },
                compositeProducts: {
                  fields: ['quantity'],
                },
                classes: {
                  fields: ['quantity'],
                },
                services: {
                  fields: ['quantity'],
                },
                memberships: {
                  fields: ['quantity'],
                },
              },
            },
          },
        },
      );

      const totalItemsPurchased = contact?.orders?.reduce((total, order) => {
        total +=
          order.products?.reduce((acc, product) => acc + product.quantity, 0) ||
          0;
        total +=
          order.classes?.reduce((acc, item) => acc + item.quantity, 0) || 0;
        total +=
          order.services?.reduce((acc, service) => acc + service.quantity, 0) ||
          0;
        total +=
          order.memberships?.reduce(
            (acc, membership) => acc + membership.quantity,
            0,
          ) || 0;
        total +=
          order.compositeProducts?.reduce(
            (acc, product) => acc + product.quantity,
            0,
          ) || 0;

        return total;
      }, 0);

      return totalItemsPurchased;
    },
    async getBiggestOrderValue(contactId: ID) {
      const contact = await strapi.entityService.findOne(
        'api::contact.contact',
        contactId,
        {
          populate: ['orders'],
        },
      );

      const ordersSummaries = contact.orders.map((order) => order.total);

      return ordersSummaries.length > 0 ? Math.max(...ordersSummaries) : 0;
    },
    async getLastPurchaseDate(contactId: ID) {
      const contact = await strapi.entityService.findOne(
        'api::contact.contact',
        contactId,
        {
          fields: ['id'],
          populate: {
            orders: {
              filters: {
                status: {
                  $ne: 'draft',
                },
                type: { $in: orderRevenueRentTypeArray },
              },
              fields: ['customCreationDate'],
              sort: ['customCreationDate:desc'],
              limit: 1,
            },
          },
        },
      );

      return contact?.orders?.[0]?.customCreationDate;
    },
    async getNumberOfOrders(contactId: ID) {
      const contact = await strapi.entityService.findOne(
        'api::contact.contact',
        contactId,
        {
          fields: ['id'],
          populate: {
            orders: {
              filters: {
                status: {
                  $ne: 'draft',
                },
                type: { $in: orderRevenueRentTypeArray },
              },
              fields: ['id'],
            },
          },
        },
      );

      return contact.orders.length ?? 0;
    },
    async getNumberOfTransactions(contactId: ID) {
      const contact = await strapi.entityService.findOne(
        'api::contact.contact',
        contactId,
        {
          fields: ['id'],
          populate: {
            dealTransactions: {
              fields: ['id'],
              filters: {
                paid: {
                  $gt: 0,
                },
                sellingOrder: {
                  status: {
                    $ne: 'draft',
                  },
                  type: { $in: orderRevenueRentTypeArray },
                },
              },
            },
          },
        },
      );

      return contact.dealTransactions.length ?? 0;
    },
    async calculateCustomField(contactId: ID, tenantId: ID) {
      const fieldNames = await strapi.entityService.findMany(
        'api::crm-custom-field-name.crm-custom-field-name',
        {
          filters: {
            tenant: tenantId,
            crmType: 'contact',
          },
          populate: ['tenant'],
        },
      );

      const fieldValues = await strapi.entityService.findMany(
        'api::crm-custom-field-value.crm-custom-field-value',
        {
          filters: {
            customFieldName: {
              id: {
                $in: fieldNames?.map((fieldName) => fieldName.id),
              },
            },
            contact: contactId,
          },
          populate: ['customFieldName'],
        },
      );

      const mappedFields = fieldNames?.map((field) => {
        const matchingFieldValue = fieldValues?.find(
          (el) => el.customFieldName.id === field.id,
        );

        return {
          nameId: field.id,
          name: field.name,
          value: matchingFieldValue?.value ?? null,
          valueId: matchingFieldValue?.id ?? null,
        };
      });

      return JSON.stringify(mappedFields);
    },
    async getBiggestTransaction(contactId: ID) {
      const contact = await strapi.entityService.findOne(
        'api::contact.contact',
        contactId,
        {
          fields: ['id'],
          populate: {
            dealTransactions: {
              filters: {
                chartAccount: {
                  name: {
                    $eq: 'Revenue',
                  },
                },
                status: {
                  $eq: 'Paid',
                },
              },
              fields: ['paid'],
              sort: ['paid:desc'],
              limit: 1,
            },
          },
        },
      );

      return contact?.dealTransactions?.[0]?.paid ?? 0;
    },
    async syncContactWithShopify(
      contactId: number,
      storeUrl: string,
      accessToken: string,
      operationName: string,
    ) {
      const contact = await strapi.db.query('api::contact.contact').findOne({
        where: { id: contactId },
        populate: ['tenant'],
      });

      if (!accessToken || !storeUrl) {
        return null;
      }

      const api = shopifyApi(storeUrl, accessToken);
      if (!contact?.address) {
        return;
      }
      const address = extractAddressDetails(contact?.address);

      const customerData = {
        customer: {
          first_name: contact?.fullName ?? '',
          email: contact?.email,
          phone: contact?.phoneNumber ?? '',
          addresses: [
            {
              address1: address?.trimmed_address?.replace(
                /[^a-zA-Z0-9\s,.-]/g,
                '',
              ),
              province_code: address?.state_abbreviation,
              country: 'United States',
            },
          ],
        },
      };

      if (operationName === 'create') {
        try {
          // First search by email; if found, only create local record
          const searchResponse = await api.get(
            `/admin/api/${process.env.SHOPIFY_API_VERSION}/customers/search.json`,
            {
              params: {
                query: `email:${contact?.email}`,
              },
            },
          );

          if (searchResponse?.data?.customers?.length > 0) {
            const existingCustomer = searchResponse.data.customers[0];
            await strapi.entityService.create(
              'api::ecommerce-contact-service.ecommerce-contact-service',
              {
                data: {
                  ecommerceContactId: existingCustomer.id.toString(),
                  ecommerceType: 'shopify',
                  isSynced: true,
                  syncDate: new Date(),
                  contact: contact,
                  tenant: contact?.tenant?.id,
                },
              },
            );
            return;
          }

          // Not found, create on Shopify then record locally
          const response = await api.post(
            `/admin/api/${process.env.SHOPIFY_API_VERSION}/customers.json`,
            customerData,
          );
          if (response) {
            await strapi.entityService.create(
              'api::ecommerce-contact-service.ecommerce-contact-service',
              {
                data: {
                  ecommerceContactId: response?.data?.customer?.id.toString(),
                  ecommerceType: 'shopify',
                  isSynced: true,
                  syncDate: new Date(),
                  contact: contact,
                  tenant: contact?.tenant?.id,
                },
              },
            );
          }
        } catch (error) {
          const message =
            error?.response?.data?.errors ?? error?.message ?? error;
          console.log(message, 'Shopify contact sync error');
          return new Error(message);
        }
      } else if (operationName === 'update') {
        const ecommerceContact = await strapi.db
          .query('api::ecommerce-contact-service.ecommerce-contact-service')
          .findOne({
            where: { contact: contact?.id, ecommerceType: 'shopify' },
          });
        const ecommerceCustomerId = ecommerceContact.ecommerceContactId;
        try {
          await api.put(
            `/admin/api/${process.env.SHOPIFY_API_VERSION}/customers/${ecommerceCustomerId}.json`,
            customerData,
          );
        } catch (error) {
          return new Error(error);
        }
      }
    },
    async syncContactWithWoocommerce(
      contactId: number,
      storeUrl: string,
      consumerKey: string,
      consumerSecret: string,
      operationName: string,
    ) {
      const contact = await strapi.db.query('api::contact.contact').findOne({
        where: { id: contactId },
        populate: ['tenant'],
      });
      const api = woocommerceApi(storeUrl, consumerKey, consumerSecret);
      if (!contact?.address) {
        return;
      }
      const address = extractAddressDetails(contact?.address);

      const wooCustomerData = {
        firstname: contact?.fullName?.split(' ')[0] ?? '',
        lastname: contact?.fullName?.split(' ')[1] ?? '',
        email: contact?.email,
        phone: contact?.phoneNumber ?? '',
        billing: {
          address_1: address?.trimmed_address ?? '',
          state: address?.state_abbreviation ?? '',
          country: 'USA',
        },
      };

      if (operationName === 'create') {
        try {
          const createResponse = await api.post('customers', wooCustomerData);
          if (createResponse) {
            await strapi.entityService.create(
              'api::ecommerce-contact-service.ecommerce-contact-service',
              {
                data: {
                  ecommerceContactId: createResponse?.data?.id.toString(),
                  ecommerceType: 'woocommerce',
                  isSynced: true,
                  syncDate: new Date(),
                  contact: contact?.id,
                  tenant: contact?.tenant?.id,
                },
              },
            );
          }
        } catch (error) {
          return new Error(error);
        }
      } else if (operationName === 'update') {
        const ecommerceContact = await strapi.db
          .query('api::ecommerce-contact-service.ecommerce-contact-service')
          .findOne({
            where: { contact: contact?.id, ecommerceType: 'woocommerce' },
          });
        const ecommerceCustomerId = ecommerceContact.ecommerceContactId;
        try {
          await api.put(`customers/${ecommerceCustomerId}`, wooCustomerData);
        } catch (error) {
          return new Error(error);
        }
      }
    },
    async syncContactsBatchWithWoocommerce(
      contacts,
      storeUrl,
      consumerKey,
      consumerSecret,
    ) {
      const api = woocommerceApi(storeUrl, consumerKey, consumerSecret);
      const batchContacts = entitybatchArrayForWoocommerce(contacts, 100);

      for (const batch of batchContacts) {
        try {
          const processedContacts = [];

          // Process each contact in the batch
          for (const customer of batch) {
            const contact = await strapi.db
              .query('api::contact.contact')
              .findOne({
                where: { id: customer?.id },
                populate: ['tenant'],
              });

            if (!contact?.email) {
              console.warn(`Contact ${contact?.id} has no email, skipping...`);
              continue;
            }

            try {
              // Check if customer already exists in WooCommerce by email
              const checkResponse = await api.get('customers', {
                email: contact?.email,
              });

              if (checkResponse?.data?.length > 0) {
                // Customer exists, just create the ecommerce-contact-service entry
                const existingCustomer = checkResponse.data[0];
                await strapi.entityService.create(
                  'api::ecommerce-contact-service.ecommerce-contact-service',
                  {
                    data: {
                      ecommerceContactId: existingCustomer.id.toString(),
                      ecommerceType: 'woocommerce',
                      isSynced: true,
                      syncDate: new Date(),
                      contact: contact?.id,
                      tenant: contact?.tenant?.id,
                    },
                  },
                );
              } else {
                // Customer doesn't exist, prepare for creation
                const address = extractAddressDetails(contact?.address);
                const customerData = {
                  contact: contact,
                  wooCustomerData: {
                    firstname: contact?.fullName?.split(' ')[0] ?? '',
                    lastname: contact?.fullName?.split(' ')[1] ?? '',
                    email: contact?.email,
                    phone: contact?.phoneNumber ?? '',
                    billing: {
                      address_1: address?.trimmed_address ?? '',
                      state: address?.state_abbreviation ?? '',
                      country: 'USA',
                    },
                  },
                };
                processedContacts.push(customerData);
              }
            } catch (checkError) {
              console.error(
                `Error checking customer existence for ${contact?.email}:`,
                checkError,
              );
              // If check fails, proceed with creation attempt
              const address = extractAddressDetails(contact?.address);
              const customerData = {
                contact: contact,
                wooCustomerData: {
                  firstname: contact?.fullName?.split(' ')[0] ?? '',
                  lastname: contact?.fullName?.split(' ')[1] ?? '',
                  email: contact?.email,
                  phone: contact?.phoneNumber ?? '',
                  billing: {
                    address_1: address?.trimmed_address ?? '',
                    state: address?.state_abbreviation ?? '',
                    country: 'USA',
                  },
                },
              };
              processedContacts.push(customerData);
            }
          }

          // Create new customers for those that don't exist
          if (processedContacts.length > 0) {
            const createRequests = processedContacts.map(
              async (customerData) =>
                await api.post('customers', customerData.wooCustomerData),
            );

            const createResponses = await Promise.allSettled(createRequests);

            for (let i = 0; i < createResponses?.length; i++) {
              const response = createResponses[i];
              const customerData = processedContacts[i];
              if (response.status === 'fulfilled') {
                await strapi.entityService.create(
                  'api::ecommerce-contact-service.ecommerce-contact-service',
                  {
                    data: {
                      ecommerceContactId: response?.value?.data?.id.toString(),
                      ecommerceType: 'woocommerce',
                      isSynced: true,
                      syncDate: new Date(),
                      contact: customerData.contact?.id,
                      tenant: customerData.contact?.tenant?.id,
                    },
                  },
                );
              } else {
                console.error(
                  `Failed to create WooCommerce customer for ${customerData.contact?.email}:`,
                  response.reason,
                );
              }
            }
          }
        } catch (error) {
          console.error('Error syncing contact batch:', error);
        }
      }
    },
    async syncContactWithMagento(
      contactId: number,
      storeUrl: string,
      accessToken: string,
      operationName: string,
    ) {
      const contact = await strapi.db.query('api::contact.contact').findOne({
        where: { id: contactId },
        populate: ['tenant'],
      });
      const api = magentoApi(storeUrl, accessToken);

      const magentoCustomerData = {
        customer: {
          firstname: contact?.fullName?.split(' ')[0] ?? '',
          lastname: contact?.fullName?.split(' ')[1] ?? '',
          email: contact?.email,
        },
      };

      if (operationName === 'create') {
        try {
          // Check if customer exists in Magento
          const checkResponse = await api.get(`/customers/search`, {
            params: {
              'searchCriteria[filter_groups][0][filters][0][field]': 'email',
              'searchCriteria[filter_groups][0][filters][0][value]':
                contact?.email,
              'searchCriteria[filter_groups][0][filters][0][condition_type]':
                'eq',
            },
          });

          if (checkResponse?.data?.items?.length > 0) {
            return;
          }

          try {
            const createResponse = await api.post(
              '/customers',
              magentoCustomerData,
            );

            if (createResponse) {
              await strapi.entityService.create(
                'api::ecommerce-contact-service.ecommerce-contact-service',
                {
                  data: {
                    ecommerceContactId: createResponse?.data?.id.toString(),
                    ecommerceType: 'magento',
                    isSynced: true,
                    syncDate: new Date(),
                    contact: contact,
                    tenant: contact?.tenant?.id,
                  },
                },
              );
            }
          } catch (error) {
            return new Error(error);
          }
        } catch (error) {
          return new Error(error);
        }
      } else if (operationName === 'update') {
        const ecommerceContact = await strapi.db
          .query('api::ecommerce-contact-service.ecommerce-contact-service')
          .findOne({
            where: { contact: contact?.id, ecommerceType: 'magento' },
          });
        const ecommerceCustomerId = ecommerceContact.ecommerceContactId;
        try {
          await api.put(
            `/customers/${ecommerceCustomerId}`,
            magentoCustomerData,
          );
        } catch (error) {
          return new Error(error);
        }
      }
    },
  }),
);
