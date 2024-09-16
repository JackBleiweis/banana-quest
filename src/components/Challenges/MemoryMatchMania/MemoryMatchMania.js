import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "./MemoryMatchManiaStyles.scss";

const MemoryMatchMania = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);
  const [mismatchedPair, setMismatchedPair] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    initializeCards();
    // Check if the challenge is already completed
    const completed =
      localStorage.getItem("memoryMatchManiaCompleted") === "true";
    setIsCompleted(completed);
  }, []);

  useEffect(() => {
    if (matchedPairs.length === 10) {
      handleGameCompletion();
    }
  }, [matchedPairs]);

  const initializeCards = () => {
    const symbols = [
      "🍌",
      "🐒",
      "🌴",
      "🥥",
      "🍍",
      "🦜",
      "🌺",
      "🌞",
      "🏝️",
      "🚢",
    ];
    const duplicatedSymbols = [...symbols, ...symbols];
    const shuffledCards = duplicatedSymbols.sort(() => Math.random() - 0.5);
    setCards(
      shuffledCards.map((symbol, index) => ({
        id: index,
        symbol,
        isFlipped: false,
      }))
    );
  };

  const handleGoBack = () => {
    navigate("/dashboard");
  };

  const handleCardClick = (clickedCard) => {
    if (
      flippedCards.length === 2 ||
      matchedPairs.includes(clickedCard.symbol) ||
      mismatchedPair.length > 0
    )
      return;

    const newFlippedCards = [...flippedCards, clickedCard];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1); // Increment moves only when second card is flipped
      if (newFlippedCards[0].symbol === newFlippedCards[1].symbol) {
        setMatchedPairs([...matchedPairs, clickedCard.symbol]);
        setFlippedCards([]);
      } else {
        setMismatchedPair(newFlippedCards);
        setTimeout(() => {
          setMismatchedPair([]);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const handleGameCompletion = () => {
    setIsCompleted(true);
    const challenges = JSON.parse(localStorage.getItem("challenges") || "{}");
    challenges.memoryMatchMania = { completed: true, moves: moves };
    localStorage.setItem("memoryMatchManiaCompleted", "true");
  };

  return (
    <div className="memory-match-mania">
      {
        <button className="go-back top-right" onClick={handleGoBack}>
          Back to Dashboard
        </button>
      }
      <h2>Memory Match Mania</h2>
      <div className="moves-counter">Moves: {moves}</div>
      {isCompleted && (
        <div className="completion-message">
          Congratulations! You've completed the challenge in {moves} moves!
        </div>
      )}
      <div className="card-grid">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`card 
              ${flippedCards.some((c) => c.id === card.id) ? "flipped" : ""}
              ${matchedPairs.includes(card.symbol) ? "matched" : ""}
              ${
                mismatchedPair.some((c) => c.id === card.id) ? "mismatched" : ""
              }
            `}
            onClick={() => handleCardClick(card)}
          >
            {flippedCards.some((c) => c.id === card.id) ||
            matchedPairs.includes(card.symbol) ||
            mismatchedPair.some((c) => c.id === card.id)
              ? card.symbol
              : "?"}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemoryMatchMania;
