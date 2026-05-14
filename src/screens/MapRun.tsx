import { motion } from "motion/react";
import { Plus, Minus, Navigation, Eye, Layers } from "lucide-react";
import BottomNav from "@/src/components/BottomNav";
import { MapContainer, TileLayer, Polygon, Marker, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const TASHKENT_CENTER: [number, number] = [41.3111, 69.2797];

const TERRITORIES = [
  {
    id: "yunusobod",
    name: "YUNUSABAD",
    owner: { name: "Flash", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix", level: 42 },
    color: "#CCFF00",
    center: [41.355, 69.285] as [number, number],
    polygon: [
      [41.385, 69.260], [41.390, 69.290], [41.370, 69.310], [41.340, 69.315], [41.330, 69.280], [41.350, 69.250]
    ] as [number, number][],
  },
  {
    id: "chilonzor",
    name: "CHILANZAR",
    owner: { name: "Speedy", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka", level: 38 },
    color: "#E000FF",
    center: [41.285, 69.215] as [number, number],
    polygon: [
      [41.315, 69.190], [41.310, 69.230], [41.280, 69.250], [41.250, 69.230], [41.255, 69.180], [41.290, 69.170]
    ] as [number, number][],
  },
  {
    id: "mirzo_ulugbek",
    name: "M. ULUGBEK",
    owner: { name: "Hawk", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jack", level: 55 },
    color: "#00A3FF",
    center: [41.335, 69.335] as [number, number],
    polygon: [
      [41.365, 69.310], [41.360, 69.350], [41.340, 69.370], [41.310, 69.355], [41.315, 69.320], [41.340, 69.300]
    ] as [number, number][],
  },
  {
    id: "old_city",
    name: "OLD CITY",
    owner: { name: "Alisher", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=User", level: 60 },
    color: "#FF3D00",
    center: [41.325, 69.245] as [number, number],
    polygon: [
      [41.345, 69.230], [41.340, 69.260], [41.310, 69.270], [41.300, 69.240], [41.320, 69.220]
    ] as [number, number][],
  }
];

const PIZZA_ICONS = [
  { pos: [41.313, 69.278] as [number, number] },
  { pos: [41.345, 69.285] as [number, number] },
  { pos: [41.285, 69.215] as [number, number] },
];

function MapControls() {
  const map = useMap();
  return (
    <div className="absolute right-4 top-1/2 -translate-y-1/2 z-[1000] flex flex-col gap-2">
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

          {/* Territories */}
          {TERRITORIES.map((territory) => (
            <div key={territory.id}>
              <Polygon 
                positions={territory.polygon}
                pathOptions={{
                  fillColor: territory.color,
                  fillOpacity: 0.08,
                  color: territory.color,
                  weight: 1,
                  opacity: 0.4,
                }}
              />
              
              {/* Owner Badge */}
              <Marker 
                position={territory.center}
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

      <BottomNav />
    </div>
  );
}
