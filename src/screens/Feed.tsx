import React, { useState, useRef } from "react";
import { motion } from "motion/react";
import { Search, Bell, MoreHorizontal, Heart, MessageCircle, Share2, Bookmark } from "lucide-react";
import BottomNav from "@/src/components/BottomNav";
import { cn } from "@/src/lib/utils";

const POSTS = [
  {
    id: 1,
    user: {
      name: "Alisher Karimov",
      location: "Toshkent, O'zbekiston",
      time: "2 soat avval",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDjobko3-v3U4NpK89G4sxNL09F8r6rLyNJrjWikAO3669kVy58BbFmzGHHAhERU-Z7awOGgfXaY2-z49bx-9-3Ee0FAsTBV4RzIJYb7bOOYhAUcUPmCa5EhZ7DKpmZJ7WwRvh1lwaa_0Ydbov3_rh-PocKgVWBVhjHEhRekbFJcq_RcMwxFAEJLJJKo5c3JDrkRAimYI69_da_nwVPBMocqnWXSrTEeDHskgqytQ3B22Ygm8weZMsSeuhxvz_Vn_4ohozwsMRPjfJI",
    },
    activity: {
      map: "https://lh3.googleusercontent.com/aida-public/AB6AXuDfut5j6Iwhyy8Cqn76ap1DId1NQ05VTHys5HC2HRqV4K3rk-4OEOcbmGxAUs5auLxHPOpbgpBgqEo-BuTOQgEN4kZo1mHMOcHAX9F-qHgf-nZYTmmpkZbk685CeW2unvZJHxlEqRtZjtqo9D1mJvw61PwPYnnjHlspTdIhScD002UpDh4KWk6DigJJODsBYyKVvw357LRXIkV5loHyz3VHLWot5Iwwup2_hsfh5vxxc37kF_2-kjSqW0NV5ea_UAnVKXjiK2iEZUzc",
      distance: "5.2 KM",
      pace: "5'12\"",
      time: "26:45",
      isRecord: true,
    },
    likes: 124,
    comments: 18,
    description: "Bugungi yugurish juda ajoyib o'tdi! Yangi poyabzal bilan sur'at sezilarli darajada oshdi. 🔥",
    hashtags: ["#running", "#fitness", "#tashkentrunners"],
  },
  {
    id: 2,
    user: {
      name: "Diana Kim",
      location: "Parkent ko'chasi",
      time: "5 soat avval",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCJ2B-NmlXilM4FCLSsZSW1b9d51s-Y9wKRI-3jl5r0PGrftO57wi_hGSeiq6euhJGPrBMHkn_0L-edH11KXo82ioNgN1vbv_op07Z4Nf43Vj5gJ5pCPSPwKtD3LoeJO5ACvk4Eam0czXEHPFeKJoSfRs9VZYmKRN17mCSyXsH86y7Zc-Y4jWjtCNaNl7GaAERX7A44_PDwnPHuqgej2SD8wUanxm6-upKyPlob_CubQkpLnUZ_Ca-tZPZ6aXbIRTZygo0HvYuesljs",
    },
    activity: {
      map: "https://lh3.googleusercontent.com/aida-public/AB6AXuDqxsf_TNGQTHYJ-96bWQy9kqJMFQ2BXFeD6_sc3hjkVD0mOtGBGvVI1cdMJBPrDhYIoHH9wqqMrAmmfGBbV6ZiOWzUEyeDmDznwRHAOkI6HP724tLCTpaWSCI6X1MgN86b9z5czUTeMw58vNdfkPo9yXna_IJs2wpMFMoAaDo1mXh54jxrbaFATsBNLqJ-dyujIDtYh3TJNnG4vZvzr1N84OVEXuK2CeGWnSNYtCnmItXDMMEFAetTkSdlg7XenvPTVMW3EUSJE_lq",
      distance: "3.8 KM",
      pace: "6'45\"",
      time: "25:40",
      isRecord: false,
    },
    likes: 86,
    comments: 4,
    description: "Bugun kechki salqinlikda sayr qildim. Park juda chiroyli ekan, quyosh botishini tomosha qilish maroqli bo'ldi. 🌅",
    hashtags: ["#parkent", "#sunset", "#eveningwalk"],
  },
];

export default function Feed() {
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);
  const scrollAccumulator = useRef(0);
  const lastScrollY = useRef(0);
  const scrollLock = useRef(false);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const currentScrollY = e.currentTarget.scrollTop;
    const delta = currentScrollY - lastScrollY.current;
    lastScrollY.current = currentScrollY;

    if (scrollLock.current) return;

    if (currentScrollY <= 10) {
      setIsHeaderCollapsed(false);
      scrollAccumulator.current = 0;
      return;
    }

    if ((delta > 0 && scrollAccumulator.current < 0) || (delta < 0 && scrollAccumulator.current > 0)) {
      scrollAccumulator.current = 0;
    }

    scrollAccumulator.current += delta;

    if (scrollAccumulator.current > 50) {
      setIsHeaderCollapsed(true);
      scrollAccumulator.current = 0;
      scrollLock.current = true;
      setTimeout(() => scrollLock.current = false, 400);
    } else if (scrollAccumulator.current < -50) {
      setIsHeaderCollapsed(false);
      scrollAccumulator.current = 0;
      scrollLock.current = true;
      setTimeout(() => scrollLock.current = false, 400);
    }
  };

  return (
    <div className="flex h-full flex-col bg-surface overflow-hidden">
      {/* Header */}
      <motion.header 
        animate={{ 
          marginTop: isHeaderCollapsed ? -72 : 0,
          opacity: isHeaderCollapsed ? 0 : 1
        }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="z-50 flex items-center justify-between bg-surface/80 backdrop-blur-md p-4 border-b border-white/5 shrink-0"
      >
        <div className="flex items-center gap-3">
          <h1 className="text-xl italic-black text-white uppercase tracking-tighter">Community</h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-white/40 hover:text-primary transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <button className="relative p-2 text-white/40 hover:text-primary transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 flex h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(204,255,0,0.5)]" />
          </button>
        </div>
      </motion.header>

      {/* Tabs */}
      <div className="z-40 flex border-b border-white/5 bg-surface/95 backdrop-blur-sm shrink-0">
        {["ALL_FEED", "FRIENDS", "JAMOA_URUSHLARI"].map((tab, i) => (
          <button
            key={tab}
            className={`flex-1 py-3 text-[10px] font-mono tracking-widest transition-colors relative ${
              i === 0 ? "text-primary" : "text-white/30 hover:text-white"
            }`}
          >
            {tab}
            {i === 0 && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary shadow-[0_0_10px_rgba(204,255,0,0.5)]" />}
          </button>
        ))}
      </div>

      {/* Feed - Scrollable Area */}
      <main 
        className="flex-1 overflow-y-auto pb-32 no-scrollbar"
        onScroll={handleScroll}
      >
        {POSTS.map((post) => (
          <article key={post.id} className="border-b border-white/5 p-5 flex flex-col pb-8">
            {/* User Info */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-primary/30 p-0.5">
                  <img src={post.user.avatar} alt={post.user.name} className="w-full h-full object-cover rounded-full" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-[13px] uppercase tracking-tight">{post.user.name}</h3>
                  <p className="text-white/30 text-[10px] font-mono uppercase tracking-wider">{post.user.time} // {post.user.location}</p>
                </div>
              </div>
              <button className="text-white/20 hover:text-white">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            {/* Activity Card */}
            <div className="relative group overflow-hidden rounded-xl bg-card border border-white/5 aspect-[4/3]">
              <img 
                src={post.activity.map} 
                alt="Activity Map" 
                className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
              
              {/* Stats Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <div className="flex justify-between items-center bg-black/60 backdrop-blur-xl px-4 py-3 rounded-xl border border-white/5">
                  <div className="flex flex-col items-center">
                    <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">DST</span>
                    <span className="text-sm italic-black text-primary">{post.activity.distance}</span>
                  </div>
                  <div className="h-6 w-[1px] bg-white/10" />
                  <div className="flex flex-col items-center">
                    <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">PACE</span>
                    <span className="text-sm italic-black text-white">{post.activity.pace}</span>
                  </div>
                  <div className="h-6 w-[1px] bg-white/10" />
                  <div className="flex flex-col items-center">
                    <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">TIME</span>
                    <span className="text-sm italic-black text-white">{post.activity.time}</span>
                  </div>
                </div>
              </div>

              {post.activity.isRecord && (
                <div className="absolute top-4 right-4 bg-primary text-black px-2 py-1 rounded-sm italic-black text-[9px] shadow-[0_0_15px_rgba(204,255,0,0.4)] uppercase tracking-widest">
                  NEW_RECORD
                </div>
              )}
            </div>

            {/* Interactions */}
            <div className="flex items-center py-4 gap-6">
              <button className="flex items-center gap-2 group">
                <Heart className="w-5 h-5 text-primary group-active:scale-125 transition-transform" fill="currentColor" />
                <span className="text-xs font-mono text-white/60">{post.likes}</span>
              </button>
              <button className="flex items-center gap-2 group">
                <MessageCircle className="w-5 h-5 text-white/30 group-hover:text-primary transition-colors" />
                <span className="text-xs font-mono text-white/60">{post.comments}</span>
              </button>
              <button className="flex items-center gap-2 group">
                <Share2 className="w-5 h-5 text-white/30 group-hover:text-primary transition-colors" />
              </button>
              <div className="ml-auto">
                <Bookmark className="w-5 h-5 text-white/30 group-hover:text-primary transition-colors" />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <p className="text-[12px] leading-relaxed text-white/80">
                <span className="font-bold text-white mr-2 uppercase tracking-tight">{post.user.name}</span>
                {post.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {post.hashtags.map(tag => (
                  <span key={tag} className="text-[10px] font-mono text-primary/60 uppercase tracking-wider">
                    {tag}
                  </span>
                ))}
              </div>
              <button className="text-white/30 hover:text-primary text-[11px] font-mono uppercase tracking-widest pt-1">
                View all {post.comments} comments
              </button>
            </div>
          </article>
        ))}
      </main>

      <BottomNav />
    </div>
  );
}
