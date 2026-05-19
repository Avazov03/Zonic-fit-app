import React from 'react';
import { Menu, ShoppingBag, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function WatchPromo() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#050505] text-white font-sans min-h-screen pb-24">
      {/* TopAppBar */}
      <nav className="fixed top-0 w-full z-50 bg-[#050505]/60 backdrop-blur-xl border-b border-white/10 shadow-sm flex justify-between items-center px-4 md:px-10 h-16">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="text-[#ccff00] hover:opacity-80 transition-opacity active:scale-95 duration-200"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
        <div className="text-2xl font-extrabold tracking-tighter text-[#ccff00]">ZONIC</div>
        <div className="flex items-center gap-4">
          <button className="text-[#ccff00] hover:opacity-80 transition-opacity active:scale-95 duration-200">
            <ShoppingBag className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Hero Section: Editorial Intro */}
      <header className="relative w-full h-[795px] flex items-end overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <img 
            alt="Luxury Watch Editorial" 
            className="w-full h-full object-cover" 
            src="https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=1200&q=80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80"></div>
        </div>
        <div className="relative z-10 w-full max-w-[1280px] mx-auto px-4 md:px-10 pb-24">
          <div className="max-w-2xl">
            <span className="text-sm font-semibold text-[#ccff00] uppercase tracking-widest mb-4 block">Smart Watch</span>
            <h1 className="text-5xl md:text-[64px] font-bold leading-tight mb-6">O'ZGARISHGA <br />TAYYORMISIZ?</h1>
            <p className="text-lg text-white/70 mb-8 leading-relaxed">Bizning yangi Zonic soatlarimiz bilan vaqtni va harakatingizni mutlaqo boshqacha his eting. Texnologiya va sport mukammal uyg'unligi.</p>
            <div className="flex gap-4">
              <button className="bg-[#ccff00] text-black px-8 py-4 text-sm font-semibold rounded-lg shadow-md hover:opacity-90 transition-all active:scale-95">Hoziroq oldindan buyurtma bering!</button>
            </div>
          </div>
        </div>
      </header>

      <main className="space-y-32 py-32">
        {/* Apple Section: The Precision of Design */}
        <section className="max-w-[1280px] mx-auto px-4 md:px-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-7 rounded-2xl overflow-hidden shadow-sm group">
            <img 
              alt="Apple Editorial" 
              className="w-full aspect-[4/5] object-cover group-hover:scale-105 transition-transform duration-700" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxim6BAnGacg4OqJdQhgZfzR8kYYKiywEoGEFgfs8cJOOHBjGmrLGZd8W14m-fvEhY0g6MVndS2O0EiZy4Cm5ZLSvq-7xQJO8zWFyp4Hd_vQ9cZ9_dgLc_EP8rpkTGpHIjhUI8WA8_y6349TzQ4ADq24jMUZ3MplC939xXb3sTIlKZO7XlgeDPeRY3AGiWMOjVz44zyYmnTwsrSm49jupevnpDh9Wn5P_0Zx7jRi5L5S7bsKJR6AV4DgI7kKKtON-e7eh-Fymq_Xd0" 
            />
          </div>
          <div className="md:col-span-5 md:pl-12">
            <div className="mb-12">
              <h2 className="text-[32px] font-bold mb-6">Mukammallik asosi</h2>
              <div className="space-y-6">
                <div className="p-6 bg-[#121212] rounded-xl border-l-4 border-[#ccff00]">
                  <p className="italic text-base text-white/70 leading-relaxed">
                      "Biz shunchaki soat yaratmadik; biz zamonaviy texnologiya va sportni bilagingizda birlashtirdik. Titanium va sapfir oynasi uni qimmatbaho taqinchoq kabi ko'rsatadi."
                  </p>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/10"></div>
                    <span className="text-xs font-semibold">— Zonic Ijodkorlari</span>
                  </div>
                </div>
                <p className="text-base text-white/70 leading-relaxed">
                    Har bir detal aniq. Har bir interaksiya silliq. Zonic Watch o'z hayotining har bir soniyasini qadrlaydiganlar uchun ideal tanlov.
                </p>
              </div>
            </div>
            <button className="border-[1.5px] border-[#ccff00] text-[#ccff00] px-8 py-3 text-sm font-semibold rounded-lg hover:bg-[#ccff00]/10 transition-colors">Batafsil ma'lumot</button>
          </div>
        </section>

        {/* Samsung Section: Modern Versatility */}
        <section className="bg-[#1a1a1a] py-32">
          <div className="max-w-[1280px] mx-auto px-4 md:px-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-5 order-2 md:order-1">
              <h2 className="text-[32px] font-bold mb-6">Aylana mukammallik</h2>
              <div className="space-y-6 mb-8">
                <div className="p-6 bg-[#050505] rounded-xl shadow-sm">
                  <p className="italic text-base text-white/70 leading-relaxed">
                      "Soatning aylanma yuzasi eng qulay boshqaruv panelidir. Zonic sizga harakat paytida ham oson boshqaruvni taqdim etadi."
                  </p>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/10"></div>
                    <span className="text-xs font-semibold">— Texnologiya ekspertlari</span>
                  </div>
                </div>
                <p className="text-base text-white/70 leading-relaxed">
                    Zonic orqali ekstremal sarguzashtlar va kundalik muvaffaqiyatlar o'rtasidagi chegara yo'qoladi.
                </p>
              </div>
              <button className="bg-[#ccff00] text-black px-8 py-3 text-sm font-semibold rounded-lg shadow-md hover:opacity-90 transition-all">Buyurtma qilish</button>
            </div>
            <div className="md:col-span-7 order-1 md:order-2 rounded-2xl overflow-hidden shadow-sm group">
              <img 
                alt="Samsung Editorial" 
                className="w-full aspect-[16/9] object-cover group-hover:scale-105 transition-transform duration-700" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCahDgW3c51cTfPuUbJ25CLDz0wEZwlneR7SpglePXCA_NYIcAP-ZOVnRie0qviuRwHThSUGzkVKsQO-CYgJdTJrOoOAfrkZD9D2TIQVW6HJ7nA8T8XbUJd-GPg5Add38cM-pT96W44jkeUK1BroZltebOzNWqUU_TllMhmUna7veQVNIHLB-s-j3qTbfU6pyrPNbn8izK3rQEg846xX8lleZoO-RxlIacEjf6ICsB-wNB9VR7LaaPl2H6HNH5nVrftnnzZcwe3dYoO" 
              />
            </div>
          </div>
        </section>

        {/* Garmin Section: The Apex of Performance */}
        <section className="max-w-[1280px] mx-auto px-4 md:px-10">
          <div className="relative rounded-3xl overflow-hidden h-[600px] flex items-center p-12 md:p-24">
            <div className="absolute inset-0 z-0">
              <img 
                alt="Garmin Lifestyle" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnHkOdPh9s8SKvaij6MAETeqmfa_cD_VVEs8i3h4jvs63BPevS43JNOssE_ELRykMlXWpAmvmaDFiEulnbYRRTHRbwE12ObohVTAJ714jSwib1Ljy9QJRsNJ71bQA5kLG-pLmnK5uwOjUc_hE-nZcfq2ckyAPPMVkMnL4s6a6f9wgVvD_DIKKe4DjYw_h6Qg0DjGxeXKjRhI6G_LBW-PMJoTjA52AZE2j1IQcf4CZYWF9lk-v0Adgcb1-gofWDut0MW7BOmoeByLZy" 
              />
              <div className="absolute inset-0 bg-black/40"></div>
            </div>
            <div className="relative z-10 max-w-lg text-white">
              <h2 className="text-[32px] font-bold text-white mb-6">Zonic: Chegarasiz kuch</h2>
              <p className="text-base mb-8 text-white/90 leading-relaxed">
                  "Agar maqsadingiz yangi marra va rekordlar bo'lsa, bu soat eng tog'ri tanlov. Professional darajadagi ko'rsatkichlar va aqlbovar qilmas batareya muddati." — Extreme jurnal.
              </p>
              <button className="bg-white text-[#050505] px-8 py-3 text-sm font-semibold rounded-lg hover:bg-opacity-90 transition-all active:scale-95">Xarid qilish</button>
            </div>
          </div>
        </section>

        {/* Product Grid: Editorial Selection */}
        <section className="max-w-[1280px] mx-auto px-4 md:px-10">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-[32px] font-bold">Zonic To'plami</h2>
              <p className="text-white/70 text-base mt-2">Bu yilning eng so'nggi va afzal ko'rilgan modellari.</p>
            </div>
            <button className="text-[#ccff00] text-sm font-semibold flex items-center gap-2">
              Barchasi <ArrowRight className="text-sm w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Product 1 */}
            <div className="group cursor-pointer">
              <div className="aspect-[1/1] bg-[#121212] rounded-xl overflow-hidden mb-6 relative">
                <img 
                  alt="Watch Selection 1" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuABhsfWqEO1LVWkYlXyORByPF61Hwj3LwzmnsdUrBBiLwDu9wr63bk-VZ36gT_ia-YLAgEbkHUAcJnYq2wKm9-ogc-QPQFAJRQdKF-q68te4_izTIAwE-D9mGrsCuneuEzSmuW8gnLB7hJHZHkaICFkF2GA98km5TPfWjzt1ELoL2YRMeHPghfYyJX1uOacadUTWDxKuWtKB0FwTakWiyxICqwXj0YwZeoyA7EUcWodTOCk2jC2neNqnjghwaJuy5TfwpqoZbXbDTxW" 
                />
                <div className="absolute top-4 right-4 bg-[#ccff00]/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-[#ccff00]">Maxsus taklif</div>
              </div>
              <p className="text-xs font-semibold text-white/50 uppercase tracking-tighter">Zonic</p>
              <h3 className="text-lg font-bold text-white mt-1">Zonic S1</h3>
              <p className="text-base text-white/70 mt-2">1,249,000 UZS</p>
            </div>
            {/* Product 2 */}
            <div className="group cursor-pointer">
              <div className="aspect-[1/1] bg-[#121212] rounded-xl overflow-hidden mb-6">
                <img 
                  alt="Watch Selection 2" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCEsuB3-oolLdT4DcWyVY4c0lXRcgI-wthJfZ9BFJjHZPeUYtq05-fJc7i0ra7ZRcKn_3B4U8DuiLb4jH22y3faTGR8Dj6RrvFB2mTKc-s8QfE28fBC4W87eTUtC9Jclp0mn0xRz1y9QkTrwLyguiSZid-UchsF692ZAa3w5tdxoCSjOwLycMBcpv_gQSERaYc3URBJwtiVB79PG8eQkt6Owv5EpvMchhM5rGiRwJ5ojSPQunNjb01LzLtloRFUNyGiXQQqtXK92WDa" 
                />
              </div>
              <p className="text-xs font-semibold text-white/50 uppercase tracking-tighter">Zonic</p>
              <h3 className="text-lg font-bold text-white mt-1">Zonic Pro</h3>
              <p className="text-base text-white/70 mt-2">2,499,000 UZS</p>
            </div>
            {/* Product 3 */}
            <div className="group cursor-pointer">
              <div className="aspect-[1/1] bg-[#121212] rounded-xl overflow-hidden mb-6">
                <img 
                  alt="Watch Selection 3" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBF360hBtFM7jbYfitGQeVwxmnjUZuCNrXWRiVhkP58wb__3fxt6IrSnMhxM79dg1uZIg0qsteOW02I_sAt8D6vZ82g8T0hwKJwWIE0h8QSVoPE2MYOegsV3sapcVPDqawKabc6p0WnC1Cs1-hldTywB9eziRn6v3LI57hYsMxptJQe-njosjuNyApfhNa8WcogXGLuRmo13kgGQhRIOdqZ-mnfmezlQpLnm7K8gigv2Ll-AvyJ4EN4fsp47YNeoQxE9iMbYZIZX5eI" 
                />
              </div>
              <p className="text-xs font-semibold text-white/50 uppercase tracking-tighter">Zonic</p>
              <h3 className="text-lg font-bold text-white mt-1">Zonic Extreme</h3>
              <p className="text-base text-white/70 mt-2">3,100,000 UZS</p>
            </div>
            {/* Product 4 */}
            <div className="group cursor-pointer">
              <div className="aspect-[1/1] bg-[#121212] rounded-xl overflow-hidden mb-6 relative">
                <img 
                  alt="Watch Selection 4" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7Sd5rKeO3E21417ATK6hRF7raAzCjfnCZ34yq-_enUwNUjmQHECPl08imPQE5wDZZS44nA6KQ40wH8Lj4usKp_D6lYy5ixCWv16Lr3JzJbNWxDt6MtvOrdlAPoPM3qDUb6GJzzPQA2gnMD_ViaIrOKs5FIgPMgtNFEnTDS9ePQ1eckRguLdqQjTtFwCrKkj4EZWJHFHy-odwba4Urta5uV0qhKRmUCAJiPHiJn23WhPyYihgsUnTqGk2X4RjbI1F2I7RIoL8ES--8" 
                />
                <div className="absolute top-4 right-4 bg-[#ccff00] text-black px-3 py-1 rounded-full text-xs font-semibold">Maxsus nashr</div>
              </div>
              <p className="text-xs font-semibold text-white/50 uppercase tracking-tighter">Zonic</p>
              <h3 className="text-lg font-bold text-white mt-1">Lunar Edition</h3>
              <p className="text-base text-white/70 mt-2">1,899,000 UZS</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
