import React, { useState, useEffect, useMemo } from 'react';
import { useAcademic } from '../context/AcademicContext';
import { 
  BookOpen, Sparkles, CheckCircle2, RotateCcw, 
  ChevronLeft, ChevronRight, Shuffle, Plus, Trash2, 
  Search, Filter, Play, Award, Flame, Check, HelpCircle, 
  List, Layers, X, Code, Target, ArrowRight
} from 'lucide-react';
import { INITIAL_FLASHCARDS } from '../data/flashcardsData';

const FLASHCARDS_STORAGE_KEY = 'seneca_cty_flashcards_v2';

export default function FlashcardsView() {
  const { courses, setCurrentView, showToast } = useAcademic();

  // Load persisted flashcards with initial defaults fallback
  const [cards, setCards] = useState(() => {
    try {
      const saved = localStorage.getItem(FLASHCARDS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_FLASHCARDS;
    } catch {
      return INITIAL_FLASHCARDS;
    }
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(FLASHCARDS_STORAGE_KEY, JSON.stringify(cards));
    } catch (e) {
      console.error('Failed to save flashcards', e);
    }
  }, [cards]);

  // View Mode: 'flip' (Interactive 3D Cards) or 'browse' (Searchable Cheatsheet List)
  const [viewMode, setViewMode] = useState('flip');
  const [courseFilter, setCourseFilter] = useState('ALL');
  const [masteryFilter, setMasteryFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Active Flip Card State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Custom Card Form State
  const [newCard, setNewCard] = useState({
    courseId: 'ops345',
    category: 'General',
    question: '',
    answer: '',
    codeSnippet: ''
  });

  // Filtered Cards
  const filteredCards = useMemo(() => {
    return cards.filter(card => {
      if (courseFilter !== 'ALL' && card.courseId !== courseFilter) return false;
      if (masteryFilter !== 'ALL' && card.mastery !== masteryFilter) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchQ = (card.question || '').toLowerCase().includes(q);
        const matchA = (card.answer || '').toLowerCase().includes(q);
        const matchC = (card.category || '').toLowerCase().includes(q);
        const matchCourse = (card.courseCode || '').toLowerCase().includes(q);
        if (!matchQ && !matchA && !matchC && !matchCourse) return false;
      }
      return true;
    });
  }, [cards, courseFilter, masteryFilter, searchTerm]);

  // Ensure index stays in bounds when filters change
  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [courseFilter, masteryFilter, searchTerm]);

  const currentCard = filteredCards[currentIndex];

  // Keyboard navigation shortcuts
  useEffect(() => {
    if (viewMode !== 'flip') return;
    const handleKeyDown = (e) => {
      // Don't intercept if user is typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped(prev => !prev);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === '1') {
        handleRateCurrent('needs_practice');
      } else if (e.key === '2') {
        handleRateCurrent('learning');
      } else if (e.key === '3') {
        handleRateCurrent('mastered');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, currentIndex, filteredCards.length]);

  const handleNext = () => {
    if (filteredCards.length === 0) return;
    setIsFlipped(false);
    setCurrentIndex(prev => (prev + 1) % filteredCards.length);
  };

  const handlePrev = () => {
    if (filteredCards.length === 0) return;
    setIsFlipped(false);
    setCurrentIndex(prev => (prev - 1 + filteredCards.length) % filteredCards.length);
  };

  const handleShuffle = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    showToast('Shuffled flashcard deck', 'info');
  };

  const handleRateCurrent = (status) => {
    if (!currentCard) return;
    setCards(prev => prev.map(c => c.id === currentCard.id ? { ...c, mastery: status } : c));
    showToast(status === 'mastered' ? 'Mastered! 4.0 Point Added ⭐' : 'Progress saved', 'success');
    // Auto advance
    setTimeout(() => {
      handleNext();
    }, 250);
  };

  const handleResetMastery = () => {
    if (window.confirm('Reset mastery ratings for all flashcards to unrated?')) {
      setCards(prev => prev.map(c => ({ ...c, mastery: 'unrated' })));
      showToast('Mastery progress reset', 'info');
    }
  };

  const handleAddCard = (e) => {
    e.preventDefault();
    if (!newCard.question.trim() || !newCard.answer.trim()) {
      showToast('Please enter both a question and an answer', 'warning');
      return;
    }

    const course = courses.find(c => c.id === newCard.courseId);
    const cardToAdd = {
      id: `custom-card-${Date.now()}`,
      courseId: newCard.courseId,
      courseCode: course ? course.code : 'CTY',
      category: newCard.category.trim() || 'Custom',
      question: newCard.question.trim(),
      answer: newCard.answer.trim(),
      codeSnippet: newCard.codeSnippet.trim() || null,
      mastery: 'unrated'
    };

    setCards(prev => [cardToAdd, ...prev]);
    setIsAddModalOpen(false);
    showToast(`Added custom flashcard for ${cardToAdd.courseCode}!`, 'success');

    // Reset form
    setNewCard({
      courseId: 'ops345',
      category: 'General',
      question: '',
      answer: '',
      codeSnippet: ''
    });
  };

  const handleDeleteCard = (id) => {
    setCards(prev => prev.filter(c => c.id !== id));
    showToast('Flashcard deleted', 'info');
  };

  // Overall Mastery Metrics
  const totalCards = cards.length;
  const masteredCount = cards.filter(c => c.mastery === 'mastered').length;
  const learningCount = cards.filter(c => c.mastery === 'learning').length;
  const needsPracticeCount = cards.filter(c => c.mastery === 'needs_practice').length;
  const overallMasteryPct = totalCards > 0 ? Math.round((masteredCount / totalCards) * 100) : 0;

  // Active Card's Course Info
  const activeCourse = courses.find(c => c.id === currentCard?.courseId);
  const activeColor = activeCourse?.color || '#ef4444';

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      
      {/* Top Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>Active Recall & Command Mastery</span>
              </span>
              <span className="text-xs text-slate-400">Seneca CTY Semester 3 Exam Readiness</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight mt-1 flex items-center gap-2">
              <span>Flashcard War Room & Cheatsheet</span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-red-500/10 text-red-400 border border-red-500/20 font-normal">
                {totalCards} Concept Cards
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Rapid command memorization for OPS345, Azure CLI, SQL normal forms, Wireshark filters, and Mininet OpenFlow.
            </p>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition flex items-center gap-1.5 shadow-lg shadow-red-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>Create Card</span>
            </button>
            <button
              onClick={handleShuffle}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition flex items-center gap-1.5"
            >
              <Shuffle className="w-3.5 h-3.5 text-amber-400" />
              <span>Shuffle</span>
            </button>
            <button
              onClick={() => {
                setCurrentView('timer');
                showToast('Focus Timer launched! Study flashcards in 25-min sprints.', 'info');
              }}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
              <span>25m Focus Sprint</span>
            </button>
          </div>
        </div>

        {/* Knowledge Mastery Progress Dashboard */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-800/80">
          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80">
            <div className="text-[10px] uppercase font-bold text-slate-400">Overall Mastery</div>
            <div className="text-xl font-extrabold text-emerald-400 font-mono mt-0.5 flex items-baseline gap-1">
              <span>{overallMasteryPct}%</span>
              <span className="text-xs font-normal text-slate-400">({masteredCount}/{totalCards})</span>
            </div>
            <div className="h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${overallMasteryPct}%` }}
              />
            </div>
          </div>

          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80">
            <div className="text-[10px] uppercase font-bold text-slate-400">Mastered (4.0 Lock)</div>
            <div className="text-xl font-extrabold text-emerald-400 font-mono mt-0.5">
              {masteredCount} <span className="text-xs font-normal text-slate-400">cards</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Ready for midterms & finals</div>
          </div>

          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80">
            <div className="text-[10px] uppercase font-bold text-slate-400">Learning / Review</div>
            <div className="text-xl font-extrabold text-amber-400 font-mono mt-0.5">
              {learningCount} <span className="text-xs font-normal text-slate-400">cards</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Needs one more revision</div>
          </div>

          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80">
            <div className="text-[10px] uppercase font-bold text-slate-400">Needs Practice</div>
            <div className="text-xl font-extrabold text-rose-400 font-mono mt-0.5">
              {needsPracticeCount} <span className="text-xs font-normal text-slate-400">cards</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Flagged for active drill</div>
          </div>
        </div>
      </div>

      {/* Filter & View Mode Controls Bar */}
      <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Search */}
          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search concepts, commands, syntax..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Course Filter */}
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white font-medium focus:border-red-500 focus:outline-none"
          >
            <option value="ALL">All 7 Courses</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>{c.code} — {c.name}</option>
            ))}
          </select>

          {/* Mastery Filter */}
          <select
            value={masteryFilter}
            onChange={(e) => setMasteryFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white font-medium focus:border-red-500 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="unrated">Unrated</option>
            <option value="needs_practice">Needs Practice</option>
            <option value="learning">Learning</option>
            <option value="mastered">Mastered ⭐</option>
          </select>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setViewMode('flip')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition ${
              viewMode === 'flip' 
                ? 'bg-red-600 text-white shadow' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Interactive Flip</span>
          </button>
          <button
            onClick={() => setViewMode('browse')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition ${
              viewMode === 'browse' 
                ? 'bg-red-600 text-white shadow' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Cheatsheet Table</span>
          </button>
        </div>
      </div>

      {/* MODE 1: INTERACTIVE 3D FLIP CARD */}
      {viewMode === 'flip' && (
        <div className="max-w-3xl mx-auto space-y-4">
          
          {filteredCards.length === 0 ? (
            <div className="p-12 text-center bg-slate-900/60 border border-slate-800 rounded-3xl space-y-3">
              <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
              <div className="text-base font-bold text-slate-300">No flashcards match your current filter</div>
              <p className="text-xs text-slate-500">
                Try switching courses or reset the search term.
              </p>
              <button
                onClick={() => {
                  setCourseFilter('ALL');
                  setMasteryFilter('ALL');
                  setSearchTerm('');
                }}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-500 transition"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Card Meta & Navigation Header */}
              <div className="flex items-center justify-between text-xs text-slate-400 px-2">
                <div className="flex items-center gap-2">
                  <span 
                    className="font-mono text-xs font-bold px-2 py-0.5 rounded border"
                    style={{
                      color: activeColor,
                      backgroundColor: `${activeColor}15`,
                      borderColor: `${activeColor}40`
                    }}
                  >
                    {currentCard.courseCode}
                  </span>
                  <span className="text-slate-400 font-medium">
                    {currentCard.category}
                  </span>
                </div>

                <div className="flex items-center gap-2 font-mono">
                  <span>Card {currentIndex + 1} of {filteredCards.length}</span>
                </div>
              </div>

              {/* The Interactive Flip Card Box */}
              <div 
                onClick={() => setIsFlipped(prev => !prev)}
                className="cursor-pointer min-h-[320px] sm:min-h-[340px] rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 relative border select-none group bg-slate-900 shadow-2xl hover:border-slate-700"
                style={{
                  borderColor: isFlipped ? `${activeColor}60` : undefined,
                  boxShadow: isFlipped ? `0 20px 40px -15px ${activeColor}20` : undefined
                }}
              >
                {/* Top status indicator inside card */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border bg-slate-950 font-mono text-slate-400">
                    {isFlipped ? '💡 ANSWER' : '❓ QUESTION'}
                  </span>

                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                    currentCard.mastery === 'mastered'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : currentCard.mastery === 'learning'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : currentCard.mastery === 'needs_practice'
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {currentCard.mastery === 'mastered' ? '⭐ Mastered (4.0)' : currentCard.mastery === 'learning' ? '⚡ Learning' : currentCard.mastery === 'needs_practice' ? '⚠️ Needs Practice' : 'Unrated'}
                  </span>
                </div>

                {/* Question / Answer Content */}
                <div className="my-auto py-4 space-y-4">
                  {!isFlipped ? (
                    <div className="text-base sm:text-lg font-bold text-white leading-relaxed tracking-tight">
                      {currentCard.question}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="text-sm sm:text-base text-slate-100 leading-relaxed whitespace-pre-line font-medium">
                        {currentCard.answer}
                      </div>

                      {/* Code Snippet Box */}
                      {currentCard.codeSnippet && (
                        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto whitespace-pre">
                          {currentCard.codeSnippet}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom hint */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 text-[11px] text-slate-400">
                  <span className="group-hover:text-slate-300 transition flex items-center gap-1">
                    <span>Click anywhere or press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">Space</kbd> to {isFlipped ? 'view question' : 'flip answer'}</span>
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">
                    Use <kbd className="px-1 py-0.5 rounded bg-slate-800">1</kbd> <kbd className="px-1 py-0.5 rounded bg-slate-800">2</kbd> <kbd className="px-1 py-0.5 rounded bg-slate-800">3</kbd> to rate
                  </span>
                </div>
              </div>

              {/* Rating & Navigation Control Strip */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                {/* Prev / Next Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition flex items-center gap-1 text-xs font-semibold"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Prev</span>
                  </button>
                  <button
                    onClick={handleNext}
                    className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition flex items-center gap-1 text-xs font-semibold"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Rating Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRateCurrent('needs_practice')}
                    className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold transition"
                    title="Press 1 on keyboard"
                  >
                    🔴 Needs Practice [1]
                  </button>
                  <button
                    onClick={() => handleRateCurrent('learning')}
                    className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold transition"
                    title="Press 2 on keyboard"
                  >
                    🟡 Learning [2]
                  </button>
                  <button
                    onClick={() => handleRateCurrent('mastered')}
                    className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition flex items-center gap-1"
                    title="Press 3 on keyboard"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Mastered (4.0) [3]</span>
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {/* MODE 2: BROWSE / SEARCHABLE CHEATSHEET LIST */}
      {viewMode === 'browse' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Showing {filteredCards.length} technical flashcards</span>
            <button
              onClick={handleResetMastery}
              className="text-slate-500 hover:text-rose-400 transition"
            >
              Reset all mastery
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCards.map((card) => {
              const course = courses.find(c => c.id === card.courseId);
              const color = course?.color || '#ef4444';

              return (
                <div 
                  key={card.id}
                  className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-3 relative overflow-hidden"
                >
                  <div 
                    className="absolute top-0 bottom-0 left-0 w-1.5"
                    style={{ backgroundColor: color }}
                  />

                  <div className="pl-2 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span 
                          className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border"
                          style={{
                            color: color,
                            backgroundColor: `${color}15`,
                            borderColor: `${color}40`
                          }}
                        >
                          {card.courseCode}
                        </span>
                        <span className="text-[11px] font-medium text-slate-400">
                          {card.category}
                        </span>
                      </div>

                      <span className={`text-[10px] font-semibold px-2 py-0.2 rounded-full border ${
                        card.mastery === 'mastered'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : card.mastery === 'learning'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : card.mastery === 'needs_practice'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {card.mastery === 'mastered' ? 'Mastered ⭐' : card.mastery === 'learning' ? 'Learning' : card.mastery === 'needs_practice' ? 'Needs Practice' : 'Unrated'}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-white leading-snug">
                      {card.question}
                    </h4>

                    <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                      {card.answer}
                    </p>

                    {card.codeSnippet && (
                      <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[11px] text-emerald-400 overflow-x-auto whitespace-pre">
                        {card.codeSnippet}
                      </div>
                    )}
                  </div>

                  <div className="pl-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setCards(prev => prev.map(c => c.id === card.id ? { ...c, mastery: 'mastered' } : c));
                          showToast('Card marked mastered', 'success');
                        }}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-400 transition"
                      >
                        ✓ Mastered
                      </button>
                      <button
                        onClick={() => {
                          setCards(prev => prev.map(c => c.id === card.id ? { ...c, mastery: 'needs_practice' } : c));
                          showToast('Flagged for practice', 'info');
                        }}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition"
                      >
                        ⚠️ Drill
                      </button>
                    </div>

                    {card.id.startsWith('custom-') && (
                      <button
                        onClick={() => handleDeleteCard(card.id)}
                        className="text-slate-500 hover:text-rose-400 transition p-1"
                        title="Delete custom card"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Custom Flashcard Modal */}
      {isAddModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-flashcard-title"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div 
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 id="add-flashcard-title" className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-red-400" />
                <span>Create Custom Concept Flashcard</span>
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)} 
                className="text-slate-400 hover:text-white p-1"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCard} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Course</label>
                  <select
                    value={newCard.courseId}
                    onChange={(e) => setNewCard(prev => ({ ...prev, courseId: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-medium focus:border-red-500 focus:outline-none"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.code} — {c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category / Topic</label>
                  <input
                    type="text"
                    placeholder="e.g. BIND DNS, Azure NSG, SQL ACID"
                    value={newCard.category}
                    onChange={(e) => setNewCard(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-red-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Question / Prompt</label>
                <textarea
                  rows="2"
                  placeholder="What is the concept, command, or question?"
                  value={newCard.question}
                  onChange={(e) => setNewCard(prev => ({ ...prev, question: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-red-500 focus:outline-none resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Answer / Explanation</label>
                <textarea
                  rows="3"
                  placeholder="Provide the accurate, high-yield explanation or definition..."
                  value={newCard.answer}
                  onChange={(e) => setNewCard(prev => ({ ...prev, answer: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-red-500 focus:outline-none resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Command / Code Snippet (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. named-checkzone or az vm deallocate"
                  value={newCard.codeSnippet}
                  onChange={(e) => setNewCard(prev => ({ ...prev, codeSnippet: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:border-red-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-500 transition shadow-lg shadow-red-600/20"
                >
                  Save Flashcard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
