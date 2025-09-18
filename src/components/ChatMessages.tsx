"use client";

import { memo, useCallback, useEffect } from "react";
import { Message, RoleEnum } from "@/types";
import { formatStreamingContent } from "@/lib/utils/textFormat";
import { useFiles } from "@/lib/hooks/useFiles";
import { ThreeDotLoader } from "./ui/three-dot-loader";
// import FilePreview from "reactjs-file-preview";
import dynamic from "next/dynamic";
import CopyButton from "./CopyButton";
import ReadAloud from "./ReadAloud";

const FilePreview = dynamic(() => import("reactjs-file-preview"), {
  ssr: false,
});

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

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, streamingContent, scrollToBottom]); // - streamingContent

  return (
    <div className="flex flex-col w-full max-w-3xl py-2 px-2 space-y-4 overflow-y-auto">
      {messages.map((msg) => {
        const isStreaming = msg.id === streamingMessageId;
        const { html: content, converted } = isStreaming
          ? formatStreamingContent(streamingContent)
          : formatStreamingContent(msg.content);

        const isUser = msg.role === RoleEnum.USER;
        return (
          <div className="flex flex-col space-y-0.5 " key={msg.id}>
            <div
              key={msg.id}
              className={`rounded-xl p-2 shadow break-words ${isUser
                ? "ml-auto bg-gray-100 text-left max-w-[50%] min-w-0"
                : ""
                }`}
            >
              {msg.file_ids &&
                msg.role === RoleEnum.USER &&
                msg.file_ids.map((fileId: string) => (
                  <MessageFilePreview key={fileId} fileId={fileId} />
                )
              )}

              {isStreaming && !streamingContent ? (
                <div className="flex justify-start">
                  <ThreeDotLoader className="bg-black" />
                </div>
              ) : (
                <div dangerouslySetInnerHTML={{ __html: content }} />
              )}
            </div>
            {!isStreaming &&
              <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                  <CopyButton
                    htmlContent={content}
                    rawText={converted}
                  />
                  {!isUser &&
                    <ReadAloud
                      text={converted}
                    />
                  }
              </div>
            }
          </div>
        );
      })}
    </div>
  );
}

const MessageFilePreview = memo(function MessageFilePreview({ fileId }: { fileId: string }) {
  console.log("MessageFilePreview", fileId);
  const { data: file, isLoading } = useFiles(fileId);
  const url = file?.download_url;

  if (isLoading) {
    return <div className="w-32 h-32 bg-gray-200 animate-pulse rounded-xl mb-2" />;
  }

  return (
    <div className="flex items-center justify-center w-40 h-40 rounded-xl bg-gray-100">
      <FilePreview preview={url || ""} />
      {/*className="max-w-full max-h-full object-contain"*/}
    </div>
    /*<div className="mb-2">
      <img
        src={url}
        alt="file thumbnail"
        className="max-w-[200px] rounded-lg shadow"
      />
    </div>*/
  );
});
