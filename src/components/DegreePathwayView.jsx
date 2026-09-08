import React, { useState, useMemo } from 'react';
import { useAcademic } from '../context/AcademicContext';
import { 
  GraduationCap, Award, Briefcase, CheckCircle2, 
  ArrowRight, Sparkles, AlertTriangle, ExternalLink, 
  BookOpen, ChevronRight, Layers, ShieldCheck, Compass,
  Laptop, CheckSquare, Clock, ArrowUpRight
} from 'lucide-react';
import { 
  CTY_PROGRAM_CONFIG, 
  CTY_SEMESTERS, 
  SENECA_COOP_GATES, 
  INDUSTRY_CERTIFICATIONS 
} from '../data/pathwayData';

export default function DegreePathwayView() {
  const { 
    courses, 
    getSemesterMetrics, 
    getCourseMetrics, 
    setCurrentView,
    setSelectedCourseId 
  } = useAcademic();

  const semesterMetrics = getSemesterMetrics();
  const [activeTab, setActiveTab] = useState('prereqs'); // 'prereqs' | 'coop' | 'certs' | 'honours'
  const [selectedSemesterNum, setSelectedSemesterNum] = useState(3);

  // Calculate WTP100 completion count
  const wtpCourse = courses.find(c => c.id === 'wtp100');
  const wtpCompletedCount = (wtpCourse?.modulesList || []).filter(m => m.completed).length;
  const isWtpComplete = wtpCompletedCount === 14;

  // Selected semester data
  const selectedSemesterData = useMemo(() => {
    return CTY_SEMESTERS.find(s => s.semester === selectedSemesterNum) || CTY_SEMESTERS[2];
  }, [selectedSemesterNum]);

  // Current GPA value (float)
  const currentGpaFloat = parseFloat(semesterMetrics.currentGpa) || 4.0;
  const isCoopGpaCleared = currentGpaFloat >= CTY_PROGRAM_CONFIG.coopGpaThreshold;
  const isDistinctionProjected = currentGpaFloat >= CTY_PROGRAM_CONFIG.distinctionGpaThreshold;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      
      {/* 1. Program Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-sky-950/40 to-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Ontario College Advanced Diploma • 36.0 Credits</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              CTY Degree Pathway & Co-op Architecture
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl">
              Prerequisite progression tree, SenecaWorks Summer 2027 Co-op clearance sentinel, 
              and professional industry certification alignment for your <span className="text-amber-400 font-bold">4.0 GPA goal</span>.
            </p>
          </div>

          {/* Distinction Target Card */}
          <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl flex items-center gap-4 shrink-0 shadow-lg">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Projected Standing</div>
              <div className="text-base font-black text-white flex items-center gap-1.5 mt-0.5">
                <span>{isDistinctionProjected ? "President's Distinction" : "Honours Standing"}</span>
              </div>
              <div className="text-xs font-bold text-amber-400 mt-0.5">
                GPA {semesterMetrics.currentGpa} / 4.00
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div role="tablist" aria-label="Degree pathway navigation tabs" className="flex flex-wrap items-center gap-2 mt-8 pt-6 border-t border-slate-800/80 text-xs">
          <button
            role="tab"
            aria-selected={activeTab === 'prereqs'}
            onClick={() => setActiveTab('prereqs')}
            className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 ${
              activeTab === 'prereqs'
                ? 'bg-sky-600 text-white shadow-lg shadow-sky-900/30'
                : 'bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Prerequisite Progression Tree</span>
          </button>

          <button
            role="tab"
            aria-selected={activeTab === 'coop'}
            onClick={() => setActiveTab('coop')}
            className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 ${
              activeTab === 'coop'
                ? 'bg-sky-600 text-white shadow-lg shadow-sky-900/30'
                : 'bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Co-op Clearance Gates (CTY331)</span>
          </button>

          <button
            role="tab"
            aria-selected={activeTab === 'certs'}
            onClick={() => setActiveTab('certs')}
            className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 ${
              activeTab === 'certs'
                ? 'bg-sky-600 text-white shadow-lg shadow-sky-900/30'
                : 'bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Industry Certifications & Vouchers</span>
          </button>

          <button
            role="tab"
            aria-selected={activeTab === 'honours'}
            onClick={() => setActiveTab('honours')}
            className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 ${
              activeTab === 'honours'
                ? 'bg-sky-600 text-white shadow-lg shadow-sky-900/30'
                : 'bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Honours Standing Criteria</span>
          </button>
        </div>
      </div>

      {/* 2. Tab Content Areas */}
      
      {/* TAB 1: Prerequisite Tree */}
      {activeTab === 'prereqs' && (
        <div className="space-y-6">
          {/* Semester Selector Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] pl-2 pr-1 shrink-0">
              Curriculum Map:
            </span>
            {CTY_SEMESTERS.map(s => {
              const isSelected = selectedSemesterNum === s.semester;
              return (
                <button
                  key={s.semester}
                  onClick={() => setSelectedSemesterNum(s.semester)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition shrink-0 flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-sky-600 text-white shadow-md'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <span>{s.term.split('(')[0].trim()}</span>
                  {s.semester === 3 && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Semester Detailed Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-white">
                    {selectedSemesterData.term}
                  </h2>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                    selectedSemesterData.status === 'Completed'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : selectedSemesterData.status === 'In Progress'
                      ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    {selectedSemesterData.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Total Credits: {selectedSemesterData.totalCredits} • Program Track: FASET Computer Systems Technology
                </p>
              </div>

              {selectedSemesterData.semester === 3 && (
                <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>
                    <strong>Pivotal Semester:</strong> Every course here directly unlocks Semester 4 and Co-op!
                  </span>
                </div>
              )}
            </div>

            {/* Course Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedSemesterData.courses.map((c, i) => {
                const liveCourse = courses.find(course => course.code === c.code);
                const metrics = liveCourse ? getCourseMetrics(liveCourse) : null;

                return (
                  <div 
                    key={i}
                    className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/90 hover:border-slate-700 transition flex flex-col justify-between space-y-4 group"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-white px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 group-hover:border-sky-500/40 transition">
                          {c.code}
                        </span>
                        {c.grade && (
                          <span className="font-mono text-xs font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                            Grade: {c.grade}
                          </span>
                        )}
                        {metrics && metrics.letterGrade && (
                          <span className="font-mono text-xs font-bold text-sky-400 px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20">
                            Projected: {metrics.letterGrade}
                          </span>
                        )}
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-white group-hover:text-sky-300 transition">
                          {c.name}
                        </h3>
                        {c.description && (
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                            {c.description}
                          </p>
                        )}
                      </div>

                      {/* Prerequisite Linkage Info */}
                      {c.prereqFor && (
                        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 text-xs space-y-1">
                          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-semibold">
                            <span>Directly Unlocks:</span>
                            <ArrowRight className="w-3 h-3 text-sky-400" />
                            <strong className="text-sky-300 font-mono">{c.prereqFor}</strong>
                          </div>
                          <p className="text-[11px] text-slate-400">
                            {c.unlocks}
                          </p>
                        </div>
                      )}

                      {c.prereq && (
                        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 text-xs">
                          <span className="text-slate-400 text-[11px]">Prerequisite: </span>
                          <span className="text-amber-400 font-semibold text-[11px]">{c.prereq}</span>
                        </div>
                      )}
                    </div>

                    {liveCourse && (
                      <button
                        onClick={() => {
                          setSelectedCourseId(liveCourse.id);
                          setCurrentView('course-detail');
                        }}
                        className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition border border-slate-800 flex items-center justify-center gap-1.5"
                      >
                        <span>View Syllabus & Marks</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Co-op Clearance Gates */}
      {activeTab === 'coop' && (
        <div className="space-y-6">
          {/* Clearance Summary Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>SenecaWorks Co-op Sentinel</span>
                </div>
                <h2 className="text-xl font-bold text-white">
                  CTY331 Co-op Work Term 1 Clearance Gates
                </h2>
                <p className="text-xs text-slate-400">
                  Official criteria required by the Seneca Faculty of Applied Science & Engineering Technology for Summer 2027 technical placements.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>On Track for Full Clearance</span>
                </span>
              </div>
            </div>

            {/* 4 Gates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {SENECA_COOP_GATES.map(gate => {
                let isCleared = false;
                let statusLabel = "Pending";

                if (gate.id === 'gpa-gate') {
                  isCleared = isCoopGpaCleared;
                  statusLabel = isCleared ? `Cleared (${semesterMetrics.currentGpa} GPA)` : "Below 3.00";
                } else if (gate.id === 'wtp-gate') {
                  isCleared = isWtpComplete;
                  statusLabel = isCleared ? "All 14 Modules Passed" : `${wtpCompletedCount}/14 Modules`;
                } else if (gate.id === 'credit-gate') {
                  isCleared = true;
                  statusLabel = "Zero Unsatisfied Prereqs";
                } else if (gate.id === 'enrollment-gate') {
                  isCleared = true;
                  statusLabel = "7 Courses Active (100% Load)";
                }

                return (
                  <div 
                    key={gate.id}
                    className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                      isCleared
                        ? 'bg-slate-950/70 border-emerald-500/40 shadow-sm'
                        : 'bg-slate-950/70 border-amber-500/40'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                          {gate.category}
                        </span>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                          isCleared 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                        }`}>
                          {isCleared ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          <span>{statusLabel}</span>
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-white">
                        {gate.name}
                      </h3>

                      <p className="text-xs text-slate-400 leading-relaxed">
                        {gate.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Minimum Rule: {gate.currentRequirement}</span>
                      <span className="text-amber-400 font-bold">4.0 Target: {gate.targetGoal}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* SenecaWorks Timeline Callout */}
            <div className="mt-6 p-5 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-400" />
                <span>Seneca CTY Co-op Recruitment Timeline (Summer 2027 Work Term)</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="font-bold text-amber-400">Phase 1: Fall 2026</div>
                  <p className="text-slate-300">Complete WTP100 modules by Oct 23 and lock down &gt;= 3.00 semester GPA.</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="font-bold text-sky-400">Phase 2: Winter 2027</div>
                  <p className="text-slate-300">SenecaWorks job portal opens in January 2027 for employer applications and technical interviews.</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="font-bold text-emerald-400">Phase 3: Summer 2027</div>
                  <p className="text-slate-300">Full-time 4-month paid co-op work placement (May – August 2027).</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Industry Certifications */}
      {activeTab === 'certs' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-xl space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-1">
                <Award className="w-3.5 h-3.5" />
                <span>Resume & Co-op Superchargers</span>
              </div>
              <h2 className="text-xl font-bold text-white">
                CTY Semester 3 Industry Certification Mapping
              </h2>
              <p className="text-xs text-slate-400">
                Your coursework directly aligns with accredited industry certifications. Pair your 4.0 GPA with these credentials for top co-op placement offers.
              </p>
            </div>

            {/* Certifications Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {INDUSTRY_CERTIFICATIONS.map(cert => (
                <div 
                  key={cert.id}
                  className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                        {cert.courseCode}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {cert.level}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition">
                        {cert.certName}
                      </h3>
                      <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                        Vendor: {cert.vendor} ({cert.examCode})
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
                      {cert.alignment}
                    </p>

                    <div className="text-[11px] text-emerald-400 bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-500/20">
                      <strong>Voucher Tip:</strong> {cert.voucherTip}
                    </div>
                  </div>

                  <a
                    href={cert.url}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition border border-slate-800 flex items-center justify-center gap-1.5"
                  >
                    <span>Official Certification Portal</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Honours Standing */}
      {activeTab === 'honours' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-xl space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-white">
                Seneca Polytechnic Academic Honours Framework
              </h2>
              <p className="text-xs text-slate-400">
                Official grading policies, transcript annotations, and distinction seals for FASET students.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 ${
                isDistinctionProjected
                  ? 'bg-amber-950/20 border-amber-500/40 shadow-lg shadow-amber-950/20'
                  : 'bg-slate-950/70 border-slate-800'
              }`}>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-amber-400">Tier 1 Highest Award</span>
                    {isDistinctionProjected && (
                      <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Current Target
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-black text-white">
                    President's Honour List with Distinction
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Awarded to full-time students who achieve a perfect <strong>4.00 Term GPA</strong> (scoring A or A+ in all graded courses). Formally noted on official academic transcript and designated with a gold seal at convocation.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-800 text-xs font-mono text-amber-400 font-bold">
                  Requirement: Term GPA = 4.00
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Tier 2 Honour</span>
                  <h3 className="text-base font-black text-white">
                    President's Honour List
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Awarded to full-time students who achieve a <strong>Term GPA of 3.60 to 3.99</strong> with no grades below B and zero unfulfilled course deliverables. Formally printed on official college transcript.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-800 text-xs font-mono text-slate-400 font-bold">
                  Requirement: Term GPA &gt;= 3.60
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Tier 3 Honour</span>
                  <h3 className="text-base font-black text-white">
                    Diploma Honours Standing
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Awarded at graduation to students who maintain a <strong>Cumulative GPA &gt;= 3.00</strong> across all 6 semesters of the Computer Systems Technology program.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-800 text-xs font-mono text-slate-400 font-bold">
                  Requirement: Cumulative GPA &gt;= 3.00
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Navigation Callouts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setCurrentView('marks')}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-sky-500/40 text-left transition group flex items-center justify-between"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sky-400 text-xs font-bold">
              <Award className="w-4 h-4" />
              <span>Marks & GPA Forecaster</span>
            </div>
            <p className="text-xs text-slate-400">
              Audit your 4.0 margin of error cushion and course-by-course simulations.
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-sky-400 transition transform group-hover:translate-x-1" />
        </button>

        <button
          onClick={() => setCurrentView('wtp')}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-left transition group flex items-center justify-between"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold">
              <Briefcase className="w-4 h-4" />
              <span>WTP100 Career Hub</span>
            </div>
            <p className="text-xs text-slate-400">
              Track your 14 co-op preparation modules before the Oct 23 deadline.
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition transform group-hover:translate-x-1" />
        </button>

        <button
          onClick={() => setCurrentView('resources')}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/40 text-left transition group flex items-center justify-between"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-purple-400 text-xs font-bold">
              <BookOpen className="w-4 h-4" />
              <span>Resource & Faculty Vault</span>
            </div>
            <p className="text-xs text-slate-400">
              Claim $2,000+ in student software perks and contact course professors.
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-purple-400 transition transform group-hover:translate-x-1" />
        </button>
      </div>

    </div>
  );
}
