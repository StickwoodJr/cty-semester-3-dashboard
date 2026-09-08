import React, { useState, useEffect } from 'react';
import { useAcademic } from '../context/AcademicContext';
import { X, BookOpen, Plus, Trash2, MapPin } from 'lucide-react';
import { useFocusTrap } from '../hooks/useFocusTrap';

export default function CourseEditModal() {
  const { activeModal, setActiveModal, modalPayload, updateCourse, addCourse } = useAcademic();
  const isModalOpen = activeModal === 'edit-course';
  const modalRef = useFocusTrap(isModalOpen);

  const isNew = modalPayload?.isNew || false;
  const course = modalPayload?.course || {};

  const [code, setCode] = useState(course.code || '');
  const [name, setName] = useState(course.name || '');
  const [section, setSection] = useState(course.section || 'NBB');
  const [classNbr, setClassNbr] = useState(course.classNbr || '');
  const [professor, setProfessor] = useState(course.professor || '');
  const [email, setEmail] = useState(course.email || '');
  const [officeHours, setOfficeHours] = useState(course.officeHours || '');
  const [delivery, setDelivery] = useState(course.delivery || 'In-Person');
  const [credits, setCredits] = useState(course.credits !== undefined ? String(course.credits) : '1.0');
  const [color, setColor] = useState(course.color || '#3b82f6');
  const [description, setDescription] = useState(course.description || '');
  const [scheduleList, setScheduleList] = useState(course.schedule || [{ day: 'Monday', time: '9:50 AM - 11:35 AM', room: 'Newnham Bldg A' }]);

  // Sync state whenever modalPayload changes
  useEffect(() => {
    if (activeModal === 'edit-course') {
      const c = modalPayload?.course || {};
      setCode(c.code || '');
      setName(c.name || '');
      setSection(c.section || 'NBB');
      setClassNbr(c.classNbr || '');
      setProfessor(c.professor || '');
      setEmail(c.email || '');
      setOfficeHours(c.officeHours || '');
      setDelivery(c.delivery || 'In-Person');
      setCredits(c.credits !== undefined ? String(c.credits) : '1.0');
      setColor(c.color || '#3b82f6');
      setDescription(c.description || '');
      setScheduleList(c.schedule || [{ day: 'Monday', time: '9:50 AM - 11:35 AM', room: 'Newnham Bldg A' }]);
    }
  }, [activeModal, modalPayload]);

  // Close on Escape key
  useEffect(() => {
    if (activeModal !== 'edit-course') return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setActiveModal(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal, setActiveModal]);

  if (activeModal !== 'edit-course') return null;

  const handleAddScheduleSlot = () => {
    setScheduleList([...scheduleList, { day: 'Wednesday', time: '9:50 AM - 11:35 AM', room: 'Newnham Campus' }]);
  };

  const handleRemoveScheduleSlot = (idx) => {
    setScheduleList(scheduleList.filter((_, i) => i !== idx));
  };

  const handleScheduleChange = (idx, field, val) => {
    const updated = [...scheduleList];
    updated[idx][field] = val;
    setScheduleList(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!code.trim() || !name.trim()) return;

    const courseData = {
      code: code.trim().toUpperCase(),
      name: name.trim(),
      section: section.trim(),
      classNbr: classNbr.trim(),
      professor: professor.trim(),
      email: email.trim(),
      officeHours: officeHours.trim(),
      delivery,
      credits: parseFloat(credits) || 1.0,
      color,
      description: description.trim(),
      schedule: scheduleList
    };

    if (isNew) {
      addCourse(courseData);
    } else {
      updateCourse(course.id, courseData);
    }

    setActiveModal(null);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) setActiveModal(null); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="course-edit-modal-title"
    >
      <div ref={modalRef} className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-red-600/10 text-red-400 border border-red-500/20">
              <BookOpen className="w-4 h-4" />
            </div>
            <h3 id="course-edit-modal-title" className="text-base font-bold text-white">
              {isNew ? 'Add Course' : `Edit Course Details: ${course.code}`}
            </h3>
          </div>
          <button 
            onClick={() => setActiveModal(null)}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            aria-label="Close course edit modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs overflow-y-auto flex-1">
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Course Code</label>
              <input
                type="text"
                required
                placeholder="CSN305"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono font-bold focus:outline-none focus:border-red-500 uppercase"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Section</label>
              <input
                type="text"
                placeholder="NBB"
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Class Nbr</label>
              <input
                type="text"
                placeholder="5201"
                value={classNbr}
                onChange={(e) => setClassNbr(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Credits</label>
              <input
                type="number"
                step="0.5"
                value={credits}
                onChange={(e) => setCredits(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Course Title / Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Software Defined Networks"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-medium focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Instructor Name</label>
              <input
                type="text"
                placeholder="e.g. Parul Kantaria"
                value={professor}
                onChange={(e) => setProfessor(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Instructor Seneca Email</label>
              <input
                type="email"
                placeholder="name@senecapolytechnic.ca"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-red-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Delivery Mode</label>
              <select
                value={delivery}
                onChange={(e) => setDelivery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-red-500"
              >
                <option value="In-Person">In-Person (On Campus)</option>
                <option value="Flexible">Flexible Mode (Online or In-Person)</option>
                <option value="Online Synchronous">Online Synchronous</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Accent Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-9 h-9 rounded-lg bg-transparent cursor-pointer border border-slate-800"
                />
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Course Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Schedule Slots */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-slate-400 font-semibold flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-400" />
                <span>Class Timetable & Room Slots</span>
              </label>
              <button
                type="button"
                onClick={handleAddScheduleSlot}
                className="text-[11px] text-red-400 hover:text-red-300 font-semibold"
              >
                + Add Time Slot
              </button>
            </div>

            <div className="space-y-2">
              {scheduleList.map((slot, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
                  <select
                    value={slot.day}
                    onChange={(e) => handleScheduleChange(idx, 'day', e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 text-xs"
                  >
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Online Synchronous'].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>

                  <input
                    type="text"
                    placeholder="9:50 AM - 11:35 AM"
                    value={slot.time}
                    onChange={(e) => handleScheduleChange(idx, 'time', e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 text-xs font-mono"
                  />

                  <input
                    type="text"
                    placeholder="Newnham Bldg A - A1509"
                    value={slot.room}
                    onChange={(e) => handleScheduleChange(idx, 'room', e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 text-xs"
                  />

                  {scheduleList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveScheduleSlot(idx)}
                      className="p-1 text-slate-500 hover:text-red-400 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
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
              {isNew ? 'Create Course' : 'Save Details'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
