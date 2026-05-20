import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart2, Mail, Phone, MapPin } from 'lucide-react';
import { db } from '../lib/database';

export default function Footer() {
  const settings = db.getSettings();
  
  // Dynamic settings fallback values
  const logoText = settings?.logoText || "Growthuper";
  const contactEmail = settings?.contactEmail || "hello@growthuper.com";
  const contactPhone = settings?.contactPhone || "+8801336339475";
  const footerText = settings?.footerText || `© ${new Date().getFullYear()} Growthuper. All rights reserved.`;

  // Standardize the numeric sequence for WhatsApp link redirects
  const rawNumber = contactPhone.replace(/[^0-9]/g, '');
  const whLink = settings?.whatsappLink || `https://wa.me/${rawNumber ? rawNumber : "8801336339475"}`;

  return (
    <footer className="bg-brand-darker pt-20 pb-10 border-t border-white/5 relative z-10 mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 mb-6 group">
              <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center">
                <BarChart2 className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-white group-hover:text-brand-secondary transition-colors">{logoText}</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              Premium analytics agency and digital education platform dedicated to scaling your business with precision data.
            </p>
          </div>

          <div>
            <h3 className="font-display font-semibold text-white mb-6">Services</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link to="/services" className="hover:text-brand-secondary transition-colors">GA4 & GTM Setup</Link></li>
              <li><Link to="/services" className="hover:text-brand-secondary transition-colors">Server Side Tracking</Link></li>
              <li><Link to="/services" className="hover:text-brand-secondary transition-colors">Meta & TikTok Pixel</Link></li>
              <li><Link to="/services" className="hover:text-brand-secondary transition-colors">Shopify Tracking</Link></li>
              <li><Link to="/services" className="hover:text-brand-secondary transition-colors">Funnel Analytics</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-semibold text-white mb-6">Company</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link to="/courses" className="hover:text-brand-accent transition-colors">Premium Courses</Link></li>
              <li><Link to="/contact" className="hover:text-brand-accent transition-colors">Contact Us</Link></li>
              <li><Link to="/admin" className="hover:text-brand-accent transition-colors font-mono font-bold text-amber-500/80">CMS Admin Command</Link></li>
              <li><span className="opacity-40 cursor-not-allowed select-none">Privacy Directive</span></li>
              <li><span className="opacity-40 cursor-not-allowed select-none">License Terms</span></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-semibold text-white mb-6">Contact Channels</h3>
            <ul className="space-y-4 text-sm text-slate-400">
              <li className="flex items-start gap-3 col-span-1">
                <Phone className="w-5 h-5 text-brand-primary shrink-0" />
                <a href={whLink} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors select-all font-mono font-bold text-brand-secondary">
                  {contactPhone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-brand-secondary shrink-0" />
                <a href={`mailto:${contactEmail}`} className="hover:text-white transition-colors font-mono font-semibold">
                  {contactEmail}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-accent shrink-0" />
                <span className="text-xs">Dhaka, Bangladesh &bull; Worldwide Delivery</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p className="font-mono text-xs text-slate-500">{footerText}</p>
          <div className="flex gap-4 text-[11px] uppercase tracking-wider font-mono">
            <span className="text-brand-primary">Lighthouse 99</span>
            <span className="text-brand-secondary">Core Web Vitals Optimized</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
