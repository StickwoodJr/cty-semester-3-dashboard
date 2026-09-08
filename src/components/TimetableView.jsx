import React, { useState } from 'react';
import { useAcademic } from '../context/AcademicContext';
import { 
  Clock, MapPin, Calendar, ExternalLink, Globe, Wifi, 
  Coffee, Sparkles, BookOpen, Grid, List, Layers, Info, Download, Compass
} from 'lucide-react';

export default function TimetableView() {
  const { setSelectedCourseId, setCurrentView, setActiveModal } = useAcademic();

  const [viewMode, setViewMode] = useState('grid'); // 'grid' (scaled) or 'compact'
  const [selectedDayFilter, setSelectedDayFilter] = useState('all'); // 'all' or day name

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  // Timetable grid scaling constants
  const START_HOUR = 8; // 8:00 AM
  const END_HOUR = 19; // 7:00 PM
  const START_MINUTES = START_HOUR * 60; // 480
  const END_MINUTES = END_HOUR * 60; // 1140
  const TOTAL_HOURS = END_HOUR - START_HOUR; // 11 hours
  const HOUR_HEIGHT = 80; // 80px per hour
  const PIXELS_PER_MINUTE = HOUR_HEIGHT / 60; // ~1.333px per minute
  const GRID_HEIGHT = TOTAL_HOURS * HOUR_HEIGHT; // 880px

  // Hours array for the time axis
  const HOURS = Array.from({ length: TOTAL_HOURS + 1 }, (_, i) => {
    const hour = START_HOUR + i;
    const meridian = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return {
      hour,
      label: `${displayHour}:00 ${meridian}`,
      halfLabel: `${displayHour}:30`
    };
  });

  // Exact schedule with minute metrics pre-computed for scaled positioning
  const scheduleData = {
    Monday: [
      {
        courseCode: "MST300",
        courseId: "mst300",
        name: "Intro to Microsoft Cloud Technologies",
        time: "9:50 AM - 11:35 AM",
        startTime: "9:50 AM",
        endTime: "11:35 AM",
        startMin: 590, // 9 * 60 + 50
        endMin: 695,   // 11 * 60 + 35
        durationMin: 105,
        durationLabel: "1h 45m",
        room: "Newnham Bldg C - C3036",
        instructor: "Nooshin Beheshti",
        color: "#a855f7", // Purple
        mode: "In-Person"
      },
      {
        courseCode: "SEC320",
        courseId: "sec320",
        name: "Security Incident Response",
        time: "1:30 PM - 3:15 PM",
        startTime: "1:30 PM",
        endTime: "3:15 PM",
        startMin: 810, // 13 * 60 + 30
        endMin: 915,   // 15 * 60 + 15
        durationMin: 105,
        durationLabel: "1h 45m",
        room: "Newnham Bldg K - K1272",
        instructor: "Homayoun Mohamadi",
        color: "#0284c7", // Blue
        mode: "In-Person"
      },
      {
        courseCode: "DAT330",
        courseId: "dat330",
        name: "Introduction to Databases",
        time: "3:20 PM - 5:05 PM",
        startTime: "3:20 PM",
        endTime: "5:05 PM",
        startMin: 920, // 15 * 60 + 20
        endMin: 1025,  // 17 * 60 + 5
        durationMin: 105,
        durationLabel: "1h 45m",
        room: "Newnham Bldg A - A1509",
        instructor: "Parul Kantaria",
        color: "#ef4444", // Red
        mode: "In-Person"
      }
    ],
    Tuesday: [
      {
        courseCode: "MST300",
        courseId: "mst300",
        name: "Intro to Microsoft Cloud Technologies",
        time: "9:50 AM - 11:35 AM",
        startTime: "9:50 AM",
        endTime: "11:35 AM",
        startMin: 590,
        endMin: 695,
        durationMin: 105,
        durationLabel: "1h 45m",
        room: "Newnham Bldg A - A4515",
        instructor: "Nooshin Beheshti",
        color: "#a855f7",
        mode: "In-Person"
      },
      {
        courseCode: "SEC320",
        courseId: "sec320",
        name: "Security Incident Response",
        time: "11:40 AM - 1:25 PM",
        startTime: "11:40 AM",
        endTime: "1:25 PM",
        startMin: 700, // 11 * 60 + 40
        endMin: 805,   // 13 * 60 + 25
        durationMin: 105,
        durationLabel: "1h 45m",
        room: "Newnham Bldg K - K1272",
        instructor: "Homayoun Mohamadi",
        color: "#0284c7",
        mode: "In-Person"
      }
    ],
    Wednesday: [
      {
        courseCode: "WTP100",
        courseId: "wtp100",
        name: "Work Term Preparation",
        time: "11:40 AM - 1:25 PM",
        startTime: "11:40 AM",
        endTime: "1:25 PM",
        startMin: 700,
        endMin: 805,
        durationMin: 105,
        durationLabel: "1h 45m",
        room: "ONLINE (Blackboard Ultra)",
        instructor: "WIL Co-ordinator",
        color: "#06b6d4",
        mode: "ONLINE Synchronous",
        isOnline: true
      },
      {
        courseCode: "OPS345",
        courseId: "ops345",
        name: "Open System Application Server",
        time: "1:30 PM - 3:15 PM",
        startTime: "1:30 PM",
        endTime: "3:15 PM",
        startMin: 810,
        endMin: 915,
        durationMin: 105,
        durationLabel: "1h 45m",
        room: "Newnham Lab",
        instructor: "Linux Systems Faculty",
        color: "#d97706",
        mode: "In-Person Lab"
      },
      {
        courseCode: "DAT330",
        courseId: "dat330",
        name: "Introduction to Databases",
        time: "5:10 PM - 6:55 PM",
        startTime: "5:10 PM",
        endTime: "6:55 PM",
        startMin: 1030, // 17 * 60 + 10
        endMin: 1135,   // 18 * 60 + 55
        durationMin: 105,
        durationLabel: "1h 45m",
        room: "Newnham Bldg A - A3512",
        instructor: "Parul Kantaria",
        color: "#ef4444",
        mode: "In-Person"
      }
    ],
    Thursday: [
      {
        courseCode: "OPS345",
        courseId: "ops345",
        name: "Open System Application Server",
        time: "8:55 AM - 10:40 AM",
        startTime: "8:55 AM",
        endTime: "10:40 AM",
        startMin: 535, // 8 * 60 + 55
        endMin: 640,   // 10 * 60 + 40
        durationMin: 105,
        durationLabel: "1h 45m",
        room: "Newnham Lab",
        instructor: "Linux Systems Faculty",
        color: "#d97706",
        mode: "In-Person Lab"
      },
      {
        courseCode: "CSN305",
        courseId: "csn305",
        name: "Software Defined Networks",
        time: "12:35 PM - 4:10 PM",
        startTime: "12:35 PM",
        endTime: "4:10 PM",
        startMin: 755, // 12 * 60 + 35
        endMin: 970,   // 16 * 60 + 10
        durationMin: 215,
        durationLabel: "3h 35m",
        room: "Newnham Campus",
        instructor: "Faculty Assigned",
        color: "#22c55e",
        mode: "In-Person"
      }
    ],
    Friday: [
      {
        courseCode: "PSY262",
        courseId: "psy262",
        name: "Mindfulness for Students",
        time: "1:30 PM - 4:10 PM",
        startTime: "1:30 PM",
        endTime: "4:10 PM",
        startMin: 810,
        endMin: 970,
        durationMin: 160,
        durationLabel: "2h 40m",
        room: "ONLINE (Flexible: or Bldg K - K2241)",
        instructor: "Glen Choi",
        color: "#ec4899",
        mode: "ONLINE Flexible",
        isOnline: true
      }
    ]
  };

  // Helper to compute free gaps between consecutive classes on a given day
  const getGapsForDay = (classes) => {
    const gaps = [];
    if (!classes || classes.length <= 1) return gaps;
    for (let i = 0; i < classes.length - 1; i++) {
      const current = classes[i];
      const next = classes[i + 1];
      const gapDuration = next.startMin - current.endMin;
      if (gapDuration > 0) {
        gaps.push({
          id: `gap-${i}`,
          startMin: current.endMin,
          endMin: next.startMin,
          durationMin: gapDuration,
          fromTime: current.endTime,
          toTime: next.startTime,
          fromCourse: current.courseCode,
          toCourse: next.courseCode
        });
      }
    }
    return gaps;
  };

  const displayedDays = selectedDayFilter === 'all' 
    ? days 
    : days.filter(d => d.toLowerCase() === selectedDayFilter.toLowerCase());

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      
      {/* Timetable Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
                Official Fall 2026 Timetable
              </span>
              <span className="text-xs text-slate-400">Seneca Newnham Campus & Online</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight mt-1">
              Weekly Class & Lecture Timetable
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Scaled class durations, gap analysis, and hourly time stamps.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* View Mode Switcher */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setViewMode('grid')}
                aria-label="Switch to time grid view"
                aria-pressed={viewMode === 'grid'}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition ${
                  viewMode === 'grid' 
                    ? 'bg-red-600 text-white shadow' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Time Grid</span>
              </button>
              <button
                onClick={() => setViewMode('compact')}
                aria-label="Switch to compact cards view"
                aria-pressed={viewMode === 'compact'}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition ${
                  viewMode === 'compact' 
                    ? 'bg-red-600 text-white shadow' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Compact Cards</span>
              </button>
            </div>

            {/* Study Planner Gap Optimizer Button */}
            <button
              onClick={() => setCurrentView('planner')}
              aria-label="Open Study & Gap Planner"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600/15 hover:bg-red-600/25 border border-red-500/30 text-red-400 hover:text-red-300 text-xs font-semibold transition"
              title="Optimize campus gap hours in Study Planner"
            >
              <Compass className="w-3.5 h-3.5 text-red-400" />
              <span>Gap Planner</span>
            </button>

            {/* Sync iCal button */}
            <button
              onClick={() => setActiveModal('sync-export')}
              aria-label="Sync Timetable to iPhone or Google Calendar"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold transition"
              title="Sync Timetable to iPhone / Google Calendar"
            >
              <Download className="w-3.5 h-3.5 text-red-400" />
              <span>Sync .ics</span>
            </button>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-red-400" />
              <span>1750 Finch Ave E, Toronto</span>
            </div>
          </div>
        </div>

        {/* Day Filter Pills (Super handy on tablet/mobile) */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 text-[11px] mr-1">Filter Day:</span>
            <button
              onClick={() => setSelectedDayFilter('all')}
              aria-label="View all 5 days"
              aria-pressed={selectedDayFilter === 'all'}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                selectedDayFilter === 'all'
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-950/60'
              }`}
            >
              All 5 Days
            </button>
            {days.map(d => (
              <button
                key={d}
                onClick={() => setSelectedDayFilter(d)}
                aria-label={`View ${d} timetable`}
                aria-pressed={selectedDayFilter === d}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  selectedDayFilter === d
                    ? 'bg-red-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-950/60'
                }`}
              >
                {d.slice(0, 3)}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-md bg-amber-500/20 border border-amber-500/40" />
              <span>☕ Breaks & Free Time</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-md bg-cyan-500/20 border border-cyan-500/40" />
              <span>Online Sessions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Online Synchronous Callout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-slate-300 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/20 text-cyan-300 font-bold font-mono flex items-center justify-center shrink-0">
            <Wifi className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-white">WTP100 - ONLINE (Wednesdays 11:40 AM)</div>
            <div className="text-[11px] text-slate-400">Work Term Preparation synchronous session on Blackboard Ultra</div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-pink-500/10 border border-pink-500/20 text-xs text-slate-300 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-pink-500/20 text-pink-300 font-bold font-mono flex items-center justify-center shrink-0">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-white">PSY262 - ONLINE (Fridays 1:30 PM)</div>
            <div className="text-[11px] text-slate-400">Flexible mode broadcast online simultaneously or attend K2241</div>
          </div>
        </div>
      </div>

      {/* View Mode 1: Scaled Time Grid (Default) */}
      {viewMode === 'grid' ? (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm overflow-x-auto">
          
          {/* Mobile Swipe Hint when viewing all days */}
          {selectedDayFilter === 'all' && (
            <div className="sm:hidden text-[11px] text-slate-400 text-center pb-3 font-mono flex items-center justify-center gap-1.5 border-b border-slate-800/80 mb-3">
              <span>⇄ Swipe horizontally or pick a day above for mobile view</span>
            </div>
          )}

          {/* Calendar Table Container */}
          <div className={`${displayedDays.length === 1 ? 'w-full' : 'min-w-[760px]'} relative`}>
            
            {/* Days Column Header Row */}
            <div className={`grid ${displayedDays.length === 1 ? 'grid-cols-[64px_1fr] sm:grid-cols-[76px_1fr]' : 'grid-cols-[64px_repeat(5,minmax(0,1fr))] sm:grid-cols-[76px_repeat(5,minmax(0,1fr))]'} gap-2 sm:gap-3 pb-3 border-b border-slate-800 mb-2`}>
              {/* Top-left corner cell */}
              <div className="text-center font-mono text-[10px] text-slate-400 pt-1">
                TIME
              </div>

              {/* Day column headers */}
              {displayedDays.map(day => {
                const dayClasses = scheduleData[day] || [];
                const totalMinutes = dayClasses.reduce((sum, c) => sum + c.durationMin, 0);
                const totalHours = (totalMinutes / 60).toFixed(1);

                return (
                  <div key={day} className="px-2 py-1.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-xs sm:text-sm text-white">{day}</span>
                      <div className="text-[10px] font-mono text-slate-400">
                        {dayClasses.length} {dayClasses.length === 1 ? 'class' : 'classes'}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      {totalHours}h
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Timetable Body (Time stamps on left + Day columns) */}
            <div className={`grid ${displayedDays.length === 1 ? 'grid-cols-[64px_1fr] sm:grid-cols-[76px_1fr]' : 'grid-cols-[64px_repeat(5,minmax(0,1fr))] sm:grid-cols-[76px_repeat(5,minmax(0,1fr))]'} gap-2 sm:gap-3 relative`} style={{ height: `${GRID_HEIGHT}px` }}>
              
              {/* Left Column: Hourly Time Stamps */}
              <div className="relative border-r border-slate-800/80 select-none">
                {HOURS.map((h, i) => {
                  const topPx = i * HOUR_HEIGHT;
                  return (
                    <React.Fragment key={h.hour}>
                      {/* Hour stamp */}
                      <div 
                        className="absolute right-2 text-right text-[10px] sm:text-[11px] font-mono font-semibold text-slate-400 -translate-y-1/2 whitespace-nowrap"
                        style={{ top: `${topPx}px` }}
                      >
                        {h.label}
                      </div>

                      {/* Half-hour stamp */}
                      {i < TOTAL_HOURS && (
                        <div 
                          className="absolute right-2 text-right text-[9px] font-mono text-slate-500 -translate-y-1/2 hidden sm:block whitespace-nowrap"
                          style={{ top: `${topPx + (HOUR_HEIGHT / 2)}px` }}
                        >
                          {h.halfLabel}
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Day Columns */}
              {displayedDays.map(day => {
                const dayClasses = scheduleData[day] || [];
                const gaps = getGapsForDay(dayClasses);

                return (
                  <div key={day} className="relative rounded-xl bg-slate-950/40 border border-slate-800/60 overflow-hidden">
                    
                    {/* Background Hourly Gridlines */}
                    {HOURS.map((h, i) => {
                      const topPx = i * HOUR_HEIGHT;
                      return (
                        <React.Fragment key={h.hour}>
                          {/* Hour line */}
                          <div 
                            className="absolute left-0 right-0 border-t border-slate-800/60 pointer-events-none"
                            style={{ top: `${topPx}px` }}
                          />
                          {/* Half-hour dashed line */}
                          {i < TOTAL_HOURS && (
                            <div 
                              className="absolute left-0 right-0 border-t border-slate-800/30 border-dashed pointer-events-none"
                              style={{ top: `${topPx + (HOUR_HEIGHT / 2)}px` }}
                            />
                          )}
                        </React.Fragment>
                      );
                    })}

                    {/* Free Time / Break Cards (Gaps >= 30 min) */}
                    {gaps.map(gap => {
                      if (gap.durationMin < 30) return null;
                      const topPx = (gap.startMin - START_MINUTES) * PIXELS_PER_MINUTE;
                      const heightPx = gap.durationMin * PIXELS_PER_MINUTE;
                      const hours = Math.floor(gap.durationMin / 60);
                      const mins = gap.durationMin % 60;
                      const durationStr = hours > 0 ? (mins > 0 ? `${hours}h ${mins}m` : `${hours}h`) : `${mins}m`;

                      return (
                        <div
                          key={gap.id}
                          onClick={() => setCurrentView('timer')}
                          className="absolute left-1.5 right-1.5 rounded-xl border border-dashed border-amber-500/30 bg-amber-500/[0.04] p-2 flex flex-col items-center justify-center text-center transition-all hover:bg-amber-500/[0.12] hover:border-amber-500/50 cursor-pointer group z-10"
                          style={{
                            top: `${topPx + 3}px`,
                            height: `${heightPx - 6}px`
                          }}
                          title={`Free Break: ${gap.fromTime} to ${gap.toTime} (${durationStr}). Click to start study timer!`}
                        >
                          <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-amber-400/90 group-hover:text-amber-300">
                            <Coffee className="w-3 h-3 text-amber-400 shrink-0" />
                            <span>{durationStr} Break</span>
                          </div>
                          <div className="text-[9px] font-mono text-slate-400 mt-0.5">
                            {gap.fromTime} – {gap.toTime}
                          </div>
                          {heightPx > 65 && (
                            <div className="text-[9px] text-amber-400/90 font-medium group-hover:text-amber-300 mt-1 flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5" />
                              <span>Start Study Timer →</span>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Scaled Class Cards */}
                    {dayClasses.map((item, idx) => {
                      const topPx = (item.startMin - START_MINUTES) * PIXELS_PER_MINUTE;
                      const heightPx = item.durationMin * PIXELS_PER_MINUTE;
                      const isLongBlock = item.durationMin >= 180; // 3+ hours (e.g. CSN305)

                      return (
                        <div
                          key={idx}
                          onClick={() => {
                            setSelectedCourseId(item.courseId);
                            setCurrentView('course-detail');
                          }}
                          className="absolute left-1.5 right-1.5 rounded-xl border p-2.5 sm:p-3 flex flex-col justify-between transition-all cursor-pointer group shadow-lg hover:z-30 hover:scale-[1.01] overflow-hidden"
                          style={{
                            top: `${topPx + 2}px`,
                            height: `${heightPx - 4}px`,
                            backgroundColor: `${item.color}15`,
                            borderColor: `${item.color}45`,
                            borderLeftWidth: '4px',
                            borderLeftColor: item.color
                          }}
                        >
                          {/* Card Top: Code Badge + Duration */}
                          <div>
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span 
                                className="font-mono text-[11px] font-extrabold px-1.5 py-0.5 rounded border"
                                style={{
                                  color: item.color,
                                  backgroundColor: `${item.color}25`,
                                  borderColor: `${item.color}60`
                                }}
                              >
                                {item.courseCode}
                              </span>

                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950/80 text-slate-300 flex items-center gap-1 shrink-0">
                                <Clock className="w-2.5 h-2.5 text-slate-400" />
                                <span>{item.durationLabel}</span>
                              </span>
                            </div>

                            {/* Course Name */}
                            <h4 className="text-xs font-bold text-white group-hover:text-red-400 transition line-clamp-2 leading-tight">
                              {item.name}
                            </h4>

                            {/* Exact Time Span */}
                            <div className="text-[10px] sm:text-[11px] font-mono font-semibold text-slate-300 mt-1 flex items-center gap-1">
                              <span>{item.time}</span>
                            </div>
                          </div>

                          {/* Card Bottom: Room & Professor */}
                          <div className="pt-2 border-t border-slate-800/60 text-[10px] space-y-0.5">
                            <div className="flex items-center gap-1 font-medium truncate" style={{ color: item.isOnline ? '#38bdf8' : '#fbbf24' }}>
                              <MapPin className="w-3 h-3 shrink-0" />
                              <span className="truncate">{item.room}</span>
                            </div>
                            <div className="text-slate-400 truncate text-[9px]">
                              👨‍🏫 {item.instructor}
                            </div>
                            {isLongBlock && (
                              <div className="text-[9px] text-emerald-400 font-semibold pt-0.5">
                                ⚡ Extended 3.5h Lecture & Lab Block
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}

                  </div>
                );
              })}
            </div>

          </div>
        </div>
      ) : (
        /* View Mode 2: Compact Cards List */
        <div className={`grid grid-cols-1 ${displayedDays.length === 1 ? 'md:grid-cols-1 max-w-xl mx-auto' : 'md:grid-cols-5'} gap-4`}>
          {displayedDays.map(day => {
            const dayClasses = scheduleData[day] || [];
            return (
              <div key={day} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col shadow-sm">
                <div className="pb-3 border-b border-slate-800 flex items-center justify-between mb-3">
                  <span className="font-bold text-sm text-white">{day}</span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {dayClasses.length} {dayClasses.length === 1 ? 'class' : 'classes'}
                  </span>
                </div>

                <div className="space-y-3 flex-1">
                  {dayClasses.map((item, idx) => (
                    <div
                      key={idx}
                      role="button"
                      tabIndex={0}
                      aria-label={`View details for ${item.courseCode} ${item.name} at ${item.time}`}
                      onClick={() => {
                        setSelectedCourseId(item.courseId);
                        setCurrentView('course-detail');
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          setSelectedCourseId(item.courseId);
                          setCurrentView('course-detail');
                        }
                      }}
                      className="p-3.5 rounded-xl border transition cursor-pointer group shadow-sm flex flex-col justify-between hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-red-500"
                      style={{
                        backgroundColor: `${item.color}15`,
                        borderColor: `${item.color}45`
                      }}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span 
                            className="font-mono text-xs font-bold px-2 py-0.5 rounded border"
                            style={{
                              color: item.color,
                              backgroundColor: `${item.color}25`,
                              borderColor: `${item.color}60`
                            }}
                          >
                            {item.courseCode}
                          </span>

                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950/80 text-slate-300 font-mono">
                            {item.startTime}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-white group-hover:text-red-400 transition line-clamp-2">
                          {item.name}
                        </h4>

                        <div className="flex items-center gap-1 text-[11px] font-mono text-slate-300 font-semibold mt-2">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.time}</span>
                          <span className="text-[10px] text-slate-400 ml-1">({item.durationLabel})</span>
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-800/60 text-[11px] space-y-1">
                        <div className="flex items-center gap-1 font-medium" style={{ color: item.isOnline ? '#38bdf8' : '#fbbf24' }}>
                          <MapPin className="w-3 h-3 shrink-0" />
                          <span className="truncate">{item.room}</span>
                        </div>
                        <div className="text-slate-400 truncate text-[10px]">
                          {item.instructor}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
