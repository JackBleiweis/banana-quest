import React from "react";
import "./BananaCounterStyles.scss";

const BananaCounter = ({ completedChallenges }) => {
  const bananas = [1, 2, 3, 4, 5].map((id) => (
    <span
      key={id}
      className={
        completedChallenges.includes(id) ? "banana completed" : "banana"
      }
    >
      {completedChallenges.includes(id) ? "🍌" : "🍌"}
    </span>
  ));

  return <div className="banana-counter">{bananas}</div>;
};

export default BananaCounter;
