/**
 * Gets the current UTC timestamp in ISO 8601 format.
 * @returns {string} Current timestamp.
 * @example
 * getCurrentTimestamp();
 * @example
 * const timestamp = getCurrentTimestamp();
 */
export function getCurrentTimestamp() {
  return new Date().toISOString();
}
