import { STATUSES, PRIORITIES } from '../models/task.js';

/**
 * Validates that a title string is valid.
 * @param {string} title - The title to validate
 * @throws {Error} If title is invalid
 */
export function validateTitle(title) {
  if (typeof title !== 'string' || title.trim().length === 0) {
    throw new Error('Task title is required and must be a non-empty string');
  }
  if (title.length > 200) {
    throw new Error('Task title must be 200 characters or less');
  }
}

/**
 * Validates that a description string is valid.
 * @param {string} description - The description to validate
 * @throws {Error} If description is invalid
 */
export function validateDescription(description) {
  if (typeof description !== 'string') {
    throw new Error('Task description must be a string');
  }
  if (description.length > 1000) {
    throw new Error('Task description must be 1000 characters or less');
  }
}

/**
 * Validates that a status is one of the valid status values.
 * @param {string} status - The status to validate
 * @returns {boolean} True if valid, false otherwise
 */
export function validateStatus(status) {
  return STATUSES.includes(status);
}

/**
 * Validates that a priority is one of the valid priority values.
 * @param {string} priority - The priority to validate
 * @returns {boolean} True if valid, false otherwise
 */
export function validatePriority(priority) {
  return PRIORITIES.includes(priority);
}

/**
 * Validates that a category is a non-empty string.
 * @param {string} category - The category to validate
 * @returns {boolean} True if valid, false otherwise
 * @example
 * validateCategory('work'); // true
 * @example
 * validateCategory(''); // false
 */
export function validateCategory(category) {
  return typeof category === 'string' && category.trim().length > 0;
}

/**
 * Validates filter options for task queries.
 * @param {Object} options - Filter options
 * @param {string} [options.status] - Optional status filter
 * @param {string} [options.priority] - Optional priority filter
 * @param {string} [options.category] - Optional category filter
 * @throws {Error} If filter values are invalid
 */
export function validateFilterOptions(options = {}) {
  if (options.status && !validateStatus(options.status)) {
    throw new Error(`Status must be one of: ${STATUSES.join(', ')}`);
  }
  if (options.priority && !validatePriority(options.priority)) {
    throw new Error(`Priority must be one of: ${PRIORITIES.join(', ')}`);
  }
  if (options.category !== undefined && !validateCategory(options.category)) {
    throw new Error('Category filter must be a non-empty string');
  }
}

/**
 * Validates sort parameters.
 * @param {string} sortBy - Field to sort by ('priority' or 'createdAt')
 * @param {string} order - Sort order ('asc' or 'desc')
 * @throws {Error} If sortBy or order are invalid
 */
export function validateSortOptions(sortBy, order) {
  const validSortFields = ['priority', 'createdAt'];
  const validOrders = ['asc', 'desc'];

  if (sortBy && !validSortFields.includes(sortBy)) {
    throw new Error(`Sort field must be one of: ${validSortFields.join(', ')}`);
  }
  if (order && !validOrders.includes(order)) {
    throw new Error(`Sort order must be one of: ${validOrders.join(', ')}`);
  }
}
