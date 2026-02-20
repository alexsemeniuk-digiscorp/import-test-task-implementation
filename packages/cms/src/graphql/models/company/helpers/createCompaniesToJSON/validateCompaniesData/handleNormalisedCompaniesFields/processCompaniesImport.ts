import { NOTES_EXPECTED_VALUES } from './../../../../../contact/helpers/importing/utils/variables';

export const processCompaniesImport = (
  arr: any[],
  { maxNotesCount },
): { csvResultHeaders: string[]; fieldsData: any[] } => {
  const parsedArr = typeof arr === 'string' ? JSON.parse(arr) : arr;

  const repeatedNoteHeaders: string[] = [];
  for (let i = 0; i < maxNotesCount; i++) {
    repeatedNoteHeaders.push(...NOTES_EXPECTED_VALUES);
  }
  const csvResultHeaders = [
    'NAME',
    'EMAIL',
    'PHONE NUMBER',
    'ADDRESS',
    'CREATED DATE',
    'POINTS',
    'TYPE',
    'PRICE GROUP',
    'AVATAR ID',
    'NOTES',
    ...repeatedNoteHeaders,
    'ERRORS',
  ];
  const fieldsData = parsedArr.map((field) => {
    const {
      errors,
      updatingType,
      updatingInfo,
      tenant,
      localId,
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

    const customerValues: string[] = [
      otherValues?.name ?? '',
      otherValues?.email ?? '',
      otherValues?.phoneNumber ?? '',
      otherValues?.address ?? '',
      otherValues?.customCreationDate ?? '',
      otherValues?.points ?? '',
      otherValues?.type ?? '',
      otherValues?.priceGroup ?? '',
      otherValues?.avatar ?? '',
    ];

    return [...customerValues, '', ...notesArr, joinedErrors];
  });

  return { csvResultHeaders, fieldsData };
};
