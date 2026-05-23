import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Calendar, Ruler, Scale, Zap, User, ArrowRight, ShieldCheck, Globe } from "lucide-react";
import { cn } from "@/src/lib/utils";

export default function Onboarding() {
  const navigate = useNavigate();
  const [country, setCountry] = useState("O'zbekiston");
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [city, setCity] = useState("Toshkent shahri");
  const [age, setAge] = useState("25");
  const [height, setHeight] = useState("175");
  const [weight, setWeight] = useState("70");
  const [gender, setGender] = useState<"Erkak" | "Ayol">("Erkak");
  const [level, setLevel] = useState<"Boshlang'ich" | "Professional">("Boshlang'ich");
  const [isSaving, setIsSaving] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);

  const COUNTRIES = [
    "O'zbekiston", "Qozog'iston", "Qirg'iziston", "Tojikiston", "Turkmaniston", 
    "Rossiya", "Boshqa davlatlar"
  ];

  const REGIONS = [
    "Toshkent shahri", "Toshkent viloyati", "Samarqand viloyati", "Buxoro viloyati", 
    "Farg'ona viloyati", "Andijon viloyati", "Namangan viloyati", 
    "Qashqadaryo viloyati", "Surxondaryo viloyati", "Xorazm viloyati", 
    "Navoiy viloyati", "Sirdaryo viloyati", "Jizzax viloyati", 
    "Qoraqalpog'iston Resp."
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API delay
    setTimeout(() => {
      navigate("/map");
    }, 1500);
  };

  return (
    <div className="flex h-[100dvh] flex-col bg-surface overflow-hidden relative selection:bg-primary/30">
      {/* Background Overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-20 grayscale"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=2070&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-surface via-surface/90 to-surface/40" />

      <div className="relative z-10 flex flex-col h-full overflow-y-auto px-6 pt-16 pb-12 no-scrollbar">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-[10px] uppercase tracking-[0.3em] text-primary mb-2 font-mono">Profile Configuration</h1>
          <h2 className="text-3xl italic-black text-white leading-none">
            DATA <span className="text-white/40">SYNC</span>
          </h2>
          <p className="text-white/30 text-xs mt-3 uppercase tracking-widest leading-relaxed">
            Ilovani shaxsiylashtirish uchun parametrlaringizni kiriting
          </p>
        </motion.div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 flex-1 pb-10">
          
          {/* Country */}
          <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{delay: 0.05}} className="flex flex-col gap-2 relative z-[60]">
            <label className="text-white/30 text-[9px] uppercase tracking-[0.2em] ml-1 font-mono flex items-center gap-2">
              <span className="text-primary tracking-tighter">01.</span> DAVLAT (COUNTRY)
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                className="w-full h-[54px] pl-12 pr-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-white text-sm focus:border-primary/50 outline-none transition-all uppercase tracking-widest font-black flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Globe className="absolute left-4 w-4 h-4 text-white/50 pointer-events-none" />
                  <span className="truncate">{country}</span>
                </div>
                <motion.div
                  animate={{ rotate: isCountryDropdownOpen ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <ArrowRight className="w-4 h-4 text-white/40 rotate-90" />
                </motion.div>
              </button>

              <AnimatePresence>
                {isCountryDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="absolute top-16 left-0 w-full bg-[#1a1a1a] border border-white/10 rounded-xl p-2 shadow-2xl z-[100] flex flex-col gap-1 backdrop-blur-xl max-h-48 overflow-y-auto no-scrollbar"
                  >
                    {COUNTRIES.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => {
                          setCountry(c);
                          setIsCountryDropdownOpen(false);
                          if (c !== "O'zbekiston") {
                            setCity("Boshqa");
                          } else {
                            setCity("Toshkent shahri");
                          }
                        }}
                        className={cn(
                          "w-full text-left px-4 py-3 rounded-lg transition-all duration-300 font-black uppercase text-[10px] tracking-widest",
                          country === c 
                            ? "bg-white/10 text-white" 
                            : "text-white/60 hover:bg-white/5 hover:text-white"
                        )}
                      >
                        {c}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* City */}
          <AnimatePresence>
            {country === "O'zbekiston" && (
              <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} exit={{opacity:0, height:0}} transition={{delay: 0.1}} className="flex flex-col gap-2 relative z-50 overflow-visible">
                <label className="text-white/30 text-[9px] uppercase tracking-[0.2em] ml-1 font-mono flex items-center gap-2">
                  <span className="text-primary tracking-tighter">02.</span> HUDUD (LOCATION)
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                    className="w-full h-[54px] pl-12 pr-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-white text-sm focus:border-primary/50 outline-none transition-all uppercase tracking-widest font-black flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="absolute left-4 w-4 h-4 text-[#CCFF00] pointer-events-none" />
                      <span className="truncate">{city}</span>
                    </div>
                    <motion.div
                      animate={{ rotate: isCityDropdownOpen ? 180 : 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <ArrowRight className="w-4 h-4 text-white/40 rotate-90" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {isCityDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className="absolute top-16 left-0 w-full bg-[#1a1a1a] border border-white/10 rounded-xl p-2 shadow-2xl z-[100] flex flex-col gap-1 backdrop-blur-xl max-h-48 overflow-y-auto no-scrollbar"
                      >
                        {REGIONS.map((region) => (
                          <button
                            key={region}
                            type="button"
                            onClick={() => {
                              setCity(region);
                              setIsCityDropdownOpen(false);
                            }}
                            className={cn(
                              "w-full text-left px-4 py-3 rounded-lg transition-all duration-300 font-black uppercase text-[10px] tracking-widest",
                              city === region 
                                ? "bg-[#CCFF00]/10 text-[#CCFF00]" 
                                : "text-white/60 hover:bg-white/5 hover:text-white"
                            )}
                          >
                            {region}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-2 gap-4">
            {/* Age */}
            <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{delay: 0.2}} className="flex flex-col gap-2">
              <label className="text-white/30 text-[9px] uppercase tracking-[0.2em] ml-1 font-mono flex items-center gap-2">
                <span className="text-primary tracking-tighter">03.</span> AGE (Yosh)
              </label>
              <div className="relative flex items-center group">
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full h-[54px] pl-10 pr-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-white text-sm placeholder:text-white/20 focus:border-primary/50 focus:ring-0 outline-none transition-all uppercase font-black"
                  required
                />
                <Calendar className="absolute left-3.5 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors pointer-events-none" />
              </div>
            </motion.div>

            {/* Height */}
            <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{delay: 0.3}} className="flex flex-col gap-2">
              <label className="text-white/30 text-[9px] uppercase tracking-[0.2em] ml-1 font-mono flex items-center gap-2">
                <span className="text-primary tracking-tighter">04.</span> HEIGHT (Bo'y)
              </label>
              <div className="relative flex items-center group">
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full h-[54px] pl-10 pr-9 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-white text-sm placeholder:text-white/20 focus:border-primary/50 focus:ring-0 outline-none transition-all uppercase font-black"
                  required
                />
                <Ruler className="absolute left-3.5 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors pointer-events-none" />
                <span className="absolute right-4 text-[10px] text-white/30 font-bold uppercase">cm</span>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Weight */}
            <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{delay: 0.4}} className="flex flex-col gap-2">
              <label className="text-white/30 text-[9px] uppercase tracking-[0.2em] ml-1 font-mono flex items-center gap-2">
                <span className="text-primary tracking-tighter">05.</span> WEIGHT (Vazn)
              </label>
              <div className="relative flex items-center group">
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full h-[54px] pl-10 pr-9 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-white text-sm placeholder:text-white/20 focus:border-primary/50 focus:ring-0 outline-none transition-all uppercase font-black"
                  required
                />
                <Scale className="absolute left-3.5 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors pointer-events-none" />
                <span className="absolute right-4 text-[10px] text-white/30 font-bold uppercase">kg</span>
              </div>
            </motion.div>

            {/* Gender Toggle */}
            <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{delay: 0.5}} className="flex flex-col gap-2">
              <label className="text-white/30 text-[9px] uppercase tracking-[0.2em] ml-1 font-mono flex items-center gap-2">
                <span className="text-primary tracking-tighter">—</span> JINS (Gender)
              </label>
              <div className="flex bg-white/5 p-1 rounded-xl relative z-10 w-full overflow-hidden h-[54px]">
                {(["Erkak", "Ayol"] as const).map(tab => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setGender(tab)}
                    className={cn(
                      "flex-1 relative flex flex-col items-center justify-center transition-colors duration-300 rounded-lg",
                      gender === tab ? "text-black" : "text-white/40 hover:text-white"
                    )}
                  >
                    {gender === tab && (
                      <motion.div
                        layoutId="activeGenderTab"
                        className="absolute inset-0 bg-[#CCFF00] shadow-[0_0_15px_rgba(204,255,0,0.3)] z-[-1]"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        style={{ borderRadius: 8 }}
                      />
                    )}
                    <span className="text-[9px] font-black uppercase tracking-widest relative z-10">{tab}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Level Toggle */}
          <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{delay: 0.6}} className="flex flex-col gap-2 mt-2">
            <label className="text-white/30 text-[9px] uppercase tracking-[0.2em] ml-1 font-mono flex items-center gap-2">
              <span className="text-primary tracking-tighter">06.</span> EXPERIENCE LEVEL
            </label>
            <div className="flex bg-white/5 p-1 rounded-xl relative z-10 w-full overflow-hidden">
              {(["Boshlang'ich", "Professional"] as const).map(tab => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setLevel(tab)}
                  className={cn(
                    "flex-1 relative py-4 flex flex-col items-center justify-center gap-1.5 transition-colors duration-300 rounded-lg",
                    level === tab ? "text-black" : "text-white/40 hover:text-white"
                  )}
                >
                  {level === tab && (
                    <motion.div
                      layoutId="activeLevelTab"
                      className="absolute inset-0 bg-primary shadow-[0_0_15px_rgba(204,255,0,0.3)] z-[-1]"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      style={{ borderRadius: 8 }}
                    />
                  )}
                  {tab === "Boshlang'ich" ? <User className="w-5 h-5 mb-1 relative z-10" /> : <Zap className="w-5 h-5 mb-1 relative z-10" />}
                  <span className="text-[10px] font-black uppercase tracking-widest relative z-10">{tab}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{delay: 0.7}} className="mt-8">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full h-[60px] bg-primary text-black italic-black text-sm rounded-full shadow-[0_0_20px_rgba(204,255,0,0.2)] active:scale-[0.97] transition-all tracking-widest flex items-center justify-center gap-3 relative overflow-hidden"
            >
              <AnimatePresence mode="wait">
                {isSaving ? (
                  <motion.div 
                    key="saving"
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    <span>SYNCING...</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="save"
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    SAVE & ENTER <ArrowRight className="w-4 h-4 ml-1" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </motion.div>
        </form>
      </div>
    </div>
  );
}
