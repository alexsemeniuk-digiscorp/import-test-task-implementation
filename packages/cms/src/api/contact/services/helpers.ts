export function extractAddressDetails(address?: string | null) {
  if (!address || typeof address !== 'string') {
    return {
      trimmed_address: '',
      state_abbreviation: '',
    };
  }
  const stateRegex =
    /\b(AL|AK|AZ|AR|CA|CO|CT|DE|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY)\b/;
  const match = address.match(stateRegex);

  if (!match) {
    return {
      trimmed_address: address,
      state_abbreviation: '',
    };
  }

  const stateCode = match[0];
  const trimmedAddress = address
    .split(stateCode)[0]
    .replace(/,\s*$/, '')
    .trim();

  return {
    trimmed_address: trimmedAddress,
    state_abbreviation: stateCode,
  };
}

export const entitybatchArrayForWoocommerce = (arr, size) => {
  return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size),
  );
};
