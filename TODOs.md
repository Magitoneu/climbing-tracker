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

1. Ensure all UI components use shadcn/ui where possible for accessibility and design consistency.
2. Add JSDoc comments to all principal functions, hooks, and components.
3. Add a docs/architecture.md file documenting folder structure, data flow, and type safety strategy.
4. Add linting and formatting configuration files to the repo (.eslintrc, .prettierrc).
5.  Add unit and integration tests for custom hooks, utility functions, and core screens/components.
6. Review and update naming conventions for clarity and verbosity (e.g., avoid short/ambiguous names).
7. Ensure all feature logic is co-located and grouped by feature, not by type.
5. Ensure all UI components use shadcn/ui where possible for accessibility and design consistency.
6. Add JSDoc comments to all principal functions, hooks, and components.
7. Add a docs/architecture.md file documenting folder structure, data flow, and type safety strategy.
8. Add linting and formatting configuration files to the repo (.eslintrc, .prettierrc).
9.  Add unit and integration tests for custom hooks, utility functions, and core screens/components.
10. Review and update naming conventions for clarity and verbosity (e.g., avoid short/ambiguous names).
11. Ensure all feature logic is co-located and grouped by feature, not by type.

## About Stats

Stats should be focused on individual performance and comparision with previous sessions.
Weekly, monthly, yearly reports.

## Goals

Dashboard should contain some year/month goals. And the progress towards them.

## Production Google Authentication (Deferred)

These tasks are postponed until preparing a production / TestFlight / Play Store build. Email & password auth is sufficient short-term.

1. Create platform-specific OAuth clients in Google Cloud Console:
	- iOS: Bundle identifier (to be set in EAS build config) -> get iOS client ID.
	- Android: Package name + SHA-1 (from EAS keystore) -> get Android client ID.
2. Add the new `IOS_CLIENT_ID` and `ANDROID_CLIENT_ID` constants to `AuthScreen` and remove proxy-forced logic for standalone builds.
3. Switch native redirect URI to custom scheme: `makeRedirectUri({ scheme: 'climbingtracker' })` (no Expo proxy in production builds).
4. Ensure `scheme` remains set in `app.json` and add any necessary `ios.bundleIdentifier` / `android.package` under the `expo` config (EAS build profiles).
5. Remove (or leave) the Expo proxy redirect from the Web client Allowed Redirects—only keep if you still test via Expo Go.
6. Implement account linking (optional): If a user signs up with email/password then attempts Google login, detect existing email and offer to link credential.
7. Centralize auth logic into a `useAuth` hook or `authService.ts` (unify Google/email flows, expose loading/error state, and handle credential linking edge cases).
8. Add telemetry / logging (optional) for auth events (success, cancel, error code) to aid debugging.
9. QA Checklist pre-release: sign-in/out cycles, token refresh, offline attempt, linking scenario, error messaging clarity.
10. Security review: Confirm Firebase Auth domains & OAuth consent screen (production publishing status) are properly configured.

NOTE: Until these are executed, native Google sign-in inside Expo Go may remain unreliable; rely on email/password for development.

## Grading System Canonical Scaffold (Phase 1 Completed)

Implemented:
1. Added unified interfaces (`GradeSystem.ts`) with `GradeEntry`, `GradeSystemDefinition`, `BoulderGradeSnapshot`.
2. Extended `Boulder` model to include optional `gradeSnapshot` + `canonicalValue` (non-breaking).
3. Added canonical mapping table aligning V-Scale and Font with integer `canonicalValue` steps.
4. Provided built-in system definitions in `gradeConversion.ts` and service helpers in `gradeSystemService.ts`.
5. Annotated `sessionService.toDocData` with TODO for future canonical enrichment.

Next Phases:
Phase 2: When saving new attempts/boulders, populate `gradeSnapshot` & `canonicalValue` from selected system.
Phase 3: Add user preference for display system and live conversion (UI toggle).
Phase 4: Backfill existing sessions adding canonical values via migration hook.
Phase 5: Introduce custom user grade systems (Firestore collection) and versioning.
Phase 6: Charting upgrades to aggregate by canonical difficulty & bucket mapping.
Phase 7: Approximation flags + range support for color band systems.

## Grading System Phase 2 (Canonical Enrichment) Completed
- Enriched new and legacy sessions with canonical grade snapshots (boulders & attempts).
- Added snapshot generation during save and subscription fallback.

## Grading System Phase 3 (Display System & Conversion) Completed
Implemented:
1. Added `useGradeDisplaySystem` hook with persistent `displayGradeSystemId` (new key) storage.
2. Created formatting helpers (`formatAttempt`, `formatBoulder`) for label conversion using canonical values.
3. Updated `BoulderRow`, `BoulderList`, and `SessionsScreen` to display converted labels and compute max grade via canonical values.
4. Updated settings screen to select canonical builtin ids (`vscale`, `font`) while lightly syncing legacy store ids.
5. Removed obsolete backward compatibility comment placeholders.

Next (Phase 4 – Backfill & Metrics):
1. Firestore persistence of canonical fields if not already stored (one-time write/backfill script or background migration).
2. Add centralized grade stats service using canonical distribution.
3. Add display toggle in dashboard (quick switch between systems).
4. Introduce approximation indicator (e.g., ~ symbol) when conversion is not exact.
5. Integrate bucketed progress charts (rolling average canonical difficulty).

Deferred Design Notes:
- Range grades will use `canonicalLow`/`canonicalHigh` with midpoint for default computations.
- Versioned systems retained for historical accuracy; migration optional.

## Dual Display & Approximation Indicator (Implemented)

Enhancements:
1. UI now shows both converted display grade and original logged grade when they differ, formatted as `Converted (Original)`.
2. An approximation marker `~` is prefixed to the converted label when the conversion is not an exact canonical lookup (heuristic fallback / inferred mapping).
3. Applied consistently across: `BoulderRow`, `BoulderList`, and expanded boulder list in `SessionsScreen`.

Rationale:
- Preserves authenticity of originally logged system while giving user a unified comparison view.
- Approximation flag increases transparency where conversions are not exact (future range/color systems will leverage this further).

Next Considerations:
1. Optional user preference to hide original label for a cleaner UI.
2. Legend / tooltip explaining `~` marker (documentation & Settings screen note).
3. Styling refinement: consider using an ≈ symbol or subtle opacity instead of `~`.
4. Extend approximation logic once range/color band systems introduced (Phase 7).

### Update: Session Max Grade
The session card "max grade" now follows the same dual display + approximation logic:
- Shows `Converted (Original)` when the original logged system differs from the active display system.
- Prefixes `~` if the converted label is approximate.
- Falls back to legacy `getMaxGrade` only when no canonical values exist (older unsupplemented data).


## Session logging

- Add new field: "Send" so, this means if the boulder was sent or not. 