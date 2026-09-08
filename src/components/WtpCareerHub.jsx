import React from 'react';
import { useAcademic } from '../context/AcademicContext';
import { 
  Briefcase, CheckCircle2, Clock, AlertTriangle, 
  FileText, ExternalLink, Sparkles, Award, ShieldCheck, Check
} from 'lucide-react';

export default function WtpCareerHub() {
  const { courses, toggleWtpModule, triggerCelebration } = useAcademic();
  const wtpCourse = courses.find(c => c.id === 'wtp100') || courses[0];
  const modules = wtpCourse.modulesList || [];

  const completedCount = modules.filter(m => m.completed).length;
  const progressPercent = Math.round((completedCount / (modules.length || 1)) * 100);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Co-op Prerequisite Course
              </span>
              <span className="text-xs text-amber-400 font-mono font-bold">
                MANDATORY DEADLINE: Oct 23, 2026
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Work Term Preparation (WTP100) Hub
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Your gateway to CTY331 (Computer Systems Technology Co-op Term). All 14 weekly modules and Knowledge Checks (80%+ passing grade each) must be completed before Study Week begins.
            </p>
          </div>

          <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 text-center shrink-0 min-w-[200px]">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Co-op Clearance
            </div>
            <div className="text-3xl font-extrabold text-amber-400 font-mono mt-1">
              {completedCount} / {modules.length}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {progressPercent}% Complete
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full mt-3 overflow-hidden border border-slate-800">
              <div 
                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Critical Policy & Resources Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-white font-bold text-xs">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Strict October 23, 2026 Cutoff</span>
          </div>
          <p className="text-xs text-slate-400 leading-snug">
            Failure to complete all 14 modules and pass each quiz with ≥80% before Oct 23 forfeits eligibility for CTY331 co-op work term registration.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-white font-bold text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Grading Basis: SAT / UN</span>
          </div>
          <p className="text-xs text-slate-400 leading-snug">
            Does not factor into your GPA calculation, but appears on your official Seneca transcript as a prerequisite for graduation with co-op designation.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-white font-bold text-xs">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>Seneca Career Ecosystem</span>
          </div>
          <p className="text-xs text-slate-400 leading-snug">
            Utilize Seneca Works portal, Career Threads for professional interview attire, HELIX entrepreneurship, and InStage AI for interview mock trials.
          </p>
        </div>
      </div>

      {/* 14 Modules Interactive Checklist */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">14 Weekly Modules Roadmap</h3>
            <p className="text-xs text-slate-400">Click any module to toggle completion status</p>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-semibold">
            {completedCount === 14 ? "🎉 All Modules Cleared!" : `${14 - completedCount} modules remaining`}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {modules.map(m => (
            <div
              key={m.id}
              onClick={() => toggleWtpModule(m.id)}
              className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition ${
                m.completed 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-white' 
                  : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition ${
                  m.completed ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-slate-700'
                }`}>
                  {m.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-400">Module {m.id}</span>
                    <span className={`text-xs font-semibold truncate ${m.completed ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                      {m.title}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Requires passing Knowledge Check with ≥ 80%
                  </div>
                </div>
              </div>

              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border shrink-0 ${
                m.completed ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                {m.completed ? 'Passed' : 'Pending'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* External Career Resources Links */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-white">Seneca Career Support Portals</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <a
            href="https://senecaworks.senecapolytechnic.ca"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white flex items-center justify-between transition"
          >
            <span>Seneca Works Co-op Portal</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </a>
          <a
            href="https://instage.co"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white flex items-center justify-between transition"
          >
            <span>InStage AI Mock Interviews</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </a>
          <a
            href="https://learn.senecapolytechnic.ca/ultra/institution-page"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white flex items-center justify-between transition"
          >
            <span>Learn@Seneca WTP100 Space</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </a>
        </div>
      </div>

    </div>
  );
}
