import assert from 'assert';
import { formatError, formatTask, formatTaskList } from '../../utils/format.js';

function runTest(name, fn) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
}

const task = {
  id: 't1',
  title: 'Task One',
  description: '',
  status: 'todo',
  priority: 'medium',
  createdAt: '2026-03-31T00:00:00.000Z',
  updatedAt: '2026-03-31T00:00:00.000Z',
};

runTest('formatTask includes title text', () => {
  assert.match(formatTask(task), /Title: Task One/);
});

runTest('formatTaskList handles empty list', () => {
  assert.strictEqual(formatTaskList([]), 'No tasks found.');
});

runTest('formatError prefixes message', () => {
  assert.strictEqual(formatError('Boom'), 'Error: Boom');
});
