/**
 * task controller
 */
import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::task.task',
  ({ strapi }) => ({
    async getTaskOpenApiController(ctx) {
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

        const { pageSize = 100, page = 1 } = ctx.query;

        const tasks = await strapi.entityService.findMany('api::task.task', {
          filters: {
            tenant: {
              id: {
                $eq: owner?.tenant?.id,
              },
            },
          },
          populate: [
            'contact',
            'assignees',
            'company',
            'lead',
            'taskLocation',
            'taskType',
            'forCompanies',
            'approvalMethods',
            'order',
            'taskStage',
            'businessLocation',
            'transitingTo',
            'currentVendor',
            'serviceOrderItem',
            'files',
            'activity',
          ],
          sort: [{ id: 'desc' }],
          limit: parseInt(pageSize),
          start: (parseInt(page) - 1) * parseInt(pageSize),
        });

        ctx.body = {
          status: 200,
          message: 'Task fetched successfully!',
          data: tasks,
        };
      } catch (error) {
        ctx.body = {
          status: 500,
          error,
          message: 'Internal server error',
        };
      }
    },
    async createTaskOpenApiController(ctx) {
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

        const taskRequest = ctx?.request?.body;

        const name = taskRequest?.name;
        const description = taskRequest?.description;
        const note = taskRequest?.note;
        const dueDate = taskRequest?.dueDate
          ? new Date(taskRequest?.dueDate)
          : null;
        const priority = taskRequest?.priority;
        const appointmentDate = taskRequest?.appointmentDate
          ? new Date(taskRequest?.appointmentDate)
          : null;
        const completed = taskRequest?.completed ?? false;
        const approvalDueDate = taskRequest?.approvalDueDate
          ? new Date(taskRequest?.approvalDueDate)
          : null;
        const approval = taskRequest?.approval ?? false;
        const completedDate = taskRequest?.completedDate
          ? new Date(taskRequest?.completedDate)
          : null;

        // New inputs: assignee emails and either contact/company email
        const assigneesEmailsInput =
          taskRequest?.assigneesEmails ?? taskRequest?.assignees;
        const contact_email = taskRequest?.contact_email;
        const company_email = taskRequest?.company_email;

        // Normalize assignee emails to always be an array of strings
        const assigneeEmails: string[] = Array.isArray(assigneesEmailsInput)
          ? (assigneesEmailsInput || []).filter(Boolean)
          : [assigneesEmailsInput].filter(Boolean);

        // Validate either contact_email or company_email (not both, not neither)
        if (
          (!contact_email && !company_email) ||
          (contact_email && company_email)
        ) {
          return (ctx.body = {
            status: 400,
            message: 'Provide either contact_email or company_email, not both',
          });
        }

        // Validate that assignee emails are provided
        if (!assigneeEmails || assigneeEmails.length === 0) {
          return (ctx.body = {
            status: 400,
            message: 'At least one assignee email is required',
          });
        }

        // Resolve assignees by email within tenant
        const foundAssignees = await strapi.db
          .query('plugin::users-permissions.user')
          .findMany({
            where: {
              email: { $in: assigneeEmails },
              tenant: { id: { $eq: owner?.tenant?.id } },
            },
            select: ['id', 'email'],
          });

        const foundAssigneeEmails = new Set(foundAssignees.map((u) => u.email));
        const missingAssignees = assigneeEmails.filter(
          (e) => !foundAssigneeEmails.has(e),
        );

        if (missingAssignees.length > 0) {
          return (ctx.body = {
            status: 404,
            message: `Assignees not found for emails: ${missingAssignees.join(
              ', ',
            )}`,
          });
        }

        // Resolve contact/company by email within tenant
        let contact_id: number | null = null;
        let company_id: number | null = null;

        if (contact_email) {
          const contact = await strapi.db
            .query('api::contact.contact')
            .findOne({
              where: {
                email: { $eq: contact_email },
                tenant: { id: { $eq: owner?.tenant?.id } },
              },
              select: ['id', 'email'],
            });

          if (!contact) {
            return (ctx.body = {
              status: 404,
              message: `Contact not found for email: ${contact_email}`,
            });
          }
          contact_id = contact.id as unknown as number;
        }

        if (company_email) {
          const company = await strapi.db
            .query('api::company.company')
            .findOne({
              where: {
                email: { $eq: company_email },
                tenant: { id: { $eq: owner?.tenant?.id } },
              },
              select: ['id', 'email'],
            });

          if (!company) {
            return (ctx.body = {
              status: 404,
              message: `Company not found for email: ${company_email}`,
            });
          }
          company_id = company.id as unknown as number;
        }

        // Create task with resolved IDs
        const response = await strapi.entityService.create('api::task.task', {
          data: {
            name,
            description,
            note,
            dueDate,
            priority,
            appointmentDate,
            completed,
            approvalDueDate,
            approval,
            completedDate,
            assignees: foundAssignees.map((u) => u.id),
            tenant: owner?.tenant?.id,
            contact: contact_id,
            company: company_id,
          },
        });

        ctx.body = {
          status: 200,
          message: 'Task created successfully!',
          data: response,
        };
      } catch (error) {
        ctx.body = {
          status: 500,
          error,
          message: 'Internal server error',
        };
      }
    },
    async getTaskByIdOpenApiController(ctx) {
      try {
        const { id } = ctx.query;
        if (!id) {
          return ctx.badRequest('Id is required');
        }
        const task = await strapi.entityService.findOne('api::task.task', id, {
          populate: [
            'contact',
            'assignees',
            'company',
            'lead',
            'taskLocation',
            'taskType',
            'forCompanies',
            'approvalMethods',
            'order',
            'taskStage',
            'businessLocation',
            'transitingTo',
            'currentVendor',
            'serviceOrderItem',
            'files',
            'activity',
          ],
        });
        if (!task) {
          ctx.body = {
            status: 200,
            message: 'Task not found',
            data: null,
            found: false,
          };
          return;
        }
        ctx.body = {
          status: 200,
          message: 'Task fetched successfully!',
          data: task,
          found: true,
        };
      } catch (error) {
        ctx.body = {
          status: 500,
          error,
          message: 'Internal server error',
        };
      }
    },
  }),
);
