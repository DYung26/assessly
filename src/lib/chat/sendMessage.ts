import { Message, RoleEnum } from "@/types";
import { mutationFn } from "@/lib/mutationFn";
// import { flushSync } from "react-dom";

type SendMessageArgs = {
  chatId?: string;
  assessmentId?: string;
  userText: string;
  instructions?: string[];
  files: File[];
  uploadFile: (formData: FormData) => Promise<{ id: string }>;
  onUserMessage: (msg: Message) => void;
  onAssistantMessage: (msg: Message) => void;
  onStreamChunk: (chunk: string) => void;
  onStreamMeta?: (meta: {'type': string, 'chatId': string}) => void;
  onStreamDone: (finalContent: string) => void;
};

export async function sendMessage({
  chatId,
  // assessmentId,
  userText,
  instructions,
  files,
  uploadFile,
  onUserMessage,
  onAssistantMessage,
  onStreamChunk,
  onStreamMeta,
  onStreamDone,
}: SendMessageArgs) {
  const fileIds: string[] = [];

  for (const file of files) {
    const formData = new FormData();
    formData.append("file", file);
    const res = await uploadFile(formData);
    fileIds.push(res.id);
  }

  const userMessageId = Date.now().toString() + "-u";
  onUserMessage({
    id: userMessageId,
    chat_id: chatId,
    file_ids: fileIds ?? [],
    role: RoleEnum.USER,
    content: userText,
    created_at: new Date().toISOString(),
  });

  const assistantMessageId = Date.now().toString() + "-a";
  onAssistantMessage({
    id: assistantMessageId,
    chat_id: chatId,
    role: RoleEnum.ASSISTANT,
    content: "",
    created_at: new Date().toISOString(),
  });

  let buffer = "";
  let remaining = "";

  try {
    await mutationFn({
      url: "/message",
      body: {
        // assessment_id: assessmentId ?? null,
        chat_id: chatId,
        file_ids: fileIds ?? [],
        content: userText,
        instructions: instructions ?? [],
      },
      isStream: true,
      onChunk: async (raw) => {
        let parsed: string | {'type': string, 'chatId': string} | null;
        try {
          parsed = JSON.parse(raw);
        } catch {
          parsed = null;
        }

        if (parsed && typeof parsed !== "string") {
          if (parsed?.type === "meta") {
            onStreamMeta?.(parsed);
            // queueMicrotask(() => onStreamMeta?.(parsed));
            // Promise.resolve().then(() => onStreamMeta?.(parsed));
            // await new Promise((r) => setTimeout(r, 0));
            // onStreamMeta?.(parsed);
            // await new Promise(r => requestAnimationFrame(r));
            return;
          }
        }

        remaining += raw;

        /* TODO: Instead of processing chunk-by-chunk or line-by-line,
         * refactor to accumulate full sections (e.g., paragraphs, code blocks)
         * before rendering. This will ensure that markdown structures like
         * triple backticks ``` for code blocks are preserved in full and can
         * be parsed correctly, rather than breaking them mid-stream.
         * Idea: Detect section boundaries based on markdown patterns, not just punctuation.
         */
        const lineEndRegex = /[,.!?](\s+|$)|$/g;
        let match: RegExpExecArray | null;
        let matchedSomething = false;

        while ((match = lineEndRegex.exec(remaining)) !== null) {
          matchedSomething = true;
          const endIndex = match.index + match[0].length;
          const completeLine = remaining.slice(0, endIndex);
          buffer += completeLine;
          onStreamChunk(buffer);
          await new Promise(r => requestAnimationFrame(r));
          remaining = remaining.slice(endIndex);
        }

        if (!matchedSomething) {
          onStreamChunk(buffer + remaining);
        }
        // await new Promise((r) => setTimeout(r, 0));
        // flushSync(() => {
        // });
      },
      onDone() {
        onStreamDone(buffer.trim());
      },
    });
  } catch (error) {
    console.error("Message sending failed", error);
    // setStreamingMessageId(null);
  }
}
