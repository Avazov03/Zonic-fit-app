import { motion, AnimatePresence } from "motion/react";
import { Plus, Minus, Navigation, Eye, Layers, X, Trophy, Zap, MapPin, Send, Target, ChevronRight } from "lucide-react";
import { cn, getFrameClasses } from "@/src/lib/utils";
import { AvatarFrame } from "../components/AvatarFrame";
import BottomNav from "@/src/components/BottomNav";
import UserProfile from "@/src/components/UserProfile";
import { MapContainer, TileLayer, Polygon, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const TASHKENT_CENTER: [number, number] = [41.3111, 69.2797];

const generateHexagon = (center: [number, number], radius: number): [number, number][] => {
  const p: [number, number][] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (i * 2 * Math.PI) / 6;
    // Compress lat slightly for better map proportion
    p.push([center[0] + (radius * 0.8) * Math.sin(angle), center[1] + radius * Math.cos(angle)]);
  }
  return p;
};

const TERRITORY_DEFINITIONS = [
  { id: "my_zone", name: "", ownerId: "0", ownerName: "Avazov_fit", level: 99, color: "#CCFF00", center: [41.3380, 69.2797] },
  { id: "yunusobod", name: "", ownerId: "1", ownerName: "Flash", level: 42, color: "#CCFF00", center: [41.355, 69.285] },
  { id: "chilonzor", name: "", ownerId: "2", ownerName: "Speedy", level: 38, color: "#E000FF", center: [41.285, 69.215] },
  { id: "mirzo_ulugbek", name: "", ownerId: "3", ownerName: "Hawk", level: 55, color: "#00A3FF", center: [41.335, 69.335] },
  { id: "old_city", name: "", ownerId: "4", ownerName: "Alisher", level: 60, color: "#FF3D00", center: [41.325, 69.245] },
  { id: "yakkasaray", name: "", ownerId: "5", ownerName: "Zafar", level: 41, color: "#00FF9D", center: [41.285, 69.260] },
  { id: "sergeli", name: "", ownerId: "6", ownerName: "Timur", level: 33, color: "#FF005C", center: [41.230, 69.225] },
  { id: "mirobod", name: "", ownerId: "7", ownerName: "Aziz", level: 48, color: "#FFD700", center: [41.295, 69.290] },
  { id: "olmazor", name: "", ownerId: "8", ownerName: "Jasur", level: 29, color: "#00F0FF", center: [41.365, 69.230] },
  { id: "uchtepa", name: "", ownerId: "9", ownerName: "Malika", level: 52, color: "#B500FF", center: [41.300, 69.180] },
  { id: "yashnabad", name: "", ownerId: "10", ownerName: "Sardor", level: 44, color: "#FF5E00", center: [41.300, 69.340] },
  { id: "bektemir", name: "", ownerId: "11", ownerName: "Bekhzod", level: 35, color: "#39FF14", center: [41.235, 69.330] },
  { id: "shayhontohur", name: "", ownerId: "12", ownerName: "Dildora", level: 50, color: "#00FFFF", center: [41.320, 69.210] },
];

const PIZZA_ICONS = [
  { pos: [41.313, 69.278] as [number, number] },
  { pos: [41.345, 69.285] as [number, number] },
  { pos: [41.285, 69.215] as [number, number] },
];

function AvatarListOverlay({ territories, onAvatarClick, selectedTerritoryId }: any) {
  const map = useMap();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      L.DomEvent.disableScrollPropagation(containerRef.current);
      L.DomEvent.disableClickPropagation(containerRef.current);
    }
  }, []);
  
  return (
    <div className="absolute top-[90px] left-4 z-[1000] pointer-events-auto">
      <div 
        ref={containerRef}
        className="flex flex-col gap-3 p-2 bg-[#0A0A0A]/80 backdrop-blur-md border border-white/5 rounded-full max-h-[290px] w-[58px] overflow-y-auto snap-y snap-mandatory scrollbar-hide shadow-2xl relative overscroll-contain touch-pan-y"
      >
        {territories.map((t: any) => (
          <AvatarFrame 
             key={t.id}
             src={t.owner.avatar}
             frameId={t.owner.frame}
             size="sm"
             onClick={(e) => {
               map.flyTo(t.center, 13, { duration: 1.2, easeLinearity: 0.25 });
               onAvatarClick(t);
             }}
             className={cn(
               "snap-start shrink-0 cursor-pointer",
               selectedTerritoryId === t.id ? 'scale-110' : 'opacity-60 hover:opacity-100'
             )}
             showStatus={false}
             level={t.owner.level}
          />
        ))}
      </div>
      {/* Down indicator */}
      <div className="mt-2 flex justify-center">
         <motion.div 
           animate={{ y: [0, 4, 0] }}
           transition={{ repeat: Infinity, duration: 1.5 }}
           className="w-1 h-1 rounded-full bg-white/40"
         />
      </div>
    </div>
  )
}

function MapControls() {
  const map = useMap();
  return (
    <div className="absolute right-4 top-1/2 -translate-y-1/2 z-[1000] flex flex-col gap-2 mt-[90px]">
      <div className="flex flex-col rounded-xl bg-[#0A0A0A]/80 backdrop-blur-md border border-white/5 overflow-hidden">
        <button onClick={() => map.zoomIn()} className="p-2.5 text-white/60 hover:text-primary transition-colors border-b border-white/5">
          <Plus className="w-5 h-5" />
        </button>
        <button onClick={() => map.zoomOut()} className="p-2.5 text-white/60 hover:text-primary transition-colors">
          <Minus className="w-5 h-5" />
        </button>
      </div>

      <button onClick={() => map.setView(TASHKENT_CENTER, 13)} className="p-3 rounded-xl bg-primary/10 backdrop-blur-md border border-primary/20 text-primary shadow-lg">
        <Navigation className="w-5 h-5 fill-current" />
      </button>
    </div>
  );
}

const getFrameHtml = (frameId: string | null | undefined, avatar: string, color: string, level: number | string, name: string, territoryName: string) => {
  let effectHtml = '';
  let borderClass = 'border-white/10';

  if (!frameId || frameId === 'frame_lime' || frameId === 'b1') {
    effectHtml = `<div class="absolute inset-[-2.5px] rounded-full border-[3px] border-[#CCFF00] shadow-[0_0_10px_rgba(204,255,0,0.5)] z-0"></div>`;
    borderClass = 'border-[#CCFF00]/50';
  } else if (frameId === 'a1') {
    effectHtml = `<div class="absolute inset-[-2.5px] rounded-full z-0 overflow-hidden"><div class="absolute -inset-1 animate-neon-rotate" style="background: conic-gradient(from 0deg, #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF, #4B0082, #8B00FF, #FF0000)"></div></div>`;
    borderClass = 'border-transparent';
  } else if (frameId === 'a2') {
    effectHtml = `
      <div class="absolute inset-[-6px] rounded-full overflow-visible z-0">
        <div class="absolute inset-2 bg-red-600/20 blur-lg rounded-full"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-red-600 via-orange-500 to-yellow-300 opacity-80 blur-[6px] animate-fire-flow rounded-full"></div>
        <div class="absolute inset-0 border-[2px] border-orange-500/80 rounded-full animate-flicker shadow-[0_0_15px_#FF5E00,inset_0_0_8px_#FF5E00]"></div>
      </div>
    `;
    borderClass = 'border-orange-500';
  } else if (frameId === 'a3' || frameId === 'a4') {
    effectHtml = `
      <div class="absolute inset-[-3.5px] rounded-full z-0 overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-cyan-100/40 via-white/20 to-blue-300/40 backdrop-blur-[3px] rounded-full border-2 border-white/70 shadow-[0_0_20px_rgba(163,239,255,0.7),inset_0_0_15px_rgba(255,255,255,0.6)]"></div>
      </div>
    `;
    borderClass = 'border-white/80';
  }

  const statusBg = (frameId === 'a1' || frameId === 'a2') ? '#FF5E00' : (frameId === 'a3' || frameId === 'a4') ? '#A3EFFF' : '#CCFF00';

  return `
    <div class="relative -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
      ${territoryName ? `<div class="text-[11px] font-sporty tracking-[0.2em] text-white mb-2 italic drop-shadow-md whitespace-nowrap">${territoryName}</div>` : ''}
      <div class="relative group-hover:scale-110 transition-transform p-1">
        ${!frameId ? `<div class="absolute -inset-1.5 rounded-full blur-md opacity-40" style="background-color: ${color}"></div>` : ''}
        ${effectHtml}
        <div class="relative z-10 w-16 h-16 rounded-full border-2 p-1 bg-surface flex items-center justify-center overflow-hidden ${borderClass}">
          <img src="${avatar}" class="w-full h-full rounded-full object-cover shrink-0" style="min-width: 100%; min-height: 100%; display: block;" />
        </div>
        <div class="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white border-2 border-surface z-20 shadow-lg" style="background-color: ${statusBg}; transform: translate(25%, 25%);">
          ${level}
        </div>
      </div>
      <div class="mt-4 text-[11px] font-bold text-white uppercase tracking-wider drop-shadow-sm whitespace-nowrap">${name}</div>
    </div>
  `;
};

export default function MapRun() {
  const navigate = useNavigate();
  const [selectedTerritory, setSelectedTerritory] = useState<any>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileUser, setProfileUser] = useState<any>(null);
  const [isAvatarZoomed, setIsAvatarZoomed] = useState(false);

  const activeAvatarFrame = localStorage.getItem("activeAvatarFrame");

  const territories = TERRITORY_DEFINITIONS.map(def => ({
    ...def,
    owner: { 
      id: def.ownerId, 
      name: def.ownerName, 
      avatar: def.ownerName === "Avazov_fit" ? "/badges/avazov.JPG" : `https://api.dicebear.com/7.x/avataaars/svg?seed=${def.ownerName}`, 
      level: def.level,
      frame: def.ownerName === "Avazov_fit" ? activeAvatarFrame : null
    },
    polygon: generateHexagon(def.center as [number, number], 0.015)
  }));

  const handleOpenProfile = (owner: any) => {
    setProfileUser({
      id: owner.id,
      name: owner.name,
      avatar: owner.avatar,
      km: "124.5 KM", // Mock for now
      runs: "15 runs", // Mock for now
      rank: 4, // Mock for now
      clan: "Elite Runners" // Mock for now
    });
    setSelectedTerritory(null);
    setIsProfileOpen(true);
  };

  return (
    <div className="flex h-full flex-col bg-surface overflow-hidden relative">
      <div className="absolute inset-0 z-0">
        <MapContainer 
          center={TASHKENT_CENTER} 
          zoom={13} 
          zoomControl={false}
          className="h-full w-full"
          style={{ background: '#050505' }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; CARTO'
          />
          
          <MapControls />
          
          <AvatarListOverlay 
            territories={territories} 
            onAvatarClick={setSelectedTerritory} 
            selectedTerritoryId={selectedTerritory?.id} 
          />

          {/* Territories */}
          {territories.map((territory) => (
            <div key={territory.id}>
              <Polygon 
                positions={territory.polygon}
                eventHandlers={{
                  click: () => setSelectedTerritory(territory)
                }}
                pathOptions={{
                  fillColor: territory.color,
                  fillOpacity: 0.08,
                  color: territory.color,
                  weight: 2,
                  opacity: 0.6,
                }}
              />
              
              {/* Owner Badge */}
              <Marker 
                position={territory.center}
                eventHandlers={{
                  click: () => setSelectedTerritory(territory)
                }}
                icon={L.divIcon({
                  className: 'territory-marker',
                  html: getFrameHtml(
                    territory.owner.frame,
                    territory.owner.avatar,
                    territory.color,
                    territory.owner.level,
                    territory.owner.name,
                    territory.name
                  ),
                  iconSize: [0, 0],
                })}
              />
            </div>
          ))}

          {/* User Location Marker */}
          <Marker 
            position={[41.3111, 69.2797]}
            icon={L.divIcon({
              className: 'user-location',
              html: `
                <div class="relative -translate-x-1/2 -translate-y-1/2">
                  <div class="absolute -inset-3 bg-blue-500/20 rounded-full animate-ping"></div>
                  <div class="absolute -inset-2 bg-blue-500/40 rounded-full animate-pulse"></div>
                  <div class="relative w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
                </div>
              `,
              iconSize: [0, 0],
            })}
          />

          {/* Pizza Icons */}
          {PIZZA_ICONS.map((pizza, i) => (
            <Marker 
              key={i}
              position={pizza.pos}
              icon={L.divIcon({
                className: 'pizza-marker',
                html: `<div class="text-lg -translate-x-1/2 -translate-y-1/2 filter drop-shadow-md animate-bounce">🍕</div>`,
                iconSize: [0, 0],
              })}
            />
          ))}
        </MapContainer>
      </div>

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-[1000] flex items-center justify-between p-6 pointer-events-none">
        <div className="pointer-events-auto">
          <div className="text-xl font-sporty italic text-primary tracking-tighter">ZONIC</div>
          <div className="text-[8px] font-mono text-white/40 tracking-[0.3em] -mt-1 uppercase">Territory Control</div>
        </div>
        <div className="pointer-events-auto">
          <AvatarFrame 
            src="/badges/avazov.JPG"
            frameId={localStorage.getItem("activeAvatarFrame")}
            size="sm"
            level={99}
            showStatus={true}
            onClick={() => navigate("/profile")}
            className="active:scale-90 transition-transform shadow-[0_0_20px_rgba(204,255,0,0.2)]"
          />
        </div>
      </header>

      {/* User Info Popup */}
      <AnimatePresence>
        {selectedTerritory && (
          <div className="absolute inset-0 z-[2000] flex items-end justify-center p-4 pointer-events-none">
             <motion.div 
               initial={{ opacity: 0, y: 100 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: 100 }}
               className="pointer-events-auto w-full max-w-md bg-[#0A0A0A]/95 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden relative"
             >
                {/* Decorative background glow */}
                <div 
                  className="absolute -top-24 -left-24 w-48 h-48 rounded-full blur-[80px] opacity-20 transition-colors"
                  style={{ backgroundColor: selectedTerritory.color }}
                />

                <div className="p-6 relative">
                  <header className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4 cursor-pointer active:opacity-70 transition-opacity">
                      <div className="relative group/avatar" onClick={(e) => { e.stopPropagation(); setIsAvatarZoomed(true); }}>
                        <AvatarFrame 
                          src={selectedTerritory.owner.avatar}
                          frameId={selectedTerritory.owner.frame}
                          size="md"
                          showStatus={true}
                          level={selectedTerritory.owner.level}
                          className="active:scale-95 transition-transform"
                        />
                      </div>
                      <div className="flex-1" onClick={() => handleOpenProfile(selectedTerritory.owner)}>
                        <h2 className="text-xl font-black text-white uppercase tracking-tighter leading-none">{selectedTerritory.owner.name}</h2>
                        <div className="flex items-center gap-1.5 mt-1">
                          <MapPin className="w-3 h-3 text-white/40" />
                          <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-none">
                            {selectedTerritory.name ? `${selectedTerritory.name} HUDUDI` : 'EGALLANGAN HUDUD'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedTerritory(null)}
                      className="p-2 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white transition-colors active:scale-90"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </header>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-3.5 h-3.5 text-primary" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-white/40 font-mono">Egallangan</span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-sporty italic text-white leading-none">12.4</span>
                        <span className="text-[10px] font-bold text-white/40 uppercase">km²</span>
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-3.5 h-3.5 text-[#00F0FF]" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-white/40 font-mono">Faollik</span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-sporty italic text-white leading-none">14:15</span>
                        <span className="text-[10px] font-bold text-white/40 uppercase">BUGUN</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleOpenProfile(selectedTerritory.owner)}
                      className="flex-[1] h-14 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-colors active:scale-95 flex items-center justify-center gap-2"
                    >
                      Profil <ChevronRight className="w-3 h-3 opacity-40" />
                    </button>
                    <button 
                      className="flex-[2] h-14 rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2 group relative overflow-hidden"
                      style={{ backgroundColor: selectedTerritory.color }}
                    >
                      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <Send className="w-4 h-4 text-black" />
                      <span className="text-black font-black uppercase text-[10px] tracking-widest">Chaqiruv Yuborish</span>
                    </button>
                  </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAvatarZoomed && selectedTerritory && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsAvatarZoomed(false)}
            className="fixed inset-0 z-[5000] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl cursor-zoom-out"
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
                src={selectedTerritory.owner.avatar} 
                alt="Avatar Large" 
                className="w-full h-full object-cover"
              />
              
              {/* Profile Info in zoom view */}
              <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-black uppercase tracking-tight text-lg">{selectedTerritory.owner.name}</h3>
                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">{selectedTerritory.owner.level}-DARADA</p>
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

      <UserProfile 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        user={profileUser || { name: "", avatar: "", km: "", runs: "", rank: 0, clan: "" }}
      />

      <BottomNav />
    </div>
  );
}
