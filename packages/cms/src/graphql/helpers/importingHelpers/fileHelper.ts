import {
  createEntityFromBuffer,
  processAndUploadCreations,
  streamToBuffer,
  uploadEntity,
} from './../fileHelpers';

export const handleCsvUpload = async (
  inputFile,
  config,
  userId,
  tenantFilter,
) => {
  if (!inputFile) {
    throw new Error('No file uploaded');
  }

  const file = await inputFile;
  const readStream = file.createReadStream();
  const buffer = await streamToBuffer(readStream);

  const entity = createEntityFromBuffer(file, buffer, config, {
    userId,
    tenantId: tenantFilter?.tenant,
  });

  return uploadEntity(entity);
};

export const createImportingSession = async (
  generatedRegex,
  resFileId,
  importingType,
  tenantId,
  userId,
) => {
  return await strapi.entityService.create(
    'api::importing-session.importing-session',
    {
      data: {
        tenant: tenantId,
        type: importingType,
        regexedId: generatedRegex,
        srcFile: resFileId,
        uploadedBy: userId,
      },
    },
  );
};

export const processAndUpdateImports = async (
  processFieldsImport,
  sessionId,
  spoiledCreations,
  completedCreations,
  needChangeCreations = null,
  options,
  config,
  tenantFilter,
) => {
  const generateReport = async (creations, filename) => {
    return await processAndUploadCreations(processFieldsImport, {
      creations,
      options,
      filename,
      config,
      tenantFilter,
    });
  };
  const spoiledFileId = await generateReport(
    spoiledCreations,
    'Generated Error Report',
  );

  const updatedFileId = await generateReport(
    needChangeCreations,
    'Generated Updating Report',
  );
  const completedFileId = await generateReport(
    completedCreations,
    'Generated Imported Report',
  );

  const updateData = {
    splImports: spoiledFileId ?? null,
    cmpltdImports: completedFileId ?? null,
    updImports: updatedFileId ?? null,
    state: 'completed' as 'completed' | 'progressing' | 'error',
  };

  await strapi.entityService.update(
    'api::importing-session.importing-session',
    sessionId,
    { data: updateData },
  );
};
