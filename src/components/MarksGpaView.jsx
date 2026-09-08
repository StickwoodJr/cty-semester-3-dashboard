import React, { useState } from 'react';
import { useAcademic } from '../context/AcademicContext';
import { 
  BarChart3, Award, TrendingUp, CheckCircle, 
  HelpCircle, Calculator, Info, Sparkles, BookOpen
} from 'lucide-react';
import { SENECA_GRADE_SCALE } from '../data/senecaDates';

export default function MarksGpaView() {
  const { 
    courses, 
    getCourseMetrics, 
    getSemesterMetrics, 
    setSelectedCourseId, 
    setCurrentView 
  } = useAcademic();

  const semesterMetrics = getSemesterMetrics();
  const [simulatorTarget, setSimulatorTarget] = useState(3.8);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      
      {/* Top Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Academic Performance
              </span>
              <span className="text-xs text-slate-400">Seneca Official 4.0 GPA Scale</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight mt-1">
              Marks & Semester GPA Command Center
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live weighted grade computations, passing threshold audits, and target GPA simulation.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Projected GPA</div>
              <div className="text-2xl font-extrabold text-emerald-400 font-mono">
                {semesterMetrics.currentGpa}
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
            <span className="font-mono text-lg font-bold text-red-400 px-3 py-1 rounded-lg bg-red-500/10 border border-red-500/20">
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
            className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-red-500"
          />
          <div className="flex justify-between text-[11px] font-mono text-slate-500">
            <span>2.00 (Pass)</span>
            <span>3.00 (Good)</span>
            <span>3.50 (Very Good)</span>
            <span className="text-emerald-400 font-bold">3.80+ (President's Honour List)</span>
            <span className="text-red-400 font-bold">4.00 (Distinction)</span>
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
