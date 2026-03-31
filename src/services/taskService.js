import { createTask, updateTaskFields, PRIORITIES } from '../models/task.js';
import { validateFilterOptions, validateSortOptions, validateStatus, validatePriority } from '../utils/validators.js';

/**
 * TaskStore manages an in-memory collection of tasks.
 * Provides CRUD operations and query utilities.
 */
export class TaskStore {
  constructor() {
    this.tasks = [];
  }

  /**
   * Creates a new task and stores it.
   * @param {string} title - Task title
   * @param {string} [description=''] - Task description
   * @param {string} [status='todo'] - Task status
   * @param {string} [priority='medium'] - Task priority
   * @returns {Object} The created task
   * @throws {Error} If validation fails
   */
  createTask(title, description = '', status = 'todo', priority = 'medium') {
    const task = createTask(title, description, status, priority);
    this.tasks.push(task);
    return task;
  }

  /**
   * Retrieves a task by ID.
   * @param {string} id - The task ID
   * @returns {Object|null} The task object or null if not found
   */
  getTaskById(id) {
    return this.tasks.find(task => task.id === id) || null;
  }

  /**
   * Retrieves all tasks.
   * @returns {Object[]} Array of all tasks
   */
  getAllTasks() {
    return [...this.tasks];
  }

  /**
   * Updates a task's fields.
   * @param {string} id - The task ID
   * @param {Partial<Object>} updates - Fields to update
   * @returns {Object} The updated task
   * @throws {Error} If task is not found or validation fails
   */
  updateTask(id, updates) {
    const task = this.getTaskById(id);
    if (!task) {
      throw new Error(`Task with id "${id}" not found`);
    }

    const updatedTask = updateTaskFields(task, updates);
    const index = this.tasks.findIndex(t => t.id === id);
    this.tasks[index] = updatedTask;
    return updatedTask;
  }

  /**
   * Deletes a task by ID.
   * @param {string} id - The task ID
   * @returns {Object} The deleted task
   * @throws {Error} If task is not found
   */
  deleteTask(id) {
    const task = this.getTaskById(id);
    if (!task) {
      throw new Error(`Task with id "${id}" not found`);
    }

    const index = this.tasks.findIndex(t => t.id === id);
    this.tasks.splice(index, 1);
    return task;
  }

  /**
   * Lists and filters tasks with optional sorting.
   * @param {Object} [options] - Filter and sort options
   * @param {string} [options.status] - Filter by status
   * @param {string} [options.priority] - Filter by priority
   * @param {string} [options.sortBy='createdAt'] - Sort field ('priority' or 'createdAt')
   * @param {string} [options.order='desc'] - Sort order ('asc' or 'desc')
   * @returns {Object[]} Filtered and sorted tasks
   * @throws {Error} If filter/sort options are invalid
   */
  listTasks(options = {}) {
    const { status, priority, sortBy = 'createdAt', order = 'desc' } = options;

    // Validate filter options
    validateFilterOptions({ status, priority });
    validateSortOptions(sortBy, order);

    // Filter tasks
    let filtered = this.tasks.filter(task => {
      if (status && task.status !== status) return false;
      if (priority && task.priority !== priority) return false;
      return true;
    });

    // Sort tasks
    filtered = sortTasks(filtered, sortBy, order);

    return filtered;
  }
}

/**
 * Filters an array of tasks by status and/or priority.
 * @param {Object[]} tasks - Array of tasks to filter
 * @param {Object} [options] - Filter options
 * @param {string} [options.status] - Filter by status
 * @param {string} [options.priority] - Filter by priority
 * @returns {Object[]} Filtered tasks
 * @throws {Error} If filter options are invalid
 */
export function filterTasks(tasks, options = {}) {
  const { status, priority } = options;

  validateFilterOptions({ status, priority });

  return tasks.filter(task => {
    if (status && task.status !== status) return false;
    if (priority && task.priority !== priority) return false;
    return true;
  });
}

/**
 * Sorts an array of tasks by the specified field and order.
 * Priority order: high (3) > medium (2) > low (1).
 * Tie-breaking by id (lexicographic).
 * @param {Object[]} tasks - Array of tasks to sort
 * @param {string} [sortBy='createdAt'] - Field to sort by ('priority' or 'createdAt')
 * @param {string} [order='desc'] - Sort order ('asc' or 'desc')
 * @returns {Object[]} Sorted tasks
 * @throws {Error} If sortBy or order are invalid
 */
export function sortTasks(tasks, sortBy = 'createdAt', order = 'desc') {
  validateSortOptions(sortBy, order);

  const priorityRank = { high: 3, medium: 2, low: 1 };
  const sorted = [...tasks];

  sorted.sort((a, b) => {
    let compareResult = 0;

    if (sortBy === 'priority') {
      compareResult = priorityRank[a.priority] - priorityRank[b.priority];
    } else if (sortBy === 'createdAt') {
      compareResult = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }

    // Tie-break by id (lexicographic)
    if (compareResult === 0) {
      compareResult = a.id.localeCompare(b.id);
    }

    return order === 'desc' ? -compareResult : compareResult;
  });

  return sorted;
}

/**
 * Creates and returns an empty TaskStore instance.
 * @returns {TaskStore} A new task store
 */
export function instantiateTaskStore() {
  return new TaskStore();
}
