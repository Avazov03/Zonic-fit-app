import React, { useState } from "react";
import { ChevronLeft, Share2, Calendar, MapPin, Activity, Footprints, Flag, CheckCircle2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

export default function EventDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isRegistered, setIsRegistered] = useState(false);

  const eventIndex = id ? parseInt(id, 10) - 1 : 0; // The route passes 1-indexed, so 1 -> 0.

  const allEventsData = [
    {
      title: "Run & Walk Challenge: Markaziy Osiyo",
      overlayTitle: "CENTRAL ASIA\nRUN & WALK CHALLENGE",
      image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&q=80",
      date: "1 - 21 may, 2026",
      location: "Markaziy Osiyo",
      activities: ["Yugurish", "Yurish"],
      type: "Chellenj",
      fullLocation: "Markaziy Osiyo (O'zbekiston, Qozog'iston, Qirg'iziston, Tojikiston)",
      description: "Zonic tomonidan tashkil etilgan Run & Walk Challenge: Central Asia chellengiga tayyormisiz? Ushbu mintaqaviy tadbirda ishtirok eting, o'z jismoniy holatingizni yaxshilang va boshqa ishtirokchilar bilan sog'lom raqobatlashing. Maqsad belgilang va unga erishing!"
    },
    {
      title: "Tungi marafon: Shahar nuri",
      overlayTitle: "NIGHT CITY\nMARATHON 2026",
      image: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&q=80",
      date: "10 iyun, 2026",
      location: "Toshkent",
      activities: ["Yugurish"],
      type: "Marafon",
      fullLocation: "Toshkent shahri markaziy ko'chalari",
      description: "Yozning salqin tunida shahar chiroqlari ostida yugurish zavqini his qiling. Har qanday yoshdagi va darajadagi yuguruvchilar uchun 5km, 10km va 21km masofalar mavjud."
    },
    {
      title: "Oila bilan birga: Sport kuni",
      overlayTitle: "FAMILY TIME\nSPORTS DAY",
      image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80",
      date: "12 iyul, 2026",
      location: "Ekopark",
      activities: ["Yugurish", "Sayohat"],
      type: "Oilaviy tadbir",
      fullLocation: "Toshkent shahri, Ekopark",
      description: "Oilangiz bilan sog'lom va qiziqarli vaqt o'tkazing. Bolalar uchun maxsus estafetalar va kattalar uchun yengil yugurish musobaqalari tashkil etiladi."
    },
    {
      title: "Tog' yugurish chellenji",
      overlayTitle: "MOUNTAIN\nTRAIL CHALLENGE",
      image: "https://images.unsplash.com/photo-1544367567056-b80c5ce60c5a?w=800&q=80",
      date: "5 avgust, 2026",
      location: "Chorvoq",
      activities: ["Trail Running"],
      type: "Ekstremal",
      fullLocation: "Toshkent viloyati, Chorvoq tog'lari",
      description: "Tog' yonbag'irlarida o'z irodangiz va chidamliligingizni sinab ko'ring. 15km lik qiyin yo'nalish tabiat go'zalligi bilan uyg'unlashgan."
    },
    {
      title: "Xayriya yugurishi 2026",
      overlayTitle: "RUN FOR\nA CAUSE",
      image: "https://images.unsplash.com/photo-1452626038306-6a536b000210?w=800&q=80",
      date: "2 sentyabr, 2026",
      location: "Samarqand",
      activities: ["Yugurish"],
      type: "Xayriya",
      fullLocation: "Samarqand shahri, Registon maydoni",
      description: "Har bir qadamingiz yaxshilikka xizmat qiladi. To'plangan mablag'lar ijtimoiy himoyaga muhtoj bolalarni qo'llab-quvvatlash jamg'armasiga o'tkaziladi."
    }
  ];

  const eventData = allEventsData[eventIndex] || allEventsData[0];

  const handleRegister = () => {
    setIsRegistered(true);
  };

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

      <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
        {/* Cover Image */}
        <div className="relative w-full aspect-[4/3] bg-[#121212]">
          <img
            src={eventData.image}
            alt="Event Cover"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent"></div>
          
          <div className="absolute bottom-6 left-6 right-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-widest leading-tight uppercase italic drop-shadow-lg whitespace-pre-line">
              {eventData.overlayTitle}
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pt-6 relative z-10 space-y-8">
          <div>
            <h2 className="text-[24px] font-bold leading-tight tracking-tight text-white mb-6">
              {eventData.title}
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center text-white/80">
                <Calendar className="w-5 h-5 mr-3 text-white/50" />
                <span className="text-[15px]">{eventData.date}</span>
              </div>
              <div className="flex items-center text-white/80">
                <MapPin className="w-5 h-5 mr-3 text-white/50" />
                <span className="text-[15px]">{eventData.location}</span>
              </div>
              <div className="flex items-center text-white/80">
                <Activity className="w-5 h-5 mr-3 text-white/50" />
                <span className="text-[15px] mr-4">Yugurish</span>
                <Footprints className="w-5 h-5 mr-3 text-white/50" />
                <span className="text-[15px]">Yurish</span>
              </div>
              <div className="flex items-center text-white/80">
                <Flag className="w-5 h-5 mr-3 text-white/50" />
                <span className="text-[15px]">{eventData.type}</span>
              </div>
            </div>
          </div>

          <div className="h-px w-full bg-white/10" />

          <div className="space-y-4">
            <div>
              <span className="font-bold text-white mr-2">Joylashuv:</span>
              <span className="text-white/80 leading-relaxed block sm:inline mt-1 sm:mt-0">{eventData.fullLocation}</span>
            </div>
            <div>
              <span className="font-bold text-white mr-2">Sanalar:</span>
              <span className="text-white/80 leading-relaxed block sm:inline mt-1 sm:mt-0">{eventData.date}</span>
            </div>
            <p className="text-[15px] leading-relaxed text-white/90 pt-4">
              {eventData.description}
            </p>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Action */}
      <div className="absolute bottom-0 w-full p-6 z-20 bg-gradient-to-t from-[#050505] via-[#050505] to-transparent pt-12">
        <AnimatePresence mode="wait">
          {!isRegistered ? (
            <motion.button 
              key="register"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={handleRegister}
              className="w-full bg-[#ccff00] text-black font-bold text-[16px] py-4 rounded-2xl shadow-[0_4px_14px_0_rgba(204,255,0,0.39)] hover:scale-[1.02] transition-transform active:scale-[0.98]"
            >
              Ro'yhatdan o'tish
            </motion.button>
          ) : (
            <motion.div 
              key="registered"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full bg-white/10 border border-[#ccff00]/50 backdrop-blur-md text-white font-bold text-[16px] py-4 rounded-2xl flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="text-[#ccff00] w-6 h-6" />
              Siz ro'yhatdan o'tdingiz
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
