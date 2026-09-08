import React, { useState } from 'react';
import { useAcademic } from '../context/AcademicContext';
import { 
  CheckCircle2, Clock, AlertCircle, Calendar, BookOpen, 
  ArrowUpRight, Sparkles, ChevronRight, CheckSquare, 
  Flame, HelpCircle, Layers, FileText, BarChart2
} from 'lucide-react';

export default function DashboardView() {
  const { 
    courses, 
    setCurrentView, 
    setSelectedCourseId, 
    setActiveModal, 
    setModalPayload,
    getSemesterMetrics,
    getCourseMetrics,
    getAllAssessments,
    updateAssessment,
    scratchpad,
    setScratchpad,
    semesterConfig
  } = useAcademic();

  const metrics = getSemesterMetrics();
  const allTasks = getAllAssessments();

  // Selected day for schedule preview (default Monday)
  const [scheduleDay, setScheduleDay] = useState('Monday');

  // Filter urgent tasks: due within 14 days or not graded yet
  const pendingTasks = allTasks.filter(t => t.status !== 'Graded');
  const urgentTasks = pendingTasks.slice(0, 6);

  // Calculate weekly workload distribution (Weeks 1 to 14)
  const weeklyLoad = Array.from({ length: 14 }, (_, i) => {
    const weekNum = i + 1;
    const tasksInWeek = allTasks.filter(t => t.week === weekNum);
    const totalWeight = tasksInWeek.reduce((sum, t) => sum + (parseFloat(t.weight) || 0), 0);
    return {
      week: weekNum,
      weight: totalWeight,
      count: tasksInWeek.length,
      tasks: tasksInWeek
    };
  });

  // Calculate timetable for preview day
  const scheduleForDay = [];
  courses.forEach(course => {
    (course.schedule || []).forEach(slot => {
      if (slot.day.toLowerCase().includes(scheduleDay.toLowerCase())) {
        scheduleForDay.push({
          courseCode: course.code,
          courseName: course.name,
          courseColor: course.color,
          courseId: course.id,
          room: slot.room,
          time: slot.time,
          instructor: course.professor
        });
      }
    });
  });

  // Sort schedule by start time
  scheduleForDay.sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Hero Welcome & Term Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-red-950/40 border border-slate-800 p-6 sm:p-8 shadow-xl">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-16 w-48 h-48 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
                Fall 2026 Term Active
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Week 1 • Sept 8 - Dec 18, 2026
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Seneca CTY Semester 3 Command Center
            </h2>
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              Tracking all 7 courses, 60+ evaluations, official syllabi thresholds, AWS and Azure budgets, and your WTP100 co-op preparation.
            </p>

            {/* Countdown milestones */}
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>WTP100 Deadline:</span>
                <span className="font-bold text-amber-400">Oct 23, 2026</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300">
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                <span>Study Week:</span>
                <span className="font-bold text-blue-400">Oct 26 - 30</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300">
                <Flame className="w-3.5 h-3.5 text-rose-400" />
                <span>Final Exams:</span>
                <span className="font-bold text-rose-400">Dec 7 - 18</span>
              </div>
            </div>
          </div>

          {/* Quick Buttons */}
          <div className="flex sm:flex-col gap-2.5 shrink-0">
            <button
              onClick={() => {
                setActiveModal('add-task');
                setModalPayload({ courseId: courses[0]?.id });
              }}
              className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs shadow-lg shadow-red-900/30 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <span>+ Add Assessment</span>
            </button>
            <button
              onClick={() => setCurrentView('calendar')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Full Calendar</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm relative overflow-hidden group hover:border-slate-700 transition">
          <div className="text-xs font-medium text-slate-400">Projected GPA</div>
          <div className="text-2xl font-bold text-white mt-1 flex items-baseline gap-2">
            <span>{metrics.currentGpa}</span>
            <span className="text-xs font-normal text-emerald-400">/ 4.0 Scale</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Target: <span className="text-slate-300 font-semibold">3.80+ (Honours)</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm relative overflow-hidden group hover:border-slate-700 transition">
          <div className="text-xs font-medium text-slate-400">Term Average</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">
            {metrics.semesterAverage}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Across active graded courses
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm relative overflow-hidden group hover:border-slate-700 transition">
          <div className="text-xs font-medium text-slate-400">Task Completion</div>
          <div className="text-2xl font-bold text-white mt-1 flex items-baseline gap-2">
            <span>{metrics.completedTasks}</span>
            <span className="text-xs font-normal text-slate-400">/ {metrics.totalTasks} Done</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className="bg-red-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${metrics.progressPercent}%` }} 
            />
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm relative overflow-hidden group hover:border-slate-700 transition">
          <div className="text-xs font-medium text-slate-400">Pending Evaluations</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">
            {pendingTasks.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {urgentTasks.length} due soon
          </div>
        </div>
      </div>

      {/* Main Grid: Urgent Tasks & Schedule Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Urgent Action Radar */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Upcoming Deadlines Radar</h3>
                  <p className="text-[11px] text-slate-400">Next critical assignments, labs, and quizzes</p>
                </div>
              </div>
              <button
                onClick={() => setCurrentView('tasks')}
                className="text-xs font-medium text-red-400 hover:text-red-300 flex items-center gap-1 transition"
              >
                <span>View All ({pendingTasks.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Tasks list */}
            <div className="space-y-2.5">
              {urgentTasks.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
                  All caught up! No pending assignments on your radar.
                </div>
              ) : (
                urgentTasks.map(task => {
                  const isDone = task.status === 'Graded';
                  return (
                    <div 
                      key={task.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700/80 transition group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <button
                          onClick={() => {
                            const nextStatus = task.status === 'Not Started' ? 'In Progress' 
                                            : task.status === 'In Progress' ? 'Submitted' 
                                            : task.status === 'Submitted' ? 'Graded' : 'Not Started';
                            updateAssessment(task.courseId, task.id, { 
                              status: nextStatus,
                              score: nextStatus === 'Graded' && task.score === null ? 100 : task.score
                            });
                          }}
                          className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                            task.status === 'Graded' 
                              ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                              : task.status === 'Submitted'
                              ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                              : task.status === 'In Progress'
                              ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                              : 'border-slate-700 hover:border-slate-500'
                          }`}
                          title={`Status: ${task.status}. Click to advance.`}
                        >
                          {task.status === 'Graded' && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                          {task.status === 'Submitted' && <span className="text-[10px] font-bold">S</span>}
                          {task.status === 'In Progress' && <span className="text-[10px] font-bold">…</span>}
                        </button>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span 
                              className="text-[11px] font-mono font-bold px-1.5 py-0.5 rounded border"
                              style={{ 
                                color: task.courseColor || '#3b82f6',
                                borderColor: `${task.courseColor}40`,
                                backgroundColor: `${task.courseColor}15`
                              }}
                            >
                              {task.courseCode}
                            </span>
                            <span className="text-xs font-semibold text-slate-100 group-hover:text-white truncate">
                              {task.name}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                              {task.category}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 truncate mt-0.5 max-w-md">
                            {task.topic || task.name}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 text-right">
                        <div>
                          <div className="text-xs font-semibold text-slate-200">
                            {task.weight}% <span className="text-[10px] text-slate-400">wt</span>
                          </div>
                          <div className="text-[10px] text-slate-400 flex items-center justify-end gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>{task.dueDate}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setActiveModal('edit-task');
                            setModalPayload({ courseId: task.courseId, assessment: task });
                          }}
                          className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition"
                          title="Edit Task & Enter Score"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Weekly Workload Heatmap Bar Chart */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
                  <BarChart2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Semester Workload Forecast</h3>
                  <p className="text-[11px] text-slate-400">Total weight percentage (%) evaluated per week</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-400">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-emerald-500" /> Light</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-amber-500" /> Moderate</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-rose-500" /> Crunch Peak</span>
              </div>
            </div>

            {/* Bars */}
            <div className="grid grid-cols-[repeat(14,minmax(0,1fr))] gap-1.5 pt-4 items-end h-28">
              {weeklyLoad.map(w => {
                const maxWeightRef = 40;
                const heightPercent = Math.min(100, Math.max(12, Math.round((w.weight / maxWeightRef) * 100)));
                const isPeak = w.weight >= 25;
                const isModerate = w.weight >= 10 && w.weight < 25;
                const isReadingWeek = w.week === 8; // Seneca Reading Week after Week 7

                return (
                  <div key={w.week} className="flex flex-col items-center gap-1 group relative">
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center z-30 pointer-events-none">
                      <div className="bg-slate-950 border border-slate-700 text-white text-[10px] rounded-lg p-2 shadow-2xl whitespace-nowrap">
                        <div className="font-bold text-red-400">Week {w.week}</div>
                        <div>Weight: {w.weight.toFixed(1)}%</div>
                        <div>{w.count} assessment(s)</div>
                        {w.week === 7 && <div className="text-amber-300 font-semibold mt-0.5">⚠️ Midterm Crunch!</div>}
                        {w.week === 13 && <div className="text-rose-400 font-semibold mt-0.5">⚠️ Project / Exam Week!</div>}
                        {w.week === 14 && <div className="text-rose-400 font-semibold mt-0.5">⚠️ Final Exams Week!</div>}
                      </div>
                      <div className="w-2 h-2 bg-slate-950 border-r border-b border-slate-700 transform rotate-45 -mt-1" />
                    </div>

                    <div className="text-[10px] font-mono text-slate-400 group-hover:text-white transition">
                      {w.weight > 0 ? `${Math.round(w.weight)}%` : '-'}
                    </div>

                    <div className="w-full bg-slate-950 rounded-t-md h-20 flex items-end p-0.5">
                      <div 
                        className={`w-full rounded-t transition-all group-hover:opacity-90 ${
                          isPeak ? 'bg-rose-500' : isModerate ? 'bg-amber-500' : w.weight > 0 ? 'bg-emerald-500' : 'bg-slate-800'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>

                    <span className={`text-[10px] font-mono ${w.week === 7 || w.week >= 13 ? 'text-rose-400 font-bold' : 'text-slate-400'}`}>
                      W{w.week}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Class Schedule for Today & Scratchpad */}
        <div className="space-y-4">
          
          {/* Daily Schedule Glance */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Class Timetable</h3>
                  <p className="text-[11px] text-slate-400">Campus rooms & times</p>
                </div>
              </div>

              {/* Day Selector Buttons */}
              <div className="flex rounded-lg bg-slate-950 p-0.5 border border-slate-800 text-[10px] font-semibold">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(d => {
                  const fullDay = d === 'Mon' ? 'Monday' : d === 'Tue' ? 'Tuesday' : d === 'Wed' ? 'Wednesday' : d === 'Thu' ? 'Thursday' : 'Friday';
                  const isSelected = scheduleDay === fullDay;
                  return (
                    <button
                      key={d}
                      onClick={() => setScheduleDay(fullDay)}
                      className={`px-2 py-1 rounded transition-all ${
                        isSelected ? 'bg-red-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Schedule cards */}
            <div className="space-y-2.5 pt-1">
              {scheduleForDay.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-center text-xs text-slate-400">
                  <Clock className="w-5 h-5 text-slate-400 mx-auto mb-1 opacity-70" />
                  No scheduled on-campus lectures for {scheduleDay}. Perfect time for lab work or WTP100 online modules!
                </div>
              ) : (
                scheduleForDay.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelectedCourseId(item.courseId);
                      setCurrentView('course-detail');
                    }}
                    className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span 
                        className="text-xs font-bold font-mono px-2 py-0.5 rounded border"
                        style={{
                          color: item.courseColor,
                          backgroundColor: `${item.courseColor}15`,
                          borderColor: `${item.courseColor}40`
                        }}
                      >
                        {item.courseCode}
                      </span>
                      <span className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {item.time}
                      </span>
                    </div>

                    <div className="text-xs font-medium text-white group-hover:text-red-400 transition truncate">
                      {item.courseName}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5">
                      <span className="text-amber-400/90 font-medium">
                        📍 {item.room}
                      </span>
                      <span className="truncate max-w-[110px]">
                        {item.instructor}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => setCurrentView('schedule')}
              className="w-full mt-3 py-2 text-center text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-950/80 hover:bg-slate-800/80 rounded-xl border border-slate-800 transition"
            >
              Open Full 5-Day Weekly Grid →
            </button>
          </div>

          {/* Quick Scratchpad */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Quick Scratchpad</h3>
              </div>
              <span className="text-[10px] text-slate-400">Auto-saved locally</span>
            </div>
            <textarea
              value={scratchpad}
              onChange={(e) => setScratchpad(e.target.value)}
              placeholder="Paste room numbers, meeting links, lab notes, reminders..."
              rows={4}
              className="w-full bg-slate-950/90 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-red-500/60 focus:ring-1 focus:ring-red-500/30 font-mono transition"
            />
          </div>
        </div>
      </div>

      {/* Courses Overview Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Courses Breakdown</h3>
            <p className="text-xs text-slate-400">Current progress, syllabus weight, and instructors</p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {courses.length} Active Courses
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {courses.map(course => {
            const metrics = getCourseMetrics(course);
            return (
              <div
                key={course.id}
                onClick={() => {
                  setSelectedCourseId(course.id);
                  setCurrentView('course-detail');
                }}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 hover:border-slate-700 transition cursor-pointer group flex flex-col justify-between shadow-sm relative overflow-hidden"
              >
                {/* Top accent bar */}
                <div 
                  className="absolute top-0 left-0 right-0 h-1" 
                  style={{ backgroundColor: course.color || '#DA291C' }} 
                />

                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span 
                        className="text-xs font-bold font-mono px-2 py-0.5 rounded border"
                        style={{
                          color: course.color,
                          backgroundColor: `${course.color}15`,
                          borderColor: `${course.color}40`
                        }}
                      >
                        {course.code}
                      </span>
                      <span className="text-[11px] text-slate-400 ml-2">
                        Sec {course.section}
                      </span>
                    </div>

                    {metrics.currentAverage !== null ? (
                      <div className="text-right">
                        <div className="text-sm font-bold text-emerald-400 font-mono">
                          {Math.round(metrics.currentAverage)}%
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Grade {metrics.letterGrade}
                        </div>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-medium">
                        New Term
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-white group-hover:text-red-400 transition line-clamp-1">
                    {course.name}
                  </h4>
                  <div className="text-xs text-slate-400 mt-1 truncate">
                    👨‍🏫 {course.professor}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span>Evaluated Weight</span>
                    <span className="font-semibold text-slate-200">
                      {metrics.completedWeight.toFixed(1)}% / 100%
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all"
                      style={{ 
                        width: `${Math.min(100, metrics.completedWeight)}%`,
                        backgroundColor: course.color || '#DA291C'
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
                    <span>{course.assessments?.length || 0} Assessments</span>
                    <span className="text-red-400 font-medium group-hover:underline flex items-center gap-0.5">
                      Open Syllabus <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
