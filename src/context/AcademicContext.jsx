import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_COURSES } from '../data/coursesData';
import { SEMESTER_CONFIG, SENECA_GRADE_SCALE, getLetterGrade, getGpaValue } from '../data/senecaDates';
import confetti from 'canvas-confetti';

const AcademicContext = createContext();

const STORAGE_KEY = 'seneca_cty_sem3_courses_v4';
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
      return localStorage.getItem(NOTES_STORAGE_KEY) || "### Semester 3 Quick Scratchpad\n- Get fresh external SSD for Ubuntu in OPS345\n- Parul Kantaria (DAT330) requires 50% weighted on 3 categories separately\n- WTP100 completion deadline: October 23, 2026\n- Review Azure Learner budget weekly";
    } catch {
      return "";
    }
  });

  // Target GPA simulator
  const [targetGpa, setTargetGpa] = useState(3.8);

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

  const showToast = (msg, type = "info") => {
    setToastMessage({ msg, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const triggerCelebration = () => {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.7 }
    });
  };

  // Assessment operations
  const updateAssessment = (courseId, assessmentId, updatedFields) => {
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
  };

  const addAssessment = (courseId, newAssessment) => {
    setCourses(prevCourses => prevCourses.map(course => {
      if (course.id !== courseId) return course;
      const newId = `${course.id}-task-${Date.now()}`;
      const assessments = [...(course.assessments || []), { ...newAssessment, id: newId }];
      return { ...course, assessments };
    }));
    showToast(`Added assessment to ${courseId.toUpperCase()}`, "success");
  };

  const deleteAssessment = (courseId, assessmentId) => {
    setCourses(prevCourses => prevCourses.map(course => {
      if (course.id !== courseId) return course;
      const assessments = (course.assessments || []).filter(a => a.id !== assessmentId);
      return { ...course, assessments };
    }));
    showToast(`Assessment removed`, "info");
  };

  // Course operations
  const updateCourse = (courseId, updatedFields) => {
    setCourses(prevCourses => prevCourses.map(course => {
      if (course.id !== courseId) return course;
      return { ...course, ...updatedFields };
    }));
    showToast(`Updated course ${updatedFields.code || courseId}`, "success");
  };

  const addCourse = (newCourse) => {
    const id = (newCourse.code || `course-${Date.now()}`).toLowerCase().replace(/[^a-z0-9]/g, '');
    const courseObj = {
      ...newCourse,
      id,
      assessments: newCourse.assessments || []
    };
    setCourses(prev => [...prev, courseObj]);
    showToast(`Added course ${newCourse.code}`, "success");
  };

  const deleteCourse = (courseId) => {
    setCourses(prev => prev.filter(c => c.id !== courseId));
    if (selectedCourseId === courseId) {
      setSelectedCourseId(courses[0]?.id || null);
    }
    showToast(`Course deleted`, "warning");
  };

  // WTP100 Module toggle
  const toggleWtpModule = (moduleId) => {
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
  };

  // Budget spend update
  const updateBudgetSpend = (courseId, spendAmount) => {
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
  };

  // Reset to initial
  const resetToDefaults = () => {
    setCourses(INITIAL_COURSES);
    showToast("Reset all courses and assessments to official syllabus defaults", "info");
  };

  // Calculate course grade and metrics
  const getCourseMetrics = (course) => {
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

    // Check specific syllabus requirements
    const passingChecks = [];
    if (course.id === 'sec320') {
      // 50% on tests, 50% on labs
      const testTasks = assessments.filter(a => a.category === 'Test');
      const labTasks = assessments.filter(a => a.category === 'Lab');
      passingChecks.push({ name: "Overall >= 50%", passed: (currentAverage === null || currentAverage >= 50) });
      passingChecks.push({ name: "Tests Weighted Avg >= 50%", condition: "50% Test Threshold" });
      passingChecks.push({ name: "Labs Weighted Avg >= 50%", condition: "50% Lab Threshold" });
    } else if (course.id === 'dat330') {
      passingChecks.push({ name: "Overall >= 50%", passed: (currentAverage === null || currentAverage >= 50) });
      passingChecks.push({ name: "Labs Weighted Avg >= 50%", condition: "50% Lab Threshold" });
      passingChecks.push({ name: "Tests Weighted Avg >= 50%", condition: "50% Test Threshold" });
      passingChecks.push({ name: "Assignments & Project >= 50%", condition: "50% Project Threshold" });
    } else if (course.id === 'mst300') {
      passingChecks.push({ name: "Overall >= 50%", passed: (currentAverage === null || currentAverage >= 50) });
      passingChecks.push({ name: "Labs Avg >= 50%", condition: "50% Lab Threshold" });
      passingChecks.push({ name: "Projects Avg >= 50%", condition: "50% Project Threshold" });
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
  };

  // Overall semester metrics
  const getSemesterMetrics = () => {
    let gradedCredits = 0;
    let totalQualityPoints = 0;
    let totalTasks = 0;
    let completedTasks = 0;
    let totalWeightedScore = 0;
    let evaluatedCoursesCount = 0;

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
        totalWeightedScore += metrics.currentAverage;
        evaluatedCoursesCount++;
      }
    });

    const currentGpa = gradedCredits > 0 ? (totalQualityPoints / gradedCredits) : null;
    const semesterAverage = evaluatedCoursesCount > 0 ? (totalWeightedScore / evaluatedCoursesCount) : null;
    const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      currentGpa: currentGpa !== null ? currentGpa.toFixed(2) : "4.00*",
      semesterAverage: semesterAverage !== null ? semesterAverage.toFixed(1) + "%" : "Pending",
      completedTasks,
      totalTasks,
      progressPercent
    };
  };

  // All assessments flattened with course info
  const getAllAssessments = () => {
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
    // Sort by due date ascending
    list.sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || ''));
    return list;
  };

  return (
    <AcademicContext.Provider value={{
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
    }}>
      {children}
    </AcademicContext.Provider>
  );
}

export function useAcademic() {
  const context = useContext(AcademicContext);
  if (!context) throw new Error("useAcademic must be used within AcademicProvider");
  return context;
}
