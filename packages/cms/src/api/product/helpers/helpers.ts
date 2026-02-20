export const formatEcommerceDescription = (text: string) => {
  const plainText = text.replace(/<\/?[^>]+(>|$)/g, '');
  return plainText;
};

const HAS_HTML_REGEX = /<\s*\/?\s*\w+[^>]*>/g;

export const formatDescriptionToHtml = (
  input: string | null | undefined,
): string => {
  const raw = input ?? '';

  if (raw.trim() === '') return '';

  const containsHtml = HAS_HTML_REGEX.test(raw);
  if (containsHtml) return raw;

  return raw
    .trim()
    .split(/\r?\n{2,}/)
    .map((block) =>
      block
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .join('<br/>'),
    )
    .map((p) => `<p>${p}</p>`)
    .join('');
};
