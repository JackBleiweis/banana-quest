import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./BananaSpellingBeeStyles.scss";

const words = [
  "BANANA",
  "PEEL",
  "YELLOW",
  "FRUIT",
  "BUNCH",
  "RIPE",
  "TROPICAL",
  "POTASSIUM",
  "MONKEY",
  "SMOOTHIE",
  "PLANTAIN",
  "STARCH",
  "FIBER",
  "VITAMIN",
  "CARBOHYDRATE",
  "DESSERT",
  "FOSTER",
  "REPUBLIC",
  "CHIQUITA",
  "DOLE",
  "BRUISE",
  "RIPEN",
  "STEM",
  "FLAVOR",
  "EXPORT",
  "HARVEST",
];

const BananaSpellingBee = () => {
  const navigate = useNavigate();
  const [currentWord, setCurrentWord] = useState("");
  const [scrambledWord, setScrambledWord] = useState("");
  const [userInput, setUserInput] = useState("");
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const completed =
      localStorage.getItem("bananaSpellingBeeCompleted") === "true";
    setIsCompleted(completed);
    startNewRound();
  }, []);

  const scrambleWord = (word) => {
    return word
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");
  };

  const startNewRound = () => {
    if (round < 5) {
      const newWord = words[Math.floor(Math.random() * words.length)];
      setCurrentWord(newWord);
      setScrambledWord(scrambleWord(newWord));
      setUserInput("");
      setRound(round + 1);
    } else {
      endGame();
    }
  };

  const handleInputChange = (e) => {
    setUserInput(e.target.value.toUpperCase());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userInput === currentWord) {
      setScore(score + 1);
      setMessage("Correct! Great job!");
    } else {
      setMessage(`Wrong! The correct word was ${currentWord}.`);
    }
    setTimeout(() => {
      setMessage("");
      startNewRound();
    }, 2000);
  };

  const endGame = () => {
    setGameOver(true);
    if (!isCompleted && score === 5) {
      setIsCompleted(true);
      localStorage.setItem("bananaSpellingBeeCompleted", "true");
    }
  };

  const restartGame = () => {
    setScore(0);
    setRound(0);
    setGameOver(false);
    startNewRound();
  };

  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <div className="banana-spelling-bee">
      <h2>Banana Spelling Bee</h2>
      {isCompleted && (
        <div className="completion-message">
          Congratulations! You've completed the challenge and acquired your
          banana!
        </div>
      )}
      {!gameOver ? (
        <div className="game-area">
          <p>Round: {round}/5</p>
          <p>Score: {score}</p>
          <h3>Unscramble this word:</h3>
          <p className="scrambled-word">{scrambledWord}</p>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={userInput}
              onChange={handleInputChange}
              placeholder="Enter your guess"
              maxLength={currentWord.length}
            />
            <button type="submit">Submit</button>
          </form>
          <div className="feedback-container">
            {message && <p className="feedback-message">{message}</p>}
          </div>
        </div>
      ) : (
        <div className="game-over">
          <h3>Game Over!</h3>
          {score === 5 && (
            <p>
              Congratulations! You've completed the challenge and acquired your
              banana!
            </p>
          )}
          <p>Final Score: {score}/5</p>
          <button onClick={restartGame}>Play Again</button>
        </div>
      )}
      <button className="go-back" onClick={handleGoBack}>
        Back to Dashboard
      </button>
    </div>
  );
};

export default BananaSpellingBee;
