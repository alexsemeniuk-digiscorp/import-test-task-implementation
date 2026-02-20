export const emailSender = (sender?: string): string => {
  if (!sender) return `no-reply@caratiqdemo.com`;

  return `${sender}  <no-reply@caratiqdemo.com>`;
};

export const emailReplyTo = (to?: string): string => {
  if (!to) return `no-reply@caratiqdemo.com`;

  return to;
};

export const smsSender = (sender?: string): string => {
  if (!sender) return ``;
  return `${sender}`;
};
