import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Users, Star, Globe, Map, Plus, TrendingUp, MoreHorizontal, 
  MessageSquare, Award, Lock, X, Send, PersonStanding, Activity, Bell, Search, Zap, Flame,
  Settings, Crop as CropIcon, Target, Edit2, MapPin
} from "lucide-react";
import ReactCrop, { type Crop, centerCrop, makeAspectCrop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { cn } from "@/src/lib/utils";
import BottomNav from "../components/BottomNav";

const MarqueeText = ({ text, className }: { text: string; className?: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [shouldScroll, setShouldScroll] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      if (containerRef.current && textRef.current) {
        setShouldScroll(textRef.current.scrollWidth > containerRef.current.clientWidth);
      }
    };
    checkScroll();
    // Small delay to ensure layout is ready
    const timer = setTimeout(checkScroll, 100);
    window.addEventListener('resize', checkScroll);
    return () => {
      window.removeEventListener('resize', checkScroll);
      clearTimeout(timer);
    };
  }, [text]);

  return (
    <div ref={containerRef} className={cn("overflow-hidden whitespace-nowrap relative", className)}>
      <motion.div
        animate={shouldScroll ? { x: [0, "-50%"] } : { x: 0 }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
        className="inline-flex whitespace-nowrap"
      >
        <span ref={textRef} className={cn(shouldScroll && "pr-12")}>{text}</span>
        {shouldScroll && <span className="pr-12">{text}</span>}
      </motion.div>
    </div>
  );
};

const CLAN_DATA = {
  name: "ZONIC ELITE",
  tag: "ZNC",
  level: 12,
  xp: 12450,
  nextLevelXp: 15000,
  members: 18,
  maxMembers: 25,
  rank: 3,
  territory: 45.2,
  description: "Toshkentning eng kuchli yuguruvchilari birlashgan klan. Biz hududlarni egallaymiz!",
  leaderboard: [
    { id: 1, name: "Avazov_fit", xp: 2450, distance: "142km", avatar: "https://picsum.photos/seed/user1/100/100", rank: 1 },
    { id: 2, name: "Sardor_Run", xp: 1820, distance: "98km", avatar: "https://picsum.photos/seed/user2/100/100", rank: 2 },
    { id: 3, name: "Malika_Z", xp: 1540, distance: "85km", avatar: "https://picsum.photos/seed/user3/100/100", rank: 3 },
  ],
  challenges: [
    { id: 1, title: "Haftalik 1000km", progress: 740, total: 1000, unit: "km", reward: "5000 XP", timeLeft: "2 kun" },
    { id: 2, title: "Yangi hudud: Chilonzor", progress: 12, total: 30, unit: "km²", reward: "Rare Badge", timeLeft: "5 kun" },
  ],
  feed: [
    { id: 1, user: "Sardor_Run", action: "yangi rekord o'rnatdi", value: "15.4 km", time: "2s avval" },
    { id: 2, user: "Malika_Z", action: "klanga qo'shildi", value: "", time: "1s avval" },
    { id: 3, user: "Avazov_fit", action: "hudud egalladi", value: "Yunusobod", time: "3s avval" },
  ],
  perks: [
    { id: 1, title: "XP Booster", description: "+5% barcha mashg'ulotlardan", icon: <Zap className="w-4 h-4" />, unlocked: true },
    { id: 2, title: "Elite Badge", description: "Profil uchun maxsus belgi", icon: <Award className="w-4 h-4" />, unlocked: true },
    { id: 3, title: "Fast Recovery", description: "Stamina tiklanishi +10%", icon: <Flame className="w-4 h-4" />, unlocked: false },
  ],
  allMembers: [
    { id: 1, name: "Avazov_fit", role: "Leader", xp: 2450, distance: "142km", avatar: "https://picsum.photos/seed/user1/100/100", status: "online" },
    { id: 2, name: "Sardor_Run", role: "Co-Leader", xp: 1820, distance: "98km", avatar: "https://picsum.photos/seed/user2/100/100", status: "online" },
    { id: 3, name: "Malika_Z", role: "Member", xp: 1540, distance: "85km", avatar: "https://picsum.photos/seed/user3/100/100", status: "offline" },
    { id: 4, name: "Jasur_Runner", role: "Member", xp: 1200, distance: "70km", avatar: "https://picsum.photos/seed/user4/100/100", status: "online" },
    { id: 5, name: "Nigora_Fit", role: "Member", xp: 950, distance: "55km", avatar: "https://picsum.photos/seed/user5/100/100", status: "offline" },
  ],
  chatMessages: [
    { id: 1, user: "Sardor_Run", text: "Hammaga salom! Bugun kim yugurishga chiqadi?", time: "10:24", isMe: false },
    { id: 2, user: "Malika_Z", text: "Men soat 18:00 da chiqmoqchiman.", time: "10:26", isMe: false },
    { id: 3, user: "Avazov_fit", text: "Men ham qo'shilaman! Chilonzorda ko'rishamiz.", time: "10:30", isMe: true },
    { id: 4, user: "Jasur_Runner", text: "Zo'r! Men ham boraman.", time: "10:35", isMe: false },
  ],
  allChallenges: [
    { id: 1, title: "Haftalik 1000km", progress: 740, total: 1000, unit: "km", reward: "5000 XP", timeLeft: "2 kun", status: "active", type: "distance" },
    { id: 2, title: "Yangi hudud: Chilonzor", progress: 12, total: 30, unit: "km²", reward: "Rare Badge", timeLeft: "5 kun", status: "active", type: "territory" },
    { id: 3, title: "100 ta yugurish", progress: 100, total: 100, unit: "marta", reward: "Elite Runner", timeLeft: "Tugagan", status: "completed", type: "count" },
    { id: 4, title: "Oylik 5000km", progress: 0, total: 5000, unit: "km", reward: "25000 XP", timeLeft: "Boshlanmagan", status: "upcoming", type: "distance" },
  ],
  otherClans: [
    { id: 1, name: "Tashkent Runners", tag: "TKR", level: 15, members: 24, maxMembers: 25, rank: 1, territory: 65.4, avatar: "https://picsum.photos/seed/clan1/100/100" },
    { id: 2, name: "Uzbek Tigers", tag: "UZT", level: 10, members: 15, maxMembers: 20, rank: 5, territory: 32.1, avatar: "https://picsum.photos/seed/clan2/100/100" },
    { id: 3, name: "Speed Demons", tag: "SPD", level: 8, members: 12, maxMembers: 15, rank: 12, territory: 18.5, avatar: "https://picsum.photos/seed/clan3/100/100" },
    { id: 4, name: "Night Owls", tag: "NTO", level: 5, members: 8, maxMembers: 10, rank: 45, territory: 5.2, avatar: "https://picsum.photos/seed/clan4/100/100" },
  ]
};

const ClanChatModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(CLAN_DATA.chatMessages);
  const [isUploading, setIsUploading] = useState(false);

  // Cropping State for Chat
  const [cropModal, setCropModal] = useState<{
    isOpen: boolean;
    src: string;
  }>({ isOpen: false, src: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = React.useRef<HTMLImageElement>(null);

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const initialCrop = centerCrop(
      makeAspectCrop({ unit: '%', width: 90 }, 1, width, height),
      width,
      height
    );
    setCrop(initialCrop);
  };

  const getCroppedImg = async () => {
    if (!completedCrop || !imgRef.current) return;
    const canvas = document.createElement('canvas');
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(
      imgRef.current,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0, 0, completedCrop.width, completedCrop.height
    );
    return new Promise<string>((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) return;
        resolve(URL.createObjectURL(blob));
      }, 'image/jpeg', 0.9);
    });
  };

  const handleSendMessage = (text?: string, image?: string) => {
    if (!text?.trim() && !image) return;
    const newMessage = {
      id: messages.length + 1,
      user: "Avazov_fit",
      text: text || "",
      image: image,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };
    setMessages([...messages, newMessage]);
    setMessage("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCropModal({ isOpen: true, src: reader.result?.toString() || '' });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropSave = async () => {
    setIsSaving(true);
    try {
      const croppedUrl = await getCroppedImg();
      if (croppedUrl) {
        handleSendMessage("", croppedUrl);
      }
    } finally {
      setIsSaving(false);
      setCropModal({ isOpen: false, src: '' });
    }
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="absolute inset-0 z-[120] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-xl z-[120]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg h-[80vh] bg-[#0A0A0A]/90 backdrop-blur-md border border-white/10 rounded-[40px] z-[121] flex flex-col overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/40 backdrop-blur-md">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-[0_0_20px_rgba(204,255,0,0.1)]">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-black uppercase tracking-tighter">Klan Chati</h2>
                  <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{CLAN_DATA.members} a'zo faol</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl bg-white/5 text-white/40 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar bg-[radial-gradient(circle_at_top_right,rgba(204,255,0,0.03),transparent_40%)]">
              {messages.map((msg: any) => (
                <div key={msg.id} className={cn("flex flex-col", msg.isMe ? "items-end" : "items-start")}>
                  {!msg.isMe && (
                    <span className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1.5 ml-1">{msg.user}</span>
                  )}
                  <div className={cn(
                    "max-w-[85%] p-4 rounded-2xl text-xs font-medium leading-relaxed shadow-lg",
                    msg.isMe 
                      ? "bg-primary text-black rounded-tr-none" 
                      : "bg-white/5 border border-white/10 text-white/80 rounded-tl-none"
                  )}>
                    {msg.image && (
                      <img src={msg.image} alt="Sent" className="w-full rounded-xl mb-2 object-cover max-h-60" referrerPolicy="no-referrer" />
                    )}
                    {msg.text}
                  </div>
                  <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest mt-1.5">{msg.time}</span>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-6 bg-black/80 border-t border-white/5 pb-10 backdrop-blur-xl">
              <div className="flex gap-3">
                <label className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-primary hover:border-primary/30 transition-all cursor-pointer active:scale-95">
                  <Plus className="w-6 h-6" />
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage(message);
                  }}
                  className="flex-1 relative"
                >
                  <input 
                    type="text" 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Xabar yozing..."
                    className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-xs font-medium focus:outline-none focus:border-primary/50 transition-all placeholder:text-white/20"
                  />
                  <button 
                    type="submit"
                    disabled={!message.trim()}
                    className="absolute right-2 top-2 bottom-2 w-10 rounded-xl bg-primary flex items-center justify-center text-black shadow-[0_0_20px_rgba(204,255,0,0.3)] active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>

            {/* Chat Crop Modal */}
            <AnimatePresence>
              {cropModal.isOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black z-[200] flex flex-col"
                >
                  <div className="p-6 flex items-center justify-between border-b border-white/5 bg-black/40 backdrop-blur-md">
                    <h3 className="text-sm font-black uppercase tracking-widest">Rasmni tahrirlash</h3>
                    <button onClick={() => setCropModal({ ...cropModal, isOpen: false })} className="p-2 rounded-xl bg-white/5 text-white/40">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="flex-1 flex items-center justify-center p-4 bg-[#050505] overflow-hidden relative">
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:20px_20px]" />
                    <div className="w-full max-h-full flex items-center justify-center relative z-10">
                      <ReactCrop
                        crop={crop}
                        onChange={(c) => setCrop(c)}
                        onComplete={(c) => setCompletedCrop(c)}
                        className="max-w-full"
                      >
                        <img
                          ref={imgRef}
                          src={cropModal.src}
                          alt="Crop Source"
                          onLoad={onImageLoad}
                          className="max-w-full max-h-[50vh] w-auto h-auto object-contain mx-auto"
                        />
                      </ReactCrop>
                    </div>
                  </div>

                  <div className="p-6 bg-black/80 border-t border-white/5 pb-10">
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setCropModal({ ...cropModal, isOpen: false })}
                        className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[0.2em] text-white/40 active:scale-95 transition-all"
                      >
                        Bekor qilish
                      </button>
                      <button 
                        onClick={handleCropSave}
                        disabled={isSaving}
                        className="flex-[2] py-4 rounded-2xl bg-primary text-black text-[9px] font-black uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(204,255,0,0.3)] active:scale-95 transition-all flex items-center justify-center gap-2"
                      >
                        {isSaving ? (
                          <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                        ) : (
                          "Yuborish"
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const MemberOptionsSheet = ({ 
  isOpen, 
  onClose, 
  member,
  isLeader = true // For demo purposes, assume current user is leader
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  member: any;
  isLeader?: boolean;
}) => {
  if (!member) return null;

  const options = [
    { id: 'profile', label: "Profilni ko'rish", icon: <PersonStanding className="w-4 h-4" />, color: "text-white" },
    { id: 'message', label: "Xabar yuborish", icon: <MessageSquare className="w-4 h-4" />, color: "text-white" },
    { id: 'compare', label: "Solishtirish", icon: <Activity className="w-4 h-4" />, color: "text-white" },
  ];

  const leaderOptions = [
    { id: 'promote', label: "Lavozimni ko'tarish", icon: <TrendingUp className="w-4 h-4" />, color: "text-blue-400" },
    { id: 'warning', label: "Ogohlantirish yuborish", icon: <Bell className="w-4 h-4" />, color: "text-orange-400" },
    { id: 'kick', label: "Klandan chetlatish", icon: <X className="w-4 h-4" />, color: "text-red-500" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-xl z-[200]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="absolute inset-x-4 bottom-10 md:inset-x-auto md:w-[400px] bg-[#0A0A0A]/90 backdrop-blur-md border border-white/10 rounded-[40px] z-[201] overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.8)]"
          >
            {/* Handle */}
            <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mt-4 mb-2" />
            
            <div className="p-8 max-h-[90vh] overflow-y-auto no-scrollbar">
              {/* Member Info Header */}
              <div className="flex items-center gap-5 mb-8 pb-6 border-b border-white/5">
                <div className="relative">
                  <img src={member.avatar} alt={member.name} className="w-16 h-16 rounded-[24px] object-cover border-2 border-white/10" referrerPolicy="no-referrer" />
                  <div className={cn(
                    "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#0A0A0A]",
                    member.status === "online" ? "bg-primary" : "bg-white/20"
                  )} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-black uppercase tracking-tight">{member.name}</h3>
                    <span className={cn(
                      "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md",
                      member.role === "Leader" ? "bg-primary text-black" : 
                      member.role === "Co-Leader" ? "bg-blue-500 text-white" : "bg-white/10 text-white/40"
                    )}>
                      {member.role}
                    </span>
                  </div>
                  <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">{member.distance} • {member.xp} XP</p>
                </div>
              </div>

              {/* Options List */}
              <div className="space-y-2">
                <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] mb-4 px-2">Amallar</p>
                {options.map(opt => (
                  <button 
                    key={opt.id}
                    onClick={onClose}
                    className="w-full h-[65px] px-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-4 hover:bg-white/[0.05] transition-all group"
                  >
                    <div className={cn("w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-white/10 transition-colors", opt.color)}>
                      {opt.icon}
                    </div>
                    <span className="text-sm font-bold uppercase tracking-tight text-white/80">{opt.label}</span>
                  </button>
                ))}

                {isLeader && member.role !== 'Leader' && (
                  <>
                    <p className="text-[9px] font-black text-red-500/30 uppercase tracking-[0.3em] mt-8 mb-4 px-2">Lider Boshqaruvi</p>
                    {leaderOptions.map(opt => (
                      <button 
                        key={opt.id}
                        onClick={onClose}
                        className="w-full h-[65px] px-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-4 hover:bg-white/[0.05] transition-all group"
                      >
                        <div className={cn("w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-white/10 transition-colors", opt.color)}>
                          {opt.icon}
                        </div>
                        <span className={cn("text-sm font-bold uppercase tracking-tight", opt.color)}>{opt.label}</span>
                      </button>
                    ))}
                  </>
                )}
              </div>

              {/* Close Button */}
              <button 
                onClick={onClose}
                className="w-full mt-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-white transition-all"
              >
                Yopish
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const CreateChallengeModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [title, setTitle] = useState("");
  const [reward, setReward] = useState("");
  const [total, setTotal] = useState("");
  const [image, setImage] = useState<string | null>(null);

  // Cropping State
  const [cropModal, setCropModal] = useState<{
    isOpen: boolean;
    src: string;
  }>({ isOpen: false, src: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = React.useRef<HTMLImageElement>(null);

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const initialCrop = centerCrop(
      makeAspectCrop({ unit: '%', width: 90 }, 16 / 9, width, height),
      width,
      height
    );
    setCrop(initialCrop);
  };

  const getCroppedImg = async () => {
    if (!completedCrop || !imgRef.current) return;
    const canvas = document.createElement('canvas');
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(
      imgRef.current,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0, 0, completedCrop.width, completedCrop.height
    );
    return new Promise<string>((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) return;
        resolve(URL.createObjectURL(blob));
      }, 'image/jpeg', 0.9);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCropModal({ isOpen: true, src: reader.result?.toString() || '' });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropSave = async () => {
    setIsSaving(true);
    try {
      const croppedUrl = await getCroppedImg();
      if (croppedUrl) {
        setImage(croppedUrl);
      }
    } finally {
      setIsSaving(false);
      setCropModal({ isOpen: false, src: '' });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="absolute inset-0 z-[120] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-xl z-[120]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg h-[80vh] bg-[#0A0A0A]/90 backdrop-blur-md border border-white/10 rounded-[40px] z-[121] flex flex-col overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/40 backdrop-blur-md">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-[0_0_20px_rgba(204,255,0,0.1)]">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-black uppercase tracking-tighter">Yangi Maqsad</h2>
                  <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Klan uchun yangi chaqiriq</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl bg-white/5 text-white/40 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
              {/* Image Upload */}
              <div className="space-y-4">
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] px-2">Muqova rasmi</p>
                <div 
                  className="relative h-48 rounded-[32px] bg-white/[0.02] border border-white/5 overflow-hidden group cursor-pointer"
                  onClick={() => document.getElementById('challenge-image')?.click()}
                >
                  {image ? (
                    <img src={image} alt="Challenge" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-white/20 group-hover:text-primary transition-colors">
                      <Plus className="w-8 h-8" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Rasm yuklash</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="px-6 py-2 rounded-full bg-white text-black text-[10px] font-black uppercase tracking-widest">Almashtirish</div>
                  </div>
                  <input id="challenge-image" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] px-2">Sarlavha</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Masalan: 1000km Yugurish"
                    className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-6 text-sm font-bold focus:outline-none focus:border-primary/50 transition-all placeholder:text-white/10"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] px-2">Mukofot (XP)</label>
                    <input 
                      type="text" 
                      value={reward}
                      onChange={(e) => setReward(e.target.value)}
                      placeholder="5000 XP"
                      className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-6 text-sm font-bold focus:outline-none focus:border-primary/50 transition-all placeholder:text-white/10"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] px-2">Maqsad (km)</label>
                    <input 
                      type="text" 
                      value={total}
                      onChange={(e) => setTotal(e.target.value)}
                      placeholder="1000"
                      className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-6 text-sm font-bold focus:outline-none focus:border-primary/50 transition-all placeholder:text-white/10"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-black/80 border-t border-white/5 pb-10">
              <button 
                onClick={onClose}
                className="w-full py-5 rounded-2xl bg-primary text-black text-[10px] font-black uppercase tracking-[0.3em] shadow-[0_20px_40px_rgba(204,255,0,0.2)] active:scale-[0.98] transition-all"
              >
                Chaqiriqni yaratish
              </button>
            </div>

            {/* Crop Modal */}
            <AnimatePresence>
              {cropModal.isOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black z-[200] flex flex-col"
                >
                  <div className="p-6 flex items-center justify-between border-b border-white/5 bg-black/40 backdrop-blur-md">
                    <h3 className="text-sm font-black uppercase tracking-widest">Rasmni tahrirlash</h3>
                    <button onClick={() => setCropModal({ ...cropModal, isOpen: false })} className="p-2 rounded-xl bg-white/5 text-white/40">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="flex-1 flex items-center justify-center p-4 bg-[#050505] overflow-hidden relative">
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:20px_20px]" />
                    <div className="w-full max-h-full flex items-center justify-center relative z-10">
                      <ReactCrop
                        crop={crop}
                        onChange={(c) => setCrop(c)}
                        onComplete={(c) => setCompletedCrop(c)}
                        aspect={16 / 9}
                        className="max-w-full"
                      >
                        <img
                          ref={imgRef}
                          src={cropModal.src}
                          alt="Crop Source"
                          onLoad={onImageLoad}
                          className="max-w-full max-h-[50vh] w-auto h-auto object-contain mx-auto"
                        />
                      </ReactCrop>
                    </div>
                  </div>

                  <div className="p-6 bg-black/80 border-t border-white/5 pb-10">
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setCropModal({ ...cropModal, isOpen: false })}
                        className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[0.2em] text-white/40 active:scale-95 transition-all"
                      >
                        Bekor qilish
                      </button>
                      <button 
                        onClick={handleCropSave}
                        disabled={isSaving}
                        className="flex-[2] py-4 rounded-2xl bg-primary text-black text-[9px] font-black uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(204,255,0,0.3)] active:scale-95 transition-all flex items-center justify-center gap-2"
                      >
                        {isSaving ? (
                          <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                        ) : (
                          "Saqlash"
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const ClanMembersModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [search, setSearch] = useState("");
  const [selectedMember, setSelectedMember] = useState<any>(null);
  
  const filteredMembers = CLAN_DATA.allMembers.filter(member => 
    member.name.toLowerCase().includes(search.toLowerCase()) ||
    member.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="absolute inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-black/40 backdrop-blur-xl z-[120]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg h-[80vh] bg-[#0A0A0A]/90 backdrop-blur-md border border-white/10 rounded-[40px] z-[121] flex flex-col overflow-hidden shadow-2xl"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/40 backdrop-blur-md">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black uppercase tracking-tighter">Klan A'zolari</h2>
                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{CLAN_DATA.members} / {CLAN_DATA.maxMembers} jami</p>
                  </div>
                </div>
                <button onClick={onClose} className="p-2 rounded-xl bg-white/5 text-white/40">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search */}
              <div className="px-6 py-2">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input 
                    type="text" 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="A'zolarni qidirish..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-xs font-medium focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>

              {/* Members List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
                {filteredMembers.map((member) => (
                  <div key={member.id} className="h-[60px] px-4 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-between group hover:bg-white/[0.04] transition-all">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img src={member.avatar} alt={member.name} className="w-12 h-12 rounded-2xl object-cover border border-white/10" referrerPolicy="no-referrer" />
                        <div className={cn(
                          "absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-[#0A0A0A]",
                          member.status === "online" ? "bg-primary" : "bg-white/20"
                        )} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-black uppercase tracking-tight">{member.name}</p>
                          <span className={cn(
                            "text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded",
                            member.role === "Leader" ? "bg-primary text-black" : 
                            member.role === "Co-Leader" ? "bg-blue-500 text-white" : "bg-white/10 text-white/40"
                          )}>
                            {member.role}
                          </span>
                        </div>
                        <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-1">{member.distance} • {member.xp} XP</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedMember(member)}
                      className="p-2 rounded-xl bg-white/5 text-white/20 hover:text-white transition-colors"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {filteredMembers.length === 0 && (
                  <div className="py-20 text-center">
                    <p className="text-xs text-white/20 font-bold uppercase tracking-widest">A'zo topilmadi</p>
                  </div>
                )}
              </div>

              {/* Invite Button */}
              <div className="p-6 bg-black/40 border-t border-white/5 pb-10">
                <button className="w-full py-4 rounded-2xl bg-primary text-black text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3">
                  <Plus className="w-4 h-4" />
                  Do'stlarni taklif qilish
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <MemberOptionsSheet 
        isOpen={!!selectedMember} 
        onClose={() => setSelectedMember(null)} 
        member={selectedMember} 
      />
    </>
  );
};

const ClanSettingsModal = ({ 
  isOpen, 
  onClose, 
  clanData, 
  onUpdate 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  clanData: any;
  onUpdate: (newData: any) => void;
}) => {
  const [name, setName] = useState(clanData.name);
  const [location, setLocation] = useState(clanData.location || "TOSHKENT, O'ZBEKISTON");
  const [avatar, setAvatar] = useState(clanData.avatar);
  const [cover, setCover] = useState(clanData.cover);

  // Cropping State
  const [cropModal, setCropModal] = useState<{
    isOpen: boolean;
    type: 'avatar' | 'cover' | 'chat';
    src: string;
  }>({ isOpen: false, type: 'avatar', src: '' });
  const [isSaving, setIsSaving] = useState(false);

  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = React.useRef<HTMLImageElement>(null);

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const aspect = cropModal.type === 'avatar' ? 1 : cropModal.type === 'cover' ? 16 / 9 : undefined;
    const initialCrop = centerCrop(
      makeAspectCrop(
        { unit: '%', width: 90 },
        aspect || 1,
        width,
        height
      ),
      width,
      height
    );
    setCrop(initialCrop);
  };

  const getCroppedImg = async () => {
    if (!completedCrop || !imgRef.current) return;

    const canvas = document.createElement('canvas');
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    ctx.drawImage(
      imgRef.current,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );

    return new Promise<string>((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) return;
        resolve(URL.createObjectURL(blob));
      }, 'image/jpeg', 0.9);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover' | 'chat') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setCropModal({
          isOpen: true,
          type,
          src: reader.result?.toString() || '',
        });
      });
      reader.readAsDataURL(file);
    }
  };

  const handleCropSave = async () => {
    setIsSaving(true);
    try {
      const croppedUrl = await getCroppedImg();
      if (croppedUrl) {
        if (cropModal.type === 'avatar') setAvatar(croppedUrl);
        else if (cropModal.type === 'cover') setCover(croppedUrl);
        else if (cropModal.type === 'chat') {
          // This will be handled by the chat modal if we pass it down
          // For now, let's assume it's for settings
        }
      }
    } finally {
      setIsSaving(false);
      setCropModal({ ...cropModal, isOpen: false });
    }
  };

  const handleSave = () => {
    onUpdate({ name, location, avatar, cover });
    onClose();
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl z-[250]"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute inset-x-0 bottom-0 bg-[#0A0A0A] border-t border-white/10 rounded-t-[40px] z-[251] overflow-hidden shadow-[0_-20px_80px_rgba(0,0,0,0.8)]"
            >
              <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mt-4 mb-2" />
              <div className="p-8 max-h-[85vh] overflow-y-auto no-scrollbar pb-32">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter">Klan <span className="text-primary">Tahriri</span></h2>
                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Klaningizni shakllantiring</p>
                  </div>
                  <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-10">
                  {/* Image Upload Section */}
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] px-2">Vizual ko'rinish</p>
                    
                    {/* Cover Upload */}
                    <div 
                      className="relative h-40 rounded-[32px] bg-white/[0.02] border border-white/5 overflow-hidden group cursor-pointer"
                      onClick={() => document.getElementById('clan-cover-upload')?.click()}
                    >
                      <img src={cover} alt="Cover" className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-primary transition-all group-hover:scale-110">
                          <Plus className="w-6 h-6 text-white/40 group-hover:text-black transition-colors" />
                        </div>
                        <span className="text-[8px] font-black uppercase tracking-widest text-white/20">Muqova rasmi</span>
                      </div>
                      <input id="clan-cover-upload" type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'cover')} />
                    </div>

                    {/* Avatar Upload */}
                    <div className="flex justify-center -mt-16 relative z-10">
                      <div 
                        className="relative group cursor-pointer"
                        onClick={() => document.getElementById('clan-avatar-upload')?.click()}
                      >
                        <div className="w-32 h-32 rounded-[40px] border-[8px] border-[#0A0A0A] bg-[#1A1A1A] overflow-hidden shadow-2xl group-hover:scale-105 transition-transform">
                          <img src={avatar} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div className="absolute inset-0 bg-black/40 rounded-[40px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Plus className="w-6 h-6 text-white" />
                        </div>
                        <input id="clan-avatar-upload" type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'avatar')} />
                      </div>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] px-2">Klan Nomi</label>
                      <div className="relative group">
                        <Users className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-primary transition-colors" />
                        <input 
                          type="text" 
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full h-16 bg-white/[0.03] border border-white/10 rounded-2xl pl-14 pr-6 text-sm font-bold focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all"
                          placeholder="Klan nomini kiriting"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] px-2">Joylashuv (Shahar)</label>
                      <div className="relative group">
                        <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-primary transition-colors" />
                        <input 
                          type="text" 
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="w-full h-16 bg-white/[0.03] border border-white/10 rounded-2xl pl-14 pr-6 text-sm font-bold focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all"
                          placeholder="Masalan: TOSHKENT, O'ZBEKISTON"
                        />
                      </div>
                    </div>

                    {/* Save Button */}
                    <button 
                      onClick={handleSave}
                      className="w-full h-16 rounded-2xl bg-primary text-black text-sm font-black uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(204,255,0,0.2)] active:scale-95 transition-all mt-4"
                    >
                      O'zgarishlarni Saqlash
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Crop Modal */}
      <AnimatePresence>
        {cropModal.isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black z-[300] flex flex-col overflow-hidden"
            >
              {/* Header - More compact for mobile */}
              <div className="pt-12 pb-4 px-6 flex items-center justify-between border-b border-white/5 bg-black/40 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <CropIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-tight">Qirqish</h3>
                    <p className="text-[7px] font-bold text-white/30 uppercase tracking-widest">Rasmni moslang</p>
                  </div>
                </div>
                <button 
                  onClick={() => setCropModal({ ...cropModal, isOpen: false })}
                  className="p-2 rounded-xl bg-white/5 text-white/40"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Crop Area - Optimized for mobile visibility */}
              <div className="flex-1 flex items-center justify-center p-4 bg-[#050505] overflow-hidden relative">
                {/* Grid Overlay for Premium Feel */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:20px_20px]" />
                
                <div className="w-full max-h-full flex items-center justify-center relative z-10">
                  <ReactCrop
                    crop={crop}
                    onChange={(c) => setCrop(c)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={cropModal.type === 'avatar' ? 1 : cropModal.type === 'cover' ? 16 / 9 : undefined}
                    circularCrop={cropModal.type === 'avatar'}
                    className="max-w-full"
                  >
                    <img
                      ref={imgRef}
                      src={cropModal.src}
                      alt="Crop Source"
                      onLoad={onImageLoad}
                      className="max-w-full max-h-[50vh] w-auto h-auto object-contain mx-auto"
                      style={{ display: 'block' }}
                    />
                  </ReactCrop>
                </div>
              </div>

              {/* Footer - Mobile optimized buttons */}
              <div className="p-6 bg-black/80 border-t border-white/5 pb-10">
                <div className="flex gap-3">
                  <button 
                    onClick={() => setCropModal({ ...cropModal, isOpen: false })}
                    className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[0.2em] text-white/40 active:scale-95 transition-all"
                  >
                    Bekor qilish
                  </button>
                  <button 
                    onClick={handleCropSave}
                    disabled={isSaving}
                    className="flex-[2] py-4 rounded-2xl bg-primary text-black text-[9px] font-black uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(204,255,0,0.3)] active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    {isSaving ? (
                      <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    ) : (
                      "Saqlash"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default function Clan() {
  const [activeTab, setActiveTab] = useState("Jamoa");
  const [isClanChatOpen, setIsClanChatOpen] = useState(false);
  const [isClanMembersOpen, setIsClanMembersOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCreateChallengeOpen, setIsCreateChallengeOpen] = useState(false);
  const [selectedMemberForOptions, setSelectedMemberForOptions] = useState<any>(null);

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

  const [clanInfo, setClanInfo] = useState({
    name: CLAN_DATA.name,
    location: "TOSHKENT, O'ZBEKISTON",
    avatar: "/badges/avazov.JPG",
    cover: "/badges/clanbg.png"
  });

  return (
    <div className="h-full w-full bg-[#050505] text-white overflow-hidden flex flex-col relative">
      {/* Header */}
      <motion.header 
        animate={{ 
          marginTop: isHeaderCollapsed ? -88 : 0, // Approximate height of header
          opacity: isHeaderCollapsed ? 0 : 1
        }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="pt-12 pb-4 px-6 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-40 shrink-0"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tighter">Klan <span className="text-primary">Markazi</span></h1>
            <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Jamoaviy yutuqlar</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white transition-colors">
              <Search className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setIsNotificationsOpen(true)}
              className="p-2 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white transition-colors relative"
            >
              <Bell className="w-4 h-4" />
              <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full border border-[#050505]" />
            </button>
            <button className="p-2 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white transition-colors">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Tabs */}
      <div className="flex px-6 border-b border-white/5 bg-[#050505]/20 backdrop-blur-md shrink-0">
        {["Jamoa", "Chellenjlar", "Boshqa jamoalar"].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "py-3 px-4 text-[11px] font-bold transition-all relative uppercase tracking-widest",
              activeTab === tab ? "text-[#CCFF00]" : "text-white/30"
            )}
          >
            {tab}
            {activeTab === tab && (
              <motion.div 
                layoutId="activeClanTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#CCFF00] shadow-[0_0_15px_rgba(204,255,0,0.6)]"
              />
            )}
          </button>
        ))}
      </div>

      {/* Scrollable Content */}
      <div 
        className="flex-1 overflow-y-auto no-scrollbar pb-32"
        onScroll={handleScroll}
      >
        <AnimatePresence mode="wait">
          {activeTab === "Jamoa" && (
            <motion.div
              key="jamoa"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="px-6 pt-6 space-y-8"
            >
              {/* Clan Header Card - Refined Style (Adjusted) */}
              <div className="relative overflow-hidden rounded-[32px] bg-[#0A0C0A] border border-white/10 shadow-2xl group">
                {/* Settings Icon - Top Right (Always Visible) */}
                <button 
                  onClick={() => setIsSettingsOpen(true)}
                  className="absolute top-4 right-4 z-30 p-2.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-white hover:text-primary active:scale-95 transition-all shadow-lg"
                >
                  <Settings className="w-4 h-4" />
                </button>

                {/* Top Section: Cover Photo - Increased by 5px (h-28 is 112px, so 117px) */}
                <div className="h-[117px] w-full overflow-hidden relative">
                  <img 
                    src={clanInfo.cover} 
                    alt="Clan Team" 
                    className="w-full h-full object-cover opacity-90"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0C0A] to-transparent opacity-60" />
                </div>

                {/* Overlapping Avatar - Clickable for Settings */}
                <button 
                  onClick={() => setIsSettingsOpen(true)}
                  className="absolute top-[76px] left-6 z-20 group/avatar active:scale-95 transition-transform"
                >
                  <div className="w-[132px] h-[132px] rounded-full border-[6px] border-[#0A0C0A] bg-black overflow-hidden shadow-2xl relative">
                    <img 
                      src={clanInfo.avatar} 
                      alt="Clan Avatar" 
                      className="w-full h-full object-cover group-hover/avatar:scale-110 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    {/* Edit Overlay */}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300">
                      <div className="w-10 h-10 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 flex items-center justify-center text-primary shadow-[0_0_20px_rgba(204,255,0,0.3)]">
                        <Edit2 className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </button>

                {/* Bottom Section: Content - Reduced height and moved text up to the maximum */}
                <div className="pt-4 pb-10 pl-44 pr-8 flex flex-col justify-center min-h-[132px]">
                  <div className="flex flex-col mb-2">
                    <MarqueeText 
                      text={clanInfo.name}
                      className="text-2xl font-black text-white uppercase tracking-tight leading-tight"
                    />
                    <MarqueeText 
                      text={clanInfo.location}
                      className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mt-0.5"
                    />
                  </div>
                  <div className="flex items-center gap-x-3 gap-y-1 text-[9px] font-bold uppercase tracking-[0.2em] leading-tight overflow-hidden">
                    <span className="text-white/20 flex-shrink-0">{CLAN_DATA.tag}</span>
                    <span className="text-white/10 flex-shrink-0">//</span>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <Users className="w-2.5 h-2.5 text-white/20" />
                      <span className="text-white/60">{CLAN_DATA.members}/{CLAN_DATA.maxMembers}</span>
                    </div>
                    <span className="text-primary/40 flex-shrink-0">•</span>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <Star className="w-2.5 h-2.5 text-primary/40" />
                      <span className="text-primary">LVL {CLAN_DATA.level}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 rounded-[32px] bg-white/[0.02] border border-white/5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-500">
                      <Globe className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Global Reyting</span>
                  </div>
                  <p className="text-2xl font-black tracking-tighter text-white">#{CLAN_DATA.rank}</p>
                  <p className="text-[9px] font-bold text-blue-500 uppercase tracking-widest mt-1">Top 1% klanlar</p>
                </div>
                <div className="p-6 rounded-[32px] bg-white/[0.02] border border-white/5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary">
                      <Map className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Hudud Nazorati</span>
                  </div>
                  <p className="text-2xl font-black tracking-tighter text-white">{CLAN_DATA.territory} <span className="text-xs text-white/30">km²</span></p>
                  <p className="text-[9px] font-bold text-primary uppercase tracking-widest mt-1">+2.4km² bu hafta</p>
                </div>
              </div>

              {/* Jamoaviy Maqsadlar */}
              <section>
                <div className="flex items-center justify-between mb-6 px-2">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40">Jamoaviy Maqsadlar</h3>
                  <button 
                    onClick={() => setIsCreateChallengeOpen(true)}
                    className="p-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-black transition-all"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-4">
                  {CLAN_DATA.challenges.map(challenge => (
                    <div key={challenge.id} className="h-[65px] px-5 rounded-[28px] bg-white/[0.02] border border-white/5 flex flex-col justify-center gap-1.5">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-xs font-black uppercase tracking-tight">{challenge.title}</h4>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] font-black text-primary uppercase tracking-widest">{challenge.reward}</p>
                        </div>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(challenge.progress / challenge.total) * 100}%` }}
                          className="h-full bg-primary"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Leaderboard */}
              <section>
                <div className="flex items-center justify-between mb-6 px-2">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40">Klan Reytingi</h3>
                  <TrendingUp className="w-4 h-4 text-white/20" />
                </div>
                <div className="space-y-3">
                  {CLAN_DATA.leaderboard.map((user, idx) => (
                    <div key={user.id} className="h-[60px] px-4 rounded-[24px] bg-white/[0.02] border border-white/5 flex items-center justify-between group hover:bg-white/[0.04] transition-all">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-xl object-cover border border-white/10" referrerPolicy="no-referrer" />
                          <div className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-black border border-white/10 flex items-center justify-center text-[8px] font-black text-white">
                            {idx + 1}
                          </div>
                        </div>
                        <div>
                          <MarqueeText 
                            text={user.name}
                            className="text-xs font-black uppercase tracking-tight w-24"
                          />
                          <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">{user.distance}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-[10px] font-black text-primary uppercase tracking-widest">{user.xp} XP</p>
                          <div className="flex gap-0.5 justify-end mt-1">
                            {[1,2,3].map(i => (
                              <div key={i} className={`w-1 h-1 rounded-full ${i <= (3-idx) ? 'bg-primary' : 'bg-white/10'}`} />
                            ))}
                          </div>
                        </div>
                        <button 
                          onClick={() => setSelectedMemberForOptions(user)}
                          className="p-2 rounded-xl bg-white/5 text-white/20 hover:text-white transition-colors"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Clan Feed */}
              <section>
                <div className="flex items-center justify-between mb-6 px-2">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40">So'nggi Voqealar</h3>
                  <MessageSquare className="w-4 h-4 text-white/20" />
                </div>
                <div className="space-y-4">
                  {CLAN_DATA.feed.map(item => (
                    <div key={item.id} className="flex gap-4 px-2">
                      <div className="w-1 h-auto bg-white/5 rounded-full relative">
                        <div className="absolute top-0 left-0 w-full h-4 bg-primary rounded-full shadow-[0_0_10px_rgba(204,255,0,0.5)]" />
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-[10px] font-black text-white uppercase tracking-tight">
                            {item.user} <span className="text-white/40 font-bold lowercase">{item.action}</span> {item.value && <span className="text-primary">{item.value}</span>}
                          </p>
                          <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">{item.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Perks */}
              <section>
                <div className="flex items-center justify-between mb-6 px-2">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40">Klan Imtiyozlari</h3>
                  <Award className="w-4 h-4 text-white/20" />
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {CLAN_DATA.perks.map(perk => (
                    <div key={perk.id} className={cn(
                      "h-[65px] px-5 rounded-[28px] border flex items-center gap-5 transition-all",
                      perk.unlocked 
                        ? "bg-white/[0.03] border-white/10" 
                        : "bg-black/20 border-white/5 grayscale opacity-50"
                    )}>
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center border",
                        perk.unlocked ? "bg-primary/10 border-primary/20 text-primary" : "bg-white/5 border-white/10 text-white/20"
                      )}>
                        {perk.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h4 className="text-xs font-black uppercase tracking-tight">{perk.title}</h4>
                          {!perk.unlocked && <Lock className="w-2.5 h-2.5 text-white/20" />}
                        </div>
                        <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest leading-relaxed">{perk.description}</p>
                      </div>
                      {perk.unlocked && (
                        <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(204,255,0,0.5)]" />
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <button 
                  onClick={() => setIsClanChatOpen(true)}
                  className="py-4 rounded-2xl bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all"
                >
                  Chatga kirish
                </button>
                <button 
                  onClick={() => setIsClanMembersOpen(true)}
                  className="py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] active:scale-95 transition-all"
                >
                  A'zolar ({CLAN_DATA.members})
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === "Chellenjlar" && (
            <motion.div
              key="chellenjlar"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="px-6 pt-6 pb-24 space-y-6"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-black uppercase tracking-tighter text-white">Barcha Chellenjlar</h3>
                <div className="p-2 rounded-xl bg-white/5 text-white/40">
                  <Award className="w-5 h-5" />
                </div>
              </div>
              
              <div className="space-y-4">
                {CLAN_DATA.allChallenges.map(challenge => (
                  <div key={challenge.id} className="p-5 rounded-[28px] bg-white/[0.02] border border-white/5 relative overflow-hidden group">
                    {challenge.status === 'completed' && (
                      <div className="absolute inset-0 bg-primary/5 z-0" />
                    )}
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-black uppercase tracking-tight">{challenge.title}</h4>
                            {challenge.status === 'completed' && <Award className="w-3.5 h-3.5 text-primary" />}
                          </div>
                          <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                            {challenge.status === 'upcoming' ? 'Boshlanmagan' : `${challenge.progress} / ${challenge.total} ${challenge.unit}`}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black text-primary uppercase tracking-widest">{challenge.reward}</p>
                          <p className={cn(
                            "text-[9px] font-bold uppercase tracking-widest mt-0.5",
                            challenge.status === 'completed' ? "text-primary/50" : 
                            challenge.status === 'upcoming' ? "text-white/20" : "text-white/40"
                          )}>
                            {challenge.timeLeft}
                          </p>
                        </div>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(challenge.progress / challenge.total) * 100}%` }}
                          className={cn(
                            "h-full rounded-full",
                            challenge.status === 'completed' ? "bg-primary" : 
                            challenge.status === 'upcoming' ? "bg-white/10" : "bg-primary"
                          )}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "Boshqa jamoalar" && (
            <motion.div
              key="boshqa-jamoalar"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="px-6 pt-6 pb-24 space-y-6"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                <input 
                  type="text" 
                  placeholder="Klan nomini qidiring..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-xs font-medium focus:outline-none focus:border-primary/50 transition-colors text-white placeholder:text-white/20"
                />
              </div>

              <div className="space-y-4">
                {CLAN_DATA.otherClans.map((clan, idx) => (
                  <div key={clan.id} className="p-4 rounded-[28px] bg-white/[0.02] border border-white/5 flex items-center gap-4">
                    <div className="relative">
                      <img src={clan.avatar} alt={clan.name} className="w-14 h-14 rounded-[20px] object-cover border border-white/10" referrerPolicy="no-referrer" />
                      <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-black border border-white/10 flex items-center justify-center text-[9px] font-black text-white">
                        #{clan.rank}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <MarqueeText 
                          text={clan.name}
                          className="text-sm font-black uppercase tracking-tight"
                        />
                        <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">{clan.tag}</span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[9px] font-bold uppercase tracking-widest overflow-hidden">
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Users className="w-3 h-3 text-white/20" />
                          <span className="text-white/60">{clan.members}/{clan.maxMembers}</span>
                        </div>
                        <span className="text-white/10 flex-shrink-0">•</span>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Star className="w-3 h-3 text-primary/40" />
                          <span className="text-primary">LVL {clan.level}</span>
                        </div>
                        <span className="text-white/10 flex-shrink-0">•</span>
                        <MarqueeText 
                          text={`${clan.territory} km²`}
                          className="text-blue-400 flex-1"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ClanChatModal 
        isOpen={isClanChatOpen}
        onClose={() => setIsClanChatOpen(false)}
      />

      <ClanMembersModal 
        isOpen={isClanMembersOpen}
        onClose={() => setIsClanMembersOpen(false)}
      />

      <ClanSettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        clanData={clanInfo}
        onUpdate={(newData) => setClanInfo(newData)}
      />

      <CreateChallengeModal 
        isOpen={isCreateChallengeOpen}
        onClose={() => setIsCreateChallengeOpen(false)}
      />

      <MemberOptionsSheet 
        isOpen={!!selectedMemberForOptions} 
        onClose={() => setSelectedMemberForOptions(null)} 
        member={selectedMemberForOptions} 
      />

      <BottomNav />
    </div>
  );
}
