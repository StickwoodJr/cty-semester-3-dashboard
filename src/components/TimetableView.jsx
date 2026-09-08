import React from 'react';
import { useAcademic } from '../context/AcademicContext';
import { Clock, MapPin, Calendar, ExternalLink, Globe, Wifi } from 'lucide-react';

export default function TimetableView() {
  const { setSelectedCourseId, setCurrentView } = useAcademic();

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  // Exact schedule matching the user's calendar
  const scheduleData = {
    Monday: [
      {
        courseCode: "MST300",
        courseId: "mst300",
        name: "Intro to Microsoft Cloud Technologies",
        time: "9:50 AM - 11:35 AM",
        startTime: "9:50 AM",
        room: "Newnham Bldg C - C3036",
        instructor: "Nooshin Beheshti",
        color: "#a855f7", // Purple
        mode: "In-Person"
      },
      {
        courseCode: "SEC320",
        courseId: "sec320",
        name: "Security Incident Response",
        time: "1:30 PM - 3:15 PM",
        startTime: "1:30 PM",
        room: "Newnham Bldg K - K1272",
        instructor: "Homayoun Mohamadi",
        color: "#0284c7", // Blue
        mode: "In-Person"
      },
      {
        courseCode: "DAT330",
        courseId: "dat330",
        name: "Introduction to Databases",
        time: "3:20 PM - 5:05 PM",
        startTime: "3:20 PM",
        room: "Newnham Bldg A - A1509",
        instructor: "Parul Kantaria",
        color: "#ef4444", // Red
        mode: "In-Person"
      }
    ],
    Tuesday: [
      {
        courseCode: "MST300",
        courseId: "mst300",
        name: "Intro to Microsoft Cloud Technologies",
        time: "9:50 AM - 11:35 AM",
        startTime: "9:50 AM",
        room: "Newnham Bldg A - A4515",
        instructor: "Nooshin Beheshti",
        color: "#a855f7", // Purple
        mode: "In-Person"
      },
      {
        courseCode: "SEC320",
        courseId: "sec320",
        name: "Security Incident Response",
        time: "11:40 AM - 1:25 PM",
        startTime: "11:40 AM",
        room: "Newnham Bldg K - K1272",
        instructor: "Homayoun Mohamadi",
        color: "#0284c7", // Blue
        mode: "In-Person"
      }
    ],
    Wednesday: [
      {
        courseCode: "WTP100",
        courseId: "wtp100",
        name: "Work Term Preparation",
        time: "11:40 AM - 1:25 PM",
        startTime: "11:40 AM",
        room: "ONLINE (Blackboard Ultra)",
        instructor: "WIL Co-ordinator",
        color: "#06b6d4", // Cyan
        mode: "ONLINE Synchronous",
        isOnline: true
      },
      {
        courseCode: "OPS345",
        courseId: "ops345",
        name: "Open System Application Server",
        time: "1:30 PM - 3:15 PM",
        startTime: "1:30 PM",
        room: "Newnham Lab",
        instructor: "Linux Systems Faculty",
        color: "#d97706", // Gold / Amber
        mode: "In-Person Lab"
      },
      {
        courseCode: "DAT330",
        courseId: "dat330",
        name: "Introduction to Databases",
        time: "5:10 PM - 6:55 PM",
        startTime: "5:10 PM",
        room: "Newnham Bldg A - A3512",
        instructor: "Parul Kantaria",
        color: "#ef4444", // Red
        mode: "In-Person"
      }
    ],
    Thursday: [
      {
        courseCode: "OPS345",
        courseId: "ops345",
        name: "Open System Application Server",
        time: "8:55 AM - 10:40 AM",
        startTime: "8:55 AM",
        room: "Newnham Lab",
        instructor: "Linux Systems Faculty",
        color: "#d97706", // Gold / Amber
        mode: "In-Person Lab"
      },
      {
        courseCode: "CSN305",
        courseId: "csn305",
        name: "Software Defined Networks",
        time: "12:35 PM - 4:10 PM",
        startTime: "12:35 PM",
        room: "Newnham Campus",
        instructor: "Faculty Assigned",
        color: "#22c55e", // Green
        mode: "In-Person"
      }
    ],
    Friday: [
      {
        courseCode: "PSY262",
        courseId: "psy262",
        name: "Mindfulness for Students",
        time: "1:30 PM - 4:10 PM",
        startTime: "1:30 PM",
        room: "ONLINE (Flexible: or Bldg K - K2241)",
        instructor: "Glen Choi",
        color: "#ec4899", // Pink / Magenta
        mode: "ONLINE Flexible",
        isOnline: true
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
                Official Fall 2026 Timetable
              </span>
              <span className="text-xs text-slate-400">Seneca Newnham Campus & Online</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight mt-1">
              Weekly Class & Lecture Timetable
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Accurately synced with your class schedule, course sections, and room locations.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-red-400" />
              <span>1750 Finch Ave E, Toronto</span>
            </div>
          </div>
        </div>
      </div>

      {/* Online Synchronous Callout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-slate-300 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/20 text-cyan-300 font-bold font-mono flex items-center justify-center shrink-0">
            <Wifi className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-white">WTP100 - ONLINE (Wednesdays 11:40 AM)</div>
            <div className="text-[11px] text-slate-400">Work Term Preparation synchronous session on Blackboard Ultra</div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-pink-500/10 border border-pink-500/20 text-xs text-slate-300 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-pink-500/20 text-pink-300 font-bold font-mono flex items-center justify-center shrink-0">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-white">PSY262 - ONLINE (Fridays 1:30 PM)</div>
            <div className="text-[11px] text-slate-400">Flexible mode broadcast online simultaneously or attend K2241</div>
          </div>
        </div>
      </div>

      {/* 5-Day Visual Schedule Grid */}
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
                {dayClasses.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelectedCourseId(item.courseId);
                      setCurrentView('course-detail');
                    }}
                    className="p-3.5 rounded-xl border transition cursor-pointer group shadow-sm flex flex-col justify-between hover:scale-[1.01]"
                    style={{
                      backgroundColor: `${item.color}15`,
                      borderColor: `${item.color}45`
                    }}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span 
                          className="font-mono text-xs font-bold px-2 py-0.5 rounded border"
                          style={{
                            color: item.color,
                            backgroundColor: `${item.color}25`,
                            borderColor: `${item.color}60`
                          }}
                        >
                          {item.courseCode}
                        </span>

                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950/80 text-slate-300 font-mono">
                          {item.startTime}
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
                      <div className="flex items-center gap-1 font-medium" style={{ color: item.isOnline ? '#38bdf8' : '#fbbf24' }}>
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate">{item.room}</span>
                      </div>
                      <div className="text-slate-400 truncate text-[10px]">
                        {item.instructor}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
