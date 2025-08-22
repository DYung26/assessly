import { create } from "zustand";

type ChatStore = {
  pendingMessage?: string;
  pendingFiles?: File[];
  setPendingMessage: (msg?: string) => void;
  setPendingFiles: (files?: File[]) => void;
  clearPending: () => void;
};

export const useChatStore = create<ChatStore>((set) => ({
  pendingMessage: undefined,
  pendingFiles: undefined,
  setPendingMessage: (msg) => set({ pendingMessage: msg }),
  setPendingFiles: (files) => set({ pendingFiles: files }),
  clearPending: () => set({ pendingMessage: undefined, pendingFiles: undefined }),
}));
