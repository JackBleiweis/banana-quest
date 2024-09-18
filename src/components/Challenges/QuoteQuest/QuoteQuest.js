import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./QuoteQuestStyles.scss";

const quotes = [
  "The quick brown fox jumps over the lazy dog, while the agile cat leaps onto the fence.",
  "To be or not to be, that is the question: Whether 'tis nobler to suffer the slings and arrows of fortune.",
  "All that glitters is not gold; often have you heard that told: Many a man his life hath sold.",
  "I think, therefore I am. But what am I? A thing that doubts, understands, affirms, denies, and wills.",
  "Be the change you wish to see in the world. Your thoughts become your words, your words become your actions.",
  "Life is what happens when you're busy making other plans. Yesterday's past, tomorrow's future, today's a gift.",
  "The only way to do great work is to love what you do. If you haven't found it yet, keep looking.",
  "In three words I can sum up everything I've learned about life: it goes on. Smile because it happened.",
  "Imagination is more important than knowledge. Knowledge is limited, imagination embraces the entire world.",
  "The journey of a thousand miles begins with one step. The secret of getting ahead is getting started.",
];

const QuoteQuest = () => {
  const navigate = useNavigate();
  const [quote, setQuote] = useState("");
  const [userInput, setUserInput] = useState("");
  const [timer, setTimer] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [error, setError] = useState(false);
  const intervalRef = useRef(null);
  const inputRef = useRef(null);

  const selectRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  };

  useEffect(() => {
    if (isStarted && !isFinished) {
      intervalRef.current = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 0.1);
      }, 100);
    }
    return () => clearInterval(intervalRef.current);
  }, [isStarted, isFinished]);

  useEffect(() => {
    if (isStarted && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isStarted]);

  const handleStart = () => {
    setQuote(selectRandomQuote());
    setIsStarted(true);
    setUserInput("");
    setTimer(0);
    setIsFinished(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleFinish = () => {
    setIsFinished(true);
    clearInterval(intervalRef.current);
    // Store completion status in localStorage
    localStorage.setItem("quoteQuestCompleted", "true");
  };

  const handleInputChange = (e) => {
    const input = e.target.value;
    if (input === quote.slice(0, input.length)) {
      setUserInput(input);
      setError(false);
      if (input === quote) {
        handleFinish();
      }
    } else {
      setError(true);
      setTimeout(() => setError(false), 300); // Reset error after animation
    }
  };

  const handleGoBack = () => {
    navigate("/");
  };

  const renderQuote = () => {
    return quote.split("").map((char, index) => (
      <span
        key={index}
        className={
          index < userInput.length
            ? "typed"
            : index === userInput.length
            ? `current ${error ? "error" : ""}`
            : ""
        }
      >
        {char}
      </span>
    ));
  };

  return (
    <div className="quote-quest">
      {!isStarted && (
        <button className="go-back top-right" onClick={handleGoBack}>
          Back to Dashboard
        </button>
      )}
      <h1>Quote Quest</h1>
      {!isStarted && (
        <div className="instructions">
          <h2>
            Type out a famous quote as quickly and accurately as possible.
          </h2>
          <h2>Once you start, there is no going back!</h2>
        </div>
      )}
      <div className="quote-display">{renderQuote()}</div>
      {!isStarted ? (
        <button onClick={handleStart}>Start</button>
      ) : (
        <>
          <div className="timer">Time: {timer.toFixed(1)}s</div>
          <input
            ref={inputRef}
            value={userInput}
            onChange={handleInputChange}
            placeholder="Start typing here..."
            disabled={isFinished}
          />
          {isFinished && (
            <>
              <div className="result">
                Completed in {timer.toFixed(1)} seconds!
              </div>
              <button className="button go-back" onClick={handleGoBack}>
                Go Back to Dashboard
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default QuoteQuest;
