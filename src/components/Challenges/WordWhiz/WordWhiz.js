import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { WORDS_LIST as WORDS } from "./Words";
import "./WordWhizStyles.scss";

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;
const KEYBOARD_LAYOUT = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Enter", "Z", "X", "C", "V", "B", "N", "M", "Backspace"],
];

const WordWhiz = () => {
  const navigate = useNavigate();
  const [targetWord, setTargetWord] = useState("");
  const [guesses, setGuesses] = useState(Array(MAX_GUESSES).fill(""));
  const [currentGuess, setCurrentGuess] = useState("");
  const [guessCount, setGuessCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");
  const [keyboardState, setKeyboardState] = useState({});
  const [guessStates, setGuessStates] = useState(Array(MAX_GUESSES).fill(null));
  const [isCompleted, setIsCompleted] = useState(false);

  console.log(targetWord);
  useEffect(() => {
    setTargetWord(
      WORDS[Math.floor(Math.random() * WORDS.length)].toUpperCase()
    );
    // Check if the challenge is already completed
    const completed = localStorage.getItem("wordWhizCompleted") === "true";
    setIsCompleted(completed);
  }, []);

  const handleKeyPress = (key) => {
    if (gameOver) return;
    // Add the 'pressed' class to the clicked key
    const keyElement = document.querySelector(`button[data-key="${key}"]`);
    if (keyElement) {
      keyElement.classList.add("pressed");
      setTimeout(() => keyElement.classList.remove("pressed"), 100);
    }

    if (key === "Enter" && currentGuess.length === WORD_LENGTH) {
      if (WORDS.includes(currentGuess.toLowerCase())) {
        submitGuess();
      } else {
        setMessage(`${currentGuess} is not a valid word`);
      }
    } else if (key === "Backspace") {
      setCurrentGuess((prev) => prev.slice(0, -1));
    } else if (currentGuess.length < WORD_LENGTH && key.match(/^[A-Z]$/)) {
      setCurrentGuess((prev) => prev + key);
    }
  };

  const submitGuess = () => {
    const newGuesses = [...guesses];
    newGuesses[guessCount] = currentGuess;
    setGuesses(newGuesses);

    const newGuessStates = [...guessStates];
    const newGuessState = currentGuess.split("").map((letter, index) => {
      if (letter === targetWord[index]) {
        return "correct";
      } else if (targetWord.includes(letter)) {
        return "wrong-position";
      } else {
        return "incorrect";
      }
    });
    newGuessStates[guessCount] = newGuessState;
    setGuessStates(newGuessStates);

    setGuessCount(guessCount + 1);

    if (currentGuess === targetWord) {
      setGameOver(true);
      setMessage("Congratulations! You guessed the word!");
      setIsCompleted(true);
      localStorage.setItem("wordWhizCompleted", "true");
    } else if (guessCount === MAX_GUESSES - 1) {
      setGameOver(true);
      setMessage(`Game over! The word was ${targetWord}`);
    }

    // Update keyboard state
    const newKeyboardState = { ...keyboardState };
    currentGuess.split("").forEach((letter, index) => {
      if (letter === targetWord[index]) {
        newKeyboardState[letter.toUpperCase()] = "correct";
      } else if (
        targetWord.includes(letter) &&
        newKeyboardState[letter.toUpperCase()] !== "correct"
      ) {
        newKeyboardState[letter.toUpperCase()] = "wrong-position";
      } else if (!newKeyboardState[letter.toUpperCase()]) {
        newKeyboardState[letter.toUpperCase()] = "incorrect";
      }
    });
    setKeyboardState(newKeyboardState);

    setCurrentGuess("");
  };

  const renderGuess = (guess, guessState) => {
    return guess.split("").map((letter, index) => {
      let className = "letter";
      if (guessState && guessState[index]) {
        className += ` ${guessState[index]}`;
      }
      return (
        <span key={index} className={className}>
          {letter}
        </span>
      );
    });
  };

  const handleGoBack = () => {
    navigate("/");
  };

  const handleReset = () => {
    setTargetWord(
      WORDS[Math.floor(Math.random() * WORDS.length)].toUpperCase()
    );
    setGuesses(Array(MAX_GUESSES).fill(""));
    setCurrentGuess("");
    setGuessCount(0);
    setGameOver(false);
    setMessage("");
    setKeyboardState({});
    setGuessStates(Array(MAX_GUESSES).fill(null));
  };

  useEffect(() => {
    const handlePhysicalKeyPress = (event) => {
      const key = event.key;
      if (key === "Enter") {
        handleKeyPress("Enter");
      } else if (key === "Backspace") {
        handleKeyPress("Backspace");
      } else if (key.match(/^[a-zA-Z]$/)) {
        handleKeyPress(key.toUpperCase());
      }
    };

    window.addEventListener("keydown", handlePhysicalKeyPress);
    return () => {
      window.removeEventListener("keydown", handlePhysicalKeyPress);
    };
  }, [currentGuess, gameOver]);

  const renderKeyboard = () => {
    return KEYBOARD_LAYOUT.map((row, rowIndex) => (
      <div key={rowIndex} className="keyboard-row">
        {row.map((key) => (
          <button
            key={key}
            data-key={key}
            className={`keyboard-key ${keyboardState[key] || ""}`}
            onClick={() => handleKeyPress(key)}
          >
            {key}
          </button>
        ))}
      </div>
    ));
  };

  return (
    <div className="word-whiz">
      {
        <button className="go-back top-right" onClick={handleGoBack}>
          Back to Dashboard
        </button>
      }
      <h1>Word Whiz</h1>
      {isCompleted && (
        <div className="completion-message">
          {`Congratulations! You've completed the challenge in ${guessCount} moves!!`}
          <p style={{ margin: "10px 0 0 0" }}>Banana Acquired!</p>
        </div>
      )}
      <div className="game-board">
        {guesses.map((guess, index) => (
          <div key={index} className="guess-row">
            {index === guessCount
              ? renderGuess(currentGuess.padEnd(WORD_LENGTH, " "), null)
              : renderGuess(guess, guessStates[index])}
          </div>
        ))}
      </div>
      <div className="message">{message}</div>
      <div className="virtual-keyboard">{renderKeyboard()}</div>
      {gameOver && (
        <button className="button play-again" onClick={handleReset}>
          Play Again
        </button>
      )}
    </div>
  );
};

export default WordWhiz;
