import { shopifyApi } from '../../helpers/shopifyApi';
import { woocommerceApi } from '../../helpers/woocommerceApi';

export const shopifyPlatform = {
  type: 'shopify',
  getStoreUrl: (ctx) => ctx?.request?.header['x-shopify-shop-domain'],
  getApi: (store) => {
    if (!store?.accessToken || !store?.storeUrl) {
      return null;
    }
    return shopifyApi(store?.storeUrl, store?.accessToken);
  },
  fetchProducts: async (ctx, api, tenantId) => {
    const products = [];
    for (const item of ctx.request.body?.line_items || []) {
      try {
        const caratiqProduct = await strapi.db
          .query('api::ecommerce-product-service.ecommerce-product-service')
          .findOne({
            where: {
              ecommerceProductId: item?.product_id,
              ecommerceType: 'shopify',
              tenantId: tenantId,
            },
            populate: ['product'],
          });
        if (!caratiqProduct?.product?.id) {
          continue;
        }
        products.push(caratiqProduct.product.id);
      } catch (error) {
        return new Error(error);
      }
    }
    return products;
  },
  getCustomerId: (ctx) => ctx?.request?.body?.customer?.id as string,
  getCustomerEmail: (ctx) => ctx?.request?.body?.customer?.email,
  getContactData: (ctx, store) => {
    const firstName = ctx?.request?.body?.customer?.first_name;
    const lastName = ctx?.request?.body?.customer?.last_name;
    const email = ctx?.request?.body?.customer?.email;
    const address = ctx?.request?.body?.customer?.default_address?.address1;
    const phoneNumber = ctx?.request?.body?.customer?.phone;
    const tenantId = store?.tenant?.id;

    if (email && tenantId) {
      return {
        fullName: `${firstName ?? email?.split('@')[0]} ${
          lastName ?? ''
        }`.trim(),
        email: email,
        address: address ?? '',
        phoneNumber: phoneNumber ?? '',
        tenant: tenantId,
      };
    }
    return null;
  },
  getOrderData: (ctx, orderId, tenantId, contact, businessLocationId) => ({
    orderId,
    tax: 0,
    total: 0,
    subTotal: 0,
    tenant: tenantId,
    businessLocation: businessLocationId,
    status: 'draft',
    ...(contact && { contact: contact.id }),
    ecommerceType: 'shopify',
    ecommerceOrderId: ctx?.request?.body?.name,
    note: ctx?.request?.body?.note,
  }),
  getOrderItemData: (ctx, item, order, tax) => {
    const ecommerceProductId = item?.product?.ecommerceProductServices?.find(
      (product) => product?.ecommerceType === 'shopify',
    )?.ecommerceProductId;
    const shopifyProductData = ctx.request.body?.line_items?.filter(
      (product) => product?.product_id == ecommerceProductId,
    );
    return {
      quantity: shopifyProductData[0]?.quantity,
      product: item.id,
      itemId: item.uuid,
      price: shopifyProductData[0]?.price,
      order: order.id,
      purchaseType: 'buy',
      ...(tax?.type === 'tax' && { tax: tax?.id }),
      ...(tax?.type === 'collection' && { taxCollection: tax?.id }),
    };
  },
  getServiceOrderItem: (ctx, item, order) => ({
    quantity: 1,
    service: item.id,
    itemId: item.uuid,
    price: ctx.request.body?.shipping_lines[0].price,
    order: order.id,
    purchaseType: 'buy',
    note: ctx.request.body?.shipping_lines[0].title,
  }),
  getShippingItemData: (ctx, item, order) => ({
    quantity: 1,
    product: item.id,
    itemId: item.uuid,
    price: ctx.request.body?.shipping_lines[0].price,
    order: order.id,
    purchaseType: 'buy',
  }),
};

export const woocommercePlatform = {
  type: 'woocommerce',
  getStoreUrl: (ctx) =>
    ctx?.request?.header['x-wc-webhook-source']?.replace(/\/$/, ''),
  getApi: (store) => {
    return woocommerceApi(
      store?.storeUrl,
      store?.consumerKey,
      store?.consumerSecret,
    );
  },
  fetchProducts: async (ctx, api) => {
    const products = [];
    for (const item of ctx.request.body?.line_items || []) {
      try {
        const res = await api.get(`products/${item?.product_id}`);
        const productId = await res?.data?.meta_data.filter(
          (item) => item.key === 'caratiqProductId',
        );
        products.push(productId?.[0]?.value ?? null);
      } catch (error) {
        return new Error(error);
      }
    }
    return products;
  },
  fetchSKUProducts: async (ctx, api) => {
    const products = [];
    for (const item of ctx.request.body?.line_items || []) {
      try {
        const res = await api.get(`products/${item.product_id}`);
        res.data.sku = item?.sku;
        products.push(res?.data);
      } catch (error) {
        return new Error(error);
      }
    }
    return products;
  },
  getCustomerEmail: (ctx) => ctx?.request?.body?.billing?.email,
  getContactData: (ctx, store) => ({
    fullName: `${ctx?.request?.body?.billing?.first_name || ''} ${
      ctx?.request?.body?.billing?.last_name || ''
    }`,
    email: ctx?.request?.body?.billing?.email,
    address: ctx?.request?.body?.billing?.default_address?.address1,
    phoneNumber: ctx?.request?.body?.billing?.phone,
    tenant: store?.tenant?.id,
  }),
  getOrderData: (ctx, orderId, tenantId, contact, businessLocationId) => ({
    orderId,
    tax: 0,
    total: 0,
    subTotal: 0,
    tenant: tenantId,
    businessLocation: businessLocationId,
    status: 'draft',
    contact: contact.id,
    ecommerceType: 'woocommerce',
  }),
  getOrderItemData: (ctx, item, order, tax) => {
    const ecommerceProductId = item?.product?.ecommerceProductServices?.find(
      (product) => product.ecommerceType === 'woocommerce',
    )?.ecommerceProductId;
    const woocommerceProductData = ctx.request.body?.line_items?.filter(
      (product) => product?.product_id == ecommerceProductId,
    );

    return {
      quantity: woocommerceProductData[0]?.quantity,
      product: item.id,
      itemId: item.uuid,
      price: woocommerceProductData[0]?.price,
      order: order?.id,
      purchaseType: 'buy',
      ...(tax?.type === 'tax' && { tax: tax?.id }),
      ...(tax?.type === 'collection' && { taxCollection: tax?.id }),
    };
  },
  getOrderItemDataWithSku: (ctx, index, item, order, tax, orderNote) => ({
    quantity: ctx.request.body?.line_items[index]?.quantity,
    product: item.id,
    itemId: item.uuid,
    price: ctx.request.body?.line_items[index]?.price,
    order: order?.id,
    purchaseType: 'buy',
    ...(tax?.type === 'tax' && { tax: tax?.id }),
    ...(tax?.type === 'collection' && { taxCollection: tax?.id }),
    note: orderNote || '',
  }),
  getServiceOrderItem: (ctx, item, order) => ({
    quantity: 1,
    service: item.id,
    itemId: item.uuid,
    price: ctx.request.body?.shipping_lines[0].total,
    order: order.id,
    purchaseType: 'buy',
    note: ctx.request.body?.shipping_lines[0].method_id,
  }),
  getShippingItemData: (ctx, item, order) => ({
    quantity: 1,
    product: item.id,
    itemId: item.uuid,
    price: ctx.request.body?.shipping_lines[0].total,
    order: order.id,
    purchaseType: 'buy',
  }),
  fetchShippingDescriptin: async (ctx, api) => {
    let res;
    try {
      res = await api.get(
        `shipping_methods/${ctx.request.body?.shipping_lines[0]?.method_id}`,
      );
    } catch (error) {
      return new Error(error);
    }
    return res.data?.description;
  },
};

export const magentoPlatform = {
  type: 'magento',
  getStoreUrl: (ctx) => ctx?.request?.body?.shop_url?.replace(/\/$/, ''),
  fetchProducts: async (ctx, tenantId) => {
    const products = [];
    for (const item of ctx.request.body?.items || []) {
      try {
        const product = await strapi.db
          .query('api::ecommerce-product-service.ecommerce-product-service')
          .findOne({
            where: {
              ecommerceType: 'magento',
              tenantId: tenantId,
              isSynced: true,
              ecommerceProductId: item?.sku,
            },
            populate: ['product', 'tenant'],
          });
        if (!product?.product?.id) {
          continue;
        }
        products.push(product.product.id);
      } catch (error) {
        return new Error(error);
      }
    }
    return products;
  },
  getCustomerEmail: (ctx) => ctx?.request?.body?.customer_email,
  getContactData: (ctx, store) => ({
    fullName: ctx?.request?.body?.customer_name || '',
    email: ctx?.request?.body?.customer_email,
    address: ctx?.request?.body?.billing_address?.street,
    phoneNumber: ctx?.request?.body?.billing_address?.telephone,
    tenant: store?.tenant?.id,
  }),
  getOrderData: (ctx, orderId, tenantId, contact, businessLocationId) => ({
    orderId,
    tax: 0,
    total: 0,
    subTotal: 0,
    tenant: tenantId,
    businessLocation: businessLocationId,
    status: 'draft',
    contact: contact.id,
    ecommerceType: 'magento',
  }),
  getOrderItemData: (ctx, index, item, order, tax) => ({
    quantity: ctx.request.body?.items[index]?.quantity,
    product: item.id,
    itemId: item.uuid,
    price: ctx.request.body?.items[index]?.price,
    order: order?.id,
    purchaseType: 'buy',
    ...(tax?.type === 'tax' && { tax: tax?.id }),
    ...(tax?.type === 'collection' && { taxCollection: tax?.id }),
  }),
};
