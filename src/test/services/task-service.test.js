import assert from 'assert';
import { filterTasks, sortTasks, validatePriority, validateStatus } from '../../services/task-service.js';

function runTest(name, fn) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
}

const tasks = [
  { id: 'b', status: 'todo', priority: 'low', createdAt: '2026-03-30T00:00:00.000Z' },
  { id: 'a', status: 'done', priority: 'high', createdAt: '2026-03-31T00:00:00.000Z' },
  { id: 'c', status: 'todo', priority: 'medium', createdAt: '2026-03-29T00:00:00.000Z' },
];

runTest('validateStatus accepts valid status', () => {
  assert.strictEqual(validateStatus('todo'), true);
});

runTest('validatePriority accepts valid priority', () => {
  assert.strictEqual(validatePriority('high'), true);
});

runTest('filterTasks filters by status', () => {
  const filtered = filterTasks(tasks, { status: 'todo' });
  assert.strictEqual(filtered.length, 2);
});

runTest('sortTasks sorts by createdAt desc', () => {
  const sorted = sortTasks(tasks, 'createdAt', 'desc');
  assert.strictEqual(sorted[0].id, 'a');
});
