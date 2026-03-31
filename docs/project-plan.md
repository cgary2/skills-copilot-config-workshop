# Task Manager CLI Project Plan

## 1. Project Overview
This project is a small, workshop-friendly Task Manager command-line application for Node.js 20+ that lets users create, list, update, and delete tasks in a single runtime session. Tasks are modeled with clear metadata (title, description, status, priority, createdAt, updatedAt), and users can filter and sort results to quickly find relevant work. The implementation uses only built-in Node.js modules and stores data in memory, keeping scope focused on CLI design, data modeling, and incremental software development practices.

## 2. User Stories
1. As a user, I want to create a task so that I can track new work items.
   Acceptance criteria:
   - A command exists to create a task with required `title` and optional `description`.
   - New tasks default to `status: "todo"` and a valid `priority` when not provided.
   - `createdAt` and `updatedAt` are set automatically when the task is created.
   - The CLI prints the created task with a generated unique `id`.

2. As a user, I want to list all tasks so that I can see my current work.
   Acceptance criteria:
   - A command lists all tasks currently in memory.
   - The output includes `id`, `title`, `status`, `priority`, `createdAt`, and `updatedAt`.
   - When no tasks exist, the CLI prints a clear empty-state message.

3. As a user, I want to update a task so that task details stay accurate.
   Acceptance criteria:
   - A command updates an existing task by `id`.
   - Updatable fields include `title`, `description`, `status`, and `priority`.
   - Invalid `status` or `priority` values are rejected with helpful errors.
   - `updatedAt` changes on successful update; `createdAt` does not change.

4. As a user, I want to delete a task so that I can remove completed or unwanted entries.
   Acceptance criteria:
   - A command deletes a task by `id`.
   - Deleting a missing `id` returns a clear not-found message.
   - Deleted tasks no longer appear in list results.

5. As a user, I want to filter tasks so that I can focus on relevant work.
   Acceptance criteria:
   - Listing supports filtering by `status`.
   - Listing supports filtering by `priority`.
   - Filters can be combined (`status` + `priority`).
   - Invalid filter values are rejected with a clear validation message.

6. As a user, I want to sort tasks so that I can view them in meaningful order.
   Acceptance criteria:
   - Listing supports sorting by `priority`.
   - Listing supports sorting by `createdAt`.
   - A sort direction option is available (`asc` or `desc`).
   - Sorting behavior is deterministic for tasks with equal values (tie-break by `id`).

## 3. Data Model
- `Task`
  - `id: string` - unique identifier generated in memory.
  - `title: string` - short task name, required.
  - `description: string` - longer details, optional (default `""`).
  - `status: "todo" | "in-progress" | "done"` - lifecycle state.
  - `priority: "low" | "medium" | "high"` - urgency level.
  - `createdAt: string` - ISO timestamp set at creation.
  - `updatedAt: string` - ISO timestamp set at creation and update.

- `TaskStore` (in-memory runtime state)
  - `tasks: Task[]` - list of tasks kept only for current process lifetime.

- `ListOptions`
  - `status?: "todo" | "in-progress" | "done"`
  - `priority?: "low" | "medium" | "high"`
  - `sortBy?: "priority" | "createdAt"`
  - `order?: "asc" | "desc"`

## 4. File Structure
Proposed layout under `src/`:

```text
src/
  cli.js              # Parse argv and route commands
  index.js            # Entry point, starts CLI
  constants.js        # Allowed statuses, priorities, defaults
  models/
    task.js           # Task factory/helpers and type-like JSDoc
  store/
    task-store.js     # In-memory array and CRUD operations
  services/
    task-service.js   # Validation, filtering, sorting, business rules
  utils/
    id.js             # Simple unique id generation
    time.js           # Timestamp helper (ISO strings)
    format.js         # Console output formatting
```

## 5. Implementation Phases
1. Phase 1: Project skeleton and command routing
   - Create entry point and basic CLI argument parsing.
   - Add command stubs for `create`, `list`, `update`, `delete`.
   - Define constants for allowed statuses and priorities.

2. Phase 2: Core task model and in-memory CRUD
   - Implement task factory with timestamps and defaults.
   - Implement `TaskStore` with create/read/update/delete methods.
   - Add not-found handling and basic input guards.

3. Phase 3: Validation and update logic
   - Validate `status` and `priority` values.
   - Enforce required fields and safe partial updates.
   - Ensure `updatedAt` changes only on successful updates.

4. Phase 4: List enhancements (filter + sort)
   - Add list options parser for `status`, `priority`, `sortBy`, `order`.
   - Implement filtering and deterministic sorting.
   - Verify combined filter behavior and edge cases.

5. Phase 5: UX polish and manual verification
   - Improve output formatting and error messages.
   - Add helpful usage text (`--help`).
   - Run manual command scenarios for all acceptance criteria.
