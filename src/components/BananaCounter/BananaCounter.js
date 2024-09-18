import React from "react";
import "./BananaCounterStyles.scss";

const BananaCounter = ({ completedChallenges }) => {
  const bananas = [1, 2, 3, 4, 5].map((id) => (
    <span
      key={id}
      className={
        completedChallenges.length >= id ? "banana completed" : "banana"
      }
    >
      🍌
    </span>
  ));

  return <div className="banana-counter">{bananas}</div>;
};

export default BananaCounter;
