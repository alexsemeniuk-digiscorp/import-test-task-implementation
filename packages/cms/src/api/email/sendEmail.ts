import { ID } from '@strapi/strapi/lib/services/entity-service/types/params/attributes';
import { GraphQLResolveInfo } from 'graphql';
import { updateUsageCounts } from '../../graphql/models/usage/resolvers/updateUsageCounts';

interface MetaData {
  to: string;
  from?: string;
  replyTo?: string;
  attachments?: any[];
}

interface TemplateData {
  templateReferenceId: number;
  subject?: string;
  employeeName?: string;
  tenant?: string;
}

type EmailVariables = Record<string, any>;

interface SendEmailParams {
  meta: MetaData;
  templateData: TemplateData;
  variables?: EmailVariables;
}

export const sendEmail = async (params: SendEmailParams, tenantId: ID) => {
  const ctx = strapi.requestContext.get();
  const info: GraphQLResolveInfo = ctx.state.graphqlInfo as GraphQLResolveInfo;

  try {
    const platform: any = await strapi.entityService.findMany(
      'api::platform.platform',
      {
        populate: ['logoPng'],
      },
    );

    // Attempt to update usage counts
    if (ctx?.state && ctx?.state?.user && ctx?.state?.user?.id) {
      const updateUsage = await updateUsageCounts(
        null,
        {
          input: {
            serviceType: 'monthlyEmailCount',
            serviceCharge: 'emailCharge',
          },
        },
        ctx,
        info,
      );

      if (!updateUsage) {
        throw new Error('Usage update failed');
      }
    }

    await strapi
      .plugin('email-designer')
      .service('email')
      .sendTemplatedEmail(
        {
          ...params.meta,
        },
        {
          ...params.templateData,
        },
        {
          PLATFORM: {
            name: platform?.name || 'Vertical SaaS',
            logoUrl: platform?.logoPng?.url,
            address: platform?.address,
          },
          ...params.variables,
        },
      );
  } catch (error) {
    throw new Error(`Error sending email: ${error.message}`);
  }
};
