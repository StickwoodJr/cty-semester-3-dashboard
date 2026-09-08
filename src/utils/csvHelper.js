export function exportTasksToCSV(courses) {
  const headers = ["Course", "Task", "Category", "Due Date", "Weight (%)", "Score (%)", "Status", "Topic / Notes"];
  const rows = [];

  courses.forEach(course => {
    (course.assessments || []).forEach(task => {
      rows.push([
        `"${course.code}"`,
        `"${(task.name || '').replace(/"/g, '""')}"`,
        `"${(task.category || '').replace(/"/g, '""')}"`,
        `"${task.dueDate || ''}"`,
        task.weight !== undefined ? task.weight : '',
        task.score !== null && task.score !== undefined ? task.score : '',
        `"${task.status || 'Not Started'}"`,
        `"${(task.topic || '').replace(/"/g, '""')}"`
      ]);
    });
  });

  const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `Seneca_CTY_Sem3_Tasks_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function parseCSV(csvText) {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) return [];

  const parsed = [];
  // Find where header starts (skip empty lines or title lines like ',Assignment Tracker,,,,')
  let startIndex = 0;
  for (let i = 0; i < lines.length; i++) {
    const lineLower = lines[i].toLowerCase();
    if (lineLower.includes("course") || lineLower.includes("task") || lineLower.includes("category")) {
      startIndex = i + 1;
      break;
    }
  }

  for (let i = startIndex; i < lines.length; i++) {
    const cols = lines[i].split(",").map(c => c.trim().replace(/^"|"$/g, ''));
    if (cols.length >= 4 && (cols[0] || cols[1])) {
      // Handle both formats: [Course, Task, Category, DueDate...] or [,Course, Task, Category...]
      let offset = cols[0] === "" ? 1 : 0;
      const courseCode = cols[offset + 0] || "GEN";
      const taskName = cols[offset + 1] || "Task";
      const category = cols[offset + 2] || "Assignment";
      const dueDate = cols[offset + 3] || "";
      const status = cols[offset + 5] || cols[offset + 4] || "Not Started";

      parsed.push({
        courseCode,
        name: taskName,
        category,
        dueDate,
        status: status.toLowerCase().includes("done") ? "Graded" : status
      });
    }
  }
  return parsed;
}
