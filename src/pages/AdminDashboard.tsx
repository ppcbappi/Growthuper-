import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  DollarSign, 
  BookOpen, 
  Plus, 
  Activity, 
  CreditCard, 
  Settings, 
  Shield, 
  CheckCircle, 
  X,
  Award,
  Trash2,
  Sliders,
  AlertTriangle,
  Lock,
  FileText,
  HelpCircle,
  MessageSquare,
  Sparkles,
  Share2,
  Tag,
  Briefcase,
  Layers,
  Edit
} from 'lucide-react';
import { 
  db, 
  Course, 
  Transaction, 
  User, 
  ContactMessage, 
  Certificate, 
  SiteSettings, 
  FAQ, 
  Testimonial, 
  ServiceCard, 
  PricingPlan, 
  Blog 
} from '../lib/database';

export default function AdminDashboard() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [flashMessage, setFlashMessage] = useState('');
  const navigate = useNavigate();

  // Relational Database Data States
  const [courses, setCourses] = useState<Course[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [services, setServices] = useState<ServiceCard[]>([]);
  const [pricing, setPricing] = useState<PricingPlan[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);

  // Form Editing Active IDs
  const [editingFAQId, setEditingFAQId] = useState<string | null>(null);
  const [editingTestimonialId, setEditingTestimonialId] = useState<string | null>(null);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editingPricingId, setEditingPricingId] = useState<string | null>(null);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);

  // Forms Draft States
  const [settingsForm, setSettingsForm] = useState<SiteSettings | null>(null);

  const [faqForm, setFaqForm] = useState({
    question: '',
    answer: ''
  });

  const [testimonialForm, setTestimonialForm] = useState({
    name: '',
    role: '',
    company: '',
    feedback: '',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150'
  });

  const [serviceForm, setServiceForm] = useState({
    title: '',
    description: '',
    iconName: 'Zap',
    featuresString: 'Enhanced tracking, Dedicated API pipelines'
  });

  const [pricingForm, setPricingForm] = useState({
    name: '',
    price: '$297',
    timeframe: 'per user',
    description: '',
    featuresString: 'Premium access, Code snippets download',
    popular: false,
    ctaText: 'Enroll'
  });

  const [blogForm, setBlogForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800&h=500',
    author: 'Founding Team'
  });

  const [newCourse, setNewCourse] = useState({
    title: '',
    slug: '',
    description: '',
    price: '$297',
    duration: '6 Hours',
    rating: '5.0',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800&h=500',
    featureString: 'Server GTM container configuration, Multi-funnel event streaming setup'
  });

  // Login Protection States
  const [gateEmail, setGateEmail] = useState('');
  const [gatePass, setGatePass] = useState('');
  const [gateError, setGateError] = useState('');

  // Feed everything from relational db on mount & tab transition
  useEffect(() => {
    const session = db.getSession();
    setCurrentUser(session);
    
    setCourses(db.getCourses());
    setTransactions(db.getTransactions());
    setUsers(db.getUsers());
    setMessages(db.getContactMessages());
    setCerts(db.getCertificates());
    
    const dbSettings = db.getSettings();
    setSettings(dbSettings);
    setSettingsForm(dbSettings);

    setFaqs(db.getFAQs());
    setTestimonials(db.getTestimonials());
    setServices(db.getServices());
    setPricing(db.getPricingPlans());
    setBlogs(db.getBlogs());
  }, [activeTab]);

  const triggerFlash = (msg: string) => {
    setFlashMessage(msg);
    setTimeout(() => {
      setFlashMessage('');
    }, 3500);
  };

  const isAdmin = currentUser && (currentUser.role === 'admin' || currentUser.role === 'super_admin');

  // Gate Admin Authentication
  const handleGateLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setGateError('');
    
    const res = db.login(gateEmail.trim(), gatePass);
    if (!res.success) {
      setGateError(res.error || 'Invalid admin credentials');
      return;
    }

    const matchedUser = res.user;
    if (matchedUser && (matchedUser.role === 'admin' || matchedUser.role === 'super_admin')) {
      setCurrentUser(matchedUser);
      triggerFlash("Administrative Session Granted. Welcome back chief!");
    } else {
      setGateError('Security Halt: Access denied for standard student profiles.');
      db.setSession(null);
    }
  };

  // Transaction verification Approval/Rejection Commands
  const handleVerdicts = (trxId: string, verdict: 'verified' | 'rejected') => {
    db.verifyPayment(trxId, verdict);
    setTransactions(db.getTransactions());
    triggerFlash(`Manual Transaction approved & verified! Course automatically unsealed.`);
  };

  // 1. Dynamic Settings Save
  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!settingsForm) return;
    db.saveSettings(settingsForm);
    setSettings(db.getSettings());
    triggerFlash("Branding guidelines & global settings updated across Growthuper platforms!");
  };

  // 2. Courses Publish CMS
  const handleAddCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourse.title.trim() || !newCourse.description.trim()) return;

    const feats = newCourse.featureString.split(',').map(f => f.trim()).filter(Boolean);
    const added = db.addCourse({
      title: newCourse.title,
      slug: newCourse.slug || newCourse.title.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, '-'),
      description: newCourse.description,
      price: newCourse.price,
      duration: newCourse.duration,
      rating: newCourse.rating,
      image: newCourse.image,
      features: feats
    });

    setCourses(db.getCourses());
    setNewCourse({
      title: '',
      slug: '',
      description: '',
      price: '$297',
      duration: '6 Hours',
      rating: '5.0',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800&h=500',
      featureString: 'Server GTM container configuration, Multi-funnel event streaming setup'
    });
    triggerFlash(`Interactive digital course "${added.title}" added to directory catalog.`);
    setActiveTab('Dashboard');
  };

  const handleDeleteCourse = (courseId: string, name: string) => {
    if (window.confirm(`Are you positive about discarding "${name}" course?`)) {
      db.deleteCourse(courseId);
      setCourses(db.getCourses());
      triggerFlash("Syllabus package permanently purged from records.");
    }
  };

  // 3. FAQ CMS Methods
  const handleFAQSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    db.saveFAQ({
      id: editingFAQId || undefined,
      question: faqForm.question,
      answer: faqForm.answer
    });
    setFaqs(db.getFAQs());
    setFaqForm({ question: '', answer: '' });
    setEditingFAQId(null);
    triggerFlash("Dynamic website Q&A registry synchronized.");
  };

  const handleEditFAQ = (item: FAQ) => {
    setEditingFAQId(item.id);
    setFaqForm({ question: item.question, answer: item.answer });
  };

  const handleDeleteFAQ = (id: string) => {
    db.deleteFAQ(id);
    setFaqs(db.getFAQs());
    triggerFlash("Accordion FAQ purged from database index.");
  };

  // 4. Testimonials CMS Methods
  const handleTestimonialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    db.saveTestimonial({
      id: editingTestimonialId || undefined,
      name: testimonialForm.name,
      role: testimonialForm.role,
      company: testimonialForm.company,
      feedback: testimonialForm.feedback,
      rating: testimonialForm.rating,
      image: testimonialForm.image
    });
    setTestimonials(db.getTestimonials());
    setTestimonialForm({
      name: '',
      role: '',
      company: '',
      feedback: '',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150'
    });
    setEditingTestimonialId(null);
    triggerFlash("Satisfied partner feedback saved to carousel databases.");
  };

  const handleEditTestimonial = (item: Testimonial) => {
    setEditingTestimonialId(item.id);
    setTestimonialForm({
      name: item.name,
      role: item.role,
      company: item.company,
      feedback: item.feedback,
      rating: item.rating,
      image: item.image
    });
  };

  const handleDeleteTestimonial = (id: string) => {
    db.deleteTestimonial(id);
    setTestimonials(db.getTestimonials());
    triggerFlash("Client endorsement deleted successfully.");
  };

  // 5. Services CMS Methods
  const handleServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    db.saveService({
      id: editingServiceId || undefined,
      title: serviceForm.title,
      description: serviceForm.description,
      iconName: serviceForm.iconName,
      features: serviceForm.featuresString.split(',').map(f => f.trim()).filter(Boolean)
    });
    setServices(db.getServices());
    setServiceForm({
      title: '',
      description: '',
      iconName: 'Zap',
      featuresString: 'Enhanced tracking, Dedicated API pipelines'
    });
    setEditingServiceId(null);
    triggerFlash("Analytics agency service card updated dynamically.");
  };

  const handleEditService = (item: ServiceCard) => {
    setEditingServiceId(item.id);
    setServiceForm({
      title: item.title,
      description: item.description,
      iconName: item.iconName,
      featuresString: item.features?.join(', ') || ''
    });
  };

  const handleDeleteService = (id: string) => {
    db.deleteService(id);
    setServices(db.getServices());
    triggerFlash("Service card deleted from landing blocks.");
  };

  // 6. Pricing Plans CMS Methods
  const handlePricingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    db.savePricingPlan({
      id: editingPricingId || undefined,
      name: pricingForm.name,
      price: pricingForm.price,
      timeframe: pricingForm.timeframe,
      description: pricingForm.description,
      features: pricingForm.featuresString.split(',').map(f => f.trim()).filter(Boolean),
      popular: pricingForm.popular,
      ctaText: pricingForm.ctaText
    });
    setPricing(db.getPricingPlans());
    setPricingForm({
      name: '',
      price: '$297',
      timeframe: 'per user',
      description: '',
      featuresString: 'Premium access, Code snippets download',
      popular: false,
      ctaText: 'Enroll'
    });
    setEditingPricingId(null);
    triggerFlash("Pricing Tier structure refreshed dynamically.");
  };

  const handleEditPricing = (item: PricingPlan) => {
    setEditingPricingId(item.id);
    setPricingForm({
      name: item.name,
      price: item.price,
      timeframe: item.timeframe,
      description: item.description,
      featuresString: item.features?.join(', ') || '',
      popular: item.popular,
      ctaText: item.ctaText
    });
  };

  const handleDeletePricing = (id: string) => {
    db.deletePricingPlan(id);
    setPricing(db.getPricingPlans());
    triggerFlash("Pricing tier removed.");
  };

  // 7. Blog Dispatch CMS Methods
  const handleBlogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    db.saveBlog({
      id: editingBlogId || undefined,
      title: blogForm.title,
      slug: blogForm.slug || blogForm.title.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, '-'),
      excerpt: blogForm.excerpt,
      content: blogForm.content,
      readTime: blogForm.readTime,
      image: blogForm.image,
      author: blogForm.author
    });
    setBlogs(db.getBlogs());
    setBlogForm({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800&h=500',
      author: 'Founding Team'
    });
    setEditingBlogId(null);
    triggerFlash("The Growthuper Dispatch publication updated.");
  };

  const handleEditBlog = (item: Blog) => {
    setEditingBlogId(item.id);
    setBlogForm({
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt,
      content: item.content,
      readTime: item.readTime,
      image: item.image,
      author: item.author
    });
  };

  const handleDeleteBlog = (id: string) => {
    db.deleteBlog(id);
    setBlogs(db.getBlogs());
    triggerFlash("Dispatch article deleted.");
  };

  // Role management
  const handleUpdateRole = (id: string, targetRole: any) => {
    db.updateUserRole(id, targetRole);
    setUsers(db.getUsers());
    triggerFlash(`User role permission modified to: ${targetRole.toUpperCase()}`);
  };

  const handleMarkRead = (id: string) => {
    db.markContactRead(id);
    setMessages(db.getContactMessages());
  };

  // Lock Gate Renderer Guard
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#060813] text-white flex items-center justify-center pt-24 px-6 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[-1]">
          <div className="absolute top-1/3 left-1/3 w-[50%] h-[50%] bg-red-600/10 blur-[150px] rounded-full" />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white/5 border border-white/10 p-8 sm:p-10 rounded-3xl backdrop-blur-md shadow-2xl relative"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-500/15 border border-red-500/30 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-display font-black text-white mb-2">Administrative Gateway</h1>
            <p className="text-xs text-slate-400 leading-relaxed uppercase tracking-widest font-mono">Growthuper Command Protection Port</p>
          </div>

          {gateError && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold leading-relaxed">
              {gateError}
            </div>
          )}

          <form onSubmit={handleGateLogin} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1.5 font-mono">Verified Email</label>
              <input 
                type="email" 
                required
                value={gateEmail}
                onChange={e => setGateEmail(e.target.value)}
                placeholder="e.g. admin@growthuper.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-red-500 text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1.5 font-mono">Password</label>
              <input 
                type="password" 
                required
                value={gatePass}
                onChange={e => setGatePass(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
              />
            </div>
            <button 
              type="submit"
              className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl transition-all shadow-lg flex items-center justify-center gap-1.5 cursor-pointer mt-6"
            >
              <Shield className="w-4 h-4" /> Decrypt command console
            </button>
          </form>

          <div className="mt-8 text-center text-xs text-slate-500 space-y-1">
            <p className="pt-3">
              <button onClick={() => navigate('/')} className="text-slate-400 hover:text-white underline">
                &larr; Return to main site
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  const verifiedTxns = transactions.filter(t => t.status === 'verified');
  const dynamicRevenue = verifiedTxns.reduce((sum, current) => {
    const parsedAmount = parseFloat(current.amount.replace(/[^0-9.]/g, ''));
    return sum + (isNaN(parsedAmount) ? 0 : parsedAmount);
  }, 0);

  const pendingTxnsCount = transactions.filter(t => t.status === 'pending').length;

  const stats = [
    { title: "Verifed Ledger Sales", value: `$${dynamicRevenue.toLocaleString()}`, icon: DollarSign, trend: `USD from ${verifiedTxns.length} approvals` },
    { title: "Courses Published", value: courses.length.toString(), icon: BookOpen, trend: "LMS Syllabus files" },
    { title: "Blogs Indexed", value: blogs.length.toString(), icon: FileText, trend: "Articles dispatch count" },
    { title: "Manual txns verification queue", value: pendingTxnsCount.toString(), icon: CreditCard, trend: `${pendingTxnsCount} Pending manual receipts`, alert: pendingTxnsCount > 0 },
  ];

  return (
    <div className="pt-24 pb-0 min-h-screen bg-[#070913] flex flex-col md:flex-row text-white font-sans">
      
      {/* 1. Sticky WordPress Dynamic sidebar navigation */}
      <div className="w-full md:w-72 border-r border-white/5 bg-[#0a0d1d] h-auto md:min-h-screen sticky top-0 z-10 md:pt-4 flex flex-col justify-between">
        <div className="overflow-y-auto max-h-[85vh] py-2">
          <div className="p-6 border-b border-white/5">
            <div className="flex items-center gap-2 mb-1">
               <Shield className="w-5 h-5 text-emerald-400 animate-pulse" />
               <span className="font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-[#00D2FF] tracking-tight text-lg">Growthuper CMS</span>
            </div>
            <p className="text-xs text-slate-500 font-mono select-none">WordPress-Style Command Hub</p>
          </div>
          
          <nav className="p-4 space-y-1">
            {[
              { id: "Dashboard", icon: Activity, badge: 0 },
              { id: "Pending Payments", icon: CreditCard, badge: pendingTxnsCount },
              { id: "Global Custom settings", icon: Sliders, badge: 0 },
              { id: "Manage Services", icon: Layers, badge: 0 },
              { id: "Manage Courses", icon: BookOpen, badge: 0 },
              { id: "Manage Blogs", icon: FileText, badge: 0 },
              { id: "Manage FAQs", icon: HelpCircle, badge: 0 },
              { id: "Manage Testimonials", icon: Sparkles, badge: 0 },
              { id: "Manage Users", icon: Users, badge: 0 },
              { id: "Contact Forms", icon: MessageSquare, badge: messages.filter(m => !m.isRead).length },
              { id: "Awarded Certificates", icon: Award, badge: certs.length }
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${activeTab === tab.id ? 'bg-emerald-500 text-brand-dark shadow-lg shadow-emerald-500/10' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
              >
                <div className="flex items-center gap-2.5">
                  <tab.icon className="w-4 h-4 shrink-0" />
                  <span>{tab.id === 'Awarded Certificates' ? 'Licenses' : tab.id}</span>
                </div>
                {tab.badge > 0 && (
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-brand-dark text-emerald-300' : 'bg-red-500/25 text-red-400 animate-pulse'}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6 border-t border-white/5 text-center bg-black/20">
          <button 
            onClick={() => { db.setSession(null); setCurrentUser(null); }}
            className="text-xs text-red-400 hover:text-red-300 transition-colors font-mono cursor-pointer"
          >
            Log Out Command &rarr;
          </button>
        </div>
      </div>

      {/* 2. CMS Flash status notifications indicator */}
      <AnimatePresence>
        {flashMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-6 right-6 z-50 p-4 border border-emerald-500/30 bg-[#0d2217] text-emerald-400 font-bold text-xs uppercase tracking-wider rounded-2xl shadow-xl flex items-center gap-3.5"
          >
            <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span>{flashMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Dynamic Command Workspace */}
      <div className="flex-1 p-6 lg:p-10 bg-[#04060e] overflow-y-auto max-h-screen">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10 pb-6 border-b border-white/5">
          <div>
            <span className="text-emerald-400 text-xs font-mono tracking-widest uppercase block mb-1">GROWTHUPER DYNAMIC INFRASTRUCTURE</span>
            <h1 className="font-display text-4xl font-extrabold tracking-tight">{activeTab}</h1>
          </div>
          {activeTab === 'Manage Courses' && (
            <button 
              onClick={() => setActiveTab('Create Course')}
               className="flex items-center gap-2 px-5 py-3 bg-emerald-500 text-brand-dark rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-emerald-400 transition-all shadow-lg cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Create Course Package
            </button>
          )}
        </div>

        {/* TAB 1: Dashboard metrics and overall state */}
        {activeTab === 'Dashboard' && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`glass p-6 rounded-3xl border ${stat.alert ? 'border-red-500/30 bg-red-500/5' : 'border-white/5 bg-white/5'}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.alert ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-white/5 text-emerald-400'}`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-display font-black tracking-tight mb-1 text-white">{stat.value}</h3>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold">{stat.title}</p>
                  <p className="text-[11px] text-emerald-500 font-mono mt-2">{stat.trend}</p>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
               <div className="xl:col-span-2 glass-card rounded-3xl border-white/5 overflow-hidden">
                 <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black/20">
                    <div className="flex items-center gap-3">
                      <Activity className="w-5 h-5 text-emerald-400" />
                      <h2 className="font-display font-bold text-lg">Active Relational Database Schema Status</h2>
                    </div>
                 </div>
                 <div className="p-6 text-sm text-slate-400 space-y-4">
                   <p>Growthuper utilizes a synchronized, schema-enforced relational system. This ensures absolute safety, proper data-typing structures, and easy export protocols.</p>
                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs pt-2">
                     <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                       <h5 className="font-bold text-white mb-1">CORE RELATION TABLES</h5>
                       <ul className="space-y-1 text-slate-500 text-[11px]">
                         <li>&bull; sys_site_settings</li>
                         <li>&bull; usr_user_profiles</li>
                         <li>&bull; lms_course_packages</li>
                         <li>&bull; lms_lesson_progress</li>
                         <li>&bull; mrc_manual_payments</li>
                       </ul>
                     </div>
                     <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                       <h5 className="font-bold text-white mb-1">CMS DESIGN TABLES</h5>
                       <ul className="space-y-1 text-slate-500 text-[11px]">
                         <li>&bull; cms_service_cards</li>
                         <li>&bull; cms_pricing_plans</li>
                         <li>&bull; cms_dispatches_blogs</li>
                         <li>&bull; cms_faq_accordions</li>
                         <li>&bull; cms_testimonials</li>
                       </ul>
                     </div>
                     <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                       <h5 className="font-bold text-white mb-1">LICENSING TABLES</h5>
                       <ul className="space-y-1 text-slate-500 text-[11px]">
                         <li>&bull; cert_academics_ledger</li>
                         <li>&bull; sys_contact_submissions</li>
                       </ul>
                     </div>
                   </div>
                 </div>
               </div>

               <div className="glass-card rounded-3xl border-white/10 p-6 flex flex-col justify-between bg-brand-card/25">
                 <div>
                   <h2 className="font-display font-bold text-lg mb-4 flex items-center gap-2"><Sliders className="w-5 h-5 text-brand-secondary" /> CMS System Integrity</h2>
                   <div className="space-y-4">
                      <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl flex items-center justify-between">
                         <span className="text-[10px] uppercase text-slate-500 tracking-wider">Dynamic SEO Hooks</span>
                         <span className="text-[10px] text-emerald-400 font-bold bg-emerald-400/10 px-2 py-0.5 rounded font-mono">ENABLED</span>
                      </div>
                      <div className="p-3 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between">
                         <span className="text-[10px] uppercase text-slate-500 tracking-wider">LMS Engine Checks</span>
                         <span className="text-[10px] text-brand-secondary font-bold bg-brand-secondary/10 px-2 py-0.5 rounded font-mono">SECURE</span>
                      </div>
                      <div className="p-3 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between">
                         <span className="text-[10px] uppercase text-slate-500 tracking-wider">Manual bKash Gate</span>
                         <span className="text-[10px] text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded font-mono">ACTIVE</span>
                      </div>
                   </div>
                 </div>
                 <p className="text-[11px] text-slate-500 mt-6 leading-relaxed">Changes implemented through this platform immediately alter the client interface, completing visual CMS goals.</p>
               </div>
            </div>
          </div>
        )}

        {/* TAB 2: Pending manual validations */}
        {activeTab === 'Pending Payments' && (
          <div className="glass-card rounded-3xl border-white/5 overflow-hidden shadow-2xl">
             <div className="p-6 border-b border-white/10 bg-white/[0.01]">
                <h3 className="font-display font-bold text-lg">Manual Payment Validations Log</h3>
                <p className="text-xs text-slate-400 mt-1">Verify payment details submitted under phone number +8801336339475.</p>
             </div>
             
             {transactions.length === 0 ? (
               <div className="p-12 text-center text-slate-500 font-mono text-sm">
                 No transactions registered under merchant accounts currently.
               </div>
             ) : (
               <div className="overflow-x-auto">
                 <table className="w-full text-left text-xs whitespace-nowrap">
                    <thead className="bg-[#0b0c16] text-slate-400 font-mono text-[10px] uppercase tracking-wider">
                      <tr>
                        <th className="p-4">Student Profile</th>
                        <th className="p-4">Payment Method</th>
                        <th className="p-4 text-center">Sender phone</th>
                        <th className="p-4">Transaction ID (TrxID)</th>
                        <th className="p-4">Applied Syllabus Package</th>
                        <th className="p-4 text-right">Receipt Status</th>
                        <th className="p-4 text-right">Approval Decisions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 bg-brand-card/50">
                      {transactions.map((row) => (
                        <tr key={row.id} className="hover:bg-white/5 transition-all">
                          <td className="p-4">
                            <div className="font-bold text-white text-xs">{row.userEmail}</div>
                            <div className="text-[10px] text-slate-500 mt-0.5 font-mono">UID: {row.userId}</div>
                          </td>
                          <td className="p-4">
                            <span className="capitalize px-2 py-1 bg-[#ff007f]/10 text-brand-secondary font-semibold font-mono border border-brand-secondary/15 rounded text-[10px]">
                              {row.method}
                            </span>
                          </td>
                          <td className="p-4 font-mono text-slate-300 text-center">{row.senderNumber}</td>
                          <td className="p-4 font-mono text-amber-300 text-xs select-all font-bold">{row.transactionId}</td>
                          <td className="p-4">
                            <div className="font-semibold text-white">{row.courseTitle}</div>
                            <div className="text-[10px] text-emerald-400 font-mono mt-0.5">{row.amount}</div>
                          </td>
                          <td className="p-4 text-right font-mono text-xs">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest ${
                              row.status === 'verified' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/35' : 
                              row.status === 'pending' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/35 animate-pulse' : 
                              'bg-red-500/20 text-red-400 border border-red-500/35'
                            }`}>
                              {row.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            {row.status === 'pending' ? (
                              <div className="flex items-center justify-end gap-2 text-[10px]">
                                 <button 
                                   onClick={() => handleVerdicts(row.id, 'verified')}
                                   className="p-1 px-3 bg-emerald-500 text-brand-dark rounded-xl font-bold uppercase tracking-wider hover:bg-emerald-400 transition-all cursor-pointer flex items-center gap-1"
                                 >
                                   Approve
                                 </button>
                                 <button 
                                   onClick={() => handleVerdicts(row.id, 'rejected')}
                                   className="p-1 px-3 bg-red-500 text-white rounded-xl font-bold uppercase tracking-wider hover:bg-red-600 transition-colors cursor-pointer"
                                 >
                                   Reject
                                 </button>
                              </div>
                            ) : (
                              <span className="text-slate-600 font-mono text-[9px]">Processed</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                 </table>
               </div>
             )}
          </div>
        )}

        {/* TAB 3: Global WP-style CMS settings */}
        {activeTab === 'Global Custom settings' && settingsForm && (
          <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/5 bg-brand-card/90 max-w-4xl shadow-2xl">
            <h3 className="font-display font-extrabold text-2xl text-white mb-2">WordPress-Style Global CMS Properties</h3>
            <p className="text-xs text-slate-400 mb-8">Change website hero blocks, texts, buttons, and SEO tags dynamically without code.</p>
            
            <form onSubmit={handleSettingsSubmit} className="space-y-6">
              
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <h4 className="font-bold text-sm text-brand-secondary mb-4 uppercase tracking-wider font-mono">1. Header Branding & Contact Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 uppercase tracking-widest mb-1">Company logo text</label>
                    <input 
                      type="text" 
                      value={settingsForm.logoText} 
                      onChange={e => setSettingsForm({...settingsForm, logoText: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 uppercase tracking-widest mb-1">Contact Email</label>
                    <input 
                      type="text" 
                      value={settingsForm.contactEmail} 
                      onChange={e => setSettingsForm({...settingsForm, contactEmail: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 uppercase tracking-widest mb-1">Contact Phone</label>
                    <input 
                      type="text" 
                      value={settingsForm.contactPhone || ''} 
                      onChange={e => setSettingsForm({...settingsForm, contactPhone: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 uppercase tracking-widest mb-1">WhatsApp Direct Link</label>
                    <input 
                      type="text" 
                      value={settingsForm.whatsappLink || ''} 
                      onChange={e => setSettingsForm({...settingsForm, whatsappLink: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <h4 className="font-bold text-sm text-brand-secondary mb-4 uppercase tracking-wider font-mono">2. Dynamic Homepage Hero Area</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-slate-400 uppercase tracking-widest mb-1">Hero badge label</label>
                    <input 
                      type="text" 
                      value={settingsForm.heroBadge} 
                      onChange={e => setSettingsForm({...settingsForm, heroBadge: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 uppercase tracking-widest mb-1">Hero Title Heading</label>
                    <input 
                      type="text" 
                      value={settingsForm.heroTitle} 
                      onChange={e => setSettingsForm({...settingsForm, heroTitle: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 uppercase tracking-widest mb-1">Hero Subtitle Text Description</label>
                    <textarea 
                      rows={3}
                      value={settingsForm.heroSubtitle} 
                      onChange={e => setSettingsForm({...settingsForm, heroSubtitle: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 uppercase tracking-widest mb-1">Primary CTA Button text</label>
                      <input 
                        type="text" 
                        value={settingsForm.primaryCtaText} 
                        onChange={e => setSettingsForm({...settingsForm, primaryCtaText: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 uppercase tracking-widest mb-1">Secondary CTA Button text</label>
                      <input 
                        type="text" 
                        value={settingsForm.secondaryCtaText} 
                        onChange={e => setSettingsForm({...settingsForm, secondaryCtaText: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <h4 className="font-bold text-sm text-brand-secondary mb-4 uppercase tracking-wider font-mono">3. SEO Settings Tags & Footer text</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 uppercase tracking-widest mb-1">SEO Homepage Page Title</label>
                      <input 
                        type="text" 
                        value={settingsForm.seoTitle || ''} 
                        onChange={e => setSettingsForm({...settingsForm, seoTitle: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 uppercase tracking-widest mb-1">SEO Page Description</label>
                      <input 
                        type="text" 
                        value={settingsForm.seoDescription || ''} 
                        onChange={e => setSettingsForm({...settingsForm, seoDescription: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 uppercase tracking-widest mb-1">Copyright footer text</label>
                    <input 
                      type="text" 
                      value={settingsForm.footerText || ''} 
                      onChange={e => setSettingsForm({...settingsForm, footerText: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-brand-dark font-extrabold uppercase tracking-widest text-xs rounded-xl transition-all shadow-lg"
              >
                Sync Dynamic CMS Website Settings
              </button>
            </form>
          </div>
        )}

        {/* TAB 4: Manage Service Cards CMS */}
        {activeTab === 'Manage Services' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 glass-card p-6 rounded-3xl border border-white/5 bg-brand-card/90">
              <h3 className="font-display font-bold text-xl text-white mb-4">
                {editingServiceId ? 'Edit Service Details' : 'Add Dynamic Service Card'}
              </h3>
              <form onSubmit={handleServiceSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-400 uppercase tracking-widest mb-1">Service Title Heading</label>
                  <input 
                    type="text" 
                    required
                    value={serviceForm.title} 
                    onChange={e => setServiceForm({...serviceForm, title: e.target.value})}
                    placeholder="e.g. Server Side CAPI Hook"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 uppercase tracking-widest mb-1">Service brief description text</label>
                  <textarea 
                    rows={3}
                    required
                    value={serviceForm.description} 
                    onChange={e => setServiceForm({...serviceForm, description: e.target.value})}
                    placeholder="e.g. Evade standard browser cookie blocklists..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 uppercase tracking-widest mb-1">Lucide Icon Class representation</label>
                  <select 
                    value={serviceForm.iconName} 
                    onChange={e => setServiceForm({...serviceForm, iconName: e.target.value})}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none"
                  >
                    <option value="BarChart3">BarChart3 (GA4/Numbers)</option>
                    <option value="Zap">Zap (Lightning/Server)</option>
                    <option value="Target">Target (Meta Ads/CAPI)</option>
                    <option value="Shield">Shield (Shopify Liquid/DataLayer)</option>
                    <option value="Lock">Lock (Privacy Compliant)</option>
                    <option value="Settings">Settings (GTM setup)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 uppercase tracking-widest mb-1">Features points list (separated by commas)</label>
                  <input 
                    type="text" 
                    required
                    value={serviceForm.featuresString} 
                    onChange={e => setServiceForm({...serviceForm, featuresString: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white text-xs focus:outline-none font-mono"
                  />
                </div>

                <div className="flex gap-2.5 pt-4">
                  {editingServiceId && (
                    <button 
                      type="button" 
                      onClick={() => {
                        setEditingServiceId(null);
                        setServiceForm({ title: '', description: '', iconName: 'Zap', featuresString: '' });
                      }}
                      className="px-4 py-2 bg-white/5 rounded-xl text-xs uppercase text-slate-400"
                    >
                      Clear
                    </button>
                  )}
                  <button 
                    type="submit" 
                    className="flex-1 py-3 bg-emerald-500 text-brand-dark rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-emerald-400 transition-all cursor-pointer"
                  >
                    {editingServiceId ? 'Apply Updates' : 'Publish Dynamic Service card'}
                  </button>
                </div>
              </form>
            </div>

            <div className="lg:col-span-12 xl:col-span-7 space-y-4">
              <h4 className="font-display font-bold text-lg text-white mb-2">Service Library list</h4>
              {services.length === 0 ? (
                <div className="p-8 text-center text-slate-500">No custom service offerings defined yet.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map(svc => (
                    <div key={svc.id} className="p-5 rounded-2xl border border-white/5 bg-white/[0.02] flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] text-brand-secondary font-mono bg-white/5 p-1 px-2 rounded-md">{svc.iconName} icon</span>
                        <h4 className="font-bold text-sm text-white mt-2 mb-1">{svc.title}</h4>
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{svc.description}</p>
                      </div>

                      <div className="flex justify-between items-center text-[10px] font-mono border-t border-white/5 pt-3 mt-4">
                        <span className="text-slate-500">{svc.features?.length || 0} features set</span>
                        <div className="flex gap-3">
                          <button 
                            onClick={() => handleEditService(svc)} 
                            className="text-brand-secondary hover:underline cursor-pointer flex items-center gap-1 font-bold"
                          >
                            <Edit className="w-3 h-3" /> Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteService(svc.id)} 
                            className="text-red-400 hover:underline cursor-pointer flex items-center gap-1"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: Course Syllabus Packages */}
        {activeTab === 'Manage Courses' && (
          <div className="space-y-6">
            <h3 className="font-display font-medium text-lg text-white">Interactive Syllabus Marketplace Packages</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map((c) => (
                <div key={c.id} className="glass border border-white/5 rounded-2xl p-6 flex flex-col justify-between shadow-2xl">
                  <div>
                    <img src={c.image} className="w-full h-36 object-cover rounded-xl mb-4 border border-white/5" alt="Banner" />
                    <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase bg-emerald-500/10 border border-emerald-500/15 px-2 py-0.5 rounded-md">{c.price}</span>
                    <h4 className="font-display font-bold text-lg text-white mt-1.5 mb-2 leading-snug">{c.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-3">{c.description}</p>
                  </div>
                  <div className="flex justify-between items-center text-xs font-semibold pt-4 border-t border-white/5">
                    <span className="text-slate-500 font-mono">Length: {c.duration}</span>
                    <button 
                      onClick={() => handleDeleteCourse(c.id, c.title)}
                      className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" /> Delete syllabus package
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW: Creating custom Course Packages */}
        {activeTab === 'Create Course' && (
          <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/5 bg-brand-card/90 max-w-2xl shadow-2xl">
            <h3 className="font-display font-extrabold text-2xl text-white mb-6">Create New Course Package</h3>
            <form onSubmit={handleAddCourseSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 uppercase tracking-widest mb-1.5">Course package title</label>
                  <input 
                    type="text" 
                    required
                    value={newCourse.title}
                    onChange={e => setNewCourse({...newCourse, title: e.target.value})}
                    placeholder="e.g. Meta Conversions Mastery"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 uppercase tracking-widest mb-1.5">Slug identifier</label>
                  <input 
                    type="text" 
                    value={newCourse.slug}
                    onChange={e => setNewCourse({...newCourse, slug: e.target.value})}
                    placeholder="e.g. meta-capi-mastery"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 uppercase tracking-widest mb-1.5">Description Abstract Scope</label>
                <textarea 
                  rows={3}
                  required
                  value={newCourse.description}
                  onChange={e => setNewCourse({...newCourse, description: e.target.value})}
                  placeholder="Insert detailed syllabus parameters..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                <div>
                  <label className="block text-xs text-slate-400 uppercase tracking-widest mb-1.5">Price Amount</label>
                  <input 
                    type="text" 
                    required
                    value={newCourse.price}
                    onChange={e => setNewCourse({...newCourse, price: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 uppercase tracking-widest mb-1.5">Syllabus duration</label>
                  <input 
                    type="text" 
                    required
                    value={newCourse.duration}
                    onChange={e => setNewCourse({...newCourse, duration: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 uppercase tracking-widest mb-1.5">Audits score rating</label>
                  <input 
                    type="text" 
                    required
                    value={newCourse.rating}
                    onChange={e => setNewCourse({...newCourse, rating: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 uppercase tracking-widest mb-1.5">Banner Image URL</label>
                <input 
                  type="text" 
                  value={newCourse.image}
                  onChange={e => setNewCourse({...newCourse, image: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-xs text-slate-300 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 uppercase tracking-widest mb-1.5">Curriculum bullet list features (separated by commas)</label>
                <input 
                  type="text" 
                  required
                  value={newCourse.featureString}
                  onChange={e => setNewCourse({...newCourse, featureString: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-slate-300 text-xs focus:outline-none"
                />
              </div>

              <div className="flex gap-4 pt-10">
                <button 
                  type="button" 
                  onClick={() => setActiveTab('Manage Courses')}
                  className="px-6 py-3 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-colors text-xs font-bold uppercase cursor-pointer animate-pulse"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-8 py-3 bg-emerald-500 text-brand-dark hover:bg-emerald-400 rounded-xl text-xs font-bold uppercase transition-all shadow-lg cursor-pointer"
                >
                  Confirm & Publish Package
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 6: Manage Blogs dispatch publication */}
        {activeTab === 'Manage Blogs' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 glass-card p-6 rounded-3xl border border-white/5 bg-brand-card/90">
              <h3 className="font-display font-bold text-xl text-white mb-4">
                {editingBlogId ? 'Modify Blog dispatch' : 'Publish Blog dispatch piece'}
              </h3>
              <form onSubmit={handleBlogSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-400 uppercase tracking-widest mb-1">Article title</label>
                  <input 
                    type="text" 
                    required
                    value={blogForm.title} 
                    onChange={e => setBlogForm({...blogForm, title: e.target.value})}
                    placeholder="e.g. Deduplicating Server events"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 uppercase tracking-widest mb-1">Slug (optional auto-filled)</label>
                  <input 
                    type="text" 
                    value={blogForm.slug} 
                    onChange={e => setBlogForm({...blogForm, slug: e.target.value})}
                    placeholder="e.g. deduplicating-server-events"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 uppercase tracking-widest mb-1">Excerpt brief description</label>
                  <textarea 
                    rows={2}
                    required
                    value={blogForm.excerpt} 
                    onChange={e => setBlogForm({...blogForm, excerpt: e.target.value})}
                    placeholder="Short line to display in preview grid..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 uppercase tracking-widest mb-1">Full Article text markdown body</label>
                  <textarea 
                    rows={6}
                    required
                    value={blogForm.content} 
                    onChange={e => setBlogForm({...blogForm, content: e.target.value})}
                    placeholder="Describe technical implementation insights..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white text-xs focus:outline-none resize-y"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 uppercase tracking-widest mb-1">Read length duration</label>
                    <input 
                      type="text" 
                      value={blogForm.readTime} 
                      onChange={e => setBlogForm({...blogForm, readTime: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 uppercase tracking-widest mb-1">Author name</label>
                    <input 
                      type="text" 
                      value={blogForm.author} 
                      onChange={e => setBlogForm({...blogForm, author: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  {editingBlogId && (
                    <button 
                      type="button" 
                      onClick={() => {
                        setEditingBlogId(null);
                        setBlogForm({ title: '', slug: '', excerpt: '', content: '', readTime: '5 min read', image: '', author: 'Founding Team' });
                      }}
                      className="px-4 py-2 bg-white/5 rounded-xl text-xs uppercase"
                    >
                      Cancel
                    </button>
                  )}
                  <button 
                    type="submit" 
                    className="flex-1 py-3 bg-emerald-500 text-brand-dark rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-emerald-400 transition-all cursor-pointer"
                  >
                    {editingBlogId ? 'Save Edits' : 'Publish Blog dispatch'}
                  </button>
                </div>
              </form>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <h4 className="font-display font-medium text-lg text-white">Dynamic Dispatches Library</h4>
              {blogs.length === 0 ? (
                <div className="p-8 text-center text-slate-500">No blog articles are published currently.</div>
              ) : (
                <div className="space-y-4">
                  {blogs.map(post => (
                    <div key={post.id} className="p-5 rounded-2xl border border-white/5 bg-white/[0.01] flex items-start justify-between gap-4">
                      <div>
                        <h4 className="font-bold text-base text-white">{post.title}</h4>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                        <div className="flex items-center gap-3 text-[10px] text-slate-500 font-mono mt-3">
                          <span>By: {post.author}</span>
                          <span>&bull;</span>
                          <span>{post.readTime}</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 shrink-0">
                        <button 
                          onClick={() => handleEditBlog(post)}
                          className="px-3 py-1 bg-brand-secondary/15 text-brand-secondary text-[10px] font-bold uppercase tracking-wider rounded border border-brand-secondary/20 cursor-pointer"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteBlog(post.id)}
                          className="px-3 py-1 bg-red-500/10 text-red-400 hover:bg-red-500/20 text-[10px] font-bold uppercase tracking-wider rounded border border-red-500/20 cursor-pointer"
                        >
                          Purge
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 7: FAQ builder index */}
        {activeTab === 'Manage FAQs' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 glass-card p-6 rounded-3xl border border-white/5 bg-brand-card/90">
              <h3 className="font-display font-bold text-xl text-white mb-4">
                {editingFAQId ? 'Edit FAQ Item' : 'Add FAQ Accordion'}
              </h3>
              <form onSubmit={handleFAQSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-400 uppercase tracking-widest mb-1">Question string</label>
                  <input 
                    type="text" 
                    required
                    value={faqForm.question} 
                    onChange={e => setFaqForm({...faqForm, question: e.target.value})}
                    placeholder="e.g. Is payment verification automatic?"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 uppercase tracking-widest mb-1 font-mono">Answer explanation text</label>
                  <textarea 
                    rows={4}
                    required
                    value={faqForm.answer} 
                    onChange={e => setFaqForm({...faqForm, answer: e.target.value})}
                    placeholder="Type clear descriptive answer here..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none resize-none"
                  />
                </div>

                <div className="flex gap-2.5 pt-4">
                  {editingFAQId && (
                    <button 
                      type="button" 
                      onClick={() => { setEditingFAQId(null); setFaqForm({ question: '', answer: '' }); }}
                      className="px-4 py-2 bg-white/5 rounded-xl text-xs uppercase"
                    >
                      Clear
                    </button>
                  )}
                  <button 
                    type="submit" 
                    className="flex-1 py-3 bg-emerald-500 text-brand-dark rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-emerald-400 transition-all cursor-pointer"
                  >
                    {editingFAQId ? 'Save QA Edits' : 'Publish dynamic FAQ'}
                  </button>
                </div>
              </form>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <h4 className="font-display font-medium text-lg text-white mb-2">Accordion FAQ List</h4>
              {faqs.length === 0 ? (
                <div className="p-8 text-center text-slate-500">No FAQ index parameters defined yet.</div>
              ) : (
                <div className="space-y-3">
                  {faqs.map(item => (
                    <div key={item.id} className="p-5 rounded-2xl border border-white/5 bg-white/[0.01] flex items-start justify-between gap-4">
                      <div>
                        <h4 className="font-bold text-sm text-white flex items-center gap-2"><HelpCircle className="w-4 h-4 text-brand-secondary shrink-0" /> {item.question}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed mt-2 pl-6">{item.answer}</p>
                      </div>
                      <div className="flex flex-col gap-2 shrink-0">
                        <button 
                          onClick={() => handleEditFAQ(item)} 
                          className="p-1 px-2.5 bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-accent rounded text-[10px] font-mono border border-brand-primary/15 cursor-pointer font-bold uppercase"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteFAQ(item.id)} 
                          className="p-1 px-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded text-[10px] font-mono border border-red-500/15 cursor-pointer"
                        >
                          Purge
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 8: Testimonials endorsement management */}
        {activeTab === 'Manage Testimonials' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 glass-card p-6 rounded-3xl border border-white/5 bg-brand-card/90">
              <h3 className="font-display font-medium text-xl text-white mb-4">
                {editingTestimonialId ? 'Edit Encomium log' : 'Register partnership feedback testimonial'}
              </h3>
              <form onSubmit={handleTestimonialSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 uppercase tracking-widest mb-1">Associate client Name</label>
                    <input 
                      type="text" 
                      required
                      value={testimonialForm.name} 
                      onChange={e => setTestimonialForm({...testimonialForm, name: e.target.value})}
                      placeholder="e.g. Robin Hood"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 uppercase tracking-widest mb-1">Company / Brand</label>
                    <input 
                      type="text" 
                      required
                      value={testimonialForm.company} 
                      onChange={e => setTestimonialForm({...testimonialForm, company: e.target.value})}
                      placeholder="e.g. Robin Agency"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 uppercase tracking-widest mb-1">Role/Post title</label>
                    <input 
                      type="text" 
                      required
                      value={testimonialForm.role} 
                      onChange={e => setTestimonialForm({...testimonialForm, role: e.target.value})}
                      placeholder="e.g. Growth Officer"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 uppercase tracking-widest mb-1 font-mono">Rating value</label>
                    <input 
                      type="number" 
                      min={1} 
                      max={5}
                      required
                      value={testimonialForm.rating} 
                      onChange={e => setTestimonialForm({...testimonialForm, rating: parseInt(e.target.value) || 5})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 uppercase tracking-widest mb-1">Feedback Quote</label>
                  <textarea 
                    rows={3}
                    required
                    value={testimonialForm.feedback} 
                    onChange={e => setTestimonialForm({...testimonialForm, feedback: e.target.value})}
                    placeholder="Paste client description testimonial comments here..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 uppercase tracking-widest mb-1">Avatar image url</label>
                  <input 
                    type="text" 
                    value={testimonialForm.image} 
                    onChange={e => setTestimonialForm({...testimonialForm, image: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-slate-300 text-xs focus:outline-none font-mono"
                  />
                </div>

                <div className="flex gap-2.5 pt-4">
                  {editingTestimonialId && (
                    <button 
                      type="button" 
                      onClick={() => {
                        setEditingTestimonialId(null);
                        setTestimonialForm({ name: '', role: '', company: '', feedback: '', rating: 5, image: '' });
                      }}
                      className="px-4 py-2 bg-white/5 rounded-xl text-xs uppercase"
                    >
                      Clear
                    </button>
                  )}
                  <button 
                    type="submit" 
                    className="flex-1 py-3 bg-emerald-500 text-brand-dark rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-emerald-400 transition-all cursor-pointer"
                  >
                    {editingTestimonialId ? 'Save Endorsement edits' : 'Publish dynamic testimonial'}
                  </button>
                </div>
              </form>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <h4 className="font-display font-medium text-lg text-white mb-2">Verified Testimonials carousel index</h4>
              {testimonials.length === 0 ? (
                <div className="p-8 text-center text-slate-500">No partner endorsements registered currently.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {testimonials.map(t => (
                    <div key={t.id} className="p-5 rounded-2xl border border-white/5 bg-white/[0.01] flex flex-col justify-between">
                      <div>
                        <div className="flex gap-1 mb-2">
                          {Array(t.rating).fill(0).map((_, idx) => (
                            <span key={idx} className="text-amber-400 font-bold">&#9733;</span>
                          ))}
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed italic mb-4">"{t.feedback}"</p>
                      </div>

                      <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-2">
                        <div className="flex items-center gap-2">
                          <img src={t.image} referrerPolicy="no-referrer" className="w-8 h-8 rounded-full border border-white/10" alt="avatar" />
                          <div>
                            <h5 className="font-bold text-xs text-white">{t.name}</h5>
                            <span className="text-[10px] text-slate-500">{t.role}, {t.company}</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleEditTestimonial(t)} 
                            className="text-xs font-bold font-mono text-brand-secondary cursor-pointer"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteTestimonial(t.id)} 
                            className="text-xs font-bold font-mono text-red-400 cursor-pointer"
                          >
                            Purge
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 9: User permissions directory list */}
        {activeTab === 'Manage Users' && (
          <div className="glass-card rounded-3xl border-white/5 overflow-hidden shadow-2xl bg-[#090b1c]/70">
            <div className="p-6 border-b border-white/10 bg-white/[0.01]">
              <h3 className="font-display font-semibold text-lg text-white">Security Profiles registry</h3>
              <p className="text-xs text-slate-400 mt-1">Review register, promote profiles, or define access credentials levels.</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300 whitespace-nowrap">
                <thead className="bg-[#0b0c16] text-[10px] uppercase font-bold tracking-widest text-slate-400">
                  <tr>
                    <th className="p-4">UserID Track</th>
                    <th className="p-4">Profile Name</th>
                    <th className="p-4">Registered Email</th>
                    <th className="p-4">Contact Phone</th>
                    <th className="p-4">Certified Date</th>
                    <th className="p-4">Security Level Role</th>
                    <th className="p-4 text-right">Clearance Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-brand-card/25">
                  {users.map((item) => (
                    <tr key={item.id} className="hover:bg-white/5 transition-all">
                      <td className="p-4 font-mono text-[10px] text-slate-500">{item.id}</td>
                      <td className="p-4 font-bold text-white font-sans">{item.fullName}</td>
                      <td className="p-4 font-mono">{item.email}</td>
                      <td className="p-4 font-mono">{item.phone}</td>
                      <td className="p-4 text-slate-400">{new Date(item.createdAt).toLocaleDateString()}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                          item.role === 'super_admin' ? 'bg-red-500/10 text-red-500 border border-red-500/15' :
                          item.role === 'admin' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/15' :
                          'bg-brand-primary/10 text-brand-accent border border-brand-primary/15'
                        }`}>
                          {item.role}
                        </span>
                      </td>
                      <td className="p-4 text-right text-xs">
                        {item.id !== currentUser.id ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button 
                              onClick={() => handleUpdateRole(item.id, 'admin')}
                              className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/15 p-1 px-2.5 rounded font-extrabold uppercase tracking-wider text-[9px] cursor-pointer"
                            >
                              Set Admin
                            </button>
                            <button 
                              onClick={() => handleUpdateRole(item.id, 'student')}
                              className="bg-slate-500/10 hover:bg-slate-500/20 text-slate-300 border border-white/5 p-1 px-2.5 rounded font-extrabold uppercase tracking-wider text-[9px] cursor-pointer"
                            >
                              Set Student
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-600 font-mono italic">Operating host</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 10: Dynamic contact messages submissions */}
        {activeTab === 'Contact Forms' && (
          <div className="space-y-4">
            <h3 className="font-display font-semibold text-lg text-white">Dynamic Incoming Inquiries</h3>
            {messages.length === 0 ? (
              <div className="p-12 text-center text-slate-500 rounded-3xl bg-white/5 border border-white/5">
                No user contacts form submissions recorded in databases yet.
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((m) => (
                  <div key={m.id} className={`p-6 rounded-2xl border text-sm transition-all ${
                    m.isRead ? 'bg-[#0f1122]/30 border-white/5 opacity-70' : 'bg-emerald-500/5 border-emerald-500/15 shadow-[0_0_20px_rgba(16,185,129,0.05)]'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4 pb-4 border-b border-white/5">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-base font-display">{m.firstName} {m.lastName}</h4>
                          <span className="px-2 py-0.5 bg-brand-primary/10 border border-brand-primary/20 text-brand-secondary text-[9px] font-mono font-bold rounded">
                            {m.service || "Unspecified Setup"}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 font-mono">
                          Email: <span className="text-white select-all font-semibold">{m.email}</span> &bull; Tel: <span className="text-white select-all font-semibold">{m.phone}</span>
                        </p>
                        {m.websiteUrl && (
                          <p className="text-xs text-brand-secondary mt-1 font-mono">
                            Website Target: <a href={m.websiteUrl.startsWith('http') ? m.websiteUrl : `https://${m.websiteUrl}`} target="_blank" rel="noopener noreferrer" className="underline inline-flex items-center gap-0.5">{m.websiteUrl}</a>
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-slate-500 font-mono">{new Date(m.createdAt).toLocaleString()}</span>
                        {!m.isRead && (
                          <button 
                            onClick={() => handleMarkRead(m.id)}
                            className="px-3 py-1 bg-emerald-500 text-brand-dark rounded font-bold uppercase tracking-wider text-[9px] cursor-pointer"
                          >
                            Confirm Read Check
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-slate-300 whitespace-pre-wrap leading-relaxed text-xs font-mono bg-black/30 p-4 rounded-xl border border-white/5">{m.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 11: Awarded certificates verification registry */}
        {activeTab === 'Awarded Certificates' && (
          <div className="glass-card rounded-3xl border-white/5 overflow-hidden shadow-2xl bg-[#090b1c]/70">
            <div className="p-6 border-b border-white/10 bg-white/[0.01]">
              <h3 className="font-display font-medium text-lg text-white">Awarded Certificate Index</h3>
              <p className="text-xs text-slate-400 mt-1">Review live auto-generated certifications and license IDs.</p>
            </div>

            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#0b0c16] text-[10px] uppercase font-bold tracking-widest text-slate-400 font-mono">
                <tr>
                  <th className="p-4">Certificate ID Licence</th>
                  <th className="p-4">Student Name</th>
                  <th className="p-4">Course title</th>
                  <th className="p-4">Issued date timestamp</th>
                  <th className="p-4 text-right">Verification Launch</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs font-mono">
                {certs.map((c) => (
                  <tr key={c.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-bold text-emerald-400 select-all">{c.verificationId}</td>
                    <td className="p-4 font-sans font-bold text-white">{c.userName}</td>
                    <td className="p-4 font-sans">{c.courseTitle}</td>
                    <td className="p-4 text-slate-400">{c.issuedAt}</td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => navigate(`/certificates/${c.verificationId}`)}
                        className="text-brand-secondary hover:underline py-1 px-2.5 rounded font-semibold text-xs cursor-pointer inline-block"
                      >
                        Launch Verification Card &rarr;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}
