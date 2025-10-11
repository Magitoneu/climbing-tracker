# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A cross-platform climbing tracker mobile app built with **Expo**, **React Native**, and **TypeScript**. Users log climbing sessions (boulders with grades, attempts, flash status), view stats, and track progress. Authentication is handled via **Firebase Auth** (email/password + Google OAuth), and session data is stored in **Firestore**.

## Build & Development Commands

### Starting the App
```bash
pnpm install              # Install dependencies
pnpm run start            # Start Expo dev server (scan QR with Expo Go)
pnpm run web              # Run in web browser (fastest for testing)
pnpm run ios              # Launch iOS simulator (Mac only)
pnpm run android          # Launch Android emulator
```

### Important Notes
- **Package Manager:** This project uses **pnpm** exclusively (not npm/yarn)
- **Web Development:** Use `pnpm run web` for quickest iteration; open http://localhost:8081 in browser
- **TypeScript:** Strict mode enabled (`tsconfig.json`)
- **No Test Suite:** Tests are not yet implemented (see TODOs.md)
- **No Linter:** ESLint/Prettier not yet configured

## Architecture & Data Flow

### Authentication Flow
1. **Entry Point:** `App.tsx` monitors `onAuthStateChanged` from Firebase Auth
2. **Unauthenticated:** Shows `AuthScreen` (email/password + Google OAuth via `expo-auth-session`)
3. **Authenticated:** Renders `Tabs` navigator with 5 main tabs
4. **On Login:**
   - Loads and registers custom grade systems from AsyncStorage
   - Migrates legacy local sessions to Firestore (one-time via `useMigrateLocalSessions`)
   - Subscribes to live Firestore updates for sessions and custom grade systems

### Navigation Structure
- **Root:** `NavigationContainer` (React Navigation)
  - **Tabs:** Bottom tab navigator (`src/navigation/Tabs.tsx`)
    - Dashboard: Goals and overview (placeholder)
    - Log: Add new climbing sessions (`LogScreen`)
    - Sessions: View/edit past sessions (`SessionsScreen`)
    - Stats: Progress charts (placeholder)
    - Settings: Nested stack navigator (`SettingsStack`)

### Core Data Models

#### Session (`src/models/Session.ts`)
```typescript
interface Session {
  id?: string;          // Firestore doc ID
  userId?: string;
  date: string;         // ISO date
  durationMinutes?: number;
  notes?: string;
  gradeSystem: GradeSystem;  // 'V', 'Font', or custom system ID
  attempts: Attempt[];       // Aggregated attempt entries
  boulders?: Boulder[];      // Raw boulder entries (legacy)
  createdAt?: string;
  updatedAt?: string;
  migrated?: boolean;        // Flag for local-to-cloud migrations
}
```

#### Boulder (`src/models/Boulder.ts`)
```typescript
interface Boulder {
  grade: string;                      // Legacy label (e.g., 'V5')
  gradeSnapshot?: BoulderGradeSnapshot; // Canonical enrichment (Phase 2+)
  canonicalValue?: number;             // Normalized difficulty (0-18 scale)
  flashed: boolean;
  attempts?: number;
}
```

### Grading System Architecture

**Multi-Phase Canonical Grade System** (see TODOs.md for full roadmap):

1. **Builtin Systems:** V-Scale and Font grading (defined in `src/models/gradeConversion.ts`)
   - Each grade maps to a `canonicalValue` (integer 0-18) representing difficulty
   - Conversions between systems use canonical mapping table

2. **Custom Systems:** Users can create gym-specific color-based systems
   - Stored in Firestore: `users/{uid}/customGradeSystems/{id}`
   - Local cache in AsyncStorage (`customGradeSystems` key)
   - Managed via `src/services/customGradeSystemService.ts`
   - Registry pattern: `registerGradeSystem()` adds to runtime lookup

3. **Snapshot Enrichment:** New/legacy sessions enriched with canonical data
   - `gradeSnapshot` captures original system + version + canonical value
   - Enables cross-system comparisons and future-proof conversions
   - Applied during save (`sessionService.toDocData`) and subscription fallback

4. **Display vs Logging Systems:**
   - **Logging System:** Selected per-session in LogScreen (persisted in `lastLoggingGradeSystem`)
   - **Display System:** User preference for viewing all sessions (stored in `displayGradeSystemId`)
   - `useGradeDisplaySystem` hook provides conversion helpers

### Firebase Integration

**Config:** `src/config/firebase.ts` initializes Firebase app + Auth + Firestore

**Firestore Structure:**
```
users/
  {uid}/
    sessions/{sessionId}        # Session documents
    customGradeSystems/{id}     # User-defined grade systems
```

**Services:**
- `src/services/sessionService.ts`: CRUD for sessions + live subscriptions
- `src/services/gradeSystemService.ts`: Registry for builtin + custom systems
- `src/services/customGradeSystemService.ts`: Firestore sync for custom systems

**Offline Handling:**
- LogScreen catches Firestore errors and falls back to AsyncStorage (`simpleStore`)
- On next login, `useMigrateLocalSessions` pushes local data to cloud

### Storage Layers

1. **Firestore (Cloud):** Primary data store for sessions + custom systems
2. **AsyncStorage (Local):** Fallback for offline saves, user preferences
   - `src/storage/simpleStore.ts`: Thin wrapper around `@react-native-async-storage/async-storage`
   - Keys: `sessions`, `customGradeSystems`, `lastLoggingGradeSystem`, `displayGradeSystemId`
3. **In-Memory Registry:** Runtime lookup for grade systems (supports dynamic custom systems)

### Key Utilities

- `src/utils/gradeSnapshot.ts`: Builds canonical snapshots for boulders/attempts
- `src/utils/sessionStats.ts`: Calculates total sends, flash rate, volume for stat cards
- `src/utils/boulderUtils.ts`: Aggregates boulders by grade, sorts, finds max grade
- `src/utils/alert.ts`: Cross-platform alert wrapper (uses `Alert` on native, `window.alert` on web)

## Git Workflow

### Pull Requests
- **Create a PR for each feature/task** - Never commit directly to main
- Branch naming: Use descriptive names (e.g., `feature/custom-grade-editor`, `fix/session-date-picker`)
- Each PR should be focused on a single feature or fix
- Target branch: `main` (as shown in git status)

### Conventional Commits
All commits must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Common Types:**
- `feat:` New feature (e.g., `feat(sessions): add bulk delete functionality`)
- `fix:` Bug fix (e.g., `fix(auth): resolve Google OAuth redirect issue`)
- `refactor:` Code refactoring without functional changes
- `docs:` Documentation updates (e.g., `docs: update CLAUDE.md with git workflow`)
- `style:` Code style/formatting changes (no logic changes)
- `test:` Adding or updating tests
- `chore:` Build process, tooling, or dependency updates (e.g., `chore: upgrade expo to v54`)
- `perf:` Performance improvements

**Scope Examples:** `auth`, `sessions`, `grades`, `ui`, `firebase`, `storage`

**Examples:**
```bash
git commit -m "feat(grades): implement custom color-based grade systems"
git commit -m "fix(log): prevent duplicate session saves on rapid taps"
git commit -m "refactor(sessions): extract modal into separate component"
git commit -m "docs: add Firebase setup instructions to README"
```

**Breaking Changes:** Add `!` after type/scope or `BREAKING CHANGE:` in footer
```bash
git commit -m "feat(grades)!: migrate to canonical grade system"
```

## Development Guidelines

### Code Style (from .github/copilot-instructions.md)
- **TypeScript First:** All code uses strict TypeScript
- **Functional Components:** Use hooks (no class components except error boundaries)
- **Long, clear names over short, vague names** (e.g., `useGradeDisplaySystem` not `useGrade`)
- **Co-locate logic that changes together**
- **Group by feature, not by type** (e.g., `src/components/log/` for log-specific UI)
- **One function = one level of abstraction**
- **Favor pure functions** for testability

### Component Patterns
- Destructure props in function signature with TypeScript interfaces
- Use `React.Fragment` (`<>...</>`) to avoid wrapper divs
- Extract reusable logic into custom hooks (`src/hooks/`)
- Keep components small and focused (single responsibility)

### State Management
- **Local State:** `useState` for component-level state
- **Global State:** Firebase Auth state via `onAuthStateChanged` + Firestore live queries
- **Persistence:** AsyncStorage for user preferences

### Styling
- Inline `StyleSheet.create` or separate `.styles.ts` files
- Color constants defined in `src/theme.ts`
- No CSS-in-JS library; uses React Native StyleSheet API

## Common Workflows

### Adding a New Screen
1. Create screen component in `src/screens/`
2. Add route to `Tabs.tsx` or `SettingsStack.tsx`
3. Follow naming convention: `{Feature}Screen.tsx`

### Extending Grade Systems
1. **Builtin:** Add to `CANONICAL_TABLE` in `src/models/gradeConversion.ts`
2. **Custom:** Use `CustomGradeSystemEditor` component (already in Settings)
3. **Registry:** Call `registerGradeSystem()` to add to runtime lookup

### Working with Sessions
- **Add:** Call `addSession()` from `sessionService` (auto-enriches with canonical data)
- **Subscribe:** Use `subscribeToSessions()` for live updates
- **Edit:** Call `updateSession(id, partial)` (available in `SessionsScreen`)
- **Delete:** Call `deleteSession(id)`

### Testing Offline Mode
1. Run app in Expo Go or simulator
2. Enable airplane mode / disconnect network
3. Log a session in LogScreen
4. Session saves to AsyncStorage with error toast
5. Reconnect network and restart app
6. `useMigrateLocalSessions` uploads pending sessions

## Known Limitations & TODOs

- **No Tests:** Unit/integration tests planned (see TODOs.md)
- **No Linting:** ESLint/Prettier configuration needed
- **Stats Placeholder:** StatsScreen and DashboardScreen not fully implemented
- **Google OAuth in Expo Go:** Unreliable on native; production OAuth clients needed for standalone builds
- **No Backfill:** Existing Firestore sessions lack canonical values until next edit/view (enriched on-the-fly)
- **Approximation UI:** `~` marker shown for inexact grade conversions; consider legend/tooltip

## Important Firestore Rules

Ensure Firestore security rules allow authenticated users to read/write their own data:
```javascript
match /users/{userId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
```

## Production Deployment Notes

- **EAS Build:** Configured with `owner: "crider"` in app.json
- **Scheme:** `climbingtracker` for deep linking
- **Google OAuth:** Requires platform-specific client IDs (see TODOs.md "Production Google Authentication" section)
- **Expo New Architecture:** Enabled (`newArchEnabled: true` in app.json)

## Reference Files

- **TODOs.md:** Comprehensive roadmap with grading system phases, refactoring tasks, and production checklist
- **README.md:** User-facing setup instructions and troubleshooting
- **.github/copilot-instructions.md:** Detailed code style guidelines
- **package.json:** Scripts and dependency versions

## Debug Tips

- Check `console.log` / `console.warn` statements (existing in App.tsx, LogScreen, sessionService)
- Firebase errors logged with codes (`permission-denied`, `unavailable`, etc.)
- Use web mode for fastest iteration with Chrome DevTools
- AsyncStorage keys for manual inspection:
  - `sessions` (legacy local sessions)
  - `customGradeSystems` (custom system definitions)
  - `lastLoggingGradeSystem` (last used system in LogScreen)
  - `displayGradeSystemId` (preferred display system)
