import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./WhackABanana.scss";

const WhackABanana = () => {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [rows, setRows] = useState(0);
  const [columns, setColumns] = useState(0);
  const [items, setItems] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    const today = new Date();
    const dayOfYear = getDayOfYear(today);

    const seededRandom = seedRandom(dayOfYear);

    const newRows = Math.floor(seededRandom() * 3) + 3; // 3 to 5 rows
    const newColumns = Math.floor(seededRandom() * 4) + 4; // 4 to 7 columns
    setRows(newRows);
    setColumns(newColumns);
    setItems(Array(newRows * newColumns).fill(null));

    // Check if the challenge is already completed
    const completed = localStorage.getItem("whackABananaCompleted") === "true";
    setIsCompleted(completed);

    // Get the high score from local storage
    const storedHighScore = localStorage.getItem("whackABananaHighScore");
    if (storedHighScore) {
      setHighScore(parseInt(storedHighScore, 10));
    }
  }, []);

  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
  }, [timeLeft, gameOver, gameStarted]);

  const endGame = () => {
    setGameOver(true);
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("whackABananaHighScore", score.toString());
    }
    if (!isCompleted && score >= 20) {
      setIsCompleted(true);
      localStorage.setItem("whackABananaCompleted", "true");
    }
  };

  const removeItem = useCallback((index) => {
    setItems((currentItems) => {
      const newItems = [...currentItems];
      newItems[index] = null;
      return newItems;
    });
  }, []);

  const spawnItem = useCallback(() => {
    setItems((currentItems) => {
      const newItems = [...currentItems];
      const emptySlots = newItems.reduce(
        (acc, item, index) => (item === null ? [...acc, index] : acc),
        []
      );

      if (emptySlots.length > 0) {
        const randomSlot =
          emptySlots[Math.floor(Math.random() * emptySlots.length)];
        const isBanana = Math.random() < 0.7; // 70% chance for banana, 30% for coconut
        newItems[randomSlot] = {
          type: isBanana ? "banana" : "coconut",
          createdAt: Date.now(),
        };

        setTimeout(() => removeItem(randomSlot), 2000); // Remove item after 2 seconds
      }

      return newItems;
    });
  }, [removeItem]);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      const interval = setInterval(spawnItem, 600); // Spawn items every 600ms
      return () => clearInterval(interval);
    }
  }, [gameStarted, gameOver, spawnItem]);

  const getDayOfYear = (date) => {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  };

  const seedRandom = (seed) => {
    const m = 2 ** 35 - 31;
    const a = 185852;
    let s = seed % m;
    return function () {
      return (s = (s * a) % m) / m;
    };
  };

  const handleWhack = (index) => {
    if (items[index]) {
      if (items[index].type === "banana") {
        setScore((prevScore) => prevScore + 1);
      } else if (items[index].type === "coconut") {
        setScore((prevScore) => Math.max(0, prevScore - 1)); // Prevent negative scores
      }
      removeItem(index);
    }
  };

  const handleGoBack = () => {
    navigate("/dashboard");
  };

  const renderItem = (item, index) => {
    return (
      <div
        key={index}
        className={`item ${item ? item.type : ""}`}
        onClick={() => handleWhack(index)}
      />
    );
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setTimeLeft(30);
    setGameOver(false);
    setItems(Array(rows * columns).fill(null));
  };

  return (
    <div className="whack-a-banana">
      <h2>Whack-a-Banana</h2>
      {isCompleted && (
        <div className="completion-message">
          Congratulations! You've completed the challenge with a high score of{" "}
          {highScore}!
        </div>
      )}
      {!gameStarted && (
        <>
          <h3>
            Whack as many bananas as you can in 30 seconds! Don't whack the
            coconuts!
          </h3>
          <h3>Whack at least 20 bananas to complete the challenge!</h3>
        </>
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
            <p>High Score: {highScore}</p>
          </div>
          <div
            className="item-grid"
            style={{
              gridTemplateColumns: `repeat(${columns}, 1fr)`,
              gridTemplateRows: `repeat(${rows}, 1fr)`,
              width: `${columns * 80}px`,
              height: `${rows * 80}px`,
            }}
          >
            {items.map((item, index) => renderItem(item, index))}
          </div>
        </>
      )}
      {gameOver && (
        <div className="game-over">
          <h3>Game Over!</h3>
          <p>Final Score: {score}</p>
          <p>High Score: {highScore}</p>
          <button onClick={startGame}>Play Again</button>
        </div>
      )}
      <button className="go-back" onClick={handleGoBack}>
        Back to Dashboard
      </button>
    </div>
  );
};

export default WhackABanana;
