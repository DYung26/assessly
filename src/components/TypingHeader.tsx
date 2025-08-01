"use client";

import { useEffect, useState } from "react";

export default function TypingHeader() {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const phrases = [
      "Ready to tackle your next assessment?",
      "Prepare with confidence.",
      "Crack every test like a pro!",
      "What's on the agenda today?",
    ];

    const currentPhrase = phrases[currentPhraseIndex];
    const speed = isDeleting ? 50 : 100;

    const timeout = setTimeout(() => {
      setDisplayText((prev) =>
        isDeleting
          ? currentPhrase.substring(0, prev.length - 1)
          : currentPhrase.substring(0, prev.length + 1)
      );

      if (!isDeleting && displayText === currentPhrase) {
        setTimeout(() => setIsDeleting(true), 5000); // wait before deleting
      } else if (isDeleting && displayText === "") {
        setIsDeleting(false);
        setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentPhraseIndex]);

  return (
    <h1 className="text-3xl text-center font-bold text-gray-800 min-h-[2.5rem]">
      {displayText}
      <span className="border-r-2 border-gray-800 animate-pulse ml-1"></span>
    </h1>
  );
};
