import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MonkeySeeMonkeyDoStyles.scss";

const MonkeySeeMonkeyDo = () => {
  const navigate = useNavigate();
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [currentHighlight, setCurrentHighlight] = useState(null);
  const [playerTurn, setPlayerTurn] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const actions = ["🐒", "🥥", "🙈", "🍍", "🙉", "🍌", "🙊"];

  useEffect(() => {
    if (isPlaying) {
      addToSequence(3);
    }
  }, [isPlaying]);

  const addToSequence = (count = 2) => {
    const newActions = Array(count)
      .fill()
      .map(() => actions[Math.floor(Math.random() * actions.length)]);
    const updatedSequence = [...sequence, ...newActions];
    setSequence(updatedSequence);
    playSequence(updatedSequence);
  };

  const playSequence = (seq) => {
    setPlayerTurn(false);
    seq.forEach((action, index) => {
      setTimeout(() => {
        setCurrentHighlight(action);
        setTimeout(() => setCurrentHighlight(null), 500);
      }, index * 1000);
    });
    setTimeout(() => {
      setPlayerSequence([]);
      setPlayerTurn(true);
    }, seq.length * 1000);
  };

  const handleGameCompletion = () => {
    setGameWon(true);
    setIsPlaying(false);
    localStorage.setItem("monkeySeeMonkeyDoCompleted", "true");
  };

  const handleActionClick = (action) => {
    if (!isPlaying || !playerTurn) return;

    const newPlayerSequence = [...playerSequence, action];
    setPlayerSequence(newPlayerSequence);

    // Add animation class
    const actionElement = document.querySelector(
      `.actions button:nth-child(${actions.indexOf(action) + 1})`
    );
    if (actionElement) {
      actionElement.classList.add("clicked");
      setTimeout(() => actionElement.classList.remove("clicked"), 300);
    }

    if (
      newPlayerSequence[newPlayerSequence.length - 1] !==
      sequence[newPlayerSequence.length - 1]
    ) {
      setGameOver(true);
      setIsPlaying(false);
    } else if (newPlayerSequence.length === sequence.length) {
      const newScore = score + 1;
      setScore(newScore);
      if (newScore === 5) {
        handleGameCompletion();
      } else {
        setPlayerSequence([]);
        setPlayerTurn(false);
        setTimeout(() => addToSequence(2), 1000);
      }
    }
  };

  const startGame = () => {
    setSequence([]);
    setPlayerSequence([]);
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
  };

  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <div className="monkey-see-monkey-do">
      <h2>Monkey See, Monkey Do</h2>
      {!isPlaying && !gameOver && !gameWon && (
        <button onClick={startGame}>Start Game</button>
      )}
      {isPlaying && (
        <div className="game-area">
          <div className="score">Score: {score}</div>
          <div className="actions">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleActionClick(action)}
                className={currentHighlight === action ? "highlighted" : ""}
                disabled={!playerTurn}
              >
                {action}
              </button>
            ))}
          </div>
          <div className="status">
            {!playerTurn ? "Watch the sequence..." : "Your turn!"}
          </div>
        </div>
      )}
      {(gameOver || gameWon) && (
        <div className="game-over">
          <h3>{gameWon ? "Congratulations! You won!" : "Game Over!"}</h3>
          <p>Your score: {score}</p>
          <button onClick={startGame}>Play Again</button>
        </div>
      )}
      <button className="go-back" onClick={handleGoBack}>
        Back to Dashboard
      </button>
    </div>
  );
};

export default MonkeySeeMonkeyDo;
