/**
 * order controller
 */
import { factories } from '@strapi/strapi';
import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '../../../graphql/constants';
import { DEFAULT_EMAIL } from '../../../graphql/constants/defaultValues';
import unixToDateTime from '../../../graphql/helpers/unixToDateTime';
import { centsToDollars } from '../../../graphql/models/order/helpers/helper';
import { generateId } from '../../../utils/randomBytes';
import {
  magentoPlatform,
  shopifyPlatform,
  woocommercePlatform,
} from './platforms';

export default factories.createCoreController(
  'api::order.order',
  ({ strapi }) => ({
    async stripeWebhookController(ctx) {
      try {
        const event = ctx.request.body;
        const paymentIntent = event.data.object;
        const metaData = paymentIntent?.metadata;
        // Handle the event
        switch (event.type) {
          case 'payment_intent.succeeded':
            if (metaData?.txnId) {
              const dealTransactionDataWithTenant =
                await strapi.entityService.findMany(
                  'api::deal-transaction.deal-transaction',
                  {
                    filters: {
                      id: metaData.txnId,
                    },
                    populate: {
                      tenant: {
                        populate: {
                          stripe_onboarding: true,
                        },
                      },
                    },
                  },
                );

              const stripeOnboardingAccountId =
                dealTransactionDataWithTenant &&
                dealTransactionDataWithTenant[0]?.tenant?.stripe_onboarding
                  ?.accountId;
              const stripeInstance = new Stripe(STRIPE_SECRET_KEY, {
                stripeAccount: stripeOnboardingAccountId,
              });
              const getPaymentMethodDetails =
                await stripeInstance.paymentMethods.retrieve(
                  paymentIntent.payment_method as string,
                );

              let paymentMethodName: string;
              let paymentMethodTypeId: number;

              switch (getPaymentMethodDetails.type) {
                case 'card':
                  paymentMethodName =
                    getPaymentMethodDetails.card.funding === 'credit'
                      ? 'Credit Card'
                      : 'Debit Card';
                  break;
                case 'affirm':
                  paymentMethodName = 'Affirm';
                  break;
                case 'afterpay_clearpay':
                  paymentMethodName = 'Afterpay';
                  break;
                case 'us_bank_account':
                  paymentMethodName = 'ACH';
                  break;
                //pos terminal
                case 'card_present':
                  paymentMethodName =
                    getPaymentMethodDetails.card_present.funding === 'credit'
                      ? 'Credit Card'
                      : 'Debit Card';
                  break;
              }

              const existingPaymentMethod = await strapi.db
                .query('api::payment-method.payment-method')
                .findOne({
                  where: {
                    name: paymentMethodName.toLowerCase(),
                    tenant:
                      dealTransactionDataWithTenant &&
                      dealTransactionDataWithTenant[0]?.tenant.id,
                  },
                });

              if (existingPaymentMethod) {
                paymentMethodTypeId = existingPaymentMethod?.id;
              } else {
                const newPaymentMethod = await strapi.entityService.create(
                  'api::payment-method.payment-method',
                  {
                    data: {
                      name: paymentMethodName.toLowerCase(),
                      tenant:
                        dealTransactionDataWithTenant &&
                        dealTransactionDataWithTenant[0]?.tenant.id,
                    },
                  },
                );
                paymentMethodTypeId = newPaymentMethod?.id;
              }

              //Update the entity
              const updateDealTransactionData: UpdateDealTransactionData = {
                status: 'Paid',
                stripeInfo: {
                  event,
                },
                paymentMethod: paymentMethodTypeId,
              };

              if (paymentIntent.amount) {
                updateDealTransactionData.summary = centsToDollars(
                  paymentIntent.amount,
                );
                updateDealTransactionData.paid = centsToDollars(
                  paymentIntent.amount,
                );
              }

              await strapi
                .query('api::deal-transaction.deal-transaction')
                .update({
                  where: { id: paymentIntent.metadata?.txnId },
                  data: updateDealTransactionData,
                });
              const orderService = strapi.service('api::order.order');
              await orderService.updateRemainingAmount(metaData?.txnId);
            }
            break;
          case 'payment_intent.payment_failed':
            if (metaData?.txnId) {
              //Update the entity
              await strapi
                .query('api::deal-transaction.deal-transaction')
                .update({
                  where: { id: paymentIntent.metadata?.txnId },
                  data: {
                    status: 'Cancelled',
                    stripeInfo: {
                      event,
                    },
                  },
                });
            }
            break;
          case 'account.updated':
            //Update account status
            if (event.account) {
              await strapi
                .query('api::stripe-onboarding.stripe-onboarding')
                .update({
                  where: { accountId: event.account },
                  data: {
                    accountStatus: true,
                  },
                });

              const stripeOnboardingDetails = await strapi
                .query('api::stripe-onboarding.stripe-onboarding')
                .findOne({
                  where: { accountId: event.account },
                  populate: ['tenant'],
                });

              if (
                stripeOnboardingDetails?.tenant?.paymentGatewayType === null
              ) {
                await strapi.query('api::tenant.tenant').update({
                  where: { id: stripeOnboardingDetails?.tenant?.id },
                  data: {
                    paymentGatewayType: 'stripe',
                  },
                });
              }
            }
            break;
          case 'invoice.payment_failed':
            await strapi
              .query(
                'api::tenant-stripe-subscription.tenant-stripe-subscription',
              )
              .update({
                where: { subscriptionId: event.data.object.subscription },
                data: {
                  status: 'false',
                },
              });
            break;
          case 'subscription_schedule.aborted':
            await strapi
              .query(
                'api::tenant-stripe-subscription.tenant-stripe-subscription',
              )
              .update({
                where: { subscriptionId: event.data.object.subscription },
                data: {
                  status: 'false',
                },
              });
            break;
          case 'subscription_schedule.canceled':
            await strapi
              .query(
                'api::tenant-stripe-subscription.tenant-stripe-subscription',
              )
              .update({
                where: { subscriptionId: event.data.object.subscription },
                data: {
                  status: 'false',
                },
              });
            break;
          case 'invoice.paid':
            // Handle successful invoice payment for subscription renewals
            if (event.data.object.subscription) {
              // Get the period start and end from the first line item's period
              const periodStart =
                event.data.object.lines?.data?.[0]?.period?.start ||
                event.data.object.period_start;
              const periodEnd =
                event.data.object.lines?.data?.[0]?.period?.end ||
                event.data.object.period_end;

              await strapi
                .query(
                  'api::tenant-stripe-subscription.tenant-stripe-subscription',
                )
                .update({
                  where: { subscriptionId: event.data.object.subscription },
                  data: {
                    status: true,
                    startDate: unixToDateTime(periodStart),
                    endDate: unixToDateTime(periodEnd),
                  },
                });
            }
            break;
          case 'customer.subscription.updated':
            // Handle subscription updates including renewals
            if (event.data.object.id) {
              await strapi
                .query(
                  'api::tenant-stripe-subscription.tenant-stripe-subscription',
                )
                .update({
                  where: { subscriptionId: event.data.object.id },
                  data: {
                    status:
                      event.data.object.status === 'active' ||
                      event.data.object.status === 'trialing',
                    startDate: unixToDateTime(
                      event.data.object.current_period_start,
                    ),
                    endDate: unixToDateTime(
                      event.data.object.current_period_end,
                    ),
                  },
                });
            }
            break;
          default:
        }
        ctx.body = {
          status: 200,
          message: 'success',
          event,
        };
      } catch (error) {
        ctx.body = {
          status: 500,
          error: error,
          message: 'internal server error',
        };
      }
    },
    async shopifyOrderWebhookController(ctx) {
      try {
        const orderService = strapi.service('api::order.order');
        orderService?.handleOrderWebhook(ctx, shopifyPlatform);
        ctx.body = { status: 200, message: 'Success' };
      } catch (error) {
        ctx.body = {
          status: 500,
          message: 'Internal server error',
          error: error.message,
        };
      }
    },
    async woocommerceOrderWebhookController(ctx) {
      try {
        const orderService = strapi.service('api::order.order');
        orderService?.handleOrderWebhook(ctx, woocommercePlatform);
        orderService?.handleWoocommerceSKUOrderWebhook(
          ctx,
          woocommercePlatform,
        );
        ctx.body = { status: 200, message: 'Success' };
      } catch (error) {
        ctx.body = {
          status: 500,
          message: 'Internal server error',
          error: error.message,
        };
      }
    },
    async magentoOrderWebhookController(ctx) {
      try {
        const orderService = strapi.service('api::order.order');
        orderService?.handleOrderWebhook(ctx, magentoPlatform);
        ctx.body = { status: 200, message: 'Success' };
      } catch (error) {
        ctx.body = {
          status: 500,
          message: 'Internal server error',
          error: error.message,
        };
      }
    },
    async createOrderOpenApiController(ctx) {
      try {
        if (!ctx?.request?.body?.line_items) {
          ctx.body = {
            status: 400,
            message: 'Invalid request!',
          };
          return;
        }

        const user = await strapi.plugins[
          'users-permissions'
        ].services.jwt.getToken(ctx);
        const owner = await strapi
          .query('plugin::users-permissions.user')
          .findOne({
            where: { id: user?.id },
            populate: ['tenant'],
          });

        const orderRequest = ctx?.request?.body;
        const products = [];
        const productIdentifiers = [];

        // Validate that each line item has either product_id or sku
        for (let index = 0; index < orderRequest?.line_items?.length; index++) {
          const lineItem = orderRequest?.line_items[index];
          if (!lineItem?.product_id && !lineItem?.sku) {
            ctx.body = {
              status: 400,
              message: `Line item ${
                index + 1
              } must have either product_id or sku`,
            };
            return;
          }

          // Store both the product identifier and the type for later use
          if (lineItem?.product_id) {
            products[index] = lineItem.product_id;
            productIdentifiers[index] = {
              type: 'productId',
              value: lineItem.product_id,
            };
          } else if (lineItem?.sku) {
            products[index] = lineItem.sku;
            productIdentifiers[index] = { type: 'sku', value: lineItem.sku };
          }
        }

        let contact;
        contact = await strapi.query('api::contact.contact').findOne({
          where: { email: ctx?.request?.body?.customer?.email },
        });

        if (!contact) {
          contact = await strapi.entityService.create('api::contact.contact', {
            data: {
              fullName: ctx?.request?.body?.customer?.fullName,
              email: ctx?.request?.body?.customer?.email ?? DEFAULT_EMAIL,
              address: ctx?.request?.body?.customer?.address,
              tenant: owner?.tenant?.id,
            },
          });
        }

        let businessLocationId;
        if (!orderRequest?.businessLocationId) {
          const businessLocations = await strapi.entityService.findMany(
            'api::business-location.business-location',
            {
              filters: {
                tenant: {
                  id: {
                    $eq: owner?.tenant?.id,
                  },
                },
                type: {
                  $eq: 'store',
                },
              },
            },
          );
          businessLocationId = businessLocations[0]?.id;
        } else {
          const businessLocations = await strapi.entityService.findMany(
            'api::business-location.business-location',
            {
              filters: {
                businessLocationId: {
                  $eq: orderRequest?.businessLocationId,
                },
              },
            },
          );
          businessLocationId = businessLocations[0]?.id;
        }

        const newOrderId = generateId();
        const order = await strapi.entityService.create('api::order.order', {
          data: {
            orderId: newOrderId,
            tax: 0,
            total: 0,
            subTotal: 0,
            type: orderRequest?.layaway_order
              ? 'layaway'
              : orderRequest?.type == 'purchase'
              ? 'purchase'
              : 'sell',
            businessLocation: businessLocationId,
            status: orderRequest?.layaway_order
              ? 'started'
              : orderRequest?.type == 'purchase'
              ? 'placed'
              : 'incoming',
            contact: contact,
            tenant: owner?.tenant?.id,
            ecommerceType: 'api',
            lastPayment: new Date(),
            note: orderRequest?.note,
          },
        });

        if (!order) {
          return;
        }

        const productInventoryItems = await Promise.all(
          productIdentifiers?.map(async (identifier) => {
            const whereClause: any = {
              businessLocation: businessLocationId,
            };

            if (identifier.type === 'productId') {
              whereClause.product = {
                productId: identifier.value,
              };
            } else if (identifier.type === 'sku') {
              whereClause.product = {
                SKU: identifier.value,
              };
            }
            const result = await strapi.db
              .query('api::product-inventory-item.product-inventory-item')
              .findOne({
                where: whereClause,
              });
            return result;
          }),
        );

        if (!productInventoryItems?.length) {
          return;
        }

        const orderService = strapi.service('api::order.order');

        for (let index = 0; index < productInventoryItems?.length; index++) {
          if (!productInventoryItems[index]) {
            continue;
          }

          const tax = await orderService.calculateEcommerceOrderTax(
            orderRequest?.line_items[index].tax_lines,
            owner?.tenant?.id,
            'ecommerceApi',
          );

          const orderItemData = {
            quantity: orderRequest?.line_items[index]?.quantity,
            product: productInventoryItems[index]?.id,
            itemId: productInventoryItems[index]?.uuid,
            price: orderRequest?.line_items[index]?.price,
            order: order?.id,
            purchaseType: 'buy',
            ...(tax?.type === 'tax' && { tax: tax?.id }),
            ...(tax?.type === 'collection' && { taxCollection: tax?.id }),
          };

          await strapi.entityService.create(
            'api::product-order-item.product-order-item',
            {
              data: orderItemData,
            },
          );
        }

        if (!orderRequest?.layaway_order && orderRequest?.type != 'purchase') {
          const dealTransactions = await strapi.db
            .query('api::deal-transaction.deal-transaction')
            .findMany({
              where: { sellingOrder: order?.id },
            });

          const paymentMethod = await strapi.db
            .query('api::payment-method.payment-method')
            .findOne({
              where: { name: 'ecommerce api', tenant: owner?.tenant?.id },
            });

          for (let index = 0; index < dealTransactions?.length; index++) {
            const dealTransaction = dealTransactions[index];
            await strapi.db
              .query('api::deal-transaction.deal-transaction')
              .update({
                where: {
                  sellingOrder: order?.id,
                },
                data: {
                  paid: dealTransaction?.summary,
                  status: 'Paid',
                  paymentMethod: paymentMethod?.id,
                },
              });
          }
        }
        if (orderRequest?.type == 'purchase') {
          const orderData = await strapi.entityService.findOne(
            'api::order.order',
            order?.id,
            {
              fields: ['id', 'total'],
            },
          );
          let paymentMethod;

          const findPaymentMethod = await strapi.entityService.findMany(
            'api::payment-method.payment-method',
            {
              filters: {
                name: 'ecommerce api',
                tenant: {
                  id: owner?.tenant?.id,
                },
              },
            },
          );
          paymentMethod = findPaymentMethod?.[0]?.id;

          if (!findPaymentMethod?.length) {
            const newPaymentMethod = await strapi.entityService.create(
              'api::payment-method.payment-method',
              {
                data: {
                  name: 'ecommerce api',
                  tenant: owner?.tenant?.id,
                  paymentType: 'billPayment',
                },
              },
            );
            paymentMethod = newPaymentMethod?.id;
          }

          const chartAccounts = await strapi.entityService.findMany(
            'api::chart-account.chart-account',
            {
              filters: {
                tenant: {
                  id: owner?.tenant?.id,
                },
                name: {
                  $eq: 'Cost of Goods Sold',
                },
              },
            },
          );

          //create deal transaction
          await strapi.entityService.create(
            'api::deal-transaction.deal-transaction',
            {
              data: {
                sellingOrder: orderData?.id,
                summary: orderData?.total,
                paid: orderData?.total,
                status: 'Paid',
                dueDate: new Date(),
                repetitive: 'once',
                dealTransactionId: generateId(),
                tenant: owner?.tenant?.id,
                chartAccount: chartAccounts?.[0]?.id,
                paymentMethod: paymentMethod,
              },
            },
          );
          await strapi.entityService.update('api::order.order', orderData?.id, {
            data: {
              status: 'received',
            },
          });
        }

        ctx.body = {
          status: 200,
          message: 'Order created successfully!',
          data: order,
        };
      } catch (error) {
        ctx.body = {
          status: 500,
          error: error,
          message: 'Internal server error',
        };
      }
    },
    async getOrderOpenApiController(ctx) {
      try {
        const user = await strapi.plugins[
          'users-permissions'
        ].services.jwt.getToken(ctx);

        const owner = await strapi
          .query('plugin::users-permissions.user')
          .findOne({
            where: { id: user?.id },
            populate: ['tenant'],
          });

        const { pageSize = 100, status = '', page = 1, type } = ctx.query;

        const statusArray = status
          ? status?.split(',').map((s) => s.trim())
          : ['incoming', 'preparing', 'ready', 'shipped'];

        // Fetch all product attributes for this tenant
        const customAttributes = await strapi.entityService.findMany(
          'api::product-attribute.product-attribute',
          {
            filters: {
              tenant: {
                id: {
                  $eq: owner?.tenant?.id,
                },
              },
            },
          },
        );

        // Clean attribute keys (remove spaces)
        const allAttributeKeys = customAttributes.map((attr) => ({
          key: attr.name.replace(/\s+/g, ''),
          originalName: attr.name,
        }));
        const order = await strapi.entityService.findMany('api::order.order', {
          filters: {
            tenant: {
              id: {
                $eq: owner?.tenant?.id,
              },
            },
            status: {
              $in: [...statusArray],
            },
            type: {
              $eq: type,
            },
          },
          fields: [
            'orderId',
            'createdAt',
            'updatedAt',
            'status',
            'paymentMethod',
            'deliveryMethod',
            'total',
            'subTotal',
            'discount',
            'dueDate',
            'tax',
            'tip',
            'memo',
            'recurringAmount',
            'recurringPeriod',
            'points',
            'pointsGiven',
            'recurringPeriodCount',
            'customerShippingInfo',
            'shipment',
            'rentDueDate',
            'customCreationDate',
            'isWarranty',
            'ecommerceType',
            'inputInvoiceNum',
            'isShowInvoiceNote',
            'lastPayment',
            'ecommerceOrderId',
            'orderVersion',
            'expiryDate',
            'note',
            'type',
          ],
          populate: [
            'services.service.serviceLocationInfo.service',
            'products.product.product.brand',
            'products.product.product.productType',
            'products.product.product.metalType',
            'products.product.product.materialGradeType',
            'products.product.product.engravingType',
            'products.product.product.size',
            'products.product.product.productAttributeOptions.productAttribute',
            'contact',
            'company',
            'classes.class.classLocationInfo.class',
            'memberships.membership',
            'files',
          ],
          sort: [{ id: 'desc' }],
          limit: parseInt(pageSize),
          start: (parseInt(page) - 1) * parseInt(pageSize),
        });

        const transFormOrder = await Promise.all(
          order.map(async (item) => {
            const newOrder = { ...item };

            const transFormProduct = (item?.products ?? []).map((product) => {
              const prodData = product?.product?.product ?? {};
              const {
                productAttributeOptions, // destructure to remove
                ...cleanProduct
              } = prodData;

              // Create a map from attribute keys to their option value
              const optionMap = (productAttributeOptions ?? []).reduce(
                (acc, option) => {
                  const attrKey = option?.productAttribute?.name?.replace(
                    /\s+/g,
                    '',
                  );
                  const value = option?.name ?? '';
                  if (attrKey) acc[attrKey] = value;
                  return acc;
                },
                {},
              );

              // Ensure all attributes are present, even if value is missing
              const customAttributesObject = allAttributeKeys.reduce(
                (acc, attr) => {
                  acc[attr.key] = optionMap[attr.key] ?? '';
                  return acc;
                },
                {},
              );

              return {
                ...cleanProduct,
                note: product?.note ?? '',
                brand: prodData?.brand?.name ?? '',
                productType: prodData?.productType?.name ?? '',
                metalType: prodData?.metalType?.name ?? '',
                materialGradeType: prodData?.materialGradeType?.name ?? '',
                engravingType: prodData?.engravingType?.name ?? '',
                size: prodData?.size?.name ?? '',
                ...customAttributesObject, // flattened fields
              };
            });

            const transFormService = (item?.services ?? []).map((service) => ({
              ...service?.service?.serviceLocationInfo?.service,
              note: service?.note ?? '',
            }));

            const transFormMembership = (item?.memberships ?? []).map(
              (membership) => ({
                ...membership?.membership,
                note: membership?.note ?? '',
              }),
            );

            const transFormClass = (item?.classes ?? []).map(
              (classService) => ({
                ...classService?.class?.classLocationInfo?.class,
                note: classService?.note ?? '',
              }),
            );
            const {
              billCreation,
              billDeletetion,
              isCustomerWebsite,
              completed,
              ...restOrder
            } = newOrder;
            return {
              ...restOrder,
              products: transFormProduct.map(
                ({ uuid, favorite, ...rest }) => rest,
              ),
              services: transFormService,
              memberships: transFormMembership,
              classes: transFormClass,
            };
          }),
        );

        ctx.body = {
          status: 200,
          message: 'Order fetched successfully!',
          data: transFormOrder,
        };
      } catch (error) {
        ctx.body = {
          status: 500,
          error,
          message: 'Internal server error',
        };
      }
    },
    async updateOrderOpenApiController(ctx) {
      try {
        if (!ctx?.request?.body?.orderId) {
          ctx.body = {
            status: 400,
            message: 'Order ID is required!',
          };
          return;
        }
        if (!ctx?.request?.body?.status) {
          ctx.body = {
            status: 400,
            message: 'Status is required!',
          };
          return;
        }
        const { orderId, status } = ctx.request.body;
        const fetchOrder = await strapi.entityService.findMany(
          'api::order.order',
          {
            filters: {
              orderId: {
                $eq: orderId,
              },
            },
            fields: ['id', 'type'],
          },
        );
        if (!fetchOrder?.length) {
          ctx.body = {
            status: 400,
            message: 'Order not found!',
          };
          return;
        }
        // Validate status based on order type
        const orderType = fetchOrder?.[0]?.type;
        const allowedStatusesByType: Record<string, string[]> = {
          sell: ['incoming', 'preparing', 'ready', 'shipped'],
          purchase: ['started', 'pending', 'placed', 'received'],
          layaway: ['started', 'paying', 'paid', 'shipped'],
          rent: ['started', 'paid', 'shipped', 'returned'],
          tradeIn: ['started', 'credited', 'received'],
        };

        const allowedForType = allowedStatusesByType[orderType] || [];
        const isAllowed = allowedForType
          .map((s) => s.toLowerCase())
          .includes(String(status).toLowerCase());

        if (!isAllowed) {
          ctx.body = {
            status: 400,
            message: `Invalid status for order type ${orderType}. Allowed: ${allowedForType.join(
              ', ',
            )}`,
          };
          return;
        }

        const order = await strapi.entityService.update(
          'api::order.order',
          fetchOrder?.[0]?.id,
          {
            data: {
              status: status,
            },
          },
        );
        ctx.body = {
          status: 200,
          message: 'Order updated successfully!',
          data: order,
        };
      } catch (error) {
        ctx.body = {
          status: 500,
          message: 'Internal server error',
          error: error.message,
        };
      }
    },
    async getOrderByIdOpenApiController(ctx) {
      try {
        const { id, orderId } = ctx.query;

        // Validate that at least one parameter is provided
        if (!id && !orderId) {
          return ctx.badRequest('Either id or orderId is required');
        }

        let order;

        if (id) {
          // Find order by ID
          order = await strapi.entityService.findOne('api::order.order', id, {
            fields: [
              'orderId',
              'createdAt',
              'updatedAt',
              'status',
              'paymentMethod',
              'deliveryMethod',
              'total',
              'subTotal',
              'discount',
              'dueDate',
              'tax',
              'tip',
              'memo',
              'recurringAmount',
              'recurringPeriod',
              'points',
              'pointsGiven',
              'recurringPeriodCount',
              'customerShippingInfo',
              'shipment',
              'rentDueDate',
              'customCreationDate',
              'isWarranty',
              'ecommerceType',
              'inputInvoiceNum',
              'isShowInvoiceNote',
              'lastPayment',
              'ecommerceOrderId',
              'orderVersion',
              'expiryDate',
              'note',
              'type',
            ],
            populate: [
              'services.service.serviceLocationInfo.service',
              'products.product.product.brand',
              'products.product.product.productType',
              'products.product.product.metalType',
              'products.product.product.materialGradeType',
              'products.product.product.engravingType',
              'products.product.product.size',
              'products.product.product.productAttributeOptions.productAttribute',
              'contact',
              'company',
              'classes.class.classLocationInfo.class',
              'memberships.membership',
              'files',
              'compositeProducts',
            ],
          });
        } else if (orderId) {
          // Find order by orderId
          const orders = await strapi.entityService.findMany(
            'api::order.order',
            {
              filters: { orderId: orderId },
              fields: [
                'orderId',
                'createdAt',
                'updatedAt',
                'status',
                'paymentMethod',
                'deliveryMethod',
                'total',
                'subTotal',
                'discount',
                'dueDate',
                'tax',
                'tip',
                'memo',
                'recurringAmount',
                'recurringPeriod',
                'points',
                'pointsGiven',
                'recurringPeriodCount',
                'customerShippingInfo',
                'shipment',
                'rentDueDate',
                'customCreationDate',
                'isWarranty',
                'ecommerceType',
                'inputInvoiceNum',
                'isShowInvoiceNote',
                'lastPayment',
                'ecommerceOrderId',
                'orderVersion',
                'expiryDate',
                'note',
                'type',
              ],
              populate: [
                'services.service.serviceLocationInfo.service',
                'products.product.product.brand',
                'products.product.product.productType',
                'products.product.product.metalType',
                'products.product.product.materialGradeType',
                'products.product.product.engravingType',
                'products.product.product.size',
                'products.product.product.productAttributeOptions.productAttribute',
                'contact',
                'company',
                'classes.class.classLocationInfo.class',
                'memberships.membership',
                'files',
                'compositeProducts',
              ],
            },
          );

          // Return the first match if found, since orderId should be unique
          order = orders && orders.length > 0 ? orders[0] : null;
        }

        if (!order) {
          ctx.body = {
            status: 200,
            message: 'Order not found',
            data: null,
            found: false,
          };
          return;
        }

        ctx.body = {
          status: 200,
          message: 'Order fetched successfully!',
          data: order,
          found: true,
        };
      } catch (error) {
        ctx.body = {
          status: 500,
          message: 'Internal server error',
          error: error.message,
        };
      }
    },
  }),
);
