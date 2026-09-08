import React, { useState, useEffect } from 'react';
import { useAcademic } from '../context/AcademicContext';
import { X, CheckSquare, Calendar, Clock, Award, Tag } from 'lucide-react';
import { useFocusTrap } from '../hooks/useFocusTrap';

export default function AssessmentModal() {
  const { 
    courses, 
    activeModal, 
    setActiveModal, 
    modalPayload, 
    addAssessment, 
    updateAssessment 
  } = useAcademic();

  const isModalOpen = activeModal === 'add-task' || activeModal === 'edit-task';
  const modalRef = useFocusTrap(isModalOpen);

  const isEdit = activeModal === 'edit-task';
  const editingTask = modalPayload?.assessment;
  const initialCourseId = modalPayload?.courseId || courses[0]?.id;

  const [courseId, setCourseId] = useState(initialCourseId);
  const [name, setName] = useState(editingTask?.name || '');
  const [category, setCategory] = useState(editingTask?.category || 'Assignment');
  const [weight, setWeight] = useState(editingTask?.weight !== undefined ? String(editingTask.weight) : '5.0');
  const [dueDate, setDueDate] = useState(editingTask?.dueDate || modalPayload?.defaultDate || '2026-10-15');
  const [week, setWeek] = useState(editingTask?.week ? String(editingTask.week) : '5');
  const [status, setStatus] = useState(editingTask?.status || 'Not Started');
  const [score, setScore] = useState(editingTask?.score !== null && editingTask?.score !== undefined ? String(editingTask.score) : '');
  const [topic, setTopic] = useState(editingTask?.topic || '');

  // Keep form state synchronized whenever modalPayload changes
  useEffect(() => {
    if (activeModal === 'edit-task' || activeModal === 'add-task') {
      const task = modalPayload?.assessment;
      setCourseId(modalPayload?.courseId || courses[0]?.id);
      setName(task?.name || '');
      setCategory(task?.category || 'Assignment');
      setWeight(task?.weight !== undefined ? String(task.weight) : '5.0');
      setDueDate(task?.dueDate || modalPayload?.defaultDate || '2026-10-15');
      setWeek(task?.week ? String(task.week) : '5');
      setStatus(task?.status || 'Not Started');
      setScore(task?.score !== null && task?.score !== undefined ? String(task.score) : '');
      setTopic(task?.topic || '');
    }
  }, [activeModal, modalPayload, courses]);

  // Close on Escape key
  useEffect(() => {
    if (activeModal !== 'add-task' && activeModal !== 'edit-task') return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setActiveModal(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal, setActiveModal]);

  if (activeModal !== 'add-task' && activeModal !== 'edit-task') return null;

  const categories = ['Lab', 'Quiz', 'Assignment', 'Test', 'Project', 'Exam', 'In-class', 'Milestone'];
  const statuses = ['Not Started', 'In Progress', 'Submitted', 'Graded'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const assessmentData = {
      name: name.trim(),
      category,
      weight: parseFloat(weight) || 0,
      dueDate,
      week: parseInt(week) || null,
      status,
      score: score.trim() !== '' ? parseFloat(score) : null,
      maxScore: 100,
      topic: topic.trim()
    };

    if (isEdit) {
      updateAssessment(courseId, editingTask.id, assessmentData);
    } else {
      addAssessment(courseId, assessmentData);
    }

    setActiveModal(null);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) setActiveModal(null); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="assessment-modal-title"
    >
      <div ref={modalRef} className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-red-600/10 text-red-400 border border-red-500/20">
              <CheckSquare className="w-4 h-4" />
            </div>
            <h3 id="assessment-modal-title" className="text-base font-bold text-white">
              {isEdit ? 'Edit Assessment' : 'Add New Assessment'}
            </h3>
          </div>
          <button 
            onClick={() => setActiveModal(null)}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            aria-label="Close assessment modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs overflow-y-auto flex-1">
          
          {/* Course select */}
          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Course</label>
            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              disabled={isEdit}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-red-500 disabled:opacity-50"
            >
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
              ))}
            </select>
          </div>

          {/* Assessment Name */}
          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Assessment Title / Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Lab 4: Containers or Assignment 2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-red-500 font-medium"
            />
          </div>

          {/* Category & Weight */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-red-500"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Weight (% of Course)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                required
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-red-500 font-mono"
              />
            </div>
          </div>

          {/* Due Date & Week */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Due Date</label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-red-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Semester Week (1-14)</label>
              <input
                type="number"
                min="1"
                max="14"
                value={week}
                onChange={(e) => setWeek(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-red-500 font-mono"
              />
            </div>
          </div>

          {/* Status & Score */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-red-500"
              >
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Score / Mark (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                placeholder="e.g. 95 (leave empty if not graded)"
                value={score}
                onChange={(e) => {
                  setScore(e.target.value);
                  if (e.target.value.trim() !== '') setStatus('Graded');
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-red-500 font-mono"
              />
            </div>
          </div>

          {/* Topic / Notes */}
          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Topic / Submission Notes</label>
            <input
              type="text"
              placeholder="e.g. AWS EC2 Apache, DNS, SSL Certificates"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold transition shadow-lg shadow-red-900/30"
            >
              {isEdit ? 'Save Changes' : 'Add Assessment'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
