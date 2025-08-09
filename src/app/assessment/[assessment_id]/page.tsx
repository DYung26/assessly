"use client";

import ChatPromptBox from "@/components/ChatBox";
import ChatMessages from "@/components/ChatMessages";
import Sidebar from "@/components/Sidebar";
import { useAssessmentChats } from "@/lib/hooks/useAssessments";
import { useMessages } from "@/lib/hooks/useMessages";
import { useUser } from "@/lib/hooks/useUser";
import { mutationFn } from "@/lib/mutationFn";
import { Message, RoleEnum } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { use, useEffect, useRef, useState } from "react";

type PageProps = {
  params: Promise<{ assessment_id: string }>;
}

export default function Assessment({ params }: PageProps) {
  const { assessment_id } = use(params);
  const { data: user } = useUser();
  const { data: chats = [] } = useAssessmentChats(assessment_id as string);
  const chatId = chats[0]?.id;
  // const messages = useMessageStore((s) => s.messagesByChatId[chatId] ?? []);
  const { data: initialMsgs = [] } = useMessages(chatId);

  const [messages, setMessages] = useState<Message[]>([]);
  const [streamingContent, setStreamingContent] = useState<string>("");
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);

  useEffect(() => {
    if (initialMsgs.length > 0 && messages.length === 0) {
      setMessages(initialMsgs);
    }
  }, [initialMsgs, messages.length]);

  const mainRef = useRef<HTMLElement>(null);

  const uploadFileMutation = useMutation({
    mutationFn: mutationFn,
  });

  const sendMutation = useMutation({
    mutationFn: mutationFn,
  });

  const handleSend = async (userText: string, files: File[]) => {
    if (!chatId || !userText.trim()) return;

    const fileIds: string[] = [];

    if (files) {
      // TODO: refactor to batch-upload files
      // files.forEach((file) => {
      for (const file of files) {
        console.log("file", file);
        const formData = new FormData();
        formData.append("file", file);

        console.log("Selected file:", file);
        const res = await uploadFileMutation.mutateAsync({
          url: "/files/upload",
          body: formData,
        });
        const fileId = res.data.id;
        console.log(fileId);
        fileIds.push(fileId);
      }
    }

    const userMessageId = Date.now().toString() + "-u";
    console.log("fileIds", fileIds);
    setMessages((prev) => [...prev, {
      id: userMessageId,
      chat_id: chatId,
      file_id: fileIds[0],
      role: RoleEnum.USER,
      content: userText,
      created_at: new Date().toISOString(),
    }]);

    const assistantMessageId = Date.now().toString() + "-a";
    setMessages((prev) => [...prev, {
      id: assistantMessageId,
      chat_id: chatId,
      role: RoleEnum.ASSISTANT,
      content: "",
      created_at: new Date().toISOString(),
    }]);

    setStreamingMessageId(assistantMessageId);
    setStreamingContent("");

    let buffer = "";
    let remaining = "";

    try {
      await sendMutation.mutateAsync({
        url: "/message",
        body: {
          chat_id: chatId,
          file_id: fileIds[0],
          content: userText,
        },
        isStream: true,
        onChunk: async (raw) => {
          const textChunk = raw;
          remaining += textChunk;

          /* TODO: Instead of processing chunk-by-chunk or line-by-line,
           * refactor to accumulate full sections (e.g., paragraphs, code blocks)
           * before rendering. This will ensure that markdown structures like
           * triple backticks ``` for code blocks are preserved in full and can
           * be parsed correctly, rather than breaking them mid-stream.
           * Idea: Detect section boundaries based on markdown patterns, not just punctuation.
           */
          const lineEndRegex = /[,.!?](\s+|$)/g;
          // console.log(remaining);

          let match: RegExpExecArray | null;
          let matchedSomething = false;
          while ((match = lineEndRegex.exec(remaining)) !== null) {
            matchedSomething = true;
            const endIndex = match.index + match[0].length;

            const completeLine = remaining.slice(0, endIndex);
            buffer += completeLine;

            setStreamingContent(buffer); // (prev) => prev + completeLine);

            remaining = remaining.slice(endIndex);
          }

          if (!matchedSomething) {
            setStreamingContent(buffer + remaining);
          }

          await new Promise((r) => setTimeout(r, 0));
          // flushSync(() => {
          // });
        },
        onDone() {
          setStreamingMessageId(null);
          setMessages((m) =>
            m.map((msg) =>
              msg.id === assistantMessageId ? { ...msg, content: buffer.trim() } : msg
            )
          );
        },
      });
    } catch (error) {
      console.error("Message sending failed", error);
      setStreamingMessageId(null);
    }
  };

  if (!chatId) return null;

  return (
    <div className="flex flex-1 pt-16 h-screen">
      {user && <Sidebar /> }
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
    </div>
  );
}
