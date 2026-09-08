import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAcademic } from '../context/AcademicContext';
import { 
  Sparkles, Volume2, VolumeX, Lightbulb, CheckCircle2, 
  HelpCircle, ArrowRight, ArrowLeft, RefreshCw, Award, 
  ShieldAlert, BookOpen, ChevronDown, ChevronUp, Search,
  Check, Filter, AlertTriangle, Layers, Brain, Terminal
} from 'lucide-react';
import { VIVA_QUESTIONS, VIVA_MASTERY_LEVELS } from '../data/vivaQuestionsData';

const STORAGE_KEY_VIVA = 'seneca_cty_viva_mastery_v1';

export default function SocraticCoachView() {
  const { 
    courses, 
    setCurrentView, 
    setSelectedCourseId,
    showToast, 
    triggerCelebration 
  } = useAcademic();

  // Filters & Modes
  const [courseFilter, setCourseFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [viewMode, setViewMode] = useState('practice'); // 'practice' | 'browse'
  const [searchTerm, setSearchTerm] = useState('');
  
  // Active Question Index in Practice Mode
  const [currentIndex, setCurrentIndex] = useState(0);

  // Progressive Hint Reveal State (0 = none, 1 = first, 2 = second, 3 = third)
  const [revealedHints, setRevealedHints] = useState(0);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [userDraftAnswer, setUserDraftAnswer] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Stored Mastery ratings: { [questionId]: 'needs-practice' | 'good' | 'mastered' }
  const [masteryMap, setMasteryMap] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_VIVA);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to load viva mastery", e);
    }
    return {};
  });

  // Save mastery to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_VIVA, JSON.stringify(masteryMap));
    } catch (e) {
      console.error("Failed to save viva mastery", e);
    }
  }, [masteryMap]);

  // Filtered question set
  const filteredQuestions = useMemo(() => {
    return VIVA_QUESTIONS.filter(q => {
      if (courseFilter !== 'all' && q.courseId !== courseFilter) return false;
      if (difficultyFilter !== 'all' && q.difficulty !== difficultyFilter) return false;
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesText = q.question.toLowerCase().includes(term) ||
                            q.modelAnswer.toLowerCase().includes(term) ||
                            q.category.toLowerCase().includes(term) ||
                            q.keyTerms.some(t => t.toLowerCase().includes(term));
        if (!matchesText) return false;
      }
      return true;
    });
  }, [courseFilter, difficultyFilter, searchTerm]);

  // Keep index within bounds
  useEffect(() => {
    if (currentIndex >= filteredQuestions.length) {
      setCurrentIndex(Math.max(0, filteredQuestions.length - 1));
    }
    // Reset question-specific states on navigation
    setRevealedHints(0);
    setIsAnswerRevealed(false);
    setUserDraftAnswer('');
    // Stop any ongoing speech
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [currentIndex, filteredQuestions.length, courseFilter, difficultyFilter]);

  const activeQuestion = filteredQuestions[currentIndex] || VIVA_QUESTIONS[0];

  // Voice Speech Synthesis
  const handleSpeakQuestion = () => {
    if (!('speechSynthesis' in window)) {
      showToast("Speech synthesis not supported in this browser", "info");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const textToSpeak = `Professor Question for ${activeQuestion.courseCode}. ${activeQuestion.question}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Keyboard Shortcuts for Practice Mode
  useEffect(() => {
    if (viewMode !== 'practice') return;

    const handleKeyDown = (e) => {
      // Don't intercept if user is typing in the textarea
      if (['TEXTAREA', 'INPUT'].includes(e.target.tagName)) return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        setCurrentIndex(prev => (prev + 1) % filteredQuestions.length);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentIndex(prev => (prev - 1 + filteredQuestions.length) % filteredQuestions.length);
      } else if (e.key.toLowerCase() === 'h') {
        e.preventDefault();
        setRevealedHints(prev => Math.min(3, prev + 1));
      } else if (e.key.toLowerCase() === 'r') {
        e.preventDefault();
        setIsAnswerRevealed(prev => !prev);
      } else if (e.key === '1') {
        rateQuestion(activeQuestion.id, 'needs-practice');
      } else if (e.key === '2') {
        rateQuestion(activeQuestion.id, 'good');
      } else if (e.key === '3') {
        rateQuestion(activeQuestion.id, 'mastered');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, filteredQuestions.length, activeQuestion?.id]);

  // Rate mastery
  const rateQuestion = (questionId, level) => {
    setMasteryMap(prev => ({
      ...prev,
      [questionId]: level
    }));

    if (level === 'mastered') {
      triggerCelebration();
      showToast("Mastered! 4.0 Distinction Defense recorded.", "success");
    } else {
      showToast(`Rating updated: ${level.replace('-', ' ')}`, "info");
    }
  };

  // Metrics calculation
  const totalMasteredCount = useMemo(() => {
    return Object.values(masteryMap).filter(v => v === 'mastered').length;
  }, [masteryMap]);

  const readinessPercent = Math.round((totalMasteredCount / (VIVA_QUESTIONS.length || 1)) * 100);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-950/40 to-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold">
              <Brain className="w-3.5 h-3.5" />
              <span>Socratic Technical Viva & Oral Defense</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              Socratic Concept Viva & Oral Exam Coach
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl">
              Master the conceptual "under-the-hood" mechanisms professors test during lab demos and 
              practical exams. Practice oral answers, unlock progressive Socratic hints, and lock in your <span className="text-amber-400 font-bold">4.0 GPA target</span>.
            </p>
          </div>

          {/* Viva Readiness Score Card */}
          <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl flex items-center gap-4 shrink-0 shadow-lg">
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Viva Defense Readiness</div>
              <div className="text-xl font-black text-white mt-0.5">
                {readinessPercent}% <span className="text-xs text-slate-400 font-normal">({totalMasteredCount}/{VIVA_QUESTIONS.length} Mastered)</span>
              </div>
              <div className="text-xs font-semibold text-purple-400 mt-0.5">
                {readinessPercent >= 80 ? "🏆 4.0 Exam Distinction Ready" : "📚 Oral Drill Recommended"}
              </div>
            </div>
          </div>
        </div>

        {/* View Mode Toggle & Quick Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-8 pt-6 border-t border-slate-800/80">
          {/* Mode Switcher */}
          <div className="bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 flex items-center shrink-0">
            <button
              onClick={() => setViewMode('practice')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'practice'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Practice Mode</span>
            </button>
            <button
              onClick={() => setViewMode('browse')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                viewMode === 'browse'
                  ? 'bg-slate-800 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-purple-400" />
              <span>Browse All Questions ({VIVA_QUESTIONS.length})</span>
            </button>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto text-xs pb-1 sm:pb-0">
            <select
              value={courseFilter}
              onChange={e => setCourseFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Courses</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.code}</option>
              ))}
            </select>

            <select
              value={difficultyFilter}
              onChange={e => setDifficultyFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Difficulties</option>
              <option value="Core">Core</option>
              <option value="Advanced">Advanced</option>
              <option value="Distinction 4.0">Distinction 4.0</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Mode Content */}
      {viewMode === 'practice' ? (
        filteredQuestions.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 text-sm">
            No oral defense questions match your active filters.
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Interactive Question Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-2xl space-y-6">
              
              {/* Question Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-white px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800">
                    {activeQuestion.courseCode}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                    {activeQuestion.category}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    activeQuestion.difficulty === 'Distinction 4.0'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-extrabold'
                      : activeQuestion.difficulty === 'Advanced'
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {activeQuestion.difficulty}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="font-mono">
                    Scenario {currentIndex + 1} of {filteredQuestions.length}
                  </span>

                  {/* Audio Speech Button */}
                  <button
                    onClick={handleSpeakQuestion}
                    className={`p-2 rounded-xl border transition flex items-center gap-1.5 ${
                      isSpeaking
                        ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-900/40'
                        : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800'
                    }`}
                    title={isSpeaking ? "Stop speech" : "Read question aloud"}
                  >
                    {isSpeaking ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-purple-400" />}
                    <span className="text-[11px] font-semibold">{isSpeaking ? 'Mute' : 'Listen'}</span>
                  </button>
                </div>
              </div>

              {/* The Professor's Question */}
              <div className="space-y-3">
                <div className="text-xs uppercase tracking-wider font-bold text-purple-400 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Professor Viva Prompt</span>
                </div>
                <h2 className="text-lg lg:text-xl font-bold text-white leading-relaxed">
                  "{activeQuestion.question}"
                </h2>
                
                {/* Why Professors Ask This */}
                <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400 flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-300">Syllabus Context:</strong> {activeQuestion.whyProfessorsAsk}
                  </span>
                </div>
              </div>

              {/* Student Practice Scratchpad */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold">Your Oral Explanation / Outline:</span>
                  <span className="text-[11px]">Type notes or speak aloud before checking hints</span>
                </div>
                <textarea
                  value={userDraftAnswer}
                  onChange={e => setUserDraftAnswer(e.target.value)}
                  placeholder="Outline your explanation here (e.g. key protocols, RFC-standards, failure modes, Linux kernel hooks)..."
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono leading-relaxed"
                />
              </div>

              {/* Socratic Progressive Hints Section */}
              <div className="space-y-3 pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-slate-200">
                      Socratic Hints ({revealedHints}/3 Revealed)
                    </span>
                  </div>

                  {revealedHints < 3 && (
                    <button
                      onClick={() => setRevealedHints(prev => Math.min(3, prev + 1))}
                      className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>Reveal Hint {revealedHints + 1}</span>
                      <span className="text-[10px] text-amber-400/80 font-mono">(Key: H)</span>
                    </button>
                  )}
                </div>

                {/* Display Revealed Hints */}
                {revealedHints > 0 && (
                  <div className="space-y-2 pt-1">
                    {activeQuestion.hints.slice(0, revealedHints).map((hint, idx) => (
                      <div 
                        key={idx}
                        className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200/90 flex items-start gap-2 animate-fadeIn"
                      >
                        <span className="font-bold text-amber-400 shrink-0">#{idx + 1}</span>
                        <span className="leading-relaxed">{hint}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Model Defense Reveal Trigger */}
              <div className="pt-2 border-t border-slate-800">
                <button
                  onClick={() => setIsAnswerRevealed(prev => !prev)}
                  className={`w-full py-3 px-4 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg ${
                    isAnswerRevealed
                      ? 'bg-slate-800 text-slate-200 border border-slate-700'
                      : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-purple-950/50 hover:brightness-110'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  <span>{isAnswerRevealed ? 'Hide Model Defense & Rubric' : 'Reveal 4.0 Model Defense & Key Terms'}</span>
                  <span className="text-[10px] opacity-75 font-mono">(Key: R)</span>
                </button>
              </div>

              {/* Revealed Model Answer & Pitfalls Card */}
              {isAnswerRevealed && (
                <div className="space-y-4 pt-2 animate-fadeIn">
                  
                  {/* Model Defense Text */}
                  <div className="p-5 rounded-2xl bg-slate-950 border border-purple-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-purple-400" />
                        <span>4.0 Distinction Model Defense</span>
                      </span>
                    </div>

                    <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-line font-mono bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                      {activeQuestion.modelAnswer}
                    </div>

                    {/* Key Terms Chips */}
                    <div className="space-y-1.5 pt-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Key Rubric Terms Expected in Oral Response:
                      </span>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {activeQuestion.keyTerms.map((term, i) => (
                          <span 
                            key={i} 
                            className="px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30"
                          >
                            {term}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Common Pitfalls Card */}
                  <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-1.5 text-xs">
                    <div className="font-bold text-rose-300 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      <span>Avoid These Common Student Pitfalls (Mark Deduction Traps):</span>
                    </div>
                    <p className="text-slate-300 pl-5 leading-relaxed">
                      {activeQuestion.pitfalls}
                    </p>
                  </div>

                  {/* Self-Rating Mastery Bar */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-xs text-slate-300 font-semibold">
                      Rate Your Oral Explanation:
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => rateQuestion(activeQuestion.id, 'needs-practice')}
                        className={`flex-1 sm:flex-initial px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                          masteryMap[activeQuestion.id] === 'needs-practice'
                            ? 'bg-rose-600 text-white shadow-md'
                            : 'bg-slate-900 text-rose-400 hover:bg-slate-800 border border-slate-800'
                        }`}
                      >
                        <span>Needs Practice (1)</span>
                      </button>

                      <button
                        onClick={() => rateQuestion(activeQuestion.id, 'good')}
                        className={`flex-1 sm:flex-initial px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                          masteryMap[activeQuestion.id] === 'good'
                            ? 'bg-amber-600 text-white shadow-md'
                            : 'bg-slate-900 text-amber-300 hover:bg-slate-800 border border-slate-800'
                        }`}
                      >
                        <span>Good (2)</span>
                      </button>

                      <button
                        onClick={() => rateQuestion(activeQuestion.id, 'mastered')}
                        className={`flex-1 sm:flex-initial px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                          masteryMap[activeQuestion.id] === 'mastered'
                            ? 'bg-emerald-600 text-white shadow-md'
                            : 'bg-slate-900 text-emerald-300 hover:bg-slate-800 border border-slate-800'
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>4.0 Flawless (3)</span>
                      </button>
                    </div>
                  </div>

                </div>
              )}

              {/* Navigation Controls Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  onClick={() => setCurrentIndex(prev => (prev - 1 + filteredQuestions.length) % filteredQuestions.length)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <span className="text-xs font-mono text-slate-500 hidden sm:inline">
                  Use keys: &larr; / &rarr; to navigate • H for hint • R to reveal
                </span>

                <button
                  onClick={() => setCurrentIndex(prev => (prev + 1) % filteredQuestions.length)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition flex items-center gap-1.5"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        )
      ) : (
        /* BROWSE ALL CHEATSHEET MODE */
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search scenarios, DNS, B-Trees, DKOM, OpenFlow..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <span className="text-xs text-slate-400">
              Showing {filteredQuestions.length} scenarios
            </span>
          </div>

          <div className="space-y-3">
            {filteredQuestions.map(q => {
              const status = masteryMap[q.id];

              return (
                <div 
                  key={q.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3 hover:border-slate-700 transition"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-white px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                        {q.courseCode}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {q.category}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">
                        {q.difficulty}
                      </span>
                    </div>

                    {status === 'mastered' ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> 4.0 Mastered
                      </span>
                    ) : status === 'good' ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        Good
                      </span>
                    ) : status === 'needs-practice' ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        Needs Practice
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500">Unattempted</span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-white leading-snug">
                    "{q.question}"
                  </h3>

                  <div className="text-xs text-slate-300 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80 leading-relaxed font-mono whitespace-pre-line">
                    {q.modelAnswer}
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {q.keyTerms.map((term, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 text-[10px] font-mono border border-purple-500/20">
                        {term}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Cross-Link Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setCurrentView('flashcards')}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/40 text-left transition group flex items-center justify-between"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-purple-400 text-xs font-bold">
              <Brain className="w-4 h-4" />
              <span>Active Recall Flashcards</span>
            </div>
            <p className="text-xs text-slate-400">
              Drill rapid syntax memory with 3D flip cards and keyboard controls.
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-purple-400 transition transform group-hover:translate-x-1" />
        </button>

        <button
          onClick={() => setCurrentView('exams')}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-left transition group flex items-center justify-between"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
              <Award className="w-4 h-4" />
              <span>Exam & Midterm War Room</span>
            </div>
            <p className="text-xs text-slate-400">
              Check cheat sheet allowances and 50% test passing hurdles.
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-amber-400 transition transform group-hover:translate-x-1" />
        </button>

        <button
          onClick={() => setCurrentView('preflight')}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-left transition group flex items-center justify-between"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
              <Terminal className="w-4 h-4" />
              <span>Lab Pre-Flight Hub</span>
            </div>
            <p className="text-xs text-slate-400">
              Run terminal proof commands and audit rubric requirements.
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 transition transform group-hover:translate-x-1" />
        </button>
      </div>

    </div>
  );
}
