import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MonkeyMazeStyles.scss";

const MonkeyMaze = () => {
  const navigate = useNavigate();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [bananas, setBananas] = useState([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const mazeSize = 8; // Increased from 5 to 8
  const totalBananas = 8; // Increased from 5 to 8
  const maxMoves = 25; // Increased from 15 to 25

  useEffect(() => {
    if (isPlaying) {
      window.addEventListener("keydown", handleKeyPress);
      return () => {
        window.removeEventListener("keydown", handleKeyPress);
      };
    }
  }, [isPlaying, position]);

  useEffect(() => {
    // Check if the challenge is already completed
    const completed = localStorage.getItem("monkeyMazeCompleted") === "true";
    setIsCompleted(completed);
  }, []);

  const startGame = () => {
    setPosition({ x: 0, y: 0 });
    setBananas(generateBananas());
    setScore(0);
    setMoves(0);
    setIsPlaying(true);
    setIsCompleted(false);
  };

  const generateBananas = () => {
    const newBananas = [];
    for (let i = 0; i < totalBananas; i++) {
      newBananas.push({
        x: Math.floor(Math.random() * mazeSize),
        y: Math.floor(Math.random() * mazeSize),
      });
    }
    return newBananas;
  };

  const handleKeyPress = (e) => {
    const key = e.key;
    let newPosition = { ...position };

    switch (key) {
      case "ArrowUp":
        newPosition.y = Math.max(0, position.y - 1);
        break;
      case "ArrowDown":
        newPosition.y = Math.min(mazeSize - 1, position.y + 1);
        break;
      case "ArrowLeft":
        newPosition.x = Math.max(0, position.x - 1);
        break;
      case "ArrowRight":
        newPosition.x = Math.min(mazeSize - 1, position.x + 1);
        break;
      default:
        return;
    }

    setPosition(newPosition);
    setMoves(moves + 1);
    checkBananaCollection(newPosition);

    if (moves + 1 >= maxMoves) {
      endGame();
    }
  };

  const checkBananaCollection = (newPosition) => {
    const collectedBanana = bananas.find(
      (banana) => banana.x === newPosition.x && banana.y === newPosition.y
    );

    if (collectedBanana) {
      const newBananas = bananas.filter((banana) => banana !== collectedBanana);
      setBananas(newBananas);
      setScore(score + 1);

      if (newBananas.length === 0) {
        completeChallenge();
      }
    }
  };

  const completeChallenge = () => {
    setIsPlaying(false);
    setIsCompleted(true);
    localStorage.setItem("monkeyMazeCompleted", "true");
  };

  const endGame = () => {
    setIsPlaying(false);
  };

  const handleGoBack = () => {
    navigate("/secret-game-room");
  };

  return (
    <div className="monkey-maze">
      <h2>Monkey Maze</h2>
      {isCompleted && (
        <div className="completion-message">
          Congratulations! You've completed the challenge and acquired your
          banana!
        </div>
      )}
      {!isPlaying && !isCompleted && (
        <div className="instructions">
          <p>Guide the monkey through the maze to collect all bananas!</p>
          <p>Use arrow keys to move.</p>
          <p>
            Collect all {totalBananas} bananas within {maxMoves} moves to
            complete the challenge!
          </p>
        </div>
      )}
      {!isPlaying && <button onClick={startGame}>Start Game</button>}
      {isPlaying && (
        <div className="game-area">
          <div className="score">
            Bananas: {score}/{totalBananas}
          </div>
          <div className="moves">
            Moves: {moves}/{maxMoves}
          </div>
          <div className="maze">
            {Array(mazeSize)
              .fill()
              .map((_, y) => (
                <div key={y} className="row">
                  {Array(mazeSize)
                    .fill()
                    .map((_, x) => (
                      <div key={x} className="cell">
                        {x === position.x && y === position.y && "🐒"}
                        {bananas.some(
                          (banana) => banana.x === x && banana.y === y
                        ) && "🍌"}
                      </div>
                    ))}
                </div>
              ))}
          </div>
        </div>
      )}
      {!isPlaying && score > 0 && (
        <div className="game-over">
          <h3>Game Over!</h3>
          <p>
            Bananas collected: {score}/{totalBananas}
          </p>
          <p>
            Moves used: {moves}/{maxMoves}
          </p>
          <button onClick={startGame}>Play Again</button>
        </div>
      )}
      <button className="go-back" onClick={handleGoBack}>
        Back to Secret Room
      </button>
    </div>
  );
};

export default MonkeyMaze;
