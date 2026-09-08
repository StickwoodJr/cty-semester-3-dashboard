import React, { useState, useEffect, useMemo } from 'react';
import { useAcademic } from '../context/AcademicContext';
import { 
  Calendar, Clock, Target, Sparkles, CheckCircle2, 
  Play, Plus, Trash2, Download, RefreshCw, BookOpen, 
  MapPin, Flame, Award, ChevronRight, AlertCircle, Info,
  CheckSquare, ArrowRight, X, ExternalLink
} from 'lucide-react';
import { generateStudyBlocksIcs, triggerFileDownload } from '../utils/icsExport';

const STUDY_BLOCKS_STORAGE_KEY = 'seneca_cty_study_blocks_v2';
const STUDY_TARGETS_STORAGE_KEY = 'seneca_cty_study_targets_v1';
const TIMER_SESSIONS_STORAGE_KEY = 'seneca_cty_study_sessions_v1';

// Default balanced study plan targeting 4.0 GPA in Seneca CTY Semester 3
const DEFAULT_STUDY_BLOCKS = [
  {
    id: 'block-tue-1',
    day: 'Tuesday',
    courseId: 'ops345',
    courseCode: 'OPS345',
    title: 'Linux Lab Exercises & Bash Scripting',
    startTime: '1:30 PM',
    endTime: '3:30 PM',
    durationMin: 120,
    location: 'Newnham Library 2nd Floor',
    objective: 'Practice systemd service units, cron jobs, and firewalld rules',
    completed: false
  },
  {
    id: 'block-tue-2',
    day: 'Tuesday',
    courseId: 'dat330',
    courseCode: 'DAT330',
    title: 'Azure SQL T-SQL & Schema Design',
    startTime: '3:45 PM',
    endTime: '5:15 PM',
    durationMin: 90,
    location: 'Library Computing Commons',
    objective: 'Write DDL scripts and execute Azure SQL query optimizations',
    completed: false
  },
  {
    id: 'block-wed-1',
    day: 'Wednesday',
    courseId: 'mst300',
    courseCode: 'MST300',
    title: 'Azure Portal Practice & Cost Controls',
    startTime: '9:30 AM',
    endTime: '11:15 AM',
    durationMin: 105,
    location: 'Bldg A Study Lounge',
    objective: 'Deploy Resource Groups, test Virtual Networks & verify deallocation',
    completed: false
  },
  {
    id: 'block-wed-2',
    day: 'Wednesday',
    courseId: 'sec320',
    courseCode: 'SEC320',
    title: 'Wireshark Forensics & NIST Framework',
    startTime: '3:20 PM',
    endTime: '4:50 PM',
    durationMin: 90,
    location: 'Bldg K Student Lounge',
    objective: 'Inspect pcap captures and draft incident response mitigation steps',
    completed: false
  },
  {
    id: 'block-thu-1',
    day: 'Thursday',
    courseId: 'csn305',
    courseCode: 'CSN305',
    title: 'Mininet Topologies & OpenFlow Controller',
    startTime: '10:45 AM',
    endTime: '12:15 PM',
    durationMin: 90,
    location: 'Newnham Library Study Pod',
    objective: 'Build custom topology scripts and verify SDN flow table entries',
    completed: false
  },
  {
    id: 'block-fri-1',
    day: 'Friday',
    courseId: 'ops345',
    courseCode: 'OPS345',
    title: 'Systemd & BIND DNS Lab Deep Work',
    startTime: '9:30 AM',
    endTime: '11:30 AM',
    durationMin: 120,
    location: 'Tech Lab / Home Workstation',
    objective: 'Configure named.conf, zone files, and test named-checkconf',
    completed: false
  },
  {
    id: 'block-sat-1',
    day: 'Saturday',
    courseId: 'csn305',
    courseCode: 'CSN305',
    title: 'SDN OpenFlow Switching & Controller Testing',
    startTime: '10:00 AM',
    endTime: '12:00 PM',
    durationMin: 120,
    location: 'Home Study Desk',
    objective: 'Test Ryu/POX controllers with multi-switch mesh networks',
    completed: false
  },
  {
    id: 'block-sun-1',
    day: 'Sunday',
    courseId: 'dat330',
    courseCode: 'DAT330',
    title: 'Database ERD Modeling & Normalization',
    startTime: '2:00 PM',
    endTime: '4:00 PM',
    durationMin: 120,
    location: 'Home Study Desk',
    objective: 'Decompose relations to 3NF/BCNF and test constraints in Azure SQL',
    completed: false
  },
  {
    id: 'block-sun-2',
    day: 'Sunday',
    courseId: 'wtp100',
    courseCode: 'WTP100',
    title: 'Resume Critique & Co-op Application Prep',
    startTime: '4:30 PM',
    endTime: '5:30 PM',
    durationMin: 60,
    location: 'Home Study Desk',
    objective: 'Polish technical skills section and review Seneca WIL requirements',
    completed: false
  }
];

// Recommended weekly study hour targets for 4.0 GPA
const DEFAULT_TARGETS = {
  ops345: 5.0,
  mst300: 4.0,
  dat330: 4.5,
  csn305: 4.0,
  sec320: 3.5,
  psy262: 2.0,
  wtp100: 1.0
};

export default function StudyPlannerView() {
  const { courses, setCurrentView, showToast } = useAcademic();

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const [selectedDay, setSelectedDay] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Persisted Study Blocks
  const [studyBlocks, setStudyBlocks] = useState(() => {
    try {
      const saved = localStorage.getItem(STUDY_BLOCKS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_STUDY_BLOCKS;
    } catch {
      return DEFAULT_STUDY_BLOCKS;
    }
  });

  // Persisted Weekly Targets (Hours)
  const [courseTargets, setCourseTargets] = useState(() => {
    try {
      const saved = localStorage.getItem(STUDY_TARGETS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_TARGETS;
    } catch {
      return DEFAULT_TARGETS;
    }
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STUDY_BLOCKS_STORAGE_KEY, JSON.stringify(studyBlocks));
    } catch (e) {
      console.error('Failed to save study blocks', e);
    }
  }, [studyBlocks]);

  useEffect(() => {
    try {
      localStorage.setItem(STUDY_TARGETS_STORAGE_KEY, JSON.stringify(courseTargets));
    } catch (e) {
      console.error('Failed to save study targets', e);
    }
  }, [courseTargets]);

  // Read Timer Sessions Logged this Week
  const timerSessions = useMemo(() => {
    try {
      const saved = localStorage.getItem(TIMER_SESSIONS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }, []);

  // Compute logged focus hours per course in the past 7 days
  const loggedHoursByCourse = useMemo(() => {
    const map = {};
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    
    timerSessions.forEach(session => {
      const sessionTime = new Date(session.timestamp).getTime();
      if (!isNaN(sessionTime) && sessionTime >= oneWeekAgo) {
        const cId = session.courseId || session.courseCode?.toLowerCase();
        const mins = Number(session.minutes) || 0;
        map[cId] = (map[cId] || 0) + (mins / 60);
      }
    });
    return map;
  }, [timerSessions]);

  // Compute scheduled hours in blocks per course
  const scheduledHoursByCourse = useMemo(() => {
    const map = {};
    studyBlocks.forEach(block => {
      const cId = block.courseId;
      const hours = (block.durationMin || 90) / 60;
      map[cId] = (map[cId] || 0) + hours;
    });
    return map;
  }, [studyBlocks]);

  // Total Target, Scheduled, and Logged
  const totalTargetHours = Object.values(courseTargets).reduce((a, b) => a + b, 0);
  const totalScheduledHours = Object.values(scheduledHoursByCourse).reduce((a, b) => a + b, 0);
  const totalLoggedHours = Object.values(loggedHoursByCourse).reduce((a, b) => a + b, 0);
  const readinessIndex = Math.min(100, Math.round(((totalScheduledHours + totalLoggedHours * 0.5) / (totalTargetHours || 1)) * 100));

  // Form State for Adding New Study Block
  const [newBlock, setNewBlock] = useState({
    day: 'Tuesday',
    courseId: courses[0]?.id || 'ops345',
    title: '',
    startTime: '10:00 AM',
    endTime: '11:30 AM',
    durationMin: 90,
    location: 'Newnham Library 2nd Floor',
    objective: ''
  });

  // Toggle Block Completion
  const toggleBlockDone = (id) => {
    setStudyBlocks(prev => prev.map(b => {
      if (b.id === id) {
        const updated = !b.completed;
        showToast(updated ? 'Study block marked complete! 🎉' : 'Study block marked pending', 'info');
        return { ...b, completed: updated };
      }
      return b;
    }));
  };

  // Delete Block
  const deleteBlock = (id) => {
    setStudyBlocks(prev => prev.filter(b => b.id !== id));
    showToast('Study block removed from planner', 'info');
  };

  // Reset to default 4.0 schedule
  const handleResetToDefault = () => {
    if (window.confirm('Reset all study blocks to the recommended 4.0 GPA gap-time schedule?')) {
      setStudyBlocks(DEFAULT_STUDY_BLOCKS);
      setCourseTargets(DEFAULT_TARGETS);
      showToast('Restored recommended 4.0 study schedule', 'success');
    }
  };

  // Add new block submission
  const handleAddBlock = (e) => {
    e.preventDefault();
    const course = courses.find(c => c.id === newBlock.courseId);
    const blockToAdd = {
      ...newBlock,
      id: `block-custom-${Date.now()}`,
      courseCode: course ? course.code : 'CTY',
      completed: false,
      title: newBlock.title.trim() || `${course?.code || 'CTY'} Study Session`,
      objective: newBlock.objective.trim() || 'Focused lab practice and course review'
    };

    setStudyBlocks(prev => [...prev, blockToAdd]);
    setIsAddModalOpen(false);
    showToast(`Added study block for ${blockToAdd.courseCode}`, 'success');

    // Reset form
    setNewBlock({
      day: 'Tuesday',
      courseId: courses[0]?.id || 'ops345',
      title: '',
      startTime: '10:00 AM',
      endTime: '11:30 AM',
      durationMin: 90,
      location: 'Newnham Library 2nd Floor',
      objective: ''
    });
  };

  // Export Study Blocks to .ics
  const handleExportIcs = () => {
    try {
      const ics = generateStudyBlocksIcs(studyBlocks);
      triggerFileDownload('Seneca_CTY_Study_Blocks_4.0_Target.ics', ics);
      showToast('Downloaded study schedule (.ics) with 15-min alerts!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to export study calendar', 'error');
    }
  };

  // Switch to Focus Timer with this course pre-selected
  const startTimerForBlock = (block) => {
    setCurrentView('timer');
    showToast(`Focus Timer launched for ${block.courseCode}!`, 'info');
  };

  // Filtered blocks for selected day
  const displayedBlocks = useMemo(() => {
    if (selectedDay === 'All') return studyBlocks;
    return studyBlocks.filter(b => b.day === selectedDay);
  }, [studyBlocks, selectedDay]);

  // Timetable reference by day to display alongside study blocks
  const timetableByDay = {
    Monday: [
      { code: 'MST300', time: '9:50 AM - 11:35 AM', room: 'C3036', name: 'Microsoft Cloud Tech' },
      { code: 'SEC320', time: '1:30 PM - 3:15 PM', room: 'K1272', name: 'Incident Response' },
      { code: 'DAT330', time: '3:20 PM - 5:05 PM', room: 'A1509', name: 'Database Systems' }
    ],
    Tuesday: [
      { code: 'MST300', time: '9:50 AM - 11:35 AM', room: 'A4515', name: 'Microsoft Cloud Tech' },
      { code: 'SEC320', time: '11:40 AM - 1:25 PM', room: 'K1272', name: 'Incident Response' }
    ],
    Wednesday: [
      { code: 'WTP100', time: '11:40 AM - 1:25 PM', room: 'Online Ultra', name: 'Work Term Prep' },
      { code: 'OPS345', time: '1:30 PM - 3:15 PM', room: 'Newnham Lab', name: 'Open System Server' },
      { code: 'DAT330', time: '5:10 PM - 6:55 PM', room: 'A3512', name: 'Database Systems' }
    ],
    Thursday: [
      { code: 'OPS345', time: '8:55 AM - 10:40 AM', room: 'Newnham Lab', name: 'Open System Server' },
      { code: 'CSN305', time: '12:35 PM - 4:10 PM', room: 'Campus', name: 'Software Defined Networks' }
    ],
    Friday: [
      { code: 'PSY262', time: '1:30 PM - 4:10 PM', room: 'Online Flex / K2241', name: 'Mindfulness' }
    ],
    Saturday: [],
    Sunday: []
  };

  // Detected campus gap opportunities
  const gapOpportunities = [
    { day: 'Tuesday', time: '1:25 PM - 6:00 PM', duration: '4h 35m', note: 'Entire afternoon free on campus after SEC320' },
    { day: 'Wednesday', time: '8:00 AM - 11:40 AM', duration: '3h 40m', note: 'Morning window before online WTP100 class' },
    { day: 'Wednesday', time: '3:15 PM - 5:10 PM', duration: '1h 55m', note: 'Campus break between OPS345 and DAT330' },
    { day: 'Thursday', time: '10:40 AM - 12:35 PM', duration: '1h 55m', note: 'Gap between OPS345 lab and CSN305 lecture' },
    { day: 'Friday', time: '8:00 AM - 1:30 PM', duration: '5h 30m', note: 'Deep morning focus before PSY262 online class' }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      
      {/* Hero Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-1">
                <Target className="w-3 h-3 text-red-400" />
                <span>4.0 GPA Strategy</span>
              </span>
              <span className="text-xs text-slate-400">Timetable Gap-Time Optimizer</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight mt-1 flex items-center gap-2">
              <span>Smart Study Block & Gap Planner</span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-normal">
                {studyBlocks.length} Blocks Scheduled
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Turn idle gaps between Seneca campus classes into high-yield 4.0 study sessions. Syncs with Focus Timer & Apple/Google iCal.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition flex items-center gap-1.5 shadow-lg shadow-red-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add Study Block</span>
            </button>
            <button
              onClick={handleExportIcs}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition flex items-center gap-1.5"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Export to Phone (.ics)</span>
            </button>
            <button
              onClick={handleResetToDefault}
              title="Reset to recommended 4.0 gap schedule"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4.0 Study Hour Progress Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-800/80">
          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80">
            <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <Target className="w-3 h-3 text-red-400" />
              <span>Weekly Target</span>
            </div>
            <div className="text-xl font-extrabold text-white font-mono mt-0.5">
              {totalTargetHours.toFixed(1)} <span className="text-xs font-normal text-slate-400">hrs</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">For 4.0 A/A+ Mastery</div>
          </div>

          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80">
            <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-blue-400" />
              <span>Scheduled Blocks</span>
            </div>
            <div className="text-xl font-extrabold text-blue-400 font-mono mt-0.5">
              {totalScheduledHours.toFixed(1)} <span className="text-xs font-normal text-slate-400">hrs</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {((totalScheduledHours / (totalTargetHours || 1)) * 100).toFixed(0)}% of target planned
            </div>
          </div>

          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80">
            <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-400" />
              <span>Focus Timer Logged</span>
            </div>
            <div className="text-xl font-extrabold text-amber-400 font-mono mt-0.5">
              {totalLoggedHours.toFixed(1)} <span className="text-xs font-normal text-slate-400">hrs</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Past 7 days completed</div>
          </div>

          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80">
            <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <Award className="w-3 h-3 text-emerald-400" />
              <span>4.0 Readiness Score</span>
            </div>
            <div className="text-xl font-extrabold text-emerald-400 font-mono mt-0.5">
              {readinessIndex}%
            </div>
            <div className="text-[10px] text-emerald-400 font-medium mt-0.5">
              {readinessIndex >= 85 ? '⭐ Distinction Pace' : readinessIndex >= 60 ? '✓ Solid Momentum' : '⚠️ Plan More Blocks'}
            </div>
          </div>
        </div>
      </div>

      {/* Campus Gap Discovery Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950/20 to-slate-900 border border-blue-500/20 rounded-2xl p-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
              ⚡
            </div>
            <div>
              <h3 className="text-xs font-bold text-white flex items-center gap-2">
                <span>Discovered Campus Gap Windows</span>
                <span className="text-[10px] font-normal text-blue-300 px-2 py-0.2 rounded bg-blue-500/10 border border-blue-500/20">
                  5 High-Yield Windows Found
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Natural breaks in your Seneca schedule ideal for library review and lab prep without commuting home.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {gapOpportunities.slice(0, 3).map((gap, i) => (
              <div 
                key={i} 
                onClick={() => {
                  setNewBlock(prev => ({
                    ...prev,
                    day: gap.day,
                    startTime: gap.time.split(' - ')[0],
                    endTime: gap.time.split(' - ')[1],
                    location: 'Newnham Library'
                  }));
                  setIsAddModalOpen(true);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-blue-500/40 text-[11px] cursor-pointer transition group"
              >
                <span className="font-semibold text-white group-hover:text-blue-400 transition">{gap.day}: </span>
                <span className="text-blue-400 font-mono font-medium">{gap.duration}</span>
                <span className="text-slate-400 text-[10px] ml-1">({gap.time})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Day Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {['All', ...daysOfWeek].map(day => {
          const active = selectedDay === day;
          const count = day === 'All' 
            ? studyBlocks.length 
            : studyBlocks.filter(b => b.day === day).length;
          
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                active 
                  ? 'bg-red-600 text-white shadow-sm' 
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <span>{day}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                active ? 'bg-red-700/80 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Grid: Scheduled Blocks & Class Reference */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Study Blocks Timeline */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-red-400" />
              <span>{selectedDay === 'All' ? 'All Scheduled Study Blocks' : `${selectedDay} Study Schedule`}</span>
            </h3>
            <span className="text-xs text-slate-400">
              {displayedBlocks.filter(b => b.completed).length}/{displayedBlocks.length} completed
            </span>
          </div>

          {displayedBlocks.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
              <Clock className="w-8 h-8 text-slate-600 mx-auto" />
              <div className="text-sm font-semibold text-slate-300">No study blocks planned for {selectedDay}</div>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Schedule focused blocks during your free campus hours to stay ahead of upcoming lab submissions and 4.0 targets.
              </p>
              <button
                onClick={() => {
                  setNewBlock(prev => ({ ...prev, day: selectedDay === 'All' ? 'Tuesday' : selectedDay }));
                  setIsAddModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-500 transition"
              >
                + Schedule Block
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {displayedBlocks.map((block) => {
                const course = courses.find(c => c.id === block.courseId);
                const color = course?.color || '#ef4444';
                
                return (
                  <div 
                    key={block.id}
                    className={`p-4 rounded-2xl border transition relative overflow-hidden group ${
                      block.completed 
                        ? 'bg-slate-950/60 border-slate-800/60 opacity-80' 
                        : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow-sm'
                    }`}
                  >
                    {/* Left Accent Bar */}
                    <div 
                      className="absolute top-0 bottom-0 left-0 w-1.5"
                      style={{ backgroundColor: color }}
                    />

                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pl-2">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            onClick={() => toggleBlockDone(block.id)}
                            className={`p-1 rounded transition ${
                              block.completed ? 'text-emerald-400 hover:text-emerald-300' : 'text-slate-500 hover:text-slate-300'
                            }`}
                            title={block.completed ? 'Mark pending' : 'Mark complete'}
                          >
                            <CheckCircle2 className={`w-4 h-4 ${block.completed ? 'fill-emerald-500/20' : ''}`} />
                          </button>

                          <span 
                            className="font-mono text-[11px] font-bold px-1.5 py-0.5 rounded border"
                            style={{
                              color: color,
                              backgroundColor: `${color}15`,
                              borderColor: `${color}40`
                            }}
                          >
                            {block.courseCode}
                          </span>

                          <span className="text-xs font-semibold text-white group-hover:text-slate-100">
                            {block.title}
                          </span>

                          {selectedDay === 'All' && (
                            <span className="text-[10px] font-medium text-slate-400 bg-slate-800 px-2 py-0.2 rounded-full">
                              {block.day}
                            </span>
                          )}

                          {block.completed && (
                            <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.2 rounded-full">
                              Done
                            </span>
                          )}
                        </div>

                        {/* Objectives & Notes */}
                        <p className="text-xs text-slate-300 pl-6 leading-relaxed">
                          {block.objective}
                        </p>

                        {/* Meta Tags */}
                        <div className="flex flex-wrap items-center gap-3 pl-6 pt-1 text-[11px] text-slate-400">
                          <span className="flex items-center gap-1 font-mono text-slate-300">
                            <Clock className="w-3.5 h-3.5 text-slate-500" />
                            <span>{block.startTime} - {block.endTime}</span>
                            <span className="text-slate-400">({block.durationMin}m)</span>
                          </span>

                          {block.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-500" />
                              <span>{block.location}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right Action Icons */}
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          onClick={() => startTimerForBlock(block)}
                          className="px-2.5 py-1.5 rounded-lg bg-red-600/15 text-red-400 border border-red-500/30 hover:bg-red-600 hover:text-white text-xs font-medium transition flex items-center gap-1"
                          title="Start focus timer for this block"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Focus</span>
                        </button>
                        <button
                          onClick={() => deleteBlock(block.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                          title="Remove block"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Col: Course Allocation & Daily Class Overview */}
        <div className="space-y-6">
          
          {/* Course 4.0 Weekly Allocation Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-red-400" />
                <span>Weekly Course Targets</span>
              </h3>
              <span className="text-[10px] text-slate-400">Hours Target vs Planned</span>
            </div>

            <div className="space-y-3">
              {courses.map(course => {
                const target = courseTargets[course.id] || 0;
                const scheduled = scheduledHoursByCourse[course.id] || 0;
                const logged = loggedHoursByCourse[course.id] || 0;
                const pct = target > 0 ? Math.min(100, Math.round((scheduled / target) * 100)) : 100;
                const isMet = scheduled >= target;

                return (
                  <div key={course.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <span 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: course.color }}
                        />
                        <span className="font-mono font-semibold text-white">{course.code}</span>
                      </div>
                      <div className="font-mono text-[11px] text-slate-300">
                        <span className={isMet ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                          {scheduled.toFixed(1)}h
                        </span>
                        <span className="text-slate-400"> / {target.toFixed(1)}h</span>
                        {logged > 0 && (
                          <span className="text-[10px] text-slate-400 ml-1">({logged.toFixed(1)}h done)</span>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden flex">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          isMet ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span>Total Weekly Commitment:</span>
              <span className="font-mono font-bold text-white">{totalScheduledHours.toFixed(1)} hrs</span>
            </div>
          </div>

          {/* Daily Schedule Reference Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span>Timetable Context ({selectedDay === 'All' ? 'Monday' : selectedDay})</span>
            </h3>

            {(() => {
              const dayClasses = timetableByDay[selectedDay === 'All' ? 'Monday' : selectedDay] || [];
              if (dayClasses.length === 0) {
                return (
                  <div className="text-xs text-slate-400 py-3 text-center">
                    No scheduled lectures or labs today. Ideal for weekend deep work!
                  </div>
                );
              }
              return (
                <div className="space-y-2">
                  {dayClasses.map((cls, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold text-white">{cls.code}: {cls.name}</div>
                        <div className="text-[10px] text-slate-400">{cls.room}</div>
                      </div>
                      <div className="font-mono text-slate-300 text-[11px] text-right">
                        {cls.time}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>

        </div>
      </div>

      {/* Add Study Block Modal */}
      {isAddModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-study-block-title"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div 
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 id="add-study-block-title" className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-red-400" />
                <span>Schedule New Study Block</span>
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)} 
                className="text-slate-400 hover:text-white p-1"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddBlock} className="space-y-4 text-xs">
              
              {/* Course Selection */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Course</label>
                <select
                  value={newBlock.courseId}
                  onChange={(e) => setNewBlock(prev => ({ ...prev, courseId: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-medium focus:border-red-500 focus:outline-none"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.code} — {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Day & Duration */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Day</label>
                  <select
                    value={newBlock.day}
                    onChange={(e) => setNewBlock(prev => ({ ...prev, day: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-medium focus:border-red-500 focus:outline-none"
                  >
                    {daysOfWeek.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    min="15"
                    step="15"
                    value={newBlock.durationMin}
                    onChange={(e) => setNewBlock(prev => ({ ...prev, durationMin: parseInt(e.target.value, 10) || 60 }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Start & End Times */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Start Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 10:00 AM"
                    value={newBlock.startTime}
                    onChange={(e) => setNewBlock(prev => ({ ...prev, startTime: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:border-red-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">End Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 11:30 AM"
                    value={newBlock.endTime}
                    onChange={(e) => setNewBlock(prev => ({ ...prev, endTime: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:border-red-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Title / Topic */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Session Title</label>
                <input
                  type="text"
                  placeholder="e.g. BIND DNS Setup & Zone File Review"
                  value={newBlock.title}
                  onChange={(e) => setNewBlock(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-red-500 focus:outline-none"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Location</label>
                <input
                  type="text"
                  placeholder="e.g. Newnham Library 2nd Floor / Computing Commons"
                  value={newBlock.location}
                  onChange={(e) => setNewBlock(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-red-500 focus:outline-none"
                />
              </div>

              {/* Objective */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Study Objective & Notes</label>
                <textarea
                  rows="2"
                  placeholder="What specific tasks or exercises will you master during this block?"
                  value={newBlock.objective}
                  onChange={(e) => setNewBlock(prev => ({ ...prev, objective: e.target.value }))}
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
                  Save Study Block
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
