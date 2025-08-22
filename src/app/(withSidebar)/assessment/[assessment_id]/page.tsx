"use client";

import ChatPromptBox from "@/components/ChatBox";
import ChatsList from "@/components/ChatsList";
import ContextDock from "@/components/ContextDock";
import TypingHeader from "@/components/TypingHeader";
import { sendMessage } from "@/lib/chat/sendMessage";
import { useAssessmentChats } from "@/lib/hooks/useAssessments";
import { mutationFn } from "@/lib/mutationFn";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { use } from "react";

type PageProps = {
  params: Promise<{ assessment_id: string }>;
}

// TODO: redirect unauthenticated users to login
export default function Assessment({ params }: PageProps) {
  const { assessment_id } = use(params);
  const { data: chats = [] } = useAssessmentChats(assessment_id as string);

  // console.log("Chats", chats);

  const uploadFileMutation = useMutation({
    mutationFn: mutationFn,
  });

  const router = useRouter();

  const handleSend = async (userText: string, files: File[]) => {
    sendMessage({
      chatId: undefined,
      assessmentId: assessment_id,
      userText,
      files,
      uploadFile: (formData) => uploadFileMutation.mutateAsync({ url: "/files/upload", body: formData }).then(res => res.data),
      onUserMessage: () => {},
      onAssistantMessage: () => {},
      onStreamChunk: () => {},
      onStreamMeta: (meta) => router.push(
        `/chat/${meta.chatId}?id=${assessment_id}` //draft=${encodeURIComponent(userText)}`
      ),
      onStreamDone: () => {},
    });
  }

  if (!assessment_id) return null;

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {chats &&
        <main
          className="flex flex-col flex-1 px-4 py-4 gap-4 items-center 
                     justify-center"
        >
          <TypingHeader />
          <ChatPromptBox action={handleSend} /> {/*action={() => { }} />*/}
          <ContextDock />
          <ChatsList chats={chats} />
        </main>
      }
    </div>
  );
}
