import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./components/LoginPage/LoginPage";
import DashboardPage from "./components/Dashboard/Dashboard";
import QuoteQuest from "./components/Challenges/QuoteQuest/QuoteQuest";
import WordWhiz from "./components/Challenges/WordWhiz/WordWhiz";
import MemoryMatchMania from "./components/Challenges/MemoryMatchMania/MemoryMatchMania";
import WhackABanana from "./components/Challenges/WhackABanana/WhackABanana";
import BananaCatcher from "./components/Challenges/BananaCatcher/BananaCatcher";
import BananaPeelingRace from "./components/Challenges/BananaPeelingRace/BananaPeelingRace";
import BananaSplitBuilder from "./components/Challenges/BananaSplitBuilder/BananaSplitBuilder";
import BananaBalance from "./components/Challenges/BananaBalance/BananaBalance";
import BananaSpellingBee from "./components/Challenges/BananaSpellingBee/BananaSpellingBee";
import BananaRhythm from "./components/Challenges/BananaRhythm/BananaRhythm";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/challenge/quote-quest" element={<QuoteQuest />} />
        <Route path="/challenge/word-whiz" element={<WordWhiz />} />
        <Route
          path="/challenge/memory-match-mania"
          element={<MemoryMatchMania />}
        />
        <Route path="/challenge/whack-a-banana" element={<WhackABanana />} />
        <Route path="/challenge/banana-catcher" element={<BananaCatcher />} />
        <Route
          path="/challenge/banana-peeling-race"
          element={<BananaPeelingRace />}
        />
        <Route
          path="/challenge/banana-split-builder"
          element={<BananaSplitBuilder />}
        />
        <Route path="/challenge/banana-balance" element={<BananaBalance />} />
        <Route
          path="/challenge/banana-spelling-bee"
          element={<BananaSpellingBee />}
        />
        <Route path="/challenge/banana-rhythm" element={<BananaRhythm />} />
      </Routes>
    </Router>
  );
}

export default App;
