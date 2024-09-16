import React, { useState, useEffect } from "react";
import "./DateAndQuote.scss";

const monkeyQuotes = [
  "Monkey see, monkey do.",
  "Even monkeys fall from trees.",
  "If you pay peanuts, you get monkeys.",
  "Not my circus, not my monkeys.",
  "I've got a monkey on my back.",
  "Monkeys are superior to men in this: when a monkey looks into a mirror, he sees a monkey.",
  "The higher a monkey climbs, the more you see of its behind.",
  "A monkey never thinks her baby's ugly.",
  "Trying to teach a monkey to sing wastes your time and annoys the monkey.",
  "The problem with the gene pool is that there's no lifeguard.",
];

const DateAndQuote = () => {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    const today = new Date();
    const dayOfYear = getDayOfYear(today);
    const quoteIndex = dayOfYear % monkeyQuotes.length;
    setQuote(monkeyQuotes[quoteIndex]);
  }, []);

  const getDayOfYear = (date) => {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="date-and-quote">
      <div className="date">{today}</div>
      <div className="quote">"{quote}"</div>
    </div>
  );
};

export default DateAndQuote;
