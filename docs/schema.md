# Task Manager CLI — Technical Schema

## 1. Data Models

### Task
Core entity representing a single task in the system.

| Property | Type | Required | Default | Validation |
|----------|------|----------|---------|-----------|
| `id` | string | Yes | Generated UUID | Unique, immutable |
| `title` | string | Yes | — | Non-empty, max 200 chars |
| `description` | string | No | `""` | Max 1000 chars |
| `status` | `"todo" \| "in-progress" \| "done"` | Yes | `"todo"` | Must be one of the three values |
| `priority` | `"low" \| "medium" \| "high"` | Yes | `"medium"` | Must be one of the three values |
| `createdAt` | string (ISO 8601) | Yes | Current timestamp | Immutable, set at creation |
| `updatedAt` | string (ISO 8601) | Yes | Current timestamp | Updated on every modification |

## Validation Rules by Property

### `id`
- **Type:** Non-empty string
- **Format:** UUID v4 or timestamp-based unique identifier
- **Generation:** Auto-generated at task creation; never set by user input
- **Immutability:** Cannot be modified after creation
- **Uniqueness:** Must be unique across all tasks in the store
- **Error:** Throw `Error` if attempting to modify during `updateTaskFields()`

### `title`
- **Type:** Non-empty string
- **Length:** Minimum 1 character, maximum 200 characters
- **Whitespace:** Must be trimmed; leading/trailing spaces removed
- **Required:** Must always be provided (no default)
- **Error:** Throw `Error` if empty, null, undefined, or exceeds 200 chars
- **Error:** Throw `Error` if not a string

### `description`
- **Type:** String
- **Length:** Maximum 1000 characters (can be empty)
- **Whitespace:** Trimmed; empty string is valid
- **Default:** Empty string (`""`) if not provided
- **Error:** Throw `Error` if exceeds 1000 chars
- **Error:** Throw `Error` if not a string

### `status`
- **Type:** Enum string
- **Valid Values:** Exactly one of: `"todo"`, `"in-progress"`, `"done"`
- **Case-Sensitive:** Input must match exactly (no case conversion)
- **Default:** `"todo"` if not provided during creation
- **Validation Function:** `validateStatus(status: string): boolean` in `task-service.js`
- **Error:** Throw `Error` with message: `Status must be one of: todo, in-progress, done`

### `priority`
- **Type:** Enum string
- **Valid Values:** Exactly one of: `"low"`, `"medium"`, `"high"`
- **Case-Sensitive:** Input must match exactly (no case conversion)
- **Default:** `"medium"` if not provided during creation
- **Validation Function:** `validatePriority(priority: string): boolean` in `task-service.js`
- **Error:** Throw `Error` with message: `Priority must be one of: low, medium, high`

### `createdAt`
- **Type:** ISO 8601 datetime string
- **Format:** Must match `YYYY-MM-DDTHH:mm:ss.sssZ` (UTC)
- **Generation:** Auto-generated via `getCurrentTimestamp()` at task creation
- **Immutability:** Cannot be modified after creation; reject in `updateTaskFields()`
- **Timezone:** Always UTC; never accept local time strings
- **Error:** Throw `Error` if attempting to modify during update

### `updatedAt`
- **Type:** ISO 8601 datetime string
- **Format:** Must match `YYYY-MM-DDTHH:mm:ss.sssZ` (UTC)
- **Update Logic:** Set to current time on every task modification (create, update, delete is not an update)
- **Timezone:** Always UTC
- **Creation:** Initialized to same value as `createdAt` when task is created
- **Error:** Throw `Error` if manual timestamp provided (system-managed only)

## Validation Strategy

### At Creation (`createTask()`)
1. Validate `title` is non-empty string, ≤ 200 chars
2. Validate or set default `description` (≤ 1000 chars)
3. Validate or set default `status` (must exist in STATUSES)
4. Validate or set default `priority` (must exist in PRIORITIES)
5. Auto-generate `id`, `createdAt`, `updatedAt`
6. Throw immediately if any validation fails; never partially create

### During Update (`updateTaskFields()`)
1. Allow updates to only: `title`, `description`, `status`, `priority`
2. Reject attempts to modify: `id`, `createdAt`, `updatedAt`
3. Re-validate `title`, `description`, `status`, `priority` according to creation rules
4. Auto-update `updatedAt` to current time
5. Return new Task object; do not mutate original

### At Query/Filter Time
1. Validate `status` and `priority` filters match valid enums
2. Throw `Error` if unknown filter values provided
3. Silently ignore missing/undefined filter options (treated as "any")

### TaskStoreInternal
In-memory container for all tasks during runtime.

| Property | Type | Required | Notes |
|----------|------|----------|-------|
| `tasks` | `Task[]` | Yes | Mutable array, stored in RAM only |

### ListOptions
Filtering and sorting options for task queries.

| Property | Type | Required | Valid Values |
|----------|------|----------|--------------|
| `status` | string | No | `"todo"`, `"in-progress"`, `"done"` |
| `priority` | string | No | `"low"`, `"medium"`, `"high"` |
| `sortBy` | string | No | `"priority"`, `"createdAt"` |
| `order` | string | No | `"asc"`, `"desc"` (default: `"desc"`) |

## 2. File Structure

```
src/
├── index.js                    # Entry point; invokes CLI and handles exit codes
├── cli.js                      # Command router; parses argv and dispatches handlers
├── constants.js                # Enums: STATUSES, PRIORITIES, DEFAULTS
├── models/
│   └── task.js                 # Task factory, JSDoc types, field helpers
├── store/
│   └── task-store.js           # In-memory store: CRUD, search, filter utilities
├── services/
│   └── task-service.js         # Business logic: validation, filtering, sorting
├── utils/
│   ├── id.js                   # generateId(): string
│   ├── time.js                 # getCurrentTimestamp(): string
│   └── format.js               # formatTask(), formatTaskList(), messages
└── test/
    ├── models/
    │   └── task.test.js
    ├── store/
    │   └── task-store.test.js
    ├── services/
    │   └── task-service.test.js
    └── utils/
        ├── id.test.js
        ├── time.test.js
        └── format.test.js
```

## 3. Module Responsibilities

### index.js
**Exports:** Main CLI entry point (default export: async function)

**Responsibility:**
- Initialize the in-memory task store.
- Invoke CLI command routing.
- Handle and log uncaught errors.
- Exit with appropriate code (0 on success, 1 on error).

**Dependencies:**
- `./cli.js` (command router)
- `./store/task-store.js` (store initialization)

---

### cli.js
**Exports:** `async function routeCommand(args: string[], store: TaskStore): Promise<void>`

**Responsibility:**
- Parse command-line arguments (e.g., `create`, `list`, `update`, `delete`).
- Map commands to handler functions.
- Call handlers and manage output.

**Dependencies:**
- `./services/task-service.js` (all handlers)
- `./utils/format.js` (output formatting)

**Handlers (internal):**
- `handleCreate(title, description, store)`
- `handleList(options, store)`
- `handleUpdate(id, updates, store)`
- `handleDelete(id, store)`
- `handleHelp()`

---

### constants.js
**Exports:** 
- `STATUSES: string[]`
- `PRIORITIES: string[]`
- `DEFAULT_PRIORITY: string`
- `DEFAULT_STATUS: string`

**Responsibility:**
- Define valid enums for `status` and `priority`.
- Centralize default values.

**Dependencies:** None

---

### models/task.js
**Exports:**
- `function createTask(title: string, description?: string): Task`
- `function updateTaskFields(task: Task, updates: Partial<Task>): Task`
- JSDoc type definition for `Task`

**Responsibility:**
- Task object construction with auto-generated timestamps.
- Immutable field guards (prevent `id`, `createdAt` mutation).
- Type documentation (JSDoc).

**Dependencies:**
- `../utils/id.js` (generateId)
- `../utils/time.js` (getCurrentTimestamp)
- `../constants.js` (defaults)

---

### store/task-store.js
**Exports:**
- `class TaskStore { create(), read(), update(), delete(), list(), findById() }`
- `function instantiateTaskStore(): TaskStore`

**Responsibility:**
- Encapsulate in-memory array of tasks.
- Implement CRUD operations.
- Provide query/search utilities (find by ID, list all).
- Maintain task uniqueness by ID.

**Dependencies:**
- `../models/task.js` (Task factory)

---

### services/task-service.js
**Exports:**
- `function validateStatus(status: string): boolean`
- `function validatePriority(priority: string): boolean`
- `function filterTasks(tasks: Task[], options: ListOptions): Task[]`
- `function sortTasks(tasks: Task[], sortBy: string, order: string): Task[]`

**Responsibility:**
- Input validation (status, priority, filter values).
- Filter tasks by status and/or priority.
- Sort tasks by priority or creation date with deterministic tie-breaking (id).
- Apply combined filtering and sorting.

**Dependencies:**
- `../constants.js` (valid enums)

---

### utils/id.js
**Exports:** `function generateId(): string`

**Responsibility:**
- Generate a unique, simple ID (e.g., UUID v4 or timestamp + random).
- Ensure no collisions in memory.

**Dependencies:** None (uses built-in `crypto` or `Math.random`)

---

### utils/time.js
**Exports:** `function getCurrentTimestamp(): string`

**Responsibility:**
- Return current date/time as ISO 8601 string.

**Dependencies:** None (uses built-in `Date`)

---

### utils/format.js
**Exports:**
- `function formatTask(task: Task): string`
- `function formatTaskList(tasks: Task[]): string`
- `function formatError(message: string): string`

**Responsibility:**
- Format task and task list for console output.
- Format error messages consistently.
- Handle empty-state messaging.

**Dependencies:** None

---

## 4. Error Handling Strategy

### Error Types and Throwing Points

| Error Type | Scenario | Thrown From | HTTP-like Code |
|------------|----------|-------------|-----------------|
| **ValidationError** | Invalid `status` or `priority` value | `task-service.js` | 400 (Bad Request) |
| **NotFoundError** | Task ID does not exist | `store/task-store.js` | 404 (Not Found) |
| **ValidationError** | Missing required field (`title`) | `models/task.js` | 400 (Bad Request) |
| **ValidationError** | Empty or invalid filter options | `cli.js` | 400 (Bad Request) |
| **ValidationError** | Invalid sort field or order | `services/task-service.js` | 400 (Bad Request) |
| **UserInputError** | Insufficient arguments for command | `cli.js` | 400 (Bad Request) |

### Error Handling Pattern
1. Throw descriptive `Error` objects with user-friendly messages.
2. Catch at CLI level (`cli.js`) and format for console output.
3. Log errors via `console.error()`.
4. Exit process with code `1` on any uncaught error.

### Example
```javascript
// In store/task-store.js:
if (!task) {
  throw new Error(`Task with id "${id}" not found`);
}

// In cli.js:
try {
  await handleUpdate(id, updates, store);
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(1);
}
```

---

## 5. Module Dependency Graph

```
index.js
  └─ cli.js
      ├─ services/task-service.js
      │   └─ constants.js
      ├─ utils/format.js
      └─ store/task-store.js (passed in)
          └─ models/task.js
              ├─ utils/id.js
              ├─ utils/time.js
              └─ constants.js

services/task-service.js
  └─ constants.js

models/task.js
  ├─ utils/id.js
  ├─ utils/time.js
  └─ constants.js
```

---

## 6. Key Design Decisions

1. **In-Memory Only:** No persistence layer. Data exists only for the current process lifetime.
2. **Functional Validation:** Validation remains simple and focused on type/enum correctness.
3. **Immutable Fields:** `id` and `createdAt` cannot be modified after creation.
4. **Deterministic Sort:** When sorting, tie-breaking by `id` ensures consistent order.
5. **ES Modules Only:** All imports use `import`/`export` per workshop conventions.
6. **No External Dependencies:** All utilities use Node.js built-ins (`Date`, `crypto`, etc.).
7. **JSDoc Types:** TypeScript-like JSDoc annotations for IDE support without TS tooling.
