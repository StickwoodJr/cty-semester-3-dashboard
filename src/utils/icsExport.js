/**
 * Utility to generate and download RFC 5545 compliant iCalendar (.ics) files
 * Compatible with Apple Calendar (iOS/macOS), Google Calendar, and Microsoft Outlook.
 */

// Format Date object or YYYY-MM-DD string to iCalendar YYYYMMDD
export function formatIcsDate(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return '';
  return dateStr.trim().replace(/[-/]/g, '');
}

// Convert "9:50 AM" and date "2026-09-14" to local ISO string "20260914T095000"
export function formatIcsDateTime(dateStr, timeStr) {
  if (!dateStr || !timeStr) return '';
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return `${formatIcsDate(dateStr)}T090000`;

  let hours = parseInt(match[1], 10);
  const minutes = match[2].padStart(2, '0');
  const meridian = match[3].toUpperCase();

  if (meridian === 'PM' && hours < 12) hours += 12;
  if (meridian === 'AM' && hours === 12) hours = 0;

  const hoursStr = String(hours).padStart(2, '0');
  return `${formatIcsDate(dateStr)}T${hoursStr}${minutes}00`;
}

// Escape special characters in iCalendar text fields
export function escapeIcsText(text) {
  if (!text) return '';
  return String(text)
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

// Helper to trigger file download in browser
export function triggerFileDownload(filename, content, mimeType = 'text/calendar;charset=utf-8') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Map day name to first occurrence date in Fall 2026 term (Starts Tuesday Sept 8, 2026)
const DAY_FIRST_DATES = {
  Monday: '2026-09-14', // First Monday after term start
  Tuesday: '2026-09-08', // First Day of term
  Wednesday: '2026-09-09',
  Thursday: '2026-09-10',
  Friday: '2026-09-11'
};

const DAY_BYDAY_CODES = {
  Monday: 'MO',
  Tuesday: 'TU',
  Wednesday: 'WE',
  Thursday: 'TH',
  Friday: 'FR'
};

/**
 * Generate iCalendar for recurring weekly classes
 */
export function generateTimetableIcs(courses) {
  let events = [];

  courses.forEach(course => {
    (course.schedule || []).forEach((slot, index) => {
      const day = Object.keys(DAY_FIRST_DATES).find(d => 
        slot.day.toLowerCase().includes(d.toLowerCase())
      ) || 'Monday';

      const firstDate = DAY_FIRST_DATES[day];
      const byDay = DAY_BYDAY_CODES[day] || 'MO';
      
      const timeParts = (slot.time || '').split(/[-–—]/).map(t => t.trim());
      const startTime = timeParts[0] || '9:00 AM';
      const endTime = timeParts[1] || '10:00 AM';
      const dtStart = formatIcsDateTime(firstDate, startTime);
      const dtEnd = formatIcsDateTime(firstDate, endTime);

      const location = slot.room.toLowerCase().includes('online') 
        ? 'Online Synchronous (Blackboard Ultra)' 
        : `${slot.room}, Seneca Newnham Campus, 1750 Finch Ave E, Toronto`;

      const event = [
        'BEGIN:VEVENT',
        `UID:seneca-${course.code.toLowerCase()}-${day.toLowerCase()}-${index}@senecapolytechnic.ca`,
        `DTSTAMP:20260908T000000Z`,
        `DTSTART;TZID=America/Toronto:${dtStart}`,
        `DTEND;TZID=America/Toronto:${dtEnd}`,
        `RRULE:FREQ=WEEKLY;BYDAY=${byDay};UNTIL=20261219T045959Z`,
        `SUMMARY:${escapeIcsText(`${course.code} - ${course.name}`)}`,
        `LOCATION:${escapeIcsText(location)}`,
        `DESCRIPTION:${escapeIcsText(`Professor: ${course.professor}\\nEmail: ${course.email}\\nRoom: ${slot.room}\\nSection: ${course.section}\\nSeneca CTY Semester 3 (Fall 2026)`)}`,
        'STATUS:CONFIRMED',
        'BEGIN:VALARM',
        'TRIGGER:-PT15M',
        'ACTION:DISPLAY',
        `DESCRIPTION:${escapeIcsText(`Class in 15 min: ${course.code} at ${slot.room}`)}`,
        'END:VALARM',
        'END:VEVENT'
      ].join('\r\n');

      events.push(event);
    });
  });

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Seneca CTY Semester 3//Class Timetable//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Seneca CTY Fall 2026 Timetable',
    'X-WR-TIMEZONE:America/Toronto',
    ...events,
    'END:VCALENDAR'
  ].join('\r\n');
}

/**
 * Generate iCalendar for all assessments & evaluation deadlines
 */
export function generateAssessmentsIcs(courses) {
  let events = [];

  courses.forEach(course => {
    (course.assessments || []).forEach(task => {
      if (!task.dueDate) return;

      const dateStr = formatIcsDate(task.dueDate);
      const isUrgent = task.weight >= 15;

      const event = [
        'BEGIN:VEVENT',
        `UID:task-${task.id}@senecapolytechnic.ca`,
        `DTSTAMP:20260908T000000Z`,
        `DTSTART;VALUE=DATE:${dateStr}`,
        `SUMMARY:${escapeIcsText(`[${course.code}] ${task.name} (${task.weight}% wt)`)}`,
        `DESCRIPTION:${escapeIcsText(`Course: ${course.name}\\nCategory: ${task.category}\\nWeight: ${task.weight}%\\nTopic: ${task.topic || task.name}\\nStatus: ${task.status}\\nInstructor: ${course.professor}`)}`,
        'STATUS:CONFIRMED',
        'BEGIN:VALARM',
        isUrgent ? 'TRIGGER:-P2D' : 'TRIGGER:-P1D',
        'ACTION:DISPLAY',
        `DESCRIPTION:${escapeIcsText(`Due ${isUrgent ? 'in 2 days' : 'tomorrow'}: ${course.code} ${task.name} (${task.weight}%)`)}`,
        'END:VALARM',
        'END:VEVENT'
      ].join('\r\n');

      events.push(event);
    });
  });

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Seneca CTY Semester 3//Assessment Tracker//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Seneca CTY Assessments & Deadlines',
    'X-WR-TIMEZONE:America/Toronto',
    ...events,
    'END:VCALENDAR'
  ].join('\r\n');
}

/**
 * Combined Complete All-in-One Calendar (Timetable + Assessments + Term Milestones)
 */
export function generateAllInOneIcs(courses, semesterConfig) {
  const timetableIcs = generateTimetableIcs(courses);
  const assessmentsIcs = generateAssessmentsIcs(courses);

  // Extract VEVENT sections
  const timetableEvents = timetableIcs.match(/BEGIN:VEVENT[\s\S]*?END:VEVENT/g) || [];
  const assessmentEvents = assessmentsIcs.match(/BEGIN:VEVENT[\s\S]*?END:VEVENT/g) || [];

  // Add term milestones
  const milestoneEvents = (semesterConfig?.importantDates || []).map((milestone, idx) => {
    const dateStr = formatIcsDate(milestone.date);
    return [
      'BEGIN:VEVENT',
      `UID:milestone-seneca-2026-${idx}@senecapolytechnic.ca`,
      `DTSTAMP:20260908T000000Z`,
      `DTSTART;VALUE=DATE:${dateStr}`,
      `SUMMARY:${escapeIcsText(`⭐ Seneca: ${milestone.title}`)}`,
      `DESCRIPTION:${escapeIcsText(`Seneca Academic Calendar Fall 2026\\nCategory: ${milestone.type}`)}`,
      'STATUS:CONFIRMED',
      'END:VEVENT'
    ].join('\r\n');
  });

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Seneca CTY Semester 3//All-in-One Command Center//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Seneca CTY Semester 3 Master Calendar',
    'X-WR-TIMEZONE:America/Toronto',
    ...timetableEvents,
    ...assessmentEvents,
    ...milestoneEvents,
    'END:VCALENDAR'
  ].join('\r\n');
}
