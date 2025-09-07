# TODO list

1. Refactor to keep code clean.
2. SessionsScreen edit modal should be a component on its own.
3. Add persistent storage for sessions (web-compatible).
4. Implement custom grading (e.g., gym colors).
5. When adding a session show some dialog about the performance.
6. Add linting and formatting (e.g., ESLint, Prettier).
7. Improve type safety across db-server-client.
8. Add tests for core features and components.
9. Use shadcn/ui for consistent UI components.
10. Add charts for progress visualization.
11. Improve error handling and user feedback.
12. Document principal features in the docs folder.
13. Optimize performance (lazy loading, code splitting).
14. Add user authentication (optional/future).
15. Enable session export/import (CSV/JSON).

## Refactoring & Code Quality

1. Refactor inline styles in screens/components to use Tailwind CSS v4 (or a consistent utility-first approach).
2. Extract repeated logic in LogScreen and SessionsScreen (e.g., boulder aggregation, grade sorting) into reusable utility functions or custom hooks.
3. Move all prop and state types to dedicated types files for better type safety and reusability.
4. Replace any usage of any in state or props with proper TypeScript interfaces.
5. Modularize large screens (e.g., SessionsScreen) by splitting out subcomponents (edit modal, boulder list, etc.) into their own files.
6. Ensure all UI components use shadcn/ui where possible for accessibility and design consistency.
7. Add JSDoc comments to all principal functions, hooks, and components.
8. Add a docs/architecture.md file documenting folder structure, data flow, and type safety strategy.
9. Add linting and formatting configuration files to the repo (.eslintrc, .prettierrc).
10. Add unit and integration tests for custom hooks, utility functions, and core screens/components.
11. Review and update naming conventions for clarity and verbosity (e.g., avoid short/ambiguous names).
12. Ensure all feature logic is co-located and grouped by feature, not by type.

## About Stats

Stats should be focused on individual performance and comparision with previous sessions.
Weekly, monthly, yearly reports.

## Goals

Dashboard should contain some year/month goals. And the progress towards them.
