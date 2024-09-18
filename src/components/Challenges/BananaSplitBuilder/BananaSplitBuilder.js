import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./BananaSplitBuilderStyles.scss";

const ingredients = [
  "banana",
  "vanilla",
  "chocolate",
  "strawberry",
  "whipped_cream",
  "cherry",
];

const BananaSplitBuilder = () => {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentOrder, setCurrentOrder] = useState([]);
  const [playerBuild, setPlayerBuild] = useState([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showCorrect, setShowCorrect] = useState(false);
  const [showIncorrect, setShowIncorrect] = useState(false);

  useEffect(() => {
    const completed =
      localStorage.getItem("bananaSplitBuilderCompleted") === "true";
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
    generateNewOrder();
  };

  const endGame = () => {
    setGameOver(true);
    if (!isCompleted && score >= 1) {
      setIsCompleted(true);
      localStorage.setItem("bananaSplitBuilderCompleted", "true");
    }
  };

  const generateNewOrder = () => {
    const newOrder = [
      ...Array(Math.floor(Math.random() * 6) + 4)
        .fill()
        .map(() => ingredients[Math.floor(Math.random() * ingredients.length)]),
    ];
    newOrder.push("whipped_cream");
    setCurrentOrder(newOrder);
    setPlayerBuild([]);
  };

  const handleIngredientClick = (ingredient) => {
    if (gameStarted && !gameOver) {
      setPlayerBuild([...playerBuild, ingredient]);
      if (playerBuild.length + 1 === currentOrder.length) {
        checkOrder();
      }
    }
  };

  const checkOrder = () => {
    const updatedPlayerBuild = [...playerBuild, "whipped_cream"];
    const isCorrect =
      JSON.stringify(updatedPlayerBuild) === JSON.stringify(currentOrder);
    setIsCorrect(isCorrect);
    if (isCorrect) {
      setScore(score + 1);
      setShowCorrect(true);
      setTimeout(() => {
        setShowCorrect(false);
        generateNewOrder();
      }, 1300);
    } else {
      setShowIncorrect(true);
      setTimeout(() => {
        setShowIncorrect(false);
        setPlayerBuild([]); // Move this line inside the timeout
      }, 1700);
    }
  };

  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <div className="banana-split-builder">
      <h2>Banana Split Builder</h2>
      {isCompleted && (
        <div className="completion-message">
          Congratulations! You've completed the challenge and acquired your
          banana!
        </div>
      )}
      {!gameStarted && (
        <div className="instructions">
          <p>Build banana splits according to the order shown!</p>
          <p>Complete as many orders as you can in 30 seconds.</p>
          <p>Complete at least 5 orders to win the challenge!</p>
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
          <span className="order-checker">
            {showCorrect ? "Correct!" : "Fill that order in!!"}
          </span>
          <div className={`order-display ${showCorrect ? "correct" : ""}`}>
            {currentOrder.map((ingredient, index) => (
              <div key={index} className={`ingredient ${ingredient}`}></div>
            ))}
          </div>
          <div
            className={`build-area ${showCorrect ? "correct" : ""} ${
              showIncorrect ? "incorrect" : ""
            }`}
          >
            {playerBuild.map((ingredient, index) => (
              <div key={index} className={`ingredient ${ingredient}`}></div>
            ))}
          </div>
          <div className="ingredient-selector">
            {ingredients.map((ingredient) => (
              <div
                key={ingredient}
                className={`ingredient ${ingredient}`}
                onClick={() => handleIngredientClick(ingredient)}
              ></div>
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

export default BananaSplitBuilder;
