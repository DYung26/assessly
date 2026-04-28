export interface ResponseFilePart {
  type: "text" | "response_file";
  content?: string;
  fileId?: string;
  url?: string;
  label?: string;
}

export function parseResponseFileMarkers(content: string): ResponseFilePart[] {
  const parts: ResponseFilePart[] = [];
  const markerRegex =
    /\[\[ASSESSLY_RESPONSE_FILE\s+file_id="([^"]+)"\s+url="([^"]+)"\s+label="([^"]+)"\]\]/g;

  let lastIndex = 0;
  let match;

  while ((match = markerRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      const textBefore = content.substring(lastIndex, match.index).trim();
      if (textBefore) {
        parts.push({ type: "text", content: textBefore });
      }
    }

    parts.push({
      type: "response_file",
      fileId: match[1],
      url: match[2],
      label: match[3],
    });

    lastIndex = markerRegex.lastIndex;
  }

  if (lastIndex < content.length) {
    const textAfter = content.substring(lastIndex).trim();
    if (textAfter) {
      parts.push({ type: "text", content: textAfter });
    }
  }

  if (parts.length === 0) {
    parts.push({ type: "text", content });
  }

  return parts;
}
