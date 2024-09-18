import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./BananaCatcher.scss";

const GAME_DURATION = 30; // seconds
const SPAWN_INTERVAL = 600; // milliseconds
const FALL_DURATION = 3000; // milliseconds

const BASKET_HEIGHT = 10; // percentage of game area height
const ITEM_SIZE = 30; // pixels

const BananaCatcher = () => {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [basketPosition, setBasketPosition] = useState(50);
  const [fallingItems, setFallingItems] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [highScore, setHighScore] = useState(0);

  const gameAreaRef = useRef(null);
  const basketPositionRef = useRef(50);

  useEffect(() => {
    const completed = localStorage.getItem("bananaCatcherCompleted") === "true";
    setIsCompleted(completed);
    const storedHighScore = localStorage.getItem("bananaCatcherHighScore");
    if (storedHighScore) {
      setHighScore(parseInt(storedHighScore, 10));
    }
  }, []);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            endGame();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameStarted, gameOver]);

  const endGame = () => {
    setGameOver(true);
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("bananaCatcherHighScore", score.toString());
    }
    if (!isCompleted && score >= 0) {
      setIsCompleted(true);
      localStorage.setItem("bananaCatcherCompleted", "true");
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setGameOver(false);
    setFallingItems([]);
  };

  const spawnItem = useCallback(() => {
    const newItem = {
      id: Date.now(),
      type: Math.random() < 0.7 ? "banana" : "coconut",
      position: Math.random() * 90 + 5, // 5% to 95% of screen width
      verticalPosition: 0,
    };
    setFallingItems((prevItems) => [...prevItems, newItem]);
  }, []);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      const spawnInterval = setInterval(spawnItem, SPAWN_INTERVAL);
      const fallInterval = setInterval(() => {
        setFallingItems((prevItems) =>
          prevItems
            .map((item) => ({
              ...item,
              verticalPosition:
                item.verticalPosition + (100 / FALL_DURATION) * 50,
            }))
            .filter((item) => item.verticalPosition < 100 - BASKET_HEIGHT)
        );
      }, 50);

      return () => {
        clearInterval(spawnInterval);
        clearInterval(fallInterval);
      };
    }
  }, [gameStarted, gameOver, spawnItem]);

  const handleMouseMove = useCallback((e) => {
    if (gameAreaRef.current) {
      const gameArea = gameAreaRef.current.getBoundingClientRect();
      const relativeX = e.clientX - gameArea.left;
      const newPosition = (relativeX / gameArea.width) * 100;
      const clampedPosition = Math.max(0, Math.min(100, newPosition));
      basketPositionRef.current = clampedPosition;
      setBasketPosition(clampedPosition);
    }
  }, []);

  useEffect(() => {
    const updateBasketPosition = () => {
      setBasketPosition(basketPositionRef.current);
      requestAnimationFrame(updateBasketPosition);
    };
    requestAnimationFrame(updateBasketPosition);
  }, []);

  const checkCollision = useCallback(
    (item) => {
      const basketWidth = 20; // percentage of game area width
      const itemCenter = item.position;
      const basketLeft = basketPosition - basketWidth / 2;
      const basketRight = basketPosition + basketWidth / 2;
      const basketTop = 100 - BASKET_HEIGHT; // percentage from top

      if (
        item.verticalPosition >= basketTop - ITEM_SIZE / 4 &&
        item.verticalPosition <= basketTop &&
        itemCenter >= basketLeft &&
        itemCenter <= basketRight
      ) {
        setFallingItems((prevItems) =>
          prevItems.filter((i) => i.id !== item.id)
        );
        if (item.type === "banana") {
          setScore((prevScore) => prevScore + 1);
        } else {
          setScore((prevScore) => Math.max(0, prevScore - 1));
        }
        return true;
      }
      return false;
    },
    [basketPosition]
  );

  useEffect(() => {
    if (gameStarted && !gameOver) {
      const collisionInterval = setInterval(() => {
        setFallingItems((prevItems) =>
          prevItems.filter((item) => !checkCollision(item))
        );
      }, 50);
      return () => clearInterval(collisionInterval);
    }
  }, [gameStarted, gameOver, checkCollision]);

  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <div className="banana-catcher" onMouseMove={handleMouseMove}>
      <h2>Banana Catcher</h2>
      {isCompleted && (
        <div className="completion-message">
          Congratulations! You've completed the challenge with a high score of{" "}
          {highScore}!
        </div>
      )}
      {!gameStarted ? (
        <div className="start-screen">
          <p>
            Catch as many bananas as you can in 30 seconds! Avoid the coconuts!
          </p>
          <button className="start-button" onClick={startGame}>
            Start Game
          </button>
        </div>
      ) : (
        <div
          className="game-area"
          ref={gameAreaRef}
          onMouseMove={handleMouseMove}
        >
          <div className="game-info">
            <p>Score: {score}</p>
            <p>Time Left: {timeLeft}s</p>
            <p>High Score: {highScore}</p>
          </div>
          <div className="falling-items">
            {fallingItems.map((item) => (
              <div
                key={item.id}
                className={`falling-item ${item.type}`}
                style={{
                  left: `${item.position}%`,
                  top: `${item.verticalPosition}%`,
                }}
              />
            ))}
          </div>
          <div
            className="basket"
            style={{
              left: `${basketPosition}%`,
              bottom: `${BASKET_HEIGHT}%`,
            }}
          />
        </div>
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

export default BananaCatcher;
