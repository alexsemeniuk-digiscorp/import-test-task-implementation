import { join } from 'path';

import app, { randomSecret } from '../src/hooks';

export default ({ env }: Strapi.Env): Config.Plugin => {
  return {
    'slugify': {
      enabled: true,
      config: {
        contentTypes: {
          tenant: {
            field: 'slug',
            references: 'companyName',
          },
        },
        slugifyWithCount: true,
      },
    },
    'graphql': {
      enabled: true,
      config: {
        endpoint: '/graphql',
        depthLimit: 50,
        shadowCRUD: true,
        defaultLimit: 10,
        maxLimit: 100000,
        subscriptions: false,
        playgroundAlways: !app.env.production,
        generateArtifacts: app.env.development,
        artifacts: {
          schema: join(app.workingDir, 'src', 'graphql', 'schema.graphql'),
          typegen: join(
            app.workingDir,
            'src',
            'types',
            'generated',
            'graphql.d.ts',
          ),
        },
        apolloServer: {
          introspection: !app.env.production,
          cache: 'bounded',
          persistedQueries: {
            ttl: 3600,
          },
        },
      },
    },
    'users-permissions': {
      enabled: true,
      config: {
        jwtSecret: env('JWT_SECRET', randomSecret('JWT_SECRET')),
      },
    },
    'upload': {
      enabled: env('S3_ACCESS_KEY_ID') && env('S3_SECRET_ACCESS_KEY'),
      config: {
        provider: 'aws-s3',
        providerOptions: {
          s3Options: {
            accessKeyId: env('S3_ACCESS_KEY_ID'),
            secretAccessKey: env('S3_SECRET_ACCESS_KEY'),
            endpoint: env('S3_ENDPOINT'),
            params: {
              Bucket: `${env('S3_BUCKET', 'bn-dev')}/${app.name}/uploads`,
            },
          },
        },
      },
    },
    'email': env('SMTP_HOST')
      ? {
          enabled: env('SMTP_USERNAME') && env('SMTP_PASSWORD'),
          config: {
            provider: 'nodemailer',
            providerOptions: {
              host: env('SMTP_HOST', 'smtp.eu.mailgun.org'),
              port: env.int('SMTP_PORT', 587),
              auth: {
                user: env('SMTP_USERNAME'),
                pass: env('SMTP_PASSWORD'),
              },
            },
            settings: {
              defaultFrom: env('SMTP_MAIL_FROM', `no-reply@${app.domain}`),
              defaultReplyTo: env('SMTP_MAIL_TO', `no-reply@${app.domain}`),
            },
          },
        }
      : {
          enabled: true,
          config: {
            provider: 'mailgun',
            providerOptions: {
              key: env('MAILGUN_KEY'),
              domain: env('MAILGUN_DOMAIN'),
            },
            settings: {
              defaultFrom: `no-reply@${app.domain}`,
              defaultReplyTo: env('MAILGUN_SENDER', `no-reply@${app.domain}`),
            },
          },
        },
    'email-designer': {
      enabled: true,
      config: {
        appearance: {
          theme: 'dark',
          panels: {
            tools: {
              dock: 'left',
            },
          },
        },
      },
    },
    'field-uuid': {
      enabled: true,
    },
    'encryptable-field': {
      enabled: true,
    },
  };
};
