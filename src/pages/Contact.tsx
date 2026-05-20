import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquareCode, Globe, Layers } from 'lucide-react';
import { db, SiteSettings } from '../lib/database';

export default function Contact() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    websiteUrl: '',
    service: 'GA4 Setup',
    budgetRange: '$1,000 - $3,000',
    message: ''
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setSettings(db.getSettings());
  }, []);

  const serviceOptions = [
    'GA4 Setup',
    'GTM Setup',
    'Server Side Tracking',
    'Shopify Tracking',
    'Meta Pixel Setup',
    'TikTok Pixel Setup',
    'Conversion API',
    'Google Ads Tracking',
    'Funnel Tracking',
    'DataLayer Setup',
    'Analytics Consulting'
  ];

  const budgetOptions = [
    'Under $1,000',
    '$1,000 - $3,000',
    '$3,000 - $5,000',
    '$5,000 - $10,000',
    '$10,000+'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Save submission inside relational database
    db.submitContact(
      formData.firstName.trim(),
      formData.lastName.trim(),
      formData.email.trim(),
      formData.phone.trim(),
      formData.websiteUrl.trim(),
      formData.service,
      formData.budgetRange,
      formData.message.trim()
    );

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        websiteUrl: '',
        service: 'GA4 Setup',
        budgetRange: '$1,000 - $3,000',
        message: ''
      });
    }, 1000);
  };

  const contactEmail = settings?.contactEmail || 'hello@growthuper.com';
  const contactPhone = settings?.contactPhone || '+880 133 633 9475';
  const officeLocation = settings?.officeLocation || 'Dhaka, Bangladesh';

  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-6">
      <div className="text-center mb-16">
        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
        >
          Let's <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">Connect</span>
        </motion.h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-base">
          Get elite-grade custom analytics deployments directly on your platforms, or consult on curriculum support with our specialists.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Contact Info Column */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-5 space-y-6"
        >
          <div className="glass-card p-8 rounded-3xl relative overflow-hidden group border border-white/5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 blur-3xl rounded-full" />
            <div className="relative z-10 flex gap-5">
              <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-brand-secondary" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold mb-1 text-white">Direct Hotline</h3>
                <p className="text-slate-400 text-xs mb-3">WhatsApp support for swift setup scheduling and audits.</p>
                <a 
                  href={`https://wa.me/${contactPhone.replace(/[\s\+]/g, '')}`} 
                  className="text-lg font-mono font-bold text-white hover:text-brand-secondary transition-colors"
                >
                  {contactPhone}
                </a>
              </div>
            </div>
          </div>

          <div className="glass-card p-8 rounded-3xl relative overflow-hidden group border border-white/5 mx-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-secondary/10 blur-3xl rounded-full" />
            <div className="relative z-10 flex gap-5">
              <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-brand-primary" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold mb-1 text-white">Email Communications</h3>
                <p className="text-slate-400 text-xs mb-3">Reach our technical dispatchers and instructor networks directly.</p>
                <a 
                  href={`mailto:${contactEmail}`} 
                  className="text-base font-medium text-slate-200 hover:text-brand-primary transition-colors"
                >
                  {contactEmail}
                </a>
              </div>
            </div>
          </div>

          <div className="glass-card p-8 rounded-3xl relative overflow-hidden group border border-white/5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/10 blur-3xl rounded-full" />
            <div className="relative z-10 flex gap-5">
              <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-brand-accent" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold mb-1 text-white">Office Headquarters</h3>
                <p className="text-slate-400 text-xs mb-3">Managing campaigns across EU, APAC, and US markets.</p>
                <p className="text-slate-200 text-base font-medium">{officeLocation}</p>
                <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase mt-2 block">Operating Globally</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact Form Column */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-7 glass-card p-8 sm:p-10 rounded-3xl relative border border-white/5"
        >
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div
                key="contact-fields"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h3 className="font-display text-2xl font-bold mb-6 text-white flex items-center gap-2">
                  <MessageSquareCode className="w-6 h-6 text-brand-secondary" /> Request Agency Audit
                </h3>
                
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">First Name</label>
                      <input 
                        type="text" 
                        required
                        value={formData.firstName}
                        onChange={e => setFormData({...formData, firstName: e.target.value})}
                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all" 
                        placeholder="John" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Last Name</label>
                      <input 
                        type="text" 
                        required
                        value={formData.lastName}
                        onChange={e => setFormData({...formData, lastName: e.target.value})}
                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all" 
                        placeholder="Doe" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Email Address</label>
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all" 
                        placeholder="name@company.com" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Phone Number</label>
                      <input 
                        type="text" 
                        required
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all" 
                        placeholder="+88017xxxxxxxx" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-brand-secondary" /> Website URL
                    </label>
                    <input 
                      type="url" 
                      required
                      value={formData.websiteUrl}
                      onChange={e => setFormData({...formData, websiteUrl: e.target.value})}
                      className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all" 
                      placeholder="https://yourbrand.com" 
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-brand-primary" /> Service Required
                      </label>
                      <select 
                        value={formData.service}
                        onChange={e => setFormData({...formData, service: e.target.value})}
                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all appearance-none cursor-pointer"
                      >
                        {serviceOptions.map(opt => (
                          <option key={opt} value={opt} className="bg-brand-dark text-white">{opt}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider flex items-center gap-1">
                        <span className="text-brand-accent text-xs">$</span> Monthly Ad Budget Range
                      </label>
                      <select 
                        value={formData.budgetRange}
                        onChange={e => setFormData({...formData, budgetRange: e.target.value})}
                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all appearance-none cursor-pointer"
                      >
                        {budgetOptions.map(opt => (
                          <option key={opt} value={opt} className="bg-brand-dark text-white">{opt}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Detailed Message</label>
                    <textarea 
                      rows={4} 
                      required
                      value={formData.message}
                      onChange={e => setFormData({...formData, message: e.target.value})}
                      className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all resize-none" 
                      placeholder="Outline your funnels, current ad spend volume, or e-commerce tracking limitations..."
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full py-4 bg-white text-brand-dark hover:bg-brand-secondary hover:text-brand-dark transition-all rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 group mt-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-brand-dark/30 border-t-brand-dark rounded-full animate-spin" />
                    ) : (
                      <>Submit Tracking Proposal <Send className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" /></>
                    )}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success-form"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 bg-brand-accent/10 border border-brand-accent/30 text-brand-accent rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-display font-bold text-2xl text-white mb-2">Proposal Received!</h3>
                <p className="text-slate-400 text-sm max-w-sm mx-auto mb-8">
                  Your pipeline objectives are successfully written to the relational database. Our analytics dispatchers will compile a tracking brief and email you within 2 business hours.
                </p>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl text-xs transition-all border border-white/5 cursor-pointer"
                >
                  Send another inquiry
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
