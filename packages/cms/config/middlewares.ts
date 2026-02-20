import { cspConfig, publicConfig } from '../src/hooks/config';

export default () => {
  return [
    { name: 'strapi::errors' },
    {
      name: 'strapi::security',
      config: cspConfig,
    },
    { name: 'strapi::logger' },
    {
      name: 'strapi::cors',
      config: {
        origin: ['*'],
        headers: [
          'Content-Type',
          'Authorization',
          'Origin',
          'Accept',
          'X-Pixel-Source',
          'X-Shopify-Api-Features',
          'X-Authorization',
        ],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        keepHeaderOnError: true,
      },
    },
    { name: 'strapi::query' },
    {
      name: 'strapi::body',
      config: {
        jsonLimit: '200mb', // increase only JSON limit
        formLimit: '200mb', // Add form limit if needed
        textLimit: '200mb', // Add text limit if needed
        // Important: Enable parsing for webhook payloads
        enableTypes: ['json', 'form', 'text', 'xml'],
      },
    },
    { name: 'strapi::favicon' },
    { name: 'global::website' },
    {
      name: 'strapi::public',
      config: publicConfig,
    },
    {
      name: 'strapi::session',
      config: {
        client: 'cookie',
        key: 'grant',
        maxAge: 86400000,
        overwrite: true,
        signed: true,
        rolling: false,
      },
    },
    { name: 'global::TokenPlacer' },
    { name: 'global::HppProtection' },
    { name: 'global::rateLimit' },
  ];
};
