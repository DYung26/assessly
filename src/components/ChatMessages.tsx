"use client";

import { MessageState, useMessageStore } from "@/lib/store/message";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Message, RoleEnum } from "@/types";

const EMPTY_MESSAGES: Message[] = [];

export default function ChatMessages({
  chatId, 
  scrollContainerRef,
}: {
  chatId: string;
  scrollContainerRef: React.RefObject<HTMLElement | null>;
}) {
  if (!chatId) return null;

  const selectMessages = useCallback(
    (s: MessageState) => s.messagesByChatId[chatId] ?? EMPTY_MESSAGES,
    [chatId]
  );

  const messages = useMessageStore(selectMessages);
  const streamingMessageId = useMessageStore(
    useCallback((s) => s.streamingMessageId, [])
  );

  const containerRef = scrollContainerRef; // useRef<HTMLDivElement>(null);
  const queueRef = useRef<string[]>([]);
  const displayedRef = useRef("");             // what’s actually rendered
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const tick = () => {
      if (queueRef.current.length > 0) {
        displayedRef.current += queueRef.current.shift();
        forceUpdate((x) => x + 1);
      }
    };
    const id = setInterval(tick, 20); // 50ms per char → ~20 chars/sec
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (streamingMessageId === null && queueRef.current.length > 0) {
      // append everything left
      displayedRef.current += queueRef.current.join("");
      queueRef.current = [];
      forceUpdate((x) => x + 1);
    }
  }, [streamingMessageId]);

  // 4) Enqueue new characters whenever the streaming message grows
  const prevContentRef = useRef("");
  useEffect(() => {
    const last = messages[messages.length - 1];
    if (
      last?.role === RoleEnum.ASSISTANT &&
      last.id === streamingMessageId
    ) {
      const full = last.content;
      const prev = prevContentRef.current;
      if (full.length > prev.length) {
        // split only the delta into chars
        const delta = full.slice(prev.length).split("");
        queueRef.current.push(...delta);
        prevContentRef.current = full;
      }
    } else {
      // If stream ended or switched, reset for next assistant message
      prevContentRef.current = "";
      displayedRef.current = "";
      queueRef.current = [];
    }
  }, [messages, streamingMessageId]);

  const scrollToBottom = useCallback((smooth = true) => {
    const c = containerRef.current;
    if (!c) return;
    c.scrollTo({
      top: c.scrollHeight,
      behavior: smooth ? "smooth" : "auto",
    });
  }, []);

  // 3️⃣ On every new message (length change) or final flush, attempt to auto-scroll
  useEffect(() => {
    const c = containerRef.current;
    if (!c) return;

    if (c) scrollToBottom();
    // Only scroll if the user is already near the bottom
    // adjust threshold (px) to taste
    /*const threshold = 100;
    const isNearBottom =
      c.scrollHeight - c.clientHeight - c.scrollTop < threshold;

    if (isNearBottom) {
      scrollToBottom();
    }*/
  }, [messages.length, streamingMessageId, scrollToBottom]);

  return (
    <div className="flex flex-col w-full max-w-3xl py-2 px-2 space-y-4 overflow-y-auto">
      {messages.map((msg) => {
        if (msg.role === RoleEnum.USER) {
          return (
            <div
              key={msg.id}
              className="flex w-auto rounded-xl p-2 shadow bg-gray-100 ml-auto text-right max-w-[50%] break-words"
            >
              {msg.content}
            </div>
          );
        } else {
          const isStreaming =
            msg.id === streamingMessageId &&
            msg.role === RoleEnum.ASSISTANT;
          let contentToShow = isStreaming
            ? displayedRef.current
            : msg.content;
          contentToShow = contentToShow.replace(/\s+/g, " ").trim();
          contentToShow = contentToShow.replace(/([.?!])\s*/g, "$1\n\n");

          return (
            <div
              key={msg.id}
              className="rounded-xl p-2 shadow break-words"
            >
              {contentToShow}
            </div>
          );
        }
      })}
    </div>
  );
}
