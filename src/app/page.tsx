"use client";

import ChatPromptBox from "@/components/ChatBox";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import TypingHeader from "@/components/TypingHeader";
import { useUser } from "@/lib/hooks/useUser";

export default function Home() {
  const { data: user } = useUser();

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {user && <Sidebar /> }
        <main className="flex-1 flex flex-col items-center justify-center gap-8 pt-20 px-4">
          <TypingHeader />
          <ChatPromptBox />
        </main>
      </div>
    </div>
  );
}
