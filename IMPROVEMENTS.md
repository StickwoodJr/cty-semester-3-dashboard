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
- **Commit**: Completed in Cycle 2 (`20bd7a5`).

### Cycle 3 — Flashcards & Active Recall Command Mastery (`src/components/FlashcardsView.jsx`)
- **Category**: New High-Impact Feature (Active Learning, Exam Command Recall & Performance Optimization)
- **Motivation**: Achieving a 4.0 GPA in CTY Semester 3 requires high marks on midterms and practical exams (60%+ of final course grades). Technical courses (OPS345, MST300, DAT330, SEC320, CSN305) require precise syntax and theoretical recall under timed test conditions (e.g. BIND DNS record syntax, systemd directives, Azure Blob tiers and VM deallocation commands, SQL normalization rules, NIST incident response phases, and SDN OpenFlow packet flow).
- **Implementation**:
  - Built `src/data/flashcardsData.js` with 20+ curated, high-yield, exam-tested concept flashcards spanning all 7 courses.
  - Developed `src/components/FlashcardsView.jsx` featuring:
    - Interactive 3D flip card engine with keyboard controls (<kbd>Space</kbd> to flip, <kbd>←</kbd>/<kbd>→</kbd> to navigate, <kbd>1</kbd>/<kbd>2</kbd>/<kbd>3</kbd> to rate).
    - 3-tier active recall rating system (Needs Practice, Learning, Mastered) with live mastery dashboard and progress bar.
    - Searchable cheatsheet browse table mode for rapid, high-density exam revision.
    - Custom flashcard creator modal with `localStorage` persistence (`seneca_cty_flashcards_v2`).
    - Focus Timer integration (launch 25m Pomodoro sprint directly from deck).
    - Code splitting & bundle optimization in `vite.config.js` (`manualChunks` separating vendor, Lucide icons, and app code, reducing bundle warning to 0).
  - Wired into `src/App.jsx`, `src/components/Sidebar.jsx` (with `Brain` icon and "Active" badge), and `src/components/CommandPaletteModal.jsx` (<kbd>Cmd+K</kbd>).
- **Verification**: Zero build errors (`npm run build`). Clean chunk split (vendor 134 kB, icons 42 kB, app 344 kB).
- **Commit**: Completed in Cycle 3 (`2d695a9`).

### Cycle 4 — 4.0 GPA Margin of Error & Assessment-Level Forecaster (`src/components/MarksGpaView.jsx`)
- **Category**: High-Impact Feature Enhancement (4.0 Target Trajectory, Margin of Error Cushion & Syllabus Sentinel)
- **Motivation**: In Seneca Polytechnic, a 4.0 GPA is non-linear and unforgiving: scoring below 80% (B+, 75-79%) in a single course drops that course to 3.5 quality points, dragging the entire term GPA down to 3.71. A student striving for a 4.0 needs granular insight into exactly how many course percentage points can still be dropped ("Margin of Error Cushion") and what exact scores are required on high-stakes midterms and final exams to guarantee $\ge 80.0\%$ (A). Additionally, Seneca outlines enforce mandatory sub-minimum test rules (e.g. DAT330 and SEC320 requiring $\ge 50\%$ test weighted averages to pass regardless of lab performance).
- **Implementation**:
  - Re-engineered `src/components/MarksGpaView.jsx` with an interactive **Assessment-Level Forecaster**:
    - Select any of the 7 courses to drill into all its graded tasks (completed vs pending).
    - Real-time sliders and numeric inputs to simulate scores on pending assignments, midterms, and finals.
    - 1-Click course simulation presets: "Simulate 80% (Conservative 4.0 Threshold)", "Simulate 90% (Distinction A+)", and Reset.
    - **4.0 Droppable Points Cushion Gauge**: Calculates exact course percentage points remaining before dipping below 80% (`20.0 - pointsLost`).
    - **Required Remaining Average Formula**: Real-time computation of average required across remaining weight to lock an A grade.
    - **Syllabus Sub-Minimum Sentinel**: Automatically audits DAT330 and SEC320 mandatory 50% test passing hurdle, displaying green pass shields or red warning indicators.
    - **4.0 Semester Safety Heatmap**: Side-by-side comparative grid showing cushion status (Comfortable, On Track, Intensive Focus, Secured) across all courses.
- **Verification**: Built cleanly (`npm run build`, 0 errors), 10/10 logic verification tests passing (`npm test`).
- **Commit**: Completed in Cycle 4 (`e9a9f15`).

### Cycle 5 — Syllabus & Resource Vault with Faculty Directory & Student Perks (`src/components/ResourceVaultView.jsx`)
- **Category**: New High-Impact Feature (Academic Centralization, Faculty Access, Policy Guidance & Free Tech Perks)
- **Motivation**: In CTY Semester 3, students juggle distinct learning management portals, cloud dashboards, and campus services (Learn@Seneca, Microsoft Azure, Matrix SSH gateway, SenecaWorks WIL, Seneca Libraries). Additionally, reaching professors during office hours and understanding official Seneca policies (DNC penalty-free drop deadline, Exam conflict protocols, Academic Honesty AI rules, and President's Honour List requirements) are critical to maintaining peace of mind and securing distinction.
- **Implementation**:
  - Developed `src/components/ResourceVaultView.jsx` featuring:
    - **Official Seneca & Cloud Portals Gateway**: Direct one-click access with status badges to Learn@Seneca, Student Home, Azure for Students, SenecaWorks, Matrix Linux SSH, Seneca Libraries (Safari/O'Reilly books), and ITS Service Desk.
    - **CTY Faculty Directory**: Detailed profiles for all course professors (Parul Kantaria, Nooshin Beheshti, Homayoun Mohamadi, Glen Choi, Linux Faculty, SDN Faculty, WIL Coordinator) with campus office/lab locations, office hours, syllabus tips, 1-click email address copy, and pre-formatted `mailto:` inquiries.
    - **Academic Policies & Survival Guide**: Clear breakdown of the Seneca 4.0 GPA distinction rule, Nov 13 DNC drop deadline, Academic Honesty & GenAI submission guidelines, and Exam conflict procedures.
    - **Free Student Perks & Developer Software**: Links and guides to claim $2,000+ in student developer benefits (GitHub Student Developer Pack, Azure for Students $100 credits, Microsoft 365 ProPlus, and O'Reilly Safari Books online via Seneca SSO).
    - Real-time search and tab filters (All, Portals, Faculty, Policies, Perks).
  - Wired into `src/App.jsx`, `src/components/Sidebar.jsx` (with `Library` icon and "Portals" badge), and `src/components/CommandPaletteModal.jsx` (<kbd>Cmd+K</kbd>).
- **Verification**: Built cleanly (`npm run build`, 0 errors), 10/10 logic verification tests passing (`npm test`).
- **Commit**: Completed in Cycle 5 (`2020845`).

### Cycle 6 — 4.0 Daily Habits & Academic Execution Streak Engine (`src/components/HabitsTrackerView.jsx`)
- **Category**: New High-Impact Feature (Productivity, Habit Engineering & 4.0 GPA Target)
- **Motivation**: Earning a 4.0 GPA across 7 demanding CTY courses (OPS345 Linux, MST300 Azure, DAT330 SQL, CSN305 SDN, SEC320 Forensics) requires daily micro-routines rather than sporadic exam cramming. Specifically, students risk catastrophic marks if they forget critical daily checks (e.g. failing to deallocate Azure lab VMs burns the $100 student credit, which constitutes 10% of the entire course grade in MST300 & DAT330).
- **Implementation**:
  - Engineered `src/components/HabitsTrackerView.jsx` featuring:
    - **7 Core Seneca CTY Daily Habits**:
      1. Azure VM Cloud Deallocation Check (prevents cloud budget overrun)
      2. 15-Minute Linux Command Drill (systemd, BIND DNS, firewalld for OPS345)
      3. Active Recall Flashcard Session (10 cards in Flashcard War Room)
      4. Lab Pre-Reading & Syntax Prep (prep before entering campus)
      5. Campus Gap-Time Utilization (study in Newnham Library during timetable breaks)
      6. 10m Mindful Reset & Downregulation (stress regulation for PSY262)
      7. WTP100 Module & Co-op Progress (progress toward Oct 23 deadline)
    - **Streak & Consistency Engine**: Tracks current streak, best streak, and calculates a 7-day Weekly Discipline score.
    - **7-Day Visual Heatmap Matrix**: Interactive day-by-day (Mon–Sun) completion blocks with completion history.
    - **Celebratory Confetti**: Triggers `canvas-confetti` when all 7 daily habits are completed.
    - **Direct Quick Action Buttons**: Jump straight from any habit to its associated tool (Toolbelt, Flashcards, Study Planner, Timer, Career Hub).
    - **Custom Habit Creator**: Add custom user habits with target rationale, persisted in `localStorage` (`seneca_cty_daily_habits_v1` & `seneca_cty_habit_logs_v1`).
  - Wired into `src/App.jsx`, `src/components/Sidebar.jsx` (with `Flame` icon and "Daily" badge), and `src/components/CommandPaletteModal.jsx` (<kbd>Cmd+K</kbd>).
- **Verification**: Built cleanly (`npm run build`, 0 errors), 10/10 logic verification tests passing (`npm test`).
- **Commit**: Completed in Cycle 6.

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
- [x] **T4.2 (Root PDFs Storage Bloat & Bundle Separation)**: Verified Vite excludes root syllabus PDFs from production builds (`dist/`), ensuring lean web bundles. Documented in `README.md` and verification architecture.

#### Tier 5 — Security & Privacy
- [x] **T5.1 (Public Syllabus & Personal Enrollment Reference Policy)**: Formalized privacy guarantee in `README.md`: 100% of user grades, notes, marks, and custom tasks reside in browser `LocalStorage` with zero server transmission. Confirmed no confidential student IDs or private evaluations are committed to git.
- [x] **T5.2 (CSV Formula Injection Protection)**: Exported CSV values beginning with formula triggers (`=`, `+`, `-`, `@`) sanitized with single quote prefixing. *(Fixed in `cbbe122`)*

#### Tier 6 — Code Quality & Architecture
- [x] **T6.1 (Duplicated Date & Time Utilities)**: Extracted into `src/utils/dateHelper.js`. *(Fixed in `4356d16`)*
- [x] **T6.2 (Lack of Unit / Logic Verification Tests)**: Created native ES module test suite `scripts/verify-logic.js` (executable via `npm test`) covering RFC-4180 CSV parsing, quote preservation, formula injection protection, local timezone date calculations, due-date sorting, and Seneca Polytechnic credit-weighted GPA formulas with 10/10 automated tests passing cleanly.

#### Tier 7 — Polish & UX Details
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
