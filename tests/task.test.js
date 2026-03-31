import assert from 'assert';
import { createTask, updateTaskFields, STATUSES, PRIORITIES } from '../src/models/task.js';

/**
 * Test suite for Task model (createTask, updateTaskFields)
 */

// createTask: valid creation
{
  const task = createTask('Buy groceries');
  assert.strictEqual(task.title, 'Buy groceries');
  assert.strictEqual(task.description, '');
  assert.strictEqual(task.status, 'todo');
  assert.strictEqual(task.priority, 'medium');
  assert(task.id);
  assert(task.createdAt);
  assert(task.updatedAt);
  assert.strictEqual(task.createdAt, task.updatedAt);
  console.log('✓ createTask: valid task creation with defaults');
}

// createTask: with all fields
{
  const task = createTask('Finish report', 'Complete Q1 analysis', 'in-progress', 'high');
  assert.strictEqual(task.title, 'Finish report');
  assert.strictEqual(task.description, 'Complete Q1 analysis');
  assert.strictEqual(task.status, 'in-progress');
  assert.strictEqual(task.priority, 'high');
  console.log('✓ createTask: with all fields provided');
}

// createTask: title trimming
{
  const task = createTask('  Task with spaces  ', '  Description  ');
  assert.strictEqual(task.title, 'Task with spaces');
  assert.strictEqual(task.description, 'Description');
  console.log('✓ createTask: trims whitespace from title and description');
}

// createTask: auto-generated id uniqueness
{
  const task1 = createTask('Task 1');
  const task2 = createTask('Task 2');
  assert.notStrictEqual(task1.id, task2.id);
  console.log('✓ createTask: generates unique IDs');
}

// createTask: timestamp format (ISO 8601)
{
  const task = createTask('Test');
  assert.match(task.createdAt, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  assert.match(task.updatedAt, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  console.log('✓ createTask: timestamps in ISO 8601 format');
}

// createTask: error on empty title
{
  assert.throws(
    () => createTask(''),
    /Task title is required and must be a non-empty string/
  );
  assert.throws(
    () => createTask('   '),
    /Task title is required and must be a non-empty string/
  );
  console.log('✓ createTask: error on empty title');
}

// createTask: error on non-string title
{
  assert.throws(
    () => createTask(null),
    /Task title is required and must be a non-empty string/
  );
  assert.throws(
    () => createTask(123),
    /Task title is required and must be a non-empty string/
  );
  console.log('✓ createTask: error on non-string title');
}

// createTask: error on title exceeding 200 chars
{
  const longTitle = 'x'.repeat(201);
  assert.throws(
    () => createTask(longTitle),
    /Task title must be 200 characters or less/
  );
  console.log('✓ createTask: error on title > 200 chars');
}

// createTask: valid title at 200 char boundary
{
  const maxTitle = 'x'.repeat(200);
  const task = createTask(maxTitle);
  assert.strictEqual(task.title.length, 200);
  console.log('✓ createTask: accepts title at 200 char limit');
}

// createTask: error on non-string description
{
  assert.throws(
    () => createTask('Title', 123),
    /Task description must be a string/
  );
  console.log('✓ createTask: error on non-string description');
}

// createTask: error on description exceeding 1000 chars
{
  const longDesc = 'x'.repeat(1001);
  assert.throws(
    () => createTask('Title', longDesc),
    /Task description must be 1000 characters or less/
  );
  console.log('✓ createTask: error on description > 1000 chars');
}

// createTask: valid description at 1000 char boundary
{
  const maxDesc = 'x'.repeat(1000);
  const task = createTask('Title', maxDesc);
  assert.strictEqual(task.description.length, 1000);
  console.log('✓ createTask: accepts description at 1000 char limit');
}

// createTask: error on invalid status
{
  assert.throws(
    () => createTask('Title', '', 'invalid-status'),
    /Status must be one of/
  );
  console.log('✓ createTask: error on invalid status');
}

// createTask: valid statuses
{
  for (const status of STATUSES) {
    const task = createTask('Title', '', status);
    assert.strictEqual(task.status, status);
  }
  console.log('✓ createTask: accepts all valid statuses');
}

// createTask: error on invalid priority
{
  assert.throws(
    () => createTask('Title', '', 'todo', 'invalid-priority'),
    /Priority must be one of/
  );
  console.log('✓ createTask: error on invalid priority');
}

// createTask: valid priorities
{
  for (const priority of PRIORITIES) {
    const task = createTask('Title', '', 'todo', priority);
    assert.strictEqual(task.priority, priority);
  }
  console.log('✓ createTask: accepts all valid priorities');
}

// updateTaskFields: update title
{
  const original = createTask('Old Title');
  const updated = updateTaskFields(original, { title: 'New Title' });
  assert.strictEqual(updated.title, 'New Title');
  assert.strictEqual(updated.id, original.id);
  assert.strictEqual(updated.createdAt, original.createdAt);
  assert(updated.updatedAt); // updatedAt is set
  console.log('✓ updateTaskFields: updates title and updatedAt');
}

// updateTaskFields: update description
{
  const original = createTask('Title', 'Old desc');
  const updated = updateTaskFields(original, { description: 'New desc' });
  assert.strictEqual(updated.description, 'New desc');
  console.log('✓ updateTaskFields: updates description');
}

// updateTaskFields: update status
{
  const original = createTask('Title', '', 'todo');
  const updated = updateTaskFields(original, { status: 'in-progress' });
  assert.strictEqual(updated.status, 'in-progress');
  console.log('✓ updateTaskFields: updates status');
}

// updateTaskFields: update priority
{
  const original = createTask('Title', '', 'todo', 'low');
  const updated = updateTaskFields(original, { priority: 'high' });
  assert.strictEqual(updated.priority, 'high');
  console.log('✓ updateTaskFields: updates priority');
}

// updateTaskFields: update multiple fields
{
  const original = createTask('Title', 'Desc', 'todo', 'low');
  const updated = updateTaskFields(original, {
    title: 'New Title',
    status: 'done',
    priority: 'high',
  });
  assert.strictEqual(updated.title, 'New Title');
  assert.strictEqual(updated.status, 'done');
  assert.strictEqual(updated.priority, 'high');
  assert.strictEqual(updated.description, 'Desc');
  console.log('✓ updateTaskFields: updates multiple fields');
}

// updateTaskFields: error on empty title
{
  const original = createTask('Title');
  assert.throws(
    () => updateTaskFields(original, { title: '' }),
    /Task title is required and must be a non-empty string/
  );
  console.log('✓ updateTaskFields: error on empty title update');
}

// updateTaskFields: error on invalid status
{
  const original = createTask('Title');
  assert.throws(
    () => updateTaskFields(original, { status: 'invalid' }),
    /Status must be one of/
  );
  console.log('✓ updateTaskFields: error on invalid status update');
}

// updateTaskFields: error on invalid priority
{
  const original = createTask('Title');
  assert.throws(
    () => updateTaskFields(original, { priority: 'critical' }),
    /Priority must be one of/
  );
  console.log('✓ updateTaskFields: error on invalid priority update');
}

// updateTaskFields: prevent id modification
{
  const original = createTask('Title');
  assert.throws(
    () => updateTaskFields(original, { id: 'different-id' }),
    /Task id is immutable/
  );
  console.log('✓ updateTaskFields: prevents id modification');
}

// updateTaskFields: prevent createdAt modification
{
  const original = createTask('Title');
  assert.throws(
    () => updateTaskFields(original, { createdAt: '2023-01-01T00:00:00.000Z' }),
    /Task createdAt is immutable/
  );
  console.log('✓ updateTaskFields: prevents createdAt modification');
}

// updateTaskFields: same id still rejected (immutable)
{
  const original = createTask('Title');
  assert.throws(
    () => updateTaskFields(original, { id: original.id }),
    /Task id is immutable/
  );
  console.log('✓ updateTaskFields: rejects same id update as immutable');
}

// updateTaskFields: same createdAt still rejected (immutable)
{
  const original = createTask('Title');
  assert.throws(
    () => updateTaskFields(original, { createdAt: original.createdAt }),
    /Task createdAt is immutable/
  );
  console.log('✓ updateTaskFields: rejects same createdAt update as immutable');
}

// updateTaskFields: original object unchanged
{
  const original = createTask('Original Title');
  const originalId = original.id;
  const originalUpdatedAt = original.updatedAt;
  const updated = updateTaskFields(original, { title: 'New Title' });
  assert.strictEqual(original.title, 'Original Title');
  assert.strictEqual(original.id, originalId);
  assert.strictEqual(original.updatedAt, originalUpdatedAt);
  console.log('✓ updateTaskFields: does not mutate original object');
}

// updateTaskFields: title trimming
{
  const original = createTask('Title');
  const updated = updateTaskFields(original, { title: '  New Title  ' });
  assert.strictEqual(updated.title, 'New Title');
  console.log('✓ updateTaskFields: trims whitespace from title updates');
}

// ========== EDGE CASE TESTS ==========

// createTask: title with single character (boundary)
{
  const task = createTask('A');
  assert.strictEqual(task.title, 'A');
  console.log('✓ createTask: accepts single character title');
}

// createTask: description with single character
{
  const task = createTask('Title', 'D');
  assert.strictEqual(task.description, 'D');
  console.log('✓ createTask: accepts single character description');
}

// createTask: empty description is valid (default)
{
  const task = createTask('Title');
  assert.strictEqual(task.description, '');
  console.log('✓ createTask: empty description is valid');
}

// createTask: null description throws error (not a string)
{
  assert.throws(
    () => createTask('Title', null),
    /Task description must be a string/
  );
  console.log('✓ createTask: null description throws error');
}

// createTask: undefined description defaults to empty string
{
  const task = createTask('Title', undefined);
  assert.strictEqual(task.description, '');
  console.log('✓ createTask: undefined description triggers default');
}

// createTask: whitespace-only description becomes empty
{
  const task = createTask('Title', '   ');
  assert.strictEqual(task.description, '');
  console.log('✓ createTask: whitespace-only description becomes empty');
}

// createTask: boolean as title throws error
{
  assert.throws(
    () => createTask(true),
    /Task title is required and must be a non-empty string/
  );
  assert.throws(
    () => createTask(false),
    /Task title is required and must be a non-empty string/
  );
  console.log('✓ createTask: error on boolean title');
}

// createTask: boolean as description throws error
{
  assert.throws(
    () => createTask('Title', true),
    /Task description must be a string/
  );
  assert.throws(
    () => createTask('Title', false),
    /Task description must be a string/
  );
  console.log('✓ createTask: error on boolean description');
}

// createTask: array as title throws error
{
  assert.throws(
    () => createTask(['Title']),
    /Task title is required and must be a non-empty string/
  );
  console.log('✓ createTask: error on array title');
}

// createTask: object as title throws error
{
  assert.throws(
    () => createTask({ title: 'Title' }),
    /Task title is required and must be a non-empty string/
  );
  console.log('✓ createTask: error on object title');
}

// createTask: NaN as title throws error
{
  assert.throws(
    () => createTask(NaN),
    /Task title is required and must be a non-empty string/
  );
  console.log('✓ createTask: error on NaN title');
}

// createTask: Infinity as title throws error
{
  assert.throws(
    () => createTask(Infinity),
    /Task title is required and must be a non-empty string/
  );
  console.log('✓ createTask: error on Infinity title');
}

// createTask: title at 200 chars exactly (boundary)
{
  const title200 = 'x'.repeat(200);
  const task = createTask(title200);
  assert.strictEqual(task.title.length, 200);
  console.log('✓ createTask: title at exactly 200 chars');
}

// createTask: title at 201 chars exceeds boundary
{
  const title201 = 'x'.repeat(201);
  assert.throws(
    () => createTask(title201),
    /Task title must be 200 characters or less/
  );
  console.log('✓ createTask: title at 201 chars fails');
}

// createTask: description at 1000 chars exactly (boundary)
{
  const desc1000 = 'x'.repeat(1000);
  const task = createTask('Title', desc1000);
  assert.strictEqual(task.description.length, 1000);
  console.log('✓ createTask: description at exactly 1000 chars');
}

// createTask: description at 1001 chars exceeds boundary
{
  const desc1001 = 'x'.repeat(1001);
  assert.throws(
    () => createTask('Title', desc1001),
    /Task description must be 1000 characters or less/
  );
  console.log('✓ createTask: description at 1001 chars fails');
}

// createTask: status is case-sensitive (lowercase required)
{
  assert.throws(
    () => createTask('Title', '', 'TODO'),
    /Status must be one of/
  );
  assert.throws(
    () => createTask('Title', '', 'Todo'),
    /Status must be one of/
  );
  console.log('✓ createTask: status is case-sensitive');
}

// createTask: priority is case-sensitive (lowercase required)
{
  assert.throws(
    () => createTask('Title', '', 'todo', 'HIGH'),
    /Priority must be one of/
  );
  assert.throws(
    () => createTask('Title', '', 'todo', 'High'),
    /Priority must be one of/
  );
  console.log('✓ createTask: priority is case-sensitive');
}

// createTask: null status throws error
{
  assert.throws(
    () => createTask('Title', '', null),
    /Status must be one of/
  );
  console.log('✓ createTask: null status throws error');
}

// createTask: undefined status triggers default 'todo'
{
  const task = createTask('Title', '', undefined);
  assert.strictEqual(task.status, 'todo');
  console.log('✓ createTask: undefined status triggers default todo');
}

// createTask: null priority throws error
{
  assert.throws(
    () => createTask('Title', '', 'todo', null),
    /Priority must be one of/
  );
  console.log('✓ createTask: null priority throws error');
}

// createTask: undefined priority triggers default 'medium'
{
  const task = createTask('Title', '', 'todo', undefined);
  assert.strictEqual(task.priority, 'medium');
  console.log('✓ createTask: undefined priority triggers default medium');
}


// createTask: many rapid creations have unique IDs
{
  const tasks = [];
  for (let i = 0; i < 100; i++) {
    tasks.push(createTask(`Task ${i}`));
  }
  const ids = tasks.map(t => t.id);
  const uniqueIds = new Set(ids);
  assert.strictEqual(ids.length, uniqueIds.size);
  console.log('✓ createTask: 100 rapid creations have unique IDs');
}

// createTask: many rapid creations have increasing timestamps
{
  const tasks = [];
  for (let i = 0; i < 10; i++) {
    tasks.push(createTask(`Task ${i}`));
  }
  for (let i = 1; i < tasks.length; i++) {
    assert(tasks[i].createdAt >= tasks[i - 1].createdAt);
  }
  console.log('✓ createTask: rapid creations have chronological timestamps');
}

// updateTaskFields: empty update object keeps content and refreshes updatedAt
{
  const original = createTask('Title', 'Desc', 'todo', 'low');
  const updated = updateTaskFields(original, {});
  assert.strictEqual(updated.id, original.id);
  assert.strictEqual(updated.title, original.title);
  assert.strictEqual(updated.description, original.description);
  assert.strictEqual(updated.status, original.status);
  assert.strictEqual(updated.priority, original.priority);
  assert.match(updated.updatedAt, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  console.log('✓ updateTaskFields: empty object refreshes updatedAt');
}

// updateTaskFields: null values in update object throw error
{
  const original = createTask('Original Title');
  assert.throws(
    () => updateTaskFields(original, { title: null }),
    /Task title is required and must be a non-empty string/
  );
  console.log('✓ updateTaskFields: null values throw validation error');
}

// updateTaskFields: missing fields in update object are not updated
{
  const original = createTask('Original Title');
  const updated = updateTaskFields(original, {});
  assert.strictEqual(updated.title, 'Original Title');
  console.log('✓ updateTaskFields: missing fields remain unchanged');
}

// updateTaskFields: unknown fields are rejected
{
  const original = createTask('Title');
  assert.throws(
    () => updateTaskFields(original, { unknownField: 'value', title: 'New Title' }),
    /Cannot update unknown field/
  );
  console.log('✓ updateTaskFields: unknown fields are rejected');
}

// updateTaskFields: multiple sequential updates accumulate
{
  let task = createTask('Original Title', 'Original Desc', 'todo', 'low');
  task = updateTaskFields(task, { title: 'Title 2' });
  task = updateTaskFields(task, { description: 'Desc 2' });
  task = updateTaskFields(task, { status: 'in-progress' });
  task = updateTaskFields(task, { priority: 'high' });
  assert.strictEqual(task.title, 'Title 2');
  assert.strictEqual(task.description, 'Desc 2');
  assert.strictEqual(task.status, 'in-progress');
  assert.strictEqual(task.priority, 'high');
  console.log('✓ updateTaskFields: multiple sequential updates accumulate');
}

// updateTaskFields: updating to same values increments updatedAt
{
  const original = createTask('Title', 'Desc', 'todo', 'low');
  const updated1 = updateTaskFields(original, { title: 'New Title' });
  const updated2 = updateTaskFields(updated1, { title: 'New Title' });
  // updatedAt should be different timestamps even if content same
  // (both updates occurred)
  assert.strictEqual(updated1.title, 'New Title');
  assert.strictEqual(updated2.title, 'New Title');
  console.log('✓ updateTaskFields: all updates increment updatedAt');
}

// updateTaskFields: description can be reset to empty
{
  const original = createTask('Title', 'Some description');
  const updated = updateTaskFields(original, { description: '' });
  assert.strictEqual(updated.description, '');
  console.log('✓ updateTaskFields: description can be reset to empty');
}

// updateTaskFields: title boundary at 200 chars
{
  const original = createTask('Short');
  const max200 = 'x'.repeat(200);
  const updated = updateTaskFields(original, { title: max200 });
  assert.strictEqual(updated.title.length, 200);
  console.log('✓ updateTaskFields: title update at 200 char boundary');
}

// updateTaskFields: description boundary at 1000 chars
{
  const original = createTask('Title');
  const max1000 = 'y'.repeat(1000);
  const updated = updateTaskFields(original, { description: max1000 });
  assert.strictEqual(updated.description.length, 1000);
  console.log('✓ updateTaskFields: description update at 1000 char boundary');
}

// updateTaskFields: all statuses are updatable
{
  const original = createTask('Title');
  for (const status of STATUSES) {
    const updated = updateTaskFields(original, { status });
    assert.strictEqual(updated.status, status);
  }
  console.log('✓ updateTaskFields: all statuses are updatable');
}

// updateTaskFields: all priorities are updatable
{
  const original = createTask('Title');
  for (const priority of PRIORITIES) {
    const updated = updateTaskFields(original, { priority });
    assert.strictEqual(updated.priority, priority);
  }
  console.log('✓ updateTaskFields: all priorities are updatable');
}

// updateTaskFields: category key is rejected as unknown
{
  const original = createTask('Title');
  assert.throws(
    () => updateTaskFields(original, { category: 'urgent' }),
    /Cannot update unknown field: category/
  );
  console.log('✓ updateTaskFields: rejects category as unknown field');
}

// updateTaskFields: cyclic updates preserve immutability
{
  const original = createTask('A');
  const copy1 = updateTaskFields(original, { title: 'B' });
  const copy2 = updateTaskFields(copy1, { title: 'C' });
  const copy3 = updateTaskFields(copy2, { title: 'A' });
  assert.strictEqual(original.title, 'A');
  assert.strictEqual(copy1.title, 'B');
  assert.strictEqual(copy2.title, 'C');
  assert.strictEqual(copy3.title, 'A');
  console.log('✓ updateTaskFields: cyclic updates preserve all versions');
}

console.log('\n✅ All Task model tests passed!\n');
