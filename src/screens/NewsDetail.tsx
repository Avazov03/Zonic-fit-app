import React from "react";
import { ChevronLeft, Share2, Clock, Calendar } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "motion/react";

export default function NewsDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const newsIndex = id ? parseInt(id, 10) - 1 : 0;

  const allNewsData = [
    {
      title: "Yangi o'quv kursi",
      category: "Trening",
      date: "19 May, 2026",
      readTime: "3 daqiqa",
      image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80",
      content: `Yangi o'quv mavsumiga ajoyib tayyorgarlik!
      
Markazimizda tajribali va xalqaro toifadagi murabbiylar ishtirokida maxsus o'quv dasturlari joriy etildi. Bu dasturlar orqali siz jismoniy holatingizni yangi bosqichga olib chiqishingiz mumkin.

DASTUR AFZALLIKLARI:
• Individual yondashuv va maxsus reja
• Zamonaviy uskunalar bilan ishlash
• Mushaklarni to'g'ri rivojlantirish texnikasi
• Ovqatlanish tartibi bo'yicha maslahatlar

Ro'yxatdan o'tish boshlandi. Joylar soni cheklangan, shoshiling! O'zgarishni bugundan boshlang.`
    },
    {
      title: "Sog'lom ovqatlanish sirlari",
      category: "Nutritsiologiya",
      date: "18 May, 2026",
      readTime: "5 daqiqa",
      image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80",
      content: `To'g'ri ovqatlanish - bu chiroyli qomat va mustahkam sog'lik asosi.
      
Bizning yangi maqolamizda mutaxassislar kundalik ratsionni to'g'ri tuzish bo'yicha eng muhim maslahatlarni berib o'tishdi. Sifatli ovqatlanish orqali mashg'ulotlaringiz samarasini ikki baravar oshiring.

KUNDALIK RATSION QOIDALARI:
• Uglevodlar, oqsillar va yog'lar balansi
• Suv ichish tartibi va uning ahamiyati
• Mashg'ulotdan oldin va keyin ovqatlanish
• Foydali snek va shirinliklar o'rnini bosuvchi mahsulotlar

Yaqin kunlarda markazimizda ochiq dars bo'lib o'tadi va barcha savollaringizga mutaxassislarimizdan javob olishingiz mumkin.`
    },
    {
      title: "Yangi jihozlar keltirildi",
      category: "Markaz yangiliklari",
      date: "15 May, 2026",
      readTime: "2 daqiqa",
      image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80",
      content: `Sport zalimiz yana ham zamonaviy ko'rinishga ega bo'lmoqda!
      
Mijozlarimizning talab va istaklarini inobatga olgan holda, eng so'nggi rusumdagi 15 dan ortiq yangi trenajyorlar keltirildi.

YANGI QULAYLIKLAR:
• Eng aqlli kardio trenajyorlar (ekran, yurak urishini aniq o'lchash)
• Erkin vazn zonasining kengaytirilishi
• Maxsus crossfit hududi
• Izolyatsion harakatlar uchun yangi mexanik jihozlar

Yangi jihozlar orqali endi mashg'ulotlaringiz yanada xavfsiz va samarali o'tadi. Kelib, ularni o'zingiz sinab ko'ring!`
    }
  ];

  const newsData = allNewsData[newsIndex] || allNewsData[0];

  return (
    <div className="flex h-full w-full flex-col bg-[#050505] text-white overflow-hidden relative">
      {/* Header */}
      <div className="absolute top-0 w-full z-20 flex items-center justify-between px-4 pt-6 pb-4 bg-gradient-to-b from-black/80 to-transparent">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur border border-white/10 flex items-center justify-center text-white"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button className="w-10 h-10 rounded-full bg-white/10 backdrop-blur border border-white/10 flex items-center justify-center text-white">
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
        {/* Cover Image */}
        <div className="relative w-full aspect-[4/3] bg-[#121212]">
          <img
            src={newsData.image}
            alt="News Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="px-6 -mt-10 relative z-10 space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-block px-3 py-1 bg-[#ccff00]/20 text-[#ccff00] text-[11px] font-bold rounded-lg tracking-wider uppercase">
                {newsData.category}
              </span>
            </div>
            
            <h2 className="text-[24px] font-bold leading-tight tracking-tight text-white mb-4">
              {newsData.title}
            </h2>
            
            <div className="flex items-center gap-4 text-white/50 border-b border-white/10 pb-6">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span className="text-[13px]">{newsData.date}</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-white/20"></div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span className="text-[13px]">{newsData.readTime} o'qish</span>
              </div>
            </div>
          </div>

          <div className="prose prose-invert prose-p:text-white/80 prose-p:leading-relaxed prose-headings:text-white prose-li:text-white/80 max-w-none">
            {newsData.content.split('\n\n').map((paragraph, index) => {
              if (paragraph.includes('•')) {
                const lines = paragraph.split('\n');
                const title = lines[0];
                const items = lines.slice(1);
                
                return (
                  <div key={index} className="my-6">
                    {title && !title.startsWith('•') && (
                      <h3 className="text-lg font-bold text-[#ccff00] mb-3">{title}</h3>
                    )}
                    <ul className="space-y-2">
                      {items.map((item, i) => (
                        <li key={i} className="flex relative items-start gap-3 pl-2">
                          <span className="absolute left-0 top-2 w-1.5 h-1.5 rounded-full bg-[#ccff00]/60"></span>
                          <span className="leading-snug">{item.replace('• ', '')}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              }
              
              return (
                <p key={index} className="text-[15px] mb-4">
                  {paragraph}
                </p>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
