import React, { useState } from 'react';
import { useAcademic } from '../context/AcademicContext';
import { 
  GraduationCap, Calendar, Plus, Download, Upload, 
  Settings, Bell, Search, Clock, Sparkles, BookOpen, AlertCircle
} from 'lucide-react';
import { exportTasksToCSV } from '../utils/csvHelper';

export default function Navbar() {
  const { 
    courses, 
    setCurrentView, 
    currentView, 
    setActiveModal, 
    setModalPayload, 
    getSemesterMetrics,
    showToast,
    semesterConfig
  } = useAcademic();

  const metrics = getSemesterMetrics();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Search results
  const searchResults = searchTerm.trim() === '' ? [] : courses.flatMap(c => 
    (c.assessments || []).filter(a => 
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.topic && a.topic.toLowerCase().includes(searchTerm.toLowerCase()))
    ).map(a => ({ ...a, courseCode: c.code, courseId: c.id }))
  );

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        
        {/* Left: Brand & Term Info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 text-white shadow-lg shadow-red-900/30 font-bold text-lg">
            <span>S</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                Seneca CTY
                <span className="text-xs px-2 py-0.5 rounded-md bg-red-500/10 text-red-400 font-semibold border border-red-500/20">
                  Semester 3
                </span>
              </h1>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-500" />
                {semesterConfig.termName} (Fall 2026)
              </span>
              <span>•</span>
              <span className="text-emerald-400 font-medium">Week 1 / 14</span>
              <span>•</span>
              <span className="text-slate-400">Newnham Campus</span>
            </div>
          </div>
        </div>

        {/* Center: Quick Search Bar */}
        <div className="relative hidden md:block flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search tasks, labs, tests, quizzes, courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-red-500/60 focus:ring-1 focus:ring-red-500/30 transition-colors"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-2 text-slate-500 hover:text-slate-300 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Search Dropdown Results */}
          {searchTerm && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden z-50 max-h-80 overflow-y-auto">
              <div className="p-2 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Matching Assessments ({searchResults.length})
              </div>
              {searchResults.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500">No assessments found matching "{searchTerm}"</div>
              ) : (
                searchResults.slice(0, 8).map(res => (
                  <button 
                    key={res.id}
                    onClick={() => {
                      setActiveModal('edit-task');
                      setModalPayload({ courseId: res.courseId, assessment: res });
                      setSearchTerm('');
                    }}
                    className="w-full text-left p-2.5 hover:bg-slate-800/80 transition flex items-center justify-between border-b border-slate-800/40 last:border-0"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-red-400">{res.courseCode}</span>
                        <span className="text-xs text-white font-medium">{res.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {res.category}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-xs">{res.topic}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-semibold text-slate-200">{res.weight}%</div>
                      <div className="text-[10px] text-slate-400">Due {res.dueDate}</div>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Right: Quick Stats, Add Task & Actions */}
        <div className="flex items-center gap-2.5">
          {/* GPA Pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-950/60 border border-slate-800 rounded-lg text-xs">
            <span className="text-slate-400">Projected GPA:</span>
            <span className="font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
              {metrics.currentGpa}
            </span>
          </div>

          {/* Add Task Button */}
          <button 
            onClick={() => {
              setActiveModal('add-task');
              setModalPayload({ courseId: courses[0]?.id });
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-md shadow-red-900/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Task</span>
          </button>

          {/* Export CSV Button */}
          <button 
            onClick={() => {
              exportTasksToCSV(courses);
              showToast("Exported semester task tracker to CSV", "success");
            }}
            title="Export CSV (compatible with spreadsheet tracker)"
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 rounded-lg transition-colors border border-slate-800"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Settings / Sync */}
          <button 
            onClick={() => setActiveModal('settings')}
            title="Settings & Data Sync"
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 rounded-lg transition-colors border border-slate-800"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
