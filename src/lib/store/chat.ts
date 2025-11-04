import { create } from "zustand";

type ChatStore = {
  pendingMessage?: string;
  pendingInstructions?: string[];
  pendingFileIds?: string[];
  setPendingMessage: (msg?: string) => void;
  setPendingInstructions: (instructions?: string[]) => void;
  setPendingFileIds: (fileIds?: string[]) => void;
  clearPending: () => void;
};

export const useChatStore = create<ChatStore>((set) => ({
  pendingMessage: undefined,
  pendingFileIds: undefined,
  setPendingMessage: (msg) => set({ pendingMessage: msg }),
  setPendingInstructions: (instructions) => set({ pendingInstructions: instructions }),
  setPendingFileIds: (fileIds) => set({ pendingFileIds: fileIds }),
  clearPending: () => set({ pendingMessage: undefined, pendingInstructions: undefined, pendingFileIds: undefined }),
}));
