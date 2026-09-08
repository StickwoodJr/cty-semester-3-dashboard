import React, { useState } from 'react';
import { useAcademic } from '../context/AcademicContext';
import { 
  X, Calendar, Download, Smartphone, Laptop, CheckCircle2, 
  ExternalLink, Sparkles, Clock, AlertCircle, FileSpreadsheet, Share2
} from 'lucide-react';
import { 
  generateTimetableIcs, 
  generateAssessmentsIcs, 
  generateAllInOneIcs, 
  triggerFileDownload 
} from '../utils/icsExport';

export default function SyncExportModal() {
  const { 
    courses, 
    activeModal, 
    setActiveModal, 
    semesterConfig,
    showToast 
  } = useAcademic();

  const [activeTab, setActiveTab] = useState('downloads'); // 'downloads' | 'guide-ios' | 'guide-google'
  const [downloadedType, setDownloadedType] = useState(null);

  if (activeModal !== 'sync-export') return null;

  const handleDownload = (type) => {
    try {
      if (type === 'all') {
        const content = generateAllInOneIcs(courses, semesterConfig);
        triggerFileDownload('Seneca-CTY-Sem3-Master-Calendar.ics', content);
        setDownloadedType('all');
        showToast('Downloaded All-in-One Master Calendar (.ics)', 'success');
      } else if (type === 'timetable') {
        const content = generateTimetableIcs(courses);
        triggerFileDownload('Seneca-CTY-Sem3-Weekly-Timetable.ics', content);
        setDownloadedType('timetable');
        showToast('Downloaded Weekly Timetable (.ics)', 'success');
      } else if (type === 'tasks') {
        const content = generateAssessmentsIcs(courses);
        triggerFileDownload('Seneca-CTY-Sem3-Assessments.ics', content);
        setDownloadedType('tasks');
        showToast('Downloaded Assessments & Deadlines (.ics)', 'success');
      }
    } catch (e) {
      console.error('Export failed:', e);
      showToast('Export failed. Please try again.', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Calendar Sync & iCal (.ics) Export
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                  iOS • Google • Outlook
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Sync your class timetable, room numbers, and 60+ evaluation deadlines directly to your phone.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-6 pt-2 gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('downloads')}
            className={`pb-2.5 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'downloads' 
                ? 'border-red-500 text-white' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Files (.ics)</span>
          </button>
          <button
            onClick={() => setActiveTab('guide-ios')}
            className={`pb-2.5 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'guide-ios' 
                ? 'border-red-500 text-white' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>iPhone / iOS Setup</span>
          </button>
          <button
            onClick={() => setActiveTab('guide-google')}
            className={`pb-2.5 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'guide-google' 
                ? 'border-red-500 text-white' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>Google Calendar / Outlook</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {activeTab === 'downloads' && (
            <div className="space-y-3.5">
              
              {/* Option 1: Master All-in-One (Recommended) */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-red-950/40 via-slate-900 to-slate-900 border border-red-500/40 hover:border-red-500 transition relative group">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">
                        ⭐ All-in-One Master Calendar (.ics)
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-bold border border-red-500/30">
                        Recommended
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Includes everything: your weekly class timetable with room locations (e.g. C3036, K1272), all 60+ assignment due dates with alarms, and official Seneca academic dates (Thanksgiving, Reading Week, Finals).
                    </p>
                    <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-400 font-mono">
                      <span>• 7 Courses</span>
                      <span>• 11 Weekly Slots</span>
                      <span>• 60+ Due Dates</span>
                      <span>• 15-min Class Alarms</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDownload('all')}
                    className="shrink-0 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-900/30 transition flex items-center gap-2 hover:scale-[1.02]"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                </div>
              </div>

              {/* Option 2: Timetable Only */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">
                        Class & Lecture Timetable Only (.ics)
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Just your recurring weekly class schedule from Sept 8 to Dec 18. Each lecture includes room numbers, professor emails, and a built-in 15-minute advance reminder before class.
                    </p>
                  </div>

                  <button
                    onClick={() => handleDownload('timetable')}
                    className="shrink-0 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition flex items-center gap-2"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>

              {/* Option 3: Assessments & Due Dates Only */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">
                        Assessments & Due Dates Only (.ics)
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      All lab due dates, quiz deadlines, project milestones, and WTP100 completion targets with automatic 1-day and 2-day notifications.
                    </p>
                  </div>

                  <button
                    onClick={() => handleDownload('tasks')}
                    className="shrink-0 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition flex items-center gap-2"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'guide-ios' && (
            <div className="space-y-4 text-xs text-slate-300">
              <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 flex items-center gap-2.5">
                <Smartphone className="w-4 h-4 shrink-0" />
                <span>Importing to iPhone / iPad Calendar takes under 30 seconds!</span>
              </div>

              <ol className="space-y-3 list-decimal list-inside text-slate-300 leading-relaxed pl-1">
                <li className="pl-1">
                  <strong>Download the .ics file</strong> by clicking the Download button in the first tab.
                </li>
                <li className="pl-1">
                  <strong>Transfer to your iPhone:</strong>
                  <ul className="list-disc list-inside pl-4 text-slate-400 mt-1 space-y-1">
                    <li>AirDrop the file to your iPhone/iPad, OR</li>
                    <li>Email the <code>.ics</code> file to yourself and open it in Apple Mail, OR</li>
                    <li>Open this dashboard directly on your iPhone Safari browser and tap Download!</li>
                  </ul>
                </li>
                <li className="pl-1">
                  <strong>Tap the downloaded file</strong> in your iPhone Files or Mail app.
                </li>
                <li className="pl-1">
                  iOS will display a preview with all events. Tap <strong>"Add All"</strong> in the top right corner.
                </li>
                <li className="pl-1">
                  Done! Your Seneca timetable, room numbers, and 15-minute alerts are now directly on your iPhone lockscreen and Apple Watch.
                </li>
              </ol>
            </div>
          )}

          {activeTab === 'guide-google' && (
            <div className="space-y-4 text-xs text-slate-300">
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center gap-2.5">
                <Laptop className="w-4 h-4 shrink-0" />
                <span>Compatible with Google Calendar, Microsoft 365, and Outlook</span>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-white text-sm">Google Calendar Instructions:</h4>
                <ol className="space-y-2 list-decimal list-inside text-slate-400 pl-1">
                  <li>Download the <code>.ics</code> file above to your computer.</li>
                  <li>Open <a href="https://calendar.google.com" target="_blank" rel="noreferrer" className="text-red-400 underline">Google Calendar</a> in your web browser.</li>
                  <li>Click the gear icon in top-right → <strong>Settings</strong>.</li>
                  <li>In the left menu, click <strong>Import & export</strong>.</li>
                  <li>Click <strong>Select file from your computer</strong> and choose the downloaded <code>.ics</code> file.</li>
                  <li>Select your target calendar (e.g. your Seneca account) and click <strong>Import</strong>.</li>
                </ol>

                <h4 className="font-bold text-white text-sm pt-2">Outlook Instructions:</h4>
                <ol className="space-y-2 list-decimal list-inside text-slate-400 pl-1">
                  <li>Double-click the downloaded <code>.ics</code> file to open it in Outlook directly, OR</li>
                  <li>Go to <strong>File → Open & Export → Open Calendar (.ics)</strong>.</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-800 bg-slate-900/90 text-xs">
          <span className="text-slate-400">
            Standard RFC 5545 format with America/Toronto timezone
          </span>
          <button
            onClick={() => setActiveModal(null)}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
