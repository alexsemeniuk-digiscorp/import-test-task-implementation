import { generateUUID } from '../../../../../../utils/randomBytes';
import {
  spoiledImportingData,
  WISHLIST_IMPORT_IDENTIFIER,
} from './../../../../../../api/redis/helpers/variables/importingVariables';
import { updateRedisImportData } from './../../../../../helpers/importingHelpers/redisHelpers';

export const handleSpoiledCreations = async ({
  parsedWishlistItem,
  existedContactEmails,
  isAllProductsExists,
  spoiledCreations,
  isRedis,
  generatedRegex,
  tenantFilter,
}) => {
  const errors = [];
  if (!existedContactEmails?.length) {
    errors.push('No CONTACT with such email found');
  }

  if (!isAllProductsExists) {
    errors.push('Some Products were not found');
  }

  const spoiledCreation = {
    ...parsedWishlistItem,
    errors,
    localId: generateUUID(),
  };

  const spoiledCreationJson = JSON.stringify(spoiledCreation);

  if (isRedis) {
    await updateRedisImportData(
      generatedRegex,
      tenantFilter,
      spoiledCreationJson,
      WISHLIST_IMPORT_IDENTIFIER,
      spoiledImportingData,
    );
  }
  spoiledCreations.push(spoiledCreation);
};
