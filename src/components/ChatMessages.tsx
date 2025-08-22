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
  // const [autoScroll, setAutoScroll] = useState(true);
  // const prevStreamingRef = useRef<string>("");

  // console.log("chat_messages", messages.length);
  // console.log("streamingContent", streamingContent);
  // console.log("streamingMessageId", streamingMessageId);

  const scrollToBottom = useCallback((smooth = true) => {
    const c = containerRef.current;
    if (c) c.scrollTo({
      top: c.scrollHeight,
      behavior: smooth ? "smooth" : "auto",
    });
  }, [containerRef]);

  /*const scrollMessageToTop = (messageId: string, smooth = true) => {
    const c = containerRef.current;
    const el = document.getElementById(messageId); // or a ref to the message
    if (c && el) {
      const offsetTop = el.offsetTop; // distance from container’s top
      c.scrollTo({
        top: offsetTop, // puts message at the very top
        behavior: smooth ? "smooth" : "auto",
      });
    }
  };*/

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, streamingContent, scrollToBottom]); // - streamingContent

  /*useEffect(() => {
    // Detect transition: "" -> non-empty (start of streaming)
    if (prevStreamingRef.current === "" && streamingContent !== "") {
      scrollToBottom();
    }

    prevStreamingRef.current = streamingContent;
  }, [streamingContent, scrollToBottom]);*/

  /*useEffect(() => {
    // Detect transition: "" -> non-empty (start of streaming)
    console.log(
      "streamingMessageId changed:", streamingMessageId,
      "xyz", prevStreamingRef.current, streamingContent
    );
    if (prevStreamingRef.current === "" && streamingContent !== "") {
      scrollMessageToTop(streamingMessageId as string);
    }

    prevStreamingRef.current = streamingContent;
  }, [streamingMessageId, scrollMessageToTop]);*/

  /*useEffect(() => {
    const c = containerRef.current;
    if (!c) return;

    const handleScroll = () => {
      // check if user is near bottom (e.g., within 25px)
      const isAtBottom = Math.abs(c.scrollHeight - c.scrollTop - c.clientHeight) < 25;
      setAutoScroll(isAtBottom);
    };

    c.addEventListener("scroll", handleScroll);
    return () => c.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (autoScroll) {
      scrollToBottom();
    }
  }, [messages.length, streamingContent, autoScroll, scrollToBottom]);*/

  return (
    <div className="flex flex-col w-full max-w-3xl py-2 px-2 space-y-4 overflow-y-auto">
      {messages.map((msg) => {
        const isStreaming = msg.id === streamingMessageId;
        const content = isStreaming
          ? formatStreamingContent(streamingContent)
          : formatStreamingContent(msg.content);

        const isUser = msg.role === RoleEnum.USER;
        return (
          <div
            key={msg.id}
            className={`rounded-xl p-2 shadow break-words ${isUser
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
