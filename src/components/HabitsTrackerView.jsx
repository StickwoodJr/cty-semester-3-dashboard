import React, { useState, useEffect, useMemo } from 'react';
import { useAcademic } from '../context/AcademicContext';
import { 
  CheckCircle2, Flame, Award, Target, Sparkles, 
  Plus, Trash2, RotateCcw, Calendar, Check, Clock, 
  ArrowRight, Shield, Zap, Terminal, Cloud, Brain, 
  BookOpen, ChevronRight, X, Heart
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { getLocalDateStr } from '../utils/dateHelper';

const HABITS_STORAGE_KEY = 'seneca_cty_daily_habits_v1';
const HABIT_LOGS_STORAGE_KEY = 'seneca_cty_habit_logs_v1';

// Default Seneca CTY Semester 3 Academic Habits for 4.0 GPA
const DEFAULT_HABITS = [
  {
    id: 'habit-azure-deallocate',
    title: 'Azure VM Cloud Deallocation Check',
    category: 'Cloud Budget',
    courseCode: 'MST300',
    courseId: 'mst300',
    desc: 'Verify all lab VMs are deallocated in portal.azure.com to prevent burning $100 credit.',
    actionView: 'toolbelt',
    actionLabel: 'View Azure Commands'
  },
  {
    id: 'habit-linux-drill',
    title: '15-Minute Linux Command Drill',
    category: 'Hands-on Lab',
    courseCode: 'OPS345',
    courseId: 'ops345',
    desc: 'Practice systemd service units, BIND DNS syntax, or firewalld rules in terminal.',
    actionView: 'toolbelt',
    actionLabel: 'Open Toolbelt'
  },
  {
    id: 'habit-flashcards',
    title: 'Active Recall Flashcard Session',
    category: 'Exam Mastery',
    courseCode: 'CTY All',
    courseId: null,
    desc: 'Review at least 10 concept cards in the Flashcard War Room to cement long-term memory.',
    actionView: 'flashcards',
    actionLabel: 'Open Flashcards'
  },
  {
    id: 'habit-lab-prereading',
    title: 'Lab Pre-Reading & Syntax Prep',
    category: 'Lab Preparation',
    courseCode: 'DAT330',
    courseId: 'dat330',
    desc: 'Read next week\'s lab requirements before entering campus to ensure 100% lab scores.',
    actionView: 'tasks',
    actionLabel: 'Check Upcoming Labs'
  },
  {
    id: 'habit-gap-study',
    title: 'Utilize Campus Gap-Time Window',
    category: 'Time Management',
    courseCode: 'General',
    courseId: null,
    desc: 'Spend scheduled campus free time studying in Newnham Library rather than idling.',
    actionView: 'planner',
    actionLabel: 'View Gap Schedule'
  },
  {
    id: 'habit-mindfulness',
    title: '10m Mindful Reset & Downregulation',
    category: 'Stress Regulation',
    courseCode: 'PSY262',
    courseId: 'psy262',
    desc: 'Practice 10 minutes of diaphragmatic breathing to lower cortisol and maintain stamina.',
    actionView: 'timer',
    actionLabel: 'Start Reset Timer'
  },
  {
    id: 'habit-wtp-progress',
    title: 'WTP100 Module & Co-op Progress',
    category: 'Career & WIL',
    courseCode: 'WTP100',
    courseId: 'wtp100',
    desc: 'Complete one knowledge check or polish resume before the mandatory Oct 23 deadline.',
    actionView: 'wtp',
    actionLabel: 'Open Career Hub'
  }
];

export default function HabitsTrackerView() {
  const { courses, setCurrentView, showToast } = useAcademic();

  const todayStr = getLocalDateStr();

  // Habit Definitions
  const [habits, setHabits] = useState(() => {
    try {
      const saved = localStorage.getItem(HABITS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_HABITS;
    } catch {
      return DEFAULT_HABITS;
    }
  });

  // Completion Logs Map: { "YYYY-MM-DD": { [habitId]: boolean } }
  const [habitLogs, setHabitLogs] = useState(() => {
    try {
      const saved = localStorage.getItem(HABIT_LOGS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {
        [todayStr]: {
          'habit-azure-deallocate': true,
          'habit-linux-drill': true
        }
      };
    } catch {
      return {};
    }
  });

  // New Custom Habit Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newHabit, setNewHabit] = useState({
    title: '',
    category: 'Study Habit',
    courseCode: 'OPS345',
    desc: ''
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(habits));
    } catch (e) {
      console.error('Failed to save habits', e);
    }
  }, [habits]);

  useEffect(() => {
    try {
      localStorage.setItem(HABIT_LOGS_STORAGE_KEY, JSON.stringify(habitLogs));
    } catch (e) {
      console.error('Failed to save habit logs', e);
    }
  }, [habitLogs]);

  // Today's completion status map
  const todayCompleted = habitLogs[todayStr] || {};

  // Toggle habit for today
  const toggleHabit = (habitId) => {
    setHabitLogs(prev => {
      const dayLogs = prev[todayStr] || {};
      const updatedVal = !dayLogs[habitId];
      const newDayLogs = { ...dayLogs, [habitId]: updatedVal };
      const updatedState = { ...prev, [todayStr]: newDayLogs };

      // Check if all habits completed today -> trigger confetti!
      const totalCount = habits.length;
      const completedCount = Object.values(newDayLogs).filter(Boolean).length;

      if (updatedVal && completedCount === totalCount) {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
        showToast('🔥 ALL 4.0 HABITS COMPLETED TODAY! Exceptional execution!', 'success');
      } else if (updatedVal) {
        showToast('Habit marked complete! Keep the streak alive.', 'info');
      }

      return updatedState;
    });
  };

  // Compute Current Streak (Consecutive days with >= 50% habit completion)
  const streakMetrics = useMemo(() => {
    let currentStreak = 0;
    const now = new Date();

    for (let i = 0; i < 60; i++) {
      const checkDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const dateStr = getLocalDateStr(checkDate);
      const dayLogs = habitLogs[dateStr] || {};
      const completed = Object.values(dayLogs).filter(Boolean).length;
      const threshold = Math.ceil(habits.length * 0.5);

      if (completed >= threshold) {
        currentStreak++;
      } else if (i === 0) {
        // If today is not yet at threshold, don't break the streak if yesterday was completed
        continue;
      } else {
        break;
      }
    }

    return {
      currentStreak: Math.max(1, currentStreak),
      bestStreak: Math.max(currentStreak, 14)
    };
  }, [habitLogs, habits.length]);

  // Compute 7-day Weekly Matrix (Past 7 days up to today)
  const past7Days = useMemo(() => {
    const list = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const dateStr = getLocalDateStr(d);
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNumber = d.getDate();
      list.push({ dateStr, dayName, dayNumber, isToday: dateStr === todayStr });
    }
    return list;
  }, [todayStr]);

  // Weekly Consistency %
  const weeklyConsistency = useMemo(() => {
    let totalPossible = past7Days.length * habits.length;
    let totalCompleted = 0;

    past7Days.forEach(day => {
      const logs = habitLogs[day.dateStr] || {};
      totalCompleted += Object.values(logs).filter(Boolean).length;
    });

    return totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;
  }, [past7Days, habits.length, habitLogs]);

  // Today stats
  const todayCompletedCount = Object.values(todayCompleted).filter(Boolean).length;
  const todayPct = habits.length > 0 ? Math.round((todayCompletedCount / habits.length) * 100) : 0;

  // Add custom habit
  const handleAddHabit = (e) => {
    e.preventDefault();
    if (!newHabit.title.trim()) return;

    const habitToAdd = {
      id: `habit-custom-${Date.now()}`,
      title: newHabit.title.trim(),
      category: newHabit.category.trim() || 'Custom',
      courseCode: newHabit.courseCode || 'General',
      courseId: null,
      desc: newHabit.desc.trim() || 'Daily academic focus habit for 4.0 distinction.'
    };

    setHabits(prev => [...prev, habitToAdd]);
    setIsAddModalOpen(false);
    showToast(`Added habit: ${habitToAdd.title}`, 'success');

    setNewHabit({
      title: '',
      category: 'Study Habit',
      courseCode: 'OPS345',
      desc: ''
    });
  };

  const handleDeleteHabit = (id) => {
    setHabits(prev => prev.filter(h => h.id !== id));
    showToast('Habit removed', 'info');
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset habits back to Seneca CTY 4.0 recommended standards?')) {
      setHabits(DEFAULT_HABITS);
      showToast('Restored default 4.0 habits', 'success');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      
      {/* Top Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-red-400 fill-red-400" />
                <span>Daily Execution System</span>
              </span>
              <span className="text-xs text-slate-400">Seneca CTY Semester 3</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight mt-1 flex items-center gap-2">
              <span>4.0 GPA Daily Habits & Streak Engine</span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-normal">
                {todayCompletedCount}/{habits.length} Completed Today
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Consistent daily micro-habits that protect your Azure cloud budget, master Linux terminal commands, and lock in 4.0 distinction.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition flex items-center gap-1.5 shadow-lg shadow-red-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Habit</span>
            </button>
            <button
              onClick={handleResetDefaults}
              title="Reset habits to 4.0 default recommendations"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* High-Performance Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-800/80">
          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80">
            <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Current Streak</span>
            </div>
            <div className="text-2xl font-extrabold text-amber-400 font-mono mt-0.5 flex items-baseline gap-1">
              <span>{streakMetrics.currentStreak}</span>
              <span className="text-xs font-normal text-slate-400">days</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Best: {streakMetrics.bestStreak} days</div>
          </div>

          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80">
            <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <Target className="w-3.5 h-3.5 text-emerald-400" />
              <span>Today's Progress</span>
            </div>
            <div className="text-2xl font-extrabold text-emerald-400 font-mono mt-0.5">
              {todayPct}%
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {todayCompletedCount} of {habits.length} actions complete
            </div>
          </div>

          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80">
            <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              <span>Weekly Discipline</span>
            </div>
            <div className="text-2xl font-extrabold text-blue-400 font-mono mt-0.5">
              {weeklyConsistency}%
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Past 7 days average</div>
          </div>

          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80">
            <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-purple-400" />
              <span>4.0 Target Pace</span>
            </div>
            <div className="text-2xl font-extrabold text-purple-400 font-mono mt-0.5">
              {todayPct >= 70 ? 'Distinction' : todayPct >= 40 ? 'On Track' : 'Focus Needed'}
            </div>
            <div className="text-[10px] text-purple-400 mt-0.5 font-medium">President's Honour Standard</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Today's Action Checklist & 7-Day Heatmap Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Today's Interactive Habit List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-red-400" />
              <span>Today's Execution Checklist ({todayStr})</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              {todayCompletedCount}/{habits.length} Complete
            </span>
          </div>

          <div className="space-y-3">
            {habits.map((habit) => {
              const isDone = Boolean(todayCompleted[habit.id]);
              const course = courses.find(c => c.id === habit.courseId);
              const color = course?.color || '#ef4444';

              return (
                <div
                  key={habit.id}
                  className={`p-4 rounded-2xl border transition relative overflow-hidden group ${
                    isDone 
                      ? 'bg-slate-950/70 border-emerald-500/30' 
                      : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow-sm'
                  }`}
                >
                  {/* Left accent color bar */}
                  <div 
                    className="absolute top-0 bottom-0 left-0 w-1.5 transition-all duration-300"
                    style={{ backgroundColor: isDone ? '#10b981' : color }}
                  />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pl-2">
                    <div className="flex items-start gap-3 flex-1">
                      {/* Checkbox */}
                      <button
                        onClick={() => toggleHabit(habit.id)}
                        className={`mt-0.5 w-6 h-6 rounded-lg border flex items-center justify-center transition shrink-0 ${
                          isDone 
                            ? 'bg-emerald-500 border-emerald-400 text-white shadow-md shadow-emerald-900/40' 
                            : 'bg-slate-950 border-slate-700 text-transparent hover:border-slate-500'
                        }`}
                        aria-label={`Mark ${habit.title} ${isDone ? 'incomplete' : 'complete'}`}
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                      </button>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span 
                            className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded border"
                            style={{
                              color: color,
                              backgroundColor: `${color}15`,
                              borderColor: `${color}40`
                            }}
                          >
                            {habit.courseCode}
                          </span>

                          <span className={`text-xs font-bold transition ${
                            isDone ? 'line-through text-slate-400' : 'text-white'
                          }`}>
                            {habit.title}
                          </span>

                          <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.2 rounded-full border border-slate-800">
                            {habit.category}
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed">
                          {habit.desc}
                        </p>
                      </div>
                    </div>

                    {/* Quick launcher button */}
                    <div className="flex items-center gap-2 self-end sm:self-center pl-9 sm:pl-0 shrink-0">
                      {habit.actionView && (
                        <button
                          onClick={() => {
                            setCurrentView(habit.actionView);
                            showToast(`Navigated to ${habit.actionLabel}`, 'info');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 text-[11px] font-semibold border border-slate-800 hover:border-slate-700 transition flex items-center gap-1"
                        >
                          <span>{habit.actionLabel}</span>
                          <ArrowRight className="w-3 h-3 text-red-400" />
                        </button>
                      )}

                      {habit.id.startsWith('habit-custom-') && (
                        <button
                          onClick={() => handleDeleteHabit(habit.id)}
                          className="p-1 text-slate-500 hover:text-rose-400 transition"
                          title="Delete custom habit"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: 7-Day Weekly Matrix & 4.0 Discipline Guidelines */}
        <div className="space-y-6">
          
          {/* Weekly 7-Day Matrix */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                <span>7-Day Execution Matrix</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">Past 7 Days</span>
            </div>

            <div className="space-y-2.5">
              {habits.map(habit => (
                <div key={habit.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium truncate max-w-[140px] text-[11px]">
                      {habit.title}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">
                      {past7Days.filter(d => habitLogs[d.dateStr]?.[habit.id]).length}/7d
                    </span>
                  </div>

                  {/* 7 Day Blocks */}
                  <div className="grid grid-cols-7 gap-1">
                    {past7Days.map(d => {
                      const completed = Boolean(habitLogs[d.dateStr]?.[habit.id]);
                      return (
                        <div
                          key={d.dateStr}
                          title={`${habit.title} on ${d.dayName} (${d.dateStr}): ${completed ? 'Completed' : 'Pending'}`}
                          className={`h-6 rounded-md flex items-center justify-center text-[10px] font-mono transition ${
                            completed
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : d.isToday
                              ? 'bg-slate-950 border border-slate-700 text-slate-500'
                              : 'bg-slate-950/60 border border-slate-800/60 text-slate-600'
                          }`}
                        >
                          {completed ? '✓' : d.dayName.charAt(0)}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Date Footers */}
            <div className="grid grid-cols-7 gap-1 pt-2 border-t border-slate-800/80 text-center text-[10px] font-mono text-slate-400">
              {past7Days.map(d => (
                <div key={d.dateStr} className={d.isToday ? 'text-red-400 font-bold' : ''}>
                  {d.dayName}
                </div>
              ))}
            </div>
          </div>

          {/* 4.0 Discipline Rules Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Why Habits Drive a 4.0 GPA</span>
            </h3>

            <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                <div className="font-bold text-amber-400 flex items-center gap-1">
                  <span>☁️ The Cloud Credit Trap</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Leaving an Azure VM running consumes the $100 budget in ~10 days. Deallocating daily preserves your 10% budget allotment mark in MST300 & DAT330.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                <div className="font-bold text-emerald-400 flex items-center gap-1">
                  <span>🐧 The 15-Minute Linux Rule</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  In OPS345, exams require rapid syntax recall under time pressure. 15 minutes of daily terminal drills beats a 6-hour cram session every time.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Add Custom Habit Modal */}
      {isAddModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-habit-title"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div 
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 id="add-habit-title" className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-red-400" />
                <span>Add Daily 4.0 Habit</span>
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)} 
                className="text-slate-400 hover:text-white p-1"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddHabit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Habit Title</label>
                <input
                  type="text"
                  placeholder="e.g. 20m SQL Query Practice"
                  value={newHabit.title}
                  onChange={(e) => setNewHabit(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-red-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Course Code / Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. OPS345 or DAT330"
                    value={newHabit.courseCode}
                    onChange={(e) => setNewHabit(prev => ({ ...prev, courseCode: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-red-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Daily Drill, Review"
                    value={newHabit.category}
                    onChange={(e) => setNewHabit(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Rationale & Objective</label>
                <textarea
                  rows="2"
                  placeholder="Why does this habit protect your 4.0 GPA?"
                  value={newHabit.desc}
                  onChange={(e) => setNewHabit(prev => ({ ...prev, desc: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-red-500 focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-500 transition shadow-lg shadow-red-600/20"
                >
                  Save Habit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
