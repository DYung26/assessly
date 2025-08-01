"use client";

import ChatPromptBox from "@/components/ChatBox";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import TypingHeader from "@/components/TypingHeader";
import { useUser } from "@/lib/hooks/useUser";

export default function Home() {
  const { data: user } = useUser();

  return (
    <div className="flex pt-16 overflow-hidden h-screen">
      {user && <Sidebar /> }
      <main
        className="flex flex-col flex-1 px-4 py-4 gap-8 items-center justify-center"
      >
        <TypingHeader />
        <ChatPromptBox />
      </main>
    </div>
  );
}
