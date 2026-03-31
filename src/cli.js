import { filterTasks, sortTasks } from './services/task-service.js';
import { formatTask, formatTaskList } from './utils/format.js';

/**
 * Routes and executes a CLI command.
 * @param {string[]} args - Process arguments after entry point.
 * @param {import('./store/task-store.js').TaskStore} store - Task store.
 * @returns {Promise<void>} Completion signal.
 */
export async function routeCommand(args, store) {
  const [command, ...rest] = args;

  switch (command) {
    case 'create': {
      const title = readOption(rest, '--title');
      const description = readOption(rest, '--description') ?? '';
      const status = readOption(rest, '--status');
      const priority = readOption(rest, '--priority');

      if (!title) {
        throw new Error('Missing required argument: --title');
      }

      const created = store.create({ title, description, status, priority });
      console.log('Task created:');
      console.log(formatTask(created));
      return;
    }

    case 'list': {
      const status = readOption(rest, '--status');
      const priority = readOption(rest, '--priority');
      const sortBy = readOption(rest, '--sortBy') ?? 'createdAt';
      const order = readOption(rest, '--order') ?? 'desc';

      const filtered = filterTasks(store.list(), { status, priority });
      const sorted = sortTasks(filtered, sortBy, order);
      console.log(formatTaskList(sorted));
      return;
    }

    case 'update': {
      const id = readOption(rest, '--id');

      if (!id) {
        throw new Error('Missing required argument: --id');
      }

      const updates = {};
      const title = readOption(rest, '--title');
      const description = readOption(rest, '--description');
      const status = readOption(rest, '--status');
      const priority = readOption(rest, '--priority');

      if (title !== undefined) updates.title = title;
      if (description !== undefined) updates.description = description;
      if (status !== undefined) updates.status = status;
      if (priority !== undefined) updates.priority = priority;

      if (Object.keys(updates).length === 0) {
        throw new Error('Provide at least one field to update');
      }

      const updated = store.update(id, updates);
      console.log('Task updated:');
      console.log(formatTask(updated));
      return;
    }

    case 'delete': {
      const id = readOption(rest, '--id');

      if (!id) {
        throw new Error('Missing required argument: --id');
      }

      const deleted = store.delete(id);
      console.log(`Deleted task: ${deleted.id}`);
      return;
    }

    case 'help':
      handleHelp();
      return;

    case 'demo':
      runDemo(store);
      return;

    default:
      throw new Error(`Unknown command: ${command}`);
  }
}

/**
 * Prints command usage help.
 */
function handleHelp() {
  console.log('Usage:');
  console.log('  create --title <title> [--description <text>] [--status <status>] [--priority <priority>]');
  console.log('  list [--status <status>] [--priority <priority>] [--sortBy priority|createdAt] [--order asc|desc]');
  console.log('  update --id <id> [--title <title>] [--description <text>] [--status <status>] [--priority <priority>]');
  console.log('  delete --id <id>');
  console.log('  help');
}

/**
 * Runs a short feature demo.
 * @param {import('./store/task-store.js').TaskStore} store - Task store.
 */
function runDemo(store) {
  console.log('Task Manager demo');

  const first = store.create({
    title: 'Draft release notes',
    description: 'Summarize this sprint',
    status: 'todo',
    priority: 'high',
  });
  const second = store.create({
    title: 'Fix login redirect',
    description: 'Handle deep link redirects',
    status: 'in-progress',
    priority: 'medium',
  });
  const third = store.create({
    title: 'Archive old logs',
    description: '',
    status: 'done',
    priority: 'low',
  });

  console.log('\nCreated tasks:');
  console.log(formatTaskList([first, second, third]));

  console.log('\nFiltered todo tasks:');
  console.log(formatTaskList(filterTasks(store.list(), { status: 'todo' })));

  console.log('\nSorted by priority desc:');
  console.log(formatTaskList(sortTasks(store.list(), 'priority', 'desc')));

  const updated = store.update(first.id, { status: 'done', priority: 'medium' });
  console.log('\nUpdated task:');
  console.log(formatTask(updated));

  store.delete(third.id);
  console.log('\nAfter delete:');
  console.log(formatTaskList(store.list()));
}

/**
 * Reads a string option from command arguments.
 * @param {string[]} args - Command arguments.
 * @param {string} key - Option key.
 * @returns {string|undefined} Option value.
 */
function readOption(args, key) {
  const index = args.indexOf(key);

  if (index === -1) {
    return undefined;
  }

  return args[index + 1];
}
