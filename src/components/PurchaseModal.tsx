import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, Copy, AlertCircle } from 'lucide-react';
import { db } from '../lib/database';

interface PurchaseModalProps {
  course: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function PurchaseModal({ course, isOpen, onClose }: PurchaseModalProps) {
  const [method, setMethod] = useState<'bkash' | 'nagad' | 'rocket' | null>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Select, 2: Instructions, 3: Success
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [formData, setFormData] = useState({
    senderNumber: '',
    transactionId: ''
  });

  if (!isOpen) return null;

  const paymentNumber = "+8801336339475";
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(paymentNumber);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    const currentUser = db.getSession();
    if (!currentUser) {
      setErrorMsg('You must be signed in to purchase a course. Please sign in first.');
      setIsSubmitting(false);
      return;
    }

    if (!method) {
      setErrorMsg('Please select a payment method.');
      setIsSubmitting(false);
      return;
    }

    try {
      // Save genuine transaction entry in standard PostgreSQL relation format
      db.createTransaction(
        currentUser.id,
        currentUser.email,
        course.id,
        method,
        formData.senderNumber.trim(),
        formData.transactionId.trim(),
        course.price
      );
      
      setStep(3);
    } catch (err: any) {
      setErrorMsg(err.message || 'Transaction submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="glass-card w-full max-w-lg rounded-3xl overflow-hidden relative z-10 flex flex-col max-h-[90vh]"
        >
          <div className="p-6 border-b border-white/5 flex items-center justify-between bg-brand-dark/50">
            <h3 className="font-display font-semibold text-xl">Enroll in Course</h3>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 md:p-8 overflow-y-auto">
            {step !== 3 && (
              <div className="mb-8 p-4 rounded-xl bg-white/5 border border-white/10 flex gap-4 items-center">
                <img src={course?.image} className="w-16 h-12 object-cover rounded-md" alt="Course" />
                <div>
                  <h4 className="font-semibold text-sm">{course?.title}</h4>
                  <p className="font-mono text-brand-accent font-bold mt-1">{course?.price}</p>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-4 text-sm text-slate-300">Select Payment Method (Bangladesh Multi-Channel)</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'bkash', name: 'bKash', color: 'bg-pink-600' },
                      { id: 'nagad', name: 'Nagad', color: 'bg-orange-600' },
                      { id: 'rocket', name: 'Rocket', color: 'bg-purple-700' }
                    ].map(pm => (
                      <button
                        key={pm.id}
                        onClick={() => { setMethod(pm.id as any); setStep(2); }}
                        className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all hover:-translate-y-1 ${method === pm.id ? 'border-brand-primary bg-brand-primary/20' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
                      >
                        <div className={`w-8 h-8 rounded-full ${pm.color} flex items-center justify-center font-bold text-xs`}>
                          {pm.name[0]}
                        </div>
                        <span className="text-sm font-medium">{pm.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <form onSubmit={handleSubmit} className="space-y-6">
                {errorMsg && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium flex gap-2">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}
                <div className="p-4 rounded-xl bg-brand-primary/10 border border-brand-primary/30 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-2 opacity-10">
                     {/* Watermark or icon */}
                   </div>
                   <h4 className="font-semibold text-brand-primary mb-2 flex items-center justify-between">
                      <span className="flex items-center gap-2"><AlertCircle className="w-4 h-4" /> Send Money to this Number</span>
                      {isCopied && <span className="text-[11px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded animate-pulse">Number Copied!</span>}
                   </h4>
                   <div className="flex items-center justify-between bg-black/40 p-3 rounded-lg border border-white/5">
                      <span className="font-mono text-lg tracking-wider">{paymentNumber}</span>
                      <button type="button" onClick={handleCopy} className="p-2 bg-white/10 hover:bg-white/20 rounded-md transition-colors text-white cursor-pointer">
                        <Copy className="w-4 h-4" />
                      </button>
                   </div>
                   <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                     1. Open your {method} app.<br/>
                     2. Use "Send Money" or "Payment".<br/>
                     3. Please send exactly {course?.price}.<br/>
                     4. Copy the Transaction ID here after successful payment.
                   </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-white/5">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Sender {method} Number</label>
                    <input 
                      type="text" 
                      required
                      value={formData.senderNumber}
                      onChange={e => setFormData({...formData, senderNumber: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all"
                      placeholder="e.g. 01xxxxxxxxx"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Transaction ID</label>
                    <input 
                      type="text" 
                      required
                      value={formData.transactionId}
                      onChange={e => setFormData({...formData, transactionId: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all"
                      placeholder="e.g. 9K2A3G8D..."
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setStep(1)} className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors font-medium">
                    Back
                  </button>
                  <button type="submit" className="flex-1 py-3 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-xl font-medium transition-all shadow-lg shadow-brand-primary/30 flex items-center justify-center gap-2">
                    Verify Payment
                  </button>
                </div>
              </form>
            )}

            {step === 3 && (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-brand-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-brand-accent" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-3">Verification Pending</h3>
                <p className="text-slate-400 max-w-sm mx-auto mb-8">
                  Your payment details have been submitted securely. Our team will verify the transaction and unlock your access within 1-6 hours.
                </p>
                <button onClick={onClose} className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all">
                  Return to Courses
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
