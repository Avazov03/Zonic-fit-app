import React from 'react';
import { cn, getFrameClasses } from '@/src/lib/utils';

interface AvatarFrameProps {
  src: string;
  frameId: string | null | undefined;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  showStatus?: boolean;
  level?: number | string;
}

export const AvatarFrame: React.FC<AvatarFrameProps> = ({ 
  src, 
  frameId, 
  size = 'md', 
  className,
  onClick,
  showStatus = false,
  level
}) => {
  const sizeClasses = {
    xs: 'w-8 h-8',
    sm: 'w-[42px] h-[42px]',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
    xl: 'w-24 h-24'
  };

  const containerSize = sizeClasses[size];

  return (
    <div 
      className={cn("relative shrink-0 group flex items-center justify-center", containerSize, className)}
      onClick={onClick}
    >
      {/* 1. Fire Overlay (frame_fire) */}
      {(frameId === 'frame_fire' || frameId === 'a2') && (
        <div className="absolute inset-[-4px] rounded-full overflow-visible z-0">
          {/* Base Glow */}
          <div className="absolute inset-2 bg-red-600/20 blur-lg rounded-full" />
          
          {/* Flame Layers */}
          <div className="absolute inset-0 bg-gradient-to-t from-red-600 via-orange-500 to-yellow-300 opacity-80 blur-[6px] animate-fire-flow rounded-full" />
          
          {/* Main Border */}
          <div className="absolute inset-0 border-[2px] border-orange-500/80 rounded-full animate-flicker shadow-[0_0_15px_#FF5E00,inset_0_0_8px_#FF5E00]" />
          
          {/* Rising Embers around the perimeter */}
          {[...Array(8)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-0.5 h-0.5 bg-yellow-300 rounded-full blur-[0.3px] animate-ember"
              style={{
                left: `${50 + 42 * Math.cos((i * 45 * Math.PI) / 180)}%`,
                top: `${50 + 42 * Math.sin((i * 45 * Math.PI) / 180)}%`,
                '--tx': `${(Math.random() - 0.5) * 30}px`,
                animationDelay: `${Math.random() * 2}s`,
                opacity: 0
              } as any}
            />
          ))}
        </div>
      )}

      {/* 2. Neon Overlay (frame_neon) */}
      {(frameId === 'frame_neon' || frameId === 'a1') && (
        <div className="absolute inset-[-2.5px] rounded-full z-0 overflow-hidden">
          <div 
            className="absolute -inset-1 animate-neon-rotate"
            style={{
              background: 'conic-gradient(from 0deg, #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF, #4B0082, #8B00FF, #FF0000)'
            }}
          />
        </div>
      )}

      {/* 3. Cryogenic Overlay (frame_cryo) */}
      {(frameId === 'frame_cryo' || frameId === 'a3') && (
        <div className="absolute inset-[-3px] rounded-full z-0 overflow-visible">
          {/* Frozen Base */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-100/40 via-white/20 to-blue-300/40 backdrop-blur-[3px] rounded-full border-2 border-white/70 shadow-[0_0_20px_rgba(163,239,255,0.7),inset_0_0_15px_rgba(255,255,255,0.6)]" />
          
          {/* CURVED ICICLES */}
          <div className="absolute inset-[-8px] pointer-events-none animate-ice-glimmer">
            {[...Array(12)].map((_, i) => {
              const angle = 120 + (i * 10);
              const length = 15 + Math.random() * 25;
              const x = 50 + 50 * Math.cos((angle * Math.PI) / 180);
              const y = 50 + 50 * Math.sin((angle * Math.PI) / 180);
              return (
                <div 
                  key={i}
                  className="absolute origin-top bg-gradient-to-b from-white to-transparent blur-[0.5px]"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    width: '2px',
                    height: `${length}px`,
                    transform: `rotate(${angle - 90}deg)`,
                    borderRadius: '0 0 4px 4px',
                    opacity: 0.8
                  }}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Glacial Overlay (frame_ice) */}
      {(frameId === 'frame_ice' || frameId === 'a4') && (
        <div className="absolute inset-[-2.5px] rounded-full z-0 overflow-visible">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-100/30 via-white/20 to-blue-300/30 backdrop-blur-[2px] rounded-full border-2 border-white/60 shadow-[0_0_15px_rgba(163,239,255,0.5)]" />
          
          {/* STRAIGHT ICICLES - Vertical alignment */}
          <svg className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-[120%] h-8 pointer-events-none drop-shadow-[0_2px_4px_rgba(255,255,255,0.8)] animate-ice-glimmer" viewBox="0 0 100 40" fill="none">
            <path d="M10 0 L15 15 L18 0 L25 28 L30 0 L45 22 L50 0 L65 30 L70 0 L85 20 L90 0" 
                  stroke="white" strokeWidth="2.5" fill="white" fillOpacity="0.6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M15 0 L20 22 L25 0 L40 32 L50 0 L75 25 L85 0" 
                  stroke="#A3EFFF" strokeWidth="1.5" fill="#A3EFFF" fillOpacity="0.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}

      {/* 5. Brand Standard Frames (frame_lime, frame_stealth, frame_cyan, frame_minimal, frame_tech, frame_sport) */}
      {(!frameId || frameId === 'frame_lime' || frameId === 'b1') && (
        <div className="absolute inset-[-2px] rounded-full border-[3px] border-primary shadow-[0_0_15px_rgba(204,255,0,0.4)] z-0" />
      )}
      {(frameId === 'frame_stealth' || frameId === 'b2') && (
        <div className="absolute inset-[-1.5px] rounded-full border-2 border-white/20 z-0 bg-white/5" />
      )}
      {(frameId === 'frame_cyan' || frameId === 'b3') && (
        <div className="absolute inset-[-2px] rounded-full border-[2.5px] border-cyan-400/60 shadow-[0_0_10px_rgba(0,240,255,0.2)] z-0" />
      )}
      {frameId === 'frame_minimal' && (
        <div className="absolute inset-[-1.5px] rounded-full border border-white/40 z-0 animate-pulse" />
      )}
      {frameId === 'frame_tech' && (
        <div className="absolute inset-[-4px] rounded-full z-0">
          <div className="absolute inset-0 border-2 border-primary/20 rounded-full" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-1 bg-primary rounded-full" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-1 bg-primary rounded-full" />
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-primary rounded-full" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-primary rounded-full" />
        </div>
      )}
      {frameId === 'frame_sport' && (
        <div className="absolute inset-[-3px] rounded-full border-2 border-white/10 z-0">
          <div className="absolute inset-1 border-2 border-primary/40 rounded-full" />
        </div>
      )}
      {frameId === 'frame_pulse' && (
        <div className="absolute inset-[-4px] rounded-full border-2 border-indigo-500/50 z-0 animate-ping opacity-20" />
      )}
      {frameId === 'frame_pixel' && (
        <div className="absolute inset-[-2px] rounded-full border-[3px] border-black border-dashed z-0 opacity-40" />
      )}
      {frameId === 'frame_gold' && (
        <div className="absolute inset-[-3px] rounded-full border-[4px] border-amber-400 z-0 bg-gradient-to-tr from-amber-600 via-yellow-300 to-amber-600 shadow-[0_0_20px_rgba(251,191,36,0.6),inset_0_0_10px_rgba(251,191,36,0.4)] animate-pulse" />
      )}
      {frameId === 'frame_nature' && (
        <div className="absolute inset-[-4px] rounded-full z-0 overflow-visible">
          <div className="absolute inset-0 border-[3px] border-green-600 rounded-full" />
          <div className="absolute -top-1 left-2 w-3 h-3 bg-green-500 rounded-full blur-[1px] rotate-45" />
          <div className="absolute -bottom-1 right-2 w-3 h-3 bg-green-800 rounded-full blur-[1px] -rotate-45" />
          <div className="absolute top-1/2 -right-1 w-2 h-2 bg-green-400 rounded-full blur-[0.5px]" />
        </div>
      )}
      {frameId === 'frame_galaxy' && (
        <div className="absolute inset-[-3px] rounded-full z-0 overflow-hidden border-2 border-purple-500/40">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-700 to-black animate-pulse" />
          <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_50%_50%,white_1px,transparent_1px)] bg-[size:10px_10px]" />
        </div>
      )}
      {frameId === 'frame_magic' && (
        <div className="absolute inset-[-4px] rounded-full z-0 animate-spin-slow">
          <div className="absolute inset-0 border-2 border-pink-400/50 rounded-full border-dashed" />
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-pink-300 rounded-full shadow-[0_0_10px_rgba(244,114,182,0.8)]" />
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-pink-300 rounded-full shadow-[0_0_10px_rgba(244,114,182,0.8)]" />
        </div>
      )}

      {/* Avatar Content */}
      <div className={cn(
        "relative z-10 w-full h-full rounded-full border-2 p-1 bg-surface flex items-center justify-center overflow-hidden transition-all",
        (!frameId || frameId === 'frame_lime' || frameId === 'b1') && "border-primary/50",
        (frameId === 'frame_neon' || frameId === 'a1') && "border-transparent",
        (frameId === 'frame_fire' || frameId === 'a2') && "border-orange-500",
        (frameId === 'frame_cryo' || frameId === 'a3' || frameId === 'frame_ice' || frameId === 'a4') && "border-white/80",
        (frameId === 'frame_stealth' || frameId === 'b2') && "border-white/10",
        (frameId === 'frame_cyan' || frameId === 'b3') && "border-cyan-400/40",
        frameId === 'frame_minimal' && "border-white/20",
        frameId === 'frame_tech' && "border-primary/30",
        frameId === 'frame_sport' && "border-white/20",
        frameId === 'frame_pulse' && "border-indigo-400/40",
        frameId === 'frame_pixel' && "border-primary/60",
        frameId === 'frame_gold' && "border-amber-400/60",
        frameId === 'frame_nature' && "border-green-600/40",
        frameId === 'frame_galaxy' && "border-purple-400/40",
        frameId === 'frame_magic' && "border-pink-300/40"
      )}>
        <img 
          src={src} 
          alt="Avatar" 
          className="w-full h-full rounded-full object-cover shrink-0" 
          style={{ minWidth: '100%', minHeight: '100%' }} 
        />
        
        {/* Sparkle/Frost effect for ice types */}
        {(frameId === 'frame_cryo' || frameId === 'a3' || frameId === 'frame_ice' || frameId === 'a4') && (
          <div className="absolute inset-0 bg-white/5 pointer-events-none animate-pulse" />
        )}
      </div>

      {/* Level Tag (Optional) */}
      {showStatus && level !== undefined && (
        <div 
          className={cn(
            "absolute -bottom-1 -right-1 min-w-[24px] h-6 px-1 rounded-full flex items-center justify-center text-[10px] font-black text-white border-2 border-surface z-[30] shadow-xl",
            (frameId === 'frame_neon' || frameId === 'a1') ? "bg-orange-500" : 
            (frameId === 'frame_fire' || frameId === 'a2') ? "bg-[#FF5E00] shadow-[0_0_10px_#FF5E00]" :
            (frameId === 'frame_cryo' || frameId === 'a3' || frameId === 'frame_ice' || frameId === 'a4') ? "bg-blue-400 shadow-[0_0_10px_#A3EFFF]" :
            (!frameId || frameId === 'frame_lime' || frameId === 'b1' || frameId === 'frame_stealth' || frameId === 'b2' || frameId === 'frame_cyan' || frameId === 'b3' || frameId === 'frame_minimal' || frameId === 'frame_tech' || frameId === 'frame_sport' || frameId === 'frame_pulse' || frameId === 'frame_pixel') ? "bg-primary" :
            "bg-primary"
          )}
          style={{ transform: 'translate(25%, 25%)' }}
        >
          {level}
        </div>
      )}
    </div>
  );
};
