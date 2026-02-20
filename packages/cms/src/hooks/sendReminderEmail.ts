interface MetaData {
  to: string;
  from?: string;
  replyTo?: string;
  attachments?: any[];
}

interface TemplateData {
  templateReferenceId: number;
  subject?: string;
}

interface SendEmailParams {
  meta: MetaData;
  templateData: TemplateData;
  variables?: object;
}

export const sendReminderEmail = async (params: SendEmailParams) => {
  try {
    const platform = await strapi.entityService.findOne(
      'api::platform.platform',
      1,
      {
        populate: ['logoPng'],
      },
    );

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
            name: platform?.name,
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
