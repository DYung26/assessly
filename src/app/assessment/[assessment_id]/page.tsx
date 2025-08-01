"use client";

import ChatPromptBox from "@/components/ChatBox";
import ChatMessages from "@/components/ChatMessages";
import Sidebar from "@/components/Sidebar";
import { useAssessmentChats } from "@/lib/hooks/useAssessments";
import { useMessages } from "@/lib/hooks/useMessages";
import { useUser } from "@/lib/hooks/useUser";
import { use, useRef } from "react";

type PageProps = {
  params: Promise<{ assessment_id: string }>;
}

export default function Assessment({ params }: PageProps) {
  const { assessment_id } = use(params);
  console.log(assessment_id);
  const { data: user } = useUser();
  const { data: chats = [] } = useAssessmentChats(assessment_id as string);
  console.log("chats", chats);
  const chatId = chats[0]?.id;
  useMessages(chatId as string);

  const mainRef = useRef<HTMLElement>(null);

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
              chatId={chatId}
              scrollContainerRef={mainRef}
            />
          </div>
        </main>

        <ChatPromptBox chatId={chatId} />
      </div>
    </div>
  );
}
