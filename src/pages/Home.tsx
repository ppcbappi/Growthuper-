import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  BarChart3, 
  Target, 
  Zap, 
  Shield, 
  ChevronRight, 
  MessageSquare, 
  HelpCircle, 
  BookOpen, 
  Star, 
  Calendar, 
  User as UserIcon, 
  Lightbulb,
  CheckCircle,
  Gem,
  ExternalLink
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { db, SiteSettings, ServiceCard, Blog, FAQ, Testimonial, PricingPlan } from '../lib/database';

export default function Home() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [services, setServices] = useState<ServiceCard[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [pricing, setPricing] = useState<PricingPlan[]>([]);
  
  // Accordions for FAQs
  const [activeFaqId, setActiveFaqId] = useState<string | null>(null);
  const [sandboxMode, setSandboxMode] = useState<'client' | 'server'>('server');

  useEffect(() => {
    setSettings(db.getSettings());
    setServices(db.getServices());
    setBlogs(db.getBlogs());
    setFaqs(db.getFAQs());
    setTestimonials(db.getTestimonials());
    setPricing(db.getPricingPlans());
  }, []);

  const handleToggleFaq = (id: string) => {
    setActiveFaqId(activeFaqId === id ? null : id);
  };

  // Helper to map icon string name to lucide icon component
  const renderIcon = (iconName: string, className: string = "w-6 h-6") => {
    switch (iconName) {
      case "BarChart3": return <BarChart3 className={className} />;
      case "Target": return <Target className={className} />;
      case "Zap": return <Zap className={className} />;
      case "Shield": return <Shield className={className} />;
      default: return <Lightbulb className={className} />;
    }
  };

  // Dynamic values
  const heroBadge = settings?.heroBadge || "The future of scaling with analytics";
  const heroTitle = settings?.heroTitle || "Measure Exactly What Drives Revenue.";
  const heroSubtitle = settings?.heroSubtitle || "Growthuper installs military-grade tracking systems and provides premium courses to help software and agency founders scale predictably in 2026.";
  const primaryCta = settings?.primaryCtaText || "Explore Services";
  const secondaryCta = settings?.secondaryCtaText || "View Premium Courses";

  return (
    <div className="pt-24 md:pt-32 pb-20">
      
      {/* 1. Immersive Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 mb-28 flex flex-col items-center text-center">
        {/* Floating gradient orb backdrop */}
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[60%] h-[350px] bg-brand-primary/10 blur-[130px] rounded-full pointing-events-none" />
        
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-brand-secondary text-xs sm:text-sm font-semibold mb-8 tracking-wide shadow-inner"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-brand-accent animate-pulse" />
          {heroBadge}
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white max-w-5xl leading-tight mb-8"
        >
          {heroTitle.includes("Revenue") ? (
            <>
              Measure Exactly <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent">
                What Drives Revenue.
              </span>
            </>
          ) : heroTitle}
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="text-base sm:text-lg md:text-xl text-slate-400 max-w-3xl mb-12 leading-relaxed font-sans"
        >
          {heroSubtitle}
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto"
        >
          <Link to="/services" className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-brand-dark font-bold hover:bg-brand-secondary hover:text-brand-dark transition-all hover:scale-105 select-none text-center shadow-[0_0_30px_rgba(255,255,255,0.15)] flex items-center justify-center gap-2 group">
            {primaryCta}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/courses" className="w-full sm:w-auto px-8 py-4 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-md text-white font-semibold transition-all hover:scale-105 active:scale-95 text-center flex items-center justify-center gap-2 select-none">
            {secondaryCta}
          </Link>
        </motion.div>
      </section>

      {/* 2. Brand Identity Dynamic Infographic / Rolling Trust indicators */}
      <section className="border-y border-white/5 bg-slate-950/40 backdrop-blur-sm py-8 mb-28 overflow-hidden flex whitespace-nowrap">
        <motion.div 
          animate={{ x: [0, -1200] }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          className="flex items-center gap-20 px-10 text-slate-500 font-display font-medium text-xs sm:text-sm tracking-widest uppercase cursor-default"
        >
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="flex items-center gap-20 shrink-0">
              <div className="flex items-center gap-2.5">
                <BarChart3 className="w-5 h-5 text-brand-primary" />
                <span>MILITARY-GRADE GA4</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Target className="w-5 h-5 text-brand-secondary" />
                <span>META DEDUPLICATED CAPI</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Zap className="w-5 h-5 text-brand-accent" />
                <span>FIRST-PARTY FIRST DNS PROXY</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Shield className="w-5 h-5 text-purple-400" />
                <span>GDPR COMPLIANT ARCHITECTURES</span>
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Interactive Sandbox Bento Infographic */}
      <section className="max-w-7xl mx-auto px-6 mb-32">
        <div className="text-center mb-12">
          <span className="text-brand-primary text-xs sm:text-sm font-mono tracking-widest uppercase mb-3 block">Signal Performance Lab</span>
          <h2 className="font-display text-3xl md:text-5xl font-black text-white tracking-tight">Interactive Attribution Sandbox</h2>
          <p className="text-slate-400 max-w-2xl mx-auto mt-4 text-sm leading-relaxed">
            Toggle the architectural modes to simulate how leading browsers (Safari ITP, Brave, Chrome) degrade standard tags vs how Growthuper DNS-proxies lock-in attribution pipelines.
          </p>
        </div>

        {/* Selector Toggles */}
        <div className="flex justify-center mb-10">
          <div className="bg-brand-dark/60 border border-white/5 p-1.5 rounded-2xl inline-flex gap-2">
            <button
              onClick={() => setSandboxMode('client')}
              className={`px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                sandboxMode === 'client'
                  ? 'bg-red-500/10 border border-red-500/20 text-red-400 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Standard Client Tags (Default)
            </button>
            <button
              onClick={() => setSandboxMode('server')}
              className={`px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                sandboxMode === 'server'
                  ? 'bg-brand-accent/10 border border-brand-accent/20 text-brand-accent shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Growthuper Server SSL CDN Proxy (Advanced)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Bento Card 1: Main Metric Gauge (span 4) */}
          <div className="lg:col-span-4 glass-card p-8 rounded-3xl border border-white/5 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 blur-3xl rounded-full" />
            <div>
              <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest block mb-4">MATCH QUALITY & ACCURACY</span>
              <div className="relative w-40 h-40 mx-auto my-4 flex items-center justify-center">
                
                {/* Simulated circular progress */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.03)" strokeWidth="8" fill="transparent" />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    stroke={sandboxMode === 'server' ? '#7CF29C' : '#EF4444'} 
                    strokeWidth="8" 
                    fill="transparent" 
                    strokeDasharray="251.2"
                    strokeDashoffset={sandboxMode === 'server' ? "5" : "180"}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                
                <div className="absolute text-center">
                  <span className="text-4xl font-mono font-black text-white block">
                    {sandboxMode === 'server' ? "98%" : "28%"}
                  </span>
                  <span className={`text-[10px] font-mono font-bold uppercase ${sandboxMode === 'server' ? 'text-brand-accent' : 'text-red-400'}`}>
                    {sandboxMode === 'server' ? "Precise Stream" : "Mismatched"}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-white/5 pt-5">
              <span className="text-xs text-slate-400 block mb-1">Estimated Attributable ROAS Lost:</span>
              <p className="text-sm font-semibold text-white">
                {sandboxMode === 'server' ? "$0.00 — Pure Attribution Secure" : "Up to 52% Ad budget mistargeted"}
              </p>
            </div>
          </div>

          {/* Bento Card 2: Interactive Signal Line Graph (span 5) */}
          <div className="lg:col-span-5 glass-card p-8 rounded-3xl border border-white/5 flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest block">ATTRIBUTION SIGNAL INTEGRITY</span>
                  <h4 className="text-sm font-bold text-white mt-1">14-Day Signal Retention Curve</h4>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-mono font-bold ${sandboxMode === 'server' ? 'bg-brand-accent/10 text-brand-accent' : 'bg-red-500/10 text-red-400'}`}>
                  {sandboxMode === 'server' ? "ITP Immune" : "Blocked by Shield"}
                </span>
              </div>

              {/* Simulated SVG Graph */}
              <div className="h-44 w-full flex items-end relative pt-6">
                <svg className="w-full h-full text-slate-700" viewBox="0 0 300 120" fill="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="20" x2="300" y2="20" stroke="rgba(255,255,255,0.03)" strokeDasharray="3 3" />
                  <line x1="0" y1="60" x2="300" y2="60" stroke="rgba(255,255,255,0.03)" strokeDasharray="3 3" />
                  <line x1="0" y1="100" x2="300" y2="100" stroke="rgba(255,255,255,0.03)" strokeDasharray="3 3" />
                  
                  {/* Dynamic Curve */}
                  {sandboxMode === 'server' ? (
                    <path 
                      d="M10 20 Q50 30, 90 20 T170 25 T250 20 T290 22" 
                      stroke="#7CF29C" 
                      strokeWidth="3.5" 
                      fill="none" 
                    />
                  ) : (
                    <path 
                      d="M10 20 Q50 60, 90 85 T170 110 T250 115 T290 118" 
                      stroke="#EF4444" 
                      strokeWidth="3.5" 
                      fill="none" 
                    />
                  )}
                  
                  {/* Fill Under Curve */}
                  {sandboxMode === 'server' ? (
                    <path d="M10 20 Q50 30, 90 20 T170 25 T250 20 T290 22 L290 120 L10 120 Z" fill="url(#server-grad)" opacity="0.1" />
                  ) : (
                    <path d="M10 20 Q50 60, 90 85 T170 110 T250 115 T290 118 L290 120 L10 120 Z" fill="url(#client-grad)" opacity="0.1" />
                  )}

                  <defs>
                    <linearGradient id="server-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7CF29C" />
                      <stop offset="100%" stopColor="#7CF29C" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="client-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#EF4444" />
                      <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
                
                {/* Floating tags */}
                <div className="absolute top-2 left-2 text-[9px] font-mono text-slate-500">Day 1: Purchase</div>
                <div className="absolute bottom-2 right-2 text-[9px] font-mono text-slate-500">Day 14: Return Vis</div>
              </div>
            </div>

            <div className="border-t border-white/5 pt-4 mt-4 flex justify-between text-xs text-slate-400">
              <span>Attribution Window:</span>
              <span className={`font-mono font-bold ${sandboxMode === 'server' ? 'text-brand-accent' : 'text-red-400'}`}>
                {sandboxMode === 'server' ? "Extended up to 180 Days" : "Deleted in 7 Days (Safari ITP)"}
              </span>
            </div>
          </div>

          {/* Bento Card 3: Specific Constraints & Status Lists (span 3) */}
          <div className="lg:col-span-3 glass-card p-8 rounded-3xl border border-white/5 flex flex-col justify-between relative overflow-hidden bg-brand-dark/20 text-xs text-slate-400">
            <div>
              <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest block mb-4">COMPLIANCE & BYPASS COMPATIBILITY</span>
              <ul className="space-y-4">
                <li className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${sandboxMode === 'server' ? 'bg-brand-accent' : 'bg-red-500'}`} />
                  <div>
                    <span className="text-white font-semibold block leading-tight">Brave Shield Defense</span>
                    <span className="text-[10px]">{sandboxMode === 'server' ? "98.4% Bypass" : "100% Signal Dropout"}</span>
                  </div>
                </li>
                <li className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${sandboxMode === 'server' ? 'bg-brand-accent' : 'bg-red-500'}`} />
                  <div>
                    <span className="text-white font-semibold block leading-tight">Safari ITP Cloaking</span>
                    <span className="text-[10px]">{sandboxMode === 'server' ? "Immune (DNS-based)" : "7-Day Expirations"}</span>
                  </div>
                </li>
                <li className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${sandboxMode === 'server' ? 'bg-brand-accent' : 'bg-red-500'}`} />
                  <div>
                    <span className="text-white font-semibold block leading-tight">Ad-Blocker Subscriptions</span>
                    <span className="text-[10px]">{sandboxMode === 'server' ? "Subdomain proxy enabled" : "Triggers fully blocked"}</span>
                  </div>
                </li>
              </ul>
            </div>

            <Link 
              to="/services" 
              className="mt-6 inline-flex items-center gap-1 font-bold text-white hover:text-brand-secondary transition-all uppercase tracking-wider text-[10px] cursor-pointer"
            >
              Analyze Complete Tech Brief <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </section>

      {/* 3. Dynamic Bento-style Services Section */}
      <section className="max-w-7xl mx-auto px-6 mb-32">
        <div className="text-center mb-16">
          <span className="text-brand-primary text-xs sm:text-sm font-mono tracking-widest uppercase mb-3 block">High-Fidelity Deployments</span>
          <h2 className="font-display text-3xl md:text-5xl font-extrabold text-white tracking-tight">Our Core Framework Focus</h2>
          <p className="text-slate-400 max-w-xl mx-auto mt-4 text-sm sm:text-base leading-relaxed">
            We architect zero-leakage configurations directly mapped to your custom business loops.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((srv, index) => (
            <motion.div 
              key={srv.id}
              whileHover={{ y: -6, borderColor: 'rgba(255, 255, 255, 0.15)' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="glass-card p-8 rounded-3xl relative overflow-hidden group border border-white/5 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {renderIcon(srv.iconName, "w-6 h-6 text-brand-secondary")}
                </div>
                <h3 className="text-xl font-display font-bold mb-3 text-white group-hover:text-brand-secondary transition-colors">{srv.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">{srv.description}</p>
              </div>
              
              <ul className="space-y-2 border-t border-white/5 pt-4">
                {srv.features?.slice(0, 3).map((f, fi) => (
                  <li key={fi} className="text-[11px] text-slate-300 font-mono flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-accent shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. Flagship Academy / LMS Promo Bento Block */}
      <section className="max-w-7xl mx-auto px-6 mb-32">
        <div className="glass-card rounded-3xl relative overflow-hidden border border-white/5 bg-gradient-to-br from-slate-950 via-slate-900 to-brand-darker grid grid-cols-1 lg:grid-cols-12 gap-8 p-8 sm:p-12 items-center">
          <div className="absolute right-[-10%] bottom-[-10%] w-[350px] h-[350px] bg-brand-primary/20 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute left-[-5%] top-[-5%] w-[250px] h-[250px] bg-brand-secondary/10 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="lg:col-span-7 space-y-6 relative z-10">
            <span className="px-3 py-1 bg-brand-accent/10 border border-brand-accent/25 rounded-md text-brand-accent text-xs font-bold uppercase tracking-wider">
              Growthuper Academy Platform
            </span>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-white tracking-tight lead-tight">
              Learn The Exact Tactics We Use <br className="hidden sm:block" />
              to Track Multi-Million Dollar Stores
            </h3>
            <p className="text-slate-400 text-base leading-relaxed max-w-xl">
              From source elements visibility configurations to server conversions loops and deduplication hashes, our LMS video syllabus breaks down functional implementation without unnecessary jargon.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link to="/courses" className="px-6 py-3 bg-white text-brand-dark rounded-xl font-bold hover:bg-brand-secondary transition-colors text-sm shadow-md flex items-center gap-2">
                Launch Classroom <BookOpen className="w-4 h-4" />
              </Link>
              <Link to="/contact" className="px-6 py-3 bg-white/5 border border-white/15 text-white rounded-xl font-semibold hover:bg-white/10 transition-colors text-sm flex items-center gap-2">
                Consult With Setup Team <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Interactive Widget Display representing dynamic student interface */}
          <div className="lg:col-span-5 relative z-10 bg-slate-900/80 border border-white/10 p-6 rounded-2xl shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-[10px] text-slate-500 font-mono ml-2">student-dashboard.app</span>
              </div>
              <span className="text-[10px] text-brand-secondary font-mono tracking-wider uppercase font-bold">LIVELOCK SECURE</span>
            </div>
            
            <div className="space-y-4">
              <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                <span className="text-[10px] font-mono text-slate-400 uppercase">COURSE ENROLLED</span>
                <h4 className="text-sm font-semibold text-white mt-1">Mastering Server-Side Tagging v2</h4>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex-1 bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-brand-accent h-full w-4/5 rounded-full" />
                  </div>
                  <span className="text-xs font-mono font-bold text-brand-accent text-right">80% Done</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-950/40 rounded-xl border border-white/5 text-center">
                  <Star className="w-4 h-4 text-brand-secondary mx-auto mb-1.5" />
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-mono">Quiz Score</span>
                  <span className="text-base font-bold text-white font-mono">98% Avg</span>
                </div>
                <div className="p-3 bg-slate-950/40 rounded-xl border border-white/5 text-center">
                  <Shield className="w-4 h-4 text-brand-accent mx-auto mb-1.5" />
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-mono">Certificate</span>
                  <span className="text-[11px] font-bold text-white tracking-tight flex items-center justify-center gap-1">Generated <CheckCircle className="w-3.5 h-3.5 text-brand-accent shrink-0" /></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Pricing Plans Options */}
      <section className="max-w-7xl mx-auto px-6 mb-32">
        <div className="text-center mb-16">
          <span className="text-brand-secondary text-xs sm:text-sm font-mono tracking-widest uppercase mb-3 block">Flat Transparency Rates</span>
          <h2 className="font-display text-3xl md:text-5xl font-extrabold text-white tracking-tight">Flexible Conversion Pathways</h2>
          <p className="text-slate-400 max-w-xl mx-auto mt-4 text-sm sm:text-base">
            Select a pathway aligned with your immediate objectives: self-paced digital program, multi-course access, or total client setup.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricing.map((plan) => (
            <div 
              key={plan.id}
              className={`p-8 sm:p-10 rounded-3xl relative overflow-hidden flex flex-col justify-between border ${
                plan.popular 
                  ? 'bg-gradient-to-b from-brand-primary/10 to-slate-950 border-brand-primary/50 shadow-[0_0_40px_rgba(108,92,231,0.2)]' 
                  : 'bg-slate-950/60 border-white/5'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-4 right-4 bg-brand-primary text-white text-[10px] font-mono uppercase font-bold px-3 py-1 rounded">
                  Most Popular Pass
                </div>
              )}
              
              <div>
                <h3 className="text-xl sm:text-2xl font-display font-extrabold text-white mb-2">{plan.name}</h3>
                <p className="text-slate-400 text-xs leading-relaxed mb-6">{plan.description}</p>
                
                <div className="flex items-baseline gap-2 mb-8">
                  <span className="text-4xl sm:text-5xl font-mono font-black text-white">{plan.price}</span>
                  <span className="text-xs text-slate-400 font-mono">/ {plan.timeframe}</span>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features?.map((feat, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-slate-300">
                      <Gem className="w-4 h-4 text-brand-secondary mt-0.5 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                onClick={() => {
                  if (plan.id === "plan-agency") {
                    navigate('/contact');
                  } else {
                    navigate('/courses');
                  }
                }}
                className={`w-full py-4 rounded-xl font-bold text-center text-sm transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  plan.popular 
                    ? 'bg-brand-primary hover:bg-brand-primary/80 text-white shadow-lg shadow-brand-primary/20 hover:scale-103' 
                    : 'bg-white/5 hover:bg-white/10 border border-white/10 text-white hover:border-white/20'
                }`}
              >
                {plan.ctaText} <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Dynamic Testimonials Section */}
      <section className="max-w-7xl mx-auto px-6 mb-32">
        <div className="text-center mb-16">
          <span className="text-brand-accent text-xs sm:text-sm font-mono tracking-widest uppercase mb-3 block">Validated User Success</span>
          <h2 className="font-display text-3xl md:text-5xl font-extrabold text-white tracking-tight">Acclaimed By Top Optimization Teams</h2>
          <p className="text-slate-400 max-w-xl mx-auto mt-4 text-sm sm:text-base">
            These operators bypassed browser blocklists and successfully regained deep visibility into their funnel analytics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test) => (
            <div 
              key={test.id}
              className="glass-card p-8 rounded-3xl border border-white/5 relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 mb-5">
                  {Array(test.rating).fill(0).map((_, ri) => (
                    <Star key={ri} className="w-4 h-4 text-amber-500 fill-amber-500" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed italic mb-8">
                  "{test.feedback}"
                </p>
              </div>

              <div className="flex items-center gap-4 border-t border-white/5 pt-5">
                <img 
                  src={test.image} 
                  alt={test.name} 
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-full object-cover border border-white/15" 
                />
                <div>
                  <h4 className="text-white font-bold text-sm">{test.name}</h4>
                  <p className="text-xs text-slate-400">{test.role}, <span className="text-brand-secondary font-semibold">{test.company}</span></p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. FAQ Accordion Grid & Contact Quick Trigger */}
      <section className="max-w-4xl mx-auto px-6 mb-32">
        <div className="text-center mb-16">
          <span className="text-purple-400 text-xs sm:text-sm font-mono tracking-widest uppercase mb-3 block">Clear Answers Only</span>
          <h2 className="font-display text-3xl md:text-5xl font-extrabold text-white tracking-tight">Frequently Answered Queries</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => {
            const isExpanded = activeFaqId === faq.id;
            return (
              <div 
                key={faq.id}
                className="glass-card rounded-2xl border border-white/5 overflow-hidden transition-all duration-300"
              >
                <button 
                  onClick={() => handleToggleFaq(faq.id)}
                  className="w-full text-left p-6 sm:p-8 flex items-center justify-between text-white hover:text-brand-secondary transition-colors cursor-pointer focus:outline-none"
                >
                  <span className="font-display font-semibold text-base sm:text-lg pr-4">{faq.question}</span>
                  <div className={`w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 transition-transform duration-300 ${isExpanded ? 'rotate-180 bg-brand-primary/10 text-brand-primary' : 'text-slate-400'}`}>
                    <HelpCircle className="w-4 h-4" />
                  </div>
                </button>
                
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-6 sm:px-8 sm:pb-8 text-neutral-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. Modern Dynamic Blogs Insights */}
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16">
          <div>
            <span className="text-brand-primary text-xs sm:text-sm font-mono tracking-widest uppercase mb-3 block">Expert Perspectives</span>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold text-white tracking-tight">The Growthuper Dispatch</h2>
          </div>
          <Link to="/contact" className="text-slate-400 hover:text-white transition-colors text-sm font-medium mt-4 md:mt-0 flex items-center gap-1.5 group">
            Request custom analysis piece <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogs.map((post) => (
            <article 
              key={post.id}
              className="glass-card rounded-3xl overflow-hidden border border-white/5 relative group cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="relative h-64 w-full overflow-hidden bg-slate-900 border-b border-white/5">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute top-4 left-4 bg-brand-primary text-white text-[10px] font-mono uppercase font-bold px-2.5 py-1 rounded">
                    {post.readTime}
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex items-center gap-4 text-xs text-slate-500 font-mono mb-4">
                    <span className="flex items-center gap-1.5"><UserIcon className="w-3.5 h-3.5 text-brand-secondary" /> {post.author}</span>
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(post.createdAt || '').toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  </div>
                  
                  <h3 className="text-xl sm:text-2xl font-display font-extrabold text-white mb-3 group-hover:text-brand-secondary transition-colors leading-tight">
                    {post.title}
                  </h3>
                  
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-8 pb-8">
                <div className="inline-flex items-center text-brand-secondary group-hover:text-white transition-colors font-semibold text-xs uppercase tracking-wider gap-1.5">
                  Read Article Content <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

    </div>
  );
}
