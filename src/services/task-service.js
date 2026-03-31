import { PRIORITIES, STATUSES } from '../constants.js';

/**
 * Validates a task status value.
 * @param {string} status - Status to validate.
 * @returns {boolean} True when valid.
 */
export function validateStatus(status) {
  return STATUSES.includes(status);
}

/**
 * Validates a task priority value.
 * @param {string} priority - Priority to validate.
 * @returns {boolean} True when valid.
 */
export function validatePriority(priority) {
  return PRIORITIES.includes(priority);
}

/**
 * Filters tasks by status and priority.
 * @param {object[]} tasks - Tasks to filter.
 * @param {object} [options] - List options.
 * @param {string} [options.status] - Status filter.
 * @param {string} [options.priority] - Priority filter.
 * @returns {object[]} Filtered tasks.
 */
export function filterTasks(tasks, options = {}) {
  const { status, priority } = options;

  if (status !== undefined && !validateStatus(status)) {
    throw new Error('Status must be one of: todo, in-progress, done');
  }

  if (priority !== undefined && !validatePriority(priority)) {
    throw new Error('Priority must be one of: low, medium, high');
  }

  return tasks.filter(task => {
    if (status !== undefined && task.status !== status) {
      return false;
    }

    if (priority !== undefined && task.priority !== priority) {
      return false;
    }

    return true;
  });
}

/**
 * Sorts tasks by priority or creation date.
 * @param {object[]} tasks - Tasks to sort.
 * @param {string} [sortBy='createdAt'] - Sort field.
 * @param {string} [order='desc'] - Sort order.
 * @returns {object[]} Sorted tasks.
 */
export function sortTasks(tasks, sortBy = 'createdAt', order = 'desc') {
  if (sortBy !== 'priority' && sortBy !== 'createdAt') {
    throw new Error('Sort field must be one of: priority, createdAt');
  }

  if (order !== 'asc' && order !== 'desc') {
    throw new Error('Sort order must be one of: asc, desc');
  }

  const priorityWeight = {
    low: 1,
    medium: 2,
    high: 3,
  };

  const sorted = [...tasks].sort((left, right) => {
    let comparison;

    if (sortBy === 'priority') {
      comparison = priorityWeight[left.priority] - priorityWeight[right.priority];
    } else {
      comparison = Date.parse(left.createdAt) - Date.parse(right.createdAt);
    }

    if (comparison === 0) {
      comparison = left.id.localeCompare(right.id);
    }

    return order === 'asc' ? comparison : -comparison;
  });

  return sorted;
}
