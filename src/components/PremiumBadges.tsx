import React from 'react';

const BadgeDefs = () => (
  <defs>
    <filter id="drop-shadow-base" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#000" floodOpacity="0.15"/>
    </filter>
    <filter id="drop-shadow-red" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.3"/>
    </filter>
    <linearGradient id="glass-grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="rgba(255, 255, 255, 0.6)" />
      <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
    </linearGradient>
    <linearGradient id="grey-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#E5E7EB" />
      <stop offset="100%" stopColor="#9CA3AF" />
    </linearGradient>
    
    <linearGradient id="grad-orange" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#FDBA74" />
      <stop offset="100%" stopColor="#EA580C" />
    </linearGradient>
    <linearGradient id="grad-teal" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#6EE7B7" />
      <stop offset="100%" stopColor="#059669" />
    </linearGradient>
    <linearGradient id="grad-lightblue" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#FCA5A5" />
      <stop offset="100%" stopColor="#E11D48" />
    </linearGradient>
    <linearGradient id="grad-purple" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#C4B5FD" />
      <stop offset="100%" stopColor="#6D28D9" />
    </linearGradient>
    <linearGradient id="grad-green" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#86EFAC" />
      <stop offset="100%" stopColor="#16A34A" />
    </linearGradient>
    <linearGradient id="grad-blue" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#60A5FA" />
      <stop offset="100%" stopColor="#1D4ED8" />
    </linearGradient>
  </defs>
);

const HexagonPaths = {
  outer: "M60 5 L110 33.8 V86.2 L60 115 L10 86.2 V33.8 Z",
  inner: "M60 12 L102 36 V84 L60 108 L18 84 V36 Z",
  glossy: "M60 12 L102 36 V60 Q60 85 18 60 V36 Z"
};

const Sparkles = () => (
  <>
    <path d="M 35 30 L 36.5 36.5 L 43 38 L 36.5 39.5 L 35 46 L 33.5 39.5 L 27 38 L 33.5 36.5 Z" fill="#FFFFFF" opacity="0.9" />
    <path d="M 85 45 L 86 49 L 90 50 L 86 51 L 85 55 L 84 51 L 80 50 L 84 49 Z" fill="#FFFFFF" opacity="0.7" />
    <path d="M 40 80 L 41 83 L 44 84 L 41 85 L 40 88 L 39 85 L 36 84 L 39 83 Z" fill="#FFFFFF" opacity="0.5" />
  </>
);

const RedBadge = ({ text = "x0" }) => (
  <g transform="translate(95, 95)">
    <circle cx="0" cy="0" r="16" fill="#E11D48" filter="url(#drop-shadow-red)" stroke="#FFFFFF" strokeWidth="2" />
    <text x="0" y="4" fill="#FFFFFF" fontSize="12" fontWeight="bold" textAnchor="middle">{text}</text>
  </g>
);

const ShoeIcon = ({ shoeColor, stripeColor }: { shoeColor: string, stripeColor: string }) => (
  <g transform="translate(25, 35) scale(1.4)">
    <path d="M10 25 C 10 20, 15 15, 22 15 L 30 18 L 40 28 C 45 32, 45 38, 38 38 L 15 38 C 10 38, 8 32, 10 25 Z" fill={shoeColor} />
    <path d="M10 38 L 42 38 C 42 42, 38 42, 35 42 L 15 42 C 10 42, 8 40, 10 38 Z" fill="#FFFFFF" />
    <path d="M15 25 C 20 25, 25 28, 35 22" stroke={stripeColor} strokeWidth="3" strokeLinecap="round" fill="none" />
    <path d="M22 15 L 25 12 M 25 16 L 28 13 M 28 18 L 31 15" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
  </g>
);

const COLOR_CONFIGS = {
  orange: { shoe: '#3B82F6', stripe: '#FBBF24' },
  teal: { shoe: '#EC4899', stripe: '#FFFFFF' },
  lightblue: { shoe: '#2DD4BF', stripe: '#FFFFFF' },
  purple: { shoe: '#EC4899', stripe: '#FFFFFF' },
  green: { shoe: '#F97316', stripe: '#FFFFFF' },
  blue: { shoe: '#EAB308', stripe: '#FFFFFF' },
};

export type ColorfulBadgeColor = keyof typeof COLOR_CONFIGS;

export const ColorfulBadge = ({ colorId, className, badgeText = "x0" }: { colorId: ColorfulBadgeColor, className?: string, badgeText?: string }) => {
  const config = COLOR_CONFIGS[colorId];
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <BadgeDefs />
      <path d={HexagonPaths.outer} fill="#FFFFFF" filter="url(#drop-shadow-base)" />
      <path d={HexagonPaths.inner} fill={`url(#grad-${colorId})`} />
      <ShoeIcon shoeColor={config.shoe} stripeColor={config.stripe} />
      <path d={HexagonPaths.glossy} fill="url(#glass-grad)" />
      <Sparkles />
      <RedBadge text={badgeText} />
    </svg>
  );
};

export const GreyBadge = ({ number, icon, className }: { number: string, icon: React.ReactNode, className?: string }) => (
  <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <BadgeDefs />
    <path d={HexagonPaths.outer} fill="#FFFFFF" filter="url(#drop-shadow-base)" />
    <path d={HexagonPaths.inner} fill="url(#grey-grad)" />
    <path d={HexagonPaths.inner} fill="none" stroke="#FFFFFF" strokeWidth="2" opacity="0.4" />
    <text x="60" y="92" fill="#FFFFFF" opacity="0.6" fontSize="80" fontWeight="900" textAnchor="middle" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '-2px' }}>{number}</text>
    <foreignObject x="25" y="25" width="70" height="70">
      <div style={{ width: '100%', height: '100%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', filter: 'drop-shadow(0px 2px 3px rgba(0,0,0,0.3))' }}>
        {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { style: { width: '65%', height: '65%' } }) : icon}
      </div>
    </foreignObject>
    <path d={HexagonPaths.glossy} fill="url(#glass-grad)" />
    <Sparkles />
  </svg>
);
