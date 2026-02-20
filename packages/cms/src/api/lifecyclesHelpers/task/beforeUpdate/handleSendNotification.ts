import { handleError, handleLogger } from '../../../../graphql/helpers/errors';
import { getFirstName } from '../../../../graphql/helpers/getFirstName';
import {
  emailReplyTo,
  emailSender,
  smsSender,
} from '../../../../graphql/models/helpers/email';
import { sendEmail } from '../../../email/sendEmail';
import { TwilioService } from '../../../twilio/TwilioService';

import BeforeLifecycleEvent = Database.BeforeLifecycleEvent;

interface TaskStageNotificationConfig {
  stageId: string;
  stageName: string;
  autoSendEmail: boolean;
  autoSendSMS: boolean;
}

export const handleSendNotification = async (
  event: BeforeLifecycleEvent,
  task,
) => {
  handleLogger(
    'info',
    'Lifecycle Helpers :: handleSendNotification',
    `Params: ${JSON.stringify(event.params)}`,
  );

  try {
    const newTaskStageId = event?.params?.data?.taskStage;

    if (!newTaskStageId) {
      handleLogger(
        'info',
        'handleSendNotification',
        'Task stage not in update params, skipping notification',
      );
      return;
    }

    const fullTask = await strapi.entityService.findOne(
      'api::task.task',
      task.id,
      {
        populate: {
          tenant: {
            populate: {
              logo: true,
              emailSender: true,
              mainLocation: true,
            },
          },
          contact: true,
          lead: true,
          company: true,
          taskStage: {
            fields: ['id', 'name'],
          },
        },
      },
    );

    const currentTaskStageId = fullTask?.taskStage?.id;

    if (
      currentTaskStageId &&
      String(currentTaskStageId) === String(newTaskStageId)
    ) {
      handleLogger(
        'info',
        'handleSendNotification',
        `Task stage not changing (current: ${currentTaskStageId}, new: ${newTaskStageId}), skipping notification`,
      );
      return;
    }

    handleLogger(
      'info',
      'handleSendNotification',
      `Task stage changing from ${
        currentTaskStageId || 'none'
      } to ${newTaskStageId}`,
    );

    if (!fullTask?.tenant?.id) {
      handleLogger(
        'info',
        'handleSendNotification',
        'No tenant found for task, skipping notification',
      );
      return;
    }

    const taskSettings = await strapi.entityService.findMany(
      'api::settings-task.settings-task',
      {
        filters: {
          tenant: {
            id: {
              $eq: fullTask.tenant.id,
            },
          },
        },
        limit: 1,
      },
    );

    if (!taskSettings || taskSettings.length === 0) {
      handleLogger(
        'info',
        'handleSendNotification',
        'No task settings found for tenant, skipping notification',
      );
      return;
    }

    const config = taskSettings[0]?.config as TaskStageNotificationConfig[];

    if (!Array.isArray(config)) {
      handleLogger(
        'info',
        'handleSendNotification',
        'Invalid config format, skipping notification',
      );
      return;
    }

    const stageConfig = config.find(
      (item) => item.stageId === String(newTaskStageId),
    );

    if (!stageConfig) {
      handleLogger(
        'info',
        'handleSendNotification',
        `No notification config found for stage ${newTaskStageId}`,
      );
      return;
    }

    handleLogger(
      'info',
      'handleSendNotification',
      `Stage config: Email=${stageConfig.autoSendEmail}, SMS=${stageConfig.autoSendSMS}`,
    );

    let recipientEmail: string;
    let recipientPhone: string;
    let recipientName: string;
    let recipientType: string;

    if (fullTask.contact) {
      recipientEmail = fullTask.contact.email;
      recipientPhone = fullTask.contact.phoneNumber;
      recipientName = fullTask.contact.fullName;
      recipientType = 'contact';
    } else if (fullTask.lead) {
      recipientEmail = fullTask.lead.email;
      recipientPhone = fullTask.lead.phoneNumber;
      recipientName = fullTask.lead.fullName;
      recipientType = 'lead';
    } else if (fullTask.company) {
      recipientEmail = fullTask.company.email;
      recipientPhone = fullTask.company.phoneNumber;
      recipientName = fullTask.company.name;
      recipientType = 'company';
    } else {
      handleLogger(
        'info',
        'handleSendNotification',
        'No contact, lead, or company found for task, skipping notification',
      );
      return;
    }

    handleLogger(
      'info',
      'handleSendNotification',
      `Recipient: ${recipientName} (${recipientType}), Email: ${recipientEmail}, Phone: ${recipientPhone}`,
    );

    if (stageConfig.autoSendEmail && recipientEmail) {
      try {
        handleLogger(
          'info',
          'handleSendNotification',
          `Sending email notification to ${recipientEmail}`,
        );

        await sendEmail(
          {
            meta: {
              to: recipientEmail,
              from: emailSender(fullTask?.tenant?.emailSender),
              replyTo: emailReplyTo(fullTask?.tenant?.email),
            },
            templateData: {
              templateReferenceId: 21,
            },
            variables: {
              STAGE_NAME: stageConfig.stageName,
              USER_NAME: getFirstName(recipientName),
              COMPANY_NAME: fullTask?.tenant?.companyName,
              EMAIL_SENDER: smsSender(fullTask?.tenant?.emailSender),
              TENANT_LOGO: fullTask?.tenant?.logo?.url ?? '',
              TENANT_LOCATION:
                `${fullTask?.tenant?.mainLocation?.address}, ${fullTask?.tenant?.mainLocation?.zipcode}` ??
                '',
            },
          },
          fullTask.tenant.id,
        );

        handleLogger(
          'info',
          'handleSendNotification',
          `Email sent successfully to ${recipientEmail}`,
        );
      } catch (error) {
        handleError(
          'handleSendNotification',
          `Failed to send email: ${error.message}`,
          error,
        );
      }
    } else if (stageConfig.autoSendEmail && !recipientEmail) {
      handleLogger(
        'info',
        'handleSendNotification',
        `Email notification enabled but no email found for ${recipientType}`,
      );
    }

    if (stageConfig.autoSendSMS && recipientPhone) {
      try {
        handleLogger(
          'info',
          'handleSendNotification',
          `Sending SMS notification to ${recipientPhone}`,
        );

        const twilioConnection = await strapi.entityService.findMany(
          'api::twilio-connection.twilio-connection',
          {
            filters: {
              tenant: {
                id: {
                  $eq: fullTask.tenant.id,
                },
              },
            },
            limit: 1,
          },
        );

        if (!twilioConnection || twilioConnection.length === 0) {
          handleLogger(
            'info',
            'handleSendNotification',
            'No Twilio connection found, skipping SMS',
          );
        } else {
          const twilioClient = new TwilioService(
            '',
            twilioConnection[0].accountSid,
          );

          const smsMessage = `Hello ${getFirstName(
            recipientName,
          )}, your order is now in the "${
            stageConfig.stageName
          }" stage.\n${smsSender(fullTask?.tenant?.emailSender)}`;

          await twilioClient.sendSMS({
            body: smsMessage,
            clientNumber: recipientPhone,
            twilioNumber: twilioConnection[0].phoneNumber,
          });

          handleLogger(
            'info',
            'handleSendNotification',
            `SMS sent successfully to ${recipientPhone}`,
          );
        }
      } catch (error) {
        handleError(
          'handleSendNotification',
          `Failed to send SMS: ${error.message}`,
          error,
        );
      }
    } else if (stageConfig.autoSendSMS && !recipientPhone) {
      handleLogger(
        'info',
        'handleSendNotification',
        `SMS notification enabled but no phone number found for ${recipientType}`,
      );
    }

    handleLogger(
      'info',
      'handleSendNotification',
      'Notification handling completed',
    );
  } catch (error) {
    handleError(
      'handleSendNotification',
      `Error in notification handler: ${error.message}`,
      error,
    );
  }
};
