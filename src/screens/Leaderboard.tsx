import { motion } from "motion/react";
import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, Share2, Trophy } from "lucide-react";
import BottomNav from "@/src/components/BottomNav";
import UserProfile from "@/src/components/UserProfile";
import { cn } from "@/src/lib/utils";

const RUNNER_DATA = {
  GLOBAL: {
    top: [
      { id: "2", rank: 2, name: "Zafar E.", km: "145.8 KM", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBaLjnWMoOFacgbDj7LFDBuQ8zazHoUR6RB1K1fEw5XEZIJv8YG-7rfDt9uppd4duF3VIj1-vFHfB-OyWjZ5MUryViis1zkX4MfGxZFlYz09VWPR__9gToEzSDcQASuTWi7prCEYv_ElCVg34oxoghoqSZxgvHBTMEPmDv3hqAyFCkzFEfctmaIk1s6nEyPgaKhhRyUe34spsMFUfnt6flGZhlArcwIYXsaUAyPUdQt0ieW3b5hcW7eXUbrb1tZeVjy1tV4XMdzmBgQ", runs: "12 runs" },
      { id: "4", rank: 1, name: "Alisher K.", km: "152.4 KM", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBaMBg52joH-qAkQ_jY3iH8yLB6U_pDgj6Xmw0BxRSSMoz5UNbNR60nhysJg0xUGRBQPEsrBnM5zkRwcxY8Bac3J-_-ldP3qWJnxegE3yaoXstEsAn8L0QFwOl7va0y5imAzOlAdyOiaZmCzeGq9UGry1CH2kGDL9SXugRD7XsLz3j_x4SxjrCCDgAqNh_dpijRjHcZlMbwmOw9uD1cwna2QP6n2IA1cJ2Tx9CFd1f36QlYvfllUhtn-Iw7y7eUC7tFcaIx2eGQzzln", runs: "15 runs" },
      { id: "5", rank: 3, name: "Elena R.", km: "138.2 KM", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCGclQQc8LODIZ6H8N-fjMAg3CmvDOvAKOhzQhaVCxKLMKyGpWBJ1ciPbskzXa8JW2zqkmFkwykb_9eznoyQQnWg9-iI-bONF_ymGX6rUsalY1-p7FmoCevvVN3mDC5_X_ui-fgHOBDZ1zpDoC8QvZyYBGndgPkUkbgVS4VIz6A2_qgtiN43eDSKDkUd34q1Osn-t8L4mFmzgecCXXPC7H_TorcpW6EhWASLJdTrxrgW_cESLGKsvD3UoEboQ9KoR9zYnLVPKQHs3ta", runs: "10 runs" },
    ],
    list: Array.from({ length: 25 }, (_, i) => ({
      id: `${i + 10}`,
      rank: i + 4,
      name: `User ${i + 4}`,
      runs: `${Math.floor(Math.random() * 10) + 1} runs this week`,
      km: (120 - i * 2 + Math.random() * 2).toFixed(1),
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuC1McbeGl_zKRyvbTBhaRogz_HUGkJNaBnn7Vg1nOrAJCNJMC9dfXG6LaQTRIZ0PS03twJTc9zJKvWoRmn2FKZwV17-3TXe853ntB1G_-ZjLEU20lEvtmhpiw8tVolbaZOyvRiECaTnqw5QQ-CzLbNPKNGn1WvhsNR4Ikr415BjmEJTfogoJfAa3r4f47A_T62pswlqed8InLJ_lb6wlyl8Hn9HAnaCjmKs-cuTgQ28QfrN1FIFfWuGu0IIOhZ5PvUfHSmzC4Fpx9Ss"
    }))
  },
  UZBEKISTAN: {
    top: [
      { id: "6", rank: 2, name: "Jasur A.", km: "545.8 KM", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCt-BGP2rIQNAhh8uZ9yNq4vHhWli5RJKLOkz6LaIQWNZfzKMJahNuSm5U5KSUI5gs8krWAR07yJHfF-hswf3xEM1k9hmJqB76kYphN9DXxoS4ba4w8MTeV8IoEz7yMkNiTLknf6wwHZswe0seYYuLofz4kdoj2DFY54wlQ-m5YzQFduxgzTrRPE7feznTa3OC0YkZCcAjYQNs6qvwmHV2sNF-cgrL0BHOtkM-yY9XDyvQz5Uv_UwRt-WnaDNJt90sj-DPDNIsOlAH3", runs: "45 runs" },
      { id: "7", rank: 1, name: "Malika O.", km: "652.4 KM", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCF9N0P0vpMfYJ8ntdqwUDPHkIBJSUqaF5hpZtPAnF5yBV9SDReDamTub-SccnAFRgZ90nwuZzKUzoDkdfsykvgpSmnoOTOA0u4Xz7XeH7sVVOl0Kh1nTGomH7la-FbShK1jc8-ZuIe0PqcGeXugfPuCqoMVpfCFX9Q_pmXt0Xj3v4K9dEn48XBh8V3YBP-REpa8ZdIaaQZ18pN9hzWtuxN6K5-iYuy0zhsLYEy8FQU5dTZ5YzxHRu9nQAC9dNzbNP0L0tQiWO68kBG", runs: "52 runs" },
      { id: "8", rank: 3, name: "Sardor B.", km: "438.2 KM", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuD3YCm7s1IYFS64FaIKzZdALWBTb-i1skE6f9gp_7X1wXIiAOp8iZ_VXnC3Ov7c1QQKKSz6irfco-ZPfL3j3GHo3ChWBeV0ggEWdeW5Kof9z9nNLKNaQZsMouXNWW3T-gvTvUnCn2klQM-_wMyNXgJbiB0f0pidtZ-MIE5AYFrvALQDlD1ETV-KEB_w2c00GK4Vf7LO5GA6YOwodYzieYMtyGm_-6TV8Ikjt5tY2WhEmJI7NZrhFlsZuvjOwRMUrULPmjLQlqtbP65M", runs: "38 runs" },
    ],
    list: Array.from({ length: 25 }, (_, i) => ({
      id: `${i + 40}`,
      rank: i + 4,
      name: `User ${i + 4}`,
      runs: `${Math.floor(Math.random() * 30) + 5} runs this month`,
      km: (500 - i * 5 + Math.random() * 5).toFixed(1),
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuC1McbeGl_zKRyvbTBhaRogz_HUGkJNaBnn7Vg1nOrAJCNJMC9dfXG6LaQTRIZ0PS03twJTc9zJKvWoRmn2FKZwV17-3TXe853ntB1G_-ZjLEU20lEvtmhpiw8tVolbaZOyvRiECaTnqw5QQ-CzLbNPKNGn1WvhsNR4Ikr415BjmEJTfogoJfAa3r4f47A_T62pswlqed8InLJ_lb6wlyl8Hn9HAnaCjmKs-cuTgQ28QfrN1FIFfWuGu0IIOhZ5PvUfHSmzC4Fpx9Ss"
    }))
  },
  TASHKENT: {
    top: [
      { id: "9", rank: 2, name: "Dildora K.", km: "2145.8 KM", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBPheYBTH-qhPFK8JeHgulLJj99E0lGv-eSqj9oHo0vAfzotqjdEi84jl0JxtwAQYCirCBsTQmS0n-f5kaXs8-Z4AVt9ZiBQVdGHqLZDAyglH2dM9GCIsICR5tnIDeiHVb_hRQUfdyuj9-vGOkpjJz2xsjFX_Erm6JTJa4MCCM2DYrDzT1YXqzLMj0wXIrEbyX_8kUGoC86W5m6WPdbzDVkYIGHNkK0nms-AO0XhRt4LxDoHeHwLR70RpbaHB5E69kG9WXDkHjYf9g_", runs: "145 runs" },
      { id: "1", rank: 1, name: "Olimjon", km: "2552.4 KM", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuC1McbeGl_zKRyvbTBhaRogz_HUGkJNaBnn7Vg1nOrAJCNJMC9dfXG6LaQTRIZ0PS03twJTc9zJKvWoRmn2FKZwV17-3TXe853ntB1G_-ZjLEU20lEvtmhpiw8tVolbaZOyvRiECaTnqw5QQ-CzLbNPKNGn1WvhsNR4Ikr415BjmEJTfogoJfAa3r4f47A_T62pswlqed8InLJ_lb6wlyl8Hn9HAnaCjmKs-cuTgQ28QfrN1FIFfWuGu0IIOhZ5PvUfHSmzC4Fpx9Ss", runs: "155 runs" },
      { id: "6", rank: 3, name: "Jasur A.", km: "1938.2 KM", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCt-BGP2rIQNAhh8uZ9yNq4vHhWli5RJKLOkz6LaIQWNZfzKMJahNuSm5U5KSUI5gs8krWAR07yJHfF-hswf3xEM1k9hmJqB76kYphN9DXxoS4ba4w8MTeV8IoEz7yMkNiTLknf6wwHZswe0seYYuLofz4kdoj2DFY54wlQ-m5YzQFduxgzTrRPE7feznTa3OC0YkZCcAjYQNs6qvwmHV2sNF-cgrL0BHOtkM-yY9XDyvQz5Uv_UwRt-WnaDNJt90sj-DPDNIsOlAH3", runs: "130 runs" },
    ],
    list: Array.from({ length: 25 }, (_, i) => ({
      id: `${i + 70}`,
      rank: i + 4,
      name: `User ${i + 4}`,
      runs: `${Math.floor(Math.random() * 200) + 50} runs total`,
      km: (2000 - i * 20 + Math.random() * 20).toFixed(1),
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuC1McbeGl_zKRyvbTBhaRogz_HUGkJNaBnn7Vg1nOrAJCNJMC9dfXG6LaQTRIZ0PS03twJTc9zJKvWoRmn2FKZwV17-3TXe853ntB1G_-ZjLEU20lEvtmhpiw8tVolbaZOyvRiECaTnqw5QQ-CzLbNPKNGn1WvhsNR4Ikr415BjmEJTfogoJfAa3r4f47A_T62pswlqed8InLJ_lb6wlyl8Hn9HAnaCjmKs-cuTgQ28QfrN1FIFfWuGu0IIOhZ5PvUfHSmzC4Fpx9Ss"
    }))
  }
};

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState<keyof typeof RUNNER_DATA>("GLOBAL");
  const [metricTab, setMetricTab] = useState<"MASOFA" | "HUDUD" | "QADAM">("MASOFA");
  const [isLoading, setIsLoading] = useState(false);
  const [isStickyVisible, setIsStickyVisible] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const targetRef = useRef<HTMLDivElement>(null);

  const getMetricValue = (kmStr: string, type: "MASOFA" | "HUDUD" | "QADAM") => {
    const num = parseFloat(kmStr);
    if (type === "MASOFA") return { value: num.toFixed(1), label: "KM" };
    if (type === "HUDUD") return { value: Math.floor(num / 15).toString(), label: "HUDUD" };
    if (type === "QADAM") return { value: Math.floor(num * 1312).toLocaleString(), label: "QADAM" };
    return { value: "0", label: "" };
  };

  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);
  const scrollAccumulator = useRef(0);
  const lastScrollY = useRef(0);
  const scrollLock = useRef(false);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const currentScrollY = e.currentTarget.scrollTop;
    const delta = currentScrollY - lastScrollY.current;
    lastScrollY.current = currentScrollY;

    if (scrollLock.current) return;

    if (currentScrollY <= 10) {
      setIsHeaderCollapsed(false);
      scrollAccumulator.current = 0;
      return;
    }

    if ((delta > 0 && scrollAccumulator.current < 0) || (delta < 0 && scrollAccumulator.current > 0)) {
      scrollAccumulator.current = 0;
    }

    scrollAccumulator.current += delta;

    if (scrollAccumulator.current > 50) {
      setIsHeaderCollapsed(true);
      scrollAccumulator.current = 0;
      scrollLock.current = true;
      setTimeout(() => scrollLock.current = false, 400);
    } else if (scrollAccumulator.current < -50) {
      setIsHeaderCollapsed(false);
      scrollAccumulator.current = 0;
      scrollLock.current = true;
      setTimeout(() => scrollLock.current = false, 400);
    }
  };

  const handleTabChange = (tab: keyof typeof RUNNER_DATA) => {
    if (activeTab === tab) return;
    setIsLoading(true);
    setTimeout(() => {
      setActiveTab(tab);
      setIsLoading(false);
    }, 400); // Simulate network delay
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsStickyVisible(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (targetRef.current) {
      observer.observe(targetRef.current);
    }

    return () => {
      if (targetRef.current) {
        observer.unobserve(targetRef.current);
      }
    };
  }, [activeTab]);

  const { top, list } = RUNNER_DATA[activeTab];

  return (
    <div className="flex h-full flex-col bg-surface overflow-hidden">
      {/* Header */}
      <header className="z-50 bg-surface/95 backdrop-blur-md border-b border-white/5 shrink-0">
        <motion.div 
          animate={{ 
            marginTop: isHeaderCollapsed ? -72 : 0,
            opacity: isHeaderCollapsed ? 0 : 1
          }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="flex items-center justify-between p-4"
        >
          <button className="p-2 text-white/40 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="italic-black text-xl text-white uppercase tracking-tighter">Leaderboard</h1>
          <button className="p-2 text-primary hover:text-primary/80 transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
        </motion.div>
        {/* Tabs */}
        <div className="flex px-4 pb-1">
          {(["GLOBAL", "UZBEKISTAN", "TASHKENT"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`flex-1 py-3 text-center relative transition-all ${
                activeTab === tab ? "text-primary" : "text-white/30 hover:text-white"
              }`}
            >
              <span className="text-[10px] font-mono tracking-widest uppercase">{tab}</span>
              {activeTab === tab && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary shadow-[0_0_10px_rgba(204,255,0,0.5)]" />}
            </button>
          ))}
        </div>
        
        {/* Metric Tabs */}
        <div className="flex px-4 py-3 bg-surface/80 border-t border-white/5">
          <div className="flex w-full bg-black/40 rounded-xl p-1 border border-white/5 relative">
            {(["MASOFA", "HUDUD", "QADAM"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setMetricTab(tab)}
                className={`relative z-10 flex-1 py-2 text-[10px] rounded-lg font-bold font-mono tracking-widest uppercase transition-colors duration-300 ${
                  metricTab === tab 
                    ? "text-black" 
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                {tab === "HUDUD" ? "HUDUDLAR" : tab === "QADAM" ? "QADAMLAR" : "MASOFA"}
                {metricTab === tab && (
                  <motion.div
                    layoutId="activeMetricTab"
                    className="absolute inset-0 bg-primary rounded-lg -z-10 shadow-[0_0_10px_rgba(204,255,0,0.2)]"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Scrollable Content Area */}
      <motion.div 
        key={activeTab}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onScroll={handleScroll}
        className={cn("flex-1 overflow-y-auto pb-48 no-scrollbar", isLoading && "opacity-50")}
      >
        {/* Podium */}
        <div className="px-4 pt-8 pb-10 bg-gradient-to-b from-primary/5 via-transparent to-transparent">
          <div className="flex items-end justify-center gap-3 max-w-lg mx-auto">
            {top.map((runner) => (
              <motion.div 
                layout
                key={runner.rank} 
                className={`flex flex-col items-center flex-1 ${runner.rank === 1 ? "-mt-6" : ""}`}
                onClick={() => setSelectedUser({ ...runner, clan: "Runners Club" })}
              >
                <div className="relative mb-3 cursor-pointer">
                  <div className={`rounded-full p-1 border ${
                    runner.rank === 1 ? "h-24 w-24 border-primary shadow-[0_0_30px_rgba(204,255,0,0.3)]" : 
                    runner.rank === 2 ? "h-16 w-16 border-white/20" : "h-16 w-16 border-white/10"
                  }`}>
                    <img src={runner.avatar} alt={runner.name} className="w-full h-full rounded-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                  </div>
                  <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 italic-black px-2 rounded-sm text-[9px] uppercase tracking-widest ${
                    runner.rank === 1 ? "bg-primary text-black py-1 text-[10px] flex items-center gap-1 shadow-lg" : 
                    runner.rank === 2 ? "bg-white/20 text-white" : "bg-white/10 text-white/60"
                  }`}>
                    {runner.rank === 1 && <Trophy className="w-3 h-3" />} {runner.rank}
                  </div>
                </div>
                <p className="text-[10px] italic-black truncate w-full text-center text-white uppercase tracking-tight">{runner.name}</p>
                <p className="text-[11px] text-primary font-mono font-bold tracking-tighter">
                  {getMetricValue(runner.km, metricTab).value} {getMetricValue(runner.km, metricTab).label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* List */}
        <main className="px-5 space-y-3">
          {list.map((runner) => (
            <motion.div 
              layout
              key={runner.rank} 
              ref={runner.rank === 12 ? targetRef : null} 
              onClick={() => setSelectedUser({ ...runner, clan: "Runners Club" })}
              className={cn(
                "flex items-center gap-4 h-[60px] px-4 rounded-xl border border-white/5 group transition-all cursor-pointer",
                runner.rank === 12 && !isStickyVisible 
                  ? "bg-primary/20 border-primary/50 shadow-[0_0_20px_rgba(204,255,0,0.2)]" 
                  : "bg-card hover:border-primary/30"
              )}
            >
              <span className="text-xs font-mono text-white/20 w-6">{runner.rank}</span>
              <div className="h-12 w-12 rounded-full border border-white/10 p-0.5">
                <img src={runner.avatar} alt={runner.name} className="h-full w-full rounded-full object-cover grayscale group-hover:grayscale-0 transition-all" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-[13px] text-white uppercase tracking-tight">{runner.name}</p>
                <p className="text-[9px] text-white/30 font-mono uppercase tracking-widest">{runner.runs}</p>
              </div>
              <div className="text-right">
                <p className="italic-black text-lg text-primary leading-none">{getMetricValue(runner.km, metricTab).value}</p>
                <p className="text-[9px] text-white/30 font-mono uppercase tracking-widest">{getMetricValue(runner.km, metricTab).label}</p>
              </div>
            </motion.div>
          ))}
        </main>
      </motion.div>

      {/* User Rank Sticky - Absolute inside frame */}
      {isStickyVisible && (
        <div className="absolute bottom-[104px] left-0 right-0 px-5 pb-2 z-10">
          <div className="max-w-lg mx-auto bg-primary h-[65px] px-4 rounded-2xl flex items-center gap-4 shadow-[0_10px_30px_rgba(204,255,0,0.3)] border border-white/20">
            <span className="text-xs font-mono text-black/40 w-6">12</span>
            <div className="relative">
              <div className="h-12 w-12 rounded-full border-2 border-black/20 p-0.5">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1McbeGl_zKRyvbTBhaRogz_HUGkJNaBnn7Vg1nOrAJCNJMC9dfXG6LaQTRIZ0PS03twJTc9zJKvWoRmn2FKZwV17-3TXe853ntB1G_-ZjLEU20lEvtmhpiw8tVolbaZOyvRiECaTnqw5QQ-CzLbNPKNGn1WvhsNR4Ikr415BjmEJTfogoJfAa3r4f47A_T62pswlqed8InLJ_lb6wlyl8Hn9HAnaCjmKs-cuTgQ28QfrN1FIFfWuGu0IIOhZ5PvUfHSmzC4Fpx9Ss" 
                  alt="Me" 
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
              <div className="absolute -top-1 -right-1 h-4 w-4 bg-black border-2 border-primary rounded-full" />
            </div>
            <div className="flex-1">
              <p className="italic-black text-black text-[13px] uppercase tracking-tight">YOU (OLIMJON)</p>
              <p className="text-[9px] text-black/60 font-mono font-bold uppercase tracking-widest">Top 15% this week</p>
            </div>
            <div className="text-right">
              <p className="italic-black text-black text-2xl leading-none">{getMetricValue("84.2", metricTab).value}</p>
              <p className="text-[9px] text-black/60 font-mono uppercase tracking-widest">{getMetricValue("84.2", metricTab).label}</p>
            </div>
          </div>
        </div>
      )}

      {selectedUser && (
        <UserProfile 
          isOpen={!!selectedUser} 
          onClose={() => setSelectedUser(null)} 
          user={selectedUser} 
        />
      )}

      <BottomNav />
    </div>
  );
}
