import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { INITIAL_COURSES } from '../data/coursesData';
import { SEMESTER_CONFIG, SENECA_GRADE_SCALE, getLetterGrade, getGpaValue } from '../data/senecaDates';
import { sortTasksByDueDate } from '../utils/dateHelper';
import confetti from 'canvas-confetti';

const AcademicContext = createContext();

const STORAGE_KEY = 'seneca_cty_sem3_courses_v6';
const NOTES_STORAGE_KEY = 'seneca_cty_sem3_scratchpad_v1';

export function AcademicProvider({ children }) {
  const [courses, setCourses] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to parse saved courses", e);
    }
    return INITIAL_COURSES;
  });

  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedCourseId, setSelectedCourseId] = useState('dat330');
  const [activeModal, setActiveModal] = useState(null); // 'add-task', 'edit-task', 'edit-course', 'what-if', 'settings', 'csv-import'
  const [modalPayload, setModalPayload] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  
  // Scratchpad notes
  const [scratchpad, setScratchpad] = useState(() => {
    try {
      return localStorage.getItem(NOTES_STORAGE_KEY) || "### Semester 3 Quick Scratchpad\n- Target: 4.00 GPA (President's Honour List with Distinction)\n- Need >= 80% (A / A+) in all graded courses\n- Parul Kantaria (DAT330) requires 50% weighted on 3 categories separately\n- WTP100 completion deadline: October 23, 2026\n- Review Azure & AWS Learner budget weekly";
    } catch {
      return "";
    }
  });

  // Target GPA simulator (Focused on 4.0 GPA)
  const [targetGpa, setTargetGpa] = useState(4.0);

  // Save changes to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
    } catch (e) {
      console.error("Failed to save to localStorage", e);
    }
  }, [courses]);

  useEffect(() => {
    try {
      localStorage.setItem(NOTES_STORAGE_KEY, scratchpad);
    } catch (e) {
      console.error("Failed to save scratchpad", e);
    }
  }, [scratchpad]);

  const showToast = useCallback((msg, type = "info") => {
    setToastMessage({ msg, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  }, []);

  const triggerCelebration = useCallback(() => {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.7 }
    });
  }, []);

  // Assessment operations
  const updateAssessment = useCallback((courseId, assessmentId, updatedFields) => {
    setCourses(prevCourses => prevCourses.map(course => {
      if (course.id !== courseId) return course;
      const updatedAssessments = (course.assessments || []).map(task => {
        if (task.id !== assessmentId) return task;
        const newTask = { ...task, ...updatedFields };
        if (updatedFields.status === 'Graded' && task.status !== 'Graded') {
          triggerCelebration();
          showToast(`Completed: ${course.code} ${task.name}!`, "success");
        }
        return newTask;
      });
      return { ...course, assessments: updatedAssessments };
    }));
  }, [triggerCelebration, showToast]);

  const addAssessment = useCallback((courseId, newAssessment) => {
    setCourses(prevCourses => prevCourses.map(course => {
      if (course.id !== courseId) return course;
      const newId = `${course.id}-task-${Date.now()}`;
      const assessments = [...(course.assessments || []), { ...newAssessment, id: newId }];
      return { ...course, assessments };
    }));
    showToast(`Added assessment to ${courseId.toUpperCase()}`, "success");
  }, [showToast]);

  const deleteAssessment = useCallback((courseId, assessmentId) => {
    setCourses(prevCourses => prevCourses.map(course => {
      if (course.id !== courseId) return course;
      const assessments = (course.assessments || []).filter(a => a.id !== assessmentId);
      return { ...course, assessments };
    }));
    showToast(`Assessment removed`, "info");
  }, [showToast]);

  // Course operations
  const updateCourse = useCallback((courseId, updatedFields) => {
    setCourses(prevCourses => prevCourses.map(course => {
      if (course.id !== courseId) return course;
      return { ...course, ...updatedFields };
    }));
    showToast(`Updated course ${updatedFields.code || courseId}`, "success");
  }, [showToast]);

  const addCourse = useCallback((newCourse) => {
    const id = (newCourse.code || `course-${Date.now()}`).toLowerCase().replace(/[^a-z0-9]/g, '');
    const courseObj = {
      ...newCourse,
      id,
      assessments: newCourse.assessments || []
    };
    setCourses(prev => [...prev, courseObj]);
    showToast(`Added course ${newCourse.code}`, "success");
  }, [showToast]);

  const deleteCourse = useCallback((courseId) => {
    setCourses(prev => prev.filter(c => c.id !== courseId));
    setSelectedCourseId(prev => (prev === courseId ? null : prev));
    showToast(`Course deleted`, "warning");
  }, [showToast]);

  // WTP100 Module toggle
  const toggleWtpModule = useCallback((moduleId) => {
    setCourses(prevCourses => prevCourses.map(course => {
      if (course.id !== 'wtp100') return course;
      const modules = (course.modulesList || []).map(m => {
        if (m.id === moduleId) {
          const completed = !m.completed;
          if (completed) triggerCelebration();
          return { ...m, completed };
        }
        return m;
      });
      return { ...course, modulesList: modules };
    }));
  }, [triggerCelebration]);

  // Budget spend update
  const updateBudgetSpend = useCallback((courseId, spendAmount) => {
    setCourses(prevCourses => prevCourses.map(course => {
      if (course.id !== courseId || !course.budgetTracker) return course;
      return {
        ...course,
        budgetTracker: {
          ...course.budgetTracker,
          currentSpend: parseFloat(spendAmount) || 0
        }
      };
    }));
    showToast(`Updated cloud budget spend`, "info");
  }, [showToast]);

  // Reset to initial
  const resetToDefaults = useCallback(() => {
    setCourses(INITIAL_COURSES);
    showToast("Reset all courses and assessments to official syllabus defaults", "info");
  }, [showToast]);

  // Calculate course grade and metrics
  const getCourseMetrics = useCallback((course) => {
    const assessments = course.assessments || [];
    let completedWeight = 0;
    let earnedWeight = 0;
    let totalWeight = 0;

    assessments.forEach(task => {
      const weight = parseFloat(task.weight) || 0;
      totalWeight += weight;
      if (task.score !== null && task.score !== undefined && !isNaN(task.score) && task.status === 'Graded') {
        completedWeight += weight;
        earnedWeight += (parseFloat(task.score) / (parseFloat(task.maxScore) || 100)) * weight;
      }
    });

    const currentAverage = completedWeight > 0 ? (earnedWeight / completedWeight) * 100 : null;
    const projectedCourseScore = earnedWeight; // points secured so far
    const letterGrade = getLetterGrade(currentAverage);
    const gpa = getGpaValue(currentAverage);

    // Helper to calculate weighted average for a specific subset of tasks
    const getCategoryAvg = (taskList) => {
      const graded = taskList.filter(t => t.status === 'Graded' && t.score !== null && t.score !== undefined && !isNaN(t.score));
      if (graded.length === 0) return null;
      let earned = 0;
      let weight = 0;
      graded.forEach(t => {
        const w = parseFloat(t.weight) || 0;
        weight += w;
        earned += (parseFloat(t.score) / (parseFloat(t.maxScore) || 100)) * w;
      });
      return weight > 0 ? (earned / weight) * 100 : null;
    };

    // Check specific syllabus requirements
    const passingChecks = [];
    if (course.id === 'sec320') {
      const testAvg = getCategoryAvg(assessments.filter(a => a.category === 'Test' || a.category === 'Exam'));
      const labAvg = getCategoryAvg(assessments.filter(a => a.category === 'Lab'));

      passingChecks.push({ name: "Overall >= 50%", passed: (currentAverage === null || currentAverage >= 50) });
      passingChecks.push({ 
        name: `Tests Weighted Avg >= 50% ${testAvg !== null ? `(${testAvg.toFixed(1)}%)` : '(Pending)'}`, 
        passed: testAvg === null || testAvg >= 50,
        condition: "50% Test Threshold" 
      });
      passingChecks.push({ 
        name: `Labs Weighted Avg >= 50% ${labAvg !== null ? `(${labAvg.toFixed(1)}%)` : '(Pending)'}`, 
        passed: labAvg === null || labAvg >= 50,
        condition: "50% Lab Threshold" 
      });
    } else if (course.id === 'dat330') {
      const labAvg = getCategoryAvg(assessments.filter(a => a.category === 'Lab'));
      const testAvg = getCategoryAvg(assessments.filter(a => a.category === 'Test' || a.category === 'Exam'));
      const projAvg = getCategoryAvg(assessments.filter(a => a.category === 'Assignment' || a.category === 'Project'));

      passingChecks.push({ name: "Overall >= 50%", passed: (currentAverage === null || currentAverage >= 50) });
      passingChecks.push({ 
        name: `Labs Weighted Avg >= 50% ${labAvg !== null ? `(${labAvg.toFixed(1)}%)` : '(Pending)'}`, 
        passed: labAvg === null || labAvg >= 50,
        condition: "50% Lab Threshold" 
      });
      passingChecks.push({ 
        name: `Tests Weighted Avg >= 50% ${testAvg !== null ? `(${testAvg.toFixed(1)}%)` : '(Pending)'}`, 
        passed: testAvg === null || testAvg >= 50,
        condition: "50% Test Threshold" 
      });
      passingChecks.push({ 
        name: `Assignments & Project >= 50% ${projAvg !== null ? `(${projAvg.toFixed(1)}%)` : '(Pending)'}`, 
        passed: projAvg === null || projAvg >= 50,
        condition: "50% Project Threshold" 
      });
    } else if (course.id === 'mst300') {
      const labAvg = getCategoryAvg(assessments.filter(a => a.category === 'Lab'));
      const projAvg = getCategoryAvg(assessments.filter(a => a.category === 'Project'));

      passingChecks.push({ name: "Overall >= 50%", passed: (currentAverage === null || currentAverage >= 50) });
      passingChecks.push({ 
        name: `Labs Avg >= 50% ${labAvg !== null ? `(${labAvg.toFixed(1)}%)` : '(Pending)'}`, 
        passed: labAvg === null || labAvg >= 50,
        condition: "50% Lab Threshold" 
      });
      passingChecks.push({ 
        name: `Projects Avg >= 50% ${projAvg !== null ? `(${projAvg.toFixed(1)}%)` : '(Pending)'}`, 
        passed: projAvg === null || projAvg >= 50,
        condition: "50% Project Threshold" 
      });
    } else if (course.id === 'wtp100') {
      const completedCount = (course.modulesList || []).filter(m => m.completed).length;
      passingChecks.push({
        name: `Modules Completed: ${completedCount}/14`,
        passed: completedCount === 14,
        note: "Due Friday, October 23, 2026 (Before Reading Week)"
      });
    }

    return {
      completedWeight,
      earnedWeight,
      totalWeight,
      currentAverage,
      projectedCourseScore,
      letterGrade,
      gpa,
      passingChecks
    };
  }, []);

  // Overall semester metrics (Credit-Weighted Seneca Polytechnic Formula)
  const getSemesterMetrics = useCallback(() => {
    let gradedCredits = 0;
    let totalQualityPoints = 0;
    let totalTasks = 0;
    let completedTasks = 0;
    let totalWeightedScore = 0;

    courses.forEach(course => {
      const metrics = getCourseMetrics(course);
      (course.assessments || []).forEach(task => {
        totalTasks++;
        if (task.status === 'Graded') completedTasks++;
      });

      // Exclude WTP100 (credits = 0) from GPA calculations
      if (course.credits > 0 && metrics.currentAverage !== null) {
        gradedCredits += course.credits;
        totalQualityPoints += (metrics.gpa || 0) * course.credits;
        totalWeightedScore += metrics.currentAverage * course.credits;
      }
    });

    const currentGpa = gradedCredits > 0 ? (totalQualityPoints / gradedCredits) : null;
    const semesterAverage = gradedCredits > 0 ? (totalWeightedScore / gradedCredits) : null;
    const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      currentGpa: currentGpa !== null ? currentGpa.toFixed(2) : "4.00*",
      semesterAverage: semesterAverage !== null ? semesterAverage.toFixed(1) + "%" : "Pending",
      completedTasks,
      totalTasks,
      progressPercent
    };
  }, [courses, getCourseMetrics]);

  // All assessments flattened with course info, sorted safely by due date
  const getAllAssessments = useCallback(() => {
    const list = [];
    courses.forEach(course => {
      (course.assessments || []).forEach(task => {
        list.push({
          ...task,
          courseId: course.id,
          courseCode: course.code,
          courseName: course.name,
          courseColor: course.color,
          courseBadge: course.badgeBg,
          gradient: course.gradient
        });
      });
    });
    // Safely sort by due date ascending (empty dates sort to end)
    return sortTasksByDueDate(list, true);
  }, [courses]);

  const contextValue = useMemo(() => ({
    courses,
    setCourses,
    currentView,
    setCurrentView,
    selectedCourseId,
    setSelectedCourseId,
    activeModal,
    setActiveModal,
    modalPayload,
    setModalPayload,
    toastMessage,
    showToast,
    triggerCelebration,
    scratchpad,
    setScratchpad,
    targetGpa,
    setTargetGpa,
    updateAssessment,
    addAssessment,
    deleteAssessment,
    updateCourse,
    addCourse,
    deleteCourse,
    toggleWtpModule,
    updateBudgetSpend,
    resetToDefaults,
    getCourseMetrics,
    getSemesterMetrics,
    getAllAssessments,
    semesterConfig: SEMESTER_CONFIG
  }), [
    courses,
    currentView,
    selectedCourseId,
    activeModal,
    modalPayload,
    toastMessage,
    showToast,
    triggerCelebration,
    scratchpad,
    targetGpa,
    updateAssessment,
    addAssessment,
    deleteAssessment,
    updateCourse,
    addCourse,
    deleteCourse,
    toggleWtpModule,
    updateBudgetSpend,
    resetToDefaults,
    getCourseMetrics,
    getSemesterMetrics,
    getAllAssessments
  ]);

  return (
    <AcademicContext.Provider value={contextValue}>
      {children}
    </AcademicContext.Provider>
  );
}

export function useAcademic() {
  const context = useContext(AcademicContext);
  if (!context) throw new Error("useAcademic must be used within AcademicProvider");
  return context;
}
