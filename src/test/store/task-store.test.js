import assert from 'assert';
import { instantiateTaskStore } from '../../store/task-store.js';

function runTest(name, fn) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
}

runTest('store create persists a task', () => {
  const store = instantiateTaskStore();
  const created = store.create({ title: 'Task A' });
  assert.strictEqual(store.list().length, 1);
  assert.strictEqual(created.title, 'Task A');
});

runTest('store findById returns task copy', () => {
  const store = instantiateTaskStore();
  const created = store.create({ title: 'Task A' });
  const found = store.findById(created.id);
  found.title = 'Mutated';
  assert.strictEqual(store.findById(created.id).title, 'Task A');
});

runTest('store delete removes task', () => {
  const store = instantiateTaskStore();
  const created = store.create({ title: 'Task A' });
  store.delete(created.id);
  assert.strictEqual(store.list().length, 0);
});
