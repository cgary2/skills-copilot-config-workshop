import chalk from 'chalk';
import { PRIORITIES, STATUSES } from '../models/task.js';

/**
 * Colors a task status for terminal display.
 * @param {string} status - Task status value
 * @returns {string} Colorized status text
 * @throws {TypeError} If status is not a valid status string
 * @example
 * colorStatus('done');
 * @example
 * colorStatus('todo');
 */
export function colorStatus(status) {
  if (typeof status !== 'string') {
    throw new TypeError('Status must be a string');
  }
  if (!STATUSES.includes(status)) {
    throw new TypeError(`Status must be one of: ${STATUSES.join(', ')}`);
  }

  if (status === 'done') {
    return chalk.green(status);
  }
  if (status === 'in-progress') {
    return chalk.yellow(status);
  }
  return chalk.red(status);
}

/**
 * Colors a task priority for terminal display.
 * @param {string} priority - Task priority value
 * @returns {string} Colorized priority text
 * @throws {TypeError} If priority is not a valid priority string
 * @example
 * colorPriority('high');
 * @example
 * colorPriority('low');
 */
export function colorPriority(priority) {
  if (typeof priority !== 'string') {
    throw new TypeError('Priority must be a string');
  }
  if (!PRIORITIES.includes(priority)) {
    throw new TypeError(`Priority must be one of: ${PRIORITIES.join(', ')}`);
  }

  if (priority === 'high') {
    return chalk.bold.red(priority);
  }
  if (priority === 'medium') {
    return chalk.bold.yellow(priority);
  }
  return chalk.dim(priority);
}