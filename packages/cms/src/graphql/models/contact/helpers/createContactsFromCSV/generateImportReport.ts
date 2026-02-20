import {
  ADDITIONAL_ADDRESS_COLUMN_NAME,
  ADDITIONAL_EMAIL_COLUMN_NAME,
  ADDITIONAL_PHONE_NUMBER_COLUMN_NAME,
  NOTES_EXPECTED_VALUES,
} from './../importing/utils/variables';

export const processContactsImport = (
  arr: any[],
  {
    maxNotesCount,
    maxAdditionalEmailsCount,
    maxAdditionalPhoneNumbersCount,
    maxAdditionalAddressesCount,
  },
): { csvResultHeaders: string[]; fieldsData: any[] } => {
  const parsedArr = typeof arr === 'string' ? JSON.parse(arr) : arr;

  const repeatedNoteHeaders: string[] = [];
  const repeatedEmailsHeaders: string[] = [];
  const repeatedPhoneNumbersHeaders: string[] = [];
  const repeatedAddressesHeaders: string[] = [];
  for (let i = 0; i < maxNotesCount; i++) {
    repeatedNoteHeaders.push(...NOTES_EXPECTED_VALUES);
  }

  for (let i = 0; i < maxAdditionalEmailsCount; i++) {
    repeatedEmailsHeaders.push(ADDITIONAL_EMAIL_COLUMN_NAME);
  }

  for (let i = 0; i < maxAdditionalPhoneNumbersCount; i++) {
    repeatedPhoneNumbersHeaders.push(ADDITIONAL_PHONE_NUMBER_COLUMN_NAME);
  }

  for (let i = 0; i < maxAdditionalAddressesCount; i++) {
    repeatedAddressesHeaders.push(ADDITIONAL_ADDRESS_COLUMN_NAME);
  }

  const customFieldsNames = parsedArr?.[0]?.customFields
    ? Object.keys(parsedArr?.[0]?.customFields)
    : [];
  const csvResultHeaders = [
    'FULL NAME',
    'EMAIL',
    ...repeatedEmailsHeaders,
    'PHONE NUMBER',
    ...repeatedPhoneNumbersHeaders,
    'ADDRESS',
    ...repeatedAddressesHeaders,
    'DATE OF BIRTH',
    'JOB TITLE',
    'ANNIVERSARY DATE',
    'CREATED DATE',
    'POINTS',
    'CONTACT OWNER',
    'LEAD SOURCE',
    'IDENTITY NUMBER',
    'MARKETING OPT IN',
    'GENDER',
    'AVATAR ID',
    'NOTES',
    ...repeatedNoteHeaders,
    'CUSTOM FIELDS',
    ...customFieldsNames,
    'ERRORS',
  ];
  const fieldsData = parsedArr.map((field) => {
    const {
      customFields,
      errors,
      updatingType,
      updatingInfo,
      tenant,
      localId,
      additionalEmails,
      additionalPhoneNumbers,
      additionalAddresses,
      notes,
      ...otherValues
    } = field;
    const notesArr =
      notes && notes?.length > 0
        ? notes.flatMap((item: { note: string; noteCreationDate: string }) => {
            return [item.note ?? '', item.noteCreationDate ?? ''];
          })
        : ['', ''];
    const joinedErrors = Array.isArray(errors) ? errors.join('. ') : undefined;
    const customValuesArr =
      customFields && Object.values(customFields)?.length
        ? Object.values(customFields)
        : [];
    const additionalEmailsValuesArray =
      maxAdditionalEmailsCount > 0
        ? Array(maxAdditionalEmailsCount)
            .fill('')
            .map((_, i) => additionalEmails?.[i] ?? '')
        : [];
    const additionalPhoneNumbersValuesArray =
      maxAdditionalPhoneNumbersCount > 0
        ? Array(maxAdditionalPhoneNumbersCount)
            .fill('')
            .map((_, i) => additionalPhoneNumbers?.[i] ?? '')
        : [];

    const additionalAddressesValuesArray =
      maxAdditionalAddressesCount > 0
        ? Array(maxAdditionalAddressesCount)
            .fill('')
            .map((_, i) => additionalAddresses?.[i] ?? '')
        : [];
    const customerValues: string[] = [
      otherValues?.fullName ?? '',
      otherValues?.email ?? '',
      ...additionalEmailsValuesArray,
      otherValues?.phoneNumber ?? '',
      ...additionalPhoneNumbersValuesArray,
      otherValues?.address ?? '',
      ...additionalAddressesValuesArray,
      otherValues?.birthdayDate ?? '',
      otherValues?.jobTitle ?? '',
      otherValues?.dateAnniversary ?? '',
      otherValues?.customCreationDate ?? '',
      otherValues?.points ?? '',
      otherValues?.leadOwner ?? '',
      otherValues?.leadSource ?? '',
      otherValues?.identityNumber ?? '',
      otherValues?.marketingOptIn ?? '',
      otherValues?.gender ?? '',
      otherValues?.avatar ?? '',
    ];

    return [
      ...customerValues,
      '',
      ...notesArr,
      '',
      ...customValuesArr,
      joinedErrors,
    ];
  });

  return { csvResultHeaders, fieldsData };
};
