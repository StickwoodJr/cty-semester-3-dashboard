/**
 * Workload & Crunch Radar Utilities for Seneca CTY Semester 3.
 * Analyzes cognitive load distribution, crunch avalanche weeks,
 * and powers the 4.0 Early-Bird Buffer Recommender.
 */

export const SEMESTER_WEEKS_META = [
  { week: 1, label: "Week 1", dates: "Sep 8 – Sep 11", milestone: "Classes Begin", isCurrent: false },
  { week: 2, label: "Week 2", dates: "Sep 14 – Sep 18", milestone: "Add/Drop Deadline (Sep 18)", isCurrent: false },
  { week: 3, label: "Week 3", dates: "Sep 21 – Sep 25", milestone: "Labs Ramp-Up", isCurrent: false },
  { week: 4, label: "Week 4", dates: "Sep 28 – Oct 2", milestone: "First Assignments", isCurrent: false },
  { week: 5, label: "Week 5", dates: "Oct 5 – Oct 9", milestone: "Pre-Midterm Prep", isCurrent: false },
  { week: 6, label: "Week 6", dates: "Oct 12 – Oct 16", milestone: "Thanksgiving (Oct 12)", isCurrent: false },
  { week: 7, label: "Week 7", dates: "Oct 19 – Oct 23", milestone: "Midterms & WTP100 Due (Oct 23)", isCrunch: true, isCurrent: false },
  { week: 8, label: "Week 8", dates: "Nov 2 – Nov 6", milestone: "Post-Reading Week Resume", isCurrent: false },
  { week: 9, label: "Week 9", dates: "Nov 9 – Nov 13", milestone: "DNC Penalty-Free Drop (Nov 13)", isCurrent: false },
  { week: 10, label: "Week 10", dates: "Nov 16 – Nov 20", milestone: "Second Half Momentum", isCurrent: false },
  { week: 11, label: "Week 11", dates: "Nov 23 – Nov 27", milestone: "Final Project Kickoff", isCurrent: false },
  { week: 12, label: "Week 12", dates: "Nov 30 – Dec 4", milestone: "Pre-Exam Deliverables", isCurrent: false },
  { week: 13, label: "Week 13", dates: "Dec 7 – Dec 11", milestone: "Final Demos & Tests Begin", isCrunch: true, isCurrent: false },
  { week: 14, label: "Week 14", dates: "Dec 14 – Dec 18", milestone: "Final Exams & Semester End", isCrunch: true, isCurrent: false }
];

export const READING_WEEK_META = {
  label: "Reading Week",
  dates: "Oct 26 – Oct 30, 2026",
  description: "Official Seneca Fall Study Break. Zero scheduled classes. Prime window for Assignment 1 projects and active recall."
};

/**
 * Curated 4.0 GPA Early-Bird recommendations for Seneca CTY Semester 3.
 * Identifies high-risk bottlenecks and provides pre-calculated target buffer weeks.
 */
export const RECOMMENDED_EARLY_BUFFERS = [
  {
    taskId: "ops345-lab1",
    courseId: "ops345",
    courseCode: "OPS345",
    name: "Lab 1: Environment & Physical Network",
    weight: 2.0,
    originalWeek: 7,
    recommendedWeek: 3,
    hoursSaved: 3,
    rationale: "OPS345 groups 4 labs due in Week 7 alongside the 25% Midterm. Completing Lab 1 in Week 3 eliminates VM configuration pressure."
  },
  {
    taskId: "ops345-lab2",
    courseId: "ops345",
    courseCode: "OPS345",
    name: "Lab 2: Addressing, NAT & FRR",
    weight: 2.0,
    originalWeek: 7,
    recommendedWeek: 4,
    hoursSaved: 4,
    rationale: "Finish routing and FRR setup in Week 4 right after classroom lecture so you don't forget syntax."
  },
  {
    taskId: "ops345-lab3",
    courseId: "ops345",
    courseCode: "OPS345",
    name: "Lab 3: DNS and Samba Server",
    weight: 2.0,
    originalWeek: 7,
    recommendedWeek: 5,
    hoursSaved: 4,
    rationale: "BIND9 DNS configuration requires careful testing. Staging in Week 5 gives you time to troubleshoot named.conf."
  },
  {
    taskId: "ops345-lab4",
    courseId: "ops345",
    courseCode: "OPS345",
    name: "Lab 4: Containers",
    weight: 2.0,
    originalWeek: 7,
    recommendedWeek: 6,
    hoursSaved: 5,
    rationale: "Clear the last OPS345 lab before Week 7 starts, leaving 100% of Midterm Week for hands-on cheat sheet practice."
  },
  {
    taskId: "wtp100-m6-14",
    courseId: "wtp100",
    courseCode: "WTP100",
    name: "Modules 6-14 & Final Co-op Clearance",
    weight: 64.5,
    originalWeek: 7,
    recommendedWeek: 5,
    hoursSaved: 8,
    rationale: "WTP100 is non-graded but mandatory. Knock out the online modules in Week 5 so you never risk missing the hard Oct 23 deadline."
  },
  {
    taskId: "dat330-assg2",
    courseId: "dat330",
    courseCode: "DAT330",
    name: "Assignment 2: Performance Monitoring",
    weight: 5.0,
    originalWeek: 6,
    recommendedWeek: 5,
    hoursSaved: 4,
    rationale: "Week 6 has 7 deliverables including Thanksgiving Monday. Shifting Assignment 2 to Week 5 smooths the pre-midterm curve."
  },
  {
    taskId: "dat330-proj",
    courseId: "dat330",
    courseCode: "DAT330",
    name: "Final Project: Enterprise Cloud DB",
    weight: 15.0,
    originalWeek: 13,
    recommendedWeek: 11,
    hoursSaved: 12,
    rationale: "Week 13 has 13 deliverables (99% weight). Staging your Azure SQL database schema in Week 11 prevents project all-nighters."
  },
  {
    taskId: "sec320-rep",
    courseId: "sec320",
    courseCode: "SEC320",
    name: "Project Report: Incident Investigation",
    weight: 15.0,
    originalWeek: 13,
    recommendedWeek: 12,
    hoursSaved: 10,
    rationale: "Complete the forensic documentation in Week 12 so you can study for SEC320 Practical Test 2 (15%) in Week 14."
  },
  {
    taskId: "mst300-proj2",
    courseId: "mst300",
    courseCode: "MST300",
    name: "Project 2: Azure Enterprise Governance",
    weight: 15.0,
    originalWeek: 13,
    recommendedWeek: 12,
    hoursSaved: 8,
    rationale: "Deploys RBAC and Azure Policy. Staging in Week 12 leaves Week 13 clear for MST300 Final Test (25%) preparation."
  }
];

/**
 * Crunch severity classifier based on total weight, task count, and presence of exams
 */
export function getCrunchSeverity(totalWeight, taskCount, hasExams = false) {
  if (totalWeight >= 50 || taskCount >= 9 || (hasExams && totalWeight >= 40)) {
    return {
      level: 'extreme',
      label: 'Extreme Avalanche',
      color: 'rose',
      bgClass: 'bg-rose-500/15 border-rose-500/40 text-rose-300',
      barClass: 'bg-gradient-to-t from-rose-600 to-red-500',
      badgeClass: 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold',
      pulse: true
    };
  }

  if (totalWeight >= 25 || taskCount >= 6 || hasExams) {
    return {
      level: 'high',
      label: 'High Crunch',
      color: 'amber',
      bgClass: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
      barClass: 'bg-gradient-to-t from-amber-600 to-orange-500',
      badgeClass: 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold',
      pulse: false
    };
  }

  if (totalWeight >= 15 || taskCount >= 4) {
    return {
      level: 'moderate',
      label: 'Moderate Load',
      color: 'blue',
      bgClass: 'bg-blue-500/10 border-blue-500/20 text-blue-300',
      barClass: 'bg-gradient-to-t from-blue-600 to-cyan-500',
      badgeClass: 'bg-blue-500/15 text-blue-300 border border-blue-500/20',
      pulse: false
    };
  }

  return {
    level: 'calm',
    label: 'Calm / Steady',
    color: 'emerald',
    bgClass: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300',
    barClass: 'bg-gradient-to-t from-emerald-600 to-teal-500',
    badgeClass: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20',
    pulse: false
  };
}

/**
 * Calculates weekly task and weight distribution across the semester.
 * Supports early-bird smoothing when stagedBuffers is provided.
 * 
 * @param {Array} courses - List of courses with assessments
 * @param {Object} stagedBuffers - Mapping of taskId -> targetWeek (e.g. { "ops345-lab1": 3 })
 * @param {Boolean} applySmoothing - Whether to redistribute buffered tasks
 */
export function calculateSemesterWorkload(courses = [], stagedBuffers = {}, applySmoothing = false) {
  const weeksMap = {};

  SEMESTER_WEEKS_META.forEach(w => {
    weeksMap[w.week] = {
      ...w,
      tasks: [],
      totalWeight: 0,
      completedWeight: 0,
      gradedCount: 0,
      hasExams: false,
      courses: new Set()
    };
  });

  courses.forEach(course => {
    (course.assessments || []).forEach(task => {
      const originalWeek = task.week || 1;
      const targetWeek = (applySmoothing && stagedBuffers[task.id]) 
        ? stagedBuffers[task.id] 
        : originalWeek;

      const targetWeekObj = weeksMap[targetWeek] || weeksMap[originalWeek] || weeksMap[1];
      const weight = parseFloat(task.weight) || 0;
      const isGraded = task.status === 'Graded';
      const isExam = ['Test', 'Exam'].includes(task.category);

      const enhancedTask = {
        ...task,
        courseId: course.id,
        courseCode: course.code,
        courseName: course.name,
        courseColor: course.color,
        accentColor: course.accentColor,
        originalWeek,
        effectiveWeek: targetWeek,
        isStagedEarly: applySmoothing && Boolean(stagedBuffers[task.id] && stagedBuffers[task.id] !== originalWeek)
      };

      targetWeekObj.tasks.push(enhancedTask);
      targetWeekObj.totalWeight += weight;
      if (isGraded) {
        targetWeekObj.completedWeight += weight;
        targetWeekObj.gradedCount += 1;
      }
      if (isExam) {
        targetWeekObj.hasExams = true;
      }
      targetWeekObj.courses.add(course.code);
    });
  });

  // Calculate severity for each week
  const weekList = SEMESTER_WEEKS_META.map(meta => {
    const data = weeksMap[meta.week];
    const severity = getCrunchSeverity(data.totalWeight, data.tasks.length, data.hasExams);
    return {
      ...data,
      coursesList: Array.from(data.courses),
      severity
    };
  });

  return weekList;
}

/**
 * Computes comparative statistical metrics (peak load, stress volatility)
 */
export function calculateWorkloadMetrics(weekList = []) {
  if (!weekList.length) {
    return {
      peakWeek: 1,
      peakWeight: 0,
      volatility: 0,
      totalWeight: 0,
      totalTasks: 0,
      crunchWeekCount: 0
    };
  }

  let peakWeek = weekList[0].week;
  let peakWeight = 0;
  let totalWeight = 0;
  let totalTasks = 0;
  let crunchWeekCount = 0;

  const weights = weekList.map(w => {
    totalWeight += w.totalWeight;
    totalTasks += w.tasks.length;
    if (w.severity.level === 'high' || w.severity.level === 'extreme') {
      crunchWeekCount++;
    }
    if (w.totalWeight > peakWeight) {
      peakWeight = w.totalWeight;
      peakWeek = w.week;
    }
    return w.totalWeight;
  });

  // Standard deviation of weekly load (volatility measure)
  const mean = totalWeight / weekList.length;
  const variance = weights.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / weekList.length;
  const volatility = Math.sqrt(variance);

  return {
    peakWeek,
    peakWeight: Math.round(peakWeight * 10) / 10,
    volatility: Math.round(volatility * 10) / 10,
    totalWeight: Math.round(totalWeight * 10) / 10,
    totalTasks,
    crunchWeekCount
  };
}
