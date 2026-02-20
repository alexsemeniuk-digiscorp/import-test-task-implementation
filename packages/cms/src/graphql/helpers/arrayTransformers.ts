export const replaceUnderscoresWithSpaces = (arr: string[]) => {
  return arr.map((item) => item.replace(/_/g, ' '));
};

export const padArray = <T>(
  arr: T[],
  minLength: number,
  fillValue?: T,
): T[] => {
  return arr.length >= minLength
    ? arr
    : [...arr, ...new Array(minLength - arr.length).fill(fillValue)];
};
