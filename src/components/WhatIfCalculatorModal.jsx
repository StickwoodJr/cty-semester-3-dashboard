import React, { useState, useEffect } from 'react';
import { useAcademic } from '../context/AcademicContext';
import { X, Calculator, Target, Sparkles, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function WhatIfCalculatorModal() {
  const { activeModal, setActiveModal, modalPayload, getCourseMetrics } = useAcademic();

  // Close on Escape key
  useEffect(() => {
    if (activeModal !== 'what-if') return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setActiveModal(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal, setActiveModal]);

  if (activeModal !== 'what-if') return null;
  const course = modalPayload?.course;
  if (!course) return null;

  const isWtp = course.id === 'wtp100' || course.credits === 0;
  const metrics = getCourseMetrics(course);
  const [targetPercentage, setTargetPercentage] = useState(80); // default 80% (Seneca A / 4.0 threshold)

  const completedWeight = metrics.completedWeight;
  const totalWeight = metrics.totalWeight > 0 ? metrics.totalWeight : 100;
  const remainingWeight = Math.max(0, totalWeight - completedWeight);
  const earnedWeight = metrics.earnedWeight;

  // Needed points to hit target percentage scaled to total course weight
  const neededEarnedTotal = (targetPercentage / 100) * totalWeight;
  const neededFromRemaining = neededEarnedTotal - earnedWeight;
  
  let requiredAverage = null;
  if (remainingWeight > 0) {
    requiredAverage = (neededFromRemaining / remainingWeight) * 100;
  }

  const maxPossibleGrade = totalWeight > 0 ? ((earnedWeight + remainingWeight) / totalWeight) * 100 : 100;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) setActiveModal(null); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="what-if-modal-title"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-600/10 text-indigo-400 border border-indigo-500/20">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 id="what-if-modal-title" className="text-base font-bold text-white">
                Grade Target Simulator: {course.code}
              </h3>
              <p className="text-xs text-slate-400">{course.name}</p>
            </div>
          </div>
          <button 
            onClick={() => setActiveModal(null)}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            aria-label="Close simulator modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 text-xs overflow-y-auto flex-1">
          {isWtp ? (
            <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>WTP100 Grading Policy (SAT / UNSAT)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                WTP100 (Work Term Preparation) is a non-credit course graded on a Satisfactory/Unsatisfactory basis. It does not carry numeric percentage grades or affect your semester GPA.
              </p>
              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs font-mono text-amber-300">
                ⚠️ Requirement: Complete all 14 knowledge check modules with ≥80% by <strong>Friday, October 23, 2026</strong> for co-op clearance.
              </div>
            </div>
          ) : null}
          
          {/* Current Stats Overview */}
          <div className="grid grid-cols-3 gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-center">
            <div>
              <div className="text-[10px] text-slate-400">Completed</div>
              <div className="text-sm font-bold text-slate-200 mt-0.5">{completedWeight.toFixed(1)}%</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400">Points Secured</div>
              <div className="text-sm font-bold text-emerald-400 mt-0.5">{earnedWeight.toFixed(1)} pts</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400">Remaining Weight</div>
              <div className="text-sm font-bold text-slate-200 mt-0.5">{remainingWeight.toFixed(1)}%</div>
            </div>
          </div>

          {/* Target Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Target className="w-4 h-4 text-indigo-400" />
                <span>Desired Final Course Grade:</span>
              </label>
              <span className="font-mono text-base font-bold text-indigo-400 px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/30">
                {targetPercentage}%
              </span>
            </div>

            <input
              type="range"
              min="50"
              max="100"
              step="1"
              value={targetPercentage}
              onChange={(e) => setTargetPercentage(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />

            {/* Presets */}
            <div className="flex items-center justify-between gap-1 pt-1">
              {[
                { label: 'Pass (50%)', val: 50 },
                { label: 'B (70%)', val: 70 },
                { label: 'B+ (75%)', val: 75 },
                { label: 'A (80%)', val: 80 },
                { label: 'A+ (90%)', val: 90 }
              ].map(preset => (
                <button
                  key={preset.val}
                  type="button"
                  onClick={() => setTargetPercentage(preset.val)}
                  className={`px-2 py-1 rounded-md text-[10px] font-mono font-semibold transition ${
                    targetPercentage === preset.val 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mathematical Result Card */}
          <div className="p-4 rounded-xl border space-y-2">
            {remainingWeight === 0 ? (
              <div className="text-center text-slate-300 py-2">
                All 100% of course assessments are completed! Final grade is {metrics.currentAverage?.toFixed(1)}%.
              </div>
            ) : requiredAverage > 100 ? (
              <div className="space-y-1 text-amber-300">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  <span>Target Exceeds Maximum Attainable</span>
                </div>
                <p className="text-xs text-slate-300">
                  Even with 100% on every remaining assessment, the maximum final score you can achieve is{' '}
                  <strong className="text-white font-mono">{maxPossibleGrade.toFixed(1)}%</strong>.
                </p>
              </div>
            ) : requiredAverage <= 0 ? (
              <div className="space-y-1 text-emerald-300">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Target Already Secured!</span>
                </div>
                <p className="text-xs text-slate-300">
                  You have already earned {earnedWeight.toFixed(1)} points, which guarantees at least {targetPercentage}% overall!
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-slate-400 text-xs font-semibold">
                  Required Average on Remaining Evaluations:
                </div>
                <div className="text-2xl font-extrabold text-white font-mono flex items-baseline gap-2">
                  <span className={requiredAverage > 85 ? 'text-amber-400' : 'text-emerald-400'}>
                    {requiredAverage.toFixed(1)}%
                  </span>
                  <span className="text-xs text-slate-400 font-normal">
                    across remaining {remainingWeight.toFixed(1)}% weight
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Maintaining an average of {requiredAverage.toFixed(1)}% on your upcoming labs, quizzes, and final evaluations will earn you your target grade of {targetPercentage}%.
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition"
            >
              Close Simulator
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
