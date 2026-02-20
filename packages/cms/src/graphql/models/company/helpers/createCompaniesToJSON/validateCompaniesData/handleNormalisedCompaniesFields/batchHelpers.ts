import { DEFAULT_EMAIL } from '../../../../../../constants/defaultValues';
import { handleError } from '../../../../../../helpers/errors';
import { stringNormalizer } from '../../../../../../helpers/formatter';

export const batchFindCompanies = async (
  normalizedFields: any[],
  tenantId: number,
): Promise<Map<string, any>> => {
  // Collect all unique company emails, excluding DEFAULT_EMAIL
  const companyEmails = Array.from(
    new Set(
      normalizedFields
        .map((company) => company?.email)
        .filter(Boolean)
        .filter(
          (email) =>
            stringNormalizer(email) !== stringNormalizer(DEFAULT_EMAIL),
        )
        .map((email) => stringNormalizer(email)),
    ),
  );

  if (companyEmails.length === 0) {
    return new Map();
  }

  try {
    // Single batch query for all companies
    const companies = await strapi.entityService.findMany(
      'api::company.company',
      {
        filters: {
          email: { $in: companyEmails },
          tenant: { id: { $eq: tenantId } },
        },
        fields: ['id', 'email', 'uuid'],
      },
    );

    const companiesMap = new Map<string, any>();

    if (Array.isArray(companies)) {
      companies.forEach((company) => {
        if (company.email) {
          companiesMap.set(stringNormalizer(company.email), company);
        }
      });
    }

    return companiesMap;
  } catch (error) {
    handleError('batchFindCompanies', undefined, error);
    return new Map();
  }
};

export const batchFindAvatarFiles = async (
  normalizedFields: any[],
): Promise<Map<string, any>> => {
  // Collect all unique avatar file IDs
  const avatarIds = Array.from(
    new Set(
      normalizedFields
        .map((company) => company?.avatar)
        .filter(Boolean)
        .filter((id) => !isNaN(Number(id)))
        .map((id) => Number(id)),
    ),
  );

  if (avatarIds.length === 0) {
    return new Map();
  }

  try {
    // Single batch query for all avatar files
    const avatarFiles = await strapi.entityService.findMany(
      'plugin::upload.file',
      {
        filters: {
          id: { $in: avatarIds },
        },
        fields: ['id', 'name', 'url'],
      },
    );

    const avatarFilesMap = new Map<string, any>();

    if (Array.isArray(avatarFiles)) {
      avatarFiles.forEach((file) => {
        if (file.id) {
          avatarFilesMap.set(String(file.id), file);
        }
      });
    }

    return avatarFilesMap;
  } catch (error) {
    handleError('batchFindAvatarFiles', undefined, error);
    return new Map();
  }
};
