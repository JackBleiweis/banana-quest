import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BananaCounter from "../BananaCounter/BananaCounter";
import DateAndQuote from "../DateAndQuote/DateAndQuote";
import "./DashboardStyles.scss";

const Dashboard = () => {
  const navigate = useNavigate();
  const [completedChallenges, setCompletedChallenges] = useState([]);
  console.log(completedChallenges);
  useEffect(() => {
    const completedChallenges = [];
    const challengeIds = [1, 2, 3, 4, 5]; // Assuming these are the IDs of all challenges

    challengeIds.forEach((id) => {
      const challengeKey = getChallengeKey(id);
      if (localStorage.getItem(challengeKey) === "true") {
        completedChallenges.push(id);
      }
    });

    setCompletedChallenges(completedChallenges);
  }, []);

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
  ];

  const handleChallengeSelect = (challengeId) => {
    navigate(`/challenge/${challengeId}`);
  };

  const resetChallenges = () => {
    let confirm = window.confirm(
      "Are you sure you want to reset all challenges? This action cannot be undone (You will lose all your bananas)."
    );
    if (confirm) {
      const challengeIds = [1, 2, 3, 4, 5];
      challengeIds.forEach((id) => {
        const challengeKey = getChallengeKey(id);
        localStorage.removeItem(challengeKey);
      });
      setCompletedChallenges([]);
    }
  };

  return (
    <div className="dashboard">
      <BananaCounter completedChallenges={completedChallenges} />
      <DateAndQuote />
      {completedChallenges.length < 5 && <h1>Acquire Your Bananas</h1>}
      {completedChallenges.length < 5 ? (
        <p>Currently Completed: {completedChallenges.length}/5</p>
      ) : (
        <h2>
          All challenges completed! Come back tomorrow to acquire more bananas!
        </h2>
      )}
      <div className="challenge-grid">
        {challenges.map((challenge) => (
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
              <span className="completed-badge">✅ Banana Acquired 🍌 ✅</span>
            )}
          </div>
        ))}
      </div>
      <button className="reset-button" onClick={resetChallenges}>
        Reset Challenges
      </button>
    </div>
  );
};

export default Dashboard;
