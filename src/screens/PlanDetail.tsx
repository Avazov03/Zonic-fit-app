import React from "react";
import { ChevronLeft, Share2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "motion/react";

export default function PlanDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const planIndex = id ? parseInt(id, 10) : 0;
  
  const allPlansData = [
    {
      title: "Boshlovchilar uchun to'liq tana mashqi",
      image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80",
      duration: "4 hafta · haftasiga 3 mashg'ulot",
      level: "Boshlang'ich",
      description: "Harakatga ilk qadam! Bu reja boshlovchilar uchun mo'ljallangan bo'lib, tanani faollashtiradi, holatni yaxshilaydi va muntazamlikni shakllantiradi. Asbob-uskunalar kerak emas.",
      days: [
        {
          day: "1-kun",
          exercises: [
            "Squat (o'z vaznida) - 3 × 12",
            "Devorga tayanib push-up - 3 × 10",
            "Glute ko'prik - 3 × 15",
            "Devorga suyanib turish - 3 × 30 soniya",
            "Tirsakda plank - 3 × 20 soniya",
            "Yengil cho'zilish - 5 daqiqa"
          ]
        },
        {
          day: "2-kun",
          exercises: [
            "Dam olish yoki yengil yurish (20-30 daqiqa)"
          ]
        },
        {
          day: "3-kun",
          exercises: [
            "Lunge (o'ng va chap oyoq) - 3 × 10 (har bir oyoqqa)",
            "Joyida yugurish - 3 × 1 daqiqa",
            "Qorin pressi (Crunch) - 3 × 15",
            "Yon plank (tizzada) - 2 × 20 soniya (har bir tomonga)",
            "Mushaklarni yozish (stretching) - 5 daqiqa"
          ]
        }
      ]
    },
    {
      title: "Ertalabki yugurish va nafas olish...",
      image: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&q=80",
      duration: "2 hafta · xar kuni",
      level: "Boshlang'ich",
      description: "Ertalabki energiya! Nafas olish mashqlari bilan uyg'unlashgan yengil yugurish kunni mukammal boshlashning kalitidir.",
      days: [
        {
          day: "1-kun",
          exercises: [
            "Chuqur nafas olish mashqlari - 5 daqiqa",
            "Yengil yurish - 10 daqiqa",
            "Yugurish (sekin tempda) - 15 daqiqa",
            "Stretching - 5 daqiqa"
          ]
        }
      ]
    },
    {
      title: "15 daqiqalik intensiv kardio mashqlari",
      image: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&q=80",
      duration: "3 hafta · haftasiga 4 mashg'ulot",
      level: "O'rta daraja",
      description: "Qisqa, ammo juda samarali. Qisqa vaqt ichida ko'proq kaloriya yoqish va chidamlilikni oshirish uchun mo'ljallangan intensiv kardio reja.",
      days: [
        {
          day: "1-kun",
          exercises: [
            "Jumping Jacks - 45 soniya, 15 soniya tanaffus",
            "High Knees - 45 soniya, 15 soniya tanaffus",
            "Burpees - 45 soniya, 15 soniya tanaffus",
            "Mountain Climbers - 45 soniya, 15 soniya tanaffus",
            "3 marta takrorlang"
          ]
        }
      ]
    },
    {
      title: "Qo'l va yelka mushaklarini o'stirish",
      image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80",
      duration: "6 hafta · haftasiga 3 mashg'ulot",
      level: "Ilg'or",
      description: "Keng elkalarga va baquvvat qo'llarga ega bo'lishni xoxlaysizmi? Bu reja aynan siz uchun tuzilgan. Turnik va gantellar talab qilinadi.",
      days: [
        {
          day: "1-kun",
          exercises: [
            "Turnikda tortilish (Pull-ups) - 4 × 8-10",
            "Push-ups (kengroq tutilish) - 4 × 15",
            "Biceps uchun gantel ko'tarish - 3 × 12",
            "Triceps uchun stolga tayanib push-up - 3 × 15"
          ]
        }
      ]
    },
    {
      title: "Marafonga tayyorgarlik kursi, loyiha",
      image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80",
      duration: "12 hafta · haftasiga 5 mashg'ulot",
      level: "Professional",
      description: "Haqiqiy sinovga tayyormisiz? 42km masofani zabt etish uchun professional tayyorgarlik dasturi. Ushbu dastur chidamlilik, tezlik va irodani shakllantiradi.",
      days: [
        {
          day: "1-kun",
          exercises: [
            "Yengil yugurish - 5 km",
            "Qadamni tezlashtirib yugurish (Strides) - 6 × 100 metr",
            "Yoyilish mashqlari - 10 daqiqa"
          ]
        }
      ]
    }
  ];

  const planData = allPlansData[planIndex] || allPlansData[0];

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
        <h1 className="text-lg font-bold text-white truncate max-w-[200px] text-center drop-shadow-md">
          {planData.title}
        </h1>
        <button className="w-10 h-10 rounded-full bg-white/10 backdrop-blur border border-white/10 flex items-center justify-center text-white">
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-40">
        {/* Cover Image */}
        <div className="relative w-full aspect-[4/3] bg-[#121212]">
          <img
            src={planData.image}
            alt="Plan Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="px-6 -mt-8 relative z-10">
          <div className="space-y-6">
            <div>
              <h2 className="text-[26px] font-bold leading-tight tracking-tight text-white mb-4">
                {planData.title}
              </h2>
              
              <div className="flex flex-col gap-2">
                <div className="flex items-center text-[15px]">
                  <span className="font-semibold text-white mr-2">Davomiyligi:</span>
                  <span className="text-white/70">{planData.duration}</span>
                </div>
                <div className="flex items-center text-[15px]">
                  <span className="font-semibold text-white mr-2">Daraja:</span>
                  <span className="text-[#ccff00] font-medium">{planData.level}</span>
                </div>
              </div>
            </div>

            <p className="text-[15px] leading-relaxed text-white/80 border-l-2 border-[#ccff00] pl-4 py-1">
              {planData.description}
            </p>

            <div className="pt-4 border-t border-white/10">
              <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 tracking-tight mb-6">
                Reja:
              </h3>
              
              <div className="space-y-8">
                {planData.days.map((dayObj, i) => (
                  <div key={i} className="relative">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-px bg-white/10 flex-1"></div>
                      <h4 className="text-[17px] font-bold text-[#ccff00]">{dayObj.day}</h4>
                      <div className="h-px bg-white/10 flex-1"></div>
                    </div>
                    
                    <ul className="space-y-3 px-4">
                      {dayObj.exercises.map((ex, j) => (
                        <li key={j} className="flex relative items-start gap-3 text-[15px] text-white/80 pl-2">
                          <span className="absolute left-0 top-2 w-1.5 h-1.5 rounded-full bg-[#ccff00]/60"></span>
                          <span className="leading-snug">{ex}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        </div>
      </div>

      {/* Fixed Bottom Action */}
      <div className="absolute bottom-0 w-full p-6 z-20 bg-gradient-to-t from-[#050505] via-[#050505] to-transparent pt-12">
        <button className="w-full bg-[#ccff00] text-black font-bold text-[16px] py-4 rounded-2xl shadow-[0_4px_14px_0_rgba(204,255,0,0.39)] hover:scale-[1.02] transition-transform active:scale-[0.98]">
          Mashqni boshlash
        </button>
      </div>
    </div>
  );
}
