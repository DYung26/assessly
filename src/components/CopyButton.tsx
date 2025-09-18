import { Check, Copy } from "lucide-react";
import React, { useState } from "react";

export default function CopyButton(
  { htmlContent, rawText }: { htmlContent: string; rawText: string }
) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([htmlContent], { type: "text/html" }),
          "text/plain": new Blob([rawText], { type: "text/plain" }),
        }),
      ]);
      setIsCopied(true);
    } catch (err) {
      console.error("Failed to copy: ", err);
    } finally {
      setTimeout(() => setIsCopied(false), 1000);
    }
  };

  return (
    <button onClick={handleCopy} className="px-2 py-1 rounded cursor-pointer hover:bg-gray-200">
      { !isCopied
        ? <Copy size={18} className="w-4 h-4" />
        : <Check size={18} className="w-4 h-4" />
      }
    </button>
  );
}
