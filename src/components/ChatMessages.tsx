"use client";

import { memo, useCallback, useEffect } from "react";
import { Message, RoleEnum } from "@/types";
import { formatStreamingContent } from "@/lib/utils/textFormat";
import { useFiles } from "@/lib/hooks/useFiles";
import { ThreeDotLoader } from "./ui/three-dot-loader";
import CopyButton from "./CopyButton";
import ReadAloud from "./ReadAloud";
import DownloadButton from "./DownloadButton";
import dynamic from "next/dynamic";
import { parseResponseFileMarkers } from "@/lib/utils/responseFileMarker";

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
      {messages.map((msg) => {
        const isStreaming = msg.id === streamingMessageId;
        const contentToRender = isStreaming ? streamingContent : msg.content;
        const isUser = msg.role === RoleEnum.USER;

        return (
          <div className="flex flex-col space-y-0.5" key={msg.id}>
            <div
              className={`rounded-xl p-2 shadow break-words ${isUser
                ? "ml-auto bg-gray-100 text-left max-w-[50%] min-w-0"
                : ""
              }`}
            >
              {msg.file_ids && msg.role === RoleEnum.USER && (
                <div className="flex flex-wrap justify-center items-center gap-3 mb-2 w-full">
                  {msg.file_ids.map((fileId: string) => (
                    <MessageFilePreview key={fileId} fileId={fileId} />
                  ))}
                </div>
              )}

              {isStreaming && !streamingContent ? (
                <div className="flex justify-start">
                  <ThreeDotLoader className="bg-black" />
                </div>
              ) : msg.role === RoleEnum.ASSISTANT ? (
                <AssistantMessageRenderer content={contentToRender} />
              ) : (
                <div
                  className="markdown-body"
                  dangerouslySetInnerHTML={{
                    __html: formatStreamingContent(contentToRender).html,
                  }}
                />
              )}
            </div>
            {!isStreaming && (
              <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                <CopyButton
                  htmlContent={formatStreamingContent(contentToRender).html}
                  rawText={formatStreamingContent(contentToRender).converted}
                />
                <DownloadButton
                  htmlContent={formatStreamingContent(contentToRender).html}
                  rawText={formatStreamingContent(contentToRender).converted}
                />
                {!isUser && (
                  <ReadAloud
                    text={formatStreamingContent(contentToRender).converted}
                  />
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

const AssistantMessageRenderer = memo(function AssistantMessageRenderer({
  content,
}: {
  content: string;
}) {
  const parts = parseResponseFileMarkers(content);
  const renderedParts = parts.map((part, index) =>
    part.type === "text" ? (
      <div
        key={index}
        className="markdown-body"
        dangerouslySetInnerHTML={{
          __html: formatStreamingContent(part.content!).html,
        }}
      />
    ) : (
      <div key={index} className="my-3">
        <InlineResponseFilePreview
          fileId={part.fileId!}
          url={part.url}
          label={part.label}
        />
      </div>
    )
  );

  return <>{renderedParts}</>;
});

const MessageFilePreview = memo(function MessageFilePreview({ fileId }: { fileId: string }) {
  const { data: file, isLoading } = useFiles(fileId);
  const url = file?.url || file?.download_url;

  if (isLoading) {
    return (
      <div className="w-40 h-40 rounded-xl bg-gray-100 flex-shrink-0 border shadow animate-pulse" />
    );
  }

  if (!url) {
    return null;
  }

  return (
    <div className="w-40 h-40 rounded-xl bg-white flex-shrink-0 border shadow overflow-hidden">
      <FilePreview preview={url} />
    </div>
  );
});

const InlineResponseFilePreview = memo(function InlineResponseFilePreview({
  fileId,
  url: markerUrl,
  label = "Marked file",
}: {
  fileId: string;
  url?: string;
  label?: string;
}) {
  const { data: file, isLoading } = useFiles(fileId);
  const url = file?.url || file?.download_url || markerUrl;

  if (isLoading) {
    return (
      <div className="w-40 h-40 rounded-xl bg-gray-100 flex-shrink-0 border shadow animate-pulse" />
    );
  }

  if (!url) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <label className="text-xs font-medium text-blue-600">{label}</label>
      <div className="w-40 h-40 rounded-xl bg-blue-50 flex-shrink-0 border border-blue-200 shadow overflow-hidden">
        <FilePreview preview={url} />
      </div>
    </div>
  );
});

