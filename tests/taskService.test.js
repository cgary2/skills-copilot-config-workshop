import assert from 'assert';
import { TaskStore, filterTasks, sortTasks } from '../src/services/taskService.js';

/**
 * Test suite for TaskService (TaskStore, filterTasks, sortTasks)
 */

// TaskStore: constructor initializes empty store
{
  const store = new TaskStore();
  assert.deepStrictEqual(store.getAllTasks(), []);
  console.log('✓ TaskStore: initializes with empty tasks array');
}

// TaskStore: createTask adds task to store
{
  const store = new TaskStore();
  const task = store.createTask('Buy milk');
  assert.strictEqual(task.title, 'Buy milk');
  assert.strictEqual(store.getAllTasks().length, 1);
  console.log('✓ TaskStore.createTask: adds task to store');
}

// TaskStore: createTask with all parameters
{
  const store = new TaskStore();
  const task = store.createTask('Fix bug', 'Fix critical bug', 'in-progress', 'high');
  assert.strictEqual(task.title, 'Fix bug');
  assert.strictEqual(task.description, 'Fix critical bug');
  assert.strictEqual(task.status, 'in-progress');
  assert.strictEqual(task.priority, 'high');
  console.log('✓ TaskStore.createTask: creates task with all parameters');
}

// TaskStore: createTask returns model fields only
{
  const store = new TaskStore();
  const task = store.createTask('Task', '', 'todo', 'medium', 'work');
  assert.strictEqual(task.category, undefined);
  console.log('✓ TaskStore.createTask: returns model task shape without category');
}

// TaskStore: createTask replaces validation errors
{
  const store = new TaskStore();
  assert.throws(
    () => store.createTask(''),
    /Task title is required/
  );
  console.log('✓ TaskStore.createTask: propagates validation errors');
}

// TaskStore: getTaskById finds existing task
{
  const store = new TaskStore();
  const created = store.createTask('Task 1');
  const retrieved = store.getTaskById(created.id);
  assert.deepStrictEqual(retrieved, created);
  console.log('✓ TaskStore.getTaskById: finds existing task by id');
}

// TaskStore: getTaskById returns null for non-existent id
{
  const store = new TaskStore();
  const retrieved = store.getTaskById('non-existent-id');
  assert.strictEqual(retrieved, null);
  console.log('✓ TaskStore.getTaskById: returns null for missing id');
}

// TaskStore: getAllTasks returns copy
{
  const store = new TaskStore();
  store.createTask('Task 1');
  const tasks = store.getAllTasks();
  tasks.push({ id: 'fake' });
  assert.strictEqual(store.getAllTasks().length, 1);
  console.log('✓ TaskStore.getAllTasks: returns array copy');
}

// TaskStore: updateTask modifies existing task
{
  const store = new TaskStore();
  const created = store.createTask('Old title', '', 'todo', 'low');
  const updated = store.updateTask(created.id, { title: 'New title', priority: 'high' });
  assert.strictEqual(updated.title, 'New title');
  assert.strictEqual(updated.priority, 'high');
  const retrieved = store.getTaskById(created.id);
  assert.strictEqual(retrieved.title, 'New title');
  console.log('✓ TaskStore.updateTask: modifies existing task');
}

// TaskStore: updateTask error on non-existent id
{
  const store = new TaskStore();
  assert.throws(
    () => store.updateTask('non-existent', { title: 'New' }),
    /Task with id "non-existent" not found/
  );
  console.log('✓ TaskStore.updateTask: error on non-existent id');
}

// TaskStore: updateTask validates updates
{
  const store = new TaskStore();
  const task = store.createTask('Task');
  assert.throws(
    () => store.updateTask(task.id, { status: 'invalid' }),
    /Status must be one of/
  );
  console.log('✓ TaskStore.updateTask: validates update parameters');
}

// TaskStore: deleteTask removes task
{
  const store = new TaskStore();
  const task = store.createTask('Task to delete');
  const deleted = store.deleteTask(task.id);
  assert.deepStrictEqual(deleted, task);
  assert.strictEqual(store.getAllTasks().length, 0);
  console.log('✓ TaskStore.deleteTask: removes task from store');
}

// TaskStore: deleteTask error on non-existent id
{
  const store = new TaskStore();
  assert.throws(
    () => store.deleteTask('non-existent'),
    /Task with id "non-existent" not found/
  );
  console.log('✓ TaskStore.deleteTask: error on non-existent id');
}

// TaskStore: listTasks returns all tasks by default
{
  const store = new TaskStore();
  store.createTask('Task 1');
  store.createTask('Task 2');
  store.createTask('Task 3');
  const tasks = store.listTasks();
  assert.strictEqual(tasks.length, 3);
  console.log('✓ TaskStore.listTasks: returns all tasks by default');
}

// TaskStore: listTasks filters by status
{
  const store = new TaskStore();
  store.createTask('Task 1', '', 'todo');
  store.createTask('Task 2', '', 'in-progress');
  store.createTask('Task 3', '', 'done');
  const inProgress = store.listTasks({ status: 'in-progress' });
  assert.strictEqual(inProgress.length, 1);
  assert.strictEqual(inProgress[0].status, 'in-progress');
  console.log('✓ TaskStore.listTasks: filters by status');
}

// TaskStore: listTasks filters by priority
{
  const store = new TaskStore();
  store.createTask('Task 1', '', 'todo', 'low');
  store.createTask('Task 2', '', 'todo', 'high');
  store.createTask('Task 3', '', 'todo', 'medium');
  const highPriority = store.listTasks({ priority: 'high' });
  assert.strictEqual(highPriority.length, 1);
  assert.strictEqual(highPriority[0].priority, 'high');
  console.log('✓ TaskStore.listTasks: filters by priority');
}

// TaskStore: listTasks filters by status AND priority
{
  const store = new TaskStore();
  store.createTask('Task 1', '', 'todo', 'low');
  store.createTask('Task 2', '', 'in-progress', 'high');
  store.createTask('Task 3', '', 'in-progress', 'low');
  const results = store.listTasks({ status: 'in-progress', priority: 'high' });
  assert.strictEqual(results.length, 1);
  assert.strictEqual(results[0].status, 'in-progress');
  assert.strictEqual(results[0].priority, 'high');
  console.log('✓ TaskStore.listTasks: filters by status AND priority');
}

// TaskStore: listTasks sorts by createdAt descending
{
  const store = new TaskStore();
  const task1 = store.createTask('Task 1');
  const delayMs = 10;
  await new Promise(r => setTimeout(r, delayMs));
  const task2 = store.createTask('Task 2');
  const sorted = store.listTasks({ sortBy: 'createdAt', order: 'desc' });
  assert.strictEqual(sorted[0].id, task2.id);
  assert.strictEqual(sorted[1].id, task1.id);
  console.log('✓ TaskStore.listTasks: sorts by createdAt descending');
}

// TaskStore: listTasks sorts by createdAt ascending
{
  const store = new TaskStore();
  const task1 = store.createTask('Task 1');
  await new Promise(r => setTimeout(r, 10));
  const task2 = store.createTask('Task 2');
  const sorted = store.listTasks({ sortBy: 'createdAt', order: 'asc' });
  assert.strictEqual(sorted[0].id, task1.id);
  assert.strictEqual(sorted[1].id, task2.id);
  console.log('✓ TaskStore.listTasks: sorts by createdAt ascending');
}

// TaskStore: listTasks sorts by priority descending
{
  const store = new TaskStore();
  store.createTask('Low', '', 'todo', 'low');
  store.createTask('Medium', '', 'todo', 'medium');
  store.createTask('High', '', 'todo', 'high');
  const sorted = store.listTasks({ sortBy: 'priority', order: 'desc' });
  assert.strictEqual(sorted[0].priority, 'high');
  assert.strictEqual(sorted[1].priority, 'medium');
  assert.strictEqual(sorted[2].priority, 'low');
  console.log('✓ TaskStore.listTasks: sorts by priority descending');
}

// TaskStore: listTasks sorts by priority ascending
{
  const store = new TaskStore();
  store.createTask('High', '', 'todo', 'high');
  store.createTask('Low', '', 'todo', 'low');
  store.createTask('Medium', '', 'todo', 'medium');
  const sorted = store.listTasks({ sortBy: 'priority', order: 'asc' });
  assert.strictEqual(sorted[0].priority, 'low');
  assert.strictEqual(sorted[1].priority, 'medium');
  assert.strictEqual(sorted[2].priority, 'high');
  console.log('✓ TaskStore.listTasks: sorts by priority ascending');
}

// TaskStore: listTasks error on invalid status filter
{
  const store = new TaskStore();
  assert.throws(
    () => store.listTasks({ status: 'invalid' }),
    /Status must be one of/
  );
  console.log('✓ TaskStore.listTasks: error on invalid status filter');
}

// TaskStore: listTasks error on invalid priority filter
{
  const store = new TaskStore();
  assert.throws(
    () => store.listTasks({ priority: 'critical' }),
    /Priority must be one of/
  );
  console.log('✓ TaskStore.listTasks: error on invalid priority filter');
}

// TaskStore: listTasks with category filter returns no matches for current task shape
{
  const store = new TaskStore();
  store.createTask('Work task 1', '', 'todo', 'high', 'work');
  store.createTask('Personal task', '', 'todo', 'low', 'personal');
  store.createTask('Work task 2', '', 'in-progress', 'medium', 'work');
  const workTasks = store.listTasks({ category: 'work' });
  assert.strictEqual(workTasks.length, 0);
  console.log('✓ TaskStore.listTasks: category filter yields no matches without category field');
}

// TaskStore: listTasks error on empty category filter
{
  const store = new TaskStore();
  assert.throws(
    () => store.listTasks({ category: '' }),
    /Category filter must be a non-empty string/
  );
  console.log('✓ TaskStore.listTasks: error on empty category filter');
}

// TaskStore: listTasks error on invalid sortBy
{
  const store = new TaskStore();
  assert.throws(
    () => store.listTasks({ sortBy: 'title' }),
    /Sort field must be one of/
  );
  console.log('✓ TaskStore.listTasks: error on invalid sortBy');
}

// TaskStore: listTasks error on invalid order
{
  const store = new TaskStore();
  assert.throws(
    () => store.listTasks({ order: 'random' }),
    /Sort order must be one of/
  );
  console.log('✓ TaskStore.listTasks: error on invalid order');
}

// filterTasks: filters by status
{
  const tasks = [
    { id: '1', status: 'todo', priority: 'low' },
    { id: '2', status: 'in-progress', priority: 'high' },
    { id: '3', status: 'done', priority: 'medium' },
  ];
  const filtered = filterTasks(tasks, { status: 'done' });
  assert.strictEqual(filtered.length, 1);
  assert.strictEqual(filtered[0].id, '3');
  console.log('✓ filterTasks: filters by status');
}

// filterTasks: filters by priority
{
  const tasks = [
    { id: '1', status: 'todo', priority: 'low' },
    { id: '2', status: 'todo', priority: 'high' },
    { id: '3', status: 'todo', priority: 'medium' },
  ];
  const filtered = filterTasks(tasks, { priority: 'high' });
  assert.strictEqual(filtered.length, 1);
  assert.strictEqual(filtered[0].id, '2');
  console.log('✓ filterTasks: filters by priority');
}

// filterTasks: filters by status and priority
{
  const tasks = [
    { id: '1', status: 'todo', priority: 'low' },
    { id: '2', status: 'in-progress', priority: 'high' },
    { id: '3', status: 'in-progress', priority: 'low' },
  ];
  const filtered = filterTasks(tasks, { status: 'in-progress', priority: 'low' });
  assert.strictEqual(filtered.length, 1);
  assert.strictEqual(filtered[0].id, '3');
  console.log('✓ filterTasks: filters by status and priority');
}

// filterTasks: no filter returns all
{
  const tasks = [
    { id: '1', status: 'todo', priority: 'low' },
    { id: '2', status: 'done', priority: 'high' },
  ];
  const filtered = filterTasks(tasks, {});
  assert.strictEqual(filtered.length, 2);
  console.log('✓ filterTasks: returns all with empty filter');
}

// filterTasks: error on invalid status
{
  const tasks = [];
  assert.throws(
    () => filterTasks(tasks, { status: 'invalid' }),
    /Status must be one of/
  );
  console.log('✓ filterTasks: error on invalid status');
}

// filterTasks: error on invalid priority
{
  const tasks = [];
  assert.throws(
    () => filterTasks(tasks, { priority: 'critical' }),
    /Priority must be one of/
  );
  console.log('✓ filterTasks: error on invalid priority');
}

// sortTasks: sorts by createdAt descending
{
  const tasks = [
    { id: '1', createdAt: '2024-01-01T00:00:00.000Z', priority: 'low' },
    { id: '2', createdAt: '2024-01-02T00:00:00.000Z', priority: 'low' },
    { id: '3', createdAt: '2024-01-03T00:00:00.000Z', priority: 'low' },
  ];
  const sorted = sortTasks(tasks, 'createdAt', 'desc');
  assert.strictEqual(sorted[0].id, '3');
  assert.strictEqual(sorted[1].id, '2');
  assert.strictEqual(sorted[2].id, '1');
  console.log('✓ sortTasks: sorts by createdAt descending');
}

// sortTasks: sorts by createdAt ascending
{
  const tasks = [
    { id: '3', createdAt: '2024-01-03T00:00:00.000Z', priority: 'low' },
    { id: '1', createdAt: '2024-01-01T00:00:00.000Z', priority: 'low' },
    { id: '2', createdAt: '2024-01-02T00:00:00.000Z', priority: 'low' },
  ];
  const sorted = sortTasks(tasks, 'createdAt', 'asc');
  assert.strictEqual(sorted[0].id, '1');
  assert.strictEqual(sorted[1].id, '2');
  assert.strictEqual(sorted[2].id, '3');
  console.log('✓ sortTasks: sorts by createdAt ascending');
}

// sortTasks: sorts by priority descending
{
  const tasks = [
    { id: '1', priority: 'low' },
    { id: '2', priority: 'high' },
    { id: '3', priority: 'medium' },
  ];
  const sorted = sortTasks(tasks, 'priority', 'desc');
  assert.strictEqual(sorted[0].priority, 'high');
  assert.strictEqual(sorted[1].priority, 'medium');
  assert.strictEqual(sorted[2].priority, 'low');
  console.log('✓ sortTasks: sorts by priority descending');
}

// sortTasks: sorts by priority ascending
{
  const tasks = [
    { id: '1', priority: 'high' },
    { id: '2', priority: 'low' },
    { id: '3', priority: 'medium' },
  ];
  const sorted = sortTasks(tasks, 'priority', 'asc');
  assert.strictEqual(sorted[0].priority, 'low');
  assert.strictEqual(sorted[1].priority, 'medium');
  assert.strictEqual(sorted[2].priority, 'high');
  console.log('✓ sortTasks: sorts by priority ascending');
}

// sortTasks: error on invalid sortBy
{
  const tasks = [];
  assert.throws(
    () => sortTasks(tasks, 'title', 'desc'),
    /Sort field must be one of/
  );
  console.log('✓ sortTasks: error on invalid sortBy');
}

// sortTasks: error on invalid order
{
  const tasks = [];
  assert.throws(
    () => sortTasks(tasks, 'priority', 'random'),
    /Sort order must be one of/
  );
  console.log('✓ sortTasks: error on invalid order');
}

// sortTasks: does not mutate input
{
  const tasks = [
    { id: '1', priority: 'low' },
    { id: '2', priority: 'high' },
  ];
  const original = JSON.stringify(tasks);
  sortTasks(tasks, 'priority', 'desc');
  assert.strictEqual(JSON.stringify(tasks), original);
  console.log('✓ sortTasks: does not mutate input array');
}

console.log('\n✅ All TaskService tests passed!\n');
