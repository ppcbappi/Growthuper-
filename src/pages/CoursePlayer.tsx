import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, 
  PlayCircle, 
  CheckCircle, 
  ArrowLeft, 
  BookOpen, 
  Tv, 
  X, 
  Award,
  Sparkles,
  Lock,
  Compass,
  AlertCircle,
  TrendingUp,
  ChevronRight,
  HelpCircle,
  FileText
} from 'lucide-react';
import { db, Course, Module, Lesson, LessonProgress } from '../lib/database';
import PurchaseModal from '../components/PurchaseModal';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export default function CoursePlayer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [progress, setProgress] = useState<LessonProgress[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [newCertId, setNewCertId] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false);

  // Quiz States
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizError, setQuizError] = useState('');
  const [quizSuccess, setQuizSuccess] = useState(false);

  // Fallback Quiz questions indexed by key terms inside lesson titles
  const getQuizForLesson = (lessonTitle: string): QuizQuestion => {
    const title = lessonTitle.toLowerCase();
    
    if (title.includes('server') || title.includes('dns')) {
      return {
        id: 'q-server',
        question: "How does setting up server-side DNS subdomains bypass Safari's ITP tracking rules?",
        options: [
          "It blocks standard browser requests completely",
          "It writes first-party cookies from your own domain, retaining signals up to 180 days rather than 7 days",
          "It forces customers to clear their local cache on each login stream",
          "It encrypts the entire dataset with 128-bit key parameters"
        ],
        correctIndex: 1,
        explanation: "By utilizing a first-party subdomain proxy, cookies are recognized as native first-party resources, successfully shielding them against client-side Intelligent Tracking Prevention (ITP) filters."
      };
    }
    
    if (title.includes('meta') || title.includes('capi') || title.includes('pixel')) {
      return {
        id: 'q-meta',
        question: "What is the primary function of deduplication in Meta Conversions API (CAPI) setups?",
        options: [
          "To speed up browser page rendering inside social web frames",
          "To prevent Facebook from charging double for ad campaigns",
          "To discard redundant duplicate pixels using matching event_id and event_name arrays",
          "To translate user email values into hashed binary variables"
        ],
        correctIndex: 2,
        explanation: "Since both browser pixel and server API fire events for the same action, matching event_id values allow Meta systems to merge both streams and deduct duplicate statistics."
      };
    }

    if (title.includes('datalayer') || title.includes('ecommerce') || title.includes('shopify')) {
      return {
        id: 'q-datalayer',
        question: "Which of the following represents a correct GA4 compliant standard key array for product views?",
        options: [
          "dataLayer.push({ event: 'view_item', ecommerce: { items: [ { item_id: 'SKU_12', price: 99.0 } ] } })",
          "dataLayer.push({ purchase_value: 99.0 })",
          "dataLayer.push({ schema: 'ecommerce-gtm-stream' })",
          "dataLayer.push({ item_sku: '12', item_currency: 'USD' })"
        ],
        correctIndex: 0,
        explanation: "Google Analytics 4 requires a standard structured 'items' array containing 'item_id' and 'item_name' under the general 'ecommerce' wrapper to populate standard report dashboards."
      };
    }

    return {
      id: 'q-general',
      question: "Which tool plays the central orchestration role in defining custom triggers, tags, and dataLayer listeners?",
      options: [
        "Raw server index configs",
        "Google Workspace Spreadsheet formulas",
        "Google Tag Manager (GTM) Container",
        "PostgreSQL structural databases"
      ],
      correctIndex: 2,
      explanation: "GTM provides the robust client-side control hub allowing operators to direct custom code blocks, tag rules, and compliance tools synchronously."
    };
  };

  // Load Session and Authorization Checks
  useEffect(() => {
    const user = db.getSession();
    setCurrentUser(user);

    const dbCourses = db.getCourses();
    const activeCourse = dbCourses.find(c => c.id === id || c.slug === id);
    if (!activeCourse) {
      navigate('/courses');
      return;
    }
    setCourse(activeCourse);

    // Dynamic unlocking states status
    let unlocked = false;
    if (user) {
      const purchases = db.getPurchases(user.id);
      const owns = purchases.some(p => p.courseId === activeCourse.id);
      unlocked = owns || user.role === 'admin' || user.role === 'super_admin';
    }
    setIsUnlocked(unlocked);

    // Save Modules and Lessons
    const courseModules = db.getModules(activeCourse.id);
    setModules(courseModules);

    const moduleIds = courseModules.map(m => m.id);
    const courseLessons = db.getLessons().filter(l => moduleIds.includes(l.moduleId));
    setLessons(courseLessons);

    if (courseLessons.length > 0) {
      setSelectedLesson(courseLessons[0]);
    }

    // Progress history checks
    if (user) {
      const userProgress = db.getProgress(user.id);
      setProgress(userProgress);
    }
  }, [id, navigate]);

  // Handle selected lesson transitions (reset quiz inputs)
  useEffect(() => {
    setSelectedOption(null);
    setQuizSubmitted(false);
    setQuizSuccess(false);
    setQuizError('');
  }, [selectedLesson]);

  const handleMarkComplete = (lessonId: string) => {
    if (!currentUser || !course) return;

    const isCurrentlyCompleted = progress.some(p => p.lessonId === lessonId && p.isCompleted);
    const nextState = !isCurrentlyCompleted;

    // Save progress updates cleanly to custom store database
    db.saveProgress(currentUser.id, lessonId, nextState);
    
    // Refresh states and check certificates triggering
    const updatedProg = db.getProgress(currentUser.id);
    setProgress(updatedProg);

    // Check if course is fully finished (100% completed)
    const courseModules = db.getModules(course.id).map(m => m.id);
    const courseLessons = db.getLessons().filter(l => courseModules.includes(l.moduleId));
    const completedCount = courseLessons.filter(cl => updatedProg.some(sp => sp.lessonId === cl.id && sp.isCompleted)).length;

    if (completedCount === courseLessons.length && courseLessons.length > 0) {
      // Re-fetch or generate certificates dynamically
      setTimeout(() => {
        const userCerts = db.getCertificates(currentUser.id);
        const certMatch = userCerts.find(c => c.courseId === course.id);
        if (certMatch) {
          setNewCertId(certMatch.verificationId);
          setShowCelebration(true);
        }
      }, 500);
    }
  };

  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOption === null || !selectedLesson) return;

    setQuizSubmitted(true);
    const quiz = getQuizForLesson(selectedLesson.title);

    if (selectedOption === quiz.correctIndex) {
      setQuizSuccess(true);
      setQuizError('');
      // Auto complete the lesson since they mastered the quiz!
      if (currentUser && !getLessonCompletionStatus(selectedLesson.id)) {
        handleMarkComplete(selectedLesson.id);
      }
    } else {
      setQuizSuccess(false);
      setQuizError(`Incorrect answer. Re-evaluate the concept explanation and challenge again!`);
    }
  };

  const getLessonCompletionStatus = (lessonId: string) => {
    return progress.some(p => p.lessonId === lessonId && p.isCompleted);
  };

  const completedLessonsCount = lessons.filter(l => getLessonCompletionStatus(l.id)).length;
  const courseCompletenessPercent = lessons.length > 0 
    ? Math.round((completedLessonsCount / lessons.length) * 100) 
    : 0;

  const currentQuiz = selectedLesson ? getQuizForLesson(selectedLesson.title) : null;

  return (
    <div className="pt-32 pb-16 min-h-screen bg-[#060813] text-white flex flex-col font-sans">
      
      {/* 1. Dynamic Graduation Celebration Modal Overhead */}
      <AnimatePresence>
        {showCelebration && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
              onClick={() => setShowCelebration(false)}
            />
            <motion.div 
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              className="glass-card max-w-md w-full p-8 rounded-3xl border border-brand-accent/40 text-center relative z-10"
            >
              <div className="w-20 h-20 rounded-full bg-brand-accent/20 flex items-center justify-center mx-auto mb-6 text-brand-accent border border-brand-accent/40 shadow-[0_0_20px_rgba(124,242,156,0.4)]">
                <Sparkles className="w-10 h-10 animate-pulse" />
              </div>
              <h3 className="font-display text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-brand-accent to-brand-secondary mb-3">Syllabus Mastered!</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                You have solved every micro-quiz and scored 100% on <strong className="text-white">"{course?.title}"</strong>. 
                Your professional analytics certificate has been generated and validated dynamically!
              </p>
              <div className="p-4 bg-white/5 border border-white/5 rounded-2xl mb-8 font-mono text-center">
                <span className="text-slate-500 text-[10px] uppercase block tracking-wider mb-1">SECURE VERIF HASH</span>
                <span className="text-lg font-bold text-brand-accent">{newCertId}</span>
              </div>
              <div className="flex flex-col gap-3">
                <Link 
                  to={`/certificates/${newCertId}`}
                  className="w-full py-4 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white font-bold text-sm shadow-lg transition-all"
                >
                  Retrieve Verified Certificate
                </Link>
                <button 
                  onClick={() => setShowCelebration(false)}
                  className="w-full py-3.5 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-colors text-xs uppercase tracking-wider font-semibold"
                >
                  Review Classroom Syllabus
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-6 w-full flex-1 flex flex-col">
        
        {/* Course Navigation Header Line */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <Link to="/courses" className="hover:text-white transition-colors flex items-center gap-1.5 font-semibold text-slate-300">
              <Compass className="w-4 h-4 text-brand-secondary" /> Courses Classroom
            </Link>
            <span>/</span>
            <span className="text-white font-medium max-w-sm truncate">{course?.title}</span>
          </div>
          
          {currentUser && (
            <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl">
              <div className="h-2 w-20 bg-black rounded-full overflow-hidden">
                <div className="h-full bg-brand-accent transition-all duration-500" style={{ width: `${courseCompletenessPercent}%` }} />
              </div>
              <span className="text-xs font-mono font-bold text-slate-200">{courseCompletenessPercent}% Syllabus Mastered</span>
            </div>
          )}
        </div>

        {/* Studio Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch flex-1">
          
          {/* Main Media Workspace (7 or 8 columns) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Player Workspace Container */}
            <div className={`glass-card border-white/5 rounded-3xl overflow-hidden shadow-2xl relative bg-brand-card/30 flex flex-col`}>
              
              <div className="aspect-video w-full bg-black flex items-center justify-center relative border-b border-white/5 overflow-hidden group">
                
                {/* Ant-Piracy Watermark on Full Streams */}
                {currentUser && isUnlocked && (
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none flex flex-wrap gap-12 p-8 justify-center items-center font-mono text-[9px]">
                    {Array(15).fill(`${currentUser.email} &bull; COMPLIANT_SECURE`).map((text, i) => (
                      <span key={i} className="transform rotate-[-12deg] select-none" dangerouslySetInnerHTML={{ __html: text }} />
                    ))}
                  </div>
                )}

                {/* Secure Stream Overhead Label */}
                <div className="absolute top-4 right-4 z-10 flex items-center gap-2 px-3 py-1.5 bg-black/70 border border-white/10 rounded-full text-xs font-semibold backdrop-blur-md">
                  <ShieldAlert className={`w-3.5 h-3.5 ${isUnlocked ? 'text-brand-accent animate-pulse' : 'text-amber-400'}`} />
                  <span className="text-[9px] tracking-widest uppercase font-mono text-white">
                    {isUnlocked ? "SECURE FULL STREAM ENCRYPTED" : "PREVIEW CONSTRAINTS ACTIVE"}
                  </span>
                </div>

                {/* Active Dynamic Screen Render */}
                {(!currentUser || !isUnlocked) ? (
                  /* GUEST OR LOCK OVERLAY SCREEN */
                  <div className="absolute inset-0 bg-gradient-to-b from-brand-card/20 to-slate-950/90 flex flex-col items-center justify-center p-6 text-center z-10">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-white mb-4 shadow-lg shadow-brand-primary/20 filter drop-shadow-[0_0_10px_rgba(108,92,231,0.2)]">
                      <Lock className="w-6 h-6 animate-pulse" />
                    </div>
                    <span className="text-brand-secondary text-[10px] font-mono tracking-widest uppercase mb-1.5 block">Course Enrollment Locked</span>
                    <h3 className="text-xl font-display font-black text-white max-w-sm">
                      {course?.title}
                    </h3>
                    <p className="text-xs text-slate-400 max-w-xs mt-2 leading-relaxed">
                      You are viewing our curriculum structure. Watch the introductory concepts preview or enroll to access the full workspace.
                    </p>
                    
                    <button 
                      onClick={() => {
                        if (!currentUser) navigate('/login');
                        else setIsPurchaseOpen(true);
                      }}
                      className="mt-6 px-6 py-3 bg-white text-brand-dark hover:bg-brand-secondary hover:text-brand-dark text-xs font-black uppercase tracking-wider rounded-xl transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md"
                    >
                      {!currentUser ? 'Sign In & Unlock Course' : 'Enroll & Unlock Full Access'}
                    </button>
                  </div>
                ) : selectedLesson ? (
                  /* FULLY UNLOCKED AND STREAMABLE LESSON */
                  <div className="text-center p-8 z-10 max-w-md">
                    <PlayCircle className="w-20 h-20 text-brand-secondary hover:text-brand-accent transition-all cursor-pointer hover:scale-110 active:scale-95 mx-auto mb-4 filter drop-shadow-[0_0_15px_rgba(0,210,255,0.4)]" />
                    <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase block mb-1">STAPLES STREAM PROTOCOL RUNNING</span>
                    <h4 className="font-display font-semibold text-lg text-white mb-1.5">{selectedLesson.title}</h4>
                    <p className="text-[11px] text-slate-400 font-mono">Length: {selectedLesson.duration} &bull; Stream Resolution 1080p</p>
                  </div>
                ) : (
                  <div className="text-center text-slate-500">
                    <Tv className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>Select a syllabus lesson from outline sidebar to initiate playback.</p>
                  </div>
                )}
              </div>

              {/* Lesson Metadata and Completeness toggles */}
              <div className="p-6 md:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pb-5 border-b border-white/5 mb-6">
                  <div>
                    <h2 className="font-display text-xl sm:text-2xl font-black text-white leading-tight">
                      {selectedLesson ? selectedLesson.title : "Introduction Module Intro"}
                    </h2>
                    <p className="text-slate-400 text-xs mt-1">
                      Part of Master track: {course?.title}
                    </p>
                  </div>

                  {currentUser && isUnlocked && selectedLesson && (
                    <button 
                      onClick={() => handleMarkComplete(selectedLesson.id)}
                      className={`px-5 py-2.5 rounded-xl border font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        getLessonCompletionStatus(selectedLesson.id) 
                          ? 'bg-emerald-500/15 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/25' 
                          : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
                      }`}
                    >
                      <CheckCircle className={`w-4 h-4 ${getLessonCompletionStatus(selectedLesson.id) ? 'fill-emerald-400/10' : ''}`} />
                      {getLessonCompletionStatus(selectedLesson.id) ? 'Mastered (Datalayer Locked)' : 'Mark Lesson Mastered'}
                    </button>
                  )}
                </div>

                <p className="text-slate-400 text-sm leading-relaxed">
                  In this master module, we cover professional-grade tracking mechanics. We dive deep into datalayer variables mapping, custom DNS bypass architectures, Meta deduplication rules, and setup diagnostics to bypass standard ad blocking. Fill out the corresponding quiz challenge below to test your understanding!
                </p>
              </div>

            </div>

            {/* 2. Interactive Under-Video Quiz Widget Card */}
            {selectedLesson && currentQuiz && (
              <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/5 bg-brand-card/20">
                <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-white/5">
                  <div className="w-8 h-8 rounded-lg bg-pink-500/15 border border-pink-500/25 flex items-center justify-center text-pink-400">
                    <HelpCircle className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-white">Interactive Concept Check</h3>
                    <p className="text-[10px] text-slate-500 font-mono tracking-wide uppercase">ANSWERS DYNAMICALLY MATCHED TO UNLOCK CERTIFICATES</p>
                  </div>
                </div>

                <form onSubmit={handleQuizSubmit} className="space-y-6">
                  <p className="text-sm font-semibold text-white leading-relaxed">
                    {currentQuiz.question}
                  </p>

                  <div className="space-y-2.5">
                    {currentQuiz.options.map((opt, oIdx) => {
                      const isSelected = selectedOption === oIdx;
                      let optionBgClass = "bg-white/[0.02] border-white/5 text-slate-300 hover:bg-white/[0.05]";
                      
                      if (isSelected) {
                        optionBgClass = "bg-brand-primary/10 border-brand-primary/30 text-white font-medium";
                      }
                      if (quizSubmitted) {
                        if (oIdx === currentQuiz.correctIndex) {
                          optionBgClass = "bg-emerald-500/15 border-emerald-500/35 text-emerald-400 font-medium";
                        } else if (isSelected) {
                          optionBgClass = "bg-red-500/15 border-red-500/35 text-red-400";
                        }
                      }

                      return (
                        <button
                          key={oIdx}
                          type="button"
                          disabled={quizSubmitted}
                          onClick={() => {
                            setSelectedOption(oIdx);
                            setQuizError('');
                          }}
                          className={`w-full text-left p-4 rounded-xl border text-xs transition-all flex items-center gap-3 cursor-pointer ${optionBgClass}`}
                        >
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center border shrink-0 text-[10px] font-mono ${
                            isSelected ? 'border-brand-primary text-brand-secondary bg-brand-primary/20' : 'border-slate-700'
                          }`}>
                            {String.fromCharCode(65 + oIdx)}
                          </div>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {quizError && (
                    <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/15 text-red-400 text-xs leading-relaxed flex items-start gap-2 animate-shake">
                      <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                      <span>{quizError}</span>
                    </div>
                  )}

                  {quizSubmitted && quizSuccess && (
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/15 text-emerald-300 text-xs leading-relaxed space-y-2">
                      <div className="flex items-center gap-2 font-bold text-emerald-400">
                        <CheckCircle className="w-5 h-5" />
                        <span>Concept Verified (Lesson Complete!)</span>
                      </div>
                      <p className="text-slate-300 text-xs">
                        {currentQuiz.explanation}
                      </p>
                    </div>
                  )}

                  {!quizSubmitted ? (
                    <button
                      type="submit"
                      disabled={selectedOption === null}
                      className="px-6 py-3 bg-white text-brand-dark hover:bg-brand-secondary hover:text-brand-dark rounded-xl font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
                    >
                      Verify Answer <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedOption(null);
                        setQuizSubmitted(false);
                        setQuizSuccess(false);
                        setQuizError('');
                      }}
                      className="px-6 py-3 bg-white/5 border border-white/5 hover:bg-white/10 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                    >
                      Try Again
                    </button>
                  )}
                </form>
              </div>
            )}

          </div>

          {/* Right Syllabus Sidebar Module Outline (4 columns) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Outline Card */}
            <div className="glass-card border-white/5 rounded-3xl bg-brand-card/25 overflow-hidden shadow-2xl flex flex-col justify-between h-fit">
              <div className="p-6 border-b border-white/5 bg-white/[0.02]">
                <h3 className="font-display font-bold text-lg text-white">Course Syllabus</h3>
                <p className="text-xs text-slate-400 mt-1">{modules.length} modules &bull; {lessons.length} deep lessons</p>
              </div>

              {/* Lesson buttons */}
              <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
                {modules.map((mod) => {
                  const modLessons = lessons.filter(l => l.moduleId === mod.id);
                  return (
                    <div key={mod.id} className="space-y-1.5">
                      <h4 className="text-[10px] uppercase font-mono tracking-widest font-extrabold text-slate-500 px-2 mt-2 leading-none">
                        {mod.title}
                      </h4>
                      
                      <div className="space-y-1">
                        {modLessons.map((l) => {
                          const isCurrent = selectedLesson?.id === l.id;
                          const complete = getLessonCompletionStatus(l.id);
                          return (
                            <button
                              key={l.id}
                              onClick={() => setSelectedLesson(l)}
                              className={`w-full flex items-start gap-3 p-3 text-left rounded-xl border transition-all ${
                                isCurrent
                                  ? 'bg-brand-primary/15 border-brand-primary/30 text-white'
                                  : 'border-transparent hover:bg-white/5 text-slate-300'
                              }`}
                            >
                              <div className={`mt-0.5 shrink-0 flex items-center justify-center w-4 h-4 rounded-full ${
                                complete ? 'text-[var(--color-brand-accent)]' : 'text-slate-600'
                              }`}>
                                <CheckCircle className={`w-4 h-4 ${complete ? 'fill-emerald-500/10' : ''}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="text-xs font-semibold block leading-tight break-words mb-1">{l.title}</span>
                                <span className="text-[10px] font-mono text-slate-500">{l.duration}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick action card for Locked users */}
            {(!currentUser || !isUnlocked) && (
              <div className="p-6 rounded-3xl glass border border-brand-primary/20 relative overflow-hidden bg-gradient-to-br from-brand-primary/10 to-transparent">
                <span className="text-[10px] text-brand-secondary font-mono tracking-wider uppercase block mb-1">PRO EDUCATION</span>
                <h4 className="text-sm font-bold text-white mb-1.5">Instant certification stream</h4>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Pass every matching lesson-quiz to automatically deploy verifiable PDF credentials for your resumes.
                </p>
                <div className="flex items-center gap-1 text-xs text-brand-secondary font-bold uppercase tracking-wider cursor-pointer" onClick={() => setIsPurchaseOpen(true)}>
                  Unlock Syllabus Pass <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* Enroll/Purchase modal integration */}
      {isPurchaseOpen && course && (
        <PurchaseModal 
          isOpen={true} 
          onClose={() => setIsPurchaseOpen(false)} 
          course={course} 
        />
      )}

    </div>
  );
}
