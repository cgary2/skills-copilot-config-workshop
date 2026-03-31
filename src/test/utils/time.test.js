import assert from 'assert';
import { getCurrentTimestamp } from '../../utils/time.js';

function runTest(name, fn) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
}

runTest('getCurrentTimestamp returns a string', () => {
  assert.strictEqual(typeof getCurrentTimestamp(), 'string');
});

runTest('getCurrentTimestamp returns ISO-like format', () => {
  assert.match(getCurrentTimestamp(), /^\d{4}-\d{2}-\d{2}T/);
});
