import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, BarChart2, ShieldAlert, LogOut, User as UserIcon } from 'lucide-react';
import { cn } from '../lib/utils';
import { db, User } from '../lib/database';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [logoText, setLogoText] = useState("Growthuper");
  const location = useLocation();
  const navigate = useNavigate();

  // Load user session on mount and track page change
  useEffect(() => {
    setCurrentUser(db.getSession());
    const settings = db.getSettings();
    if (settings && settings.logoText) {
      setLogoText(settings.logoText);
    }
    
    // Custom polling & storage trigger to stay reactive
    const handleSessionUpdate = () => {
      setCurrentUser(db.getSession());
      const s = db.getSettings();
      if (s && s.logoText) {
        setLogoText(s.logoText);
      }
    };
    
    window.addEventListener('storage', handleSessionUpdate);
    const interval = setInterval(handleSessionUpdate, 1500);
    
    return () => {
      window.removeEventListener('storage', handleSessionUpdate);
      clearInterval(interval);
    };
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Courses', path: '/courses' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleLogout = () => {
    db.setSession(null);
    setCurrentUser(null);
    navigate('/');
  };

  const isAdminUser = currentUser && (currentUser.role === 'admin' || currentUser.role === 'super_admin');

  return (
    <header 
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b border-transparent",
        isScrolled ? "glass py-3" : "bg-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-secondary to-brand-primary flex items-center justify-center p-[1px]">
            <div className="w-full h-full bg-brand-dark rounded-[7px] flex items-center justify-center group-hover:bg-transparent transition-colors">
              <BarChart2 className="w-4 h-4 text-white" />
            </div>
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-brand-secondary transition-all">
            {logoText}
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              className={cn(
                "text-sm font-medium transition-colors hover:text-white",
                location.pathname === link.path ? "text-white" : "text-slate-400"
              )}
            >
              {link.name}
            </Link>
          ))}
          {currentUser && (
            <Link 
              to="/dashboard"
              className={cn(
                "text-sm font-medium transition-colors hover:text-white",
                location.pathname === '/dashboard' ? "text-white" : "text-slate-400"
              )}
            >
              My Dashboard
            </Link>
          )}
          {isAdminUser && (
            <Link 
              to="/admin"
              className="text-sm font-medium py-1 px-2.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-all flex items-center gap-1"
            >
              <ShieldAlert className="w-3.5 h-3.5" /> Admin Portal
            </Link>
          )}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          {currentUser ? (
            <div className="flex items-center gap-4">
              <span className="text-xs text-slate-400 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
                <UserIcon className="w-3 h-3 text-brand-secondary" />
                {currentUser.fullName} ({currentUser.role === 'super_admin' ? 'Super Admin' : currentUser.role})
              </span>
              <button 
                onClick={handleLogout}
                className="text-xs font-medium text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link to="/signup" className="px-5 py-2 text-sm font-medium rounded-full bg-white text-brand-dark hover:bg-brand-secondary hover:text-brand-darker transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                Register Free
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          {isMobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full glass border-t border-white/10 p-6 flex flex-col gap-4 md:hidden origin-top"
          >
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path}
                className={cn(
                  "text-lg font-medium p-2 rounded-lg",
                  location.pathname === link.path ? "bg-white/10 text-white" : "text-slate-400"
                )}
              >
                {link.name}
              </Link>
            ))}
            
            {currentUser && (
              <Link 
                to="/dashboard"
                className={cn(
                  "text-lg font-medium p-2 rounded-lg",
                  location.pathname === '/dashboard' ? "bg-white/10 text-white" : "text-slate-400"
                )}
              >
                My Dashboard
              </Link>
            )}

            {isAdminUser && (
              <Link 
                to="/admin"
                className="text-lg font-medium p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-2"
              >
                <ShieldAlert className="w-4 h-4" /> Admin Portal
              </Link>
            )}

            <hr className="border-white/10 my-2" />
            
            {currentUser ? (
              <div className="flex flex-col gap-3">
                <span className="text-sm text-slate-400 px-2">
                  Logged in as {currentUser.fullName}
                </span>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left font-medium p-2 text-red-400 hover:text-red-300 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link to="/login" className="text-lg font-medium p-2 text-slate-300">
                  Sign In
                </Link>
                <Link to="/signup" className="text-center px-5 py-3 text-sm font-medium rounded-xl bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-lg">
                  Submit Register
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
