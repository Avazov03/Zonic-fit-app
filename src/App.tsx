import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { CustomToaster } from "./components/Toaster";
import { cn } from "@/src/lib/utils";
import Login from "./screens/Login";
import Register from "./screens/Register";
import Onboarding from "./screens/Onboarding";
import Feed from "./screens/Feed";
import Profile from "./screens/Profile";
import UserProfile from "./screens/UserProfile";
import Leaderboard from "./screens/Leaderboard";
import MapRun from "./screens/MapRun";
import ActiveRun from "./screens/ActiveRun";
import Clan from "./screens/Clan";
import Market from "./screens/Market";
import PlanDetail from "./screens/PlanDetail";
import EventDetail from "./screens/EventDetail";
import NewsDetail from "./screens/NewsDetail";
import WatchPromo from "./screens/WatchPromo";

function StatsPlaceholder() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface text-white">
      <h1 className="italic-black text-2xl">Mashqlar (Tez kunda)</h1>
    </div>
  );
}

export default function App() {
  const activeTheme = localStorage.getItem("activeTheme");

  useEffect(() => {
    // Global reset once to satisfy user request for a fresh start
    const hasReset = localStorage.getItem("globalMarketReset_v4");
    if (!hasReset) {
      localStorage.setItem("userInventory", "[]");
      localStorage.removeItem("activeAvatarFrame");
      localStorage.setItem("globalMarketReset_v4", "true");
      window.dispatchEvent(new Event('activeFrameUpdate'));
      window.dispatchEvent(new Event('storage'));
    }
  }, []);

  return (
    <div className={cn(
      "flex h-screen w-full items-center justify-center bg-[#050505] overflow-hidden",
      activeTheme === 't1' && "theme-cyberpunk"
    )}>
      <div className={cn(
        "relative h-full w-full max-w-[430px] overflow-hidden bg-surface flex flex-col shadow-2xl transform-none",
        activeTheme === 't1' && "theme-cyberpunk"
      )} style={{ transform: 'translate3d(0,0,0)' }}>
        <Router>
          <CustomToaster />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/user/:userId" element={<UserProfile />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/map" element={<MapRun />} />
            <Route path="/active-run" element={<ActiveRun />} />
            <Route path="/stats" element={<StatsPlaceholder />} />
            <Route path="/clan" element={<Clan />} />
            <Route path="/market" element={<Market />} />
            <Route path="/plan/:id" element={<PlanDetail />} />
            <Route path="/event/:id" element={<EventDetail />} />
            <Route path="/news/:id" element={<NewsDetail />} />
            <Route path="/store/watch" element={<WatchPromo />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}
