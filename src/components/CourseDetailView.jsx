import React, { useState } from 'react';
import { useAcademic } from '../context/AcademicContext';
import { 
  BookOpen, Mail, MapPin, Clock, ExternalLink, Edit, 
  Plus, CheckCircle2, AlertTriangle, Cloud, Calculator, 
  Trash2, ShieldCheck, ChevronRight, FileText, Check, AlertCircle
} from 'lucide-react';

export default function CourseDetailView() {
  const { 
    courses, 
    selectedCourseId, 
    setSelectedCourseId, 
    updateAssessment, 
    deleteAssessment,
    updateBudgetSpend,
    toggleWtpModule,
    setActiveModal, 
    setModalPayload, 
    getCourseMetrics,
    showToast
  } = useAcademic();

  const course = courses.find(c => c.id === selectedCourseId) || courses[0];
  if (!course) return <div className="p-8 text-center text-slate-400">Course not found</div>;

  const metrics = getCourseMetrics(course);
  const [activeTab, setActiveTab] = useState('assessments'); // 'assessments' | 'tools' | 'notes'
  const [courseNotes, setCourseNotes] = useState(() => {
    try {
      return localStorage.getItem(`seneca_notes_${course.id}`) || course.notes || '';
    } catch {
      return course.notes || '';
    }
  });

  const saveNotes = (val) => {
    setCourseNotes(val);
    try {
      localStorage.setItem(`seneca_notes_${course.id}`, val);
    } catch (e) {
      console.error(e);
    }
  };

  // Group assessments by category
  const categoriesMap = {};
  (course.assessments || []).forEach(a => {
    if (!categoriesMap[a.category]) categoriesMap[a.category] = [];
    categoriesMap[a.category].push(a);
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      
      {/* Course Header Banner */}
      <div 
        className="relative rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl overflow-hidden"
        style={{
          background: `linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, ${course.color}25 100%)`
        }}
      >
        <div 
          className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-20"
          style={{ backgroundColor: course.color }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span 
                className="font-mono text-xs font-extrabold px-2.5 py-1 rounded-md border"
                style={{
                  color: course.color,
                  backgroundColor: `${course.color}20`,
                  borderColor: `${course.color}50`
                }}
              >
                {course.code}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 font-semibold">
                Section {course.section || 'NBB'} • Class #{course.classNbr || 'TBA'}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                {course.delivery || 'In-Person'}
              </span>
              {course.isCustomizable && (
                <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Customizable Course
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {course.name}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {course.description}
            </p>

            {/* Instructor & Meeting Info */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <span className="text-slate-400">Instructor:</span>
                <span className="font-semibold text-white">{course.professor}</span>
                {course.email && (
                  <a 
                    href={`mailto:${course.email}?subject=[${course.code}] Question from Student`}
                    className="p-1 rounded hover:bg-slate-800 text-red-400 hover:text-red-300 transition"
                    title={`Email ${course.professor}`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              <div className="flex items-center gap-2 text-slate-300">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-400">Office Hours:</span>
                <span className="truncate">{course.officeHours || 'By appointment'}</span>
              </div>

              {/* Schedules */}
              <div className="sm:col-span-2 flex flex-wrap items-center gap-3 pt-1">
                {(course.schedule || []).map((slot, sIdx) => (
                  <div key={sIdx} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300 text-[11px]">
                    <MapPin className="w-3 h-3 text-red-400 shrink-0" />
                    <span className="font-semibold text-white">{slot.day}:</span>
                    <span>{slot.time}</span>
                    <span className="text-amber-400/90 font-medium">({slot.room})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Action Stack */}
          <div className="flex flex-col gap-2 shrink-0">
            <button
              onClick={() => {
                setActiveModal('edit-course');
                setModalPayload({ course });
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit Course Details</span>
            </button>

            <button
              onClick={() => {
                setActiveModal('what-if');
                setModalPayload({ course });
              }}
              className="px-3.5 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Grade Target Simulator</span>
            </button>

            {/* Syllabus Links */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {(course.links || []).map((l, lIdx) => (
                <a
                  key={lIdx}
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-slate-950/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-[11px] font-medium flex items-center gap-1 transition"
                >
                  <span>{l.label}</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grade Metrics & Passing Criteria Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Current Grade Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Current Standing</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
              Weight: {metrics.completedWeight.toFixed(1)}% / 100%
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-3xl font-extrabold text-emerald-400 font-mono">
                {metrics.currentAverage !== null ? `${Math.round(metrics.currentAverage)}%` : '--'}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Letter Grade: <span className="font-bold text-white">{metrics.letterGrade}</span>
              </div>
            </div>

            <div className="text-right font-mono text-xs text-slate-400">
              <div>Earned: <span className="text-white font-bold">{metrics.earnedWeight.toFixed(1)} pts</span></div>
              <div>Remaining: <span className="text-slate-300">{(100 - metrics.completedWeight).toFixed(1)} pts</span></div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all"
              style={{
                width: `${Math.min(100, metrics.completedWeight)}%`,
                backgroundColor: course.color || '#3b82f6'
              }}
            />
          </div>
        </div>

        {/* Passing Thresholds & Official Policy */}
        <div className="md:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Official Syllabus Passing Thresholds
              </h3>
            </div>
            {course.latePolicy && (
              <span className="text-[10px] text-amber-400/90 font-medium">
                ⚠️ Late Penalty: 10%/day (max 3 days)
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {(course.passingRequirements || []).map((req, rIdx) => (
              <div key={rIdx} className="flex items-start gap-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{req}</span>
              </div>
            ))}
          </div>

          {course.id === 'ops345' && (
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center justify-between">
              <span className="font-semibold">
                📝 Test Reference Sheet Policy: Handwritten only! 1-sided for Midterm, 2-sided for Final.
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 font-bold">STRICT</span>
            </div>
          )}
        </div>
      </div>

      {/* Special Course Tools (AWS Learner Lab, Azure, WTP Modules, etc.) */}
      {course.id === 'ops345' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cloud className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="text-sm font-bold text-white">AWS Learner Lab $50 Budget Burn-down Monitor</h3>
                <p className="text-xs text-slate-400">Strict $50 limit. If exhausted, account is locked with zero refills!</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Update Spend: $</span>
              <input
                type="number"
                step="0.5"
                min="0"
                max="50"
                defaultValue={course.budgetTracker?.currentSpend || 0}
                onBlur={(e) => updateBudgetSpend(course.id, e.target.value)}
                className="w-20 px-2 py-1 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-white text-right focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
            <div 
              className={`h-full rounded-full transition-all ${
                ((course.budgetTracker?.currentSpend || 0) / 50) > 0.8 ? 'bg-red-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, Math.round(((course.budgetTracker?.currentSpend || 0) / 50) * 100))}%` }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-slate-400 text-[11px]">Total Credit Pool</div>
              <div className="text-lg font-bold text-white mt-0.5">$50.00 USD</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-slate-400 text-[11px]">Current Total Spend</div>
              <div className="text-lg font-bold text-amber-400 mt-0.5">${(course.budgetTracker?.currentSpend || 0).toFixed(2)} USD</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-slate-400 text-[11px]">Remaining Safe Balance</div>
              <div className="text-lg font-bold text-emerald-400 mt-0.5">
                ${(50 - (course.budgetTracker?.currentSpend || 0)).toFixed(2)} USD
              </div>
            </div>
          </div>
        </div>
      )}

      {course.id === 'wtp100' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>14 Weekly Modules & Co-op Readiness</span>
                <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                  Deadline: Oct 23, 2026
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Must score 80% or higher on each module knowledge check to earn Satisfactory (SAT) grade.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {(course.modulesList || []).map(m => (
              <div
                key={m.id}
                onClick={() => toggleWtpModule(m.id)}
                className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 cursor-pointer transition ${
                  m.completed 
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-white' 
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                    m.completed ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-slate-700'
                  }`}>
                    {m.completed && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className="text-xs truncate">M{m.id}: {m.title}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 shrink-0">≥80%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs Row: Assessments vs Notes */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('assessments')}
            className={`pb-2 border-b-2 transition ${
              activeTab === 'assessments' 
                ? 'border-red-500 text-white' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            All Course Assessments ({course.assessments?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`pb-2 border-b-2 transition ${
              activeTab === 'notes' 
                ? 'border-red-500 text-white' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Course Notes & Scratchpad
          </button>
        </div>

        {activeTab === 'assessments' && (
          <button
            onClick={() => {
              setActiveModal('add-task');
              setModalPayload({ courseId: course.id });
            }}
            className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Assessment</span>
          </button>
        )}
      </div>

      {/* Tab 1: Assessments Table */}
      {activeTab === 'assessments' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 text-[10px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Evaluation Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4 text-right">Weight</th>
                <th className="py-3 px-4 text-center">Score</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {(course.assessments || []).map(task => {
                const isDone = task.status === 'Graded';
                return (
                  <tr key={task.id} className="hover:bg-slate-800/40 transition group">
                    <td className="py-3 px-4">
                      <button
                        onClick={() => {
                          const order = ['Not Started', 'In Progress', 'Submitted', 'Graded'];
                          const nextIdx = (order.indexOf(task.status) + 1) % order.length;
                          updateAssessment(course.id, task.id, {
                            status: order[nextIdx],
                            score: order[nextIdx] === 'Graded' && task.score === null ? 100 : task.score
                          });
                        }}
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                          task.status === 'Graded' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' :
                          task.status === 'Submitted' ? 'bg-blue-500/15 text-blue-400 border-blue-500/30' :
                          task.status === 'In Progress' ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' :
                          'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {task.status}
                      </button>
                    </td>

                    <td className="py-3 px-4">
                      <div className={`font-semibold ${isDone ? 'text-slate-400 line-through' : 'text-white'}`}>
                        {task.name}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-sm">
                        {task.topic}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {task.category}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-300">
                      <div>{task.dueDate}</div>
                      {task.week && <div className="text-[10px] text-slate-400">Week {task.week}</div>}
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-200">
                      {task.weight}%
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => {
                          setActiveModal('edit-task');
                          setModalPayload({ courseId: course.id, assessment: task });
                        }}
                        className={`font-mono text-xs px-2.5 py-0.5 rounded ${
                          task.score !== null 
                            ? 'bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30'
                            : 'text-slate-500 border border-dashed border-slate-700 hover:text-slate-300'
                        }`}
                      >
                        {task.score !== null ? `${task.score}%` : 'Enter'}
                      </button>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition">
                        <button
                          onClick={() => {
                            setActiveModal('edit-task');
                            setModalPayload({ courseId: course.id, assessment: task });
                          }}
                          className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteAssessment(course.id, task.id)}
                          className="p-1 text-slate-500 hover:text-red-400 rounded hover:bg-slate-800"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Notes & Scratchpad */}
      {activeTab === 'notes' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-red-400" />
              <span>Notes for {course.code}</span>
            </h3>
            <span className="text-[11px] text-slate-400">Persisted per course in browser storage</span>
          </div>

          <textarea
            value={courseNotes}
            onChange={(e) => saveNotes(e.target.value)}
            rows={10}
            placeholder={`Add study notes, links, exam formulas, or submission checklist for ${course.code}...`}
            className="w-full bg-slate-950/90 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-200 focus:outline-none focus:border-red-500/60 leading-relaxed"
          />
        </div>
      )}

    </div>
  );
}
