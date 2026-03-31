import crypto from 'crypto';

/**
 * Generates a unique ID for a task using UUID v4.
 * @returns {string} A unique identifier
 * @example
 * generateId();
 * @example
 * const id = generateId();
 */
export function generateId() {
  return crypto.randomUUID();
}
