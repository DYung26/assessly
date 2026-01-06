"use client";

import { Chat } from "@/types";
import { MessageCircleMore, Ellipsis } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDateTime } from "@/lib/utils";
import { useState } from "react";
import { Popover, PopoverTrigger } from "./ui/popover";
import { ChatOptionsPopover } from "./ChatOptionsPopover";
import { DeleteChatDialog } from "./DeleteChatDialog";
import { useMutation } from "@tanstack/react-query";
import { mutationFn } from "@/lib/mutationFn";
import { queryClient } from "@/lib/queryClient";
import { useParams } from "next/navigation";

export default function ChatsList({ chats }: { chats?: Chat[] }) {
  const router = useRouter();
  const params = useParams();
  const assessmentId = params?.assessment_id as string;
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);

  const updateChatMutation = useMutation({
    mutationFn,
    onSuccess: (data) => {
      console.log("Chat updated:", data);
      queryClient.invalidateQueries({
        queryKey: ["assessmentChats", assessmentId]
      });
    },
  });

  const handleOptionAction = (
    option: string,
    chatId: string,
    title: string
  ) => {
    if (option === "Rename") {
      setEditingId(chatId);
      setEditingTitle(title);
    } else if (option === "Delete") {
      setChatToDelete(chatId);
      setDeleteDialogOpen(true);
    }

    console.log(`Action: ${option}, Chat ID: ${chatId}`);
  }

  const saveEdit = (id: string) => {
    updateChatMutation.mutate({
      url: `/chat/${id}`,
      method: "PUT",
      body: { title: editingTitle },
    });

    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingTitle("");
  };

  if (!chats) return null;

  return (
    <div
      className="max-w-3xl w-full p-2 justify-items-start flex flex-col gap-2 max-h-80 shadow-md rounded-md border border-gray-200"
    >
      <p className="font-semibold border-b">Chats</p>
      <div className="flex flex-col overflow-y-auto w-full">
        {[...chats].reverse().map((chat: Chat) => {
          return (
            <div
              key={chat.id}
              className="group flex items-center gap-2 border-b hover:bg-gray-100 transition-all duration-200 ease-in-out rounded-md p-2"
            >
              <button
                onClick={() => router.push(`/chat/${chat.id}`)}
                className="flex items-center gap-2 flex-1 text-left cursor-pointer min-w-0"
              >
                <MessageCircleMore size={18} className="flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  {editingId === chat.id ? (
                    <input
                      autoFocus
                      className="text-sm border rounded px-1 w-full"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      onBlur={() => saveEdit(chat.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveEdit(chat.id);
                        if (e.key === "Escape") cancelEdit();
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <h2 className="text-sm font-medium truncate">{chat.title}</h2>
                  )}
                </div>
              </button>
              <div className="flex items-center justify-center w-16 h-8 flex-shrink-0 relative">
                <span className="absolute inset-0 flex items-center justify-center text-xs text-gray-400 group-hover:opacity-0 transition-opacity whitespace-nowrap">
                  {formatDateTime(chat.created_at)}
                </span>
                <Popover>
                  <PopoverTrigger asChild>
                    <button 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-full hover:bg-gray-200 transition-opacity cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Ellipsis size={16} />
                    </button>
                  </PopoverTrigger>
                  <ChatOptionsPopover
                    action={handleOptionAction}
                    chatId={chat.id}
                    title={chat.title}
                  />
                </Popover>
              </div>
            </div>
          );
        })}
      </div>
      {chatToDelete && (
        <DeleteChatDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          chatId={chatToDelete}
        />
      )}
    </div>
  );
}
