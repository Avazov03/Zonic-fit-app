import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, Coins, Search, Filter, Plus, ArrowRight,
  Swords, Image as ImageIcon, Palette, Smile, Shield, Award,
  Check, X, ShieldAlert, CreditCard, ShoppingBag, Sparkles
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "../components/Toaster";
import BottomNav from "../components/BottomNav";
import { cn, getFrameClasses } from "@/src/lib/utils";
import { AvatarFrame } from "../components/AvatarFrame";
import { PaymentSimulation } from "../components/PaymentSimulation";

import { useActiveFrame } from "../lib/hooks";

// --- MOCK DATA ---
const USER_AVATAR = "/badges/avazov.JPG";
const CATEGORIES = [
  { id: "challenge", label: "Chorlovlar", icon: Swords, color: "text-blue-400" },
  { id: "avatar", label: "Profillar", icon: ImageIcon, color: "text-purple-400" },
  { id: "theme", label: "Temalar", icon: Palette, color: "text-primary" },
  { id: "emote", label: "Emotsiyalar", icon: Smile, color: "text-orange-400" },
  { id: "frame", label: "Ramkalar", icon: Shield, color: "text-pink-400" },
  { id: "badge", label: "Nishonlar", icon: Award, color: "text-yellow-400" },
];

const PRODUCTS = [
  {
    id: "a1",
    categoryId: "avatar",
    name: "Neon Halqa Ramkasi",
    description: "Profilingiz uchun RGB ranglarda aylanuvchi zamonaviy ramka.",
    price: 25000,
    duration: "Daimiy",
    icon: ImageIcon,
    discount: null,
    type: "Premium",
    isPremium: true
  },
  {
    id: "a2",
    categoryId: "avatar",
    name: "Olovli Ramka",
    description: "Profilingiz atrofida olovli effekt va uchqunlar.",
    price: 30000,
    duration: "Daimiy",
    icon: ImageIcon,
    discount: "HOT",
    type: "Premium",
    isPremium: true
  },
  {
    id: "a3",
    categoryId: "avatar",
    name: "Kriogen Ramka",
    description: "Muzdan yasalgan chiroyli egilgan sumalaklari bor super ramka.",
    price: 22000,
    duration: "Daimiy",
    icon: ImageIcon,
    discount: null,
    type: "Premium",
    isPremium: true
  },
  {
    id: "a4",
    categoryId: "avatar",
    name: "Muzlik Ramkasi",
    description: "Klassik uslubdagi muz sumalaklari osilib turuvchi ramka.",
    price: 20000,
    duration: "Daimiy",
    icon: ImageIcon,
    discount: null,
    type: "Premium",
    isPremium: true
  },
  {
    id: "frame_minimal",
    categoryId: "avatar",
    name: "Minimalist Oq",
    description: "Toza va sodda oq rangli nozik ramka.",
    price: 450,
    duration: "Daimiy",
    icon: ImageIcon,
    discount: null,
    type: "Standart",
    isPremium: false
  },
  {
    id: "frame_tech",
    categoryId: "avatar",
    name: "Tech Future",
    description: "Geometrik shakllar va texnologik uslubdagi ramka.",
    price: 1200,
    duration: "Daimiy",
    icon: Shield,
    discount: "LIMITLI",
    type: "Standart",
    isPremium: false
  },
  {
    id: "frame_sport",
    categoryId: "avatar",
    name: "Elite Sport",
    description: "Sportchilar uchun mo'ljallangan dinamik va qalin ramka.",
    price: 800,
    duration: "Daimiy",
    icon: Swords,
    discount: null,
    type: "Standart",
    isPremium: false
  },
  {
    id: "b2",
    categoryId: "avatar",
    name: "Stealth Black",
    description: "Klassik qora va kulrang ohanglardagi minimalist ramka.",
    price: 150,
    duration: "Daimiy",
    icon: ImageIcon,
    discount: null,
    type: "Standart",
    isPremium: false
  },
  {
    id: "frame_pulse",
    categoryId: "avatar",
    name: "Pulsar Indigo",
    description: "Yurak urishi kabi pulsatsiyalanuvchi binafsha ramka.",
    price: 900,
    duration: "Daimiy",
    icon: ImageIcon,
    discount: null,
    type: "Standart",
    isPremium: false
  },
  {
    id: "frame_pixel",
    categoryId: "avatar",
    name: "Pixel Retro",
    description: "8-bit uslubidagi nostalgik pikselli ramka.",
    price: 600,
    duration: "Daimiy",
    icon: ImageIcon,
    discount: null,
    type: "Standart",
    isPremium: false
  },
  {
    id: "b3",
    categoryId: "avatar",
    name: "Electric Cyan",
    description: "Yorqin moviy rangdagi statik va toza ramka.",
    price: 300,
    duration: "Daimiy",
    icon: ImageIcon,
    discount: null,
    type: "Standart",
    isPremium: false
  },
  {
    id: "frame_gold",
    categoryId: "avatar",
    name: "Oltin Hashamat",
    description: "Haqiqiy g'oliblar uchun yaltiroq oltin rangli qalin ramka.",
    price: 5000,
    duration: "Daimiy",
    icon: ImageIcon,
    discount: "EXCLUSIVE",
    type: "Standart",
    isPremium: false
  },
  {
    id: "frame_nature",
    categoryId: "avatar",
    name: "Tabiat Kuchi",
    description: "Yashil barglar va tabiat ohanglari bilan bezatilgan ramka.",
    price: 1500,
    duration: "Daimiy",
    icon: ImageIcon,
    discount: null,
    type: "Standart",
    isPremium: false
  },
  {
    id: "frame_galaxy",
    categoryId: "avatar",
    name: "Galaktika",
    description: "Koinot sirlarini o'zida mujassam etgan yulduzli binafsha ramka.",
    price: 3500,
    duration: "Daimiy",
    icon: ImageIcon,
    discount: null,
    type: "Standart",
    isPremium: false
  },
  {
    id: "frame_magic",
    categoryId: "avatar",
    name: "Sehrli Uchqun",
    description: "Pushti rangli va yaltiroq uchqunlarga boy sehrli ramka.",
    price: 2800,
    duration: "Daimiy",
    icon: ImageIcon,
    discount: null,
    type: "Standart",
    isPremium: false
  },
  {
    id: "theme_cyber",
    categoryId: "theme",
    name: "Kiberpank 2077 Tema",
    description: "Ilova ranglarini sariq va qora neon uyg'unligiga o'zgartiring.",
    price: 1200,
    duration: "Daimiy",
    icon: Palette,
    discount: null,
    type: "Tema"
  },
  {
    id: "badge_nitro",
    categoryId: "badge",
    name: "Nitro Booster x2",
    description: "Yugurish davomida 2 baravar ko'p tajriba ochkolari va tangalar to'plang.",
    price: 300,
    duration: "1 Soat",
    icon: Shield,
    discount: "-15%",
    type: "Booster"
  },
  {
    id: "badge_levelup",
    categoryId: "badge",
    name: "Level Up Sertifikati",
    description: "Darajangizni (Level) darhol 1 pog'onaga ko'taring va yangi hududlar oching.",
    price: 800,
    duration: "1 marta",
    icon: Award,
    discount: null,
    type: "Bonus"
  }
];

export default function Market() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(parseInt(localStorage.getItem("userBalance") || "2500"));
  const [activeTab, setActiveTab] = useState<"shop" | "inventory">("shop");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [inventory, setInventory] = useState<string[]>(JSON.parse(localStorage.getItem("userInventory") || "[]"));
  const activeFrame = useActiveFrame();
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPayment, setShowPayment] = useState(false);

  // Clear everything once to satisfy user request for a fresh start
  useEffect(() => {
    const hasReset = localStorage.getItem("marketFreshReset_v10");
    if (!hasReset) {
      localStorage.setItem("userInventory", "[]");
      localStorage.removeItem("activeAvatarFrame");
      setInventory([]);
      localStorage.setItem("marketFreshReset_v10", "true");
      window.dispatchEvent(new Event('activeFrameUpdate'));
      window.dispatchEvent(new Event('storage'));
    }
  }, []);

  const handleRemoveFrame = () => {
    localStorage.removeItem("activeAvatarFrame");
    window.dispatchEvent(new Event('activeFrameUpdate'));
    window.dispatchEvent(new Event('storage'));
    toast.success("Ramka olib tashlandi, neon yashil ramkaga qaytildi");
  };

  const handleUse = (product: typeof PRODUCTS[0]) => {
    if (product.categoryId === "avatar") {
      localStorage.setItem("activeAvatarFrame", product.id);
      window.dispatchEvent(new Event('activeFrameUpdate'));
      toast.success(`"${product.name}" endi profilingizda faol!`);
    } else if (product.categoryId === "theme") {
      localStorage.setItem("activeTheme", product.id);
      toast.success(`"${product.name}" mavzusi qo'llanildi!`);
      window.location.reload();
    } else if (product.categoryId === "badge") {
      if (product.id === 'b2') {
        const currentLevel = parseInt(localStorage.getItem("userLevel") || "12");
        localStorage.setItem("userLevel", (currentLevel + 1).toString());
        toast.success(`Tabriklaymiz! Endi siz ${currentLevel + 1}-darajadasiz!`);
        // Remove from inventory after use
        const newInv = inventory.filter(id => id !== product.id);
        setInventory(newInv);
        localStorage.setItem("userInventory", JSON.stringify(newInv));
      } else {
        toast.success(`"${product.name}" ishlatildi!`);
      }
    } else if (product.categoryId === "challenge") {
      navigate('/clan');
    } else {
      toast.success(`"${product.name}" ishlatildi!`);
    }
  };

  const handlePurchase = () => {
    if (!selectedProduct) return;
    
    if (selectedProduct.isPremium) {
      setShowPayment(true);
      return;
    }

    if (balance < selectedProduct.price) {
      toast.error("Hisobingizda mablag' yetarli emas!", { duration: 3000 });
      return;
    }

    if (inventory.includes(selectedProduct.id)) {
      toast.info("Bu mahsulot sizda allaqachon mavjud.");
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const newBalance = balance - selectedProduct.price;
      const newInventory = [...inventory, selectedProduct.id];
      
      setBalance(newBalance);
      setInventory(newInventory);
      localStorage.setItem("userBalance", newBalance.toString());
      localStorage.setItem("userInventory", JSON.stringify(newInventory));
      
      setIsProcessing(false);
      setSelectedProduct(null);
      toast.success(`Tabriklaymiz! "${selectedProduct.name}" xarid qilindi.`);
    }, 1200);
  };

  const handlePaymentSuccess = () => {
    if (!selectedProduct) return;
    
    const newInventory = [...inventory, selectedProduct.id];
    setInventory(newInventory);
    localStorage.setItem("userInventory", JSON.stringify(newInventory));
    
    toast.success(`${selectedProduct.name} muvaffaqiyatli xarid qilindi!`);
    setShowPayment(false);
    
    if (selectedProduct.categoryId === "avatar") {
      localStorage.setItem("activeAvatarFrame", selectedProduct.id);
      // Force update of internal state to reflect change immediately
      window.dispatchEvent(new Event('activeFrameUpdate'));
      window.dispatchEvent(new Event('storage'));
      setTimeout(() => navigate('/profile'), 800);
    }
    
    setSelectedProduct(null);
  };

  return (
    <div className="relative h-full w-full bg-[#050505] flex flex-col overflow-hidden font-sans">
      
      {/* BACKGROUND GLOW */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[300px] h-[200px] bg-primary/20 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* Top Navbar Fixed */}
      <div className="pt-12 px-6 pb-4 relative z-20 flex items-center justify-between">
        <button 
          onClick={() => navigate('/feed')}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white active:scale-95 transition-all hover:bg-white/10 backdrop-blur-md"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        {/* USER BALANCE */}
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2.5 rounded-full backdrop-blur-md">
          <span className="text-white font-black">{balance}</span>
          <Coins className="w-5 h-5 text-primary" />
        </div>

        <button 
          onClick={() => setActiveTab('inventory')}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white active:scale-95 transition-all hover:bg-white/10 relative backdrop-blur-md"
        >
          <ShoppingBag className="w-5 h-5" />
          <div className="absolute -top-1 -right-1 bg-primary text-black text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#050505]">
            {inventory.length}
          </div>
        </button>
      </div>

      {/* Main scrollable area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden relative z-10 w-full customize-scrollbar safe-bottom pb-24">
        {/* PAGE CONTENT */}
        <div className="px-6 pb-6 relative z-10">

        {/* Search & Filter */}
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Qidirish..."
              className="w-full bg-white/10 border border-white/5 rounded-full h-[52px] pl-14 pr-4 text-white text-sm font-medium placeholder:text-white/40 focus:outline-none focus:border-white/20 transition-colors shadow-inner"
            />
          </div>
          <button className="w-[52px] h-[52px] shrink-0 rounded-full bg-white/10 border border-white/5 flex items-center justify-center text-white active:scale-95 transition-all hover:bg-white/20">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* MAIN WHITE/DARK SHEET */}
      <div className="bg-[#0D0D0D] rounded-t-[40px] min-h-screen px-6 pt-6 pb-32 border-t border-white/5 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] relative z-20">
        
        {/* SEGMENTED CONTROL */}
        <div className="flex bg-white/5 p-1.5 rounded-full mb-8 relative">
          <div 
            className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-full shadow-md transition-transform duration-300 ease-out"
            style={{ transform: activeTab === "shop" ? "translateX(0)" : "translateX(calc(100% + 12px))" }}
          />
          <button 
            onClick={() => setActiveTab("shop")}
            className={cn(
              "flex-1 py-3.5 rounded-full text-[13px] font-bold transition-colors relative z-10",
              activeTab === "shop" ? "text-black" : "text-white/50 hover:text-white/80"
            )}
          >
            Do'kon
          </button>
          <button 
            onClick={() => setActiveTab("inventory")}
            className={cn(
              "flex-1 py-3.5 rounded-full text-[13px] font-bold transition-colors relative z-10",
              activeTab === "inventory" ? "text-black" : "text-white/50 hover:text-white/80"
            )}
          >
            Inventarim
          </button>
        </div>

        {activeTab === "shop" && !activeCategory && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            
            {/* CATEGORIES */}
            <div>
              <h2 className="text-[17px] font-bold text-white tracking-tight mb-5">Kategoriyalar</h2>
              <div className="grid grid-cols-3 gap-3 mb-5">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className="bg-white/5 rounded-[24px] aspect-square flex flex-col items-center justify-center p-3 gap-3 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all active:scale-95 group"
                  >
                    <div className={cn("w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform", cat.color)}>
                      <cat.icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] leading-tight text-center font-semibold text-white/80 px-1">{cat.label}</span>
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setActiveCategory('all')}
                className="w-full py-4 bg-white/5 border border-white/5 hover:bg-white/10 rounded-full flex items-center justify-center gap-2 text-white/60 hover:text-white font-semibold text-[13px] transition-all active:scale-95"
              >
                Barcha mahsulotlar <ArrowRight className="w-4 h-4 text-white/40" />
              </button>
            </div>

            {/* DEALS / POPULAR */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[17px] font-bold text-white tracking-tight">Qaynoq Takliflar</h2>
                <button 
                  onClick={() => setActiveCategory('all')}
                  className="text-[13px] font-bold text-white/50 hover:text-white transition-colors"
                >
                  Barchasi
                </button>
              </div>
              
              <div className="flex gap-4 overflow-x-auto hide-scrollbar -mx-6 px-6 pb-4">
                {PRODUCTS.map(product => {
                  const isOwned = inventory.includes(product.id);
                  return (
                    <div 
                      key={product.id}
                      onClick={() => !isOwned && setSelectedProduct(product)}
                      className={cn(
                        "w-[145px] shrink-0 bg-white/[0.03] rounded-[28px] p-3 border border-white/5 relative flex flex-col group cursor-pointer transition-all hover:bg-white/5 hover:border-white/10",
                        isOwned && "opacity-50 grayscale cursor-not-allowed"
                      )}
                    >
                      {/* Discount Tag */}
                      {product.discount && !isOwned && (
                        <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-black px-2.5 py-1 rounded-bl-xl rounded-tr-[28px] shadow-lg z-10">
                          {product.discount}
                        </div>
                      )}
                      
                      {/* Image Box */}
                      <div className="w-full aspect-square bg-white/[0.03] border border-white/5 rounded-[20px] mb-3 flex items-center justify-center group-hover:scale-[1.02] transition-transform overflow-hidden relative">
                        {product.categoryId === 'avatar' ? (
                          <AvatarFrame src={USER_AVATAR} frameId={product.id} size="lg" />
                        ) : (
                          <product.icon className={cn("w-10 h-10", product.categoryId === 'challenge' ? 'text-primary' : 'text-white/80')} />
                        )}
                      </div>

                      <div className="flex-1 flex flex-col">
                        <h4 className="text-[13px] font-bold text-white leading-tight mb-1 truncate">{product.name}</h4>
                        <p className="text-[11px] font-medium text-white/40 mb-3">{product.duration}</p>
                        
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center gap-1">
                            <span className="text-[13px] font-black text-white">{Number(product.price).toLocaleString()}</span>
                            {product.isPremium ? (
                              <span className="text-[8px] font-black text-white/40 uppercase">UZS</span>
                            ) : (
                              <Coins className="w-3.5 h-3.5 text-primary" />
                            )}
                          </div>
                          
                          {isOwned ? (
                            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                              <Check className="w-3 h-3" />
                            </div>
                          ) : (
                            <button className="w-7 h-7 rounded-full bg-white/10 group-hover:bg-primary group-hover:text-black flex items-center justify-center text-white active:scale-95 transition-all">
                              <Plus className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </motion.div>
        )}

        {activeTab === "shop" && activeCategory && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="pb-6"
          >
            {/* Category Hero Header */}
            {activeCategory !== 'all' && CATEGORIES.find(c => c.id === activeCategory) &&(() => {
              const cat = CATEGORIES.find(c => c.id === activeCategory)!;
              return (
                <div className="relative overflow-hidden bg-white/5 border border-white/10 rounded-[32px] p-6 mb-8 flex items-center justify-between">
                  <div className="relative z-10">
                    <button 
                      onClick={() => setActiveCategory(null)}
                      className="w-10 h-10 mb-4 bg-black/40 border border-white/10 hover:border-white/20 rounded-full flex items-center justify-center text-white active:scale-95 transition-all backdrop-blur-md"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-2xl font-black text-white tracking-tight mb-1">{cat.label}</h2>
                    <p className="text-sm text-white/50 font-medium">Barcha {cat.label.toLowerCase()}</p>
                  </div>
                  <div className="relative z-10 flex items-center justify-center">
                    {cat.id === 'avatar' ? (
                      <div className="relative group">
                          <AvatarFrame 
                            src={USER_AVATAR} 
                            frameId={activeFrame} 
                            size="xl" 
                            showStatus={false}
                            className="shadow-2xl"
                          />
                          {activeFrame && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                localStorage.removeItem("activeAvatarFrame");
                                window.dispatchEvent(new Event('activeFrameUpdate'));
                                window.dispatchEvent(new Event('storage'));
                                toast.success("Ramka olib tashlandi, neon yashil ramkaga qaytildi");
                              }}
                            className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-red-500 border-2 border-[#111] flex items-center justify-center text-white shadow-xl active:scale-90 transition-transform z-30"
                            title="Ramkani olib tashlash"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className={cn("w-24 h-24 rounded-full flex items-center justify-center bg-white/5 border border-white/5 shadow-2xl", cat.color)}>
                         <cat.icon className="w-12 h-12" />
                      </div>
                    )}
                  </div>
                  {/* Background effect */}
                  <div className="absolute top-1/2 -right-12 -translate-y-1/2 w-48 h-48 bg-white/5 rounded-full blur-[40px] pointer-events-none" />
                </div>
              );
            })()}

            {activeCategory === 'all' && (
              <div className="flex items-center gap-3 mb-8 px-2">
                <button 
                  onClick={() => setActiveCategory(null)}
                  className="w-[42px] h-[42px] shrink-0 bg-white/5 border border-white/5 hover:bg-white/10 rounded-full flex items-center justify-center text-white active:scale-95 transition-all"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-2xl font-black text-white tracking-tight">
                  Barcha Mahsulotlar
                </h2>
              </div>
            )}
            
            {/* Filtered Products Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {PRODUCTS.filter(p => activeCategory === 'all' || p.categoryId === activeCategory).map(product => {
                      const isOwned = inventory.includes(product.id);
                      const isPremium = product.isPremium;
                      return (
                        <div 
                          key={product.id}
                          onClick={() => !isOwned && setSelectedProduct(product)}
                          className={cn(
                            "flex flex-col bg-white/[0.03] rounded-[28px] p-3 border border-white/5 relative group cursor-pointer transition-all hover:bg-white/5 hover:border-white/10",
                            isOwned && "opacity-60 cursor-not-allowed border-primary/10 bg-primary/[0.02]"
                          )}
                        >
                          {/* Premium/New/Discount Tag */}
                          <div className="absolute top-0 right-0 z-10">
                            {isOwned ? (
                              <div className="bg-primary/20 text-primary text-[9px] font-black px-2.5 py-1 rounded-bl-xl rounded-tr-[28px] border-b border-l border-primary/20 backdrop-blur-md">
                                OLINGAN
                              </div>
                            ) : isPremium ? (
                              <div className="bg-gradient-to-br from-[#FFD700] via-[#FDB931] to-[#9f7928] text-black text-[9px] font-black px-2.5 py-1 rounded-bl-xl rounded-tr-[28px] shadow-[0_0_15px_rgba(253,185,49,0.4)] border-b border-l border-white/30 backdrop-blur-sm">
                                PREMIUM
                              </div>
                            ) : product.discount ? (
                              <div className="bg-primary text-black text-[9px] font-black px-2.5 py-1 rounded-bl-xl rounded-tr-[28px] shadow-lg">
                                {product.discount}
                              </div>
                            ) : null}
                          </div>
                          
                          <div className={cn(
                            "w-full aspect-square bg-white/[0.03] border border-white/5 rounded-[20px] mb-3 flex items-center justify-center group-hover:scale-[1.02] transition-transform overflow-hidden relative",
                            isPremium && "border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.05)]"
                          )}>
                            {product.categoryId === 'avatar' ? (
                              <AvatarFrame src={USER_AVATAR} frameId={product.id} size="lg" />
                            ) : (
                              <product.icon className={cn("w-10 h-10", product.categoryId === 'challenge' ? 'text-primary' : 'text-white/80')} />
                            )}
                            
                            {isPremium && (
                              <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-center">
                                <Sparkles className="w-3 h-3 text-amber-500/50" />
                              </div>
                            )}
                          </div>

                    <div className="flex-1 flex flex-col">
                      <h4 className="text-[13px] font-bold text-white leading-tight mb-1 truncate">{product.name}</h4>
                      <p className="text-[11px] font-medium text-white/40 mb-3">{product.duration}</p>
                      
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-1">
                          <span className="text-[13px] font-black text-white">{Number(product.price).toLocaleString()}</span>
                          {product.isPremium ? (
                            <span className="text-[8px] font-black text-white/40">UZS</span>
                          ) : (
                            <Coins className="w-3.5 h-3.5 text-primary" />
                          )}
                        </div>
                        
                        {isOwned ? (
                          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                            <Check className="w-3 h-3" />
                          </div>
                        ) : (
                          <button className="w-7 h-7 rounded-full bg-white/10 group-hover:bg-primary group-hover:text-black flex items-center justify-center text-white active:scale-95 transition-all">
                            <Plus className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {PRODUCTS.filter(p => activeCategory === 'all' || p.categoryId === activeCategory).length === 0 && (
              <div className="py-20 text-center">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                  <Search className="w-8 h-8 text-white/20" />
                </div>
                <h3 className="text-white/60 font-medium">Bu ruknda hozircha mahsulot yo'q</h3>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "inventory" && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="pb-6"
          >
            <div className="flex items-center justify-between mb-2">
               <h3 className="text-xl font-bold text-white">Inventarim</h3>
               <button 
                  onClick={() => {
                    localStorage.setItem("userInventory", "[]");
                    localStorage.removeItem("activeAvatarFrame");
                    setInventory([]);
                    window.dispatchEvent(new Event('activeFrameUpdate'));
                    toast.success("Hamma ramkalar bekor qilindi (Reset)");
                  }}
                  className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all"
               >
                 Hammasini o'chirish
               </button>
            </div>
            {inventory.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10">
                  <ShoppingBag className="w-10 h-10 text-white/20" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Inventar bo'sh</h3>
                <p className="text-sm text-white/40 max-w-[200px] leading-relaxed">
                  Siz hali hech narsa xarid qilmadingiz. Do'kondan o'zingizga yoqqan narsani tanlang.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {inventory.map(itemId => {
                  const product = PRODUCTS.find(p => p.id === itemId);
                  if (!product) return null;
                  
                  const isActive = activeFrame === product.id;
                  
                  return (
                    <div 
                      key={product.id}
                      className={cn(
                        "flex flex-col bg-white/[0.03] rounded-[28px] p-3 border relative group transition-all",
                        isActive ? "border-primary bg-primary/[0.05] shadow-[0_0_20px_rgba(204,255,0,0.05)]" : "border-white/5"
                      )}
                    >
                      <div className={cn(
                        "absolute top-0 right-0 text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-bl-xl rounded-tr-[28px] z-10",
                        isActive ? "bg-primary text-black" : "bg-white/10 text-white/40"
                      )}>
                        {isActive ? "AKTIV" : "OLINGAN"}
                      </div>
                      
                      <div className="w-full aspect-square bg-white/[0.03] border border-white/5 rounded-[20px] mb-3 flex items-center justify-center overflow-hidden relative">
                        {product.categoryId === 'avatar' ? (
                          <AvatarFrame src={USER_AVATAR} frameId={product.id} size="lg" />
                        ) : (
                          <product.icon className={cn("w-10 h-10", product.categoryId === 'challenge' ? 'text-primary' : 'text-white/80')} />
                        )}
                      </div>

                      <div className="flex-1 flex flex-col">
                        <h4 className="text-[12px] font-black text-white leading-tight mb-2 truncate">{product.name}</h4>
                        <div className="mt-auto">
                          <button 
                            onClick={() => isActive ? handleRemoveFrame() : handleUse(product)}
                            className={cn(
                              "w-full py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-2",
                              isActive 
                                ? "bg-red-500/20 text-red-500 hover:bg-red-500/30" 
                                : "bg-white/10 hover:bg-white/20 text-white"
                            )}
                          >
                            {isActive ? (
                              <>
                                <X className="w-3 h-3" /> Olib tashlash
                              </>
                            ) : "ISHLATISH"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </div>

      </div>

      {/* PRODUCT DETAILS MODAL */}
      <AnimatePresence>
        {selectedProduct && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isProcessing && setSelectedProduct(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] transition-opacity"
            />
            
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto z-[100] bg-[#111111] rounded-t-[40px] border-t border-white/10 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] flex flex-col"
            >
              <div className="flex justify-center p-4 pb-0 relative">
                <div className="w-12 h-1.5 bg-white/10 rounded-full" />
                <button 
                  onClick={() => !isProcessing && setSelectedProduct(null)}
                  className="absolute p-2 right-4 top-4 bg-white/5 rounded-full text-white/50 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 pt-4 pb-10">
                <div className="w-full aspect-video rounded-[32px] bg-white/[0.02] border border-white/5 flex items-center justify-center mb-6 relative overflow-hidden">
                   {/* Cool background effect for image */}
                  <div className="absolute inset-0 bg-primary/5 rounded-full blur-[50px] scale-150" />
                  {selectedProduct.categoryId === 'avatar' ? (
                    <AvatarFrame src={USER_AVATAR} frameId={selectedProduct.id} size="xl" className="relative z-10" />
                  ) : (
                    <selectedProduct.icon className="w-16 h-16 text-white relative z-10" />
                  )}
                </div>

                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                       <div className="flex items-center gap-2">
                         <h2 className="text-2xl font-black text-white tracking-tight">{selectedProduct.name}</h2>
                         {selectedProduct.isPremium && (
                           <span className="px-2 py-0.5 bg-gradient-to-r from-amber-400 to-yellow-600 text-[8px] font-black uppercase text-black rounded-full border border-white/20 shadow-lg">
                             PREMIUM
                           </span>
                         )}
                       </div>
                       <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                       <span className="text-sm font-black text-white">{Number(selectedProduct.price).toLocaleString()}</span>
                       {selectedProduct.isPremium ? (
                         <span className="text-[10px] font-black text-white/40">UZS</span>
                       ) : (
                         <Coins className="w-4 h-4 text-primary" />
                       )}
                    </div>
                  </div>
                  <p className="text-sm font-medium text-white/50 leading-relaxed">
                    {selectedProduct.description}
                  </p>
                </div>

                <button 
                  onClick={handlePurchase}
                  disabled={isProcessing || (!selectedProduct.isPremium && balance < selectedProduct.price)}
                  className={cn(
                    "w-full h-[60px] rounded-[24px] flex items-center justify-center gap-2 font-black uppercase tracking-widest transition-all",
                    isProcessing 
                      ? "bg-white/10 text-white/50 cursor-wait" 
                      : selectedProduct.isPremium
                        ? "bg-primary text-black hover:scale-[0.98]"
                        : balance >= selectedProduct.price 
                          ? "bg-white text-black active:scale-[0.98] hover:bg-white/90" 
                          : "bg-red-500/10 text-red-500 border border-red-500/20 cursor-not-allowed"
                  )}
                >
                  {isProcessing ? (
                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  ) : !selectedProduct.isPremium && balance < selectedProduct.price ? (
                    <>
                      <ShieldAlert className="w-5 h-5" />
                      Mablag' yetarli emas
                    </>
                  ) : (
                    <>
                      {selectedProduct.isPremium ? <CreditCard className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
                      {selectedProduct.isPremium ? "Karta orqali to'lash" : "Sotib olish"}
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {showPayment && selectedProduct && (
        <PaymentSimulation 
          amount={selectedProduct.price}
          productName={selectedProduct.name}
          onSuccess={handlePaymentSuccess}
          onCancel={() => setShowPayment(false)}
        />
      )}

      <BottomNav />
    </div>
  );
}

