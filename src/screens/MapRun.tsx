import { motion, AnimatePresence } from "motion/react";
import { Plus, Minus, Navigation, Eye, Layers, X, Trophy, Zap, MapPin, Send, Target, ChevronRight } from "lucide-react";
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
  { id: "yunusobod", name: "YUNUSABAD", ownerId: "1", ownerName: "Flash", level: 42, color: "#CCFF00", center: [41.355, 69.285] },
  { id: "chilonzor", name: "CHILANZAR", ownerId: "2", ownerName: "Speedy", level: 38, color: "#E000FF", center: [41.285, 69.215] },
  { id: "mirzo_ulugbek", name: "M. ULUGBEK", ownerId: "3", ownerName: "Hawk", level: 55, color: "#00A3FF", center: [41.335, 69.335] },
  { id: "old_city", name: "OLD CITY", ownerId: "4", ownerName: "Alisher", level: 60, color: "#FF3D00", center: [41.325, 69.245] },
  { id: "yakkasaray", name: "YAKKASARAY", ownerId: "5", ownerName: "Zafar", level: 41, color: "#00FF9D", center: [41.285, 69.260] },
  { id: "sergeli", name: "SERGELI", ownerId: "6", ownerName: "Timur", level: 33, color: "#FF005C", center: [41.230, 69.225] },
  { id: "mirobod", name: "MIROBAD", ownerId: "7", ownerName: "Aziz", level: 48, color: "#FFD700", center: [41.295, 69.290] },
  { id: "olmazor", name: "OLMAZOR", ownerId: "8", ownerName: "Jasur", level: 29, color: "#00F0FF", center: [41.365, 69.230] },
  { id: "uchtepa", name: "UCHTEPA", ownerId: "9", ownerName: "Malika", level: 52, color: "#B500FF", center: [41.300, 69.180] },
  { id: "yashnabad", name: "YASHNABAD", ownerId: "10", ownerName: "Sardor", level: 44, color: "#FF5E00", center: [41.300, 69.340] },
  { id: "bektemir", name: "BEKTEMIR", ownerId: "11", ownerName: "Bekhzod", level: 35, color: "#39FF14", center: [41.235, 69.330] },
  { id: "shayhontohur", name: "SHAYHONTOHUR", ownerId: "12", ownerName: "Dildora", level: 50, color: "#00FFFF", center: [41.320, 69.210] },
];

const TERRITORIES = TERRITORY_DEFINITIONS.map(def => ({
  id: def.id,
  name: def.name,
  owner: { 
    id: def.ownerId, 
    name: def.ownerName, 
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${def.ownerName}`, 
    level: def.level 
  },
  color: def.color,
  center: def.center as [number, number],
  polygon: generateHexagon(def.center as [number, number], 0.015)
}));

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
          <button 
             key={t.id}
             onClick={() => {
               map.flyTo(t.center, 13, { duration: 1.2, easeLinearity: 0.25 });
               onAvatarClick(t);
             }}
             className={`w-[42px] h-[42px] rounded-full p-0.5 transition-all duration-300 snap-start shrink-0 relative ${selectedTerritoryId === t.id ? 'scale-110 shadow-[0_0_15px_rgba(255,255,255,0.2)]' : 'opacity-60 hover:opacity-100'}`}
             style={{ 
               borderColor: selectedTerritoryId === t.id ? t.color : 'transparent',
               borderWidth: selectedTerritoryId === t.id ? '2px' : '0px',
               boxShadow: selectedTerritoryId === t.id ? `0 0 15px ${t.color}80` : '' 
             }}
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr" style={{ background: t.color, opacity: selectedTerritoryId === t.id ? 0.4 : 0.1 }} />
            <img src={t.owner.avatar} className="w-full h-full rounded-full object-cover relative z-10 bg-black/50" />
            {selectedTerritoryId === t.id && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -right-1 -bottom-1 w-[14px] h-[14px] rounded-full border border-black flex items-center justify-center z-20" 
                style={{ backgroundColor: t.color }}
              >
                 <Trophy className="w-2 h-2 text-black" />
              </motion.div>
            )}
          </button>
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

export default function MapRun() {
  const navigate = useNavigate();
  const [selectedTerritory, setSelectedTerritory] = useState<typeof TERRITORIES[0] | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileUser, setProfileUser] = useState<any>(null);

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
            territories={TERRITORIES} 
            onAvatarClick={setSelectedTerritory} 
            selectedTerritoryId={selectedTerritory?.id} 
          />

          {/* Territories */}
          {TERRITORIES.map((territory) => (
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
                  html: `
                    <div class="relative -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                      <div class="text-[10px] font-sporty tracking-[0.2em] text-white/40 mb-2 italic">${territory.name}</div>
                      <div class="relative">
                        <div class="absolute -inset-1 rounded-full blur-sm opacity-30" style="background-color: ${territory.color}"></div>
                        <div class="relative w-10 h-10 rounded-full border border-white/20 bg-surface p-0.5">
                          <img src="${territory.owner.avatar}" class="w-full h-full rounded-full object-cover" />
                        </div>
                        <div class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black text-white border border-surface" style="background-color: ${territory.color}">
                          ${territory.owner.level}
                        </div>
                      </div>
                      <div class="mt-2 text-[9px] font-bold text-white/80 uppercase tracking-wider">${territory.owner.name}</div>
                    </div>
                  `,
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
        <button 
          onClick={() => navigate("/profile")}
          className="relative w-12 h-12 rounded-full border-2 border-primary p-0.5 bg-surface/40 backdrop-blur-md pointer-events-auto active:scale-90 transition-transform shadow-[0_0_15px_rgba(204,255,0,0.3)]"
        >
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Amir" alt="Profile" className="w-full h-full rounded-full object-cover" />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-primary border-2 border-surface flex items-center justify-center text-[8px] font-bold text-black">
            45
          </div>
        </button>
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
                    <div className="flex items-center gap-4 cursor-pointer active:opacity-70 transition-opacity" onClick={() => handleOpenProfile(selectedTerritory.owner)}>
                      <div className="relative">
                        <div 
                          className="absolute -inset-1.5 rounded-full blur-sm opacity-50 transition-colors"
                          style={{ backgroundColor: selectedTerritory.color }}
                        />
                        <div className="relative w-16 h-16 rounded-full border-2 border-white/20 p-1 bg-surface">
                          <img src={selectedTerritory.owner.avatar} className="w-full h-full rounded-full object-cover" />
                        </div>
                        <div 
                          className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white border-2 border-surface shadow-lg"
                          style={{ backgroundColor: selectedTerritory.color }}
                        >
                          {selectedTerritory.owner.level}
                        </div>
                      </div>
                      <div>
                        <h2 className="text-xl font-black text-white uppercase tracking-tighter leading-none">{selectedTerritory.owner.name}</h2>
                        <div className="flex items-center gap-1.5 mt-1">
                          <MapPin className="w-3 h-3 text-white/40" />
                          <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-none">{selectedTerritory.name} HUDUDI</span>
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

      <UserProfile 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        user={profileUser || { name: "", avatar: "", km: "", runs: "", rank: 0, clan: "" }}
      />

      <BottomNav />
    </div>
  );
}
