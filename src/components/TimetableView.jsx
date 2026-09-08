import React from 'react';
import { useAcademic } from '../context/AcademicContext';
import { Clock, MapPin, Calendar, Info, BookOpen, ExternalLink } from 'lucide-react';

export default function TimetableView() {
  const { courses, setSelectedCourseId, setCurrentView } = useAcademic();

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = [
    "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", 
    "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", 
    "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM"
  ];

  // Schedule items mapped
  const scheduleData = {
    Monday: [
      {
        courseCode: "MST300",
        courseId: "mst300",
        name: "Intro to Microsoft Cloud Technologies",
        time: "9:50 AM - 11:35 AM",
        startMin: 590, // 9:50
        durationMin: 105,
        room: "Newnham Bldg C - C3036",
        instructor: "Nooshin Beheshti",
        color: "#0ea5e9",
        mode: "In-Person"
      },
      {
        courseCode: "SEC320",
        courseId: "sec320",
        name: "Security Incident Response",
        time: "1:30 PM - 3:15 PM",
        startMin: 810, // 13:30
        durationMin: 105,
        room: "Newnham Bldg K - K1272",
        instructor: "Homayoun Mohamadi",
        color: "#ef4444",
        mode: "In-Person"
      },
      {
        courseCode: "DAT330",
        courseId: "dat330",
        name: "Introduction to Databases",
        time: "3:20 PM - 5:05 PM",
        startMin: 920, // 15:20
        durationMin: 105,
        room: "Newnham Bldg A - A1509",
        instructor: "Parul Kantaria",
        color: "#3b82f6",
        mode: "In-Person"
      }
    ],
    Tuesday: [
      {
        courseCode: "MST300",
        courseId: "mst300",
        name: "Intro to Microsoft Cloud Technologies",
        time: "9:50 AM - 11:35 AM",
        startMin: 590,
        durationMin: 105,
        room: "Newnham Bldg A - A4515",
        instructor: "Nooshin Beheshti",
        color: "#0ea5e9",
        mode: "In-Person"
      },
      {
        courseCode: "SEC320",
        courseId: "sec320",
        name: "Security Incident Response",
        time: "11:40 AM - 1:25 PM",
        startMin: 700, // 11:40
        durationMin: 105,
        room: "Newnham Bldg K - K1272",
        instructor: "Homayoun Mohamadi",
        color: "#ef4444",
        mode: "In-Person"
      }
    ],
    Wednesday: [
      {
        courseCode: "OPS345",
        courseId: "ops345",
        name: "Open System Application Server",
        time: "9:50 AM - 11:35 AM",
        startMin: 590,
        durationMin: 105,
        room: "Newnham Lab - Ubuntu Host Drive",
        instructor: "Linux Systems Faculty",
        color: "#10b981",
        mode: "In-Person Lab"
      },
      {
        courseCode: "DAT330",
        courseId: "dat330",
        name: "Introduction to Databases",
        time: "5:10 PM - 6:55 PM",
        startMin: 1030, // 17:10
        durationMin: 105,
        room: "Newnham Bldg A - A3512",
        instructor: "Parul Kantaria",
        color: "#3b82f6",
        mode: "In-Person"
      }
    ],
    Thursday: [
      {
        courseCode: "CSN305",
        courseId: "csn305",
        name: "Software Defined Networks (TBA)",
        time: "Flexible / TBA by Seneca",
        startMin: 600,
        durationMin: 120,
        room: "Awaiting Schedule Release",
        instructor: "Faculty TBA",
        color: "#6366f1",
        mode: "Schedule Pending",
        isTba: true
      }
    ],
    Friday: [
      {
        courseCode: "OPS345",
        courseId: "ops345",
        name: "Open System Application Server",
        time: "9:50 AM - 11:35 AM",
        startMin: 590,
        durationMin: 105,
        room: "Newnham Lab - Ubuntu Host Drive",
        instructor: "Linux Systems Faculty",
        color: "#10b981",
        mode: "In-Person Lab"
      },
      {
        courseCode: "PSY262",
        courseId: "psy262",
        name: "Mindfulness for Students",
        time: "1:30 PM - 4:10 PM",
        startMin: 810, // 13:30
        durationMin: 160,
        room: "Newnham Bldg K - K2241 (or Online)",
        instructor: "Glen Choi",
        color: "#a855f7",
        mode: "Flexible (On-Campus / Online)"
      }
    ]
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      
      {/* Timetable Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
                Fall 2026 Timetable
              </span>
              <span className="text-xs text-slate-400">Seneca Newnham Campus</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight mt-1">
              Weekly Lecture & Laboratory Schedule
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Mapped directly to official course outlines, sections, and room numbers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-red-400" />
              <span>Campus: 1750 Finch Ave E, Toronto</span>
            </div>
          </div>
        </div>
      </div>

      {/* Online & Flexible Courses Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-slate-300 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 font-bold font-mono shrink-0">
            WTP100
          </div>
          <div>
            <div className="font-bold text-white text-sm">Work Term Preparation (Online Synchronous)</div>
            <div className="text-slate-300 mt-0.5">
              Asynchronous weekly modules + Live synchronous Q&A sessions. Mandatory deadline: Friday, October 23, 2026.
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-xs text-slate-300 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 font-bold font-mono shrink-0">
            PSY262
          </div>
          <div>
            <div className="font-bold text-white text-sm">Flexible Mode: In-Person or Online</div>
            <div className="text-slate-300 mt-0.5">
              Fridays 1:30 PM - 4:10 PM in Bldg K - K2241 or live broadcast online simultaneously via MS Teams/BigBlueButton.
            </div>
          </div>
        </div>
      </div>

      {/* 5-Day Schedule Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {days.map(day => {
          const dayClasses = scheduleData[day] || [];
          return (
            <div key={day} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col shadow-sm">
              <div className="pb-3 border-b border-slate-800 flex items-center justify-between mb-3">
                <span className="font-bold text-sm text-white">{day}</span>
                <span className="text-[10px] font-mono text-slate-400">
                  {dayClasses.length} {dayClasses.length === 1 ? 'class' : 'classes'}
                </span>
              </div>

              <div className="space-y-3 flex-1">
                {dayClasses.length === 0 ? (
                  <div className="py-12 text-center text-slate-600 text-xs">
                    No classes scheduled
                  </div>
                ) : (
                  dayClasses.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setSelectedCourseId(item.courseId);
                        setCurrentView('course-detail');
                      }}
                      className="p-3.5 rounded-xl border transition cursor-pointer group shadow-sm flex flex-col justify-between"
                      style={{
                        backgroundColor: `${item.color}10`,
                        borderColor: `${item.color}35`
                      }}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span 
                            className="font-mono text-xs font-bold px-1.5 py-0.5 rounded border"
                            style={{
                              color: item.color,
                              backgroundColor: `${item.color}20`,
                              borderColor: `${item.color}50`
                            }}
                          >
                            {item.courseCode}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950/70 text-slate-300 font-mono">
                            {item.mode}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-white group-hover:text-red-400 transition line-clamp-2">
                          {item.name}
                        </h4>

                        <div className="flex items-center gap-1 text-[11px] font-mono text-slate-300 font-semibold mt-2">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.time}</span>
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-800/60 text-[11px] space-y-1">
                        <div className="flex items-center gap-1 text-amber-400 font-medium">
                          <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                          <span className="truncate">{item.room}</span>
                        </div>
                        <div className="text-slate-400 truncate">
                          {item.instructor}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
