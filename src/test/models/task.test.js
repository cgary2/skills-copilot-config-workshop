import assert from 'assert';
import { createTask, updateTaskFields } from '../../models/task.js';

function runTest(name, fn) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
}

runTest('createTask sets defaults', () => {
  const task = createTask('Write docs');
  assert.strictEqual(task.status, 'todo');
  assert.strictEqual(task.priority, 'medium');
});

runTest('createTask trims title', () => {
  const task = createTask('  Write docs  ');
  assert.strictEqual(task.title, 'Write docs');
});

runTest('updateTaskFields updates mutable fields', () => {
  const task = createTask('Original');
  const updated = updateTaskFields(task, { status: 'done' });
  assert.strictEqual(updated.status, 'done');
});

runTest('updateTaskFields rejects id updates', () => {
  const task = createTask('Original');
  assert.throws(() => updateTaskFields(task, { id: 'abc' }), /Task id is immutable/);
});
