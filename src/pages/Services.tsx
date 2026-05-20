import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, 
  Target, 
  Zap, 
  Shield, 
  Layers, 
  Settings, 
  ArrowRight, 
  CheckCircle,
  ShoppingBag,
  Eye,
  Activity,
  Award,
  LineChart,
  Code,
  TrendingUp,
  HelpCircle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../lib/database';

interface ServiceItem {
  name: string;
  description: string;
}

interface ServiceCategory {
  id: string;
  title: string;
  badge: string;
  icon: React.ReactNode;
  accentColor: string;
  metric: string;
  metricLabel: string;
  servicesList: ServiceItem[];
  caseStudy: {
    headline: string;
    result: string;
    description: string;
  };
}

export default function Services() {
  const [activeTab, setActiveTab] = useState('ga4');
  const navigate = useNavigate();

  const categories: ServiceCategory[] = [
    {
      id: 'google_ads',
      title: 'Google Ads Services',
      badge: 'Bidding Optimization',
      accentColor: 'from-[#FFC107] to-[#FF9800]',
      icon: <Target className="w-6 h-6 text-amber-400" />,
      metric: '+42% ROAS boost',
      metricLabel: 'Attributable bidding uplift',
      servicesList: [
        { name: 'Google Ads Conversion Tracking', description: 'Zero-drop client pixel deployments mapped directly to purchase actions.' },
        { name: 'Google Ads Enhanced Conversions', description: 'SHA-256 secure hashing on first-party customer keys (emails, phone) to lift match rates.' },
        { name: 'Google Ads Server Side Tracking', description: 'Route signals securely from GTM Server Containers, bypassing standard client blocks.' },
        { name: 'Google Ads Funnel Tracking', description: 'Full measurement from initial search click clear down to checkout and repeat orders.' },
        { name: 'Google Ads Analytics Setup', description: 'Deep parameter mapping (gclid, wbraid, gbraid) aligning GA4 channels cleanly.' }
      ],
      caseStudy: {
        headline: 'Automated Electronics Store Scaled bids safely',
        result: '1.4x Conversion Increase',
        description: 'Linked enhanced conversion arrays directly to first-party databases, correcting duplicate parameters.'
      }
    },
    {
      id: 'ga4',
      title: 'GA4 Analytics Setup',
      badge: 'Data Architecture',
      accentColor: 'from-brand-secondary to-brand-primary',
      icon: <BarChart3 className="w-6 h-6 text-brand-secondary" />,
      metric: '100% Raw Exports',
      metricLabel: 'No limit custom mapping',
      servicesList: [
        { name: 'GA4 Setup & Configuration', description: 'Enterprise-grade property setups incorporating custom dimensions and definitions.' },
        { name: 'GA4 Ecommerce Tracking', description: 'Fully compliant standard schema maps (items array, currency, item_id) matching specifications.' },
        { name: 'GA4 Custom Events & Parameters', description: 'Establish precise element interactions, drag-drops, and dynamic interactions hooks.' },
        { name: 'GA4 Audit & Diagnostics', description: 'Audit missing session attribution patterns, referral exclusions, and loop leakages.' },
        { name: 'GA4 Funnel Analysis', description: 'Build premium visual step charts measuring shopping carts, checklists, and checkout stages.' }
      ],
      caseStudy: {
        headline: 'Corporate SaaS platform attributes churn metrics',
        result: '99.4% Analytics Accuracy',
        description: 'Replaced outdated UA tag clusters with micro-attribution hooks to measure user lifecycle stages.'
      }
    },
    {
      id: 'gtm',
      title: 'GTM Client & Server Tagging',
      badge: 'Tag Orchestrations',
      accentColor: 'from-indigo-500 to-purple-600',
      icon: <Code className="w-6 h-6 text-indigo-400" />,
      metric: '< 180ms Latency',
      metricLabel: 'Engine speed optimization',
      servicesList: [
        { name: 'GTM Container Setup', description: 'Segment client containers for optimal browser load execution and compliance.' },
        { name: 'GTM Custom Events Handler', description: 'Deploy safe client-level JavaScript triggers tracking clicks, video plays, and scrolls.' },
        { name: 'GTM DataLayer Engineering', description: 'Program custom server arrays push directives for safe order value streams.' },
        { name: 'GTM Debugging & Audit QA', description: 'Cleanse redundant setups and resolve visual console script loop warnings.' }
      ],
      caseStudy: {
        headline: 'Learning Management System cleaned code execution',
        result: '3.1s Faster Page Loads',
        description: 'Consolidated over 30 independent platform scripts into single custom triggers, speeding up loading speed.'
      }
    },
    {
      id: 'meta',
      title: 'Meta & FB Conversions API',
      badge: 'Direct Cloud Streams',
      accentColor: 'from-[#0084FF] to-[#00C6FF]',
      icon: <Shield className="w-6 h-6 text-blue-400" />,
      metric: '9.8 / 10 Match Score',
      metricLabel: 'High Quality Match parameters',
      servicesList: [
        { name: 'Meta Pixel Setup', description: 'Deploy resilient web pixels covering pageviews, add-to-carts, and initial signups.' },
        { name: 'Facebook Conversion API (CAPI)', description: 'Establish secure server-to-server triggers with exact Event-ID pairs to match web events.' },
        { name: 'Meta Server Side Tracking', description: 'Custom GTM Server Containers setup, improving Safari cookie retention from 7 days to 180 days.' }
      ],
      caseStudy: {
        headline: 'Apparel E-Commerce recaptures active list data',
        result: '34% Increase in Custom Match Quality',
        description: 'Stitched cloud server triggers into checkout flow, keeping browser security adjustments from truncating signals.'
      }
    },
    {
      id: 'shopify',
      title: 'Shopify Custom DataLayer',
      badge: 'E-Comm Specialists',
      accentColor: 'from-[#96BF48] to-[#609121]',
      icon: <ShoppingBag className="w-6 h-6 text-lime-400" />,
      metric: '0% Cart Leakage',
      metricLabel: 'Recovered checkout metrics',
      servicesList: [
        { name: 'Shopify DataLayer Integration', description: 'Inject liquid code blocks to output detailed checkout events instantly.' },
        { name: 'Shopify Custom Tracking Pixels', description: 'Hook into the modern Shopify web-pixels API, providing clean sandbox event routing.' },
        { name: 'Shopify Analytics Audits', description: 'Harmonize Shopify dashboard reports with Google Analytics, ensuring sales completely align.' },
        { name: 'Shopify Conversion Tracking', description: 'Custom conversion pipelines mapping products, categories, SKU values, and currencies.' }
      ],
      caseStudy: {
        headline: 'Headless Shopify store aligns billing ledgers',
        result: '$43k Recovered Revenue/Mo',
        description: 'Configured automated GTM listeners inside headless React checkout wrappers, recovering lost ad sets.'
      }
    },
    {
      id: 'advanced',
      title: 'Advanced Proxy Tracking',
      badge: 'Bypassing ad-blockers',
      accentColor: 'from-brand-accent to-emerald-500',
      icon: <Zap className="w-6 h-6 text-brand-accent" />,
      metric: '99.8% Cookie Retention',
      metricLabel: 'Immune to ad blocker restrictions',
      servicesList: [
        { name: 'Server Side Tracking', description: 'Establish custom cloud proxy DNS subdomains to route all marketing triggers under first-party assets.' },
        { name: 'Funnel Tracking Design', description: 'Custom-built maps tracking landing click pageflows down to the final receipt validation.' },
        { name: 'Video & Scroll Tracking', description: 'Log specific progress markers and watch thresholds for streaming materials and webinars.' },
        { name: 'Cookie Consent Integration', description: 'Set up Google Consent Mode v2, conforming to GDPR and tracking rules automatically.' }
      ],
      caseStudy: {
        headline: 'Major European platform handles tracking audits',
        result: 'Fully GDPR/EEA Compliant',
        description: 'Deployed Google Consent Mode v2 inside premium GTM rules, keeping analytics clean within legal guidelines.'
      }
    }
  ];

  const handleServiceSelect = (serviceName: string) => {
    // Navigate user to Contact form with pre-selected service mapping
    navigate('/contact', { state: { selectedService: serviceName } });
  };

  const activeCategory = categories.find(c => c.id === activeTab) || categories[1];

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-6 font-sans">
      {/* Premium Header */}
      <div className="text-center mb-20">
        <div className="inline-flex items-center gap-2 bg-brand-primary/10 border border-brand-primary/20 rounded-full px-4 py-1.5 mb-4 backdrop-blur-md">
          <Activity className="w-3.5 h-3.5 text-brand-secondary animate-pulse" />
          <span className="text-[11px] font-mono tracking-wider uppercase text-slate-300">Deployment Engineering</span>
        </div>
        <h1 className="font-display text-4xl md:text-6xl font-black mb-6 tracking-tight">
          Military-Grade <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-secondary via-brand-primary to-brand-accent">Tracking Systems.</span>
        </h1>
        <p className="text-slate-400 text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
          We construct server-side cloud containers and optimize datalayers so marketing budgets align precisely with physical revenue receipts. Bypass cookie deletion limits and ad-blockers with first-party assets.
        </p>
      </div>

      {/* Bento Grid layout with Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-20">
        
        {/* Left Interactive Sidebar Tab Selector (span 4) */}
        <div className="lg:col-span-4 space-y-3 lg:sticky lg:top-28">
          <div className="glass-card p-4 rounded-3xl border border-white/5 space-y-1 bg-brand-dark/40 pb-5">
            <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase block mb-3 px-3">Expertise Directories</span>
            {categories.map((cat) => {
              const isActive = activeTab === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`w-full text-left flex items-center gap-4 py-3.5 px-4 rounded-2xl transition-all duration-300 relative group cursor-pointer ${
                    isActive 
                      ? "bg-gradient-to-r from-white/10 to-white/5 border border-white/10 text-white shadow-lg" 
                      : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <div className={`p-2.5 rounded-xl transition-all ${
                    isActive ? "bg-white/10 text-white" : "bg-white/5 text-slate-400 group-hover:bg-white/10 group-hover:text-white"
                  }`}>
                    {cat.icon}
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-semibold block tracking-tight leading-tight">{cat.title}</span>
                    <span className="text-[10px] font-mono block text-slate-500 group-hover:text-slate-400">{cat.badge}</span>
                  </div>
                  <ArrowRight className={`w-4 h-4 text-slate-500 transition-all ${
                    isActive ? "opacity-100 translate-x-0 text-brand-secondary" : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                  }`} />
                </button>
              );
            })}
          </div>

          {/* Quick Metrics Badge */}
          <div className="p-6 rounded-3xl glass border border-white/5 relative overflow-hidden bg-gradient-to-b from-brand-primary/5 to-transparent">
            <div className="relative z-10">
              <span className="text-[10px] text-brand-secondary font-mono tracking-widest uppercase block mb-1">Our Agency Rating</span>
              <h4 className="text-xl font-display font-black text-white mb-2">Leon & Team Elite Setup</h4>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Featured inside Analytics Mania & MeasureSchool guides. Over 280 corporate setups deployed.
              </p>
              <div className="flex justify-between items-center text-xs font-mono text-slate-500 bg-white/5 p-2.5 rounded-xl font-semibold border border-white/5">
                <span>Verified Deliveries</span>
                <span className="text-brand-accent">280+ Campaigns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Active Tab Bento Content (span 8) */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory.id}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Primary Bento Block */}
              <div className="glass-card p-8 sm:p-10 rounded-3xl relative overflow-hidden border border-white/5 bg-gradient-to-br from-brand-card to-brand-dark/80">
                <div className="absolute top-0 right-0 w-48 h-48 bg-brand-primary/15 blur-3xl rounded-full pointer-events-none" />
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-white/5 mb-8">
                  <div>
                    <span className="text-brand-secondary text-xs font-mono tracking-widest uppercase mb-1.5 block">
                      {activeCategory.badge}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
                      {activeCategory.title}
                    </h2>
                  </div>

                  {/* Dynamic Graphic Metric */}
                  <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center gap-4 backdrop-blur-md">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center font-bold text-white shadow-md">
                      %
                    </div>
                    <div>
                      <span className="text-lg font-mono font-bold text-white block leading-tight">{activeCategory.metric}</span>
                      <span className="text-[10px] text-slate-500 font-mono block uppercase tracking-wider">{activeCategory.metricLabel}</span>
                    </div>
                  </div>
                </div>

                {/* Services List - click to request action */}
                <span className="text-xs text-slate-500 font-mono uppercase tracking-widest block mb-4">Interactive System Deliverables:</span>
                <div className="space-y-4 mb-4">
                  {activeCategory.servicesList.map((svc, sidx) => (
                    <div 
                      key={sidx}
                      onClick={() => handleServiceSelect(svc.name)}
                      className="group/item flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-white/10 transition-all duration-300 cursor-pointer"
                    >
                      <div className="w-6 h-6 rounded-md bg-brand-primary/10 border border-brand-primary/25 flex items-center justify-center text-brand-secondary shrink-0 group-hover/item:bg-brand-primary group-hover/item:text-white transition-all mt-0.5">
                        <CheckCircle className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-sm font-semibold text-white group-hover/item:text-brand-secondary transition-colors">
                            {svc.name}
                          </h4>
                          <span className="text-[10px] font-semibold text-slate-500 group-hover/item:text-slate-400 group-hover/item:translate-x-1 transition-all flex items-center gap-1">
                            Inquire <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 lines-clamp-2 leading-relaxed">
                          {svc.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Case Study Secondary Bento Block */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Proof Widget */}
                <div className="md:col-span-7 glass-card p-6 rounded-3xl border border-white/10 flex flex-col justify-between bg-brand-dark/40">
                  <div>
                    <span className="text-[10px] text-brand-accent font-mono tracking-widest uppercase block mb-1.5">Deployment Case Audit</span>
                    <h4 className="text-base font-bold text-white mb-2 leading-snug">
                      {activeCategory.caseStudy.headline}
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {activeCategory.caseStudy.description}
                    </p>
                  </div>
                  
                  <div className="border-t border-white/5 pt-4 mt-4 flex items-center justify-between">
                    <span className="text-xs text-slate-400">Achieved Results:</span>
                    <span className="text-sm font-mono font-bold text-brand-accent px-3 py-1.5 rounded-full bg-brand-accent/5 border border-brand-accent/15">
                      {activeCategory.caseStudy.result}
                    </span>
                  </div>
                </div>

                {/* Contact CTA card */}
                <div 
                  onClick={() => navigate('/contact')}
                  className="md:col-span-5 glass-card p-6 rounded-3xl bg-gradient-to-r from-brand-primary to-brand-secondary text-white border-none flex flex-col justify-between cursor-pointer hover:scale-[1.02] hover:-rotate-1 active:scale-[0.98] transition-all shadow-xl shadow-brand-primary/20 relative group"
                >
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity" />
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center">
                      <Zap className="w-5 h-5 text-white animate-pulse" />
                    </div>
                    <span className="text-[9px] font-mono tracking-wider uppercase bg-black/20 px-2.5 py-1 rounded-full text-white/90">Instant Booking</span>
                  </div>
                  
                  <div className="mt-8">
                    <h4 className="text-lg font-display font-black leading-tight mb-1">Schedule Diagnostics Session</h4>
                    <p className="text-[11px] text-white/80 leading-relaxed mb-4">Get custom setups mapped directly to bypass ad blockers today.</p>
                    <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-white">
                      Let's Build <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                    </span>
                  </div>
                </div>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* SEO rich Section Content blocks */}
      <div className="border-t border-white/5 pt-16 grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <div className="p-6 rounded-2xl glass border border-white/5">
          <h4 className="text-base font-bold text-white mb-2 flex items-center gap-2">
            <Shield className="w-4 h-4 text-brand-secondary" /> Secure 256-Bit Cryptography
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            All customer parameters passed downstream to Google Ads or Meta Conversions CAPI undergo client-side salted SHA-256 transformations inside the local container, assuring full GDPR, CCPA, and compliance.
          </p>
        </div>
        <div className="p-6 rounded-2xl glass border border-white/5">
          <h4 className="text-base font-bold text-white mb-2 flex items-center gap-2">
            <Settings className="w-4 h-4 text-brand-primary" /> Multi-Domain Attributions
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Stitch checkout actions across Shopify checkout and customized external payment forms. Restructure double sessions under singular client tracking ids cleanly.
          </p>
        </div>
        <div className="p-6 rounded-2xl glass border border-white/5">
          <h4 className="text-base font-bold text-white mb-2 flex items-center gap-2">
            <LineChart className="w-4 h-4 text-brand-accent" /> 100% Signal Recapture
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            First-party custom proxy containers bypass Safari Intelligent Tracking Prevention rules completely. Extends cookie duration thresholds directly from 7 days up to 180 days.
          </p>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="text-center bg-white/[0.01] border-y border-white/5 py-8 max-w-5xl mx-auto rounded-3xl p-6 mb-12">
        <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase block mb-4">TRUSTED DEPLOYMENT PARTNERS</span>
        <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-6 text-slate-500 font-display text-sm font-bold tracking-widest">
          <span className="hover:text-slate-400 transition-colors">GOOGLE CLOUD</span>
          <span className="hover:text-slate-400 transition-colors">STAPE.IO</span>
          <span className="hover:text-slate-400 transition-colors">SHOPIFY PLUS</span>
          <span className="hover:text-slate-400 transition-colors">META BUSINESS</span>
        </div>
      </div>

    </div>
  );
}
