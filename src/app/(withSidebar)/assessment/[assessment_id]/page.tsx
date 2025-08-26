"use client";

import ChatPromptBox from "@/components/ChatBox";
import ChatsList from "@/components/ChatsList";
import ContextDock from "@/components/ContextDock";
import PageLoader from "@/components/PageLoader";
import TypingHeader from "@/components/TypingHeader";
// import { sendMessage } from "@/lib/chat/sendMessage";
import { useAssessmentChats } from "@/lib/hooks/useChats";
import { mutationFn } from "@/lib/mutationFn";
import { queryClient } from "@/lib/queryClient";
import { useChatStore } from "@/lib/store/chat";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { use, useState } from "react";

type PageProps = {
  params: Promise<{ assessment_id: string }>;
}

// TODO: redirect unauthenticated users to login
export default function Assessment({ params }: PageProps) {
  const { assessment_id } = use(params);
  const { data: chats = [] } = useAssessmentChats(assessment_id as string);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {setPendingMessage, setPendingFiles} = useChatStore();
  const router = useRouter();

  const newChatMutation = useMutation({
    mutationFn: mutationFn,
    onMutate: () => setIsSubmitting(true),
    onSettled: () => setIsSubmitting(false),
    onSuccess: (data) => {
      console.log("New chat created:", data);
      queryClient.invalidateQueries({
        queryKey: ["chats", assessment_id]
      });
      const chatId = data.data.id;
      router.push(`/chat/${chatId}`);
    },
  });

  const handleSend = async (userText: string, files: File[]) => {
    newChatMutation.mutateAsync({
      url: "/chat",
      body: {
        assessment_id,
        initial_message: userText,
      },
    });
    setPendingMessage(userText);
    setPendingFiles(files);
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
      {isSubmitting ? <PageLoader /> : null}
    </div>
  );
}
