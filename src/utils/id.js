import crypto from 'crypto';

/**
 * Generates a unique ID for a task using UUID v4.
 * @returns {string} A unique identifier
 */
export function generateId() {
  return crypto.randomUUID();
}

/**
 * Returns the current timestamp as an ISO 8601 string (UTC).
 * @returns {string} Current date/time in format YYYY-MM-DDTHH:mm:ss.sssZ
 */
export function getCurrentTimestamp() {
  return new Date().toISOString();
}
