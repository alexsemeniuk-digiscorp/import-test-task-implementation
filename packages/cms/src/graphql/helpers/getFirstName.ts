import { parseFullName } from 'parse-full-name';

/**
 * Extracts the first name from a full name safely.
 * @param fullName The full name string
 * @returns The first name, or 'Client' if missing
 */
export const getFirstName = (fullName?: string): string => {
  if (!fullName || typeof fullName !== 'string') return '';

  try {
    const parsedName = parseFullName(fullName);

    return parsedName.first || '';
  } catch (error) {
    console.error('Error parsing name:', error);
    return 'Client';
  }
};
