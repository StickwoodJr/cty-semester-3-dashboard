import React, { useState, useMemo } from 'react';
import { useAcademic } from '../context/AcademicContext';
import { 
  Compass, ExternalLink, Mail, Copy, Check, Search, 
  BookOpen, Shield, Award, Laptop, Key, HelpCircle, 
  Sparkles, FileText, CheckCircle2, AlertTriangle, Info,
  MapPin, Clock, Calendar, Download, UserCheck, HeartHandshake
} from 'lucide-react';

export default function ResourceVaultView() {
  const { courses, semesterConfig, showToast } = useAcademic();

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'portals' | 'faculty' | 'policies' | 'perks'
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedKey, setCopiedKey] = useState(null);

  const handleCopy = (text, key, label) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast(`Copied ${label} to clipboard!`, 'success');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Official Seneca Portals
  const portals = [
    {
      id: 'learn-seneca',
      category: 'portals',
      title: 'Learn@Seneca (Blackboard Ultra)',
      desc: 'Central learning management system for course announcements, weekly lab dropboxes, lecture slides, and grade center.',
      url: 'https://learn.senecapolytechnic.ca/ultra/institution-page',
      badge: 'Daily Primary',
      badgeColor: 'bg-red-500/10 text-red-400 border-red-500/30'
    },
    {
      id: 'student-home',
      category: 'portals',
      title: 'Seneca Student Home (MySeneca)',
      desc: 'Official administrative portal for term enrollment, timetable schedule verification, fee invoices, T2202 tax receipts, and official transcripts.',
      url: 'https://home.senecapolytechnic.ca',
      badge: 'Official Records',
      badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30'
    },
    {
      id: 'azure-portal',
      category: 'portals',
      title: 'Microsoft Azure for Students Portal',
      desc: 'Access your cloud sandbox for MST300 (Azure VMs, VNets, Resource Groups) and DAT330 (Azure SQL Databases) with $100 annual credits.',
      url: 'https://portal.azure.com',
      badge: 'Cloud Labs',
      badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30'
    },
    {
      id: 'senecaworks',
      category: 'portals',
      title: 'SenecaWorks (Co-op & Career Hub)',
      desc: 'Work-Integrated Learning (WIL) portal for WTP100 completion tracking, approved resume repository, and Semester 4 Co-op job board.',
      url: 'https://senecaworks.senecapolytechnic.ca',
      badge: 'Career / Co-op',
      badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
    },
    {
      id: 'matrix-gateway',
      category: 'portals',
      title: 'Seneca Matrix Linux SSH Server',
      desc: 'Red Hat Enterprise Linux development cluster for OPS345, CSN305, and DAT330 assignments: matrix.senecapolytechnic.ca (port 22).',
      url: 'ssh://matrix.senecapolytechnic.ca',
      badge: 'Linux Terminal',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
    },
    {
      id: 'seneca-library',
      category: 'portals',
      title: 'Seneca Libraries & O\'Reilly Learning',
      desc: 'Unlimited free access to O\'Reilly Safari Books Online, IEEE Xplore, Gartner Research, and peer-reviewed technical journals via Seneca SSO.',
      url: 'https://library.senecapolytechnic.ca',
      badge: 'Free Textbooks',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30'
    },
    {
      id: 'its-servicedesk',
      category: 'portals',
      title: 'Seneca ITS Service Desk',
      desc: 'Technical support for Seneca accounts, campus Wi-Fi (eduroam), Multi-Factor Authentication (MFA), and computer lab software troubleshooting.',
      url: 'https://inside.senecapolytechnic.ca/its',
      badge: 'IT Support',
      badgeColor: 'bg-slate-800 text-slate-300 border-slate-700'
    }
  ];

  // Faculty Directory derived from course data
  const faculty = [
    {
      id: 'parul',
      category: 'faculty',
      name: 'Parul Kantaria',
      courseCode: 'DAT330',
      courseName: 'Introduction to Databases',
      email: 'parul.kantaria@senecapolytechnic.ca',
      officeHours: 'By appointment / Post-class synchronous',
      location: 'Newnham Bldg A - A1509 / A3512',
      color: '#ef4444',
      tips: 'Mandates strict 50% weighted average on tests, labs, and projects independently!'
    },
    {
      id: 'nooshin',
      category: 'faculty',
      name: 'Nooshin Beheshti',
      courseCode: 'MST300',
      courseName: 'Intro to Microsoft Cloud Technologies',
      email: 'nooshin.beheshti@senecapolytechnic.ca',
      officeHours: 'Mondays & Tuesdays after lecture',
      location: 'Newnham Bldg C - C3036 / Bldg A - A4515',
      color: '#a855f7',
      tips: '10% of final course grade is based on responsible Azure cloud spend management.'
    },
    {
      id: 'homayoun',
      category: 'faculty',
      name: 'Homayoun Mohamadi',
      courseCode: 'SEC320',
      courseName: 'Security Incident Response & Forensics',
      email: 'homayoun.mohamadi@senecapolytechnic.ca',
      officeHours: 'Tuesdays 1:30 PM - 2:30 PM',
      location: 'Newnham Bldg K - K1272',
      color: '#0284c7',
      tips: 'Practical test component requires 50% average to pass the course.'
    },
    {
      id: 'glen',
      category: 'faculty',
      name: 'Glen Choi',
      courseCode: 'PSY262',
      courseName: 'Mindfulness for Students',
      email: 'glen.choi@senecapolytechnic.ca',
      officeHours: 'Fridays by appointment online',
      location: 'ONLINE (Flexible: or Bldg K - K2241)',
      color: '#ec4899',
      tips: 'Interactive weekly mindfulness reflections account for steady 4.0 quality points.'
    },
    {
      id: 'ops-faculty',
      category: 'faculty',
      name: 'Linux Systems Faculty',
      courseCode: 'OPS345',
      courseName: 'Open System Application Server',
      email: 'ops345.coordinator@senecapolytechnic.ca',
      officeHours: 'Wednesdays 3:30 PM - 4:30 PM',
      location: 'Newnham Tech Lab (Wed 1:30 PM & Thu 8:55 AM)',
      color: '#d97706',
      tips: 'Midterm permits 1-sided handwritten cheat sheet; Final permits 2-sided handwritten sheet.'
    },
    {
      id: 'csn-faculty',
      category: 'faculty',
      name: 'Software Defined Networks Faculty',
      courseCode: 'CSN305',
      courseName: 'Software Defined Networks',
      email: 'csn305.coordinator@senecapolytechnic.ca',
      officeHours: 'Thursdays after class (4:10 PM)',
      location: 'Newnham Campus (Thursday 12:35 PM - 4:10 PM)',
      color: '#22c55e',
      tips: 'Mininet scripts and OpenFlow flow tables are central to high-weighted practical lab exams.'
    },
    {
      id: 'wil-coord',
      category: 'faculty',
      name: 'WIL Co-ordinator',
      courseCode: 'WTP100',
      courseName: 'Work Term Preparation',
      email: 'wil@senecapolytechnic.ca',
      officeHours: 'Wednesdays 11:40 AM synchronous session',
      location: 'ONLINE Synchronous',
      color: '#06b6d4',
      tips: 'Must achieve SAT grade by completing all 14 modules before October 23, 2026 deadline!'
    }
  ];

  // Academic Policies & Survival Guide
  const policies = [
    {
      id: 'pol-4-gpa',
      category: 'policies',
      title: 'The Seneca 4.0 GPA Distinction Rule',
      desc: 'At Seneca Polytechnic, both A (80.0% – 89.9%) and A+ (90.0% – 100%) yield the maximum 4.0 quality points per credit. A single grade below 80% (B+, 75–79%) drops quality points to 3.5, pulling semester GPA below 4.0.',
      icon: Award,
      alertType: 'important'
    },
    {
      id: 'pol-dnc',
      category: 'policies',
      title: 'Drop Without Academic Penalty (DNC Deadline)',
      desc: 'November 13, 2026 is the official Seneca deadline to drop a course with a "Did Not Complete" (DNC) designation. A DNC does NOT impact your GPA calculation or academic standing.',
      icon: Calendar,
      alertType: 'warning'
    },
    {
      id: 'pol-integrity',
      category: 'policies',
      title: 'Academic Integrity & GenAI Policy',
      desc: 'Seneca Academic Honesty Policy strictly prohibits submitting work generated by unauthorized generative AI or copying code from peers. All source code submissions are analyzed via automated plagiarism detection.',
      icon: Shield,
      alertType: 'caution'
    },
    {
      id: 'pol-exam-conflict',
      category: 'policies',
      title: 'Final Exam Conflict Procedure',
      desc: 'If you have two exams scheduled at the same time, or more than two exams on the same calendar day, you are eligible for rescheduling through the Registration Office at least two weeks before exam week.',
      icon: AlertTriangle,
      alertType: 'info'
    },
    {
      id: 'pol-honour-list',
      category: 'policies',
      title: 'President\'s Honour List Requirements',
      desc: 'Awarded to full-time students achieving a semester GPA of 3.80 or higher with no failing grades. Graduating with a cumulative 4.00 earns the prestigious "Graduation with Distinction" medal.',
      icon: Sparkles,
      alertType: 'important'
    }
  ];

  // Student Free Perks & Developer Tools
  const perks = [
    {
      id: 'perk-github',
      category: 'perks',
      title: 'GitHub Student Developer Pack',
      desc: 'Free GitHub Copilot access, GitHub Pro badge, $100 DigitalOcean cloud credits, free Namecheap .me domain, and JetBrains IDE license bundle.',
      url: 'https://education.github.com/pack',
      value: '$2,000+ Value',
      tag: 'Software'
    },
    {
      id: 'perk-azure',
      category: 'perks',
      title: 'Microsoft Azure for Students ($100 Credits)',
      desc: '$100 annual cloud computing credit without requiring a credit card, plus 12 months of free popular cloud services (Linux VMs, Azure SQL, Blob Storage).',
      url: 'https://azure.microsoft.com/en-us/free/students/',
      value: '$100 Annual Credit',
      tag: 'Cloud'
    },
    {
      id: 'perk-m365',
      category: 'perks',
      title: 'Microsoft 365 ProPlus (Free with Seneca SSO)',
      desc: 'Full installable desktop versions of Word, Excel, PowerPoint, Outlook, and OneNote on up to 5 devices, plus 1TB of secure OneDrive cloud backup.',
      url: 'https://portal.office.com',
      value: 'Included Free',
      tag: 'Productivity'
    },
    {
      id: 'perk-oreilly',
      category: 'perks',
      title: 'O\'Reilly Learning & Safari Books Online',
      desc: 'Complete full-text digital access to thousands of IT networking, Linux administration, database design, and cloud architecture books and video courses.',
      url: 'https://library.senecapolytechnic.ca',
      value: '$499/yr Value',
      tag: 'Learning'
    }
  ];

  // Filtered items
  const filteredPortals = useMemo(() => {
    return portals.filter(p => {
      if (activeTab !== 'all' && activeTab !== 'portals') return false;
      if (!searchTerm.trim()) return true;
      const q = searchTerm.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q) || p.badge.toLowerCase().includes(q);
    });
  }, [portals, activeTab, searchTerm]);

  const filteredFaculty = useMemo(() => {
    return faculty.filter(f => {
      if (activeTab !== 'all' && activeTab !== 'faculty') return false;
      if (!searchTerm.trim()) return true;
      const q = searchTerm.toLowerCase();
      return f.name.toLowerCase().includes(q) || f.courseCode.toLowerCase().includes(q) || f.courseName.toLowerCase().includes(q) || f.email.toLowerCase().includes(q);
    });
  }, [faculty, activeTab, searchTerm]);

  const filteredPolicies = useMemo(() => {
    return policies.filter(pol => {
      if (activeTab !== 'all' && activeTab !== 'policies') return false;
      if (!searchTerm.trim()) return true;
      const q = searchTerm.toLowerCase();
      return pol.title.toLowerCase().includes(q) || pol.desc.toLowerCase().includes(q);
    });
  }, [policies, activeTab, searchTerm]);

  const filteredPerks = useMemo(() => {
    return perks.filter(p => {
      if (activeTab !== 'all' && activeTab !== 'perks') return false;
      if (!searchTerm.trim()) return true;
      const q = searchTerm.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q) || p.tag.toLowerCase().includes(q);
    });
  }, [perks, activeTab, searchTerm]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      
      {/* Top Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center gap-1">
                <Compass className="w-3 h-3 text-cyan-400" />
                <span>Academic Resource Hub</span>
              </span>
              <span className="text-xs text-slate-400">Seneca Polytechnic CTY Semester 3</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight mt-1 flex items-center gap-2">
              <span>Syllabus & Resource Vault</span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-red-500/10 text-red-400 border border-red-500/20 font-normal">
                Faculty • Portals • Policies
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              One-stop launchpad for official Seneca portals, professor office hours, academic integrity rules, and free developer perks.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search faculty, portals, policies, perks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-slate-800/80 overflow-x-auto pb-1">
          {[
            { id: 'all', label: 'All Resources' },
            { id: 'portals', label: 'Official Portals' },
            { id: 'faculty', label: 'Faculty Directory' },
            { id: 'policies', label: 'Academic Policies & 4.0 Rules' },
            { id: 'perks', label: 'Free Student Perks' },
          ].map(tab => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  active 
                    ? 'bg-red-600 text-white shadow-sm' 
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 1: OFFICIAL SENECA PORTALS */}
      {(activeTab === 'all' || activeTab === 'portals') && filteredPortals.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Laptop className="w-4 h-4 text-red-400" />
              <span>Official Seneca & Cloud Portals</span>
            </h3>
            <span className="text-xs text-slate-400">{filteredPortals.length} portals available</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredPortals.map(portal => (
              <a
                key={portal.id}
                href={portal.url}
                target="_blank"
                rel="noreferrer"
                className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-red-500/50 transition flex flex-col justify-between space-y-3 group shadow-sm"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${portal.badgeColor}`}>
                      {portal.badge}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-red-400 transition" />
                  </div>
                  <h4 className="text-xs font-bold text-white group-hover:text-red-400 transition">
                    {portal.title}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {portal.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span className="truncate max-w-[200px]">{portal.url.replace('https://', '')}</span>
                  <span className="text-red-400 group-hover:underline flex items-center gap-0.5">
                    Launch →
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: PROFESSOR & FACULTY DIRECTORY */}
      {(activeTab === 'all' || activeTab === 'faculty') && filteredFaculty.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-purple-400" />
              <span>CTY Semester 3 Faculty & Office Hours Directory</span>
            </h3>
            <span className="text-xs text-slate-400">{filteredFaculty.length} professors</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredFaculty.map(prof => (
              <div
                key={prof.id}
                className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-3 relative overflow-hidden group shadow-sm"
              >
                {/* Left accent bar */}
                <div 
                  className="absolute top-0 bottom-0 left-0 w-1.5"
                  style={{ backgroundColor: prof.color }}
                />

                <div className="pl-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <span 
                      className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border"
                      style={{
                        color: prof.color,
                        backgroundColor: `${prof.color}15`,
                        borderColor: `${prof.color}40`
                      }}
                    >
                      {prof.courseCode}
                    </span>
                    <span className="text-[10px] text-slate-400 truncate max-w-[140px]">{prof.courseName}</span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-slate-100">
                      {prof.name}
                    </h4>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                      <span className="truncate">{prof.location}</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1 text-[11px]">
                    <div className="flex items-center gap-1 text-slate-400">
                      <Clock className="w-3 h-3 text-amber-400 shrink-0" />
                      <span className="font-medium text-slate-300">Office Hours:</span>
                    </div>
                    <div className="text-slate-400 pl-4">{prof.officeHours}</div>
                    
                    {prof.tips && (
                      <div className="text-[10px] text-amber-400/90 pt-1 border-t border-slate-900">
                        💡 {prof.tips}
                      </div>
                    )}
                  </div>
                </div>

                {/* Email Action Strip */}
                <div className="pl-2 pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono text-slate-400 truncate max-w-[160px]">
                    {prof.email}
                  </span>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleCopy(prof.email, prof.id, `${prof.name}'s email`)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                      title="Copy email address"
                    >
                      {copiedKey === prof.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <a
                      href={`mailto:${prof.email}?subject=[Seneca%20CTY%20${prof.courseCode}]%20Student%20Inquiry`}
                      className="px-2 py-1 rounded-lg bg-red-600/15 text-red-400 hover:bg-red-600 hover:text-white text-xs font-semibold transition flex items-center gap-1"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Email</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: ACADEMIC POLICIES & 4.0 GOLDEN RULES */}
      {(activeTab === 'all' || activeTab === 'policies') && filteredPolicies.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-400" />
              <span>Seneca Academic Policies & 4.0 Survival Guidelines</span>
            </h3>
            <span className="text-xs text-slate-400">{filteredPolicies.length} policy guidelines</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPolicies.map(pol => {
              const Icon = pol.icon;
              return (
                <div 
                  key={pol.id}
                  className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-start gap-3.5 shadow-sm"
                >
                  <div className={`p-2 rounded-xl shrink-0 ${
                    pol.alertType === 'important' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    pol.alertType === 'warning' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                    pol.alertType === 'caution' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                    'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-white">
                      {pol.title}
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {pol.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 4: FREE STUDENT PERKS & DEVELOPER LICENSES */}
      {(activeTab === 'all' || activeTab === 'perks') && filteredPerks.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Free Student Perks & Developer Software Pack</span>
            </h3>
            <span className="text-xs text-slate-400">Included with @myseneca.ca email</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {filteredPerks.map(perk => (
              <a
                key={perk.id}
                href={perk.url}
                target="_blank"
                rel="noreferrer"
                className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 transition flex flex-col justify-between space-y-3 group shadow-sm"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {perk.value}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition" />
                  </div>
                  <h4 className="text-xs font-bold text-white group-hover:text-emerald-400 transition">
                    {perk.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {perk.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-mono text-[10px] text-slate-500">{perk.tag}</span>
                  <span className="text-emerald-400 font-semibold group-hover:underline">
                    Claim Free →
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
