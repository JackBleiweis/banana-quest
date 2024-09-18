import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import BananaCounter from "../BananaCounter/BananaCounter";
import DateAndQuote from "../DateAndQuote/DateAndQuote";
import "./DashboardStyles.scss";

const Dashboard = () => {
  const navigate = useNavigate();
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [dailyChallenges, setDailyChallenges] = useState([]);
  const [showSecretButton, setShowSecretButton] = useState(false);
  const secretButtonRef = useRef(null);

  useEffect(() => {
    const today = new Date().toDateString();
    const storedDate = localStorage.getItem("lastChallengeDate");
    const storedChallenges = JSON.parse(
      localStorage.getItem("dailyChallenges")
    );

    if (storedDate !== today || !storedChallenges) {
      const newDailyChallenges = getRandomChallenges(5);
      setDailyChallenges(newDailyChallenges);
      localStorage.setItem("lastChallengeDate", today);
      localStorage.setItem(
        "dailyChallenges",
        JSON.stringify(newDailyChallenges)
      );
    } else {
      setDailyChallenges(storedChallenges);
    }

    // Move this outside the if-else block to always update completed challenges
    const completed = storedChallenges.filter(
      (id) => localStorage.getItem(getChallengeKey(id)) === "true"
    );
    setCompletedChallenges(completed);
  }, []); // Empty dependency array to run only on mount

  // Add a new useEffect to update completed challenges
  useEffect(() => {
    const completed = dailyChallenges.filter(
      (id) => localStorage.getItem(getChallengeKey(id)) === "true"
    );
    setCompletedChallenges(completed);
  }, [dailyChallenges]); // Run when dailyChallenges changes or component updates

  const getRandomChallenges = (count) => {
    const shuffled = challenges.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).map((challenge) => challenge.id);
  };

  // Helper function to get the localStorage key for each challenge
  const getChallengeKey = (id) => {
    switch (id) {
      case 1:
        return "quoteQuestCompleted";
      case 2:
        return "wordWhizCompleted";
      case 3:
        return "memoryMatchManiaCompleted";
      case 4:
        return "whackABananaCompleted";
      case 5:
        return "bananaCatcherCompleted";
      case 6:
        return "bananaBalanceCompleted";
      case 7:
        return "bananaSpellingBeeCompleted";
      case 8:
        return "bananaRhythmCompleted";
      case 9:
        return "bananaPeelingRaceCompleted";
      case 10:
        return "bananaSplitBuilderCompleted";
      default:
        return "";
    }
  };

  const challenges = [
    {
      id: 1,
      title: "Quote Quest",
      description:
        "Type out a famous quote as quickly and accurately as possible.",
      completed: false,
      completedAt: null,
    },
    {
      id: 2,
      title: "Word Whiz",
      description: "Everyones favourite word guessing game, now in color!",
      completed: false,
      completedAt: null,
    },
    {
      id: 3,
      title: "Memory Match Mania",
      description:
        "Flip over cards to find matching pairs. This isn't timed, so choose wisely!",
      completed: false,
      completedAt: null,
    },
    {
      id: 4,
      title: "Whack A Banana",
      description:
        "Test your reaction time by whacking bananas as they appear on the screen.",
      completed: false,
      completedAt: null,
    },
    {
      id: 5,
      title: "Banana Catcher",
      description:
        "Catch as many bananas as possible before they hit the ground.",
      completed: false,
      completedAt: null,
    },
    {
      id: 6,
      title: "Banana Balance",
      description:
        "Balance bananas on a monkey's head for as long as possible!",
      completed: false,
      completedAt: null,
    },
    {
      id: 7,
      title: "Banana Spelling Bee",
      description: "Spell words using banana-shaped letter tiles!",
      completed: false,
      completedAt: null,
    },
    {
      id: 8,
      title: "Banana Rhythm",
      description:
        "Tap to the beat of the music with banana-themed visual cues!",
      completed: false,
      completedAt: null,
    },
    {
      id: 9,
      title: "Banana Peeling Race",
      description: "Peel as many bananas as you can in 10 seconds!",
      completed: false,
      completedAt: null,
    },
    {
      id: 10,
      title: "Banana Split Builder",
      description: "Build banana splits according to customer orders!",
      completed: false,
      completedAt: null,
    },
  ];

  const handleBananaClick = () => {
    setShowSecretButton(true);
    setTimeout(() => {
      if (secretButtonRef.current) {
        secretButtonRef.current.focus();
      }
    }, 0);
  };

  const handleSecretButtonClick = () => {
    const goToSecretRoom = window.confirm(
      "Do you want to go to the secret game room?"
    );
    if (goToSecretRoom) {
      navigate("/secret-game-room");
    }
    setShowSecretButton(false);
  };

  const handleChallengeSelect = (challengeId) => {
    if (challengeId === "secret-game-room") {
      navigate("/secret-game-room");
    } else {
      navigate(`/challenge/${challengeId}`);
    }
  };

  const resetChallenges = () => {
    let confirm = window.confirm(
      "Are you sure you want to reset all challenges? This action cannot be undone (You will lose all your bananas)."
    );
    if (confirm) {
      const challengeIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      challengeIds.forEach((id) => {
        const challengeKey = getChallengeKey(id);
        localStorage.removeItem(challengeKey);
      });
      setCompletedChallenges([]);
    }
  };

  return (
    <div className="dashboard">
      <div onClick={handleBananaClick}>
        <BananaCounter completedChallenges={completedChallenges} />
      </div>
      {showSecretButton && (
        <button
          ref={secretButtonRef}
          className="secret-button"
          onClick={handleSecretButtonClick}
        >
          🍌
        </button>
      )}
      <DateAndQuote />
      <h1>Today's Banana Challenges</h1>
      <p>Completed: {completedChallenges.length}/5</p>
      <div className="challenge-grid">
        {dailyChallenges.map((challengeId) => {
          const challenge = challenges.find((c) => c.id === challengeId);
          return (
            <div
              key={challenge.id}
              className={`challenge-card ${
                completedChallenges.includes(challenge.id) ? "completed" : ""
              }`}
              onClick={() =>
                handleChallengeSelect(
                  challenge.title.replaceAll(" ", "-").toLowerCase()
                )
              }
            >
              <h2 className="challenge-title">{challenge.title}</h2>
              <p className="challenge-description">{challenge.description}</p>
              {completedChallenges.includes(challenge.id) && (
                <span className="completed-badge">
                  ✅ Banana Acquired 🍌 ✅
                </span>
              )}
            </div>
          );
        })}
      </div>
      <button className="reset-button" onClick={resetChallenges}>
        Reset Challenges
      </button>
    </div>
  );
};

export default Dashboard;
