import { GraphQLFieldResolver } from 'graphql';
import { CreateNewRoleInput } from '../user.types';

export const createNewRole: GraphQLFieldResolver<
  null,
  Graphql.ResolverContext,
  { input: CreateNewRoleInput }
> = async (root, args, ctx) => {
  const { tenantId, role, description } = args.input;

  const permissions = await strapi.entityService.findMany(
    'api::custom-permission.custom-permission',
    {
      filters: {
        tenant: {
          id: {
            $eq: tenantId,
          },
        },
      },
    },
  );

  const currentPermissions = permissions?.[0]?.permissions;

  if (Object.keys(currentPermissions).includes(role.toLowerCase())) {
    throw new Error('Custom: You already have this role');
  }

  const userRole = await strapi.entityService.create(
    'plugin::users-permissions.role',
    {
      data: {
        name: role,
        description,
      },
    },
  );

  const currentRole = await strapi
    .service('plugin::users-permissions.role')
    .findOne(userRole.id);

  // Enable all permissions for email plugin
  currentRole.permissions['plugin::email'].controllers['email'].send.enabled =
    true;

  // Enable all permissions for user permissions plugin
  currentRole.permissions['plugin::users-permissions'].controllers[
    'auth'
  ].callback.enabled = true;
  currentRole.permissions['plugin::users-permissions'].controllers[
    'auth'
  ].changePassword.enabled = true;
  currentRole.permissions['plugin::users-permissions'].controllers[
    'auth'
  ].connect.enabled = true;
  currentRole.permissions['plugin::users-permissions'].controllers[
    'auth'
  ].emailConfirmation.enabled = true;
  currentRole.permissions['plugin::users-permissions'].controllers[
    'auth'
  ].forgotPassword.enabled = true;
  currentRole.permissions['plugin::users-permissions'].controllers[
    'auth'
  ].register.enabled = true;
  currentRole.permissions['plugin::users-permissions'].controllers[
    'auth'
  ].resetPassword.enabled = true;
  currentRole.permissions['plugin::users-permissions'].controllers[
    'auth'
  ].sendEmailConfirmation.enabled = true;
  currentRole.permissions['plugin::users-permissions'].controllers[
    'permissions'
  ].getPermissions.enabled = true;
  currentRole.permissions['plugin::users-permissions'].controllers[
    'role'
  ].createRole.enabled = true;
  currentRole.permissions['plugin::users-permissions'].controllers[
    'role'
  ].deleteRole.enabled = true;
  currentRole.permissions['plugin::users-permissions'].controllers[
    'role'
  ].find.enabled = true;
  currentRole.permissions['plugin::users-permissions'].controllers[
    'role'
  ].findOne.enabled = true;
  currentRole.permissions['plugin::users-permissions'].controllers[
    'role'
  ].updateRole.enabled = true;
  currentRole.permissions['plugin::users-permissions'].controllers[
    'user'
  ].count.enabled = true;
  currentRole.permissions['plugin::users-permissions'].controllers[
    'user'
  ].create.enabled = true;
  currentRole.permissions['plugin::users-permissions'].controllers[
    'user'
  ].destroy.enabled = true;
  currentRole.permissions['plugin::users-permissions'].controllers[
    'user'
  ].find.enabled = true;
  currentRole.permissions['plugin::users-permissions'].controllers[
    'user'
  ].findOne.enabled = true;
  currentRole.permissions['plugin::users-permissions'].controllers[
    'user'
  ].me.enabled = true;
  currentRole.permissions['plugin::users-permissions'].controllers[
    'user'
  ].update.enabled = true;

  // Enable all permissions for upload plugin
  currentRole.permissions['plugin::upload'].controllers[
    'content-api'
  ].find.enabled = true;
  currentRole.permissions['plugin::upload'].controllers[
    'content-api'
  ].findOne.enabled = true;
  currentRole.permissions['plugin::upload'].controllers[
    'content-api'
  ].upload.enabled = true;
  currentRole.permissions['plugin::upload'].controllers[
    'content-api'
  ].destroy.enabled = true;

  // Iterate over all api content-types
  Object.keys(currentRole.permissions)
    .filter((permission) => permission.startsWith('api'))
    .forEach((permission) => {
      const controller = Object.keys(
        currentRole.permissions[permission].controllers,
      )[0];

      // Enable find permissions for current role
      if (currentRole.permissions[permission].controllers[controller].find) {
        currentRole.permissions[permission].controllers[
          controller
        ].find.enabled = true;
      }

      // Enable findOne permissions for current role
      if (currentRole.permissions[permission].controllers[controller].findOne) {
        currentRole.permissions[permission].controllers[
          controller
        ].findOne.enabled = true;
      }

      // Enable create permissions for current role
      if (currentRole.permissions[permission].controllers[controller].create) {
        currentRole.permissions[permission].controllers[
          controller
        ].create.enabled = true;
      }

      // Enable update permissions for current role
      if (currentRole.permissions[permission].controllers[controller].update) {
        currentRole.permissions[permission].controllers[
          controller
        ].update.enabled = true;
      }

      // Enable delete permissions for current role
      if (currentRole.permissions[permission].controllers[controller].delete) {
        currentRole.permissions[permission].controllers[
          controller
        ].delete.enabled = true;
      }
    });

  currentRole.permissions['api::twilio'].controllers[
    'twilio'
  ].generateToken.enabled = true;
  currentRole.permissions['api::twilio'].controllers[
    'twilio'
  ].handleStatus.enabled = true;
  currentRole.permissions['api::twilio'].controllers[
    'twilio'
  ].handleVoice.enabled = true;

  await strapi
    .service('plugin::users-permissions.role')
    .updateRole(currentRole.id, currentRole);

  await strapi.entityService.update(
    'api::custom-permission.custom-permission',
    permissions?.[0]?.id,
    {
      data: {
        permissions: {
          ...currentPermissions,
          [userRole.name.toLowerCase()]: currentPermissions['owner'],
        },
      },
    },
  );

  return true;
};
