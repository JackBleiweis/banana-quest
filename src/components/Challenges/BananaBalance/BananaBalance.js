import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./BananaBalanceStyles.scss";
import monkeyHeadImage from "../../../assets/monkey-head.png";
import bananaImage from "../../../assets/banana.png";

const BananaBalance = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [bananaPosition, setBananaPosition] = useState(50);
  const [tiltDirection, setTiltDirection] = useState(0);

  useEffect(() => {
    const completed = localStorage.getItem("bananaBalanceCompleted") === "true";
    setIsCompleted(completed);
  }, []);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setTimeLeft(15);
    // Add a small random offset to the initial position
    setBananaPosition(50 + (Math.random() - 0.5) * 10);
    setTiltDirection(0);
  };

  const endGame = useCallback(() => {
    setGameOver(true);
    if (timeLeft === 0) {
      setIsCompleted(true);
      localStorage.setItem("bananaBalanceCompleted", "true");
    }
  }, [isCompleted, timeLeft]);

  const handleKeyDown = useCallback(
    (e) => {
      if (gameStarted && !gameOver) {
        if (e.key === "ArrowLeft") {
          setTiltDirection(-1);
        } else if (e.key === "ArrowRight") {
          setTiltDirection(1);
        }
      }
    },
    [gameStarted, gameOver]
  );

  const handleKeyUp = useCallback(() => {
    setTiltDirection(0);
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  useEffect(() => {
    let timerInterval;
    if (gameStarted && !gameOver) {
      timerInterval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerInterval);
            endGame();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [gameStarted, gameOver, endGame]);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      const gameInterval = setInterval(() => {
        setBananaPosition((prevPosition) => {
          const centerPosition = 50;
          const distanceFromCenter = prevPosition - centerPosition;
          const instabilityEffect = distanceFromCenter * 0.02;
          const tiltEffect = tiltDirection * 1.5;
          const newPosition = prevPosition + tiltEffect + instabilityEffect;

          if (newPosition < 0 || newPosition > 100) {
            endGame();
            return prevPosition;
          }
          return Math.max(0, Math.min(100, newPosition));
        });
      }, 50);

      return () => {
        clearInterval(gameInterval);
      };
    }
  }, [gameStarted, gameOver, tiltDirection, endGame]);

  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <div className="banana-balance">
      <h2>Banana Balance</h2>
      {isCompleted && (
        <div className="completion-message">
          Congratulations! You've completed the challenge and acquired your
          banana!
        </div>
      )}
      {!gameStarted && (
        <div className="instructions">
          <p>
            Balance the banana on the monkey's head for as long as possible!
          </p>
          <p>Use the left and right arrow keys to tilt the monkey's head.</p>
          <p>Balance for at least 15 seconds to acquire your banana!</p>
        </div>
      )}
      {!gameStarted ? (
        <button className="start-button" onClick={startGame}>
          Start Game
        </button>
      ) : (
        <>
          <div className="game-info">
            <p>Time: {timeLeft}</p>
          </div>
          <div className="game-area">
            <div className="monkey">
              <div
                className="head"
                style={{
                  backgroundImage: `url(${monkeyHeadImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  height: "100%",
                  width: "100%",
                  transform: `rotate(${tiltDirection * 10}deg)`,
                }}
              >
                <div
                  className="banana"
                  style={{
                    left: `${bananaPosition}%`,
                    backgroundImage: `url(${bananaImage})`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </>
      )}
      {gameOver && (
        <div className="game-over">
          <h3>Game Over!</h3>
          <p>Time Left: {timeLeft}</p>
          <button onClick={startGame}>Play Again</button>
        </div>
      )}
      <button className="go-back" onClick={handleGoBack}>
        Back to Dashboard
      </button>
    </div>
  );
};

export default BananaBalance;
