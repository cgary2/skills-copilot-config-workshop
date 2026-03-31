import { pathToFileURL } from 'url';
import { routeCommand } from './cli.js';
import { instantiateTaskStore } from './store/task-store.js';
import { formatError } from './utils/format.js';

/**
 * Main Task Manager CLI entry point.
 * @param {string[]} [args] - Command arguments.
 * @returns {Promise<number>} Exit code.
 */
export default async function main(args = process.argv.slice(2)) {
  try {
    const store = instantiateTaskStore();
    const commandArgs = args.length === 0 ? ['demo'] : args;

    await routeCommand(commandArgs, store);
    return 0;
  } catch (error) {
    console.error(formatError(error.message));
    return 1;
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().then(code => {
    process.exitCode = code;
  });
}
