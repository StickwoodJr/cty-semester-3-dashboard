# Seneca CTY Semester 3 Dashboard — Continuous Quality & Improvement Log

This document tracks all discovered bugs, accessibility audits, cross-browser/responsive edge cases, performance benchmarks, and enhancements across the entire Seneca CTY Semester 3 Dashboard application.

---

## Session: September 8, 2026 (Initial Comprehensive Audit)

### Baseline Verification
- **Build Status**: Verified `npm run build` runs cleanly (Vite v6.4.3, React 18.3.1, Tailwind CSS).
- **Initial Commit**: Committed previously untracked `PrintReportView.jsx` printable one-pager and PDF export (`c0cc79b`).

### Issues Found (Categorized by Audit Tier)

#### Tier 1 — Correctness & Broken States
- [ ] **T1.1 (CSV Parsing Scrambling & Injection)**: `parseCSV` in `src/utils/csvHelper.js` uses naive `line.split(",")`, breaking when quoted fields contain commas (e.g. `"Lab 1, Azure Setup"`). It also triggers a false-positive match on metadata rows containing `"task"` (e.g. `,Total Assignments,,Completed Tasks,,Progress,`), parsing `,24,,24,,,` into a corrupt bogus task with `courseCode: '24'`. CSV formula injection (`=`, `+`, `-`, `@`) is also unescaped on export.
- [ ] **T1.2 (Focus Timer Drift & Tab Backgrounding)**: `FocusTimerView.jsx` uses `setInterval(..., 1000)` with `setSecondsLeft(prev => prev - 1)`. In backgrounded tabs and during device sleep, browser throttling clamps `setInterval` to 1 minute or freezes it, causing severe drift. `handleTimerComplete` is also executed as a side-effect inside `setSecondsLeft` updater function with stale state closures.
- [ ] **T1.3 (Modals Missing Backdrop Click & Escape Listener)**: `AssessmentModal`, `CourseEditModal`, `SettingsModal`, `SyncExportModal`, and `WhatIfCalculatorModal` cannot be closed by pressing Escape or clicking the outer backdrop overlay.
- [ ] **T1.4 (Blank/Missing Due Date Sorting Inversion)**: `AcademicContext.jsx` and `TasksView.jsx` sort tasks using `(a.dueDate || '').localeCompare(b.dueDate || '')`, which places tasks with missing or empty due dates before actual imminent deadlines.
- [ ] **T1.5 (Hardcoded Calendar "Today" Highlight)**: `CalendarView.jsx` hardcodes `day.dateStr === '2026-09-08'` rather than dynamically computing the local date. Using `new Date().toISOString()` also introduces UTC timezone off-by-one bugs in Eastern Time (Toronto) evening hours.
- [ ] **T1.6 (What-If GPA Calculator Edge Cases)**: `WhatIfCalculatorModal.jsx` assumes a hardcoded 100% total course weight, breaking when courses have unfinished weights or 0 credits (e.g. WTP100, which is SAT/UN).
- [ ] **T1.7 (Semester Average Weighting)**: `AcademicContext.jsx` computes term average as an unweighted mean of course percentages rather than a credit-weighted average.
- [ ] **T1.8 (iCal Export Special Character & Dash Handling)**: `icsExport.js` splits timetable time on hyphen (`-`), failing on en-dash (`–`) and em-dash (`—`), leading to invalid `DTEND` records.

#### Tier 2 — Responsive & Cross-Browser
- [ ] **T2.1 (Calendar Day Name Truncation)**: On mobile (<640px), full weekday names in calendar header ("Wednesday") cause cramped, truncated or overflowing columns.
- [ ] **T2.2 (Timetable Mobile Scaling)**: Timetable scaled grid needs horizontal scroll affordance and compact agenda view fallback for narrow touchscreens (360px).
- [ ] **T2.3 (Modal Viewport Overflow)**: Modals on small mobile screens need explicit `max-h-[85vh]` with smooth scrolling bodies.

#### Tier 3 — Accessibility (WCAG AA)
- [ ] **T3.1 (Dialog ARIA Attributes)**: Modals lack `role="dialog"`, `aria-modal="true"`, and `aria-labelledby`.
- [ ] **T3.2 (Icon-Only Button Labels)**: Nav toggle, modal close buttons, month pagers, and inline action buttons lack descriptive `aria-label` attributes for screen readers.
- [ ] **T3.3 (Focus Visibility)**: Interactive elements need consistent `focus-visible:ring-2 focus-visible:ring-red-500` outlines.

#### Tier 4 — Performance
- [ ] **T4.1 (Context Value Recreation Re-renders)**: `AcademicContext.Provider` passes a newly allocated object literal on every single render. Fast-changing state like `scratchpad` typing re-renders the entire application tree.
- [ ] **T4.2 (Root PDFs Storage Bloat)**: Over 1.2MB of static syllabus PDFs exist in the root of the repository. They are not bundled into `dist/` by Vite, but should be documented for external docs storage.

#### Tier 5 — Security & Privacy
- [ ] **T5.1 (Public Syllabus & Personal Enrollment Reference)**: Filenames and course outlines reference specific section numbers (NBB-5201, NBB-5219). Flagged as a privacy recommendation to ensure personal student numbers or confidential grades are never committed.
- [ ] **T5.2 (CSV Formula Injection Protection)**: Exported CSV values beginning with formula triggers (`=`, `+`, `-`, `@`) must be sanitized.

#### Tier 6 — Code Quality & Architecture
- [ ] **T6.1 (Duplicated Date & Time Utilities)**: Date formatting, time-to-minutes conversion, and local date string generation are duplicated across 5 different components. Extract into `src/utils/dateHelper.js`.
- [ ] **T6.2 (Lack of Unit / Logic Verification Tests)**: Add a lightweight test runner or verify script to guarantee GPA formulas, CSV parsing, and date math do not regress.

#### Tier 7 — Polish & UX Details
- [ ] **T7.1 ("Days Until Deadline" Urgency Indicator)**: Tasks view and dashboard lack an instant visual indicator of days remaining until each deadline (e.g. "Due today", "In 2 days", "Overdue").
- [ ] **T7.2 (Smart Filters on Tasks View)**: Quick-filter buttons for "Due this week", "Overdue", and "High-weight exams (>=15%)".

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
