"use client";

import ChatPromptBox from "@/components/ChatBox";
import ChatMessages from "@/components/ChatMessages";
import { sendMessage } from "@/lib/chat/sendMessage";
import { useMessages } from "@/lib/hooks/useMessages";
import { mutationFn } from "@/lib/mutationFn";
import { useChatStore } from "@/lib/store/chat";
import { Message, RoleEnum } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { use, useCallback, useEffect, useRef, useState } from "react";

type PageProps = {
  params: Promise<{ chat_id: string }>;
}

export default function Chat({ params }: PageProps) {
  const { chat_id: chatId } = use(params);
  const searchParams = useSearchParams();
  const assessmentId = searchParams.get("id") as string;

  // const messages = useMessageStore((s) => s.messagesByChatId[chatId] ?? []);
  const { data: initialMsgs = [] } = useMessages(chatId);

  const [messages, setMessages] = useState<Message[]>([]);
  const [streamingContent, setStreamingContent] = useState<string>("");
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (initialMsgs.length > 0 && messages.length === 0) {
      setMessages(initialMsgs);
    }
  }, [initialMsgs, messages.length]);

  const mainRef = useRef<HTMLElement>(null);
  const hasRunRef = useRef(false);

  const uploadFileMutation = useMutation({
    mutationFn: mutationFn,
  });

  const pendingMessage = useChatStore(s => s.pendingMessage);
  const pendingInstructions = useChatStore(s => s.pendingInstructions);
  const pendingFiles = useChatStore(s => s.pendingFiles);

  const handleSend = useCallback(
    (userText: string, files: File[], instructions: string[] = []) => {
      sendMessage({
        chatId,
        assessmentId,
        userText,
        instructions,
        files,
        uploadFile: (formData) => uploadFileMutation.mutateAsync({ url: "/files/upload", body: formData }).then(res => res.data),
        onUserMessage: (msg) => setMessages((prev) => [...prev, msg]),
        onAssistantMessage: (msg) => {
          setMessages((prev) => [...prev, msg]);
          setStreamingMessageId(msg.id);
        },
        onStreamChunk: async (partial) => setStreamingContent(partial),
        onStreamMeta: (meta) => {
          console.log("Stream meta:", meta);
          router.push(`/chat/${meta.chatId}`);
        },
        onStreamDone: (finalContent) => {
          setStreamingMessageId(null);
          setStreamingContent("");
          setMessages((msgs) =>
            msgs.map((m) =>
              m.role === RoleEnum.ASSISTANT && m.content === ""
                ? { ...m, content: finalContent }
                : m
            )
          );
        },
      });
    },
    [chatId, assessmentId, uploadFileMutation, router]
  );

  useEffect(() => {
    if (pendingMessage && !hasRunRef.current) {
      handleSend(
        pendingMessage as string, pendingFiles as File[], pendingInstructions as string[]
      );
      useChatStore.getState().clearPending();
      hasRunRef.current = true
    }
  }, [pendingMessage, pendingFiles, pendingInstructions, handleSend]);

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <main
        ref={mainRef}
        className="flex flex-col flex-1 px-4 py-4 gap-4 overflow-y-auto"
      >
        <div className="flex flex-col items-center">
          <ChatMessages
            messages={messages}
            streamingMessageId={streamingMessageId}
            streamingContent={streamingContent}
            scrollContainerRef={mainRef}
          />
        </div>
      </main>

      <ChatPromptBox action={handleSend} />
    </div>
  );
}
