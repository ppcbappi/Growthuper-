import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Lock, PlayCircle, Star, Clock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import PurchaseModal from '../components/PurchaseModal';
import { db, Course } from '../lib/database';

export default function Courses() {
  const [filter, setFilter] = useState<'all' | 'unlocked'>('all');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [purchasedIds, setPurchasedIds] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = db.getSession();
    setCurrentUser(user);
    
    // Fetch courses from dynamic storage database
    const dbCourses = db.getCourses();
    setCourses(dbCourses);

    if (user) {
      const activePurchases = db.getPurchases(user.id);
      setPurchasedIds(activePurchases.map(p => p.courseId));
    } else {
      setPurchasedIds([]);
    }
  }, [filter]);

  const handleEnrollClick = (course: Course) => {
    if (!currentUser) {
      // Redirect to login if user tries to enroll without account
      navigate('/login');
      return;
    }
    setSelectedCourse(course);
  };

  // Determine unlocked state
  const isUnlocked = (courseId: string) => {
    // Admins and Super Admins automatically bypass lock or see all unlocked
    if (currentUser && (currentUser.role === 'admin' || currentUser.role === 'super_admin')) {
      return true;
    }
    return purchasedIds.includes(courseId);
  };

  const filteredCourses = courses.filter(course => {
    const status = isUnlocked(course.id);
    if (filter === 'unlocked') {
      return status;
    }
    return true;
  });

  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Premium <span className="text-gradient">Academy</span></h1>
          <p className="text-slate-400 max-w-xl">Elite training for data-driven founders. Learn our exact implementation systems.</p>
        </div>
        <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10 w-fit">
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'all' ? 'bg-brand-primary text-white' : 'text-slate-400 hover:text-white'}`}
          >
            All Courses
          </button>
          <button 
            onClick={() => setFilter('unlocked')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'unlocked' ? 'bg-brand-primary text-white' : 'text-slate-400 hover:text-white'}`}
          >
            My Library
          </button>
        </div>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="text-center py-20 px-6 rounded-3xl bg-white/5 border border-white/10 max-w-md mx-auto">
          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">No Courses Found</h3>
          <p className="text-sm text-slate-400">
            {filter === 'unlocked' 
              ? "You haven't unlocked any courses yet. Enroll in a course below to get started." 
              : "No courses are currently published."}
          </p>
          {filter === 'unlocked' && (
            <button 
              onClick={() => setFilter('all')}
              className="mt-6 px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-medium"
            >
              Browse All Courses
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course, i) => {
            const unlocked = isUnlocked(course.id);
            return (
              <motion.div 
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`glass-card rounded-3xl overflow-hidden flex flex-col group ${!unlocked ? 'opacity-90' : ''}`}
              >
                <div className="relative aspect-video overflow-hidden">
                  <img src={course.image} alt={course.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  {!unlocked && (
                    <div className="absolute inset-0 bg-black/65 backdrop-blur-xs flex items-center justify-center">
                       <div className="w-16 h-16 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white">
                         <Lock className="w-6 h-6 text-brand-secondary" />
                       </div>
                    </div>
                  )}
                  {unlocked && (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 rounded-full text-xs font-bold backdrop-blur-md">
                       UNLOCKED
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-4 text-xs font-medium text-slate-400 mb-4">
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {course.duration}</span>
                    <span className="flex items-center gap-1.5 text-yellow-400"><Star className="w-3.5 h-3.5 fill-current" /> {course.rating}</span>
                  </div>
                  <h3 className="font-display font-semibold text-xl mb-6 leading-tight text-white">{course.title}</h3>
                  
                  <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                    <span className="font-display font-bold text-lg text-brand-secondary">{course.price}</span>
                    {unlocked ? (
                      <Link to={`/courses/${course.id}`} className="flex items-center gap-2 text-brand-secondary hover:text-white transition-colors font-semibold text-sm">
                        Watch Now <PlayCircle className="w-5 h-5" />
                      </Link>
                    ) : (
                      <button 
                        onClick={() => handleEnrollClick(course)} 
                        className="px-5 py-2.5 bg-brand-primary text-white hover:bg-brand-primary/90 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                      >
                        Enroll Now
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {selectedCourse && (
        <PurchaseModal 
          isOpen={true} 
          onClose={() => setSelectedCourse(null)} 
          course={selectedCourse} 
        />
      )}
    </div>
  );
}
