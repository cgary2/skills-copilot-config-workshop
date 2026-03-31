import assert from 'assert';
import {
  validateTitle,
  validateDescription,
  validateStatus,
  validatePriority,
  validateFilterOptions,
  validateSortOptions,
} from '../src/utils/validators.js';

/**
 * Test suite for Validator utilities
 */

// validateTitle: valid title
{
  assert.doesNotThrow(() => validateTitle('Buy milk'));
  console.log('✓ validateTitle: accepts valid title');
}

// validateTitle: error on empty string
{
  assert.throws(
    () => validateTitle(''),
    /Task title is required and must be a non-empty string/
  );
  console.log('✓ validateTitle: rejects empty string');
}

// validateTitle: error on whitespace only
{
  assert.throws(
    () => validateTitle('   '),
    /Task title is required and must be a non-empty string/
  );
  console.log('✓ validateTitle: rejects whitespace-only string');
}

// validateTitle: error on non-string
{
  assert.throws(
    () => validateTitle(null),
    /Task title is required and must be a non-empty string/
  );
  assert.throws(
    () => validateTitle(123),
    /Task title is required and must be a non-empty string/
  );
  assert.throws(
    () => validateTitle(undefined),
    /Task title is required and must be a non-empty string/
  );
  console.log('✓ validateTitle: rejects non-string types');
}

// validateTitle: error on title > 200 chars
{
  const longTitle = 'x'.repeat(201);
  assert.throws(
    () => validateTitle(longTitle),
    /Task title must be 200 characters or less/
  );
  console.log('✓ validateTitle: rejects title > 200 chars');
}

// validateTitle: accepts title at 200 char boundary
{
  const maxTitle = 'x'.repeat(200);
  assert.doesNotThrow(() => validateTitle(maxTitle));
  console.log('✓ validateTitle: accepts title at 200 char limit');
}

// validateTitle: accepts title at 1 char
{
  assert.doesNotThrow(() => validateTitle('a'));
  console.log('✓ validateTitle: accepts single character title');
}

// validateDescription: valid description
{
  assert.doesNotThrow(() => validateDescription('This is a description'));
  console.log('✓ validateDescription: accepts valid description');
}

// validateDescription: empty description is valid
{
  assert.doesNotThrow(() => validateDescription(''));
  console.log('✓ validateDescription: accepts empty description');
}

// validateDescription: error on non-string
{
  assert.throws(
    () => validateDescription(123),
    /Task description must be a string/
  );
  assert.throws(
    () => validateDescription(null),
    /Task description must be a string/
  );
  console.log('✓ validateDescription: rejects non-string types');
}

// validateDescription: error on description > 1000 chars
{
  const longDesc = 'x'.repeat(1001);
  assert.throws(
    () => validateDescription(longDesc),
    /Task description must be 1000 characters or less/
  );
  console.log('✓ validateDescription: rejects description > 1000 chars');
}

// validateDescription: accepts description at 1000 char boundary
{
  const maxDesc = 'x'.repeat(1000);
  assert.doesNotThrow(() => validateDescription(maxDesc));
  console.log('✓ validateDescription: accepts description at 1000 char limit');
}

// validateStatus: returns true for valid statuses
{
  assert.strictEqual(validateStatus('todo'), true);
  assert.strictEqual(validateStatus('in-progress'), true);
  assert.strictEqual(validateStatus('done'), true);
  console.log('✓ validateStatus: returns true for valid statuses');
}

// validateStatus: returns false for invalid status
{
  assert.strictEqual(validateStatus('invalid'), false);
  assert.strictEqual(validateStatus('DONE'), false);
  assert.strictEqual(validateStatus(''), false);
  console.log('✓ validateStatus: returns false for invalid status');
}

// validateStatus: returns false for non-string
{
  assert.strictEqual(validateStatus(null), false);
  assert.strictEqual(validateStatus(123), false);
  assert.strictEqual(validateStatus(undefined), false);
  console.log('✓ validateStatus: returns false for non-string types');
}

// validatePriority: returns true for valid priorities
{
  assert.strictEqual(validatePriority('low'), true);
  assert.strictEqual(validatePriority('medium'), true);
  assert.strictEqual(validatePriority('high'), true);
  console.log('✓ validatePriority: returns true for valid priorities');
}

// validatePriority: returns false for invalid priority
{
  assert.strictEqual(validatePriority('critical'), false);
  assert.strictEqual(validatePriority('LOW'), false);
  assert.strictEqual(validatePriority(''), false);
  console.log('✓ validatePriority: returns false for invalid priority');
}

// validatePriority: returns false for non-string
{
  assert.strictEqual(validatePriority(null), false);
  assert.strictEqual(validatePriority(123), false);
  assert.strictEqual(validatePriority(undefined), false);
  console.log('✓ validatePriority: returns false for non-string types');
}

// validateFilterOptions: accepts valid status
{
  assert.doesNotThrow(() => validateFilterOptions({ status: 'todo' }));
  assert.doesNotThrow(() => validateFilterOptions({ status: 'in-progress' }));
  assert.doesNotThrow(() => validateFilterOptions({ status: 'done' }));
  console.log('✓ validateFilterOptions: accepts valid status filters');
}

// validateFilterOptions: accepts valid priority
{
  assert.doesNotThrow(() => validateFilterOptions({ priority: 'low' }));
  assert.doesNotThrow(() => validateFilterOptions({ priority: 'medium' }));
  assert.doesNotThrow(() => validateFilterOptions({ priority: 'high' }));
  console.log('✓ validateFilterOptions: accepts valid priority filters');
}

// validateFilterOptions: accepts both status and priority
{
  assert.doesNotThrow(() => validateFilterOptions({ status: 'todo', priority: 'high' }));
  console.log('✓ validateFilterOptions: accepts status and priority together');
}

// validateFilterOptions: accepts empty options
{
  assert.doesNotThrow(() => validateFilterOptions({}));
  assert.doesNotThrow(() => validateFilterOptions());
  console.log('✓ validateFilterOptions: accepts empty or no options');
}

// validateFilterOptions: error on invalid status
{
  assert.throws(
    () => validateFilterOptions({ status: 'invalid' }),
    /Status must be one of/
  );
  console.log('✓ validateFilterOptions: error on invalid status');
}

// validateFilterOptions: error on invalid priority
{
  assert.throws(
    () => validateFilterOptions({ priority: 'urgent' }),
    /Priority must be one of/
  );
  console.log('✓ validateFilterOptions: error on invalid priority');
}

// validateFilterOptions: ignores undefined status
{
  assert.doesNotThrow(() => validateFilterOptions({ status: undefined }));
  console.log('✓ validateFilterOptions: ignores undefined status');
}

// validateFilterOptions: ignores undefined priority
{
  assert.doesNotThrow(() => validateFilterOptions({ priority: undefined }));
  console.log('✓ validateFilterOptions: ignores undefined priority');
}

// validateSortOptions: accepts valid sortBy fields
{
  assert.doesNotThrow(() => validateSortOptions('priority', 'desc'));
  assert.doesNotThrow(() => validateSortOptions('createdAt', 'asc'));
  console.log('✓ validateSortOptions: accepts valid sortBy fields');
}

// validateSortOptions: accepts valid sort orders
{
  assert.doesNotThrow(() => validateSortOptions('priority', 'asc'));
  assert.doesNotThrow(() => validateSortOptions('priority', 'desc'));
  console.log('✓ validateSortOptions: accepts valid sort orders');
}

// validateSortOptions: error on invalid sortBy
{
  assert.throws(
    () => validateSortOptions('title', 'desc'),
    /Sort field must be one of/
  );
  assert.throws(
    () => validateSortOptions('status', 'asc'),
    /Sort field must be one of/
  );
  console.log('✓ validateSortOptions: error on invalid sortBy');
}

// validateSortOptions: error on invalid order
{
  assert.throws(
    () => validateSortOptions('priority', 'random'),
    /Sort order must be one of/
  );
  assert.throws(
    () => validateSortOptions('priority', 'ascending'),
    /Sort order must be one of/
  );
  console.log('✓ validateSortOptions: error on invalid sort order');
}

// validateSortOptions: case sensitive
{
  assert.throws(
    () => validateSortOptions('Priority', 'desc'),
    /Sort field must be one of/
  );
  assert.throws(
    () => validateSortOptions('priority', 'DESC'),
    /Sort order must be one of/
  );
  console.log('✓ validateSortOptions: validates case-sensitively');
}

// validateSortOptions: skips validation for falsy sortBy (optional)
{
  // Falsy values are allowed (considered as not provided)
  assert.doesNotThrow(() => validateSortOptions(null, 'desc'));
  assert.doesNotThrow(() => validateSortOptions(undefined, 'desc'));
  console.log('✓ validateSortOptions: allows falsy sortBy (optional parameter)');
}

// validateSortOptions: skips validation for falsy order (optional)
{
  // Falsy values are allowed (considered as not provided)
  assert.doesNotThrow(() => validateSortOptions('priority', null));
  assert.doesNotThrow(() => validateSortOptions('priority', undefined));
  console.log('✓ validateSortOptions: allows falsy order (optional parameter)');
}

console.log('\n✅ All Validator tests passed!\n');
