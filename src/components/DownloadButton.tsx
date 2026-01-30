"use client";

import { Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { generateFilename } from "@/lib/download";

export default function DownloadButton({
  htmlContent,
  rawText,
}: {
  htmlContent: string;
  rawText: string;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownloadDocx = async () => {
    if (!htmlContent || !rawText) {
      toast.error("No content to download");
      return;
    }

    try {
      setIsLoading(true);

      const { Document, Packer, Paragraph, TextRun, Table, TableCell, TableRow, BorderStyle } = await import("docx");

      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = htmlContent;

      const children: unknown[] = [];

      const processNode = (node: Node): unknown[] => {
        const result: unknown[] = [];

        if (node.nodeType === Node.TEXT_NODE) {
          const text = (node as Text).textContent?.trim();
          if (text) {
            result.push(
              new Paragraph({
                text,
                spacing: { line: 360, lineRule: "auto" },
              })
            );
          }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as HTMLElement;
          const tagName = element.tagName.toLowerCase();

          switch (tagName) {
            case "h1":
            case "h2":
            case "h3":
            case "h4":
            case "h5":
            case "h6": {
              const level = parseInt(tagName[1], 10);
              result.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: element.textContent || "",
                      bold: true,
                      size: (32 - level * 2) * 2,
                    }),
                  ],
                  spacing: { before: 240, after: 120, line: 360, lineRule: "auto" },
                })
              );
              break;
            }
            case "p": {
              result.push(
                new Paragraph({
                  text: element.textContent || "",
                  spacing: { line: 360, lineRule: "auto" },
                })
              );
              break;
            }
            case "strong":
            case "b": {
              result.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: element.textContent || "",
                      bold: true,
                    }),
                  ],
                  spacing: { line: 360, lineRule: "auto" },
                })
              );
              break;
            }
            case "em":
            case "i": {
              result.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: element.textContent || "",
                      italics: true,
                    }),
                  ],
                  spacing: { line: 360, lineRule: "auto" },
                })
              );
              break;
            }
            case "code": {
              result.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: element.textContent || "",
                      font: "Courier New",
                      color: "666666",
                    }),
                  ],
                  spacing: { line: 360, lineRule: "auto" },
                })
              );
              break;
            }
            case "pre": {
              result.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: element.textContent || "",
                      font: "Courier New",
                      size: 20,
                    }),
                  ],
                  spacing: { line: 360, lineRule: "auto" },
                })
              );
              break;
            }
            case "ul":
            case "ol": {
              element.querySelectorAll("li").forEach((li) => {
                result.push(
                  new Paragraph({
                    text: li.textContent || "",
                    spacing: { line: 360, lineRule: "auto" },
                    bullet: {
                      level: 0,
                    },
                  })
                );
              });
              break;
            }
            case "table": {
              const rows: unknown[] = [];
              element.querySelectorAll("tr").forEach((tr) => {
                const cells: unknown[] = [];
                tr.querySelectorAll("td, th").forEach((td) => {
                  cells.push(
                    new TableCell({
                      children: [
                        new Paragraph({
                          text: td.textContent || "",
                        }),
                      ],
                      borders: {
                        top: { style: BorderStyle.SINGLE, size: 1 },
                        bottom: { style: BorderStyle.SINGLE, size: 1 },
                        left: { style: BorderStyle.SINGLE, size: 1 },
                        right: { style: BorderStyle.SINGLE, size: 1 },
                      },
                    })
                  );
                });
                rows.push(new TableRow({ children: cells as never }));
              });
              if (rows.length > 0) {
                result.push(new Table({ rows: rows as never }));
              }
              break;
            }
            case "br": {
              result.push(new Paragraph({ text: "" }));
              break;
            }
            case "div":
            case "section":
            case "article": {
              node.childNodes.forEach((child) => {
                result.push(...processNode(child));
              });
              break;
            }
            default: {
              node.childNodes.forEach((child) => {
                result.push(...processNode(child));
              });
            }
          }
        }

        return result;
      };

      tempDiv.childNodes.forEach((node) => {
        children.push(...processNode(node));
      });

      const doc = new Document({
        sections: [
          {
            properties: {},
            children: children.length > 0 ? (children as never) : [new Paragraph("Message")],
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = generateFilename(rawText, "docx");

      try {
        document.body.appendChild(link);
        link.click();
      } finally {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }

      toast.success("Download started");
    } catch (err) {
      console.error("Failed to download DOCX:", err);
      toast.error("Failed to download file");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownloadDocx}
      disabled={isLoading}
      className="px-2 py-1 rounded cursor-pointer hover:bg-gray-200 disabled:opacity-50"
      title="Download as DOCX"
      aria-label="Download message as DOCX"
    >
      {isLoading ? (
        <Loader2 size={18} className="w-4 h-4 animate-spin" />
      ) : (
        <Download size={18} className="w-4 h-4" />
      )}
    </button>
  );
}
