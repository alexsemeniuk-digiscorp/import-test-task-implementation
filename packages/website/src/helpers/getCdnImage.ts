import { cdnUrl } from '@helpers/external';

export const getCdnImage = (imageUrl: string | undefined): string => {
  if (!imageUrl) return '';

  const isImageUrlFromCdn = imageUrl.includes('cdn.');

  return cdnUrl && !isImageUrlFromCdn
    ? imageUrl.replace(/^.*?(\/vertical-saas\/.*)$/, `${cdnUrl}$1`)
    : imageUrl;
};
