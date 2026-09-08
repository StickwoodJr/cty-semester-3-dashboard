import React, { useState } from 'react';
import { AcademicProvider, useAcademic } from './context/AcademicContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import CalendarView from './components/CalendarView';
import TasksView from './components/TasksView';
import CourseDetailView from './components/CourseDetailView';
import TimetableView from './components/TimetableView';
import MarksGpaView from './components/MarksGpaView';
import WtpCareerHub from './components/WtpCareerHub';
import AssessmentModal from './components/AssessmentModal';
import CourseEditModal from './components/CourseEditModal';
import WhatIfCalculatorModal from './components/WhatIfCalculatorModal';
import SettingsModal from './components/SettingsModal';
import SyncExportModal from './components/SyncExportModal';
import FocusTimerView from './components/FocusTimerView';
import LabToolbeltView from './components/LabToolbeltView';
import { CheckCircle2, AlertCircle, Info, Menu, X } from 'lucide-react';

function AppContent() {
  const { currentView, toastMessage } = useAcademic();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Global Navbar */}
      <Navbar />

      {/* Main Body */}
      <div className="flex-1 flex">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div 
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative w-72 bg-slate-900 h-full border-r border-slate-800 z-10 flex flex-col">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <span className="font-bold text-white text-sm">Seneca CTY Menu</span>
                <button onClick={() => setMobileMenuOpen(false)} className="text-slate-400 p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto" onClick={() => setMobileMenuOpen(false)}>
                <Sidebar />
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto min-h-[calc(100vh-61px)]">
          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden mb-4 flex items-center justify-between bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="flex items-center gap-2 text-xs font-semibold text-slate-300"
            >
              <Menu className="w-4 h-4 text-red-400" />
              <span>Menu & Navigation</span>
            </button>
            <span className="text-xs font-mono text-slate-400 capitalize">{currentView}</span>
          </div>

          {/* View Router */}
          {currentView === 'dashboard' && <DashboardView />}
          {currentView === 'calendar' && <CalendarView />}
          {currentView === 'tasks' && <TasksView />}
          {currentView === 'course-detail' && <CourseDetailView />}
          {currentView === 'schedule' && <TimetableView />}
          {currentView === 'marks' && <MarksGpaView />}
          {currentView === 'wtp' && <WtpCareerHub />}
          {currentView === 'timer' && <FocusTimerView />}
          {currentView === 'toolbelt' && <LabToolbeltView />}
        </main>
      </div>

      {/* Global Modals */}
      <AssessmentModal />
      <CourseEditModal />
      <WhatIfCalculatorModal />
      <SettingsModal />
      <SyncExportModal />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white shadow-2xl animate-fade-in text-xs font-medium">
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : toastMessage.type === 'warning' ? (
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          ) : (
            <Info className="w-4 h-4 text-blue-400 shrink-0" />
          )}
          <span>{toastMessage.msg}</span>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AcademicProvider>
      <AppContent />
    </AcademicProvider>
  );
}
