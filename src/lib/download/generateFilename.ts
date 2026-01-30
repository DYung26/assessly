/**
 * Generates a descriptive filename for downloaded content.
 * Format: first_words_YYYY-MM-DD.extension
 *
 * @param content - The text content to extract filename from
 * @param extension - File extension (without dot)
 * @returns Sanitized filename with date
 *
 * @example
 * generateFilename("Hello World", "docx") // "Hello_World_2026-01-30.docx"
 * generateFilename("", "docx") // "message_2026-01-30.docx"
 */
export function generateFilename(content: string, extension: string): string {
  const sanitized = content
    .substring(0, 50)
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, "_")
    .substring(0, 40) || "message";

  const date = new Date().toISOString().split("T")[0];
  return `${sanitized}_${date}.${extension}`;
}
