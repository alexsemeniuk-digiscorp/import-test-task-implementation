import { v4 } from 'uuid';

// the helper return ID which matches this regex /^#[A-Z0-9]+$/
export const getEntityIdWithRegex = (): string => {
  let id = '#';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  for (let i = 0; i < 11; i++) {
    id += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return id;
};

export const generateUUID = () => {
  return v4();
};
