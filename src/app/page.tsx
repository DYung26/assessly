"use client";

import ChatPromptBox from "@/components/ChatBox";
import { NewAssessmentDialog } from "@/components/NewAssessmentDialog";
import Sidebar from "@/components/Sidebar";
import TypingHeader from "@/components/TypingHeader";
import { useUser } from "@/lib/hooks/useUser";
import { useState } from "react";

export default function Home() {
  const { data: user } = useUser();
  const [newAssessmentsOpen, setNewAssessmentsOpen] = useState(false);

  return (
    <div className="flex pt-16 overflow-hidden h-screen">
      {user && <Sidebar />}
      <main
        className="flex flex-col flex-1 px-4 py-4 gap-8 items-center
                   justify-center"
      >
        <TypingHeader />
        <ChatPromptBox action={() => {setNewAssessmentsOpen(true)}} />
      </main>
      <NewAssessmentDialog open={newAssessmentsOpen} onOpenChange={setNewAssessmentsOpen} />
    </div>
  );
}
