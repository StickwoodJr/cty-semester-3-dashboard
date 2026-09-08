import React, { useState, useEffect, useRef } from 'react';
import { useAcademic } from '../context/AcademicContext';
import { 
  Play, Pause, RotateCcw, Volume2, VolumeX, CheckCircle2, 
  Clock, Flame, Award, BookOpen, Target, Sparkles, ChevronRight,
  TrendingUp, BarChart2, Coffee, History, Plus
} from 'lucide-react';
import confetti from 'canvas-confetti';

const SESSIONS_STORAGE_KEY = 'seneca_cty_study_sessions_v1';

export default function FocusTimerView() {
  const { courses, showToast } = useAcademic();

  // Timer Modes: 'pomodoro' (25/5), 'deep' (50/10), 'custom', 'stopwatch'
  const [timerMode, setTimerMode] = useState('pomodoro');
  const [customMinutes, setCustomMinutes] = useState(30);
  const [isBreak, setIsBreak] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || 'mst300');
  const [sessionNotes, setSessionNotes] = useState('');
  
  // Timer State
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [stopwatchSeconds, setStopwatchSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Focus Sessions Log
  const [sessions, setSessions] = useState(() => {
    try {
      const saved = localStorage.getItem(SESSIONS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [
        { id: 1, courseId: 'mst300', courseCode: 'MST300', minutes: 50, timestamp: '2026-09-07T14:30:00Z', notes: 'Configured Azure resource groups and storage blobs' },
        { id: 2, courseId: 'ops345', courseCode: 'OPS345', minutes: 45, timestamp: '2026-09-07T16:00:00Z', notes: 'Reviewed systemd service unit syntax & firewalld' },
        { id: 3, courseId: 'sec320', courseCode: 'SEC320', minutes: 60, timestamp: '2026-09-08T01:15:00Z', notes: 'Incident response playbook notes & NIST framework' }
      ];
    } catch {
      return [];
    }
  });

  // Save sessions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
    } catch (e) {
      console.error('Failed to save study sessions', e);
    }
  }, [sessions]);

  // Web Audio chime synthesizer
  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch (e) {
      console.warn('AudioContext not permitted', e);
    }
  };

  // Timestamp refs for drift-free timing across background tabs and system sleep
  const targetEndTimeRef = useRef(null);
  const stopwatchStartRef = useRef(null);
  const stateRef = useRef({
    timerMode,
    customMinutes,
    isBreak,
    selectedCourseId,
    sessionNotes,
    courses,
    soundEnabled
  });

  // Keep stateRef up to date on every render
  useEffect(() => {
    stateRef.current = {
      timerMode,
      customMinutes,
      isBreak,
      selectedCourseId,
      sessionNotes,
      courses,
      soundEnabled
    };
  });

  // Handle completion
  const handleTimerComplete = () => {
    playChime();
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });

    const current = stateRef.current;
    if (!current.isBreak) {
      const durationMinutes = current.timerMode === 'pomodoro' ? 25 : current.timerMode === 'deep' ? 50 : current.customMinutes;
      const course = current.courses.find(c => c.id === current.selectedCourseId) || current.courses[0];

      const newSession = {
        id: Date.now(),
        courseId: course.id,
        courseCode: course.code,
        minutes: durationMinutes,
        timestamp: new Date().toISOString(),
        notes: current.sessionNotes || `Completed ${durationMinutes}m focus session for ${course.code}`
      };

      setSessions(prev => [newSession, ...prev]);
      showToast(`🎉 Focus session completed! Logged ${durationMinutes}m for ${course.code}`, 'success');

      // Switch to break
      setIsBreak(true);
      const breakMins = current.timerMode === 'pomodoro' ? 5 : 10;
      const breakSecs = breakMins * 60;
      setSecondsLeft(breakSecs);
      targetEndTimeRef.current = Date.now() + breakSecs * 1000;
      setIsRunning(true);
    } else {
      showToast('☕ Break time over! Ready for your next focus sprint.', 'info');
      setIsBreak(false);
      targetEndTimeRef.current = null;
      setIsRunning(false);
      resetTimer();
    }
  };

  // Drift-free Timer Tick with Background Tab & Sleep Recovery
  useEffect(() => {
    if (!isRunning) return;

    const syncTick = () => {
      if (timerMode === 'stopwatch') {
        if (!stopwatchStartRef.current) {
          stopwatchStartRef.current = Date.now() - stopwatchSeconds * 1000;
        }
        const elapsed = Math.floor((Date.now() - stopwatchStartRef.current) / 1000);
        setStopwatchSeconds(elapsed);
      } else {
        if (!targetEndTimeRef.current) {
          targetEndTimeRef.current = Date.now() + secondsLeft * 1000;
        }
        const remaining = Math.max(0, Math.ceil((targetEndTimeRef.current - Date.now()) / 1000));
        setSecondsLeft(remaining);

        // Update document tab title with remaining sprint time
        const m = Math.floor(remaining / 60);
        const s = remaining % 60;
        const timeFormatted = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        document.title = `${timeFormatted} ${isBreak ? '☕ Break' : '🎯 Sprint'} | CTY Dashboard`;

        if (remaining <= 0) {
          setIsRunning(false);
          targetEndTimeRef.current = null;
          handleTimerComplete();
        }
      }
    };

    // Run tick immediately on visibility change or window focus
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        syncTick();
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('focus', onVisibilityChange);

    const interval = setInterval(syncTick, 250);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('focus', onVisibilityChange);
      document.title = 'Seneca CTY Semester 3 | Academic Command Center';
    };
  }, [isRunning, timerMode, isBreak]);

  // Toggle Start / Pause
  const handleToggleRunning = () => {
    if (isRunning) {
      // Pause
      setIsRunning(false);
      targetEndTimeRef.current = null;
      stopwatchStartRef.current = null;
      document.title = 'Seneca CTY Semester 3 | Academic Command Center';
    } else {
      // Start / Resume
      if (timerMode === 'stopwatch') {
        stopwatchStartRef.current = Date.now() - stopwatchSeconds * 1000;
      } else {
        targetEndTimeRef.current = Date.now() + secondsLeft * 1000;
      }
      setIsRunning(true);
    }
  };

  // Reset timer
  const resetTimer = (mode = timerMode, custom = customMinutes) => {
    setIsRunning(false);
    setIsBreak(false);
    targetEndTimeRef.current = null;
    stopwatchStartRef.current = null;
    document.title = 'Seneca CTY Semester 3 | Academic Command Center';
    if (mode === 'pomodoro') {
      setSecondsLeft(25 * 60);
    } else if (mode === 'deep') {
      setSecondsLeft(50 * 60);
    } else if (mode === 'custom') {
      setSecondsLeft(custom * 60);
    } else if (mode === 'stopwatch') {
      setStopwatchSeconds(0);
    }
  };

  // Change mode
  const handleModeChange = (mode) => {
    setTimerMode(mode);
    resetTimer(mode);
  };

  // Manual session logging
  const handleLogStopwatch = () => {
    if (stopwatchSeconds < 60) {
      showToast('Stopwatch must run for at least 1 minute to log.', 'warning');
      return;
    }
    const mins = Math.round(stopwatchSeconds / 60);
    const course = courses.find(c => c.id === selectedCourseId) || courses[0];
    const newSession = {
      id: Date.now(),
      courseId: course.id,
      courseCode: course.code,
      minutes: mins,
      timestamp: new Date().toISOString(),
      notes: sessionNotes || `Completed ${mins}m deep work session for ${course.code}`
    };
    setSessions(prev => [newSession, ...prev]);
    setIsRunning(false);
    setStopwatchSeconds(0);
    showToast(`Logged ${mins}m study time for ${course.code}!`, 'success');
  };

  // Format MM:SS
  const formatTime = (totalSecs) => {
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Metrics
  const totalMinutesStudied = sessions.reduce((sum, s) => sum + (s.minutes || 0), 0);
  const totalHoursStudied = (totalMinutesStudied / 60).toFixed(1);

  // Group study by course
  const courseStudyStats = courses.map(course => {
    const courseSessions = sessions.filter(s => s.courseId === course.id);
    const mins = courseSessions.reduce((sum, s) => sum + (s.minutes || 0), 0);
    return {
      course,
      mins,
      hours: (mins / 60).toFixed(1),
      count: courseSessions.length
    };
  });

  const selectedCourse = courses.find(c => c.id === selectedCourseId) || courses[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
                4.0 GPA Academic Engine
              </span>
              <span className="text-xs text-slate-400">Seneca CTY Semester 3</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight mt-1">
              Focus Timer & Study Tracker
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Targeted Pomodoro intervals, lab deep-work sessions, and logged study hours toward your 4.0 GPA.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
                soundEnabled 
                  ? 'bg-slate-950 text-slate-200 border-slate-800' 
                  : 'bg-slate-900 text-slate-500 border-slate-800 line-through'
              }`}
              title={soundEnabled ? 'Chime Sound Enabled' : 'Chime Muted'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
              <span>{soundEnabled ? 'Sound On' : 'Muted'}</span>
            </button>

            <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-500" />
              <span>Total Logged: <strong className="text-white">{totalHoursStudied}h</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Timer on Left, Course Breakdown & Log on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Interactive Timer Machine */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col items-center justify-between min-h-[480px]">
            
            {/* Background ambient glow according to course color */}
            <div 
              className="absolute -top-24 -left-24 w-72 h-72 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-700"
              style={{ backgroundColor: selectedCourse?.color || '#DA291C' }}
            />

            {/* Mode Switcher Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs font-semibold z-10">
              <button
                onClick={() => handleModeChange('pomodoro')}
                aria-label="Pomodoro 25 minute sprint"
                aria-pressed={timerMode === 'pomodoro'}
                className={`px-3.5 py-1.5 rounded-xl transition ${
                  timerMode === 'pomodoro' 
                    ? 'bg-red-600 text-white shadow' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Pomodoro (25m)
              </button>
              <button
                onClick={() => handleModeChange('deep')}
                aria-label="Deep work 50 minute sprint"
                aria-pressed={timerMode === 'deep'}
                className={`px-3.5 py-1.5 rounded-xl transition ${
                  timerMode === 'deep' 
                    ? 'bg-red-600 text-white shadow' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Deep Work (50m)
              </button>
              <button
                onClick={() => handleModeChange('custom')}
                aria-label={`Custom duration: ${customMinutes} minutes`}
                aria-pressed={timerMode === 'custom'}
                className={`px-3.5 py-1.5 rounded-xl transition ${
                  timerMode === 'custom' 
                    ? 'bg-red-600 text-white shadow' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Custom ({customMinutes}m)
              </button>
              <button
                onClick={() => handleModeChange('stopwatch')}
                aria-label="Open stopwatch mode"
                aria-pressed={timerMode === 'stopwatch'}
                className={`px-3.5 py-1.5 rounded-xl transition ${
                  timerMode === 'stopwatch' 
                    ? 'bg-red-600 text-white shadow' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Open Stopwatch
              </button>
            </div>

            {/* Custom slider when in custom mode */}
            {timerMode === 'custom' && (
              <div className="flex items-center gap-3 pt-3 z-10">
                <span className="text-xs text-slate-400 font-mono">Duration:</span>
                {[15, 30, 45, 60, 90].map(m => (
                  <button
                    key={m}
                    onClick={() => {
                      setCustomMinutes(m);
                      resetTimer('custom', m);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition ${
                      customMinutes === m 
                        ? 'bg-red-600 text-white shadow' 
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {m}m
                  </button>
                ))}
              </div>
            )}

            {/* Huge Timer Digital Readout */}
            <div className="my-8 flex flex-col items-center justify-center z-10">
              {isBreak && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold mb-2 animate-pulse">
                  <Coffee className="w-3.5 h-3.5" />
                  <span>Break Time Active! Stretch & grab water</span>
                </div>
              )}

              <div className="text-7xl sm:text-8xl font-mono font-extrabold text-white tracking-tight tabular-nums select-none drop-shadow-2xl">
                {timerMode === 'stopwatch' ? formatTime(stopwatchSeconds) : formatTime(secondsLeft)}
              </div>

              {/* Course context badge */}
              <div className="mt-3 flex items-center gap-2">
                <span 
                  className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-md border"
                  style={{
                    color: selectedCourse?.color,
                    borderColor: `${selectedCourse?.color}40`,
                    backgroundColor: `${selectedCourse?.color}15`
                  }}
                >
                  {selectedCourse?.code}
                </span>
                <span className="text-xs text-slate-300 font-medium">
                  {selectedCourse?.name}
                </span>
              </div>
            </div>

            {/* Play, Pause, Reset Controls */}
            <div className="flex items-center gap-4 z-10 mb-4">
              <button
                onClick={handleToggleRunning}
                aria-label={isRunning ? 'Pause Timer' : 'Start Focus Session'}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl transition-all hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${
                  isRunning 
                    ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-900/30' 
                    : 'bg-red-600 hover:bg-red-500 shadow-red-900/40'
                }`}
                title={isRunning ? 'Pause Timer' : 'Start Focus Session'}
              >
                {isRunning ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current translate-x-0.5" />}
              </button>

              <button
                onClick={() => resetTimer()}
                aria-label="Reset Timer"
                className="w-12 h-12 rounded-2xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 flex items-center justify-center transition hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                title="Reset Timer"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              {timerMode === 'stopwatch' && isRunning && (
                <button
                  onClick={handleLogStopwatch}
                  aria-label="Log stopwatch study session"
                  className="px-4 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition hover:scale-105 flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Log Session</span>
                </button>
              )}
            </div>

            {/* Session Focus Goal / Notes */}
            <div className="w-full max-w-md z-10 space-y-2 pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Studying For:</span>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-red-500 font-semibold"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.code} — {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <input
                type="text"
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                placeholder="What are you working on? (e.g. Lab 1 script, Chapter 3 notes, Azure VM setup...)"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-red-500/60"
              />
            </div>

          </div>

          {/* 4.0 GPA Study Routine Tip Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-start gap-3.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">The Seneca 4.0 Study Equation</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                Seneca CTY technical courses (OPS345, MST300, CSN305, DAT330) reward steady consistency over last-minute cramming. Spending two 25-minute Pomodoro sprints between lectures locks in lab concepts before practical tests.
              </p>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Course Study Hours Breakdown & Recent Logs */}
        <div className="space-y-6">
          
          {/* Course Study Hours Meter */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Study Hours by Course</h3>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400">
                {totalHoursStudied}h Total
              </span>
            </div>

            <div className="space-y-3 pt-1">
              {courseStudyStats.map(({ course, hours, mins, count }) => {
                const maxHoursRef = 10;
                const percent = Math.min(100, Math.round((parseFloat(hours) / maxHoursRef) * 100));

                return (
                  <div key={course.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-slate-200 flex items-center gap-1.5">
                        <span 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: course.color }}
                        />
                        {course.code}
                      </span>
                      <span className="text-slate-400 text-[11px] font-mono">
                        {hours}h ({count} sessions)
                      </span>
                    </div>

                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${Math.max(6, percent)}%`,
                          backgroundColor: course.color 
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Focus Sessions History */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold text-white">Recent Sessions Log</h3>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                {sessions.length} logged
              </span>
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {sessions.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-500">
                  No sessions logged yet. Complete your first focus sprint!
                </div>
              ) : (
                sessions.slice(0, 8).map(s => (
                  <div 
                    key={s.id} 
                    className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-mono font-bold text-slate-200">
                        {s.courseCode}
                      </span>
                      <span className="text-[10px] font-mono font-semibold text-emerald-400 px-1.5 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/20">
                        +{s.minutes} min
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      {s.notes}
                    </div>
                    <div className="text-[9px] text-slate-500 font-mono mt-1">
                      {new Date(s.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
