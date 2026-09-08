import React, { useState, useEffect, useRef } from 'react';
import { useAcademic } from '../context/AcademicContext';
import { 
  Search, LayoutDashboard, Calendar, CheckSquare, Clock, 
  BarChart3, Briefcase, Timer, Terminal, Plus, Download, 
  ArrowRight, BookOpen, Sparkles, X, FileText
} from 'lucide-react';

export default function CommandPaletteModal() {
  const { 
    courses, 
    setCurrentView, 
    setSelectedCourseId, 
    setActiveModal, 
    setModalPayload,
    getAllAssessments 
  } = useAcademic();

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  // Global keydown listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const allTasks = getAllAssessments();

  // Navigation Items
  const navItems = [
    { id: 'dashboard', title: 'Dashboard & Command Center', category: 'Navigation', icon: LayoutDashboard, action: () => setCurrentView('dashboard') },
    { id: 'schedule', title: 'Weekly Timetable (Scaled Grid & Breaks)', category: 'Navigation', icon: Clock, action: () => setCurrentView('schedule') },
    { id: 'timer', title: 'Focus & Study Session Timer', category: 'Navigation', icon: Timer, action: () => setCurrentView('timer') },
    { id: 'toolbelt', title: 'CTY Lab Technical Toolbelt & Cheatsheet', category: 'Navigation', icon: Terminal, action: () => setCurrentView('toolbelt') },
    { id: 'calendar', title: 'Academic Calendar (Month Grid & Agenda)', category: 'Navigation', icon: Calendar, action: () => setCurrentView('calendar') },
    { id: 'tasks', title: 'Assessments & Tasks (Kanban & Table)', category: 'Navigation', icon: CheckSquare, action: () => setCurrentView('tasks') },
    { id: 'marks', title: 'Marks & Seneca 4.0 GPA Command Center', category: 'Navigation', icon: BarChart3, action: () => setCurrentView('marks') },
    { id: 'wtp', title: 'WTP100 Career Hub (14 Modules)', category: 'Navigation', icon: Briefcase, action: () => setCurrentView('wtp') },
  ];

  // Actions Items
  const actionItems = [
    { id: 'sync-cal', title: 'Sync Calendar to Phone (.ics Export)', category: 'Quick Actions', icon: Download, action: () => setActiveModal('sync-export') },
    { id: 'add-task', title: 'Add New Course Assessment', category: 'Quick Actions', icon: Plus, action: () => { setActiveModal('add-task'); setModalPayload({ courseId: courses[0]?.id }); } },
    { id: 'start-pomodoro', title: 'Start 25m Focus Sprint', category: 'Quick Actions', icon: Timer, action: () => setCurrentView('timer') }
  ];

  // Course Items
  const courseItems = courses.map(c => ({
    id: `course-${c.id}`,
    title: `${c.code}: ${c.name} (${c.professor})`,
    category: 'Courses',
    color: c.color,
    icon: BookOpen,
    action: () => {
      setSelectedCourseId(c.id);
      setCurrentView('course-detail');
    }
  }));

  // Assessment Items matching query
  const matchingTasks = query.trim() === '' ? [] : allTasks.filter(t => 
    t.name.toLowerCase().includes(query.toLowerCase()) ||
    t.courseCode.toLowerCase().includes(query.toLowerCase()) ||
    (t.topic && t.topic.toLowerCase().includes(query.toLowerCase()))
  ).slice(0, 5).map(t => ({
    id: `task-${t.id}`,
    title: `[${t.courseCode}] ${t.name} (${t.weight}% wt - Due ${t.dueDate})`,
    category: 'Assessments',
    icon: CheckSquare,
    action: () => {
      setActiveModal('edit-task');
      setModalPayload({ courseId: t.courseId, assessment: t });
    }
  }));

  // Combine and filter
  const allItems = [...navItems, ...actionItems, ...courseItems, ...matchingTasks];
  const filteredItems = query.trim() === ''
    ? [...actionItems, ...navItems, ...courseItems]
    : allItems.filter(item => item.title.toLowerCase().includes(query.toLowerCase()));

  const handleSelect = (item) => {
    item.action();
    setIsOpen(false);
  };

  const handleKeyDownInList = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex]);
      }
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false); }}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette navigation and search"
    >
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Search Bar Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 gap-3 bg-slate-900/90">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDownInList}
            placeholder="Type a command or search courses, tasks, rooms... (↑↓ to navigate)"
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
            ESC
          </span>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-slate-400 hover:text-white p-1"
            aria-label="Close command palette"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-2 overflow-y-auto max-h-96 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No actions or courses found for "{query}"
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl transition flex items-center justify-between text-xs group ${
                    isSelected 
                      ? 'bg-red-600 text-white font-semibold shadow' 
                      : 'text-slate-300 hover:bg-slate-800/70'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-1.5 rounded-lg ${
                      isSelected 
                        ? 'bg-white/20 text-white' 
                        : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="truncate font-medium">{item.title}</div>
                      <div className={`text-[10px] ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
                        {item.category}
                      </div>
                    </div>
                  </div>

                  <ArrowRight className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                    isSelected ? 'translate-x-1 opacity-100 text-white' : 'opacity-0'
                  }`} />
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-800 bg-slate-950/60 text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px]">↑↓</kbd> Navigate</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px]">↵</kbd> Select</span>
          </div>
          <span>Shortcut: <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px]">Ctrl+K</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px]">⌘K</kbd></span>
        </div>

      </div>
    </div>
  );
}
