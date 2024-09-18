import React from "react";
import { useNavigate } from "react-router-dom";
import "./SecretGameRoomStyle.scss";

const SecretGameRoom = () => {
  const navigate = useNavigate();

  const games = [
    {
      id: 1,
      title: "Quote Quest",
      description:
        "Type out a famous quote as quickly and accurately as possible.",
      route: "quote-quest",
    },
    {
      id: 2,
      title: "Word Whiz",
      description: "Everyone's favourite word guessing game, now in color!",
      route: "word-whiz",
    },
    {
      id: 3,
      title: "Memory Match Mania",
      description:
        "Flip over cards to find matching pairs. This isn't timed, so choose wisely!",
      route: "memory-match-mania",
    },
    {
      id: 4,
      title: "Whack A Banana",
      description:
        "Test your reaction time by whacking bananas as they appear on the screen.",
      route: "whack-a-banana",
    },
    {
      id: 5,
      title: "Banana Catcher",
      description:
        "Catch as many bananas as possible before they hit the ground.",
      route: "banana-catcher",
    },
    {
      id: 6,
      title: "Banana Balance",
      description:
        "Balance bananas on a monkey's head for as long as possible!",
      route: "banana-balance",
    },
    {
      id: 7,
      title: "Banana Spelling Bee",
      description: "Spell words using banana-shaped letter tiles!",
      route: "banana-spelling-bee",
    },
    {
      id: 8,
      title: "Banana Rhythm",
      description:
        "Tap to the beat of the music with banana-themed visual cues!",
      route: "banana-rhythm",
    },
    {
      id: 9,
      title: "Banana Peeling Race",
      description: "Peel as many bananas as you can in 10 seconds!",
      route: "banana-peeling-race",
    },
    {
      id: 10,
      title: "Banana Split Builder",
      description: "Build banana splits according to customer orders!",
      route: "banana-split-builder",
    },
    {
      id: 11,
      title: "Monkey See, Monkey Do",
      description:
        "Repeat the sequence of monkey actions as they appear on screen!",
      route: "monkey-see-monkey-do",
    },
    {
      id: 12,
      title: "Monkey Maze",
      description: "Guide a monkey through a jungle maze to collect bananas!",
      route: "monkey-maze",
    },
  ];

  const handleGameSelect = (route) => {
    navigate(`/challenge/${route}`);
  };

  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <div className="secret-game-room">
      <h2>Secret Game Room</h2>
      <div className="game-list">
        {games.map((game) => (
          <button
            key={game.id}
            className="game-button"
            onClick={() => handleGameSelect(game.route)}
          >
            <h3>{game.title}</h3>
            <p>{game.description}</p>
          </button>
        ))}
      </div>
      <button className="go-back" onClick={handleGoBack}>
        Back to Dashboard
      </button>
    </div>
  );
};

export default SecretGameRoom;
