import React from 'react';
import { useAcademic } from '../context/AcademicContext';
import { 
  LayoutDashboard, Calendar, CheckSquare, Clock, 
  BarChart3, Briefcase, BookOpen, Plus, Cloud, ChevronRight, 
  AlertTriangle, Timer, Terminal, Download, Printer
} from 'lucide-react';

export default function Sidebar() {
  const { 
    courses, 
    currentView, 
    setCurrentView, 
    selectedCourseId, 
    setSelectedCourseId,
    setActiveModal,
    setModalPayload,
    getCourseMetrics
  } = useAcademic();

  const mainNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'tasks', label: 'Upcoming & Tasks', icon: CheckSquare },
    { id: 'schedule', label: 'Weekly Timetable', icon: Clock },
    { id: 'timer', label: 'Focus & Study Timer', icon: Timer, badge: '4.0 Target' },
    { id: 'toolbelt', label: 'CTY Lab Toolbelt', icon: Terminal, badge: 'Snippets' },
    { id: 'marks', label: 'Marks & GPA', icon: BarChart3 },
    { id: 'wtp', label: 'WTP100 Career Hub', icon: Briefcase, badge: 'Oct 23' }
  ];

  // Calculate quick cloud status
  const opsCourse = courses.find(c => c.id === 'ops345');
  const opsSpend = opsCourse?.budgetTracker?.currentSpend || 0;
  const opsLimit = opsCourse?.budgetTracker?.creditLimit || 50;

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800/80 flex flex-col shrink-0 h-[calc(100vh-61px)] sticky top-[61px] select-none overflow-y-auto">
      {/* Primary Navigation */}
      <div className="p-3 space-y-1">
        <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Navigation
        </div>
        {mainNavItems.map(item => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive 
                  ? 'bg-red-600/15 text-red-400 border border-red-500/20 font-semibold' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-red-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Courses List */}
      <div className="p-3 pt-2 space-y-1 flex-1">
        <div className="flex items-center justify-between px-3 py-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Courses ({courses.length})
          </span>
          <button
            onClick={() => {
              setActiveModal('edit-course');
              setModalPayload({ isNew: true });
            }}
            title="Add Course"
            className="text-slate-400 hover:text-red-400 transition"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-0.5">
          {courses.map(course => {
            const isSelected = currentView === 'course-detail' && selectedCourseId === course.id;
            const metrics = getCourseMetrics(course);
            return (
              <button
                key={course.id}
                onClick={() => {
                  setSelectedCourseId(course.id);
                  setCurrentView('course-detail');
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex items-center justify-between group ${
                  isSelected 
                    ? 'bg-slate-800 text-white font-semibold border border-slate-700' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span 
                    className="w-2 h-2 rounded-full shrink-0" 
                    style={{ backgroundColor: course.color || '#3b82f6' }}
                  />
                  <span className="font-mono font-bold text-slate-200 group-hover:text-white">
                    {course.code}
                  </span>
                  <span className="text-[11px] text-slate-400 truncate max-w-[90px]">
                    {course.name.split(' ')[0]}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {metrics.currentAverage !== null ? (
                    <span className="text-[10px] font-semibold text-emerald-400">
                      {Math.round(metrics.currentAverage)}%
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-mono">
                      {course.assessments?.length || 0} tasks
                    </span>
                  )}
                  <ChevronRight className={`w-3 h-3 text-slate-400 transition-transform ${isSelected ? 'translate-x-0.5 text-slate-300' : 'opacity-0 group-hover:opacity-100'}`} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Calendar Sync Quick Action */}
      <div className="px-3 pt-2 pb-1">
        <button
          onClick={() => setActiveModal('sync-export')}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-semibold transition group shadow-sm"
        >
          <div className="flex items-center gap-2">
            <Download className="w-3.5 h-3.5 text-red-400 group-hover:scale-110 transition-transform" />
            <span>Sync Phone (.ics)</span>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 font-bold">
            iCal
          </span>
        </button>

        <button
          onClick={() => setCurrentView('print')}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-semibold transition group shadow-sm mt-1.5"
        >
          <div className="flex items-center gap-2">
            <Printer className="w-3.5 h-3.5 text-blue-400 group-hover:scale-110 transition-transform" />
            <span>Printable One-Pager</span>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold">
            PDF
          </span>
        </button>
      </div>

      {/* Cloud Sandbox Watcher Widget */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
        <div className="bg-slate-900/90 rounded-xl p-2.5 border border-slate-800/80">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300 mb-1.5">
            <div className="flex items-center gap-1.5 text-amber-400">
              <Cloud className="w-3.5 h-3.5" />
              <span>AWS Learner Lab</span>
            </div>
            <span className="font-mono text-[10px] text-slate-400">${opsSpend} / ${opsLimit}</span>
          </div>

          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-1.5">
            <div 
              className={`h-full rounded-full transition-all ${
                (opsSpend / opsLimit) > 0.8 ? 'bg-red-500' : (opsSpend / opsLimit) > 0.5 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, Math.round((opsSpend / opsLimit) * 100))}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[9px] text-slate-400">
            <span>OPS345 Hard Limit</span>
            <span className="text-emerald-400 font-medium">${(opsLimit - opsSpend).toFixed(2)} left</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
