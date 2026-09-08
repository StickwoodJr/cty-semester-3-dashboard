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

        {/* Center: Quick Search Bar with Command Palette trigger */}
        <div className="relative hidden md:block flex-1 max-w-md">
          <div 
            onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
            className="relative cursor-pointer group"
            title="Open Command Palette (Ctrl+K / ⌘K)"
          >
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500 group-hover:text-slate-300 transition" />
            <div className="w-full bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-400 flex items-center justify-between transition">
              <span className="truncate">Search tasks, courses, commands...</span>
              <div className="flex items-center gap-1 font-mono text-[10px] text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 shrink-0">
                <span>⌘K</span>
              </div>
            </div>
          </div>
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

          {/* Calendar Sync iCal Button */}
          <button 
            onClick={() => setActiveModal('sync-export')}
            title="Export Calendar to iPhone / Google (.ics)"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-800 transition shadow-sm"
          >
            <Calendar className="w-3.5 h-3.5 text-red-400" />
            <span className="hidden md:inline">Sync iCal</span>
          </button>

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
