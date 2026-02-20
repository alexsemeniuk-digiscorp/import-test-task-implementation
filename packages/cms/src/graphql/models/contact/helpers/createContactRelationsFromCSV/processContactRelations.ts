import { CONTACT_RELATIONS_EXPECTED_VALUES } from './../importing/utils/variables';

export const processContactsRelationsImport = (
  arr: any[],
): { csvResultHeaders: string[]; fieldsData: any[] } => {
  const csvResultHeaders = [...CONTACT_RELATIONS_EXPECTED_VALUES, 'ERRORS'];

  const fieldsData = arr.map((field) => {
    if (!field || typeof field !== 'object') {
      return ['', '', '', 'ERROR: Invalid field data'];
    }

    const { errors, tenant, localId, ...otherValues } = field || {};

    const joinedErrors = Array.isArray(errors) ? errors.join('. ') : '';

    const relationValues: string[] = [
      otherValues?.fromContact ?? '',
      otherValues?.toContact ?? '',
      otherValues?.relationType ?? '',
    ];

    return [...relationValues, joinedErrors];
  });

  return { csvResultHeaders, fieldsData };
};
