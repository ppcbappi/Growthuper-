import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Award, 
  Receipt, 
  Settings, 
  CheckCircle, 
  Clock, 
  PlayCircle,
  ExternalLink,
  Phone,
  Coins,
  ShieldCheck,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { db, Course, Purchase, Certificate, Transaction, Lesson, LessonProgress } from '../lib/database';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'library' | 'certificates' | 'history' | 'profile'>('library');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [progress, setProgress] = useState<LessonProgress[]>([]);
  const navigate = useNavigate();

  // Load dynamic data based on active session
  useEffect(() => {
    const user = db.getSession();
    if (!user) {
      navigate('/login');
      return;
    }
    setCurrentUser(user);
    setCourses(db.getCourses());
    setPurchases(db.getPurchases(user.id));
    setCertificates(db.getCertificates(user.id));
    setTransactions(db.getTransactions().filter(t => t.userId === user.id));
    setProgress(db.getProgress(user.id));
  }, [navigate]);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-dark px-6">
        <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Calculate course metrics
  const getCourseProgressMetrics = (courseId: string) => {
    const ms = db.getModules(courseId).map(m => m.id);
    const courseLessons = db.getLessons().filter(l => ms.includes(l.moduleId));
    if (courseLessons.length === 0) return { percent: 0, completed: 0, total: 0 };

    const studentProg = progress.filter(p => courseLessons.some(cl => cl.id === p.lessonId));
    const completedCount = studentProg.filter(p => p.isCompleted).length;
    const percent = Math.round((completedCount / courseLessons.length) * 100);

    return { percent, completed: completedCount, total: courseLessons.length };
  };

  // Divide courses between 'In Progress' and 'Completed'
  const enrolledCourses = courses.filter(c => 
    purchases.some(p => p.courseId === c.id) || 
    currentUser.role === 'admin' || 
    currentUser.role === 'super_admin'
  );

  const completedCourses: Course[] = [];
  const activeCourses: Course[] = [];

  enrolledCourses.forEach(c => {
    const metrics = getCourseProgressMetrics(c.id);
    if (metrics.percent === 100) {
      completedCourses.push(c);
    } else {
      activeCourses.push(c);
    }
  });

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-6">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Navigation */}
        <div className="w-full lg:w-72 flex-shrink-0">
          <div className="glass-card rounded-3xl p-6 sticky top-28 border border-white/5 shadow-2xl">
            <div className="flex flex-col items-center text-center mb-8 pb-8 border-b border-white/5">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-brand-secondary to-brand-primary flex items-center justify-center text-2xl font-bold mb-4 shadow-[0_0_20px_rgba(0,210,255,0.3)] border-2 border-white/10 uppercase text-white">
                {currentUser.fullName.charAt(0)}
              </div>
              <h3 className="font-display font-semibold text-xl text-white">{currentUser.fullName}</h3>
              <p className="text-sm text-slate-400 font-mono mt-0.5">{currentUser.email}</p>
              
              <div className="mt-4 flex flex-col gap-1.5 items-center w-full">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-primary/15 text-brand-accent rounded-full text-xs font-semibold">
                  <CheckCircle className="w-3.5 h-3.5" /> 
                  {currentUser.role === 'student' ? 'Pro Student' : currentUser.role.toUpperCase()}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">ID: {currentUser.id}</span>
              </div>
            </div>
            
            <nav className="space-y-1.5">
              {[
                { id: "library", icon: BookOpen, label: "My Library" },
                { id: "certificates", icon: Award, label: "My Certificates", badge: certificates.length },
                { id: "history", icon: Receipt, label: "Payments History", badge: transactions.length },
                { id: "profile", icon: Settings, label: "Profile View" },
              ].map((item) => (
                <button 
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${activeTab === item.id ? 'bg-brand-primary text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="text-[10px] px-2 py-0.5 bg-brand-secondary/20 text-brand-secondary rounded-full font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Workspace Dashboard Content */}
        <div className="flex-1 space-y-8">
          
          {/* Quick Metrics Header Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <div className="glass-card p-5 rounded-2xl flex flex-col justify-between">
                <span className="text-slate-400 text-xs uppercase tracking-wider mb-2">My Courses</span>
                <span className="font-display text-3xl font-bold text-white">{enrolledCourses.length}</span>
             </div>
             <div className="glass-card p-5 rounded-2xl flex flex-col justify-between">
                <span className="text-slate-400 text-xs uppercase tracking-wider mb-2">Completed</span>
                <span className="font-display text-3xl font-bold text-emerald-400">{completedCourses.length}</span>
             </div>
             <div className="glass-card p-5 rounded-2xl flex flex-col justify-between">
                <span className="text-slate-400 text-xs uppercase tracking-wider mb-2">In Progress</span>
                <span className="font-display text-3xl font-bold text-brand-accent">{activeCourses.length}</span>
             </div>
             <div className="glass-card p-5 rounded-2xl flex flex-col justify-between">
                <span className="text-slate-400 text-xs uppercase tracking-wider mb-2">Certificates</span>
                <span className="font-display text-3xl font-bold text-white">{certificates.length}</span>
             </div>
          </div>

          {/* TAB 1: Library View */}
          {activeTab === 'library' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display font-bold text-2xl text-white">Continue Watching</h2>
                <Link to="/courses" className="text-xs text-brand-secondary hover:text-white transition-colors">Browse Marketplace &rarr;</Link>
              </div>

              {enrolledCourses.length === 0 ? (
                <div className="text-center py-16 px-6 bg-white/5 border border-white/10 rounded-3xl">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-6 h-6 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">No enrolled courses</h3>
                  <p className="text-sm text-slate-400 max-w-sm mx-auto mb-6">
                    Enroll inside the elite track to start digital tracking & conversion server mapping mastery.
                  </p>
                  <Link to="/courses" className="px-5 py-2.5 bg-brand-primary text-white rounded-xl text-xs font-bold uppercase tracking-wider">
                    Browse Courses
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {enrolledCourses.map((course) => {
                    const metrics = getCourseProgressMetrics(course.id);
                    const isCompleted = metrics.percent === 100;
                    return (
                      <motion.div 
                        key={course.id}
                        whileHover={{ y: -4 }}
                        className="glass p-1 border-white/10 rounded-3xl relative overflow-hidden group flex flex-col shadow-2xl"
                      >
                        <div className="aspect-video bg-black rounded-t-[20px] overflow-hidden relative">
                          <img src={course.image} alt={course.title} className="w-full h-full object-cover opacity-80" />
                          <div className="absolute inset-0 bg-gradient-to-t from-brand-card via-transparent to-transparent opacity-80" />
                        </div>
                        <div className="p-6 flex-1 bg-brand-card/90 rounded-b-[20px] flex flex-col">
                          <div className="flex items-center justify-between mb-3 text-xs font-medium">
                            <span className="text-slate-400">
                              {metrics.completed}/{metrics.total} Lessons Done
                            </span>
                            <span className="text-brand-accent">{metrics.percent}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-black rounded-full mb-4 overflow-hidden">
                            <div 
                              className="h-full bg-brand-accent rounded-full shadow-[0_0_10px_rgba(124,242,156,0.8)]" 
                              style={{ width: `${metrics.percent}%` }}
                            />
                          </div>
                          
                          <h4 className="font-display font-semibold text-lg mb-6 text-white leading-tight">{course.title}</h4>
                          
                          <div className="mt-auto pt-4 border-t border-white/5 flex items-center gap-3">
                            <Link 
                              to={`/courses/${course.id}`} 
                              className="flex-1 flex items-center justify-center gap-2 py-3 bg-brand-primary hover:bg-brand-primary/95 text-white font-semibold text-sm rounded-xl transition-all"
                            >
                              {isCompleted ? 'Review Materials' : 'Resume Lessons'} <PlayCircle className="w-4 h-4" />
                            </Link>
                            
                            {isCompleted && (
                              <button 
                                onClick={() => setActiveTab('certificates')}
                                className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all"
                                title="Certificate Unlocked"
                              >
                                <Award className="w-5 h-5 text-brand-secondary" />
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Certificates View */}
          {activeTab === 'certificates' && (
            <div className="space-y-6">
              <h2 className="font-display font-bold text-2xl text-white flex items-center gap-2">
                <Award className="w-6 h-6 text-brand-secondary" /> Academic Certifications
              </h2>

              {certificates.length === 0 ? (
                <div className="text-center py-16 px-6 bg-white/5 border border-white/10 rounded-3xl">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-6 h-6 text-slate-500" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">No certificates earned yet</h3>
                  <p className="text-sm text-slate-400 max-w-sm mx-auto">
                    Certificates are automatically generated and verify-locked once you complete 100% of the course modules. Keep learning!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {certificates.map((cert) => (
                    <div 
                      key={cert.id}
                      className="glass-card p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6"
                    >
                      <div className="flex gap-4 items-start">
                        <div className="p-3 bg-brand-secondary/10 border border-brand-secondary/30 rounded-xl text-brand-secondary">
                          <ShieldCheck className="w-8 h-8" />
                        </div>
                        <div>
                          <h4 className="font-display font-bold text-lg text-white">{cert.courseTitle}</h4>
                          <p className="text-xs text-slate-400 mt-1">Recipient: <strong className="text-white">{cert.userName}</strong> &bull; Issued {cert.issuedAt}</p>
                          <p className="text-xs text-brand-accent font-mono mt-1">Verification ID: {cert.verificationId}</p>
                        </div>
                      </div>
                      <Link 
                        to={`/certificates/${cert.verificationId}`}
                        className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/5 font-medium text-xs flex items-center justify-center gap-1.5 self-start md:self-auto"
                      >
                        View Verification <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Payment History */}
          {activeTab === 'history' && (
            <div className="space-y-6">
              <h2 className="font-display font-bold text-2xl text-white flex items-center gap-2">
                <Coins className="w-6 h-6 text-brand-primary" /> Bangladesh Manual Payments Log
              </h2>

              {transactions.length === 0 ? (
                <div className="text-center py-16 px-6 bg-white/5 border border-white/10 rounded-3xl">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Receipt className="w-6 h-6 text-slate-500" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">No transactions on record</h3>
                  <p className="text-sm text-slate-400 max-w-sm mx-auto">
                    Manual bkash / Nagad / Rocket transaction records will register here instantly for tracking.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-white/5">
                  <table className="w-full text-left border-collapse bg-white/5">
                    <thead>
                      <tr className="border-b border-white/10 text-[11px] font-bold text-slate-400 uppercase tracking-widest bg-white/5">
                        <th className="p-4">Track Code</th>
                        <th className="p-4">Course Package</th>
                        <th className="p-4">Channel</th>
                        <th className="p-4">Sender Phone</th>
                        <th className="p-4">Transaction ID</th>
                        <th className="p-4 text-right">Amount</th>
                        <th className="p-4 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm">
                      {transactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 font-mono text-xs text-slate-500">{tx.id}</td>
                          <td className="p-4 font-semibold text-white">{tx.courseTitle}</td>
                          <td className="p-4">
                            <span className="capitalize px-2 py-1 bg-white/5 rounded text-xs font-mono">{tx.method}</span>
                          </td>
                          <td className="p-4 font-mono text-xs text-slate-300">{tx.senderNumber}</td>
                          <td className="p-4 font-mono text-xs font-semibold text-amber-300 select-all">{tx.transactionId}</td>
                          <td className="p-4 text-right font-bold text-brand-accent">{tx.amount}</td>
                          <td className="p-4 text-center">
                            <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                              tx.status === 'verified' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' :
                              tx.status === 'rejected' ? 'bg-rose-500/15 text-rose-400 border border-rose-500/20' :
                              'bg-amber-500/15 text-amber-400 border border-amber-500/20 animate-pulse'
                            }`}>
                              {tx.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Profile Settings View */}
          {activeTab === 'profile' && (
            <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/5 space-y-6">
              <h2 className="font-display font-bold text-2xl text-white">Profile Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs text-slate-400 uppercase tracking-widest mb-1.5">User Full Name</label>
                  <div className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-slate-300 font-medium">
                    {currentUser.fullName}
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 uppercase tracking-widest mb-1.5">Registered Email</label>
                  <div className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-slate-300 font-mono">
                    {currentUser.email}
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 uppercase tracking-widest mb-1.5">Phone Number</label>
                  <div className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-slate-300 font-mono">
                    {currentUser.phone || "+8801XXXXXXXXX"}
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 uppercase tracking-widest mb-1.5">My Assigned Role</label>
                  <div className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-amber-400 capitalize font-bold">
                    {currentUser.role}
                  </div>
                </div>
              </div>
              
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-400 flex gap-2.5">
                <Clock className="w-4 h-4 text-brand-secondary flex-shrink-0" />
                <span>Account created on {new Date(currentUser.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}. Cookies/JWT credentials set inside local database registers.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
