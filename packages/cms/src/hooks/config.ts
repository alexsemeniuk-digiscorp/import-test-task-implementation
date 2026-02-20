import { createHmac } from 'crypto';

const generateSecret: (secretName: string, namespace: string) => string = (
  secretName,
  namespace,
) => {
  return createHmac('sha3-256', namespace).update(secretName).digest('hex');
};

const devUrls =
  process.env.NODE_ENV === 'development'
    ? [
        'http://localhost:1337',
        'http://localhost:8080',
        'http://127.0.0.1:1337',
        'http://127.0.0.1:8080',
      ]
    : [];

const cspDirectives = {
  'default-src': ["'self'", 'wss://flex.twilio.com'],
  'script-src': [
    "'self'",
    "'unsafe-inline'",
    'https://editor.unlayer.com',
    'https://maps.googleapis.com',
    'https://maps.gstatic.com',
    'https://www.google-analytics.com',
    'https://www.googletagmanager.com',
    'https://www.google.com',
    'https://www.gstatic.com',
    'https://cdn.jsdelivr.net',
    'https://www.datadoghq-browser-agent.com',
    'https://js.stripe.com/v3',
    'https://cdn.tiny.cloud',
    'https://hpp-sb.clearent.net', // Clearent - remove -sb for production
    'https://hpp.clearent.net',
    'https://js.stripe.com',
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'",
    'https://fonts.googleapis.com',
    'https://hpp-sb.clearent.net', // Clearent - remove -sb for production
    'https://hpp.clearent.net',
    'https://cdn.jsdelivr.net',
    'https://cdn.tiny.cloud',
    'https://maps.gstatic.com',
    'https://www.gstatic.com',
    'https://cdn.rawgit.com',
  ],
  'connect-src': [
    "'self'",
    'blob:',
    `${process.env.FRONTEND_URL}`,
    `${process.env.VITE_FRONTED_URL}`,
    ...devUrls,
    ...(process.env.S3_PUBLIC_URL ? [process.env.S3_PUBLIC_URL] : []),
    'https://caratiqdemo.s3.us-east-2.amazonaws.com',
    'wss://tsock.us1.twilio.com',
    'wss://eventgw.us1.twilio.com',
    'https://media.twiliocdn.com',
    'wss://flex.twilio.com',
    'https://maps.googleapis.com',
    'https://api.github.com',
    'https://*.github.com',
    'https://*.githubusercontent.com',
    'https://s3.amazonaws.com',
    'https://*.s3.amazonaws.com',
    'https://test-bulk-importing.s3.us-east-2.amazonaws.com',
    'https://test-images-mass.s3.us-east-2.amazonaws.com',
    'https://caratiqdemo.s3.us-east-2.amazonaws.com',
    'https://test-bulk-importing.s3.us-east-2.amazonaws.com',
    'https://test-images-mass.s3.us-east-2.amazonaws.com',
    'https://caratiqdemo.s3.us-east-2.amazonaws.com',
    'https://test-bulk-importing.s3.us-east-2.amazonaws.com',
    'https://test-images-mass.s3.us-east-2.amazonaws.com',
    'https://cdnjs.cloudflare.com',
    'https://hpp-sb.clearent.net', // Clearent - remove -sb for production
    'https://gateway-sb.clearent.net', // Clearent - remove -sb for production
    'https://hpp.clearent.net',
    'https://gateway.clearent.net',
    'https://maps.gstatic.com',
    'https://www.gstatic.com',
    'https://cdn.jsdelivr.net',
    'https://cdn.tiny.cloud',
    'https://us1.pdfgeneratorapi.com',
    'https://www.googletagmanager.com',
    'https://www.google-analytics.com',
    'https://browser-intake-us5-datadoghq.com',
    'https://*.datadoghq.com',
    'https://session-replay-datadoghq.com',
    'https://api.stripe.com',
    'https://m.stripe.network',
    'https://www.google.com/recaptcha/',
    'wss://voice-js.roaming.twilio.com',
    'https://sdk.twilio.com',
    'https://eventgw.us1.twilio.com',
    'https://api.twilio.com',
    'https://media.twiliocdn.com/',
  ],
  'img-src': [
    "'self'",
    'data:',
    'blob:',
    ...(process.env.S3_PUBLIC_URL ? [process.env.S3_PUBLIC_URL] : []),
    'https://caratiqdemo.s3.us-east-2.amazonaws.com',
    'https://bn-dev.fra1.digitaloceanspaces.com', // TODO move to .env
    'https://s3.amazonaws.com',
    'https://*.s3.amazonaws.com', // TODO is it needed?
    'https://cdn.caratiqdemo.com/', // TODO move to .env
    'https://cdn.caratiqapp.com/', // TODO move to .env
    'https://cdnjs.cloudflare.com',
    'https://maps.googleapis.com',
    'https://hpp-sb.clearent.net', // Clearent - remove -sb for production
    'https://hpp.clearent.net',
    'https://sp.tinymce.com',
    'https://maps.gstatic.com',
    'https://*.datadoghq.com',
    'https://www.gstatic.com',
    'https://cdn.jsdelivr.net',
    'https://www.googletagmanager.com',
    'https://www.google-analytics.com',
    'https://js.stripe.com',
    'https://editor.unlayer.com/',
    'https://lookaside.fbsbx.com',
    'https://*.fbcdn.net',
  ],
  'font-src': [
    "'self'",
    'blob:',
    'https://fonts.gstatic.com',
    'https://hpp-sb.clearent.net', // Clearent - remove -sb for production
    'https://hpp.clearent.net',
    'https://cdn.jsdelivr.net',
  ],
  'frame-src': [
    "'self'",
    'blob:',
    'https://js.stripe.com',
    'https://checkout.stripe.com',
    'https://www.google.com',
    'https://www.google.com/recaptcha/',
    'https://editor.unlayer.com/',
  ],
  'media-src': [
    "'self'",
    ...(process.env.S3_PUBLIC_URL ? [process.env.S3_PUBLIC_URL] : []),
  ],
  'worker-src': ["'self'", 'blob:'],
  'object-src': ["'none'"],
  'form-action': ["'self'"],
  'base-uri': ["'self'"],
};

const publicConfig = { defer: true };

const cspConfig = {
  contentSecurityPolicy: {
    useDefaults: false,
    directives: {
      upgradeInsecureRequests: null,
      ...cspDirectives,
    },
  },
};

export { cspConfig, cspDirectives, generateSecret, publicConfig };
