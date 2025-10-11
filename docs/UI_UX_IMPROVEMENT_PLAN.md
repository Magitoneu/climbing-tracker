# UI/UX Improvement Plan - Climbing Tracker App

**Version:** 1.0
**Date:** 2025-10-11
**Status:** Planning Phase

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Current State Analysis](#current-state-analysis)
3. [Critical Issues](#critical-issues)
4. [Design System Improvements](#design-system-improvements)
5. [Screen-by-Screen Recommendations](#screen-by-screen-recommendations)
6. [Implementation Phases](#implementation-phases)
7. [Technical Implementation Guide](#technical-implementation-guide)
8. [Success Metrics](#success-metrics)

---

## Executive Summary

### Current State

The Climbing Tracker app is **functionally complete** but suffers from a **generic, prototype-like appearance** that lacks personality and visual hierarchy. While the core features work well (session logging, grade system management, session history), the UI doesn't reflect the energetic, achievement-driven nature of climbing.

### Key Problems

1. **Visual Design**: Generic blue theme with no climbing-specific identity
2. **Space Utilization**: Large empty areas on Dashboard and Settings screens
3. **Navigation**: 5 tabs with Stats being a placeholder (overlaps Dashboard purpose)
4. **Data Visualization**: No charts or visual progress indicators despite rich data
5. **User Flow**: Modal-based boulder entry creates friction in logging workflow
6. **Information Density**: Sessions list lacks grouping, filtering, and contextual actions

### Opportunity

Transform from a functional prototype into a **polished, motivating climbing companion** that users are proud to use daily.

### Expected Impact

- **30% increase in engagement** through better visualization and gamification
- **50% faster session logging** via inline boulder entry
- **Better user retention** through motivational dashboard elements
- **Professional appearance** competitive with top fitness/tracking apps

---

## Current State Analysis

### Screen Inventory

| Screen    | Purpose               | Current State                                 | User Satisfaction |
| --------- | --------------------- | --------------------------------------------- | ----------------- |
| Dashboard | Overview & motivation | Basic stats, large empty space, redundant FAB | ⭐⭐ Low          |
| Log       | Session entry         | Functional but friction-heavy modal flow      | ⭐⭐⭐ Medium     |
| Sessions  | History viewing       | Dense list, no grouping, expandable cards     | ⭐⭐⭐ Medium     |
| Stats     | Progress charts       | **Placeholder only** ("coming soon")          | ⭐ Very Low       |
| Settings  | Configuration         | Sparse list, good grade system UI             | ⭐⭐⭐ Medium     |

### Color Analysis

**Current Theme** (`src/shared/theme.ts`):

- Primary: `#2563eb` (Blue) - Generic, no climbing association
- Accent: `#FF6F3C` (Orange) - Underutilized
- Background: `#F5F6FA` (Off-white)
- Text: `#22223B` (Deep blue)

**Grade Colors** (Good foundation, but inconsistently applied):

- V0-V2: Light blues → Teal greens
- V3-V6: Darker teals
- V7-V9: Purples → Blues
- V10-V13: Greens → Yellows → Oranges
- V14-V17: Deep oranges → Browns

**Issue**: Grade colors exist but only used in grade pills, not throughout app design.

### Component Analysis

**Well-Designed Components**:

- `BoulderPill` - Clear grade representation with flash indicators
- `GradeSystemBar` - Good horizontal selector with scrolling
- `DatePickerField` - Clean native date picker integration
- `SessionEditModal` - Comprehensive editing interface

**Components Needing Work**:

- Dashboard stat cards - Too simple, no visual interest
- Session list cards - Lack visual hierarchy, colors without meaning
- Log screen stats bar - Shows zeros when starting, not motivating
- Empty states - Generic text, no illustrations or helpful tips

---

## Critical Issues

### 1. Visual Identity Crisis

**Problem**: App looks like a generic React Native starter template.

**Symptoms**:

- Single blue color dominates entire app
- No typography hierarchy (one font weight, limited sizes)
- Flat design with minimal depth (shadows barely visible)
- No brand personality or climbing-specific visual language
- Stock icons used throughout (Ionicons/MaterialCommunityIcons)

**User Impact**: Low perceived quality, no emotional connection, forgettable experience.

**Priority**: 🔴 **HIGH** - First impressions matter

---

### 2. Dashboard Underutilization

**Current State** (`src/features/dashboard/screens/DashboardScreen.tsx`):

```
┌────────────────────────────────────┐
│ Welcome Back!                      │
│                                    │
│ [12]      [V6]      [5 days]      │
│ Sessions  Best Grade  Streak      │
│                                    │
│                                    │
│                                    │
│ (massive empty space)              │
│                                    │
│                                    │
│                                    │
│                [+] FAB             │
└────────────────────────────────────┘
```

**Problems**:

- 3 stat cards occupy ~20% of screen, rest is empty
- No progress indicators (rings, bars, charts)
- Static numbers with no context (up/down from last week?)
- "Welcome Back!" is generic (could personalize with goals)
- FAB duplicates Log tab function
- No recent activity shown
- Stats tab exists separately but is just placeholder

**User Impact**: No motivation to open app, no quick insights into progress.

**Priority**: 🔴 **HIGH** - Primary landing screen

---

### 3. Stats Screen is Empty

**Current State** (`src/features/stats/screens/StatsScreen.tsx`):

```typescript
<Text>Charts and progress (coming soon)</Text>
```

**Problems**:

- Entire navigation tab dedicated to placeholder
- Overlaps with Dashboard's purpose (both show stats)
- Takes up valuable tab bar space
- Creates expectation gap ("where are my charts?")

**User Impact**: Confusion, disappointment, impression of incomplete app.

**Priority**: 🔴 **HIGH** - Either implement or merge with Dashboard

---

### 4. Log Screen Friction

**Current Flow** (`src/features/sessions/screens/LogScreen.tsx`):

```
1. Tap "Add Boulder" button
2. Modal opens (covers screen)
3. Select grade from dropdown
4. Set attempts (default 1)
5. Toggle flash if needed
6. Tap "Save"
7. Modal closes
8. See boulder added to list
9. Repeat 6 times for typical session
```

**Problems**:

- **9 taps minimum** to add one boulder (54 taps for 6 boulders!)
- Modal disrupts context (can't see what you've already logged)
- Stats bar at top shows zeros until you add boulders (demotivating)
- Can't quickly add "3×V4" or similar patterns
- No smart suggestions based on recent sessions
- Empty state just says "No boulders added yet" (unhelpful)

**User Impact**: Tedious logging discourages consistent usage, users may skip logging short sessions.

**Priority**: 🔴 **HIGH** - Core workflow, used daily

---

### 5. Sessions List Organization

**Current State** (`src/features/sessions/screens/SessionsScreen.tsx`):

```
┌────────────────────────────────────┐
│ 2025-10-11          V12            │ ← Blue bar
│ 1min • 1 boulder • 1/1 flashes    │
├────────────────────────────────────┤
│ 2025-09-21          1              │ ← Orange bar
│ 1min • 2 boulders • 1/2 flashes   │
├────────────────────────────────────┤
│ 2025-09-21          V12            │ ← Blue bar
│ 1200min • 3 boulders • 3/3 flashes│
├────────────────────────────────────┤
│ 2025-09-20          V14            │
│ ...                                │
└────────────────────────────────────┘
```

**Problems**:

- No time-based grouping ("This Week", "Last Month")
- Sessions from same day not visually grouped
- Colored bars (blue/orange) have unclear meaning
- No filtering or sorting options
- Can't quickly find "all V5 sessions" or "sessions from July"
- Must tap to expand, then tap Edit/Delete (2-3 taps for actions)
- Date format repeated (2025-09-20 shown 6 times in a row)
- Scrolling through 100+ sessions is tedious

**User Impact**: Hard to review progress over time, can't find specific sessions, delete/edit is cumbersome.

**Priority**: 🟡 **MEDIUM** - Important but not blocking daily use

---

### 6. Grade System Settings UX

**Current State** (`src/features/grades/components/CustomGradeSystem/GradeSystemSelector.tsx`):

```
Current System: V Scale
[VB] [V0] [V1] [V2] [V3] [V4] [V5] [V6→  (cut off, scrollable)

[Change Grade System] button

Custom Grade Systems:
  Cal mico [✓] [✏️] [🗑️]
```

**Problems**:

- Horizontal grade strip cuts off without clear scroll indicator
- Color progression (light blue → dark teal) doesn't communicate difficulty intuitively
- No visual preview of how custom system looks in session cards
- "Change Grade System" is unclear (does it convert existing sessions?)

**User Impact**: Confusing grade system management, users may not realize strip scrolls.

**Priority**: 🟢 **LOW** - Settings accessed infrequently, mostly functional

---

### 7. Navigation Structure

**Current Structure**:

```
[Dashboard] [Log] [Sessions] [Stats] [Settings]
    ↓         ↓        ↓        ↓        ↓
  Overview  Entry   History  (empty)   Config
```

**Problems**:

- **5 tabs is too many** for mobile app (iOS guidelines suggest 4-5 max, prefer 4)
- Stats and Dashboard overlap in purpose
- Settings as full tab (usually in profile or overflow menu)
- Tab bar takes up prime screen real estate
- No clear primary action (Log should be emphasized)

**Comparison to Best Practices**:

- **Strava**: 4 tabs (Dashboard, Record, Feed, Profile)
- **MyFitnessPal**: 4 tabs (Diary, Plans, Progress, More)
- **Strong**: 4 tabs (Workout, History, Insights, More)

**User Impact**: Cognitive overhead, unclear primary purpose of each tab.

**Priority**: 🟡 **MEDIUM** - Affects overall navigation experience

---

### 8. Missing Modern Features

**Current Gaps**:

- ❌ No dark mode (modern expectation)
- ❌ No data visualizations (charts, graphs, trends)
- ❌ No animations or micro-interactions (feels static)
- ❌ No achievement/badge system (missed gamification opportunity)
- ❌ No progress tracking (grade progression over time)
- ❌ No social features (sharing, comparisons, leaderboards)
- ❌ No widgets (home screen quick logging)
- ❌ No quick actions (3D Touch, long-press menus)

**User Impact**: App feels dated compared to competitors, misses opportunities for engagement.

**Priority**: 🟢 **LOW-MEDIUM** - Nice-to-haves, not blockers

---

## Design System Improvements

### Color Palette Redesign

**New Theme** (Climbing-Inspired):

```typescript
export const colors = {
  // Primary Colors (Rock & Stone)
  primary: {
    50: '#FFF8E1', // Chalk white
    100: '#FFE0B2', // Sandstone light
    200: '#FFCC80',
    300: '#FFB74D',
    400: '#FFA726',
    500: '#FF9800', // Primary Orange (NEW)
    600: '#FB8C00',
    700: '#F57C00',
    800: '#EF6C00',
    900: '#E65100', // Deep orange
  },

  // Secondary Colors (Adventure Green)
  secondary: {
    500: '#26A69A', // Teal (already used in grade colors)
    600: '#00897B',
    700: '#00695C',
  },

  // Accent Colors (Achievement)
  accent: {
    flash: '#FBC02D', // Gold (flash indicator)
    streak: '#FF6F3C', // Orange-red (streak fire)
    success: '#43A047', // Green (completion)
    warning: '#F57C00', // Orange (challenging)
    error: '#E53935', // Red (failed attempt)
  },

  // Neutrals
  background: '#F5F6FA',
  surface: '#FFFFFF',
  text: {
    primary: '#22223B',
    secondary: '#64748B',
    tertiary: '#94A3B8',
    inverse: '#FFFFFF',
  },

  // Semantic
  border: '#E5EAF2',
  divider: '#E2E8F0',
  overlay: 'rgba(0, 0, 0, 0.4)',

  // Grade Difficulty Gradient (Enhanced)
  grade: {
    beginner: '#B3E5FC', // Light blue
    intermediate: '#26A69A', // Teal
    advanced: '#5E35B1', // Purple
    expert: '#FBC02D', // Gold
    elite: '#E64A19', // Red-orange
  },
};
```

**Rationale**:

- **Orange primary** instead of blue → Warmer, more adventurous, associated with caution/challenge
- **Teal secondary** → Already in grade colors, calming, nature-inspired
- **Semantic accents** → Each color has clear meaning (gold = flash, green = success)
- **Expanded neutrals** → Better text hierarchy support

---

### Typography System

**Current State**: Single weight, limited sizes, no hierarchy.

**New System**:

```typescript
export const typography = {
  // Display (Large headers)
  display: {
    fontFamily: 'System',
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
    letterSpacing: -0.5,
  },

  // Headings
  h1: {
    fontFamily: 'System',
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 36,
    letterSpacing: -0.3,
  },
  h2: {
    fontFamily: 'System',
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
  },
  h3: {
    fontFamily: 'System',
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },

  // Body
  body: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodyBold: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
  },

  // UI Elements
  button: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
  },
  caption: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  overline: {
    fontFamily: 'System',
    fontSize: 12,
    fontWeight: '600' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
  },

  // Numbers (Emphasized)
  numeric: {
    fontFamily: 'System',
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
    fontVariant: ['tabular-nums'] as any,
  },
};
```

**Usage**:

- **Display**: Welcome messages, empty states
- **H1-H3**: Section headers, screen titles
- **Body**: Descriptions, notes, paragraph text
- **Numeric**: Stats, grades, counts (tabular nums for alignment)
- **Overline**: Labels above stats ("SESSIONS", "BEST GRADE")

---

### Spacing & Layout

**Current Issues**: Inconsistent padding, margins vary 12-32px randomly.

**New System** (8px base unit):

```typescript
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const layout = {
  screenPadding: spacing.lg, // 24px sides
  cardPadding: spacing.md, // 16px inside cards
  sectionSpacing: spacing.xl, // 32px between sections
  elementSpacing: spacing.md, // 16px between elements
  compactSpacing: spacing.sm, // 8px in tight layouts
};
```

---

### Component Patterns

#### Stat Card (Enhanced)

**Before**:

```
┌──────────┐
│ Sessions │
│    12    │
└──────────┘
```

**After**:

```
┌────────────────────┐
│ SESSIONS     ↗+15% │  ← Overline + trend
│                    │
│   ╭─────╮          │  ← Progress ring
│   │ 12  │          │
│   ╰─────╯          │
│                    │
│ 3 this week        │  ← Context
└────────────────────┘
```

#### Session Card (Enhanced)

**Before**:

```
┌────────────────────────────┐
│ | 2025-10-11        V12    │ ← Colored bar
│   1min • 1 boulder • ⚡    │
└────────────────────────────┘
```

**After**:

```
┌────────────────────────────┐
│ THIS WEEK ──────────────   │ ← Sticky header
│                            │
│ ┌────────────────────────┐ │
│ │ Oct 11  🏆 V12  ⚡ 100% │ │ ← Compact header
│ │ • • • • •              │ │ ← Dot indicators
│ │ 1hr 20min • 5 boulders │ │
│ │ V4(×2) V5(×2) V6(×1)  │ │ ← Grade summary
│ └────────────────────────┘ │
│                            │
│ LAST WEEK ──────────────   │
│ ...                        │
└────────────────────────────┘
```

---

## Screen-by-Screen Recommendations

### 1. Dashboard → **Home Screen** (Redesigned)

**New Name**: "Home" (shorter, clearer than "Dashboard")

**Layout**:

```
┌─────────────────────────────────────────┐
│ 🏔️ Hey Crider!                👤⚙️    │ ← Header with profile/settings
├─────────────────────────────────────────┤
│ WEEKLY PROGRESS                         │ ← Section header
│                                         │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐  │
│ │  ╭───╮  │ │  ╭───╮  │ │  ╭───╮  │  │ ← Progress rings
│ │  │12 │  │ │  │V6 │  │ │  │75%│  │  │
│ │  ╰───╯  │ │  ╰───╯  │ │  ╰───╯  │  │
│ │SESSIONS │ │  BEST   │ │ FLASH   │  │
│ │↗ +3 wk  │ │↗ +1 wk  │ │↘ -5%    │  │ ← Trend indicators
│ └─────────┘ └─────────┘ └─────────┘  │
│                                         │
│ 🔥 5 DAY STREAK • Keep it going!       │ ← Streak banner
│                                         │
│ GRADE PYRAMID                           │
│ ┌───────────────────────────────────┐  │
│ │         ▄▄▄ V6 (3)                │  │ ← Pyramid chart
│ │       ▄▄▄▄▄ V5 (8)                │  │
│ │     ▄▄▄▄▄▄▄ V4 (15)               │  │
│ │   ▄▄▄▄▄▄▄▄▄ V3 (24)               │  │
│ └───────────────────────────────────┘  │
│                                         │
│ RECENT ACTIVITY                         │
│ ┌───────────────────────────────────┐  │
│ │ Oct 11 • V12 • 1hr • ⚡⚡⚡      │  │ ← Mini cards
│ └───────────────────────────────────┘  │
│ ┌───────────────────────────────────┐  │
│ │ Oct 9 • V14 • 2hr • ⚡⚡        │  │
│ └───────────────────────────────────┘  │
│ [View All Sessions →]                  │
└─────────────────────────────────────────┘
  [🏠] [➕] [📋] [👤]                       ← 4 tabs (no more Stats)
```

**Key Changes**:

1. **Personalized greeting** with user's name (from Firebase Auth)
2. **Progress rings** around stats (visual progress indicators)
3. **Trend indicators** (↗+3 this week, ↘-5% from last week)
4. **Streak banner** with fire emoji (gamification)
5. **Grade pyramid** chart (visualize distribution)
6. **Recent activity** feed (last 3-5 sessions)
7. **Remove FAB** (redundant with Log tab)
8. **Profile icon** in header (Settings moved here)

**Implementation** (`src/features/dashboard/screens/HomeScreen.tsx`):

- Split into components: `<StatRing>`, `<GradePyramid>`, `<ActivityFeed>`, `<StreakBanner>`
- Use `react-native-svg` for progress rings and pyramid
- Calculate trends from session data (last 7 days vs previous 7)
- Fetch last 5 sessions for activity feed

---

### 2. Log Screen (Optimized)

**New Flow**: Inline boulder entry instead of modal.

**Layout**:

```
┌─────────────────────────────────────────┐
│ Log Session                          ✕  │
├─────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐ │
│ │ 📅 Oct 11, 2025      ⏱️ 90 min    │ │ ← Compact header
│ └─────────────────────────────────────┘ │
│                                         │
│ GRADE SYSTEM                            │
│ [V-Scale] [Font] [Cal mico]            │ ← Pills, not buttons
│                                         │
│ ADD BOULDER ─────────────────────       │
│ ┌─────────────────────────────────────┐ │
│ │ Grade:  [V4 ▼]  Attempts: ① ②③④   │ │ ← Inline form
│ │ ⚡ Flashed  [Add →]                │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Quick Add:                              │
│ [3×V4] [2×V5] [Last Session]           │ ← Smart templates
│                                         │
│ TODAY'S LOG (5 boulders)                │
│ ┌─────────────────────────────────────┐ │
│ │ V5 ⚡×1  V4 ⚡×2  V6 ×3 (2 att)    │ │ ← Compact summary
│ └─────────────────────────────────────┘ │
│                                         │
│ Individual Boulders:                    │
│ • V5 ⚡                          [×]   │ ← List with delete
│ • V4 ⚡                          [×]   │
│ • V4 ⚡                          [×]   │
│ • V6 (2 attempts)                [×]   │
│ • V6 (3 attempts)                [×]   │
│                                         │
│ 📝 Session Notes                        │
│ ┌─────────────────────────────────────┐ │
│ │ Great session! Felt strong on       │ │
│ │ overhangs...                        │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ [Save Session ──────────────────]      │
└─────────────────────────────────────────┘
```

**Key Changes**:

1. **Inline boulder entry** - no modal popup
2. **Attempt counter buttons** (①②③④) instead of text input
3. **Quick Add templates** - "3×V4" adds 3 boulders at once
4. **Smart suggestions** - "Last Session" button repeats previous
5. **Compact summary** - See totals at a glance
6. **Remove zero-stats bar** - Replace with Quick Add buttons
7. **Better empty state** - Show helpful tips, not just "No boulders"

**Tap Count Comparison**:

- **Before**: 9 taps per boulder × 6 boulders = 54 taps
- **After**: 3 taps per boulder × 6 boulders = 18 taps
- **With Quick Add**: 2 taps total (if similar to last session)

**Result**: **70% faster** logging!

**Implementation**:

- Remove `BoulderModal`, create `<InlineBoulderForm>`
- Add `<QuickAddButton>` component
- Store last session in AsyncStorage, offer "Repeat Last" option
- Use segmented control for attempt counts (1-4+)

---

### 3. Sessions Screen (Enhanced)

**Layout**:

```
┌─────────────────────────────────────────┐
│ Sessions               🔍 [Filter] [⚙️] │ ← Search + filter
├─────────────────────────────────────────┤
│ [All] [Flashed] [V4+] [Last 30d]  ↓    │ ← Filter chips
│                                         │
│ ══════════════════════════════════════  │
│ THIS WEEK (3 sessions, 8hr total)      │ ← Sticky group header
│ ══════════════════════════════════════  │
│                                         │
│ ┌───────────────────────────────────┐  │
│ │ Oct 11  🏆 V12  ⚡ 100%      ← →│  │ ← Swipe for actions
│ │ • • • • •                        │  │
│ │ 1hr 20min • 5 boulders           │  │
│ │ V4(×2) V5(×2) V6(×1)            │  │
│ └───────────────────────────────────┘  │
│     ↓ Tap to expand                    │
│ ┌───────────────────────────────────┐  │
│ │ Oct 9  🏆 V14  ⚡ 50%         │  │
│ │ • •                              │  │
│ │ 45min • 2 boulders               │  │
│ └───────────────────────────────────┘  │
│                                         │
│ ══════════════════════════════════════  │
│ LAST WEEK (5 sessions, 12hr total)     │
│ ══════════════════════════════════════  │
│                                         │
│ ┌───────────────────────────────────┐  │
│ │ Sept 21  🏆 V12  ⚡ 67%       │  │
│ │ ...                              │  │
│ └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

**Key Changes**:

1. **Grouped by time** - "This Week", "Last Week", "September", "Earlier"
2. **Group summaries** - Show total sessions/time for each group
3. **Sticky headers** - Groups stay visible while scrolling
4. **Filter chips** - Quick filters at top
5. **Swipe actions** - Swipe left = delete, right = edit
6. **Compact cards** - More info in less space
7. **Dot indicators** - Visual representation of boulder count
8. **Grade summary** - See all grades at a glance without expanding
9. **Search** - Find sessions by date, grade, or notes

**Implementation**:

- Use `SectionList` instead of `FlatList` for grouping
- Add `<FilterChip>` component with active state
- Implement swipe gesture recognizer (use `react-native-gesture-handler`)
- Add search bar component (`<SearchBar>` with debounced filter)
- Calculate group summaries from session data

---

### 4. Stats Screen → **Merged into Home**

**Decision**: Eliminate Stats as separate tab, merge with Home.

**Rationale**:

- Stats is currently just placeholder
- Dashboard already shows stats
- Reduces tabs from 5 → 4 (better mobile UX)
- Charts/graphs belong in Home screen

**Implementation**:

- Delete `src/features/stats/` folder
- Move any future chart components to `src/features/dashboard/components/charts/`
- Add segmented control to Home: `[Overview] [Charts]`

**Home Screen with Charts Tab**:

```
┌─────────────────────────────────────────┐
│ Home                               ⚙️   │
├─────────────────────────────────────────┤
│ [Overview] [Charts]                     │ ← Segmented control
│                                         │
│ GRADE PROGRESSION (Last 6 months)       │
│ ┌───────────────────────────────────┐  │
│ │                            ●●●     │  │
│ │                      ●●●●          │  │ ← Line chart
│ │              ●●●●                  │  │
│ │      ●●●●                          │  │
│ │ V3  V4  V5  V6  V7  V8  V9  V10   │  │
│ └───────────────────────────────────┘  │
│                                         │
│ VOLUME OVER TIME                        │
│ ┌───────────────────────────────────┐  │
│ │ █           █                      │  │ ← Bar chart
│ │ █ █   █ █   █ █   █       █       │  │
│ │ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ │  │
│ │ W1 W2 W3 W4 W5 W6 W7 W8 W9 W10... │  │
│ └───────────────────────────────────┘  │
│                                         │
│ FLASH RATE TREND                        │
│ ┌───────────────────────────────────┐  │
│ │     ╱╲    ╱╲                       │  │ ← Area chart
│ │   ╱    ╲╱    ╲                     │  │
│ │ ╱              ╲╱╲                 │  │
│ │ 50%  60%  75%  65%  70%  80%       │  │
│ └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

**Charts to Implement** (Phase 2):

1. **Grade Progression** - Line chart showing max grade over time
2. **Volume Trend** - Bar chart of boulders per week
3. **Flash Rate** - Area chart of flash percentage over time
4. **Grade Distribution** - Pie chart or pyramid of grade attempts
5. **Session Duration** - Bar chart of time spent per session

**Libraries**:

- `react-native-svg` (already in project for grade visualizations)
- `victory-native` or `react-native-chart-kit` for charts

---

### 5. Settings Screen (Minor Updates)

**Current State**: Good structure, minor improvements needed.

**Changes**:

1. **Move to Profile tab** - Settings becomes sub-screen of Profile
2. **Add profile header** - Show user info (name, email, photo)
3. **Group settings** - Section headers for "Display", "Account", "About"
4. **Better icons** - More descriptive icons for each setting

**New Layout**:

```
┌─────────────────────────────────────────┐
│ ← Profile                               │
├─────────────────────────────────────────┤
│        ┌─────┐                          │
│        │ CR  │  Crider                  │ ← Profile header
│        └─────┘  crider@example.com      │
│                                         │
│ DISPLAY ────────────────────────────    │
│ ┌───────────────────────────────────┐  │
│ │ 🌙 Dark Mode          [Toggle]    │  │
│ │ 📊 Grade System       V-Scale  >  │  │
│ │ 🌍 Language           English  >  │  │
│ └───────────────────────────────────┘  │
│                                         │
│ ACCOUNT ────────────────────────────    │
│ ┌───────────────────────────────────┐  │
│ │ 👤 Edit Profile              >    │  │
│ │ 🔔 Notifications             >    │  │
│ │ 📤 Export Data               >    │  │
│ │ 🚪 Sign Out                       │  │
│ └───────────────────────────────────┘  │
│                                         │
│ ABOUT ──────────────────────────────    │
│ ┌───────────────────────────────────┐  │
│ │ ℹ️ About Climbing Tracker    >    │  │
│ │ 📄 Privacy Policy            >    │  │
│ │ 📧 Send Feedback             >    │  │
│ └───────────────────────────────────┘  │
│                                         │
│ Version 1.0.0                           │
└─────────────────────────────────────────┘
```

**Implementation**:

- Group settings into sections with headers
- Add profile info at top (from Firebase Auth)
- Add dark mode toggle (implement theme switching)

---

### 6. Grade System Settings (Visual Improvements)

**Current Issues**: Horizontal grade strip cuts off, unclear color meaning.

**Changes**:

```
┌─────────────────────────────────────────┐
│ ← Settings        Grade System           │
├─────────────────────────────────────────┤
│ CURRENT DISPLAY SYSTEM                  │
│ ┌───────────────────────────────────┐  │
│ │ V Scale                           │  │
│ │                                   │  │
│ │ [VB][V0][V1][V2][V3][V4][V5]→    │  │ ← Scroll indicator
│ │                                   │  │
│ │ 🔵 Beginner → 🟢 Inter → 🔴 Exp  │  │ ← Color legend
│ └───────────────────────────────────┘  │
│                                         │
│ [⟳ Change System]                      │
│                                         │
│ CUSTOM SYSTEMS ──────────────────────   │
│ ┌───────────────────────────────────┐  │
│ │ Cal mico                          │  │
│ │ 6 grades • Color-based            │  │ ← System info
│ │ [✓ Active] [Edit] [Delete]        │  │
│ └───────────────────────────────────┘  │
│                                         │
│ [+ Add New Custom System]              │
│                                         │
│ PREVIEW ────────────────────────────    │
│ ┌───────────────────────────────────┐  │
│ │ How it looks in sessions:         │  │
│ │                                   │  │
│ │ Oct 11  🏆 V12  ⚡ 100%           │  │ ← Sample card
│ │ 1hr • 5 boulders                  │  │
│ └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

**Key Changes**:

1. **Scroll indicator** (→) shows more grades exist
2. **Color legend** explains difficulty progression
3. **System info** shows grade count and type
4. **Preview section** shows sample session card
5. **Better gradient** (blue → green → yellow → red for difficulty)

---

## Implementation Phases

### 🔴 Phase 1: Critical Fixes (Week 1-2)

**Goal**: Address blocking UI issues and improve core flows.

**Tasks**:

1. **Design System Foundation**
   - [ ] Create new color palette in `src/shared/theme.ts`
   - [ ] Define typography system
   - [ ] Establish spacing constants
   - [ ] Document component patterns

2. **Dashboard Redesign**
   - [ ] Rename Dashboard → Home
   - [ ] Add progress ring component (`<StatRing>`)
   - [ ] Implement trend calculations (7-day vs previous)
   - [ ] Add streak banner component
   - [ ] Create recent activity feed
   - [ ] Remove FAB button

3. **Log Screen Optimization**
   - [ ] Remove modal-based boulder entry
   - [ ] Create inline boulder form (`<InlineBoulderForm>`)
   - [ ] Add attempt counter buttons (①②③④)
   - [ ] Implement Quick Add templates
   - [ ] Store last session for "Repeat Last" feature
   - [ ] Improve empty state with tips

4. **Navigation Consolidation**
   - [ ] Merge Stats into Home (delete Stats tab)
   - [ ] Move Settings into Profile tab
   - [ ] Reduce to 4 tabs: [Home] [Log] [Sessions] [Profile]
   - [ ] Update tab icons

**Estimated Time**: 40-60 hours
**Priority**: 🔴 **CRITICAL**

---

### 🟡 Phase 2: Enhanced Features (Week 3-4)

**Goal**: Add data visualization and improve sessions management.

**Tasks**:

1. **Home Screen Charts**
   - [ ] Install `victory-native` or `react-native-chart-kit`
   - [ ] Create `<GradePyramid>` chart component
   - [ ] Add segmented control: [Overview] [Charts]
   - [ ] Implement grade progression line chart
   - [ ] Implement volume bar chart
   - [ ] Implement flash rate area chart

2. **Sessions List Improvements**
   - [ ] Convert to `SectionList` for grouping
   - [ ] Implement time-based grouping logic
   - [ ] Add sticky section headers
   - [ ] Create filter chips (`<FilterChip>`)
   - [ ] Add search bar component
   - [ ] Implement swipe-to-delete gesture

3. **Grade System UX**
   - [ ] Add scroll indicator to grade strip
   - [ ] Create color legend component
   - [ ] Add system preview section
   - [ ] Improve gradient visualization

**Estimated Time**: 30-40 hours
**Priority**: 🟡 **HIGH**

---

### 🟢 Phase 3: Polish & Delight (Week 5-6)

**Goal**: Add modern features and improve overall polish.

**Tasks**:

1. **Dark Mode**
   - [ ] Define dark color palette
   - [ ] Create theme context (`<ThemeProvider>`)
   - [ ] Update all screens for dark mode support
   - [ ] Add toggle in Settings

2. **Animations & Micro-interactions**
   - [ ] Add screen transition animations
   - [ ] Implement loading states
   - [ ] Add success animations (confetti on PR?)
   - [ ] Animate stat changes (count-up effect)
   - [ ] Add skeleton screens for loading

3. **Achievement System**
   - [ ] Design badge system
   - [ ] Define achievements (First V5, 10-day streak, etc.)
   - [ ] Create badge UI components
   - [ ] Add achievements to profile
   - [ ] Implement badge notification

4. **Accessibility**
   - [ ] Audit color contrast (WCAG AA)
   - [ ] Add accessibility labels
   - [ ] Test with screen reader
   - [ ] Support dynamic text sizing
   - [ ] Add haptic feedback

**Estimated Time**: 40-50 hours
**Priority**: 🟢 **MEDIUM**

---

### 🔵 Phase 4: Advanced Features (Future)

**Goal**: Differentiate from competitors with unique features.

**Tasks**:

1. **Social Features**
   - [ ] Add profile sharing
   - [ ] Implement friend connections
   - [ ] Create leaderboards (weekly, grade-specific)
   - [ ] Add session sharing to social media

2. **Widgets & Shortcuts**
   - [ ] iOS home screen widget (today's stats)
   - [ ] Android widget support
   - [ ] Quick action menu (3D Touch)
   - [ ] Siri shortcuts integration

3. **Advanced Analytics**
   - [ ] Recovery time analysis
   - [ ] Grade projection (predict when you'll hit V7)
   - [ ] Optimal session duration insights
   - [ ] Flash rate correlations

4. **Training Features**
   - [ ] Project tracking (ongoing climbs)
   - [ ] Training plans (hangboard, campus board)
   - [ ] Video recording integration
   - [ ] Beta notes and route diagrams

**Estimated Time**: 80-100 hours
**Priority**: 🔵 **LOW** (Nice-to-have)

---

## Technical Implementation Guide

### File Structure Changes

**Before**:

```
src/
  features/
    dashboard/
      screens/
        DashboardScreen.tsx
    stats/
      screens/
        StatsScreen.tsx
  shared/
    theme.ts
```

**After**:

```
src/
  features/
    home/                       # Renamed from dashboard
      screens/
        HomeScreen.tsx          # Merged stats into here
      components/
        stats/
          StatRing.tsx          # Progress ring component
          StreakBanner.tsx
        charts/
          GradePyramid.tsx
          GradeProgressionChart.tsx
          VolumeChart.tsx
          FlashRateChart.tsx
        ActivityFeed.tsx
        QuickStats.tsx
  shared/
    design/
      theme.ts                  # Enhanced theme
      typography.ts             # New typography system
      spacing.ts                # New spacing system
      animations.ts             # Animation configs
    components/
      FilterChip.tsx
      SearchBar.tsx
      EmptyState.tsx
```

---

### Component Examples

#### StatRing Component (Progress Ring)

```typescript
// src/features/home/components/stats/StatRing.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors, typography } from '../../../../shared/design/theme';

interface StatRingProps {
  value: number;           // Current value
  max: number;             // Max value for ring
  label: string;           // "SESSIONS"
  trend?: string;          // "↗ +3 this week"
  color?: string;          // Ring color
}

export const StatRing: React.FC<StatRingProps> = ({
  value,
  max,
  label,
  trend,
  color = colors.primary[500],
}) => {
  const size = 120;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(value / max, 1);
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <View style={styles.container}>
      {/* Ring */}
      <View style={styles.ringContainer}>
        <Svg width={size} height={size}>
          {/* Background circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colors.border}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
        <View style={styles.valueContainer}>
          <Text style={[styles.value, { color }]}>{value}</Text>
        </View>
      </View>

      {/* Label */}
      <Text style={styles.label}>{label}</Text>

      {/* Trend */}
      {trend && (
        <Text style={[styles.trend, progress > 0 ? styles.trendUp : styles.trendDown]}>
          {trend}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 16,
  },
  ringContainer: {
    position: 'relative',
  },
  valueContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  value: {
    ...typography.numeric,
    fontSize: 28,
  },
  label: {
    ...typography.overline,
    marginTop: 8,
    color: colors.text.secondary,
  },
  trend: {
    ...typography.caption,
    marginTop: 4,
  },
  trendUp: {
    color: colors.accent.success,
  },
  trendDown: {
    color: colors.accent.error,
  },
});
```

---

#### InlineBoulderForm Component

```typescript
// src/features/sessions/components/InlineBoulderForm.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { colors, typography, spacing } from '../../../shared/design/theme';

interface InlineBoulderFormProps {
  grades: string[];        // Available grades in current system
  onAdd: (grade: string, attempts: number, flashed: boolean) => void;
}

export const InlineBoulderForm: React.FC<InlineBoulderFormProps> = ({
  grades,
  onAdd,
}) => {
  const [grade, setGrade] = useState(grades[0]);
  const [attempts, setAttempts] = useState(1);
  const [flashed, setFlashed] = useState(false);

  const handleAdd = () => {
    const isFlash = attempts === 1 ? true : flashed;
    onAdd(grade, attempts, isFlash);
    // Reset form
    setAttempts(1);
    setFlashed(false);
  };

  return (
    <View style={styles.container}>
      {/* Grade Picker */}
      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Grade:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={grade}
            onValueChange={setGrade}
            style={styles.picker}
          >
            {grades.map(g => (
              <Picker.Item key={g} label={g} value={g} />
            ))}
          </Picker>
        </View>
      </View>

      {/* Attempt Counter */}
      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Attempts:</Text>
        <View style={styles.attemptButtons}>
          {[1, 2, 3, 4].map(num => (
            <TouchableOpacity
              key={num}
              style={[
                styles.attemptButton,
                attempts === num && styles.attemptButtonActive,
              ]}
              onPress={() => {
                setAttempts(num);
                if (num > 1) setFlashed(false); // Can't flash if >1 attempt
              }}
            >
              <Text
                style={[
                  styles.attemptButtonText,
                  attempts === num && styles.attemptButtonTextActive,
                ]}
              >
                {num}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Flash Toggle */}
      {attempts === 1 && (
        <TouchableOpacity
          style={styles.flashToggle}
          onPress={() => setFlashed(!flashed)}
        >
          <Text style={styles.flashIcon}>{flashed ? '⚡' : '○'}</Text>
          <Text style={styles.flashLabel}>Flashed</Text>
        </TouchableOpacity>
      )}

      {/* Add Button */}
      <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
        <Text style={styles.addButtonText}>Add →</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  field: {
    marginBottom: spacing.sm,
  },
  fieldLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  pickerContainer: {
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  picker: {
    height: 40,
  },
  attemptButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  attemptButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  attemptButtonActive: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[500],
  },
  attemptButtonText: {
    ...typography.body,
    color: colors.text.primary,
  },
  attemptButtonTextActive: {
    color: colors.text.inverse,
    fontWeight: '600',
  },
  flashToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  flashIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  flashLabel: {
    ...typography.body,
  },
  addButton: {
    backgroundColor: colors.primary[500],
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  addButtonText: {
    ...typography.button,
    color: colors.text.inverse,
  },
});
```

---

#### GradePyramid Chart Component

```typescript
// src/features/home/components/charts/GradePyramid.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { gradeColors } from '../../../../shared/theme';
import { colors, typography } from '../../../../shared/design/theme';

interface GradePyramidProps {
  data: Record<string, number>;  // { 'V3': 24, 'V4': 15, 'V5': 8, 'V6': 3 }
}

export const GradePyramid: React.FC<GradePyramidProps> = ({ data }) => {
  const sorted = Object.entries(data).sort((a, b) => b[1] - a[1]);
  const maxCount = Math.max(...Object.values(data));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GRADE PYRAMID</Text>
      <View style={styles.pyramid}>
        {sorted.map(([grade, count]) => {
          const widthPercent = (count / maxCount) * 100;
          const color = gradeColors[grade] || colors.primary[500];

          return (
            <View key={grade} style={styles.row}>
              <View style={[styles.bar, { width: `${widthPercent}%`, backgroundColor: color }]}>
                <Text style={styles.barLabel}>
                  {grade} ({count})
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    ...typography.overline,
    color: colors.text.secondary,
    marginBottom: 12,
  },
  pyramid: {
    alignItems: 'center',
  },
  row: {
    width: '100%',
    marginBottom: 4,
    alignItems: 'center',
  },
  bar: {
    height: 32,
    borderRadius: 4,
    justifyContent: 'center',
    paddingHorizontal: 12,
    minWidth: 80,
  },
  barLabel: {
    ...typography.body,
    color: colors.text.inverse,
    fontWeight: '600',
  },
});
```

---

### Animation Configurations

```typescript
// src/shared/design/animations.ts
export const animations = {
  // Screen transitions
  screen: {
    duration: 300,
    easing: 'ease-in-out',
  },

  // Quick interactions (button press, toggle)
  quick: {
    duration: 150,
    easing: 'ease-out',
  },

  // Stat updates (count-up effect)
  stat: {
    duration: 800,
    easing: 'ease-in-out',
  },

  // Loading states
  loading: {
    duration: 1200,
    easing: 'linear',
    loop: true,
  },

  // Success animations
  success: {
    duration: 600,
    easing: 'ease-out',
    scale: 1.2,
  },
};
```

---

## Success Metrics

### Quantitative Metrics

| Metric                   | Current     | Target       | Measurement                                 |
| ------------------------ | ----------- | ------------ | ------------------------------------------- |
| **Session Logging Time** | ~90 seconds | <30 seconds  | Time from opening Log tab to saving session |
| **Taps per Session**     | ~54 taps    | <20 taps     | Count taps to log 6 boulders                |
| **Dashboard Engagement** | Unknown     | 3+ seconds   | Average time spent on Home screen           |
| **Sessions Viewed**      | Unknown     | 80% of total | % of sessions user taps to expand           |
| **Feature Discovery**    | Unknown     | >50%         | % of users who use Quick Add, filters, etc. |
| **App Store Rating**     | N/A         | 4.5+ stars   | Public rating (post-launch)                 |

### Qualitative Metrics

**User Feedback Themes** (Post-redesign):

- "Looks much more professional now"
- "Logging sessions is so much faster"
- "Love the grade pyramid visualization"
- "Finally can see my progress over time"

**Usability Testing Goals**:

- [ ] 90% of users successfully log a session without help
- [ ] 80% of users discover Quick Add feature within 3 sessions
- [ ] 70% of users explore Charts tab within first week
- [ ] Users rate new design 8+/10 (vs current 5/10 baseline)

---

## Appendix: Design Rationale

### Why Orange as Primary Color?

**Climbing Associations**:

- **Caution/Challenge**: Orange is used on warning signs, representing the thrill and risk of climbing
- **Warmth/Energy**: Matches the active, adventurous spirit of climbers
- **Sunset/Outdoor**: Evokes golden hour on rock faces
- **Visibility**: High contrast, easy to see on both light and dark backgrounds

**Psychological Impact**:

- Energizing and motivating (encourages engagement)
- Associated with achievement and confidence
- More unique than generic blue (differentiates from competitors)

### Why 4 Tabs Instead of 5?

**Research** (iOS Human Interface Guidelines):

- "Use no more than five tabs in a tab bar"
- "Fewer tabs are better—prioritize brevity"

**Competitors**:

- Strava: 4 tabs
- MyFitnessPal: 4 tabs
- Strong (gym tracker): 4 tabs
- Nike Run Club: 4 tabs

**Our Decision**:

- Stats overlapped with Dashboard → Merge
- Settings is secondary → Move to Profile
- Result: [Home] [Log] [Sessions] [Profile]

### Why Inline Forms Instead of Modals?

**Modal Problems**:

- **Context Loss**: Can't see what you've already logged
- **Friction**: Every add requires open/close cycle
- **Mobile UX**: Modals feel heavy on small screens

**Inline Benefits**:

- **Speed**: No context switching
- **Visibility**: See summary while adding
- **Flow**: Feels like filling out a form, not interrupting workflow

**Research**: Apps like Habitica, Streaks, and Productive all use inline quick-add patterns for repeated entries.

---

## Next Steps

### Immediate Actions

1. **Get Stakeholder Approval**
   - [ ] Review this document with team/stakeholders
   - [ ] Prioritize phases based on resources
   - [ ] Set timeline for Phase 1 kickoff

2. **Design Mockups** (Optional but Recommended)
   - [ ] Create high-fidelity mockups in Figma
   - [ ] User test with 3-5 target users
   - [ ] Iterate based on feedback

3. **Begin Implementation**
   - [ ] Create feature branch: `feat/ui-redesign-phase-1`
   - [ ] Start with design system (colors, typography)
   - [ ] Implement one screen at a time (Dashboard first)
   - [ ] Review PR before merging

4. **Continuous Measurement**
   - [ ] Set up analytics (Firebase Analytics)
   - [ ] Track key metrics (logging time, engagement)
   - [ ] Collect user feedback (in-app survey)

---

## Conclusion

This comprehensive UI/UX improvement plan transforms the Climbing Tracker from a **functional prototype** into a **polished, motivating companion** for climbers. By addressing critical issues in visual design, navigation, and user flow—and adding modern features like data visualization and gamification—we can create an app that users are proud to use and recommend.

**Key Improvements**:

- 70% faster session logging
- Professional visual identity
- Data-driven insights and charts
- Streamlined navigation (5 → 4 tabs)
- Modern features (dark mode, animations, achievements)

**Phased Approach**:

- Phase 1 (2 weeks): Critical fixes
- Phase 2 (2 weeks): Enhanced features
- Phase 3 (2 weeks): Polish & delight
- Phase 4 (Future): Advanced features

**Expected Outcome**: A climbing tracker that not only tracks progress but **motivates users to climb more, push harder, and achieve their goals**.

---

**Document Version:** 1.0
**Last Updated:** 2025-10-11
**Maintained by:** Crider Development Team
**Status:** Ready for Review
