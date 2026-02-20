import crypto from 'crypto';
import { v4 } from 'uuid';

export const generateCrypto = (bytesLength = 20) => {
  return crypto.randomBytes(bytesLength).toString('hex');
};

export const generatePassword = (passwordLength = 12): string => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  let password = '';
  // generate random bytes string with length of passwordLength * 2 (each byte is 2 characters)
  const randomBytesArray = generateCrypto(passwordLength);
  for (let i = 0; i < passwordLength; i++) {
    // take 2 characters from randomBytesArray and convert it to numeric value
    const byteValue = parseInt(
      randomBytesArray.substring(i * 2, i * 2 + 2),
      16,
    );
    password += characters[byteValue % characters.length];
  }

  return password;
};

// the helper return ID which matches this regex /^#[A-Z0-9]+$/
export const generateId = (): string => {
  let id = '#';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  // generate random bytes string with length of passwordLength * 2 (each byte is 2 characters)
  const randomBytesArray = generateCrypto(11);
  for (let i = 0; i < 11; i++) {
    // take 2 characters from randomBytesArray and convert it to numeric value
    const byteValue = parseInt(
      randomBytesArray.substring(i * 2, i * 2 + 2),
      16,
    );
    id += characters[byteValue % characters.length];
  }

  return id;
};

export const generateUUID = () => {
  return v4();
};
