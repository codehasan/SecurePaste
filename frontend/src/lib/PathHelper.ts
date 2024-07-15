/**
 * Check if the given path starts with any of the given prefixes. Returns false if none of the prefixes match the starting path.
 * @param {string} path - The path to check.
 * @param {string[]} prefixes - The array of prefixes to check against.
 * @returns Returns true if the path starts with any of the given prefixes, otherwise false.
 */
export const pathStartsWith = (
  path: string,
  ...prefixes: string[]
): boolean => {
  if (!path || prefixes.length === 0) return false;

  for (const prefix of prefixes) {
    if (prefix && path.startsWith(prefix)) return true;
  }
  return false;
};
