import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Sector } from 'recharts';

interface WeeklyProgressProps {
  data: number[]; // Array of values
  mode?: "hafta" | "oy" | "yil"; // Determines labels
}

// Hafta kunlari harflari
const LABELS_WEEK = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'];
// Oylik haftalar (H1, H2...)
const LABELS_MONTH = ['1X', '2X', '3X', '4X', '5X'];
// Yillik oylar (Y, F, M...)
const LABELS_YEAR = ['Ya', 'Fe', 'Ma', 'Ap', 'Ma', 'Iy', 'Iy', 'Av', 'Se', 'Ok', 'No', 'De'];

const renderCustomSector = (props: any) => {
  const { cx, cy, innerRadius, startAngle, endAngle, fill, index, payload } = props;
  const item = payload?.payload || payload || {};
  const isFuture = item.isFuture || false;
  const isToday = item.isToday || false;
  const isSelected = item.isSelected || false;
  const isAnySelected = item.isAnySelected || false;
  const activityVal = item.activityValue ?? 5;
  const mode = item.mode || "hafta";
  const totalLength = item.totalLength || 7;
  const iterIndex = item.iterIndex ?? index;
  
  // Animatsiya jarayonida Number o'zgaruvchilari NaN yoki undefined bo'lib qolishini oldini olamiz
  const safeCx = Number(cx) || 0;
  const safeCy = Number(cy) || 0;
  const safeStart = Number(startAngle) || 0;
  const safeEnd = Number(endAngle) || 0;

  const val = isFuture ? 10 : Math.max(activityVal, 15); 

  const maxOuter = 155;
  const minOuter = 93;
  
  // Natijani aniqlash: faqat bugungi kun aktiv.
  const isCurrentlyActive = isToday;
  const showActiveGlow = isCurrentlyActive && !isFuture;

  // O'tgan va aktiv ustunlar to'liq balandlikda (maxOuter) bo'ladi
  const customOuterRadius = !isFuture ? maxOuter : (minOuter + ((maxOuter - minOuter) * (val / 100)));
  
  // Ranglar mantiqi
  let sectorFill = "#CCFF00"; // O'tgan kunlar bilinar-bilinmas neon yashil
  let sectorOpacity = 0.25;

  if (isFuture) {
    sectorFill = "rgba(255, 255, 255, 0.1)";  // Kelajakdagi kunlar
    sectorOpacity = 0.2;
  } else if (showActiveGlow) {
    sectorFill = "#CCFF00"; // Faol bo'lgan ustun (bugungi kun)
    sectorOpacity = 1;
  }

  // Xavfsiz Y koordinatalari va markaz nuqtalar
  const RADIAN = Math.PI / 180;
  const midAngle = safeStart + (safeEnd - safeStart) / 2;
  
  // Natija har doim ustun ustida (tashqarisida) ko'rinadi
  const labelRadius = customOuterRadius + 11; 
  const labelX = safeCx + labelRadius * Math.cos(-midAngle * RADIAN);
  const labelY = safeCy + labelRadius * Math.sin(-midAngle * RADIAN);

  const showResult = (!isNaN(labelX) && !isNaN(labelY)) && !isFuture;

  // Natija radius (ustun tashqarisida)
  const outRadius = maxOuter + 18; 
  const outX = safeCx + outRadius * Math.cos(-midAngle * RADIAN);
  const outY = safeCy + outRadius * Math.sin(-midAngle * RADIAN);

  // Kun/Oy harfini ustuni qalinligi o'rtasida joylashtirish
  const defaultDayRadius = minOuter + (maxOuter - minOuter) / 2;
  const dayX = safeCx + defaultDayRadius * Math.cos(-midAngle * RADIAN);
  const dayY = safeCy + defaultDayRadius * Math.sin(-midAngle * RADIAN);

  let dayName = '';
  if (mode === "hafta") {
    dayName = LABELS_WEEK[iterIndex % 7] || '';
  } else if (mode === "yil") {
    dayName = LABELS_YEAR[iterIndex % 12] || '';
  } else if (mode === "oy") {
    dayName = LABELS_MONTH[iterIndex % 5] || '';
  }

  const showDay = (!isNaN(dayX) && !isNaN(dayY)) && dayName !== '';

  return (
    <g style={{ outline: 'none' }} className="outline-none focus:outline-none focus-visible:outline-none">
      {/* Background Track (Track barqaror turishi uchun) */}
      <Sector
        cx={safeCx}
        cy={safeCy}
        innerRadius={innerRadius}
        outerRadius={maxOuter}
        startAngle={safeStart}
        endAngle={safeEnd}
        fill="rgba(255, 255, 255, 0.03)"
        stroke="none"
      />

      {/* Glow effekti */}
      {showActiveGlow && (
        <Sector
          cx={safeCx}
          cy={safeCy}
          innerRadius={innerRadius}
          outerRadius={customOuterRadius}
          startAngle={safeStart}
          endAngle={safeEnd}
          fill="#CCFF00"
          cornerRadius={4}
          filter="url(#glowFilter)"
          opacity={0.4}
        />
      )}
      
      {/* Asosiy faollik ustuni */}
      <Sector
        cx={safeCx}
        cy={safeCy}
        innerRadius={innerRadius}
        outerRadius={customOuterRadius}
        startAngle={safeStart}
        endAngle={safeEnd}
        fill={sectorFill}
        opacity={sectorOpacity}
        stroke="none"
        cornerRadius={4}
      />
      
      {/* Milestone/Shtrix effekti */}
      <Sector
        cx={safeCx}
        cy={safeCy}
        innerRadius={customOuterRadius - 2}
        outerRadius={customOuterRadius}
        startAngle={safeStart}
        endAngle={safeEnd}
        fill={showActiveGlow ? "#CCFF00" : "transparent"}
        opacity={showActiveGlow ? 1 : 0}
        cornerRadius={1}
      />

      {/* Tepadagi natija (km2) qismi ustundan tashqarida ko'rsatiladi */}
      {showResult && (
        <g style={{ pointerEvents: 'none' }}>
          <text
            x={outX}
            y={outY}
            fill={showActiveGlow ? "#CCFF00" : "rgba(255, 255, 255, 0.6)"}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="12px"
            fontWeight="900"
          >
            {isFuture ? '-' : `${(activityVal * 0.15).toFixed(1)} km²`}
          </text>
        </g>
      )}

      {/* Kun/Oy nomi - Ustunni ichida markazda */}
      {showDay && (
        <text
          x={dayX}
          y={dayY}
          fill={showActiveGlow ? "#111111" : (isFuture ? "rgba(255, 255, 255, 0.3)" : "#CCFF00")}
          opacity={showActiveGlow ? 1 : 0.8}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="10px"
          fontWeight="900"
          style={{ pointerEvents: 'none' }}
        >
          {dayName}
        </text>
      )}
    </g>
  );
};

export const WeeklyProgress = ({ data, mode = "hafta" }: WeeklyProgressProps) => {
  const now = new Date();
  let currentIndex = 0;
  
  if (mode === "hafta") {
    // 0 = Du, 1 = Se, ..., 6 = Ya
    currentIndex = (now.getDay() + 6) % 7;
  } else if (mode === "oy") {
    // Hafta raqami (0 dan boshlab 4 gacha)
    currentIndex = Math.floor((now.getDate() - 1) / 7);
  } else if (mode === "yil") {
    // 0 = Yan, 1 = Fev...
    currentIndex = now.getMonth();
  }

  const chartData = data.map((val, i) => {
    const isFuture = i > currentIndex;
    const isToday = i === currentIndex;
    return {
      name: `Iter ${i}`,
      value: 1, 
      activityValue: val,
      isFuture,
      isToday,
      isSelected: false,
      isAnySelected: false,
      totalLength: data.length,
      iterIndex: i,
      mode
    };
  });
  
  // Custom Gradient ranglar chaqiruvi
  const getFill = (value: number) => {
    if (value > 70) return 'url(#colorHigh)'; 
    if (value > 30) return 'url(#colorMed)'; 
    return 'url(#colorLow)'; 
  };

  return (
    <div className="h-64 w-full relative outline-none focus:outline-none">
      <style dangerouslySetInnerHTML={{__html: `
        .h-64.w-full.relative *:focus, .h-64.w-full.relative *:focus-visible {
          outline: none !important;
          box-shadow: none !important;
        }
        .recharts-wrapper, .recharts-wrapper svg {
          overflow: visible !important;
        }
      `}} />
      <ResponsiveContainer width="100%" height="100%" className="outline-none focus:outline-none">
        <PieChart style={{ outline: 'none' }} className="outline-none focus:outline-none">
          <defs>
            {/* Porlash effekti */}
            <filter id="glowFilter" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            
            {/* Issiqlik xaritasi (Heatmap) Gradientlari */}
            <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#CCFF00" stopOpacity={1} />
              <stop offset="100%" stopColor="#558800" stopOpacity={0.8} />
            </linearGradient>
            <linearGradient id="colorMed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF9F43" stopOpacity={1} />
              <stop offset="100%" stopColor="#994400" stopOpacity={0.8} />
            </linearGradient>
            <linearGradient id="colorLow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00F0FF" stopOpacity={1} />
              <stop offset="100%" stopColor="#005B99" stopOpacity={0.8} />
            </linearGradient>
          </defs>

          {/* Orqa fon Track (kulrang yupqa hoshiya/yo'lak) */}
          <Pie
            data={chartData}
            cx="50%"
            cy="100%"
            startAngle={mode === "yil" ? 210 : 180}
            endAngle={mode === "yil" ? -30 : 0}
            innerRadius={93}
            outerRadius={155}
            paddingAngle={3}
            dataKey="value"
            stroke="none"
            fill="rgba(255, 255, 255, 0.04)"
            isAnimationActive={false}
          />
          
          {/* Asosiy faollik ustunlari */}
          <Pie
            data={chartData}
            cx="50%"
            cy="100%"
            startAngle={mode === "yil" ? 210 : 180}
            endAngle={mode === "yil" ? -30 : 0}
            innerRadius={93}
            outerRadius={93} // Base pie height is 0, so only activeShape shows the true height
            paddingAngle={3}
            dataKey="value"
            stroke="none"
            isAnimationActive={false}
            shape={(props: any) => renderCustomSector({
              ...props,
              payload: chartData[props.index]
            })}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.isFuture ? "transparent" : getFill(entry.activityValue)} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
