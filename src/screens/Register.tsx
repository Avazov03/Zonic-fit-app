import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Mail, Lock, User, ChevronRight, Eye, EyeOff, Bolt } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/onboarding");
  };

  return (
    <div className="flex h-full flex-col bg-surface overflow-hidden relative">
      {/* Background Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/70 z-10" />
        <div 
          className="w-full h-full bg-cover bg-center scale-110 blur-sm opacity-50"
          style={{ 
            backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCb63Q4lNRxHp7huUev5zS8RlbolZlHBtkEt2IPwEuLa3kTH-DVWgdklMVSyR1jIHT4yUKoVOTdzW73usKXisLPt5tvaL2ebfT_hFTB2bKFZ5jcA9A3mkpAjvgfdDi30G5YGneGmbzShqtf5d9zceICxDre2EuvhSEkYSiciwZPmZHfBnSyc3Re_6QdDXTtPR0iik4MelqakB8_nrdN6whG0B3NM60OBHpI_oahS6cdLNyOj1-b48leYYWSt997l7xPaacHtG1X5iTv')" 
          }}
        />
      </div>

      <div className="relative z-20 flex flex-col h-full overflow-y-auto px-7 pt-20 pb-4 no-scrollbar">
        {/* Welcome Text */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <h2 className="text-white text-3xl font-black leading-tight tracking-tight italic-black mb-2 uppercase">
            ZONIC GA <span className="text-primary">QO'SHILING</span>
          </h2>
          <p className="text-white/60 text-sm font-medium uppercase tracking-widest font-mono">Sayohatni bugun boshlang</p>
        </motion.div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-5 flex-1">
          <div className="flex flex-col gap-1.5">
            <label className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] ml-1 font-mono">
              01. ISM VA FAMILIYA
            </label>
            <div className="relative group">
              <input 
                className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-all text-sm" 
                placeholder="ISM VA FAMILIYANGIZNI KIRITING" 
                type="text"
                required
              />
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors w-5 h-5 pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] ml-1 font-mono">
              02. ELEKTRON POCHTA
            </label>
            <div className="relative group">
              <input 
                className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-all text-sm" 
                placeholder="EMAIL@EXAMPLE.COM" 
                type="email"
                required
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors w-5 h-5 pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] ml-1 font-mono">
              03. MAXFIY PAROL
            </label>
            <div className="relative group">
              <input 
                className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-xl py-4 pl-12 pr-12 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-all text-sm" 
                placeholder="••••••••" 
                type={showPassword ? "text" : "password"}
                required
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors w-5 h-5 pointer-events-none" />
              <button 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-primary transition-colors z-10" 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button 
            className="w-full bg-primary hover:bg-primary/90 text-black font-black py-4 rounded-xl transition-all shadow-lg shadow-primary/20 text-sm uppercase tracking-[0.2em] mt-6 flex items-center justify-center gap-2 active:scale-[0.98]" 
            type="submit"
          >
            RO'YXATDAN O'TISH
            <ChevronRight className="w-5 h-5" />
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/5"></div>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-[0.3em]">
            <span className="bg-surface px-4 text-white/20 rounded-full">Yoki</span>
          </div>
        </div>

        {/* Social Auth */}
        <button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3 text-xs uppercase tracking-widest active:scale-[0.98]">
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor" opacity="0.6" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="currentColor" opacity="0.6" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="currentColor" opacity="0.6" />
          </svg>
          Google orqali kirish
        </button>

        {/* Footer Link */}
        <div className="mt-10 text-center">
          <p className="text-white/30 text-xs font-medium uppercase tracking-widest">
            Hisobingiz bormi? 
            <Link to="/login" className="text-primary font-bold hover:underline ml-2">
              Kirish
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
