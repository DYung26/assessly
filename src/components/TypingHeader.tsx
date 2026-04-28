"use client";

import { useEffect, useState } from "react";

export default function TypingHeader({ headerTitles, headerDescription }: { headerTitles?: string[]; headerDescription?: string }) {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const phrases = headerTitles && headerTitles.length > 0
      ? headerTitles
      : [
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
        setTimeout(() => setIsDeleting(true), 5000);
      } else if (isDeleting && displayText === "") {
        setIsDeleting(false);
        setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentPhraseIndex, headerTitles]);

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-800 min-h-[2.5rem]">
        {displayText}
        <span className="border-r-2 border-gray-800 animate-pulse ml-1"></span>
      </h1>
      {headerDescription && (
        <p className="text-base text-gray-600 mt-2 max-w-xl mx-auto">
          {headerDescription}
        </p>
      )}
    </div>
  );
};
