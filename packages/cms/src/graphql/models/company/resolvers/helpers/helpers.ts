import {
  COMPANIES_IMPORT_IDENTIFIER,
  updatingImportingData,
} from './../../../../../api/redis/helpers/variables/importingVariables';
import redis from './../../../../../api/redis/redis';
import { handleError } from './../../../../helpers/errors';
import { createNotesForContact } from './../../../contact/helpers/importing/utils/utils';

interface Company {
  id?: string;
  localId?: string;
  points?: string;
  avatar?: string;
  email?: string;
  [key: string]: any;
}
export const singleCompanyUpdating = async (
  parsedCompany,
  { tenantFilter, regexedSessionId },
) => {
  try {
    if (parsedCompany) {
      const contactId = parsedCompany?.updatingInfo?.emailsId;

      const updatedContact = await strapi.entityService.update(
        'api::company.company',
        contactId,
        {
          data: {
            email: parsedCompany?.email,
            name: parsedCompany?.name || undefined,
            phoneNumber: parsedCompany?.phoneNumber || undefined,
            address: parsedCompany?.address || undefined,
            points: +parsedCompany?.points || 0,
            priceGroup: parsedCompany?.priceGroup || undefined,
            avatar: parsedCompany?.avatarId || undefined,
            secondAddress: parsedCompany?.secondAddress || undefined,
            type: parsedCompany?.type || undefined,
            _skipMeilisearchSync: true,
          },
        },
      );

      if (updatedContact?.id) {
        await createNotesForContact(
          parsedCompany,
          updatedContact?.id,
          'company_id',
        );
      }

      const deleteKey = updatingImportingData(
        regexedSessionId,
        tenantFilter?.tenant,
        COMPANIES_IMPORT_IDENTIFIER,
      );
      if (deleteKey) {
        try {
          await redis.lrem(deleteKey, 1, JSON.stringify(parsedCompany));
        } catch (e) {
          console.log(e);
        }
      }
    }
  } catch (e) {
    handleError('singleContactUpdating', undefined, e);
  }
};
