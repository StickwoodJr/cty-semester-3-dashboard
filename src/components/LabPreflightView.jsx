import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAcademic } from '../context/AcademicContext';
import { 
  CheckCircle2, Terminal, ShieldCheck, AlertTriangle, 
  Copy, Check, Sparkles, ExternalLink, Timer, ArrowRight,
  Filter, FileText, Cloud, Laptop, Lock, HelpCircle, RefreshCw,
  Award, Compass
} from 'lucide-react';
import { 
  LAB_PREFLIGHT_PRESETS, 
  GENERAL_PREFLIGHT_CRITERIA 
} from '../data/labPreflightData';

const STORAGE_KEY_PREFLIGHT = 'seneca_cty_lab_preflight_v1';

export default function LabPreflightView() {
  const { 
    courses, 
    updateAssessment, 
    setCurrentView, 
    setSelectedCourseId, 
    showToast, 
    triggerCelebration 
  } = useAcademic();

  // Selected course filter and selected lab preset
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('all');
  const [selectedPresetId, setSelectedPresetId] = useState('ops345-lab3');
  const [copiedCmd, setCopiedCmd] = useState(false);

  // Stored preflight check states: { [presetId]: { [itemId]: boolean } }
  const [checklistState, setChecklistState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PREFLIGHT);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to load preflight checklist state", e);
    }
    return {};
  });

  // Save checklist state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PREFLIGHT, JSON.stringify(checklistState));
    } catch (e) {
      console.error("Failed to save preflight checklist state", e);
    }
  }, [checklistState]);

  // Filter available presets based on course filter
  const filteredPresets = useMemo(() => {
    if (selectedCourseFilter === 'all') return LAB_PREFLIGHT_PRESETS;
    return LAB_PREFLIGHT_PRESETS.filter(p => p.courseId === selectedCourseFilter);
  }, [selectedCourseFilter]);

  // Current active preset
  const activePreset = useMemo(() => {
    return LAB_PREFLIGHT_PRESETS.find(p => p.id === selectedPresetId) || LAB_PREFLIGHT_PRESETS[0];
  }, [selectedPresetId]);

  // Find course object for the active preset
  const activeCourse = useMemo(() => {
    return courses.find(c => c.id === activePreset.courseId);
  }, [courses, activePreset]);

  // Find corresponding assessment in AcademicContext
  const activeAssessment = useMemo(() => {
    if (!activeCourse) return null;
    return (activeCourse.assessments || []).find(a => a.id === activePreset.id || a.name.toLowerCase().includes(activePreset.labName.toLowerCase()));
  }, [activeCourse, activePreset]);

  // Total required items for active preset
  const presetItems = activePreset.requiredItems || [];
  const currentChecked = checklistState[activePreset.id] || {};

  // Calculate score percentage (0 to 100%)
  const checkedCount = presetItems.filter(item => Boolean(currentChecked[item.id])).length;
  const totalItemsCount = presetItems.length;
  const preflightScore = totalItemsCount > 0 ? Math.round((checkedCount / totalItemsCount) * 100) : 0;
  const isComplete = preflightScore === 100;

  // Toggle checklist item
  const toggleItem = (itemId) => {
    setChecklistState(prev => {
      const currentPresetChecks = prev[activePreset.id] || {};
      const newChecked = !currentPresetChecks[itemId];
      const updatedPresetChecks = {
        ...currentPresetChecks,
        [itemId]: newChecked
      };

      // If this check achieves 100%, trigger confetti!
      const newCheckedCount = presetItems.filter(i => Boolean(updatedPresetChecks[i.id])).length;
      if (newCheckedCount === totalItemsCount && newChecked) {
        triggerCelebration();
        showToast(`All pre-flight checks verified for ${activePreset.labName}! 4.0 Ready!`, "success");
      }

      return {
        ...prev,
        [activePreset.id]: updatedPresetChecks
      };
    });
  };

  // Reset checklist for active preset
  const resetActiveChecklist = () => {
    setChecklistState(prev => ({
      ...prev,
      [activePreset.id]: {}
    }));
    showToast("Reset checklist for current lab", "info");
  };

  // Copy verification command
  const copyCommand = () => {
    if (!activePreset.verificationCmd) return;
    navigator.clipboard.writeText(activePreset.verificationCmd);
    setCopiedCmd(true);
    showToast("Copied terminal pre-flight command to clipboard!", "success");
    setTimeout(() => setCopiedCmd(false), 2500);
  };

  // Mark lab as submitted in AcademicContext
  const handleMarkAsSubmitted = () => {
    if (!activeCourse || !activeAssessment) {
      showToast("Assessment not linked in active curriculum", "info");
      return;
    }
    updateAssessment(activeCourse.id, activeAssessment.id, {
      status: 'Graded',
      score: 100
    });
    triggerCelebration();
    showToast(`Marked ${activeCourse.code} ${activeAssessment.name} as submitted with 100%!`, "success");
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-950/40 to-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Seneca Quality Sentinel & Rubric Defense</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              Lab Pre-Flight & Screenshot Auditor
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl">
              1-click terminal verification commands, syllabus compliance checklists, and cloud budget 
              safeguards. Eliminate careless mark deductions on your 35+ semester labs to protect your <span className="text-amber-400 font-bold">4.0 GPA</span>.
            </p>
          </div>

          {/* Quick Score Card */}
          <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl flex items-center gap-4 shrink-0 shadow-lg">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={isComplete ? "text-emerald-400" : preflightScore >= 60 ? "text-amber-400" : "text-rose-400"}
                  strokeDasharray={`${preflightScore}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute font-black text-sm text-white">
                {preflightScore}%
              </span>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-300">Submission Readiness</div>
              <div className="text-[11px] font-semibold mt-0.5">
                {isComplete ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> 4.0 Distinction Ready
                  </span>
                ) : (
                  <span className="text-amber-400">
                    {checkedCount}/{totalItemsCount} Rubric Checks
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Tips Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-800/80 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Terminal className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Always include <code className="text-emerald-300 bg-slate-800 px-1 py-0.5 rounded font-mono text-[11px]">whoami && date</code></span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Cloud className="w-4 h-4 text-blue-400 shrink-0" />
            <span>Deallocate Azure VMs to protect $100 cap</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <FileText className="w-4 h-4 text-purple-400 shrink-0" />
            <span>Compile clean PDF; zero raw word docs</span>
          </div>
        </div>
      </div>

      {/* 2. Course Filter & Lab Selection Grid */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setSelectedCourseFilter('all')}
              className={`px-3 py-1.5 rounded-xl font-bold transition shrink-0 ${
                selectedCourseFilter === 'all'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              All Courses ({LAB_PREFLIGHT_PRESETS.length})
            </button>
            {['ops345', 'dat330', 'mst300', 'sec320', 'csn305', 'wtp100'].map(cid => {
              const c = courses.find(course => course.id === cid);
              const isSelected = selectedCourseFilter === cid;
              return (
                <button
                  key={cid}
                  onClick={() => setSelectedCourseFilter(cid)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition shrink-0 flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-slate-800 text-white border border-slate-700 shadow-md'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <span 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: c?.color || '#3b82f6' }} 
                  />
                  <span>{c?.code || cid.toUpperCase()}</span>
                </button>
              );
            })}
          </div>

          <div className="text-xs text-slate-400">
            Select lab to inspect verification commands and rubric rules:
          </div>
        </div>

        {/* Lab Selection Carousel / Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {filteredPresets.map(preset => {
            const isSelected = selectedPresetId === preset.id;
            const checks = checklistState[preset.id] || {};
            const doneCount = (preset.requiredItems || []).filter(i => checks[i.id]).length;
            const totalCount = (preset.requiredItems || []).length;
            const isDone = totalCount > 0 && doneCount === totalCount;

            return (
              <button
                key={preset.id}
                onClick={() => setSelectedPresetId(preset.id)}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-800/90 border-emerald-500 ring-2 ring-emerald-500/30 shadow-xl'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-white px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                      {preset.courseCode}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-slate-800 text-slate-300">
                      {preset.category}
                    </span>
                  </div>
                  <div className="font-bold text-sm text-white line-clamp-2">
                    {preset.labName}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">
                    {doneCount}/{totalCount} checked
                  </span>
                  {isDone ? (
                    <span className="text-emerald-400 font-bold text-[11px] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                    </span>
                  ) : (
                    <span className="text-amber-400/80 text-[11px]">Audit Pending</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Detailed Pre-Flight Audit Deck for Active Lab */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Col: Terminal Command Generator & Pro Tips (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Terminal Command Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-base">
                  Pre-Flight Terminal Verification Command
                </h3>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                {activePreset.terminalType}
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Run this single command in your VM, Azure Cloud Shell, or SSMS query window before 
              capturing your final submission screenshot. It outputs your identity, hostname, and service status simultaneously.
            </p>

            {/* Code Block Box */}
            <div className="relative group bg-slate-950 border border-slate-800 rounded-2xl p-4 overflow-hidden font-mono text-xs">
              <div className="text-emerald-400 pr-12 break-all leading-relaxed select-all">
                {activePreset.verificationCmd}
              </div>
              <button
                onClick={copyCommand}
                aria-label="Copy terminal verification command"
                className="absolute top-3 right-3 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1.5 shadow-md"
              >
                {copiedCmd ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-[11px] font-bold text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-400" />
                    <span className="text-[11px]">Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Key Evidence Callout */}
            <div className="p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-xs space-y-1">
              <div className="font-bold text-indigo-300 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                <span>Primary Screenshot Evidence Required:</span>
              </div>
              <p className="text-slate-300 leading-relaxed pl-5">
                {activePreset.keyEvidence}
              </p>
            </div>

            {/* Pro Tip */}
            <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/20 text-xs space-y-1">
              <div className="font-bold text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Professor Rubric Pro-Tip:</span>
              </div>
              <p className="text-slate-300 leading-relaxed pl-5">
                {activePreset.proTip}
              </p>
            </div>
          </div>

          {/* Seneca General Standard Policies */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Lock className="w-4 h-4 text-slate-400" />
              <span>Seneca CTY Core Submission Protocols</span>
            </h3>

            <div className="space-y-3">
              {GENERAL_PREFLIGHT_CRITERIA.map(crit => (
                <div key={crit.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs space-y-1">
                  <div className="font-bold text-slate-200">{crit.title}</div>
                  <p className="text-slate-400 leading-relaxed">{crit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Rubric Checklist & Submission Clearance (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="font-bold text-white text-base">
                  Rubric Compliance Checklist
                </h3>
                <p className="text-xs text-slate-400">
                  {activePreset.labName}
                </p>
              </div>
              <button
                onClick={resetActiveChecklist}
                className="text-xs text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition"
                title="Reset checklist"
                aria-label="Reset checklist for this lab"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Checklist Items */}
            <div className="space-y-3">
              {presetItems.map(item => {
                const isChecked = Boolean(currentChecked[item.id]);

                return (
                  <button
                    key={item.id}
                    role="checkbox"
                    aria-checked={isChecked}
                    aria-label={`Rubric check: ${item.label}, ${isChecked ? 'verified' : 'pending'}`}
                    onClick={() => toggleItem(item.id)}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 group ${
                      isChecked
                        ? 'bg-emerald-950/20 border-emerald-500/40'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isChecked ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <div className="w-4 h-4 rounded-md border border-slate-600 group-hover:border-slate-400" />
                      )}
                    </div>
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className={`text-xs font-semibold leading-snug ${isChecked ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                        {item.label}
                      </div>
                      <div className="text-[10px] text-rose-400 font-mono font-medium">
                        Risk: {item.penalty}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Final Submission Clearance Card */}
            <div className={`p-4 rounded-2xl border transition-all space-y-3 ${
              isComplete
                ? 'bg-emerald-950/30 border-emerald-500/50'
                : 'bg-slate-950/60 border-slate-800'
            }`}>
              <div className="flex items-center justify-between">
                <div className="font-bold text-xs text-white flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>4.0 Grade Protection</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isComplete ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                }`}>
                  {isComplete ? 'All Clear!' : 'Checks Incomplete'}
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                {isComplete 
                  ? "Every rubric gate has been verified. You have satisfied student ID, timestamp, and configuration integrity requirements."
                  : "Complete all checks above before submitting to Blackboard / Learn@Seneca to eliminate accidental deductions."}
              </p>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleMarkAsSubmitted}
                  disabled={!isComplete}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg ${
                    isComplete
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark as Submitted & Graded (100%)</span>
                </button>

                <div className="flex items-center gap-2">
                  <a
                    href="https://learn.senecapolytechnic.ca/ultra/institution-page"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition flex items-center justify-center gap-1.5 border border-slate-700"
                  >
                    <span>Learn@Seneca</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>

                  <button
                    onClick={() => {
                      if (activeCourse) setSelectedCourseId(activeCourse.id);
                      setCurrentView('timer');
                    }}
                    className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-semibold transition flex items-center gap-1.5 border border-slate-700"
                    title="Start 25m Focus Sprint"
                  >
                    <Timer className="w-3.5 h-3.5" />
                    <span>Focus</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
