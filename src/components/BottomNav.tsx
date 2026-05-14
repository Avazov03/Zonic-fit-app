import { ShoppingBag, MessageCircle, Trophy, Users, Play, Home, MapPin, Navigation, ArrowRight } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/src/lib/utils";
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const isMapPage = location.pathname === "/map";
  const isActiveRunPage = location.pathname === "/active-run";

  if (isActiveRunPage) return null;

  const navItems = [
    { icon: ShoppingBag, label: "Market", path: "/market" },
    { icon: MessageCircle, label: "Hamjamiyat", path: "/feed" },
    { 
      icon: isMapPage ? Play : Home, 
      label: isMapPage ? "START" : "HOME", 
      path: "/map", 
      isCenter: true 
    },
    { icon: Trophy, label: "Reyting", path: "/leaderboard" },
    { icon: Users, label: "Jamoa", path: "/clan" },
  ];

  const handleCenterClick = (e: React.MouseEvent) => {
    if (isMapPage) {
      e.preventDefault();
      setIsSheetOpen(true);
    }
  };

  return (
    <>
      <nav className="absolute bottom-6 left-[19px] right-[19px] z-50 bg-white/[0.08] backdrop-blur-3xl border border-white/10 px-2 py-2 flex items-center justify-around rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
        {/* Glass reflection effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
        
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          if (item.isCenter) {
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleCenterClick}
                className="relative flex flex-col items-center justify-center group flex-1"
              >
                <div className={cn(
                  "flex items-center justify-center bg-primary text-black rounded-full h-[50px] w-[50px] shadow-[0_0_20px_rgba(204,255,0,0.3)] transition-all hover:scale-110 active:scale-95 border-2 border-white/10",
                  isMapPage ? "scale-105" : "scale-100"
                )}>
                  <item.icon className={cn("w-6 h-6", isMapPage && "fill-current ml-0.5")} />
                </div>
                <span className={cn(
                  "text-[8.5px] font-black uppercase tracking-[0.15em] mt-1.5 transition-colors",
                  isMapPage ? "text-primary" : "text-white/40"
                )}>
                  {item.label}
                </span>
              </Link>
            );
          }

        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-all",
              isActive ? "text-primary scale-105" : "text-white/30 hover:text-white"
            )}
          >
            <item.icon className={cn("transition-all", isActive ? "w-[22px] h-[22px]" : "w-[20px] h-[20px]")} />
            <span className={cn(
              "font-bold uppercase tracking-tighter transition-all",
              isActive ? "text-[10px] opacity-100" : "text-[9px] opacity-60"
            )}>
              {item.label}
            </span>
          </Link>
        );
      })}
      </nav>

      {/* Bottom Sheet Modal */}
      <AnimatePresence>
        {isSheetOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSheetOpen(false)}
              className="absolute inset-0 z-[60] bg-black/80 backdrop-blur-md"
            />
            
            {/* Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ 
                type: "spring", 
                damping: 18, 
                stiffness: 150,
                mass: 0.8
              }}
              className="absolute bottom-0 left-0 right-0 z-[70] bg-[#0A0A0A] border-t border-white/10 rounded-t-[40px] p-6 pb-10 shadow-[0_-20px_80px_rgba(0,0,0,0.8)]"
            >
              {/* Handle */}
              <div className="w-12 h-1 bg-white/10 rounded-full mx-auto mb-8" />
              
              <div className="mb-8">
                <h2 className="text-2xl font-black italic text-primary uppercase tracking-tighter leading-none mb-2">
                  Yugurish turini tanlang
                </h2>
                <p className="text-white/40 text-xs font-medium">
                  Sizga mos usulni tanlang va boshlang
                </p>
              </div>

              <div className="space-y-3">
                {/* Option 1 - Recommended */}
                <button 
                  onClick={() => {
                    setIsSheetOpen(false);
                    navigate("/active-run");
                  }}
                  className="w-full group relative flex items-center p-4 rounded-[20px] bg-white/[0.03] border border-primary/20 hover:bg-white/[0.06] hover:border-primary/40 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mr-4 shadow-[0_0_20px_rgba(204,255,0,0.1)] group-hover:scale-110 transition-transform">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-left flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="block font-black text-white text-base leading-tight">Hudud egallash</span>
                      <span className="bg-primary/20 text-primary text-[7px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider border border-primary/30">
                        Tavsiya etiladi
                      </span>
                    </div>
                    <span className="text-[10px] font-medium text-white/40 block">Xaritada hudud belgilab yugurish</span>
                    <span className="text-[9px] font-bold text-primary/60 mt-1 block italic">Oxirgi natija: 3.2 km</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-primary opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </button>

                {/* Option 2 */}
                <button 
                  onClick={() => {
                    setIsSheetOpen(false);
                    navigate("/active-run");
                  }}
                  className="w-full group relative flex items-center p-4 rounded-[20px] bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-white/10 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mr-4 shadow-[0_0_20px_rgba(204,255,0,0.1)] group-hover:scale-110 transition-transform">
                    <Navigation className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-left flex-1">
                    <span className="block font-black text-white text-base leading-tight mb-0.5">Erkin mashrut</span>
                    <span className="text-[10px] font-medium text-white/40 block">O'zingiz tanlagan yo'l bo'ylab yugurish</span>
                    <span className="text-[9px] font-bold text-white/20 mt-1 block italic">Eng yaxshi: 15 daqiqa</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-primary opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </button>
              </div>

              <div className="mt-8 text-center">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/20">
                  Istalgan vaqtda orqaga qaytish mumkin
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
