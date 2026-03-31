import assert from 'assert';
import { generateId } from '../../utils/id.js';

function runTest(name, fn) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
}

runTest('generateId returns a string', () => {
  assert.strictEqual(typeof generateId(), 'string');
});

runTest('generateId returns unique values', () => {
  assert.notStrictEqual(generateId(), generateId());
});
