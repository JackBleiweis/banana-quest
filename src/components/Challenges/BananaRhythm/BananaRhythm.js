import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./BananaRhythmStyles.scss";

const BananaRhythm = () => {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [fallingItems, setFallingItems] = useState([]);
  const [combo, setCombo] = useState(0);

  const lanes = ["A", "S", "D", "F"];

  useEffect(() => {
    const completed = localStorage.getItem("bananaRhythmCompleted") === "true";
    setIsCompleted(completed);
  }, []);

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setGameOver(false);
    setFallingItems([]);
    setCombo(0);
    spawnItems();
  };

  const spawnItems = () => {
    if (gameOver) return;

    const newItem = {
      lane: Math.floor(Math.random() * 4),
      position: 100, // Start from the top
      id: Date.now(),
      type: Math.random() < 0.7 ? "banana" : "coconut", // 80% chance for banana, 20% for coconut
    };

    setFallingItems((prev) => [...prev, newItem]);

    setTimeout(spawnItems, Math.random() * 1000 + 500);
  };

  const handleKeyPress = useCallback(
    (e) => {
      if (!gameStarted || gameOver) return;

      const pressedLane = lanes.indexOf(e.key.toUpperCase());
      if (pressedLane === -1) return;

      // Add the 'pressed' class to the key element
      const keyElement = document.querySelector(
        `.lane:nth-child(${pressedLane + 1}) .key`
      );
      if (keyElement) {
        keyElement.classList.add("pressed");
        setTimeout(() => keyElement.classList.remove("pressed"), 100);
      }

      const hitItem = fallingItems.find(
        (item) =>
          item.lane === pressedLane && item.position > 0 && item.position < 20
      );

      if (hitItem) {
        if (hitItem.type === "banana") {
          setScore((prev) => prev + 10 + combo);
          setCombo((prev) => prev + 1);
        } else if (hitItem.type === "coconut") {
          setScore(0);
          setCombo(0);
        }
        setFallingItems((prev) =>
          prev.filter((item) => item.id !== hitItem.id)
        );
      } else {
        setCombo(0);
      }
    },
    [fallingItems, gameStarted, gameOver, combo, lanes]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const interval = setInterval(() => {
      setFallingItems((prev) => {
        const newItems = prev.map((item) => ({
          ...item,
          position: item.position - 2,
        }));

        const missedItems = newItems.filter((item) => item.position < 0);
        if (missedItems.length > 0) {
          setCombo(0);
        }

        return newItems.filter((item) => item.position >= 0);
      });
    }, 16);

    return () => clearInterval(interval);
  }, [gameStarted, gameOver]);

  useEffect(() => {
    if (score >= 200 && !isCompleted) {
      setIsCompleted(true);
      localStorage.setItem("bananaRhythmCompleted", "true");
    }
  }, [score, isCompleted]);

  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <div className="banana-rhythm">
      <h2>Banana Rhythm</h2>
      {isCompleted && (
        <div className="completion-message">
          Congratulations! You've completed the challenge and acquired your
          banana!
        </div>
      )}
      {!gameStarted && (
        <div className="instructions">
          <p>
            Hit the falling bananas with the correct keys (A, S, D, F) in time!
          </p>
          <p>Score at least 200 points to complete the challenge!</p>
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
            <p>Combo: {combo}</p>
          </div>
          <div className="game-area">
            {lanes.map((lane, index) => (
              <div key={lane} className="lane">
                <div className="key">{lane}</div>
                {fallingItems
                  .filter((item) => item.lane === index)
                  .map((item) => (
                    <div
                      key={item.id}
                      className={`falling-item ${item.type}`}
                      style={{ top: `${100 - item.position}%` }}
                    />
                  ))}
              </div>
            ))}
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

export default BananaRhythm;
