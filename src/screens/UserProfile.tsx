import { motion, AnimatePresence } from "motion/react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Trophy, Zap, Target, MapPin, Award, UserPlus, MessageCircle, MoreHorizontal, ChevronRight, Share2, Flame } from "lucide-react";
import { useState, useMemo } from "react";

// Mock data to match Leaderboard and MapRun
const MOCK_USERS: Record<string, any> = {
  "1": {
    name: "ZAFAR",
    level: 42,
    avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Zafar&backgroundColor=b6e3f4",
    color: "#00F0FF",
    stats: { distance: "156.4", pace: "4:20", wins: 28, streak: 12 },
    territory: "Olmazor",
    rank: "Elite Raider",
    bio: "Tezlik – mening stilim. Hududingizni himoya qila oling!",
    badges: [
      { id: 1, icon: Trophy, label: "Hudud Qiroli", color: "#FFD700" },
      { id: 2, icon: Zap, label: "Tezkor O'q", color: "#00F0FF" },
      { id: 3, icon: Award, label: "Yetti Kunlik", color: "#FF005C" }
    ]
  },
  "2": {
    name: "BEKHZOD",
    level: 38,
    avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Bekhzod&backgroundColor=ffdfbf",
    color: "#FF005C",
    stats: { distance: "142.1", pace: "4:45", wins: 22, streak: 8 },
    territory: "Yunusobod",
    rank: "Territory Master",
    bio: "Har bir metr uchun kurashamiz.",
    badges: [
      { id: 1, icon: Target, label: "Aniq Mergan", color: "#FF005C" },
      { id: 3, icon: Award, label: "Sprint Qiroli", color: "#00F0FF" }
    ]
  }
};

export default function UserProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [isFollowed, setIsFollowed] = useState(false);
  
  // Fallback to Zafar if ID not found for demo
  const user = useMemo(() => MOCK_USERS[userId || "1"] || MOCK_USERS["1"], [userId]);

  return (
    <div className="flex h-full flex-col bg-[#050505] overflow-hidden relative">
      {/* Background Glow */}
      <div 
        className="absolute top-0 inset-x-0 h-[400px] blur-[120px] opacity-20 pointer-events-none"
        style={{ background: `radial-gradient(circle at center, ${user.color}, transparent)` }}
      />
      
      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6 pt-12">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex gap-2">
          <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60">
            <Share2 className="w-4 h-4" />
          </button>
          <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto relative px-6 pb-24 scrollbar-hide">
        {/* User Hero */}
        <div className="flex flex-col items-center mt-4">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative"
          >
            <div 
              className="absolute -inset-4 rounded-full blur-2xl opacity-20 animate-pulse"
              style={{ backgroundColor: user.color }}
            />
            <div className="relative w-32 h-32 rounded-3xl border-2 border-white/10 p-1.5 bg-surface/50 backdrop-blur-xl">
              <img src={user.avatar} className="w-full h-full rounded-2xl object-cover" />
              <div 
                className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full border border-white/10 shadow-lg text-[10px] font-black text-white"
                style={{ backgroundColor: user.color }}
              >
                LVL {user.level}
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-center mt-6"
          >
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">{user.name}</h1>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mt-2 font-mono">{user.rank}</p>
            <p className="text-xs text-white/60 mt-4 max-w-[280px] mx-auto italic leading-relaxed">
              "{user.bio}"
            </p>
          </motion.div>
        </div>

        {/* Tactical Stats */}
        <div className="grid grid-cols-2 gap-3 mt-10">
          <StatCard 
            icon={<Target className="w-4 h-4" />} 
            label="Egallangan" 
            value={user.stats.distance} 
            unit="km²" 
            color={user.color}
          />
          <StatCard 
            icon={<Trophy className="w-4 h-4" />} 
            label="G'alabalar" 
            value={user.stats.wins} 
            unit="ta" 
            color="#FFD700"
          />
          <StatCard 
            icon={<Zap className="w-4 h-4" />} 
            label="O'rtacha Temp" 
            value={user.stats.pace} 
            unit="min/km" 
            color="#00F0FF"
          />
          <StatCard 
            icon={<Flame className="w-4 h-4" />} 
            label="Streak" 
            value={user.stats.streak} 
            unit="kun" 
            color="#FF005C"
          />
        </div>

        {/* Territory & Clan */}
        <section className="mt-8">
           <h3 className="text-[10px] font-black uppercase text-white/20 tracking-[0.3em] mb-4 font-mono px-1">Hudud Boshqaruvi</h3>
           <div className="bg-white/5 rounded-3xl border border-white/10 p-5 flex items-center justify-between group active:scale-[0.98] transition-transform">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white uppercase tracking-tight">{user.territory}</h4>
                  <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1">Hozirgi dominant hudud</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-white/60 transition-colors" />
           </div>
        </section>

        {/* Badges */}
        <section className="mt-10">
          <div className="flex items-center justify-between mb-4 px-1">
             <h3 className="text-[10px] font-black uppercase text-white/20 tracking-[0.3em] font-mono">Mukofotlar</h3>
             <button className="text-[10px] font-black uppercase text-primary tracking-widest">Barchasi</button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {user.badges.map((badge: any) => (
              <div 
                key={badge.id}
                className="flex-shrink-0 w-24 aspect-[4/5] rounded-2xl bg-white/5 border border-white/10 p-3 flex flex-col items-center justify-center text-center gap-2"
              >
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5"
                  style={{ color: badge.color }}
                >
                  <badge.icon className="w-6 h-6" />
                </div>
                <span className="text-[8px] font-black uppercase text-white/40 leading-tight">{badge.label}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Floating Action Bar */}
      <footer className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent pt-12">
        <div className="flex gap-3">
          <button 
            onClick={() => setIsFollowed(!isFollowed)}
            className={cn(
              "flex-1 h-16 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2",
              isFollowed 
                ? "bg-white/10 text-white border border-white/20" 
                : "bg-white text-black"
            )}
          >
            {isFollowed ? "Kuzatilyapti" : "Obuna Bo'lish"}
            {!isFollowed && <UserPlus className="w-4 h-4" />}
          </button>
          <button className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white active:scale-95 transition-transform">
            <MessageCircle className="w-5 h-5" />
          </button>
          <button 
            className="w-16 h-16 rounded-2xl bg-[#FF005C] flex items-center justify-center text-white shadow-[0_10px_30px_rgba(255,0,92,0.3)] active:scale-95 transition-transform"
          >
            <Trophy className="w-5 h-5" />
          </button>
        </div>
      </footer>
    </div>
  );
}

function StatCard({ icon, label, value, unit, color }: any) {
  return (
    <div className="bg-white/5 rounded-2xl p-4 border border-white/10 relative overflow-hidden group">
      <div 
        className="absolute -right-4 -bottom-4 w-12 h-12 blur-2xl opacity-10 transition-opacity group-hover:opacity-30"
        style={{ backgroundColor: color }}
      />
      <div className="flex items-center gap-2 mb-3">
        <div className="text-white/40" style={{ color }}>
          {icon}
        </div>
        <span className="text-[7px] font-black uppercase tracking-[0.2em] text-white/30 font-mono italic">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-sporty italic text-white leading-none">{value}</span>
        <span className="text-[9px] font-bold text-white/20 uppercase">{unit}</span>
      </div>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
