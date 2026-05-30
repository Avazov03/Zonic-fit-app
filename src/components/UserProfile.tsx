import { motion, AnimatePresence } from "motion/react";
import { X, MessageCircle, UserPlus, Trophy, Users, MapPin, Activity, Zap, Award, BarChart2, ChevronRight, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { AvatarFrame } from "./AvatarFrame";
import { getFrameClasses } from "@/src/lib/utils";

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id?: string;
    name: string;
    avatar: string;
    km: string;
    runs: string;
    rank: number;
    clan: string;
    frame?: string | null;
  };
}

// Mock data for user details
const MOCK_ACTIVITIES = [
  { date: "27-Mar", km: "5.2 KM", time: "28 daqiqa" },
  { date: "25-Mar", km: "8.1 KM", time: "45 daqiqa" },
  { date: "23-Mar", km: "4.0 KM", time: "22 daqiqa" },
];

const ACHIEVEMENTS = [
  { title: "HUDUD EGALLASH", prefix: "hudud", total: 10, active: 2 },
  { title: "MASOFA", prefix: "masofa", total: 10, active: 3 },
  { title: "UZLUKSIZLIK", prefix: "uzluksizlik", total: 10, active: 2 },
  { title: "BIR URINISHDAGI MASOFA", prefix: "marafon", total: 12, active: 4 },
];

export default function UserProfile({ isOpen, onClose, user }: UserProfileProps) {
  const navigate = useNavigate();
  const [isAvatarZoomed, setIsAvatarZoomed] = useState(false);
  const [isCoverZoomed, setIsCoverZoomed] = useState(false);

  const handleOpenFullProfile = () => {
    onClose();
    navigate(`/user/${user.id || '1'}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute bottom-0 left-0 right-0 h-[90vh] w-full max-w-md mx-auto bg-surface border-t border-white/10 rounded-t-3xl z-[101] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="relative h-32 cursor-zoom-in" onClick={() => setIsCoverZoomed(true)}>
              <img 
                src="https://picsum.photos/seed/running/800/400" 
                alt="Background" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-surface" />
              <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/20 rounded-full text-white/70">
                <X className="w-5 h-5" />
              </button>
              
              <button 
                onClick={handleOpenFullProfile}
                className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 bg-primary rounded-full text-black text-[10px] font-black uppercase tracking-tighter"
              >
                To'liq Profil <ExternalLink className="w-3 h-3" />
              </button>

              <div className="absolute -bottom-10 left-6">
                <AvatarFrame 
                  src={user.avatar} 
                  frameId={user.frame} 
                  size="xl" 
                  className="cursor-zoom-in active:scale-95 transition-transform"
                  onClick={(e) => { e.stopPropagation(); setIsAvatarZoomed(true); }}
                />
              </div>
            </div>

            {/* Content */}
            <div className="pt-14 px-5 flex-1 overflow-y-auto pb-10">
              <h2 className="text-xl font-bold text-white uppercase italic-black">{user.name}</h2>
              <div className="flex items-center gap-2 text-primary text-xs font-mono mt-1">
                <Trophy className="w-3 h-3" /> {user.rank}-o'rin • {user.clan}
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-5">
                <button className="flex-1 py-2.5 bg-primary text-black font-bold rounded-xl flex items-center justify-center gap-2 text-sm">
                  <MessageCircle className="w-4 h-4" /> Yozish
                </button>
                <button className="flex-1 py-2.5 bg-white/10 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-sm">
                  <UserPlus className="w-4 h-4" /> Do'st qo'shish
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-2 mt-6">
                {[
                  { label: "Masofa", value: user.km, icon: MapPin },
                  { label: "Yugurish", value: user.runs.split(" ")[0], icon: Activity },
                  { label: "Tezlik", value: "5:30", icon: Zap },
                  { label: "Seriya", value: "12 k", icon: Trophy },
                ].map((stat) => (
                  <div key={stat.label} className="bg-card p-2 rounded-xl border border-white/5 text-center">
                    <stat.icon className="w-3 h-3 text-primary mx-auto mb-1" />
                    <p className="text-xs font-bold text-white">{stat.value}</p>
                    <p className="text-[8px] text-white/40 uppercase tracking-widest">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Compare with me */}
              <div className="mt-6 bg-card p-4 rounded-xl border border-white/5">
                <h3 className="text-white text-sm font-bold mb-3 flex items-center gap-2">
                  <BarChart2 className="w-3 h-3 text-primary" /> Mening natijam bilan solishtirish
                </h3>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] text-white/60"><span>Siz (84.2 KM)</span><span>{user.name} ({user.km})</span></div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: "60%" }} className="h-full bg-primary" />
                  </div>
                </div>
              </div>

              {/* Clan Performance */}
              <div className="mt-6 bg-card p-4 rounded-xl border border-white/5">
                <h3 className="text-white/50 text-[10px] font-bold uppercase tracking-widest mb-3">Jamoa darajasi</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-white/40 text-[9px] uppercase">Umumiy reyting</p>
                    <p className="text-white font-bold text-sm">#42</p>
                  </div>
                  <div>
                    <p className="text-white/40 text-[9px] uppercase">A'zolar soni</p>
                    <p className="text-white font-bold text-sm">128</p>
                  </div>
                </div>
              </div>

              {/* Activity Feed */}
              <div className="mt-6">
                <h3 className="text-white/50 text-[10px] font-bold uppercase tracking-widest mb-3">So'nggi faoliyat</h3>
                <div className="space-y-2">
                  {MOCK_ACTIVITIES.map((act, i) => (
                    <div key={i} className="flex justify-between items-center bg-card p-3 rounded-lg border border-white/5">
                      <span className="text-white/60 text-xs font-mono">{act.date}</span>
                      <span className="text-white font-bold text-xs">{act.km}</span>
                      <span className="text-white/40 text-[10px]">{act.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Achievements Grid */}
              <div className="mt-6 space-y-6">
                {ACHIEVEMENTS.map((group) => (
                  <div key={group.title}>
                    <h3 className="text-white/50 text-[10px] font-bold uppercase tracking-widest mb-3">{group.title}</h3>
                    <div className="grid grid-cols-5 gap-2">
                      {Array.from({ length: group.total }).map((_, i) => (
                        <div key={i} className="flex flex-col items-center gap-1">
                          <img
                            src={`/badges/${group.prefix}${i + 1}.png`}
                            alt={`${group.title} ${i + 1}`}
                            className={`w-full aspect-square object-contain ${i >= group.active ? "opacity-30 grayscale" : ""}`}
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Clan Info */}
              <div className="mt-6 bg-card p-4 rounded-xl border border-white/5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-primary/20 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-bold">{user.clan}</p>
                      <p className="text-[10px] text-white/50">Global Top 5% Jamoa</p>
                    </div>
                  </div>
                  <ChevronRight className="text-white/30 w-4 h-4" />
                </div>
                <div className="text-[10px] text-white/60 pt-3 border-t border-white/5">
                  Jamoa ichidagi o'rni: <span className="text-primary font-bold">#3</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Zoom View Overlay */}
          <AnimatePresence>
            {isAvatarZoomed && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsAvatarZoomed(false)}
                className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl cursor-zoom-out"
              >
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="relative w-full max-w-[400px] aspect-square rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img 
                    src={user.avatar} 
                    alt="Avatar Large" 
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Profile Info in zoom view */}
                  <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-black uppercase tracking-tight text-lg">{user.name}</h3>
                        <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">{user.rank}-O'RIN • {user.clan}</p>
                      </div>
                      <button 
                        onClick={() => setIsAvatarZoomed(false)}
                        className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white/60 hover:text-white transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Cover Zoom Overlay */}
          <AnimatePresence>
            {isCoverZoomed && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsCoverZoomed(false)}
                className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl cursor-zoom-out"
              >
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="relative w-full max-w-[600px] aspect-video rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img 
                    src="https://picsum.photos/seed/running/800/400" 
                    alt="Cover Large" 
                    className="w-full h-full object-cover"
                  />
                  <button 
                    onClick={() => setIsCoverZoomed(false)}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/60 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}