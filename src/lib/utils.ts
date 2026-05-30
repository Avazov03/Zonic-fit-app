import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFrameClasses(frameId: string | null | undefined, defaultClass: string = 'border-white/10') {
  // If no frameId, we use the Brand Lime design as the "base" neon green style
  if (!frameId) return 'border-primary border-[2.5px] shadow-[0_0_10px_rgba(204,255,0,0.4)]';

  switch (frameId) {
    case 'a1':
    case 'frame_neon': 
      // Neon Halqa - realistic tube glow with sharp edge
      return 'border-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.6),inset_0_0_8px_rgba(0,240,255,0.4)] border-[1.5px] ring-1 ring-cyan-400/30 animate-pulse';
    case 'b1':
    case 'frame_lime':
      // Zonic Brand Lime (kept as case for backwards compatibility or explicit use)
      return 'border-primary border-[2.5px] shadow-[0_0_10px_rgba(204,255,0,0.4)]';
    case 'a2':
    case 'frame_fire': 
      // Olovli - fiery gradient with flicker
      return 'border-[#FF5E00] shadow-[0_0_20px_#FF5E00,0_0_35px_#FF0000_inset] border-[2px] ring-2 ring-red-500/20 animate-flicker bg-gradient-to-tr from-orange-600/20 to-transparent';
    case 'a3':
    case 'frame_cryo': 
      // Muzlik - frosted crystalline look with inner frost
      return 'border-[#A3EFFF]/80 border-2 shadow-[0_0_15px_rgba(163,239,255,0.5),inset_0_0_15px_rgba(255,255,255,0.4)] border-double ring-1 ring-white/40 bg-gradient-to-br from-cyan-200/20 via-white/10 to-blue-400/20 backdrop-blur-[2px]';
    case 'a4':
    case 'frame_ice':
      // Muz sumalaklari (Glacial)
      return 'border-white shadow-[0_0_10px_rgba(255,255,255,0.4)] border-2';
    case 'b2':
    case 'frame_stealth':
      // Stealth Slate
      return 'border-white/20 border-2 bg-white/5';
    case 'b3':
    case 'frame_cyan':
      // Electric Cyan (Static)
       return 'border-cyan-400 border-2 shadow-[0_0_10px_rgba(0,240,255,0.2)]';
    case 'frame_pulse':
       return 'border-indigo-500 border-2 shadow-[0_0_15px_rgba(99,102,241,0.5)] animate-pulse';
    case 'frame_pixel':
       return 'border-[#CCFF00] border-2 shadow-[4px_4px_0_rgba(0,0,0,0.5)]';
    case 'frame_gold':
       return 'border-amber-400 border-[3px] shadow-[0_0_15px_#FBBF24]';
    case 'frame_nature':
       return 'border-green-600 border-[2.5px]';
    case 'frame_galaxy':
       return 'border-purple-600 border-2 bg-indigo-900/20';
    case 'frame_magic':
       return 'border-pink-400 border-2 shadow-[0_0_10px_#F472B6]';
    default: return defaultClass;
  }
}
