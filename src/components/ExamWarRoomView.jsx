import React, { useState, useEffect } from 'react';
import { useAcademic } from '../context/AcademicContext';
import { 
  Award, Clock, Calendar, Shield, FileText, CheckCircle2, 
  AlertTriangle, Sparkles, Timer, BookOpen, ChevronRight, 
  CheckSquare, ArrowUpRight, Flame, Target, Info
} from 'lucide-react';
import { getDueUrgency, getDaysUntil } from '../utils/dateHelper';

const READINESS_STORAGE_KEY = 'seneca_cty_exam_readiness_v1';

export default function ExamWarRoomView() {
  const { 
    courses, 
    getAllAssessments, 
    setCurrentView, 
    setSelectedCourseId, 
    setActiveModal, 
    setModalPayload,
    showToast
  } = useAcademic();

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'midterms' | 'finals' | 'checklist'
  
  // Persisted exam prep checklist state
  const [prepChecklist, setPrepChecklist] = useState(() => {
    try {
      const saved = localStorage.getItem(READINESS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {
        'ops-midterm-sheet': false,
        'ops-bind-syntax': false,
        'mst-azure-vnet': false,
        'mst-budget-check': true,
        'sec-forensics-playbook': false,
        'dat-normalization-rules': false,
        'dat-erd-cardinality': false,
        'csn-mininet-commands': false,
        'psy-mindfulness-quiz': false,
        'ops-final-sheet': false
      };
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(READINESS_STORAGE_KEY, JSON.stringify(prepChecklist));
    } catch (e) {
      console.error('Failed to save readiness checklist', e);
    }
  }, [prepChecklist]);

  const toggleCheck = (id) => {
    setPrepChecklist(prev => {
      const updated = { ...prev, [id]: !prev[id] };
      showToast(updated[id] ? 'Checklist item marked complete!' : 'Item uncompleted', 'info');
      return updated;
    });
  };

  const allTasks = getAllAssessments();

  // High-stakes evaluations: weight >= 15% OR category is Exam/Test
  const examTasks = allTasks.filter(t => 
    t.weight >= 15 || 
    t.category === 'Exam' || 
    t.category === 'Test' ||
    t.name.toLowerCase().includes('midterm') ||
    t.name.toLowerCase().includes('final')
  );

  // Categorize
  const midtermTasks = examTasks.filter(t => 
    t.week <= 8 || 
    t.name.toLowerCase().includes('midterm') ||
    t.name.toLowerCase().includes('practical test 1')
  );

  const finalTasks = examTasks.filter(t => 
    t.week >= 9 || 
    t.name.toLowerCase().includes('final') ||
    t.name.toLowerCase().includes('practical test 2')
  );

  // Countdowns
  const midtermTarget = new Date(2026, 9, 19); // Oct 19, 2026
  const finalTarget = new Date(2026, 11, 7);   // Dec 7, 2026

  const daysToMidterm = Math.max(0, getDaysUntil('2026-10-19') || 0);
  const daysToFinals = Math.max(0, getDaysUntil('2026-12-07') || 0);

  // Displayed tasks
  const displayedTasks = activeTab === 'midterms' 
    ? midtermTasks 
    : activeTab === 'finals' 
    ? finalTasks 
    : examTasks;

  const totalExamWeight = examTasks.reduce((sum, t) => sum + (parseFloat(t.weight) || 0), 0);
  const completedExamCount = examTasks.filter(t => t.status === 'Graded').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-rose-950/40 border border-slate-800 p-6 sm:p-8 shadow-xl">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                ⭐ High-Stakes Evaluation Command Center
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {examTasks.length} Major Exams & Tests • {totalExamWeight.toFixed(0)}% Total Term Weight
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Exam & Midterm War Room
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Tracking all high-stakes tests, midterm exam week, permitted cheat sheets (OPS345 handwritten rules), official passing thresholds, and study readiness checklists.
            </p>

            {/* Countdown Milestone Badges */}
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700/70 text-slate-200">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Midterms (Oct 19):</span>
                <span className="font-extrabold text-amber-400 font-mono text-sm">{daysToMidterm} days left</span>
              </div>

              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700/70 text-slate-200">
                <Award className="w-4 h-4 text-rose-400" />
                <span>Final Exams (Dec 7):</span>
                <span className="font-extrabold text-rose-400 font-mono text-sm">{daysToFinals} days left</span>
              </div>
            </div>
          </div>

          <div className="flex sm:flex-col gap-2.5 shrink-0">
            <button
              onClick={() => setCurrentView('timer')}
              className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs shadow-lg shadow-red-900/30 transition flex items-center justify-center gap-2"
            >
              <Timer className="w-4 h-4" />
              <span>Start Exam Study Sprint</span>
            </button>
            <button
              onClick={() => setCurrentView('schedule')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition flex items-center justify-center gap-2"
            >
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Timetable & Rooms</span>
            </button>
          </div>
        </div>
      </div>

      {/* Official Exam Rules & Permitted Aids Alert Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <Shield className="w-4 h-4 text-amber-400" />
          <span>Seneca Official Syllabus Exam Thresholds & Permitted Aids</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {/* Rule 1: OPS345 Reference Sheet */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-amber-500/30 space-y-1.5">
            <div className="font-bold text-amber-400 flex items-center gap-1.5">
              <span>📄 OPS345 Handwritten Sheet</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              <strong>Midterm:</strong> Exactly ONE 1-sided 8.5"x11" handwritten sheet.<br />
              <strong>Final Test:</strong> Exactly ONE 2-sided 8.5"x11" handwritten sheet. Must be handed in with exam!
            </p>
          </div>

          {/* Rule 2: SEC320 Practical 50% Rule */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-sky-500/30 space-y-1.5">
            <div className="font-bold text-sky-400 flex items-center gap-1.5">
              <span>⚖️ SEC320 50% Test Threshold</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Must achieve a weighted average of <strong>≥50% on all tests</strong> AND <strong>≥50% on all labs</strong>. Failing test average results in an automatic F!
            </p>
          </div>

          {/* Rule 3: DAT330 3-Category Rule */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-rose-500/30 space-y-1.5">
            <div className="font-bold text-rose-400 flex items-center gap-1.5">
              <span>📊 DAT330 3-Category Threshold</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Parul Kantaria enforces <strong>≥50% weighted on Tests</strong> (Midterm 15% + Final 15%) independently of lab and assignment scores.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-xl transition ${
              activeTab === 'all' 
                ? 'bg-red-600 text-white shadow' 
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All Major Evaluations ({examTasks.length})
          </button>
          <button
            onClick={() => setActiveTab('midterms')}
            className={`px-3.5 py-1.5 rounded-xl transition ${
              activeTab === 'midterms' 
                ? 'bg-red-600 text-white shadow' 
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Midterms & Tests ({midtermTasks.length})
          </button>
          <button
            onClick={() => setActiveTab('finals')}
            className={`px-3.5 py-1.5 rounded-xl transition ${
              activeTab === 'finals' 
                ? 'bg-red-600 text-white shadow' 
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Final Exams & Projects ({finalTasks.length})
          </button>
          <button
            onClick={() => setActiveTab('checklist')}
            className={`px-3.5 py-1.5 rounded-xl transition ${
              activeTab === 'checklist' 
                ? 'bg-red-600 text-white shadow' 
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Readiness Checklist
          </button>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          Completed: <strong className="text-emerald-400">{completedExamCount}</strong> / {examTasks.length}
        </div>
      </div>

      {/* Content: Task Cards or Checklist */}
      {activeTab !== 'checklist' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedTasks.map(task => {
            const urgency = getDueUrgency(task.dueDate);
            const course = courses.find(c => c.id === task.courseId);
            const isCompleted = task.status === 'Graded';

            return (
              <div 
                key={task.id}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4.5 hover:border-slate-700 transition flex flex-col justify-between shadow-sm relative overflow-hidden group"
              >
                {/* Accent line */}
                <div 
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ backgroundColor: task.courseColor || '#ef4444' }}
                />

                <div className="space-y-3">
                  {/* Top line: Course badge + Weight */}
                  <div className="flex items-center justify-between">
                    <span 
                      className="font-mono text-xs font-bold px-2 py-0.5 rounded border"
                      style={{
                        color: task.courseColor,
                        backgroundColor: `${task.courseColor}15`,
                        borderColor: `${task.courseColor}40`
                      }}
                    >
                      {task.courseCode}
                    </span>

                    <span className="text-xs font-mono font-extrabold px-2 py-0.5 rounded bg-slate-950 text-white border border-slate-800">
                      {task.weight}% <span className="text-[10px] text-slate-400 font-normal">weight</span>
                    </span>
                  </div>

                  {/* Title & Category */}
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-red-400 transition leading-snug">
                      {task.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                      {task.topic || task.name}
                    </p>
                  </div>

                  {/* Urgency & Date Badge */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${urgency.badgeClass}`}>
                      {urgency.label}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      {task.dueDate}
                    </span>
                  </div>

                  {/* Score or Status */}
                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px]">Score / Status:</span>
                    {task.score !== null ? (
                      <span className="font-mono font-bold text-emerald-400">
                        {task.score}% ({task.status})
                      </span>
                    ) : (
                      <span className="text-amber-400 font-medium text-[11px]">
                        {task.status}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      setSelectedCourseId(task.courseId);
                      setCurrentView('timer');
                    }}
                    className="flex-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold transition flex items-center justify-center gap-1.5"
                    title="Start focus timer for this course"
                  >
                    <Timer className="w-3.5 h-3.5 text-red-400" />
                    <span>Study Sprint</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveModal('edit-task');
                      setModalPayload({ courseId: task.courseId, assessment: task });
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 text-xs transition"
                    title="Enter exam score"
                  >
                    Enter Score
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Tab: Exam Study Readiness Checklist */
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-emerald-400" />
              <span>Seneca CTY Semester 3 Exam Readiness Master Checklist</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Step-by-step preparation criteria to secure a 4.0 GPA on midterms and final exams.
            </p>
          </div>

          <div className="divide-y divide-slate-800/80">
            {[
              { id: 'ops-midterm-sheet', course: 'OPS345', title: 'Prepare OPS345 Midterm 1-Sided Handwritten Cheat Sheet', desc: 'Must be written by hand on 8.5"x11" paper. Include systemd syntax, Apache VirtualHost blocks, and firewalld commands.' },
              { id: 'ops-bind-syntax', course: 'OPS345', title: 'Test BIND DNS Zone File Syntax Locally', desc: 'Ensure you can write named.conf and forward/reverse zone files from memory using named-checkconf and named-checkzone.' },
              { id: 'mst-azure-vnet', course: 'MST300', title: 'Review Azure Virtual Networks & NSG Security Rules', desc: 'Review VNet peering, Network Security Groups, and default Azure inbound ports for MST300 midterm project.' },
              { id: 'mst-budget-check', course: 'MST300', title: 'Confirm Azure Subscription Budget Compliance', desc: 'Ensure all test VMs are in deallocated state to preserve credit allocation.' },
              { id: 'sec-forensics-playbook', course: 'SEC320', title: 'Memorize Incident Response 6-Step Playbook', desc: 'Preparation, Identification, Containment, Eradication, Recovery, Lessons Learned (NIST SP 800-61).' },
              { id: 'dat-normalization-rules', course: 'DAT330', title: 'Master 1NF, 2NF, 3NF, and BCNF Functional Dependencies', desc: 'Parul Kantaria exams heavily test decomposing unnormalized schemas into BCNF tables with candidate keys.' },
              { id: 'dat-erd-cardinality', course: 'DAT330', title: 'Practice Crow\'s Foot ERD Cardinality & Foreign Keys', desc: 'Review 1:1, 1:N, and M:N junction table design and ON DELETE CASCADE constraints.' },
              { id: 'csn-mininet-commands', course: 'CSN305', title: 'Review OpenFlow Controller & Mininet Topologies', desc: 'Familiarize with Open vSwitch flow table rules and SDN controller architecture.' },
              { id: 'ops-final-sheet', course: 'OPS345', title: 'Prepare OPS345 Final Test 2-Sided Handwritten Cheat Sheet', desc: 'Add NFS exports, SELinux restorecon commands, and AWS EC2 management snippets.' }
            ].map(item => {
              const isChecked = Boolean(prepChecklist[item.id]);
              return (
                <div 
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className="py-3.5 flex items-start gap-3.5 cursor-pointer hover:bg-slate-950/40 p-2 rounded-xl transition group"
                >
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center border mt-0.5 transition ${
                    isChecked 
                      ? 'bg-emerald-500 border-emerald-500 text-slate-950' 
                      : 'border-slate-700 group-hover:border-slate-500 bg-slate-950'
                  }`}>
                    {isChecked && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                        {item.course}
                      </span>
                      <h4 className={`text-xs font-semibold ${isChecked ? 'line-through text-slate-500' : 'text-slate-100 group-hover:text-white'}`}>
                        {item.title}
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
