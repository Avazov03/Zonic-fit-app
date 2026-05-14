import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function MarketComingSoon() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/badges/market.png')" }}
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <h1 className="text-5xl font-black italic text-white uppercase tracking-tighter mb-4">
          Tez kunda
        </h1>
        <p className="text-white/80 text-lg font-medium mb-10 max-w-[300px]">
          Marketimiz ustida ishlayapmiz, tez orada siz uchun ochiladi!
        </p>
        
        <Link 
          to="/feed" 
          className="flex items-center gap-2 bg-primary text-black font-black uppercase tracking-widest px-8 py-4 rounded-full hover:scale-105 transition-transform"
        >
          <ArrowLeft className="w-5 h-5" />
          Bosh sahifaga
        </Link>
      </div>
    </div>
  );
}
