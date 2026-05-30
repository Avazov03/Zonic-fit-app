import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, CreditCard, ShieldCheck, Lock, ChevronRight, Loader2 } from 'lucide-react';
import { toast } from './Toaster';

interface PaymentSimulationProps {
  amount: string | number;
  productName: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const PaymentSimulation: React.FC<PaymentSimulationProps> = ({ 
  amount, 
  productName, 
  onSuccess, 
  onCancel 
}) => {
  const [step, setStep] = useState<'input' | 'processing' | 'success'>('input');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvc: '' });

  const handlePay = () => {
    // No validation - accept anything for testing as requested
    setStep('processing');
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        onSuccess();
      }, 1500);
    }, 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-md bg-[#111] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl"
      >
        {step === 'input' && (
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-black text-white uppercase tracking-tight">Xavfsiz To'lov</h2>
              <button onClick={onCancel} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <X className="w-5 h-5 text-white/40" />
              </button>
            </div>

            <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 mb-8 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Mahsulot</p>
                <p className="text-sm font-bold text-white capitalize">{productName}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Narxi</p>
                <p className="text-lg font-black text-primary">{Number(amount).toLocaleString()} UZS</p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="bg-white/5 p-4 rounded-xl border border-white/10 mb-4">
                <p className="text-[10px] text-primary font-bold uppercase tracking-widest mb-1 italic">SINAUK REJIMI</p>
                <p className="text-[11px] text-white/60">Istalgan ma'lumotlarni kiritishingiz mumkin, to'lov simulyatsiya qilinadi.</p>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-white/40 ml-1">Karta Raqami</label>
                <div className="relative">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                  <input 
                    type="text" 
                    placeholder="8600 **** **** ****"
                    maxLength={16}
                    className="w-full h-14 bg-white/5 border border-white/10 rounded-xl px-12 text-white font-mono focus:border-primary/50 focus:bg-white/10 outline-none transition-all placeholder:text-white/10"
                    onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-white/40 ml-1">Muddati</label>
                  <input 
                    type="text" 
                    placeholder="MM/YY"
                    maxLength={5}
                    className="w-full h-14 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:border-primary/50 focus:bg-white/10 outline-none transition-all placeholder:text-white/10"
                    onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-white/40 ml-1">CVC</label>
                  <input 
                    type="password" 
                    placeholder="***"
                    maxLength={3}
                    className="w-full h-14 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:border-primary/50 focus:bg-white/10 outline-none transition-all placeholder:text-white/10"
                    onChange={(e) => setCardDetails({...cardDetails, cvc: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <button 
              onClick={handlePay}
              className="w-full h-14 bg-primary text-black font-black uppercase tracking-widest rounded-xl hover:scale-[1.02] active:scale-95 transition-transform flex items-center justify-center gap-2"
            >
              <span>To'lash</span>
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="mt-8 flex items-center justify-center gap-6 text-[10px] text-white/30 uppercase tracking-widest">
              <div className="flex items-center gap-1.5 font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                PCI DSS
              </div>
              <div className="flex items-center gap-1.5 font-bold">
                <Lock className="w-3.5 h-3.5 text-primary" />
                256-BIT SSL
              </div>
            </div>
          </div>
        )}

        {step === 'processing' && (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <Loader2 className="w-16 h-16 text-primary animate-spin mb-6" />
            <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-2">Tranzaksiya</h2>
            <p className="text-white/40 text-sm">Xavfsiz to'lov tizimi orqali so'rov yuborilmoqda...</p>
          </div>
        )}

        {step === 'success' && (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-6">
              <ShieldCheck className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-2">Muvaffaqiyatli!</h2>
            <p className="text-white/40 text-sm">To'lov qabul qilindi. Mahsulot profilingizga qo'shildi.</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};
