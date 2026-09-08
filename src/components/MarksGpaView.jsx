import React, { useState, useMemo } from 'react';
import { useAcademic } from '../context/AcademicContext';
import { 
  BarChart3, Award, TrendingUp, CheckCircle, 
  HelpCircle, Calculator, Info, Sparkles, BookOpen,
  Sliders, RotateCcw, Shield, AlertTriangle, CheckCircle2,
  ChevronRight, Lock, Target, Flame, ArrowRight
} from 'lucide-react';
import { SENECA_GRADE_SCALE, getLetterGrade, getGpaValue } from '../data/senecaDates';

export default function MarksGpaView() {
  const { 
    courses, 
    getCourseMetrics, 
    getSemesterMetrics, 
    setSelectedCourseId, 
    setCurrentView,
    showToast
  } = useAcademic();

  const semesterMetrics = getSemesterMetrics();
  const [simulatorTarget, setSimulatorTarget] = useState(4.0);

  // Active Course for Granular Assessment-Level Forecaster
  const [selectedForecasterId, setSelectedForecasterId] = useState('ops345');

  // Simulated Assessment Scores Map: { [taskId]: scoreNumber }
  const [simulatedScores, setSimulatedScores] = useState({});

  // Active Course Object
  const activeCourse = useMemo(() => {
    return courses.find(c => c.id === selectedForecasterId) || courses[0];
  }, [courses, selectedForecasterId]);

  // Handler to update an assessment score simulation
  const handleScoreChange = (taskId, newScore) => {
    const val = Math.max(0, Math.min(100, parseFloat(newScore) || 0));
    setSimulatedScores(prev => ({ ...prev, [taskId]: val }));
  };

  // Preset Applicator for currently selected course
  const applyCoursePreset = (targetScore) => {
    if (!activeCourse) return;
    const updates = {};
    (activeCourse.assessments || []).forEach(t => {
      // Only simulate pending/ungraded tasks
      if (t.score === null || t.score === undefined) {
        updates[t.id] = targetScore;
      }
    });
    setSimulatedScores(prev => ({ ...prev, ...updates }));
    showToast(`Simulated ${targetScore}% on all pending ${activeCourse.code} assessments`, 'info');
  };

  // Reset simulation for active course
  const resetCourseSimulation = () => {
    if (!activeCourse) return;
    setSimulatedScores(prev => {
      const copy = { ...prev };
      (activeCourse.assessments || []).forEach(t => {
        delete copy[t.id];
      });
      return copy;
    });
    showToast(`Reset ${activeCourse.code} simulation to actual recorded marks`, 'info');
  };

  // Calculate simulated metrics for any given course
  const getSimulatedCourseMetrics = (course) => {
    const assessments = course.assessments || [];
    let totalWeight = 0;
    let earnedWeight = 0;
    let testWeight = 0;
    let testEarnedWeight = 0;

    assessments.forEach(t => {
      const w = parseFloat(t.weight) || 0;
      totalWeight += w;

      const isTest = ['Test', 'Midterm', 'Exam', 'Practical'].some(k => 
        (t.category || '').toLowerCase().includes(k.toLowerCase()) || 
        (t.name || '').toLowerCase().includes(k.toLowerCase())
      );

      let score = null;
      if (simulatedScores[t.id] !== undefined) {
        score = simulatedScores[t.id];
      } else if (t.score !== null && t.score !== undefined) {
        score = parseFloat(t.score);
      } else {
        score = 85; // Default 4.0 baseline projection
      }

      if (score !== null && !isNaN(score)) {
        earnedWeight += (score / 100) * w;
        if (isTest) {
          testWeight += w;
          testEarnedWeight += (score / 100) * w;
        }
      }
    });

    const finalGrade = totalWeight > 0 ? (earnedWeight / totalWeight) * 100 : 85;
    const testAvg = testWeight > 0 ? (testEarnedWeight / testWeight) * 100 : null;
    const letterGrade = getLetterGrade(finalGrade);
    const gpa = course.credits > 0 ? getGpaValue(finalGrade) : null;

    return {
      finalGrade,
      letterGrade,
      gpa,
      testAvg,
      testWeight
    };
  };

  // Overall Simulated Semester GPA across all courses
  const simulatedSemesterGpa = useMemo(() => {
    let totalQualityPoints = 0;
    let totalGradedCredits = 0;
    courses.forEach(c => {
      if (c.credits > 0) {
        const m = getSimulatedCourseMetrics(c);
        if (m.gpa !== null) {
          totalQualityPoints += m.gpa * c.credits;
          totalGradedCredits += c.credits;
        }
      }
    });
    return totalGradedCredits > 0 ? (totalQualityPoints / totalGradedCredits).toFixed(2) : '4.00';
  }, [courses, simulatedScores]);

  // Metrics for Active Forecaster Course
  const activeMetrics = useMemo(() => {
    return getCourseMetrics(activeCourse);
  }, [activeCourse, getCourseMetrics]);

  const activeSimMetrics = useMemo(() => {
    return getSimulatedCourseMetrics(activeCourse);
  }, [activeCourse, simulatedScores]);

  // Margin of Error calculations for active course
  const coursePointsLost = Math.max(0, activeMetrics.completedWeight - activeMetrics.earnedWeight);
  const remainingWeight = Math.max(0, 100 - activeMetrics.completedWeight);
  const neededFor80 = Math.max(0, 80 - activeMetrics.earnedWeight);
  const droppablePointsCushion = Math.max(0, 20.0 - coursePointsLost); // Max 20 points droppable to stay >= 80%
  const requiredRemainingAvgFor80 = remainingWeight > 0 ? (neededFor80 / remainingWeight) * 100 : 0;

  // Syllabus Sub-Minimum Rules
  const hasTestRule = ['dat330', 'sec320', 'ops345'].includes(activeCourse.id);
  const testRulePassed = activeSimMetrics.testAvg === null || activeSimMetrics.testAvg >= 50;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      
      {/* Top Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <span>🎯</span> Focus: Perfect 4.00 GPA
              </span>
              <span className="text-xs text-slate-400">President's Honour List with Distinction</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight mt-1">
              Marks & 4.0 GPA Command Center
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live weighted grade computations, 80%+ threshold monitors for 4.0 quality points, and Seneca GPA analytics.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Simulated GPA</div>
              <div className="text-2xl font-extrabold text-emerald-400 font-mono flex items-baseline gap-1">
                <span>{simulatedSemesterGpa}</span>
                <span className="text-xs font-normal text-slate-400">/ 4.00</span>
              </div>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Term Average</div>
              <div className="text-2xl font-extrabold text-white font-mono">
                {semesterMetrics.semesterAverage}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4.0 GPA SEMESTER SAFETY HEATMAP */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 border border-amber-500/30 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-base border border-amber-500/30">
              4.0
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>4.0 GPA Semester Safety Heatmap</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                  ≥ 80.0% Course Threshold = 4.0 Quality Points
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                At Seneca, any grade between <strong>80–100% (A or A+)</strong> delivers the maximum 4.0 quality points.
              </p>
            </div>
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {courses.filter(c => c.credits > 0).map(c => {
            const metrics = getCourseMetrics(c);
            const remWeight = Math.max(0, 100 - metrics.completedWeight);
            const need80 = Math.max(0, 80 - metrics.earnedWeight);
            const reqAvg = remWeight > 0 ? (need80 / remWeight) * 100 : null;
            const ptsLost = Math.max(0, metrics.completedWeight - metrics.earnedWeight);
            const cushion = Math.max(0, 20.0 - ptsLost);
            const isSelected = selectedForecasterId === c.id;

            return (
              <div 
                key={c.id} 
                onClick={() => setSelectedForecasterId(c.id)}
                className={`p-3.5 rounded-xl border transition cursor-pointer group ${
                  isSelected 
                    ? 'bg-slate-900 border-amber-500 ring-1 ring-amber-500/30 shadow-lg' 
                    : 'bg-slate-950/80 border-slate-800/90 hover:border-amber-500/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span 
                    className="font-mono text-xs font-bold px-1.5 py-0.5 rounded border"
                    style={{
                      color: c.color,
                      backgroundColor: `${c.color}20`,
                      borderColor: `${c.color}50`
                    }}
                  >
                    {c.code}
                  </span>
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                    reqAvg === null || reqAvg <= 85 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  }`}>
                    {reqAvg !== null && reqAvg <= 0 ? '4.0 Locked! 🎉' : reqAvg !== null && reqAvg <= 80 ? '✓ Comfortable' : reqAvg !== null && reqAvg <= 88 ? '⚡ On Track' : '⚠️ Intensive'}
                  </span>
                </div>

                <div className="text-xs font-semibold text-white group-hover:text-amber-400 transition truncate">
                  {c.name}
                </div>

                {/* Cushion & Remaining Need */}
                <div className="mt-2.5 pt-2 border-t border-slate-900 grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Points Cushion</span>
                    <span className="font-mono font-bold text-amber-400">{cushion.toFixed(1)}%</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 block text-[10px]">Need for 4.0</span>
                    <span className="font-mono font-bold text-emerald-400">
                      {reqAvg !== null ? (reqAvg <= 0 ? 'Secured' : `${reqAvg.toFixed(1)}% avg`) : 'Complete'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* INTERACTIVE ASSESSMENT FORECASTER & MARGIN OF ERROR */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-red-400" />
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Assessment-Level Grade Forecaster:</span>
                <span 
                  className="font-mono px-2 py-0.5 rounded border text-xs"
                  style={{
                    color: activeCourse.color,
                    backgroundColor: `${activeCourse.color}15`,
                    borderColor: `${activeCourse.color}40`
                  }}
                >
                  {activeCourse.code} — {activeCourse.name}
                </span>
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Adjust expected scores on upcoming labs, midterms, and finals to see instant impacts on your course grade and 4.0 GPA.
            </p>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => applyCoursePreset(80)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 transition"
              title="Set all pending to 80% (A threshold)"
            >
              Simulate 80%
            </button>
            <button
              onClick={() => applyCoursePreset(90)}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30 transition"
              title="Set all pending to 90% (A+ distinction)"
            >
              Simulate 90% (A+)
            </button>
            <button
              onClick={resetCourseSimulation}
              className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition"
              title="Reset simulation to actual marks"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Summary Metric Ribbon for Selected Course */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800">
            <div className="text-[10px] uppercase font-bold text-slate-400">Simulated Final Grade</div>
            <div className="text-2xl font-extrabold text-white font-mono mt-0.5 flex items-baseline gap-1.5">
              <span>{activeSimMetrics.finalGrade.toFixed(1)}%</span>
              <span className="text-xs font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400">
                {activeSimMetrics.letterGrade}
              </span>
            </div>
            <div className="text-[10px] text-emerald-400 mt-1 font-semibold">
              {activeSimMetrics.gpa !== null ? `${activeSimMetrics.gpa.toFixed(1)} GPA Points` : 'SAT/UN'}
            </div>
          </div>

          <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800">
            <div className="text-[10px] uppercase font-bold text-slate-400">Points Droppable Cushion</div>
            <div className="text-2xl font-extrabold text-amber-400 font-mono mt-0.5">
              {droppablePointsCushion.toFixed(1)}%
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Margin before dropping &lt; 80%</div>
          </div>

          <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800">
            <div className="text-[10px] uppercase font-bold text-slate-400">Required Remaining Avg</div>
            <div className="text-2xl font-extrabold text-emerald-400 font-mono mt-0.5">
              {requiredRemainingAvgFor80 <= 0 ? '0.0%' : `${requiredRemainingAvgFor80.toFixed(1)}%`}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Across remaining {remainingWeight}%</div>
          </div>

          <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800">
            <div className="text-[10px] uppercase font-bold text-slate-400">Sub-Minimum Sentinel</div>
            <div className="text-lg font-bold font-mono mt-1 flex items-center gap-1.5">
              {hasTestRule ? (
                testRulePassed ? (
                  <span className="text-emerald-400 flex items-center gap-1 text-xs">
                    <Shield className="w-4 h-4 fill-emerald-500/20" />
                    <span>50% Test Rule Passed</span>
                  </span>
                ) : (
                  <span className="text-rose-400 flex items-center gap-1 text-xs">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span>Test Avg Below 50%</span>
                  </span>
                )
              ) : (
                <span className="text-slate-400 text-xs flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-slate-500" />
                  <span>Standard 50% Pass</span>
                </span>
              )}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              {activeSimMetrics.testAvg !== null ? `Tests Average: ${activeSimMetrics.testAvg.toFixed(1)}%` : 'No test component'}
            </div>
          </div>
        </div>

        {/* Interactive Sliders Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 text-[10px] uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Assessment</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Due Date</th>
                <th className="py-2.5 px-3 text-center">Weight</th>
                <th className="py-2.5 px-3 text-center">Status / Simulator Slider</th>
                <th className="py-2.5 px-3 text-right">Simulated (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {(activeCourse.assessments || []).map(task => {
                const isGraded = task.score !== null && task.score !== undefined;
                const effectiveScore = simulatedScores[task.id] !== undefined
                  ? simulatedScores[task.id]
                  : isGraded ? parseFloat(task.score) : 85;

                const isHighWeight = (parseFloat(task.weight) || 0) >= 15;

                return (
                  <tr key={task.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-white flex items-center gap-1.5">
                        <span>{task.name}</span>
                        {isHighWeight && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
                            High Stakes
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400">{task.topic || 'Curriculum milestone'}</div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="text-slate-300 font-mono text-[11px] bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        {task.category}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-mono text-slate-400 text-[11px]">
                      {task.dueDate || 'TBA'}
                    </td>

                    <td className="py-3 px-3 text-center font-mono font-bold text-white">
                      {task.weight}%
                    </td>

                    <td className="py-3 px-3">
                      {isGraded ? (
                        <div className="flex items-center justify-center gap-1.5 text-slate-400">
                          <Lock className="w-3 h-3 text-emerald-400" />
                          <span className="text-[11px] font-semibold text-emerald-400">Graded: {task.score}%</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 max-w-xs mx-auto">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="1"
                            value={effectiveScore}
                            onChange={(e) => handleScoreChange(task.id, e.target.value)}
                            className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-red-500"
                          />
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-3 text-right">
                      {isGraded ? (
                        <span className="font-mono font-bold text-emerald-400 text-xs">
                          {task.score}%
                        </span>
                      ) : (
                        <div className="flex items-center justify-end gap-1.5">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={effectiveScore}
                            onChange={(e) => handleScoreChange(task.id, e.target.value)}
                            className="w-14 px-1.5 py-0.5 rounded bg-slate-950 border border-slate-700 text-right font-mono font-bold text-white text-xs focus:border-red-500 focus:outline-none"
                          />
                          <span className="text-slate-500 font-mono text-xs">%</span>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Target GPA Simulator Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-red-400" />
            <div>
              <h3 className="text-sm font-bold text-white">Target GPA Simulator</h3>
              <p className="text-xs text-slate-400">Adjust your desired GPA to calculate target course grades</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-300">Target GPA:</span>
            <span className="font-mono text-lg font-bold text-amber-400 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30">
              {simulatorTarget.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <input
            type="range"
            min="2.0"
            max="4.0"
            step="0.05"
            value={simulatorTarget}
            onChange={(e) => setSimulatorTarget(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <div className="flex justify-between text-[11px] font-mono text-slate-500">
            <span>2.00 (Pass)</span>
            <span>3.00 (Good)</span>
            <span>3.50 (Very Good)</span>
            <span>3.80+ (Honour List)</span>
            <span className="text-amber-400 font-bold">4.00 (Distinction Target)</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span>
              To achieve a <strong className="text-white">{simulatorTarget.toFixed(2)} GPA</strong>, you need an average of{' '}
              <strong className="text-emerald-400 font-mono">
                {simulatorTarget >= 4.0 ? '80 - 100% (A / A+)' : simulatorTarget >= 3.5 ? '75 - 79% (B+)' : simulatorTarget >= 3.0 ? '70 - 74% (B)' : '60 - 69% (C / C+)'}
              </strong>{' '}
              across all 1.0 credit courses!
            </span>
          </div>
        </div>
      </div>

      {/* Course Grade Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Course Grade Book</h3>
          <span className="text-xs text-slate-400">Click any course for detailed task breakdown</span>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 text-[10px] uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Course</th>
              <th className="py-3 px-4">Title</th>
              <th className="py-3 px-4">Credits</th>
              <th className="py-3 px-4">Evaluated Weight</th>
              <th className="py-3 px-4 text-center">Current Grade</th>
              <th className="py-3 px-4 text-center">Letter Grade</th>
              <th className="py-3 px-4 text-center">Seneca GPA</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {courses.map(course => {
              const metrics = getCourseMetrics(course);
              return (
                <tr 
                  key={course.id}
                  onClick={() => {
                    setSelectedCourseId(course.id);
                    setCurrentView('course-detail');
                  }}
                  className="hover:bg-slate-800/40 transition cursor-pointer group"
                >
                  <td className="py-3.5 px-4 font-mono font-bold">
                    <span 
                      className="px-2 py-0.5 rounded border text-[11px]"
                      style={{
                        color: course.color,
                        backgroundColor: `${course.color}15`,
                        borderColor: `${course.color}40`
                      }}
                    >
                      {course.code}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-slate-100 group-hover:text-red-400 transition">
                    {course.name}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-slate-400">
                    {course.credits.toFixed(1)} {course.credits === 0 ? '(SAT/UN)' : ''}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-slate-950 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.min(100, metrics.completedWeight)}%`,
                            backgroundColor: course.color || '#3b82f6'
                          }}
                        />
                      </div>
                      <span className="font-mono text-[11px] text-slate-400">
                        {metrics.completedWeight.toFixed(1)}%
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-center font-mono font-bold">
                    {metrics.currentAverage !== null ? (
                      <span className="text-emerald-400 text-sm">
                        {Math.round(metrics.currentAverage)}%
                      </span>
                    ) : (
                      <span className="text-slate-500">Pending</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-center font-bold">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">
                      {metrics.letterGrade}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-300">
                    {course.credits > 0 ? (metrics.gpa !== null ? metrics.gpa.toFixed(1) : '--') : 'N/A'}
                  </td>

                  <td className="py-3.5 px-4 text-right text-red-400 font-semibold group-hover:underline">
                    View Details →
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Seneca Official Grading Scale Reference Table & Last Semester Context */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Seneca Scale */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Official Seneca Polytechnic Grading Scale</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[10px] text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-2">Letter</th>
                  <th className="py-2">Percentage</th>
                  <th className="py-2">GPA Value</th>
                  <th className="py-2">Academic Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                {SENECA_GRADE_SCALE.map(row => (
                  <tr key={row.letter} className="hover:bg-slate-800/30">
                    <td className="py-1.5 font-bold text-red-400">{row.letter}</td>
                    <td className="py-1.5 text-slate-300">{row.min}% - {row.max}%</td>
                    <td className="py-1.5 font-bold text-white">{row.gpa.toFixed(1)}</td>
                    <td className="py-1.5 font-sans text-slate-400">{row.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Previous Semester Reference */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Semester 2 Retrospective (From CSV Context)</h3>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Last semester's tracker recorded a stellar record with <strong>24 out of 24 tasks completed</strong> across all Semester 2 courses:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
            {[
              { code: "CSN205", label: "Intro to Networking", count: "3 Tasks" },
              { code: "OPS245", label: "Linux Administration", count: "7 Tasks" },
              { code: "SEC220", label: "Cybersecurity Fundamentals", count: "5 Tasks" },
              { code: "MST200", label: "Microsoft Server OS", count: "5 Tasks" },
              { code: "FLM278", label: "Film & Society", count: "3 Tasks" },
              { code: "NAT101", label: "Environmental Science", count: "1 Assessment" }
            ].map(prev => (
              <div key={prev.code} className="p-2 rounded-lg bg-slate-950/70 border border-slate-800 text-slate-300">
                <div className="font-bold text-emerald-400">{prev.code}</div>
                <div className="text-[10px] text-slate-400 font-sans">{prev.label}</div>
                <div className="text-[10px] text-slate-500 mt-1">✓ {prev.count} Done</div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 font-medium">
            🎯 Strong prerequisite foundations in CSN205, OPS245, SEC220, and MST200 carry directly into Semester 3 (CSN305, OPS345, SEC320, MST300)!
          </div>
        </div>

      </div>

    </div>
  );
}
