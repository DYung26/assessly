import { Chat } from "@/types";
import { MessageCircleMore } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ChatsList({ chats }: { chats?: Chat[] }) {
  const router = useRouter();

  if (!chats) return null;

  return (
    <div
      className="max-w-3xl w-full p-2 justify-items-start flex flex-col gap-2 max-h-80 shadow-md rounded-md border border-gray-200"
    >
      <p className="font-semibold border-b">Chats</p>
      <div className="flex flex-col overflow-y-auto w-full">
        {[...chats].reverse().map((chat: Chat) => {
          return (
            <button
              key={chat.id}
              onClick={() => router.push(`/chat/${chat.id}`)}
              className="flex items-center gap-2 pb-2 cursor-pointer border-b hover:bg-gray-100 transition-all duration-200 ease-in-out rounded-md p-2 text-left"
            >
              <MessageCircleMore size={18} />
              <h2 className="text-sm font-medium">{chat.title}</h2>
              {/*<span className="text-xs text-gray-400">{chat.created_at}</span>*/}
            </button>
          );
        })}
      </div>
    </div>
  );
}
