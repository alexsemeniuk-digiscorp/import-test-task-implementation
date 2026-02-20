import { resolvers, resolversConfig, schema } from '../models';

const readOnlyEntities = [
  'plugin::users-permissions.permission',
  'plugin::users-permissions.role',
  'plugin::upload.folder',
  'plugin::users-permissions.user',
];

const writeOnlyEntities = ['plugin::upload.folder'];
const schemaExtension: Graphql.ExtensionCallback = () => ({
  types: schema,
  resolvers,
  resolversConfig,
});

export { readOnlyEntities, schemaExtension, writeOnlyEntities };
