import { parseResponseFileMarkers, ResponseFilePart } from "@/lib/utils/responseFileMarker";

describe("parseResponseFileMarkers", () => {
  it("should parse simple text without markers", () => {
    const content = "This is simple text";
    const result = parseResponseFileMarkers(content);

    expect(result).toHaveLength(1);
    expect(result[0].type).toBe("text");
    expect(result[0].content).toBe(content);
  });

  it("should parse text with a single marker", () => {
    const fileId = "file-123";
    const url = "https://example.com/marked.pdf";
    const label = "Marked file";
    const marker = `[[ASSESSLY_RESPONSE_FILE file_id="${fileId}" url="${url}" label="${label}"]]`;
    const content = `Before file.\n\n${marker}\n\nAfter file.`;

    const result = parseResponseFileMarkers(content);

    expect(result).toHaveLength(3);
    expect(result[0].type).toBe("text");
    expect(result[0].content).toContain("Before file");
    expect(result[1].type).toBe("response_file");
    expect(result[1].fileId).toBe(fileId);
    expect(result[1].url).toBe(url);
    expect(result[1].label).toBe(label);
    expect(result[2].type).toBe("text");
    expect(result[2].content).toContain("After file");
  });

  it("should parse multiple markers", () => {
    const marker1 = '[[ASSESSLY_RESPONSE_FILE file_id="id1" url="url1" label="File 1"]]';
    const marker2 = '[[ASSESSLY_RESPONSE_FILE file_id="id2" url="url2" label="File 2"]]';
    const content = `Text 1\n\n${marker1}\n\nMiddle text\n\n${marker2}\n\nText 3`;

    const result = parseResponseFileMarkers(content);

    const files = result.filter((p) => p.type === "response_file");
    expect(files).toHaveLength(2);
    expect(files[0].fileId).toBe("id1");
    expect(files[1].fileId).toBe("id2");
  });

  it("should handle markers with special characters in URL", () => {
    const url =
      "https://s3.amazonaws.com/bucket-name/path/to/file%20with%20spaces.pdf";
    const marker = `[[ASSESSLY_RESPONSE_FILE file_id="id123" url="${url}" label="Test"]]`;

    const result = parseResponseFileMarkers(marker);

    expect(result[0].type).toBe("response_file");
    expect(result[0].url).toBe(url);
  });

  it("should ignore malformed markers", () => {
    const content = "Text with broken [[ASSESSLY_RESPONSE_FILE marker";

    const result = parseResponseFileMarkers(content);

    expect(result).toHaveLength(1);
    expect(result[0].type).toBe("text");
    expect(result[0].content).toContain("broken");
  });

  it("should not include only whitespace as text", () => {
    const marker = '[[ASSESSLY_RESPONSE_FILE file_id="id" url="url" label="label"]]';

    const result = parseResponseFileMarkers(marker);

    expect(result).toHaveLength(1);
    expect(result[0].type).toBe("response_file");
  });

  it("should trim whitespace from text parts", () => {
    const marker = '[[ASSESSLY_RESPONSE_FILE file_id="id" url="url" label="label"]]';
    const content = `   Before text   \n\n${marker}\n\n   After text   `;

    const result = parseResponseFileMarkers(content);

    expect(result[0].content).not.toMatch(/^\s+/);
    expect(result[0].content).not.toMatch(/\s+$/);
  });

  it("should extract all marker fields correctly", () => {
    const marker = '[[ASSESSLY_RESPONSE_FILE file_id="abc-123-def" url="https://example.com/path/to/file.pdf" label="Custom Marked File"]]';

    const result = parseResponseFileMarkers(marker);

    const filePart = result[0] as ResponseFilePart;
    expect(filePart.fileId).toBe("abc-123-def");
    expect(filePart.url).toBe("https://example.com/path/to/file.pdf");
    expect(filePart.label).toBe("Custom Marked File");
  });

  it("should handle content with only marker", () => {
    const marker = '[[ASSESSLY_RESPONSE_FILE file_id="id" url="url" label="label"]]';

    const result = parseResponseFileMarkers(marker);

    expect(result).toHaveLength(1);
    expect(result[0].type).toBe("response_file");
  });
});
