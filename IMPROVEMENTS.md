# Seneca CTY Semester 3 Dashboard — Continuous Quality & Improvement Log

This document tracks all discovered bugs, accessibility audits, cross-browser/responsive edge cases, performance benchmarks, and enhancements across the entire Seneca CTY Semester 3 Dashboard application.

---

## Autonomous Feature Agent Log

### Cycle 1 — Exam & Midterm War Room (`src/components/ExamWarRoomView.jsx`)
- **Category**: New High-Impact Feature (Academic Strategy & 4.0 GPA Target)
- **Motivation**: Midterms, tests, and finals account for over 60% of the entire semester's grade across the 7 courses. Additionally, Seneca syllabi mandate strict independent sub-minimum rules (e.g. SEC320 and DAT330 requiring $\ge 50\%$ test weighted averages to pass) and specific cheat sheet allowances (e.g. OPS345 1-sided handwritten 8.5"x11" sheet for midterm, 2-sided for final).
- **Implementation**:
  - Built `src/components/ExamWarRoomView.jsx` with live countdown clocks to Midterm Week (Oct 19, 2026) and Final Exam Week (Dec 7, 2026).
  - Integrated course-by-course syllabus threshold alert cards detailing exact allowable exam aids and passing hurdles.
  - Built an interactive Seneca CTY Exam Readiness Checklist persisted in `localStorage` under `seneca_cty_exam_readiness_v1` with progress bar and completion feedback.
  - Linked assessments directly to one-click Focus Study Timer sessions and course details.
  - Wired into `src/App.jsx`, `src/components/Sidebar.jsx` (with `Award` icon and "Midterms" badge), and `src/components/CommandPaletteModal.jsx` (<kbd>Cmd+K</kbd>).
- **Verification**: Zero build errors (`npm run build`). Clean responsive layout across desktop and mobile.
- **Commit**: Completed in Cycle 1 (`98e7420`).

### Cycle 2 — Smart Study Block & Gap-Time Optimizer (`src/components/StudyPlannerView.jsx`)
- **Category**: New High-Impact Feature (4.0 GPA Strategy, Campus Gap Utilization & Calendar Sync)
- **Motivation**: Seneca CTY Semester 3 students spend long days on Newnham Campus with substantial multi-hour gaps between classes (e.g. 4.5 hours free on Tuesday afternoon, 1h 55m on Wednesday afternoon, 1h 55m on Thursday morning). Without structured scheduling, these gap hours are easily lost. Achieving a 4.0 GPA across 7 rigorous courses (OPS345 Linux, MST300 Azure, DAT330 SQL, CSN305 SDN, SEC320 Forensics) requires ~20–25 weekly hours of dedicated hands-on lab practice.
- **Implementation**:
  - Created `src/components/StudyPlannerView.jsx` featuring an automated gap-opportunity detector identifying high-yield study windows across Monday–Friday.
  - Provided a pre-balanced 4.0 GPA study block plan mapped to each course's technical workload and weight, persisted to `localStorage` (`seneca_cty_study_blocks_v2`).
  - Implemented customizable weekly study targets per course (`seneca_cty_study_targets_v1`) and aggregated past 7-day focus timer logs (`seneca_cty_study_sessions_v1`) to display a live "4.0 Study Readiness Index".
  - Interactive block manager: mark complete, delete, add custom blocks with campus location and specific lab objectives, or reset to recommended 4.0 plan.
  - Seamless Focus Timer integration: 1-click "Focus" button switches directly to the Focus Timer with course pre-selected.
  - Full RFC-5545 iCalendar generation (`generateStudyBlocksIcs`) with 15-minute advance phone notifications, wired into `SyncExportModal.jsx` and the Study Planner header.
  - Linked from `TimetableView.jsx` with quick "Gap Planner" action button, `Sidebar.jsx` (with `Compass` icon and "4.0 Gaps" badge), and `CommandPaletteModal.jsx` (<kbd>Cmd+K</kbd>).
- **Verification**: Built cleanly (`npm run build`, 0 warnings/errors).
- **Commit**: Completed in Cycle 2.

---

## Session: September 8, 2026 (Initial Comprehensive Audit)

### Baseline Verification
- **Build Status**: Verified `npm run build` runs cleanly (Vite v6.4.3, React 18.3.1, Tailwind CSS).
- **Initial Commit**: Committed previously untracked `PrintReportView.jsx` printable one-pager and PDF export (`c0cc79b`).

### Issues Found (Categorized by Audit Tier)

#### Tier 1 — Correctness & Broken States
- [x] **T1.1 (CSV Parsing Scrambling & Injection)**: `parseCSV` in `src/utils/csvHelper.js` now implements RFC-4180 tokenizer supporting quoted strings with commas, skips `,24,,24,,,` summary lines, and prevents formula injection. *(Fixed in `cbbe122`)*
- [x] **T1.2 (Focus Timer Drift & Tab Backgrounding)**: `FocusTimerView.jsx` now uses timestamp-delta timing (`Date.now()`), `visibilitychange` & focus listeners, and sleep recovery. Updates browser tab title with countdown. *(Fixed in `8dc12d3`)*
- [x] **T1.3 (Modals Missing Backdrop Click & Escape Listener)**: `AssessmentModal`, `CourseEditModal`, `SettingsModal`, `SyncExportModal`, `WhatIfCalculatorModal`, and `CommandPaletteModal` now support Escape key dismiss and backdrop click. *(Fixed in `e287d56`)*
- [x] **T1.4 (Blank/Missing Due Date Sorting Inversion)**: Created `sortTasksByDueDate` in `src/utils/dateHelper.js` ensuring empty dates sort to the bottom. *(Fixed in `4356d16`)*
- [x] **T1.5 (Hardcoded Calendar "Today" Highlight)**: `CalendarView.jsx` now uses `getLocalDateStr()` for dynamic local "Today" highlight without UTC rollover bugs. *(Fixed in `39ac1fe`)*
- [x] **T1.6 (What-If GPA Calculator Edge Cases)**: `WhatIfCalculatorModal.jsx` handles WTP100 SAT/UN policy with explanatory notice. *(Fixed in `e287d56`)*
- [x] **T1.7 (Semester Average Weighting)**: `AcademicContext.jsx` computes credit-weighted semester average. *(Fixed in `4356d16`)*
- [x] **T1.8 (iCal Export Special Character & Dash Handling)**: `icsExport.js` splits on en-dash, em-dash, and regular hyphens. *(Fixed in `39ac1fe`)*

#### Tier 2 — Responsive & Cross-Browser
- [x] **T2.1 (Calendar Day Name Truncation)**: On mobile (<640px), weekday names switch to compact `Sun`, `Mon` while desktop displays `Sunday`, `Monday`. *(Fixed in `39ac1fe`)*
- [x] **T2.2 (Timetable Mobile Scaling)**: Timetable grid dynamically collapses to 1 column when a day filter is selected on mobile/tablets, adds mobile swipe affordance for 5-day view, and provides responsive full-width compact view with keyboard accessibility in `src/components/TimetableView.jsx`.
- [x] **T2.3 (Modal Viewport Overflow)**: All modals (`AssessmentModal`, `CourseEditModal`, `SettingsModal`, `SyncExportModal`, `WhatIfCalculatorModal`, `CommandPaletteModal`) configured with `max-h-[90vh] flex flex-col` and scrollable bodies (`overflow-y-auto flex-1`) to prevent button cutoff on mobile landscape and small screens.

#### Tier 3 — Accessibility (WCAG AA)
- [x] **T3.1 (Dialog ARIA Attributes)**: Modals now include `role="dialog"`, `aria-modal="true"`, and `aria-labelledby`. *(Fixed in `e287d56`)*
- [x] **T3.2 (Icon-Only Button Labels)**: Added explicit, descriptive `aria-label` attributes across all icon-only buttons (Navbar search/export/settings, Tasks table actions, Focus timer controls & tabs, Sidebar add course, Timetable filters, and Modal dismiss buttons).
- [x] **T3.3 (Focus Visibility)**: Added consistent `focus-visible:ring-2 focus-visible:ring-red-500` outlines across navigation, action buttons, table rows, and interactive controls for keyboard accessibility.

#### Tier 4 — Performance
- [x] **T4.1 (Context Value Recreation Re-renders)**: Memoized all handler functions with `useCallback` and `AcademicContext.Provider` value with `useMemo` in `src/context/AcademicContext.jsx`.
- [ ] **T4.2 (Root PDFs Storage Bloat)**: Over 1.2MB of static syllabus PDFs exist in the root of the repository. They are not bundled into `dist/` by Vite, but should be documented for external docs storage.

#### Tier 5 — Security & Privacy
- [ ] **T5.1 (Public Syllabus & Personal Enrollment Reference)**: Filenames and course outlines reference specific section numbers (NBB-5201, NBB-5219). Flagged as a privacy recommendation to ensure personal student numbers or confidential grades are never committed.
- [x] **T5.2 (CSV Formula Injection Protection)**: Exported CSV values beginning with formula triggers (`=`, `+`, `-`, `@`) sanitized with single quote prefixing. *(Fixed in `cbbe122`)*

#### Tier 6 — Code Quality & Architecture
- [x] **T6.1 (Duplicated Date & Time Utilities)**: Extracted into `src/utils/dateHelper.js`. *(Fixed in `4356d16`)*
- [ ] **T6.2 (Lack of Unit / Logic Verification Tests)**: Add a lightweight test runner or verify script to guarantee GPA formulas, CSV parsing, and date math do not regress.

- [x] **T7.1 ("Days Until Deadline" Urgency Indicator)**: Added `getDeadlineUrgency` in `src/utils/dateHelper.js` with color-coded badges in Dashboard & Tasks views. *(Fixed in `4356d16`)*
- [x] **T7.2 (Smart Filters on Tasks View)**: Added smart filter presets bar ("All", "Due This Week ≤7d", "Overdue", "High Weight ≥15%", "Incomplete", "Completed") with dynamic count badges, single-click "Clear filters" action, and accessible ARIA attributes in `src/components/TasksView.jsx`.

---

### Execution Plan & Sequence of Fixes

1. **Fix 1 (Tier 1 & 5 — Correctness & Security)**: RFC-4180 compliant CSV parser with quote support, metadata skipping, and CSV formula injection protection.
2. **Fix 2 (Tier 1 & 6 — Correctness & Architecture)**: Create central `src/utils/dateHelper.js` with timezone-safe local date calculation, days-until computation, and fix empty due date sorting in `AcademicContext.jsx` and `TasksView.jsx`.
3. **Fix 3 (Tier 1 — Correctness)**: Re-engineer `FocusTimerView.jsx` with timestamp-delta timing, `visibilitychange` background tab sync, and wake-from-sleep support.
4. **Fix 4 (Tier 1 & 3 — Correctness & Accessibility)**: Modal backdrop click, Escape key dismiss, and ARIA dialog roles across all 5 modals (`AssessmentModal`, `CourseEditModal`, `SettingsModal`, `SyncExportModal`, `WhatIfCalculatorModal`).
5. **Fix 5 (Tier 1 — Correctness)**: Dynamic local "Today" highlight in `CalendarView.jsx`, en-dash/em-dash resilience in `icsExport.js`, and WTP100 edge-case handling in `WhatIfCalculatorModal.jsx`.
6. **Fix 6 (Tier 4 — Performance)**: Memoize `AcademicContext` value and key metrics to prevent whole-tree re-renders on scratchpad typing.
7. **Fix 7 (Tier 2, 3, & 7 — Responsive, a11y & Polish)**: Weekday mobile abbreviations in `CalendarView.jsx`, "Days until deadline" badges in `DashboardView.jsx` and `TasksView.jsx`, and accessible `aria-label` attributes.
8. **Automated Verification**: Build and run test script to verify all fixes pass cleanly.

---
