import React from 'react';
import { useAcademic } from '../context/AcademicContext';
import { 
  Printer, ArrowLeft, Download, Calendar, Clock, MapPin, 
  Award, Shield, FileText, CheckCircle2, Flame
} from 'lucide-react';
import { SENECA_GRADE_SCALE } from '../data/senecaDates';

export default function PrintReportView() {
  const { courses, semesterConfig, setCurrentView, setActiveModal } = useAcademic();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      
      {/* Interactive Toolbar (Hidden during print) */}
      <div className="no-print bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
          <div>
            <h3 className="text-sm font-bold text-white">Printable Semester One-Pager</h3>
            <p className="text-xs text-slate-400">Generates clean, high-density reference sheet or PDF</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveModal('sync-export')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Download className="w-4 h-4 text-red-400" />
            <span>Export iCal (.ics)</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-900/30 flex items-center gap-2 transition hover:scale-[1.02]"
          >
            <Printer className="w-4 h-4" />
            <span>Print or Save as PDF</span>
          </button>
        </div>
      </div>

      {/* The Printable Page Sheet */}
      <div className="print-page bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl space-y-6 text-slate-200 print:border-none print:shadow-none print:p-0">
        
        {/* Document Header */}
        <div className="border-b-2 border-red-600 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xs tracking-wider uppercase text-red-500 font-mono">
                Seneca Polytechnic • Newnham Campus
              </span>
            </div>
            <h1 className="text-2xl font-black text-white print:text-slate-900 tracking-tight mt-0.5">
              Computer Systems Technology (CTY) — Semester 3
            </h1>
            <p className="text-xs text-slate-400 print:text-slate-600 mt-1">
              Fall 2026 Term Master Reference & Academic Accountability Sheet (Sept 8 – Dec 18, 2026)
            </p>
          </div>

          <div className="text-right sm:shrink-0">
            <div className="inline-block px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 print:text-amber-800 font-bold text-xs">
              🎯 Academic Goal: 4.00 GPA (Distinction)
            </div>
            <div className="text-[11px] text-slate-400 print:text-slate-500 mt-1 font-mono">
              Target: ≥80% (A / A+) in all graded courses
            </div>
          </div>
        </div>

        {/* Section 1: Weekly Class Timetable Table */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 print:text-slate-800 flex items-center gap-2">
            <Clock className="w-4 h-4 text-red-500" />
            <span>1. Weekly Lecture & Lab Schedule</span>
          </h2>

          <div className="border border-slate-800 print:border-slate-300 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950/80 print:bg-slate-100 text-slate-400 print:text-slate-700 font-bold border-b border-slate-800 print:border-slate-300">
                  <th className="p-2.5">Day</th>
                  <th className="p-2.5">Course</th>
                  <th className="p-2.5">Time</th>
                  <th className="p-2.5">Campus Room</th>
                  <th className="p-2.5">Professor</th>
                  <th className="p-2.5">Delivery Mode</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 print:divide-slate-200">
                <tr>
                  <td className="p-2.5 font-bold" rowSpan={3}>Monday</td>
                  <td className="p-2.5 font-mono font-bold text-purple-400 print:text-purple-700">MST300</td>
                  <td className="p-2.5 font-mono">9:50 AM – 11:35 AM</td>
                  <td className="p-2.5">Bldg C - C3036</td>
                  <td className="p-2.5">Nooshin Beheshti</td>
                  <td className="p-2.5">In-Person Lecture</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-mono font-bold text-sky-400 print:text-sky-700">SEC320</td>
                  <td className="p-2.5 font-mono">1:30 PM – 3:15 PM</td>
                  <td className="p-2.5">Bldg K - K1272</td>
                  <td className="p-2.5">Homayoun Mohamadi</td>
                  <td className="p-2.5">In-Person Lab</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-mono font-bold text-rose-400 print:text-rose-700">DAT330</td>
                  <td className="p-2.5 font-mono">3:20 PM – 5:05 PM</td>
                  <td className="p-2.5">Bldg A - A1509</td>
                  <td className="p-2.5">Parul Kantaria</td>
                  <td className="p-2.5">In-Person Lecture</td>
                </tr>

                <tr>
                  <td className="p-2.5 font-bold" rowSpan={2}>Tuesday</td>
                  <td className="p-2.5 font-mono font-bold text-purple-400 print:text-purple-700">MST300</td>
                  <td className="p-2.5 font-mono">9:50 AM – 11:35 AM</td>
                  <td className="p-2.5">Bldg A - A4515</td>
                  <td className="p-2.5">Nooshin Beheshti</td>
                  <td className="p-2.5">In-Person Lab</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-mono font-bold text-sky-400 print:text-sky-700">SEC320</td>
                  <td className="p-2.5 font-mono">11:40 AM – 1:25 PM</td>
                  <td className="p-2.5">Bldg K - K1272</td>
                  <td className="p-2.5">Homayoun Mohamadi</td>
                  <td className="p-2.5">In-Person Lab</td>
                </tr>

                <tr>
                  <td className="p-2.5 font-bold" rowSpan={3}>Wednesday</td>
                  <td className="p-2.5 font-mono font-bold text-cyan-400 print:text-cyan-700">WTP100</td>
                  <td className="p-2.5 font-mono">11:40 AM – 1:25 PM</td>
                  <td className="p-2.5">ONLINE (Blackboard)</td>
                  <td className="p-2.5">WIL Co-ordinator</td>
                  <td className="p-2.5">Online Synchronous</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-mono font-bold text-amber-400 print:text-amber-700">OPS345</td>
                  <td className="p-2.5 font-mono">1:30 PM – 3:15 PM</td>
                  <td className="p-2.5">Newnham Lab</td>
                  <td className="p-2.5">Linux Systems Faculty</td>
                  <td className="p-2.5">In-Person Lab</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-mono font-bold text-rose-400 print:text-rose-700">DAT330</td>
                  <td className="p-2.5 font-mono">5:10 PM – 6:55 PM</td>
                  <td className="p-2.5">Bldg A - A3512</td>
                  <td className="p-2.5">Parul Kantaria</td>
                  <td className="p-2.5">In-Person Lab</td>
                </tr>

                <tr>
                  <td className="p-2.5 font-bold" rowSpan={2}>Thursday</td>
                  <td className="p-2.5 font-mono font-bold text-amber-400 print:text-amber-700">OPS345</td>
                  <td className="p-2.5 font-mono">8:55 AM – 10:40 AM</td>
                  <td className="p-2.5">Newnham Lab</td>
                  <td className="p-2.5">Linux Systems Faculty</td>
                  <td className="p-2.5">In-Person Lab</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-mono font-bold text-emerald-400 print:text-emerald-700">CSN305</td>
                  <td className="p-2.5 font-mono">12:35 PM – 4:10 PM</td>
                  <td className="p-2.5">Newnham Bldg K - K1270</td>
                  <td className="p-2.5">Lisa Li</td>
                  <td className="p-2.5">In-Person Extended Block</td>
                </tr>

                <tr>
                  <td className="p-2.5 font-bold">Friday</td>
                  <td className="p-2.5 font-mono font-bold text-pink-400 print:text-pink-700">PSY262</td>
                  <td className="p-2.5 font-mono">1:30 PM – 4:10 PM</td>
                  <td className="p-2.5">ONLINE (or K2241)</td>
                  <td className="p-2.5">Glen Choi</td>
                  <td className="p-2.5">Online Flexible</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: Courses & Passing Criteria Breakdown */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 print:text-slate-800 flex items-center gap-2">
            <Shield className="w-4 h-4 text-red-500" />
            <span>2. Course Breakdown & Official Syllabus Passing Thresholds</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {courses.map(course => (
              <div 
                key={course.id} 
                className="p-3 rounded-xl border border-slate-800 print:border-slate-300 bg-slate-950/40 print:bg-slate-50 space-y-1.5 break-inside-avoid"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-white print:text-slate-900">
                    {course.code} — {course.name}
                  </span>
                  <span className="text-[11px] text-slate-400 print:text-slate-600">
                    Sec {course.section}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 print:text-slate-600">
                  👨‍🏫 Instructor: <strong>{course.professor}</strong> ({course.email})
                </div>
                <div className="text-[11px] text-amber-400/90 print:text-amber-800 font-medium">
                  ⚖️ Threshold: {course.passingRequirements?.[0] || 'Achieve ≥50% overall'}
                </div>
                {course.budgetTracker?.enabled && (
                  <div className="text-[10px] text-rose-400 print:text-rose-700 font-bold">
                    ⚠️ Cloud Budget Cap: $50 AWS Learner Lab strictly enforced!
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Critical Term Dates */}
        <div className="space-y-2 break-inside-avoid">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 print:text-slate-800 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-red-500" />
            <span>3. Critical Fall 2026 Milestones</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="p-2.5 rounded-xl border border-slate-800 print:border-slate-300 bg-slate-950/60 print:bg-slate-50">
              <div className="font-bold text-white print:text-slate-900">Sept 8, 2026</div>
              <div className="text-[11px] text-slate-400 print:text-slate-600">First Day of Classes</div>
            </div>
            <div className="p-2.5 rounded-xl border border-amber-500/30 print:border-amber-400 bg-amber-500/10 print:bg-amber-50">
              <div className="font-bold text-amber-400 print:text-amber-900">Oct 23, 2026</div>
              <div className="text-[11px] text-amber-300/80 print:text-amber-800">WTP100 Hard Deadline</div>
            </div>
            <div className="p-2.5 rounded-xl border border-blue-500/30 print:border-blue-400 bg-blue-500/10 print:bg-blue-50">
              <div className="font-bold text-blue-400 print:text-blue-900">Oct 26 – 30</div>
              <div className="text-[11px] text-blue-300/80 print:text-blue-800">Study / Reading Week</div>
            </div>
            <div className="p-2.5 rounded-xl border border-rose-500/30 print:border-rose-400 bg-rose-500/10 print:bg-rose-50">
              <div className="font-bold text-rose-400 print:text-rose-900">Dec 7 – 18</div>
              <div className="text-[11px] text-rose-300/80 print:text-rose-800">Final Exams Period</div>
            </div>
          </div>
        </div>

        {/* Section 4: Seneca Official 4.0 GPA Grading Scale */}
        <div className="space-y-2 pt-2 border-t border-slate-800 print:border-slate-300">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold uppercase tracking-wider text-slate-400 print:text-slate-700">
              Seneca GPA Scale Reference:
            </span>
            <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400 print:text-slate-600">
              <span><strong>A+ (4.0)</strong>: 90-100%</span>
              <span><strong>A (4.0)</strong>: 80-89%</span>
              <span><strong>B+ (3.5)</strong>: 75-79%</span>
              <span><strong>B (3.0)</strong>: 70-74%</span>
              <span><strong>Passing</strong>: ≥50%</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
