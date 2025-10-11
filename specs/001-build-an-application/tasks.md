# Tasks: Climbing Progress Tracker Application

**Input**: Design documents from `/specs/001-build-an-application/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)

```
1. Load plan.md from feature directory
2. Load optional design documents: data-model.md, contracts/, research.md, quickstart.md
3. Generate tasks by category: setup, tests, core, integration, polish
4. Apply task rules: parallel/sequential, TDD, dependencies
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness
9. Return: SUCCESS (tasks ready for execution)
```

---

## Setup Tasks

T001 ✅ Install dependencies (pnpm, Expo, shadcn/ui, wa-sqlite, tailwindcss, jest, detox) — completed
T002 ✅ Initialize linting and formatting (eslint, prettier) — completed
T003 ✅ Configure TypeScript and Expo project settings — completed
T004 ✅ Set up project structure in `src/` and `tests/` — completed

---

## Contract Test Tasks [P]

T005 [P] Write contract test for local session logging (no backend API)
T006 [P] Write contract test for local goal management (no backend API)
T007 [P] Write contract test for custom grading system logic (no backend API)
T008 [P] Write contract test for local authentication (no backend API)
T009 [P] Write contract test for local password recovery (no backend API)

---

## Core Model Tasks [P]

T010 ✅ [P] Implement User model (`src/models/User.ts`) — completed
T011 ✅ [P] Implement ClimbingSession model (`src/models/ClimbingSession.ts`) — completed
T012 ✅ [P] Implement Problem model (`src/models/Problem.ts`) — completed
T013 [P] Implement Goal model (`src/models/Goal.ts`) — completed
T014 ✅ [P] Implement GradingSystem model (`src/models/GradingSystem.ts`) — completed

---

## Service & Endpoint Tasks

T015 ✅ Implement local session logging service (no backend API) — completed
T016 ✅ Implement local goal management service (no backend API) — completed
T017 Implement custom grading system logic (local, no backend API)
T018 Implement local authentication and user account creation (no backend API)
T019 Implement local password recovery logic (no backend API)

---

## Integration Tasks

T020 ✅ Integrate SQLite (wa-sqlite) for local storage — completed
T021 ✅ Integrate import/export functionality (CSV/JSON) — completed
T022 Integrate error handling (modals, toasts, logging)
T023 Integrate global state management (Context API or Zustand)
T024 Integrate responsive UI with shadcn/ui and Tailwind CSS

---

## Integration Test Tasks [P]

T025 ✅ [P] Write integration test for logging a climbing session — completed
T026 [P] Write integration test for viewing climbing history and stats (stats screen)
T027 [P] Write integration test for customizing grading system (custom grading system logic)
T028 ✅ [P] Write integration test for import/export data — completed
T029 [P] Write integration test for setting and tracking goals

---

## Polish Tasks [P]

T030 [P] Write unit tests for all models and services
T031 [P] Optimize performance for mobile and desktop (target 60 FPS)
T032 [P] Update documentation in `/docs` and quickstart.md
T033 [P] Validate accessibility and cross-platform compatibility
T034 [P] Final code review and refactor for maintainability

## UI Tasks

T035 Design and implement Stats screen (charts, progress analysis)
T036 Design and implement Dashboard screen (overview, quick stats, recent activity)

---

## Cloud Sync & User Accounts Tasks

TCS1 ✅ Research and choose a backend/cloud solution (Firebase recommended for Expo) — completed
TCS2 ✅ Set up Firebase project and enable Authentication and Firestore — completed
TCS3 ✅ Install Firebase SDK for Expo: `pnpm add firebase` — completed
TCS4 ✅ Implement authentication logic: Create login, signup, and password recovery screens. Integrate Firebase Auth for user management. — completed
TCS5 (Sessions) ✅ Refactor session storage to use Firestore when authenticated; fallback to local offline cache.
TCS5c (Sessions edit/delete) ✅ Integrate Firestore update & delete with optimistic local fallback.
TCS5a (Goals) Refactor goal storage to Firestore with offline fallback.
TCS5b (Custom grading systems) Refactor grading system storage to Firestore; ensure per-user isolation.
TCS6 (Core sync) ▲ Implement full bidirectional sync for goals & grading systems; clear local user scope on logout.
TCS7 ✅ Migrate legacy local sessions automatically on first authenticated load (basic heuristic).
TCS7a Add manual “retry migration” / import UI for sessions & goals.
TCS8 Update settings/profile UI: account management (change password, logout, delete account, provider linking).
TCS8a Add Google auth fix (redirect + provider linking) and surface errors clearly.
TCS9 ▲ Test cross-device sync for sessions, goals, grading systems (multi-platform matrix: iOS, Android, Web).
TCS9a Add offline queue & retry for failed writes (sessions/goals/grades).
TCS9b Add per-document cloud/local status indicator in UI.
TCS10 Update documentation and onboarding flow (cloud sync behavior, offline mode, migration).
TCS11 Security hardening: final Firestore rules (least privilege) + rules tests.
TCS12 Add integration tests for cloud sync (mock Firestore or emulator layer).
TCS13 Performance: pre-aggregate stats (max grade, flash counts) in session docs.
TCS14 Analytics/telemetry (optional) for feature usage.

---

## Parallel Execution Guidance

- Tasks marked [P] can be executed in parallel (different files, no dependencies)
- Example: T005-T009 (contract tests), T010-T014 (models), T026-T029 (integration tests), T030-T034 (polish)
- Core service and endpoint tasks (T017-T019) should follow after models and contract tests
- UI tasks (T035-T036) can be started after core data and service logic is available

## Dependency Notes

- Setup tasks (T001-T004) must be completed first
- Contract tests (T005-T009) before endpoint implementation (T017-T019)
- Models (T010-T014) before services/endpoints
- Integration tasks (T020-T024) after core implementation
- Integration tests (T026-T029) after integration
- Polish tasks (T030-T034) last
- UI tasks (T035-T036) after core logic

---

# End of Tasks
