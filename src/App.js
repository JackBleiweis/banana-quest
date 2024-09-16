import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./components/LoginPage/LoginPage";
import DashboardPage from "./components/Dashboard/Dashboard";
import QuoteQuest from "./components/Challenges/QuoteQuest/QuoteQuest";
import WordWhiz from "./components/Challenges/WordWhiz/WordWhiz";
import MemoryMatchMania from "./components/Challenges/MemoryMatchMania/MemoryMatchMania";
import WhackABanana from "./components/Challenges/WhackABanana/WhackABanana";
import BananaCatcher from "./components/Challenges/BananaCatcher/BananaCatcher";

// import ProfilePage from './pages/ProfilePage';
// import LeaderboardPage from './pages/LeaderboardPage';
// import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<LoginPage />} /> */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/challenge/quote-quest" element={<QuoteQuest />} />
        <Route path="/challenge/word-whiz" element={<WordWhiz />} />
        <Route
          path="/challenge/memory-match-mania"
          element={<MemoryMatchMania />}
        />
        <Route path="/challenge/whack-a-banana" element={<WhackABanana />} />
        <Route path="/challenge/banana-catcher" element={<BananaCatcher />} />
      </Routes>
    </Router>
  );
}

export default App;
