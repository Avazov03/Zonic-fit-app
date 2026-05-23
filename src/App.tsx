import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
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
import MarketComingSoon from "./screens/MarketComingSoon";
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
  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#050505] overflow-hidden">
      <div className="relative h-full w-full max-w-[430px] overflow-hidden bg-surface flex flex-col shadow-2xl transform-none" style={{ transform: 'translate3d(0,0,0)' }}>
        <Router>
          <Toaster 
            theme="dark" 
            position="top-center" 
            richColors 
            closeButton
            expand={false}
          />
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
            <Route path="/market" element={<MarketComingSoon />} />
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
