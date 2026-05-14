import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useAnimation } from "motion/react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/src/lib/utils";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { 
  Sun, 
  Wifi, 
  Timer, 
  Zap, 
  Navigation, 
  Music, 
  Pause, 
  Play, 
  X,
  ChevronRight,
  SkipBack,
  SkipForward,
  Volume2,
  Cloud,
  CloudRain,
  CloudSun,
  Thermometer,
  Droplets,
  Wind
} from "lucide-react";

const TASHKENT_CENTER: [number, number] = [41.3111, 69.2797];

const SwipeToFinish = ({ onFinish }: { onFinish: () => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [maxDrag, setMaxDrag] = useState(0);
  const x = useMotionValue(0);
  const controls = useAnimation();

  useEffect(() => {
    if (containerRef.current) {
      setMaxDrag(containerRef.current.offsetWidth - 72); // 64px thumb + 8px padding
    }
  }, []);

  const handleDragEnd = async () => {
    const currentX = x.get();
    if (currentX > maxDrag * 0.75) {
      await controls.start({ x: maxDrag, transition: { duration: 0.2 } });
      onFinish();
    } else {
      controls.start({ x: 0, transition: { type: "spring", stiffness: 300, damping: 20 } });
    }
  };

  const trackWidth = useTransform(x, [0, maxDrag], ["0%", "100%"]);
  const textOpacity = useTransform(x, [0, maxDrag * 0.5], [1, 0]);

  return (
    <div ref={containerRef} className="relative w-full h-[clamp(64px,18vw,80px)] bg-white/5 backdrop-blur-md border border-white/10 rounded-full overflow-hidden flex items-center p-2 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
      {/* Smooth red gradient track */}
      <motion.div
        className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-red-500/80 to-red-600 rounded-full"
        style={{ width: trackWidth }}
      />
      
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ opacity: textOpacity }}
      >
        <div className="flex items-center gap-2 sm:gap-3 ml-8 sm:ml-12">
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-white/90 font-medium text-[clamp(10px,3vw,14px)] tracking-wide">
            Yakunlash uchun suring
          </span>
        </div>
      </motion.div>
      
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: maxDrag }}
        dragElastic={0.05}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{ x }}
        className="relative z-10 w-[clamp(48px,14vw,64px)] h-[clamp(48px,14vw,64px)] bg-white rounded-full flex items-center justify-center shadow-[0_4px_15px_rgba(0,0,0,0.2)] cursor-grab active:cursor-grabbing"
      >
        {/* Stop Icon inside white thumb */}
        <div className="w-4 h-4 sm:w-5 sm:h-5 bg-red-500 rounded-[4px]" />
      </motion.div>
    </div>
  );
};

export default function ActiveRun() {
  const navigate = useNavigate();
  const [isPaused, setIsPaused] = useState(false);
  const [isStopped, setIsStopped] = useState(false);
  const [isMusicOpen, setIsMusicOpen] = useState(false);
  const [isWeatherOpen, setIsWeatherOpen] = useState(false);
  const [time, setTime] = useState(13);
  const [distance, setDistance] = useState(0.06);
  const [speed, setSpeed] = useState("3'51\"");
  
  // Simple timer simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!isPaused && !isStopped) {
      interval = setInterval(() => {
        setTime((prev) => prev + 1);
        if (Math.random() > 0.7) {
          setDistance((prev) => parseFloat((prev + 0.01).toFixed(2)));
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPaused, isStopped]);

  // Simulated Voice Notification (Toast)
  const [notification, setNotification] = useState<string | null>(null);
  useEffect(() => {
    if (distance > 0 && Math.floor(distance * 100) % 100 === 0) {
      setNotification(`Siz ${Math.floor(distance)} km masofani bosib o'tdingiz!`);
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [distance]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative h-full w-full bg-black overflow-hidden font-sans select-none">
      {/* Top Status Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
        <button 
          onClick={() => setIsWeatherOpen(true)}
          className="flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full active:scale-95 transition-all"
        >
          <Sun className="w-4 h-4 text-yellow-400" />
          <span className="text-white font-bold text-xs uppercase tracking-wider">24°C</span>
        </button>

        <div className="flex-1 mx-4 flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden border border-white/5">
            <motion.div 
              initial={{ width: "0%" }}
              animate={{ width: "65%" }}
              className="h-full bg-gradient-to-r from-primary/40 to-primary shadow-[0_0_10px_rgba(204,255,0,0.5)]"
            />
          </div>
          <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">HP</span>
        </div>

        <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full">
          <Wifi className="w-4 h-4 text-primary" />
          <span className="text-white font-bold text-[10px] uppercase tracking-widest">GPS</span>
        </div>
      </div>

      {/* Map Area */}
      <div className="absolute inset-0 z-0 bg-[#050505]">
        <MapContainer 
          center={TASHKENT_CENTER} 
          zoom={15} 
          zoomControl={false}
          className="h-full w-full"
          style={{ background: '#050505' }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          />
        </MapContainer>
        
        {/* Central User Dot with Pulse Effect overlayed on the map container */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ zIndex: 400 }}>
          <div className="relative">
            {/* Multiple Pulse Rings */}
            {[1, 2, 3].map((i) => (
              <motion.div 
                key={i}
                initial={{ scale: 0.5, opacity: 0.5 }}
                animate={{ scale: 3, opacity: 0 }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  delay: i * 1,
                  ease: "easeOut"
                }}
                className="absolute inset-0 -m-4 rounded-full border border-primary/30"
              />
            ))}
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 -m-8 rounded-full bg-primary/20 blur-xl"
            />
            <div className="h-5 w-5 bg-primary rounded-full shadow-[0_0_20px_rgba(204,255,0,1)] border-2 border-white relative" />
          </div>
        </div>
      </div>

      {/* Voice Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 80, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="absolute top-0 left-6 right-6 z-50 bg-primary text-black p-3 rounded-2xl shadow-2xl flex items-center gap-3"
          >
            <div className="bg-black/10 p-2 rounded-xl">
              <Volume2 className="w-5 h-5" />
            </div>
            <span className="font-black text-xs uppercase tracking-tight">{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Stats Panel */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black via-black/80 to-transparent pt-32 px-4 pb-8 sm:px-8 sm:pb-10">
        
        {/* Metrics Row */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          {/* Distance */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="text-[clamp(28px,8vw,40px)] font-semibold text-primary leading-none tracking-tight drop-shadow-[0_0_8px_rgba(204,255,0,0.3)]">
              {distance.toFixed(2)}
            </div>
            <div className="text-[clamp(8px,2.5vw,10px)] font-semibold text-white/50 uppercase tracking-[0.2em] mt-2">
              KM
            </div>
          </div>

          {/* Divider */}
          <div className="w-[1px] h-[clamp(32px,10vw,48px)] bg-white/30 rounded-full mx-1" />

          {/* Time */}
          <div className="flex-[1.2] flex flex-col items-center justify-center">
            <div className="text-[clamp(28px,8vw,40px)] font-semibold text-white leading-none tracking-tight drop-shadow-md">
              {formatTime(time)}
            </div>
            <div className="text-[clamp(8px,2.5vw,10px)] font-semibold text-white/50 uppercase tracking-[0.2em] mt-2">
              VAQT
            </div>
          </div>

          {/* Divider */}
          <div className="w-[1px] h-[clamp(32px,10vw,48px)] bg-white/30 rounded-full mx-1" />

          {/* Pace */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="text-[clamp(28px,8vw,40px)] font-semibold text-white leading-none tracking-tight drop-shadow-md">
              {speed}
            </div>
            <div className="text-[clamp(8px,2.5vw,10px)] font-semibold text-white/50 uppercase tracking-[0.2em] mt-2">
              TEZLIK
            </div>
          </div>
        </div>

        {/* Control Buttons Row */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button 
            onClick={() => setIsPaused(!isPaused)}
            className={cn(
              "w-[clamp(60px,18vw,72px)] h-[clamp(56px,16vw,68px)] rounded-[16px] sm:rounded-[20px] flex items-center justify-center active:scale-95 transition-all shadow-xl",
              isPaused 
                ? "bg-primary shadow-[0_8px_30px_rgba(204,255,0,0.3)]" 
                : "bg-[#161616]"
            )}
          >
            {isPaused ? (
              <div className="w-0 h-0 border-t-[8px] sm:border-t-[10px] border-t-transparent border-l-[14px] sm:border-l-[16px] border-l-black border-b-[8px] sm:border-b-[10px] border-b-transparent ml-1" />
            ) : (
              <div className="flex gap-1.5">
                <div className="w-2 sm:w-2.5 h-5 sm:h-6 bg-white rounded-[2px]" />
                <div className="w-2 sm:w-2.5 h-5 sm:h-6 bg-white rounded-[2px]" />
              </div>
            )}
          </button>

          <button 
            onClick={() => setIsStopped(true)}
            className="flex-1 h-[clamp(56px,16vw,68px)] rounded-[16px] sm:rounded-[20px] bg-primary flex items-center justify-center gap-2 sm:gap-3 active:scale-95 transition-all shadow-[0_8px_30px_rgba(204,255,0,0.25)]"
          >
            <div className="w-2.5 sm:w-3.5 h-2.5 sm:h-3.5 bg-black rounded-[2px]" />
            <span className="text-black font-black text-[clamp(14px,4vw,18px)] tracking-widest uppercase mt-0.5">
              TO'XTATISH
            </span>
          </button>
        </div>
      </div>

      {/* Weather Hub Modal */}
      <AnimatePresence>
        {isWeatherOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsWeatherOpen(false)}
              className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-xl"
            />
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute bottom-0 left-0 right-0 z-[110] bg-gradient-to-b from-white/10 to-black/90 border-t border-white/20 rounded-t-[40px] p-8 pb-12 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] max-h-[90vh] overflow-y-auto"
            >
              {/* Handle */}
              <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-8" />

              <div className="flex justify-between items-start mb-10">
                <div>
                  <h2 className="text-4xl font-black italic text-white uppercase tracking-tighter leading-none mb-2">
                    Toshkent
                  </h2>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-primary font-bold text-[10px] uppercase tracking-[0.2em]">Hozirgi holat</span>
                  </div>
                </div>
                <button 
                  onClick={() => setIsWeatherOpen(false)}
                  className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Main Weather Info */}
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                    <Sun className="w-20 h-20 text-primary relative z-10 drop-shadow-[0_0_30px_rgba(204,255,0,0.4)]" />
                  </div>
                  <div>
                    <span className="text-6xl font-black italic text-white leading-none">24°</span>
                    <span className="block text-white/40 font-bold text-xs uppercase tracking-widest mt-2">Ochiq havo</span>
                  </div>
                </div>
                
                <div className="bg-primary/10 border border-primary/20 rounded-3xl p-4 text-center">
                  <span className="block text-[8px] font-black text-primary uppercase tracking-widest mb-1">Run Score</span>
                  <span className="text-2xl font-black italic text-primary">9.2</span>
                </div>
              </div>

              {/* Detailed Metrics */}
              <div className="grid grid-cols-3 gap-3 mb-12">
                {[
                  { label: "Namlik", value: "42%", icon: Droplets, color: "text-blue-400" },
                  { label: "Shamol", value: "12 km/s", icon: Wind, color: "text-green-400" },
                  { label: "AQI", value: "24", icon: Zap, color: "text-primary" }
                ].map((item, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-3xl p-4 flex flex-col items-center gap-2">
                    <item.icon className={cn("w-5 h-5", item.color)} />
                    <span className="text-[8px] font-bold text-white/30 uppercase tracking-widest">{item.label}</span>
                    <span className="text-xs font-black text-white">{item.value}</span>
                  </div>
                ))}
              </div>

              {/* 7-Day Forecast */}
              <div>
                <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-6 ml-2">7 kunlik prognoz</h3>
                <div className="space-y-3">
                  {[
                    { day: "Ertaga", temp: "26°", icon: Sun, status: "Quyoshli" },
                    { day: "Chorshanba", temp: "23°", icon: CloudSun, status: "Bulutli" },
                    { day: "Payshanba", temp: "21°", icon: CloudRain, status: "Yomg'ir" },
                    { day: "Juma", temp: "24°", icon: Cloud, status: "Ochiq" },
                    { day: "Shanba", temp: "27°", icon: Thermometer, status: "Issiq" },
                    { day: "Yakshanba", temp: "25°", icon: Sun, status: "Ochiq" },
                    { day: "Dushanba", temp: "22°", icon: Cloud, status: "Bulutli" }
                  ].map((day, i) => (
                    <div key={i} className="flex items-center justify-between bg-white/[0.03] border border-white/5 rounded-2xl p-4 hover:bg-white/[0.06] transition-all group">
                      <div className="flex items-center gap-4">
                        <span className="w-16 text-xs font-bold text-white/60 group-hover:text-white transition-colors">{day.day}</span>
                        <day.icon className="w-4 h-4 text-primary" />
                        <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">{day.status}</span>
                      </div>
                      <span className="text-base font-black italic text-white">{day.temp}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-12 text-center">
                <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/20">
                  Ma'lumotlar real vaqtda yangilanadi
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mini Music Player */}
      <AnimatePresence>
        {isMusicOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="absolute bottom-[160px] left-6 right-6 z-40 bg-white/[0.08] backdrop-blur-2xl border border-white/10 rounded-[32px] p-5 shadow-2xl"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center overflow-hidden border border-white/10">
                <Music className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="text-white font-black text-sm uppercase tracking-tight">Cyber Run Mix</h4>
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Zonic Music</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="text-white/40 hover:text-white transition-colors"><SkipBack className="w-5 h-5 fill-current" /></button>
                <button className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center"><Play className="w-5 h-5 fill-current ml-0.5" /></button>
                <button className="text-white/40 hover:text-white transition-colors"><SkipForward className="w-5 h-5 fill-current" /></button>
              </div>
            </div>
            {/* Progress Bar */}
            <div className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full w-1/3 bg-primary" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stop Overlay */}
      <AnimatePresence>
        {isStopped && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center p-4 sm:p-8"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              className="w-full max-w-sm text-center px-4"
            >
              <div className="relative mb-8 sm:mb-10 mx-auto w-24 h-24 sm:w-32 sm:h-32">
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-primary/20 rounded-full blur-2xl"
                />
                <div className="relative w-full h-full rounded-full bg-primary flex items-center justify-center shadow-[0_0_50px_rgba(204,255,0,0.4)] border-4 border-white/20">
                  <Pause className="w-10 h-10 sm:w-12 sm:h-12 text-black fill-current" />
                </div>
              </div>

              <h2 className="text-[clamp(32px,10vw,48px)] font-black italic text-white uppercase tracking-tighter mb-4 leading-none">
                TO'XTATILDI
              </h2>
              <p className="text-white/40 font-bold uppercase tracking-[0.2em] text-[8px] sm:text-[10px] mb-8 sm:mb-12">
                Yugurishni davom ettirish uchun bosing
              </p>
              
              <button 
                onClick={() => setIsStopped(false)}
                className="w-full py-5 sm:py-6 bg-primary text-black font-black text-[clamp(14px,4vw,18px)] uppercase tracking-[0.3em] rounded-3xl shadow-[0_20px_40px_rgba(204,255,0,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
                DAVOM ETTIRISH
              </button>

              <div className="mt-8 sm:mt-10 w-full">
                <SwipeToFinish onFinish={() => navigate("/map")} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
