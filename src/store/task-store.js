import { createTask, updateTaskFields } from '../models/task.js';

/**
 * In-memory task store.
 */
export class TaskStore {
  constructor() {
    /** @type {object[]} */
    this.tasks = [];
  }

  /**
   * Creates and stores a task.
   * @param {object} input - Task creation input.
   * @param {string} input.title - Task title.
   * @param {string} [input.description] - Task description.
   * @param {string} [input.status] - Task status.
   * @param {string} [input.priority] - Task priority.
   * @returns {object} Created task.
   */
  create(input) {
    let task = createTask(input.title, input.description, input.status, input.priority);

    while (this.tasks.some(existing => existing.id === task.id)) {
      task = createTask(input.title, input.description, input.status, input.priority);
    }

    this.tasks.push(task);
    return { ...task };
  }

  /**
   * Reads a task by id.
   * @param {string} id - Task id.
   * @returns {object} Task.
   */
  read(id) {
    return this.findById(id);
  }

  /**
   * Updates a task.
   * @param {string} id - Task id.
   * @param {object} updates - Fields to update.
   * @returns {object} Updated task.
   */
  update(id, updates) {
    const index = this.tasks.findIndex(task => task.id === id);

    if (index === -1) {
      throw new Error(`Task with id "${id}" not found`);
    }

    const updated = updateTaskFields(this.tasks[index], updates);
    this.tasks[index] = updated;
    return { ...updated };
  }

  /**
   * Deletes a task by id.
   * @param {string} id - Task id.
   * @returns {object} Deleted task.
   */
  delete(id) {
    const index = this.tasks.findIndex(task => task.id === id);

    if (index === -1) {
      throw new Error(`Task with id "${id}" not found`);
    }

    const [deleted] = this.tasks.splice(index, 1);
    return { ...deleted };
  }

  /**
   * Lists all tasks.
   * @returns {object[]} Tasks.
   */
  list() {
    return this.tasks.map(task => ({ ...task }));
  }

  /**
   * Finds a task by id.
   * @param {string} id - Task id.
   * @returns {object} Found task.
   */
  findById(id) {
    const task = this.tasks.find(candidate => candidate.id === id);

    if (!task) {
      throw new Error(`Task with id "${id}" not found`);
    }

    return { ...task };
  }
}

/**
 * Creates a task store instance.
 * @returns {TaskStore} Task store.
 */
export function instantiateTaskStore() {
  return new TaskStore();
}
