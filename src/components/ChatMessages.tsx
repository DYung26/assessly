"use client";

import { useCallback, useEffect } from "react";
import { Message, RoleEnum } from "@/types";
import { formatStreamingContent } from "@/lib/utils/textFormat";

export default function ChatMessages({
  messages,
  streamingMessageId,
  streamingContent,
  scrollContainerRef,
}: {
  messages: Message[];
  streamingMessageId: string | null;
  streamingContent: string;
  scrollContainerRef: React.RefObject<HTMLElement | null>;
}) {
  const containerRef = scrollContainerRef;

  /*console.log("chat_messages", messages.length);
  console.log("streamingContent", streamingContent);
  console.log("streamingMessageId", streamingMessageId);*/

  const scrollToBottom = useCallback((smooth = true) => {
    const c = containerRef.current;
    if (c) c.scrollTo({
      top: c.scrollHeight,
      behavior: smooth ? "smooth" : "auto",
    });
  }, [containerRef]);

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, streamingContent, scrollToBottom]);

  return (
    <div className="flex flex-col w-full max-w-3xl py-2 px-2 space-y-4 overflow-y-auto">
      {messages.map((msg, idx) => {
        const isLast = idx === messages.length - 1;
        const isStreaming = isLast && msg.id === streamingMessageId;
        const content = isStreaming
          ? formatStreamingContent(streamingContent)
          : formatStreamingContent(msg.content);

        const isUser = msg.role === RoleEnum.USER;
        return (
          <div
            key={msg.id}
            className={`rounded-xl p-2 shadow break-words ${
              isUser
                ? "ml-auto bg-gray-100 text-left max-w-[50%] min-w-0"
                : ""
            }`}
          >
            <div
              className=""
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        );
      })}
    </div>
  );
}
