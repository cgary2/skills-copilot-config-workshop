/**
 * Formats a single task for console output.
 * @param {object} task - Task to format.
 * @returns {string} Formatted task string.
 * @throws {TypeError} When task is not a plain object.
 * @example
 * formatTask({ id: '1', title: 'T', description: '', status: 'todo', priority: 'low', createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' });
 * @example
 * formatTask(task);
 */
export function formatTask(task) {
  if (typeof task !== 'object' || task === null || Array.isArray(task)) {
    throw new TypeError('Task must be an object');
  }

  return [
    `ID: ${task.id}`,
    `Title: ${task.title}`,
    `Description: ${task.description}`,
    `Status: ${task.status}`,
    `Priority: ${task.priority}`,
    `Created: ${task.createdAt}`,
    `Updated: ${task.updatedAt}`,
  ].join('\n');
}

/**
 * Formats a list of tasks for console output.
 * @param {object[]} tasks - Tasks to format.
 * @returns {string} Formatted task list.
 * @throws {TypeError} When tasks is not an array.
 * @example
 * formatTaskList([]);
 * @example
 * formatTaskList([taskA, taskB]);
 */
export function formatTaskList(tasks) {
  if (!Array.isArray(tasks)) {
    throw new TypeError('Tasks must be an array');
  }

  if (!Array.isArray(tasks) || tasks.length === 0) {
    return 'No tasks found.';
  }

  return tasks
    .map((task, index) => `${index + 1}. [${task.status}] (${task.priority}) ${task.title} - ${task.id}`)
    .join('\n');
}

/**
 * Formats an error message.
 * @param {string} message - Error details.
 * @returns {string} Formatted error string.
 * @throws {TypeError} When message is not a string.
 * @example
 * formatError('Invalid input');
 * @example
 * formatError(error.message);
 */
export function formatError(message) {
  if (typeof message !== 'string') {
    throw new TypeError('Error message must be a string');
  }

  return `Error: ${message}`;
}
