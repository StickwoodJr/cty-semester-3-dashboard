# Seneca CTY Semester 3 Academic Dashboard & Command Center 🎓

[![Live Dashboard](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-success?style=for-the-badge&logo=github)](https://stickwoodjr.github.io/cty-semester-3-dashboard/)
[![Seneca Polytechnic](https://img.shields.io/badge/Seneca%20Polytechnic-CTY%20Semester%203-red)](https://www.senecapolytechnic.ca/programs/fulltime/CTY/courses.html)
[![Term](https://img.shields.io/badge/Term-Fall%202026-blue)](https://learn.senecapolytechnic.ca)
[![License](https://img.shields.io/badge/License-MIT-purple)](LICENSE)

> 🌐 **Live Web Application:** [https://stickwoodjr.github.io/cty-semester-3-dashboard/](https://stickwoodjr.github.io/cty-semester-3-dashboard/)

An intelligent, multi-view academic dashboard and tracker built specifically for the **Computer Systems Technology (CTY)** program at **Seneca Polytechnic (Newnham Campus)** for **Semester 3 (Fall 2026)**.

Pre-loaded with official course syllabi, lecture room locations, class schedules, passing criteria, mark breakdowns, cloud budget monitors, and career preparation milestones.

---

## 🚀 Key Features & Views

### 1. 📊 Executive Dashboard (`/dashboard`)
- **Semester KPI Radar**: Projected GPA (Seneca 4.0 scale), overall weighted course average, task completion meter, and urgent deadlines count.
- **Academic Timeline & Countdown**: Real-time tracker for Fall 2026 milestones (Study Week Oct 26–30, WTP100 hard deadline Oct 23, Final Exams Dec 7–18).
- **Today's Class Schedule Preview**: Real-time room locator (Newnham Bldg A, Bldg C, Bldg K) with quick day-of-week switcher.
- **Upcoming Deadlines Radar**: Interactive priority queue for tasks due in the next 14 days with inline status toggles.
- **Weekly Workload Forecast**: Visual 14-week assessment weight distribution highlighting midterm crunch (Week 7) and final exam crunch (Weeks 13–14).
- **Persistent Scratchpad**: Quick notepad auto-saved to browser storage for lab commands, room numbers, and reminders.

### 2. 🗓️ Interactive Academic Calendar (`/calendar`)
- **Month Grid & Chronological Agenda**: Smooth navigation across September, October, November, and December 2026.
- **Course Color-Coding**: Distinct visual identities for all 7 semester courses.
- **"Hide Done" Filter**: Built-in toggle mirroring the previous semester CSV tracker.
- **Category & Course Filters**: Filter by Lab, Quiz, Assignment, Test, Project, Exam, In-class, or Milestone.
- **Click-to-Inspect**: Click any day or task to view details, enter grades, or add custom study events.

### 3. ✅ Upcoming List & Master Assessment Tracker (`/tasks`)
- **Dual Layout Modes**:
  - **Table View**: Sortable by due date, weight, course code, and title with fast inline score entry.
  - **Kanban Pipeline**: Visual drag/click pipeline across *Not Started*, *In Progress*, *Submitted*, and *Graded*.
- **Live Search**: Instant multi-attribute search across course codes, assessment titles, and topics.
- **CSV Import & Export**: One-click export to spreadsheet and import from past semester CSV files.

### 4. 📚 Dedicated Course Hubs (`/course/:id`)
Deep-dive pages for each individual course featuring:
- **DAT330 (Introduction to Databases - Parul Kantaria)**: Azure SQL & on-prem SQL Server administration, query optimization, 8 labs, 5 quizzes, 3 assignments, midterm, project, and final exam.
- **MST300 (Introduction to Microsoft Cloud Technologies - Nooshin Beheshti)**: Azure services (IaaS/PaaS/SaaS), Key Vault, Sentinel, NSGs, 21 labs, 6 quizzes, 2 projects, and Azure budget compliance monitoring.
- **OPS345 (Open System Application Server - Linux Faculty)**: Advanced Linux administration, DNS, Samba, containers, AWS Learner Lab deployments ($50 strict budget), and handwritten cheat-sheet preparation guide.
- **SEC320 (Security Incident Response - Homayoun Mohamadi)**: Live/dead box forensics, memory analysis (GRR/Volatility), timeline reconstruction, malware analysis, SOAR scripts, and threat intelligence.
- **PSY262 (Mindfulness for Students - Glen Choi)**: General Education course with flexible delivery (in-person or live broadcast online), 12 in-class reflections, memoir, 2 quizzes, and final exam.
- **WTP100 (Work Term Preparation - WIL Co-ordinator)**: 14 weekly modules, resume/cover letter reviews, InStage AI mock interviews, and co-op readiness checklist.
- **CSN305 (Software Defined Networks)**: Dedicated customizable course module ready to be populated with professor, room, and syllabus details as soon as published.

### 5. 🕒 5-Day Weekly Timetable (`/schedule`)
- Visual grid from 8:00 AM to 8:00 PM covering Monday through Friday.
- Accurate Seneca Newnham room listings:
  - `MST300`: Mon 9:50–11:35 (C3036) & Tue 9:50–11:35 (A4515)
  - `SEC320`: Mon 1:30–3:15 (K1272) & Tue 11:40–1:25 (K1272)
  - `DAT330`: Mon 3:20–5:05 (A1509) & Wed 5:10–6:55 (A3512)
  - `OPS345`: Wed 9:50–11:35 & Fri 9:50–11:35 (Ubuntu Host Lab)
  - `PSY262`: Fri 1:30–4:10 (K2241 or Flexible Online)
  - `WTP100`: Online Synchronous weekly modules

### 6. 📈 Marks, GPA & What-If Target Simulator (`/marks`)
- Official **Seneca Polytechnic Letter Grade Scale** & GPA mapping (A+ to F).
- **Target GPA Simulator**: Slide desired GPA (e.g. 3.80+ for President's Honour List) to calculate required course grades.
- **Course What-If Calculator**: Calculates exact percentage required on remaining course weight to hit desired letter grades.
- **Official Syllabus Passing Rule Audits**: Live validation for course-specific passing thresholds (e.g., SEC320 requiring ≥50% on both tests and labs; DAT330 requiring ≥50% across 3 distinct evaluation categories).

### 7. 💼 WTP100 Co-op Career Hub (`/wtp`)
- Progress tracker for all 14 weekly modules.
- Verification checks for the mandatory 80% passing grade per knowledge check.
- High-visibility banner for the **Friday, October 23, 2026** hard completion deadline.
- Direct quick links to Seneca Works, InStage AI, and Career Threads.

### 8. ☁️ Cloud Sandbox Budget Monitors
- **AWS Learner Lab Tracker**: Dedicated burn-down meter for the strict $50 credit pool in OPS345.
- **Azure Budget Allotment Tracker**: 10% course evaluation tracker for DAT330 & MST300.

---

## 🛠️ Technology Stack
- **Framework**: React 18 with Vite (fast, modular, component-driven)
- **Styling**: Tailwind CSS with custom dark mode theme & Seneca palette
- **Icons**: Lucide React
- **Celebration Effects**: Canvas Confetti
- **Data Persistence**: LocalStorage with zero server lock-in
- **Data Portability**: Full JSON backup/restore & CSV spreadsheet import/export

---

## 📦 Getting Started & Running Locally

### Prerequisites
- Node.js 18+ or 20+
- npm 9+

### Installation
```bash
# Clone the repository
git clone https://github.com/StickwoodJr/cty-semester-3-dashboard.git
cd cty-semester-3-dashboard

# Install dependencies
npm install

# Launch development server
npm run dev
```

The application will be accessible at `http://localhost:3000`.

### Production Build & Preview
```bash
# Run logic verification unit test suite (10/10 tests)
npm test

# Compile optimized production assets into dist/
npm run build

# Preview production build locally
npm run preview
```

---

## 🔒 Security, Privacy & Storage Architecture

1. **Zero-Server Privacy Guarantee**:
   - All user grades, scratchpad notes, marks, and custom tasks are stored strictly in the client's browser `LocalStorage`.
   - No personal student identification numbers, login credentials, or confidential grade sheets are ever transmitted or committed to version control.
2. **CSV Formula Injection Sanitization**:
   - All CSV exports sanitize potential formula injection triggers (`=`, `+`, `-`, `@`) with safe single-quote escaping (RFC-4180).
3. **Optimized Asset Footprint**:
   - Reference syllabus PDFs stored in the root repository are excluded from production web bundles by Vite, keeping deployed GitHub Pages assets ultra-lean (~500KB total gzipped footprint) with instant sub-second load times.

---

## 📄 License
MIT License. Created for Seneca Polytechnic Computer Systems Technology (CTY) students.
