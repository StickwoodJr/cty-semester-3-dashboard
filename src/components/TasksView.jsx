import React, { useState } from 'react';
import { useAcademic } from '../context/AcademicContext';
import { 
  CheckSquare, Search, Filter, Plus, Download, Upload, 
  CheckCircle2, Clock, AlertCircle, Edit3, Trash2, ArrowUpDown, 
  ChevronRight, Kanban, Table as TableIcon, Sparkles
} from 'lucide-react';
import { exportTasksToCSV } from '../utils/csvHelper';

export default function TasksView() {
  const { 
    courses, 
    getAllAssessments, 
    updateAssessment, 
    deleteAssessment,
    setActiveModal, 
    setModalPayload,
    showToast,
    triggerCelebration
  } = useAcademic();

  const allTasks = getAllAssessments();

  // Filters & State
  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('dueDate'); // 'dueDate' | 'weight' | 'course' | 'name'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' | 'desc'
  const [layoutMode, setLayoutMode] = useState('table'); // 'table' | 'kanban'

  // Inline editing of score
  const [editingScoreId, setEditingScoreId] = useState(null);
  const [tempScore, setTempScore] = useState('');

  // Filtering logic
  const filteredTasks = allTasks.filter(task => {
    if (courseFilter !== 'ALL' && task.courseId !== courseFilter) return false;
    if (statusFilter !== 'ALL' && task.status !== statusFilter) return false;
    if (categoryFilter !== 'ALL' && task.category !== categoryFilter) return false;
    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      const matchName = task.name.toLowerCase().includes(q);
      const matchCourse = task.courseCode.toLowerCase().includes(q);
      const matchTopic = (task.topic || '').toLowerCase().includes(q);
      if (!matchName && !matchCourse && !matchTopic) return false;
    }
    return true;
  });

  // Sorting logic
  filteredTasks.sort((a, b) => {
    let comp = 0;
    if (sortBy === 'dueDate') {
      comp = (a.dueDate || '').localeCompare(b.dueDate || '');
    } else if (sortBy === 'weight') {
      comp = (parseFloat(a.weight) || 0) - (parseFloat(b.weight) || 0);
    } else if (sortBy === 'course') {
      comp = a.courseCode.localeCompare(b.courseCode);
    } else if (sortBy === 'name') {
      comp = a.name.localeCompare(b.name);
    }
    return sortOrder === 'asc' ? comp : -comp;
  });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleScoreSave = (courseId, taskId) => {
    const val = parseFloat(tempScore);
    if (!isNaN(val) && val >= 0 && val <= 100) {
      updateAssessment(courseId, taskId, {
        score: val,
        status: 'Graded'
      });
      showToast(`Score updated to ${val}%`, "success");
    }
    setEditingScoreId(null);
  };

  const categories = ['ALL', 'Lab', 'Quiz', 'Assignment', 'Test', 'Project', 'Exam', 'In-class', 'Milestone'];
  const statuses = ['ALL', 'Not Started', 'In Progress', 'Submitted', 'Graded'];

  return (
    <div className="space-y-5 max-w-7xl mx-auto pb-12">
      
      {/* Top Banner & Control Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>Upcoming List & Assessment Tracker</span>
              <span className="text-xs px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono">
                {filteredTasks.length} / {allTasks.length} Tasks
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Comprehensive tracker with live score recording, weight tracking, and status pipeline.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* View switcher */}
            <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800 text-xs">
              <button
                onClick={() => setLayoutMode('table')}
                className={`px-3 py-1 rounded-md font-semibold flex items-center gap-1.5 transition ${
                  layoutMode === 'table' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>Table</span>
              </button>
              <button
                onClick={() => setLayoutMode('kanban')}
                className={`px-3 py-1 rounded-md font-semibold flex items-center gap-1.5 transition ${
                  layoutMode === 'kanban' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Kanban className="w-3.5 h-3.5" />
                <span>Pipeline</span>
              </button>
            </div>

            {/* Add Task */}
            <button
              onClick={() => {
                setActiveModal('add-task');
                setModalPayload({ courseId: courses[0]?.id });
              }}
              className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add Assessment</span>
            </button>

            {/* Export CSV */}
            <button
              onClick={() => {
                exportTasksToCSV(courses);
                showToast("Exported assessments CSV", "success");
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition"
              title="Export to CSV spreadsheet"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Filters & Search Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-slate-800/80">
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search assessment or topic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Course filter */}
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-red-500"
          >
            <option value="ALL">All Courses ({courses.length})</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
            ))}
          </select>

          {/* Category filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-red-500"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>Category: {cat}</option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-red-500"
          >
            {statuses.map(st => (
              <option key={st} value={st}>Status: {st}</option>
            ))}
          </select>
        </div>
      </div>

      {/* View 1: Table Layout */}
      {layoutMode === 'table' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Status</th>
                  <th 
                    className="py-3 px-4 cursor-pointer hover:text-slate-200 transition"
                    onClick={() => handleSort('course')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Course</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-500" />
                    </div>
                  </th>
                  <th 
                    className="py-3 px-4 cursor-pointer hover:text-slate-200 transition"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Assessment</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-500" />
                    </div>
                  </th>
                  <th className="py-3 px-4">Category</th>
                  <th 
                    className="py-3 px-4 cursor-pointer hover:text-slate-200 transition"
                    onClick={() => handleSort('dueDate')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Due Date</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-500" />
                    </div>
                  </th>
                  <th 
                    className="py-3 px-4 cursor-pointer hover:text-slate-200 transition text-right"
                    onClick={() => handleSort('weight')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Weight</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-500" />
                    </div>
                  </th>
                  <th className="py-3 px-4 text-center">Score (%)</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800/60">
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-500 text-xs">
                      No assessments matching the chosen filters.
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map(task => {
                    const isDone = task.status === 'Graded';
                    return (
                      <tr 
                        key={task.id} 
                        className="hover:bg-slate-800/40 transition group"
                      >
                        {/* Status button */}
                        <td className="py-3 px-4">
                          <button
                            onClick={() => {
                              const order = ['Not Started', 'In Progress', 'Submitted', 'Graded'];
                              const nextIdx = (order.indexOf(task.status) + 1) % order.length;
                              const nextStatus = order[nextIdx];
                              updateAssessment(task.courseId, task.id, {
                                status: nextStatus,
                                score: nextStatus === 'Graded' && task.score === null ? 100 : task.score
                              });
                            }}
                            className={`px-2 py-1 rounded-md text-[10px] font-semibold border transition ${
                              task.status === 'Graded' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' :
                              task.status === 'Submitted' ? 'bg-blue-500/15 text-blue-400 border-blue-500/30' :
                              task.status === 'In Progress' ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' :
                              'bg-slate-800 text-slate-400 border-slate-700'
                            }`}
                            title="Click to cycle status"
                          >
                            {task.status}
                          </button>
                        </td>

                        {/* Course code */}
                        <td className="py-3 px-4 font-mono font-bold">
                          <span 
                            className="px-2 py-0.5 rounded border text-[11px]"
                            style={{
                              color: task.courseColor,
                              backgroundColor: `${task.courseColor}15`,
                              borderColor: `${task.courseColor}40`
                            }}
                          >
                            {task.courseCode}
                          </span>
                        </td>

                        {/* Assessment name & topic */}
                        <td className="py-3 px-4 min-w-[200px]">
                          <div className={`font-semibold text-xs ${isDone ? 'text-slate-400 line-through' : 'text-slate-100'}`}>
                            {task.name}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate max-w-sm">
                            {task.topic || '-'}
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3 px-4">
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                            {task.category}
                          </span>
                        </td>

                        {/* Due Date & Week */}
                        <td className="py-3 px-4 font-mono">
                          <div className="text-slate-200">{task.dueDate || 'TBA'}</div>
                          {task.week && <div className="text-[10px] text-slate-400">Week {task.week}</div>}
                        </td>

                        {/* Weight */}
                        <td className="py-3 px-4 text-right font-mono font-semibold text-slate-200">
                          {task.weight}%
                        </td>

                        {/* Score Entry */}
                        <td className="py-3 px-4 text-center">
                          {editingScoreId === task.id ? (
                            <div className="flex items-center justify-center gap-1">
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={tempScore}
                                onChange={(e) => setTempScore(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleScoreSave(task.courseId, task.id);
                                  if (e.key === 'Escape') setEditingScoreId(null);
                                }}
                                autoFocus
                                className="w-14 px-1.5 py-0.5 text-center text-xs bg-slate-950 border border-red-500 rounded text-white font-mono focus:outline-none"
                              />
                              <button
                                onClick={() => handleScoreSave(task.courseId, task.id)}
                                className="text-emerald-400 hover:text-emerald-300 font-bold text-xs"
                              >
                                ✓
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setEditingScoreId(task.id);
                                setTempScore(task.score !== null ? String(task.score) : '');
                              }}
                              className={`font-mono text-xs px-2 py-0.5 rounded hover:bg-slate-800 transition ${
                                task.score !== null 
                                  ? 'text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20' 
                                  : 'text-slate-500 border border-dashed border-slate-700'
                              }`}
                              title="Click to enter or change score"
                            >
                              {task.score !== null ? `${task.score}%` : '--'}
                            </button>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5 opacity-60 group-hover:opacity-100 transition">
                            <button
                              onClick={() => {
                                setActiveModal('edit-task');
                                setModalPayload({ courseId: task.courseId, assessment: task });
                              }}
                              className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                              title="Edit assessment details"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteAssessment(task.courseId, task.id)}
                              className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-slate-800"
                              title="Delete assessment"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View 2: Kanban Pipeline Layout */}
      {layoutMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {['Not Started', 'In Progress', 'Submitted', 'Graded'].map(colStatus => {
            const colTasks = filteredTasks.filter(t => t.status === colStatus);
            const colWeight = colTasks.reduce((s, t) => s + (parseFloat(t.weight) || 0), 0);

            return (
              <div key={colStatus} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col h-[700px] shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      colStatus === 'Graded' ? 'bg-emerald-500' :
                      colStatus === 'Submitted' ? 'bg-blue-500' :
                      colStatus === 'In Progress' ? 'bg-amber-500' : 'bg-slate-500'
                    }`} />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">{colStatus}</span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400">
                    {colTasks.length} ({colWeight.toFixed(1)}%)
                  </div>
                </div>

                {/* Cards Container */}
                <div className="space-y-2.5 overflow-y-auto flex-1 pr-1">
                  {colTasks.length === 0 ? (
                    <div className="py-12 text-center text-slate-600 text-xs">
                      Empty column
                    </div>
                  ) : (
                    colTasks.map(task => (
                      <div
                        key={task.id}
                        onClick={() => {
                          setActiveModal('edit-task');
                          setModalPayload({ courseId: task.courseId, assessment: task });
                        }}
                        className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition cursor-pointer group shadow-sm"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span 
                            className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border"
                            style={{
                              color: task.courseColor,
                              backgroundColor: `${task.courseColor}15`,
                              borderColor: `${task.courseColor}40`
                            }}
                          >
                            {task.courseCode}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 font-semibold">
                            {task.weight}%
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-white group-hover:text-red-400 transition line-clamp-1">
                          {task.name}
                        </h4>
                        <div className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                          {task.topic}
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-900">
                          <span className="flex items-center gap-1 font-mono">
                            <Clock className="w-3 h-3 text-slate-500" />
                            {task.dueDate}
                          </span>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const order = ['Not Started', 'In Progress', 'Submitted', 'Graded'];
                              const nextIdx = (order.indexOf(task.status) + 1) % order.length;
                              updateAssessment(task.courseId, task.id, {
                                status: order[nextIdx],
                                score: order[nextIdx] === 'Graded' && task.score === null ? 100 : task.score
                              });
                            }}
                            className="text-red-400 hover:text-red-300 font-semibold transition"
                            title="Advance status"
                          >
                            Move →
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
