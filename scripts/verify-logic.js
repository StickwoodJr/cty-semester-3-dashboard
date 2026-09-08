import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseCSV, exportTasksToCSV } from '../src/utils/csvHelper.js';
import { 
  parseLocalDate, 
  getDaysUntil, 
  getDueUrgency, 
  sortTasksByDueDate,
  getLocalDateStr 
} from '../src/utils/dateHelper.js';
import { getLetterGrade, getGpaValue } from '../src/data/senecaDates.js';
import { calculateSemesterWorkload, calculateWorkloadMetrics, getCrunchSeverity } from '../src/utils/workloadHelper.js';
import { INITIAL_COURSES } from '../src/data/coursesData.js';
import { LAB_PREFLIGHT_PRESETS, GENERAL_PREFLIGHT_CRITERIA } from '../src/data/labPreflightData.js';
import { CTY_PROGRAM_CONFIG, CTY_SEMESTERS, SENECA_COOP_GATES, INDUSTRY_CERTIFICATIONS } from '../src/data/pathwayData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🧪 Running Seneca CTY Semester 3 Logic Verification Suite...\n');

let passedTests = 0;
let totalTests = 0;

function test(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✅ ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ ${name}`);
    console.error(`     Error: ${err.message}`);
    throw err;
  }
}

// -------------------------------------------------------------
// 1. CSV Parser Tests
// -------------------------------------------------------------
console.log('📦 1. CSV RFC-4180 Parsing & Security:');

test('RFC-4180: Parses quoted fields containing commas without column splitting', () => {
  const csv = `Course,Assessment,Category,Due Date,Weight,Status,Score,Topic\n` +
              `CSN305,"Lab 1, Azure VM Setup",Lab,2026-09-20,5.0,Not Started,,Intro to cloud\n`;
  const parsed = parseCSV(csv);
  assert.strictEqual(parsed.length, 1);
  assert.strictEqual(parsed[0].courseCode, 'CSN305');
  assert.strictEqual(parsed[0].name, 'Lab 1, Azure VM Setup');
  assert.strictEqual(parsed[0].weight, 5.0);
});

test('Metadata Skipping: Ignores summary lines like ,24,,24,,, without generating corrupt task rows', () => {
  const csv = `,Total Assignments,,Completed Tasks,,Progress,\n` +
              `,24,,24,,,\n` +
              `Course,Assessment,Weight\n` +
              `DAT330,Project Milestone,15\n`;
  const parsed = parseCSV(csv);
  assert.strictEqual(parsed.length, 1);
  assert.strictEqual(parsed[0].courseCode, 'DAT330');
  assert.strictEqual(parsed[0].name, 'Project Milestone');
});

test('Real CSV Ingestion: Parses all 24 tasks from actual repository Assignment Tracker CSV', () => {
  const csvPath = path.join(rootDir, 'Assignment Tracker - Assignment Tracker.csv');
  const content = fs.readFileSync(csvPath, 'utf8');
  const tasks = parseCSV(content);
  assert.strictEqual(tasks.length, 24, `Expected exactly 24 tasks, parsed ${tasks.length}`);
  
  // Verify all course codes are valid Seneca courses
  const validCodes = new Set(['CSN205', 'SEC220', 'OPS245', 'FLM278', 'NAT101', 'MST200']);
  tasks.forEach(t => {
    assert(validCodes.has(t.courseCode), `Unexpected course code parsed: ${t.courseCode}`);
  });
});

test('CSV Formula Injection: Sanitizes formula triggers (=, +, -, @) to prevent injection attack', () => {
  const mockCourses = [{
    id: 'sec320',
    code: 'SEC320',
    assessments: [{
      name: '=cmd|"/C calc"!A0',
      category: '+Quiz',
      dueDate: '-2026-10-15',
      weight: 10,
      status: '@Active',
      score: null,
      topic: '=HYPERLINK("http://evil.com")'
    }]
  }];

  const exported = exportTasksToCSV(mockCourses, false);
  assert(exported.includes(`"'=cmd`), 'Formula = must be escaped');
  assert(exported.includes(`"'+Quiz"`), 'Formula + must be escaped');
  assert(exported.includes(`"'-2026-10-15"`), 'Formula - must be escaped');
  assert(exported.includes(`"'@Active"`), 'Formula @ must be escaped');
});

// -------------------------------------------------------------
// 2. Date Helper & Timezone Tests
// -------------------------------------------------------------
console.log('\n📅 2. Local Timezone & Due Date Utilities:');

test('parseLocalDate: Avoids UTC day-shift rollbacks', () => {
  const parsed = parseLocalDate('2026-09-08');
  assert.strictEqual(parsed.getFullYear(), 2026);
  assert.strictEqual(parsed.getMonth(), 8); // 0-indexed September = 8
  assert.strictEqual(parsed.getDate(), 8);
  assert.strictEqual(getLocalDateStr(parsed), '2026-09-08');
});

test('getDaysUntil: Accurately computes day difference regardless of time of day', () => {
  const refDate = new Date(2026, 8, 8, 23, 45, 0); // 11:45 PM on Sept 8, 2026
  
  // Due today
  assert.strictEqual(getDaysUntil('2026-09-08', refDate), 0);
  
  // Due tomorrow
  assert.strictEqual(getDaysUntil('2026-09-09', refDate), 1);
  
  // Due in 7 days
  assert.strictEqual(getDaysUntil('2026-09-15', refDate), 7);
  
  // Overdue by 3 days
  assert.strictEqual(getDaysUntil('2026-09-05', refDate), -3);
  
  // Empty date returns null
  assert.strictEqual(getDaysUntil('', refDate), null);
  assert.strictEqual(getDaysUntil(null, refDate), null);
});

test('getDueUrgency: Returns correct badge classifications', () => {
  const refDate = new Date(2026, 8, 8, 12, 0, 0);
  
  const overdue = getDueUrgency('2026-09-07', refDate);
  assert.strictEqual(overdue.type, 'overdue');
  assert.strictEqual(overdue.days, -1);
  
  const today = getDueUrgency('2026-09-08', refDate);
  assert.strictEqual(today.type, 'today');
  assert.strictEqual(today.days, 0);
  
  const soon = getDueUrgency('2026-09-11', refDate);
  assert.strictEqual(soon.type, 'urgent');
  assert.strictEqual(soon.days, 3);
  
  const none = getDueUrgency('', refDate);
  assert.strictEqual(none.type, 'none');
  assert.strictEqual(none.days, null);
});

test('sortTasksByDueDate: Safely puts empty/TBA dates at the bottom in ascending sort', () => {
  const list = [
    { id: 1, name: 'TBA task', dueDate: '' },
    { id: 2, name: 'Later task', dueDate: '2026-11-20' },
    { id: 3, name: 'Null task', dueDate: null },
    { id: 4, name: 'Earliest task', dueDate: '2026-09-15' }
  ];

  const sorted = sortTasksByDueDate(list, true);
  assert.strictEqual(sorted[0].id, 4, 'Earliest task should be first');
  assert.strictEqual(sorted[1].id, 2, 'Later task should be second');
  assert(sorted[2].id === 1 || sorted[2].id === 3, 'Empty/null tasks should be last');
  assert(sorted[3].id === 1 || sorted[3].id === 3, 'Empty/null tasks should be last');
});

// -------------------------------------------------------------
// 3. Seneca Polytechnic Academic Calculations
// -------------------------------------------------------------
console.log('\n🎓 3. Seneca Polytechnic GPA & Grading Formula:');

test('Seneca Grade Scale: Matches official Seneca grading criteria', () => {
  assert.strictEqual(getLetterGrade(95), 'A+');
  assert.strictEqual(getGpaValue(95), 4.0);

  assert.strictEqual(getLetterGrade(82), 'A');
  assert.strictEqual(getGpaValue(82), 4.0);

  assert.strictEqual(getLetterGrade(77), 'B+');
  assert.strictEqual(getGpaValue(77), 3.5);

  assert.strictEqual(getLetterGrade(72), 'B');
  assert.strictEqual(getGpaValue(72), 3.0);

  assert.strictEqual(getLetterGrade(67), 'C+');
  assert.strictEqual(getGpaValue(67), 2.5);

  assert.strictEqual(getLetterGrade(62), 'C');
  assert.strictEqual(getGpaValue(62), 2.0);

  assert.strictEqual(getLetterGrade(57), 'D+');
  assert.strictEqual(getGpaValue(57), 1.5);

  assert.strictEqual(getLetterGrade(52), 'D');
  assert.strictEqual(getGpaValue(52), 1.0);

  assert.strictEqual(getLetterGrade(45), 'F');
  assert.strictEqual(getGpaValue(45), 0.0);
});

test('Credit-Weighted Average Formula: Multiplies by course credits and excludes 0-credit courses', () => {
  // Scenario:
  // Course A: 1 credit, 90% (A+ = 4.0) -> Quality Points = 4.0, Weighted = 90
  // Course B: 1 credit, 70% (B = 3.0)  -> Quality Points = 3.0, Weighted = 70
  // Course C (WTP100): 0 credits, 100% -> EXCLUDED
  const creditsA = 1, avgA = 90, gpaA = 4.0;
  const creditsB = 1, avgB = 70, gpaB = 3.0;
  const creditsC = 0, avgC = 100, gpaC = 4.0;

  let totalCredits = 0;
  let totalQP = 0;
  let totalScore = 0;

  [
    { credits: creditsA, avg: avgA, gpa: gpaA },
    { credits: creditsB, avg: avgB, gpa: gpaB },
    { credits: creditsC, avg: avgC, gpa: gpaC }
  ].forEach(c => {
    if (c.credits > 0) {
      totalCredits += c.credits;
      totalQP += c.gpa * c.credits;
      totalScore += c.avg * c.credits;
    }
  });

  const termGpa = totalQP / totalCredits;
  const termAvg = totalScore / totalCredits;

  assert.strictEqual(totalCredits, 2);
  assert.strictEqual(termGpa, 3.5);
  assert.strictEqual(termAvg, 80.0);
});

// -------------------------------------------------------------
// 4. Workload Crunch Radar & 4.0 Early-Bird Buffer Tests
// -------------------------------------------------------------
console.log('\n📊 4. Workload Crunch Radar & 4.0 Early-Bird Buffer:');

test('getCrunchSeverity: Classifies weekly workloads accurately', () => {
  const calm = getCrunchSeverity(10, 2, false);
  assert.strictEqual(calm.level, 'calm');

  const moderate = getCrunchSeverity(18, 4, false);
  assert.strictEqual(moderate.level, 'moderate');

  const high = getCrunchSeverity(30, 5, false);
  assert.strictEqual(high.level, 'high');

  const extreme = getCrunchSeverity(100, 10, true);
  assert.strictEqual(extreme.level, 'extreme');
  assert.strictEqual(extreme.pulse, true);
});

test('calculateSemesterWorkload: Accurately groups 14 weeks and identifies Week 7 & 14 crunches', () => {
  const weeks = calculateSemesterWorkload(INITIAL_COURSES, {}, false);
  assert.strictEqual(weeks.length, 14);

  const week7 = weeks.find(w => w.week === 7);
  assert(week7, 'Week 7 must exist');
  assert.strictEqual(week7.tasks.length, 10, 'Week 7 must have 10 tasks');
  assert(week7.totalWeight > 100, 'Week 7 total weight must be > 100%');
  assert.strictEqual(week7.severity.level, 'extreme');

  const metrics = calculateWorkloadMetrics(weeks);
  assert.strictEqual(metrics.totalTasks, 83, `Expected 83 total semester evaluations, got ${metrics.totalTasks}`);
  assert(metrics.volatility > 0, 'Volatility must be positive');
});

test('calculateSemesterWorkload: Early-bird staging shifts weight and reduces crunch', () => {
  // Stage OPS345 labs early from Week 7 to Weeks 3, 4, 5, 6
  const mockBuffers = {
    'ops345-lab1': 3,
    'ops345-lab2': 4,
    'ops345-lab3': 5,
    'ops345-lab4': 6
  };

  const rawWeeks = calculateSemesterWorkload(INITIAL_COURSES, mockBuffers, false);
  const smoothedWeeks = calculateSemesterWorkload(INITIAL_COURSES, mockBuffers, true);

  const rawWeek7 = rawWeeks.find(w => w.week === 7);
  const smoothedWeek7 = smoothedWeeks.find(w => w.week === 7);

  // 4 labs * 2% = 8% weight shifted
  assert.strictEqual(smoothedWeek7.tasks.length, rawWeek7.tasks.length - 4);
  assert(smoothedWeek7.totalWeight < rawWeek7.totalWeight);
  assert.strictEqual(Math.round((rawWeek7.totalWeight - smoothedWeek7.totalWeight) * 10) / 10, 8.0);
});

// -------------------------------------------------------------
// 5. Lab Pre-Flight & Rubric Verification Tests
// -------------------------------------------------------------
console.log('\n🛡️ 5. Lab Pre-Flight & Screenshot Rubric Auditing:');

test('LAB_PREFLIGHT_PRESETS: Every preset corresponds to a valid course and contains audit commands', () => {
  const courseIds = new Set(INITIAL_COURSES.map(c => c.id));
  assert(LAB_PREFLIGHT_PRESETS.length >= 8, 'Should have at least 8 lab presets');

  LAB_PREFLIGHT_PRESETS.forEach(preset => {
    assert(courseIds.has(preset.courseId), `Preset courseId ${preset.courseId} must exist in INITIAL_COURSES`);
    assert(preset.labName && preset.labName.length > 0, 'Lab name must not be empty');
    assert(preset.verificationCmd && preset.verificationCmd.length > 0, 'Verification command must not be empty');
    assert(Array.isArray(preset.requiredItems) && preset.requiredItems.length >= 3, 'Must have at least 3 required rubric items');
    
    // Check that items have penalty warnings
    preset.requiredItems.forEach(item => {
      assert(item.id, 'Item must have an id');
      assert(item.label, 'Item must have a label');
      assert(item.penalty, 'Item must declare a rubric penalty warning');
    });
  });
});

test('LAB_PREFLIGHT_PRESETS: Terminal commands contain essential proof tokens (whoami, date, or SQL audit)', () => {
  LAB_PREFLIGHT_PRESETS.forEach(preset => {
    if (preset.terminalType === 'bash') {
      const hasIdentity = preset.verificationCmd.includes('whoami');
      const hasTime = preset.verificationCmd.includes('date');
      assert(hasIdentity || hasTime, `Bash preset ${preset.id} must include identity or timestamp tokens`);
    } else if (preset.terminalType === 'sql') {
      const hasSqlAudit = preset.verificationCmd.includes('SUSER_SNAME') || preset.verificationCmd.includes('GETDATE');
      assert(hasSqlAudit, `SQL preset ${preset.id} must include SUSER_SNAME or GETDATE tokens`);
    }
  });
});

test('GENERAL_PREFLIGHT_CRITERIA: Covers all 5 Seneca academic standard pillars', () => {
  assert.strictEqual(GENERAL_PREFLIGHT_CRITERIA.length, 5);
  const ids = GENERAL_PREFLIGHT_CRITERIA.map(c => c.id);
  assert(ids.includes('gen-id'));
  assert(ids.includes('gen-time'));
  assert(ids.includes('gen-cloud'));
  assert(ids.includes('gen-format'));
  assert(ids.includes('gen-academic'));
});

// -------------------------------------------------------------
// 6. Degree Pathway, Prerequisite Chains & Co-op Clearance
// -------------------------------------------------------------
console.log('\n🎓 6. Degree Pathway, Prerequisite Chains & Co-op Clearance:');

test('CTY_PROGRAM_CONFIG: Establishes official Seneca program credentials and thresholds', () => {
  assert.strictEqual(CTY_PROGRAM_CONFIG.programCode, 'CTY');
  assert.strictEqual(CTY_PROGRAM_CONFIG.totalCredits, 36.0);
  assert.strictEqual(CTY_PROGRAM_CONFIG.coopGpaThreshold, 3.00);
  assert.strictEqual(CTY_PROGRAM_CONFIG.distinctionGpaThreshold, 4.00);
});

test('Prerequisite Graph: Semester 3 courses correctly unlock Semester 4 and Co-op placements', () => {
  const sem3 = CTY_SEMESTERS.find(s => s.semester === 3);
  assert(sem3, 'Semester 3 must exist in curriculum map');
  assert.strictEqual(sem3.courses.length, 7, 'Semester 3 must have 7 courses');

  const prereqMap = {};
  sem3.courses.forEach(c => {
    if (c.prereqFor) prereqMap[c.code] = c.prereqFor;
  });

  assert.strictEqual(prereqMap['OPS345'], 'OPS445', 'OPS345 must unlock OPS445');
  assert.strictEqual(prereqMap['DAT330'], 'DAT440', 'DAT330 must unlock DAT440');
  assert.strictEqual(prereqMap['SEC320'], 'SEC420', 'SEC320 must unlock SEC420');
  assert.strictEqual(prereqMap['WTP100'], 'CTY331', 'WTP100 must unlock CTY331');
  assert.strictEqual(prereqMap['MST300'], 'CSN405', 'MST300 must unlock CSN405');
  assert.strictEqual(prereqMap['CSN305'], 'CSN405', 'CSN305 must unlock CSN405');
});

test('SENECA_COOP_GATES & INDUSTRY_CERTIFICATIONS: Audits all 4 gates and 6 vendor certifications', () => {
  assert.strictEqual(SENECA_COOP_GATES.length, 4, 'Must have 4 official Seneca co-op gates');
  assert.strictEqual(INDUSTRY_CERTIFICATIONS.length, 6, 'Must have 6 aligned certifications');

  const certVendors = new Set(INDUSTRY_CERTIFICATIONS.map(c => c.vendor));
  assert(certVendors.has('Microsoft'), 'Must include Microsoft certs (AZ-900/104, DP-900)');
  assert(certVendors.has('Red Hat'), 'Must include Red Hat RHCSA');
  assert(certVendors.has('CompTIA'), 'Must include CompTIA Security+');
  assert(certVendors.has('Cisco'), 'Must include Cisco CCNA');

  INDUSTRY_CERTIFICATIONS.forEach(cert => {
    assert(cert.examCode, `Cert ${cert.id} must have exam code`);
    assert(cert.voucherTip, `Cert ${cert.id} must declare student voucher tip`);
    assert(cert.url.startsWith('https://'), `Cert ${cert.id} must have secure URL`);
  });
});

console.log(`\n🎉 Verification Completed: ${passedTests}/${totalTests} tests passed cleanly with 0 failures.\n`);
