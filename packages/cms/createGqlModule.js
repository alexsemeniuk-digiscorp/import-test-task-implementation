const fs = require('fs');
const fs1 = require('fs/promises');
// eslint-disable-next-line node/no-unpublished-require
const commandLineArgs = require('command-line-args');

const validateType = (type) => {
  if (!['common', 'platform', 'customer'].includes(type)) {
    throw new Error(
      'Invalid type, choose one of the following: common, platform, customer',
    );
  }

  return type;
};

const optionDefinitions = [
  { name: 'name', alias: 'n', type: String, required: true }, // e.g. --name=user or -n user (required)
  { name: 'plural', alias: 'p', type: String }, // e.g. --plural=users or -p users (optional)
  { name: 'createQueries', alias: 'q', type: Boolean }, // will create queries files (e.g. user.graphql, users.graphql)
  { name: 'createMutations', alias: 'm', type: Boolean }, // will create mutations files (e.g. createUser.graphql, updateUser.graphql, deleteUser.graphql)
  { name: 'createFragments', alias: 'f', type: Boolean }, // will create fragments files (e.g. User.graphql)
  { name: 'createAllFiles', alias: 'a', type: Boolean }, // will create all files (queries, mutations, fragments)
  { name: 'type', alias: 't', type: validateType, defaultValue: 'common' }, // one of the types (common, platform, customer)
];

const {
  name,
  plural = `${name}s`,
  createQueries,
  createMutations,
  createFragments,
  createAllFiles,
  type,
} = commandLineArgs(optionDefinitions);

const shouldCreateQueries = createQueries || createAllFiles;
const shouldCreateMutations = createMutations || createAllFiles;
const shouldCreateFragments = createFragments || createAllFiles;

const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);

const fragment = shouldCreateFragments ? `...${capitalizedName}` : 'id';

const getSingleQuery = () =>
  `query ${name}($id: ID!) {
  ${name}(id: $id) {
    data {
      ${fragment}
    }
  }
}
`;

const getListQuery = () =>
  `query ${plural}(
  $filters: ${capitalizedName}FiltersInput
  $pagination: PaginationArg
  $sort: [String]
) {
  ${plural}(filters: $filters, pagination: $pagination, sort: $sort) {
    data {
      ${fragment}
    }
    meta {
      ...Meta
    }
  }
}
`;

const getCreateMutation = () =>
  `mutation create${capitalizedName}($input: ${capitalizedName}Input!) {
  create${capitalizedName}(data: $input) {
    data {
      ${fragment}
    }
  }
}
`;

const getUpdateMutation = () =>
  `mutation update${capitalizedName}($id: ID!, $input: ${capitalizedName}Input!) {
  update${capitalizedName}(id: $id, data: $input) {
    data {
      ${fragment}
    }
  }
}
`;

const getDeleteMutation = () =>
  `mutation delete${capitalizedName}($id: ID!) {
  delete${capitalizedName}(id: $id) {
    data {
      ${fragment}
    }
  }
}
`;

const getMinFragment = () =>
  `fragment ${capitalizedName}Min on ${capitalizedName}Entity {
  id
  attributes {
    createdAt
  }
}
`;
const getFullFragment = () =>
  `fragment ${capitalizedName} on ${capitalizedName}Entity {
  ...${capitalizedName}Min
  id
  attributes {
    createdAt
  }
}
`;

const baseDirName = `./src/graphql/client/${name}`;

const createFolder = async (path, name) => {
  const isExists = fs.existsSync(path);

  if (isExists) {
    console.log(`${name} folder already exists, skipping creation`);

    return;
  }

  return fs1.mkdir(path);
};

const createFile = async (path, name, content) => {
  const pathWithExtAndType = `${path}.${type}.graphql`;
  const isExists = fs.existsSync(pathWithExtAndType);

  if (isExists) {
    console.log(`${name} file already exists, skipping creation`);

    return;
  }

  return fs1.writeFile(pathWithExtAndType, content);
};

const runScript = async () => {
  await createFolder(baseDirName, 'Base');

  await createFolder(`${baseDirName}/${name}.queries`, `Queries`);

  if (shouldCreateQueries) {
    await createFile(
      `${baseDirName}/${name}.queries/${name}`,
      'Single query',
      getSingleQuery(),
    );

    await createFile(
      `${baseDirName}/${name}.queries/${plural}`,
      'List query',
      getListQuery(),
    );
  }

  await createFolder(`${baseDirName}/${name}.mutations`, `Mutations`);

  if (shouldCreateMutations) {
    await createFile(
      `${baseDirName}/${name}.mutations/create${capitalizedName}`,
      `Create mutation`,
      getCreateMutation(),
    );

    await createFile(
      `${baseDirName}/${name}.mutations/update${capitalizedName}`,
      `Update mutation`,
      getUpdateMutation(),
    );

    await createFile(
      `${baseDirName}/${name}.mutations/delete${capitalizedName}`,
      `Delete mutation`,
      getDeleteMutation(),
    );
  }

  await createFolder(`${baseDirName}/${name}.fragments`, `Fragments`);

  if (shouldCreateFragments) {
    await createFile(
      `${baseDirName}/${name}.fragments/${capitalizedName}`,
      `Full fragment`,
      getFullFragment(),
    );

    await createFile(
      `${baseDirName}/${name}.fragments/${capitalizedName}Min`,
      `Min fragment`,
      getMinFragment(),
    );
  }
};

runScript();
