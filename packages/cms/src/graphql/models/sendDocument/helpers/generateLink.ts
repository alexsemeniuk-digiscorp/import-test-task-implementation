export const generateContractLink = (uuid: string) => {
  return `${process.env.FRONTEND_URL}/sign-contract/${uuid}`;
};
export const generateFormLink = (uuid: string) => {
  return `${process.env.FRONTEND_URL}/fill-form/${uuid}`;
};
