import { Message, RoleEnum } from "@/types";
import { create } from "zustand";

export interface MessageState {
  messagesByChatId: Record<string, Message[]>;
  setMessages: (chatId: string, messages: Message[]) => void;
  streamingMessageId: string | null;
  setStreamingMessageId: (id: string | null) => void,
  appendMessage: (chatId: string, message: Message) => void;
  replaceLastAssistantMessage: (chatId: string, id: string, newContent: string) => void;
  appendToLastAssistantMessage: (chatId: string, id: string, chunk: string) => void;
  clearMessages: (chatId: string) => void;
}

export const useMessageStore = create<MessageState>((set) => ({
  messagesByChatId: {},

  setMessages: (chatId, messages) =>
    set((state) => ({
      messagesByChatId: { ...state.messagesByChatId, [chatId]: messages },
    })),

  streamingMessageId: null,

  setStreamingMessageId: (id: string | null) => set({ streamingMessageId: id }),

  appendMessage: (chatId, message) =>
    set((state) => ({
      messagesByChatId: {
        ...state.messagesByChatId,
        [chatId]: [...(state.messagesByChatId[chatId] || []), message],
      },
    })),

  replaceLastAssistantMessage: (chatId, id, newContent) =>
    set((state) => ({
      messagesByChatId: {
        ...state.messagesByChatId,
        [chatId]: (state.messagesByChatId[chatId] || []).map((msg) =>
          msg.id === id && msg.role === RoleEnum.ASSISTANT
            ? { ...msg, content: newContent }
            : msg
        ),
      },
    })),

  appendToLastAssistantMessage: (chatId, id, chunk) =>
    set(state => ({
      messagesByChatId: {
        ...state.messagesByChatId,
        [chatId]: state.messagesByChatId[chatId].map(msg =>
          msg.id === id
            ? { ...msg, content: msg.content + chunk }
            : msg
        )
      }
    })),

  clearMessages: (chatId) =>
    set((state) => {
      const newState = { ...state.messagesByChatId };
      delete newState[chatId];
      return { messagesByChatId: newState };
    }),
}));
