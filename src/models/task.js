import { generateId } from '../utils/id.js';
import { getCurrentTimestamp } from '../utils/time.js';
import { DEFAULT_PRIORITY, DEFAULT_STATUS, PRIORITIES, STATUSES } from '../constants.js';

/**
 * @typedef {Object} Task
 * @property {string} id - Unique identifier (UUID)
 * @property {string} title - Task title (1-200 chars)
 * @property {string} description - Task description (0-1000 chars)
 * @property {'todo' | 'in-progress' | 'done'} status - Task status
 * @property {'low' | 'medium' | 'high'} priority - Task priority
 * @property {string} createdAt - ISO 8601 timestamp (immutable)
 * @property {string} updatedAt - ISO 8601 timestamp (auto-updated)
 */

/**
 * Creates a new Task object with auto-generated id and timestamps.
 * @param {string} title - Task title (required, 1-200 chars)
 * @param {string} [description=''] - Task description (optional, max 1000 chars)
 * @param {string} [status='todo'] - Task status (optional, one of STATUSES)
 * @param {string} [priority='medium'] - Task priority (optional, one of PRIORITIES)
 * @returns {Task} The newly created task object
 * @throws {Error} If title is empty, not a string, or exceeds 200 chars
 * @throws {Error} If description exceeds 1000 chars
 * @throws {Error} If status or priority are invalid
 */
export function createTask(title, description = '', status = DEFAULT_STATUS, priority = DEFAULT_PRIORITY) {
  // Validate title
  if (typeof title !== 'string' || title.trim().length === 0) {
    throw new Error('Task title is required and must be a non-empty string');
  }
  if (title.length > 200) {
    throw new Error('Task title must be 200 characters or less');
  }

  // Validate description
  if (typeof description !== 'string') {
    throw new Error('Task description must be a string');
  }
  if (description.length > 1000) {
    throw new Error('Task description must be 1000 characters or less');
  }

  // Validate status
  if (!STATUSES.includes(status)) {
    throw new Error(`Status must be one of: ${STATUSES.join(', ')}`);
  }

  // Validate priority
  if (!PRIORITIES.includes(priority)) {
    throw new Error(`Priority must be one of: ${PRIORITIES.join(', ')}`);
  }

  const now = getCurrentTimestamp();

  return {
    id: generateId(),
    title: title.trim(),
    description: description.trim(),
    status,
    priority,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Updates specific fields of a Task object.
 * Immutable fields (id, createdAt) cannot be modified.
 * @param {Task} task - The original task object
 * @param {Partial<Task>} updates - Fields to update
 * @returns {Task} A new Task object with updates applied
 * @throws {Error} If attempting to modify id or createdAt
 * @throws {Error} If updated field values fail validation
 */
export function updateTaskFields(task, updates) {
  if (typeof updates !== 'object' || updates === null || Array.isArray(updates)) {
    throw new Error('Task updates must be an object');
  }

  // Prevent modification of immutable fields
  if ('id' in updates) {
    throw new Error('Task id is immutable and cannot be modified');
  }
  if ('createdAt' in updates) {
    throw new Error('Task createdAt is immutable and cannot be modified');
  }
  if ('updatedAt' in updates) {
    throw new Error('Task updatedAt is system-managed and cannot be modified');
  }

  const allowedFields = ['title', 'description', 'status', 'priority'];
  const updateKeys = Object.keys(updates);

  for (const key of updateKeys) {
    if (!allowedFields.includes(key)) {
      throw new Error(`Cannot update unknown field: ${key}`);
    }
  }

  const updatedTask = { ...task };

  // Validate and apply title update
  if ('title' in updates) {
    if (typeof updates.title !== 'string' || updates.title.trim().length === 0) {
      throw new Error('Task title is required and must be a non-empty string');
    }
    if (updates.title.length > 200) {
      throw new Error('Task title must be 200 characters or less');
    }
    updatedTask.title = updates.title.trim();
  }

  // Validate and apply description update
  if ('description' in updates) {
    if (typeof updates.description !== 'string') {
      throw new Error('Task description must be a string');
    }
    if (updates.description.length > 1000) {
      throw new Error('Task description must be 1000 characters or less');
    }
    updatedTask.description = updates.description.trim();
  }

  // Validate and apply status update
  if ('status' in updates) {
    if (!STATUSES.includes(updates.status)) {
      throw new Error(`Status must be one of: ${STATUSES.join(', ')}`);
    }
    updatedTask.status = updates.status;
  }

  // Validate and apply priority update
  if ('priority' in updates) {
    if (!PRIORITIES.includes(updates.priority)) {
      throw new Error(`Priority must be one of: ${PRIORITIES.join(', ')}`);
    }
    updatedTask.priority = updates.priority;
  }

  // Auto-update the updatedAt timestamp
  updatedTask.updatedAt = getCurrentTimestamp();

  return updatedTask;
}

export { STATUSES, PRIORITIES, DEFAULT_STATUS, DEFAULT_PRIORITY };
