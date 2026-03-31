import { TaskStore } from './services/taskService.js';
import { colorPriority, colorStatus } from './utils/colors.js';

/**
 * Task Manager CLI - Entry point demonstrating all features
 */
async function main() {
  try {
    const store = new TaskStore();

    console.log('=== Task Manager CLI Demo ===\n');

    // Feature 1: Create tasks
    console.log('1. Creating tasks...');
    const task1 = store.createTask(
      'Buy groceries',
      'Milk, bread, eggs',
      'todo',
      'high'
    );
    console.log(`✓ Created task: ${task1.title} (${task1.id})`);

    const task2 = store.createTask(
      'Write documentation',
      'Document API endpoints',
      'in-progress',
      'medium'
    );
    console.log(`✓ Created task: ${task2.title} (${task2.id})`);

    const task3 = store.createTask(
      'Review pull requests',
      '',
      'todo',
      'low'
    );
    console.log(`✓ Created task: ${task3.title} (${task3.id})`);

    const task4 = store.createTask(
      'Deploy to production',
      'Release version 1.0.0',
      'done',
      'high'
    );
    console.log(`✓ Created task: ${task4.title} (${task4.id})\n`);

    // Feature 2: List all tasks
    console.log('2. Listing all tasks...');
    const allTasks = store.listTasks();
    console.log(`Found ${allTasks.length} tasks:`);
    allTasks.forEach(task => {
      console.log(`  - [${colorStatus(task.status)}] ${task.title} (Priority: ${colorPriority(task.priority)})`);
    });
    console.log();

    // Feature 3: Filter by status
    console.log('3. Filtering by status (todo)...');
    const todoTasks = store.listTasks({ status: 'todo' });
    console.log(`Found ${todoTasks.length} TODO tasks:`);
    todoTasks.forEach(task => {
      console.log(`  - ${task.title}`);
    });
    console.log();

    // Feature 4: Filter by priority
    console.log('4. Filtering by priority (high)...');
    const highPriorityTasks = store.listTasks({ priority: 'high' });
    console.log(`Found ${highPriorityTasks.length} high-priority tasks:`);
    highPriorityTasks.forEach(task => {
      console.log(`  - [${colorStatus(task.status)}] ${task.title}`);
    });
    console.log();

    // Feature 5: Combined filtering
    console.log('5. Filtering by status AND priority...');
    const todoHighTasks = store.listTasks({ status: 'todo', priority: 'high' });
    console.log(`Found ${todoHighTasks.length} tasks that are TODO and high-priority:`);
    todoHighTasks.forEach(task => {
      console.log(`  - ${task.title}`);
    });
    console.log();

    // Feature 6: Sort by priority (descending)
    console.log('6. Sorting by priority (high to low)...');
    const byPriority = store.listTasks({ sortBy: 'priority', order: 'desc' });
    console.log('Tasks sorted by priority:');
    byPriority.forEach(task => {
      console.log(`  - [${colorPriority(task.priority)}] ${task.title}`);
    });
    console.log();

    // Feature 7: Sort by creation date
    console.log('7. Sorting by creation date (newest to oldest)...');
    const byDate = store.listTasks({ sortBy: 'createdAt', order: 'desc' });
    console.log('Tasks sorted by creation date:');
    byDate.forEach(task => {
      const date = new Date(task.createdAt).toLocaleString();
      console.log(`  - ${task.title} (created: ${date})`);
    });
    console.log();

    // Feature 8: Update a task
    console.log('8. Updating a task...');
    const updatedTask = store.updateTask(task1.id, {
      status: 'in-progress',
      priority: 'medium',
    });
    console.log(`✓ Updated task "${task1.title}":`);
    console.log(`  - Status: ${colorStatus('todo')} → ${colorStatus(updatedTask.status)}`);
    console.log(`  - Priority: ${colorPriority('high')} → ${colorPriority(updatedTask.priority)}`);
    console.log(`  - updatedAt changed: ${task1.updatedAt !== updatedTask.updatedAt}\n`);

    // Feature 9: Retrieve a single task
    console.log('9. Retrieving a task by ID...');
    const retrieved = store.getTaskById(task2.id);
    console.log(`✓ Retrieved task: ${retrieved.title}`);
    console.log(`  - Description: ${retrieved.description}`);
    console.log(`  - Status: ${colorStatus(retrieved.status)}`);
    console.log(`  - Priority: ${colorPriority(retrieved.priority)}\n`);

    // Feature 10: Delete a task
    console.log('10. Deleting a task...');
    const deletedTask = store.deleteTask(task3.id);
    console.log(`✓ Deleted task: "${deletedTask.title}"`);
    console.log(`Tasks remaining: ${store.getAllTasks().length}\n`);

    // Feature 11: Show final state
    console.log('11. Final task list:');
    const finalTasks = store.getAllTasks();
    finalTasks.forEach((task, index) => {
      console.log(
        `  ${index + 1}. [${colorStatus(task.status)}] ${task.title} (Priority: ${colorPriority(task.priority)})`
      );
    });
    console.log();

    console.log('=== Demo completed successfully ===');
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

main();
