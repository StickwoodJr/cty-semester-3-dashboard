import React, { useState } from 'react';
import { useAcademic } from '../context/AcademicContext';
import { 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, 
  Filter, CheckCircle2, Plus, Clock, Info, Layers
} from 'lucide-react';

export default function CalendarView() {
  const { 
    courses, 
    getAllAssessments, 
    setActiveModal, 
    setModalPayload,
    semesterConfig,
    updateAssessment
  } = useAcademic();

  const allTasks = getAllAssessments();

  // Calendar view date state (Default to Fall 2026 start: September 2026)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(8); // 8 = September (0-indexed)
  
  // Filters
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('ALL');
  const [hideDone, setHideDone] = useState(false); // Matches user's previous semester CSV filter!
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'agenda'

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Helper to get calendar days for the current month
  const getCalendarDays = () => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

    const days = [];

    // Previous month padding days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = prevMonthDays - i;
      const m = currentMonth === 0 ? 12 : currentMonth;
      const y = currentMonth === 0 ? currentYear - 1 : currentYear;
      const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      days.push({ dayNumber: dayNum, dateStr, isCurrentMonth: false });
    }

    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({ dayNumber: i, dateStr, isCurrentMonth: true });
    }

    // Next month padding days to complete grid (multiples of 7)
    const remaining = 7 - (days.length % 7);
    if (remaining < 7) {
      for (let i = 1; i <= remaining; i++) {
        const m = currentMonth === 11 ? 1 : currentMonth + 2;
        const y = currentMonth === 11 ? currentYear + 1 : currentYear;
        const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        days.push({ dayNumber: i, dateStr, isCurrentMonth: false });
      }
    }

    return days;
  };

  const calendarDays = getCalendarDays();

  // Filter tasks based on criteria
  const filterTask = (task) => {
    if (selectedCourseFilter !== 'ALL' && task.courseId !== selectedCourseFilter) return false;
    if (hideDone && task.status === 'Graded') return false;
    if (selectedCategory !== 'ALL' && task.category !== selectedCategory) return false;
    return true;
  };

  const filteredTasks = allTasks.filter(filterTask);

  // Group tasks by date string (YYYY-MM-DD)
  const tasksByDate = {};
  filteredTasks.forEach(task => {
    if (!tasksByDate[task.dueDate]) {
      tasksByDate[task.dueDate] = [];
    }
    tasksByDate[task.dueDate].push(task);
  });

  // Seneca Important Academic Dates mapping
  const importantDatesMap = {};
  semesterConfig.importantDates.forEach(d => {
    if (!importantDatesMap[d.date]) {
      importantDatesMap[d.date] = [];
    }
    importantDatesMap[d.date].push(d);
  });

  const categories = ['ALL', 'Lab', 'Quiz', 'Assignment', 'Test', 'Project', 'Exam', 'In-class', 'Milestone'];

  return (
    <div className="space-y-5 max-w-7xl mx-auto pb-12">
      
      {/* Calendar Header & Controls */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Month / Year Navigator */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-slate-950 rounded-xl p-1 border border-slate-800">
              <button 
                onClick={handlePrevMonth}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="font-bold text-base text-white px-3 font-mono">
                {monthNames[currentMonth]} {currentYear}
              </span>
              <button 
                onClick={handleNextMonth}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Month Jumpers */}
            <div className="hidden lg:flex items-center gap-1">
              {[
                { label: 'Sep', m: 8 },
                { label: 'Oct', m: 9 },
                { label: 'Nov', m: 10 },
                { label: 'Dec', m: 11 }
              ].map(item => (
                <button
                  key={item.m}
                  onClick={() => {
                    setCurrentYear(2026);
                    setCurrentMonth(item.m);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                    currentMonth === item.m && currentYear === 2026
                      ? 'bg-red-600/20 text-red-400 border border-red-500/30 font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {item.label} '26
                </button>
              ))}
            </div>
          </div>

          {/* View Mode & Add Button */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800 text-xs">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 rounded-md font-semibold transition ${
                  viewMode === 'grid' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Monthly Grid
              </button>
              <button
                onClick={() => setViewMode('agenda')}
                className={`px-3 py-1 rounded-md font-semibold transition ${
                  viewMode === 'agenda' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Timeline Agenda
              </button>
            </div>

            <button
              onClick={() => setActiveModal('sync-export')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
              title="Sync calendar with iPhone / Google Calendar"
            >
              <CalendarIcon className="w-3.5 h-3.5 text-red-400" />
              <span>Sync .ics</span>
            </button>

            <button
              onClick={() => {
                setActiveModal('add-task');
                setModalPayload({ 
                  courseId: courses[0]?.id,
                  defaultDate: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-15`
                });
              }}
              className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add Event</span>
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-slate-800/80 text-xs">
          
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Course:
            </span>
            <select
              value={selectedCourseFilter}
              onChange={(e) => setSelectedCourseFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-200 font-medium focus:outline-none focus:border-red-500 text-xs"
            >
              <option value="ALL">All Courses ({courses.length})</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
              ))}
            </select>

            <span className="text-slate-400 ml-2">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-200 font-medium focus:outline-none focus:border-red-500 text-xs"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* User's Original CSV Filter: "Hide Done" */}
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 cursor-pointer bg-slate-950/80 px-3 py-1 rounded-lg border border-slate-800 hover:border-slate-700 transition">
              <input
                type="checkbox"
                checked={hideDone}
                onChange={(e) => setHideDone(e.target.checked)}
                className="w-3.5 h-3.5 rounded bg-slate-900 border-slate-700 text-red-600 focus:ring-0 cursor-pointer"
              />
              <span className="text-slate-300 font-medium">Filter: Hide Done</span>
            </label>
          </div>
        </div>
      </div>

      {/* View 1: Month Grid View */}
      {viewMode === 'grid' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          {/* Day of week headers */}
          <div className="grid grid-cols-7 border-b border-slate-800 bg-slate-950/80 text-center py-2.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Sunday</span>
            <span>Monday</span>
            <span>Tuesday</span>
            <span>Wednesday</span>
            <span>Thursday</span>
            <span>Friday</span>
            <span>Saturday</span>
          </div>

          {/* Calendar Day Cells */}
          <div className="grid grid-cols-7 auto-rows-fr bg-slate-950/40">
            {calendarDays.map((day, idx) => {
              const dayTasks = tasksByDate[day.dateStr] || [];
              const dayMilestones = importantDatesMap[day.dateStr] || [];
              const isToday = day.dateStr === '2026-09-08'; // Default Fall 2026 Day 1

              return (
                <div 
                  key={idx}
                  onClick={() => {
                    if (dayTasks.length === 0) {
                      setActiveModal('add-task');
                      setModalPayload({ defaultDate: day.dateStr, courseId: courses[0]?.id });
                    }
                  }}
                  className={`min-h-[110px] p-2 border-b border-r border-slate-800/80 flex flex-col justify-between transition-colors ${
                    day.isCurrentMonth ? 'bg-slate-900/60' : 'bg-slate-950/70 opacity-40'
                  } ${isToday ? 'ring-1 ring-inset ring-red-500/60 bg-red-950/10' : ''} hover:bg-slate-800/30 cursor-pointer`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-mono font-bold ${
                      isToday 
                        ? 'w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center' 
                        : day.isCurrentMonth ? 'text-slate-300' : 'text-slate-400'
                    }`}>
                      {day.dayNumber}
                    </span>

                    {dayTasks.length > 0 && (
                      <span className="text-[10px] font-mono text-slate-400">
                        {dayTasks.length} task{dayTasks.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

                  {/* Seneca Term Milestone Badges */}
                  {dayMilestones.length > 0 && (
                    <div className="space-y-1 mb-1">
                      {dayMilestones.map((m, mIdx) => (
                        <div 
                          key={mIdx}
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded truncate ${
                            m.type === 'critical' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                            m.type === 'break' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                            m.type === 'exam' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                            'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          }`}
                          title={m.title}
                        >
                          📌 {m.title}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Assessment Items */}
                  <div className="space-y-1 flex-1 overflow-y-auto max-h-24">
                    {dayTasks.map(task => {
                      const isDone = task.status === 'Graded';
                      return (
                        <div
                          key={task.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveModal('edit-task');
                            setModalPayload({ courseId: task.courseId, assessment: task });
                          }}
                          className={`text-[10px] p-1 rounded-md border flex items-center justify-between gap-1 group transition-all ${
                            isDone 
                              ? 'bg-slate-950/80 border-slate-800 text-slate-400 line-through' 
                              : 'hover:brightness-110'
                          }`}
                          style={{
                            backgroundColor: !isDone ? `${task.courseColor}18` : undefined,
                            borderColor: !isDone ? `${task.courseColor}50` : undefined,
                            color: !isDone ? '#f1f5f9' : undefined
                          }}
                          title={`${task.courseCode}: ${task.name} (${task.weight}%) - Status: ${task.status}`}
                        >
                          <div className="flex items-center gap-1 min-w-0 truncate">
                            <span 
                              className="font-mono font-bold shrink-0" 
                              style={{ color: task.courseColor }}
                            >
                              {task.courseCode}
                            </span>
                            <span className="truncate">{task.name}</span>
                          </div>
                          <span className="shrink-0 font-mono text-[9px] opacity-80">
                            {task.weight}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* View 2: Timeline Agenda View */}
      {viewMode === 'agenda' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-white mb-2">Chronological Semester Deadlines</h3>
          
          <div className="divide-y divide-slate-800">
            {filteredTasks.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No matching tasks found for the selected filters.
              </div>
            ) : (
              filteredTasks.map(task => {
                const isDone = task.status === 'Graded';
                return (
                  <div 
                    key={task.id}
                    className="py-3 flex items-center justify-between hover:bg-slate-800/30 px-3 rounded-xl transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-center font-mono text-xs w-20 shrink-0">
                        <div className="font-bold text-slate-200">{task.dueDate}</div>
                        <div className="text-[10px] text-slate-400">Week {task.week || '-'}</div>
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span 
                            className="text-xs font-mono font-bold px-2 py-0.5 rounded border"
                            style={{
                              color: task.courseColor,
                              backgroundColor: `${task.courseColor}15`,
                              borderColor: `${task.courseColor}40`
                            }}
                          >
                            {task.courseCode}
                          </span>
                          <span className={`text-sm font-semibold ${isDone ? 'text-slate-400 line-through' : 'text-white'}`}>
                            {task.name}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                            {task.category}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">{task.topic}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <div className="text-xs font-bold text-slate-200">{task.weight}%</div>
                        <div className="text-[11px] font-mono text-slate-400">
                          {task.score !== null ? `${task.score}%` : task.status}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setActiveModal('edit-task');
                          setModalPayload({ courseId: task.courseId, assessment: task });
                        }}
                        className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

    </div>
  );
}
