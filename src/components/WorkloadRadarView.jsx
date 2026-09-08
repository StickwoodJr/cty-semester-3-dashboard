import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAcademic } from '../context/AcademicContext';
import { 
  Activity, Zap, ShieldAlert, Calendar, Clock, 
  CheckCircle2, ArrowRight, Sparkles, AlertTriangle, 
  ChevronRight, Compass, Timer, Award, Filter, RefreshCw,
  Info, TrendingDown, Layers, CheckSquare
} from 'lucide-react';
import { 
  SEMESTER_WEEKS_META, 
  READING_WEEK_META, 
  RECOMMENDED_EARLY_BUFFERS, 
  calculateSemesterWorkload, 
  calculateWorkloadMetrics 
} from '../utils/workloadHelper';
import { getDueUrgency, getLocalDateStr } from '../utils/dateHelper';

const STORAGE_KEY_BUFFERS = 'seneca_cty_early_buffers_v1';

export default function WorkloadRadarView() {
  const { 
    courses, 
    updateAssessment, 
    setCurrentView, 
    setSelectedCourseId,
    showToast,
    triggerCelebration 
  } = useAcademic();

  // Local state for staged early buffers (taskId -> targetWeek)
  const [stagedBuffers, setStagedBuffers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BUFFERS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to load staged buffers", e);
    }
    // Default initial staging for the top 3 highest-leverage buffers
    return {
      "ops345-lab1": 3,
      "ops345-lab2": 4,
      "wtp100-m6-14": 5
    };
  });

  // Toggle between Raw Timeline and Early-Bird Smoothed Curve
  const [viewMode, setViewMode] = useState('smoothed'); // 'smoothed' | 'raw'
  const [selectedWeekNum, setSelectedWeekNum] = useState(7); // Default to Week 7 (Midterm Peak)
  const [courseFilter, setCourseFilter] = useState('all');
  const [showOnlyPending, setShowOnlyPending] = useState(false);
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [selectedCustomTask, setSelectedCustomTask] = useState('');
  const [customTargetWeek, setCustomTargetWeek] = useState(3);

  // Save buffers to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BUFFERS, JSON.stringify(stagedBuffers));
    } catch (e) {
      console.error("Failed to save staged buffers", e);
    }
  }, [stagedBuffers]);

  // Compute Raw and Smoothed Workload
  const isSmoothed = viewMode === 'smoothed';
  const semesterWeeks = useMemo(() => {
    return calculateSemesterWorkload(courses, stagedBuffers, isSmoothed);
  }, [courses, stagedBuffers, isSmoothed]);

  const rawWeeks = useMemo(() => {
    return calculateSemesterWorkload(courses, stagedBuffers, false);
  }, [courses, stagedBuffers]);

  const currentMetrics = useMemo(() => {
    return calculateWorkloadMetrics(semesterWeeks);
  }, [semesterWeeks]);

  const rawMetrics = useMemo(() => {
    return calculateWorkloadMetrics(rawWeeks);
  }, [rawWeeks]);

  // Hours saved calculation from staged buffers
  const totalHoursSaved = useMemo(() => {
    let hours = 0;
    RECOMMENDED_EARLY_BUFFERS.forEach(b => {
      if (stagedBuffers[b.taskId]) {
        hours += b.hoursSaved;
      }
    });
    return hours;
  }, [stagedBuffers]);

  // Toggle or set a buffer
  const toggleBuffer = useCallback((taskId, defaultWeek = 3) => {
    setStagedBuffers(prev => {
      const next = { ...prev };
      if (next[taskId]) {
        delete next[taskId];
        showToast("Restored assessment to original syllabus deadline", "info");
      } else {
        next[taskId] = defaultWeek;
        triggerCelebration();
        showToast("Staged as 4.0 Early-Bird Buffer! Workload curve updated.", "success");
      }
      return next;
    });
  }, [showToast, triggerCelebration]);

  // Handle direct task status toggle
  const handleToggleTaskStatus = (courseId, task) => {
    const isNowGraded = task.status !== 'Graded';
    updateAssessment(courseId, task.id, {
      status: isNowGraded ? 'Graded' : 'Not Started',
      score: isNowGraded ? 100 : null
    });
  };

  // Selected week data
  const selectedWeek = semesterWeeks.find(w => w.week === selectedWeekNum) || semesterWeeks[6];

  // Filter tasks for the selected week
  const filteredWeekTasks = useMemo(() => {
    return (selectedWeek.tasks || []).filter(task => {
      if (courseFilter !== 'all' && task.courseId !== courseFilter) return false;
      if (showOnlyPending && task.status === 'Graded') return false;
      return true;
    });
  }, [selectedWeek, courseFilter, showOnlyPending]);

  // Find all pending tasks across all courses for custom buffer staging
  const allAvailableTasks = useMemo(() => {
    const list = [];
    courses.forEach(c => {
      (c.assessments || []).forEach(a => {
        list.push({
          ...a,
          courseId: c.id,
          courseCode: c.code,
          courseColor: c.color
        });
      });
    });
    return list;
  }, [courses]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      
      {/* 1. Header & Hero Bar */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
              <Activity className="w-3.5 h-3.5" />
              <span>Cognitive Load & Early-Bird Architecture</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              Semester Workload Crunch Radar
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl">
              14-week visual density heatmap and proactive early-bird buffer engine. Smooth out deadly 
              midterm and final exam avalanches to guarantee your <span className="text-amber-400 font-bold">4.0 GPA target</span>.
            </p>
          </div>

          {/* Curve Mode Toggle */}
          <div className="bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 flex items-center shrink-0">
            <button
              onClick={() => setViewMode('smoothed')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'smoothed'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-900/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>4.0 Early-Bird Curve</span>
              <span className="ml-1 px-1.5 py-0.5 rounded bg-white/20 text-[10px] font-extrabold">
                Recommended
              </span>
            </button>
            <button
              onClick={() => setViewMode('raw')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                viewMode === 'raw'
                  ? 'bg-slate-800 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>Raw Deadlines</span>
            </button>
          </div>
        </div>

        {/* Live Defense Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-800">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Peak Crunch Week</span>
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">Week {currentMetrics.peakWeek}</span>
              <span className="text-xs font-bold text-rose-400">({currentMetrics.peakWeight}% load)</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {isSmoothed ? "Mitigated with early buffers" : "Full collision without buffers"}
            </p>
          </div>

          <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-800">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Stress Volatility</span>
              <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-emerald-400">{currentMetrics.volatility}%</span>
              {isSmoothed && (
                <span className="text-[11px] text-emerald-300 font-semibold">
                  (-{Math.max(0, Math.round(rawMetrics.volatility - currentMetrics.volatility))}%)
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Standard deviation of weekly stress
            </p>
          </div>

          <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-800">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Crunch Weeks</span>
              <Layers className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-amber-300">{currentMetrics.crunchWeekCount}</span>
              <span className="text-xs text-slate-400 font-normal">/ 14 weeks</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Weeks with high or extreme load
            </p>
          </div>

          <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-800">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Crunch Time Banked</span>
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-yellow-400">~{totalHoursSaved}h</span>
              <span className="text-xs text-slate-400 font-normal">saved</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Freed up during peak exam weeks
            </p>
          </div>
        </div>
      </div>

      {/* 2. Visual 14-Week Horizon & Crunch Curve Bar Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-400" />
              <span>14-Week Semester Cognitive Horizon</span>
            </h2>
            <p className="text-xs text-slate-400">
              Select any week to inspect its deliverables, passing thresholds, and early-bird staging options.
            </p>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2.5 h-2.5 rounded bg-emerald-500" /> Steady (&lt;15%)
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2.5 h-2.5 rounded bg-blue-500" /> Moderate (15-25%)
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2.5 h-2.5 rounded bg-amber-500" /> High (25-50%)
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2.5 h-2.5 rounded bg-rose-500 animate-pulse" /> Avalanche (&gt;50%)
            </span>
          </div>
        </div>

        {/* 14-Week Bar Visualizer */}
        <div className="grid grid-cols-2 sm:grid-cols-7 lg:grid-cols-14 gap-2 pt-4">
          {semesterWeeks.map(w => {
            const isSelected = selectedWeekNum === w.week;
            const barHeightPct = Math.min(100, Math.max(14, (w.totalWeight / 160) * 100));

            return (
              <button
                key={w.week}
                onClick={() => setSelectedWeekNum(w.week)}
                className={`flex flex-col justify-between p-2.5 rounded-2xl border transition-all text-left relative group ${
                  isSelected
                    ? 'bg-slate-800 border-indigo-500 ring-2 ring-indigo-500/30 shadow-lg'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                {/* Week Header */}
                <div className="space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black text-white">W{w.week}</span>
                    <span className={`text-[9px] px-1 py-0.2 rounded font-bold ${w.severity.badgeClass}`}>
                      {w.totalWeight.toFixed(0)}%
                    </span>
                  </div>
                  <div className="text-[9px] text-slate-400 font-mono truncate">{w.dates.split('–')[0].trim()}</div>
                </div>

                {/* Vertical Bar Fill */}
                <div className="my-3 h-28 w-full bg-slate-900 rounded-lg flex flex-col justify-end p-1 overflow-hidden">
                  <div 
                    className={`w-full rounded-md transition-all duration-500 ${w.severity.barClass}`}
                    style={{ height: `${barHeightPct}%` }}
                  />
                </div>

                {/* Week Footer */}
                <div className="space-y-1">
                  <div className="text-[10px] text-slate-300 font-semibold flex items-center justify-between">
                    <span>{w.tasks.length} task{w.tasks.length === 1 ? '' : 's'}</span>
                    {w.hasExams && <span className="text-amber-400 text-[9px] font-bold">EXAM</span>}
                  </div>
                  {w.milestone && (
                    <div className="text-[8px] text-slate-400 truncate leading-tight" title={w.milestone}>
                      {w.milestone}
                    </div>
                  )}
                </div>

                {/* Selection Indicator Ring */}
                {isSelected && (
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-indigo-500 rounded-full ring-2 ring-slate-900" />
                )}
              </button>
            );
          })}
        </div>

        {/* Reading Week Banner */}
        <div className="mt-4 p-3 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-indigo-300">
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>
              <strong className="text-white">{READING_WEEK_META.label} ({READING_WEEK_META.dates}):</strong> {READING_WEEK_META.description}
            </span>
          </div>
          <button
            onClick={() => setCurrentView('planner')}
            className="px-3 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shrink-0 flex items-center gap-1.5 transition"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Schedule Break Study</span>
          </button>
        </div>
      </div>

      {/* 3. High-Yield 4.0 Early-Bird Buffer Recommender */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-1">
              <Zap className="w-3 h-3" />
              <span>Proactive Avalanche Protection</span>
            </div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Curated 4.0 Early-Bird Recommendations</span>
            </h2>
            <p className="text-xs text-slate-400">
              Finishing these deliverables early liberates massive study blocks right before high-stakes midterms and final exams.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                // Stage all recommendations
                const allStaged = {};
                RECOMMENDED_EARLY_BUFFERS.forEach(b => {
                  allStaged[b.taskId] = b.recommendedWeek;
                });
                setStagedBuffers(allStaged);
                triggerCelebration();
                showToast("All recommended early buffers staged! Curve flattened.", "success");
              }}
              className="px-3 py-2 rounded-xl bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border border-emerald-500/30 text-xs font-bold transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Stage All Recommended</span>
            </button>

            <button
              onClick={() => {
                setStagedBuffers({});
                showToast("Cleared all staged buffers. Reset to official syllabus.", "info");
              }}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Recommended Early Buffer Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {RECOMMENDED_EARLY_BUFFERS.map(rec => {
            const isStaged = Boolean(stagedBuffers[rec.taskId]);

            return (
              <div 
                key={rec.taskId}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  isStaged
                    ? 'bg-emerald-950/20 border-emerald-500/40 shadow-lg shadow-emerald-950/20'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="space-y-3">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-800 text-slate-200 border border-slate-700">
                      {rec.courseCode}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-bold">
                      <span className="text-slate-400 line-through">Week {rec.originalWeek}</span>
                      <ArrowRight className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Week {rec.recommendedWeek}</span>
                    </div>
                  </div>

                  {/* Task Name & Weight */}
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-emerald-300">
                      {rec.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                      <span>Weight: <strong className="text-white">{rec.weight}%</strong></span>
                      <span>•</span>
                      <span className="text-yellow-400 font-semibold">Saves ~{rec.hoursSaved}h</span>
                    </div>
                  </div>

                  {/* 4.0 Rationale */}
                  <p className="text-xs text-slate-300 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/60 leading-relaxed">
                    {rec.rationale}
                  </p>
                </div>

                {/* Actions */}
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => toggleBuffer(rec.taskId, rec.recommendedWeek)}
                    className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      isStaged
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    }`}
                  >
                    <CheckSquare className="w-3.5 h-3.5" />
                    <span>{isStaged ? 'Staged Early (Active)' : 'Stage Early Buffer'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedCourseId(rec.courseId);
                      setCurrentView('timer');
                    }}
                    title="Launch Focus Timer"
                    className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  >
                    <Timer className="w-4 h-4 text-indigo-400" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Selected Week Deep-Dive & Delivery Inspector */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-black text-white">
                Week {selectedWeek.week} Deliverables & Evaluation Breakdown
              </h2>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${selectedWeek.severity.badgeClass}`}>
                {selectedWeek.severity.label}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {selectedWeek.dates} • Total Weight: <strong className="text-white">{selectedWeek.totalWeight.toFixed(1)}%</strong> • {selectedWeek.tasks.length} Deliverables
            </p>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={courseFilter}
              onChange={e => setCourseFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Courses</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
              ))}
            </select>

            <button
              onClick={() => setShowOnlyPending(prev => !prev)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                showOnlyPending
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {showOnlyPending ? 'Pending Only' : 'All Statuses'}
            </button>
          </div>
        </div>

        {/* Task Cards in this Week */}
        {filteredWeekTasks.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm">
            No assessments match your active filters for Week {selectedWeek.week}.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredWeekTasks.map(task => {
              const isGraded = task.status === 'Graded';
              const urgency = getDueUrgency(task.dueDate);

              return (
                <div
                  key={task.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                    isGraded
                      ? 'bg-slate-950/40 border-slate-800/60 opacity-75'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-2.5">
                    {/* Header: Course + Category + Due Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-2.5 h-2.5 rounded-full" 
                          style={{ backgroundColor: task.courseColor || '#6366f1' }}
                        />
                        <span className="font-mono font-bold text-xs text-white">
                          {task.courseCode}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-slate-300">
                          {task.category}
                        </span>
                        {task.isStagedEarly && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Staged Early from W{task.originalWeek}
                          </span>
                        )}
                      </div>

                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${urgency.badgeClass}`}>
                        {urgency.label}
                      </span>
                    </div>

                    {/* Task Title & Topic */}
                    <div>
                      <h4 className={`text-sm font-bold ${isGraded ? 'line-through text-slate-400' : 'text-white'}`}>
                        {task.name}
                      </h4>
                      {task.topic && (
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">
                          {task.topic}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-slate-300">
                        Weight: <strong className="text-white">{task.weight}%</strong>
                      </span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-400">{task.dueDate}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Focus Timer Launch */}
                      <button
                        onClick={() => {
                          setSelectedCourseId(task.courseId);
                          setCurrentView('timer');
                        }}
                        title="Start Focus Timer for this course"
                        className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-indigo-400 transition"
                      >
                        <Timer className="w-4 h-4" />
                      </button>

                      {/* Complete Checkbox */}
                      <button
                        onClick={() => handleToggleTaskStatus(task.courseId, task)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold text-xs transition ${
                          isGraded
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{isGraded ? 'Completed' : 'Mark Done'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Navigation Footer Callouts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setCurrentView('exams')}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-left transition group flex items-center justify-between"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
              <Award className="w-4 h-4" />
              <span>Exam & Midterm War Room</span>
            </div>
            <p className="text-xs text-slate-400">
              Audit cheat sheet rules (OPS345) and 50% test minimum passing hurdles.
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-amber-400 transition transform group-hover:translate-x-1" />
        </button>

        <button
          onClick={() => setCurrentView('planner')}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 text-left transition group flex items-center justify-between"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold">
              <Compass className="w-4 h-4" />
              <span>Study Block & Gap Optimizer</span>
            </div>
            <p className="text-xs text-slate-400">
              Allocate your 4.5h Tuesday and 2h Wednesday campus gaps to early buffers.
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-indigo-400 transition transform group-hover:translate-x-1" />
        </button>

        <button
          onClick={() => setCurrentView('flashcards')}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-pink-500/40 text-left transition group flex items-center justify-between"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-pink-400 text-xs font-bold">
              <Sparkles className="w-4 h-4" />
              <span>Active Recall Flashcard Deck</span>
            </div>
            <p className="text-xs text-slate-400">
              Master BIND DNS, systemd, and Azure Blob tiers for test day.
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-pink-400 transition transform group-hover:translate-x-1" />
        </button>
      </div>

    </div>
  );
}
