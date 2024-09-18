import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./BananaPeelingRaceStyles.scss";

const BananaPeelingRace = () => {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const completed =
      localStorage.getItem("bananaPeelingRaceCompleted") === "true";
    setIsCompleted(completed);
  }, []);

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
  }, [timeLeft, gameStarted]);

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setTimeLeft(10);
    setGameOver(false);
  };

  const endGame = () => {
    setGameOver(true);
    if (!isCompleted && score >= 60) {
      setIsCompleted(true);
      localStorage.setItem("bananaPeelingRaceCompleted", "true");
    }
  };

  const handlePeel = () => {
    if (gameStarted && !gameOver) {
      setScore(score + 1);
    }
  };

  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <div className="banana-peeling-race">
      <h2>Banana Peeling Race</h2>
      {isCompleted && (
        <div className="completion-message">
          Congratulations! You've completed the challenge and acquired your
          banana!
        </div>
      )}
      {!gameStarted && (
        <div className="instructions">
          <p>Peel as many bananas as you can in 10 seconds!</p>
          <p>Click or tap the banana to peel it.</p>
          <p>Peel at least 60 bananas to complete the challenge!</p>
        </div>
      )}
      {!gameStarted ? (
        <button className="start-button" onClick={startGame}>
          Start Game
        </button>
      ) : (
        <>
          <div className="game-info">
            <p>Score: {score}</p>
            <p>Time Left: {timeLeft}s</p>
          </div>
          <div className="banana-container" onClick={handlePeel}>
            <div className="banana"></div>
          </div>
        </>
      )}
      {gameOver && (
        <div className="game-over">
          <h3>Game Over!</h3>
          <p>Final Score: {score}</p>
          <button onClick={startGame}>Play Again</button>
        </div>
      )}
      <button className="go-back" onClick={handleGoBack}>
        Back to Dashboard
      </button>
    </div>
  );
};

export default BananaPeelingRace;
