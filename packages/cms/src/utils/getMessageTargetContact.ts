import { getFirstName } from '../graphql/helpers/getFirstName';

const getLastNamePortion = (fullName?: string, firstName?: string): string => {
  if (!fullName || !firstName) return '';

  const lastNamePortion = fullName.replace(firstName, '').trim();
  return lastNamePortion;
};

export const getMessageTargetContact = async (
  content: string,
  contactData?: any,
) => {
  if (!content) return content;

  const mergeData = {
    firstName:
      getFirstName(
        contactData?.contact?.fullName ||
          contactData?.lead?.fullName ||
          contactData?.company?.name ||
          '',
      ) ||
      contactData?.contact?.firstName ||
      contactData?.lead?.firstName ||
      contactData?.company?.name ||
      '',
    lastName:
      contactData?.contact?.lastName ||
      contactData?.lead?.lastName ||
      getLastNamePortion(
        contactData?.contact?.fullName ||
          contactData?.lead?.fullName ||
          contactData?.company?.name,
        getFirstName(
          contactData?.contact?.fullName ||
            contactData?.lead?.fullName ||
            contactData?.company?.name,
        ),
      ) ||
      '',
    fullName:
      contactData?.contact?.fullName ||
      contactData?.lead?.fullName ||
      contactData?.company?.name,
    email:
      contactData?.contact?.email ||
      contactData?.lead?.email ||
      contactData?.company?.email ||
      '',
    phoneNumber:
      contactData?.contact?.phoneNumber ||
      contactData?.lead?.phoneNumber ||
      contactData?.company?.phoneNumber ||
      '',
    birthdayDate:
      contactData?.contact?.birthdayDate ||
      contactData?.lead?.birthdayDate ||
      '',
    address:
      contactData?.contact?.address ||
      contactData?.lead?.address ||
      contactData?.company?.address ||
      '',
    points:
      contactData?.contact?.points ||
      contactData?.lead?.points ||
      contactData?.company?.points ||
      0,
  };

  return content.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    const value = mergeData[key];
    return value !== undefined && value !== null ? String(value) : match;
  });
};
