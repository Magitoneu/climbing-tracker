# Next Steps - Climbing Tracker Development Roadmap

**Last Updated:** 2025-10-11
**Current Status:** Phase 3 Part 5 Complete (All inline styles fixed)

---

## Current State

### ✅ Completed Phases

**Phase 1-2:** Feature-based architecture, development tooling, grading system
**Phase 3 Parts 1-2:** ESLint critical errors fixed
**Phase 3 Parts 3-4:** JSDoc documentation + code quality standards
**Phase 3 Part 5:** All inline style warnings eliminated (125 → 0)

### 📊 Code Quality Metrics

| Metric             | Current  | Target | Progress |
| ------------------ | -------- | ------ | -------- |
| **ESLint Errors**  | 0        | 0      | ✅ 100%  |
| **Inline Styles**  | 0        | 0      | ✅ 100%  |
| **Total Warnings** | 103      | 0      | 55%      |
| **Test Coverage**  | 14 tests | TBD    | Baseline |

**Remaining Warnings Breakdown:**

- 50 warnings: Unused variables (`@typescript-eslint/no-unused-vars`)
- 38 warnings: Explicit any types (`@typescript-eslint/no-explicit-any`)
- 12 warnings: Non-null assertions (`@typescript-eslint/no-non-null-assertion`)
- 3 warnings: Console statements (`no-console`)

---

## Phase 3 (Continued) - Complete Code Quality

### Part 6: Fix Explicit Any Types (38 warnings)

**Goal:** Replace all `any` types with proper TypeScript types for improved type safety.

**Priority Files:**

1. `sessionService.ts` - 11 any types
2. `SessionsScreen.tsx` - 15 any types
3. `AuthScreen.tsx` - 5 any types
4. `gradeSystemService.ts` - Various any types
5. `customGradeSystemService.ts` - 2 any types

**Approach:**

- Replace `any` with specific types (e.g., `Session`, `Attempt`, `Boulder`)
- Use `unknown` with type guards for error handling
- Add proper type annotations for event handlers
- Define interfaces for Firebase document data

**Expected Outcome:**

- Warnings: 103 → 65
- Improved type safety catches bugs at compile time
- Better IDE autocomplete and refactoring support

---

### Part 7: Clean Up Unused Variables (50 warnings)

**Goal:** Remove or properly prefix unused imports and variables.

**Categories:**

1. **Unused imports** - Remove entirely if not needed
2. **Intentionally unused** - Prefix with underscore (e.g., `_unused`)
3. **Unused function parameters** - Prefix with `_` or destructure to skip

**Common Patterns:**

```typescript
// Before
import { V_GRADES, FONT_GRADES } from './grades';
const handleClick = (event, index) => { ... };

// After
import { V_GRADES } from './grades'; // Remove FONT_GRADES if unused
const handleClick = (_event, index) => { ... }; // Prefix unused
```

**Expected Outcome:**

- Warnings: 65 → 15
- Cleaner imports and smaller bundle size
- Clear intent about intentionally unused variables

---

### Part 8: Wrap Console Statements (3 warnings)

**Goal:** Ensure all console statements are wrapped in `__DEV__` checks.

**Files to Fix:**

1. `App.tsx` - 1 console.log
2. `AuthScreen.tsx` - 2 console statements

**Pattern:**

```typescript
// Before
console.log('[Migration] Uploaded sessions');

// After
if (__DEV__) {
  console.log('[Migration] Uploaded sessions');
}
```

**Expected Outcome:**

- Warnings: 15 → 12
- Production builds have no debug logs
- Better performance in production

---

## Phase 4 - Component Architecture & Testing

### Part 1: Extract Large Components

**Problem:** SessionsScreen (423 lines) and LogScreen (368 lines) exceed 250-line guideline.

**SessionsScreen Extraction:**

- `SessionCard` component (card rendering logic)
- `SessionExpandedDetails` component (boulder list + notes)
- `SessionActions` component (edit/delete buttons)

**LogScreen Extraction:**

- Already well-structured with subcomponents
- Consider extracting grade summary logic
- Boulder aggregation into custom hook

**Expected Outcome:**

- All components under 250 lines
- Improved reusability and testability
- Easier to maintain and review

---

### Part 2: Expand Test Coverage

**Current Coverage:** 14 tests (primarily utils)

**Priority Areas:**

1. **Services** - sessionService, gradeSystemService, customGradeSystemService
2. **Hooks** - useGradeDisplaySystem, useMigrateLocalSessions
3. **Utils** - All currently covered, expand edge cases
4. **Components** - Key user flows (logging session, viewing sessions)

**Testing Strategy:**

- Unit tests: Pure functions and utilities
- Integration tests: Services with mocked Firestore
- Component tests: React Testing Library for screens
- E2E tests: Critical user flows (future consideration)

**Target:** 80% code coverage for services and utils

---

## Phase 5 - Feature Development

### High-Priority Features

#### 1. Stats & Dashboard Implementation

**Current State:** Placeholder screens

**Requirements:**

- **Stats Screen:**
  - Weekly/monthly/yearly volume charts
  - Grade progression over time
  - Flash rate trends
  - Personal records tracking

- **Dashboard Screen:**
  - Goal setting (monthly/yearly targets)
  - Progress indicators
  - Recent session highlights
  - Upcoming milestones

**Technical Considerations:**

- Use React Native chart library (e.g., Victory Native, React Native Chart Kit)
- Efficient data aggregation from Firestore
- Caching strategy for computed stats
- Offline support for viewing historical data

---

#### 2. Session Logging Enhancements

**Features from TODOs.md:**

- [ ] Add "Send" field (boolean for whether boulder was topped)
- [ ] Session performance dialog after save
- [ ] Session export/import (CSV/JSON format)
- [ ] Bulk session management (delete multiple)

**Design Decisions Needed:**

- Should "Send" replace or complement "Flashed"?
- What metrics to show in performance dialog?
- Export format specifications

---

#### 3. Grade System Phase 4 (Backfill & Metrics)

**Tasks:**

1. Firestore backfill script for canonical values on legacy sessions
2. Centralized grade stats service using canonical distribution
3. Display system toggle in dashboard (quick switch)
4. Approximation indicator improvements (legend/tooltip)
5. Bucketed progress charts using canonical values

---

### Medium-Priority Features

#### 4. UI/UX Improvements

- [ ] Implement shadcn/ui components for consistency
- [ ] Add loading states for async operations
- [ ] Improve error messages and user feedback
- [ ] Add confirmation dialogs for destructive actions
- [ ] Optimize performance (lazy loading, code splitting)

#### 5. Authentication Enhancements

- [ ] Google OAuth for production (platform-specific client IDs)
- [ ] Account linking (email + Google)
- [ ] Password reset flow
- [ ] Profile management
- [ ] Session persistence improvements

---

## Phase 6 - Production Readiness

### Infrastructure

- [ ] Set up EAS Build for iOS and Android
- [ ] Configure production Firebase project
- [ ] Implement proper error tracking (Sentry, Crashlytics)
- [ ] Add analytics (Firebase Analytics, Amplitude)
- [ ] Set up CI/CD pipeline for automated testing and deployment

### Security & Performance

- [ ] Firestore security rules review
- [ ] API key management (environment variables)
- [ ] Bundle size optimization
- [ ] Image optimization and lazy loading
- [ ] Offline-first architecture improvements

### Documentation

- [ ] User guide / onboarding flow
- [ ] Privacy policy and terms of service
- [ ] Contributing guidelines
- [ ] API documentation (if applicable)

---

## Immediate Next Action

**Recommendation:** Continue with Phase 3 Parts 6-8 to achieve zero lint warnings.

### Phase 3 Part 6 - Fix Explicit Any Types

**Estimated Effort:** 2-3 hours
**Files to Modify:** ~10 files
**Risk:** Low (type improvements, no functional changes)

**Plan:**

1. Start with service files (highest impact on type safety)
2. Add proper interfaces for Firebase document types
3. Replace error handler `any` with `unknown` + type guards
4. Update event handlers with proper React types

**Success Criteria:**

- 38 warnings eliminated
- No new TypeScript errors introduced
- All tests still passing
- Better IDE autocomplete throughout codebase

---

## Long-Term Vision

### User Experience Goals

1. **Seamless session logging** - Quick, intuitive, offline-capable
2. **Insightful analytics** - Visualize progress and identify patterns
3. **Flexible grading** - Support any gym's grading system
4. **Cross-platform consistency** - iOS, Android, Web parity

### Technical Excellence Goals

1. **Zero lint warnings** - Maintain code quality standards
2. **80%+ test coverage** - Confidence in refactoring
3. **Production-ready** - Scalable, secure, performant
4. **Well-documented** - Easy for new contributors to onboard

---

## Questions & Decisions Needed

1. **Stats Implementation:** Which charting library to use?
2. **Send vs Flashed:** Should these be separate fields or consolidated?
3. **Component Library:** Proceed with shadcn/ui or alternative?
4. **Testing Strategy:** Unit vs integration test ratio?
5. **Release Timeline:** When to target TestFlight/Play Store beta?

---

## Contributing

To work on any of these next steps:

1. **Create a feature branch** from `main`
2. **Follow conventional commits** (feat, fix, refactor, docs, etc.)
3. **Write tests** for new functionality
4. **Update documentation** (CLAUDE.md, README.md)
5. **Create a PR** with clear description and testing notes
6. **Ensure all checks pass** (tests, lint, typecheck)

---

## Resources

- **Project Documentation:** `CLAUDE.md` - Architecture and development guide
- **TODOs:** `TODOs.md` - Comprehensive feature wishlist
- **Code Quality:** Pre-commit hooks enforce linting and formatting
- **Testing:** `pnpm test` for unit tests, `pnpm test:coverage` for coverage report

---

**Next PR:** Phase 3 Part 6 - Fix Explicit Any Types (38 warnings → 0)
