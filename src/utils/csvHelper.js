/**
 * CSV Helper: RFC-4180 compliant CSV parser and export utility for Seneca CTY Dashboard
 * Safely handles quoted cells containing commas, escaped quotes, multiline text,
 * blank rows, metadata skipping, and CSV formula injection protection.
 */

// Prevent CSV formula injection by prepending single quote if cell starts with =, +, -, @
export function sanitizeCsvCell(val) {
  if (val === null || val === undefined) return '';
  const str = String(val);
  if (/^[=+\-@]/.test(str)) {
    return "'" + str;
  }
  return str;
}

export function exportTasksToCSV(courses) {
  const headers = ["Course", "Task", "Category", "Due Date", "Weight (%)", "Score (%)", "Status", "Topic / Notes"];
  const rows = [];

  courses.forEach(course => {
    (course.assessments || []).forEach(task => {
      rows.push([
        `"${sanitizeCsvCell(course.code).replace(/"/g, '""')}"`,
        `"${sanitizeCsvCell(task.name || '').replace(/"/g, '""')}"`,
        `"${sanitizeCsvCell(task.category || '').replace(/"/g, '""')}"`,
        `"${sanitizeCsvCell(task.dueDate || '').replace(/"/g, '""')}"`,
        task.weight !== undefined ? task.weight : '',
        task.score !== null && task.score !== undefined ? task.score : '',
        `"${sanitizeCsvCell(task.status || 'Not Started').replace(/"/g, '""')}"`,
        `"${sanitizeCsvCell(task.topic || '').replace(/"/g, '""')}"`
      ]);
    });
  });

  const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);

  // Timezone-safe local date for filename
  const now = new Date();
  const dateSlug = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  link.setAttribute("download", `Seneca_CTY_Sem3_Tasks_${dateSlug}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Tokenize raw CSV text into a 2D array according to RFC-4180
 */
export function tokenizeCSV(text) {
  if (!text || typeof text !== 'string') return [];
  const rows = [];
  let currentRow = [];
  let currentField = '';
  let inQuotes = false;
  let i = 0;

  while (i < text.length) {
    const char = text[i];
    if (inQuotes) {
      if (char === '"') {
        if (i + 1 < text.length && text[i + 1] === '"') {
          // Escaped quote inside quoted field
          currentField += '"';
          i += 2;
          continue;
        } else {
          // Closing quote
          inQuotes = false;
          i++;
          continue;
        }
      } else {
        currentField += char;
        i++;
        continue;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
        i++;
        continue;
      } else if (char === ',') {
        currentRow.push(currentField.trim());
        currentField = '';
        i++;
        continue;
      } else if (char === '\r') {
        if (i + 1 < text.length && text[i + 1] === '\n') i++;
        currentRow.push(currentField.trim());
        currentField = '';
        if (currentRow.some(c => c.length > 0)) rows.push(currentRow);
        currentRow = [];
        i++;
        continue;
      } else if (char === '\n') {
        currentRow.push(currentField.trim());
        currentField = '';
        if (currentRow.some(c => c.length > 0)) rows.push(currentRow);
        currentRow = [];
        i++;
        continue;
      } else {
        currentField += char;
        i++;
        continue;
      }
    }
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some(c => c.length > 0)) rows.push(currentRow);
  }

  return rows;
}

/**
 * Parse CSV text from user import or committed tracker files into structured assessment objects
 */
export function parseCSV(csvText) {
  const rows = tokenizeCSV(csvText);
  if (rows.length === 0) return [];

  // Check for header row
  let headerIndex = -1;
  const colMap = { course: -1, task: -1, category: -1, dueDate: -1, weight: -1, score: -1, status: -1, topic: -1 };

  for (let r = 0; r < rows.length; r++) {
    const row = rows[r];
    const rowStr = row.map(c => c.toLowerCase()).join(' ');

    // Skip summary or title banner lines
    if (rowStr.includes('total assignments') || rowStr.includes('completed tasks') || rowStr.includes('assignment calendar')) {
      continue;
    }

    const hasCourse = row.some(c => /course|code/i.test(c));
    const hasTask = row.some(c => /task|title|name|assessment/i.test(c));
    const hasDue = row.some(c => /due|date/i.test(c));

    if ((hasCourse && hasTask) || (hasTask && hasDue)) {
      headerIndex = r;
      row.forEach((col, cIdx) => {
        const h = col.toLowerCase().replace(/[^a-z]/g, '');
        if (h.includes('course') || h === 'code') colMap.course = cIdx;
        else if (h.includes('task') || h.includes('title') || h.includes('name') || h.includes('assessment')) colMap.task = cIdx;
        else if (h.includes('cat') || h.includes('type')) colMap.category = cIdx;
        else if (h.includes('due') || h.includes('date')) colMap.dueDate = cIdx;
        else if (h.includes('weight')) colMap.weight = cIdx;
        else if (h.includes('score') || h.includes('mark') || h.includes('grade')) colMap.score = cIdx;
        else if (h.includes('status')) colMap.status = cIdx;
        else if (h.includes('topic') || h.includes('note') || h.includes('desc')) colMap.topic = cIdx;
      });
      break;
    }
  }

  const results = [];
  const courseCodeRegex = /^[A-Za-z]{3,4}\s*\d{3}$/;
  const dateRegex = /^\d{4}[-/]\d{2}[-/]\d{2}$/;

  const startRow = headerIndex !== -1 ? headerIndex + 1 : 0;

  for (let r = startRow; r < rows.length; r++) {
    const row = rows[r];
    const nonBlank = row.filter(c => c.length > 0);
    if (nonBlank.length < 2) continue;

    // Skip banner metadata lines
    const rowStr = row.map(c => c.toLowerCase()).join(' ');
    if (rowStr.includes('total assignments') || rowStr.includes('progress') || rowStr.includes('assignment tracker')) {
      continue;
    }

    let courseCode = '';
    let taskName = '';
    let category = 'Assignment';
    let dueDate = '';
    let weight = 5.0;
    let score = null;
    let status = 'Not Started';
    let topic = '';

    if (headerIndex !== -1 && (colMap.course !== -1 || colMap.task !== -1)) {
      courseCode = (colMap.course !== -1 ? row[colMap.course] : '') || 'GEN';
      taskName = (colMap.task !== -1 ? row[colMap.task] : '') || 'Task';
      category = (colMap.category !== -1 ? row[colMap.category] : '') || 'Assignment';
      dueDate = (colMap.dueDate !== -1 ? row[colMap.dueDate] : '') || '';
      if (colMap.weight !== -1 && row[colMap.weight]) {
        const w = parseFloat(row[colMap.weight]);
        if (!isNaN(w) && w > 0) weight = w;
      }
      if (colMap.score !== -1 && row[colMap.score]) {
        const s = parseFloat(row[colMap.score]);
        if (!isNaN(s)) score = s;
      }
      status = (colMap.status !== -1 ? row[colMap.status] : '') || 'Not Started';
      topic = (colMap.topic !== -1 ? row[colMap.topic] : '') || '';
    } else {
      // Headerless format like Assignment Tracker.csv: [,CourseCode, TaskName, Category, DueDate, ...]
      let courseIdx = row.findIndex(c => courseCodeRegex.test(c.trim()));
      if (courseIdx === -1) {
        // Fallback check based on date presence
        const dateIdx = row.findIndex(c => dateRegex.test(c.trim()));
        if (dateIdx !== -1 && dateIdx >= 2) {
          courseIdx = dateIdx - 3 >= 0 && row[dateIdx - 3] ? dateIdx - 3 : dateIdx - 2 >= 0 && row[dateIdx - 2] ? dateIdx - 2 : -1;
        }
      }

      if (courseIdx === -1) continue; // Skip lines without course code (e.g. metadata)

      courseCode = row[courseIdx].trim();
      taskName = row[courseIdx + 1] ? row[courseIdx + 1].trim() : 'Task';
      category = row[courseIdx + 2] ? row[courseIdx + 2].trim() : 'Assignment';
      dueDate = row[courseIdx + 3] ? row[courseIdx + 3].trim().replace(/\//g, '-') : '';

      // Check next columns for status / score / weight
      for (let k = courseIdx + 4; k < row.length; k++) {
        const val = row[k].trim();
        if (/done|completed|graded|submitted|in progress|not started/i.test(val)) {
          status = val;
        }
      }
    }

    if (!taskName || taskName === '') taskName = 'Task';
    if (/done|completed|finished/i.test(status)) {
      status = 'Graded';
    }

    results.push({
      courseCode: courseCode.toUpperCase().replace(/\s+/g, ''),
      name: taskName,
      category,
      dueDate,
      weight,
      score,
      status,
      topic
    });
  }

  return results;
}
