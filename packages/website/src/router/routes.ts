import { useMemo } from 'react';

import { useRouteTenant } from '@/hooks/useRouteTenant';

type RouteObject = {
  [key: string]: string | RouteObject;
};

type RouteEntity = string | RouteObject;

export const ROUTES = {
  tenant: {
    index: '',
    settings: {
      index: 'settings',
      password: 'password',
      plan: 'plan',
      permissions: 'permissions',
      integrations: {
        index: 'integrations',
        twilio: 'twilio',
        nylas: 'nylas',
        webchat: 'webchat',
        ecommerce: 'ecommerce',
      },
    },
    downloads: 'downloads',
    dashboard: {
      index: 'dashboard',
      stores: 'stores',
      settings: {
        index: 'settings',
        generalInfo: {
          index: 'general-info',
          terms: 'terms',
          customDocuments: 'custom-documents',
          importingHistory: 'importing-history',
          messagingSettings: 'messaging-settings',
        },
        reviewsSettings: {
          index: 'reviews',
        },
        dealsSettings: {
          index: 'deals',
        },
        contactsSettings: {
          index: 'contacts',
          contactsImport: 'contacts-import',
          relationsImport: 'relations-import',
          wishlistImport: 'wishlist-import',
        },
        companiesSettings: {
          index: 'companies',
          companiesImport: 'companies-import',
        },
        inventorySettings: {
          index: 'inventory',
          inventoryImport: 'inventory-import',
          inventoryProductsPriceUpdate: 'inventory-products-price-update',
          serviceSettings: 'service-settings',
          itemCategoriesMapping: 'item-categories-mapping',
        },
        taskSettings: {
          index: 'tasks',
          messaging: 'messaging',
        },
        terminals: {
          index: 'terminals',
        },
        sellingSettings: {
          index: 'orders',
          salesOrdersImport: 'sales-orders-import',
          purchases: 'purchases',
        },
        integration: {
          index: 'accounting-service',
          paymentGateways: 'payment-gateways',
          ecommerceMappings: 'ecommerce-mapping',
        },
      },
    },
    accounting: {
      index: 'accounting',
      incomeStatement: 'income-statement',
      transactions: 'transactions',
      taxes: {
        index: 'taxes',
        taxCollection: 'tax-collection',
      },
      charts: 'charts',
      reminders: 'reminders',
    },
    crm: {
      index: 'crm',
      contacts: 'contacts',
      leads: 'leads',
      companies: 'companies',
      dealManagement: 'dealManagement',
    },
    inventory: {
      index: 'inventory',
      inventoryManagement: {
        index: 'inventory-management',
        dashboard: 'dashboard',
        products: {
          index: 'products',
          create: 'create',
          copy: 'copy',
        },
        productGroups: {
          index: 'product-groups',
          create: 'create',
        },
        compositeProducts: {
          index: 'composite-products',
          create: 'create',
        },
        services: {
          index: 'services',
          create: 'create',
        },
        classes: {
          index: 'classes',
          create: 'create',
        },
        resources: {
          index: 'resources',
          create: 'create',
        },
        memberships: {
          index: 'memberships',
          create: 'create',
        },
        discounts: {
          index: 'discounts',
          create: 'create',
        },
      },
      shipments: {
        index: 'shipments',
        shipped: 'shipped',
        unshipped: 'unshipped',
        create: 'create',
      },
      warehouses: {
        index: 'warehouses',
        active: 'active',
        archive: 'archive',
        create: 'create',
      },
      transferOrders: {
        index: 'transfer-orders',
        create: 'create',
      },
      inventoryAdjustment: {
        index: 'inventory-adjustment',
        create: 'create',
      },
      inventoryAudit: {
        index: 'inventory-audit',
        create: 'create',
      },
      maintenance: {
        index: 'maintenance',
        create: 'create',
      },
      returns: {
        index: 'returns',
        create: 'create',
      },
    },
    selling: {
      index: 'selling',
      dashboard: 'dashboard',
      pos: {
        index: 'pos',
        purchase: 'purchase-order',
      },
      management: 'order-management',
      layaway: 'layaway',
      rental: 'rental',
      trade: 'trade-in',
      purchase: 'purchase-management',
      returns: {
        index: 'returns',
        create: 'create',
      },
    },
    tasks: 'tasks',
    scheduling: {
      index: 'scheduling',
      employee: 'employee-scheduling',
      appointments: 'appointments',
      resources: 'resources',
      upcomingAppointments: 'upcoming-appointments',
    },
    reports: {
      index: 'reports',
      sales: {
        index: 'sales',
        dailySummaryReport: 'daily-summary-report',
        salesReport: 'sales-report',
        salesItemReport: 'sales-item-report',
        salesByItemCategoryReport: 'sales-by-item-category-report',
        taxesReport: 'taxes-report',
        accrualSummaryReport: 'accrual-summary-report',
        accrualTaxesReport: 'accrual-taxes-report',
      },
      inventory: {
        index: 'inventory',
        inventoryReport: 'inventory-report',
        inventoryItemReport: 'inventory-item-report',
        memoReport: 'memo-report',
        memoOutReport: 'memo-out-report',
      },
      customers: {
        index: 'customers',
        customersReport: 'customers-report',
        marketingReport: 'marketing-report',
      },
      employees: {
        index: 'employees',
        employeesReport: 'employees-report',
      },
    },
    websiteEditor: {
      index: 'website-editor',
      header: 'header',
      footer: 'footer',
      customReview: 'custom-review',
      subscribeNewsletter: 'subscribe-newsletter',
      followUs: 'followUs',
      homePage: 'home-page',
      shopPage: 'shop-page',
      aboutUs: 'about-us',
      blog: 'blog',
      faq: 'faq',
      websiteSettings: 'website-settings',
      privacyPolicy: 'privacy-policy',
      termsConditions: 'terms-conditions',
    },
    preview: 'preview',
    hr: {
      index: 'hr',
      dashboard: 'dashboard',
      management: 'management',
    },
    marketing: {
      index: 'marketing',
      dashboard: 'dashboard',
      sequence: 'sequence',
      email: 'email-editor',
    },
    quotes: {
      index: 'quotes',
      quotes: 'quotes',
      deals: 'deals',
      salesOrders: 'sales-orders',
      invoices: 'invoices',
    },
    contracts: {
      index: 'contracts',
      contracts: 'contracts',
      productsCatalog: 'catalog',
      appraisal: 'appraisal',
      appraisalPreview: 'appraisal/preview',
      forms: 'forms',
      estimates: {
        index: 'estimates',
        preview: 'preview',
      },
      invoices: {
        index: 'invoices',
        preview: 'preview',
      },
      createForm: 'forms/create',
      createAppraisal: 'appraisal/create',
      createContract: 'contract/create',
      editContractTemplate: 'contract/template/edit',
      editFormTemplate: 'forms/template/edit',
      purchase: {
        index: 'purchase-requests',
        preview: 'preview',
      },
    },
    messaging: {
      index: 'messaging',
    },
    onboarding: 'onboarding',
    location: {
      index: 'location',
    },
    notFound: 'not-found',
    quickbooksProductMapping: 'quickbooks-product-mapping',
    xeroProductMapping: 'xero-product-mapping',
  },
  global: {
    fillProfile: 'fill-profile',
    signContract: 'sign-contract/:uuid',
    fillForm: 'fill-form/:uuid',
    auth: {
      index: 'auth',
      signIn: 'sign-in',
      signUp: 'sign-up',
      forgotPassword: 'forgot-password',
      resetPassword: {
        index: 'reset-password',
        createPassword: 'create-password',
      },
      google: 'google',
      emailConfirmation: 'email-confirmation',
      notConfirmed: 'not-confirmed',
    },
    terms: 'terms',
    privacyPolicy: 'privacy-policy',
    payment: {
      index: 'payment',
      pay: 'pay',
      success: 'success',
      error: 'error',
      pending: 'pending',
      stripeSubscription: 'stripe-subscription',
    },
    subscribe: 'subscribe',
    review: 'review',
    nylas: 'nylas-auth',
    woocommerce: 'woocommerce-auth',
    magento: 'magento-auth',
    xero: 'xero-auth-callback',
    shopify: 'shopify-auth-callback',
    quickbooks: 'quickbooks-auth',
  },
};

const mapRoutesToParent = (
  route: RouteEntity,
  parentPath: string,
): RouteEntity => {
  return Object.entries(route).reduce((acc, [key, value]) => {
    const routePath = `${parentPath}${
      key === 'index' || parentPath === '/' ? '' : '/'
    }`;

    if (typeof value === 'string') {
      return {
        ...acc,
        [key]: `${routePath}${key === 'index' ? '' : value}`,
      };
    }

    return {
      ...acc,
      [key]: mapRoutesToParent(value, `${routePath}${value.index}`),
    };
  }, {});
};

export const useTenantRoutes = (): (typeof ROUTES)['tenant'] => {
  const tenantSlug = useRouteTenant();
  return useMemo(() => {
    return mapRoutesToParent(
      ROUTES.tenant,
      `/${tenantSlug ?? ''}`,
    ) as (typeof ROUTES)['tenant'];
  }, [tenantSlug]);
};

export const useGlobalRoutes = (): (typeof ROUTES)['global'] => {
  return useMemo(() => {
    return mapRoutesToParent(ROUTES.global, '/') as (typeof ROUTES)['global'];
  }, []);
};

export const usePlatformRoutes = (): (typeof ROUTES)['tenant'] &
  (typeof ROUTES)['global'] => {
  const tenantRoutes = useTenantRoutes();
  const globalRoutes = useGlobalRoutes();

  return {
    ...tenantRoutes,
    ...globalRoutes,
  };
};
