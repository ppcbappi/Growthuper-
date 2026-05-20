import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Download, CheckCircle, Shield, Award, Search, HelpCircle, FileCheck, ArrowLeft } from 'lucide-react';
import { db, Certificate } from '../lib/database';

export default function CertificateView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cert, setCert] = useState<Certificate | null>(null);
  const [searchId, setSearchId] = useState('');
  const [searched, setSearched] = useState(false);
  const [searchResult, setSearchResult] = useState<Certificate | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (id) {
      // Find dynamic verified certificate record by code
      const found = db.verifyCertificate(id);
      setCert(found);
    }
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    if (!searchId.trim()) {
      setSearchResult(null);
      return;
    }
    const found = db.verifyCertificate(searchId.trim());
    setSearchResult(found);
  };

  // If we are looking up a valid certificate directly from the URL
  if (id && cert) {
    return (
      <div className="min-h-screen bg-[#F0F2F5] text-slate-800 flex flex-col pt-32 pb-20 print:bg-white print:p-0 print:m-0">
        <div className="max-w-4xl mx-auto w-full px-4 print:max-w-none print:px-0">
          
          {/* Controls */}
          <div className="flex justify-between items-center mb-8 print:hidden">
             <button 
               onClick={() => navigate('/dashboard')} 
               className="text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-1 transition-colors"
             >
               <ArrowLeft className="w-4 h-4" /> Return to Dashboard
             </button>
             <button 
               onClick={handlePrint} 
               className="flex items-center gap-2 bg-brand-primary hover:bg-brand-primary/95 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg hover:scale-105 active:scale-95"
             >
               <Download className="w-4 h-4" /> Save / Download PDF (Landscape)
             </button>
          </div>

          {/* Certificate Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[32px] shadow-2xl p-6 border-8 border-slate-100 relative overflow-hidden print:shadow-none print:border-none print:rounded-none aspect-[1.414/1] w-full flex items-center justify-center"
          >
            {/* Double Border Frame */}
            <div className="absolute inset-4 border-[4px] border-double border-slate-300 pointer-events-none print:inset-8" />
            
            {/* Textured backdrop */}
            <div className="absolute inset-0 bg-[radial-gradient(#f0f0f0_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

            {/* Aesthetic Corner Brackets */}
            <div className="absolute top-6 left-6 w-12 h-12 border-t-2 border-l-2 border-[#10B981] print:top-10 print:left-10" />
            <div className="absolute top-6 right-6 w-12 h-12 border-t-2 border-r-2 border-[#10B981] print:top-10 print:right-10" />
            <div className="absolute bottom-6 left-6 w-12 h-12 border-b-2 border-l-2 border-[#10B981] print:bottom-10 print:left-10" />
            <div className="absolute bottom-6 right-6 w-12 h-12 border-b-2 border-r-2 border-[#10B981] print:bottom-10 print:right-10" />

            <div className="relative z-10 w-full px-8 md:px-16 text-center pb-6 pt-8 flex flex-col justify-between h-full">
              
              {/* Logo & Header branding */}
              <div className="flex items-center justify-center gap-3 mb-4">
                 <div className="w-10 h-10 bg-gradient-to-br from-[#10B981] to-brand-primary rounded-xl flex items-center justify-center shadow-lg transform rotate-3">
                   <Shield className="w-5 h-5 text-white" />
                 </div>
                 <span className="font-display font-black text-2xl tracking-normal text-slate-900">Growthuper</span>
                 <span className="text-xs uppercase bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md font-mono border border-emerald-200">VERIFIED CODE</span>
              </div>

              <div className="space-y-4">
                <p className="text-xs font-bold text-[#10B981] uppercase tracking-[0.25em]">International Tracking Certification of Excellence</p>
                <p className="text-slate-400 text-xs italic">Honorable validation conferred upon</p>
                
                <h2 className="text-3xl md:text-5xl font-display font-extrabold text-slate-900 border-b-2 border-slate-200 pb-2 inline-block px-10">
                  {cert.userName}
                </h2>
                
                <p className="text-slate-500 text-xs max-w-md mx-auto leading-relaxed">
                  for successfully finishing all strategic studies, cloud tag deployment setups, and deduplication audit test scores for the designated curriculum of:
                </p>
                
                <h3 className="text-xl md:text-3xl font-display font-black text-slate-800 tracking-tight">
                  {cert.courseTitle}
                </h3>
              </div>

              {/* Dynamic Signatures footer */}
              <div className="flex items-end justify-between px-4 w-full max-w-2xl mx-auto mt-6">
                 <div className="text-center">
                   <div className="border-b border-slate-200 w-28 pb-1 mb-1">
                     <p className="font-mono text-xs text-slate-700">{cert.issuedAt}</p>
                   </div>
                   <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Issue Date</p>
                 </div>

                 <div className="flex flex-col items-center">
                   <div className="w-14 h-14 rounded-full bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center relative">
                     <CheckCircle className="w-7 h-7 text-[#10B981]" />
                   </div>
                   <span className="text-[9px] font-mono text-slate-400 mt-1.5 font-bold">VERIFICATION: {cert.verificationId}</span>
                 </div>

                 <div className="text-center">
                   <div className="border-b border-slate-200 w-36 pb-1 mb-1 relative">
                     {/* Dynamic tracking expert generic sign */}
                     <span className="font-serif text-xl italic text-slate-800 absolute bottom-0 left-4 rotate-[-4deg]">Leon Chowdhury</span>
                   </div>
                   <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Lead Analytics Auditor</p>
                 </div>
              </div>

            </div>
          </motion.div>
          
          {/* Certificate QR / Public verification descriptor footer */}
          <div className="mt-6 p-4 rounded-2xl bg-white text-xs border border-slate-200 flex justify-between items-center print:hidden">
            <span className="text-slate-500">This certificate is fully registered under verification token <strong className="text-slate-800">{cert.verificationId}</strong>. You can share this URL with employers to verify your tracking capabilities.</span>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => setCopied(false), 3000);
              }}
              className="font-bold text-brand-primary hover:text-brand-primary/80 transition-all font-mono text-xs"
            >
              {copied ? "✓ Link Copied!" : "Copy Verification Link"}
            </button>
          </div>

        </div>

        <style dangerouslySetInnerHTML={{__html: `
          @media print {
            body { background: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; color: #111 !important; }
            header, nav, footer, .print\\:hidden, button { display: none !important; }
            @page { size: landscape; margin: 0.5cm; }
          }
        `}} />
      </div>
    );
  }

  // If we are showing the certification lookup validator screen
  return (
    <div className="min-h-screen bg-brand-dark flex flex-col justify-center items-center py-28 px-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[-1]">
        <div className="absolute top-1/4 left-1/4 w-[50%] h-[50%] bg-emerald-500/10 blur-[150px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/5 border border-white/10 p-8 sm:p-10 rounded-3xl backdrop-blur-md shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4 text-emerald-400 font-bold">
            <Award className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-display font-black text-white mb-2">Academic Registry</h1>
          <p className="text-sm text-slate-400">Growthuper dynamic completion authentication search</p>
        </div>

        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">Enter Certificate Verification ID (GT-XXXXXX)</label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input 
                type="text"
                required
                value={searchId}
                onChange={e => setSearchId(e.target.value)}
                placeholder="e.g. GT-RH82K"
                className="w-full p-3.5 pl-12 bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all font-mono font-semibold"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 font-bold text-sm text-[#060813] tracking-wide rounded-xl transition-all shadow-lg flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <FileCheck className="w-4 h-4" /> Verify Credentials Now
          </button>
        </form>

        {searched && (
          <div className="mt-8 pt-6 border-t border-white/10">
            {searchResult ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="font-bold">Credential Authenticated!</span>
                </div>
                <div className="text-xs text-slate-300 space-y-1 font-mono">
                  <p>Certified Student: <span className="text-white font-sans font-semibold">{searchResult.userName}</span></p>
                  <p>Qualified Curriculum: <span className="text-white font-sans font-semibold">{searchResult.courseTitle}</span></p>
                  <p>Issue Date: <span className="text-white">{searchResult.issuedAt}</span></p>
                </div>
                <button 
                  onClick={() => navigate(`/certificates/${searchResult.verificationId}`)}
                  className="w-full py-2 bg-emerald-500/20 text-emerald-300 rounded font-bold text-xs hover:bg-emerald-500/30 transition-all inline-block text-center mt-2"
                >
                  View Printable Artboard Certificate
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex gap-2">
                <HelpCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold">Certificate Not Found</h4>
                  <p className="text-xs text-rose-300/80 mt-1">Please confirm you typed the exact verification format ID. E.g., user completion code.</p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 text-center text-xs text-slate-500">
          <button 
            onClick={() => navigate('/dashboard')}
            className="text-slate-400 hover:text-white transition-colors"
          >
            &larr; Return to Workspace
          </button>
        </div>
      </motion.div>
    </div>
  );
}
