export const getEcommerceAuthCode = (): string => {
  let id = '';
  const characters = 'amncljqrgidovwxpkhfebyzstu';

  for (let i = 0; i < 19; i++) {
    id += characters.charAt(Math.ceil(Math.random() * characters.length));
  }

  return id;
};
