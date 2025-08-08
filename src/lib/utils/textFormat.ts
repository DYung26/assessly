import MarkdownIt from 'markdown-it';
import markdownItTaskLists from 'markdown-it-task-lists';
import markdownItTable from 'markdown-it-multimd-table';
// import hljs from "highlight.js";

const md = new MarkdownIt({
  html: true,        // allow raw HTML in Markdown
  linkify: true,     // autoconvert URLs to links
  typographer: true, // smart quotes, dashes, etc.
  /*highlight: function (str: string, lang: string) { // TODO: review this.
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang, ignoreIllegals: true }).value;
      } catch (__) {}
    }

    return ''; // use external default escaping
  },*/
})
  .use(markdownItTaskLists)
  .use(markdownItTable);

export function formatStreamingContent(raw: string): string {
  if (!raw) return "";

  return md.render(raw);
}

export function manualFormatStreamingContent(raw: string): string {
  if (!raw) return "";

  const withSpacing = raw.replace(/([a-z])([A-Z])/g, "$1 $2") // space before capital
                         .replace(/([a-zA-Z])(\d)/g, "$1 $2") // space before digits
                         .replace(/(\d)([a-zA-Z])/g, "$1 $2"); // space after digits

  // Replace markdown-like formatting
  const formatted = withSpacing
    .replace(/^###\s?(.*)$/g, "<h3>$1</h3>") // ### 
    .replace(/^##\s?(.*)$/g, "<h2>$1</h2>") // ## Header
    .replace(/^#\s?(.*)$/g, "<h1>$1</h1>") // # Header
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // bold (**text**)
    .replace(/^\s*-\s+(.*)$/gm, "<li>$1</li>") // bullet items
    .replace(/(<li>.*?<\/li>)+/gms, (match) => `<ul>${match}</ul>`) // wrap bullets
    .replace(/^\s*-{3,}\s*$/gm, '\n<hr class="border-t border-gray-300" />') // section lines
    .replace(/\n/g, "<br>"); // newlines (run last!)

  return formatted;
}
