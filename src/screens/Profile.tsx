import React, { useState, useEffect, useRef, useMemo } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import ReactCrop, { centerCrop, makeAspectCrop, Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { GoogleGenAI, Modality } from "@google/genai";
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Settings, Bell, X, MapPin, Clock, Zap, Target, Trophy, 
  ChevronRight, Activity, TrendingUp, Heart, Flame, Shield, Award,
  Footprints, Dumbbell, Bike, PersonStanding, Timer, ChevronLeft, Share2,
  Map, Compass, Globe, Crown, Navigation, Filter, Users, Sword, Flag, MessageSquare, Star, LayoutGrid, Info, Hexagon,
  MoreHorizontal, Plus, Lock, Send, Search, Instagram, Link as LinkIcon,
  Smartphone, Watch, Volume2, Languages, Trash2, EyeOff, UserCheck, Link2, Link2Off,
  User, Scale, Ruler, Calendar, Globe2, ShieldCheck, Radio, Headphones, Check, Quote,
  Battery, Bluetooth, AlertTriangle, VolumeX, Volume1, Volume, RefreshCw, Sparkles
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/src/lib/utils";
import { ColorfulBadge, GreyBadge } from "../components/PremiumBadges";
import TacticalGlobe from "../components/TacticalGlobe";
import { GhostBar } from "../components/GhostBar";
import { TacticalSparkline } from "../components/TacticalSparkline";
import { WeeklyProgress } from "../components/WeeklyProgress";

const STATS_CARDS = [
  {
    id: "distance",
    label: "Masofa",
    value: "47.3",
    unit: "km",
    badge: "+12%",
    icon: <MapPin className="w-4 h-4" />,
    color: "#CCFF00",
    chartData: [{value: 30}, {value: 35}, {value: 32}, {value: 40}, {value: 47}]
  },
  {
    id: "pace",
    label: "Temp",
    value: "5'12\"",
    unit: "avg",
    badge: "PRO",
    icon: <Zap className="w-4 h-4" />,
    color: "#00A3FF",
    chartData: [{value: 5.5}, {value: 5.4}, {value: 5.3}, {value: 5.2}, {value: 5.2}]
  },
  {
    id: "heart",
    label: "Puls",
    value: "142",
    unit: "bpm",
    badge: "OK",
    icon: <Activity className="w-4 h-4" />,
    color: "#CCFF00",
    chartData: [{value: 130}, {value: 135}, {value: 140}, {value: 138}, {value: 142}]
  },
];

const PERSONAL_BESTS = [
  { label: "Eng tez 1 km", value: "4:12", date: "Kecha" },
  { label: "Eng uzoq", value: "12.4 km", date: "12-mart" },
  { label: "Eng ko'p XP", value: "2,450", date: "Yaksh." },
];

export type Tier = 'common' | 'rare' | 'epic' | 'legendary';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  tier: Tier;
  isUnlocked: boolean;
  progress: number;
  total: number;
  unit: string;
  category: 'territory' | 'distance' | 'streak' | 'marathon';
}

export const TIER_STYLES = {
  common: { 
    text: "text-slate-300", 
    border: "#94a3b8",
    fill: "rgba(148, 163, 184, 0.1)",
    shadow: "drop-shadow-[0_0_8px_rgba(148,163,184,0.5)]",
    label: "Oddiy"
  },
  rare: { 
    text: "text-[#CCFF00]", 
    border: "#CCFF00", 
    fill: "rgba(204, 255, 0, 0.1)",
    shadow: "drop-shadow-[0_0_12px_rgba(204,255,0,0.6)]",
    label: "Noyob"
  },
  epic: { 
    text: "text-fuchsia-400", 
    border: "#e879f9",
    fill: "rgba(232, 121, 249, 0.1)",
    shadow: "drop-shadow-[0_0_8px_rgba(232,121,249,0.5)]",
    label: "Doston"
  },
  legendary: { 
    text: "text-amber-400", 
    border: "#fbbf24",
    fill: "rgba(251, 191, 36, 0.1)",
    shadow: "drop-shadow-[0_0_20px_rgba(251,191,36,0.6)]",
    label: "Afsonaviy"
  }
};

const TERRITORY_ACHIEVEMENTS: Achievement[] = [
  { id: "t-1", title: "1 kv.km", description: "O'z mahallangizni o'rganib chiqing.", icon: <img src="/badges/hudud1.png" className="w-14 h-14 object-contain drop-shadow-md" alt="1 kv.km" referrerPolicy="no-referrer" />, tier: "common", isUnlocked: true, progress: 1, total: 1, unit: "kv.km", category: 'territory' },
  { id: "t-5", title: "5 kv.km", description: "Ko'chalarni o'z uyingizdek his qiling.", icon: <img src="/badges/hudud2.png" className="w-14 h-14 object-contain drop-shadow-md" alt="5 kv.km" referrerPolicy="no-referrer" />, tier: "common", isUnlocked: true, progress: 5, total: 5, unit: "kv.km", category: 'territory' },
  { id: "t-10", title: "10 kv.km", description: "Butun tumanni zabt eting.", icon: <img src="/badges/hudud3.png" className="w-14 h-14 object-contain drop-shadow-md" alt="10 kv.km" referrerPolicy="no-referrer" />, tier: "common", isUnlocked: true, progress: 10, total: 10, unit: "kv.km", category: 'territory' },
  { id: "t-20", title: "20 kv.km", description: "Yangi hududlarni kashf eting.", icon: <img src="/badges/hudud4.png" className="w-14 h-14 object-contain drop-shadow-md" alt="20 kv.km" referrerPolicy="no-referrer" />, tier: "rare", isUnlocked: false, progress: 18, total: 20, unit: "kv.km", category: 'territory' },
  { id: "t-30", title: "30 kv.km", description: "Shaharning katta qismini egallang.", icon: <img src="/badges/hudud5.png" className="w-14 h-14 object-contain drop-shadow-md" alt="30 kv.km" referrerPolicy="no-referrer" />, tier: "rare", isUnlocked: false, progress: 18, total: 30, unit: "kv.km", category: 'territory' },
  { id: "t-50", title: "50 kv.km", description: "Katta hududlarni o'z nazoratingizga oling.", icon: <img src="/badges/hudud6.png" className="w-14 h-14 object-contain drop-shadow-md" alt="50 kv.km" referrerPolicy="no-referrer" />, tier: "rare", isUnlocked: false, progress: 18, total: 50, unit: "kv.km", category: 'territory' },
  { id: "t-75", title: "75 kv.km", description: "Haqiqiy kashfiyotchi.", icon: <img src="/badges/hudud7.png" className="w-14 h-14 object-contain drop-shadow-md" alt="75 kv.km" referrerPolicy="no-referrer" />, tier: "epic", isUnlocked: false, progress: 18, total: 75, unit: "kv.km", category: 'territory' },
  { id: "t-100", title: "100 kv.km", description: "Poytaxtning haqiqiy afsonasiga aylaning.", icon: <img src="/badges/hudud8.png" className="w-14 h-14 object-contain drop-shadow-md" alt="100 kv.km" referrerPolicy="no-referrer" />, tier: "epic", isUnlocked: false, progress: 18, total: 100, unit: "kv.km", category: 'territory' },
  { id: "t-150", title: "150 kv.km", description: "Chegaralarni buzib o'ting.", icon: <img src="/badges/hudud9.png" className="w-14 h-14 object-contain drop-shadow-md" alt="150 kv.km" referrerPolicy="no-referrer" />, tier: "legendary", isUnlocked: false, progress: 18, total: 150, unit: "kv.km", category: 'territory' },
  { id: "t-200", title: "200 kv.km", description: "Mutlaq dominantlik.", icon: <img src="/badges/hudud10.png" className="w-14 h-14 object-contain drop-shadow-md" alt="200 kv.km" referrerPolicy="no-referrer" />, tier: "legendary", isUnlocked: false, progress: 18, total: 200, unit: "kv.km", category: 'territory' },
];

const DISTANCE_ACHIEVEMENTS: Achievement[] = [
  { id: "d-10", title: "10 km", description: "Birinchi 10 km masofa.", icon: <img src="/badges/masofa1.png" className="w-14 h-14 object-contain drop-shadow-md" alt="10 km" referrerPolicy="no-referrer" />, tier: "common", isUnlocked: true, progress: 10, total: 10, unit: "km", category: 'distance' },
  { id: "d-50", title: "50 km", description: "50 km masofa bosib o'tildi.", icon: <img src="/badges/masofa2.png" className="w-14 h-14 object-contain drop-shadow-md" alt="50 km" referrerPolicy="no-referrer" />, tier: "common", isUnlocked: true, progress: 50, total: 50, unit: "km", category: 'distance' },
  { id: "d-100", title: "100 km", description: "100 km masofa bosib o'tildi.", icon: <img src="/badges/masofa3.png" className="w-14 h-14 object-contain drop-shadow-md" alt="100 km" referrerPolicy="no-referrer" />, tier: "common", isUnlocked: true, progress: 100, total: 100, unit: "km", category: 'distance' },
  { id: "d-200", title: "200 km", description: "200 km masofa bosib o'tildi.", icon: <img src="/badges/masofa4.png" className="w-14 h-14 object-contain drop-shadow-md" alt="200 km" referrerPolicy="no-referrer" />, tier: "rare", isUnlocked: false, progress: 120, total: 200, unit: "km", category: 'distance' },
  { id: "d-300", title: "300 km", description: "300 km masofa bosib o'tildi.", icon: <img src="/badges/masofa5.png" className="w-14 h-14 object-contain drop-shadow-md" alt="300 km" referrerPolicy="no-referrer" />, tier: "rare", isUnlocked: false, progress: 120, total: 300, unit: "km", category: 'distance' },
  { id: "d-500", title: "500 km", description: "500 km masofa bosib o'tildi.", icon: <img src="/badges/masofa6.png" className="w-14 h-14 object-contain drop-shadow-md" alt="500 km" referrerPolicy="no-referrer" />, tier: "rare", isUnlocked: false, progress: 120, total: 500, unit: "km", category: 'distance' },
  { id: "d-750", title: "750 km", description: "750 km masofa bosib o'tildi.", icon: <img src="/badges/masofa7.png" className="w-14 h-14 object-contain drop-shadow-md" alt="750 km" referrerPolicy="no-referrer" />, tier: "epic", isUnlocked: false, progress: 120, total: 750, unit: "km", category: 'distance' },
  { id: "d-1000", title: "1000 km", description: "1000 km masofa bosib o'tildi.", icon: <img src="/badges/masofa8.png" className="w-14 h-14 object-contain drop-shadow-md" alt="1000 km" referrerPolicy="no-referrer" />, tier: "epic", isUnlocked: false, progress: 120, total: 1000, unit: "km", category: 'distance' },
  { id: "d-1500", title: "1500 km", description: "1500 km masofa bosib o'tildi.", icon: <img src="/badges/masofa9.png" className="w-14 h-14 object-contain drop-shadow-md" alt="1500 km" referrerPolicy="no-referrer" />, tier: "legendary", isUnlocked: false, progress: 120, total: 1500, unit: "km", category: 'distance' },
  { id: "d-2000", title: "2000 km", description: "2000 km masofa bosib o'tildi.", icon: <img src="/badges/masofa10.png" className="w-14 h-14 object-contain drop-shadow-md" alt="2000 km" referrerPolicy="no-referrer" />, tier: "legendary", isUnlocked: false, progress: 120, total: 2000, unit: "km", category: 'distance' },
];

const STREAK_ACHIEVEMENTS: Achievement[] = [
  { id: "s-3", title: "3 kun", description: "3 kun ketma-ket mashg'ulot.", icon: <img src="/badges/uzluksizlik1.png" className="w-14 h-14 object-contain drop-shadow-md" alt="3 kun" referrerPolicy="no-referrer" />, tier: "common", isUnlocked: true, progress: 3, total: 3, unit: "kun", category: 'streak' },
  { id: "s-7", title: "7 kun", description: "7 kun ketma-ket mashg'ulot.", icon: <img src="/badges/uzluksizlik2.png" className="w-14 h-14 object-contain drop-shadow-md" alt="7 kun" referrerPolicy="no-referrer" />, tier: "common", isUnlocked: true, progress: 7, total: 7, unit: "kun", category: 'streak' },
  { id: "s-14", title: "14 kun", description: "14 kun ketma-ket mashg'ulot.", icon: <img src="/badges/uzluksizlik3.png" className="w-14 h-14 object-contain drop-shadow-md" alt="14 kun" referrerPolicy="no-referrer" />, tier: "common", isUnlocked: false, progress: 10, total: 14, unit: "kun", category: 'streak' },
  { id: "s-21", title: "21 kun", description: "21 kun ketma-ket mashg'ulot.", icon: <img src="/badges/uzluksizlik4.png" className="w-14 h-14 object-contain drop-shadow-md" alt="21 kun" referrerPolicy="no-referrer" />, tier: "rare", isUnlocked: false, progress: 10, total: 21, unit: "kun", category: 'streak' },
  { id: "s-30", title: "30 kun", description: "30 kun ketma-ket mashg'ulot.", icon: <img src="/badges/uzluksizlik5.png" className="w-14 h-14 object-contain drop-shadow-md" alt="30 kun" referrerPolicy="no-referrer" />, tier: "rare", isUnlocked: false, progress: 10, total: 30, unit: "kun", category: 'streak' },
  { id: "s-50", title: "50 kun", description: "50 kun ketma-ket mashg'ulot.", icon: <img src="/badges/uzluksizlik6.png" className="w-14 h-14 object-contain drop-shadow-md" alt="50 kun" referrerPolicy="no-referrer" />, tier: "rare", isUnlocked: false, progress: 10, total: 50, unit: "kun", category: 'streak' },
  { id: "s-100", title: "100 kun", description: "100 kun ketma-ket mashg'ulot.", icon: <img src="/badges/uzluksizlik7.png" className="w-14 h-14 object-contain drop-shadow-md" alt="100 kun" referrerPolicy="no-referrer" />, tier: "epic", isUnlocked: false, progress: 10, total: 100, unit: "kun", category: 'streak' },
  { id: "s-150", title: "150 kun", description: "150 kun ketma-ket mashg'ulot.", icon: <img src="/badges/uzluksizlik8.png" className="w-14 h-14 object-contain drop-shadow-md" alt="150 kun" referrerPolicy="no-referrer" />, tier: "epic", isUnlocked: false, progress: 10, total: 150, unit: "kun", category: 'streak' },
  { id: "s-200", title: "200 kun", description: "200 kun ketma-ket mashg'ulot.", icon: <img src="/badges/uzluksizlik9.png" className="w-14 h-14 object-contain drop-shadow-md" alt="200 kun" referrerPolicy="no-referrer" />, tier: "legendary", isUnlocked: false, progress: 10, total: 200, unit: "kun", category: 'streak' },
  { id: "s-365", title: "365 kun", description: "1 yil ketma-ket mashg'ulot.", icon: <img src="/badges/uzluksizlik10.png" className="w-14 h-14 object-contain drop-shadow-md" alt="365 kun" referrerPolicy="no-referrer" />, tier: "legendary", isUnlocked: false, progress: 10, total: 365, unit: "kun", category: 'streak' },
];

const MARATHON_ACHIEVEMENTS: Achievement[] = [
  { id: "m-1", title: "1 km", description: "Bir urinishda 1 km.", icon: <img src="/badges/marafon1.png" className="w-14 h-14 object-contain drop-shadow-md" alt="1 km" referrerPolicy="no-referrer" />, tier: "common", isUnlocked: true, progress: 1, total: 1, unit: "km", category: 'marathon' },
  { id: "m-3", title: "3 km", description: "Bir urinishda 3 km.", icon: <img src="/badges/marafon2.png" className="w-14 h-14 object-contain drop-shadow-md" alt="3 km" referrerPolicy="no-referrer" />, tier: "common", isUnlocked: true, progress: 3, total: 3, unit: "km", category: 'marathon' },
  { id: "m-5", title: "5 km", description: "Bir urinishda 5 km.", icon: <img src="/badges/marafon3.png" className="w-14 h-14 object-contain drop-shadow-md" alt="5 km" referrerPolicy="no-referrer" />, tier: "common", isUnlocked: true, progress: 5, total: 5, unit: "km", category: 'marathon' },
  { id: "m-10", title: "10 km", description: "Bir urinishda 10 km.", icon: <img src="/badges/marafon4.png" className="w-14 h-14 object-contain drop-shadow-md" alt="10 km" referrerPolicy="no-referrer" />, tier: "rare", isUnlocked: false, progress: 8, total: 10, unit: "km", category: 'marathon' },
  { id: "m-15", title: "15 km", description: "Bir urinishda 15 km.", icon: <img src="/badges/marafon5.png" className="w-14 h-14 object-contain drop-shadow-md" alt="15 km" referrerPolicy="no-referrer" />, tier: "rare", isUnlocked: false, progress: 8, total: 15, unit: "km", category: 'marathon' },
  { id: "m-21", title: "Yarim marafon", description: "Bir urinishda 21.1 km.", icon: <img src="/badges/marafon6.png" className="w-14 h-14 object-contain drop-shadow-md" alt="21.1 km" referrerPolicy="no-referrer" />, tier: "rare", isUnlocked: false, progress: 8, total: 21.1, unit: "km", category: 'marathon' },
  { id: "m-30", title: "30 km", description: "Bir urinishda 30 km.", icon: <img src="/badges/marafon7.png" className="w-14 h-14 object-contain drop-shadow-md" alt="30 km" referrerPolicy="no-referrer" />, tier: "epic", isUnlocked: false, progress: 8, total: 30, unit: "km", category: 'marathon' },
  { id: "m-42", title: "Marafon", description: "Bir urinishda 42.2 km.", icon: <img src="/badges/marafon8.png" className="w-14 h-14 object-contain drop-shadow-md" alt="42.2 km" referrerPolicy="no-referrer" />, tier: "epic", isUnlocked: false, progress: 8, total: 42.2, unit: "km", category: 'marathon' },
  { id: "m-50", title: "Ultramarafon", description: "Bir urinishda 50 km.", icon: <img src="/badges/marafon9.png" className="w-14 h-14 object-contain drop-shadow-md" alt="50 km" referrerPolicy="no-referrer" />, tier: "legendary", isUnlocked: false, progress: 8, total: 50, unit: "km", category: 'marathon' },
  { id: "m-100", title: "100 km", description: "Bir urinishda 100 km.", icon: <img src="/badges/marafon10.png" className="w-14 h-14 object-contain drop-shadow-md" alt="100 km" referrerPolicy="no-referrer" />, tier: "legendary", isUnlocked: false, progress: 8, total: 100, unit: "km", category: 'marathon' },
  { id: "m-150", title: "150 km", description: "Bir urinishda 150 km.", icon: <img src="/badges/marafon11.png" className="w-14 h-14 object-contain drop-shadow-md" alt="150 km" referrerPolicy="no-referrer" />, tier: "legendary", isUnlocked: false, progress: 8, total: 150, unit: "km", category: 'marathon' },
  { id: "m-200", title: "200 km", description: "Bir urinishda 200 km.", icon: <img src="/badges/marafon12.png" className="w-14 h-14 object-contain drop-shadow-md" alt="200 km" referrerPolicy="no-referrer" />, tier: "legendary", isUnlocked: false, progress: 8, total: 200, unit: "km", category: 'marathon' },
];

interface AchievementShowcaseProps {
  achievements: Achievement[];
  onSelect: (ach: Achievement) => void;
}

const AchievementShowcase: React.FC<AchievementShowcaseProps> = ({ achievements, onSelect }) => {
  return (
    <div className="w-full overflow-x-auto pb-6 pt-2 hide-scrollbar">
      <div className="flex gap-4 px-2 w-max">
        {achievements.map((ach) => (
          <GlassAchievementCard key={ach.id} achievement={ach} onClick={() => onSelect(ach)} />
        ))}
      </div>
    </div>
  );
};

interface GlassAchievementCardProps {
  achievement: Achievement;
  onClick: () => void;
}

const GlassAchievementCard: React.FC<GlassAchievementCardProps> = ({ achievement, onClick }) => {
  const style = TIER_STYLES[achievement.tier];
  
  return (
    <motion.div 
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "relative w-[140px] h-[180px] flex flex-col items-center justify-center p-2 cursor-pointer transition-all duration-500",
        achievement.isUnlocked ? "bg-transparent" : "grayscale opacity-60"
      )}
    >
      {/* Top Gradient Glow */}
      {achievement.isUnlocked && (
        <div 
          className="absolute top-0 left-0 w-full h-1/2 opacity-10 pointer-events-none"
          style={{ background: `linear-gradient(to bottom, ${style.border}, transparent)` }}
        />
      )}

      {/* Icon */}
      <div 
        className={cn(
          "relative flex items-center justify-center mb-4 transition-all duration-500",
          achievement.isUnlocked ? "" : "grayscale opacity-50"
        )}
      >
        <div className={cn("scale-100", achievement.isUnlocked ? "" : "text-white/20")}>
          {achievement.icon}
        </div>
      </div>

      {/* Title */}
      <span className={cn(
        "text-[10px] font-medium uppercase tracking-[0.15em] text-center leading-tight line-clamp-2 mt-2",
        achievement.isUnlocked ? "text-white/90" : "text-white/30"
      )}>
        {achievement.title}
      </span>
    </motion.div>
  );
};

interface MinimalGridAchievementCardProps {
  achievement: Achievement;
  onClick: () => void;
}

const MinimalGridAchievementCard: React.FC<MinimalGridAchievementCardProps> = ({ achievement, onClick }) => {
  const style = TIER_STYLES[achievement.tier];
  
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "relative aspect-square flex flex-col items-center justify-center p-2 cursor-pointer transition-all duration-500",
        achievement.isUnlocked 
          ? "bg-transparent" 
          : "grayscale opacity-40"
      )}
    >
      {/* Subtle Glow */}
      {achievement.isUnlocked && (
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ background: `radial-gradient(circle at center, ${style.border}, transparent 70%)` }}
        />
      )}

      {/* Icon */}
      <div className={cn(
        "mb-2 transition-all duration-500",
        achievement.isUnlocked ? "" : "text-white/20 grayscale opacity-50"
      )}>
        {achievement.icon}
      </div>

      {/* Title (Numerical) */}
      <span className={cn(
        "text-[10px] font-black uppercase tracking-wider text-center leading-tight line-clamp-2 mt-1",
        achievement.isUnlocked ? "text-white" : "text-white/30"
      )}>
        {achievement.title}
      </span>
    </motion.div>
  );
};

interface AchievementDetailsProps {
  achievement: Achievement | null;
  onClose: () => void;
}

const AchievementDetails: React.FC<AchievementDetailsProps> = ({ achievement, onClose }) => {
  if (!achievement) return null;

  const style = TIER_STYLES[achievement.tier];
  const progressPercent = Math.min(100, (achievement.progress / achievement.total) * 100);

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 z-[100] flex items-end justify-center bg-black/40 backdrop-blur-xl p-0"
        onClick={onClose}
      >
        <motion.div 
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="w-full max-w-[450px] bg-black/60 backdrop-blur-2xl border-t border-white/10 rounded-t-[40px] p-8 pb-12 relative shadow-[0_-20px_50px_rgba(0,0,0,0.5)]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Handle */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/10 rounded-full" />

          <div className="flex flex-col items-center text-center mt-4">
            {/* Tier Badge */}
            <div className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border", style.text, `border-[${style.border}]`, style.bg)}>
              {style.label} Daraja
            </div>

            {/* Large Glass Display */}
            <div className="relative w-full h-48 mb-8 flex items-center justify-center rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-xl overflow-hidden">
              {/* Glow */}
              {achievement.isUnlocked && (
                <div 
                  className="absolute inset-0 opacity-10 pointer-events-none"
                  style={{ background: `radial-gradient(circle at center, ${style.border}, transparent 70%)` }}
                />
              )}
              
              {/* Icon */}
              <div 
                className={cn(
                  "relative flex items-center justify-center transition-all duration-500",
                  achievement.isUnlocked ? "" : "grayscale opacity-50"
                )}
              >
                {/* Icon */}
                <div className={cn(
                  "relative z-10 transition-all duration-500 scale-[1.5]",
                  achievement.isUnlocked ? "" : "text-white/20"
                )}>
                  {achievement.icon}
                </div>
              </div>
            </div>

            <h3 className="text-xl font-light text-white uppercase tracking-[0.2em] mb-2">
              {achievement.title}
            </h3>
            <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.3em] mb-8">
              {achievement.isUnlocked ? "Yutuq qo'lga kiritildi" : "Qulflangan"}
            </p>

            <div className="w-full p-6 rounded-3xl bg-white/5 border border-white/10 mb-8 text-left">
              <p className="text-xs text-white/80 leading-relaxed font-medium mb-6 text-center">
                {achievement.description}
              </p>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/60">
                  <span>Taraqqiyot</span>
                  <span>{achievement.progress} / {achievement.total} {achievement.unit}</span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: style.border }}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 w-full">
              <button 
                onClick={onClose}
                className="flex-1 py-4 rounded-2xl bg-white text-black font-black uppercase tracking-widest active:scale-95 transition-transform"
              >
                Yopish
              </button>
              <button 
                className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white active:scale-95 transition-transform disabled:opacity-50"
                disabled={!achievement.isUnlocked}
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: achievement.title,
                      text: `Men "${achievement.title}" yutug'ini qo'lga kiritdim!`,
                      url: window.location.href,
                    }).catch(console.error);
                  } else {
                    alert("Ulashish funksiyasi ushbu qurilmada mavjud emas.");
                  }
                }}
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const AllAchievementsModal = ({ isOpen, onClose, onSelect }: { isOpen: boolean, onClose: () => void, onSelect: (ach: any) => void }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 z-[90] bg-black/40 backdrop-blur-xl flex justify-center overflow-y-auto"
      >
        <div className="w-full max-w-[450px] p-4 sm:p-6 min-h-full bg-black/60 backdrop-blur-2xl border-x border-white/10 shadow-2xl">
          <div className="flex items-center justify-between mb-6 pt-2">
          <h2 className="text-base font-black uppercase tracking-[0.2em] text-white">Barcha Yutuqlar</h2>
          <button onClick={onClose} className="p-2 rounded-full bg-white/10 text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Territory Category */}
        <div className="mb-8">
          <h3 className="text-[10px] font-light text-white/60 uppercase tracking-[0.3em] mb-4 px-2">Hudud Egallash</h3>
          <div className="grid grid-cols-4 gap-2 px-1">
            {TERRITORY_ACHIEVEMENTS.map((ach) => (
              <MinimalGridAchievementCard key={ach.id} achievement={ach} onClick={() => onSelect(ach)} />
            ))}
          </div>
        </div>

        {/* Distance Category */}
        <div className="mb-8">
          <h3 className="text-[10px] font-light text-white/60 uppercase tracking-[0.3em] mb-4 px-2">Masofa</h3>
          <div className="grid grid-cols-4 gap-2 px-1">
            {DISTANCE_ACHIEVEMENTS.map((ach) => (
              <MinimalGridAchievementCard key={ach.id} achievement={ach} onClick={() => onSelect(ach)} />
            ))}
          </div>
        </div>

        {/* Streak Category */}
        <div className="mb-8">
          <h3 className="text-[10px] font-light text-white/60 uppercase tracking-[0.3em] mb-4 px-2">Uzluksizlik</h3>
          <div className="grid grid-cols-4 gap-2 px-1">
            {STREAK_ACHIEVEMENTS.map((ach) => (
              <MinimalGridAchievementCard key={ach.id} achievement={ach} onClick={() => onSelect(ach)} />
            ))}
          </div>
        </div>

        {/* Marathon Category */}
        <div className="pb-10">
          <h3 className="text-[10px] font-light text-white/60 uppercase tracking-[0.3em] mb-4 px-2">Bir Urinishdagi Masofa</h3>
          <div className="grid grid-cols-4 gap-2 px-1">
            {MARATHON_ACHIEVEMENTS.map((ach) => (
              <MinimalGridAchievementCard key={ach.id} achievement={ach} onClick={() => onSelect(ach)} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
    </AnimatePresence>
  );
};

const WEEKLY_DATA = [
  { label: "Du", value: 30, pace: "5'45\"" },
  { label: "Se", value: 45, pace: "5'30\"" },
  { label: "Ch", value: 85, pace: "5'20\"" },
  { label: "Pa", value: 40, pace: "5'40\"" },
  { label: "Ju", value: 50, pace: "5'10\"" },
  { label: "Sh", value: 95, pace: "5'05\"" },
  { label: "Ya", value: 55, pace: "5'25\"" },
];

const MONTHLY_DATA = [
  { label: "May", value: 40, pace: "5'40\"" },
  { label: "Iyn", value: 65, pace: "5'25\"" },
  { label: "Iyl", value: 50, pace: "5'30\"" },
  { label: "Avg", value: 85, pace: "5'15\"" },
  { label: "Sen", value: 70, highlighted: true, badge: "78 km", pace: "5'12\"" },
];

const YEARLY_DATA = [
  { label: "Yan", value: 30 },
  { label: "Fev", value: 40 },
  { label: "Mar", value: 55 },
  { label: "Apr", value: 45 },
  { label: "May", value: 60 },
  { label: "Iyn", value: 75 },
  { label: "Iyl", value: 80 },
  { label: "Avg", value: 90 },
  { label: "Sen", value: 85, highlighted: true, badge: "840 km" },
  { label: "Okt", value: 0 },
  { label: "Noy", value: 0 },
  { label: "Dek", value: 0 },
];

const CHART_VIEWS = [
  { id: "weekly", title: "Haftalik Faollik", subtitle: "Oxirgi 7 kun", data: WEEKLY_DATA },
  { id: "monthly", title: "Oylik Dinamika", subtitle: "Oxirgi 5 oy", data: MONTHLY_DATA },
  { id: "yearly", title: "Yillik Statistika", subtitle: "2024-yil", data: YEARLY_DATA },
];

interface Goal {
  id: number;
  title: string;
  subtitle: string;
  progress: number;
  total: number;
  current: number;
  unit: string;
  icon: React.ReactNode;
  color: string;
  reward: string;
  timeLeft?: string;
  category: 'distance' | 'time' | 'calories' | 'xp';
  type: 'weekly' | 'monthly' | 'custom';
  status: 'active' | 'completed';
}

const INITIAL_GOALS: Goal[] = [
  {
    id: 1,
    title: "Haftalik maqsad",
    subtitle: "47.3 km / 60 km",
    progress: 78,
    current: 47.3,
    total: 60,
    unit: "km",
    icon: <Target className="w-5 h-5" />,
    color: "#CCFF00",
    reward: "500 XP",
    timeLeft: "2 kun qoldi",
    category: 'distance',
    type: 'weekly',
    status: 'active'
  },
  {
    id: 2,
    title: "Oylik maqsad",
    subtitle: "147.3 km / 300 km",
    progress: 49,
    current: 147.3,
    total: 300,
    unit: "km",
    icon: <Trophy className="w-5 h-5" />,
    color: "#00A3FF",
    reward: "2500 XP + Badge",
    timeLeft: "12 kun qoldi",
    category: 'distance',
    type: 'monthly',
    status: 'active'
  },
  {
    id: 3,
    title: "Shaxsiy maqsad",
    subtitle: "5 / 10 mashg'ulot",
    progress: 50,
    current: 5,
    total: 10,
    unit: "ta",
    icon: <Zap className="w-5 h-5" />,
    color: "#FF005C",
    reward: "1000 XP",
    timeLeft: "5 kun qoldi",
    category: 'xp',
    type: 'custom',
    status: 'active'
  }
];

const COMPLETED_GOALS: Goal[] = [
  {
    id: 101,
    title: "Fevral oyi marafoni",
    subtitle: "250 km / 250 km",
    progress: 100,
    current: 250,
    total: 250,
    unit: "km",
    icon: <Award className="w-5 h-5" />,
    color: "#CCFF00",
    reward: "3000 XP",
    category: 'distance',
    type: 'monthly',
    status: 'completed'
  },
  {
    id: 102,
    title: "7 kunlik uzluksizlik",
    subtitle: "7 / 7 kun",
    progress: 100,
    current: 7,
    total: 7,
    unit: "kun",
    icon: <Flame className="w-5 h-5" />,
    color: "#FF8A00",
    reward: "800 XP",
    category: 'time',
    type: 'weekly',
    status: 'completed'
  }
];

const GoalsModal = ({ 
  isOpen, 
  onClose, 
  goals, 
  setGoals, 
  completedGoals, 
  setCompletedGoals,
  initialTab,
  initialPeriod
}: { 
  isOpen: boolean, 
  onClose: () => void,
  goals: Goal[],
  setGoals: React.Dispatch<React.SetStateAction<Goal[]>>,
  completedGoals: Goal[],
  setCompletedGoals: React.Dispatch<React.SetStateAction<Goal[]>>,
  initialTab?: 'active' | 'history' | 'new',
  initialPeriod?: string
}) => {
  const [activeTab, setActiveTab] = useState<'active' | 'history' | 'new'>(initialTab || 'active');
  const [filter, setFilter] = useState<'all' | 'distance' | 'time' | 'calories' | 'xp'>('all');
  const [mainTab, setMainTab] = useState<'goals' | 'marathon'>(initialPeriod === 'Maxsus' ? 'marathon' : 'goals');

  // Form State
  const [newGoalType, setNewGoalType] = useState<string>('Masofa');
  const [newGoalValue, setNewGoalValue] = useState<string>('');
  const [newGoalPeriod, setNewGoalPeriod] = useState<string>(initialPeriod === 'Maxsus' ? 'Haftalik' : initialPeriod || 'Haftalik');
  const [newGoalTitle, setNewGoalTitle] = useState<string>('');

  // AI Marafon State
  const [marafonDistance, setMarafonDistance] = useState('5');
  const [marafonDurationValue, setMarafonDurationValue] = useState('4');
  const [marafonDurationUnit, setMarafonDurationUnit] = useState<'Hafta' | 'Oy'>('Hafta');
  const [marafonDaysPerWeek, setMarafonDaysPerWeek] = useState('3');
  const [isCalculated, setIsCalculated] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab || 'active');
      if (initialPeriod) {
        if (initialPeriod === 'Maxsus') {
          setMainTab('marathon');
          setNewGoalPeriod('Haftalik');
        } else {
          setMainTab('goals');
          setNewGoalPeriod(initialPeriod);
        }
      }
    }
  }, [isOpen, initialTab, initialPeriod]);

  const filteredActive = goals.filter(g => filter === 'all' || g.category === filter);
  const filteredHistory = completedGoals.filter(g => filter === 'all' || g.category === filter);

  const handleAddGoal = () => {
    if (!newGoalValue) return;

    const unit = newGoalType === 'Masofa' ? 'km' : newGoalType === 'Vaqt' ? 'daq' : newGoalType === 'Kaloriya' ? 'kkal' : 'ta';
    const categoryMap: Record<string, Goal['category']> = {
      'Masofa': 'distance',
      'Vaqt': 'time',
      'Kaloriya': 'calories',
      'Mashg\'ulot': 'xp'
    };

    const periodType = newGoalPeriod === 'Haftalik' ? 'weekly' : newGoalPeriod === 'Oylik' ? 'monthly' : 'custom';
    const titlePrefix = newGoalPeriod === 'Haftalik' ? 'Haftalik' : newGoalPeriod === 'Oylik' ? 'Oylik' : newGoalTitle || 'Shaxsiy';
    const color = newGoalPeriod === 'Haftalik' ? '#DFFF00' : newGoalPeriod === 'Oylik' ? '#00A3FF' : '#FF005C';

    const newGoal: Goal = {
      id: Date.now(),
      title: `${titlePrefix}${newGoalPeriod === 'Maxsus' && !newGoalTitle ? ' maqsad' : newGoalTitle ? '' : ' maqsad'}`,
      subtitle: `0 / ${newGoalValue} ${unit}`,
      progress: 0,
      current: 0,
      total: parseFloat(newGoalValue),
      unit: unit,
      icon: newGoalType === 'Masofa' ? <Target className="w-5 h-5" /> : newGoalType === 'Vaqt' ? <Clock className="w-5 h-5" /> : <Zap className="w-5 h-5" />,
      color: color,
      reward: `${Math.floor(parseFloat(newGoalValue) * 10)} XP`,
      timeLeft: newGoalPeriod === 'Haftalik' ? '7 kun qoldi' : newGoalPeriod === 'Oylik' ? '30 kun qoldi' : 'Maxsus muddat',
      category: categoryMap[newGoalType] || 'distance',
      type: periodType as any,
      status: 'active'
    };

    setGoals((prev) => {
      const idx = prev.findIndex(g => g.type === periodType && g.status === 'active');
      if (idx > -1) {
        const next = [...prev];
        next[idx] = newGoal;
        return next;
      }
      return [newGoal, ...prev];
    });

    setActiveTab('active');
    setNewGoalValue('');
    setNewGoalTitle('');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 z-[110] bg-black/40 backdrop-blur-xl flex items-center justify-center"
      >
        <motion.div 
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="w-full h-full max-w-[450px] bg-black/60 backdrop-blur-2xl flex flex-col relative border-x border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
        >
          {/* Header */}
          <div className="p-4 flex items-center justify-between border-b border-white/10 bg-white/5">
          <div>
            <h2 className="text-lg font-black uppercase tracking-tighter text-white">Maqsadlar <span className="text-primary">Markazi</span></h2>
            <p className="text-[9px] text-white/40 font-bold uppercase tracking-widest">Sizning intilishlaringiz</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-4 pb-8 no-scrollbar">
          <div className="flex gap-2 py-3">
            {[
              { id: 'active', label: 'Faol' },
              { id: 'history', label: 'Tarix' },
              { id: 'new', label: 'Maqsad Qo\'shish' }
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex-1 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all border",
                  activeTab === tab.id 
                    ? "bg-white/10 text-white border-white/20" 
                    : "bg-transparent text-white/30 border-white/5"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab !== 'new' && (
            <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar py-1">
              {['all', 'distance', 'time', 'calories', 'xp'].map((f) => (
                <button 
                  key={f}
                  onClick={() => setFilter(f as any)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest whitespace-nowrap border transition-all",
                    filter === f 
                      ? "bg-white/10 text-white border-white/20" 
                      : "bg-transparent text-white/30 border-white/5"
                  )}
                >
                  {f === 'all' ? 'Barchasi' : f}
                </button>
              ))}
            </div>
          )}

          {activeTab === 'active' && (
            <div className="space-y-4 pt-2">
              {filteredActive.map((goal) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={goal.id}
                  className="flex flex-col gap-2 text-left w-full bg-[#161616] rounded-[20px] py-3 px-4 relative overflow-hidden group shadow-[4px_4px_10px_#080808,-4px_-4px_10px_#242424]"
                >
                  <div className="flex justify-between items-start w-full relative z-10">
                    <div className="flex items-center gap-3 w-full">
                      <div className="w-8 h-8 rounded-full bg-[#161616] shadow-[2px_2px_5px_#080808,-2px_-2px_5px_#242424] flex items-center justify-center [&>svg]:w-4 [&>svg]:h-4" style={{ color: goal.color }}>
                        {goal.icon}
                      </div>
                      <div className="flex flex-col flex-1">
                        <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest leading-none">{goal.timeLeft}</span>
                        <h3 className="text-white text-xs font-bold tracking-wide mt-0.5">{goal.title}</h3>
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10 space-y-1.5 mt-0">
                    <div className="flex justify-between items-end w-full px-1">
                      <span className="text-white font-black text-base font-display-metrics tracking-tight leading-none">
                        {goal.current} <span className="text-white/40 font-bold text-[9px] font-sans tracking-normal">/ {goal.total} {goal.unit}</span>
                      </span>
                      <span className="text-[10px] font-black font-mono tracking-tighter leading-none" style={{ color: goal.color }}>{goal.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-[#161616] rounded-full overflow-hidden shadow-[inset_2px_2px_3px_#080808,inset_-2px_-2px_3px_#242424] relative">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${goal.progress}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full rounded-full relative z-10"
                        style={{ backgroundColor: goal.color }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-3">
              {filteredHistory.map((goal) => (
                <div key={goal.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-4 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
                    {goal.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-black uppercase tracking-tight text-white/80">{goal.title}</h4>
                    <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Muvaffaqiyatli yakunlandi • {goal.reward}</p>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <Shield className="w-3 h-3 text-primary" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'new' && (
            <div className="space-y-4">
              {initialPeriod !== 'Maxsus' && (
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 mb-4">
                  {[
                    { id: 'goals', label: 'Standart Maqsad' },
                    { id: 'marathon', label: 'AI Marafon' }
                  ].map(t => (
                    <button
                      key={t.id}
                      onClick={() => setMainTab(t.id as any)}
                      className={cn(
                        "flex-1 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                        mainTab === t.id 
                          ? t.id === 'marathon' ? "bg-gradient-to-r from-[#FF005C] to-[#8A2BE2] text-white" : "bg-white/10 text-white"
                          : "text-white/30 hover:text-white/50"
                      )}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              )}

              {mainTab === 'goals' ? (
                <div className="space-y-4">
                  {/* Informational Banner Based on State */}
                  {(() => {
                    const getPeriodColor = () => {
                      switch (newGoalPeriod) {
                        case 'Haftalik': return '#DFFF00';
                        case 'Oylik': return '#00A3FF';
                        default: return '#CCFF00';
                      }
                    };
                    const periodColor = getPeriodColor();
                    return (
                      <div className="p-4 rounded-[20px] border border-white/10 shadow-inner" style={{
                        borderColor: `${periodColor}40`,
                        background: `linear-gradient(to bottom right, ${periodColor}1A, transparent)`,
                      }}>
                        <h3 className="text-xs font-black uppercase tracking-tight mb-1" style={{ color: periodColor }}>
                          {newGoalPeriod === 'Haftalik' ? "Haftalik Maqsad" : newGoalPeriod === 'Oylik' ? "Oylik Maqsad" : "Shaxsiy Maqsad"}
                        </h3>
                        <p className="text-[9px] text-white/50 font-medium leading-relaxed uppercase tracking-widest">
                           Maqsadlaringiz sari dadil qadam tashlang va natijalarga erishing!
                        </p>
                      </div>
                    );
                  })()}

                  <div className="space-y-4">
                    {!initialPeriod && (
                      <div className="space-y-1.5">
                        <label className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">Maqsad davriysi</label>
                        <div className="grid grid-cols-2 gap-2">
                          {['Haftalik', 'Oylik'].map(period => (
                            <button 
                              key={period} 
                              onClick={() => setNewGoalPeriod(period)}
                              className={cn(
                                "py-2.5 rounded-xl border text-[9px] font-bold uppercase tracking-widest transition-all",
                                newGoalPeriod === period 
                                  ? "bg-white/20 text-white border-white/30 shadow-inner" 
                                  : "bg-white/5 text-white/40 border-white/10 hover:bg-white/10"
                              )}
                            >
                              {period}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">Maqsad turi</label>
                      <div className="grid grid-cols-2 gap-2">
                        {['Masofa', 'Vaqt', 'Kaloriya', 'Mashg\'ulot'].map(type => (
                          <button 
                            key={type} 
                            onClick={() => setNewGoalType(type)}
                            className={cn(
                              "py-2.5 rounded-xl border text-[9px] font-bold uppercase tracking-widest transition-all",
                              newGoalType === type 
                                ? "bg-primary text-black border-primary shadow-[0_0_8px_rgba(204,255,0,0.2)]" 
                                : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10"
                            )}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">Qiymatni kiriting</label>
                      <div className="relative flex items-center">
                        <input 
                          type="number" 
                          value={newGoalValue}
                          onChange={(e) => setNewGoalValue(e.target.value)}
                          placeholder="Masalan: 50"
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white font-mono text-xs focus:outline-none focus:border-primary/50 transition-all font-black"
                        />
                        <span className="absolute right-4 text-[10px] font-black text-primary uppercase tracking-widest">
                          {newGoalType === 'Masofa' ? 'KM' : newGoalType === 'Vaqt' ? 'DAQ' : newGoalType === 'Kaloriya' ? 'KKAL' : 'TA'}
                        </span>
                      </div>
                    </div>

                    <button 
                      onClick={handleAddGoal}
                      disabled={!newGoalValue}
                      className="w-full py-3.5 rounded-xl bg-primary text-black font-black uppercase tracking-[0.2em] text-[10px] shadow-[0_0_20px_rgba(204,255,0,0.2)] active:scale-95 transition-all mt-4 disabled:opacity-50 disabled:grayscale"
                    >
                      Maqsadni Tasdiqlash
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-5 animate-fade-in">
                  {/* Marafon turi/masofasi */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] flex items-center gap-2">
                      <Flame className="w-3 h-3 text-[#FF005C]" />
                      Marafon Masofasi
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { val: '5', label: '5 KM' },
                        { val: '10', label: '10 KM' },
                        { val: '21.1', label: 'YARIM MARAFON' },
                        { val: '42.2', label: 'TULIQ MARAFON' }
                      ].map((m) => (
                        <button
                          key={m.val}
                          onClick={() => {
                            setMarafonDistance(m.val);
                            setIsCalculated(false);
                          }}
                          className={cn(
                            "py-3 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all",
                            marafonDistance === m.val
                              ? "bg-[#FF005C] text-white border-[#FF005C] shadow-[0_0_15px_rgba(255,0,92,0.3)]"
                              : "bg-white/5 text-white/40 border-white/10 hover:bg-white/10 hover:text-white/60"
                          )}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                    <div className="relative mt-2">
                      <input 
                        type="number" 
                        value={marafonDistance}
                        onChange={(e) => {
                          setMarafonDistance(e.target.value);
                          setIsCalculated(false);
                        }}
                        placeholder="Boshqa masofa (min 3km)"
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 px-4 text-white font-mono text-sm focus:outline-none focus:border-[#FF005C]/50 transition-all font-bold"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-[#FF005C] uppercase tracking-widest">
                        KM
                      </span>
                    </div>
                  </div>

                  {/* Muddat */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] flex items-center gap-2">
                      <Calendar className="w-3 h-3 text-[#00A3FF]" />
                      Tayyorlanish muddati
                    </label>
                    <div className="flex gap-2">
                      <input 
                        type="number" 
                        value={marafonDurationValue}
                        onChange={(e) => { setMarafonDurationValue(e.target.value); setIsCalculated(false); }}
                        className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl py-3 px-4 text-white font-mono text-sm focus:outline-none focus:border-[#00A3FF]/50 transition-all font-bold text-center"
                      />
                      <div className="flex bg-white/5 rounded-xl border border-white/10 p-1">
                        {['Hafta', 'Oy'].map(u => (
                          <button
                            key={u}
                            onClick={() => { setMarafonDurationUnit(u as any); setIsCalculated(false); }}
                            className={cn(
                              "px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all",
                              marafonDurationUnit === u
                                ? "bg-white/10 text-white shadow-sm"
                                : "text-white/30 hover:text-white/60"
                            )}
                          >
                            {u}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Shug'ullanish kunlari */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] flex items-center gap-2">
                      <Activity className="w-3 h-3 text-primary" />
                      Haftasiga necha kun?
                    </label>
                    <div className="flex justify-between gap-1">
                      {[1, 2, 3, 4, 5, 6, 7].map(d => (
                        <button
                          key={d}
                          onClick={() => { setMarafonDaysPerWeek(d.toString()); setIsCalculated(false); }}
                          className={cn(
                            "w-10 h-10 rounded-xl border flex items-center justify-center font-mono text-sm font-black transition-all",
                            marafonDaysPerWeek === d.toString()
                              ? "bg-primary text-black border-primary shadow-[0_0_10px_rgba(204,255,0,0.3)]"
                              : "bg-white/5 text-white/40 border-white/10 hover:bg-white/10"
                          )}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  {!isCalculated ? (
                    <button 
                      onClick={() => {
                        if (parseFloat(marafonDistance) < 3) {
                          alert("Marafon masofasi kamida 3 km bo'lishi kerak!");
                          return;
                        }
                        setIsCalculated(true);
                      }}
                      disabled={!marafonDistance || !marafonDurationValue}
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-[#FF005C] to-[#8A2BE2] text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-[0_0_20px_rgba(255,0,92,0.3)] active:scale-95 transition-all mt-4 disabled:opacity-50 disabled:grayscale"
                    >
                      AI Reja Yaratish
                    </button>
                  ) : (
                    <div className="mt-6 space-y-4 animate-fade-in border-t border-white/10 pt-6 relative">
                      <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#FF005C]/20 blur-3xl rounded-full pointer-events-none" />
                      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#8A2BE2]/20 blur-3xl rounded-full pointer-events-none" />
                      
                      <div className="text-center mb-6 relative z-10">
                        <h4 className="text-xl font-black text-white italic tracking-tight">{marafonDistance} KM MARAFON REJASI</h4>
                        <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold mt-1">
                          AI TOMONIDAN ISHLAB CHIQILDI
                        </p>
                      </div>
                      
                      {(() => {
                         const dist = parseFloat(marafonDistance);
                         const days = parseInt(marafonDaysPerWeek);
                         let totalWeeks = parseInt(marafonDurationValue);
                         if (marafonDurationUnit === 'Oy') totalWeeks *= 4;
                         
                         const weeklyVolume = dist * 1.2;
                         const avgRun = (weeklyVolume / days).toFixed(1);
                         const longRun = (dist * 0.7).toFixed(1);
                         const recommendedPace = dist > 21 ? "6:30 - 7:00" : "5:30 - 6:00";
                         
                         return (
                           <div className="space-y-4 relative z-10">
                              <div className="grid grid-cols-2 gap-3">
                                <div className="bg-black/40 border border-white/10 rounded-2xl p-4 backdrop-blur-xl">
                                  <p className="text-[8px] text-white/40 uppercase tracking-widest font-bold mb-1">O'rtacha masofa (kuniga)</p>
                                  <p className="text-xl font-black font-mono text-white">{avgRun} <span className="text-xs text-white/30">km</span></p>
                                </div>
                                <div className="bg-black/40 border border-white/10 rounded-2xl p-4 backdrop-blur-xl">
                                  <p className="text-[8px] text-white/40 uppercase tracking-widest font-bold mb-1">Haftadagi eng uzun yugurish</p>
                                  <p className="text-xl font-black font-mono text-[#FF005C]">{longRun} <span className="text-xs text-[#FF005C]/40">km</span></p>
                                </div>
                                <div className="bg-black/40 border border-white/10 rounded-2xl p-4 backdrop-blur-xl">
                                  <p className="text-[8px] text-white/40 uppercase tracking-widest font-bold mb-1">Tavsiya etilgan temp</p>
                                  <p className="text-lg font-black font-mono text-white">{recommendedPace} <span className="text-[9px] text-white/30 tracking-tighter">/km</span></p>
                                </div>
                                <div className="bg-black/40 border border-white/10 rounded-2xl p-4 backdrop-blur-xl">
                                  <p className="text-[8px] text-white/40 uppercase tracking-widest font-bold mb-1">Interval / Dam</p>
                                  <p className="text-lg font-black font-mono text-[#00A3FF]">+{7 - days} KUN</p>
                                </div>
                              </div>

                              <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border border-[#2a2a4e] p-5 rounded-[24px] shadow-xl">
                                <div className="flex items-center gap-2 mb-3">
                                  <Sparkles className="w-4 h-4 text-[#FF005C]" />
                                  <h5 className="text-[10px] font-black uppercase tracking-widest text-white/80">AI Tavsiyalari</h5>
                                </div>
                                <ul className="space-y-3">
                                  <li className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#00A3FF] mt-1.5 shrink-0" />
                                    <p className="text-[11px] text-white/70 font-medium leading-relaxed">
                                      <strong className="text-white">Tayyorgarlik faza:</strong> Sizda jami {totalWeeks} hafta bor. Dastlabki 3 haftani bazaviy chidamlilik uchun past tempda (Zon 2) yugurishga bag'ishlang.
                                    </p>
                                  </li>
                                  <li className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                    <p className="text-[11px] text-white/70 font-medium leading-relaxed">
                                      <strong className="text-white">Yuklamani oshirish (10% qoidasi):</strong> Har haftalik umumiy masofani 10% dan ortiq oshirmang.
                                    </p>
                                  </li>
                                  <li className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#FF005C] mt-1.5 shrink-0" />
                                    <p className="text-[11px] text-white/70 font-medium leading-relaxed">
                                      <strong className="text-white">Tiklanish:</strong> {7 - days} kun albatta mushaklarni tiklash va yoga ga ajrating.
                                    </p>
                                  </li>
                                </ul>
                              </div>

                              <button 
                                onClick={() => {
                                  const title = `${dist}km AI Marafon - ${totalWeeks} hafta`;
                                  const newG: Goal = {
                                    id: Date.now(),
                                    title: title,
                                    subtitle: `0 / ${dist} km`,
                                    current: 0,
                                    total: dist,
                                    unit: "km",
                                    progress: 0,
                                    color: "#FF005C",
                                    timeLeft: `${totalWeeks} hafta qoldi`,
                                    reward: `${Math.round(dist * 100)} XP`,
                                    icon: <Award className="w-5 h-5" />,
                                    category: 'distance',
                                    type: 'custom',
                                    status: 'active'
                                  };
                                  setGoals([newG, ...goals]);
                                  onClose();
                                }}
                                className="w-full py-4 rounded-xl bg-white text-black font-black uppercase tracking-[0.2em] text-[11px] hover:bg-gray-200 active:scale-95 transition-all mt-4"
                              >
                                Rejani Qabul Qilish va Boshlash
                              </button>
                           </div>
                         );
                      })()}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
    </AnimatePresence>
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
  ]
};

const ACTIVITY_DATA = [
  {
    id: 1,
    hudud: "Chilonzor",
    date: "Bugun, 08:30",
    distance: "5.2",
    unit: "km",
    steps: "6800",
    color: "#CCFF00"
  },
  {
    id: 2,
    hudud: "Yunusobod",
    date: "Kecha, 18:45",
    distance: "3.1",
    unit: "km",
    steps: "4200",
    color: "#00A3FF"
  },
  {
    id: 3,
    hudud: "Mirzo Ulug'bek",
    date: "25-mart, 07:15",
    distance: "10.0",
    unit: "km",
    steps: "12500",
    color: "#FF005C"
  },
  {
    id: 4,
    hudud: "Sergeli",
    date: "24-mart, 19:20",
    distance: "4.5",
    unit: "km",
    steps: "5900",
    color: "#FF9900"
  },
  {
    id: 5,
    hudud: "Yashnobod",
    date: "22-mart, 06:45",
    distance: "6.8",
    unit: "km",
    steps: "8400",
    color: "#CCFF00"
  },
  {
    id: 6,
    hudud: "Olmazor",
    date: "20-mart, 18:00",
    distance: "2.5",
    unit: "km",
    steps: "3100",
    color: "#00A3FF"
  },
  {
    id: 7,
    hudud: "Mirobod",
    date: "18-mart, 07:30",
    distance: "8.2",
    unit: "km",
    steps: "10100",
    color: "#FF005C"
  },
  {
    id: 8,
    hudud: "Yakkasaroy",
    date: "15-mart, 20:15",
    distance: "5.0",
    unit: "km",
    steps: "6500",
    color: "#FF9900"
  },
  {
    id: 9,
    hudud: "Uchtepa",
    date: "14-mart, 08:10",
    distance: "7.4",
    unit: "km",
    steps: "9200",
    color: "#CCFF00"
  },
  {
    id: 10,
    hudud: "Shayxontohur",
    date: "12-mart, 17:45",
    distance: "3.8",
    unit: "km",
    steps: "4800",
    color: "#00A3FF"
  },
  {
    id: 11,
    hudud: "Bektemir",
    date: "10-mart, 09:00",
    distance: "12.5",
    unit: "km",
    steps: "15600",
    color: "#FF005C"
  }
];

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
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-xl z-[100]"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute inset-x-0 bottom-0 h-[90vh] bg-[#0A0A0A] border-t border-white/10 rounded-t-[40px] z-[101] flex flex-col overflow-hidden"
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
                  className="absolute inset-0 bg-black z-[300] flex flex-col"
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
        </>
      )}
    </AnimatePresence>
  );
};

const LanguageModal = ({ isOpen, onClose, currentLang, onSelect }: { isOpen: boolean; onClose: () => void; currentLang: string; onSelect: (lang: string) => void }) => {
  const languages = [
    { code: 'uz', name: "O'zbekcha", flag: "🇺🇿" },
    { code: 'en', name: "English", flag: "🇬🇧" },
    { code: 'ru', name: "Русский", flag: "🇷🇺" },
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
            className="absolute inset-0 bg-black/80 backdrop-blur-xl z-[250]"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute inset-x-0 bottom-0 bg-[#0A0A0A] border-t border-white/10 rounded-t-[40px] z-[251] overflow-hidden shadow-[0_-20px_80px_rgba(0,0,0,0.8)] p-8 pb-12"
          >
            <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-8" />
            <h2 className="text-xl font-black uppercase tracking-tighter mb-6 text-center">Til tanlash</h2>
            <div className="space-y-3">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    onSelect(lang.code);
                    const loadingToast = toast.loading("Til o'zgartirilmoqda...");
                    setTimeout(() => {
                      toast.dismiss(loadingToast);
                      toast.success(`Til ${lang.name}ga muvaffaqiyatli o'zgartirildi`, {
                        icon: lang.flag
                      });
                      onClose();
                    }, 1000);
                  }}
                  className={cn(
                    "w-full p-4 rounded-2xl border flex items-center justify-between transition-all",
                    currentLang === lang.code 
                      ? "bg-primary/10 border-primary text-primary" 
                      : "bg-white/5 border-white/5 text-white hover:bg-white/10"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{lang.flag}</span>
                    <span className="font-bold">{lang.name}</span>
                  </div>
                  {currentLang === lang.code && <Check className="w-5 h-5" />}
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// --- Gadget Modal (Premium Live Simulation) ---
const GadgetModal = ({ isOpen, onClose, gadget, onToggle }: any) => {
  const [step, setStep] = useState('info'); // info, pairing, success, disconnect_confirm
  const [progress, setProgress] = useState(0);
  const [livePulse, setLivePulse] = useState(gadget?.heartRate || 0);

  useEffect(() => {
    if (!isOpen) {
      setStep('info');
      setProgress(0);
    }
  }, [isOpen]);

  // Puls simulyatsiyasi (jonli effekt)
  useEffect(() => {
    if (isOpen && gadget?.status === "Ulangan" && step === 'info') {
      const interval = setInterval(() => {
        setLivePulse((prev: number) => {
          const change = Math.floor(Math.random() * 3) - 1; // -1, 0, 1
          const next = prev + change;
          return next < 60 ? 60 : next > 100 ? 100 : next;
        });
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isOpen, gadget?.status, step]);

  if (!gadget) return null;

  const handleConnect = () => {
    setStep('pairing');
    let p = 0;
    const interval = setInterval(() => {
      p += 2;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setStep('success');
        onToggle(gadget.id, true);
      }
    }, 40);
  };

  const handleDisconnect = () => {
    onToggle(gadget.id, false);
    onClose();
    toast.success(`${gadget.name} uzildi`);
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
            className="absolute inset-0 bg-black/80 backdrop-blur-xl z-[300]"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute left-4 right-4 top-1/2 -translate-y-1/2 bg-[#0A0A0A] border border-white/10 rounded-[40px] z-[301] overflow-hidden shadow-2xl max-w-md mx-auto"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn("w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10", gadget.color)}>
                  {gadget.icon}
                </div>
                <div>
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">{gadget.name}</h3>
                  <div className="flex items-center gap-2">
                    <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", gadget.status === "Ulangan" ? "bg-primary" : "bg-white/20")} />
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{gadget.status}</span>
                  </div>
                </div>
              </div>
              <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8">
              {step === 'info' && (
                <div className="space-y-8">
                  {/* Live Stats (If Connected) */}
                  {gadget.status === "Ulangan" ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/5 relative overflow-hidden group">
                        <div className="relative z-10">
                          <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-1">Yurak Urishi</p>
                          <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-black text-white">{livePulse}</span>
                            <span className="text-[10px] font-bold text-red-500 uppercase">BPM</span>
                          </div>
                        </div>
                        <motion.div 
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.8, repeat: Infinity }}
                          className="absolute -right-2 -bottom-2 opacity-10"
                        >
                          <Heart className="w-16 h-16 text-red-500 fill-red-500" />
                        </motion.div>
                      </div>

                      <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/5 relative overflow-hidden group">
                        <div className="relative z-10">
                          <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-1">Batareya</p>
                          <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-black text-white">{gadget.battery}%</span>
                          </div>
                        </div>
                        <div className="absolute -right-2 -bottom-2 opacity-10">
                          <Battery className="w-16 h-16 text-primary" />
                        </div>
                        {/* Battery Progress Bar */}
                        <div className="absolute bottom-0 left-0 h-1 bg-primary/20 w-full">
                          <div className="h-full bg-primary" style={{ width: `${gadget.battery}%` }} />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-10 text-center space-y-4">
                      <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                        <Bluetooth className="w-10 h-10 text-white/20" />
                      </div>
                      <p className="text-sm text-white/40 leading-relaxed">
                        Qurilmani ulash uchun Bluetooth yoqilganligiga ishonch hosil qiling.
                      </p>
                    </div>
                  )}

                  {/* Device Info */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                      <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Dasturiy Ta'minot</span>
                      <span className="text-xs font-black text-white font-mono">{gadget.firmware}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                      <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Oxirgi Yangilanish</span>
                      <span className="text-xs font-black text-white">{gadget.lastSync}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  {gadget.status === "Ulangan" ? (
                    <button 
                      onClick={() => setStep('disconnect_confirm')}
                      className="w-full py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-red-500/20 transition-all"
                    >
                      Qurilmani Uzish
                    </button>
                  ) : (
                    <button 
                      onClick={handleConnect}
                      className="w-full py-4 rounded-2xl bg-primary text-black text-[11px] font-black uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(204,255,0,0.3)]"
                    >
                      Hozir Ulanish
                    </button>
                  )}
                </div>
              )}

              {step === 'pairing' && (
                <div className="py-12 text-center space-y-8">
                  <div className="relative w-32 h-32 mx-auto">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/5" />
                      <motion.circle 
                        cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="4" fill="transparent" 
                        className="text-primary"
                        strokeDasharray={377}
                        strokeDashoffset={377 - (377 * progress) / 100}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Bluetooth className="w-10 h-10 text-primary animate-pulse" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-white uppercase tracking-tight mb-2">Qurilma Qidirilmoqda</h4>
                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Zonic Bluetooth Gateway orqali...</p>
                  </div>
                </div>
              )}

              {step === 'success' && (
                <div className="py-12 text-center space-y-8">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-24 h-24 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center mx-auto"
                  >
                    <Check className="w-12 h-12 text-primary" />
                  </motion.div>
                  <div>
                    <h4 className="text-xl font-black text-white uppercase tracking-tight mb-2">Muvaffaqiyatli!</h4>
                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Qurilma to'liq sinxronlandi</p>
                  </div>
                  <button 
                    onClick={onClose}
                    className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-[11px] font-black uppercase tracking-[0.2em]"
                  >
                    Yopish
                  </button>
                </div>
              )}

              {step === 'disconnect_confirm' && (
                <div className="py-8 space-y-8">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
                      <AlertTriangle className="w-10 h-10 text-red-500" />
                    </div>
                    <h4 className="text-xl font-black text-white uppercase tracking-tight mb-2">Ishonchingiz Komilmi?</h4>
                    <p className="text-sm text-white/40 leading-relaxed px-4">
                      Qurilmani uzsangiz, real vaqtda ma'lumot almashinuvi to'xtatiladi.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => setStep('info')}
                      className="py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-[11px] font-black uppercase tracking-widest"
                    >
                      Bekor Qilish
                    </button>
                    <button 
                      onClick={handleDisconnect}
                      className="py-4 rounded-2xl bg-red-500 text-white text-[11px] font-black uppercase tracking-widest shadow-lg shadow-red-500/20"
                    >
                      Ha, Uzish
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const ConnectionModal = ({ isOpen, onClose, connection, onToggle }: { isOpen: boolean; onClose: () => void; connection: any; onToggle: (id: string, status: boolean) => void }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'info' | 'oauth' | 'system' | 'google' | 'syncing' | 'success' | 'disconnect_confirm'>('info');
  const [syncProgress, setSyncProgress] = useState(0);

  if (!connection) return null;

  const handleConnect = () => {
    // Har bir xizmat uchun alohida simulyatsiya
    if (connection.id === 'strava') {
      setStep('oauth');
      setTimeout(() => {
        setStep('syncing');
        startSync();
      }, 2000);
    } else if (connection.id === 'apple') {
      setStep('system');
    } else if (connection.id === 'google') {
      setStep('google');
    }
  };

  const startSync = () => {
    setIsLoading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setSyncProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setStep('success');
        setTimeout(() => {
          onToggle(connection.id, true);
          toast.success(`${connection.name} muvaffaqiyatli ulandi!`);
          onClose();
          setStep('info');
          setSyncProgress(0);
          setIsLoading(false);
        }, 1500);
      }
    }, 100);
  };

  const handleDisconnect = (keepData: boolean) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onToggle(connection.id, false);
      toast.error(`${connection.name} uzildi. ${keepData ? "Ma'lumotlar saqlandi." : "Ma'lumotlar o'chirildi."}`);
      onClose();
      setStep('info');
    }, 1500);
  };

  const permissions = [
    { label: "Profil ma'lumotlari", desc: "Ism, rasm va bio" },
    { label: "Mashg'ulotlar", desc: "GPS, vaqt va masofa" },
    { label: "Salomatlik", desc: "Puls va kaloriyalar" }
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
            className="absolute inset-0 bg-black/90 backdrop-blur-2xl z-[250]"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="absolute inset-x-0 bottom-0 bg-[#0A0A0A] border-t border-white/10 rounded-t-[40px] z-[251] overflow-hidden shadow-[0_-20px_80px_rgba(0,0,0,0.8)] p-8 pb-12"
          >
            <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-8" />
            
            {step === 'info' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex flex-col items-center text-center mb-8">
                  <div className="w-24 h-24 rounded-[32px] bg-white/5 flex items-center justify-center mb-6 p-5 border border-white/10 shadow-2xl relative">
                    {typeof connection.icon === 'string' ? (
                      <img src={connection.icon} alt={connection.name} className="w-full h-full object-contain" />
                    ) : (
                      <div className="text-primary w-12 h-12">{connection.icon}</div>
                    )}
                    {connection.status === "Ulangan" && (
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full border-4 border-[#0A0A0A] flex items-center justify-center">
                        <Check className="w-4 h-4 text-black stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <h2 className="text-2xl font-black uppercase tracking-tighter text-white mb-2">{connection.name}</h2>
                  <div className="flex items-center gap-2 mb-4">
                    <div className={cn("w-2 h-2 rounded-full animate-pulse", connection.status === "Ulangan" ? "bg-primary" : "bg-white/20")} />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                      {connection.status === "Ulangan" ? `Sinxronlangan: ${connection.lastSync}` : "Ulanmagan"}
                    </span>
                  </div>
                  <p className="text-sm text-white/40 max-w-[280px] mx-auto leading-relaxed">
                    {connection.desc}
                  </p>
                </div>

                <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 mb-8">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-4">Ruxsatlar va Ma'lumotlar:</h4>
                  <div className="space-y-4">
                    {permissions.map((p, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                          <Check className="w-3 h-3 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-white font-bold">{p.label}</p>
                          <p className="text-[10px] text-white/40">{p.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => connection.status === "Ulangan" ? setStep('disconnect_confirm') : handleConnect()}
                  className={cn(
                    "w-full py-5 rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 active:scale-95",
                    connection.status === "Ulangan" 
                      ? "bg-white/5 text-white/60 border border-white/10 hover:bg-white/10" 
                      : "bg-primary text-black hover:shadow-[0_20px_40px_rgba(204,255,0,0.2)]"
                  )}
                >
                  {connection.status === "Ulangan" ? <Trash2 className="w-5 h-5" /> : <Link2 className="w-5 h-5" />}
                  {connection.status === "Ulangan" ? "Ulanishni uzish" : "Hozir ulanish"}
                </button>
              </motion.div>
            )}

            {step === 'oauth' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-8 animate-bounce">
                  <img src={connection.icon} alt="" className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tighter mb-4">Strava'ga yo'naltirilmoqda...</h3>
                <p className="text-sm text-white/40 mb-8">Xavfsiz brauzer oynasi ochilmoqda</p>
                <div className="w-full max-w-[200px] h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ x: "-100%" }} 
                    animate={{ x: "100%" }} 
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="w-1/2 h-full bg-primary" 
                  />
                </div>
              </motion.div>
            )}

            {step === 'system' && (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-8">
                <div className="bg-[#1C1C1E] rounded-[24px] p-6 text-white shadow-2xl border border-white/5">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                      <Heart className="w-8 h-8 text-[#FF2D55]" fill="#FF2D55" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold leading-tight">Zonic Health'ga ruxsat so'ramoqda</h3>
                      <p className="text-xs text-white/40">Apple Health ma'lumotlari</p>
                    </div>
                  </div>
                  <p className="text-sm text-white/60 mb-6 leading-relaxed">
                    Zonic sizning qadamlaringiz, yurak urishingiz va mashg'ulotlaringizni Apple Health'dan o'qish va unga yozish imkoniyatiga ega bo'ladi.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => setStep('info')} className="py-3 rounded-xl bg-white/5 font-bold text-white/60">Rad etish</button>
                    <button onClick={() => { setStep('syncing'); startSync(); }} className="py-3 rounded-xl bg-[#007AFF] font-bold">Ruxsat berish</button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 'google' && (
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="py-8">
                <div className="bg-white rounded-3xl p-8 text-black shadow-2xl">
                  <div className="flex items-center justify-center mb-8">
                    <svg className="w-10 h-10" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-center mb-2">Google Fit bilan ulanish</h3>
                  <p className="text-sm text-black/60 text-center mb-8">Akkauntingizni tanlang va ruxsat bering</p>
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3 p-3 rounded-xl border border-black/10 hover:bg-black/5 cursor-pointer transition-all">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-bold text-xs">A</div>
                      <div>
                        <p className="text-xs font-bold">avazovogabek86@gmail.com</p>
                        <p className="text-[10px] text-black/40">Asosiy akkaunt</p>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => { setStep('syncing'); startSync(); }} className="w-full py-4 rounded-xl bg-[#4285F4] text-white font-bold">Davom etish</button>
                </div>
              </motion.div>
            )}

            {step === 'syncing' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 flex flex-col items-center text-center">
                <div className="relative w-32 h-32 mb-8">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="64" cy="64" r="60" fill="none" stroke="rgba(204,255,0,0.1)" strokeWidth="8" />
                    <motion.circle 
                      cx="64" cy="64" r="60" fill="none" stroke="#CCFF00" strokeWidth="8" 
                      strokeDasharray="376.8"
                      strokeDashoffset={376.8 - (376.8 * syncProgress) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-black text-primary">{syncProgress}%</span>
                  </div>
                </div>
                <h3 className="text-xl font-black uppercase tracking-tighter mb-2">Ma'lumotlar olinmoqda...</h3>
                <p className="text-sm text-white/40">Oxirgi 30 kunlik natijalar tahlil qilinmoqda</p>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 flex flex-col items-center text-center"
              >
                <div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(204,255,0,0.4)]">
                  <Check className="w-16 h-16 text-black stroke-[3]" />
                </div>
                <h3 className="text-3xl font-black uppercase tracking-tighter mb-2">Tayyor!</h3>
                <p className="text-sm text-white/40 mb-8">{connection.name} muvaffaqiyatli ulandi</p>
                <div className="bg-white/5 rounded-2xl p-4 w-full flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-white">12 ta yangi mashg'ulot</p>
                    <p className="text-[10px] text-white/40">Tarixiy ma'lumotlar yuklandi</p>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 'disconnect_confirm' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="py-6">
                <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Trash2 className="w-10 h-10 text-red-500" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tighter text-center mb-2">Ulanishni uzish?</h3>
                <p className="text-sm text-white/40 text-center mb-8">Sinxronlangan ma'lumotlarni nima qilamiz?</p>
                
                <div className="space-y-3">
                  <button 
                    onClick={() => handleDisconnect(true)}
                    className="w-full py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold flex items-center justify-center gap-3 hover:bg-white/10 transition-all"
                  >
                    <Check className="w-5 h-5 text-primary" />
                    Ma'lumotlarni saqlab qolish
                  </button>
                  <button 
                    onClick={() => handleDisconnect(false)}
                    className="w-full py-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 font-bold flex items-center justify-center gap-3 hover:bg-red-500/20 transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                    Hammasini o'chirib yuborish
                  </button>
                  <button 
                    onClick={() => setStep('info')}
                    className="w-full py-4 text-white/40 font-bold uppercase tracking-widest text-[10px]"
                  >
                    Bekor qilish
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const LegalModal = ({ isOpen, onClose, content }: { isOpen: boolean; onClose: () => void; content: { title: string, type: string } | null }) => {
  if (!content) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="absolute inset-0 bg-[#0A0A0A] z-[300] flex flex-col"
        >
          <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/40 backdrop-blur-md shrink-0">
            <div className="flex items-center gap-4">
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-sm font-black uppercase tracking-widest">{content.title}</h2>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
            {content.type === 'faq' && (
              <div className="space-y-6">
                {[
                  { q: "Zonic ilovasi qanday ishlaydi?", a: "Zonic sizning harakatlaringizni GPS va datchiklar yordamida kuzatadi. Mashg'ulot tugagach, barcha ma'lumotlar tahlil qilinadi va sizga batafsil hisobot taqdim etiladi." },
                  { q: "Ma'lumotlar xavfsizligi qanday ta'minlanadi?", a: "Barcha ma'lumotlaringiz AES-256 shifrlash standarti asosida saqlanadi. Biz sizning shaxsiy ma'lumotlaringizni uchinchi shaxslarga sotmaymiz yoki ulashmaymiz." },
                  { q: "Premium obuna nima beradi?", a: "Premium obuna orqali siz chuqurlashtirilgan tahlillar, shaxsiy murabbiy maslahatlari, reklamasiz interfeys va eksklyuziv marshrutlarga ega bo'lasiz." },
                  { q: "Gadjetlarni qanday ulayman?", a: "Sozlamalar -> Gadjetlar bo'limidan o'zingizning qurilmangizni tanlang va ulanish tugmasini bosing. Qurilmangiz Bluetooth orqali ulangan bo'lishi kerak." },
                  { q: "Hisobni qanday o'chirish mumkin?", a: "Profil sozlamalari -> Hisobni o'chirish bo'limi orqali barcha ma'lumotlaringizni butunlay o'chirib tashlashingiz mumkin." }
                ].map((faq, i) => (
                  <div key={i} className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group">
                    <h4 className="text-sm font-bold text-primary mb-3 flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(204,255,0,0.5)]" />
                      {faq.q}
                    </h4>
                    <p className="text-xs text-white/50 leading-relaxed pl-4.5 border-l border-white/10 group-hover:border-primary/30 transition-colors">{faq.a}</p>
                  </div>
                ))}
              </div>
            )}
            
            {content.type === 'terms' && (
              <div className="bg-white/[0.02] border border-white/5 rounded-[32px] p-8 space-y-6">
                <div className="prose prose-invert prose-sm max-w-none">
                  <p className="text-white/60 leading-relaxed text-justify">
                    Zonic ilovasidan foydalanish orqali siz quyidagi shartlarga rozi bo'lasiz. Ushbu shartlar foydalanuvchi va Zonic o'rtasidagi huquqiy munosabatlarni tartibga soladi.
                  </p>
                  <div className="space-y-6 mt-8">
                    <section>
                      <h3 className="text-sm font-black uppercase tracking-widest text-white mb-3">1. Foydalanish qoidalari</h3>
                      <p className="text-xs text-white/40 leading-relaxed">
                        Foydalanuvchi ilovadan faqat qonuniy maqsadlarda foydalanishi shart. Boshqa foydalanuvchilarni haqorat qilish, yolg'on ma'lumot tarqatish yoki ilova xavfsizligiga zarar yetkazish qat'iyan taqiqlanadi.
                      </p>
                    </section>
                    <section>
                      <h3 className="text-sm font-black uppercase tracking-widest text-white mb-3">2. Ma'lumotlar xavfsizligi</h3>
                      <p className="text-xs text-white/40 leading-relaxed">
                        Biz sizning shaxsiy ma'lumotlaringizni uchinchi shaxslarga sotmaymiz. Barcha ma'lumotlar xavfsiz serverlarda saqlanadi va faqat ilova funksionalligini ta'minlash uchun ishlatiladi.
                      </p>
                    </section>
                    <section>
                      <h3 className="text-sm font-black uppercase tracking-widest text-white mb-3">3. Mas'uliyatni cheklash</h3>
                      <p className="text-xs text-white/40 leading-relaxed">
                        Zonic ilovasi faqat axborot berish maqsadida mo'ljallangan. Har qanday jismoniy mashqlarni bajarishdan oldin shifokor bilan maslahatlashish tavsiya etiladi.
                      </p>
                    </section>
                  </div>
                </div>
                <div className="pt-8 border-t border-white/5 flex flex-col items-center">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4 shadow-inner">
                    <Shield className="w-6 h-6" />
                  </div>
                  <p className="text-[10px] text-white/20 uppercase font-black tracking-[0.2em]">Oxirgi yangilanish: 2024-yil mart</p>
                </div>
              </div>
            )}

            {content.type === 'privacy' && (
              <div className="bg-white/[0.02] border border-white/5 rounded-[32px] p-8 space-y-6">
                <div className="prose prose-invert prose-sm max-w-none">
                  <p className="text-white/60 leading-relaxed text-justify">
                    Maxfiylik siyosati sizning ma'lumotlaringiz qanday yig'ilishi, ishlatilishi va himoya qilinishini tushuntiradi. Biz sizning maxfiyligingizni qadrlaymiz.
                  </p>
                  <div className="space-y-6 mt-8">
                    <section className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                      <h3 className="text-xs font-bold text-white mb-4 flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-primary" />
                        Qanday ma'lumotlar yig'iladi?
                      </h3>
                      <ul className="space-y-3">
                        {[
                          { label: "Ro'yxatdan o'tish", desc: "Ism, email va profil rasmi" },
                          { label: "Joylashuv", desc: "GPS ma'lumotlari (faqat mashq paytida)" },
                          { label: "Salomatlik", desc: "Vazn, bo'y va mashq ko'rsatkichlari" }
                        ].map((item, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-white/20 mt-1.5" />
                            <div>
                              <p className="text-[11px] font-bold text-white/80">{item.label}</p>
                              <p className="text-[10px] text-white/40">{item.desc}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </section>
                    <section>
                      <h3 className="text-sm font-black uppercase tracking-widest text-white mb-3">Ma'lumotlardan foydalanish</h3>
                      <p className="text-xs text-white/40 leading-relaxed">
                        Yig'ilgan ma'lumotlar faqat sizning mashg'ulotlaringizni tahlil qilish, shaxsiy tavsiyalar berish va ilova sifatini yaxshilash uchun ishlatiladi.
                      </p>
                    </section>
                  </div>
                </div>
                <div className="pt-8 border-t border-white/5 flex flex-col items-center">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4 shadow-inner">
                    <Lock className="w-6 h-6" />
                  </div>
                  <p className="text-[10px] text-white/20 uppercase font-black tracking-[0.2em]">Xavfsizlik darajasi: AES-256</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const DeleteAccountModal = ({ isOpen, onClose, onConfirm }: { isOpen: boolean; onClose: () => void; onConfirm: () => void }) => {
  return (
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
            className="absolute inset-x-0 bottom-0 bg-[#0A0A0A] border-t border-red-500/20 rounded-t-[40px] z-[251] overflow-hidden shadow-[0_-20px_80px_rgba(239,68,68,0.15)] p-8 pb-12"
          >
            <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-8" />
            
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-4">
                <Trash2 className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-black uppercase tracking-tighter text-white mb-2">Hisobni o'chirish</h2>
              <p className="text-sm text-white/60">
                Haqiqatan ham hisobingizni o'chirmoqchimisiz? Bu amalni bekor qilib bo'lmaydi va barcha ma'lumotlaringiz o'chib ketadi.
              </p>
            </div>

            <div className="space-y-3">
              <button 
                onClick={onConfirm}
                className="w-full py-4 rounded-2xl bg-red-500 text-white font-black uppercase tracking-widest hover:bg-red-600 active:scale-95 transition-all"
              >
                Ha, o'chirish
              </button>
              <button 
                onClick={onClose}
                className="w-full py-4 rounded-2xl bg-white/5 text-white font-black uppercase tracking-widest hover:bg-white/10 active:scale-95 transition-all"
              >
                Bekor qilish
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const BodyMetricsModal = ({ 
  isOpen, 
  onClose, 
  activeMetric, 
  bodyMetrics, 
  onUpdate 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  activeMetric: 'weight' | 'height' | 'age';
  bodyMetrics: any;
  onUpdate: (newData: any) => void;
}) => {
  const [value, setValue] = useState(bodyMetrics[activeMetric]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Update local state when metric changes
  React.useEffect(() => {
    setValue(bodyMetrics[activeMetric]);
  }, [activeMetric, bodyMetrics]);

  const getRange = () => {
    switch(activeMetric) {
      case 'weight': return { min: 30, max: 200 };
      case 'height': return { min: 100, max: 250 };
      case 'age': return { min: 5, max: 100 };
    }
  };
  const range = getRange();

  // Scroll to initial value when modal opens
  React.useEffect(() => {
    if (isOpen && scrollRef.current) {
      setTimeout(() => {
        if (scrollRef.current) {
          const index = value - range.min;
          scrollRef.current.scrollLeft = index * 32;
        }
      }, 50);
    }
  }, [isOpen, activeMetric]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const index = Math.round(scrollRef.current.scrollLeft / 32);
    const newVal = range.min + index;
    if (newVal >= range.min && newVal <= range.max && newVal !== value) {
      setValue(newVal);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (scrollRef.current) {
      const index = Math.round(scrollRef.current.scrollLeft / 32);
      scrollRef.current.scrollTo({
        left: index * 32,
        behavior: 'smooth'
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; 
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleSave = () => {
    onUpdate({ ...bodyMetrics, [activeMetric]: value });
    toast.success("Ma'lumotlar saqlandi");
    onClose();
  };

  const getTitle = () => {
    switch(activeMetric) {
      case 'weight': return "Vaznni o'zgartirish";
      case 'height': return "Bo'yni o'zgartirish";
      case 'age': return "Yoshni o'zgartirish";
    }
  };

  const getUnit = () => {
    switch(activeMetric) {
      case 'weight': return "kg";
      case 'height': return "cm";
      case 'age': return "yosh";
    }
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
            className="absolute inset-0 bg-black/80 backdrop-blur-xl z-[250]"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute inset-x-0 bottom-0 bg-[#0A0A0A] border-t border-white/10 rounded-t-[40px] z-[251] overflow-hidden shadow-[0_-20px_80px_rgba(0,0,0,0.8)] p-8 pb-12"
          >
            <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-8" />
            
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tighter text-white">{getTitle()}</h2>
                <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mt-1">Aniq ko'rsatkichni belgilang</p>
              </div>
              <button 
                onClick={onClose} 
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col items-center mb-12">
              <div className="flex items-baseline gap-2 mb-8">
                <motion.span 
                  key={value}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-7xl font-black text-primary tracking-tighter"
                >
                  {value}
                </motion.span>
                <span className="text-xl font-black text-white/20 uppercase tracking-widest">{getUnit()}</span>
              </div>

              {/* Ruler-style Slider */}
              <div className="w-full relative py-8">
                <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-primary z-10 shadow-[0_0_8px_rgba(204,255,0,0.5)] rounded-full -translate-x-1/2" />
                <div 
                  ref={scrollRef}
                  onScroll={handleScroll}
                  onMouseDown={handleMouseDown}
                  onMouseLeave={handleMouseLeave}
                  onMouseUp={handleMouseUp}
                  onMouseMove={handleMouseMove}
                  className={cn(
                    "overflow-x-auto no-scrollbar flex items-end py-4 cursor-grab active:cursor-grabbing",
                    !isDragging && "snap-x snap-mandatory"
                  )}
                >
                  <div className="w-[calc(50%-16px)] shrink-0" />
                  {Array.from({ length: range.max - range.min + 1 }).map((_, i) => {
                    const currentVal = range.min + i;
                    const isMajor = currentVal % 5 === 0;
                    const isSelected = currentVal === value;

                    return (
                      <div 
                        key={i} 
                        onClick={() => {
                          setValue(currentVal);
                          if (scrollRef.current) {
                            scrollRef.current.scrollTo({ left: i * 32, behavior: 'smooth' });
                          }
                        }}
                        className="flex flex-col items-center justify-end shrink-0 w-8 h-24 snap-center"
                      >
                        <div className={cn(
                          "transition-all duration-300 rounded-full",
                          isMajor ? "w-1 h-12 bg-white/40" : "w-0.5 h-6 bg-white/10",
                          isSelected && "bg-primary h-16 w-1.5"
                        )} />
                        {isMajor && (
                          <span className={cn(
                            "text-[10px] font-black mt-3 transition-colors",
                            isSelected ? "text-primary" : "text-white/20"
                          )}>
                            {currentVal}
                          </span>
                        )}
                      </div>
                    );
                  })}
                  <div className="w-[calc(50%-16px)] shrink-0" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={onClose}
                className="py-5 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 active:scale-95 transition-all"
              >
                Bekor qilish
              </button>
              <button 
                onClick={handleSave}
                className="py-5 rounded-2xl bg-primary text-black font-black uppercase tracking-[0.2em] text-[10px] shadow-[0_10px_30px_rgba(204,255,0,0.3)] active:scale-95 transition-all"
              >
                Tasdiqlash
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const EditProfileModal = ({ 
  isOpen, 
  onClose, 
  userData, 
  onUpdate 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  userData: any;
  onUpdate: (newData: any) => void;
}) => {
  const [name, setName] = useState(userData.name);
  const [location, setLocation] = useState(userData.location);
  const [bio, setBio] = useState(userData.bio || "");
  const [instagram, setInstagram] = useState(userData.instagram || "");
  const [strava, setStrava] = useState(userData.strava || "");
  const [badge, setBadge] = useState(userData.badge);
  const [avatar, setAvatar] = useState(userData.avatar);
  const [cover, setCover] = useState(userData.cover);

  // Cropping State
  const [cropModal, setCropModal] = useState<{
    isOpen: boolean;
    type: 'avatar' | 'cover';
    src: string;
  }>({ isOpen: false, type: 'avatar', src: '' });

  const [isSaving, setIsSaving] = useState(false);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = React.useRef<HTMLImageElement>(null);

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const aspect = cropModal.type === 'avatar' ? 1 : 16 / 9;
    const initialCrop = centerCrop(
      makeAspectCrop(
        { unit: '%', width: 90 },
        aspect,
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
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
        else setCover(croppedUrl);
      }
    } finally {
      setIsSaving(false);
      setCropModal({ ...cropModal, isOpen: false, src: '' });
    }
  };

  const unlockedAchievements = [
    ...TERRITORY_ACHIEVEMENTS,
    ...DISTANCE_ACHIEVEMENTS,
    ...STREAK_ACHIEVEMENTS,
    ...MARATHON_ACHIEVEMENTS
  ].filter(a => a.isUnlocked);

  const handleSave = () => {
    onUpdate({ name, location, bio, instagram, strava, badge, avatar, cover });
    toast.success("Profil muvaffaqiyatli yangilandi");
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
                    <h2 className="text-2xl font-black uppercase tracking-tighter">Profil <span className="text-primary">Tahriri</span></h2>
                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Shaxsiy brendingizni yarating</p>
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
                      onClick={() => document.getElementById('cover-upload')?.click()}
                    >
                      <img src={cover} alt="Cover" className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-primary transition-all group-hover:scale-110">
                          <Plus className="w-6 h-6 text-white/40 group-hover:text-black transition-colors" />
                        </div>
                        <span className="text-[8px] font-black uppercase tracking-widest text-white/20">Muqova rasmi</span>
                      </div>
                      <input id="cover-upload" type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'cover')} />
                    </div>

                    {/* Avatar Upload */}
                    <div className="flex justify-center -mt-16 relative z-10">
                      <div 
                        className="relative group cursor-pointer"
                        onClick={() => document.getElementById('avatar-upload')?.click()}
                      >
                        <div className="w-32 h-32 rounded-[40px] border-[8px] border-[#0A0A0A] bg-[#1A1A1A] overflow-hidden shadow-2xl group-hover:scale-105 transition-transform">
                          <img src={avatar} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div className="absolute inset-0 bg-black/40 rounded-[40px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Plus className="w-6 h-6 text-white" />
                        </div>
                        <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'avatar')} />
                      </div>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] px-2">Nik (Ism)</label>
                      <div className="relative group">
                        <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-primary transition-colors" />
                        <input 
                          type="text" 
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full h-16 bg-white/[0.03] border border-white/10 rounded-2xl pl-14 pr-6 text-sm font-bold focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all"
                          placeholder="Ismingizni kiriting"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] px-2">Bio (Status)</label>
                      <div className="relative group">
                        <Quote className="absolute left-5 top-6 w-5 h-5 text-white/20 group-focus-within:text-primary transition-colors" />
                        <textarea 
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          className="w-full h-32 bg-white/[0.03] border border-white/10 rounded-2xl pl-14 pr-6 pt-6 text-sm font-bold focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all resize-none"
                          placeholder="O'zingiz haqingizda qisqa yozing..."
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] px-2">Instagram</label>
                        <div className="relative group">
                          <Instagram className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-primary transition-colors" />
                          <input 
                            type="text" 
                            value={instagram}
                            onChange={(e) => setInstagram(e.target.value)}
                            className="w-full h-16 bg-white/[0.03] border border-white/10 rounded-2xl pl-14 pr-6 text-xs font-bold focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all"
                            placeholder="@username"
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] px-2">Strava</label>
                        <div className="relative group">
                          <LinkIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-primary transition-colors" />
                          <input 
                            type="text" 
                            value={strava}
                            onChange={(e) => setStrava(e.target.value)}
                            className="w-full h-16 bg-white/[0.03] border border-white/10 rounded-2xl pl-14 pr-6 text-xs font-bold focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all"
                            placeholder="Link"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] px-2">Maxsus belgi (Titullar)</label>
                      <div className="grid grid-cols-4 gap-3">
                        <button 
                          onClick={() => setBadge(null)}
                          className={cn(
                            "h-20 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all",
                            badge === null ? "bg-primary/10 border-primary/50 text-primary" : "bg-white/5 border-white/10 text-white/20"
                          )}
                        >
                          <X className="w-6 h-6" />
                          <span className="text-[8px] font-black uppercase text-center">Yo'q</span>
                        </button>
                        {unlockedAchievements.map((b) => (
                          <button 
                            key={b.id}
                            onClick={() => setBadge(b.id)}
                            className={cn(
                              "h-20 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all p-1",
                              badge === b.id ? "bg-primary/10 border-primary/50 shadow-[0_0_15px_rgba(204,255,0,0.2)]" : "bg-white/5 border-white/10 text-white/20 hover:bg-white/10"
                            )}
                          >
                            <div className="w-8 h-8 flex items-center justify-center">
                              {b.icon}
                            </div>
                            <span className="text-[7px] font-black uppercase text-center leading-tight line-clamp-2">{b.title}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="absolute bottom-0 inset-x-0 p-8 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A] to-transparent">
                <button 
                  onClick={handleSave}
                  className="w-full py-5 rounded-2xl bg-primary text-black text-[10px] font-black uppercase tracking-[0.3em] shadow-[0_20px_40px_rgba(204,255,0,0.2)] active:scale-[0.98] transition-all"
                >
                  O'zgarishlarni saqlash
                </button>
              </div>

              {/* Crop Modal (Internal to Settings) */}
              <AnimatePresence>
                {cropModal.isOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black z-[300] flex flex-col"
                  >
                    <div className="p-6 flex items-center justify-between border-b border-white/5 bg-black/40 backdrop-blur-md">
                      <h3 className="text-sm font-black uppercase tracking-widest">Rasmni tahrirlash</h3>
                      <button onClick={() => setCropModal({ ...cropModal, isOpen: false, src: '' })} className="p-2 rounded-xl bg-white/5 text-white/40">
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
                          aspect={cropModal.type === 'avatar' ? 1 : 16 / 9}
                          circularCrop={cropModal.type === 'avatar'}
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
                          onClick={() => setCropModal({ ...cropModal, isOpen: false, src: '' })}
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
          </>
        )}
      </AnimatePresence>
    </>
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
            className="absolute inset-0 bg-black/60 backdrop-blur-md z-[200]"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute inset-x-0 bottom-0 bg-[#0A0A0A] border-t border-white/10 rounded-t-[40px] z-[201] overflow-hidden shadow-[0_-20px_50px_rgba(0,0,0,0.5)]"
          >
            {/* Handle */}
            <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mt-4 mb-2" />
            
            <div className="p-8">
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
                    className="w-full p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-4 hover:bg-white/[0.05] transition-all group"
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
                        className="w-full p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-4 hover:bg-white/[0.05] transition-all group"
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
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl z-[100]"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute inset-x-0 bottom-0 h-[90vh] bg-[#0A0A0A] border-t border-white/10 rounded-t-[40px] z-[101] flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-bottom border-white/5 flex items-center justify-between">
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
                  <div key={member.id} className="p-4 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-between group hover:bg-white/[0.04] transition-all">
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
          </>
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

const NEWS_ITEMS = [
  { id: 1, text: "ZONIC klan chatida yangi suhbat boshlandi. Jamoangiz sizni kutmoqda!", icon: <MessageSquare className="w-3 h-3 text-primary" /> },
  { id: 2, text: "Yangi versiya (v2.4.0) chiqdi. Yangi funksiyalardan foydalanish uchun yangilang.", icon: <Zap className="w-3 h-3 text-orange-500" /> },
  { id: 3, text: "Siz 'Yunusobod Qiroli' unvonini qo'lga kiritdingiz. Tabriklaymiz!", icon: <Award className="w-3 h-3 text-yellow-500" /> },
];

const SwipeableHistoryCards = ({ activities }: { activities: any[] }) => {
  const [cards, setCards] = useState(activities);
  const [exitingCard, setExitingCard] = useState<{ id: number, dir: number } | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setCards(activities);
  }, [activities]);

  // When expanding, we might want to revert to chronological order, but to keep animation smooth, we just use the current cards array.
  // Actually, chronologically activities is better. Let's use activities when expanded.
  const displayItems = isExpanded ? activities : cards;

  const handleDragEnd = (e: any, info: any, id: number) => {
    if (isExpanded) return;
    if (exitingCard) return; // Allow only one drag at a time
    if (Math.abs(info.offset.x) > 60 || Math.abs(info.velocity.x) > 500) {
      const dir = info.offset.x > 0 ? 1 : -1;
      setExitingCard({ id, dir });
      
      setTimeout(() => {
        setCards(prev => {
          const index = prev.findIndex(c => c.id === id);
          if (index !== -1) {
            const newCards = [...prev];
            const [removed] = newCards.splice(index, 1);
            newCards.push(removed);
            return newCards;
          }
          return prev;
        });
        setExitingCard(null);
      }, 300);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <motion.div 
        layout
        className={cn(
          "relative w-full max-w-[500px] mx-auto perspective-1000",
          isExpanded ? "flex flex-col gap-4 mt-2" : "h-[250px] mt-8 mb-4"
        )}
      >
        <AnimatePresence mode="popLayout">
          {displayItems.map((card, index) => {
            const isExiting = exitingCard?.id === card.id;
            
            let effectiveIndex = index;
            if (exitingCard && !isExpanded) {
                const exitingIndex = displayItems.findIndex(c => c.id === exitingCard.id);
                if (index > exitingIndex) effectiveIndex -= 1;
            }

            const isFront = effectiveIndex === 0 && !isExiting && !isExpanded;

            let translateY = 0;
            let scale = 1;
            let opacity = 1;
            let zIndex = 30 - effectiveIndex;
            let animateX = 0;

            if (!isExpanded) {
              if (effectiveIndex === 1) {
                translateY = 24;
                scale = 0.95;
                opacity = 0.7;
              } else if (effectiveIndex === 2) {
                translateY = 48;
                scale = 0.90;
                opacity = 0.4;
              } else if (effectiveIndex > 2) {
                translateY = 72;
                scale = 0.85;
                opacity = 0;
              }

              if (isExiting) {
                animateX = exitingCard.dir * 300; // Fly to side
                opacity = 0;
                zIndex = 40; // Stay on top while exiting
              }
            } else {
              // Expanded Mode
              translateY = 0;
              scale = 1;
              opacity = 1;
              zIndex = 1;
            }

            return (
               <motion.div
                  layout
                  key={card.id}
                  className={cn(
                    "bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-[24px] border border-white/5 shadow-2xl p-6 flex flex-col justify-between origin-top",
                    isExpanded ? "w-full min-h-[160px]" : "absolute inset-x-0 top-0 h-[180px]"
                  )}
                  animate={{
                     x: animateX,
                     y: translateY,
                     scale: scale,
                     opacity: opacity,
                     zIndex: zIndex
                  }}
                  transition={{ type: "spring", stiffness: 350, damping: 30, mass: 1 }}
                  drag={isFront ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={isFront ? 1 : 0}
                  onDragEnd={(e, info) => handleDragEnd(e, info, card.id)}
                  whileDrag={isFront ? { scale: 1.02, cursor: "grabbing" } : {}}
                  style={(isExiting || opacity === 0 && !isExpanded) ? { pointerEvents: 'none' } : {}}
               >
                  {/* Top Row: Hudud and Date */}
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: card.color || '#CCFF00' }} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-white">{card.hudud}</span>
                    </div>
                    <span className="text-[10px] font-bold text-white/40 tracking-widest">
                      {card.date}
                    </span>
                  </div>
                  
                  {/* Center Row: Main Stats */}
                  <div className="flex flex-col justify-end h-full">
                    <div className="flex justify-between items-end">
                      <div className="flex items-baseline gap-1">
                        <p className="text-[64px] font-display-metrics font-black tracking-tighter leading-none text-white whitespace-nowrap">
                          {card.distance}
                        </p>
                        <div className="flex flex-col mb-1 ml-1">
                          <p className="text-[8px] font-black uppercase tracking-[0.2em] mb-1" style={{ color: card.color || '#CCFF00' }}>MASOFA</p>
                          <p className="text-[12px] font-bold text-white/40 uppercase leading-none">{card.unit}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[8px] font-black uppercase tracking-[0.2em] mb-1 text-white/40">
                          QADAMLAR
                        </p>
                        <p className="text-[28px] font-display-metrics font-bold text-white leading-none">
                          {card.steps}
                        </p>
                      </div>
                    </div>
                  </div>
               </motion.div>
            )
          })}
        </AnimatePresence>
      </motion.div>

      {/* Load More Button */}
      <motion.button 
        layout
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full py-4 mt-2 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-white hover:bg-white/10 transition-all active:scale-95"
      >
        {isExpanded ? "Yig'ish" : "Yana yuklash"}
      </motion.button>
    </div>
  )
};

export default function Profile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Umumiy");
  
  const [activitySort, setActivitySort] = useState<'recent' | 'distance' | 'steps'>('recent');
  const [isActivityFilterOpen, setIsActivityFilterOpen] = useState(false);

  const sortedActivities = useMemo(() => {
    const data = [...ACTIVITY_DATA];
    if (activitySort === 'distance') {
      return data.sort((a, b) => parseFloat(b.distance) - parseFloat(a.distance));
    }
    if (activitySort === 'steps') {
      return data.sort((a, b) => parseInt(b.steps) - parseInt(a.steps));
    }
    return data;
  }, [activitySort]);

  const [notifications, setNotifications] = useState([
    { id: 1, type: "chat", title: "Yangi Suhbat!", desc: "ZONIC klan chatida yangi suhbat boshlandi. Jamoangiz sizni kutmoqda!", time: "Hozir", icon: <MessageSquare className="w-4 h-4 text-primary" />, color: "bg-primary/10 border-primary/20" },
    { id: 2, type: "system", title: "Ilovani Yangilang!", desc: "Yangi versiya (v2.4.0) chiqdi. Yangi funksiyalardan foydalanish uchun ilovani yangilang.", time: "5 daqiqa oldin", icon: <Zap className="w-4 h-4 text-orange-500" />, color: "bg-orange-500/10 border-orange-500/20" },
    { id: 3, type: "achievement", title: "Yangi Unvon!", desc: "Siz 'Yunusobod Qiroli' unvonini qo'lga kiritdingiz. Tabriklaymiz!", time: "1 soat oldin", icon: <Award className="w-4 h-4 text-yellow-500" />, color: "bg-yellow-500/10 border-yellow-500/20" },
    { id: 4, type: "social", title: "Do'stlik Taklifi", desc: "Amir_Runner sizga do'stlik so'rovini yubordi.", time: "Kecha", icon: <Users className="w-4 h-4 text-blue-500" />, color: "bg-blue-500/10 border-blue-500/20", actions: true }
  ]);
  const [newsIndex, setNewsIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setNewsIndex(prev => (prev + 1) % NEWS_ITEMS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);
  const [selectedAchievement, setSelectedAchievement] = useState<any>(null);
  const [isAllAchievementsOpen, setIsAllAchievementsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isGoalsModalOpen, setIsGoalsModalOpen] = useState(false);
  const [goalsModalParams, setGoalsModalParams] = useState<{tab: 'active' | 'history' | 'new', period?: string}>({tab: 'active'});
  const [isClanChatOpen, setIsClanChatOpen] = useState(false);
  const [isClanMembersOpen, setIsClanMembersOpen] = useState(false);
  const [selectedMemberForOptions, setSelectedMemberForOptions] = useState<any>(null);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [selectedBarIndex, setSelectedBarIndex] = useState<number | null>(null);
  const [activeGoalSubTab, setActiveGoalSubTab] = useState("AI Marafon Rejalari");
  const [activeChartIndex, setActiveChartIndex] = useState(0);
  const [activityTab, setActivityTab] = useState<"KM" | "HUDUD" | "QADAM">("KM");
  const [stepGoal, setStepGoal] = useState(10000);
  const qadamChartRef = useRef<HTMLDivElement>(null);
  const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState<"Profil" | "Xavfsizlik" | "Ilova">("Profil");
  
  const [isSettingsHeaderCollapsed, setIsSettingsHeaderCollapsed] = useState(false);
  const settingsScrollAccumulator = useRef(0);
  const settingsLastScrollY = useRef(0);
  const settingsScrollLock = useRef(false);

  const handleSettingsScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const currentScrollY = e.currentTarget.scrollTop;
    const delta = currentScrollY - settingsLastScrollY.current;
    settingsLastScrollY.current = currentScrollY;

    if (settingsScrollLock.current) return;

    if (currentScrollY <= 10) {
      setIsSettingsHeaderCollapsed(false);
      settingsScrollAccumulator.current = 0;
      return;
    }

    if ((delta > 0 && settingsScrollAccumulator.current < 0) || (delta < 0 && settingsScrollAccumulator.current > 0)) {
      settingsScrollAccumulator.current = 0;
    }

    settingsScrollAccumulator.current += delta;

    if (settingsScrollAccumulator.current > 50) {
      setIsSettingsHeaderCollapsed(true);
      settingsScrollAccumulator.current = 0;
      settingsScrollLock.current = true;
      setTimeout(() => settingsScrollLock.current = false, 400);
    } else if (settingsScrollAccumulator.current < -50) {
      setIsSettingsHeaderCollapsed(false);
      settingsScrollAccumulator.current = 0;
      settingsScrollLock.current = true;
      setTimeout(() => settingsScrollLock.current = false, 400);
    }
  };

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isBodyMetricsModalOpen, setIsBodyMetricsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState<any>(null);
  const [selectedGadget, setSelectedGadget] = useState<any>(null);
  const [legalContent, setLegalContent] = useState<{title: string, type: string} | null>(null);

  const [connections, setConnections] = useState([
    { 
      id: 'strava', 
      name: "Strava", 
      status: "Ulangan", 
      icon: "https://upload.wikimedia.org/wikipedia/commons/c/cb/Strava_Logo.svg", 
      color: "text-orange-500", 
      desc: "Mashg'ulotlarni avtomatik sinxronlash va tahlil qilish.",
      type: "oauth",
      lastSync: "2 daqiqa avval"
    },
    { 
      id: 'apple_health', 
      name: "Apple Health", 
      status: "Ulanmagan", 
      icon: <Heart className="w-full h-full" />, 
      color: "text-red-500", 
      desc: "iOS salomatlik ma'lumotlari bilan integratsiya.",
      type: "system",
      lastSync: null
    },
    { 
      id: 'google_fit', 
      name: "Google Fit", 
      status: "Ulanmagan", 
      icon: <Globe2 className="w-full h-full" />, 
      color: "text-blue-500", 
      desc: "Android va Google ekotizimi bilan bog'lanish.",
      type: "google",
      lastSync: null
    },
  ]);

  const [gadgets, setGadgets] = useState([
    { 
      id: 'apple_watch',
      name: "Apple Watch", 
      status: "Ulangan", 
      icon: <Watch className="w-full h-full" />, 
      color: "text-white",
      battery: 85,
      heartRate: 72,
      firmware: "v10.4.1",
      lastSync: "Hozirgina",
      desc: "Yurak urishi va faollikni real vaqtda kuzatish."
    },
    { 
      id: 'garmin',
      name: "Garmin Connect", 
      status: "Ulanmagan", 
      icon: <Activity className="w-full h-full" />, 
      color: "text-blue-400",
      battery: 0,
      heartRate: 0,
      firmware: "v15.20",
      lastSync: "Hech qachon",
      desc: "Professional sportchilar uchun Garmin ekotizimi."
    },
    { 
      id: 'galaxy_watch',
      name: "Galaxy Watch", 
      status: "Ulanmagan", 
      icon: <Smartphone className="w-full h-full" />, 
      color: "text-blue-600",
      battery: 0,
      heartRate: 0,
      firmware: "v6.1.0",
      lastSync: "Hech qachon",
      desc: "Samsung WearOS qurilmalari bilan integratsiya."
    }
  ]);

  const handleConnectionToggle = (id: string, status: boolean) => {
    setConnections(prev => prev.map(c => 
      c.id === id ? { 
        ...c, 
        status: status ? "Ulangan" : "Ulanmagan",
        lastSync: status ? "Hozirgina" : null
      } : c
    ));
    toast.success(status ? "Muvaffaqiyatli ulandi" : "Ulanish uzildi");
  };

  const handleGadgetToggle = (id: string, status: boolean) => {
    setGadgets(prev => prev.map(g => 
      g.id === id ? { 
        ...g, 
        status: status ? "Ulangan" : "Ulanmagan", 
        battery: status ? 85 : 0,
        heartRate: status ? 72 : 0,
        lastSync: status ? "Hozirgina" : g.lastSync 
      } : g
    ));
  };

  const [activeMetric, setActiveMetric] = useState<'weight' | 'height' | 'age'>('weight');
  const [settingsTab, setSettingsTab] = useState<'main' | 'account' | 'privacy' | 'notifications' | 'gadgets'>('main');
  
  const [settings, setSettings] = useState({
    units: 'km',
    weightUnit: 'kg',
    language: 'uz',
    ghostMode: false,
    privateProfile: false,
    biometricLock: false,
    mapVisibility: 'friends', // 'all', 'friends', 'none'
    hiddenZones: true,
    notifications: {
      clan: true,
      achievements: true,
      reminders: true
    },
    voiceFeedback: true,
    voiceVolume: 80,
    parentalLinkActive: false,
    watchSync: true,
    autoSync: true
  });

  const [bodyMetrics, setBodyMetrics] = useState({
    weight: 72,
    height: 178,
    age: 24
  });

  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
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

    // Reset accumulator if changing direction
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

  const [isPressing, setIsPressing] = useState(false);
  const pressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [userData, setUserData] = useState({
    name: "AVAZOV OG'ABEK",
    location: "ZONIC jamoasi a'zosi",
    avatar: "/badges/avazov.JPG",
    cover: "/badges/100623811.jpg",
    bio: "Maqsad: Haftasiga 50km",
    instagram: "",
    strava: "",
    badge: null
  });

  // Unified Goals State
  const [goals, setGoals] = useState<Goal[]>(INITIAL_GOALS);
  const [completedGoals, setCompletedGoals] = useState<Goal[]>(COMPLETED_GOALS);
  const [newsItems, setNewsItems] = useState(NEWS_ITEMS);

  // Dynamic Chart Data Logic
  const dynamicChartData = useMemo(() => {
    const now = new Date();
    const currentDay = now.getDay(); // 0 (Sun) to 6 (Sat)
    const dayMap: Record<number, number> = { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 0: 6 };
    const currentDayIndex = dayMap[currentDay] ?? 0;
    const currentMonth = now.getMonth(); // 0-11
    const currentYear = now.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const currentDayOfMonth = now.getDate();

    const weekly = WEEKLY_DATA.map((item: any, i) => ({
      ...item,
      value: i > currentDayIndex ? 0 : item.value,
      badge: i > currentDayIndex ? undefined : item.badge,
      highlighted: i === currentDayIndex,
      isFuture: i > currentDayIndex
    }));

    // Monthly: Show days of the current month (e.g. 1 to 30)
    // To avoid overcrowding, we'll generate all days but only show labels for every 5th day
    const monthly = Array.from({ length: daysInMonth }).map((_, i) => {
      const day = i + 1;
      const isFuture = day > currentDayOfMonth;
      let baseValue = 0;
      
      if (!isFuture) {
        // Guarantee at least one max height bar and one min height bar
        if (day === Math.max(1, currentDayOfMonth - 1)) {
          baseValue = 150; // Exceeds ceiling (Maksimal ustun)
        } else if (day === Math.max(1, currentDayOfMonth - 2) && currentDayOfMonth > 2) {
          baseValue = 12; // Kichik ustun
        } else {
          // Qolganlari bir-biridan farq qiladigan balandlikda (30 dan 80 gacha)
          baseValue = Math.floor(Math.random() * 50) + 30;
        }
      }
      
      return {
        label: (day % 5 === 0 || day === 1 || day === daysInMonth) ? `${day}` : "",
        value: isFuture ? 0 : baseValue,
        highlighted: day === currentDayOfMonth,
        badge: day === currentDayOfMonth ? `${baseValue} km` : undefined,
        isFuture
      };
    });

    const yearly = YEARLY_DATA.map((item, i) => {
      const isFuture = i > currentMonth;
      let val = item.value;
      
      if (!isFuture) {
        // Guarantee at least one max height bar and one min height bar
        if (i === Math.max(0, currentMonth - 1)) {
          val = 150; // Exceeds ceiling (Maksimal ustun)
        } else if (i === Math.max(0, currentMonth - 2) && currentMonth > 1) {
          val = 15; // Kichik ustun
        } else if (i !== currentMonth) {
          // Qolganlari bir-biridan farq qiladigan balandlikda (30 dan 80 gacha)
          val = Math.floor(Math.random() * 50) + 30;
        } else {
          val = Math.floor(Math.random() * 20) + 20; // Joriy oy uchun
        }
      }
      
      return {
        ...item,
        value: isFuture ? 0 : val,
        highlighted: i === currentMonth,
        isFuture
      };
    });

    return [
      { id: "weekly", title: "Haftalik Faollik", subtitle: "Oxirgi 7 kun", data: weekly },
      { id: "monthly", title: "Oylik Dinamika", subtitle: "Joriy oy", data: monthly },
      { id: "yearly", title: "Yillik Statistika", subtitle: `${currentYear}-yil`, data: yearly },
    ];
  }, [goals]); // Re-calculate if goals change or just on mount

  const currentChart = dynamicChartData[activeChartIndex];

  const handlePressStart = () => {
    if (isHeaderHidden) return;
    setIsPressing(true);
    pressTimerRef.current = setTimeout(() => {
      setIsHeaderHidden(true);
      setIsPressing(false);
    }, 2000);
  };

  const handlePressEnd = () => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
    setIsPressing(false);
  };

  const handleHeaderClick = () => {
    if (isHeaderHidden) {
      setIsHeaderHidden(false);
    }
  };

  const [isVoiceTesting, setIsVoiceTesting] = useState(false);
  const [voiceType, setVoiceType] = useState<'Kore' | 'Puck' | 'Charon' | 'Fenrir' | 'Zephyr'>('Kore');
  const voiceCache = useRef<Record<string, Float32Array>>({});

  const handleTestVoice = async (customText?: string, forceVoice?: string) => {
    if (isVoiceTesting) return;
    
    const text = customText || "Xayrli kun! Men Zonic AI yordamchisiman. Bugun yangi marralarni zabt etishga tayyormisiz?";
    const currentVoice = forceVoice || voiceType;
    const cacheKey = `${text}_${currentVoice}`;

    const playAudio = (float32: Float32Array) => {
      const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
      const audioCtx = new AudioContextClass();
      const buffer = audioCtx.createBuffer(1, float32.length, 24000);
      buffer.getChannelData(0).set(float32);
      const source = audioCtx.createBufferSource();
      source.buffer = buffer;
      const gainNode = audioCtx.createGain();
      gainNode.gain.value = settings.voiceVolume / 100;
      source.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      source.start(0);
      source.onended = () => audioCtx.close();
    };

    if (voiceCache.current[cacheKey]) {
      playAudio(voiceCache.current[cacheKey]);
      return;
    }

    setIsVoiceTesting(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Say: ${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: currentVoice },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const binaryString = atob(base64Audio);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const pcm16 = new Int16Array(bytes.buffer);
        const float32 = new Float32Array(pcm16.length);
        for (let i = 0; i < pcm16.length; i++) {
          float32[i] = pcm16[i] / 32768.0;
        }
        
        voiceCache.current[cacheKey] = float32;
        playAudio(float32);
      }
    } catch (error) {
      console.error("Ovozli yordamchi xatosi:", error);
    } finally {
      setIsVoiceTesting(false);
    }
  };

  const toggleSetting = async (key: keyof typeof settings, label: string) => {
    if (key === 'biometricLock' && !settings.biometricLock) {
      const loadingToast = toast.loading("FaceID skanerlanmoqda...", {
        style: { background: '#0A0A0A', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
      });
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.dismiss(loadingToast);
      setSettings(prev => ({ ...prev, [key]: true }));
      toast.success("Biometrik himoya faollashtirildi", {
        icon: '🔒',
        style: { background: '#0A0A0A', color: '#fff', border: '1px solid rgba(204,255,0,0.2)' }
      });
      return;
    }

    const newValue = !settings[key];
    setSettings(prev => ({ ...prev, [key]: newValue }));
    
    if (newValue) {
      toast.success(`${label} yoqildi`, {
        style: { background: '#0A0A0A', color: '#fff', border: '1px solid rgba(204,255,0,0.2)' }
      });
      if (key === 'voiceFeedback') {
        // Premium greeting when turned on
        setTimeout(() => handleTestVoice(), 500);
      }
    } else {
      toast.error(`${label} o'chirildi`, {
        style: { background: '#0A0A0A', color: '#fff', border: '1px solid rgba(255,0,0,0.2)' }
      });
    }
  };

  const handleClearCache = async () => {
    const loadingToast = toast.loading("Kesh tozalanmoqda...", {
      style: { background: '#0A0A0A', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
    });
    
    // Simulate cache clearing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.dismiss(loadingToast);
    toast.success("142 MB kesh muvaffaqiyatli tozalandi", {
      icon: '🧹',
      style: { background: '#0A0A0A', color: '#fff', border: '1px solid rgba(204,255,0,0.2)' }
    });
  };

  const handleExportData = async () => {
    const loadingToast = toast.loading("Ma'lumotlar eksportga tayyorlanmoqda...", {
      style: { background: '#0A0A0A', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
    });
    
    // Simulate data preparation
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    toast.dismiss(loadingToast);
    toast.success("Ma'lumotlar paketi elektron pochtangizga yuborildi", {
      icon: '📧',
      style: { background: '#0A0A0A', color: '#fff', border: '1px solid rgba(204,255,0,0.2)' }
    });
  };

  return (
    <div className="flex h-full flex-col bg-[#050505] text-white overflow-hidden font-sans relative">
      {/* Top News Ticker */}
      <AnimatePresence>
        {newsItems.length > 0 && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 32, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-black/40 border-b border-white/5 flex items-center px-6 relative z-[50] overflow-hidden shrink-0"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={newsIndex >= newsItems.length ? 'reset' : newsItems[newsIndex]?.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(_, info) => {
                  if (Math.abs(info.offset.x) > 120) {
                    // Strong swipe to dismiss
                    const removedItem = newsItems[newsIndex];
                    setNewsItems(prev => prev.filter((_, idx) => idx !== newsIndex));
                    setNewsIndex(0);
                    toast("Xabar olib tashlandi", { 
                      description: removedItem?.text.substring(0, 30) + '...',
                      icon: '🗑️',
                      duration: 2000 
                    });
                  } else if (info.offset.x < -40) {
                    setNewsIndex(prev => (prev + 1) % newsItems.length);
                  } else if (info.offset.x > 40) {
                    setNewsIndex(prev => (prev - 1 + newsItems.length) % newsItems.length);
                  }
                }}
                className="flex items-center gap-3 w-full cursor-grab active:cursor-grabbing h-full"
              >
                <div className="shrink-0">{newsItems[newsIndex]?.icon}</div>
                <p className="text-[9px] font-black uppercase tracking-widest text-white/60 truncate select-none flex-1">
                  {newsItems[newsIndex]?.text}
                </p>
                <div className="flex gap-1 shrink-0">
                  {newsItems.map((_, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "w-1 h-1 rounded-full transition-all",
                        newsIndex === i ? "bg-primary w-2" : "bg-white/10"
                      )} 
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-black/40 to-transparent pointer-events-none" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Settings Overlay */}
      <AnimatePresence>
        {isProfileSettingsOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[200] bg-black/95 backdrop-blur-xl flex flex-col overflow-hidden"
          >
            {/* Settings Header */}
            <motion.div 
              animate={{ 
                marginTop: isSettingsHeaderCollapsed ? -88 : 0, // Approximate height of header
                opacity: isSettingsHeaderCollapsed ? 0 : 1
              }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="p-6 border-b border-white/5 flex items-center justify-between shrink-0"
            >
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsProfileSettingsOpen(false)}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tighter text-white">Parametrlar</h2>
                  <p className="text-[10px] text-primary font-bold uppercase tracking-[0.2em]">Boshqaruv Markazi</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                  <span className="text-[9px] font-black text-primary uppercase tracking-widest">v2.4.0 PRO</span>
                </div>
              </div>
            </motion.div>

            {/* Settings Tabs */}
            <div className="flex px-6 border-b border-white/5 bg-surface/20 backdrop-blur-md overflow-x-auto no-scrollbar shrink-0">
              {["Profil", "Xavfsizlik", "Ilova"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveSettingsTab(tab as any)}
                  className={cn(
                    "py-3 px-4 text-[11px] font-bold transition-all relative uppercase tracking-widest",
                    activeSettingsTab === tab ? "text-primary" : "text-white/40 hover:text-white/60"
                  )}
                >
                  {tab}
                  {activeSettingsTab === tab && (
                    <motion.div 
                      layoutId="activeSettingsTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Settings Content */}
            <div 
              className="flex-1 overflow-y-auto p-6 space-y-8 pb-24"
              onScroll={handleSettingsScroll}
            >
              
              {activeSettingsTab === "Profil" && (
                <motion.div
                  key="profil"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  {/* 1. Shaxsiy va Akkaunt */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 px-2">
                  <User className="w-4 h-4 text-primary" />
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40">Shaxsiy va Akkaunt</h3>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {/* Profile Edit Card */}
                  <div 
                    onClick={() => setIsEditProfileOpen(true)}
                    className="p-4 rounded-3xl bg-white/[0.03] border border-white/5 flex items-center justify-between group hover:bg-white/[0.05] transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl overflow-hidden border border-white/10">
                        <img src={userData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{userData.name}</h4>
                        <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider">Profilni tahrirlash</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-primary transition-colors" />
                  </div>

                  {/* Body Metrics Bento */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'weight', label: "Vazn", value: bodyMetrics.weight, unit: settings.weightUnit, icon: <Scale className="w-4 h-4" /> },
                      { id: 'height', label: "Bo'y", value: bodyMetrics.height, unit: "cm", icon: <Ruler className="w-4 h-4" /> },
                      { id: 'age', label: "Yosh", value: bodyMetrics.age, unit: "yosh", icon: <Calendar className="w-4 h-4" /> },
                    ].map((metric, i) => (
                      <div 
                        key={i} 
                        onClick={() => {
                          setActiveMetric(metric.id as any);
                          setIsBodyMetricsModalOpen(true);
                        }}
                        className="p-4 rounded-3xl bg-white/[0.03] border border-white/5 flex flex-col items-center gap-2 hover:border-primary/30 transition-all cursor-pointer group"
                      >
                        <div className="text-primary/60 group-hover:scale-110 transition-transform">{metric.icon}</div>
                        <div className="text-center">
                          <div className="text-lg font-black text-white leading-none">{metric.value}</div>
                          <div className="text-[8px] text-white/30 uppercase font-black tracking-widest mt-1">{metric.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* 2. Ulanishlar (Strava, etc) */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 px-2">
                  <Link2 className="w-4 h-4 text-primary" />
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40">Ulanishlar</h3>
                </div>
                <div className="space-y-3">
                  {connections.map((app, i) => (
                    <div 
                      key={i} 
                      onClick={() => {
                        setSelectedConnection(app);
                      }}
                      className="p-4 rounded-3xl bg-white/[0.03] border border-white/5 flex items-center justify-between hover:bg-white/[0.05] transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all">
                          {typeof app.icon === 'string' ? (
                            <img src={app.icon} alt={app.name} className="w-full h-full object-contain" />
                          ) : (
                            <div className={cn("w-full h-full", app.color)}>{app.icon}</div>
                          )}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">{app.name}</h4>
                          <p className={cn("text-[9px] font-black uppercase tracking-widest", app.status === "Ulangan" ? "text-primary" : "text-white/20")}>
                            {app.status}
                          </p>
                        </div>
                      </div>
                      <div className={cn("w-2 h-2 rounded-full", app.status === "Ulangan" ? "bg-primary shadow-[0_0_10px_rgba(204,255,0,0.5)]" : "bg-white/10")} />
                    </div>
                  ))}
                </div>
              </section>

              {/* 5. Smart Soatlar va Gadjetlar */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 px-2">
                  <Watch className="w-4 h-4 text-primary" />
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40">Gadjetlar</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {gadgets.map((gadget, i) => (
                    <div 
                      key={i}
                      onClick={() => setSelectedGadget(gadget)}
                      className={cn(
                        "p-5 rounded-3xl bg-white/[0.03] border border-white/5 flex flex-col items-center gap-4 text-center group hover:border-primary/30 transition-all cursor-pointer relative overflow-hidden",
                        gadget.status === "Ulanmagan" && "opacity-50"
                      )}
                    >
                      <div className={cn(
                        "w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center transition-colors",
                        gadget.status === "Ulangan" ? "text-primary" : "text-white/40 group-hover:text-primary"
                      )}>
                        {gadget.icon}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{gadget.name}</h4>
                        <div className="flex items-center justify-center gap-2 mt-1">
                          <div className={cn("w-1.5 h-1.5 rounded-full", gadget.status === "Ulangan" ? "bg-primary animate-pulse" : "bg-white/20")} />
                          <span className={cn(
                            "text-[9px] uppercase font-black tracking-widest",
                            gadget.status === "Ulangan" ? "text-primary" : "text-white/40"
                          )}>
                            {gadget.status}
                          </span>
                        </div>
                      </div>

                      {/* Live Stats Overlay (Small) */}
                      {gadget.status === "Ulangan" && (
                        <div className="flex items-center gap-3 mt-1">
                          <div className="flex items-center gap-1">
                            <Battery className="w-2.5 h-2.5 text-primary/60" />
                            <span className="text-[9px] font-bold text-white/40">{gadget.battery}%</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 0.8, repeat: Infinity }}
                            >
                              <Heart className="w-2.5 h-2.5 text-red-500/60 fill-red-500/20" />
                            </motion.div>
                            <span className="text-[9px] font-bold text-white/40">{gadget.heartRate}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
                </motion.div>
              )}

              {activeSettingsTab === "Xavfsizlik" && (
                <motion.div
                  key="xavfsizlik"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  {/* 2. Xavfsizlik (FaceID, etc) */}
                  <section className="space-y-4">
                    <div className="flex items-center gap-2 px-2">
                      <ShieldCheck className="w-4 h-4 text-primary" />
                      <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40">Xavfsizlik</h3>
                    </div>
                    <div className="space-y-3">
                      {/* Biometric Lock */}
                      <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                            <Smartphone className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white">Biometrik himoya</h4>
                            <p className="text-[10px] text-white/30">FaceID yoki Barmoq izi</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => toggleSetting('biometricLock', 'Biometrik himoya')}
                          className={cn(
                            "w-12 h-6 rounded-full transition-all relative",
                            settings.biometricLock ? "bg-primary" : "bg-white/10"
                          )}
                        >
                          <motion.div 
                            animate={{ x: settings.biometricLock ? 26 : 4 }}
                            className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-lg"
                          />
                        </button>
                      </div>

                      {/* Private Profile */}
                      <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-white/40">
                            <Lock className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white">Profil yopiqligi</h4>
                            <p className="text-[10px] text-white/30">Faqat do'stlar ko'ra oladi</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => toggleSetting('privateProfile', 'Profil yopiqligi')}
                          className={cn(
                            "w-12 h-6 rounded-full transition-all relative",
                            settings.privateProfile ? "bg-primary" : "bg-white/10"
                          )}
                        >
                          <motion.div 
                            animate={{ x: settings.privateProfile ? 26 : 4 }}
                            className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-lg"
                          />
                        </button>
                      </div>
                    </div>
                  </section>

              {/* 3. Maxfiylik va Xavfsizlik */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 px-2">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40">Maxfiylik va Xavfsizlik</h3>
                </div>
                <div className="space-y-3">
                  {/* Ghost Mode Toggle */}
                  <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500">
                        <EyeOff className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">Ghost Mode</h4>
                        <p className="text-[10px] text-white/30">Xaritada butunlay g'oyib bo'lish</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => toggleSetting('ghostMode', 'Ghost Mode')}
                      className={cn(
                        "w-12 h-6 rounded-full transition-all relative",
                        settings.ghostMode ? "bg-primary" : "bg-white/10"
                      )}
                    >
                      <motion.div 
                        animate={{ x: settings.ghostMode ? 26 : 4 }}
                        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-lg"
                      />
                    </button>
                  </div>

                  {/* Hidden Zones */}
                  <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                        <Lock className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">Trek yashirish</h4>
                        <p className="text-[10px] text-white/30">Uy/Ish atrofidagi 500m hudud</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => toggleSetting('hiddenZones', 'Trek yashirish')}
                      className={cn(
                        "w-12 h-6 rounded-full transition-all relative",
                        settings.hiddenZones ? "bg-primary" : "bg-white/10"
                      )}
                    >
                      <motion.div 
                        animate={{ x: settings.hiddenZones ? 26 : 4 }}
                        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-lg"
                      />
                    </button>
                  </div>

                  {/* Map Visibility Select */}
                  <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/5 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500">
                        <Globe2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">Xarita ko'rinishi</h4>
                        <p className="text-[10px] text-white/30">Meni kimlar ko'ra oladi?</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {['Hamma', 'Do\'stlar', 'Hech kim'].map((opt, i) => (
                        <button 
                          key={i}
                          onClick={() => {
                            const val = opt === 'Hamma' ? 'all' : opt === 'Do\'stlar' ? 'friends' : 'none';
                            setSettings(s => ({ ...s, mapVisibility: val }));
                            toast.success(`Xaritada ko'rinish: ${opt}`);
                          }}
                          className={cn(
                            "py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border",
                            (settings.mapVisibility === 'all' && opt === 'Hamma') || 
                            (settings.mapVisibility === 'friends' && opt === 'Do\'stlar') ||
                            (settings.mapVisibility === 'none' && opt === 'Hech kim')
                            ? "bg-primary border-primary text-black" 
                            : "bg-white/5 border-white/5 text-white/40"
                          )}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* 4. Ota-ona Nazorati (Parental Control) */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 px-2">
                  <UserCheck className="w-4 h-4 text-primary" />
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40">Ota-ona Nazorati</h3>
                </div>
                <div className="p-6 rounded-[2.5rem] bg-gradient-to-br from-primary/20 to-transparent border border-primary/20 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Link2 className="w-24 h-24 text-primary rotate-12" />
                  </div>
                  <div className="relative z-10 space-y-4">
                    <div>
                      <h4 className="text-lg font-black text-white uppercase tracking-tight">Xavfsiz Havola</h4>
                      <p className="text-[10px] text-white/60 leading-relaxed max-w-[80%]">
                        Ota-onangiz sizni real vaqtda xaritada kuzatib turishlari uchun maxsus havola yarating.
                      </p>
                    </div>
                    
                    {settings.parentalLinkActive ? (
                      <div className="space-y-3">
                        <div className="p-3 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between">
                          <code className="text-[10px] text-primary font-mono truncate mr-4">zonic.uz/track/avazov_7721</code>
                          <button 
                            onClick={() => {
                              if (navigator.share) {
                                navigator.share({
                                  title: 'Zonic - Mening joylashuvim',
                                  text: 'Meni xaritada kuzatib boring',
                                  url: 'https://zonic.uz/track/avazov_7721'
                                }).catch(console.error);
                              } else {
                                navigator.clipboard.writeText('https://zonic.uz/track/avazov_7721');
                                toast.success("Havola nusxalandi");
                              }
                            }}
                            className="p-2 rounded-xl bg-primary text-black"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>
                        <button 
                          onClick={() => toggleSetting('parentalLinkActive', 'Ota-ona nazorati havolasi')}
                          className="w-full py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest"
                        >
                          Havolani o'chirish
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => toggleSetting('parentalLinkActive', 'Ota-ona nazorati havolasi')}
                        className="w-full py-4 rounded-2xl bg-primary text-black text-[11px] font-black uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(204,255,0,0.3)] hover:scale-[1.02] transition-all"
                      >
                        Havola yaratish
                      </button>
                    )}
                  </div>
                </div>
              </section>
                </motion.div>
              )}

              {activeSettingsTab === "Ilova" && (
                <motion.div
                  key="ilova"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
              {/* 6. Ovoz va Bildirishnomalar */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 px-2">
                  <Radio className="w-4 h-4 text-primary" />
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40">Ovoz va Bildirishnomalar</h3>
                </div>
                <div className="space-y-3">
                  {/* Voice Feedback */}
                  <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
                          <Headphones className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">Ovozli yordamchi</h4>
                          <p className="text-[10px] text-white/30">Yugurish paytida ovozli hisobot</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => toggleSetting('voiceFeedback', 'Ovozli yordamchi')}
                        className={cn(
                          "w-12 h-6 rounded-full transition-all relative",
                          settings.voiceFeedback ? "bg-primary" : "bg-white/10"
                        )}
                      >
                        <motion.div 
                          animate={{ x: settings.voiceFeedback ? 26 : 4 }}
                          className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-lg"
                        />
                      </button>
                    </div>
                    {settings.voiceFeedback && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-4 pt-4 border-t border-white/5"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-[10px] uppercase font-black tracking-widest text-white/40">
                            <span>Ovoz balandligi</span>
                            <span>{settings.voiceVolume}%</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <VolumeX className="w-4 h-4 text-white/20" />
                            <input 
                              type="range" 
                              min="0" 
                              max="100" 
                              value={settings.voiceVolume}
                              onChange={(e) => {
                                const val = parseInt(e.target.value);
                                setSettings(prev => ({ ...prev, voiceVolume: val }));
                              }}
                              onMouseUp={() => handleTestVoice("Ovoz balandligi tekshirilmoqda.")}
                              className="flex-1 accent-primary h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
                            />
                            <Volume className="w-4 h-4 text-primary" />
                          </div>
                        </div>

                        <button 
                          onClick={() => {
                            const voices: ('Kore' | 'Puck' | 'Charon' | 'Fenrir' | 'Zephyr')[] = ['Kore', 'Puck', 'Charon', 'Fenrir', 'Zephyr'];
                            const currentIndex = voices.indexOf(voiceType);
                            const nextVoice = voices[(currentIndex + 1) % voices.length];
                            setVoiceType(nextVoice);
                            handleTestVoice("Ovoz turi almashtirildi.", nextVoice);
                          }}
                          disabled={isVoiceTesting}
                          className="w-full py-3 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                        >
                          {isVoiceTesting ? (
                            <RefreshCw className="w-3 h-3 animate-spin" />
                          ) : (
                            <Radio className="w-3 h-3 text-primary" />
                          )}
                          Ovoz turini almashtirish ({voiceType})
                        </button>
                      </motion.div>
                    )}
                  </div>

                  {/* Notification Toggles */}
                  <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/5 space-y-4">
                    {[
                      { key: 'clan', label: 'Jamoaviy xabarlar', icon: <Users className="w-4 h-4" /> },
                      { key: 'achievements', label: 'Yutuqlar va Rekordlar', icon: <Trophy className="w-4 h-4" /> },
                      { key: 'reminders', label: 'Eslatmalar', icon: <Bell className="w-4 h-4" /> },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-white/20">{item.icon}</div>
                          <span className="text-xs font-medium text-white/80">{item.label}</span>
                        </div>
                        <button 
                          onClick={() => {
                            setSettings(s => {
                              const newValue = !s.notifications[item.key as keyof typeof s.notifications];
                              toast.success(`${item.label} ${newValue ? 'yoqildi' : 'o\'chirildi'}`);
                              return { 
                                ...s, 
                                notifications: { ...s.notifications, [item.key]: newValue } 
                              };
                            });
                          }}
                          className={cn(
                            "w-10 h-5 rounded-full transition-all relative",
                            settings.notifications[item.key as keyof typeof settings.notifications] ? "bg-primary" : "bg-white/10"
                          )}
                        >
                          <motion.div 
                            animate={{ x: settings.notifications[item.key as keyof typeof settings.notifications] ? 22 : 4 }}
                            className="absolute top-1 w-3 h-3 rounded-full bg-white"
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* 7. Ilova Sozlamalari */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 px-2">
                  <Smartphone className="w-4 h-4 text-primary" />
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40">Ilova Sozlamalari</h3>
                </div>
                <div className="space-y-3">
                  {/* Units */}
                  <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-white/40">
                          <Activity className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">O'lchov birliklari</h4>
                          <p className="text-[10px] text-white/30">Masofa va Vazn</p>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
                        <button 
                          onClick={() => {
                            setSettings(s => ({ ...s, units: 'km' }));
                            toast.success("O'lchov birligi: KM");
                          }}
                          className={cn("flex-1 py-1.5 rounded-lg text-[9px] font-black transition-all", settings.units === 'km' ? "bg-primary text-black" : "text-white/40")}
                        >
                          KM
                        </button>
                        <button 
                          onClick={() => {
                            setSettings(s => ({ ...s, units: 'mi' }));
                            toast.success("O'lchov birligi: MI");
                          }}
                          className={cn("flex-1 py-1.5 rounded-lg text-[9px] font-black transition-all", settings.units === 'mi' ? "bg-primary text-black" : "text-white/40")}
                        >
                          MI
                        </button>
                      </div>
                      <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
                        <button 
                          onClick={() => {
                            setSettings(s => ({ ...s, weightUnit: 'kg' }));
                            toast.success("Vazn o'lchovi: KG");
                          }}
                          className={cn("flex-1 py-1.5 rounded-lg text-[9px] font-black transition-all", settings.weightUnit === 'kg' ? "bg-primary text-black" : "text-white/40")}
                        >
                          KG
                        </button>
                        <button 
                          onClick={() => {
                            setSettings(s => ({ ...s, weightUnit: 'lb' }));
                            toast.success("Vazn o'lchovi: LB");
                          }}
                          className={cn("flex-1 py-1.5 rounded-lg text-[9px] font-black transition-all", settings.weightUnit === 'lb' ? "bg-primary text-black" : "text-white/40")}
                        >
                          LB
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Language */}
                  <div 
                    onClick={() => setIsLanguageModalOpen(true)}
                    className="p-5 rounded-3xl bg-white/[0.03] border border-white/5 flex items-center justify-between cursor-pointer hover:bg-white/[0.05] transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-white/40">
                        <Languages className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">Til tanlash</h4>
                        <p className="text-[10px] text-white/30">Ilova tili</p>
                      </div>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                      <span className="text-[10px] font-black text-white uppercase">
                        {settings.language === 'uz' ? "O'zbekcha" : settings.language === 'en' ? "English" : "Русский"}
                      </span>
                      <ChevronRight className="w-3 h-3 text-white/20" />
                    </button>
                  </div>

                  {/* Clear Cache */}
                  <button 
                    onClick={handleClearCache}
                    className="w-full p-5 rounded-3xl bg-white/[0.03] border border-white/5 flex items-center justify-between group hover:bg-red-500/5 hover:border-red-500/20 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 group-hover:text-red-500 transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <h4 className="text-sm font-bold text-white">Keshni tozalash</h4>
                        <p className="text-[10px] text-white/30">42.5 MB ishlatilmoqda</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/20" />
                  </button>
                </div>
              </section>

              {/* 8. Yordam va Huquqiy */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 px-2">
                  <Info className="w-4 h-4 text-primary" />
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40">Yordam va Huquqiy</h3>
                </div>
                <div className="space-y-2">
                  {[
                    { label: "FAQ / Ko'p beriladigan savollar", icon: <MessageSquare className="w-4 h-4" />, type: 'faq' },
                    { label: "Qo'llab-quvvatlash bilan bog'lanish", icon: <Headphones className="w-4 h-4" />, type: 'support' },
                    { label: "Foydalanish shartlari", icon: <Shield className="w-4 h-4" />, type: 'terms' },
                    { label: "Maxfiylik siyosati", icon: <Lock className="w-4 h-4" />, type: 'privacy' },
                    { label: "Ma'lumotlarni eksport qilish (JSON)", icon: <Share2 className="w-4 h-4" />, type: 'export' },
                  ].map((item, i) => (
                    <button 
                      key={i} 
                      onClick={() => {
                        if (item.type === 'support') {
                          toast.success("Qo'llab-quvvatlash xizmatiga ulanmoqda...");
                        } else if (item.type === 'export') {
                          handleExportData();
                        } else {
                          setLegalContent({ title: item.label, type: item.type });
                        }
                      }}
                      className="w-full p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between group hover:bg-white/[0.05] transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-white/20 group-hover:text-primary transition-colors">{item.icon}</div>
                        <span className="text-[11px] font-medium text-white/60 group-hover:text-white transition-colors">{item.label}</span>
                      </div>
                      <ChevronRight className="w-3 h-3 text-white/10" />
                    </button>
                  ))}
                </div>
              </section>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button 
                  onClick={() => {
                    toast.success("Akkauntdan chiqildi");
                    navigate('/login');
                  }}
                  className="w-full py-5 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center justify-center gap-3 group hover:bg-white/10 transition-all"
                >
                  <Lock className="w-4 h-4 text-white/40 group-hover:text-white" />
                  <span className="text-xs font-black uppercase tracking-[0.3em] text-white/40 group-hover:text-white">Akkauntdan chiqish</span>
                </button>
                
                <button 
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="w-full py-5 rounded-[2.5rem] bg-red-500/5 border border-red-500/10 flex items-center justify-center gap-3 group hover:bg-red-500 transition-all"
                >
                  <Trash2 className="w-4 h-4 text-red-500 group-hover:text-white" />
                  <span className="text-xs font-black uppercase tracking-[0.3em] text-red-500 group-hover:text-white">Hisobni o'chirish</span>
                </button>
              </div>
                </motion.div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notifications Panel */}
      <AnimatePresence mode="wait">
        {isNotificationsOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNotificationsOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 bottom-0 w-[85%] bg-[#0A0A0A] border-l border-white/10 z-[101] shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black uppercase tracking-tight">Bildirishnomalar</h2>
                  <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Sizda 3 ta yangi xabar bor</p>
                </div>
                <button 
                  onClick={() => setIsNotificationsOpen(false)}
                  className="p-2 rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <AnimatePresence>
                  {notifications.map((notif) => (
                    <motion.div 
                      key={notif.id}
                      initial={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      layout
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      onDragEnd={(_, info) => {
                        if (Math.abs(info.offset.x) > 60) {
                          setNotifications(prev => prev.filter(n => n.id !== notif.id));
                          toast("Bildirishnoma o'chirildi", { icon: '🗑️' });
                        }
                      }}
                      className="p-4 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors group cursor-grab active:cursor-grabbing"
                    >
                      <div className="flex gap-4">
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border shrink-0", notif.color)}>
                          {notif.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="text-[11px] font-black uppercase tracking-tight text-white/90">{notif.title}</h3>
                            <span className="text-[8px] font-bold text-white/20 uppercase">{notif.time}</span>
                          </div>
                          <p className="text-[10px] text-white/40 leading-relaxed mb-3">{notif.desc}</p>
                          
                          {notif.actions && (
                            <div className="flex gap-2">
                              <button className="px-4 py-1.5 rounded-lg bg-primary text-black text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-transform">
                                Qabul qilish
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="p-6 border-t border-white/5">
                <button className="w-full py-3 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors">
                  Barcha xabarlarni o'chirish
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Profile Header Section (Compact Premium) */}
      <motion.div 
        animate={{ 
          marginTop: isHeaderCollapsed ? -144 : 0,
          opacity: isHeaderCollapsed ? 0 : 1
        }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative h-36 w-full overflow-hidden cursor-pointer select-none shrink-0"
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onMouseLeave={handlePressEnd}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
        onClick={handleHeaderClick}
      >
        {/* Background Cover with Overlay */}
        <div className="absolute inset-0">
          <motion.img 
            animate={{ 
              scale: isPressing ? 1.05 : 1,
              filter: isHeaderHidden ? "blur(0px)" : "blur(0px)" // Placeholder for logic
            }}
            src={userData.cover} 
            alt="Cover" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          
          {/* Overlays */}
          <motion.div 
            animate={{ opacity: isHeaderHidden ? 0 : 0.6 }}
            className="absolute inset-0 bg-black backdrop-blur-[2px]" 
          />
          <motion.div 
            animate={{ opacity: isHeaderHidden ? 0 : 1 }}
            className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" 
          />

          {/* Press Progress Indicator (Premium Glow) */}
          <AnimatePresence>
            {isPressing && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 border-4 border-primary/30 shadow-[inset_0_0_50px_rgba(204,255,0,0.2)]"
              >
                <motion.div 
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2, ease: "linear" }}
                  className="absolute bottom-0 left-0 h-1 bg-primary shadow-[0_0_8px_rgba(204,255,0,0.8)]"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Header Content */}
        <div className="relative h-full px-6 flex items-center z-10">
          <motion.div 
            animate={{ 
              opacity: isHeaderHidden ? 0 : 1,
              y: isHeaderHidden ? 20 : 0,
              scale: isHeaderHidden ? 0.9 : 1
            }}
            transition={{ type: "spring", damping: 20 }}
            className="flex items-center gap-5"
          >
            {/* Avatar with Neon Glow */}
            <div className="relative group">
              <div 
                className="w-20 h-20 rounded-full border-[3px] border-primary shadow-[0_0_20px_rgba(204,255,0,0.3)] overflow-hidden cursor-pointer relative"
                onClick={(e) => { e.stopPropagation(); setIsEditProfileOpen(true); }}
              >
                <img 
                  src={userData.avatar} 
                  alt="Profile" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Plus className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary border-[3px] border-[#0A0A0A] flex items-center justify-center text-[9px] font-black text-black shadow-xl">
                45
              </div>
            </div>

            {/* Info */}
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black uppercase tracking-tight text-white">
                  {userData.name}
                </h1>
              </div>
              <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
                {userData.location}
              </p>
              {userData.bio && (
                <p className="text-[9px] text-white/60 font-medium tracking-wide mt-0.5">
                  {userData.bio}
                </p>
              )}
            </div>
          </motion.div>

          {/* Action Buttons - Top Right (Always Visible) */}
          <div className="absolute top-[11px] right-6 flex items-center gap-2">
            <button 
              onClick={(e) => { e.stopPropagation(); setIsProfileSettingsOpen(true); }}
              className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all active:scale-90"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); setIsNotificationsOpen(true); }}
              className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all relative active:scale-90"
            >
              <Bell className="w-4 h-4" />
              <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full border border-[#0A0A0A]" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); navigate("/map"); }}
              className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all active:scale-90"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Badge - Bottom Right */}
          {userData.badge && (() => {
            const badgeAchievement = [
              ...TERRITORY_ACHIEVEMENTS,
              ...DISTANCE_ACHIEVEMENTS,
              ...STREAK_ACHIEVEMENTS,
              ...MARATHON_ACHIEVEMENTS
            ].find(a => a.id === userData.badge);
            
            return badgeAchievement ? (
              <motion.div 
                animate={{ opacity: isHeaderHidden ? 0 : 1 }}
                className="absolute bottom-4 right-4 flex flex-col items-center justify-center gap-0.5" 
                title={badgeAchievement.title}
              >
                {React.cloneElement(badgeAchievement.icon as React.ReactElement, { 
                  className: "w-9 h-9 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" 
                })}
                <span className="text-[7px] font-black uppercase tracking-widest text-white/60 bg-black/40 px-1.5 py-0.5 rounded-full backdrop-blur-sm border border-white/10">
                  {badgeAchievement.title}
                </span>
              </motion.div>
            ) : null;
          })()}
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex px-6 border-b border-white/5 bg-surface/20 backdrop-blur-md overflow-x-auto no-scrollbar">
        {["Umumiy", "Yutuqlar", "Maqsadlar", "Faoliyat"].map((tab) => (
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
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#CCFF00] shadow-[0_0_8px_rgba(204,255,0,0.6)]"
              />
            )}
          </button>
        ))}
      </div>

      {/* Scrollable Content */}
      <div 
        className="flex-1 overflow-y-auto no-scrollbar pb-10"
        onScroll={handleScroll}
      >
        <AnimatePresence mode="wait">
          {activeTab === "Umumiy" && (
            <motion.div
              key="umumiy"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Main Stats Panel - VAR 04: Smoked Obsidian */}
              <section className="px-4 mb-6 pt-5">
                <div className="relative overflow-hidden bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-[24px] border border-white/5 py-5 px-4 shadow-2xl group active:scale-[0.98] transition-transform">
                  {/* Diagonal Lens Refraction Effect */}
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-transparent via-white/5 to-transparent -rotate-45 -translate-x-1/2 pointer-events-none group-hover:translate-x-[20%] transition-transform duration-1000 ease-out" />
                  
                  <div className="grid grid-cols-3 relative z-10">
                    {STATS_CARDS.map((card, idx) => (
                      <div 
                        key={card.id} 
                        className={cn(
                          "flex flex-col items-center justify-center text-center",
                          idx !== 0 && "border-l border-white/5"
                        )}
                      >
                        <div className="flex flex-col items-center">
                          <span 
                            className="text-[22px] font-display-metrics font-extrabold tracking-tighter leading-none mb-1.5"
                            style={{ 
                              color: card.id === 'distance' ? '#FFFFFF' : card.color,
                              textShadow: card.id !== 'distance' ? `0 0 20px ${card.color}40` : 'none'
                             }}
                          >
                            {card.value}
                          </span>
                          <span className="text-[9px] font-label-caps font-black text-white/40 uppercase tracking-[0.2em]">
                            {card.id === 'distance' ? 'KM' : card.id === 'pace' ? 'TEMP' : 'PULS'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Top Glossy Highlight */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  {/* Bottom Shadow Reveal */}
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/[0.02] rounded-full blur-3xl pointer-events-none group-hover:bg-white/[0.05] transition-colors" />
                </div>
              </section>

        {/* --- ORIGINAL CHART BACKUP ---
        <section className="px-4 mb-6">
          <div className="p-6 rounded-[32px] bg-white/[0.02] border border-white/5 relative overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <motion.div
                key={currentChart.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h2 className="text-sm font-black uppercase tracking-tight">{currentChart.title}</h2>
                <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest">{currentChart.subtitle}</p>
              </motion.div>
              <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                <Activity className="w-2.5 h-2.5 text-[#CCFF00]" />
                <span className="text-[8px] font-black text-white/60 uppercase">Wave Sync</span>
              </div>
            </div>

            <div className="relative h-40 w-full px-2">
              <motion.div 
                key={currentChart.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -50 && activeChartIndex < dynamicChartData.length - 1) {
                    setActiveChartIndex(prev => prev + 1);
                    setSelectedBarIndex(null);
                  } else if (info.offset.x > 50 && activeChartIndex > 0) {
                    setActiveChartIndex(prev => prev - 1);
                    setSelectedBarIndex(null);
                  }
                }}
                className="flex items-end justify-between h-full gap-0 relative cursor-grab active:cursor-grabbing"
              >
                {currentChart.data.map((item, i) => (
                  <div 
                    key={`chart-bar-${i}`} 
                    className="flex-1 flex flex-col items-center group relative h-full justify-end"
                    onMouseEnter={() => setHoveredBar(i)}
                    onMouseLeave={() => setHoveredBar(null)}
                    onClick={() => setSelectedBarIndex(selectedBarIndex === i ? null : i)}
                  >
                    <AnimatePresence>
                      {(hoveredBar === i || selectedBarIndex === i || item.highlighted) && (
                        <motion.div 
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: -15 }}
                          exit={{ opacity: 0, y: -5 }}
                          className={cn(
                            "absolute top-0 text-[9px] font-black px-2 py-1 rounded-md z-20 whitespace-nowrap transition-colors duration-300",
                            item.highlighted 
                              ? "bg-[#CCFF00] text-black shadow-[0_0_8px_rgba(204,255,0,0.4)]" 
                              : "bg-white text-black shadow-[0_0_8px_rgba(255,255,255,0.2)]"
                          )}
                        >
                          {item.badge || `${item.value} km`}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${item.value}%` }}
                      transition={{ duration: 1, ease: [0.4, 0, 0.2, 1], delay: i * (0.5 / currentChart.data.length) }}
                      className={cn(
                        "w-full relative transition-all duration-500",
                        item.highlighted 
                          ? "bg-gradient-to-t from-[#CCFF00]/40 to-[#CCFF00]/80" 
                          : (selectedBarIndex === i || hoveredBar === i)
                            ? "bg-gradient-to-t from-white/20 to-white/30"
                            : "bg-gradient-to-t from-white/5 to-white/10"
                      )}
                    >
                      <div className={cn(
                        "absolute top-0 left-0 right-0 h-[2px] shadow-[0_0_10px_rgba(204,255,0,0.5)]",
                        item.highlighted 
                          ? "bg-[#CCFF00]" 
                          : (selectedBarIndex === i || hoveredBar === i) 
                            ? "bg-white/60" 
                            : "bg-white/40"
                      )} />
                      
                      <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
                        <div className="w-full h-full bg-[radial-gradient(circle,white_1px,transparent_1px)] bg-[size:4px_4px]" />
                      </div>
                    </motion.div>

                    <span className={cn(
                      "absolute -bottom-6 text-[8px] font-bold uppercase tracking-widest transition-colors",
                      item.highlighted || selectedBarIndex === i ? "text-[#CCFF00]" : "text-white/30"
                    )}>{item.label}</span>
                  </div>
                ))}

                <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <motion.path
                    key={currentChart.id}
                    d={currentChart.data.map((item, i) => {
                      const x = (i / (currentChart.data.length - 1)) * 100;
                      const y = 100 - item.value;
                      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke="#CCFF00"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.3 }}
                    transition={{ duration: 2, delay: 0.5 }}
                  />
                </svg>
              </motion.div>
            </div>

            <div className="flex justify-center gap-1.5 mt-10">
              {dynamicChartData.map((_, i) => (
                <div 
                  key={i}
                  className={cn(
                    "h-1 rounded-full transition-all duration-300",
                    activeChartIndex === i ? "w-4 bg-[#CCFF00]" : "w-1 bg-white/10"
                  )}
                />
              ))}
            </div>
          </div>
        </section>
        -------------------------------- */}

        {/* NEW DYNAMIC CHART SECTION */}
        <section className="px-4 mb-6">
          {/* Segmented Control */}
          <div className="flex bg-white/5 p-1 rounded-2xl mb-4">
            {(["KM", "HUDUD", "QADAM"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActivityTab(tab)}
                className={cn(
                  "flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                  activityTab === tab ? "bg-[#CCFF00] text-black shadow-[0_0_15px_rgba(204,255,0,0.3)]" : "text-white/40 hover:text-white"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-6 rounded-[32px] bg-white/[0.02] border border-white/5 relative overflow-hidden min-h-[280px]">
            <AnimatePresence mode="wait">
              {/* KM (Free Route) Chart */}
              {activityTab === "KM" && (
                <motion.div
                  key="km"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="w-full"
                >
                  <div className="flex items-center justify-between mb-4">
                    <motion.div
                      key={currentChart.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <h2 className="text-sm font-black uppercase tracking-tight">{currentChart.title}</h2>
                      <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest">{currentChart.subtitle}</p>
                    </motion.div>
                    <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                      <Activity className="w-2.5 h-2.5 text-[#CCFF00]" />
                      <span className="text-[8px] font-black text-white/60 uppercase">Wave Sync</span>
                    </div>
                  </div>

                  <div className={cn(
                    "relative h-60 w-full hide-scrollbar",
                    currentChart.id === "monthly" ? "overflow-hidden" : "overflow-x-auto snap-x snap-mandatory"
                  )}>
                    <motion.div 
                      key={currentChart.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.1}
                      onDragEnd={(_, info) => {
                        const threshold = 50;
                        if (info.offset.x < -threshold && activeChartIndex < dynamicChartData.length - 1) {
                          setActiveChartIndex(prev => prev + 1);
                          setSelectedBarIndex(null);
                        } else if (info.offset.x > threshold && activeChartIndex > 0) {
                          setActiveChartIndex(prev => prev - 1);
                          setSelectedBarIndex(null);
                        }
                      }}
                      className={cn(
                        "flex items-end h-full relative pb-8 pt-8 cursor-grab active:cursor-grabbing",
                        currentChart.id === "monthly" ? "w-full gap-0 px-2" :
                        (currentChart.data.length > 12 ? "w-max gap-4 px-4" : "w-full justify-between")
                      )}
                    >
                      {currentChart.data.map((item, i) => {
                        const isMonthly = currentChart.id === "monthly";
                        const isWeekly = currentChart.id === "weekly";
                        
                        // We scale the values so that the maximum value in the dataset
                        // corresponds to the MAX_VISUAL_HEIGHT.
                        const maxDataValue = Math.max(...currentChart.data.map(d => d.value));
                        
                        // Default for Monthly/Yearly (as requested to keep at 110 even if it overflows)
                        let MAX_VISUAL_HEIGHT = 110;
                        let badgeOffsetAtMax = -15;
                        let badgeOffsetNormal = -20;

                        if (isWeekly) {
                          // For Weekly: 5px gap from top to badge, 5px gap from badge to bar
                          // Container is 240px. 32px reserved from top (5px gap + ~22px badge + 5px gap)
                          MAX_VISUAL_HEIGHT = 87; 
                          badgeOffsetAtMax = -5;
                          badgeOffsetNormal = -15;
                        }
                        
                        // Calculate the scaled height.
                        let visualHeight = 0;
                        if (maxDataValue > 0) {
                           visualHeight = (item.value / maxDataValue) * MAX_VISUAL_HEIGHT;
                        }
                        
                        // Check if this specific bar is the maximum one
                        const isMaxHeight = visualHeight >= MAX_VISUAL_HEIGHT - 1;
                        
                        // Badge offset: defined above based on chart type
                        const badgeOffset = isMaxHeight ? badgeOffsetAtMax : badgeOffsetNormal;

                        return (
                          <div 
                            key={`chart-bar-${i}`} 
                            className={cn(
                              "flex flex-col items-center group relative h-full justify-end shrink-0",
                              isMonthly 
                                ? "px-[1px]" 
                                : (currentChart.data.length > 12 ? "w-10 snap-center" : "flex-1 mx-1 snap-center")
                            )}
                            style={isMonthly ? { flex: item.isFuture ? 1 : 8 } : undefined}
                            onMouseEnter={() => setHoveredBar(i)}
                            onMouseLeave={() => setHoveredBar(null)}
                            onClick={() => setSelectedBarIndex(selectedBarIndex === i ? null : i)}
                          >
                            <motion.div 
                              initial={{ height: 0 }}
                              animate={{ height: isMonthly && item.isFuture ? '4px' : `${visualHeight}%` }}
                              transition={{ duration: 1, ease: [0.4, 0, 0.2, 1], delay: i * (0.5 / currentChart.data.length) }}
                              className={cn(
                                "w-full relative transition-all duration-500",
                                isMonthly && item.isFuture
                                  ? "bg-white/5 rounded-sm"
                                  : item.highlighted 
                                    ? "bg-gradient-to-t from-[#CCFF00]/40 to-[#CCFF00]/80" 
                                    : (selectedBarIndex === i || hoveredBar === i)
                                      ? "bg-gradient-to-t from-white/20 to-white/30"
                                      : "bg-gradient-to-t from-white/5 to-white/10"
                              )}
                            >
                              <AnimatePresence>
                                {(hoveredBar === i || selectedBarIndex === i || item.highlighted) && !(isMonthly && item.isFuture) && (
                                  <motion.div 
                                    initial={{ opacity: 0, y: 0 }}
                                    animate={{ opacity: 1, y: badgeOffset }}
                                    exit={{ opacity: 0, y: 0 }}
                                    className={cn(
                                      "absolute bottom-full left-1/2 -translate-x-1/2 text-[9px] font-black px-2 py-1 rounded-md z-20 whitespace-nowrap transition-all duration-300",
                                      item.highlighted 
                                        ? "bg-[#CCFF00] text-black shadow-[0_0_8px_rgba(204,255,0,0.4)]" 
                                        : "bg-white text-black shadow-[0_0_8px_rgba(255,255,255,0.2)]"
                                    )}
                                  >
                                    {item.badge || `${item.value} km`}
                                  </motion.div>
                                )}
                              </AnimatePresence>

                              {!(isMonthly && item.isFuture) && (
                                <>
                                  <div className={cn(
                                    "absolute top-0 left-0 right-0 h-[2px] shadow-[0_0_10px_rgba(204,255,0,0.5)]",
                                    item.highlighted 
                                      ? "bg-[#CCFF00]" 
                                      : (selectedBarIndex === i || hoveredBar === i) 
                                        ? "bg-white/60" 
                                        : "bg-white/40"
                                  )} />
                                  
                                  <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
                                    <div className="w-full h-full bg-[radial-gradient(circle,white_1px,transparent_1px)] bg-[size:4px_4px]" />
                                  </div>
                                </>
                              )}
                            </motion.div>

                            <span className={cn(
                              "absolute -bottom-6 text-[8px] font-bold uppercase tracking-widest transition-colors",
                              item.highlighted || selectedBarIndex === i ? "text-white" : "text-white/30",
                              isMonthly && item.isFuture ? "opacity-30" : ""
                            )}>
                              {(!isMonthly || item.highlighted || (i + 1) === 1 || (i + 1) % 5 === 0 || (i + 1) === currentChart.data.length) ? item.label : ""}
                            </span>
                          </div>
                        );
                      })}

                      <svg 
                        className="absolute pointer-events-none overflow-visible" 
                        style={{ 
                          top: '32px',
                          left: currentChart.id === 'monthly' ? '8px' : (currentChart.data.length > 12 ? '36px' : `calc(50% / ${currentChart.data.length})`), 
                          width: currentChart.id === 'monthly' ? 'calc(100% - 16px)' : (currentChart.data.length > 12 ? 'calc(100% - 72px)' : `calc(100% - 100% / ${currentChart.data.length})`),
                          height: 'calc(100% - 64px)'
                        }} 
                        viewBox="0 0 100 100" 
                        preserveAspectRatio="none"
                      >
                        <motion.path
                          key={currentChart.id}
                          d={currentChart.data.map((item, i) => {
                            let x;
                            const isMonthly = currentChart.id === 'monthly';
                            const isWeekly = currentChart.id === 'weekly';
                            const MAX_VISUAL_HEIGHT = isWeekly ? 87 : 110;
                            const maxDataValue = Math.max(...currentChart.data.map(d => d.value));

                            if (isMonthly) {
                              const totalFlex = currentChart.data.reduce((sum, d) => sum + (d.isFuture ? 1 : 8), 0);
                              let accumulated = 0;
                              for(let j=0; j<i; j++) accumulated += (currentChart.data[j].isFuture ? 1 : 8);
                              const currentFlex = item.isFuture ? 1 : 8;
                              x = ((accumulated + currentFlex / 2) / totalFlex) * 100;
                            } else {
                              x = (i / (currentChart.data.length - 1)) * 100;
                            }
                            
                            let visualHeight = 0;
                            if (maxDataValue > 0) {
                               visualHeight = (item.value / maxDataValue) * MAX_VISUAL_HEIGHT;
                            }
                            
                            const y = 100 - (isMonthly && item.isFuture ? 0 : visualHeight);
                            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                          }).join(' ')}
                          fill="none"
                          stroke="#CCFF00"
                          strokeWidth="1"
                          strokeDasharray="4 4"
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 1, opacity: 0.3 }}
                          transition={{ duration: 2, delay: 0.5 }}
                        />
                      </svg>
                    </motion.div>
                  </div>

                  {/* ORIGINAL:
                  <div className="flex justify-center gap-1.5 mt-4">
                    {dynamicChartData.map((_, i) => (
                      <button 
                        key={i}
                        onClick={() => {
                          setActiveChartIndex(i);
                          setSelectedBarIndex(null);
                        }}
                        className={cn(
                          "h-1 rounded-full transition-all duration-300",
                          activeChartIndex === i ? "w-4 bg-[#CCFF00]" : "w-1 bg-white/10 hover:bg-white/30"
                        )}
                      />
                    ))}
                  </div>
                  */}
                  <div className="flex justify-center gap-4 mt-4">
                    {dynamicChartData.map((chart, i) => (
                      <button 
                        key={i}
                        onClick={() => {
                          setActiveChartIndex(i);
                          setSelectedBarIndex(null);
                        }}
                        className={cn(
                          "text-[10px] font-black uppercase tracking-widest transition-colors duration-300",
                          activeChartIndex === i ? "text-[#CCFF00]" : "text-white/30 hover:text-white/50"
                        )}
                      >
                        {chart.title.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* HUDUD (Territory) Chart */}
              {activityTab === "HUDUD" && (
                <motion.div
                  key="globe"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className="w-full flex flex-col items-center"
                >
                  <div className="w-full flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-sm font-black uppercase tracking-tight text-indigo-400">Global Conquest</h2>
                      <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest">Global qamrov: 12.4%</p>
                    </div>
                    {/* Time Filters instead of Tactical Sphere Badge */}
                    <div className="flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/10">
                      {["Hafta", "Oy", "Yil"].map((filterName, index) => (
                        <button
                          key={filterName}
                          onClick={() => setActiveChartIndex(index)}
                          className={cn(
                            "px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-full transition-all",
                            activeChartIndex === index 
                              ? "bg-indigo-500 text-white shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
                              : "text-white/40 hover:text-white"
                          )}
                        >
                          {filterName}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Weekly Progress Radial with Tactical Globe in center */}
                  <div className="relative w-full mt-4 h-64 overflow-hidden flex justify-center">
                    {/* Inner wrapper with fixed dimensions to guarantee perfect alignment, scaled for small screens */}
                    <div className="relative w-[340px] h-64 shrink-0 scale-[0.85] min-[380px]:scale-[0.95] sm:scale-100 origin-top">
                      {/* Entire assembly shifted up to crop unnecessary whitespace */}
                      <div className="absolute inset-0 transform -translate-y-[95px] w-full h-full">
                        {/* Centered Tactical Globe placed precisely to fit pie hole (R=88px / Size=176px) */}
                        {/* Since pie innerRadius is 93, size 176 leaves exactly 5px gap from all sides */}
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-0">
                          <TacticalGlobe data={currentChart.data} size={176} />
                        </div>
                        
                        {/* Weekly Progress Front (z-index 10) */}
                        <div className="absolute inset-0 z-10">
                          {(() => {
                             let mode: "hafta" | "oy" | "yil" = "hafta";
                             let chartVals = [30, 45, 60, 55, 85, 95, 40]; // default hafta
                             
                             if (activeChartIndex === 1) {
                               mode = "oy";
                               chartVals = [50, 75, 45, 90, 60]; // 5 haftalik ko'rsatkich (Oyni haftalarga bo'lamiz)
                             } else if (activeChartIndex === 2) {
                               mode = "yil";
                               chartVals = [30, 45, 60, 50, 80, 95, 40, 55, 75, 85, 60, 90]; // 12 oylik ko'rsatkich
                             }
                             
                             return <WeeklyProgress data={chartVals} mode={mode} />;
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>


                </motion.div>
              )}

              {/* QADAM (Steps) Chart */}
              {activityTab === "QADAM" && (
                <motion.div
                  key="qadam"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="w-full flex flex-col h-[300px]"
                >
                  {/* ORIGINAL: className="w-full flex flex-col h-[340px]" */}
                  {/* ORIGINAL: <div className="flex items-center justify-between h-[60px] shrink-0"> */}
                  {/* Header - 48px (Moslashtirilgan) */}
                  <div className="flex items-center justify-between h-[48px] shrink-0">
                    <div>
                      <h2 className="text-sm font-black uppercase tracking-tight">Qadamlar</h2>
                      <p className="text-[9px] text-[#FF0055] font-bold uppercase tracking-widest">Maqsad: {stepGoal.toLocaleString()} qadam</p>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                      <Target className="w-2.5 h-2.5 text-[#FF0055]" />
                      <span className="text-[8px] font-black text-white/60 uppercase">Goal Track</span>
                    </div>
                  </div>

                  {/* Grafik joylashgan joy - qolgan barcha balandlik (flex-1) */}
                  <div className="relative flex-1 w-full" ref={qadamChartRef}>
                    {/* Interactive Goal Line */}
                    <motion.div 
                      className="absolute left-2 right-2 z-20 cursor-ns-resize flex items-center justify-end touch-none"
                      style={{ bottom: `${(stepGoal / 25000) * 100}%`, height: '24px', marginBottom: '-12px' }}
                      onPanStart={() => {
                        if (navigator.vibrate) navigator.vibrate(50);
                      }}
                      onPan={(e, info) => {
                        if (!qadamChartRef.current) return;
                        const rect = qadamChartRef.current.getBoundingClientRect();
                        let y = info.point.y - rect.top;
                        y = Math.max(0, Math.min(y, rect.height));
                        const percent = (rect.height - y) / rect.height;
                        setStepGoal(Math.round(percent * 25000));
                      }}
                    >
                      <div className="absolute left-0 right-0 border-t-2 border-dashed border-[#FF0055] opacity-60 pointer-events-none" />
                      <div className="relative bg-[#FF0055] text-white text-[9px] font-black px-2 py-1 rounded-md shadow-[0_0_10px_rgba(255,0,85,0.5)]">
                        {Math.round(stepGoal / 1000)}K
                      </div>
                    </motion.div>

                    <div className={cn(
                      "relative h-full w-full hide-scrollbar",
                      currentChart.id === "monthly" ? "overflow-hidden" : "overflow-x-auto snap-x snap-mandatory"
                    )}>
                      <motion.div 
                        key={currentChart.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.1}
                        onDragEnd={(_, info) => {
                          const threshold = 50;
                          if (info.offset.x < -threshold && activeChartIndex < dynamicChartData.length - 1) {
                            setActiveChartIndex(prev => prev + 1);
                            setSelectedBarIndex(null);
                          } else if (info.offset.x > threshold && activeChartIndex > 0) {
                            setActiveChartIndex(prev => prev - 1);
                            setSelectedBarIndex(null);
                          }
                        }}
                        className={cn(
                          "flex items-end h-full relative cursor-grab active:cursor-grabbing pb-[24px] pt-[48px]",
                          currentChart.id === "monthly" ? "w-full gap-0 px-2" :
                          (currentChart.data.length > 12 ? "w-max gap-4 px-4" : "w-full justify-between px-2")
                        )}
                      >
                        {/* ORIGINAL: className={cn("flex items-end h-full relative cursor-grab active:cursor-grabbing", ...)} */}
                        {/* 16px tepadan, 8px pastdan qisqartirildi (umumiy 24px) */}
                        {currentChart.data.map((item, i) => {
                          const isMonthly = currentChart.id === "monthly";
                          // Map value (0-100) to steps (0 - 20000)
                          const steps = Math.floor((item.value / 100) * 20000);
                          const isGoalReached = steps >= stepGoal;
                          const heightPercent = Math.min(100, (steps / 25000) * 100);

                          return (
                            <div 
                              key={`step-bar-${i}`} 
                              className={cn(
                                "flex flex-col items-center group relative h-full justify-end z-10 shrink-0",
                                isMonthly 
                                  ? "px-[1px]" 
                                  : (currentChart.data.length > 12 ? "w-10 snap-center" : "flex-1 mx-1 snap-center")
                              )}
                              style={isMonthly ? { flex: item.isFuture ? 1 : 8 } : undefined}
                              onClick={() => setSelectedBarIndex(selectedBarIndex === i ? null : i)}
                              onMouseEnter={() => setHoveredBar(i)}
                              onMouseLeave={() => setHoveredBar(null)}
                            >
                              <AnimatePresence>
                                {(selectedBarIndex === i || hoveredBar === i || item.highlighted) && !item.isFuture && (
                                  <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.8 }}
                                    className="absolute z-50 bg-[#FF0055] text-white text-[10px] font-black px-2 py-1 rounded-md shadow-[0_0_15px_rgba(255,0,85,0.6)] whitespace-nowrap pointer-events-none"
                                    style={{ bottom: `calc(${heightPercent}% + 8px)` }}
                                  >
                                    {steps.toLocaleString()}
                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#FF0055]" />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                              {isGoalReached && !item.isFuture && (
                                <motion.div 
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ delay: i * 0.05 + 0.2, type: "spring" }}
                                  className="absolute text-white z-40 drop-shadow-md"
                                  style={{ bottom: `calc(${heightPercent}% - 14px)` }}
                                >
                                  <Star className="w-3 h-3 fill-current" />
                                </motion.div>
                              )}
                              <motion.div 
                                initial={{ height: 0 }}
                                animate={{ height: isMonthly && item.isFuture ? '4px' : `${heightPercent}%` }}
                                transition={{ duration: 1, ease: "easeOut", delay: i * 0.05 }}
                                className={cn(
                                  "rounded-t-sm absolute bottom-0 transition-all duration-500",
                                  isMonthly ? "w-full" : "w-5",
                                  isMonthly && item.isFuture
                                    ? "bg-white/5"
                                    : isGoalReached || item.highlighted 
                                      ? "bg-gradient-to-t from-[#FF0055]/40 to-[#FF0055] shadow-[0_0_15px_rgba(255,0,85,0.4)]" 
                                      : selectedBarIndex === i || hoveredBar === i
                                        ? "bg-gradient-to-t from-white/30 to-white/50"
                                        : "bg-gradient-to-t from-white/10 to-white/20"
                                )}
                              />
                              <span className={cn(
                                "absolute bottom-2 text-[8px] font-bold uppercase tracking-widest transition-colors z-20 drop-shadow-md",
                                item.highlighted ? "text-white" : "text-white/50",
                                isMonthly && item.isFuture ? "opacity-30" : ""
                              )}>
                                {(!isMonthly || item.highlighted || (i + 1) === 1 || (i + 1) % 5 === 0 || (i + 1) === currentChart.data.length) ? item.label : ""}
                              </span>
                            </div>
                          );
                        })}
                      </motion.div>
                    </div>
                  </div>

                  {/* Footer - 20px */}
                  <div className="flex justify-center items-center h-[20px] shrink-0">
                    {/* ORIGINAL:
                    <div className="flex gap-1.5">
                      {dynamicChartData.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setActiveChartIndex(i);
                            setSelectedBarIndex(null);
                          }}
                          className={cn(
                            "h-1 rounded-full transition-all duration-300",
                            activeChartIndex === i ? "w-4 bg-[#FF0055]" : "w-1 bg-white/10 hover:bg-white/30"
                          )}
                        />
                      ))}
                    </div>
                    */}
                    <div className="flex gap-4">
                      {dynamicChartData.map((chart, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setActiveChartIndex(i);
                            setSelectedBarIndex(null);
                          }}
                          className={cn(
                            "text-[10px] font-black uppercase tracking-widest transition-colors duration-300",
                            activeChartIndex === i ? "text-[#FF0055]" : "text-white/30 hover:text-white/50"
                          )}
                        >
                          {chart.title.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Personal Bests Grid */}
        <section className="px-6 mb-8">
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white/40 mb-4 px-2">Shaxsiy Rekordlar</h2>
          <div className="grid grid-cols-3 gap-3">
            {PERSONAL_BESTS.map((pb) => (
              <div key={pb.label} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-center">
                <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest mb-1">{pb.label}</p>
                <p className="text-sm font-black text-white mb-1">{pb.value}</p>
                <p className="text-[7px] font-medium text-primary/60 uppercase">{pb.date}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Cyber Activity / Heatmap Preview */}
        <section className="px-6 mb-8">
          <div className="p-6 rounded-[32px] bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div>
                <h2 className="text-lg font-black uppercase tracking-tight text-primary">Hududiy Faollik</h2>
                <p className="text-[10px] text-primary/40 font-bold uppercase tracking-widest">Dominantlik: 68%</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                <Shield className="w-6 h-6 text-primary" />
              </div>
            </div>
            
            {/* Simulated Heatmap Dots */}
            <div className="flex gap-1 mb-4 relative z-10">
              {Array.from({ length: 24 }).map((_, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "w-2 h-2 rounded-full",
                    Math.random() > 0.6 ? "bg-primary shadow-[0_0_8px_rgba(204,255,0,0.6)]" : "bg-white/5"
                  )} 
                />
              ))}
            </div>

            <p className="text-[10px] font-medium text-white/40 relative z-10 leading-relaxed">
              Siz Yunusobod tumanida eng faol sportchisiz. Hududingizni himoya qilish uchun yana 2.4 km yuguring.
            </p>
            
            {/* Decorative background element */}
            <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
          </div>
        </section>
            </motion.div>
          )}

          {activeTab === "Yutuqlar" && (
            <motion.div
              key="yutuqlar"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Achievements Section */}
              <section className="px-6 pt-6">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white/40 px-2">Yutuqlar</h2>
                  <button 
                    onClick={() => setIsAllAchievementsOpen(true)}
                    className="text-[10px] text-primary font-black uppercase tracking-widest"
                  >
                    Hammasi
                  </button>
                </div>

                <div className="flex flex-col gap-6">
                  {[
                    { title: "Hudud Egallash", data: TERRITORY_ACHIEVEMENTS },
                    { title: "Masofa", data: DISTANCE_ACHIEVEMENTS },
                    { title: "Uzluksizlik", data: STREAK_ACHIEVEMENTS },
                    { title: "Bir Urinishdagi Masofa", data: MARATHON_ACHIEVEMENTS }
                  ].map((category) => (
                    <div key={category.title}>
                      <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-3 px-2">{category.title}</h3>
                      <div className="flex overflow-x-auto gap-2 px-1 pb-2 hide-scrollbar">
                        {category.data.map(ach => (
                          <div key={ach.id} className="min-w-[70px] max-w-[70px] shrink-0">
                            <MinimalGridAchievementCard 
                              achievement={ach} 
                              onClick={() => setSelectedAchievement(ach)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === "Maqsadlar" && (
            <motion.div
              key="maqsadlar"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Goals Section */}
              <section className="px-6 pt-6 mb-12">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-black tracking-tighter uppercase text-white">Maqsadlar</h2>
                </div>

                {/* Sub-tabs for Maqsadlar */}
                <div className="flex border-b border-white/5 mb-8 overflow-x-auto no-scrollbar">
                  {["AI Marafon Rejalari", "Mening maqsadlarim"].map((tab) => (
                    <button 
                      key={tab}
                      onClick={() => setActiveGoalSubTab(tab)}
                      className={cn(
                        "py-3 px-4 text-[10px] font-black transition-all relative uppercase tracking-widest whitespace-nowrap",
                        activeGoalSubTab === tab ? "text-[#CCFF00]" : "text-white/30"
                      )}
                    >
                      {tab}
                      {activeGoalSubTab === tab && (
                        <motion.div 
                          layoutId="activeGoalSubTabUnderline"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#CCFF00] shadow-[0_0_8px_rgba(204,255,0,0.6)]"
                        />
                      )}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col gap-4 mb-8">
                  {activeGoalSubTab === "AI Marafon Rejalari" && (
                    <div className="space-y-6">
                      {/* Check if there is an active marathon goal */}
                      {goals.find(g => g.type === 'custom' && g.title.includes('Marafon')) ? (
                        <div className="space-y-4 animate-fade-in">
                          {/* Active Marathon Status Card */}
                          {(() => {
                            const marathon = goals.find(g => g.type === 'custom' && g.title.includes('Marafon'))!;
                            return (
                              <div className="bg-gradient-to-br from-[#FF005C] to-[#8A2BE2] rounded-[32px] p-6 text-white shadow-[0_20px_40px_rgba(255,0,92,0.2)] relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-2xl rounded-full -mr-10 -mt-10" />
                                <div className="relative z-10">
                                  <div className="flex justify-between items-start mb-6">
                                    <div>
                                      <h3 className="text-2xl font-black italic tracking-tighter uppercase">{marathon.total} KM MARAFON</h3>
                                      <p className="text-white/70 text-[10px] font-black uppercase tracking-widest">{marathon.timeLeft}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                                      <Trophy className="w-6 h-6 text-white" />
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-2 mb-6">
                                    <div className="flex justify-between items-end">
                                      <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Umumiy progress</span>
                                      <span className="text-xl font-black">{marathon.progress}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
                                      <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${marathon.progress}%` }}
                                        className="h-full bg-white shadow-[0_0_15px_white]"
                                      />
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-3 p-3 bg-black/20 rounded-2xl backdrop-blur-sm border border-white/5">
                                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                                      <Sparkles className="w-4 h-4 text-black" />
                                    </div>
                                    <p className="text-[11px] font-bold leading-tight">
                                      AI Coach: "Bugun 4.2 km sekin tempda. Chidamlilikni oshirish vaqti!"
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          })()}

                          {/* Weekly Roadmap */}
                          <div className="bg-white/5 border border-white/5 rounded-[32px] p-6 backdrop-blur-xl">
                            <h4 className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-6 px-2">Joriy Hafta: 1-Bosqich</h4>
                            <div className="flex justify-between px-2">
                              {['Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan', 'Yak'].map((day, idx) => {
                                const isCompleted = idx < 2;
                                const isCurrent = idx === 2;
                                return (
                                  <div key={day} className="flex flex-col items-center gap-3">
                                    <div className={cn(
                                      "w-10 h-14 rounded-2xl flex flex-col items-center justify-center border transition-all animate-fade-in",
                                      isCompleted ? "bg-[#CCFF00] border-[#CCFF00] text-black" : 
                                      isCurrent ? "bg-white/10 border-white/20 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]" : 
                                      "bg-white/[0.02] border-white/5 text-white/30"
                                    )}>
                                      <span className="text-[10px] font-black">{day[0]}</span>
                                      <div className={cn(
                                        "w-1.5 h-1.5 rounded-full mt-2",
                                        isCompleted ? "bg-black" : isCurrent ? "bg-primary animate-pulse" : "bg-white/10"
                                      )} />
                                    </div>
                                    <span className="text-[8px] font-bold uppercase tracking-widest text-center h-4">
                                      {idx % 2 === 0 ? "4km" : "OFF"}
                                    </span>
                                  </div>
                                )
                              })}
                            </div>
                            
                            <button 
                              onClick={() => {
                                // Redirect to training log or start a session
                              }}
                              className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 mt-8 text-white text-[10px] font-black uppercase tracking-[0.2em] transition-all"
                            >
                              To'liq rejani ko'rish
                            </button>
                          </div>

                          {/* AI Coach Insight Section */}
                          <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF005C] to-[#8A2BE2] rounded-[32px] blur opacity-20 group-hover:opacity-40 transition-all" />
                            <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-[32px] p-6 overflow-hidden">
                              <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FF005C] to-[#8A2BE2] flex items-center justify-center shadow-lg">
                                  <Sparkles className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                  <h4 className="text-white text-sm font-black uppercase tracking-widest">AI Murabbiy Tahlili</h4>
                                  <p className="text-white/30 text-[8px] font-bold uppercase tracking-[0.2em]">O'tgan 7 kunlik natijalar asosida</p>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/5">
                                  <div className="flex items-center gap-3 mb-2">
                                    <div className="w-2 h-2 rounded-full bg-[#CCFF00]" />
                                    <span className="text-[10px] font-black text-white/80 uppercase tracking-widest">Yutuqlar</span>
                                  </div>
                                  <p className="text-xs text-white/60 leading-relaxed">
                                    Sizning chidamlilik ko'rsatkichingiz <span className="text-[#CCFF00] font-black">+12%</span> ga oshdi. Suyuqlik ichish tartibiga rioya qilayotganingiz sezilmoqda.
                                  </p>
                                </div>

                                <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/5">
                                  <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                      <div className="w-2 h-2 rounded-full bg-[#00A3FF]" />
                                      <span className="text-[10px] font-black text-white/80 uppercase tracking-widest">Haftalik Trend</span>
                                    </div>
                                    <span className="text-[9px] font-bold text-[#CCFF00] uppercase tracking-widest">Rejadan oldinda</span>
                                  </div>
                                  
                                  {/* Simple Trend Chart */}
                                  <div className="flex items-end justify-between h-12 gap-1 px-1 mb-2">
                                    {[
                                      { h: 40, p: 45 }, { h: 60, p: 55 }, { h: 30, p: 35 }, 
                                      { h: 80, p: 85 }, { h: 50, p: 65 }, { h: 70, p: 80 }, 
                                      { h: 20, p: 0 }
                                    ].map((bar, i) => (
                                      <div key={i} className="flex-1 flex flex-col items-center gap-1 group/bar">
                                        <div className="w-full relative flex items-end justify-center h-full">
                                          {/* Plan bar (dashed/ghost) */}
                                          <div 
                                            className="w-full bg-white/5 rounded-t-sm absolute bottom-0" 
                                            style={{ height: `${bar.p}%` }} 
                                          />
                                          {/* Actual bar */}
                                          <div 
                                            className="w-[60%] bg-gradient-to-t from-[#FF005C] to-[#8A2BE2] rounded-t-sm relative z-10 transition-all group-hover/bar:brightness-125" 
                                            style={{ height: `${bar.h}%` }} 
                                          />
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="flex justify-between items-center text-[8px] font-bold text-white/20 uppercase tracking-tighter">
                                    <span>Du</span>
                                    <span>Se</span>
                                    <span>Ch</span>
                                    <span>Pa</span>
                                    <span>Ju</span>
                                    <span>Sh</span>
                                    <span>Ya</span>
                                  </div>
                                </div>

                                <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/5">
                                  <div className="flex items-center gap-3 mb-2">
                                    <div className="w-2 h-2 rounded-full bg-[#FF005C]" />
                                    <span className="text-[10px] font-black text-white/80 uppercase tracking-widest">Tavsiya</span>
                                  </div>
                                  <p className="text-xs text-white/60 leading-relaxed italic">
                                    "Haftalik hajm rejasidan <span className="text-white font-bold">1.5 km</span> ga o'zib ketdingiz. Bugungi mashg'ulotni 'Recovery' (tiklanish) rejimida o'tkazishni tavsiya qilaman."
                                  </p>
                                </div>
                              </div>

                              <div className="mt-6 flex items-center gap-4 px-2">
                                <div className="flex-1">
                                  <div className="flex justify-between mb-1">
                                    <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Tayyorgarlik darajasi</span>
                                    <span className="text-[9px] font-black text-[#00A3FF]">85%</span>
                                  </div>
                                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#00A3FF] w-[85%]" />
                                  </div>
                                </div>
                                <Zap className="w-4 h-4 text-[#00A3FF] animate-pulse" />
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <button 
                          onClick={() => {
                            setGoalsModalParams({ tab: 'new', period: 'Maxsus' });
                            setIsGoalsModalOpen(true);
                          }}
                          className="flex items-center gap-4 w-full bg-gradient-to-br from-[#FF005C]/20 to-[#8A2BE2]/20 hover:from-[#FF005C]/30 hover:to-[#8A2BE2]/30 active:scale-[0.98] transition-all backdrop-blur-xl border border-[#FF005C]/30 rounded-[24px] p-5 relative overflow-hidden"
                        >
                          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF005C]/10 blur-3xl rounded-full pointer-events-none" />
                          <div className="w-12 h-12 rounded-full bg-[#FF005C]/20 flex items-center justify-center border border-[#FF005C]/30 shrink-0">
                            <Sparkles className="w-5 h-5 text-[#FF005C]" />
                          </div>
                          <div className="flex flex-col flex-1 text-left">
                            <h3 className="text-white text-base font-black tracking-wide">AI Marafon Rejalari</h3>
                            <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest leading-relaxed mt-1">
                              Sizga moslashtirilgan sun'iy intellekt dasturi
                            </p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-white/40" />
                        </button>
                      )}
                    </div>
                  )}

                  {activeGoalSubTab === "Mening maqsadlarim" && (
                    <div className="flex flex-col gap-6">
                      {[
                        { title: "Haftalik maqsad", current: "47.3", total: "60", unit: "km", color: "#CCFF00", progress: 78.8, period: "Haftalik" },
                        { title: "Oylik maqsad", current: "147.3", total: "300", unit: "km", color: "#00A3FF", progress: 49.1, period: "Oylik" },
                        { title: "Shaxsiy maqsad", current: "5", total: "10", unit: "ta", color: "#FF0055", progress: 50, period: "Maxsus" }
                      ].map((m, idx) => (
                        <div 
                          key={idx} 
                          onClick={() => {
                            setGoalsModalParams({ tab: 'new', period: m.period });
                            setIsGoalsModalOpen(true);
                          }}
                          className="flex flex-col gap-3 text-left w-full hover:bg-white/[0.08] cursor-pointer active:scale-[0.98] transition-all"
                        >
                          <div className="flex justify-between items-end w-full">
                            <span className="text-white text-[10px] font-black uppercase tracking-[0.15em]">{m.title}</span>
                            <span className="text-white font-black text-lg">
                              {m.current} <span className="text-white/40 font-bold text-xs">/ {m.total} {m.unit}</span>
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden relative">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${m.progress}%` }}
                              transition={{ duration: 1.5, ease: "easeOut" }}
                              className="h-full rounded-full"
                              style={{ 
                                backgroundColor: m.color,
                                boxShadow: `0 0 10px ${m.color}60` 
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>



              </section>
            </motion.div>
          )}

          {activeTab === "Faoliyat" && (
            <motion.div
              key="faoliyat"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="px-6 pt-6 space-y-8 relative z-50"
            >
              {/* Activity Summary Header */}
              <div className="flex items-center justify-between mb-2 relative z-[100]">
                <div>
                  <h2 className="text-2xl font-black tracking-tighter uppercase">Faoliyat <span className="text-primary">Tarixi</span></h2>
                  <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Oxirgi natijalar</p>
                </div>
                <div className="relative">
                  <button 
                    onClick={() => setIsActivityFilterOpen(!isActivityFilterOpen)}
                    className={cn(
                      "w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-300",
                      isActivityFilterOpen 
                        ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]" 
                        : "bg-white/5 border-white/10 text-white/60 hover:text-white"
                    )}
                  >
                    <Filter className="w-4 h-4" />
                  </button>

                  <AnimatePresence>
                    {isActivityFilterOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className="absolute top-12 right-0 w-48 bg-[#1a1a1a] border border-white/10 rounded-[20px] p-2 shadow-2xl z-[100] flex flex-col gap-1 backdrop-blur-xl"
                      >
                        {[
                          { id: 'recent', label: "Yaqinda", icon: <Clock className="w-4 h-4" /> },
                          { id: 'distance', label: "Eng uzoq masofa", icon: <Footprints className="w-4 h-4" /> },
                          { id: 'steps', label: "Eng ko'p qadam", icon: <TrendingUp className="w-4 h-4" /> },
                        ].map(option => (
                          <button
                            key={option.id}
                            onClick={() => {
                              setActivitySort(option.id as any);
                              setIsActivityFilterOpen(false);
                            }}
                            className={cn(
                              "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300",
                              activitySort === option.id 
                                ? "bg-white/10 text-white border-white/20" 
                                : "text-white/60 hover:text-white hover:bg-white/5 border-transparent"
                            )}
                          >
                            {option.icon}
                            <span className="text-[10px] font-black uppercase tracking-widest">{option.label}</span>
                            {activitySort === option.id && (
                              <Check className="w-3 h-3 ml-auto text-white" />
                            )}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Activity List - Swipeable Card Stack */}
              <SwipeableHistoryCards activities={sortedActivities} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* All Achievements Modal */}
      <AllAchievementsModal 
        isOpen={isAllAchievementsOpen} 
        onClose={() => setIsAllAchievementsOpen(false)} 
        onSelect={(ach) => {
          setIsAllAchievementsOpen(false);
          setSelectedAchievement(ach);
        }}
      />

      {/* Achievement Detail Modal */}
      <AchievementDetails 
        achievement={selectedAchievement} 
        onClose={() => setSelectedAchievement(null)} 
      />

      {/* Goals Modal */}
      <GoalsModal 
        isOpen={isGoalsModalOpen} 
        onClose={() => setIsGoalsModalOpen(false)} 
        goals={goals}
        setGoals={setGoals}
        completedGoals={completedGoals}
        setCompletedGoals={setCompletedGoals}
        initialTab={goalsModalParams.tab}
        initialPeriod={goalsModalParams.period}
      />

      {/* Clan Chat Modal */}
      <ClanChatModal 
        isOpen={isClanChatOpen}
        onClose={() => setIsClanChatOpen(false)}
      />

      {/* Clan Members Modal */}
      <ClanMembersModal 
        isOpen={isClanMembersOpen}
        onClose={() => setIsClanMembersOpen(false)}
      />

      {/* Edit Profile Modal */}
      <EditProfileModal 
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        userData={userData}
        onUpdate={setUserData}
      />

      <BodyMetricsModal
        isOpen={isBodyMetricsModalOpen}
        onClose={() => setIsBodyMetricsModalOpen(false)}
        activeMetric={activeMetric}
        bodyMetrics={bodyMetrics}
        onUpdate={setBodyMetrics}
      />

      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          setIsDeleteModalOpen(false);
          toast.success("Hisob o'chirildi");
          navigate('/login');
        }}
      />

      <ConnectionModal 
        isOpen={!!selectedConnection}
        onClose={() => setSelectedConnection(null)}
        connection={selectedConnection}
        onToggle={handleConnectionToggle}
      />

      <GadgetModal 
        isOpen={!!selectedGadget}
        onClose={() => setSelectedGadget(null)}
        gadget={selectedGadget}
        onToggle={handleGadgetToggle}
      />

      <LanguageModal 
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
        currentLang={settings.language}
        onSelect={(code) => setSettings(s => ({ ...s, language: code }))}
      />

      <LegalModal 
        isOpen={!!legalContent}
        onClose={() => setLegalContent(null)}
        content={legalContent}
      />
    </div>
  );
}
