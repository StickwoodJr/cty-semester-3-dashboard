export const SEMESTER_CONFIG = {
  termName: "Fall 2026",
  startDate: "2026-09-08",
  endDate: "2026-12-18",
  readingWeekStart: "2026-10-26",
  readingWeekEnd: "2026-10-30",
  wtpDeadline: "2026-10-23",
  examPeriodStart: "2026-12-07",
  examPeriodEnd: "2026-12-18",
  totalWeeks: 14,
  campus: "Seneca Newnham Campus, Toronto",
  program: "Computer Systems Technology (CTY) - Semester 3",
  importantDates: [
    { date: "2026-09-08", title: "First Day of Fall 2026 Classes", type: "academic" },
    { date: "2026-09-18", title: "Last Day to Add Classes / Drop with Full Refund", type: "academic" },
    { date: "2026-10-12", title: "Thanksgiving Day (College Closed)", type: "holiday" },
    { date: "2026-10-23", title: "WTP100 Mandatory Completion Deadline (All 14 Modules)", type: "critical" },
    { date: "2026-10-26", title: "Study / Reading Week Begins", type: "break" },
    { date: "2026-10-30", title: "Study / Reading Week Ends", type: "break" },
    { date: "2026-11-13", title: "Last Day to Drop Without Academic Penalty (DNC)", type: "academic" },
    { date: "2026-12-07", title: "Final Evaluation & Project Presentation Period Begins", type: "exam" },
    { date: "2026-12-18", title: "End of Fall 2026 Term & Final Exams Conclude", type: "exam" }
  ]
};

export const SENECA_GRADE_SCALE = [
  { letter: "A+", min: 90, max: 100, gpa: 4.0, description: "Distinction / Outstanding" },
  { letter: "A",  min: 80, max: 89.99, gpa: 4.0, description: "Excellent" },
  { letter: "B+", min: 75, max: 79.99, gpa: 3.5, description: "Very Good" },
  { letter: "B",  min: 70, max: 74.99, gpa: 3.0, description: "Good" },
  { letter: "C+", min: 65, max: 69.99, gpa: 2.5, description: "Satisfactory" },
  { letter: "C",  min: 60, max: 64.99, gpa: 2.0, description: "Acceptable" },
  { letter: "D+", min: 55, max: 59.99, gpa: 1.5, description: "Conditional Pass" },
  { letter: "D",  min: 50, max: 54.99, gpa: 1.0, description: "Bare Minimum Pass" },
  { letter: "F",  min: 0,  max: 49.99, gpa: 0.0, description: "Not a Pass" }
];

export function getLetterGrade(percentage) {
  if (percentage === null || percentage === undefined || isNaN(percentage)) return "N/A";
  for (const grade of SENECA_GRADE_SCALE) {
    if (percentage >= grade.min) return grade.letter;
  }
  return "F";
}

export function getGpaValue(percentage) {
  if (percentage === null || percentage === undefined || isNaN(percentage)) return null;
  for (const grade of SENECA_GRADE_SCALE) {
    if (percentage >= grade.min) return grade.gpa;
  }
  return 0.0;
}
