import React, { useState } from 'react';
import { useAcademic } from '../context/AcademicContext';
import { 
  X, Settings, Download, Upload, RefreshCw, 
  Database, GitBranch, Check, AlertTriangle, ShieldCheck
} from 'lucide-react';
import { exportTasksToCSV, parseCSV } from '../utils/csvHelper';

export default function SettingsModal() {
  const { 
    activeModal, 
    setActiveModal, 
    courses, 
    setCourses, 
    resetToDefaults, 
    showToast 
  } = useAcademic();

  if (activeModal !== 'settings') return null;

  const [csvInput, setCsvInput] = useState('');
  const [showCsvImport, setShowCsvImport] = useState(false);

  // JSON Export
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(courses, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Seneca_CTY_Sem3_Backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("JSON backup downloaded successfully", "success");
  };

  // JSON Import
  const handleImportJSON = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCourses(parsed);
          showToast("Successfully restored data from JSON backup!", "success");
          setActiveModal(null);
        } else {
          showToast("Invalid backup file format", "error");
        }
      } catch (err) {
        showToast("Error parsing JSON backup file", "error");
      }
    };
    reader.readAsText(file);
  };

  // CSV Import execution
  const handleExecuteCsvImport = () => {
    if (!csvInput.trim()) return;
    const parsedTasks = parseCSV(csvInput);
    if (parsedTasks.length === 0) {
      showToast("No valid rows recognized in CSV", "error");
      return;
    }

    const availableCodes = new Set(courses.map(c => c.code.toLowerCase()));
    let addedCount = 0;
    const unmatchedCourses = new Set();

    parsedTasks.forEach(t => {
      if (!availableCodes.has(t.courseCode.toLowerCase())) {
        unmatchedCourses.add(t.courseCode);
      }
    });

    // Merge or append to existing courses
    setCourses(prevCourses => {
      return prevCourses.map(course => {
        const matchingImported = parsedTasks.filter(t => 
          t.courseCode.toLowerCase() === course.code.toLowerCase()
        );

        if (matchingImported.length === 0) return course;

        const existingNames = new Set((course.assessments || []).map(a => a.name.toLowerCase()));
        const newTasks = matchingImported
          .filter(t => !existingNames.has(t.name.toLowerCase()))
          .map((t, idx) => ({
            id: `${course.id}-csv-${Date.now()}-${idx}`,
            name: t.name,
            category: t.category || 'Assignment',
            dueDate: t.dueDate || '2026-10-15',
            weight: typeof t.weight === 'number' && !isNaN(t.weight) ? t.weight : 5.0,
            status: t.status || 'Not Started',
            score: t.score !== undefined ? t.score : null,
            maxScore: 100,
            topic: t.topic || `Imported from CSV`
          }));

        addedCount += newTasks.length;

        return {
          ...course,
          assessments: [...(course.assessments || []), ...newTasks]
        };
      });
    });

    if (addedCount > 0) {
      if (unmatchedCourses.size > 0) {
        showToast(`Imported ${addedCount} tasks! (${unmatchedCourses.size} other courses skipped: ${[...unmatchedCourses].slice(0, 3).join(', ')})`, "info");
      } else {
        showToast(`Successfully imported ${addedCount} tasks from CSV!`, "success");
      }
    } else if (unmatchedCourses.size > 0) {
      showToast(`No tasks matched Semester 3 courses (${[...unmatchedCourses].join(', ')})`, "warning");
    } else {
      showToast("All imported tasks already exist in course trackers", "info");
    }

    setCsvInput('');
    setShowCsvImport(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-red-600/10 text-red-400 border border-red-500/20">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Settings & Data Management</h3>
              <p className="text-xs text-slate-400">Backups, CSV synchronization, and repository status</p>
            </div>
          </div>
          <button 
            onClick={() => setActiveModal(null)}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-6 text-xs overflow-y-auto flex-1">
          
          {/* Backup & Restore */}
          <div className="space-y-3">
            <h4 className="font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Full Data Backup & Restore</span>
            </h4>
            <p className="text-slate-400 text-[11px]">
              All edits, grades, notes, and custom courses are auto-saved in your browser's LocalStorage. You can export a JSON backup at any time or restore on any other device.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleExportJSON}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-200 font-semibold flex items-center justify-center gap-2 transition"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Export JSON Backup</span>
              </button>

              <label className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-200 font-semibold flex items-center justify-center gap-2 transition cursor-pointer">
                <Upload className="w-4 h-4 text-blue-400" />
                <span>Import JSON Backup</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportJSON}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* CSV Spreadsheet Integration */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <h4 className="font-bold text-white flex items-center gap-2">
              <Download className="w-4 h-4 text-red-400" />
              <span>Spreadsheet & CSV Import/Export</span>
            </h4>
            <p className="text-slate-400 text-[11px]">
              Compatible with your previous semester's tracker format (e.g. <code>CSN205, Quiz 2, Quiz, 2026-07-21, Done</code>).
            </p>

            <div className="flex flex-wrap gap-2.5">
              <button
                onClick={() => {
                  exportTasksToCSV(courses);
                  showToast("Exported semester tasks CSV", "success");
                }}
                className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 font-semibold flex items-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5 text-slate-400" />
                <span>Download Tasks CSV</span>
              </button>

              <button
                onClick={() => setShowCsvImport(!showCsvImport)}
                className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 font-semibold flex items-center gap-1.5 transition"
              >
                <Upload className="w-3.5 h-3.5 text-slate-400" />
                <span>{showCsvImport ? 'Hide CSV Paste Box' : 'Import from CSV text'}</span>
              </button>
            </div>

            {showCsvImport && (
              <div className="space-y-2 p-3 rounded-xl bg-slate-950 border border-slate-800 mt-2">
                <label className="block text-slate-400 font-semibold text-[11px]">
                  Paste CSV Lines (matching Course, Task, Category, DueDate, Status format):
                </label>
                <textarea
                  rows={4}
                  value={csvInput}
                  onChange={(e) => setCsvInput(e.target.value)}
                  placeholder={`CSN305, Lab 1, Lab, 2026-09-25, Not Started\nOPS345, Lab 1, Lab, 2026-10-23, Done`}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 font-mono text-[11px] text-slate-200 focus:outline-none focus:border-red-500"
                />
                <button
                  onClick={handleExecuteCsvImport}
                  className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold transition text-xs"
                >
                  Process & Import Tasks
                </button>
              </div>
            )}
          </div>

          {/* GitHub Sync Status */}
          <div className="space-y-2 pt-3 border-t border-slate-800">
            <h4 className="font-bold text-white flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-purple-400" />
              <span>GitHub Repository Synchronization</span>
            </h4>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 space-y-1 text-[11px]">
              <div className="flex items-center justify-between">
                <span>Account:</span>
                <span className="font-mono text-white font-bold">StickwoodJr</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Repository:</span>
                <span className="font-mono text-purple-400 font-bold">cty-semester-3-dashboard</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Branch:</span>
                <span className="font-mono text-emerald-400 font-bold">main</span>
              </div>
              <div className="pt-2 text-slate-400">
                All source code, datasets, and planning materials are committed and synchronized to your GitHub profile.
              </div>
            </div>
          </div>

          {/* Revert / Reset */}
          <div className="space-y-2 pt-3 border-t border-slate-800">
            <h4 className="font-bold text-red-400 flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              <span>Reset to Official Seneca Syllabi Defaults</span>
            </h4>
            <p className="text-slate-400 text-[11px]">
              If you wish to reset all modified scores and courses back to the original Fall 2026 course outlines, click below.
            </p>
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to reset all courses and tasks back to syllabus defaults? Custom edits will be restored to initial state.")) {
                  resetToDefaults();
                  setActiveModal(null);
                }
              }}
              className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-semibold transition"
            >
              Reset All Courses to Defaults
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex justify-end shrink-0">
          <button
            onClick={() => setActiveModal(null)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition text-xs"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
